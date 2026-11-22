import { SqliteWasmEngine } from './sqliteEngine.js';
import { PGliteWasmEngine } from './pgliteEngine.js';
import { IndexedDbSqlEngine } from './indexedDbEngine.js';
import { STARTER_SCHEMAS } from './starterSchemas.js';

const MAX_SNAPSHOTS = 25;
const MAX_CARNAGE_LOG = 150;

export function diffSchemas(before, after) {
  const prevMap = new Map((before?.tables || []).map((t) => [t.name, t]));
  const nextMap = new Map((after?.tables || []).map((t) => [t.name, t]));
  const addedTables = [];
  const droppedTables = [];
  const alteredTables = [];
  const rowDeltas = {};

  for (const [name, nextTbl] of nextMap.entries()) {
    const prevTbl = prevMap.get(name);
    if (!prevTbl) {
      addedTables.push(name);
      if (nextTbl.rowCount > 0) rowDeltas[name] = nextTbl.rowCount;
      continue;
    }
    const prevSig = prevTbl.columns.map((c) => `${c.name}:${c.type}:${c.pk}:${c.fk}`).join('|');
    const nextSig = nextTbl.columns.map((c) => `${c.name}:${c.type}:${c.pk}:${c.fk}`).join('|');
    if (prevSig !== nextSig) alteredTables.push(name);
    const delta = nextTbl.rowCount - prevTbl.rowCount;
    if (delta !== 0) rowDeltas[name] = delta;
  }

  for (const name of prevMap.keys()) {
    if (!nextMap.has(name)) droppedTables.push(name);
  }

  return {
    addedTables,
    droppedTables,
    alteredTables,
    rowDeltas,
    changed: addedTables.length > 0
      || droppedTables.length > 0
      || alteredTables.length > 0
      || Object.keys(rowDeltas).length > 0
  };
}

export function createDatabaseEngine(engineId, options = {}) {
  switch (engineId) {
    case 'sqlite':
      return new SqliteWasmEngine(options);
    case 'pglite':
      return new PGliteWasmEngine(options);
    case 'indexeddb':
      return new IndexedDbSqlEngine(options);
    default:
      throw new Error(`Unknown database engine: ${engineId}`);
  }
}

