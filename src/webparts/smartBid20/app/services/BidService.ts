/**
 * BidService — CRUD principal de BIDs (JSON ↔ SharePoint).
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { IBid } from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

const F = SHAREPOINT_CONFIG.bidTrackerFields;

/** Runs at most once per session; the columns only need provisioning the first time. */
let ensureColumnsPromise: Promise<void> | undefined;

export class BidService {
  /** Serialize read-modify-write patches for the same JSON-backed BID. */
  private static readonly _pendingPatches: Record<string, Promise<void>> = {};

  private static get _list() {
    return SPService.sp.web.lists.getByTitle(
      SHAREPOINT_CONFIG.lists.bidTracker,
    );
  }

  /**
   * Create the plain search columns if they are missing. Writing to a column
   * that does not exist makes SharePoint reject the whole item, so this must
   * succeed before the first create/update of a session.
   */
  public static async ensureColumns(): Promise<void> {
    if (!ensureColumnsPromise) {
      ensureColumnsPromise = BidService._provisionColumns().catch((err) => {
        // Let a later write retry instead of caching the failure forever.
        ensureColumnsPromise = undefined;
        throw err;
      });
    }
    return ensureColumnsPromise;
  }

  private static async _provisionColumns(): Promise<void> {
    const listApi = BidService._list as any;
    let existing: string[] = [];
    try {
      const fields = await listApi.fields.select("InternalName")();
      existing = (fields as { InternalName: string }[]).map(
        (f) => f.InternalName,
      );
    } catch (err) {
      console.warn("BidService.ensureColumns: cannot read fields", err);
      return;
    }
    const add = async (name: string, multiline: boolean): Promise<void> => {
      if (existing.indexOf(name) >= 0) return;
      try {
        if (multiline) await listApi.fields.addMultilineText(name);
        else await listApi.fields.addText(name);
      } catch (e) {
        /* ignore — concurrent run or insufficient permission */
      }
    };
    await add(F.client, false);
    await add(F.projectName, false);
    await add(F.division, false);
    await add(F.scopeSummary, true);
  }

  /**
   * Flatten the searchable parts of a bid into plain columns. The JSON blob
   * stays the source of truth; these only exist so the bid is findable.
   */
  private static _searchColumns(bid: IBid): Record<string, string> {
    const opp = bid.opportunityInfo;
    const scope = (bid.scopeItems || [])
      .filter((s) => !s.isSection && s.description)
      .map((s) => s.description)
      .join("; ");
    const summary = [opp ? opp.projectDescription : "", scope]
      .filter(Boolean)
      .join(" — ");
    return {
      [F.client]: (opp ? opp.client : "") || "",
      [F.projectName]: (opp ? opp.projectName : "") || "",
      [F.division]: bid.division || "",
      [F.scopeSummary]: summary.substring(0, 30000),
    };
  }

  public static async getAll(): Promise<IBid[]> {
    const items = await BidService._list.items
      .select("Id", "Title", "jsondata", "Status", "DueDate")
      .orderBy("Id", false)
      .top(5000)();
    return items
      .filter((item: { jsondata?: string }) => item.jsondata)
      .map((item: { jsondata: string }) => JSON.parse(item.jsondata) as IBid);
  }

  public static async getById(id: number): Promise<IBid | null> {
    const item = (await BidService._list.items
      .getById(id)
      .select("jsondata")()) as { jsondata?: string };
    return item.jsondata ? (JSON.parse(item.jsondata) as IBid) : null;
  }

  public static async getByBidNumber(bidNumber: string): Promise<IBid | null> {
    const items = await BidService._list.items
      .filter(`Title eq '${bidNumber}'`)
      .select("jsondata")
      .top(1)();
    if (items.length === 0) return null;
    return JSON.parse((items[0] as { jsondata: string }).jsondata) as IBid;
  }

