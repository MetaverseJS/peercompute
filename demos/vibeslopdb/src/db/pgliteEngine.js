import { PGlite } from '@electric-sql/pglite';
import { quoteIdent, splitSqlStatements, sqlLiteral } from './sqlUtils.js';

export class PGliteWasmEngine {
  constructor(options = {}) {
    this.id = 'pglite';
    this.label = 'PostgreSQL WASM (PGlite)';
    this.dialect = 'postgres';
    this.options = options;
    this.pg = null;
  }

  async init() {
    if (this.pg) return this;
    // In-memory PostgreSQL 17 WASM gives fast resets and zero leftover lock collisions.
    this.pg = new PGlite(this.options.dataDir || undefined);
    await this.pg.waitReady;
    return this;
  }

  async execute(sqlText) {
    if (!this.pg) await this.init();
    const statements = splitSqlStatements(sqlText);
    const results = [];
    for (const stmt of statements) {
      const t0 = performance.now();
      const res = await this.pg.query(stmt);
      const durationMs = Number((performance.now() - t0).toFixed(2));
      const columns = Array.isArray(res.fields) ? res.fields.map((f) => f.name) : [];
      const rows = Array.isArray(res.rows)
        ? res.rows.map((obj) => columns.map((c) => obj[c]))
        : [];
      results.push({
        sql: stmt,
        columns,
        rows,
        rowCount: rows.length,
        changes: Number.isFinite(res.affectedRows) ? res.affectedRows : 0,
        durationMs
      });
    }
    return {
      engine: this.id,
      statementCount: results.length,
      results
    };
  }

  async introspectSchema() {
    if (!this.pg) await this.init();
    const tblRes = await this.pg.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    const tableNames = tblRes.rows.map((r) => String(r.table_name));

    const pkRes = await this.pg.query(`
      SELECT tc.table_name, kcu.column_name
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      WHERE tc.table_schema = 'public' AND tc.constraint_type = 'PRIMARY KEY';
    `);
    const pkSet = new Set(pkRes.rows.map((r) => `${r.table_name}.${r.column_name}`));

    const fkRes = await this.pg.query(`
      SELECT
        kcu.table_name AS from_table,
        kcu.column_name AS from_column,
        ccu.table_name AS to_table,
        ccu.column_name AS to_column
      FROM information_schema.table_constraints tc
      JOIN information_schema.key_column_usage kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.table_schema = 'public' AND tc.constraint_type = 'FOREIGN KEY'
      ORDER BY kcu.table_name, kcu.column_name;
    `);
    const fkSet = new Set(fkRes.rows.map((r) => `${r.from_table}.${r.from_column}`));
    const relations = fkRes.rows.map((r) => ({
      fromTable: String(r.from_table),
      fromColumn: String(r.from_column),
      toTable: String(r.to_table),
      toColumn: String(r.to_column)
    }));

    const colRes = await this.pg.query(`
      SELECT table_name, column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_schema = 'public'
      ORDER BY table_name, ordinal_position;
    `);
    const colsByTable = new Map();
    for (const row of colRes.rows) {
      const tName = String(row.table_name);
      if (!colsByTable.has(tName)) colsByTable.set(tName, []);
      const cName = String(row.column_name);
      colsByTable.get(tName).push({
        name: cName,
        type: String(row.data_type || 'text').toUpperCase(),
        nullable: row.is_nullable === 'YES',
        defaultValue: row.column_default ?? null,
        pk: pkSet.has(`${tName}.${cName}`),
        fk: fkSet.has(`${tName}.${cName}`)
      });
    }

    const tables = [];
    for (const name of tableNames) {
      let rowCount = 0;
      try {
        const cnt = await this.pg.query(`SELECT COUNT(*)::int AS c FROM ${quoteIdent(name)};`);
        rowCount = Number(cnt.rows[0]?.c ?? 0);
      } catch {
        rowCount = 0;
      }
      tables.push({
        name,
        columns: colsByTable.get(name) || [],
        rowCount
      });
    }

    return {
      engine: this.id,
      dialect: this.dialect,
      tables,
      relations
    };
  }

  async exportSnapshot() {
    if (!this.pg) await this.init();
    const schema = await this.introspectSchema();
    const tableOrder = topologicalSortTables(schema.tables, schema.relations);
    const statements = [];

    for (const table of tableOrder) {
      const fkMap = new Map(
        schema.relations
          .filter((r) => r.fromTable === table.name)
          .map((r) => [r.fromColumn, r])
      );
      const colDefs = table.columns.map((col) => {
        const parts = [quoteIdent(col.name), normalizePgType(col.type)];
        if (col.pk) parts.push('PRIMARY KEY');
        else if (!col.nullable) parts.push('NOT NULL');
        const fk = fkMap.get(col.name);
        if (fk) parts.push(`REFERENCES ${quoteIdent(fk.toTable)}(${quoteIdent(fk.toColumn)})`);
        return parts.join(' ');
      });
      statements.push(`CREATE TABLE ${quoteIdent(table.name)} (${colDefs.join(', ')});`);
    }

    for (const table of tableOrder) {
      if (!table.columns.length) continue;
      const colNames = table.columns.map((c) => c.name);
      const dataRes = await this.pg.query(`SELECT * FROM ${quoteIdent(table.name)};`);
      for (const row of dataRes.rows) {
        const vals = colNames.map((c) => sqlLiteral(row[c]));
        statements.push(
          `INSERT INTO ${quoteIdent(table.name)} (${colNames.map(quoteIdent).join(', ')}) VALUES (${vals.join(', ')});`
        );
      }
    }

    return {
      engine: this.id,
      sqlDump: statements.join('\n')
    };
  }

  async restoreSnapshot(snapshot) {
    if (!snapshot || snapshot.engine !== this.id || typeof snapshot.sqlDump !== 'string') {
      throw new Error('Invalid PostgreSQL snapshot');
    }
    await this.reset();
    if (snapshot.sqlDump.trim()) {
      await this.execute(snapshot.sqlDump);
    }
  }

  async reset() {
    if (!this.pg) await this.init();
    await this.pg.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
  }

  async dispose() {
    if (this.pg) {
      await this.pg.close().catch(() => {});
      this.pg = null;
    }
  }
}

function normalizePgType(rawType) {
  const upper = String(rawType || 'TEXT').toUpperCase();
  if (upper === 'CHARACTER VARYING') return 'TEXT';
  if (upper === 'DOUBLE PRECISION') return 'DOUBLE PRECISION';
  return upper;
}

function topologicalSortTables(tables, relations) {
  const byName = new Map(tables.map((t) => [t.name, t]));
  const visited = new Set();
  const ordered = [];
  const visit = (name, stack = new Set()) => {
    if (visited.has(name) || stack.has(name)) return;
    const tbl = byName.get(name);
    if (!tbl) return;
    stack.add(name);
    for (const rel of relations) {
      if (rel.fromTable === name && rel.toTable !== name) {
        visit(rel.toTable, stack);
      }
    }
    stack.delete(name);
    visited.add(name);
    ordered.push(tbl);
  };
  for (const t of tables) visit(t.name);
  return ordered;
}
