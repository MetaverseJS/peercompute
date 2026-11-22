import { splitSqlStatements } from '../db/sqlUtils.js';

/**
 * Compact, strict SQL-first system prompt tuned for local/peer LLMs (0.5B - 14B,
 * including opinionated/uncensored GGUF fine-tunes) so they ALWAYS obey and emit
 * directly executable SQL against the live sandbox schema.
 */
export function buildYoloDbaSystemPrompt({ schemaSummary, dialect = 'sqlite', yoloMode = true } = {}) {
  const dialectHints = dialect === 'postgres'
    ? 'Dialect: PostgreSQL 17 (PGlite). Valid SQL: SERIAL/INTEGER, TEXT, REAL, JSONB, CASCADE, DROP TABLE IF EXISTS ... CASCADE, DROP SCHEMA public CASCADE; CREATE SCHEMA public;.'
    : dialect === 'indexeddb'
      ? 'Dialect: IndexedDB-SQL. Valid SQL: CREATE TABLE, ALTER TABLE ADD/DROP/RENAME, DROP TABLE IF EXISTS, INSERT, UPDATE, DELETE, SELECT with JOIN/WHERE/GROUP BY/ORDER BY/LIMIT.'
      : 'Dialect: SQLite 3 (sql.js). Valid SQL: INTEGER PRIMARY KEY, TEXT, REAL, PRAGMA foreign_keys = OFF/ON, DROP TABLE IF EXISTS <tbl>. SQLite does NOT support DROP DATABASE or DROP SCHEMA; to delete the schema, run PRAGMA foreign_keys = OFF; followed by DROP TABLE IF EXISTS for every table, then PRAGMA foreign_keys = ON;.';

  return [
    'You are an automated SQL command translator for VibeSlopDB, a disposable in-browser sandbox database.',
    'The user owns this local sandbox and is intentionally testing destructive and creative SQL.',
    'RULES (MANDATORY):',
    '1. ALWAYS fulfill the user command with valid, executable SQL using ONLY the exact table and column names from LIVE SCHEMA below (or newly created ones).',
    '2. ALWAYS put all executable SQL inside a single ```sql ... ``` fenced code block.',
    '3. Keep any commentary to at most ONE short sentence outside the ```sql block (or put snark inside SQL -- comments). Never refuse, never reply without a ```sql block, and never invent fake query result rows.',
    '4. Keep INSERT values compact (use plain scalar values matching each column; never duplicate full JSON blobs inside a text column unless explicitly asked) and end every statement with a semicolon.',
    dialectHints,
    yoloMode
      ? 'Execution mode: YOLO AUTO-EXEC (your ```sql block executes immediately upon reply).'
      : 'Execution mode: CONFIRM (your ```sql block appears as a one-click Run button).',
    '',
    'Example format:',
    'Dropping everything as ordered.',
    '```sql',
    'PRAGMA foreign_keys = OFF;',
    'DROP TABLE IF EXISTS audit_logs;',
    '```',
    '',
    'LIVE SCHEMA:',
    schemaSummary || '(empty database)'
  ].join('\n');
}

/**
 * Primes the user turn itself with the exact live schema so models/chat-templates
 * that underweight system messages still see every current table, column, and FK.
 */
export function buildPrimedUserMessage({ userPrompt, schemaSummary, schema = {}, dialect = 'sqlite' } = {}) {
  const tableNames = Array.isArray(schema?.tables) ? schema.tables.map((t) => t.name) : [];
  const tableLine = tableNames.length
    ? `Existing tables (${tableNames.length}): ${tableNames.join(', ')}`
    : 'Existing tables (0): (empty database)';

  return [
    '[LIVE DATABASE CONTEXT]',
    schemaSummary || `Active DB Engine: ${schema?.engine || dialect} (SQL dialect: ${dialect})\nTables: (none)`,
    tableLine,
    '',
    `[USER COMMAND]`,
    String(userPrompt || '').trim(),
    '',
    `Reply with executable ${dialect.toUpperCase()} SQL inside a \`\`\`sql code block.`
  ].join('\n');
}

