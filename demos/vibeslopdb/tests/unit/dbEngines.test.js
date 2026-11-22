import test from 'node:test';
import assert from 'node:assert/strict';

import { SqliteWasmEngine } from '../../src/db/sqliteEngine.js';
import { PGliteWasmEngine } from '../../src/db/pgliteEngine.js';
import { IndexedDbSqlEngine } from '../../src/db/indexedDbEngine.js';
import { DbSessionManager, diffSchemas } from '../../src/db/sessionManager.js';
import { splitSqlStatements, formatAsciiTable } from '../../src/db/sqlUtils.js';

test('splitSqlStatements preserves quoted semicolons and strips comments', () => {
  const sql = `
    -- leading comment
    CREATE TABLE notes (id INTEGER PRIMARY KEY, body TEXT);
    INSERT INTO notes (id, body) VALUES (1, 'hello; world; -- not a comment');
    /* block comment; with semicolon */
    SELECT * FROM notes;
  `;
  const stmts = splitSqlStatements(sql);
  assert.equal(stmts.length, 3);
  assert.match(stmts[1], /'hello; world; -- not a comment'/);
});

test('formatAsciiTable renders retro terminal table cleanly', () => {
  const out = formatAsciiTable(['id', 'name'], [[1, 'alice'], [2, null]]);
  assert.match(out, /\+-----\+/);
  assert.match(out, /alice/);
  assert.match(out, /NULL/);
});

test('SqliteWasmEngine executes DDL/DML, introspects FKs, and restores snapshots', async () => {
  const engine = new SqliteWasmEngine();
  try {
    await engine.init();
    await engine.execute(`
      CREATE TABLE teams (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
      CREATE TABLE members (id INTEGER PRIMARY KEY, team_id INTEGER REFERENCES teams(id), handle TEXT);
      INSERT INTO teams (id, name) VALUES (1, 'chaos');
      INSERT INTO members (id, team_id, handle) VALUES (1, 1, 'ada'), (2, 1, 'linus');
    `);
    const schema = await engine.introspectSchema();
    assert.equal(schema.tables.length, 2);
    assert.equal(schema.relations.length, 1);
    assert.deepEqual(schema.relations[0], {
      fromTable: 'members',
      fromColumn: 'team_id',
      toTable: 'teams',
      toColumn: 'id'
    });

    const snap = await engine.exportSnapshot();
    await engine.execute('DROP TABLE members;');
    const afterDrop = await engine.introspectSchema();
    assert.equal(afterDrop.tables.length, 1);

    await engine.restoreSnapshot(snap);
    const restored = await engine.introspectSchema();
    assert.equal(restored.tables.length, 2);
    const sel = await engine.execute('SELECT COUNT(*) AS c FROM members;');
    assert.equal(sel.results[0].rows[0][0], 2);
  } finally {
    await engine.dispose();
  }
});

test('PGliteWasmEngine executes real PostgreSQL DDL/JSONB/RETURNING, introspects, and restores snapshots', async () => {
  const engine = new PGliteWasmEngine();
  try {
    await engine.init();
    const res = await engine.execute(`
      CREATE TABLE guilds (id INTEGER PRIMARY KEY, name TEXT NOT NULL);
      CREATE TABLE heroes (id INTEGER PRIMARY KEY, guild_id INTEGER REFERENCES guilds(id), meta JSONB);
      INSERT INTO guilds (id, name) VALUES (1, 'SlopOps');
      INSERT INTO heroes (id, guild_id, meta) VALUES (1, 1, '{"chaos": 99}'::jsonb) RETURNING id, guild_id;
    `);
    assert.equal(res.results[3].rows[0][0], 1);
    const schema = await engine.introspectSchema();
    assert.equal(schema.dialect, 'postgres');
    assert.equal(schema.tables.length, 2);
    assert.equal(schema.relations.length, 1);
    assert.equal(schema.relations[0].fromTable, 'heroes');
    assert.equal(schema.relations[0].toTable, 'guilds');

    const snap = await engine.exportSnapshot();
    await engine.execute('DROP TABLE heroes;');
    assert.equal((await engine.introspectSchema()).tables.length, 1);

    await engine.restoreSnapshot(snap);
    const restored = await engine.introspectSchema();
    assert.equal(restored.tables.length, 2);
    const countRes = await engine.execute('SELECT COUNT(*)::int AS c FROM heroes;');
    assert.equal(countRes.results[0].rows[0][0], 1);
  } finally {
    await engine.dispose();
  }
});

