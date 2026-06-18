import * as React from "react";
import {
  IHoursSummary,
  IHoursItem,
  IHoursSection,
  IHoursSectionGroup,
  IEngineeringHoursSection,
  IScopeItem,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { formatHours, formatCurrency } from "../../utils/formatters";
import { makeId } from "../../utils/idGenerator";
import { EngineeringHoursSection } from "./EngineeringHoursSection";
import { ImportSourceModal } from "../common/ImportSourceModal";
import styles from "./BidHoursTable.module.scss";

interface BidHoursTableProps {
  hoursSummary: IHoursSummary;
  readOnly?: boolean;
  onSave?: (updated: IHoursSummary) => void;
  /** For division-aware BIDs — when set, shows only Onshore/Offshore sections */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | null;
  /** Scope items marked as needsEngineering — drives Engineering Hours section */
  scopeItems?: IScopeItem[];
  /** Tab-level notes/comments */
  tabNotes?: string;
  /** Callback to save tab-level notes */
  onSaveTabNotes?: (notes: string) => void;
}

const blankHoursItem = (
  sectionId?: string,
  hoursPerDay: number = 8,
  division?: "ROV" | "SURVEY" | "OPG" | "" | null,
): IHoursItem => ({
  id: makeId("hrs"),
  lineNumber: 0,
  sectionId: sectionId || null,
  requirementName: "",
  function: "",
  phase: "",
  hoursPerDay,
  pplQty: 1,
  workDays: 1,
  utilizationPercent: 100,
  totalHours: hoursPerDay,
  costBRL: 0,
  integratedDivision: division || undefined,
});

type SectionKey = "engineeringHours" | "onshoreHours" | "offshoreHours";

export const BidHoursTable: React.FC<BidHoursTableProps> = ({
  hoursSummary,
  readOnly = false,
  onSave,
  integratedDivision,
  scopeItems = [],
  tabNotes = "",
  onSaveTabNotes,
}) => {
  // ─── Local state + debounced save (prevents character loss while typing) ───
  const [localSummary, setLocalSummary] =
    React.useState<IHoursSummary>(hoursSummary);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditingRef = React.useRef(false);
  const pendingDataRef = React.useRef<IHoursSummary | null>(null);
  const onSaveRef = React.useRef(onSave);
  onSaveRef.current = onSave;

  // Flush pending save on unmount (e.g., when switching division tabs)
  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current && pendingDataRef.current) {
        clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
        if (onSaveRef.current) onSaveRef.current(pendingDataRef.current);
      }
    };
  }, []);

  // Sync from props only when not mid-edit
  React.useEffect(() => {
    if (!isEditingRef.current && saveTimerRef.current === null) {
      setLocalSummary(hoursSummary);
    }
  }, [hoursSummary]);

  const debouncedSave = React.useCallback(
    (updated: IHoursSummary) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      pendingDataRef.current = updated;
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        pendingDataRef.current = null;
        isEditingRef.current = false;
        if (onSave) onSave(updated);
      }, 400);
    },
    [onSave],
  );

  const localPersist = React.useCallback(
    (updated: IHoursSummary) => {
      isEditingRef.current = true;
      setLocalSummary(updated);
      debouncedSave(updated);
    },
    [debouncedSave],
  );

  const config = useConfigStore((s) => s.config);
  const hoursPhases = (config?.hoursPhases || []).filter(
    (p) => p.isActive !== false,
  );
  const jobFunctions = (config?.jobFunctions || []).filter(
    (f) => f.isActive !== false,
  );

  // Group job functions by category
  const functionCategories = React.useMemo(() => {
    const cats: Record<string, typeof jobFunctions> = {};
    jobFunctions.forEach((f) => {
      const cat = (f.category as string) || "General";
      if (!cats[cat]) cats[cat] = [];
      cats[cat].push(f);
    });
    return cats;
  }, [jobFunctions]);

  const emptySection: IHoursSection = {
    totalHours: 0,
    totalCostBRL: 0,
    items: [],
  };

  const sectionDefs: { key: SectionKey; label: string }[] = [
    { key: "engineeringHours", label: "Engineering Hours" },
    { key: "onshoreHours", label: "Onshore Hours" },
    { key: "offshoreHours", label: "Offshore Hours" },
  ];

  const recalcSection = (section: IHoursSection): IHoursSection => {
    const items = section.items.map((item) => {
      if (item.isSeparator) return item;
      const totalHours =
        item.hoursPerDay *
        item.pplQty *
        item.workDays *
        (item.utilizationPercent / 100);
      return { ...item, totalHours: Math.round(totalHours * 100) / 100 };
    });
    const dataItems = items.filter((i) => !i.isSeparator);
    return {
      ...section,
      items,
      totalHours: dataItems.reduce((sum, i) => sum + i.totalHours, 0),
      totalCostBRL: dataItems.reduce((sum, i) => sum + i.costBRL, 0),
    };
  };

  const persistChange = (
    sectionKey: SectionKey,
    updatedSection: IHoursSection,
  ): void => {
    if (!onSave) return;
    const recalced = recalcSection(updatedSection);
    const updated: IHoursSummary = {
      ...localSummary,
      [sectionKey]: recalced,
    };
    // Recalc grand totals
    const allSections = sectionDefs.map((s) =>
      s.key === sectionKey ? recalced : updated[s.key] || emptySection,
    );
    updated.grandTotalHours = allSections.reduce(
      (sum, s) => sum + s.totalHours,
      0,
    );
    updated.grandTotalCostBRL = allSections.reduce(
      (sum, s) => sum + s.totalCostBRL,
      0,
    );
    localPersist(updated);
  };

  const addRow = (sectionKey: SectionKey, sectionGroupId?: string): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const defaultHours = sectionKey === "offshoreHours" ? 12 : 8;
    persistChange(sectionKey, {
      ...section,
      items: [
        ...section.items,
        blankHoursItem(sectionGroupId, defaultHours, integratedDivision),
      ],
    });
  };

  const addSeparator = (
    sectionKey: SectionKey,
    sectionGroupId?: string,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const separator: IHoursItem = {
      id: makeId("sep"),
      lineNumber: 0,
      sectionId: sectionGroupId || null,
      requirementName: "",
      function: "",
      phase: "",
      hoursPerDay: 0,
      pplQty: 0,
      workDays: 0,
      utilizationPercent: 0,
      totalHours: 0,
      costBRL: 0,
      integratedDivision: integratedDivision || undefined,
      isSeparator: true,
      separatorLabel: "",
    };
    persistChange(sectionKey, {
      ...section,
      items: [...section.items, separator],
    });
  };

  const deleteRow = (sectionKey: SectionKey, itemId: string): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      items: section.items.filter((i) => i.id !== itemId),
    });
  };

  const addSectionGroup = (sectionKey: SectionKey): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const sections = section.sections || [];
    const newGroup: IHoursSectionGroup = {
      id: makeId("hrs"),
      title: "New Section",
      integratedDivision: integratedDivision || undefined,
    };
    persistChange(sectionKey, {
      ...section,
      sections: [...sections, newGroup],
    });
  };

  const renameSectionGroup = (
    sectionKey: SectionKey,
    groupId: string,
    title: string,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      sections: (section.sections || []).map((s) =>
        s.id === groupId ? { ...s, title } : s,
      ),
    });
  };

  const updateSectionGroupColor = (
    sectionKey: SectionKey,
    groupId: string,
    color: string,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      sections: (section.sections || []).map((s) =>
        s.id === groupId ? { ...s, color } : s,
      ),
    });
  };

  const moveItemToSection = (
    sectionKey: SectionKey,
    itemId: string,
    targetSectionId: string | null,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      items: section.items.map((i) =>
        i.id === itemId ? { ...i, sectionId: targetSectionId } : i,
      ),
    });
  };

  // Section color presets
  const SECTION_COLORS = [
    "",
    "#3b82f6",
    "#8b5cf6",
    "#06b6d4",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#ec4899",
    "#6366f1",
    "#84cc16",
  ];

  const deleteSectionGroup = (
    sectionKey: SectionKey,
    groupId: string,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      sections: (section.sections || []).filter((s) => s.id !== groupId),
      // Unlink items from the deleted section
      items: section.items.map((i) =>
        i.sectionId === groupId ? { ...i, sectionId: null } : i,
      ),
    });
  };

  const moveSectionGroup = (
    sectionKey: SectionKey,
    groupId: string,
    direction: "up" | "down",
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const groups = [...(section.sections || [])];
    const idx = groups.findIndex((g) => g.id === groupId);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= groups.length) return;
    const temp = groups[idx];
    groups[idx] = groups[targetIdx];
    groups[targetIdx] = temp;
    persistChange(sectionKey, { ...section, sections: groups });
  };

  const moveHoursItem = (
    sectionKey: SectionKey,
    itemId: string,
    direction: "up" | "down",
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const item = section.items.find((i) => i.id === itemId);
    if (!item) return;
    // Build display-order list: unsectioned first, then items grouped by section
    const groups = section.sections || [];
    const ordered: IHoursItem[] = [];
    section.items.filter((i) => !i.sectionId).forEach((i) => ordered.push(i));
    groups.forEach((g) => {
      section.items
        .filter((i) => i.sectionId === g.id)
        .forEach((i) => ordered.push(i));
    });
    const idx = ordered.findIndex((i) => i.id === itemId);
    if (idx < 0) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= ordered.length) return;
    // Only swap within the same sectionId
    if (ordered[targetIdx].sectionId !== item.sectionId) return;
    const temp = ordered[idx];
    ordered[idx] = ordered[targetIdx];
    ordered[targetIdx] = temp;
    persistChange(sectionKey, { ...section, items: ordered });
  };

  const updateItem = (
    sectionKey: SectionKey,
    itemId: string,
    field: keyof IHoursItem,
    value: unknown,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    const items = section.items.map((i) =>
      i.id === itemId ? { ...i, [field]: value } : i,
    );
    persistChange(sectionKey, { ...section, items });
  };

  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );
  const toggleCollapse = (id: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allGroupIds = React.useMemo(() => {
    const ids: string[] = [];
    sectionDefs.forEach(({ key }) => {
      const section = localSummary?.[key] || emptySection;
      const groups: IHoursSectionGroup[] = section.sections || [];
      groups.forEach((g) => ids.push(g.id));
    });
    return ids;
  }, [localSummary]);

  const allSectionsCollapsed =
    allGroupIds.length > 0 &&
    allGroupIds.every((id) => collapsedSections.has(id));

  const toggleAllSections = (): void => {
    if (allSectionsCollapsed) {
      setCollapsedSections(new Set());
    } else {
      setCollapsedSections(new Set(allGroupIds));
    }
  };
  const [editingSection, setEditingSection] = React.useState<string | null>(
    null,
  );

  // Section notes/specs expand state
  const [expandedNotes, setExpandedNotes] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleSectionNotes = (groupId: string): void => {
    setExpandedNotes((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  };

  const updateSectionGroupNotes = (
    sectionKey: SectionKey,
    groupId: string,
    notes: string,
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      sections: (section.sections || []).map((s) =>
        s.id === groupId ? { ...s, notes } : s,
      ),
    });
  };

  const updateSectionGroupSpecs = (
    sectionKey: SectionKey,
    groupId: string,
    specs: string[],
  ): void => {
    const section = localSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      sections: (section.sections || []).map((s) =>
        s.id === groupId ? { ...s, specs } : s,
      ),
    });
  };

  // Handle engineering section save
  const handleEngineeringSave = (updated: IEngineeringHoursSection): void => {
    if (!onSave) return;
    const newSummary: IHoursSummary = {
      ...localSummary,
      engineeringHours: updated,
    };
    // Recalc grand totals
    const engTotal = updated.totalHours;
    const onshoreTotal = (localSummary.onshoreHours || emptySection).totalHours;
    const offshoreTotal = (localSummary.offshoreHours || emptySection)
      .totalHours;
    newSummary.grandTotalHours = engTotal + onshoreTotal + offshoreTotal;
    newSummary.grandTotalCostBRL =
      updated.totalCostBRL +
      (localSummary.onshoreHours || emptySection).totalCostBRL +
      (localSummary.offshoreHours || emptySection).totalCostBRL;
    localPersist(newSummary);
  };

  // Scope items that are marked for engineering
  const engineeringScopeItems = React.useMemo(() => {
    const results: IScopeItem[] = [];
    scopeItems.forEach((si) => {
      if (si.isSection) {
        results.push(si);
        return;
      }
      if (si.needsEngineering) {
        results.push(si);
      }
      if (si.subItems) {
        si.subItems.forEach((sub) => {
          if (sub.needsEngineering) {
            results.push({
              ...si,
              id: sub.id,
              description: sub.description || "Sub-item",
              equipmentOffer: sub.equipmentOffer || "",
              needsEngineering: true,
              subItems: undefined,
            } as IScopeItem);
          }
        });
      }
    });
    return results;
  }, [scopeItems]);

  // ─── Import from BID/Template modal state ───
  const [showImportModal, setShowImportModal] = React.useState(false);

  return (
    <div className={styles.container}>
      {/* Top toolbar: collapse + import */}
      <div className={styles.collapseToolbar}>
        {allGroupIds.length > 0 && (
          <button className={styles.collapseBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        )}
        {!readOnly && onSave && (
          <button
            className={styles.importBidBtn}
            onClick={() => setShowImportModal(true)}
            title="Import hours from a completed BID or template"
          >
            📥 Import BID / Template
          </button>
        )}
      </div>

      {/* Tab-level notes */}
      <div className={styles.tabNotesContainer}>
        <label className={styles.tabNotesLabel}>📝 Notes / Comments</label>
        {readOnly && !onSaveTabNotes ? (
          <p className={styles.tabNotesText}>{tabNotes || "—"}</p>
        ) : (
          <textarea
            className={styles.tabNotesInput}
            value={tabNotes}
            placeholder="Add general notes or comments for Hours & Personnel..."
            rows={2}
            readOnly={readOnly}
            onChange={(e) => onSaveTabNotes && onSaveTabNotes(e.target.value)}
          />
        )}
      </div>

      {/* Engineering Hours — deliverable-based section */}
      <EngineeringHoursSection
        engineeringSection={localSummary?.engineeringHours || emptySection}
        scopeItems={engineeringScopeItems}
        readOnly={readOnly}
        onSave={onSave ? handleEngineeringSave : undefined}
      />

      {/* Onshore & Offshore — row-based sections */}
      {sectionDefs
        .filter((s) => s.key !== "engineeringHours")
        .map(({ key, label }) => {
          const section = localSummary?.[key] || emptySection;
          const sectionGroups: IHoursSectionGroup[] = section.sections || [];
          const unsectionedItems = section.items.filter((i) => !i.sectionId);

          return (
            <div key={key}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>{label}</h4>
                {!readOnly && onSave && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      className={styles.addBtn}
                      onClick={() => addRow(key)}
                    >
                      + Add Row
                    </button>
                    <button
                      className={styles.addBtn}
                      onClick={() => addSeparator(key)}
                      title="Add a visual separator line"
                    >
                      + Separator
                    </button>
                    <button
                      className={styles.addBtn}
                      onClick={() => addSectionGroup(key)}
                    >
                      + Add Section
                    </button>
                  </div>
                )}
              </div>

              {section.items.length === 0 && sectionGroups.length === 0 ? (
                <div className={styles.empty}>No items</div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {!readOnly && onSave && <th style={{ width: 28 }} />}
                      {[
                        "Function",
                        "Phase",
                        "Hrs/Day",
                        "People",
                        "Work Days",
                        "Util %",
                        "Total Hrs",
                        "Cost (BRL)",
                      ].map((h) => (
                        <th key={h}>{h}</th>
                      ))}
                      {!readOnly && onSave && <th />}
                    </tr>
                  </thead>
                  <tbody>
                    {/* Unsectioned items first */}
                    {unsectionedItems.map((item) => (
                      <HoursRow
                        key={item.id}
                        item={item}
                        sectionKey={key}
                        readOnly={readOnly}
                        onSave={onSave}
                        functionCategories={functionCategories}
                        hoursPhases={hoursPhases}
                        updateItem={updateItem}
                        deleteRow={deleteRow}
                        moveItem={moveHoursItem}
                        sectionGroups={sectionGroups}
                        moveToSection={moveItemToSection}
                      />
                    ))}
                    {/* Section groups */}
                    {sectionGroups.map((group) => {
                      const groupItems = section.items.filter(
                        (i) => i.sectionId === group.id,
                      );
                      const isCollapsed = collapsedSections.has(group.id);
                      const groupTotal = groupItems.reduce(
                        (s, i) => s + i.totalHours,
                        0,
                      );
                      const gColor = group.color || "";
                      return (
                        <React.Fragment key={group.id}>
                          <tr
                            className={styles.sectionGroupRow}
                            style={
                              gColor ? { background: `${gColor}15` } : undefined
                            }
                          >
                            <td
                              colSpan={!readOnly && onSave ? 10 : 8}
                              style={
                                gColor
                                  ? {
                                      borderBottomColor: gColor,
                                      borderBottomWidth: 2,
                                      borderBottomStyle: "solid" as const,
                                      background: `${gColor}15`,
                                    }
                                  : undefined
                              }
                            >
                              <div
                                className={styles.sectionGroupHeader}
                                onClick={() => toggleCollapse(group.id)}
                                style={gColor ? { color: gColor } : undefined}
                              >
                                <span
                                  className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ""}`}
                                >
                                  ▼
                                </span>
                                {editingSection === group.id && !readOnly ? (
                                  <input
                                    className={styles.sectionGroupInput}
                                    value={group.title}
                                    autoFocus
                                    onChange={(e) =>
                                      renameSectionGroup(
                                        key,
                                        group.id,
                                        e.target.value,
                                      )
                                    }
                                    onBlur={() => setEditingSection(null)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter")
                                        setEditingSection(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  <span
                                    onDoubleClick={() =>
                                      !readOnly && setEditingSection(group.id)
                                    }
                                  >
                                    {group.title || "Untitled Section"}
                                  </span>
                                )}
                                {!readOnly && editingSection !== group.id && (
                                  <button
                                    className={styles.sectionEditBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingSection(group.id);
                                    }}
                                    title="Rename section"
                                  >
                                    ✏️
                                  </button>
                                )}
                                <span className={styles.sectionGroupMeta}>
                                  ({groupItems.length} items ·{" "}
                                  {formatHours(groupTotal)})
                                </span>
                                {!readOnly && onSave && (
                                  <div
                                    className={styles.sectionGroupActions}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      className={styles.addBtn}
                                      style={{
                                        padding: "2px 5px",
                                        fontSize: 11,
                                      }}
                                      onClick={() =>
                                        moveSectionGroup(key, group.id, "up")
                                      }
                                      title="Move section up"
                                    >
                                      ▲
                                    </button>
                                    <button
                                      className={styles.addBtn}
                                      style={{
                                        padding: "2px 5px",
                                        fontSize: 11,
                                      }}
                                      onClick={() =>
                                        moveSectionGroup(key, group.id, "down")
                                      }
                                      title="Move section down"
                                    >
                                      ▼
                                    </button>
                                    <button
                                      className={styles.addBtn}
                                      onClick={() => addRow(key, group.id)}
                                    >
                                      + Row
                                    </button>
                                    <button
                                      className={styles.addBtn}
                                      onClick={() =>
                                        addSeparator(key, group.id)
                                      }
                                      title="Add visual separator"
                                      style={{
                                        padding: "2px 5px",
                                        fontSize: 11,
                                      }}
                                    >
                                      ― Sep
                                    </button>
                                    <button
                                      className={`${styles.addBtn} ${expandedNotes.has(group.id) ? styles.activeSectionBtn : ""}`}
                                      style={{
                                        padding: "2px 5px",
                                        fontSize: 11,
                                      }}
                                      onClick={() =>
                                        toggleSectionNotes(group.id)
                                      }
                                      title="Section notes & specs"
                                    >
                                      📋
                                    </button>
                                    <ColorPickerInline
                                      currentColor={gColor}
                                      colors={SECTION_COLORS}
                                      onChange={(c) =>
                                        updateSectionGroupColor(
                                          key,
                                          group.id,
                                          c,
                                        )
                                      }
                                    />
                                    <button
                                      className={styles.deleteBtn}
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            `Delete section "${group.title || "Untitled"}"? Items will be moved to unsectioned.`,
                                          )
                                        )
                                          deleteSectionGroup(key, group.id);
                                      }}
                                    >
                                      ✕
                                    </button>
                                  </div>
                                )}
                                {/* Read-only notes/specs indicator */}
                                {readOnly &&
                                  (group.notes ||
                                    (group.specs &&
                                      group.specs.length > 0)) && (
                                    <button
                                      className={styles.addBtn}
                                      style={{
                                        padding: "2px 5px",
                                        fontSize: 11,
                                        marginLeft: "auto",
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSectionNotes(group.id);
                                      }}
                                      title="View section notes & specs"
                                    >
                                      📋
                                    </button>
                                  )}
                              </div>
                            </td>
                          </tr>
                          {/* Section Notes & Specs Panel */}
                          {expandedNotes.has(group.id) && (
                            <tr>
                              <td
                                colSpan={!readOnly && onSave ? 10 : 8}
                                className={styles.sectionNotesCell}
                              >
                                <div className={styles.sectionNotesPanel}>
                                  <div className={styles.sectionNotesGrid}>
                                    <div className={styles.sectionNotesCol}>
                                      <label
                                        className={styles.sectionNotesLabel}
                                      >
                                        Notes / Comments
                                      </label>
                                      {readOnly ? (
                                        <p className={styles.sectionNotesText}>
                                          {group.notes || "—"}
                                        </p>
                                      ) : (
                                        <textarea
                                          className={styles.sectionNotesInput}
                                          value={group.notes || ""}
                                          placeholder="Add notes for this section..."
                                          rows={3}
                                          onChange={(e) =>
                                            updateSectionGroupNotes(
                                              key,
                                              group.id,
                                              e.target.value,
                                            )
                                          }
                                        />
                                      )}
                                    </div>
                                    <div className={styles.sectionNotesCol}>
                                      <label
                                        className={styles.sectionNotesLabel}
                                      >
                                        Technical Specs
                                        {(group.specs || []).length > 0 && (
                                          <span className={styles.specBadge}>
                                            {(group.specs || []).length}
                                          </span>
                                        )}
                                      </label>
                                      {(group.specs || []).length > 0 && (
                                        <div className={styles.specsList}>
                                          {(group.specs || []).map(
                                            (spec, idx) => (
                                              <div
                                                key={idx}
                                                className={styles.specItem}
                                              >
                                                <span
                                                  className={styles.specNum}
                                                >
                                                  {idx + 1}
                                                </span>
                                                {readOnly ? (
                                                  <span>{spec}</span>
                                                ) : (
                                                  <input
                                                    className={styles.specInput}
                                                    value={spec}
                                                    placeholder="Specification..."
                                                    onChange={(e) => {
                                                      const updated = [
                                                        ...(group.specs || []),
                                                      ];
                                                      updated[idx] =
                                                        e.target.value;
                                                      updateSectionGroupSpecs(
                                                        key,
                                                        group.id,
                                                        updated,
                                                      );
                                                    }}
                                                  />
                                                )}
                                                {!readOnly && (
                                                  <button
                                                    className={
                                                      styles.specDelBtn
                                                    }
                                                    onClick={() => {
                                                      const updated = (
                                                        group.specs || []
                                                      ).filter(
                                                        (_, i) => i !== idx,
                                                      );
                                                      updateSectionGroupSpecs(
                                                        key,
                                                        group.id,
                                                        updated,
                                                      );
                                                    }}
                                                    title="Remove"
                                                  >
                                                    ✕
                                                  </button>
                                                )}
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                      {!readOnly && (
                                        <button
                                          className={styles.addBtn}
                                          style={{ marginTop: 6, fontSize: 12 }}
                                          onClick={() => {
                                            const updated = [
                                              ...(group.specs || []),
                                              "",
                                            ];
                                            updateSectionGroupSpecs(
                                              key,
                                              group.id,
                                              updated,
                                            );
                                          }}
                                        >
                                          + Add Spec
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                          {!isCollapsed &&
                            groupItems.map((item) => (
                              <HoursRow
                                key={item.id}
                                item={item}
                                sectionKey={key}
                                readOnly={readOnly}
                                onSave={onSave}
                                functionCategories={functionCategories}
                                hoursPhases={hoursPhases}
                                updateItem={updateItem}
                                deleteRow={deleteRow}
                                moveItem={moveHoursItem}
                                sectionGroups={sectionGroups}
                                moveToSection={moveItemToSection}
                              />
                            ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td
                        colSpan={!readOnly && onSave ? 7 : 6}
                        className={styles.cellRight}
                      >
                        Subtotal:
                      </td>
                      <td className={styles.cellRight}>
                        {formatHours(section.totalHours)}
                      </td>
                      <td className={styles.cellRight}>
                        {formatCurrency(section.totalCostBRL, "BRL")}
                      </td>
                      {!readOnly && onSave && <td />}
                    </tr>
                  </tfoot>
                </table>
              )}
            </div>
          );
        })}

      {/* Import from BID/Template Modal */}
      <ImportSourceModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        importMode="hours"
        onImportHours={(importedHours) => {
          if (!onSave) return;
          const updated = { ...localSummary };

          // Merge engineering hours
          if (importedHours.engineeringHours) {
            const existing = updated.engineeringHours || {
              totalHours: 0,
              totalCostBRL: 0,
              items: [],
            };
            const mergedItems = [
              ...existing.items,
              ...importedHours.engineeringHours.items,
            ];
            const existingSections = existing.sections || [];
            const importedSections =
              importedHours.engineeringHours.sections || [];
            const existingSectionIds = new Set(
              existingSections.map((s) => s.id),
            );
            const newSections = importedSections.filter(
              (s) => !existingSectionIds.has(s.id),
            );
            updated.engineeringHours = {
              ...existing,
              items: mergedItems,
              sections: [...existingSections, ...newSections],
              totalHours: mergedItems.reduce(
                (s, i) => s + (i.totalHours || 0),
                0,
              ),
              totalCostBRL: mergedItems.reduce(
                (s, i) => s + (i.costBRL || 0),
                0,
              ),
            };
          }

          // Merge onshore hours
          if (importedHours.onshoreHours) {
            const existing = updated.onshoreHours || {
              totalHours: 0,
              totalCostBRL: 0,
              items: [],
            };
            const mergedItems = [
              ...existing.items,
              ...importedHours.onshoreHours.items,
            ];
            const existingSections = existing.sections || [];
            const importedSections = importedHours.onshoreHours.sections || [];
            const existingSectionIds = new Set(
              existingSections.map((s) => s.id),
            );
            const newSections = importedSections.filter(
              (s) => !existingSectionIds.has(s.id),
            );
            updated.onshoreHours = {
              ...existing,
              items: mergedItems,
              sections: [...existingSections, ...newSections],
              totalHours: mergedItems.reduce(
                (s, i) => s + (i.totalHours || 0),
                0,
              ),
              totalCostBRL: mergedItems.reduce(
                (s, i) => s + (i.costBRL || 0),
                0,
              ),
            };
          }

          // Merge offshore hours
          if (importedHours.offshoreHours) {
            const existing = updated.offshoreHours || {
              totalHours: 0,
              totalCostBRL: 0,
              items: [],
            };
            const mergedItems = [
              ...existing.items,
              ...importedHours.offshoreHours.items,
            ];
            const existingSections = existing.sections || [];
            const importedSections = importedHours.offshoreHours.sections || [];
            const existingSectionIds = new Set(
              existingSections.map((s) => s.id),
            );
            const newSections = importedSections.filter(
              (s) => !existingSectionIds.has(s.id),
            );
            updated.offshoreHours = {
              ...existing,
              items: mergedItems,
              sections: [...existingSections, ...newSections],
              totalHours: mergedItems.reduce(
                (s, i) => s + (i.totalHours || 0),
                0,
              ),
              totalCostBRL: mergedItems.reduce(
                (s, i) => s + (i.costBRL || 0),
                0,
              ),
            };
          }

          // Recalculate grand totals
          updated.grandTotalHours =
            (updated.engineeringHours?.totalHours || 0) +
            (updated.onshoreHours?.totalHours || 0) +
            (updated.offshoreHours?.totalHours || 0);
          updated.grandTotalCostBRL =
            (updated.engineeringHours?.totalCostBRL || 0) +
            (updated.onshoreHours?.totalCostBRL || 0) +
            (updated.offshoreHours?.totalCostBRL || 0);

          localPersist(updated as IHoursSummary);
        }}
      />
    </div>
  );
};

/* ─── HoursRow sub-component ─── */
interface HoursRowProps {
  item: IHoursItem;
  sectionKey: string;
  readOnly: boolean;
  onSave: ((updated: IHoursSummary) => void) | undefined;
  functionCategories: Record<
    string,
    { id: string; value: string; label: string }[]
  >;
  hoursPhases: { id: string; value: string; label: string }[];
  updateItem: (
    sectionKey: string,
    itemId: string,
    field: keyof IHoursItem,
    value: unknown,
  ) => void;
  deleteRow: (sectionKey: string, itemId: string) => void;
  moveItem: (
    sectionKey: SectionKey,
    itemId: string,
    direction: "up" | "down",
  ) => void;
  sectionGroups: IHoursSectionGroup[];
  moveToSection: (
    sectionKey: SectionKey,
    itemId: string,
    targetSectionId: string | null,
  ) => void;
}

const HoursRow: React.FC<HoursRowProps> = ({
  item,
  sectionKey,
  readOnly,
  onSave,
  functionCategories,
  hoursPhases,
  updateItem,
  deleteRow,
  moveItem,
  sectionGroups,
  moveToSection,
}) => {
  const [showNotes, setShowNotes] = React.useState(false);
  const colCount = (!readOnly && onSave ? 10 : 8) + 1; // +1 for the notes icon col

  // ─── Separator row ───
  if (item.isSeparator) {
    return (
      <tr className={styles.separatorRow}>
        {!readOnly && onSave && (
          <td style={{ width: 28, padding: "0 2px", textAlign: "center" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: 10,
                display: "block",
                lineHeight: 1,
              }}
              onClick={() => moveItem(sectionKey as SectionKey, item.id, "up")}
              title="Move up"
            >
              ▲
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: 10,
                display: "block",
                lineHeight: 1,
              }}
              onClick={() =>
                moveItem(sectionKey as SectionKey, item.id, "down")
              }
              title="Move down"
            >
              ▼
            </button>
          </td>
        )}
        <td
          colSpan={!readOnly && onSave ? 8 : 8}
          className={styles.separatorCell}
        >
          {!readOnly ? (
            <input
              className={styles.separatorInput}
              value={item.separatorLabel || ""}
              placeholder="(separator label – optional)"
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "separatorLabel",
                  e.target.value,
                )
              }
            />
          ) : (
            <span className={styles.separatorLabel}>
              {item.separatorLabel || ""}
            </span>
          )}
        </td>
        {!readOnly && onSave && (
          <td>
            <button
              className={styles.deleteBtn}
              onClick={() => deleteRow(sectionKey, item.id)}
            >
              ✕
            </button>
          </td>
        )}
      </tr>
    );
  }

  // ─── Normal data row ───
  return (
    <>
      <tr>
        {!readOnly && onSave && (
          <td style={{ width: 28, padding: "0 2px", textAlign: "center" }}>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: 10,
                display: "block",
                lineHeight: 1,
              }}
              onClick={() => moveItem(sectionKey as SectionKey, item.id, "up")}
              title="Move up"
            >
              ▲
            </button>
            <button
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--text-secondary)",
                fontSize: 10,
                display: "block",
                lineHeight: 1,
              }}
              onClick={() =>
                moveItem(sectionKey as SectionKey, item.id, "down")
              }
              title="Move down"
            >
              ▼
            </button>
          </td>
        )}
        <td>
          {readOnly ? (
            item.function
          ) : (
            <select
              className={styles.selectCell}
              value={item.function}
              onChange={(e) =>
                updateItem(sectionKey, item.id, "function", e.target.value)
              }
            >
              <option value="" disabled hidden>
                Select...
              </option>
              {Object.entries(functionCategories).map(([cat, fns]) => (
                <optgroup key={cat} label={cat}>
                  {fns.map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </td>
        <td>
          {readOnly ? (
            item.phase
          ) : (
            <select
              className={styles.selectCell}
              value={item.phase}
              onChange={(e) =>
                updateItem(sectionKey, item.id, "phase", e.target.value)
              }
            >
              <option value="" disabled hidden>
                Select...
              </option>
              {hoursPhases.map((p) => (
                <option key={p.id} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          )}
        </td>
        <td className={styles.cellCenter}>
          {readOnly ? (
            item.hoursPerDay
          ) : (
            <input
              className={styles.numInput}
              type="number"
              min={0}
              step={0.5}
              value={item.hoursPerDay}
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "hoursPerDay",
                  Number(e.target.value) || 0,
                )
              }
            />
          )}
        </td>
        <td className={styles.cellCenter}>
          {readOnly ? (
            item.pplQty
          ) : (
            <input
              className={styles.numInput}
              type="number"
              min={0}
              value={item.pplQty}
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "pplQty",
                  Number(e.target.value) || 0,
                )
              }
            />
          )}
        </td>
        <td className={styles.cellCenter}>
          {readOnly ? (
            item.workDays
          ) : (
            <input
              className={styles.numInput}
              type="number"
              min={0}
              value={item.workDays}
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "workDays",
                  Number(e.target.value) || 0,
                )
              }
            />
          )}
        </td>
        <td className={styles.cellCenter}>
          {readOnly ? (
            `${item.utilizationPercent}%`
          ) : (
            <input
              className={styles.numInput}
              type="number"
              min={0}
              max={100}
              value={item.utilizationPercent}
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "utilizationPercent",
                  Number(e.target.value) || 0,
                )
              }
            />
          )}
        </td>
        <td className={`${styles.cellRight} ${styles.cellBold}`}>
          {formatHours(item.totalHours)}
        </td>
        <td className={styles.cellRight}>
          {readOnly ? (
            formatCurrency(item.costBRL, "BRL")
          ) : (
            <input
              className={styles.numInput}
              type="number"
              min={0}
              value={item.costBRL}
              onChange={(e) =>
                updateItem(
                  sectionKey,
                  item.id,
                  "costBRL",
                  Number(e.target.value) || 0,
                )
              }
            />
          )}
        </td>
        {!readOnly && onSave && (
          <td>
            <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
              {sectionGroups.length > 0 && (
                <select
                  value={item.sectionId || ""}
                  onChange={(e) =>
                    moveToSection(
                      sectionKey as SectionKey,
                      item.id,
                      e.target.value || null,
                    )
                  }
                  title="Move to section"
                  style={{
                    maxWidth: 80,
                    padding: "2px 4px",
                    border: "1px solid var(--border-subtle, #444)",
                    borderRadius: 4,
                    background: "var(--input-bg, rgba(255,255,255,0.06))",
                    color: "var(--text-secondary, #aaa)",
                    fontSize: 10,
                    cursor: "pointer",
                  }}
                >
                  <option value="">— None —</option>
                  {sectionGroups.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title || "Untitled"}
                    </option>
                  ))}
                </select>
              )}
              <button
                className={`${styles.addBtn}${showNotes ? ` ${styles.activeSectionBtn}` : item.notes ? ` ${styles.hasNotesBtn}` : ""}`}
                style={{ padding: "2px 5px", fontSize: 11 }}
                onClick={() => setShowNotes(!showNotes)}
                title="Row notes"
              >
                💬
              </button>
              <button
                className={styles.deleteBtn}
                style={{ marginLeft: "auto" }}
                onClick={() => deleteRow(sectionKey, item.id)}
              >
                ✕
              </button>
            </div>
          </td>
        )}
        {readOnly && item.notes && (
          <td>
            <button
              className={`${styles.addBtn}${showNotes ? ` ${styles.activeSectionBtn}` : ` ${styles.hasNotesBtn}`}`}
              style={{ padding: "2px 5px", fontSize: 11 }}
              onClick={() => setShowNotes(!showNotes)}
              title="Row notes"
            >
              💬
            </button>
          </td>
        )}
      </tr>
      {/* Inline notes row */}
      {showNotes && (
        <tr className={styles.notesRow}>
          <td colSpan={colCount} className={styles.notesCell}>
            {readOnly ? (
              <span className={styles.notesText}>{item.notes || "—"}</span>
            ) : (
              <input
                className={styles.notesInput}
                value={item.notes || ""}
                placeholder="Add notes for this row..."
                onChange={(e) =>
                  updateItem(sectionKey, item.id, "notes", e.target.value)
                }
              />
            )}
          </td>
        </tr>
      )}
    </>
  );
};

/* ─── Inline Color Picker (reusable) ─── */
const ColorPickerInline: React.FC<{
  currentColor: string;
  colors: string[];
  onChange: (c: string) => void;
}> = ({ currentColor, colors, onChange }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <button
        style={{
          border: "1px solid var(--border-subtle, #444)",
          borderRadius: 4,
          padding: "2px 6px",
          fontSize: 11,
          cursor: "pointer",
          background: currentColor || "transparent",
          color: currentColor ? "#fff" : "var(--text-secondary, #aaa)",
        }}
        onClick={() => setOpen(!open)}
        title="Section color"
      >
        🎨
      </button>
      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 99 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 100,
              padding: 6,
              borderRadius: 8,
              background: "var(--card-bg, #1e1e2e)",
              border: "1px solid var(--border-subtle, #444)",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
              display: "flex",
              gap: 4,
              flexWrap: "wrap" as const,
              width: 120,
            }}
          >
            {colors.map((c) => (
              <button
                key={c || "default"}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  border:
                    (c || "") === (currentColor || "")
                      ? "2px solid #fff"
                      : "2px solid transparent",
                  background: c || "var(--accent-color, #14b8a6)",
                  cursor: "pointer",
                  boxShadow:
                    (c || "") === (currentColor || "")
                      ? "0 0 0 2px var(--accent-color, #14b8a6)"
                      : "none",
                }}
                title={c || "Default"}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
