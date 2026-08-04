/**
 * ErnService — Engineering Request Number (ERN) CRUD against the same-site
 * SharePoint list "Engineering Requestt". Static singleton pattern.
 * See Inspiration/ERN_INTEGRATION_GUIDE.md.
 */
import "@pnp/sp/fields";
import "@pnp/sp/lists";
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IErn, IErnCreateData, IErnCreateResult } from "../models";

const ERN = SHAREPOINT_CONFIG.ern.fields;

export class ErnService {
  // Access the list by server-relative URL — its Title differs from the URL
  // segment, so getByTitle('Engineering Requestt') returns 404. getList is
  // provided by @pnp/sp/lists at runtime but not on this web's static type.
  private static get _list() {
    return (SPService.sp.web as any).getList(SHAREPOINT_CONFIG.ern.listUrl);
  }

  private static readonly SELECT_FIELDS = [
    "Id",
    "Title",
    ERN.status,
    ERN.dueDate,
    ERN.finishDate,
    ERN.projectTitle,
    ERN.projectNumber,
    ERN.description,
    ERN.deliverableType,
  ];

  /** Fetch all ERNs (top 5000). Falls back to all fields if a select fails. */
  public static async getAll(): Promise<IErn[]> {
    let items: any[];
    try {
      items = (await ErnService._list.items
        .select(...ErnService.SELECT_FIELDS)
        .top(5000)()) as any[];
    } catch (err) {
      // A mismatched internal name breaks the whole $select — retry without it
      console.warn(
        "ErnService.getAll select failed, retrying without select",
        err,
      );
      items = (await ErnService._list.items.top(5000)()) as any[];
    }
    return items.map(ErnService.mapFromSP);
  }

  /** Fetch a single ERN by its Title (e.g. "ERN-42"). Live status/due. */
  public static async getByTitle(title: string): Promise<IErn | null> {
    if (!title) return null;
    const filter = `Title eq '${title.replace(/'/g, "''")}'`;
    let items: any[];
    try {
      items = (await ErnService._list.items
        .filter(filter)
        .select(...ErnService.SELECT_FIELDS)
        .top(1)()) as any[];
    } catch (err) {
      console.warn(
        "ErnService.getByTitle select failed, retrying without select",
        err,
      );
      items = (await ErnService._list.items.filter(filter).top(1)()) as any[];
    }
    if (items.length === 0) return null;
    return ErnService.mapFromSP(items[0]);
  }

  /** In-memory search across Title, ProjectTitle and Description. */
  public static async search(query: string): Promise<IErn[]> {
    const all = await ErnService.getAll();
    const q = (query || "").toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (e) =>
        e.title.toLowerCase().indexOf(q) >= 0 ||
        e.projectTitle.toLowerCase().indexOf(q) >= 0 ||
        e.projectNumber.toLowerCase().indexOf(q) >= 0 ||
        e.description.toLowerCase().indexOf(q) >= 0,
    );
  }

  /** Compute the next sequential ERN number ("ERN-{n+1}"). */
  public static async getNextErnNumber(): Promise<string> {
    const items = await ErnService._list.items
      .select("Id", "Title")
      .orderBy("Id", false)
      .top(1)();
    let next = 1;
    if ((items as any[]).length > 0) {
      const match = /ERN-(\d+)/.exec((items as any[])[0].Title || "");
      if (match) next = parseInt(match[1], 10) + 1;
    }
    return `ERN-${next}`;
  }

  /** Auto-number and create a new ERN item. Returns id, title and status. */
  public static async create(data: IErnCreateData): Promise<IErnCreateResult> {
    const title = await ErnService.getNextErnNumber();
    const body: Record<string, any> = {
      Title: title,
      [ERN.typeOfRequest]: data.field_12,
      [ERN.serviceLine]: data.ServiceLine,
      [ERN.contentAction]: data.field_28,
      [ERN.projectNumber]: data.field_14,
      [ERN.projectName]: data.field_15,
      [ERN.projectTitle]: data.ProjectTitle,
      // Deliverable Type is a multi-choice field — must be an array
      [ERN.deliverableType]: { results: [data.field_20] },
      [ERN.dueDate]: data.field_4,
      [ERN.checkerDueDate]: data.CheckerDueDate,
      [ERN.leadDate]: data.LeadDate,
      [ERN.resource1]: data.Resource1,
      [ERN.emailResource1]: data.EmailResource1,
      [ERN.resource3]: data.Resource3,
      [ERN.emailChecker]: data.EmailChecker,
      [ERN.lead]: data.Lead,
      [ERN.leadEmail]: data.LeadEmail,
      [ERN.description]: data.field_2,
    };
    if (data.field_28 === "Revise" && data.RevisionReason) {
      body[ERN.revisionReason] = data.RevisionReason;
    }
    const result = await ErnService._list.items.add(body);
    const created = await ErnService.getByTitle(title);
    return {
      id: created?.id ?? (result as any)?.data?.Id ?? 0,
      title,
      status: created?.status || "Open",
      dueDate: created?.dueDate || data.field_4,
    };
  }

  /** Read a SharePoint choice field's Choices array (ServiceLine, field_20). */
  public static async getFieldChoices(internalName: string): Promise<string[]> {
    const listApi = ErnService._list as any;
    // Strategy 1 — full field object by internal name (most reliable)
    try {
      const field =
        await listApi.fields.getByInternalNameOrTitle(internalName)();
      const choices = (field as { Choices?: string[] })?.Choices;
      if (Array.isArray(choices) && choices.length > 0) return choices;
    } catch (err) {
      console.warn(
        `ErnService.getFieldChoices('${internalName}') getByInternalNameOrTitle failed`,
        err,
      );
    }
    // Strategy 2 — filter the fields collection (matches the guide's REST call)
    try {
      const fields = await listApi.fields
        .filter(`InternalName eq '${internalName}'`)
        .select("Choices")();
      const arr = fields as { Choices?: string[] }[];
      if (arr.length > 0 && Array.isArray(arr[0].Choices))
        return arr[0].Choices;
    } catch (err) {
      console.warn(
        `ErnService.getFieldChoices('${internalName}') filter failed`,
        err,
      );
    }
    // Strategy 3 — scan all fields, match by InternalName / Title / StaticName
    try {
      const all = await listApi.fields.select(
        "InternalName",
        "Title",
        "StaticName",
        "Choices",
      )();
      const target = internalName.toLowerCase();
      const match = (all as any[]).find((f) => {
        return (
          (f.InternalName || "").toLowerCase() === target ||
          (f.StaticName || "").toLowerCase() === target ||
          (f.Title || "").toLowerCase() === target
        );
      });
      if (match && Array.isArray(match.Choices)) return match.Choices;
    } catch (err) {
      console.warn(
        `ErnService.getFieldChoices('${internalName}') scan failed`,
        err,
      );
    }
    return [];
  }

  private static mapFromSP(item: any): IErn {
    const dt = item[ERN.deliverableType];
    let deliverableType = "";
    if (Array.isArray(dt)) deliverableType = dt.join(", ");
    else if (dt) deliverableType = String(dt);
    return {
      id: item.Id,
      title: item.Title || "",
      status: item[ERN.status] || "",
      dueDate: item[ERN.dueDate] || "",
      finishDate: item[ERN.finishDate] || "",
      projectTitle: item[ERN.projectTitle] || "",
      projectNumber: item[ERN.projectNumber] || "",
      description: item[ERN.description] || "",
      deliverableType,
    };
  }
}
