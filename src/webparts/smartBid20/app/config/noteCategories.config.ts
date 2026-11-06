import { BidNoteCategory, BidNoteSource } from "../models";

export interface INoteCategoryDef {
  value: BidNoteCategory;
  label: string;
  /** Theme token for the chip/accent. */
  color: string;
  /** Matching soft tint token. */
  soft: string;
}

export const NOTE_CATEGORIES: INoteCategoryDef[] = [
  {
    value: "comment",
    label: "Comment",
    color: "var(--primary-accent)",
    soft: "var(--accent-soft)",
  },
  {
    value: "pending",
    label: "Pending",
    color: "var(--warning)",
    soft: "var(--warning-soft)",
  },
  {
    value: "attention",
    label: "Attention",
    color: "var(--danger)",
    soft: "var(--danger-soft)",
  },
  {
    value: "info",
    label: "Info",
    color: "var(--info)",
    soft: "var(--info-soft)",
  },
];

export const getNoteCategoryDef = (
  category: BidNoteCategory | undefined,
): INoteCategoryDef =>
  NOTE_CATEGORIES.find((c) => c.value === category) || NOTE_CATEGORIES[0];

/** Titles of the notes kept by the Scope of Supply / Hours & Personnel tab fields. */
export const TAB_NOTE_TITLES: Record<Exclude<BidNoteSource, "manual">, string> =
  {
    scope: "Scope of Supply — Notes",
    hours: "Hours & Personnel — Notes",
  };

/** Tab that maintains a tab-sourced note. */
export const TAB_NOTE_TABS: Record<Exclude<BidNoteSource, "manual">, string> = {
  scope: "Scope of Supply",
  hours: "Hours & Personnel",
};

/** Autosave edits by the same user within this window update the note in place. */
export const TAB_NOTE_COALESCE_MS = 15 * 60 * 1000;
