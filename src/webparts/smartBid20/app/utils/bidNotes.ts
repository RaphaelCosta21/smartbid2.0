import {
  BidNoteCategory,
  IBid,
  IBidNote,
  IBidNoteRevision,
  IPersonRef,
} from "../models";
import {
  TAB_NOTE_COALESCE_MS,
  TAB_NOTE_TITLES,
} from "../config/noteCategories.config";
import { makeId } from "./idGenerator";

type TabNoteSource = "scope" | "hours";

/** Key of bidNotes that keeps the Commercial request notes (not part of the unified list). */
export const REQUEST_NOTES_KEY = "general";

const LEGACY_TAB_KEYS: TabNoteSource[] = ["scope", "hours"];

const unknownPerson = (name?: string): IPersonRef => ({
  name: name || "Unknown",
  email: "",
});

export const toPersonRef = (user: {
  displayName?: string;
  email?: string;
  photoUrl?: string;
}): IPersonRef => ({
  name: user.displayName || user.email || "Unknown",
  email: user.email || "",
  ...(user.photoUrl ? { photoUrl: user.photoUrl } : {}),
});

const sameEmail = (a?: string, b?: string): boolean =>
  !!a && !!b && a.trim().toLowerCase() === b.trim().toLowerCase();

/** Same person — by email, or by name for legacy notes saved without one. */
export const isSamePerson = (
  person: IPersonRef | undefined,
  user: { displayName?: string; email?: string } | undefined,
): boolean => {
  if (!person || !user) return false;
  if (person.email) return sameEmail(person.email, user.email);
  return !!person.name && person.name === user.displayName;
};

/** Converts the pre-unification structures (bidNotes, quickNotes, comments) into notes. */
function migrateLegacyNotes(bid: IBid): IBidNote[] {
  const out: IBidNote[] = [];
  const notes = (bid.bidNotes || {}) as Record<string, string>;
  const meta = bid.bidNotesMetadata || {};
  const fallbackDate = bid.createdDate || bid.lastModified || "";

  Object.keys(notes).forEach((key) => {
    if (key === REQUEST_NOTES_KEY) return;
    const text = notes[key];
    if (typeof text !== "string" || !text.trim()) return;
    const m = meta[key];
    const tabSource = LEGACY_TAB_KEYS.indexOf(key as TabNoteSource) >= 0;
    out.push({
      id: `legacy-note-${key}`,
      title: tabSource ? TAB_NOTE_TITLES[key as TabNoteSource] : key,
      text,
      category: "info",
      pinned: true,
      source: tabSource ? (key as TabNoteSource) : "manual",
      author: unknownPerson(m && m.author),
      createdAt: (m && m.date) || fallbackDate,
      ...(m && m.lastEditedBy
        ? {
            updatedBy: unknownPerson(m.lastEditedBy),
            updatedAt: m.lastEditedDate || "",
          }
        : {}),
      history: [],
    });
  });

  (bid.quickNotes || []).forEach((qn) => {
    if (!qn || !qn.text) return;
    out.push({
      id: qn.id,
      text: qn.text,
      category: "comment",
      pinned: false,
      source: "manual",
      author: qn.author || unknownPerson(),
      createdAt: qn.createdAt || fallbackDate,
      history: [],
    });
  });

  (bid.comments || []).forEach((c) => {
    if (!c || !c.text) return;
    out.push({
      id: c.id,
      text: c.text,
      category: "comment",
      pinned: false,
      source: "manual",
      author: c.author || unknownPerson(),
      createdAt: c.timestamp || fallbackDate,
      ...(c.isEdited && c.editedAt
        ? { updatedBy: c.author, updatedAt: c.editedAt }
        : {}),
      history: [],
    });
  });

  return out;
}

/** All notes of a BID (including soft-deleted ones), migrating legacy data on the fly. */
export function getBidNotes(bid: IBid | null | undefined): IBidNote[] {
  if (!bid) return [];
  if (Array.isArray(bid.noteEntries)) return bid.noteEntries;
  return migrateLegacyNotes(bid);
}

