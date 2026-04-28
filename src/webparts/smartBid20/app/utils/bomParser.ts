/**
 * bomParser — Parses BOM CSV/XLSX files exported from Windchill (or similar PLM).
 * Extracts hierarchical Bill of Materials structure from Level, Name, Description, Qty columns.
 * Handles CSV values wrapped in ="..." notation.
 */
import { IBomCostItem } from "../models";

/** Generate a simple unique ID */
function uid(): string {
  return (
    "bom_" +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).substring(2, 8)
  );
}

/**
 * Strip ="..." wrappers and clean a CSV cell value.
 * Windchill CSVs export part numbers as ="0565157" to prevent Excel auto-formatting.
 */
function cleanCsvValue(val: string): string {
  if (!val) return "";
  let v = val.trim();
  // Remove leading = and surrounding quotes: ="0565157" → 0565157
  if (v.charAt(0) === "=" && v.charAt(1) === '"') {
    v = v.substring(2);
    if (v.charAt(v.length - 1) === '"') {
      v = v.substring(0, v.length - 1);
    }
  }
  // Remove bare leading = (CSV quote parser may have already stripped quotes)
  else if (v.charAt(0) === "=") {
    v = v.substring(1);
  }
  // Remove plain surrounding quotes
  if (v.length >= 2 && v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') {
    v = v.substring(1, v.length - 1);
  }
  return v.trim();
}

/**
 * Parse a raw CSV string into rows of string arrays.
 * Handles quoted fields with commas and newlines inside quotes.
 */
function parseCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text.charAt(i);
    const next = i + 1 < text.length ? text.charAt(i + 1) : "";

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        field += '"';
        i++; // skip escaped quote
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\r" && next === "\n") {
        current.push(field);
        field = "";
        rows.push(current);
        current = [];
        i++; // skip \n
      } else if (ch === "\n") {
        current.push(field);
        field = "";
        rows.push(current);
        current = [];
      } else {
        field += ch;
      }
    }
  }
  // Last field
  if (field.length > 0 || current.length > 0) {
    current.push(field);
    rows.push(current);
  }
  return rows;
}

/**
 * Find column indices by matching header names (case-insensitive).
 */
function findColumns(headers: string[]): {
  levelIdx: number;
  nameIdx: number;
  descIdx: number;
  qtyIdx: number;
  revIdx: number;
  fnIdx: number;
} {
  let levelIdx = -1;
  let nameIdx = -1;
  let descIdx = -1;
  let qtyIdx = -1;
  let revIdx = -1;
  let fnIdx = -1;

  headers.forEach((h, i) => {
    const lower = cleanCsvValue(h).toLowerCase();
    if (lower === "level") levelIdx = i;
    else if (lower === "name") nameIdx = i;
    else if (lower === "description") descIdx = i;
    else if (lower === "qty") qtyIdx = i;
    else if (lower === "revision") revIdx = i;
    else if (lower === "f/n") fnIdx = i;
  });

  return { levelIdx, nameIdx, descIdx, qtyIdx, revIdx, fnIdx };
}

/**
 * Build parent IDs from the level column.
 * Each item's parent is the most recent preceding item with level - 1.
 */
function assignParentIds(items: IBomCostItem[]): void {
  // Stack tracks the last item at each level
  const stack: Map<number, string> = new Map();

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const parentLevel = item.level - 1;

    if (parentLevel > 0 && stack.has(parentLevel)) {
      item.parentId = stack.get(parentLevel) || null;
    } else {
      item.parentId = null;
    }

    stack.set(item.level, item.id);
    // Clear deeper levels when we encounter a shallower item
    const keys: number[] = [];
    stack.forEach(function (_v, k) {
      keys.push(k);
    });
    keys.forEach(function (k) {
      if (k > item.level) stack.delete(k);
    });
  }
}

/**
 * Create an empty IBomCostItem with defaults.
 */
export function emptyItem(overrides: Partial<IBomCostItem>): IBomCostItem {
  return {
    id: uid(),
    level: 1,
    parentId: null,
    findNumber: "",
    partNumber: "",
    description: "",
    revision: "",
    qty: 0,
    costPerItemUSD: 0,
    contingencyPercent: 0,
    totalCostInclCont: 0,
    leadTimeDays: 0,
    costReference: "",
    dateReference: "",
    comments: "",
    sourceTab: "",
    originalCurrency: "",
    originalCost: 0,
    isManual: false,
    isRolledUp: false,
    ...overrides,
  };
}

