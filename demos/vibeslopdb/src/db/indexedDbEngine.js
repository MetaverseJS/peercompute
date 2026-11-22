import { splitSqlStatements, stripLeadingComments } from './sqlUtils.js';

const META_STORE = '__vibeslop_meta__';

function unquote(token = '') {
  const trimmed = String(token).trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith('`') && trimmed.endsWith('`'))
    || (trimmed.startsWith('[') && trimmed.endsWith(']'))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function splitTopLevelCommas(text) {
  const parts = [];
  let current = '';
  let depth = 0;
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1] ?? '';
    if (inSingle) {
      current += ch;
      if (ch === "'" && next === "'") {
        current += next;
        i += 1;
      } else if (ch === "'") {
        inSingle = false;
      }
      continue;
    }
    if (inDouble) {
      current += ch;
      if (ch === '"') inDouble = false;
      continue;
    }
    if (ch === "'") { inSingle = true; current += ch; continue; }
    if (ch === '"') { inDouble = true; current += ch; continue; }
    if (ch === '(') { depth += 1; current += ch; continue; }
    if (ch === ')') { depth = Math.max(0, depth - 1); current += ch; continue; }
    if (ch === ',' && depth === 0) {
      parts.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }
  if (current.trim()) parts.push(current.trim());
  return parts;
}

function parseLiteral(raw) {
  const text = String(raw ?? '').trim();
  if (/^null$/i.test(text)) return null;
  if (/^true$/i.test(text)) return true;
  if (/^false$/i.test(text)) return false;
  if (text.startsWith("'") && text.endsWith("'")) {
    return text.slice(1, -1).replace(/''/g, "'");
  }
  if (/^-?\d+(\.\d+)?$/.test(text)) return Number(text);
  return unquote(text);
}

function resolveField(row, expr) {
  const clean = unquote(expr.trim());
  if (clean in row) return row[clean];
  const lower = clean.toLowerCase();
  for (const key of Object.keys(row)) {
    if (key.toLowerCase() === lower) return row[key];
  }
  if (clean.includes('.')) {
    const bare = clean.split('.').pop();
    if (bare in row) return row[bare];
    for (const key of Object.keys(row)) {
      if (key.toLowerCase() === bare.toLowerCase() || key.toLowerCase().endsWith(`.${bare.toLowerCase()}`)) {
        return row[key];
      }
    }
  }
  return undefined;
}

function evaluateWhere(row, whereClause) {
  if (!whereClause || !whereClause.trim()) return true;
  const orParts = splitLogical(whereClause, 'OR');
  if (orParts.length > 1) return orParts.some((part) => evaluateWhere(row, part));
  const andParts = splitLogical(whereClause, 'AND');
  if (andParts.length > 1) return andParts.every((part) => evaluateWhere(row, part));

  let expr = whereClause.trim();
  if (expr.startsWith('(') && expr.endsWith(')')) {
    return evaluateWhere(row, expr.slice(1, -1));
  }
  if (/^NOT\s+/i.test(expr)) {
    return !evaluateWhere(row, expr.replace(/^NOT\s+/i, ''));
  }

  const isNullMatch = /^(.+?)\s+IS\s+(NOT\s+)?NULL$/i.exec(expr);
  if (isNullMatch) {
    const val = resolveField(row, isNullMatch[1]);
    const isNull = val === null || val === undefined;
    return isNullMatch[2] ? !isNull : isNull;
  }

  const inMatch = /^(.+?)\s+(NOT\s+)?IN\s*\((.+)\)$/i.exec(expr);
  if (inMatch) {
    const val = resolveField(row, inMatch[1]);
    const list = splitTopLevelCommas(inMatch[3]).map(parseLiteral);
    const found = list.some((item) => item == val); // eslint-disable-line eqeqeq
    return inMatch[2] ? !found : found;
  }

  const likeMatch = /^(.+?)\s+(NOT\s+)?I?LIKE\s+(.+)$/i.exec(expr);
  if (likeMatch) {
    const val = String(resolveField(row, likeMatch[1]) ?? '');
    const pattern = String(parseLiteral(likeMatch[3]) ?? '');
    const regexStr = `^${pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.')}$`;
    const matched = new RegExp(regexStr, 'i').test(val);
    return likeMatch[2] ? !matched : matched;
  }

  const cmpMatch = /^(.+?)\s*(!=|<>|<=|>=|=|<|>)\s*(.+)$/.exec(expr);
  if (cmpMatch) {
    const lhsRaw = resolveField(row, cmpMatch[1]);
    const rhsVal = parseLiteral(cmpMatch[3]);
    const rhsResolved = rhsVal === cmpMatch[3].trim() && resolveField(row, cmpMatch[3]) !== undefined
      ? resolveField(row, cmpMatch[3])
      : rhsVal;
    const op = cmpMatch[2];
    if (lhsRaw === null || lhsRaw === undefined || rhsResolved === null || rhsResolved === undefined) {
      return op === '!=' || op === '<>' ? lhsRaw !== rhsResolved : false;
    }
    switch (op) {
      case '=': return lhsRaw == rhsResolved; // eslint-disable-line eqeqeq
      case '!=':
      case '<>': return lhsRaw != rhsResolved; // eslint-disable-line eqeqeq
      case '<': return lhsRaw < rhsResolved;
      case '<=': return lhsRaw <= rhsResolved;
      case '>': return lhsRaw > rhsResolved;
      case '>=': return lhsRaw >= rhsResolved;
      default: return false;
    }
  }

  return Boolean(resolveField(row, expr));
}

