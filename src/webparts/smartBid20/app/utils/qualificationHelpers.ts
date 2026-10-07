/**
 * qualificationHelpers — BID qualification tables (Category + Qualification rows)
 * and their rows in the Qualifications Database library.
 */
import { IBid, IQualificationItem, IQualificationTable } from "../models/IBid";
import {
  IQualificationDbItem,
  IQualificationTableChanges,
} from "../models/IQualificationDb";
import { IConfigOption } from "../models/ISystemConfig";
import { makeId } from "./idGenerator";

export const DEFAULT_QUALIFICATION_TABLE = "Qualifications";

/** A qualification to add to the BID tables; it lands in the table with the same title. */
export interface IQualificationDraft {
  tableTitle: string;
  category: string;
  qualification: string;
  libraryRefId?: number;
  scopeItemId?: string | null;
}

export function qualificationTableKey(title: string): string {
  return (title || "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function findQualificationTable(
  tables: IQualificationTable[],
  title: string,
): IQualificationTable | undefined {
  const key = qualificationTableKey(title);
  return key
    ? tables.find((t) => qualificationTableKey(t.title) === key)
    : undefined;
}

function nextItemNumber(items: IQualificationItem[]): number {
  return items.reduce((max, i) => Math.max(max, i.item || 0), 0) + 1;
}

function normalizeItem(
  q: IQualificationItem,
  tableCategory: string,
): IQualificationItem {
  const item: IQualificationItem = {
    id: q.id,
    item: q.item,
    category:
      typeof q.category === "string"
        ? q.category
        : (q.description || "").trim() || tableCategory,
    qualification:
      typeof q.qualification === "string" ? q.qualification : q.comments || "",
  };
  if (q.libraryRefId) item.libraryRefId = q.libraryRefId;
  if (q.scopeItemId) item.scopeItemId = q.scopeItemId;
  return item;
}

/** Reads legacy tables (Description / Comments, table-wide category) as Category / Qualification rows. */
export function normalizeQualificationTables(
  tables?: IQualificationTable[] | null,
): IQualificationTable[] {
  return (tables || []).map((t) => ({
    id: t.id,
    title: t.title || "",
    items: (t.items || []).map((q) => normalizeItem(q, t.category || "")),
  }));
}

/** Appends each draft to the table with the same title, creating the table when missing. */
export function mergeQualificationsIntoTables(
  tables: IQualificationTable[],
  drafts: IQualificationDraft[],
): IQualificationTable[] {
  const next = tables.map((t) => ({ ...t, items: [...t.items] }));
  drafts.forEach((d) => {
    const title = d.tableTitle.trim() || DEFAULT_QUALIFICATION_TABLE;
    let table = findQualificationTable(next, title);
    if (!table) {
      table = { id: makeId("q"), title, items: [] };
      next.push(table);
    }
    const item: IQualificationItem = {
      id: makeId("q"),
      item: nextItemNumber(table.items),
      category: d.category.trim(),
      qualification: d.qualification.trim(),
    };
    if (d.libraryRefId) item.libraryRefId = d.libraryRefId;
    if (d.scopeItemId) item.scopeItemId = d.scopeItemId;
    table.items.push(item);
  });
  return next;
}

/** Saves one item into the table titled `tableTitle`, moving it out of any other table. */
export function upsertQualificationItem(
  tables: IQualificationTable[],
  tableTitle: string,
  item: IQualificationItem,
): IQualificationTable[] {
  const title = tableTitle.trim() || DEFAULT_QUALIFICATION_TABLE;
  const target = findQualificationTable(tables, title);
  const rest = tables.map((t) =>
    t === target ? t : { ...t, items: t.items.filter((i) => i.id !== item.id) },
  );
  if (!target) {
    return rest.concat([
      { id: makeId("q"), title, items: [{ ...item, item: 1 }] },
    ]);
  }
  const existing = target.items.find((i) => i.id === item.id);
  const items = existing
    ? target.items.map((i) =>
        i.id === item.id ? { ...item, item: existing.item } : i,
      )
    : target.items.concat([{ ...item, item: nextItemNumber(target.items) }]);
  return rest.map((t) => (t === target ? { ...t, items } : t));
}

export function removeScopeQualifications(
  tables: IQualificationTable[],
  scopeItemId: string,
): IQualificationTable[] {
  return tables.map((t) => ({
    ...t,
    items: t.items.filter((i) => i.scopeItemId !== scopeItemId),
  }));
}

export function findScopeQualification(
  tables: IQualificationTable[],
  scopeItemId: string,
): { table: IQualificationTable; item: IQualificationItem } | undefined {
  for (const table of tables) {
    const item = table.items.find((i) => i.scopeItemId === scopeItemId);
    if (item) return { table, item };
  }
  return undefined;
}

/** Stores the configured value when the typed text names a category, otherwise the text as typed. */
export function qualificationCategoryValue(
  options: IConfigOption[],
  typed: string,
): string {
  const key = typed.trim().toLowerCase();
  const match = key
    ? options.find(
        (o) => o.label.toLowerCase() === key || o.value.toLowerCase() === key,
      )
    : undefined;
  return match ? match.value : typed;
}

/**
 * Library rows for a completed BID: every table item with text, except the
 * ones imported from the library.
 */
export function buildQualificationLibraryRowsFromBid(
  bid: IBid,
): IQualificationDbItem[] {
  const rows: IQualificationDbItem[] = [];
  normalizeQualificationTables(bid.qualificationTables).forEach((t) => {
    const tableTitle = t.title.trim() || DEFAULT_QUALIFICATION_TABLE;
    t.items.forEach((q) => {
      const qualification = q.qualification.trim();
      if (q.libraryRefId || !qualification) return;
      rows.push({
        id: 0,
        tableTitle,
        category: q.category.trim(),
        qualification,
        client: (bid.opportunityInfo && bid.opportunityInfo.client) || "",
        division: bid.division || "",
        serviceLine: bid.serviceLine || "",
        sourceBidNumber: bid.bidNumber,
        sourceTableId: t.id,
        sourceItemId: q.id,
        itemOrder: q.item,
      });
    });
  });
  return rows;
}

// ─── Qualifications Database tables ───

const MANUAL_TABLE_PREFIX = "manual:";

/** Table a library row belongs to: stored key, else its source BID table, else its title. */
export function qualificationLibraryTableKey(item: IQualificationDbItem): string {
  if (item.tableKey) return item.tableKey;
  return item.sourceBidNumber
    ? `bid:${item.sourceBidNumber}:${item.sourceTableId || qualificationTableKey(item.tableTitle)}`
    : `${MANUAL_TABLE_PREFIX}${qualificationTableKey(item.tableTitle)}`;
}

export function newManualQualificationTableKey(): string {
  return `${MANUAL_TABLE_PREFIX}${makeId("qt")}`;
}

export function isManualQualificationTableKey(key: string): boolean {
  return key.indexOf(MANUAL_TABLE_PREFIX) === 0;
}

/** Rows of one library table in item order (legacy rows without order keep creation order). */
export function qualificationLibraryTableRows(
  items: IQualificationDbItem[],
  key: string,
): IQualificationDbItem[] {
  return items
    .filter((i) => qualificationLibraryTableKey(i) === key)
    .sort((a, b) => (a.itemOrder || 0) - (b.itemOrder || 0) || a.id - b.id);
}

/** Item number for a row appended to these library rows. */
export function nextLibraryItemOrder(rows: IQualificationDbItem[]): number {
  return rows.reduce((max, r) => Math.max(max, r.itemOrder || 0), rows.length) + 1;
}

/** Key of the manual library table with this title; empty when none. */
export function findManualQualificationTableKey(
  items: IQualificationDbItem[],
  title: string,
): string {
  const titleKey = qualificationTableKey(title);
  if (!titleKey) return "";
  for (const item of items) {
    const key = qualificationLibraryTableKey(item);
    if (
      isManualQualificationTableKey(key) &&
      qualificationTableKey(item.tableTitle) === titleKey
    )
      return key;
  }
  return "";
}

export interface IQualificationTableDraftRow {
  uid: string;
  /** Library row being edited; undefined for a new row */
  original?: IQualificationDbItem;
  category: string;
  qualification: string;
}

export interface IQualificationTableDraft {
  tableKey: string;
  title: string;
  client: string;
  division: string;
  serviceLine: string;
  rows: IQualificationTableDraftRow[];
  deletedIds: number[];
  /** Item number of the first row (appending continues after the existing rows) */
  firstOrder: number;
}

const sameRow = (a: IQualificationDbItem, b: IQualificationDbItem): boolean =>
  a.tableTitle === b.tableTitle &&
  a.category === b.category &&
  a.qualification === b.qualification &&
  a.client === b.client &&
  a.division === b.division &&
  a.serviceLine === b.serviceLine &&
  (a.itemOrder || 0) === (b.itemOrder || 0) &&
  (a.tableKey || "") === (b.tableKey || "");

/**
 * Library rows to create / update / delete for a table edited in the editor.
 * Rows synced from a BID keep their table title, client, division and service line.
 */
export function buildQualificationTableChanges(
  draft: IQualificationTableDraft,
): IQualificationTableChanges {
  const create: IQualificationDbItem[] = [];
  const update: IQualificationDbItem[] = [];
  const title = draft.title.trim();
  let order = draft.firstOrder;
  draft.rows.forEach((r) => {
    const category = r.category.trim();
    const qualification = r.qualification.trim();
    const o = r.original;
    if (!o) {
      if (!qualification) return;
      create.push({
        id: 0,
        tableTitle: title,
        category,
        qualification,
        client: draft.client,
        division: draft.division,
        serviceLine: draft.serviceLine,
        sourceBidNumber: "",
        sourceTableId: "",
        sourceItemId: "",
        itemOrder: order++,
        tableKey: draft.tableKey,
      });
      return;
    }
    const fromBid = !!o.sourceBidNumber;
    const next: IQualificationDbItem = {
      ...o,
      tableTitle: fromBid ? o.tableTitle : title,
      category,
      qualification,
      client: fromBid ? o.client : draft.client,
      division: fromBid ? o.division : draft.division,
      serviceLine: fromBid ? o.serviceLine : draft.serviceLine,
      itemOrder: order++,
      tableKey: fromBid ? o.tableKey : draft.tableKey,
    };
    if (!sameRow(o, next)) update.push(next);
  });
  return { create, update, deleteIds: draft.deletedIds };
}

export interface IQualificationUsage {
  bid: IBid;
  /** Library rows of the lookup that this BID imported */
  libraryIds: number[];
}

/** BIDs whose qualification tables imported any of these library rows. */
export function qualificationLibraryUsage(
  bids: IBid[],
  ids: number[],
): IQualificationUsage[] {
  const wanted: Record<number, boolean> = {};
  ids.forEach((id) => {
    wanted[id] = true;
  });
  const usage: IQualificationUsage[] = [];
  bids.forEach((bid) => {
    const hits: number[] = [];
    (bid.qualificationTables || []).forEach((t) =>
      (t.items || []).forEach((i) => {
        const ref = i.libraryRefId;
        if (ref && wanted[ref] && hits.indexOf(ref) < 0) hits.push(ref);
      }),
    );
    if (hits.length > 0) usage.push({ bid, libraryIds: hits });
  });
  return usage;
}
