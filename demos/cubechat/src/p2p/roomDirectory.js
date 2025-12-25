import { NodeKernel } from '@peercompute';

const DIRECTORY_ROOM_ID = '__rooms__';
const DIRECTORY_NAMESPACE = 'rooms';
const ROOM_ENTRY_PREFIX = 'room-';
const ROOM_HEARTBEAT_MS = 10000;
const ROOM_TTL_MS = 45000;

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

export const normalizeRoomName = (value) => {
  return slugify(value);
};

export class RoomDirectory {
  constructor({ gameId, bootstrapPeers }) {
    this.gameId = gameId;
    this.bootstrapPeers = bootstrapPeers || [];
    this.node = null;
    this.stateManager = null;
    this.rooms = new Map();
    this.announceTimer = null;
    this.pruneTimer = null;
    this.currentRoom = null;
  }

  async init() {
    if (this.node) return;
    this.node = new NodeKernel({
      bootstrapPeers: this.bootstrapPeers,
      enablePersistence: false,
      gameId: this.gameId,
      roomId: DIRECTORY_ROOM_ID
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
    if (!this.announceTimer) {
      this.announceTimer = setInterval(() => this.writeRoomEntry(), ROOM_HEARTBEAT_MS);
    }
  }

  stopAnnouncing() {
    if (this.announceTimer) {
      clearInterval(this.announceTimer);
      this.announceTimer = null;
    }
  }

  writeRoomEntry() {
    if (!this.stateManager || !this.currentRoom) return;
    const slug = normalizeRoomName(this.currentRoom.name);
    const roomKey = `${ROOM_ENTRY_PREFIX}${slug}`;
    const payload = {
      name: this.currentRoom.name,
      slug,
      visibility: this.currentRoom.visibility,
      updatedAt: Date.now(),
      roomId: this.currentRoom.visibility === 'public' ? this.currentRoom.roomId : null
    };
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
    if (this.node) {
      await this.node.stop();
      this.node = null;
    }
    this.stateManager = null;
    this.rooms.clear();
  }
}
