import { NodeKernel } from '@peercompute';
import { readPeercomputeBotParams } from '../../../shared/peercomputeBots.js';
import { buildCubeChatRtcConfiguration } from './rtcConfig.js';

const NO_FATAL_TRANSPORT_MANAGER = { faultTolerance: 'no-fatal' };

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

  const getRelayConfigUrlOverride = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('relayConfigUrl') || params.get('relayConfig') || '';
    } catch (_) {
      return '';
    }
  };

  const loadRelayConfigSourceUrl = async () => {
    const source =
      (await tryFetch('./relay-config-source.json')) ||
      (await tryFetch('./.relay-config-source.json')) ||
      (await tryFetch('/relay-config-source.json')) ||
      (await tryFetch('/.relay-config-source.json'));
    const url = typeof source?.relayConfigUrl === 'string' ? source.relayConfigUrl.trim() : '';
    return url || '';
  };

  const overrideUrl = getRelayConfigUrlOverride();
  const relayConfigUrl = overrideUrl || await loadRelayConfigSourceUrl();
  if (relayConfigUrl) {
    const remote = await tryFetch(relayConfigUrl);
    if (remote) return remote;
  }

  return (
    (await tryFetch('./relay-config.json')) ||
    (await tryFetch('./.relay-config.json')) ||
    (await tryFetch('/relay-config.json')) ||
    (await tryFetch('/.relay-config.json')) ||
    { bootstrapPeers: [] }
  );
};

const normalizeBootstrapPeers = (peers) => {
  if (!Array.isArray(peers)) return [];
  const protocol = typeof window !== 'undefined' ? window.location?.protocol : '';
  const preferSecure = protocol === 'https:';
  return peers.filter(Boolean).map((addr) => {
    if (typeof addr !== 'string') return addr;
    if (preferSecure) {
      return addr.replace('/ws/', '/wss/');
    }
    return addr.replace('/wss/', '/ws/');
  });
};

const normalizeWebRTCConfig = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.webrtc && typeof cfg.webrtc === 'object' ? cfg.webrtc : {};
  const iceServers = raw.iceServers ?? cfg.iceServers ?? cfg.webrtcIceServers;
  const rtcConfiguration = raw.rtcConfiguration ?? cfg.rtcConfiguration;
  const preferDirect = raw.preferDirect ?? cfg.preferDirect;
  const dropRelayOnDirect = raw.dropRelayOnDirect ?? cfg.dropRelayOnDirect;
  const next = { ...raw };
  if (iceServers !== undefined && next.iceServers === undefined) next.iceServers = iceServers;
  if (rtcConfiguration !== undefined && next.rtcConfiguration === undefined) next.rtcConfiguration = rtcConfiguration;
  if (preferDirect !== undefined && next.preferDirect === undefined) next.preferDirect = preferDirect;
  if (dropRelayOnDirect !== undefined && next.dropRelayOnDirect === undefined) next.dropRelayOnDirect = dropRelayOnDirect;
  return Object.keys(next).length ? next : null;
};

const normalizePubsubType = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.pubsubType ?? cfg.pubsub;
  if (!raw) return null;
  return String(raw).trim().toLowerCase();
};

const normalizeGossipsubConfig = (cfg) => {
  if (!cfg || typeof cfg !== 'object') return null;
  const raw = cfg.gossipsub;
  if (!raw || typeof raw !== 'object') return null;
  return { ...raw };
};

export class P2PNetwork {
  constructor() {
    this.node = null;
    this.networkManager = null;
    this.stateManager = null;
    this.peerId = null;
    this.bootstrapPeers = [];
    this.webrtc = null;
    this.pubsubType = null;
    this.gossipsub = null;
    this.roomId = 'global';
    this.localMediaReady = false;
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
    this.makingOfferPeers = new Set();
    this.localPlayer = null;
    this.snapshotProviderId = null;
    this.peerCleanupInterval = null;
  }

