/**
 * AccessLogService — records who opens SmartBid / the PeopleSoft Consulting
 * External View in the smartbid-access-log list. Static singleton pattern.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { AccessLogArea, IAccessLogEntry } from "../models";

const LIST_NAME = SHAREPOINT_CONFIG.lists.accessLog;
const F = SHAREPOINT_CONFIG.accessLogFields;
/** Reloads inside this window are not logged again (per browser + area). */
const THROTTLE_MS = 15 * 60 * 1000;
const THROTTLE_KEY = "smartbid-access-log:";
const MAX_ROWS = 5000;

const isNotFound = (err: unknown): boolean =>
  (err as { status?: number })?.status === 404;

export class AccessLogService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIST_NAME);
  }

  /** Creates the list + columns when missing (needs Manage Lists rights). */
  public static async ensureList(): Promise<void> {
    try {
      await (AccessLogService._list as any).select("Id")();
    } catch (err) {
      if (!isNotFound(err)) throw err;
      await (SPService.sp.web.lists as any).add(
        LIST_NAME,
        "SmartBid access log - one row per app load",
        100,
        false,
      );
      // Item-level security: regular users only see/edit the rows they created.
      await (AccessLogService._list as any)
        .update({ ReadSecurity: 2, WriteSecurity: 2 })
        .catch((e: unknown) =>
          console.warn("AccessLogService: cannot set item security", e),
        );
    }
    const listApi = AccessLogService._list as any;
    const existing = (
      (await listApi.fields.select("InternalName")()) as {
        InternalName: string;
      }[]
    ).map((f) => f.InternalName);
    for (const name of [F.userName, F.accessArea]) {
      if (existing.indexOf(name) < 0) await listApi.fields.addText(name);
    }
  }

  /** Fire-and-forget; never throws (list may not exist yet). */
  public static async logAccess(
    email: string,
    userName: string,
    area: AccessLogArea,
  ): Promise<void> {
    if (!email) return;
    const key = THROTTLE_KEY + area;
    try {
      const last = Number(window.localStorage.getItem(key) || 0);
      if (Date.now() - last < THROTTLE_MS) return;
    } catch {
      // Storage blocked: log anyway.
    }
    try {
      await AccessLogService._list.items.add({
        Title: email.toLowerCase(),
        [F.userName]: userName || "",
        [F.accessArea]: area,
      });
      try {
        window.localStorage.setItem(key, String(Date.now()));
      } catch {
        // ignore
      }
    } catch (err) {
      console.warn("AccessLogService.logAccess failed:", err);
    }
  }

  /** Most recent entries first. */
  public static async getRecent(): Promise<IAccessLogEntry[]> {
    const items = await AccessLogService._list.items
      .select("Id", "Title", F.userName, F.accessArea, "Created")
      .orderBy("Id", false)
      .top(MAX_ROWS)();
    return items.map((i: any) => ({
      id: i.Id,
      email: i.Title || "",
      userName: i[F.userName] || "",
      area:
        i[F.accessArea] === "peoplesoft-external"
          ? "peoplesoft-external"
          : "smartbid",
      accessedAt: i.Created,
    }));
  }
}
