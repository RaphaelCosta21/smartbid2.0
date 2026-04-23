import * as React from "react";
import { IScopeItem, IScopeSubItem, IClarificationItem } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { makeId } from "../../utils/idGenerator";
import styles from "./ScopeOfSupplyTab.module.scss";

interface ScopeOfSupplyTabProps {
  scopeItems: IScopeItem[];
  onSave: (items: IScopeItem[]) => void;
  readOnly?: boolean;
  clarifications?: IClarificationItem[];
}

const blankItem = (
  sectionId: string | null,
  lineNumber: number,
): IScopeItem => ({
  id: makeId("scope"),
  lineNumber,
  isSection: false,
  sectionId,
  sectionTitle: "",
  clientDocRef: "",
  description: "",
  compliance: null,
  resourceType: "",
  resourceSubType: "",
  equipmentOffer: "",
  partNumber: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
  clientRequirement: "",
  clientSpecs: [],
  subItems: [],
});

const blankSection = (lineNumber: number): IScopeItem => ({
  id: makeId("scope"),
  lineNumber,
  isSection: true,
  sectionId: null,
  sectionTitle: "New Section",
  clientDocRef: "",
  description: "",
  compliance: null,
  resourceType: "",
  resourceSubType: "",
  equipmentOffer: "",
  partNumber: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
  clientRequirement: "",
  clientSpecs: [],
  subItems: [],
});

const blankSubItem = (): IScopeSubItem => ({
  id: makeId("sub"),
  description: "",
  subType: "Consumable",
  equipmentOffer: "",
  partNumber: "",
  qty: 1,
  comments: "",
});

