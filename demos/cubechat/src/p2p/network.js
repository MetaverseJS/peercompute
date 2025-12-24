import { NodeKernel } from '@peercompute';

const DEFAULT_PROFILE = {
  snapshotHz: 20,
  keepaliveMs: 1500,
  snapshotsRequireAuthority: false,
  reliableEventTypes: ['webrtc-offer', 'webrtc-answer', 'webrtc-ice']
};

const PEER_STALE_MS = 15000;
const PEER_CLEANUP_MS = 5000;

const loadRelayConfig = async () => {
  const tryFetch = async (path) => {
    try {
      const res = await fetch(path, { cache: 'no-store' });
      if (res.ok) return await res.json();
    } catch (_) {
      // ignore
    }
    return null;
  };
  return (
    (await tryFetch('/relay-config.json')) ||
    (await tryFetch('./relay-config.json')) ||
    (await tryFetch('/.relay-config.json')) ||
    (await tryFetch('./.relay-config.json')) ||
    { bootstrapPeers: [] }
  );
};

const normalizeBootstrapPeers = (peers) => {
  if (!Array.isArray(peers)) return [];
  return peers.filter(Boolean);
};

export class P2PNetwork {
  constructor() {
    this.node = null;
    this.networkManager = null;
    this.stateManager = null;
    this.peerId = null;
    this.peers = new Map();
    this.messageHandlers = [];
    this.localStream = null;
    this.screenStream = null;
    this.remoteStreams = new Map();
    this.remoteScreenStreams = new Map();
    this.remoteCameraTracks = new Map();
    this.remoteScreenTracks = new Map();
    this.remoteAudioTracks = new Map();
    this.remoteTrackIds = new Map();
    this.remoteScreenTrackIds = new Map();
    this.pendingIceCandidates = new Map();
    this.dataChannels = new Map();
    this.peerConnections = new Map();
    this.localPlayer = null;
    this.snapshotProviderId = null;
    this.peerCleanupInterval = null;
  }

  async init() {
    await this._initLocalMedia();
    const cfg = await loadRelayConfig();
    const bootstrapPeers = normalizeBootstrapPeers(cfg.bootstrapPeers || []);

    this.node = new NodeKernel({
      bootstrapPeers,
      enablePersistence: false,
      gameId: 'cubechat',
      roomId: 'global'
    });
    await this.node.initialize();
    await this.node.start();

    this.networkManager = this.node.getNetworkManager();
    this.stateManager = this.node.getStateManager();
    this.peerId = this.node.getStatus().network.peerId;

    this.localPlayer = {
      id: this.peerId,
      position: this.generateRandomPosition(),
      color: this.getDeterministicColor(this.peerId),
      velocity: { x: 0, y: 0, z: 0 },
      rotation: 0,
      hasMedia: !!this.localStream,
      screenSharing: false,
      billboardData: null,
      name: null
    };

    this.networkManager.configureScheduler(DEFAULT_PROFILE);
    this.snapshotProviderId = this.networkManager.registerStateProvider(
      () => this._buildSnapshot(),
      { id: 'player' }
    );

    this.networkManager.addSnapshotHandler((peerId, message) => {
      this._handleSnapshot(peerId, message);
    });

    this.networkManager.addEventHandler((peerId, message) => {
      this._handleEvent(peerId, message);
    });

    this._startPeerCleanup();

    return this.localPlayer;
  }