export const isActiveNote = (note: IBidNote): boolean => !note.deleted;

/** Active notes worth listing — a cleared Scope / Hours field keeps its note (history) but is hidden. */
export const isListedNote = (note: IBidNote): boolean =>
  isActiveNote(note) && (note.source === "manual" || !!note.text.trim());

export const isOpenPending = (note: IBidNote): boolean =>
  isActiveNote(note) && note.category === "pending" && !note.resolved;

export const countOpenPending = (bid: IBid | null | undefined): number =>
  getBidNotes(bid).filter(isOpenPending).length;

const noteTime = (n: IBidNote): number => {
  const t = Date.parse(n.createdAt || "");
  return isNaN(t) ? 0 : t;
};

const tabRank = (n: IBidNote): number =>
  n.source === "scope" ? 0 : n.source === "hours" ? 1 : 2;

/** Notes tab order: pinned first, then newest first. */
export const sortNotesForList = (notes: IBidNote[]): IBidNote[] =>
  notes.slice().sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return noteTime(b) - noteTime(a);
  });

/** Overview order: tab notes (Scope, Hours) first, then chronological. */
export const sortNotesForOverview = (notes: IBidNote[]): IBidNote[] =>
  notes.slice().sort((a, b) => {
    const r = tabRank(a) - tabRank(b);
    return r !== 0 ? r : noteTime(a) - noteTime(b);
  });

/**
 * Patch that persists the unified list. The first write also clears the legacy
 * structures (Commercial request notes in bidNotes.general are kept).
 */
export function buildNotesPatch(bid: IBid, notes: IBidNote[]): Partial<IBid> {
  const patch: Partial<IBid> = { noteEntries: notes };
  const legacy = (bid.bidNotes || {}) as Record<string, string>;
  const hasLegacy =
    Object.keys(legacy).some((k) => k !== REQUEST_NOTES_KEY) ||
    (bid.quickNotes || []).length > 0 ||
    (bid.comments || []).length > 0 ||
    Object.keys(bid.bidNotesMetadata || {}).length > 0;
  if (hasLegacy) {
    patch.bidNotes =
      legacy[REQUEST_NOTES_KEY] !== undefined
        ? { [REQUEST_NOTES_KEY]: legacy[REQUEST_NOTES_KEY] }
        : {};
    patch.bidNotesMetadata = {};
    patch.quickNotes = [];
    patch.comments = [];
  }
  return patch;
}

export interface INoteDraft {
  title?: string;
  text: string;
  category: BidNoteCategory;
  pinned: boolean;
}

export function createNote(draft: INoteDraft, by: IPersonRef): IBidNote {
  const title = (draft.title || "").trim();
  return {
    id: makeId("note"),
    ...(title ? { title } : {}),
    text: draft.text.trim(),
    category: draft.category,
    pinned: draft.pinned,
    source: "manual",
    author: by,
    createdAt: new Date().toISOString(),
    resolved: null,
    deleted: null,
    history: [],
  };
}

const snapshot = (note: IBidNote): IBidNoteRevision => ({
  ...(note.title ? { title: note.title } : {}),
  text: note.text,
  category: note.category,
  editedBy: note.updatedBy || note.author,
  editedAt: note.updatedAt || note.createdAt,
});

/** Applies content changes, keeping the previous version in the note history. */
export function editNote(
  note: IBidNote,
  changes: Partial<Pick<IBidNote, "title" | "text" | "category">>,
  by: IPersonRef,
): IBidNote {
  const next: IBidNote = { ...note, ...changes };
  if (changes.title !== undefined) {
    const title = changes.title.trim();
    if (title) next.title = title;
    else delete next.title;
  }
  if (changes.text !== undefined) next.text = changes.text.trim();
  const changed =
    next.text !== note.text ||
    (next.title || "") !== (note.title || "") ||
    next.category !== note.category;
  if (!changed) return note;
  if (next.category !== "pending") next.resolved = null;
  return {
    ...next,
    updatedBy: by,
    updatedAt: new Date().toISOString(),
    history: [...(note.history || []), snapshot(note)],
  };
}

