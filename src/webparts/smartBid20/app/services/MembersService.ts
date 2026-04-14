/**
 * MembersService — CRUD de membros (padrão SmartFlow).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IMembersData, ITeamMember } from "../models";

export class MembersService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  private static readonly EMPTY: IMembersData = { members: [] };

  public static async getAll(): Promise<IMembersData> {
    const items = await MembersService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.teamMembers}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) {
      return { ...MembersService.EMPTY };
    }
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) {
      return { ...MembersService.EMPTY };
    }
    try {
      const parsed = JSON.parse(raw);
      // Migration: if old format (keyed by role), flatten to new format
      if (parsed && !Array.isArray(parsed.members) && !Array.isArray(parsed)) {
        const migrated: ITeamMember[] = [];
        for (const key of Object.keys(parsed)) {
          if (Array.isArray(parsed[key])) {
            migrated.push(...parsed[key]);
          }
        }
        return { members: migrated };
      }
      if (Array.isArray(parsed)) {
        return { members: parsed };
      }
      return (parsed as IMembersData) || { ...MembersService.EMPTY };
    } catch {
      return { ...MembersService.EMPTY };
    }
  }

  public static async save(data: IMembersData): Promise<void> {
    const items = await MembersService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.teamMembers}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await MembersService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(data) });
    } else {
      await MembersService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.teamMembers,
        ConfigValue: JSON.stringify(data),
      });
    }
  }

  public static async addMember(member: ITeamMember): Promise<void> {
    const data = await MembersService.getAll();
    data.members.push(member);
    await MembersService.save(data);
  }

  public static async updateMember(member: ITeamMember): Promise<void> {
    const data = await MembersService.getAll();
    const idx = data.members.findIndex((m) => m.id === member.id);
    if (idx >= 0) {
      data.members[idx] = member;
      await MembersService.save(data);
    }
  }

  public static async removeMember(memberId: string): Promise<void> {
    const data = await MembersService.getAll();
    data.members = data.members.filter((m) => m.id !== memberId);
    await MembersService.save(data);
  }
}