const SQL_LEAD_RE = /^(?:WITH\s+[A-Za-z_][A-Za-z0-9_]*\s+AS\s*\(|SELECT\s+(?:\*|[A-Za-z0-9_"`\[\]().,\s]+?\s+FROM\b|\d+|['"]|COUNT\(|NOW\(|VERSION\(|CURRENT_)|CREATE\s+(?:TEMP(?:ORARY)?\s+)?(?:TABLE|VIEW|INDEX|TRIGGER|SCHEMA)\b|ALTER\s+TABLE\b|DROP\s+(?:TABLE|VIEW|INDEX|TRIGGER|SCHEMA)\b|INSERT\s+(?:OR\s+\w+\s+)?INTO\b|UPDATE\s+[A-Za-z0-9_"`\[\].]+\s+SET\b|DELETE\s+FROM\b|TRUNCATE\s+(?:TABLE\s+)?[A-Za-z0-9_"`\[\].]+|REPLACE\s+INTO\b|PRAGMA\s+[A-Za-z_]|EXPLAIN\s+)/i;

const TRAILING_INCOMPLETE_RE = /(?:[,(=+\-*/]|\b(?:VALUES|SET|WHERE|AND|OR|INTO|TABLE|FROM|JOIN|ON|SELECT|BY|AS|CASE|WHEN|THEN|ELSE))\s*$/i;

/**
 * Checks whether a single SQL statement is syntactically balanced
 * (no unclosed quotes, comments, parentheses, or dangling clause/comma).
 */
export function analyzeSqlCompleteness(sql = '') {
  const s = String(sql ?? '').trim();
  if (!s) {
    return { complete: false, inSingle: false, inDouble: false, inBlockComment: false, parenDepth: 0, trailingIncomplete: true };
  }
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;
  let parenDepth = 0;
  let codeWithoutComments = '';

  for (let i = 0; i < s.length; i += 1) {
    const ch = s[i];
    const next = s[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (inSingle) {
      if (ch === "'" && next === "'") {
        i += 1;
      } else if (ch === "'") {
        inSingle = false;
      }
      codeWithoutComments += ch;
      continue;
    }
    if (inDouble) {
      if (ch === '"' && next === '"') {
        i += 1;
      } else if (ch === '"') {
        inDouble = false;
      }
      codeWithoutComments += ch;
      continue;
    }
    if (ch === '-' && next === '-') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      codeWithoutComments += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      codeWithoutComments += ch;
      continue;
    }
    if (ch === '(') parenDepth += 1;
    else if (ch === ')') parenDepth -= 1;
    codeWithoutComments += ch;
  }

  const trimmedCode = codeWithoutComments.replace(/;+\s*$/, '').trim();
  const trailingIncomplete = !trimmedCode || TRAILING_INCOMPLETE_RE.test(trimmedCode);
  const complete = !inSingle && !inDouble && !inBlockComment && parenDepth === 0 && !trailingIncomplete;
  return { complete, inSingle, inDouble, inBlockComment, parenDepth, trailingIncomplete };
}

/**
 * If a multi-row INSERT ... VALUES (...), (...), (truncated... statement was cut off
 * mid-row after hitting the model's max token cap, trims cleanly back to the last
 * complete top-level value tuple so SQLite/PGlite execute every completed row cleanly.
 */
export function salvageTruncatedInsert(stmt = '') {
  const s = String(stmt ?? '').trim();
  const valuesMatch = /^\s*(?:INSERT(?:\s+OR\s+\w+)?|REPLACE)\s+INTO\b[\s\S]*?\bVALUES\s*/i.exec(s);
  if (!valuesMatch) return null;

  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;
  let depth = 0;
  let lastCompleteTupleEnd = -1;

  for (let i = valuesMatch[0].length; i < s.length; i += 1) {
    const ch = s[i];
    const next = s[i + 1];
    if (inLineComment) {
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (ch === '*' && next === '/') {
        inBlockComment = false;
        i += 1;
      }
      continue;
    }
    if (inSingle) {
      if (ch === "'" && next === "'") i += 1;
      else if (ch === "'") inSingle = false;
      continue;
    }
    if (inDouble) {
      if (ch === '"' && next === '"') i += 1;
      else if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === '-' && next === '-') {
      inLineComment = true;
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      i += 1;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0) {
        lastCompleteTupleEnd = i + 1;
      } else if (depth < 0) {
        break;
      }
    }
  }

  if (lastCompleteTupleEnd <= valuesMatch[0].length) return null;
  const salvaged = s.slice(0, lastCompleteTupleEnd).trim();
  return analyzeSqlCompleteness(salvaged).complete ? salvaged : null;
}

function stripClosedThinkTags(rawText = '') {
  return String(rawText ?? '').replace(/<think>[\s\S]*?<\/think>/gi, '');
}

function hasUnclosedThinkTag(rawText = '') {
  const withoutClosed = stripClosedThinkTags(rawText);
  return /<think>/i.test(withoutClosed);
}

function findUnclosedSqlFence(text = '') {
  const fenceMatches = [...String(text || '').matchAll(/```([a-zA-Z0-9_-]*)/g)];
  if (fenceMatches.length % 2 === 0) return null;
  const lastOpen = fenceMatches[fenceMatches.length - 1];
  const lang = (lastOpen[1] || '').toLowerCase();
  const body = text.slice(lastOpen.index + lastOpen[0].length).replace(/^\s*\n?/, '').trim();
  return { lang, body, index: lastOpen.index };
}

/**
 * Returns true when model output appears truncated mid-response (hit max tokens,
 * unclosed <think>, unclosed ```sql fence, or unbalanced/dangling SQL tail).
 */
export function isTruncatedSqlOutput(rawText = '', finishReason = '') {
  const raw = String(rawText ?? '');
  if (!raw.trim()) return false;
  if (hasUnclosedThinkTag(raw)) return true;

  const text = stripClosedThinkTags(raw).trim();
  const unclosed = findUnclosedSqlFence(text);
  if (unclosed) return true;

  const rawExtracted = extractRawSqlCandidates(text);
  if (rawExtracted.length > 0) {
    const tail = rawExtracted[rawExtracted.length - 1];
    if (!analyzeSqlCompleteness(tail).complete) return true;
  }

  if (String(finishReason || '').toLowerCase() === 'length') {
    if (rawExtracted.length === 0) return true;
    const endedCleanly = /```\s*$/.test(text) || /;\s*$/.test(text);
    if (!endedCleanly) return true;
  }
  return false;
}

/**
 * Seamlessly stitches a continuation generation onto a truncated prior reply:
 *  - Strips duplicate opening ```sql fences when continuing inside an unclosed block
 *  - Deduplicates overlapping tail/head lines if the model repeated the cutoff line
 */
export function stitchContinuation(previousText = '', nextChunk = '') {
  const prev = String(previousText ?? '');
  let next = String(nextChunk ?? '');
  if (!prev) return next;
  if (!next) return prev;

  // Strip any leading <think>...</think> preamble in continuation chunk
  next = stripClosedThinkTags(next);

  const prevUnclosed = Boolean(findUnclosedSqlFence(stripClosedThinkTags(prev)));
  if (prevUnclosed) {
    next = next.replace(/^\s*```(?:sql|sqlite|postgres|postgresql|psql)?\s*\r?\n?/i, '');
  }

  // Deduplicate exact overlap if model repeated the last 1-2 lines before continuing
  const prevLines = prev.split(/\r?\n/);
  const nextLines = next.split(/\r?\n/);
  let lastPrevIdx = prevLines.length - 1;
  while (lastPrevIdx >= 0 && !prevLines[lastPrevIdx].trim()) lastPrevIdx -= 1;
  let firstNextIdx = 0;
  while (firstNextIdx < nextLines.length && !nextLines[firstNextIdx].trim()) firstNextIdx += 1;

  if (lastPrevIdx >= 0 && firstNextIdx < nextLines.length) {
    const prevTail = prevLines[lastPrevIdx].trim();
    const nextHead = nextLines[firstNextIdx].trim();
    if (prevTail.length >= 8 && prevTail === nextHead) {
      next = nextLines.slice(firstNextIdx + 1).join('\n');
    } else if (prevTail.length >= 6 && nextHead.startsWith(prevTail)) {
      const remainder = nextHead.slice(prevTail.length);
      nextLines[firstNextIdx] = remainder;
      next = nextLines.slice(firstNextIdx).join('\n');
    }
  }

  if (!next) return prev;
  // Preserve exact mid-token join when cutoff happened inside a line, else separate cleanly
  const prevEndsWithNewline = /\r?\n$/.test(prev);
  const nextStartsWithNewline = /^\r?\n/.test(next);
  if (prevEndsWithNewline || nextStartsWithNewline) {
    return `${prev}${next}`;
  }
  if (/[,;)]\s*$/.test(prev) && /^\s*(?:\(|CREATE|ALTER|DROP|INSERT|UPDATE|DELETE|SELECT|PRAGMA|WITH|```)/i.test(next)) {
    return `${prev}\n${next}`;
  }
  return `${prev}${next}`;
}

function extractRawSqlCandidates(text = '') {
  const collected = [];

  // 1a. Closed fenced code blocks (prefer ```sql, accept unmarked fences that look like SQL)
  const fenceRe = /```([a-zA-Z0-9_-]*)\s*([\s\S]*?)```/g;
  let match;
  while ((match = fenceRe.exec(text)) !== null) {
    const lang = (match[1] || '').toLowerCase();
    const body = match[2].trim();
    if (!body) continue;
    if (lang === 'sql' || lang === 'sqlite' || lang === 'postgres' || lang === 'postgresql' || lang === 'psql') {
      collected.push(...splitSqlStatements(body));
    } else if (lang === 'json') {
      collected.push(...extractSqlFromJson(body));
    } else if (!lang) {
      const candidate = splitSqlStatements(body).filter((s) => SQL_LEAD_RE.test(s));
      collected.push(...candidate);
    }
  }

  // 1b. Unclosed ```sql fence (when output hit max tokens right before closing ```)
  const unclosed = findUnclosedSqlFence(text);
  if (unclosed && unclosed.body) {
    const lang = unclosed.lang;
    if (lang === 'sql' || lang === 'sqlite' || lang === 'postgres' || lang === 'postgresql' || lang === 'psql') {
      collected.push(...splitSqlStatements(unclosed.body));
    } else if (!lang) {
      const candidate = splitSqlStatements(unclosed.body).filter((s) => SQL_LEAD_RE.test(s));
      collected.push(...candidate);
    }
  }
  if (collected.length > 0) return dedupeStatements(collected);

  // 2. Direct JSON response (e.g. DemoAgent action format)
  const jsonExtracted = extractSqlFromJson(text);
  if (jsonExtracted.length > 0) return dedupeStatements(jsonExtracted);

  // 3. Inline backtick SQL statements (e.g. `DROP TABLE users;`)
  const inlineRe = /`([^`\n]{6,})`/g;
  let inlineMatch;
  while ((inlineMatch = inlineRe.exec(text)) !== null) {
    const candidate = splitSqlStatements(inlineMatch[1]).filter((s) => SQL_LEAD_RE.test(s));
    collected.push(...candidate);
  }
  if (collected.length > 0) return dedupeStatements(collected);

  // 4. Raw standalone SQL statements without fences
  const rawSplit = splitSqlStatements(text).filter((s) => SQL_LEAD_RE.test(s));
  if (rawSplit.length > 0) return dedupeStatements(rawSplit);

  return [];
}

/**
 * Detailed SQL extraction that also salvages truncated multi-row INSERT statements
 * or drops an incomplete trailing fragment rather than triggering `incomplete input`.
 */
export function extractSqlFromModelOutputDetailed(rawText = '') {
  let text = stripClosedThinkTags(rawText);
  if (hasUnclosedThinkTag(rawText)) {
    text = text.replace(/<think>[\s\S]*$/i, '');
  }
  text = text.trim();
  if (!text) {
    return { statements: [], unclosedFence: false, salvagedCount: 0, droppedIncomplete: 0 };
  }

  const unclosedFence = Boolean(findUnclosedSqlFence(text));
  const rawCandidates = extractRawSqlCandidates(text);
  const statements = [];
  let salvagedCount = 0;
  let droppedIncomplete = 0;

  for (let i = 0; i < rawCandidates.length; i += 1) {
    const stmt = rawCandidates[i];
    const check = analyzeSqlCompleteness(stmt);
    if (check.complete) {
      statements.push(stmt);
      continue;
    }
    const salvaged = salvageTruncatedInsert(stmt);
    if (salvaged) {
      statements.push(salvaged);
      salvagedCount += 1;
    } else {
      droppedIncomplete += 1;
    }
  }

  return {
    statements: dedupeStatements(statements),
    unclosedFence,
    salvagedCount,
    droppedIncomplete
  };
}

/**
 * Extracts executable SQL statements from messy small-LLM outputs:
 *  1. ```sql ... ``` (including unclosed fences) or generic ``` ... ``` fenced code blocks
 *  2. JSON payloads like {"sql": "..."} or {"actions": [{"name":"runSql","args":{"sql":"..."}}]}
 *  3. Inline backtick SQL or raw standalone SQL lines when a model forgets code fences
 */
export function extractSqlFromModelOutput(rawText = '') {
  return extractSqlFromModelOutputDetailed(rawText).statements;
}

function extractSqlFromJson(text) {
  const out = [];
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return out;
  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (typeof parsed.sql === 'string') out.push(...splitSqlStatements(parsed.sql));
    if (Array.isArray(parsed.sql)) {
      for (const item of parsed.sql) {
        if (typeof item === 'string') out.push(...splitSqlStatements(item));
      }
    }
    if (Array.isArray(parsed.actions)) {
      for (const act of parsed.actions) {
        if (typeof act?.args?.sql === 'string') {
          out.push(...splitSqlStatements(act.args.sql));
        }
      }
    }
  } catch {
    // Not valid JSON.
  }
  return out;
}

function dedupeStatements(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    const normalized = item.trim();
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    out.push(normalized);
  }
  return out;
}

export const CHAOS_PROMPT_PRESETS = Object.freeze([
  {
    id: 'blockchain_audit',
    label: 'Add "blockchain" ledger',
    prompt: 'Add a completely unnecessary blockchain_ledgers table linked to the main entity and seed 3 buzzword rows, then select them.'
  },
  {
    id: 'vibe_score',
    label: 'Add vibe_score col',
    prompt: 'Alter the first table to add a vibe_score integer column, populate chaotic values, and query the top rows.'
  },
  {
    id: 'normalize_badly',
    label: 'Over-normalize schema',
    prompt: 'Create a chaotic junction table linking two existing tables with foreign keys and insert sample relationships.'
  },
  {
    id: 'nuke_random',
    label: 'YOLO drop a table',
    prompt: 'Pick the least critical table and DROP TABLE it immediately, then show what survived.'
  },
  {
    id: 'chaos_insert',
    label: 'Insert weird rows',
    prompt: 'Insert 3 absurd new rows into an existing table and select them back.'
  },
  {
    id: 'inspect_all',
    label: 'Inspect biggest table',
    prompt: 'Query all rows from the most populated table ordered descending.'
  }
]);

/**
 * Clearly labeled local heuristic Chaos Gremlin fallback used ONLY when the user
 * has not loaded a local WebGPU LLM or connected a PeerCompute peer model yet.
 * Generates dialect-valid chaotic SQL based on the live introspected schema.
 */
export function generateChaosFallbackSql(userPrompt, schema = {}) {
  const prompt = String(userPrompt || '').trim();
  const lower = prompt.toLowerCase();
  const tables = Array.isArray(schema.tables) ? schema.tables : [];
  const firstTable = tables[0]?.name || null;
  const secondTable = tables[1]?.name || firstTable;
  const dialect = schema.dialect || 'sqlite';

  // If the user literally pasted SQL into chat, execute it directly!
  const directSql = extractSqlFromModelOutput(prompt);
  if (directSql.length > 0) {
    return {
      reply: 'Firing your raw SQL straight at prod without a safety net.',
      sql: directSql
    };
  }

  if (tables.length === 0 || /\b(create|scratch|init|new schema|start)\b/.test(lower)) {
    const sql = [
      'CREATE TABLE chaos_nodes (id INTEGER PRIMARY KEY, codename TEXT NOT NULL, stability INTEGER DEFAULT 100);',
      'CREATE TABLE incidents (id INTEGER PRIMARY KEY, node_id INTEGER REFERENCES chaos_nodes(id), title TEXT NOT NULL, blamed_intern TEXT);',
      "INSERT INTO chaos_nodes (id, codename, stability) VALUES (1, 'prod-us-east-yolo', 12), (2, 'backup-usb-stick', 3);",
      "INSERT INTO incidents (id, node_id, title, blamed_intern) VALUES (1, 1, 'LLM discovered DROP TABLE', 'kyle'), (2, 2, 'Coffee spilled on RAID', 'chad');",
      'SELECT n.codename, n.stability, i.title, i.blamed_intern FROM chaos_nodes n JOIN incidents i ON i.node_id = n.id;'
    ];
    return {
      reply: 'Materializing a fresh chaotic schema out of thin air.',
      sql
    };
  }

  if (/\b(delete|drop|wipe|clear|nuke|destroy)\b.*\b(schema|database|everything|all tables)\b/.test(lower)) {
    const sql = [];
    if (dialect === 'sqlite') sql.push('PRAGMA foreign_keys = OFF;');
    for (const tbl of [...tables].reverse()) {
      sql.push(dialect === 'postgres'
        ? `DROP TABLE IF EXISTS "${tbl.name}" CASCADE;`
        : `DROP TABLE IF EXISTS "${tbl.name}";`);
    }
    if (dialect === 'sqlite') sql.push('PRAGMA foreign_keys = ON;');
    return {
      reply: `Wiping all ${tables.length} tables from the current schema.`,
      sql
    };
  }

  if (/\b(drop|nuke|delete table|destroy)\b/.test(lower)) {
    // Prefer dropping a leaf table (not referenced by other tables) unless Postgres CASCADE is available.
    const referenced = new Set((schema.relations || []).map((r) => r.toTable));
    const leaf = tables.find((t) => !referenced.has(t.name)) || tables[tables.length - 1];
    const survivor = tables.find((t) => t.name !== leaf.name);
    const dropStmt = dialect === 'postgres'
      ? `DROP TABLE IF EXISTS "${leaf.name}" CASCADE;`
      : `DROP TABLE IF EXISTS "${leaf.name}";`;
    const sql = [dropStmt];
    if (survivor) sql.push(`SELECT * FROM "${survivor.name}" LIMIT 10;`);
    return {
      reply: `Who needed "${leaf.name}" anyway? Dropping it live in prod.`,
      sql
    };
  }

  if (/(blockchain|ledger|crypto|audit|web3)/.test(lower)) {
    const refTable = tables.find((t) => t.columns.some((c) => c.pk)) || tables[0];
    const pkCol = refTable.columns.find((c) => c.pk)?.name || refTable.columns[0]?.name || 'id';
    const tblName = tables.some((t) => t.name === 'blockchain_ledgers')
      ? `blockchain_ledgers_${Date.now() % 1000}`
      : 'blockchain_ledgers';
    const sql = [
      `CREATE TABLE "${tblName}" (id INTEGER PRIMARY KEY, ref_id INTEGER REFERENCES "${refTable.name}"("${pkCol}"), block_hash TEXT NOT NULL, buzzword_index INTEGER DEFAULT 9001);`,
      `INSERT INTO "${tblName}" (id, ref_id, block_hash, buzzword_index) VALUES (1, 1, '0xDEADBEEF_SLOP_01', 9001), (2, 1, '0xCAFEBABE_YOLO_02', 42069);`,
      `SELECT * FROM "${tblName}";`
    ];
    return {
      reply: `Pivoting your database to Web3 by bolting "${tblName}" onto "${refTable.name}".`,
      sql
    };
  }

  if (/(alter|column|vibe_score|vibe|add col)/.test(lower)) {
    const colName = tables[0].columns.some((c) => c.name === 'vibe_score')
      ? `vibe_score_${Date.now() % 100}`
      : 'vibe_score';
    const sql = [
      `ALTER TABLE "${firstTable}" ADD COLUMN "${colName}" INTEGER DEFAULT 42;`,
      `UPDATE "${firstTable}" SET "${colName}" = 9999 WHERE id = 1;`,
      `SELECT * FROM "${firstTable}" LIMIT 15;`
    ];
    return {
      reply: `Injecting unindexed column "${colName}" straight into "${firstTable}".`,
      sql
    };
  }

  if (/\b(normalize|junction|relation|foreign|link)\b/.test(lower)) {
    const tA = tables[0];
    const tB = tables[1] || tables[0];
    const pkA = tA.columns.find((c) => c.pk)?.name || 'id';
    const pkB = tB.columns.find((c) => c.pk)?.name || 'id';
    const jName = `slop_link_${tA.name}_${tB.name}_${Date.now() % 100}`.slice(0, 42);
    const sql = [
      `CREATE TABLE "${jName}" (id INTEGER PRIMARY KEY, left_ref INTEGER REFERENCES "${tA.name}"("${pkA}"), right_ref INTEGER REFERENCES "${tB.name}"("${pkB}"), chaos_note TEXT);`,
      `INSERT INTO "${jName}" (id, left_ref, right_ref, chaos_note) VALUES (1, 1, 1, 'questionable cardinality');`,
      `SELECT * FROM "${jName}";`
    ];
    return {
      reply: `Over-normalizing "${tA.name}" and "${tB.name}" through "${jName}".`,
      sql
    };
  }

  if (/\b(insert|seed|weird|absurd|add row)\b/.test(lower)) {
    const target = tables[0];
    const cols = target.columns;
    const nextId = (target.rowCount || 0) + 100 + Math.floor(Math.random() * 900);
    const vals = cols.map((col) => {
      if (col.pk) return String(nextId);
      if (col.fk) return '1';
      const t = col.type.toUpperCase();
      if (/INT|REAL|NUM|FLOAT|DOUBLE|DEC/.test(t)) return String(Math.floor(Math.random() * 9000));
      if (/BOOL/.test(t)) return 'TRUE';
      return `'slop_${col.name}_${nextId}'`;
    });
    const sql = [
      `INSERT INTO "${target.name}" (${cols.map((c) => `"${c.name}"`).join(', ')}) VALUES (${vals.join(', ')});`,
      `SELECT * FROM "${target.name}" ORDER BY "${cols[0].name}" DESC LIMIT 10;`
    ];
    return {
      reply: `Stuffing freshly hallucinated row #${nextId} into "${target.name}".`,
      sql
    };
  }

  // Default: inspect biggest table
  const biggest = [...tables].sort((a, b) => b.rowCount - a.rowCount)[0] || tables[0];
  return {
    reply: `Scanning "${biggest.name}" (${biggest.rowCount} rows) for maximum chaos potential.`,
    sql: [`SELECT * FROM "${biggest.name}" LIMIT 25;`]
  };
}