/**
 * Parse a BOM CSV file (Windchill export format) into IBomCostItem[].
 * Expected columns: Level, Name, Revision, F/N, Description, State, Qty, ...
 * The CSV may have header/title rows before the actual data headers.
 */
export async function parseBomCSV(file: File): Promise<IBomCostItem[]> {
  const text = await file.text();
  const allRows = parseCSVRows(text);

  if (allRows.length < 2) return [];

  // Find the header row — look for a row containing "Level" and "Name"
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(allRows.length, 10); i++) {
    const row = allRows[i];
    const hasLevel = row.some(
      (cell) => cleanCsvValue(cell).toLowerCase() === "level",
    );
    const hasName = row.some(
      (cell) => cleanCsvValue(cell).toLowerCase() === "name",
    );
    if (hasLevel && hasName) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx < 0) return [];

  const headers = allRows[headerRowIdx];
  const cols = findColumns(headers);

  if (cols.levelIdx < 0 || cols.nameIdx < 0) return [];

  const items: IBomCostItem[] = [];

  for (let i = headerRowIdx + 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!row || row.length < 2) continue;

    const levelStr = cleanCsvValue(row[cols.levelIdx] || "");
    const level = parseInt(levelStr, 10);
    if (isNaN(level) || level < 1) continue;

    const partNumber = cleanCsvValue(row[cols.nameIdx] || "");
    if (!partNumber) continue;

    const description =
      cols.descIdx >= 0 ? cleanCsvValue(row[cols.descIdx] || "") : "";
    const qtyStr =
      cols.qtyIdx >= 0 ? cleanCsvValue(row[cols.qtyIdx] || "") : "0";
    const qty = parseFloat(qtyStr) || 0;
    const revision =
      cols.revIdx >= 0 ? cleanCsvValue(row[cols.revIdx] || "") : "";
    const findNumber =
      cols.fnIdx >= 0 ? cleanCsvValue(row[cols.fnIdx] || "") : "";

    items.push(
      emptyItem({
        level,
        partNumber,
        description,
        qty,
        revision,
        findNumber,
      }),
    );
  }

  assignParentIds(items);
  return items;
}

/**
 * Parse a BOM XLSX file into IBomCostItem[].
 * Same column structure as CSV, but loaded via SheetJS.
 */
export async function parseBomExcel(file: File): Promise<IBomCostItem[]> {
  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) return [];

  const allRows: any[][] = XLSX.utils.sheet_to_json(ws, {
    header: 1,
    defval: "",
  });

  if (allRows.length < 2) return [];

  // Find header row
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(allRows.length, 10); i++) {
    const row = allRows[i];
    const hasLevel = row.some(
      (cell: any) => String(cell).trim().toLowerCase() === "level",
    );
    const hasName = row.some(
      (cell: any) => String(cell).trim().toLowerCase() === "name",
    );
    if (hasLevel && hasName) {
      headerRowIdx = i;
      break;
    }
  }

  if (headerRowIdx < 0) return [];

  const headers: string[] = allRows[headerRowIdx].map((c: any) => String(c));
  const cols = findColumns(headers);

  if (cols.levelIdx < 0 || cols.nameIdx < 0) return [];

  const items: IBomCostItem[] = [];

  for (let i = headerRowIdx + 1; i < allRows.length; i++) {
    const row = allRows[i];
    if (!row || row.length < 2) continue;

    const level = parseInt(String(row[cols.levelIdx] || ""), 10);
    if (isNaN(level) || level < 1) continue;

    const partNumber = cleanCsvValue(String(row[cols.nameIdx] || ""));
    if (!partNumber) continue;

    const description =
      cols.descIdx >= 0 ? cleanCsvValue(String(row[cols.descIdx] || "")) : "";
    const qty =
      cols.qtyIdx >= 0 ? parseFloat(String(row[cols.qtyIdx] || "0")) || 0 : 0;
    const revision =
      cols.revIdx >= 0 ? cleanCsvValue(String(row[cols.revIdx] || "")) : "";
    const findNumber =
      cols.fnIdx >= 0 ? cleanCsvValue(String(row[cols.fnIdx] || "")) : "";

    items.push(
      emptyItem({
        level,
        partNumber,
        description,
        qty,
        revision,
        findNumber,
      }),
    );
  }

  assignParentIds(items);
  return items;
}
