/**
 * IErn — Engineering Request Number (ERN) models.
 * Maps to the same-site SharePoint list "Engineering Requestt".
 * See Inspiration/ERN_INTEGRATION_GUIDE.md for the full column reference.
 */

/** ERN as read from the SharePoint list. */
export interface IErn {
  /** SharePoint item Id */
  id: number;
  /** ERN Number, e.g. "ERN-42" (Title) */
  title: string;
  /** Current status (field_1), e.g. "Open", "Completed", "On Hold" */
  status: string;
  /** Engineering Due Date (field_4) — ISO string */
  dueDate: string;
  /** Released / Finish Date (FinishDate) — ISO string */
  finishDate: string;
  /** Project Title (ProjectTitle) */
  projectTitle: string;
  /** Project Number (field_14) */
  projectNumber: string;
  /** Detailed Deliverable Description (field_2) */
  description: string;
  /** Deliverable Type (field_20, multi-select) joined with ", " */
  deliverableType: string;
}

/** Payload written to SharePoint when creating a new ERN. */
export interface IErnCreateData {
  /* ── Page 1 — Request Info ── */
  /** Type of Request (field_12) — hardcoded "Project" */
  field_12: string;
  /** Service Line (ServiceLine) — choice */
  ServiceLine: string;
  /** Content Action (field_28) — "Create" | "Revise" */
  field_28: string;
  /** Revision Reason (RevisionReason) — only when field_28 = "Revise" */
  RevisionReason?: string;
  /** Project Number (field_14) */
  field_14: string;
  /** Project Name (field_15) */
  field_15: string;
  /** Project Title (ProjectTitle) */
  ProjectTitle: string;
  /** Deliverable Type (field_20) — MUST be sent as an array in the POST body */
  field_20: string;

  /* ── Page 2 — Schedule & Resources ── */
  /** Eng Due Date (field_4) — ISO string */
  field_4: string;
  /** Checker Due Date (CheckerDueDate) — ISO string */
  CheckerDueDate: string;
  /** Lead Date (LeadDate) — ISO string */
  LeadDate: string;
  /** Resource 1 name (Resource1) */
  Resource1: string;
  /** Resource 1 email (EmailResource1) */
  EmailResource1: string;
  /** Checker name (Resource3) */
  Resource3: string;
  /** Checker email (EmailChecker) */
  EmailChecker: string;
  /** Lead name (Lead) */
  Lead: string;
  /** Lead email (LeadEmail) */
  LeadEmail: string;
  /** Deliverable Description (field_2) */
  field_2: string;
}

/** Result returned by ErnService.create */
export interface IErnCreateResult {
  id: number;
  title: string;
  status: string;
  dueDate: string;
}

/** ERN deadline urgency state (for reminders). */
export type ErnDeadlineState = "none" | "ok" | "due-soon" | "overdue";