export const ScopeOfSupplyTab: React.FC<ScopeOfSupplyTabProps> = ({
  scopeItems,
  onSave,
  readOnly = false,
  clarifications = [],
}) => {
  // Helper: append fieldEmpty class when value is empty/falsy
  const emptyIf = (base: string, value: unknown): string =>
    value ? base : `${base} ${styles.fieldEmpty}`;

  const config = useConfigStore((s) => s.config);
  const resourceTypes = config?.resourceTypes || [];

  const [items, setItems] = React.useState<IScopeItem[]>(scopeItems || []);
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const [editingCell, setEditingCell] = React.useState<{
    id: string;
    field: string;
  } | null>(null);
  const [expandedCells, setExpandedCells] = React.useState<Set<string>>(
    new Set(),
  );
  const [clarPopup, setClarPopup] = React.useState<{
    id: string;
    x: number;
    y: number;
  } | null>(null);
  const [expandedSpecs, setExpandedSpecs] = React.useState<Set<string>>(
    new Set(),
  );
  const [specsBulkText, setSpecsBulkText] = React.useState<string>("");

  // Debounced save to prevent input lag
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestItemsRef = React.useRef<IScopeItem[]>(items);
  latestItemsRef.current = items;

  const debouncedSave = React.useCallback(
    (updated: IScopeItem[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        onSave(updated);
      }, 400);
    },
    [onSave],
  );

  // Sync external changes only when NOT actively editing
  const isEditingRef = React.useRef(false);
  isEditingRef.current = editingCell !== null;

  React.useEffect(() => {
    if (!isEditingRef.current && saveTimerRef.current === null) {
      setItems(scopeItems || []);
    }
  }, [scopeItems]);

  // Cleanup timer on unmount
  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persist = React.useCallback(
    (updated: IScopeItem[]) => {
      // Re-number lines
      let lineNum = 1;
      const renumbered = updated.map((item) => ({
        ...item,
        lineNumber: item.isSection ? 0 : lineNum++,
      }));
      setItems(renumbered);
      debouncedSave(renumbered);
    },
    [debouncedSave],
  );

  // ─── Computed ───
  const sections = items.filter((i) => i.isSection);
  const dataItems = items.filter((i) => !i.isSection);
  const itemsBySectionCount = React.useMemo(() => {
    const counts: Record<string, number> = { unsectioned: 0 };
    sections.forEach((s) => {
      counts[s.id] = 0;
    });
    dataItems.forEach((i) => {
      if (i.sectionId && counts[i.sectionId] !== undefined)
        counts[i.sectionId]++;
      else counts.unsectioned++;
    });
    return counts;
  }, [items, sections, dataItems]);

  const resourceTypeCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    dataItems.forEach((i) => {
      if (i.resourceType)
        counts[i.resourceType] = (counts[i.resourceType] || 0) + 1;
    });
    return counts;
  }, [dataItems]);

  // Resource type sub-tab filter (e.g. "All" / "ROV Asset" / "Tooling")
  const [resourceTypeFilter, setResourceTypeFilter] =
    React.useState<string>("all");
  const distinctResourceTypes = React.useMemo(() => {
    const types: string[] = [];
    dataItems.forEach((i) => {
      if (i.resourceType && types.indexOf(i.resourceType) === -1) {
        types.push(i.resourceType);
      }
    });
    return types;
  }, [dataItems]);
  const showResourceTypeFilter = distinctResourceTypes.length > 1;

  // ─── Handlers ───
  const addSection = (): void => {
    persist([...items, blankSection(items.length + 1)]);
    // Switch to "All" view so the new empty section is visible
    if (resourceTypeFilter !== "all") setResourceTypeFilter("all");
  };

  const addItem = (sectionId: string | null): void => {
    const newItem = blankItem(sectionId, items.length + 1);
    // Pre-fill resource type when adding from a filtered view
    if (resourceTypeFilter !== "all") {
      newItem.resourceType = resourceTypeFilter;
    }
    persist([...items, newItem]);
  };

  const deleteItem = (id: string): void => {
    const target = items.find((i) => i.id === id);
    if (target && target.isSection) {
      // Cascade: remove the section AND all items that belong to it
      persist(items.filter((i) => i.id !== id && i.sectionId !== id));
    } else {
      persist(items.filter((i) => i.id !== id));
    }
  };

  const updateField = (
    id: string,
    field: keyof IScopeItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== id) return i;
      const patched = { ...i, [field]: value };
      // Clear sub-type when resource type changes
      if (field === "resourceType") patched.resourceSubType = "";
      return patched;
    });
    persist(updated);
  };

  // Move an item to a different section (or to unsectioned with null)
  const moveItemToSection = (
    itemId: string,
    targetSectionId: string | null,
  ): void => {
    const updated = items.map((i) =>
      i.id === itemId ? { ...i, sectionId: targetSectionId } : i,
    );
    // Reorder: move item after the target section header (or to front if unsectioned)
    const movedItem = updated.find((i) => i.id === itemId);
    if (!movedItem) return;
    const without = updated.filter((i) => i.id !== itemId);
    if (targetSectionId) {
      const sectionIdx = without.findIndex((i) => i.id === targetSectionId);
      if (sectionIdx >= 0) {
        // Find last child of this section
        let insertIdx = sectionIdx + 1;
        while (
          insertIdx < without.length &&
          !without[insertIdx].isSection &&
          without[insertIdx].sectionId === targetSectionId
        ) {
          insertIdx++;
        }
        without.splice(insertIdx, 0, movedItem);
      } else {
        without.push(movedItem);
      }
    } else {
      // Move to front (unsectioned items go first)
      const firstSectionIdx = without.findIndex((i) => i.isSection);
      if (firstSectionIdx >= 0) {
        without.splice(firstSectionIdx, 0, movedItem);
      } else {
        without.push(movedItem);
      }
    }
    persist(without);
  };

  // Section color presets
  const SECTION_COLORS = [
    "", // default (accent-color)
    "#3b82f6", // blue
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
    "#ec4899", // pink
    "#6366f1", // indigo
    "#84cc16", // lime
  ];

  const toggleSection = (sectionId: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const allSectionsCollapsed =
    sections.length > 0 && sections.every((s) => collapsedSections.has(s.id));

  const toggleAllSections = (): void => {
    if (allSectionsCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(sections.map((s) => s.id)));
    }
  };

  // ─── Get ordered items (sections with children grouped) ───
  const orderedItems = React.useMemo(() => {
    const result: IScopeItem[] = [];
    const unsectioned = dataItems.filter((i) => !i.sectionId);

    // Unsectioned items first
    unsectioned.forEach((i) => result.push(i));

    // Then each section + its children (always include children for ordering)
    sections.forEach((sec) => {
      result.push(sec);
      dataItems
        .filter((i) => i.sectionId === sec.id)
        .forEach((i) => result.push(i));
    });

    return result;
  }, [items, sections, dataItems]);

  // Visible ordered items (respects collapsed + resource type filter)
  const visibleOrderedItems = React.useMemo(() => {
    // Build set of section IDs that have at least one matching data item
    const sectionIdsWithMatch = new Set<string>();
    if (resourceTypeFilter !== "all") {
      dataItems.forEach((i) => {
        if (i.sectionId && i.resourceType === resourceTypeFilter) {
          sectionIdsWithMatch.add(i.sectionId);
        }
      });
    }

    return orderedItems.filter((item) => {
      // Respect collapsed sections
      if (
        !item.isSection &&
        item.sectionId &&
        collapsedSections.has(item.sectionId)
      )
        return false;
      // Resource type filter
      if (resourceTypeFilter !== "all") {
        if (item.isSection) {
          // Show section only if it has matching children
          return sectionIdsWithMatch.has(item.id);
        }
        if (!item.resourceType || item.resourceType !== resourceTypeFilter) {
          return false;
        }
      }
      return true;
    });
  }, [orderedItems, collapsedSections, resourceTypeFilter, dataItems]);

  // ─── Reorder (uses visual ordering) ───
  const moveItem = (id: string, direction: "up" | "down"): void => {
    const item = orderedItems.find((i) => i.id === id);
    if (!item) return;

    if (item.isSection) {
      // Move entire section block (section + children) among other blocks
      // Build blocks: each block is either a single unsectioned item or a section + its children
      const blocks: IScopeItem[][] = [];
      for (let i = 0; i < orderedItems.length; ) {
        const cur = orderedItems[i];
        if (cur.isSection) {
          const block = [cur];
          let j = i + 1;
          while (
            j < orderedItems.length &&
            !orderedItems[j].isSection &&
            orderedItems[j].sectionId === cur.id
          ) {
            block.push(orderedItems[j]);
            j++;
          }
          blocks.push(block);
          i = j;
        } else {
          blocks.push([cur]);
          i++;
        }
      }
      const blockIdx = blocks.findIndex((b) => b[0].id === id);
      if (blockIdx < 0) return;
      const targetIdx = direction === "up" ? blockIdx - 1 : blockIdx + 1;
      if (targetIdx < 0 || targetIdx >= blocks.length) return;
      const temp = blocks[blockIdx];
      blocks[blockIdx] = blocks[targetIdx];
      blocks[targetIdx] = temp;
      persist(([] as IScopeItem[]).concat(...blocks));
    } else {
      // Move individual item within the ordered list
      const ordered = [...orderedItems];
      const idx = ordered.findIndex((i) => i.id === id);
      if (idx < 0) return;
      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= ordered.length) return;
      // Don't swap an item with a section header
      if (ordered[targetIdx].isSection) return;
      const temp = ordered[idx];
      ordered[idx] = ordered[targetIdx];
      ordered[targetIdx] = temp;
      persist(ordered);
    }
  };

  // ─── Toggle expanded cells ───
  const toggleCellExpand = (cellKey: string): void => {
    setExpandedCells((prev) => {
      const next = new Set(prev);
      if (next.has(cellKey)) next.delete(cellKey);
      else next.add(cellKey);
      return next;
    });
  };

  // ─── Toggle specs panel ───
  const toggleSpecsExpand = (itemId: string): void => {
    setExpandedSpecs((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
        setSpecsBulkText("");
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const hasSpecs = (item: IScopeItem): boolean => {
    return !!(
      (item.clientRequirement && item.clientRequirement.trim()) ||
      (item.clientSpecs && item.clientSpecs.length > 0)
    );
  };

  const updateSpecs = (
    id: string,
    clientRequirement: string,
    clientSpecs: string[],
  ): void => {
    const updated = items.map((i) =>
      i.id === id ? { ...i, clientRequirement, clientSpecs } : i,
    );
    persist(updated);
  };

  const handleBulkImportSpecs = (id: string): void => {
    if (!specsBulkText.trim()) return;
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const newLines = specsBulkText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    const merged = [...(item.clientSpecs || []), ...newLines];
    updateSpecs(id, item.clientRequirement || "", merged);
    setSpecsBulkText("");
  };

  // ─── Sub-items panel ───
  // Map<itemId, boolean>: true=open, false=closed, absent=default (open if has sub-items)
  const [subItemsToggleState, setSubItemsToggleState] = React.useState<
    Record<string, boolean>
  >({});

  const toggleSubItemsExpand = (itemId: string): void => {
    setSubItemsToggleState((prev) => {
      const current = prev[itemId];
      const copy = { ...prev };
      if (current === undefined) {
        // First toggle: if it had sub-items it was open, close it; otherwise open it
        copy[itemId] = !hasSubItems(
          items.find((i) => i.id === itemId) || ({} as IScopeItem),
        );
      } else {
        copy[itemId] = !current;
      }
      return copy;
    });
  };

  const isSubItemsPanelOpen = (
    itemId: string,
    itemHasSubs: boolean,
  ): boolean => {
    const explicit = subItemsToggleState[itemId];
    if (explicit !== undefined) return explicit;
    return itemHasSubs; // default: open if has sub-items
  };

  const hasSubItems = (item: IScopeItem): boolean => {
    return !!(item.subItems && item.subItems.length > 0);
  };

  const addSubItem = (itemId: string): void => {
    const updated = items.map((i) =>
      i.id === itemId
        ? { ...i, subItems: [...(i.subItems || []), blankSubItem()] }
        : i,
    );
    persist(updated);
  };

  const updateSubItem = (
    itemId: string,
    subId: string,
    field: keyof IScopeSubItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      const subs = (i.subItems || []).map((s) =>
        s.id === subId ? { ...s, [field]: value } : s,
      );
      return { ...i, subItems: subs };
    });
    persist(updated);
  };

  const deleteSubItem = (itemId: string, subId: string): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      return {
        ...i,
        subItems: (i.subItems || []).filter((s) => s.id !== subId),
      };
    });
    persist(updated);
  };

  // Get sub-types for a given resource type
  const getSubTypes = (resType: string): { label: string; value: string }[] => {
    const rt = resourceTypes.find((r) => r.label === resType);
    if (!rt) return [];
    return (rt.subTypes || [])
      .filter((s) => s.isActive !== false)
      .map((s) => ({ label: s.label, value: s.value }));
  };

  // ─── Column headers ───
  const columns = [
    "",
    "#",
    "Client Doc Ref",
    "Item Description",
    "Compliance",
    "Resource Type",
    "Sub-Type",
    "Equipment Offer",
    "OII/MFG PN",
    "Qty Op",
    "Qty Spare",
    "Cert?",
    "Comments",
  ];

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Items</span>
          <span className={styles.summaryValue}>{dataItems.length}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Sections</span>
          <span className={styles.summaryValue}>{sections.length}</span>
        </div>
        {Object.entries(resourceTypeCounts).map(([type, count]) => (
          <div key={type} className={styles.summaryCard}>
            <span className={styles.summaryLabel}>{type}</span>
            <span className={styles.summaryValue}>{count}</span>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      {!readOnly && (
        <div className={styles.toolbar}>
          <button
            className={`${styles.toolbarBtn} ${styles.primary}`}
            onClick={() => addItem(null)}
          >
            + Add Item
          </button>
          <button className={styles.toolbarBtn} onClick={addSection}>
            + Add Section
          </button>
          {sections.length > 0 && (
            <button className={styles.toolbarBtn} onClick={toggleAllSections}>
              {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
            </button>
          )}
        </div>
      )}
      {readOnly && sections.length > 0 && (
        <div className={styles.toolbar}>
          <button className={styles.toolbarBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        </div>
      )}

      {/* Resource Type Sub-Tabs */}
      {showResourceTypeFilter && (
        <div className={styles.subTabBar}>
          <button
            className={`${styles.subTab} ${resourceTypeFilter === "all" ? styles.subTabActive : ""}`}
            onClick={() => setResourceTypeFilter("all")}
          >
            All ({dataItems.length})
          </button>
          {distinctResourceTypes.map((rt) => (
            <button
              key={rt}
              className={`${styles.subTab} ${resourceTypeFilter === rt ? styles.subTabActive : ""}`}
              onClick={() => setResourceTypeFilter(rt)}
            >
              {rt} ({resourceTypeCounts[rt] || 0})
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      {orderedItems.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <div>No scope items yet</div>
          {!readOnly && (
            <p>
              Click &quot;+ Add Item&quot; or &quot;+ Add Section&quot; to start
              building the scope of supply.
            </p>
          )}
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((h) => (
                  <th key={h}>{h}</th>
                ))}
                {!readOnly && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {visibleOrderedItems.map((item) => {
                if (item.isSection) {
                  const isCollapsed = collapsedSections.has(item.id);
                  const sColor = item.sectionColor || "";
                  const sectionStyle: React.CSSProperties = sColor
                    ? {
                        background: `${sColor}15`,
                        borderBottomColor: sColor,
                      }
                    : {};
                  const titleStyle: React.CSSProperties = sColor
                    ? { color: sColor }
                    : {};
                  const isSectionSpecsOpen = expandedSpecs.has(item.id);
                  const sectionHasSpecs = hasSpecs(item);
                  const totalColsSection = columns.length + (!readOnly ? 1 : 0);
                  return (
                    <React.Fragment key={item.id}>
                      <tr className={styles.sectionRow} style={sectionStyle}>
                        <td
                          colSpan={columns.length + (!readOnly ? 1 : 0)}
                          style={
                            sColor
                              ? {
                                  background: `${sColor}15`,
                                  borderBottomColor: sColor,
                                  borderBottomWidth: 2,
                                  borderBottomStyle: "solid",
                                }
                              : undefined
                          }
                        >
                          <div
                            className={styles.sectionHeader}
                            onClick={() => toggleSection(item.id)}
                            style={titleStyle}
                          >
                            <span
                              className={`${styles.chevron} ${isCollapsed ? styles.collapsed : ""}`}
                            >
                              ▼
                            </span>
                            {editingCell?.id === item.id &&
                            editingCell?.field === "sectionTitle" &&
                            !readOnly ? (
                              <input
                                className={styles.editInput}
                                value={item.sectionTitle}
                                autoFocus
                                onChange={(e) =>
                                  updateField(
                                    item.id,
                                    "sectionTitle",
                                    e.target.value,
                                  )
                                }
                                onBlur={() => setEditingCell(null)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") setEditingCell(null);
                                }}
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <span
                                onDoubleClick={() =>
                                  !readOnly &&
                                  setEditingCell({
                                    id: item.id,
                                    field: "sectionTitle",
                                  })
                                }
                              >
                                {item.sectionTitle || "Untitled Section"}
                              </span>
                            )}
                            <span
                              style={{
                                fontSize: 11,
                                color: "var(--text-secondary)",
                                fontWeight: 400,
                              }}
                            >
                              ({itemsBySectionCount[item.id] || 0} items)
                            </span>
                            {!readOnly && (
                              <div
                                className={styles.sectionActions}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <button
                                  className={`${styles.actionBtn} ${styles.reorder}`}
                                  onClick={() => moveItem(item.id, "up")}
                                  title="Move section up"
                                >
                                  ▲
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.reorder}`}
                                  onClick={() => moveItem(item.id, "down")}
                                  title="Move section down"
                                >
                                  ▼
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.edit}`}
                                  onClick={() => addItem(item.id)}
                                >
                                  + Item
                                </button>
                                <div className={styles.colorPicker}>
                                  <button
                                    className={styles.colorPickerBtn}
                                    title="Section color"
                                    style={
                                      sColor
                                        ? { background: sColor }
                                        : undefined
                                    }
                                  >
                                    🎨
                                  </button>
                                  <div className={styles.colorPickerDropdown}>
                                    {SECTION_COLORS.map((c) => (
                                      <button
                                        key={c || "default"}
                                        className={`${styles.colorSwatch} ${(c || "") === (sColor || "") ? styles.colorSwatchActive : ""}`}
                                        style={
                                          c
                                            ? { background: c }
                                            : {
                                                background:
                                                  "var(--accent-color)",
                                              }
                                        }
                                        onClick={() =>
                                          updateField(
                                            item.id,
                                            "sectionColor",
                                            c,
                                          )
                                        }
                                        title={c || "Default"}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <button
                                  className={`${styles.actionBtn} ${styles.specsToggle} ${sectionHasSpecs ? styles.hasSpecs : ""}`}
                                  onClick={() => toggleSpecsExpand(item.id)}
                                  title={
                                    isSectionSpecsOpen
                                      ? "Collapse section specs"
                                      : "Section technical specs"
                                  }
                                >
                                  {isSectionSpecsOpen ? "▼" : "▶"} 📋
                                </button>
                                <button
                                  className={`${styles.actionBtn} ${styles.delete}`}
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete section "${item.sectionTitle || "Untitled"}"? Items in this section will also be removed.`,
                                      )
                                    )
                                      deleteItem(item.id);
                                  }}
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Section-level specs detail row */}
                      {isSectionSpecsOpen && (
                        <tr className={styles.specsDetailRow}>
                          <td colSpan={totalColsSection}>
                            <div className={styles.specsPanel}>
                              <div className={styles.specsPanelHeader}>
                                <span className={styles.specsPanelIcon}>
                                  📎
                                </span>
                                <div className={styles.specsPanelTitleGroup}>
                                  <span className={styles.specsPanelTitle}>
                                    Client Technical Specifications
                                  </span>
                                  <span className={styles.specsPanelSubtitle}>
                                    Optional — fill in when the client provides
                                    detailed requirements in the ET for this
                                    section
                                  </span>
                                </div>
                                <button
                                  className={styles.specsPanelClose}
                                  onClick={() => toggleSpecsExpand(item.id)}
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Client Requirement (main solicitation) */}
                              <div className={styles.specsSection}>
                                <label className={styles.specsLabel}>
                                  Client Requirement
                                </label>
                                {readOnly ? (
                                  <p className={styles.specsRequirementText}>
                                    {item.clientRequirement || (
                                      <span className={styles.specsEmpty}>
                                        No client requirement defined.
                                      </span>
                                    )}
                                  </p>
                                ) : (
                                  <textarea
                                    className={styles.specsTextarea}
                                    value={item.clientRequirement || ""}
                                    placeholder="Full text of the client's section-level requirement from the ET document."
                                    rows={3}
                                    onChange={(e) =>
                                      updateSpecs(
                                        item.id,
                                        e.target.value,
                                        item.clientSpecs || [],
                                      )
                                    }
                                  />
                                )}
                              </div>

                              {/* Technical Specifications List */}
                              <div className={styles.specsSection}>
                                <label className={styles.specsLabel}>
                                  Technical Specifications
                                  {(item.clientSpecs || []).length > 0 && (
                                    <span className={styles.specsBadge}>
                                      {(item.clientSpecs || []).length}
                                    </span>
                                  )}
                                </label>

                                {(item.clientSpecs || []).length > 0 ? (
                                  <div className={styles.specsList}>
                                    {(item.clientSpecs || []).map(
                                      (spec, idx) => (
                                        <div
                                          key={idx}
                                          className={styles.specsItem}
                                        >
                                          <span
                                            className={styles.specsItemNumber}
                                          >
                                            {idx + 1}
                                          </span>
                                          {readOnly ? (
                                            <span
                                              className={styles.specsItemText}
                                            >
                                              {spec}
                                            </span>
                                          ) : (
                                            <input
                                              className={styles.specsItemInput}
                                              value={spec}
                                              onChange={(e) => {
                                                const updated = [
                                                  ...(item.clientSpecs || []),
                                                ];
                                                updated[idx] = e.target.value;
                                                updateSpecs(
                                                  item.id,
                                                  item.clientRequirement || "",
                                                  updated,
                                                );
                                              }}
                                            />
                                          )}
                                          {!readOnly && (
                                            <button
                                              className={styles.specsItemDelete}
                                              onClick={() => {
                                                const updated = (
                                                  item.clientSpecs || []
                                                ).filter((_, i) => i !== idx);
                                                updateSpecs(
                                                  item.id,
                                                  item.clientRequirement || "",
                                                  updated,
                                                );
                                              }}
                                              title="Remove spec"
                                            >
                                              ✕
                                            </button>
                                          )}
                                        </div>
                                      ),
                                    )}
                                  </div>
                                ) : (
                                  <p className={styles.specsEmpty}>
                                    No technical specifications added yet.
                                  </p>
                                )}

                                {/* Add specs controls (edit mode only) */}
                                {!readOnly && (
                                  <div className={styles.specsAddControls}>
                                    <button
                                      className={styles.specsAddBtn}
                                      onClick={() => {
                                        const updated = [
                                          ...(item.clientSpecs || []),
                                          "",
                                        ];
                                        updateSpecs(
                                          item.id,
                                          item.clientRequirement || "",
                                          updated,
                                        );
                                      }}
                                    >
                                      + Add Specification
                                    </button>
                                    <div className={styles.specsBulkImport}>
                                      <label className={styles.specsBulkLabel}>
                                        Bulk Import (one spec per line):
                                      </label>
                                      <textarea
                                        className={styles.specsTextarea}
                                        value={specsBulkText}
                                        placeholder={
                                          "Paste specifications here, one per line..."
                                        }
                                        rows={4}
                                        onChange={(e) =>
                                          setSpecsBulkText(e.target.value)
                                        }
                                      />
                                      <button
                                        className={styles.specsBulkBtn}
                                        onClick={() =>
                                          handleBulkImportSpecs(item.id)
                                        }
                                        disabled={!specsBulkText.trim()}
                                      >
                                        Import Lines
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                }

                // Data row
                const subTypes = getSubTypes(item.resourceType);
                const commentsKey = `comments-${item.id}`;
                const clientDocKey = `clientDoc-${item.id}`;
                const isCommentsExpanded = expandedCells.has(commentsKey);
                const isClientDocExpanded = expandedCells.has(clientDocKey);
                const isSpecsOpen = expandedSpecs.has(item.id);
                const itemHasSpecs = hasSpecs(item);
                const itemHasSubItems = hasSubItems(item);
                const isSubItemsOpen = isSubItemsPanelOpen(
                  item.id,
                  itemHasSubItems,
                );
                const totalCols = columns.length + (!readOnly ? 1 : 0);
                return (
                  <React.Fragment key={item.id}>
                    <tr
                      className={`${styles.mainItemRow}${isSpecsOpen ? ` ${styles.specsOpenRow}` : ""}`}
                    >
                      {/* Reorder */}
                      <td
                        className={styles.cellCenter}
                        style={{ width: 28, padding: "0 2px" }}
                      >
                        {!readOnly ? (
                          <div className={styles.reorderBtns}>
                            <button
                              className={styles.reorderBtn}
                              onClick={() => moveItem(item.id, "up")}
                              title="Move up"
                            >
                              ▲
                            </button>
                            <button
                              className={styles.reorderBtn}
                              onClick={() => moveItem(item.id, "down")}
                              title="Move down"
                            >
                              ▼
                            </button>
                          </div>
                        ) : itemHasSpecs || itemHasSubItems ? (
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 2,
                            }}
                          >
                            {itemHasSpecs && (
                              <button
                                className={`${styles.actionBtn} ${styles.specsToggle} ${styles.hasSpecs}`}
                                onClick={() => toggleSpecsExpand(item.id)}
                                title={
                                  isSpecsOpen
                                    ? "Collapse client specs"
                                    : "View client specs"
                                }
                                style={{ padding: 0, fontSize: 10 }}
                              >
                                {isSpecsOpen ? "▼" : "▶"} 📋
                              </button>
                            )}
                            {itemHasSubItems && (
                              <button
                                className={`${styles.actionBtn} ${styles.subItemsToggle} ${styles.hasSubItems}`}
                                onClick={() => toggleSubItemsExpand(item.id)}
                                title={
                                  isSubItemsOpen
                                    ? "Collapse sub-items"
                                    : "View sub-items"
                                }
                                style={{ padding: 0, fontSize: 10 }}
                              >
                                {isSubItemsOpen ? "▼" : "▶"} 📦
                              </button>
                            )}
                          </div>
                        ) : null}
                      </td>
                      <td className={styles.cellCenter}>{item.lineNumber}</td>
                      {/* Client Doc Ref - collapsible */}
                      <td>
                        {editingCell?.id === item.id &&
                        editingCell?.field === "clientDocRef" &&
                        !readOnly ? (
                          <input
                            className={styles.editInput}
                            value={item.clientDocRef}
                            autoFocus
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "clientDocRef",
                                e.target.value,
                              )
                            }
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null);
                            }}
                          />
                        ) : (
                          <div
                            className={`${styles.truncatedCell} ${isClientDocExpanded ? styles.expanded : ""}`}
                            onClick={() =>
                              item.clientDocRef &&
                              item.clientDocRef.length > 20 &&
                              toggleCellExpand(clientDocKey)
                            }
                            onDoubleClick={() =>
                              !readOnly &&
                              setEditingCell({
                                id: item.id,
                                field: "clientDocRef",
                              })
                            }
                            title={item.clientDocRef || undefined}
                          >
                            {item.clientDocRef || "—"}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className={styles.descriptionCell}>
                          <EditableCell
                            value={item.description}
                            readOnly={readOnly}
                            isEditing={
                              editingCell?.id === item.id &&
                              editingCell?.field === "description"
                            }
                            onStartEdit={() =>
                              setEditingCell({
                                id: item.id,
                                field: "description",
                              })
                            }
                            onEndEdit={() => setEditingCell(null)}
                            onChange={(v) =>
                              updateField(item.id, "description", v)
                            }
                          />
                          {itemHasSpecs && !isSpecsOpen && (
                            <span
                              className={styles.specsCountBadge}
                              onClick={() => toggleSpecsExpand(item.id)}
                              title="Click to view client specs"
                            >
                              📋{" "}
                              {(item.clientSpecs || []).length > 0
                                ? `${(item.clientSpecs || []).length} spec${(item.clientSpecs || []).length !== 1 ? "s" : ""}`
                                : "specs"}
                            </span>
                          )}
                          {itemHasSubItems && !isSubItemsOpen && (
                            <span
                              className={styles.subItemsCountBadge}
                              onClick={() => toggleSubItemsExpand(item.id)}
                              title="Click to view sub-items"
                            >
                              📦 {(item.subItems || []).length} sub-item
                              {(item.subItems || []).length !== 1 ? "s" : ""}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          <span>
                            {item.compliance === "yes"
                              ? "Yes"
                              : item.compliance === "no"
                                ? "No"
                                : "—"}
                          </span>
                        ) : (
                          <div className={styles.complianceToggle}>
                            <button
                              className={`${styles.complianceBtn} ${styles.yes} ${item.compliance === "yes" ? styles.active : ""}`}
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "compliance",
                                  item.compliance === "yes" ? null : "yes",
                                )
                              }
                            >
                              Yes
                            </button>
                            <button
                              className={`${styles.complianceBtn} ${styles.no} ${item.compliance === "no" ? styles.active : ""}`}
                              onClick={() =>
                                updateField(
                                  item.id,
                                  "compliance",
                                  item.compliance === "no" ? null : "no",
                                )
                              }
                            >
                              No
                            </button>
                            {item.compliance === "no" && (
                              <span
                                className={styles.clarIndicator}
                                title="Clarification/Qualification required — click to view"
                                onClick={(e) => {
                                  const rect = (
                                    e.target as HTMLElement
                                  ).getBoundingClientRect();
                                  setClarPopup({
                                    id: item.id,
                                    x: rect.left,
                                    y: rect.bottom + 4,
                                  });
                                }}
                              >
                                ⚠
                              </span>
                            )}
                          </div>
                        )}
                      </td>
                      <td>
                        {readOnly ? (
                          item.resourceType || "—"
                        ) : (
                          <select
                            className={emptyIf(
                              styles.editSelect,
                              item.resourceType,
                            )}
                            value={item.resourceType}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "resourceType",
                                e.target.value,
                              )
                            }
                          >
                            <option value="" disabled hidden>
                              Select...
                            </option>
                            {resourceTypes
                              .filter((r) => r.isActive)
                              .map((r) => (
                                <option key={r.id} value={r.label}>
                                  {r.label}
                                </option>
                              ))}
                          </select>
                        )}
                      </td>
                      <td>
                        {readOnly ? (
                          item.resourceSubType || "—"
                        ) : (
                          <select
                            className={emptyIf(
                              styles.editSelect,
                              item.resourceSubType,
                            )}
                            value={item.resourceSubType}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "resourceSubType",
                                e.target.value,
                              )
                            }
                            disabled={!item.resourceType}
                          >
                            <option value="" disabled hidden>
                              Select...
                            </option>
                            {subTypes.map((s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                      <td>
                        <EditableCell
                          value={item.equipmentOffer}
                          readOnly={readOnly}
                          isEditing={
                            editingCell?.id === item.id &&
                            editingCell?.field === "equipmentOffer"
                          }
                          onStartEdit={() =>
                            setEditingCell({
                              id: item.id,
                              field: "equipmentOffer",
                            })
                          }
                          onEndEdit={() => setEditingCell(null)}
                          onChange={(v) =>
                            updateField(item.id, "equipmentOffer", v)
                          }
                        />
                      </td>
                      <td>
                        <EditableCell
                          value={item.partNumber}
                          readOnly={readOnly}
                          mono
                          isEditing={
                            editingCell?.id === item.id &&
                            editingCell?.field === "partNumber"
                          }
                          onStartEdit={() =>
                            setEditingCell({
                              id: item.id,
                              field: "partNumber",
                            })
                          }
                          onEndEdit={() => setEditingCell(null)}
                          onChange={(v) =>
                            updateField(item.id, "partNumber", v)
                          }
                        />
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          item.qtyOperational
                        ) : (
                          <input
                            className={styles.editInputSmall}
                            type="number"
                            min={0}
                            value={item.qtyOperational}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "qtyOperational",
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        )}
                      </td>
                      <td className={styles.cellCenter}>
                        {readOnly ? (
                          item.qtySpare
                        ) : (
                          <input
                            className={styles.editInputSmall}
                            type="number"
                            min={0}
                            value={item.qtySpare}
                            onChange={(e) =>
                              updateField(
                                item.id,
                                "qtySpare",
                                Number(e.target.value) || 0,
                              )
                            }
                          />
                        )}
                      </td>
                      <td className={styles.cellCenter}>
                        <input
                          className={styles.checkbox}
                          type="checkbox"
                          checked={item.needsCertification}
                          disabled={readOnly}
                          onChange={(e) =>
                            updateField(
                              item.id,
                              "needsCertification",
                              e.target.checked,
                            )
                          }
                        />
                      </td>
                      {/* Comments - collapsible */}
                      <td>
                        {editingCell?.id === item.id &&
                        editingCell?.field === "comments" &&
                        !readOnly ? (
                          <input
                            className={styles.editInput}
                            value={item.comments}
                            autoFocus
                            onChange={(e) =>
                              updateField(item.id, "comments", e.target.value)
                            }
                            onBlur={() => setEditingCell(null)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") setEditingCell(null);
                            }}
                          />
                        ) : (
                          <div
                            className={`${styles.truncatedCell} ${isCommentsExpanded ? styles.expanded : ""}`}
                            onClick={() =>
                              item.comments &&
                              item.comments.length > 25 &&
                              toggleCellExpand(commentsKey)
                            }
                            onDoubleClick={() =>
                              !readOnly &&
                              setEditingCell({ id: item.id, field: "comments" })
                            }
                            title={item.comments || undefined}
                          >
                            {item.comments || "—"}
                          </div>
                        )}
                      </td>
                      {!readOnly && (
                        <td>
                          <div className={styles.actionsCell}>
                            <button
                              className={`${styles.actionBtn} ${styles.specsToggle} ${itemHasSpecs ? styles.hasSpecs : ""}`}
                              onClick={() => toggleSpecsExpand(item.id)}
                              title={
                                isSpecsOpen
                                  ? "Collapse client specs"
                                  : "Client technical specs"
                              }
                            >
                              {isSpecsOpen ? "▼" : "▶"} 📋
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.subItemsToggle} ${itemHasSubItems ? styles.hasSubItems : ""}`}
                              onClick={() => toggleSubItemsExpand(item.id)}
                              title={
                                isSubItemsOpen
                                  ? "Collapse sub-items"
                                  : "Sub-items (consumables, spares)"
                              }
                            >
                              {isSubItemsOpen ? "▼" : "▶"} 📦
                              {itemHasSubItems && (
                                <span className={styles.subItemsBadge}>
                                  {(item.subItems || []).length}
                                </span>
                              )}
                            </button>
                            {sections.length > 0 && (
                              <select
                                className={styles.moveSectionSelect}
                                value={item.sectionId || ""}
                                onChange={(e) =>
                                  moveItemToSection(
                                    item.id,
                                    e.target.value || null,
                                  )
                                }
                                title="Move to section"
                              >
                                <option value="">— No Section —</option>
                                {sections.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.sectionTitle || "Untitled"}
                                  </option>
                                ))}
                              </select>
                            )}
                            <button
                              className={`${styles.actionBtn} ${styles.delete}`}
                              onClick={() => deleteItem(item.id)}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                    {/* Expandable specs detail row */}
                    {isSpecsOpen && (
                      <tr className={styles.specsDetailRow}>
                        <td colSpan={totalCols}>
                          <div className={styles.specsPanel}>
                            <div className={styles.specsPanelHeader}>
                              <span className={styles.specsPanelIcon}>📎</span>
                              <div className={styles.specsPanelTitleGroup}>
                                <span className={styles.specsPanelTitle}>
                                  Client Technical Specifications
                                </span>
                                <span className={styles.specsPanelSubtitle}>
                                  Optional — fill in when the client provides
                                  detailed requirements in the ET
                                </span>
                              </div>
                              <button
                                className={styles.specsPanelClose}
                                onClick={() => toggleSpecsExpand(item.id)}
                              >
                                ✕
                              </button>
                            </div>

                            {/* Client Requirement (main solicitation) */}
                            <div className={styles.specsSection}>
                              <label className={styles.specsLabel}>
                                Client Requirement
                              </label>
                              {readOnly ? (
                                <p className={styles.specsRequirementText}>
                                  {item.clientRequirement || (
                                    <span className={styles.specsEmpty}>
                                      No client requirement defined.
                                    </span>
                                  )}
                                </p>
                              ) : (
                                <textarea
                                  className={styles.specsTextarea}
                                  value={item.clientRequirement || ""}
                                  placeholder="Full text of the client's request from the ET document. E.g.: 'CONTRATADA deve disponibilizar ferramentas de torque com os seguintes requisitos:'"
                                  rows={3}
                                  onChange={(e) =>
                                    updateSpecs(
                                      item.id,
                                      e.target.value,
                                      item.clientSpecs || [],
                                    )
                                  }
                                />
                              )}
                            </div>

                            {/* Technical Specifications List */}
                            <div className={styles.specsSection}>
                              <label className={styles.specsLabel}>
                                Technical Specifications
                                {(item.clientSpecs || []).length > 0 && (
                                  <span className={styles.specsBadge}>
                                    {(item.clientSpecs || []).length}
                                  </span>
                                )}
                              </label>

                              {(item.clientSpecs || []).length > 0 ? (
                                <div className={styles.specsList}>
                                  {(item.clientSpecs || []).map((spec, idx) => (
                                    <div key={idx} className={styles.specsItem}>
                                      <span className={styles.specsItemNumber}>
                                        {idx + 1}
                                      </span>
                                      {readOnly ? (
                                        <span className={styles.specsItemText}>
                                          {spec}
                                        </span>
                                      ) : (
                                        <input
                                          className={styles.specsItemInput}
                                          value={spec}
                                          onChange={(e) => {
                                            const updated = [
                                              ...(item.clientSpecs || []),
                                            ];
                                            updated[idx] = e.target.value;
                                            updateSpecs(
                                              item.id,
                                              item.clientRequirement || "",
                                              updated,
                                            );
                                          }}
                                        />
                                      )}
                                      {!readOnly && (
                                        <button
                                          className={styles.specsItemDelete}
                                          onClick={() => {
                                            const updated = (
                                              item.clientSpecs || []
                                            ).filter((_, i) => i !== idx);
                                            updateSpecs(
                                              item.id,
                                              item.clientRequirement || "",
                                              updated,
                                            );
                                          }}
                                          title="Remove spec"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className={styles.specsEmpty}>
                                  No technical specifications added yet.
                                </p>
                              )}

                              {/* Add specs controls (edit mode only) */}
                              {!readOnly && (
                                <div className={styles.specsAddControls}>
                                  <button
                                    className={styles.specsAddBtn}
                                    onClick={() => {
                                      const updated = [
                                        ...(item.clientSpecs || []),
                                        "",
                                      ];
                                      updateSpecs(
                                        item.id,
                                        item.clientRequirement || "",
                                        updated,
                                      );
                                    }}
                                  >
                                    + Add Specification
                                  </button>
                                  <div className={styles.specsBulkImport}>
                                    <label className={styles.specsBulkLabel}>
                                      Bulk Import (one spec per line):
                                    </label>
                                    <textarea
                                      className={styles.specsTextarea}
                                      value={specsBulkText}
                                      placeholder={
                                        "Paste specifications here, one per line...\nE.g.:\nPossuir reservatório de fluido com volume mínimo de 80 L;\nOperar em circuito fechado, com retorno de fluido..."
                                      }
                                      rows={4}
                                      onChange={(e) =>
                                        setSpecsBulkText(e.target.value)
                                      }
                                    />
                                    <button
                                      className={styles.specsBulkBtn}
                                      onClick={() =>
                                        handleBulkImportSpecs(item.id)
                                      }
                                      disabled={!specsBulkText.trim()}
                                    >
                                      Import Lines
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    {/* Expandable sub-items panel */}
                    {isSubItemsOpen && (
                      <tr className={styles.subItemsDetailRow}>
                        <td colSpan={totalCols}>
                          <div className={styles.subItemsPanel}>
                            <div className={styles.subItemsPanelHeader}>
                              <span className={styles.subItemsPanelIcon}>
                                📦
                              </span>
                              <div className={styles.subItemsPanelTitleGroup}>
                                <span className={styles.subItemsPanelTitle}>
                                  Sub-Items —{" "}
                                  {item.equipmentOffer ||
                                    item.description ||
                                    "Item"}
                                </span>
                                <span className={styles.subItemsPanelSubtitle}>
                                  Consumables, spare parts, accessories, or
                                  multiple items tied to this scope line
                                </span>
                              </div>
                              {itemHasSubItems && (
                                <span className={styles.subItemsCount}>
                                  {(item.subItems || []).length} item
                                  {(item.subItems || []).length !== 1
                                    ? "s"
                                    : ""}
                                </span>
                              )}
                              <button
                                className={styles.subItemsPanelClose}
                                onClick={() => toggleSubItemsExpand(item.id)}
                              >
                                ✕
                              </button>
                            </div>

                            {(item.subItems || []).length > 0 ? (
                              <div className={styles.subItemsTableWrap}>
                                <table className={styles.subItemsTable}>
                                  <thead>
                                    <tr>
                                      <th style={{ width: 30 }}>#</th>
                                      <th>Description</th>
                                      <th>Sub-Type</th>
                                      <th>Equipment Offer</th>
                                      <th>OII/MFG PN</th>
                                      <th style={{ width: 60 }}>Qty</th>
                                      <th>Comments</th>
                                      {!readOnly && (
                                        <th style={{ width: 36 }} />
                                      )}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(item.subItems || []).map((sub, idx) => (
                                      <tr key={sub.id}>
                                        <td className={styles.subItemNum}>
                                          {idx + 1}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            sub.description || "—"
                                          ) : (
                                            <input
                                              className={styles.subItemInput}
                                              value={sub.description}
                                              placeholder='e.g. Brush 2" Nylon'
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "description",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            sub.subType || "—"
                                          ) : (
                                            <select
                                              className={styles.subItemInput}
                                              value={
                                                sub.subType || "Consumable"
                                              }
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "subType",
                                                  e.target.value,
                                                )
                                              }
                                            >
                                              <option value="Consumable">
                                                Consumable
                                              </option>
                                              <option value="Spare Part">
                                                Spare Part
                                              </option>
                                              <option value="Accessory">
                                                Accessory
                                              </option>
                                              <option value="Other">
                                                Other
                                              </option>
                                            </select>
                                          )}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            sub.equipmentOffer || "—"
                                          ) : (
                                            <input
                                              className={styles.subItemInput}
                                              value={sub.equipmentOffer}
                                              placeholder="Offer..."
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "equipmentOffer",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            <span className={styles.cellMono}>
                                              {sub.partNumber || "—"}
                                            </span>
                                          ) : (
                                            <input
                                              className={`${styles.subItemInput} ${styles.cellMono}`}
                                              value={sub.partNumber}
                                              placeholder="PN..."
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "partNumber",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            sub.qty
                                          ) : (
                                            <input
                                              type="number"
                                              className={styles.subItemInputNum}
                                              value={sub.qty}
                                              min={0}
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "qty",
                                                  Number(e.target.value) || 0,
                                                )
                                              }
                                            />
                                          )}
                                        </td>
                                        <td>
                                          {readOnly ? (
                                            sub.comments || "—"
                                          ) : (
                                            <input
                                              className={styles.subItemInput}
                                              value={sub.comments}
                                              placeholder="Notes..."
                                              onChange={(e) =>
                                                updateSubItem(
                                                  item.id,
                                                  sub.id,
                                                  "comments",
                                                  e.target.value,
                                                )
                                              }
                                            />
                                          )}
                                        </td>
                                        {!readOnly && (
                                          <td>
                                            <button
                                              className={styles.subItemDelete}
                                              onClick={() =>
                                                deleteSubItem(item.id, sub.id)
                                              }
                                              title="Remove sub-item"
                                            >
                                              ✕
                                            </button>
                                          </td>
                                        )}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className={styles.subItemsEmpty}>
                                No sub-items yet. Add consumables, spare parts,
                                or multiple equipment items below.
                              </p>
                            )}

                            {!readOnly && (
                              <div className={styles.subItemsAddRow}>
                                <button
                                  className={styles.subItemsAddBtn}
                                  onClick={() => addSubItem(item.id)}
                                >
                                  + Add Sub-Item
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Clarification Popup */}
      {clarPopup && (
        <div
          className={styles.clarPopupOverlay}
          onClick={() => setClarPopup(null)}
        >
          <div
            className={styles.clarPopup}
            style={{ left: clarPopup.x, top: clarPopup.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.clarPopupTitle}>
              Clarification / Qualification
            </div>
            {(() => {
              const clar = clarifications.find(
                (c) => c.scopeItemId === clarPopup.id,
              );
              if (clar) {
                return (
                  <>
                    {clar.clarification && (
                      <div style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: 2,
                          }}
                        >
                          Clarification / Question:
                        </div>
                        <p
                          className={styles.clarPopupText}
                          style={{ margin: 0 }}
                        >
                          {clar.clarification}
                        </p>
                      </div>
                    )}
                    {clar.clientResponse && (
                      <div style={{ marginBottom: 8 }}>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: "var(--text-secondary)",
                            marginBottom: 2,
                          }}
                        >
                          Client Response:
                        </div>
                        <p
                          className={styles.clarPopupText}
                          style={{ margin: 0 }}
                        >
                          {clar.clientResponse}
                        </p>
                      </div>
                    )}
                    {!clar.clarification && !clar.clientResponse && (
                      <p className={styles.clarPopupText}>
                        Clarification entry exists but no question/response yet.
                        Fill in details on the Clarif. &amp; Qualif. tab.
                      </p>
                    )}
                  </>
                );
              }
              return (
                <p className={styles.clarPopupText}>
                  This item has compliance = &quot;No&quot;. A clarification
                  entry has been auto-created in the Clarif. &amp; Qualif. tab.
                </p>
              );
            })()}
            <button
              className={styles.clarPopupClose}
              onClick={() => setClarPopup(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Editable Cell helper ─── */
interface EditableCellProps {
  value: string;
  readOnly: boolean;
  mono?: boolean;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onChange: (v: string) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  readOnly,
  mono,
  isEditing,
  onStartEdit,
  onEndEdit,
  onChange,
}) => {
  if (readOnly)
    return (
      <span className={mono ? styles.cellMono : undefined}>{value || "—"}</span>
    );

  if (isEditing) {
    return (
      <input
        className={styles.editInput}
        value={value}
        autoFocus
        onChange={(e) => onChange(e.target.value)}
        onBlur={onEndEdit}
        onKeyDown={(e) => {
          if (e.key === "Enter") onEndEdit();
        }}
      />
    );
  }

  return (
    <span
      className={mono ? styles.cellMono : undefined}
      onDoubleClick={onStartEdit}
      style={{ cursor: "text", minHeight: 20, display: "block" }}
    >
      {value || "—"}
    </span>
  );
};