function splitLogical(text, keyword) {
  const out = [];
  let cur = '';
  let depth = 0;
  let inSingle = false;
  const upper = text.toUpperCase();
  const kw = ` ${keyword} `;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (ch === "'") { inSingle = !inSingle; cur += ch; continue; }
    if (!inSingle) {
      if (ch === '(') depth += 1;
      else if (ch === ')') depth = Math.max(0, depth - 1);
      if (depth === 0 && upper.startsWith(kw, i)) {
        out.push(cur.trim());
        cur = '';
        i += kw.length - 1;
        continue;
      }
    }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/**
 * Native browser IndexedDB persistence mirror: creates an actual IndexedDB
 * object store for every SQL table so users can inspect tables live inside
 * Chrome DevTools -> Application -> IndexedDB, while supporting Node unit tests
 * cleanly when globalThis.indexedDB is absent.
 */
class IndexedDbStorageBridge {
  constructor(dbName = 'vibeslopdb-idb-sql') {
    this.dbName = dbName;
    this.idb = typeof globalThis.indexedDB !== 'undefined' ? globalThis.indexedDB : null;
    this.db = null;
    this.version = 1;
  }

  async open(tableNames = []) {
    if (!this.idb) return;
    if (this.db) {
      const existing = new Set(Array.from(this.db.objectStoreNames));
      const needed = [META_STORE, ...tableNames];
      const matches = needed.every((n) => existing.has(n))
        && Array.from(existing).every((n) => needed.includes(n));
      if (matches) return;
      this.db.close();
      this.db = null;
      this.version += 1;
    }

    // Discover current stored version first so reopening across reloads never throws VersionError.
    const currentVersion = await new Promise((resolve) => {
      const probe = this.idb.open(this.dbName);
      probe.onsuccess = () => {
        const v = probe.result.version;
        probe.result.close();
        resolve(v);
      };
      probe.onerror = () => resolve(this.version);
    });
    const nextVersion = Math.max(this.version, currentVersion + 1);
    this.version = nextVersion;

    this.db = await new Promise((resolve, reject) => {
      const req = this.idb.open(this.dbName, nextVersion);
      req.onupgradeneeded = () => {
        const db = req.result;
        const desired = new Set([META_STORE, ...tableNames]);
        for (const existing of Array.from(db.objectStoreNames)) {
          if (!desired.has(existing)) db.deleteObjectStore(existing);
        }
        for (const storeName of desired) {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: '__rowid' });
          }
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error || new Error('IndexedDB open failed'));
    });
  }

  async syncAll(schemaMap, rowsMap) {
    if (!this.idb) return;
    const tableNames = [...schemaMap.keys()];
    await this.open(tableNames);
    if (!this.db) return;

    const storeNames = [META_STORE, ...tableNames];
    await new Promise((resolve, reject) => {
      const tx = this.db.transaction(storeNames, 'readwrite');
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('IndexedDB sync failed'));

      const metaStore = tx.objectStore(META_STORE);
      metaStore.clear();
      metaStore.put({
        __rowid: 'schema',
        tables: [...schemaMap.values()]
      });

      for (const name of tableNames) {
        const store = tx.objectStore(name);
        store.clear();
        const rows = rowsMap.get(name) || [];
        rows.forEach((row, idx) => {
          store.put({ __rowid: idx + 1, ...row });
        });
      }
    });
  }

  async close() {
    this.db?.close?.();
    this.db = null;
  }
}