  _isPolitePeer(peerId) {
    if (!this.peerId || !peerId) return false;
    return String(this.peerId).localeCompare(String(peerId)) > 0;
  }

  _isStableStateError(error) {
    const message = String(error?.message || error || '').toLowerCase();
    return (
      message.includes('called in wrong state: stable')
      || message.includes('cannot create an answer in a state other than have-remote-offer')
      || message.includes('failed to set remote answer sdp: called in wrong state')
    );
  }

  _handleSignalError(context, error) {
    if (this._isStableStateError(error)) return;
    console.error(`Error handling ${context}:`, error);
  }

  async init({ roomId = 'global' } = {}) {
    if (!this.localMediaReady) {
      await this._initLocalMedia();
      this.localMediaReady = true;
    }
    await this._startNode(roomId);
    return this.localPlayer;
  }

  async switchRoom({ roomId = 'global' } = {}) {
    const nextRoomId = roomId || 'global';
    if (nextRoomId === this.roomId) return this.localPlayer;
    await this._shutdownNode();
    this._resetPeerState();
    await this._startNode(nextRoomId);
    return this.localPlayer;
  }

  async _startNode(roomId) {
    const cfg = await loadRelayConfig();
    this.bootstrapPeers = normalizeBootstrapPeers(cfg.bootstrapPeers || []);
    this.webrtc = normalizeWebRTCConfig(cfg);
    this.pubsubType = normalizePubsubType(cfg);
    this.gossipsub = normalizeGossipsubConfig(cfg);
    this.roomId = roomId || 'global';

    this.node = new NodeKernel({
      bootstrapPeers: this.bootstrapPeers,
      enablePersistence: false,
      gameId: 'cubechat',
      roomId: this.roomId,
      maxConnections: 10,
      transportManager: NO_FATAL_TRANSPORT_MANAGER,
      ...(this.pubsubType ? { pubsubType: this.pubsubType } : {}),
      ...(this.gossipsub ? { gossipsub: this.gossipsub } : {}),
      ...(this.webrtc ? { webrtc: this.webrtc } : {})
    });
    await this.node.initialize();
    await this.node.start();

    this.networkManager = this.node.getNetworkManager();
    this.stateManager = this.node.getStateManager();
    this.peerId = this.node.getStatus().network.peerId;

    const prev = this.localPlayer || {};
    this.localPlayer = {
      id: this.peerId,
      position: prev.position || this.generateRandomPosition(),
      color: prev.color || this.getDeterministicColor(this.peerId),
      velocity: prev.velocity || { x: 0, y: 0, z: 0 },
      rotation: prev.rotation || 0,
      hasMedia: !!this.localStream,
      screenSharing: !!prev.screenSharing,
      billboardData: prev.billboardData || null,
      name: prev.name || null
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
  }

  async _initLocalMedia() {
    const botLaunch = readPeercomputeBotParams();
    if (botLaunch.enabled && !botLaunch.mediaEnabled) {
      this.localStream = null;
      return;
    }
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
        this.handleOffer(from, payload.offer).catch((error) => {
          this._handleSignalError('offer', error);
        });
        return;
      }

      if (payload.type === 'webrtc-answer') {
        this.handleAnswer(from, payload.answer).catch((error) => {
          this._handleSignalError('answer', error);
        });
        return;
      }

      if (payload.type === 'webrtc-ice') {
        this.handleIceCandidate(from, payload.candidate).catch((error) => {
          this._handleSignalError('ICE candidate', error);
        });
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

  _stopPeerCleanup() {
    if (this.peerCleanupInterval) {
      clearInterval(this.peerCleanupInterval);
      this.peerCleanupInterval = null;
    }
  }

  _resetPeerState() {
    this.peers.clear();
    this.remoteStreams.clear();
    this.remoteScreenStreams.clear();
    this.remoteCameraTracks.clear();
    this.remoteScreenTracks.clear();
    this.remoteAudioTracks.clear();
    this.remoteTrackIds.clear();
    this.remoteScreenTrackIds.clear();
    this.pendingIceCandidates.clear();
    this.dataChannels.clear();
    for (const peerId of Array.from(this.peerConnections.keys())) {
      this.closePeerConnection(peerId);
    }
    this.peerConnections.clear();
  }

  async _shutdownNode() {
    if (this.networkManager) {
      this.networkManager.queueEvent?.({ type: 'player_leave' }, { reliable: true });
    }
    this._stopPeerCleanup();
    if (this.node) {
      await this.node.stop();
    }
    this.node = null;
    this.networkManager = null;
    this.stateManager = null;
    this.peerId = null;
    this.snapshotProviderId = null;
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
          this.makingOfferPeers.add(peerId);
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
        } finally {
          this.makingOfferPeers.delete(peerId);
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
    this._shutdownNode();
    if (this.peerConnections.size) {
      Array.from(this.peerConnections.keys()).forEach((peerId) => this.closePeerConnection(peerId));
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
    }
  }

  async createPeerConnection(peerId) {
    if (this.peerConnections.has(peerId)) {
      return;
    }

    const pc = new RTCPeerConnection(buildCubeChatRtcConfiguration(this.webrtc));
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

    try {
      this.makingOfferPeers.add(peerId);
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this._sendSignal(peerId, {
        type: 'webrtc-offer',
        offer
      }, { reliable: true });
    } catch (error) {
      this._handleSignalError('initial offer', error);
    } finally {
      this.makingOfferPeers.delete(peerId);
    }
  }

  async handleOffer(peerId, offer) {
    let pc = this.peerConnections.get(peerId);

    if (pc) {
      try {
        const offerCollision = offer?.type === 'offer'
          && (this.makingOfferPeers.has(peerId) || pc.signalingState !== 'stable');
        if (offerCollision && !this._isPolitePeer(peerId)) {
          return;
        }
        if (offerCollision && pc.signalingState === 'have-local-offer') {
          await pc.setLocalDescription({ type: 'rollback' });
        }
        await pc.setRemoteDescription(offer);
        if (pc.signalingState !== 'have-remote-offer') {
          return;
        }
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this._sendSignal(peerId, {
          type: 'webrtc-answer',
          answer
        }, { reliable: true });
      } catch (error) {
        this._handleSignalError('renegotiation offer', error);
      }
      return;
    }

    pc = new RTCPeerConnection(buildCubeChatRtcConfiguration(this.webrtc));
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

    try {
      await pc.setRemoteDescription(offer);

      if (this.pendingIceCandidates.has(peerId)) {
        const candidates = this.pendingIceCandidates.get(peerId);
        for (const candidate of candidates) {
          try {
            await pc.addIceCandidate(candidate);
          } catch (error) {
            this._handleSignalError('queued ICE candidate', error);
          }
        }
        this.pendingIceCandidates.delete(peerId);
      }

      if (pc.signalingState !== 'have-remote-offer') {
        return;
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this._sendSignal(peerId, {
        type: 'webrtc-answer',
        answer
      }, { reliable: true });
    } catch (error) {
      this._handleSignalError('offer', error);
    }
  }

  async handleAnswer(peerId, answer) {
    const pc = this.peerConnections.get(peerId);
    if (pc && pc.signalingState === 'have-local-offer') {
      try {
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
      } catch (error) {
        this._handleSignalError('answer', error);
      }
    }
  }

  async handleIceCandidate(peerId, candidate) {
    const pc = this.peerConnections.get(peerId);
    if (!pc) {
      if (!this.pendingIceCandidates.has(peerId)) {
        this.pendingIceCandidates.set(peerId, []);
      }
      this.pendingIceCandidates.get(peerId).push(candidate);
      return;
    }

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
      this._handleSignalError('ICE candidate', error);
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
    this.pendingIceCandidates.delete(peerId);
    this.makingOfferPeers.delete(peerId);

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
