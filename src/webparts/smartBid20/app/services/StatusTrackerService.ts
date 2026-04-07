/**
 * StatusTrackerService — Notificações Power Automate (padrão SmartFlow).
 * Write-only: cria items na lista smartbid-status-tracker.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

export type ChangeType =
  | "BID_CREATED"
  | "BID_ASSIGNED"
  | "STATUS_CHANGED"
  | "PHASE_CHANGED"
  | "APPROVAL_REQUESTED"
  | "APPROVAL_RESPONSE"
  | "BID_COMPLETED"
  | "BID_OVERDUE"
  | "BID_CANCELLED"
  | "BID_RETURNED"
  | "COMMENT_ADDED"
  | "DEADLINE_WARNING"
  | "HIGH_PRIORITY";

export interface IStatusTrackerEntry {
  bidNumber: string;
  changeType: ChangeType;
  description: string;
  actor: string;
  actorEmail: string;
  recipientEmail: string;
  deepLink: string;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export class StatusTrackerService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(
      SHAREPOINT_CONFIG.lists.statusTracker,
    );
  }

  public static async notify(entry: IStatusTrackerEntry): Promise<void> {
    await StatusTrackerService._list.items.add({
      Title: entry.bidNumber,
      jsondata: JSON.stringify(entry),
      ChangeType: entry.changeType,
    });
  }

  public static async notifyMultiple(
    entries: IStatusTrackerEntry[],
  ): Promise<void> {
    for (const entry of entries) {
      await StatusTrackerService.notify(entry);
    }
  }
}
