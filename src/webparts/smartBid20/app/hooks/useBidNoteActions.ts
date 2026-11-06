import * as React from "react";
import { IBid, IBidNote, IPersonRef, IUser } from "../models";
import { canModerateNotes } from "../utils/accessControl";
import {
  INoteDraft,
  INotePermissionContext,
  buildNotesPatch,
  canDeleteNote,
  canManageNote,
  createNote,
  getBidNotes,
  replaceNote,
  softDeleteNote,
  toPersonRef,
} from "../utils/bidNotes";

export interface IBidNoteAccess {
  /** Notes tab level allows adding/editing. */
  canEdit: boolean;
  /** Notes tab level allows deleting. */
  canDelete: boolean;
  isTerminal: boolean;
  onSave?: (patch: Partial<IBid>) => void;
}

export interface IBidNoteActions {
  notes: IBidNote[];
  ctx: INotePermissionContext;
  by: IPersonRef;
  add: (draft: INoteDraft) => void;
  update: (note: IBidNote) => void;
  remove: (note: IBidNote) => void;
}

/** Unified BID notes + permission context + persistence (Notes tab and Overview). */
export function useBidNoteActions(
  bid: IBid,
  access: IBidNoteAccess,
  currentUser: IUser | null | undefined,
): IBidNoteActions {
  const { canEdit, canDelete, isTerminal, onSave } = access;
  const notes = React.useMemo(() => getBidNotes(bid), [bid]);
  const by = toPersonRef(currentUser || {});
  const ctx: INotePermissionContext = {
    user: currentUser,
    canEdit: canEdit && !!onSave,
    canDelete,
    isModerator: canModerateNotes(currentUser),
    isTerminal,
  };
  const commit = (next: IBidNote[]): void => {
    if (onSave) onSave(buildNotesPatch(bid, next));
  };
  return {
    notes,
    ctx,
    by,
    add: (draft) => {
      if (!ctx.canEdit || !draft.text.trim()) return;
      commit([...notes, createNote(draft, by)]);
    },
    update: (note) => {
      const old = notes.find((n) => n.id === note.id);
      if (!old || !canManageNote(old, ctx)) return;
      commit(replaceNote(notes, note));
    },
    remove: (note) => {
      const old = notes.find((n) => n.id === note.id);
      if (!old || !canDeleteNote(old, ctx)) return;
      commit(replaceNote(notes, softDeleteNote(old, by)));
    },
  };
}
