/**
 * IBidTask — Tasks da RACI por fase do BID.
 */
import { BidPhase } from "./IBidStatus";

export interface IBidTaskDef {
  taskId: string;
  phase: BidPhase;
  name: string;
  status: "not-started" | "in-progress" | "completed" | "skipped";
  assignedTo: string;
  assignedToEmail: string;
  completedDate: string | null;
  completedBy: string | null;
  dueDate: string | null;
  isOverdue: boolean;
  isConditional: boolean;
  condition: string | null;
  comments: string;
  attachments: string[];
}

export type TaskStatusType =
  | "not-started"
  | "in-progress"
  | "completed"
  | "skipped";