export class IndexedDbSqlEngine {
  constructor(options = {}) {
    this.id = 'indexeddb';
    this.label = 'IndexedDB Relational SQL';
    this.dialect = 'indexeddb';
    this.dbName = options.dbName || 'vibeslopdb-idb-sql';
    this.tables = new Map(); // name -> { name, columns, relations, nextAutoId }
    this.rows = new Map(); // name -> Array<object>
    this.bridge = new IndexedDbStorageBridge(this.dbName);
  }

  async init() {
    await this.bridge.syncAll(this.tables, this.rows);
    return this;
  }

  _findTableName(rawName) {
    const clean = unquote(rawName);
    if (this.tables.has(clean)) return clean;
    const lower = clean.toLowerCase();
    for (const key of this.tables.keys()) {
      if (key.toLowerCase() === lower) return key;
    }
    return null;
  }

  async execute(sqlText) {
    const statements = splitSqlStatements(sqlText);
    const results = [];
    let mutated = false;

    for (const rawStmt of statements) {
      const stmt = stripLeadingComments(rawStmt).trim();
      if (!stmt) continue;
      const t0 = performance.now();
      const res = this._executeSingle(stmt);
      const durationMs = Number((performance.now() - t0).toFixed(2));
      if (res.mutated) mutated = true;
      results.push({
        sql: stmt,
        columns: res.columns || [],
        rows: res.rows || [],
        rowCount: (res.rows || []).length,
        changes: res.changes || 0,
        durationMs
      });
    }

    if (mutated) {
      await this.bridge.syncAll(this.tables, this.rows);
    }

    return {
      engine: this.id,
      statementCount: results.length,
      results
    };
  }

  _executeSingle(stmt) {
    const upper = stmt.toUpperCase();

    if (upper === 'SHOW TABLES' || upper === '.TABLES') {
      const names = [...this.tables.keys()].sort();
      return { columns: ['table_name', 'row_count'], rows: names.map((n) => [n, (this.rows.get(n) || []).length]) };
    }

    const descMatch = /^(?:DESCRIBE|DESC)\s+([^\s;]+)$/i.exec(stmt);
    if (descMatch) {
      const tName = this._findTableName(descMatch[1]);
      if (!tName) throw new Error(`Table not found: ${descMatch[1]}`);
      const tbl = this.tables.get(tName);
      return {
        columns: ['column', 'type', 'pk', 'fk', 'nullable'],
        rows: tbl.columns.map((c) => [c.name, c.type, c.pk, c.fk, c.nullable])
      };
    }

    if (/^CREATE\s+TABLE/i.test(stmt)) {
      return this._execCreateTable(stmt);
    }
    if (/^DROP\s+TABLE/i.test(stmt)) {
      return this._execDropTable(stmt);
    }
    if (/^ALTER\s+TABLE/i.test(stmt)) {
      return this._execAlterTable(stmt);
    }
    if (/^INSERT\s+/i.test(stmt)) {
      return this._execInsert(stmt);
    }
    if (/^UPDATE\s+/i.test(stmt)) {
      return this._execUpdate(stmt);
    }
    if (/^DELETE\s+/i.test(stmt)) {
      return this._execDelete(stmt);
    }
    if (/^SELECT\s+/i.test(stmt)) {
      return this._execSelect(stmt);
    }
    if (/^(BEGIN|COMMIT|ROLLBACK|PRAGMA)/i.test(stmt)) {
      return { columns: [], rows: [], changes: 0 };
    }
    throw new Error(`Unsupported SQL statement in IndexedDB engine: ${stmt.slice(0, 80)}`);
  }

