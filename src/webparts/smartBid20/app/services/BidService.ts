/**
 * BidService — CRUD principal de BIDs (JSON ↔ SharePoint).
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import { IBid } from "../models";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

export class BidService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(
      SHAREPOINT_CONFIG.lists.bidTracker,
    );
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
    const result = await BidService._list.items.add({
      Title: bid.bidNumber,
      jsondata: JSON.stringify(bid),
      Status: bid.currentStatus,
      DueDate: bid.desiredDueDate || bid.dueDate,
    });
    return ((result as any).data as { Id: number }).Id;
  }

  public static async update(id: number, bid: IBid): Promise<void> {
    await BidService._list.items.getById(id).update({
      Title: bid.bidNumber,
      jsondata: JSON.stringify(bid),
      Status: bid.currentStatus,
      DueDate: bid.desiredDueDate || bid.dueDate,
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
    const items = await BidService._list.items
      .filter(`Title eq '${bidNumber}'`)
      .select("Id", "jsondata")
      .top(1)();
    if (items.length === 0) return;
    const row = items[0] as { Id: number; jsondata: string };
    const bid = JSON.parse(row.jsondata) as IBid;
    const merged = { ...bid, ...patch };
    await BidService._list.items.getById(row.Id).update({
      jsondata: JSON.stringify(merged),
    });
  }
}
