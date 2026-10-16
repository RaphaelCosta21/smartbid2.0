/**
 * Group/Sub-Group helpers for the smartBidDocs catalog (Datasheets, Manuals,
 * Technical Proposals). Shared by the catalog UI and background publishers.
 */
import { IFavoriteGroup, IFavoriteSubGroup } from "../models";
import { IDocLibraryMetadata } from "../models/IDocLibraryItem";
import { useConfigStore } from "../stores/useConfigStore";

/** Find a configured group by name (case-insensitive), if any */
export const findGroupByName = (
  groups: IFavoriteGroup[],
  name: string,
): IFavoriteGroup | undefined =>
  groups.find((g) => g.name.toLowerCase() === name.trim().toLowerCase());

export const findSubGroupByName = (
  group: IFavoriteGroup | undefined,
  name: string,
): IFavoriteSubGroup | undefined =>
  group
    ? group.subGroups.find(
        (sg) => sg.name.toLowerCase() === name.trim().toLowerCase(),
      )
    : undefined;

/**
 * Mirror the Group/Sub-Group ids into a readable name before saving — the ids are
 * opaque, so only this column makes Discipline/Scope searchable in AI Search.
 */
export const withCategory = (
  meta: IDocLibraryMetadata,
  lockedGroupId?: string,
): IDocLibraryMetadata => {
  const groups = useConfigStore.getState().config?.favoriteGroups || [];
  const groupId = lockedGroupId || meta.groupId;
  const group = groups.filter((g) => g.id === groupId)[0];
  if (!group) return { ...meta, groupId, category: "" };
  const sub = (group.subGroups || []).filter(
    (s) => s.id === meta.subGroupId,
  )[0];
  return {
    ...meta,
    groupId,
    category: sub ? `${group.name} / ${sub.name}` : group.name,
  };
};