  _execCreateTable(stmt) {
    const match = /^CREATE\s+TABLE\s+(IF\s+NOT\s+EXISTS\s+)?([^\s(]+)\s*\(([\s\S]+)\)$/i.exec(stmt);
    if (!match) throw new Error(`Invalid CREATE TABLE syntax: ${stmt}`);
    const ifNotExists = Boolean(match[1]);
    const name = unquote(match[2]);
    const existing = this._findTableName(name);
    if (existing) {
      if (ifNotExists) return { columns: [], rows: [], changes: 0 };
      throw new Error(`Table already exists: ${name}`);
    }

    const defs = splitTopLevelCommas(match[3]);
    const columns = [];
    const relations = [];

    for (const def of defs) {
      const fkConstraint = /^(?:CONSTRAINT\s+\S+\s+)?FOREIGN\s+KEY\s*\(([^)]+)\)\s*REFERENCES\s+([^\s(]+)\s*\(([^)]+)\)/i.exec(def);
      if (fkConstraint) {
        const fromCol = unquote(fkConstraint[1]);
        const toTable = unquote(fkConstraint[2]);
        const toCol = unquote(fkConstraint[3]);
        relations.push({ fromTable: name, fromColumn: fromCol, toTable, toColumn: toCol });
        const target = columns.find((c) => c.name.toLowerCase() === fromCol.toLowerCase());
        if (target) target.fk = true;
        continue;
      }
      const pkConstraint = /^(?:CONSTRAINT\s+\S+\s+)?PRIMARY\s+KEY\s*\(([^)]+)\)/i.exec(def);
      if (pkConstraint) {
        for (const pkCol of splitTopLevelCommas(pkConstraint[1]).map(unquote)) {
          const target = columns.find((c) => c.name.toLowerCase() === pkCol.toLowerCase());
          if (target) { target.pk = true; target.nullable = false; }
        }
        continue;
      }
      const colMatch = /^("[^"]+"|`[^`]+`|\[[^\]]+\]|[A-Za-z_][A-Za-z0-9_]*)\s+([A-Za-z0-9_()]+)([\s\S]*)$/.exec(def);
      if (!colMatch) continue;
      const colName = unquote(colMatch[1]);
      const colType = colMatch[2].toUpperCase();
      const rest = colMatch[3] || '';
      const pk = /\bPRIMARY\s+KEY\b/i.test(rest);
      const notNull = pk || /\bNOT\s+NULL\b/i.test(rest);
      const defaultMatch = /\bDEFAULT\s+('(?:''|[^'])*'|\S+)/i.exec(rest);
      const defaultValue = defaultMatch ? parseLiteral(defaultMatch[1]) : null;
      const refMatch = /\bREFERENCES\s+([^\s(]+)\s*\(([^)]+)\)/i.exec(rest);
      let fk = false;
      if (refMatch) {
        fk = true;
        relations.push({
          fromTable: name,
          fromColumn: colName,
          toTable: unquote(refMatch[1]),
          toColumn: unquote(refMatch[2])
        });
      }
      columns.push({ name: colName, type: colType, pk, fk, nullable: !notNull, defaultValue });
    }

    this.tables.set(name, { name, columns, relations, nextAutoId: 1 });
    this.rows.set(name, []);
    return { columns: [], rows: [], changes: 0, mutated: true };
  }

  _execDropTable(stmt) {
    const match = /^DROP\s+TABLE\s+(IF\s+EXISTS\s+)?([^\s;]+)(?:\s+CASCADE|\s+RESTRICT)?$/i.exec(stmt);
    if (!match) throw new Error(`Invalid DROP TABLE syntax: ${stmt}`);
    const ifExists = Boolean(match[1]);
    const tName = this._findTableName(match[2]);
    if (!tName) {
      if (ifExists) return { columns: [], rows: [], changes: 0 };
      throw new Error(`Table does not exist: ${match[2]}`);
    }
    this.tables.delete(tName);
    this.rows.delete(tName);
    return { columns: [], rows: [], changes: 1, mutated: true };
  }

  _execAlterTable(stmt) {
    const addMatch = /^ALTER\s+TABLE\s+([^\s]+)\s+ADD\s+(?:COLUMN\s+)?([^\s]+)\s+([A-Za-z0-9_()]+)([\s\S]*)$/i.exec(stmt);
    if (addMatch) {
      const tName = this._findTableName(addMatch[1]);
      if (!tName) throw new Error(`Table not found: ${addMatch[1]}`);
      const tbl = this.tables.get(tName);
      const colName = unquote(addMatch[2]);
      const colType = addMatch[3].toUpperCase();
      const rest = addMatch[4] || '';
      const defaultMatch = /\bDEFAULT\s+('(?:''|[^'])*'|\S+)/i.exec(rest);
      const defaultValue = defaultMatch ? parseLiteral(defaultMatch[1]) : null;
      const refMatch = /\bREFERENCES\s+([^\s(]+)\s*\(([^)]+)\)/i.exec(rest);
      let fk = false;
      if (refMatch) {
        fk = true;
        tbl.relations.push({
          fromTable: tName,
          fromColumn: colName,
          toTable: unquote(refMatch[1]),
          toColumn: unquote(refMatch[2])
        });
      }
      tbl.columns.push({ name: colName, type: colType, pk: false, fk, nullable: !/\bNOT\s+NULL\b/i.test(rest), defaultValue });
      for (const row of this.rows.get(tName) || []) {
        row[colName] = defaultValue;
      }
      return { columns: [], rows: [], changes: 0, mutated: true };
    }

    const dropMatch = /^ALTER\s+TABLE\s+([^\s]+)\s+DROP\s+(?:COLUMN\s+)?(?:IF\s+EXISTS\s+)?([^\s;]+)$/i.exec(stmt);
    if (dropMatch) {
      const tName = this._findTableName(dropMatch[1]);
      if (!tName) throw new Error(`Table not found: ${dropMatch[1]}`);
      const tbl = this.tables.get(tName);
      const colName = unquote(dropMatch[2]);
      tbl.columns = tbl.columns.filter((c) => c.name.toLowerCase() !== colName.toLowerCase());
      tbl.relations = tbl.relations.filter((r) => r.fromColumn.toLowerCase() !== colName.toLowerCase());
      for (const row of this.rows.get(tName) || []) {
        delete row[colName];
      }
      return { columns: [], rows: [], changes: 0, mutated: true };
    }

    const renameTblMatch = /^ALTER\s+TABLE\s+([^\s]+)\s+RENAME\s+TO\s+([^\s;]+)$/i.exec(stmt);
    if (renameTblMatch) {
      const oldName = this._findTableName(renameTblMatch[1]);
      if (!oldName) throw new Error(`Table not found: ${renameTblMatch[1]}`);
      const newName = unquote(renameTblMatch[2]);
      const tbl = this.tables.get(oldName);
      const rows = this.rows.get(oldName) || [];
      tbl.name = newName;
      for (const rel of tbl.relations) rel.fromTable = newName;
      this.tables.delete(oldName);
      this.rows.delete(oldName);
      this.tables.set(newName, tbl);
      this.rows.set(newName, rows);
      for (const other of this.tables.values()) {
        for (const rel of other.relations) {
          if (rel.toTable === oldName) rel.toTable = newName;
        }
      }
      return { columns: [], rows: [], changes: 0, mutated: true };
    }

    const renameColMatch = /^ALTER\s+TABLE\s+([^\s]+)\s+RENAME\s+(?:COLUMN\s+)?([^\s]+)\s+TO\s+([^\s;]+)$/i.exec(stmt);
    if (renameColMatch) {
      const tName = this._findTableName(renameColMatch[1]);
      if (!tName) throw new Error(`Table not found: ${renameColMatch[1]}`);
      const tbl = this.tables.get(tName);
      const oldCol = unquote(renameColMatch[2]);
      const newCol = unquote(renameColMatch[3]);
      const col = tbl.columns.find((c) => c.name.toLowerCase() === oldCol.toLowerCase());
      if (!col) throw new Error(`Column not found: ${oldCol}`);
      const actualOld = col.name;
      col.name = newCol;
      for (const row of this.rows.get(tName) || []) {
        row[newCol] = row[actualOld];
        delete row[actualOld];
      }
      return { columns: [], rows: [], changes: 0, mutated: true };
    }

    throw new Error(`Unsupported ALTER TABLE syntax in IndexedDB engine: ${stmt}`);
  }

  _execInsert(stmt) {
    const match = /^INSERT\s+(?:OR\s+(?:REPLACE|IGNORE)\s+)?INTO\s+([^\s(]+)\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+)$/i.exec(stmt);
    if (!match) throw new Error(`Invalid INSERT syntax: ${stmt}`);
    const tName = this._findTableName(match[1]);
    if (!tName) throw new Error(`Table not found: ${match[1]}`);
    const tbl = this.tables.get(tName);
    const colNames = match[2]
      ? splitTopLevelCommas(match[2]).map(unquote)
      : tbl.columns.map((c) => c.name);
    const tupleTexts = extractValueTuples(match[3]);
    const tableRows = this.rows.get(tName);

    let inserted = 0;
    for (const tupleText of tupleTexts) {
      const values = splitTopLevelCommas(tupleText).map(parseLiteral);
      const record = {};
      for (const col of tbl.columns) {
        record[col.name] = col.defaultValue ?? null;
      }
      colNames.forEach((col, idx) => {
        record[col] = values[idx] ?? null;
      });
      const pkCol = tbl.columns.find((c) => c.pk);
      if (pkCol && (record[pkCol.name] === null || record[pkCol.name] === undefined)) {
        record[pkCol.name] = tbl.nextAutoId++;
      } else if (pkCol && Number.isFinite(Number(record[pkCol.name]))) {
        tbl.nextAutoId = Math.max(tbl.nextAutoId, Number(record[pkCol.name]) + 1);
      }
      tableRows.push(record);
      inserted += 1;
    }

    return { columns: [], rows: [], changes: inserted, mutated: true };
  }

  _execUpdate(stmt) {
    const match = /^UPDATE\s+([^\s]+)\s+SET\s+([\s\S]+?)(?:\s+WHERE\s+([\s\S]+))?$/i.exec(stmt);
    if (!match) throw new Error(`Invalid UPDATE syntax: ${stmt}`);
    const tName = this._findTableName(match[1]);
    if (!tName) throw new Error(`Table not found: ${match[1]}`);
    const assignments = splitTopLevelCommas(match[2]).map((part) => {
      const eq = part.indexOf('=');
      if (eq < 0) throw new Error(`Invalid SET clause: ${part}`);
      return [unquote(part.slice(0, eq).trim()), part.slice(eq + 1).trim()];
    });
    const where = match[3] || '';
    let changed = 0;
    for (const row of this.rows.get(tName)) {
      if (!evaluateWhere(row, where)) continue;
      for (const [col, valExpr] of assignments) {
        row[col] = evaluateSimpleValueExpr(row, valExpr);
      }
      changed += 1;
    }
    return { columns: [], rows: [], changes: changed, mutated: changed > 0 };
  }

  _execDelete(stmt) {
    const match = /^DELETE\s+FROM\s+([^\s]+)(?:\s+WHERE\s+([\s\S]+))?$/i.exec(stmt);
    if (!match) throw new Error(`Invalid DELETE syntax: ${stmt}`);
    const tName = this._findTableName(match[1]);
    if (!tName) throw new Error(`Table not found: ${match[1]}`);
    const where = match[2] || '';
    const existing = this.rows.get(tName);
    const kept = [];
    let removed = 0;
    for (const row of existing) {
      if (evaluateWhere(row, where)) removed += 1;
      else kept.push(row);
    }
    this.rows.set(tName, kept);
    return { columns: [], rows: [], changes: removed, mutated: removed > 0 };
  }

  _execSelect(stmt) {
    const match = /^SELECT\s+(DISTINCT\s+)?([\s\S]+?)(?:\s+FROM\s+([\s\S]+))?$/i.exec(stmt);
    if (!match) throw new Error(`Invalid SELECT syntax: ${stmt}`);
    const distinct = Boolean(match[1]);
    const projectionStr = match[2].trim();
    const rest = match[3] || '';

    if (!rest.trim()) {
      const exprs = splitTopLevelCommas(projectionStr);
      const cols = exprs.map((e, i) => `col_${i + 1}`);
      const vals = exprs.map((e) => parseLiteral(e));
      return { columns: cols, rows: [vals] };
    }

    const { fromSection, whereClause, groupByClause, orderByClause, limitCount } = parseSelectClauses(rest);
    let workingRows = this._buildFromRows(fromSection);
    if (whereClause) {
      workingRows = workingRows.filter((row) => evaluateWhere(row, whereClause));
    }

    const selectItems = splitTopLevelCommas(projectionStr);
    const hasAggregate = selectItems.some((item) => /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/i.test(item));

    let outColumns = [];
    let outRows = [];

    if (hasAggregate || groupByClause) {
      const groupKeys = groupByClause ? splitTopLevelCommas(groupByClause) : [];
      const groups = new Map();
      for (const row of workingRows) {
        const key = groupKeys.length
          ? JSON.stringify(groupKeys.map((k) => resolveField(row, k)))
          : '__all__';
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(row);
      }
      if (groups.size === 0 && !groupKeys.length) groups.set('__all__', []);

      outColumns = selectItems.map((item) => extractAlias(item).alias);
      for (const groupRows of groups.values()) {
        outRows.push(selectItems.map((item) => evalAggregateExpr(extractAlias(item).expr, groupRows)));
      }
    } else {
      const expanded = [];
      for (const item of selectItems) {
        if (item.trim() === '*') {
          const sampleKeys = workingRows[0]
            ? Object.keys(workingRows[0]).filter((k) => !k.includes('.'))
            : this._defaultColumnsFromFrom(fromSection);
          for (const k of sampleKeys) expanded.push({ expr: k, alias: k });
        } else {
          expanded.push(extractAlias(item));
        }
      }
      outColumns = expanded.map((e) => e.alias);
      const projectedObjects = workingRows.map((row) => {
        const values = expanded.map((e) => resolveField(row, e.expr) ?? null);
        return { row, values };
      });

      if (orderByClause) {
        const orderParts = splitTopLevelCommas(orderByClause).map((p) => {
          const m = /^(.+?)(?:\s+(ASC|DESC))?$/i.exec(p.trim());
          return { expr: m[1].trim(), dir: (m[2] || 'ASC').toUpperCase() === 'DESC' ? -1 : 1 };
        });
        projectedObjects.sort((a, b) => {
          for (const { expr, dir } of orderParts) {
            const aliasIdx = outColumns.findIndex((c) => c.toLowerCase() === unquote(expr).toLowerCase());
            const va = aliasIdx >= 0 ? a.values[aliasIdx] : resolveField(a.row, expr);
            const vb = aliasIdx >= 0 ? b.values[aliasIdx] : resolveField(b.row, expr);
            if (va == null && vb == null) continue;
            if (va == null) return 1;
            if (vb == null) return -1;
            if (va < vb) return -1 * dir;
            if (va > vb) return 1 * dir;
          }
          return 0;
        });
      }

      outRows = projectedObjects.map((p) => p.values);
    }

    if (distinct) {
      const seen = new Set();
      outRows = outRows.filter((r) => {
        const key = JSON.stringify(r);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    if (Number.isFinite(limitCount) && limitCount >= 0) {
      outRows = outRows.slice(0, limitCount);
    }

    return { columns: outColumns, rows: outRows };
  }

  _defaultColumnsFromFrom(fromSection) {
    const firstTblMatch = /^([^\s,]+)/.exec(fromSection.trim());
    if (!firstTblMatch) return [];
    const tName = this._findTableName(firstTblMatch[1]);
    return tName ? this.tables.get(tName).columns.map((c) => c.name) : [];
  }

  _buildFromRows(fromSection) {
    const joinRegex = /\b(LEFT\s+OUTER|LEFT|INNER|CROSS)?\s*JOIN\s+([^\s]+)(?:\s+(?:AS\s+)?([A-Za-z_][A-Za-z0-9_]*))?\s+ON\s+([\s\S]+?)(?=\b(?:LEFT|INNER|CROSS)?\s*JOIN\b|$)/gi;
    const firstJoinIdx = fromSection.search(/\b(?:LEFT\s+OUTER|LEFT|INNER|CROSS)?\s*JOIN\b/i);
    const basePart = (firstJoinIdx >= 0 ? fromSection.slice(0, firstJoinIdx) : fromSection).trim();
    const baseMatch = /^([^\s]+)(?:\s+(?:AS\s+)?([A-Za-z_][A-Za-z0-9_]*))?$/i.exec(basePart);
    if (!baseMatch) throw new Error(`Invalid FROM clause: ${fromSection}`);
    const baseTable = this._findTableName(baseMatch[1]);
    if (!baseTable) throw new Error(`Table not found: ${baseMatch[1]}`);
    const baseAlias = baseMatch[2] || baseTable;

    let combined = (this.rows.get(baseTable) || []).map((row) => prefixRow(row, baseAlias));
    if (firstJoinIdx < 0) return combined;

    const joinsStr = fromSection.slice(firstJoinIdx);
    let m;
    while ((m = joinRegex.exec(joinsStr)) !== null) {
      const joinKind = (m[1] || 'INNER').toUpperCase();
      const rightTable = this._findTableName(m[2]);
      if (!rightTable) throw new Error(`Joined table not found: ${m[2]}`);
      const rightAlias = m[3] || rightTable;
      const onClause = m[4].trim();
      const rightRows = this.rows.get(rightTable) || [];
      const rightCols = this.tables.get(rightTable).columns.map((c) => c.name);
      const nextCombined = [];

      for (const leftRow of combined) {
        let matchedAny = false;
        for (const rRow of rightRows) {
          const merged = { ...leftRow, ...prefixRow(rRow, rightAlias) };
          if (evaluateWhere(merged, onClause)) {
            nextCombined.push(merged);
            matchedAny = true;
          }
        }
        if (!matchedAny && joinKind.startsWith('LEFT')) {
          const nullRight = {};
          for (const col of rightCols) {
            nullRight[`${rightAlias}.${col}`] = null;
          }
          nextCombined.push({ ...leftRow, ...nullRight });
        }
      }
      combined = nextCombined;
    }
    return combined;
  }

  async introspectSchema() {
    const tables = [];
    const relations = [];
    for (const name of [...this.tables.keys()].sort()) {
      const tbl = this.tables.get(name);
      tables.push({
        name,
        columns: tbl.columns.map((c) => ({ ...c })),
        rowCount: (this.rows.get(name) || []).length
      });
      for (const rel of tbl.relations) {
        relations.push({ ...rel });
      }
    }
    return {
      engine: this.id,
      dialect: this.dialect,
      tables,
      relations
    };
  }

  async exportSnapshot() {
    return {
      engine: this.id,
      tables: structuredClone([...this.tables.entries()]),
      rows: structuredClone([...this.rows.entries()])
    };
  }

  async restoreSnapshot(snapshot) {
    if (!snapshot || snapshot.engine !== this.id) {
      throw new Error('Invalid IndexedDB snapshot');
    }
    this.tables = new Map(structuredClone(snapshot.tables));
    this.rows = new Map(structuredClone(snapshot.rows));
    await this.bridge.syncAll(this.tables, this.rows);
  }

  async reset() {
    this.tables.clear();
    this.rows.clear();
    await this.bridge.syncAll(this.tables, this.rows);
  }

  async dispose() {
    await this.bridge.close();
  }
}

function prefixRow(row, alias) {
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    out[k] = v;
    out[`${alias}.${k}`] = v;
  }
  return out;
}

function extractValueTuples(valuesText) {
  const tuples = [];
  let inSingle = false;
  let depth = 0;
  let start = -1;
  for (let i = 0; i < valuesText.length; i += 1) {
    const ch = valuesText[i];
    const next = valuesText[i + 1] ?? '';
    if (inSingle) {
      if (ch === "'" && next === "'") i += 1;
      else if (ch === "'") inSingle = false;
      continue;
    }
    if (ch === "'") { inSingle = true; continue; }
    if (ch === '(') {
      if (depth === 0) start = i + 1;
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        tuples.push(valuesText.slice(start, i));
        start = -1;
      }
    }
  }
  return tuples;
}

