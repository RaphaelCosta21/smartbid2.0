/**
 * IBidNotes — Notas de análise freeform (Gap Analysis, Qualifications, etc.)
 */
export interface IBidNote {
  id: string;
  section: string;
  title: string;
  content: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
}

export type BidNoteSection =
  | "gap-analysis"
  | "qualifications"
  | "assumptions"
  | "exclusions"
  | "risks"
  | "clarifications"
  | "general";

export interface IBidNotesMap {
  [section: string]: string;
}
