/**
 * IFavoriteItem — Interfaces for the enhanced Favorites feature.
 * Supports both BID favorites and equipment catalog with Group/SubGroup taxonomy.
 */

/** Top-level category group for equipment favorites */
export interface IFavoriteGroup {
  id: string;
  name: string;
  subGroups: IFavoriteSubGroup[];
}

/** Sub-category within a group */
export interface IFavoriteSubGroup {
  id: string;
  name: string;
  groupId: string;
}

/** Data source for how a favorite equipment item was added */
export type FavoriteDataSource = "manual" | "bid" | "query";

/** A favorited equipment item in the catalog */
export interface IFavoriteEquipment {
  id: string;
  groupId: string;
  subGroupId: string;
  partNumber: string;
  description: string;
  pictureUrl: string;
  notes: string;
  dataSource: FavoriteDataSource;
  /** BID number if saved from a BID scope */
  sourceBidNumber?: string;
  /** Optional cost info if available */
  costUSD?: number;
  /** Cost reference (e.g., BUMBL, BUMBR) */
  costReference?: string;
  /** Lead time in days */
  leadTimeDays?: number;
  /** Original currency if non-USD */
  originalCurrency?: string;
  /** Original cost in original currency */
  originalCost?: number;
  /** Manufacturer ID (from Active Registered) */
  mfgId?: string;
  /** Manufacturer Item reference (from Active Registered) */
  mfgItmId?: string;
  /** Parent equipment ID — makes this a sub-item (spare/accessory) of a parent PN */
  parentId?: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
}

/** A favorited BID */
export interface IFavoriteBid {
  bidNumber: string;
  addedBy: string;
  addedDate: string;
}

/** Root container for all favorites data (stored as JSON blob in SP) */
export interface IFavoritesData {
  groups: IFavoriteGroup[];
  equipment: IFavoriteEquipment[];
  bids: IFavoriteBid[];
}
