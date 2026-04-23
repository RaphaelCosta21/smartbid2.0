/**
 * EditControlService — Manages concurrent edit locks via smartbid-config EDIT_CONTROL.
 * Static singleton pattern. Locks expire after 30 minutes to handle abandoned sessions.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IEditLock } from "../models";

const LOCK_TTL_MS = 30 * 60 * 1000; // 30 minutes

export class EditControlService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  /**
   * Get all active edit locks (auto-removes stale locks older than 30 min).
   */
  public static async getLocks(): Promise<IEditLock[]> {
    const items = await EditControlService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.editControl}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return [];
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return [];
    let locks: IEditLock[];
    try {
      locks = JSON.parse(raw) as IEditLock[];
    } catch {
      return [];
    }
    // Remove stale locks
    const now = Date.now();
    const active = locks.filter(
      (l) => now - new Date(l.lockedAt).getTime() < LOCK_TTL_MS,
    );
    // If stale locks were cleaned, persist the cleanup
    if (active.length !== locks.length) {
      EditControlService.saveLocks(active).catch(() => {});
    }
    return active;
  }

  /**
   * Try to acquire a lock for a section. Returns success or the existing lock.
   */
  public static async acquireLock(
    lock: IEditLock,
  ): Promise<{ success: boolean; existingLock?: IEditLock }> {
    const locks = await EditControlService.getLocks();
    const existing = locks.find(
      (l) => l.bidNumber === lock.bidNumber && l.section === lock.section,
    );
    if (
      existing &&
      existing.userEmail.toLowerCase() !== lock.userEmail.toLowerCase()
    ) {
      return { success: false, existingLock: existing };
    }
    // Replace any existing lock for same user/section (refresh timestamp)
    const filtered = locks.filter(
      (l) => !(l.bidNumber === lock.bidNumber && l.section === lock.section),
    );
    filtered.push(lock);
    await EditControlService.saveLocks(filtered);
    return { success: true };
  }

  /**
   * Release a specific lock.
   */
  public static async releaseLock(
    bidNumber: string,
    section: string,
    userEmail: string,
  ): Promise<void> {
    const locks = await EditControlService.getLocks();
    const filtered = locks.filter(
      (l) =>
        !(
          l.bidNumber === bidNumber &&
          l.section === section &&
          l.userEmail.toLowerCase() === userEmail.toLowerCase()
        ),
    );
    await EditControlService.saveLocks(filtered);
  }

  /**
   * Release all locks held by a user on a specific BID.
   */
  public static async releaseAllForBid(
    bidNumber: string,
    userEmail: string,
  ): Promise<void> {
    const locks = await EditControlService.getLocks();
    const filtered = locks.filter(
      (l) =>
        !(
          l.bidNumber === bidNumber &&
          l.userEmail.toLowerCase() === userEmail.toLowerCase()
        ),
    );
    await EditControlService.saveLocks(filtered);
  }

  /**
   * Persist the locks array to SharePoint.
   */
  private static async saveLocks(locks: IEditLock[]): Promise<void> {
    const items = await EditControlService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.editControl}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await EditControlService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(locks) });
    } else {
      await EditControlService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.editControl,
        ConfigValue: JSON.stringify(locks),
      });
    }
  }
}
