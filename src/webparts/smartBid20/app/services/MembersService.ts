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

  public static async getAll(): Promise<IMembersData> {
    const items = await MembersService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.teamMembers}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) {
      return {
        manager: [],
        project: [],
        operations: [],
        equipment: [],
        dataCenter: [],
        engineering: [],
      };
    }
    return JSON.parse(
      (items[0] as { ConfigValue: string }).ConfigValue,
    ) as IMembersData;
  }

  public static async save(members: IMembersData): Promise<void> {
    const items = await MembersService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.teamMembers}'`)
      .select("Id")
      .top(1)();
    if (items.length > 0) {
      await MembersService._list.items
        .getById((items[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(members) });
    } else {
      await MembersService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.teamMembers,
        ConfigValue: JSON.stringify(members),
      });
    }
  }

  public static async addMember(
    member: ITeamMember,
    category: keyof IMembersData,
  ): Promise<void> {
    const members = await MembersService.getAll();
    members[category].push(member);
    await MembersService.save(members);
  }

  public static async updateMember(member: ITeamMember): Promise<void> {
    const members = await MembersService.getAll();
    for (const category of Object.keys(members) as (keyof IMembersData)[]) {
      const idx = members[category].findIndex((m) => m.id === member.id);
      if (idx >= 0) {
        members[category][idx] = member;
        await MembersService.save(members);
        return;
      }
    }
  }

  public static async removeMember(memberId: string): Promise<void> {
    const members = await MembersService.getAll();
    for (const category of Object.keys(members) as (keyof IMembersData)[]) {
      members[category] = members[category].filter((m) => m.id !== memberId);
    }
    await MembersService.save(members);
  }
}