function evaluateSimpleValueExpr(row, expr) {
  const arithMatch = /^(.+?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)$/.exec(expr);
  if (arithMatch && !expr.trim().startsWith("'")) {
    const base = Number(resolveField(row, arithMatch[1]));
    const delta = Number(arithMatch[3]);
    if (Number.isFinite(base) && Number.isFinite(delta)) {
      if (arithMatch[2] === '+') return base + delta;
      if (arithMatch[2] === '-') return base - delta;
      if (arithMatch[2] === '*') return base * delta;
      if (arithMatch[2] === '/' && delta !== 0) return base / delta;
    }
  }
  return parseLiteral(expr);
}

function parseSelectClauses(rest) {
  let limitCount = null;
  let body = rest;
  const limitMatch = /\s+LIMIT\s+(\d+)\s*$/i.exec(body);
  if (limitMatch) {
    limitCount = Number(limitMatch[1]);
    body = body.slice(0, limitMatch.index);
  }
  let orderByClause = '';
  const orderMatch = /\s+ORDER\s+BY\s+([\s\S]+)$/i.exec(body);
  if (orderMatch) {
    orderByClause = orderMatch[1].trim();
    body = body.slice(0, orderMatch.index);
  }
  let groupByClause = '';
  const groupMatch = /\s+GROUP\s+BY\s+([\s\S]+)$/i.exec(body);
  if (groupMatch) {
    groupByClause = groupMatch[1].trim();
    body = body.slice(0, groupMatch.index);
  }
  let whereClause = '';
  const whereMatch = /\s+WHERE\s+([\s\S]+)$/i.exec(body);
  if (whereMatch) {
    whereClause = whereMatch[1].trim();
    body = body.slice(0, whereMatch.index);
  }
  return {
    fromSection: body.trim(),
    whereClause,
    groupByClause,
    orderByClause,
    limitCount
  };
}

