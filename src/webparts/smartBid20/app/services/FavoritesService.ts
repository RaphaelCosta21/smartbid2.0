/**
 * FavoritesService — CRUD for equipment and BID favorites.
 * Data stored as JSON blob in smartbid-config list with key "FAVORITES".
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  IFavoritesData,
  IFavoriteEquipment,
  IFavoriteBid,
  IFavoriteGroup,
} from "../models";

const EMPTY_DATA: IFavoritesData = {
  groups: [],
  equipment: [],
  bids: [],
};

export class FavoritesService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.config);
  }

  /** Load all favorites data from SharePoint config list */
  public static async getAll(): Promise<IFavoritesData> {
    const items = await FavoritesService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.favorites}'`)
      .select("ConfigValue")
      .top(1)();
    if (items.length === 0) return { ...EMPTY_DATA };
    const raw = (items[0] as { ConfigValue: string }).ConfigValue;
    if (!raw) return { ...EMPTY_DATA };
    try {
      const parsed = JSON.parse(raw) as IFavoritesData;
      return {
        groups: parsed.groups || [],
        equipment: parsed.equipment || [],
        bids: parsed.bids || [],
      };
    } catch {
      return { ...EMPTY_DATA };
    }
  }

  /** Save full favorites data to SharePoint config list */
  public static async save(data: IFavoritesData): Promise<void> {
    const existing = await FavoritesService._list.items
      .filter(`Title eq '${SHAREPOINT_CONFIG.configKeys.favorites}'`)
      .select("Id")
      .top(1)();
    if (existing.length > 0) {
      await FavoritesService._list.items
        .getById((existing[0] as { Id: number }).Id)
        .update({ ConfigValue: JSON.stringify(data) });
    } else {
      await FavoritesService._list.items.add({
        Title: SHAREPOINT_CONFIG.configKeys.favorites,
        ConfigValue: JSON.stringify(data),
      });
    }
  }

  /** Add a single equipment item to favorites */
  public static async addEquipment(item: IFavoriteEquipment): Promise<void> {
    const data = await FavoritesService.getAll();
    data.equipment.push(item);
    await FavoritesService.save(data);
  }

  /** Remove an equipment item by id */
  public static async removeEquipment(id: string): Promise<void> {
    const data = await FavoritesService.getAll();
    data.equipment = data.equipment.filter((e) => e.id !== id);
    await FavoritesService.save(data);
  }

  /** Update an equipment item */
  public static async updateEquipment(item: IFavoriteEquipment): Promise<void> {
    const data = await FavoritesService.getAll();
    const idx = data.equipment.findIndex((e) => e.id === item.id);
    if (idx >= 0) data.equipment[idx] = item;
    await FavoritesService.save(data);
  }

  /** Add a BID to favorites */
  public static async addBidFavorite(fav: IFavoriteBid): Promise<void> {
    const data = await FavoritesService.getAll();
    const exists = data.bids.some((b) => b.bidNumber === fav.bidNumber);
    if (!exists) {
      data.bids.push(fav);
      await FavoritesService.save(data);
    }
  }

  /** Remove a BID from favorites */
  public static async removeBidFavorite(bidNumber: string): Promise<void> {
    const data = await FavoritesService.getAll();
    data.bids = data.bids.filter((b) => b.bidNumber !== bidNumber);
    await FavoritesService.save(data);
  }

  /** Update the groups taxonomy (add, remove, rename groups/subgroups) */
  public static async updateGroups(groups: IFavoriteGroup[]): Promise<void> {
    const data = await FavoritesService.getAll();
    data.groups = groups;
    await FavoritesService.save(data);
  }
}
