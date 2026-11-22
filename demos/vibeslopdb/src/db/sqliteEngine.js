import initSqlJs from 'sql.js';
import { quoteIdent, splitSqlStatements } from './sqlUtils.js';

let sqlJsPromise = null;

async function loadSqlJs(options = {}) {
  if (sqlJsPromise && !options.forceReload) return sqlJsPromise;
  const locateFile = options.locateFile || (async () => {
    if (typeof window !== 'undefined') {
      const wasmMod = await import('sql.js/dist/sql-wasm.wasm?url');
      return () => wasmMod.default;
    }
    return undefined;
  });

  sqlJsPromise = (async () => {
    const resolvedLocator = typeof options.locateFile === 'function'
      ? options.locateFile
      : await locateFile();
    return initSqlJs(resolvedLocator ? { locateFile: resolvedLocator } : undefined);
  })();
  return sqlJsPromise;
}

export class SqliteWasmEngine {
  constructor(options = {}) {
    this.id = 'sqlite';
    this.label = 'SQLite WASM (sql.js)';
    this.dialect = 'sqlite';
    this.options = options;
    this.SQL = null;
    this.db = null;
  }

  async init() {
    this.SQL = await loadSqlJs(this.options);
    this.db = new this.SQL.Database();
    this.db.run('PRAGMA foreign_keys = ON;');
    return this;
  }

  async execute(sqlText) {
    if (!this.db) await this.init();
    const statements = splitSqlStatements(sqlText);
    const results = [];
    for (const stmt of statements) {
      const t0 = performance.now();
      const rawSets = this.db.exec(stmt);
      const durationMs = Number((performance.now() - t0).toFixed(2));
      const changes = this.db.getRowsModified();
      if (rawSets.length > 0) {
        const last = rawSets[rawSets.length - 1];
        results.push({
          sql: stmt,
          columns: last.columns,
          rows: last.values,
          rowCount: last.values.length,
          changes,
          durationMs
        });
      } else {
        results.push({
          sql: stmt,
          columns: [],
          rows: [],
          rowCount: 0,
          changes,
          durationMs
        });
      }
    }
    return {
      engine: this.id,
      statementCount: results.length,
      results
    };
  }

  async introspectSchema() {
    if (!this.db) await this.init();
    const tableSet = this.db.exec(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name;"
    );
    const tableNames = tableSet[0]?.values?.map((row) => String(row[0])) || [];
    const tables = [];
    const relations = [];

    for (const name of tableNames) {
      const qName = quoteIdent(name);
      const colInfo = this.db.exec(`PRAGMA table_info(${qName});`)[0]?.values || [];
      const fkInfo = this.db.exec(`PRAGMA foreign_key_list(${qName});`)[0]?.values || [];
      const fkCols = new Set(fkInfo.map((fk) => String(fk[3])));

      for (const fk of fkInfo) {
        relations.push({
          fromTable: name,
          fromColumn: String(fk[3]),
          toTable: String(fk[2]),
          toColumn: String(fk[4] || 'id')
        });
      }

      let rowCount = 0;
      try {
        const countRes = this.db.exec(`SELECT COUNT(*) FROM ${qName};`);
        rowCount = Number(countRes[0]?.values?.[0]?.[0] ?? 0);
      } catch {
        rowCount = 0;
      }

      const columns = colInfo.map((col) => ({
        name: String(col[1]),
        type: String(col[2] || 'ANY').toUpperCase(),
        nullable: Number(col[3]) === 0,
        defaultValue: col[4] ?? null,
        pk: Number(col[5]) > 0,
        fk: fkCols.has(String(col[1]))
      }));

      tables.push({ name, columns, rowCount });
    }

    return {
      engine: this.id,
      dialect: this.dialect,
      tables,
      relations
    };
  }

  async exportSnapshot() {
    if (!this.db) await this.init();
    return {
      engine: this.id,
      bytes: this.db.export()
    };
  }

  async restoreSnapshot(snapshot) {
    if (!this.SQL) await this.init();
    if (!snapshot || snapshot.engine !== this.id || !(snapshot.bytes instanceof Uint8Array)) {
      throw new Error('Invalid SQLite snapshot');
    }
    this.db?.close?.();
    this.db = new this.SQL.Database(snapshot.bytes);
    this.db.run('PRAGMA foreign_keys = ON;');
  }

  async reset() {
    if (!this.SQL) await this.init();
    this.db?.close?.();
    this.db = new this.SQL.Database();
    this.db.run('PRAGMA foreign_keys = ON;');
  }

  async dispose() {
    this.db?.close?.();
    this.db = null;
  }
}