function extractAlias(item) {
  const asMatch = /^([\s\S]+?)\s+AS\s+([A-Za-z_"`[][^\s]*)$/i.exec(item.trim());
  if (asMatch) {
    return { expr: asMatch[1].trim(), alias: unquote(asMatch[2]) };
  }
  const clean = item.trim();
  const bare = clean.includes('.') && !clean.includes('(') ? clean.split('.').pop() : clean;
  return { expr: clean, alias: unquote(bare) };
}

function evalAggregateExpr(expr, rows) {
  const agg = /^(COUNT|SUM|AVG|MIN|MAX)\s*\(([^)]+)\)$/i.exec(expr.trim());
  if (!agg) {
    return rows[0] ? (resolveField(rows[0], expr) ?? null) : null;
  }
  const fn = agg[1].toUpperCase();
  const arg = agg[2].trim();
  if (fn === 'COUNT') {
    if (arg === '*') return rows.length;
    return rows.filter((r) => resolveField(r, arg) != null).length;
  }
  const nums = rows.map((r) => Number(resolveField(r, arg))).filter((n) => Number.isFinite(n));
  if (!nums.length) return null;
  if (fn === 'SUM') return nums.reduce((a, b) => a + b, 0);
  if (fn === 'AVG') return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(4));
  if (fn === 'MIN') return Math.min(...nums);
  if (fn === 'MAX') return Math.max(...nums);
  return null;
}
