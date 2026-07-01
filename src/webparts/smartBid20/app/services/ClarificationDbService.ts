/**
 * ClarificationDbService — CRUD for the "Clarifications Database" SharePoint list.
 * NOTE: This list uses real SharePoint columns (not a JSON blob).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IClarificationDbItem } from "../models/IClarificationDb";

const F = SHAREPOINT_CONFIG.clarificationDbFields;

export class ClarificationDbService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(
      SHAREPOINT_CONFIG.lists.clarificationsDatabase,
    );
  }

  private static _mapFromSP(item: any): IClarificationDbItem {
    return {
      id: item.Id,
      baseType:
        item[F.baseType] === "Qualification"
          ? "Qualification"
          : "Clarification",
      clientDocRef: item.Title || "",
      etTopic: item[F.etTopic] || "",
      clarification: item[F.clarification] || "",
      clientReply: item[F.clientReply] || "",
      approved: !!item[F.approved],
      date: item[F.date] || "",
      keyword: item[F.keyword] || "",
      client: item[F.client] || "",
      created: item.Created,
      modified: item.Modified,
      createdBy: item.Author ? item.Author.Title : "",
      modifiedBy: item.Editor ? item.Editor.Title : "",
    };
  }

  private static _mapToSP(item: IClarificationDbItem): Record<string, unknown> {
    return {
      [F.baseType]: item.baseType,
      Title: item.clientDocRef,
      [F.etTopic]: item.etTopic,
      [F.clarification]: item.clarification,
      [F.clientReply]: item.clientReply,
      [F.approved]: item.approved,
      [F.date]: item.date || null,
      [F.keyword]: item.keyword,
      [F.client]: item.client,
    };
  }

  /** Load all clarification database items */
  public static async getAll(): Promise<IClarificationDbItem[]> {
    const items: any[] = await ClarificationDbService._list.items
      .select(
        "Id",
        "Title",
        F.baseType,
        F.etTopic,
        F.clarification,
        F.clientReply,
        F.approved,
        F.date,
        F.keyword,
        F.client,
        "Created",
        "Modified",
        "Author/Title",
        "Editor/Title",
      )
      .expand("Author", "Editor")
      .orderBy("Id", false)
      .top(5000)();
    return items.map((i) => ClarificationDbService._mapFromSP(i));
  }

  /** Create a new item — returns the new SharePoint item Id */
  public static async create(item: IClarificationDbItem): Promise<number> {
    const result = await ClarificationDbService._list.items.add(
      ClarificationDbService._mapToSP(item),
    );
    return ((result as any).data as { Id: number }).Id;
  }

  /** Update an existing item */
  public static async update(
    id: number,
    item: IClarificationDbItem,
  ): Promise<void> {
    await ClarificationDbService._list.items
      .getById(id)
      .update(ClarificationDbService._mapToSP(item));
  }

  /** Delete an item */
  public static async delete(id: number): Promise<void> {
    await ClarificationDbService._list.items.getById(id).delete();
  }

  /** Bulk-add items (used when a BID closes) */
  public static async addMany(items: IClarificationDbItem[]): Promise<void> {
    for (const item of items) {
      await ClarificationDbService._list.items.add(
        ClarificationDbService._mapToSP(item),
      );
    }
  }
}
