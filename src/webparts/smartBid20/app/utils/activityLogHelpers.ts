import { isToday, isYesterday } from "date-fns";
import { IActivityLogEntry } from "../models";
import { makeId } from "./idGenerator";
import { formatDate } from "./formatters";

export type ActivityCategory =
  | "statusPhase"
  | "approvals"
  | "documents"
  | "edits"
  | "exports"
  | "lifecycle";

export const ACTIVITY_CATEGORIES: { key: ActivityCategory; label: string }[] = [
  { key: "statusPhase", label: "Status & Phase" },
  { key: "approvals", label: "Approvals" },
  { key: "documents", label: "Documents" },
  { key: "edits", label: "Edits" },
  { key: "exports", label: "Exports" },
  { key: "lifecycle", label: "Lifecycle" },
];

export interface IActivityMeta {
  label: string;
  category: ActivityCategory;
  colorVar: string;
}

const ACTIVITY_META: Record<string, IActivityMeta> = {
  BID_CREATED: {
    label: "BID created",
    category: "lifecycle",
    colorVar: "var(--success)",
  },
  // Legacy type written by UnassignedRequestsPage on assignment
  PHASE_CHANGE: {
    label: "BID assigned",
    category: "lifecycle",
    colorVar: "var(--secondary-accent)",
  },
  REVISION_STARTED: {
    label: "Revision started",
    category: "lifecycle",
    colorVar: "var(--tertiary-accent)",
  },
  REVISION_CLOSED: {
    label: "Revision closed",
    category: "lifecycle",
    colorVar: "var(--tertiary-accent)",
  },
  STATUS_CHANGED: {
    label: "Status changed",
    category: "statusPhase",
    colorVar: "var(--primary-accent)",
  },
  PHASE_CHANGED: {
    label: "Phase changed",
    category: "statusPhase",
    colorVar: "var(--tertiary-accent)",
  },
  APPROVAL_REQUESTED: {
    label: "Approval requested",
    category: "approvals",
    colorVar: "var(--warning)",
  },
  APPROVAL_RESPONSE: {
    label: "Approval response",
    category: "approvals",
    colorVar: "var(--success)",
  },
  APPROVAL_OVERRIDE: {
    label: "Approval override",
    category: "approvals",
    colorVar: "var(--tertiary-accent)",
  },
  APPROVAL_SECTOR_WAIVED: {
    label: "Approval waived",
    category: "approvals",
    colorVar: "var(--warning)",
  },
  APPROVAL_SECTOR_REINSTATED: {
    label: "Approval reinstated",
    category: "approvals",
    colorVar: "var(--primary-accent)",
  },
  DOCUMENT_CHANGE: {
    label: "Documents updated",
    category: "documents",
    colorVar: "var(--info)",
  },
  ERN_LINKED: {
    label: "ERN linked",
    category: "documents",
    colorVar: "var(--secondary-accent)",
  },
  ERN_CHANGED: {
    label: "ERN changed",
    category: "documents",
    colorVar: "var(--warning)",
  },
  FIELD_UPDATED: {
    label: "Field updated",
    category: "edits",
    colorVar: "var(--warning)",
  },
  EDIT_IN_TERMINAL: {
    label: "Edited after closing",
    category: "edits",
    colorVar: "var(--warning)",
  },
  DUE_DATE_CHANGED: {
    label: "Due date changed",
    category: "edits",
    colorVar: "var(--warning)",
  },
  "ai-import": {
    label: "AI analysis imported",
    category: "edits",
    colorVar: "var(--tertiary-accent)",
  },
  COMMENT_ADDED: {
    label: "Comment added",
    category: "edits",
    colorVar: "var(--info)",
  },
  BID_EXPORTED: {
    label: "BID exported",
    category: "exports",
    colorVar: "var(--secondary-accent)",
  },
  BID_EXPORTED_UNAPPROVED: {
    label: "Exported without approval",
    category: "exports",
    colorVar: "var(--danger)",
  },
};

export function getActivityMeta(type: string): IActivityMeta {
  return (
    ACTIVITY_META[type] || {
      label: "Activity",
      category: "edits",
      colorVar: "var(--text-muted)",
    }
  );
}

export interface IActivityDayGroup {
  key: string;
  label: string;
  entries: IActivityLogEntry[];
}

/** Expects entries already sorted; preserves their order within each day. */
export function groupActivityByDay(
  entries: IActivityLogEntry[],
): IActivityDayGroup[] {
  const groups: IActivityDayGroup[] = [];
  const byKey: Record<string, IActivityDayGroup> = {};
  entries.forEach((entry) => {
    const d = new Date(entry.timestamp);
    const valid = !isNaN(d.getTime());
    const key = valid ? formatDate(entry.timestamp, "yyyy-MM-dd") : "unknown";
    if (!byKey[key]) {
      let label = "Unknown date";
      if (valid) {
        label = isToday(d)
          ? "Today"
          : isYesterday(d)
            ? "Yesterday"
            : formatDate(entry.timestamp, "EEEE, MMM d, yyyy");
      }
      byKey[key] = { key, label, entries: [] };
      groups.push(byKey[key]);
    }
    byKey[key].entries.push(entry);
  });
  return groups;
}

/**
 * Creates a new activity log entry with a unique ID and current timestamp.
 */
export function createActivityLogEntry(
  type: string,
  description: string,
  actor: string,
  actorName: string,
  metadata?: Record<string, unknown>,
): IActivityLogEntry {
  return {
    id: makeId("log"),
    type,
    timestamp: new Date().toISOString(),
    actor,
    actorName,
    description,
    metadata: metadata || {},
  };
}
