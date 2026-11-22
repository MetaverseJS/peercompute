import test from 'node:test';
import assert from 'node:assert/strict';

import {
  sanitizeMermaidId,
  sanitizeMermaidType,
  schemaToMermaidEr,
  buildSchemaContextSummary
} from '../../src/mermaid/schemaToMermaid.js';
import {
  buildYoloDbaSystemPrompt,
  buildPrimedUserMessage,
  extractSqlFromModelOutput,
  extractSqlFromModelOutputDetailed,
  analyzeSqlCompleteness,
  salvageTruncatedInsert,
  isTruncatedSqlOutput,
  stitchContinuation,
  generateChaosFallbackSql,
  CHAOS_PROMPT_PRESETS
} from '../../src/ai/sqlExtractor.js';

test('schemaToMermaidEr handles empty schema and weird identifiers cleanly', () => {
  const empty = schemaToMermaidEr({ tables: [], relations: [] });
  assert.match(empty, /^erDiagram/);
  assert.match(empty, /EMPTY_DATABASE/);

  assert.equal(sanitizeMermaidId('123-bad table!'), 't_123_bad_table');
  assert.equal(sanitizeMermaidType('CHARACTER VARYING(255)'), 'character_varying');

  const mermaid = schemaToMermaidEr({
    engine: 'sqlite',
    dialect: 'sqlite',
    tables: [
      {
        name: 'weird-users',
        rowCount: 4,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true, fk: false, nullable: false },
          { name: 'email addr', type: 'VARCHAR(120)', pk: false, fk: false, nullable: false }
        ]
      },
      {
        name: 'orders',
        rowCount: 2,
        columns: [
          { name: 'id', type: 'INTEGER', pk: true, fk: false, nullable: false },
          { name: 'user_id', type: 'INTEGER', pk: false, fk: true, nullable: true }
        ]
      }
    ],
    relations: [
      { fromTable: 'orders', fromColumn: 'user_id', toTable: 'weird-users', toColumn: 'id' }
    ]
  });

  assert.match(mermaid, /weird_users\["weird-users \(4\)"\]/);
  assert.match(mermaid, /integer id PK/);
  assert.match(mermaid, /varchar email_addr "NOT NULL"/);
  assert.match(mermaid, /weird_users \|\|--o\{ orders : "user_id"/);
});

test('extractSqlFromModelOutput parses fenced SQL, JSON payloads, and bare SQL', () => {
  const fenced = `Let's ruin prod!\n\`\`\`sql\nCREATE TABLE doom (id INT);\nINSERT INTO doom VALUES (1);\n\`\`\``;
  assert.deepEqual(extractSqlFromModelOutput(fenced), [
    'CREATE TABLE doom (id INT)',
    'INSERT INTO doom VALUES (1)'
  ]);

  const json = `Sure: {"text":"dropping","actions":[{"name":"runSql","args":{"sql":"DROP TABLE doom; SELECT 1;"}}]}`;
  assert.deepEqual(extractSqlFromModelOutput(json), ['DROP TABLE doom', 'SELECT 1']);

  const bare = `SELECT * FROM users LIMIT 5;`;
  assert.deepEqual(extractSqlFromModelOutput(bare), ['SELECT * FROM users LIMIT 5']);

  const withThink = `<think>maybe DROP TABLE fake;</think>\nExecuting now.\n\`\`\`sql\nPRAGMA foreign_keys = OFF;\nDROP TABLE IF EXISTS users;\n\`\`\``;
  assert.deepEqual(extractSqlFromModelOutput(withThink), [
    'PRAGMA foreign_keys = OFF',
    'DROP TABLE IF EXISTS users'
  ]);

  const inlineTick = 'Sure, running `DROP TABLE IF EXISTS audit_logs;` right now.';
  assert.deepEqual(extractSqlFromModelOutput(inlineTick), ['DROP TABLE IF EXISTS audit_logs']);
});