  async _initLocalMedia() {
    try {
      this.localStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240 },
        audio: true
      });
      console.log('Got local media stream');
    } catch (error) {
      console.warn('Failed to get media:', error);
    }
  }

  _buildSnapshot() {
    return { ...this.localPlayer };
  }

  _handleSnapshot(peerId, message) {
    const from = message?.header?.peerId || peerId;
    if (!from || from === this.peerId) return;
    const entries = Array.isArray(message?.payload) ? message.payload : [];
    entries.forEach((entry) => {
      if (!entry || entry.id !== 'player' || !entry.data) return;
      const data = entry.data;
      const wasNew = !this.peers.has(from);
      this.peers.set(from, { ...data, id: from, lastSeen: Date.now() });
      this.messageHandlers.forEach((handler) => handler({
        type: 'player_update',
        peerId: from,
        data
      }));

      if (this.localStream && data.hasMedia && !this.peerConnections?.has(from)) {
        if (this.peerId > from) {
          this.createPeerConnection(from);
        }
      }

      if (wasNew) {
        console.log('New player joined:', from);
      }
    });
  }

  _handleEvent(peerId, message) {
    const from = message?.header?.peerId || peerId;
    if (!from || from === this.peerId) return;
    const entries = Array.isArray(message?.payload) ? message.payload : [];
    entries.forEach((entry) => {
      const payload = entry?.payload;
      if (!payload) return;
      if (payload.target && payload.target !== this.peerId) return;

      if (payload.type === 'player_leave') {
        this._dropPeer(from);
        return;
      }

      if (payload.type === 'webrtc-offer') {
        this.handleOffer(from, payload.offer);
        return;
      }

      if (payload.type === 'webrtc-answer') {
        this.handleAnswer(from, payload.answer);
        return;
      }

      if (payload.type === 'webrtc-ice') {
        this.handleIceCandidate(from, payload.candidate);
        return;
      }

      if (payload.type === 'screen_stream_added') {
        this.messageHandlers.forEach((handler) => handler({
          type: 'screen_stream_added',
          peerId: from
        }));
      }

      if (payload.type === 'screen_track_metadata' && Array.isArray(payload.trackIds)) {
        const existing = this.remoteScreenTrackIds.get(from) || new Set();
        const next = new Set(payload.trackIds);
        this.remoteScreenTrackIds.set(from, next);
        if (!sameSet(existing, next)) {
          this.reclassifyTracksAsScreen(from, payload.trackIds);
        }
      }
    });
  }

  _startPeerCleanup() {
    if (this.peerCleanupInterval) return;
    this.peerCleanupInterval = setInterval(() => {
      const cutoff = Date.now() - PEER_STALE_MS;
      for (const [peerId, data] of this.peers.entries()) {
        if ((data?.lastSeen || 0) < cutoff) {
          this._dropPeer(peerId);
        }
      }
    }, PEER_CLEANUP_MS);
  }

  _dropPeer(peerId) {
    if (!this.peers.has(peerId)) return;
    this.peers.delete(peerId);
    this.closePeerConnection(peerId);
    this.remoteStreams.delete(peerId);
    this.remoteScreenStreams.delete(peerId);
    this.messageHandlers.forEach((handler) => handler({
      type: 'player_leave',
      peerId
    }));
  }

  onMessage(handler) {
    this.messageHandlers.push(handler);
  }

  getPeers() {
    return Array.from(this.peers.values()).map((data) => ({
      ...data,
      id: data.id || data.peerId
    }));
  }

  updateLocalPlayer(data) {
    if (!this.localPlayer) return;
    this.localPlayer = { ...this.localPlayer, ...data };
    this.networkManager?.markStateDirty?.();
  }

  broadcastPlayerState() {
    this.networkManager?.markStateDirty?.();
  }

  getLocalStream() {
    return this.localStream;
  }

  getRemoteStream(peerId) {
    return this.remoteStreams.get(peerId) || null;
  }

  getRemoteScreenStream(peerId) {
    return this.remoteScreenStreams.get(peerId) || null;
  }

  async startScreenSharing(stream, billboardData) {
    if (stream) {
      this.screenStream = stream;
    }
    this.localPlayer.screenSharing = true;
    this.localPlayer.billboardData = billboardData || null;
    this.networkManager?.markStateDirty?.();

    if (this.screenStream) {
      const screenTrackIds = this.screenStream.getTracks().map((track) => track.id);
      for (const [peerId, pc] of this.peerConnections.entries()) {
        const addedSenders = [];
        this.screenStream.getTracks().forEach((track) => {
          const sender = pc.addTrack(track, this.screenStream);
          addedSenders.push(sender);
        });

        try {
          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);
          this._sendSignal(peerId, {
            type: 'webrtc-offer',
            offer
          }, { reliable: true });

          const actualScreenTrackIds = addedSenders
            .filter((sender) => sender.track && sender.track.kind === 'video')
            .map((sender) => sender.track.id);

          const channel = this.dataChannels.get(peerId);
          if (channel && channel.readyState === 'open') {
            channel.send(JSON.stringify({
              type: 'screen_track_metadata',
              trackIds: actualScreenTrackIds
            }));
          } else {
            this._sendSignal(peerId, {
              type: 'screen_track_metadata',
              trackIds: actualScreenTrackIds
            }, { reliable: true });
          }
        } catch (error) {
          console.error('Error renegotiating connection for screen share:', error);
        }
      }

      this.networkManager?.queueEvent?.({
        type: 'screen_stream_added'
      }, { reliable: false });
    }
  }

  stopScreenSharing() {
    this.screenStream = null;
    this.localPlayer.screenSharing = false;
    this.localPlayer.billboardData = null;
    this.networkManager?.markStateDirty?.();

    this.peerConnections.forEach((pc) => {
      const senders = pc.getSenders();
      senders.forEach((sender) => {
        if (!sender.track) return;
        const isWebcamTrack = this.localStream
          ? this.localStream.getTracks().some((track) => track.id === sender.track.id)
          : false;
        if (!isWebcamTrack) {
          pc.removeTrack(sender);
        }
      });
    });
  }

  stop() {
    if (this.peerCleanupInterval) {
      clearInterval(this.peerCleanupInterval);
      this.peerCleanupInterval = null;
    }
    if (this.networkManager) {
      this.networkManager.queueEvent?.({ type: 'player_leave' }, { reliable: true });
    }
    if (this.peerConnections.size) {
      Array.from(this.peerConnections.keys()).forEach((peerId) => this.closePeerConnection(peerId));
    }
    if (this.node) {
      this.node.stop();
      this.node = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
  }

  async createPeerConnection(peerId) {
    if (this.peerConnections.has(peerId)) {
      return;
    }

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    const pc = new RTCPeerConnection(config);
    this.peerConnections.set(peerId, pc);

    const dataChannel = pc.createDataChannel('playerState');
    this.setupDataChannel(peerId, dataChannel);

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream);
      });
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.screenStream);
      });
    }

    pc.ondatachannel = (event) => {
      this.setupDataChannel(peerId, event.channel);
    };

    pc.ontrack = (event) => {
      this._handleIncomingTrack(peerId, event);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this._sendSignal(peerId, {
          type: 'webrtc-ice',
          candidate: event.candidate
        }, { reliable: true });
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    this._sendSignal(peerId, {
      type: 'webrtc-offer',
      offer
    }, { reliable: true });
  }

  async handleOffer(peerId, offer) {
    let pc = this.peerConnections.get(peerId);

    if (pc) {
      try {
        await pc.setRemoteDescription(offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this._sendSignal(peerId, {
          type: 'webrtc-answer',
          answer
        }, { reliable: true });
      } catch (error) {
        console.error('Error handling renegotiation offer:', error);
      }
      return;
    }

    const config = {
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    };

    pc = new RTCPeerConnection(config);
    this.peerConnections.set(peerId, pc);

    pc.ondatachannel = (event) => {
      this.setupDataChannel(peerId, event.channel);
    };

    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.localStream);
      });
    }

    if (this.screenStream) {
      this.screenStream.getTracks().forEach((track) => {
        pc.addTrack(track, this.screenStream);
      });
    }

    pc.ontrack = (event) => {
      this._handleIncomingTrack(peerId, event);
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this._sendSignal(peerId, {
          type: 'webrtc-ice',
          candidate: event.candidate
        }, { reliable: true });
      }
    };

    await pc.setRemoteDescription(offer);

    if (this.pendingIceCandidates.has(peerId)) {
      const candidates = this.pendingIceCandidates.get(peerId);
      for (const candidate of candidates) {
        try {
          await pc.addIceCandidate(candidate);
        } catch (error) {
          console.error('Error adding queued ICE candidate:', error);
        }
      }
      this.pendingIceCandidates.delete(peerId);
    }

    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    this._sendSignal(peerId, {
      type: 'webrtc-answer',
      answer
    }, { reliable: true });
  }

  async handleAnswer(peerId, answer) {
    const pc = this.peerConnections.get(peerId);
    if (pc && pc.signalingState === 'have-local-offer') {
      await pc.setRemoteDescription(answer);

      if (this.pendingIceCandidates.has(peerId)) {
        const candidates = this.pendingIceCandidates.get(peerId);
        for (const candidate of candidates) {
          try {
            await pc.addIceCandidate(candidate);
          } catch (error) {
            console.error('Error adding ICE candidate:', error);
          }
        }
        this.pendingIceCandidates.delete(peerId);
      }
    }
  }

  async handleIceCandidate(peerId, candidate) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) return;

    if (!pc.remoteDescription) {
      if (!this.pendingIceCandidates.has(peerId)) {
        this.pendingIceCandidates.set(peerId, []);
      }
      this.pendingIceCandidates.get(peerId).push(candidate);
      return;
    }

    try {
      await pc.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  }

  setupDataChannel(peerId, channel) {
    this.dataChannels.set(peerId, channel);

    channel.onopen = () => {
      if (this.screenStream) {
        const screenTrackIds = this.screenStream.getTracks().map((track) => track.id);
        channel.send(JSON.stringify({
          type: 'screen_track_metadata',
          trackIds: screenTrackIds
        }));
      }
    };

    channel.onclose = () => {
      this.dataChannels.delete(peerId);
    };

    channel.onerror = (error) => {
      console.error('Data channel error with', peerId, error);
    };

    channel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'player_state') {
          this.peers.set(peerId, message.data);
          this.messageHandlers.forEach((handler) => handler({
            type: 'player_update',
            peerId,
            data: message.data
          }));
        } else if (message.type === 'screen_track_metadata') {
          const trackIds = Array.isArray(message.trackIds) ? message.trackIds : [];
          this.remoteScreenTrackIds.set(peerId, new Set(trackIds));
          this.reclassifyTracksAsScreen(peerId, trackIds);
        }
      } catch (error) {
        console.error('Error parsing data channel message:', error);
      }
    };
  }

  reclassifyTracksAsScreen(peerId, screenTrackIds) {
    const cameraTracks = this.remoteCameraTracks.get(peerId) || [];
    const tracksToMove = cameraTracks.filter((track) => screenTrackIds.includes(track.id));

    if (tracksToMove.length > 0) {
      const remainingCameraTracks = cameraTracks.filter((track) => !screenTrackIds.includes(track.id));
      if (remainingCameraTracks.length > 0) {
        this.remoteCameraTracks.set(peerId, remainingCameraTracks);
      } else {
        this.remoteCameraTracks.delete(peerId);
      }

      if (!this.remoteScreenTracks.has(peerId)) {
        this.remoteScreenTracks.set(peerId, []);
      }
      this.remoteScreenTracks.get(peerId).push(...tracksToMove);

      this.rebuildPeerStreams(peerId);
    }
  }

  rebuildPeerStreams(peerId) {
    const cameraTracks = this.remoteCameraTracks.get(peerId) || [];
    const audioTracks = this.remoteAudioTracks.get(peerId) || [];

    if (cameraTracks.length > 0 || audioTracks.length > 0) {
      const allCameraTracks = [...cameraTracks, ...audioTracks];
      const cameraStream = new MediaStream(allCameraTracks);

      const existingStream = this.remoteStreams.get(peerId);
      const streamsMatch = existingStream &&
        existingStream.getTracks().length === allCameraTracks.length &&
        existingStream.getTracks().every((track) => allCameraTracks.find((ct) => ct.id === track.id));

      if (!streamsMatch) {
        this.remoteStreams.set(peerId, cameraStream);
        this.messageHandlers.forEach((handler) => handler({
          type: 'stream_added',
          peerId,
          stream: cameraStream
        }));
      }
    }

    const screenTracks = this.remoteScreenTracks.get(peerId) || [];
    if (screenTracks.length > 0) {
      const screenStream = new MediaStream(screenTracks);
      const existingScreenStream = this.remoteScreenStreams.get(peerId);
      const screensMatch = existingScreenStream &&
        existingScreenStream.getTracks().length === screenTracks.length &&
        existingScreenStream.getTracks().every((track) => screenTracks.find((st) => st.id === track.id));

      if (!screensMatch) {
        this.remoteScreenStreams.set(peerId, screenStream);
        this.messageHandlers.forEach((handler) => handler({
          type: 'screen_stream_added',
          peerId,
          stream: screenStream
        }));
      }
    }
  }

  closePeerConnection(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }

    const channel = this.dataChannels.get(peerId);
    if (channel) {
      channel.close();
      this.dataChannels.delete(peerId);
    }

    this.remoteStreams.delete(peerId);
    this.remoteScreenStreams.delete(peerId);
    this.remoteCameraTracks.delete(peerId);
    this.remoteScreenTracks.delete(peerId);
    this.remoteAudioTracks.delete(peerId);
    this.remoteTrackIds.delete(peerId);
    this.remoteScreenTrackIds.delete(peerId);

    this.messageHandlers.forEach((handler) => handler({
      type: 'stream_removed',
      peerId
    }));
  }

  _handleIncomingTrack(peerId, event) {
    const track = event.track;

    if (!this.remoteTrackIds.has(peerId)) {
      this.remoteTrackIds.set(peerId, new Set());
    }

    const seenTracks = this.remoteTrackIds.get(peerId);
    if (seenTracks.has(track.id)) return;
    seenTracks.add(track.id);

    const settings = track.getSettings ? track.getSettings() : {};
    const label = (track.label || '').toLowerCase();

    let trackType = 'unknown';
    if (track.kind === 'audio') {
      trackType = 'audio';
    } else if (track.kind === 'video') {
      const screenTrackIds = this.remoteScreenTrackIds?.get(peerId);
      const isInMetadata = screenTrackIds?.has(track.id);
      const hasDisplaySurface = settings.displaySurface !== undefined;
      const hasScreenLabel = label.includes('screen') || label.includes('monitor') || label.includes('window');

      if (isInMetadata || hasDisplaySurface || hasScreenLabel) {
        trackType = 'screen';
      } else {
        trackType = 'camera';
      }
    }

    if (trackType === 'audio') {
      if (!this.remoteAudioTracks.has(peerId)) {
        this.remoteAudioTracks.set(peerId, []);
      }
      this.remoteAudioTracks.get(peerId).push(track);
    } else if (trackType === 'camera') {
      if (!this.remoteCameraTracks.has(peerId)) {
        this.remoteCameraTracks.set(peerId, []);
      }
      this.remoteCameraTracks.get(peerId).push(track);
    } else if (trackType === 'screen') {
      if (!this.remoteScreenTracks.has(peerId)) {
        this.remoteScreenTracks.set(peerId, []);
      }
      this.remoteScreenTracks.get(peerId).push(track);
    }

    this.rebuildPeerStreams(peerId);
  }

  _sendSignal(target, payload, options = {}) {
    this.networkManager?.queueEvent?.({
      ...payload,
      target
    }, options);
  }

  generatePeerId() {
    return this.peerId || `peer-${Math.random().toString(36).slice(2, 10)}`;
  }

  generateRandomPosition() {
    return {
      x: (Math.random() - 0.5) * 40,
      y: 5,
      z: (Math.random() - 0.5) * 40
    };
  }

  getDeterministicColor(peerId) {
    let hash = 0;
    for (let i = 0; i < peerId.length; i++) {
      hash = peerId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = (hash & 0x00FFFFFF)
      .toString(16)
      .toUpperCase();
    return '#' + '00000'.substring(0, 6 - color.length) + color;
  }
}

function sameSet(a, b) {
  if (a.size !== b.size) return false;
  for (const value of a) {
    if (!b.has(value)) return false;
  }
  return true;
}
