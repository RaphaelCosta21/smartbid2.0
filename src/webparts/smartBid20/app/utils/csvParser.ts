/**
 * csvParser — Minimal RFC 4180 CSV parser (quoted fields, "" escapes,
 * commas/newlines inside quotes, LF or CRLF line endings).
 */

/**
 * Parse a raw CSV string into rows of string arrays.
 * Slices unquoted runs instead of appending char-by-char — large exports
 * (300K+ rows) parse several times faster.
 */
export function parseCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;
  let start = 0;
  const n = text.length;

  for (let i = 0; i < n; i++) {
    const c = text.charCodeAt(i);
    if (inQuotes) {
      if (c === 34) {
        field += text.slice(start, i);
        if (text.charCodeAt(i + 1) === 34) {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
        start = i + 1;
      }
    } else if (c === 34) {
      field += text.slice(start, i);
      inQuotes = true;
      start = i + 1;
    } else if (c === 44) {
      current.push(field + text.slice(start, i));
      field = "";
      start = i + 1;
    } else if (c === 10 || (c === 13 && text.charCodeAt(i + 1) === 10)) {
      current.push(field + text.slice(start, i));
      field = "";
      rows.push(current);
      current = [];
      if (c === 13) i++;
      start = i + 1;
    }
  }
  field += text.slice(start);
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }
  return rows;
}