test('buildYoloDbaSystemPrompt and generateChaosFallbackSql produce valid dialect-aware SQL', () => {
  const schema = {
    engine: 'pglite',
    dialect: 'postgres',
    tables: [
      { name: 'users', rowCount: 3, columns: [{ name: 'id', type: 'INTEGER', pk: true, fk: false }, { name: 'name', type: 'TEXT', pk: false, fk: false }] },
      { name: 'logs', rowCount: 5, columns: [{ name: 'id', type: 'INTEGER', pk: true, fk: false }, { name: 'user_id', type: 'INTEGER', pk: false, fk: true }] }
    ],
    relations: [{ fromTable: 'logs', fromColumn: 'user_id', toTable: 'users', toColumn: 'id' }]
  };

  const summary = buildSchemaContextSummary(schema, []);
  const sys = buildYoloDbaSystemPrompt({ schemaSummary: summary, dialect: 'postgres', yoloMode: true });
  assert.match(sys, /PostgreSQL/);
  assert.match(sys, /YOLO AUTO-EXEC/);
  assert.match(sys, /users \(3 rows\)/);

  const primed = buildPrimedUserMessage({
    userPrompt: 'delete the current schema',
    schemaSummary: summary,
    schema,
    dialect: 'postgres'
  });
  assert.match(primed, /\[LIVE DATABASE CONTEXT\]/);
  assert.match(primed, /Existing tables \(2\): users, logs/);
  assert.match(primed, /delete the current schema/);

  for (const preset of CHAOS_PROMPT_PRESETS) {
    const out = generateChaosFallbackSql(preset.prompt, schema);
    assert.ok(out.reply.length > 0);
    assert.ok(Array.isArray(out.sql) && out.sql.length > 0, `preset ${preset.id} produced SQL`);
  }

  const byId = Object.fromEntries(CHAOS_PROMPT_PRESETS.map((p) => [p.id, generateChaosFallbackSql(p.prompt, schema)]));
  assert.match(byId.blockchain_audit.sql[0], /CREATE TABLE "blockchain_ledgers"/);
  assert.match(byId.vibe_score.sql[0], /ALTER TABLE "users" ADD COLUMN "vibe_score"/);
  assert.match(byId.nuke_random.sql[0], /DROP TABLE IF EXISTS "logs" CASCADE;/);
  assert.match(byId.chaos_insert.sql[0], /INSERT INTO "users"/);
  assert.match(byId.inspect_all.sql[0], /SELECT \* FROM "logs"/);

  const dropOut = generateChaosFallbackSql('nuke a table', schema);
  assert.match(dropOut.sql[0], /DROP TABLE IF EXISTS "logs" CASCADE;/);
});

test('truncated SQL detection, continuation stitching, and multi-row INSERT salvage prevent incomplete input', () => {
  const truncatedReply = [
    'Creating solar system.',
    '```sql',
    'DROP TABLE IF EXISTS solar_system;',
    'CREATE TABLE solar_system (id INTEGER PRIMARY KEY, name TEXT, mass REAL);',
    'INSERT INTO solar_system (id, name, mass) VALUES',
    "(1, 'Sun', 1.989e30),",
    "(2, 'Mercury', 3.301e23),",
    "(3, 'Venus', 4.86"
  ].join('\n');

  assert.equal(isTruncatedSqlOutput(truncatedReply, 'length'), true);
  assert.equal(isTruncatedSqlOutput(truncatedReply, 'stop'), true, 'unclosed ```sql fence must trigger continuation even if finishReason is unknown');
  assert.equal(analyzeSqlCompleteness("INSERT INTO t VALUES (1, 'ok')").complete, true);
  assert.equal(analyzeSqlCompleteness("INSERT INTO t VALUES (1, 'ok'), (2, 'cut").complete, false);

  // Seamless auto-continuation with duplicate fence + repeated cutoff prefix
  const continuationChunk = [
    '```sql',
    "(3, 'Venus', 4.867e24),",
    "(4, 'Earth', 5.972e24);",
    '```'
  ].join('\n');
  const stitched = stitchContinuation(truncatedReply, continuationChunk);
  assert.equal(isTruncatedSqlOutput(stitched, 'stop'), false);
  const fullStmts = extractSqlFromModelOutput(stitched);
  assert.equal(fullStmts.length, 3);
  assert.match(fullStmts[2], /'Venus', 4\.867e24\),\s*\(4, 'Earth', 5\.972e24\)$/);

  // Belt-and-suspenders salvage if a reply STILL ends truncated after all continuations
  const salvaged = extractSqlFromModelOutputDetailed(truncatedReply);
  assert.equal(salvaged.unclosedFence, true);
  assert.equal(salvaged.salvagedCount, 1);
  assert.equal(salvaged.droppedIncomplete, 0);
  assert.equal(salvaged.statements.length, 3);
  assert.match(salvaged.statements[2], /\(2, 'Mercury', 3\.301e23\)$/);
  assert.equal(salvageTruncatedInsert("INSERT INTO t VALUES (1, 'a'), (2, 'b'), (3, 'cut"), "INSERT INTO t VALUES (1, 'a'), (2, 'b')");
});
