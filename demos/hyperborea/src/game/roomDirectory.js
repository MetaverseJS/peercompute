const DIRECTORY_ROOM_ID = '__rooms__';
const DIRECTORY_NAMESPACE = 'rooms';
const ROOM_ENTRY_PREFIX = 'room-';
const ROOM_HEARTBEAT_MS = 10000;
const ROOM_TTL_MS = 45000;
const NO_FATAL_TRANSPORT_MANAGER = { faultTolerance: 'no-fatal' };

const slugify = (value) => {
  const slug = String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'global';
};

const hashSecret = (value) => {
  const str = String(value || '');
  let hash = 2166136261;
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
};

export const buildRoomId = ({ name, visibility, password }) => {
  const slug = slugify(name);
  if (visibility === 'private') {
    return `priv-${slug}-${hashSecret(password)}`;
  }
  return slug;
};

export const normalizeRoomName = (value) => slugify(value);

export const buildRoomDirectoryTopic = (gameId) => `pc.${gameId || 'default'}.${DIRECTORY_ROOM_ID}.announcements`;

export class RoomDirectory {
  constructor({ gameId, bootstrapPeers, webrtc, pubsubType, gossipsub, networkManager = null }) {
    this.gameId = gameId;
    this.bootstrapPeers = bootstrapPeers || [];
    this.webrtc = webrtc || null;
    this.pubsubType = pubsubType || null;
    this.gossipsub = gossipsub || null;
    this.networkManager = networkManager || null;
    this.topic = buildRoomDirectoryTopic(gameId);
    this.unsubscribeTopic = null;
    this.node = null;
    this.stateManager = null;
    this.rooms = new Map();
    this.namespaceObservers = new Set();
    this.announceTimer = null;
    this.quickAnnounceTimer = null;
    this.pruneTimer = null;
    this.lastSyncReplyAt = 0;
    this.currentRoom = null;
  }

  _notifyObservers(key, value) {
    for (const observer of this.namespaceObservers) {
      try {
        observer(value, key);
      } catch (_) {}
    }
  }

  _createSharedStateManager() {
    return {
      readScoped: (namespace, key) => {
        if (namespace !== DIRECTORY_NAMESPACE) return undefined;
        return this.rooms.get(key);
      },
      writeScoped: (namespace, key, value) => {
        if (namespace !== DIRECTORY_NAMESPACE || typeof key !== 'string' || !key) return;
        if (!value) {
          this.rooms.delete(key);
        } else {
          this.rooms.set(key, value);
        }
        this._notifyObservers(key, value ?? null);
        if (this.networkManager?.publishTopic) {
          this.networkManager.publishTopic(this.topic, {
            type: 'room-announce',
            key,
            room: value ?? null
          }).catch(() => {});
        }
      },
      observeNamespace: (namespace, cb) => {
        if (namespace !== DIRECTORY_NAMESPACE || typeof cb !== 'function') {
          return () => {};
        }
        this.namespaceObservers.add(cb);
        return () => this.namespaceObservers.delete(cb);
      }
    };
  }

  _handleAnnouncement(_from, payload) {
    if (!payload || typeof payload !== 'object') return;
    if (payload.type === 'room-sync-request') {
      const now = Date.now();
      if (this.currentRoom && now - this.lastSyncReplyAt >= 1000) {
        this.lastSyncReplyAt = now;
        this.writeRoomEntry();
      }
      return;
    }
    if (payload.type !== 'room-announce') return;
    const key = typeof payload.key === 'string' ? payload.key : null;
    if (!key || !key.startsWith(ROOM_ENTRY_PREFIX)) return;
    if (!payload.room) {
      this.rooms.delete(key);
      this._notifyObservers(key, null);
      return;
    }
    this.rooms.set(key, payload.room);
    this._notifyObservers(key, payload.room);
  }

  attachNetworkManager(networkManager) {
    if (this.unsubscribeTopic) {
      try { this.unsubscribeTopic(); } catch (_) {}
      this.unsubscribeTopic = null;
    }
    this.networkManager = networkManager || null;
    if (this.networkManager?.subscribeTopic) {
      this.unsubscribeTopic = this.networkManager.subscribeTopic(
        this.topic,
        (from, payload) => this._handleAnnouncement(from, payload)
      );
      if (!this.node) {
        this.stateManager = this._createSharedStateManager();
      }
      if (this.networkManager?.publishTopic) {
        this.networkManager.publishTopic(this.topic, {
          type: 'room-sync-request',
          ts: Date.now()
        }).catch(() => {});
      }
    }
  }