export const setNotePinned = (note: IBidNote, pinned: boolean): IBidNote => ({
  ...note,
  pinned,
});

export const setNoteResolved = (
  note: IBidNote,
  resolved: boolean,
  by: IPersonRef,
): IBidNote => ({
  ...note,
  resolved: resolved ? { by, at: new Date().toISOString() } : null,
});

export const softDeleteNote = (note: IBidNote, by: IPersonRef): IBidNote => ({
  ...note,
  deleted: { by, at: new Date().toISOString() },
});

export const replaceNote = (
  notes: IBidNote[],
  updated: IBidNote,
): IBidNote[] => notes.map((n) => (n.id === updated.id ? updated : n));

export const findTabNote = (
  notes: IBidNote[],
  source: TabNoteSource,
): IBidNote | undefined =>
  notes.find((n) => n.source === source && isActiveNote(n));

/**
 * Upserts the note kept by the Scope / Hours "Notes / Comments" field.
 * Autosave edits by the same user within TAB_NOTE_COALESCE_MS update in place;
 * otherwise the previous version goes to the history. Returns null when nothing changed.
 */
export function upsertTabNote(
  notes: IBidNote[],
  source: TabNoteSource,
  text: string,
  by: IPersonRef,
): IBidNote[] | null {
  const now = new Date();
  const existing = findTabNote(notes, source);
  if (!existing) {
    if (!text.trim()) return null;
    const note: IBidNote = {
      id: makeId(`note-${source}`),
      title: TAB_NOTE_TITLES[source],
      text,
      category: "info",
      pinned: true,
      source,
      author: by,
      createdAt: now.toISOString(),
      resolved: null,
      deleted: null,
      history: [],
    };
    return [...notes, note];
  }
  if (existing.text === text) return null;
  const lastBy = existing.updatedBy || existing.author;
  const lastAt = Date.parse(existing.updatedAt || existing.createdAt || "");
  const coalesce =
    sameEmail(lastBy.email, by.email) &&
    !isNaN(lastAt) &&
    now.getTime() - lastAt < TAB_NOTE_COALESCE_MS;
  const updated: IBidNote = {
    ...existing,
    text,
    updatedBy: by,
    updatedAt: now.toISOString(),
    history: coalesce
      ? existing.history || []
      : [...(existing.history || []), snapshot(existing)],
  };
  return replaceNote(notes, updated);
}

/* ─── Permissions ─── */

export interface INotePermissionContext {
  user: { displayName?: string; email?: string } | null | undefined;
  /** Notes tab level allows adding/editing. */
  canEdit: boolean;
  /** Notes tab level allows deleting (full Edit, not Edit*). */
  canDelete: boolean;
  /** Engineering / super admin: may manage every note. */
  isModerator: boolean;
  /** BID is in a terminal status (no active revision). */
  isTerminal: boolean;
}

export const canManageNote = (
  note: IBidNote,
  ctx: INotePermissionContext,
): boolean =>
  ctx.canEdit &&
  isActiveNote(note) &&
  (ctx.isModerator || isSamePerson(note.author, ctx.user || undefined));

/** Text of tab notes is edited only in their own tab. */
export const canEditNoteContent = (
  note: IBidNote,
  ctx: INotePermissionContext,
): boolean => note.source === "manual" && canManageNote(note, ctx);

export const canDeleteNote = (
  note: IBidNote,
  ctx: INotePermissionContext,
): boolean =>
  note.source === "manual" &&
  ctx.canDelete &&
  !ctx.isTerminal &&
  canManageNote(note, ctx);

/** True when the patch removes or soft-deletes a note that exists on the BID. */
export function patchRemovesNotes(bid: IBid, patch: Partial<IBid>): boolean {
  if (patch.noteEntries === undefined) return false;
  const next = patch.noteEntries || [];
  return getBidNotes(bid).some((before) => {
    const after = next.find((n) => n.id === before.id);
    return !after || (!before.deleted && !!after.deleted);
  });
}
