/**
 * BidService — CRUD principal de BIDs (JSON ↔ SharePoint).
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { IBid } from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { withCostSummary } from "../utils/costCalculations";

const F = SHAREPOINT_CONFIG.bidTrackerFields;

/** Re-reads after a 412 (the Teams approval flow wrote the same item). */
const MAX_PATCH_ATTEMPTS = 3;

/** Runs at most once per session; the columns only need provisioning the first time. */
let ensureColumnsPromise: Promise<void> | undefined;

export class BidService {
  /** Serialize read-modify-write patches for the same JSON-backed BID. */
  private static readonly _pendingPatches: Record<string, Promise<void>> = {};
  /** Bumped on every local patch so background reads can detect a racing save. */
  private static readonly _patchVersions: Record<string, number> = {};

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
      .join(" - ");
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
      .map((item: { jsondata: string }) => BidService._parse(item.jsondata));
  }

  /** Older rows were saved with a zeroed costSummary; rebuild it on read. */
  private static _parse(json: string): IBid {
    return withCostSummary(JSON.parse(json) as IBid);
  }

  public static async getById(id: number): Promise<IBid | null> {
    const item = (await BidService._list.items
      .getById(id)
      .select("jsondata")()) as { jsondata?: string };
    return item.jsondata ? BidService._parse(item.jsondata) : null;
  }

  public static async getByBidNumber(bidNumber: string): Promise<IBid | null> {
    const items = await BidService._list.items
      .filter(`Title eq '${bidNumber}'`)
      .select("jsondata")
      .top(1)();
    if (items.length === 0) return null;
    return BidService._parse((items[0] as { jsondata: string }).jsondata);
  }

  public static async create(bid: IBid): Promise<number> {
    await BidService.ensureColumns();
    const result = await BidService._list.items.add({
      Title: bid.bidNumber,
      jsondata: JSON.stringify(withCostSummary(bid)),
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
      jsondata: JSON.stringify(withCostSummary(bid)),
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
    return items.map((item: { jsondata: string }) =>
      BidService._parse(item.jsondata),
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
    return items.map((item: { jsondata: string }) =>
      BidService._parse(item.jsondata),
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
    BidService._patchVersions[bidNumber] =
      BidService.getPatchVersion(bidNumber) + 1;
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

  public static hasPendingPatch(bidNumber: string): boolean {
    return !!BidService._pendingPatches[bidNumber];
  }

  public static getPatchVersion(bidNumber: string): number {
    return BidService._patchVersions[bidNumber] || 0;
  }

  public static hasAnyPendingPatch(): boolean {
    return Object.keys(BidService._pendingPatches).length > 0;
  }

  /** Sum of all patch versions; changes whenever any BID patch starts. */
  public static getTotalPatchVersion(): number {
    return Object.keys(BidService._patchVersions).reduce(
      (sum, k) => sum + BidService._patchVersions[k],
      0,
    );
  }

  /** One-off backfill: writes the rebuilt costSummary into every BID whose stored one differs. */
  public static async recalculateCostSummaries(
    onProgress?: (done: number, total: number) => void,
  ): Promise<{ checked: number; updated: number; failed: number }> {
    const items = (await BidService._list.items
      .select("Title", "jsondata")
      .top(5000)()) as { Title?: string; jsondata?: string }[];
    const rows = items.filter((i) => i.Title && i.jsondata);
    let updated = 0;
    let failed = 0;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const stored = JSON.parse(row.jsondata as string) as IBid;
        const rebuilt = withCostSummary(stored).costSummary;
        if (JSON.stringify(rebuilt) !== JSON.stringify(stored.costSummary)) {
          await BidService.patchByBidNumber(row.Title as string, {
            costSummary: rebuilt,
          });
          updated++;
        }
      } catch (err) {
        failed++;
        console.error(`Cost summary backfill failed for ${row.Title}:`, err);
      }
      if (onProgress) onProgress(i + 1, rows.length);
    }
    return { checked: rows.length, updated, failed };
  }

  private static async _patchByBidNumber(
    bidNumber: string,
    patch: Partial<IBid>,
  ): Promise<void> {
    for (let attempt = 1; attempt <= MAX_PATCH_ATTEMPTS; attempt++) {
      const items = await BidService._list.items
        .filter(`Title eq '${bidNumber}'`)
        .select("Id", "jsondata")
        .top(1)();
      if (items.length === 0) return;
      const row = items[0] as {
        Id: number;
        jsondata: string;
        "odata.etag"?: string;
      };
      const bid = JSON.parse(row.jsondata) as IBid;
      const merged = withCostSummary({ ...bid, ...patch });
      const dueDateChanged =
        patch.dueDate !== undefined || patch.desiredDueDate !== undefined;
      try {
        await BidService._list.items.getById(row.Id).update(
          {
            jsondata: JSON.stringify(merged),
            Status: merged.currentStatus,
            ...BidService._searchColumns(merged),
            ...(dueDateChanged
              ? { DueDate: merged.desiredDueDate || merged.dueDate }
              : {}),
          },
          row["odata.etag"] || "*",
        );
        return;
      } catch (err) {
        const status = (err as { status?: number }).status;
        if (status !== 412 || attempt === MAX_PATCH_ATTEMPTS) throw err;
      }
    }
  }
}