test('IndexedDbSqlEngine executes DDL, JOIN, WHERE, GROUP BY, ALTER, DROP, and snapshot restore', async () => {
  const engine = new IndexedDbSqlEngine({ dbName: `vibeslopdb_test_${Date.now()}` });
  try {
    await engine.init();
    await engine.execute(`
      CREATE TABLE users (id INTEGER PRIMARY KEY, handle TEXT NOT NULL, score INTEGER DEFAULT 10);
      CREATE TABLE posts (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), title TEXT);
      INSERT INTO users (id, handle, score) VALUES (1, 'ada', 50), (2, 'bob', 20);
      INSERT INTO posts (id, user_id, title) VALUES (1, 1, 'Hello IDB'), (2, 1, 'YOLO SQL'), (3, 2, 'Oops');
    `);
    const joinRes = await engine.execute(
      'SELECT u.handle, p.title FROM users u JOIN posts p ON p.user_id = u.id WHERE u.score >= 30 ORDER BY p.id DESC;'
    );
    assert.equal(joinRes.results[0].rowCount, 2);
    assert.equal(joinRes.results[0].rows[0][0], 'ada');
    assert.equal(joinRes.results[0].rows[0][1], 'YOLO SQL');

    const aggRes = await engine.execute(
      'SELECT user_id, COUNT(*) AS total FROM posts GROUP BY user_id ORDER BY total DESC;'
    );
    assert.equal(aggRes.results[0].rows[0][0], 1);
    assert.equal(aggRes.results[0].rows[0][1], 2);

    const snap = await engine.exportSnapshot();
    await engine.execute('ALTER TABLE users ADD COLUMN vibe INTEGER DEFAULT 99;');
    await engine.execute("UPDATE users SET vibe = 777 WHERE handle = 'ada';");
    const altered = await engine.execute("SELECT vibe FROM users WHERE handle = 'ada';");
    assert.equal(altered.results[0].rows[0][0], 777);

    await engine.execute('DROP TABLE posts;');
    assert.equal((await engine.introspectSchema()).tables.length, 1);

    await engine.restoreSnapshot(snap);
    const restored = await engine.introspectSchema();
    assert.equal(restored.tables.length, 2);
    assert.equal(restored.relations.length, 1);
  } finally {
    await engine.dispose();
  }
});

test('DbSessionManager switches across all 3 engines, tracks schema diffs, and rewinds carnage', async () => {
  const session = new DbSessionManager({ engineId: 'sqlite', starterId: 'startup_prod' });
  try {
    const s1 = await session.init('sqlite', 'startup_prod');
    assert.equal(s1.engineId, 'sqlite');
    assert.ok(s1.schema.tables.length >= 4);

    const dropRes = await session.executeSql('DROP TABLE audit_logs;', { actor: 'YOLO-AI' });
    assert.equal(dropRes.ok, true);
    assert.deepEqual(dropRes.diff.droppedTables, ['audit_logs']);
    assert.equal(session.snapshots.length, 1);

    const rewound = await session.rewind();
    assert.equal(rewound, true);
    assert.ok(session.schema.tables.some((t) => t.name === 'audit_logs'));

    const s2 = await session.switchEngine('pglite', { starterId: 'space_station' });
    assert.equal(s2.engineId, 'pglite');
    assert.ok(s2.schema.tables.some((t) => t.name === 'crew'));

    const s3 = await session.switchEngine('indexeddb', { starterId: 'medieval_tavern' });
    assert.equal(s3.engineId, 'indexeddb');
    assert.ok(s3.schema.tables.some((t) => t.name === 'patrons'));

    const diff = diffSchemas(
      { tables: [{ name: 'a', rowCount: 1, columns: [{ name: 'id', type: 'INT', pk: true, fk: false }] }] },
      { tables: [{ name: 'a', rowCount: 3, columns: [{ name: 'id', type: 'INT', pk: true, fk: false }, { name: 'x', type: 'TEXT', pk: false, fk: false }] }, { name: 'b', rowCount: 0, columns: [] }] }
    );
    assert.deepEqual(diff.addedTables, ['b']);
    assert.deepEqual(diff.alteredTables, ['a']);
    assert.equal(diff.rowDeltas.a, 2);
  } finally {
    await session.dispose();
  }
});
