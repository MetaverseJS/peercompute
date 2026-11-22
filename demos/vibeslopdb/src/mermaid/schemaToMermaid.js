/**
 * Deterministic schema -> Mermaid erDiagram generator.
 * Sanitizes arbitrary LLM-created identifiers and types so Mermaid 12.1.0
 * always parses cleanly even after unhinged YOLO DDL mutations.
 */

export function sanitizeMermaidId(raw, fallback = 'entity') {
  const cleaned = String(raw ?? '')
    .trim()
    .replace(/[^A-Za-z0-9_]/g, '_')
    .replace(/^_+|_+$/g, '');
  if (!cleaned) return fallback;
  return /^[0-9]/.test(cleaned) ? `t_${cleaned}` : cleaned;
}

export function sanitizeMermaidType(rawType) {
  const cleaned = String(rawType ?? 'TEXT')
    .trim()
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');
  return cleaned || 'any';
}

export function schemaToMermaidEr(schema = {}, { includeRowCounts = true } = {}) {
  const tables = Array.isArray(schema.tables) ? schema.tables : [];
  const relations = Array.isArray(schema.relations) ? schema.relations : [];

  if (tables.length === 0) {
    return [
      'erDiagram',
      '  EMPTY_DATABASE {',
      '    text status "No tables yet — unleash the LLM"',
      '  }'
    ].join('\n');
  }

  const idByTable = new Map();
  const usedIds = new Set();
  for (const tbl of tables) {
    let candidate = sanitizeMermaidId(tbl.name, 'table');
    let suffix = 2;
    while (usedIds.has(candidate)) {
      candidate = `${sanitizeMermaidId(tbl.name, 'table')}_${suffix++}`;
    }
    usedIds.add(candidate);
    idByTable.set(tbl.name, candidate);
  }

  const lines = ['erDiagram'];

  for (const tbl of tables) {
    const id = idByTable.get(tbl.name);
    const label = includeRowCounts ? `${tbl.name} (${tbl.rowCount})` : tbl.name;
    const safeLabel = label.replace(/"/g, "'");
    lines.push(`  ${id}["${safeLabel}"] {`);
    if (!tbl.columns || tbl.columns.length === 0) {
      lines.push('    any _empty_columns');
    } else {
      for (const col of tbl.columns.slice(0, 32)) {
        const colType = sanitizeMermaidType(col.type);
        const colName = sanitizeMermaidId(col.name, 'col');
        const keys = [];
        if (col.pk) keys.push('PK');
        if (col.fk) keys.push('FK');
        const keyToken = keys.length ? ` ${keys.join(',')}` : '';
        const comment = col.nullable === false && !col.pk ? ' "NOT NULL"' : '';
        lines.push(`    ${colType} ${colName}${keyToken}${comment}`);
      }
      if (tbl.columns.length > 32) {
        lines.push(`    text _more_cols "+${tbl.columns.length - 32} more"`);
      }
    }
    lines.push('  }');
  }

  const seenRel = new Set();
  for (const rel of relations) {
    const fromId = idByTable.get(rel.fromTable);
    const toId = idByTable.get(rel.toTable);
    if (!fromId || !toId) continue;
    const edgeKey = `${toId}|${fromId}|${rel.fromColumn}`;
    if (seenRel.has(edgeKey)) continue;
    seenRel.add(edgeKey);
    const relLabel = sanitizeMermaidId(rel.fromColumn, 'ref');
    lines.push(`  ${toId} ||--o{ ${fromId} : "${relLabel}"`);
  }

  return lines.join('\n');
}

export function buildSchemaContextSummary(schema = {}, recentLog = []) {
  const tables = Array.isArray(schema.tables) ? schema.tables : [];
  const header = `Active DB Engine: ${schema.engine || 'unknown'} (SQL dialect: ${schema.dialect || 'sql'})`;
  if (!tables.length) {
    return `${header}\nTables: (none — empty database)`;
  }
  const tableLines = tables.map((tbl) => {
    const cols = tbl.columns
      .map((c) => `${c.name} ${c.type}${c.pk ? ' PK' : ''}${c.fk ? ' FK' : ''}`)
      .join(', ');
    return `- ${tbl.name} (${tbl.rowCount} rows): ${cols}`;
  });
  const relLines = (schema.relations || []).map(
    (r) => `- ${r.fromTable}.${r.fromColumn} -> ${r.toTable}.${r.toColumn}`
  );
  const recentErrors = (recentLog || [])
    .filter((entry) => !entry.ok && entry.error)
    .slice(-2)
    .map((entry) => `- Last SQL error: ${entry.error}`);

  return [
    header,
    'Tables:',
    ...tableLines,
    ...(relLines.length ? ['Foreign Keys:', ...relLines] : []),
    ...(recentErrors.length ? ['Recent Errors:', ...recentErrors] : [])
  ].join('\n');
}
