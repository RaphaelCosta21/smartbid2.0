import * as React from "react";
import {
  IScopeItem,
  IScopeSubItem,
  IEngineeringHoursItem,
  IEngineeringDeliverable,
  IResourceAllocation,
} from "../../models";
import { makeId } from "../../utils/idGenerator";
import styles from "./ScopeImportPreview.module.scss";

export interface IScopeImportResult {
  items: IScopeItem[];
  /** Engineering hours items linked to imported scope items with needsEngineering */
  engineeringItems?: IEngineeringHoursItem[];
  /** Resource allocations from the engineering section */
  resourceAllocations?: IResourceAllocation[];
}

interface ScopeImportPreviewProps {
  scopeItems: IScopeItem[];
  onImport: (result: IScopeImportResult) => void;
  sourceName: string;
  /** Engineering items from the source (for cross-import) */
  sourceEngItems?: IEngineeringHoursItem[];
  /** Resource allocations from the source */
  sourceResourceAllocations?: IResourceAllocation[];
}

interface SectionGroup {
  section: IScopeItem;
  items: IScopeItem[];
}

export const ScopeImportPreview: React.FC<ScopeImportPreviewProps> = ({
  scopeItems,
  onImport,
  sourceName,
  sourceEngItems,
  sourceResourceAllocations,
}) => {
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [filterEng, setFilterEng] = React.useState(false);
  const [filterResource, setFilterResource] = React.useState<string>("");

  // Extract unique resource types for filter badges
  const resourceTypes = React.useMemo(() => {
    const types = new Set<string>();
    scopeItems.forEach((item) => {
      if (!item.isSection && item.resourceType) {
        types.add(item.resourceType);
      }
    });
    const result: string[] = [];
    types.forEach((t) => result.push(t));
    return result.sort();
  }, [scopeItems]);

  // Count items with engineering hours
  const engItemCount = React.useMemo(() => {
    let count = 0;
    scopeItems.forEach((item) => {
      if (!item.isSection && item.needsEngineering) count++;
    });
    return count;
  }, [scopeItems]);

  // Filter function
  const passesFilter = (item: IScopeItem): boolean => {
    if (filterEng && !item.needsEngineering) return false;
    if (filterResource && item.resourceType !== filterResource) return false;
    return true;
  };

  // Group items by section
  const { sections, unsectioned } = React.useMemo(() => {
    const sectionGroups: SectionGroup[] = [];
    const noSection: IScopeItem[] = [];

    // Find sections
    const sectionHeaders = scopeItems.filter((item) => item.isSection);
    sectionHeaders.forEach((sec) => {
      const children = scopeItems.filter(
        (item) => !item.isSection && item.sectionId === sec.id,
      );
      sectionGroups.push({ section: sec, items: children });
    });

    // Find items without a section
    const sectionIds = new Set(sectionHeaders.map((s) => s.id));
    scopeItems.forEach((item) => {
      if (
        !item.isSection &&
        (!item.sectionId || !sectionIds.has(item.sectionId))
      ) {
        noSection.push(item);
      }
    });

    return { sections: sectionGroups, unsectioned: noSection };
  }, [scopeItems]);

  // All selectable item IDs (non-section items only)
  const allItemIds = React.useMemo(() => {
    const ids: string[] = [];
    scopeItems.forEach((item) => {
      if (!item.isSection) ids.push(item.id);
    });
    return ids;
  }, [scopeItems]);

  const allSelected =
    selectedIds.size === allItemIds.length && allItemIds.length > 0;
  const someSelected = selectedIds.size > 0;

  const toggleAll = (): void => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allItemIds));
    }
  };

  const toggleSection = (
    sectionId: string,
    sectionItems: IScopeItem[],
  ): void => {
    const itemIds = sectionItems.map((i) => i.id);
    const allInSection = itemIds.every((id) => selectedIds.has(id));

    const next = new Set(selectedIds);
    if (allInSection) {
      itemIds.forEach((id) => next.delete(id));
    } else {
      itemIds.forEach((id) => next.add(id));
    }
    setSelectedIds(next);
  };

  const toggleItem = (itemId: string): void => {
    const next = new Set(selectedIds);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    setSelectedIds(next);
  };

  const toggleCollapse = (sectionId: string): void => {
    const next = new Set(collapsedSections);
    if (next.has(sectionId)) {
      next.delete(sectionId);
    } else {
      next.add(sectionId);
    }
    setCollapsedSections(next);
  };

  const isSectionSelected = (sectionItems: IScopeItem[]): boolean => {
    return (
      sectionItems.length > 0 &&
      sectionItems.every((i) => selectedIds.has(i.id))
    );
  };

  const isSectionPartial = (sectionItems: IScopeItem[]): boolean => {
    const hasSelected = sectionItems.some((i) => selectedIds.has(i.id));
    const hasUnselected = sectionItems.some((i) => !selectedIds.has(i.id));
    return hasSelected && hasUnselected;
  };

  const handleImport = (): void => {
    // Clone selected items with new IDs — preserve subItems, clientSpecs, attachments
    const selected = scopeItems.filter(
      (item) => !item.isSection && selectedIds.has(item.id),
    );

    // Also include parent sections for selected items (with their specs/attachments)
    const neededSectionIds = new Set<string>();
    selected.forEach((item) => {
      if (item.sectionId) neededSectionIds.add(item.sectionId);
    });

    const sectionMap = new Map<string, string>(); // old section id -> new section id
    const itemIdMap = new Map<string, string>(); // old item id -> new item id
    const result: IScopeItem[] = [];

    // Create new sections first — preserve clientSpecs, attachments, sectionColor
    neededSectionIds.forEach((oldSectionId) => {
      const originalSection = scopeItems.find(
        (item) => item.isSection && item.id === oldSectionId,
      );
      if (originalSection) {
        const newId = makeId("scope");
        sectionMap.set(oldSectionId, newId);
        result.push({
          ...originalSection,
          id: newId,
          lineNumber: 0,
          importedFromTemplate: sourceName,
          clientSpecs: originalSection.clientSpecs
            ? [...originalSection.clientSpecs]
            : undefined,
          attachments: originalSection.attachments
            ? [...originalSection.attachments]
            : undefined,
          sectionColor: originalSection.sectionColor,
        });
      }
    });

    // Create new items — preserve subItems, clientSpecs, attachments
    selected.forEach((item) => {
      const newSectionId = item.sectionId
        ? sectionMap.get(item.sectionId) || null
        : null;
      const clonedSubItems: IScopeSubItem[] | undefined = item.subItems
        ? item.subItems.map((sub) => ({ ...sub, id: makeId("sub") }))
        : undefined;
      const newItemId = makeId("scope");
      itemIdMap.set(item.id, newItemId);

      result.push({
        ...item,
        id: newItemId,
        lineNumber: 0,
        sectionId: newSectionId,
        importedFromTemplate: sourceName,
        subItems: clonedSubItems,
        clientSpecs: item.clientSpecs ? [...item.clientSpecs] : undefined,
        attachments: item.attachments ? [...item.attachments] : undefined,
      });
    });

    // Build engineering hours items for items with needsEngineering
    let engItems: IEngineeringHoursItem[] | undefined;
    let resAlloc: IResourceAllocation[] | undefined;
    if (sourceEngItems && sourceEngItems.length > 0) {
      const cloned: IEngineeringHoursItem[] = [];
      selected.forEach((item) => {
        if (!item.needsEngineering) return;
        const newScopeId = itemIdMap.get(item.id);
        if (!newScopeId) return;

        // Find engineering item in source linked to this scope item
        const srcEng = sourceEngItems.find((e) => e.scopeItemId === item.id);
        if (srcEng) {
          const newDeliverables: IEngineeringDeliverable[] = (
            srcEng.deliverables || []
          ).map((d) => ({
            ...d,
            id: makeId("del"),
          }));
          cloned.push({
            ...srcEng,
            id: makeId("eng"),
            scopeItemId: newScopeId,
            deliverables: newDeliverables,
          });
        } else {
          // No source eng item — create a placeholder entry
          cloned.push({
            id: makeId("eng"),
            scopeItemId: newScopeId,
            description: item.description || "",
            equipmentOffer: item.equipmentOffer || "",
            sectionName: "",
            notes: "",
            deliverables: [],
            totalHours: 0,
          });
        }
      });
      if (cloned.length > 0) engItems = cloned;

      // Also include resource allocations if available
      if (sourceResourceAllocations && sourceResourceAllocations.length > 0) {
        resAlloc = sourceResourceAllocations.map((r) => ({
          ...r,
          id: makeId("res"),
        }));
      }
    }

    onImport({
      items: result,
      engineeringItems: engItems,
      resourceAllocations: resAlloc,
    });
  };

  const renderItem = (item: IScopeItem): React.ReactElement | null => {
    if (!passesFilter(item)) return null;

    const subItems = item.subItems || [];
    const specs = item.clientSpecs || [];
    const attachments = item.attachments || [];
    // Find engineering data for this item
    const engData = sourceEngItems
      ? sourceEngItems.find((e) => e.scopeItemId === item.id)
      : undefined;
    const hasExtras =
      subItems.length > 0 ||
      specs.length > 0 ||
      attachments.length > 0 ||
      item.needsEngineering;

    return (
      <label
        key={item.id}
        className={`${styles.itemRow} ${selectedIds.has(item.id) ? styles.itemSelected : ""}`}
      >
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={selectedIds.has(item.id)}
          onChange={() => toggleItem(item.id)}
        />
        <div className={styles.itemInfo}>
          <span className={styles.itemDesc}>
            {item.description || "(No description)"}
          </span>
          <div className={styles.itemMeta}>
            {item.resourceType && (
              <span className={styles.itemTag}>{item.resourceType}</span>
            )}
            {item.equipmentOffer && (
              <span className={styles.itemEquip}>{item.equipmentOffer}</span>
            )}
            {(item.qtyOperational > 0 || item.qtySpare > 0) && (
              <span className={styles.itemQty}>
                Qty: {item.qtyOperational}
                {item.qtySpare > 0 ? ` + ${item.qtySpare} spare` : ""}
              </span>
            )}
          </div>
          {/* Badges for specs, attachments & engineering */}
          {hasExtras && (
            <div className={styles.itemBadges}>
              {item.needsEngineering && (
                <span className={`${styles.badge} ${styles.badgeEng}`}>
                  ⚙️ Eng. Hours
                  {engData ? ` · ${Math.round(engData.totalHours)}h` : ""}
                </span>
              )}
              {subItems.length > 0 && (
                <span className={styles.badge}>
                  {subItems.length} sub-item{subItems.length !== 1 ? "s" : ""}
                </span>
              )}
              {specs.length > 0 && (
                <span className={styles.badge}>
                  {specs.length} spec{specs.length !== 1 ? "s" : ""}
                </span>
              )}
              {attachments.length > 0 && (
                <span className={`${styles.badge} ${styles.badgeAttach}`}>
                  {attachments.length} attach.
                </span>
              )}
            </div>
          )}
          {/* Engineering hours detail */}
          {item.needsEngineering &&
            engData &&
            engData.deliverables &&
            engData.deliverables.length > 0 && (
              <div className={styles.engDetail}>
                {engData.deliverables.slice(0, 4).map((del, idx) => (
                  <span key={idx} className={styles.engDeliverable}>
                    {del.deliverableType}: {del.hours}h
                    {del.resourceType ? ` (${del.resourceType})` : ""}
                  </span>
                ))}
                {engData.deliverables.length > 4 && (
                  <span className={styles.engDeliverable}>
                    +{engData.deliverables.length - 4} more
                  </span>
                )}
              </div>
            )}
          {/* Sub-items preview */}
          {subItems.length > 0 && (
            <div className={styles.subItemsList}>
              {subItems.slice(0, 5).map((sub, idx) => (
                <div key={idx} className={styles.subItem}>
                  <span className={styles.subItemDot} />
                  <span>
                    {sub.description || sub.equipmentOffer || "Sub-item"}
                  </span>
                  {sub.partNumber && (
                    <span className={styles.subItemPn}>{sub.partNumber}</span>
                  )}
                </div>
              ))}
              {subItems.length > 5 && (
                <div className={styles.subItem}>
                  <span className={styles.subItemDot} />
                  <span>+{subItems.length - 5} more...</span>
                </div>
              )}
            </div>
          )}
        </div>
      </label>
    );
  };

  return (
    <div className={styles.container}>
      {/* Select All Bar */}
      <div className={styles.selectBar}>
        <label className={styles.selectAllLabel}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected && !allSelected;
            }}
            onChange={toggleAll}
          />
          <span>Select All ({allItemIds.length} items)</span>
        </label>
        {someSelected && (
          <button className={styles.importBtn} onClick={handleImport}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Import {selectedIds.size} item{selectedIds.size !== 1 ? "s" : ""}
          </button>
        )}
      </div>

      {/* Filter Bar */}
      {(engItemCount > 0 || resourceTypes.length > 0) && (
        <div className={styles.filterBar}>
          {engItemCount > 0 && (
            <button
              className={`${styles.filterBadge} ${filterEng ? styles.filterActive : ""}`}
              onClick={() => setFilterEng(!filterEng)}
            >
              ⚙️ Eng. Hours ({engItemCount})
            </button>
          )}
          {resourceTypes.map((rt) => (
            <button
              key={rt}
              className={`${styles.filterBadge} ${filterResource === rt ? styles.filterActive : ""}`}
              onClick={() => setFilterResource(filterResource === rt ? "" : rt)}
            >
              {rt}
            </button>
          ))}
          {(filterEng || filterResource) && (
            <button
              className={styles.filterClear}
              onClick={() => {
                setFilterEng(false);
                setFilterResource("");
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      )}

      {/* Content */}
      <div className={styles.previewList}>
        {/* Sections with items */}
        {sections.map((group) => {
          const visibleItems = group.items.filter(passesFilter);
          if (visibleItems.length === 0) return null;
          return (
            <div key={group.section.id} className={styles.sectionBlock}>
              <div className={styles.sectionHeader}>
                <button
                  className={styles.collapseBtn}
                  onClick={() => toggleCollapse(group.section.id)}
                >
                  {collapsedSections.has(group.section.id) ? "▶" : "▼"}
                </button>
                <label className={styles.sectionLabel}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={isSectionSelected(visibleItems)}
                    ref={(el) => {
                      if (el) el.indeterminate = isSectionPartial(visibleItems);
                    }}
                    onChange={() =>
                      toggleSection(group.section.id, visibleItems)
                    }
                  />
                  <span className={styles.sectionTitle}>
                    {group.section.sectionTitle || "Untitled Section"}
                  </span>
                  <span className={styles.sectionCount}>
                    ({visibleItems.length} item
                    {visibleItems.length !== 1 ? "s" : ""})
                  </span>
                </label>
              </div>
              {!collapsedSections.has(group.section.id) && (
                <div className={styles.sectionItems}>
                  {/* Section-level specs & attachments indicator */}
                  {((group.section.clientSpecs &&
                    group.section.clientSpecs.length > 0) ||
                    (group.section.attachments &&
                      group.section.attachments.length > 0)) && (
                    <div className={styles.sectionExtras}>
                      {group.section.clientSpecs &&
                        group.section.clientSpecs.length > 0 && (
                          <span className={styles.sectionExtraBadge}>
                            📋 {group.section.clientSpecs.length} section spec
                            {group.section.clientSpecs.length !== 1 ? "s" : ""}
                          </span>
                        )}
                      {group.section.attachments &&
                        group.section.attachments.length > 0 && (
                          <span className={styles.sectionExtraBadge}>
                            📎 {group.section.attachments.length} section
                            attach.
                          </span>
                        )}
                    </div>
                  )}
                  {group.items.map((item) => renderItem(item))}
                </div>
              )}
            </div>
          );
        })}

        {/* Unsectioned items */}
        {unsectioned.filter(passesFilter).length > 0 && (
          <div className={styles.sectionBlock}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle} style={{ marginLeft: 28 }}>
                Unsectioned Items
              </span>
              <span className={styles.sectionCount}>
                ({unsectioned.filter(passesFilter).length} item
                {unsectioned.filter(passesFilter).length !== 1 ? "s" : ""})
              </span>
            </div>
            <div className={styles.sectionItems}>
              {unsectioned.map((item) => renderItem(item))}
            </div>
          </div>
        )}

        {allItemIds.length === 0 && (
          <div className={styles.empty}>
            <p>No scope items found in this source</p>
          </div>
        )}
      </div>
    </div>
  );
};
