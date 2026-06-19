import * as React from "react";
import { IHoursSummary, IHoursItem, IHoursSectionGroup } from "../../models";
import { makeId } from "../../utils/idGenerator";
import styles from "./HoursImportPreview.module.scss";

interface HoursImportPreviewProps {
  hoursSummary: IHoursSummary;
  onImport: (hours: Partial<IHoursSummary>) => void;
  sourceName: string;
}

type HoursCategory = "engineering" | "onshore" | "offshore";

interface SelectionState {
  engineering: Set<string>;
  onshore: Set<string>;
  offshore: Set<string>;
}

export const HoursImportPreview: React.FC<HoursImportPreviewProps> = ({
  hoursSummary,
  onImport,
  sourceName,
}) => {
  const [selection, setSelection] = React.useState<SelectionState>({
    engineering: new Set(),
    onshore: new Set(),
    offshore: new Set(),
  });
  const [collapsedSections, setCollapsedSections] = React.useState<
    Set<HoursCategory>
  >(new Set());

  const engineeringItems = hoursSummary.engineeringHours?.items || [];
  const onshoreItems = hoursSummary.onshoreHours?.items || [];
  const offshoreItems = hoursSummary.offshoreHours?.items || [];

  const totalSelected =
    selection.engineering.size +
    selection.onshore.size +
    selection.offshore.size;

  const selectedTotalHours = React.useMemo(() => {
    let total = 0;
    engineeringItems.forEach((item) => {
      if (selection.engineering.has(item.id)) total += item.totalHours || 0;
    });
    onshoreItems.forEach((item) => {
      if (selection.onshore.has(item.id)) total += item.totalHours || 0;
    });
    offshoreItems.forEach((item) => {
      if (selection.offshore.has(item.id)) total += item.totalHours || 0;
    });
    return total;
  }, [selection, engineeringItems, onshoreItems, offshoreItems]);

  const toggleCollapse = (category: HoursCategory): void => {
    const next = new Set(collapsedSections);
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    setCollapsedSections(next);
  };

  const toggleItem = (category: HoursCategory, itemId: string): void => {
    const next = { ...selection };
    const set = new Set(next[category]);
    if (set.has(itemId)) {
      set.delete(itemId);
    } else {
      set.add(itemId);
    }
    next[category] = set;
    setSelection(next);
  };

  const toggleSection = (
    category: HoursCategory,
    items: IHoursItem[],
  ): void => {
    const next = { ...selection };
    const set = new Set(next[category]);
    const allSelected = items.every((i) => set.has(i.id));

    if (allSelected) {
      items.forEach((i) => set.delete(i.id));
    } else {
      items.forEach((i) => set.add(i.id));
    }
    next[category] = set;
    setSelection(next);
  };

  const toggleAll = (): void => {
    const allIds = [
      ...engineeringItems.map((i) => i.id),
      ...onshoreItems.map((i) => i.id),
      ...offshoreItems.map((i) => i.id),
    ];
    const allSelected = totalSelected === allIds.length && allIds.length > 0;

    if (allSelected) {
      setSelection({
        engineering: new Set(),
        onshore: new Set(),
        offshore: new Set(),
      });
    } else {
      setSelection({
        engineering: new Set(engineeringItems.map((i) => i.id)),
        onshore: new Set(onshoreItems.map((i) => i.id)),
        offshore: new Set(offshoreItems.map((i) => i.id)),
      });
    }
  };

  const isSectionAllSelected = (
    category: HoursCategory,
    items: IHoursItem[],
  ): boolean => {
    return (
      items.length > 0 && items.every((i) => selection[category].has(i.id))
    );
  };

  const isSectionPartial = (
    category: HoursCategory,
    items: IHoursItem[],
  ): boolean => {
    const hasSelected = items.some((i) => selection[category].has(i.id));
    const hasUnselected = items.some((i) => !selection[category].has(i.id));
    return hasSelected && hasUnselected;
  };

  const handleImport = (): void => {
    const result: Partial<IHoursSummary> = {};

    // Engineering hours
    if (selection.engineering.size > 0) {
      const selectedItems = engineeringItems
        .filter((i) => selection.engineering.has(i.id))
        .map((item) => ({
          ...item,
          id: makeId("hrs"),
          lineNumber: 0,
        }));
      const selectedSectionIds = new Set(
        selectedItems.map((i) => i.sectionId).filter(Boolean),
      );
      result.engineeringHours = {
        totalHours: selectedItems.reduce(
          (sum, i) => sum + (i.totalHours || 0),
          0,
        ),
        totalCostBRL: selectedItems.reduce(
          (sum, i) => sum + (i.costBRL || 0),
          0,
        ),
        items: selectedItems,
        sections: (hoursSummary.engineeringHours?.sections || []).filter((s) =>
          selectedSectionIds.has(s.id),
        ),
      };
    }

    // Onshore hours
    if (selection.onshore.size > 0) {
      const selectedItems = onshoreItems
        .filter((i) => selection.onshore.has(i.id))
        .map((item) => ({
          ...item,
          id: makeId("hrs"),
          lineNumber: 0,
        }));
      const selectedSectionIds = new Set(
        selectedItems.map((i) => i.sectionId).filter(Boolean),
      );
      result.onshoreHours = {
        totalHours: selectedItems.reduce(
          (sum, i) => sum + (i.totalHours || 0),
          0,
        ),
        totalCostBRL: selectedItems.reduce(
          (sum, i) => sum + (i.costBRL || 0),
          0,
        ),
        items: selectedItems,
        sections: (hoursSummary.onshoreHours?.sections || []).filter((s) =>
          selectedSectionIds.has(s.id),
        ),
      };
    }

    // Offshore hours
    if (selection.offshore.size > 0) {
      const selectedItems = offshoreItems
        .filter((i) => selection.offshore.has(i.id))
        .map((item) => ({
          ...item,
          id: makeId("hrs"),
          lineNumber: 0,
        }));
      const selectedSectionIds = new Set(
        selectedItems.map((i) => i.sectionId).filter(Boolean),
      );
      result.offshoreHours = {
        totalHours: selectedItems.reduce(
          (sum, i) => sum + (i.totalHours || 0),
          0,
        ),
        totalCostBRL: selectedItems.reduce(
          (sum, i) => sum + (i.costBRL || 0),
          0,
        ),
        items: selectedItems,
        sections: (hoursSummary.offshoreHours?.sections || []).filter((s) =>
          selectedSectionIds.has(s.id),
        ),
      };
    }

    onImport(result);
  };

  const allItemsCount =
    engineeringItems.length + onshoreItems.length + offshoreItems.length;
  const allSelected = totalSelected === allItemsCount && allItemsCount > 0;

  const renderHoursSection = (
    category: HoursCategory,
    label: string,
    icon: string,
    items: IHoursItem[],
  ): React.ReactElement | null => {
    if (items.length === 0) return null;

    const isCollapsed = collapsedSections.has(category);
    const sectionTotalHours = items.reduce(
      (sum, i) => sum + (i.totalHours || 0),
      0,
    );

    // Get the section groups for this category
    const sectionGroups: IHoursSectionGroup[] = (() => {
      if (category === "engineering")
        return hoursSummary.engineeringHours?.sections || [];
      if (category === "onshore")
        return hoursSummary.onshoreHours?.sections || [];
      if (category === "offshore")
        return hoursSummary.offshoreHours?.sections || [];
      return [];
    })();

    // Group items by sectionId
    const groupedItems: {
      group: IHoursSectionGroup | null;
      items: IHoursItem[];
    }[] = [];
    const ungrouped: IHoursItem[] = [];

    if (sectionGroups.length > 0) {
      sectionGroups.forEach((grp) => {
        const groupItems = items.filter((i) => i.sectionId === grp.id);
        if (groupItems.length > 0) {
          groupedItems.push({ group: grp, items: groupItems });
        }
      });
      // Items with no sectionId or sectionId not matching any group
      const groupIds = new Set(sectionGroups.map((g) => g.id));
      items.forEach((i) => {
        if (!i.sectionId || !groupIds.has(i.sectionId)) {
          ungrouped.push(i);
        }
      });
    } else {
      // No section groups — all items are ungrouped
      items.forEach((i) => ungrouped.push(i));
    }

    const renderItem = (item: IHoursItem): React.ReactElement => (
      <label
        key={item.id}
        className={`${styles.itemRow} ${selection[category].has(item.id) ? styles.itemSelected : ""}`}
      >
        <input
          type="checkbox"
          className={styles.checkbox}
          checked={selection[category].has(item.id)}
          onChange={() => toggleItem(category, item.id)}
        />
        <div className={styles.itemInfo}>
          <span className={styles.itemName}>
            {item.requirementName || item.function || "(No name)"}
          </span>
          <div className={styles.itemMeta}>
            {item.function && (
              <span className={styles.metaTag}>{item.function}</span>
            )}
            {item.phase && (
              <span className={styles.metaPhase}>{item.phase}</span>
            )}
            <span className={styles.metaHours}>
              {item.pplQty || 1}p × {item.workDays || 0}d ×{" "}
              {item.hoursPerDay || 0}h
            </span>
          </div>
        </div>
        <div className={styles.itemHours}>
          <span className={styles.hoursValue}>
            {Math.round(item.totalHours || 0)}
          </span>
          <span className={styles.hoursLabel}>hrs</span>
        </div>
      </label>
    );

    return (
      <div className={styles.sectionBlock}>
        <div className={styles.sectionHeader}>
          <button
            className={styles.collapseBtn}
            onClick={() => toggleCollapse(category)}
          >
            {isCollapsed ? "▶" : "▼"}
          </button>
          <label className={styles.sectionLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={isSectionAllSelected(category, items)}
              ref={(el) => {
                if (el) el.indeterminate = isSectionPartial(category, items);
              }}
              onChange={() => toggleSection(category, items)}
            />
            <span className={styles.sectionIcon}>{icon}</span>
            <span className={styles.sectionTitle}>{label}</span>
            <span className={styles.sectionCount}>
              {items.length} row{items.length !== 1 ? "s" : ""} ·{" "}
              {Math.round(sectionTotalHours)} hrs
            </span>
          </label>
        </div>
        {!isCollapsed && (
          <div className={styles.sectionItems}>
            {/* Render grouped items under their section headers */}
            {groupedItems.map((g) => {
              const grpHours = g.items.reduce(
                (s, i) => s + (i.totalHours || 0),
                0,
              );
              return (
                <div key={g.group!.id} className={styles.subGroup}>
                  <div className={styles.subGroupHeader}>
                    <span className={styles.subGroupTitle}>
                      {g.group!.title}
                    </span>
                    <span className={styles.subGroupCount}>
                      ({g.items.length} item{g.items.length !== 1 ? "s" : ""} ·{" "}
                      {Math.round(grpHours)}h)
                    </span>
                  </div>
                  {g.items.map((item) => renderItem(item))}
                </div>
              );
            })}
            {/* Ungrouped items */}
            {ungrouped.map((item) => renderItem(item))}
          </div>
        )}
      </div>
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
              if (el) el.indeterminate = totalSelected > 0 && !allSelected;
            }}
            onChange={toggleAll}
          />
          <span>Select All ({allItemsCount} items)</span>
        </label>
        {totalSelected > 0 && (
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
            Import {totalSelected} item{totalSelected !== 1 ? "s" : ""} (
            {Math.round(selectedTotalHours)} hrs)
          </button>
        )}
      </div>

      {/* Content */}
      <div className={styles.previewList}>
        {renderHoursSection(
          "engineering",
          "Engineering Hours",
          "⚙️",
          engineeringItems,
        )}
        {renderHoursSection("onshore", "Onshore Hours", "🏢", onshoreItems)}
        {renderHoursSection("offshore", "Offshore Hours", "🚢", offshoreItems)}

        {allItemsCount === 0 && (
          <div className={styles.empty}>
            <p>No hours data found in this source</p>
          </div>
        )}
      </div>
    </div>
  );
};