export class DbSessionManager {
  constructor({ engineId = 'sqlite', starterId = 'startup_prod', engineOptions = {} } = {}) {
    this.engineId = engineId;
    this.starterId = starterId;
    this.engineOptions = engineOptions;
    this.engine = null;
    this.schema = { engine: engineId, dialect: engineId, tables: [], relations: [] };
    this.lastDiff = diffSchemas(null, this.schema);
    this.snapshots = [];
    this.carnageLog = [];
    this.listeners = new Set();
    this.seq = 0;
    this.busy = false;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  _emit(eventType, payload = {}) {
    const state = this.getState();
    for (const listener of this.listeners) {
      try {
        listener({ type: eventType, state, ...payload });
      } catch (err) {
        console.warn('[DbSessionManager] listener error:', err);
      }
    }
  }

  getState() {
    return {
      engineId: this.engineId,
      engineLabel: this.engine?.label || this.engineId,
      dialect: this.engine?.dialect || this.engineId,
      starterId: this.starterId,
      schema: this.schema,
      lastDiff: this.lastDiff,
      snapshotCount: this.snapshots.length,
      carnageLog: this.carnageLog,
      busy: this.busy
    };
  }

  async init(engineId = this.engineId, starterId = this.starterId, { persistedSnapshot = null } = {}) {
    return this.switchEngine(engineId, { starterId, persistedSnapshot });
  }

  async switchEngine(engineId, { starterId = this.starterId, persistedSnapshot = null } = {}) {
    this.busy = true;
    this._emit('engine-loading', { engineId });
    try {
      await this.engine?.dispose?.();
      this.engineId = engineId;
      this.starterId = starterId;
      this.snapshots = [];
      this.engine = createDatabaseEngine(engineId, this.engineOptions[engineId] || {});
      await this.engine.init();

      let restoredFromState = false;
      if (persistedSnapshot && persistedSnapshot.engine === engineId) {
        try {
          await this.engine.restoreSnapshot(persistedSnapshot);
          restoredFromState = true;
        } catch (err) {
          console.warn(`[DbSessionManager] Failed to restore persisted ${engineId} snapshot, falling back to starter:`, err);
        }
      }

      const starter = STARTER_SCHEMAS[starterId] || STARTER_SCHEMAS.startup_prod;
      if (!restoredFromState && starter.sql.trim()) {
        await this.engine.execute(starter.sql);
      }
      this.schema = await this.engine.introspectSchema();
      this.lastDiff = diffSchemas({ tables: [] }, this.schema);
      this._recordLog({
        actor: restoredFromState ? 'RESTORE' : 'SEED',
        sql: restoredFromState
          ? `-- Restored ${this.engine.label} from local PeerCompute StateManager`
          : `-- Initialized ${this.engine.label} with preset "${starter.id}"`,
        ok: true,
        durationMs: 0,
        statements: [],
        diff: this.lastDiff
      });
      this._emit('schema-updated', { reason: restoredFromState ? 'state-restore' : 'engine-switch' });
      return this.getState();
    } finally {
      this.busy = false;
      this._emit('status');
    }
  }

  async exportCurrentSnapshot() {
    if (!this.engine) return null;
    try {
      return await this.engine.exportSnapshot();
    } catch (err) {
      console.warn('[DbSessionManager] exportCurrentSnapshot failed:', err);
      return null;
    }
  }

  async loadStarter(starterId = this.starterId) {
    if (!this.engine) return this.init(this.engineId, starterId);
    this.busy = true;
    try {
      await this._pushSnapshot('before-reset');
      this.starterId = starterId;
      await this.engine.reset();
      const starter = STARTER_SCHEMAS[starterId] || STARTER_SCHEMAS.startup_prod;
      if (starter.sql.trim()) {
        await this.engine.execute(starter.sql);
      }
      const prev = this.schema;
      this.schema = await this.engine.introspectSchema();
      this.lastDiff = diffSchemas(prev, this.schema);
      this._recordLog({
        actor: 'SEED',
        sql: `-- Loaded preset "${starter.id}"`,
        ok: true,
        durationMs: 0,
        statements: [],
        diff: this.lastDiff
      });
      this._emit('schema-updated', { reason: 'starter-load' });
      return this.getState();
    } finally {
      this.busy = false;
      this._emit('status');
    }
  }

  async _pushSnapshot(label) {
    if (!this.engine) return;
    try {
      const snap = await this.engine.exportSnapshot();
      this.snapshots.push({ label, createdAt: Date.now(), data: snap });
      if (this.snapshots.length > MAX_SNAPSHOTS) this.snapshots.shift();
    } catch (err) {
      console.warn('[DbSessionManager] snapshot failed:', err);
    }
  }

  async executeSql(sqlText, { actor = 'USER', recordSnapshot = true } = {}) {
    if (!this.engine) await this.init();
    const cleaned = String(sqlText ?? '').trim();
    if (!cleaned) {
      return { ok: true, results: [], diff: diffSchemas(this.schema, this.schema) };
    }

    const mightMutate = /\b(CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|TRUNCATE|REPLACE)\b/i.test(cleaned);
    if (recordSnapshot && mightMutate) {
      await this._pushSnapshot(`${actor}:${cleaned.slice(0, 40)}`);
    }

    const prevSchema = this.schema;
    const t0 = performance.now();
    try {
      const execResult = await this.engine.execute(cleaned);
      const durationMs = Number((performance.now() - t0).toFixed(2));
      this.schema = await this.engine.introspectSchema();
      this.lastDiff = diffSchemas(prevSchema, this.schema);

      const entry = this._recordLog({
        actor,
        sql: cleaned,
        ok: true,
        durationMs,
        statements: execResult.results,
        diff: this.lastDiff
      });
      this._emit('sql-executed', { entry, results: execResult.results });
      if (this.lastDiff.changed || mightMutate) {
        this._emit('schema-updated', { reason: 'sql', entry });
      }
      return {
        ok: true,
        entry,
        results: execResult.results,
        schema: this.schema,
        diff: this.lastDiff,
        durationMs
      };
    } catch (error) {
      const durationMs = Number((performance.now() - t0).toFixed(2));
      // Refresh schema even on partial batch failure so diagram reflects exact DB truth!
      this.schema = await this.engine.introspectSchema().catch(() => this.schema);
      this.lastDiff = diffSchemas(prevSchema, this.schema);
      const message = String(error?.message || error);
      const entry = this._recordLog({
        actor,
        sql: cleaned,
        ok: false,
        error: message,
        durationMs,
        statements: [],
        diff: this.lastDiff
      });
      this._emit('sql-error', { entry, error: message });
      if (this.lastDiff.changed) {
        this._emit('schema-updated', { reason: 'sql-partial-error', entry });
      }
      return {
        ok: false,
        entry,
        error: message,
        results: [],
        schema: this.schema,
        diff: this.lastDiff,
        durationMs
      };
    }
  }

  async rewind() {
    if (!this.engine || this.snapshots.length === 0) return false;
    const snap = this.snapshots.pop();
    const prev = this.schema;
    await this.engine.restoreSnapshot(snap.data);
    this.schema = await this.engine.introspectSchema();
    this.lastDiff = diffSchemas(prev, this.schema);
    this._recordLog({
      actor: 'REWIND',
      sql: `-- Rewound database to snapshot (${snap.label})`,
      ok: true,
      durationMs: 0,
      statements: [],
      diff: this.lastDiff
    });
    this._emit('schema-updated', { reason: 'rewind' });
    return true;
  }

  _recordLog(record) {
    const entry = {
      id: ++this.seq,
      timestamp: new Date().toISOString(),
      engine: this.engineId,
      ...record
    };
    this.carnageLog.push(entry);
    if (this.carnageLog.length > MAX_CARNAGE_LOG) this.carnageLog.shift();
    return entry;
  }

  async dispose() {
    await this.engine?.dispose?.();
    this.engine = null;
    this.listeners.clear();
  }
}