  public static async create(bid: IBid): Promise<number> {
    await BidService.ensureColumns();
    const result = await BidService._list.items.add({
      Title: bid.bidNumber,
      jsondata: JSON.stringify(bid),
      Status: bid.currentStatus,
      DueDate: bid.desiredDueDate || bid.dueDate,
      ...BidService._searchColumns(bid),
    });
    return ((result as any).data as { Id: number }).Id;
  }

  public static async update(id: number, bid: IBid): Promise<void> {
    await BidService.ensureColumns();
    await BidService._list.items.getById(id).update({
      Title: bid.bidNumber,
      jsondata: JSON.stringify(bid),
      Status: bid.currentStatus,
      DueDate: bid.desiredDueDate || bid.dueDate,
      ...BidService._searchColumns(bid),
    });
  }

  /**
   * Update a BID after initial creation (set real bidNumber + attachment paths).
   */
  public static async updateAfterCreate(
    spItemId: number,
    newBidNumber: string,
    attachmentUpdates?: import("../models").IBidAttachment[],
  ): Promise<void> {
    const item = await BidService._list.items
      .getById(spItemId)
      .select("jsondata")();
    const bid = JSON.parse((item as { jsondata: string }).jsondata) as IBid;

    bid.bidNumber = newBidNumber;
    if (attachmentUpdates && attachmentUpdates.length > 0) {
      bid.attachments = attachmentUpdates;
    }

    await BidService._list.items.getById(spItemId).update({
      Title: newBidNumber,
      jsondata: JSON.stringify(bid),
      ...BidService._searchColumns(bid),
    });
  }

  public static async delete(id: number): Promise<void> {
    await BidService._list.items.getById(id).delete();
  }

  public static async getByStatus(status: string): Promise<IBid[]> {
    const items = await BidService._list.items
      .filter(`Status eq '${status}'`)
      .select("jsondata")
      .top(5000)();
    return items.map(
      (item: { jsondata: string }) => JSON.parse(item.jsondata) as IBid,
    );
  }

  public static async getOverdue(): Promise<IBid[]> {
    const now = new Date().toISOString();
    const items = await BidService._list.items
      .filter(
        `DueDate lt '${now}' and Status ne 'Completed' and Status ne 'Canceled'`,
      )
      .select("jsondata")
      .top(5000)();
    return items.map(
      (item: { jsondata: string }) => JSON.parse(item.jsondata) as IBid,
    );
  }

  /**
   * Patch a BID by its bidNumber (Title field). Merges the given partial
   * into the existing JSON blob and persists back to SharePoint.
   */
  public static async patchByBidNumber(
    bidNumber: string,
    patch: Partial<IBid>,
  ): Promise<void> {
    const previous = BidService._pendingPatches[bidNumber];
    const pending = previous
      ? previous.then(
          () => BidService._patchByBidNumber(bidNumber, patch),
          () => BidService._patchByBidNumber(bidNumber, patch),
        )
      : BidService._patchByBidNumber(bidNumber, patch);
    BidService._pendingPatches[bidNumber] = pending;
    try {
      await pending;
    } finally {
      if (BidService._pendingPatches[bidNumber] === pending) {
        delete BidService._pendingPatches[bidNumber];
      }
    }
  }

  private static async _patchByBidNumber(
    bidNumber: string,
    patch: Partial<IBid>,
  ): Promise<void> {
    const items = await BidService._list.items
      .filter(`Title eq '${bidNumber}'`)
      .select("Id", "jsondata")
      .top(1)();
    if (items.length === 0) return;
    const row = items[0] as { Id: number; jsondata: string };
    const bid = JSON.parse(row.jsondata) as IBid;
    const merged = { ...bid, ...patch };
    const dueDateChanged =
      patch.dueDate !== undefined || patch.desiredDueDate !== undefined;
    await BidService._list.items.getById(row.Id).update({
      jsondata: JSON.stringify(merged),
      ...BidService._searchColumns(merged),
      ...(dueDateChanged
        ? { DueDate: merged.desiredDueDate || merged.dueDate }
        : {}),
    });
  }
}
