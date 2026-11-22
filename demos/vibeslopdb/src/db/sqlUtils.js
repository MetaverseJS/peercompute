/**
 * SQL statement splitting and formatting utilities shared across
 * SQLite WASM, PostgreSQL PGlite WASM, and the IndexedDB SQL engine.
 */

export function splitSqlStatements(sqlText = '') {
  const input = String(sqlText ?? '');
  const statements = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;
  let dollarTag = null;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const next = input[i + 1] ?? '';

    if (inLineComment) {
      current += ch;
      if (ch === '\n') inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      current += ch;
      if (ch === '*' && next === '/') {
        current += next;
        i += 1;
        inBlockComment = false;
      }
      continue;
    }
    if (dollarTag) {
      if (input.startsWith(dollarTag, i)) {
        current += dollarTag;
        i += dollarTag.length - 1;
        dollarTag = null;
      } else {
        current += ch;
      }
      continue;
    }
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
      if (ch === '"' && next === '"') {
        current += next;
        i += 1;
      } else if (ch === '"') {
        inDouble = false;
      }
      continue;
    }

    if (ch === '-' && next === '-') {
      inLineComment = true;
      current += '--';
      i += 1;
      continue;
    }
    if (ch === '/' && next === '*') {
      inBlockComment = true;
      current += '/*';
      i += 1;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      current += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      current += ch;
      continue;
    }
    if (ch === '$') {
      const match = /^\$[A-Za-z_0-9]*\$/.exec(input.slice(i));
      if (match) {
        dollarTag = match[0];
        current += dollarTag;
        i += dollarTag.length - 1;
        continue;
      }
    }
    if (ch === ';') {
      const trimmed = stripLeadingComments(current).trim();
      if (trimmed) statements.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }

  const tail = stripLeadingComments(current).trim();
  if (tail) statements.push(current.trim());
  return statements;
}

export function stripLeadingComments(sql = '') {
  let s = String(sql).trim();
  while (s.length > 0) {
    if (s.startsWith('--')) {
      const nl = s.indexOf('\n');
      s = nl < 0 ? '' : s.slice(nl + 1).trim();
    } else if (s.startsWith('/*')) {
      const end = s.indexOf('*/');
      s = end < 0 ? '' : s.slice(end + 2).trim();
    } else {
      break;
    }
  }
  return s;
}

export function quoteIdent(name) {
  return `"${String(name ?? '').replace(/"/g, '""')}"`;
}

export function sqlLiteral(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
  if (typeof value === 'number') return Number.isFinite(value) ? String(value) : 'NULL';
  if (typeof value === 'bigint') return value.toString();
  if (value instanceof Uint8Array) {
    return `'\\x${Array.from(value, (b) => b.toString(16).padStart(2, '0')).join('')}'`;
  }
  if (typeof value === 'object') {
    return `'${JSON.stringify(value).replace(/'/g, "''")}'`;
  }
  return `'${String(value).replace(/'/g, "''")}'`;
}

export function formatCellValue(value) {
  if (value === null || value === undefined) return 'NULL';
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array) return `<${value.byteLength}B>`;
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}

export function formatAsciiTable(columns = [], rows = [], maxColWidth = 34) {
  if (!columns.length) return '(no columns)';
  const widths = columns.map((col, idx) => {
    let w = String(col).length;
    for (const row of rows.slice(0, 100)) {
      const val = formatCellValue(Array.isArray(row) ? row[idx] : row?.[col]);
      w = Math.max(w, Math.min(maxColWidth, val.length));
    }
    return Math.min(maxColWidth, Math.max(3, w));
  });
  const clip = (text, width) => {
    const str = String(text ?? '');
    if (str.length <= width) return str.padEnd(width, ' ');
    return `${str.slice(0, Math.max(1, width - 1))}…`;
  };
  const sep = `+${widths.map((w) => '-'.repeat(w + 2)).join('+')}+`;
  const header = `| ${columns.map((c, i) => clip(c, widths[i])).join(' | ')} |`;
  const body = rows.map((row) => `| ${columns.map((c, i) => {
    const raw = Array.isArray(row) ? row[i] : row?.[c];
    return clip(formatCellValue(raw), widths[i]);
  }).join(' | ')} |`);
  return [sep, header, sep, ...body, sep].join('\n');
}