  async init() {
    if (this.networkManager?.subscribeTopic) {
      if (!this.unsubscribeTopic) {
        this.attachNetworkManager(this.networkManager);
      }
      if (!this.pruneTimer) {
        this.pruneTimer = setInterval(() => this.pruneStaleRooms(), ROOM_HEARTBEAT_MS);
      }
      return;
    }
    if (this.node) return;
    const { NodeKernel } = await import('@peercompute/core');
    this.node = new NodeKernel({
      bootstrapPeers: this.bootstrapPeers,
      enablePersistence: false,
      gameId: this.gameId,
      roomId: DIRECTORY_ROOM_ID,
      transportManager: NO_FATAL_TRANSPORT_MANAGER,
      ...(this.pubsubType ? { pubsubType: this.pubsubType } : {}),
      ...(this.gossipsub ? { gossipsub: this.gossipsub } : {}),
      ...(this.webrtc ? { webrtc: this.webrtc } : {})
    });
    await this.node.initialize();
    await this.node.start();
    this.stateManager = this.node.getStateManager();
    this.stateManager.observeNamespace(DIRECTORY_NAMESPACE, (value, key) => {
      if (!key || !key.startsWith(ROOM_ENTRY_PREFIX)) return;
      if (!value) {
        this.rooms.delete(key);
        return;
      }
      this.rooms.set(key, value);
    });
    this.pruneTimer = setInterval(() => this.pruneStaleRooms(), ROOM_HEARTBEAT_MS);
  }

  announceRoom(room) {
    this.currentRoom = room;
    this.writeRoomEntry();
    if (this.quickAnnounceTimer) {
      clearTimeout(this.quickAnnounceTimer);
      this.quickAnnounceTimer = null;
    }
    if (this.networkManager?.publishTopic) {
      this.quickAnnounceTimer = setTimeout(() => {
        this.quickAnnounceTimer = null;
        this.writeRoomEntry();
      }, 1500);
    }
    if (!this.announceTimer) {
      this.announceTimer = setInterval(() => this.writeRoomEntry(), ROOM_HEARTBEAT_MS);
    }
  }

  stopAnnouncing() {
    if (this.quickAnnounceTimer) {
      clearTimeout(this.quickAnnounceTimer);
      this.quickAnnounceTimer = null;
    }
    if (this.announceTimer) {
      clearInterval(this.announceTimer);
      this.announceTimer = null;
    }
  }

  writeRoomEntry() {
    if (!this.currentRoom) return;
    const slug = normalizeRoomName(this.currentRoom.name);
    const roomKey = `${ROOM_ENTRY_PREFIX}${slug}`;
    const payload = {
      name: this.currentRoom.name,
      slug,
      visibility: this.currentRoom.visibility,
      updatedAt: Date.now(),
      roomId: this.currentRoom.visibility === 'public' ? this.currentRoom.roomId : null
    };
    if (this.networkManager?.publishTopic) {
      this.rooms.set(roomKey, payload);
      this._notifyObservers(roomKey, payload);
      this.networkManager.publishTopic(this.topic, {
        type: 'room-announce',
        key: roomKey,
        room: payload
      }).catch(() => {});
      return;
    }
    if (!this.stateManager) return;
    this.stateManager.writeScoped(DIRECTORY_NAMESPACE, roomKey, payload);
  }

  pruneStaleRooms() {
    const now = Date.now();
    for (const [key, room] of this.rooms.entries()) {
      if (!room || !room.updatedAt || now - room.updatedAt > ROOM_TTL_MS) {
        this.rooms.delete(key);
      }
    }
  }

  getRooms() {
    const now = Date.now();
    return Array.from(this.rooms.values())
      .filter((room) => room && (!room.updatedAt || now - room.updatedAt <= ROOM_TTL_MS))
      .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  async stop() {
    this.stopAnnouncing();
    if (this.pruneTimer) {
      clearInterval(this.pruneTimer);
      this.pruneTimer = null;
    }
    if (this.unsubscribeTopic) {
      try { this.unsubscribeTopic(); } catch (_) {}
      this.unsubscribeTopic = null;
    }
    this.networkManager = null;
    if (this.node) {
      await this.node.stop();
      this.node = null;
    }
    this.stateManager = null;
    this.namespaceObservers.clear();
    this.rooms.clear();
  }
}
