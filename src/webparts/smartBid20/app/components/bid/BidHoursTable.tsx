import * as React from "react";
import {
  IHoursSummary,
  IHoursItem,
  IHoursSection,
  IHoursSectionGroup,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { formatHours, formatCurrency } from "../../utils/formatters";
import { makeId } from "../../utils/idGenerator";
import styles from "./BidHoursTable.module.scss";

interface BidHoursTableProps {
  hoursSummary: IHoursSummary;
  readOnly?: boolean;
  onSave?: (updated: IHoursSummary) => void;
  /** For division-aware BIDs — when set, shows only Onshore/Offshore sections */
  integratedDivision?: "ROV" | "SURVEY" | "OPG" | null;
}

const blankHoursItem = (sectionId?: string): IHoursItem => ({
  id: makeId("hrs"),
  lineNumber: 0,
  sectionId: sectionId || null,
  requirementName: "",
  function: "",
  phase: "",
  hoursPerDay: 8,
  pplQty: 1,
  workDays: 1,
  utilizationPercent: 100,
  totalHours: 8,
  costBRL: 0,
});

type SectionKey = "engineeringHours" | "onshoreHours" | "offshoreHours";

export const BidHoursTable: React.FC<BidHoursTableProps> = ({
  hoursSummary,
  readOnly = false,
  onSave,
}) => {
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
      const totalHours =
        item.hoursPerDay *
        item.pplQty *
        item.workDays *
        (item.utilizationPercent / 100);
      return { ...item, totalHours: Math.round(totalHours * 100) / 100 };
    });
    return {
      ...section,
      items,
      totalHours: items.reduce((sum, i) => sum + i.totalHours, 0),
      totalCostBRL: items.reduce((sum, i) => sum + i.costBRL, 0),
    };
  };

  const persistChange = (
    sectionKey: SectionKey,
    updatedSection: IHoursSection,
  ): void => {
    if (!onSave) return;
    const recalced = recalcSection(updatedSection);
    const updated: IHoursSummary = {
      ...hoursSummary,
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
    onSave(updated);
  };

  const addRow = (sectionKey: SectionKey, sectionGroupId?: string): void => {
    const section = hoursSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      items: [...section.items, blankHoursItem(sectionGroupId)],
    });
  };

  const deleteRow = (sectionKey: SectionKey, itemId: string): void => {
    const section = hoursSummary?.[sectionKey] || emptySection;
    persistChange(sectionKey, {
      ...section,
      items: section.items.filter((i) => i.id !== itemId),
    });
  };

  const addSectionGroup = (sectionKey: SectionKey): void => {
    const section = hoursSummary?.[sectionKey] || emptySection;
    const sections = section.sections || [];
    persistChange(sectionKey, {
      ...section,
      sections: [...sections, { id: makeId("hrs"), title: "New Section" }],
    });
  };

  const renameSectionGroup = (
    sectionKey: SectionKey,
    groupId: string,
    title: string,
  ): void => {
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
    const section = hoursSummary?.[sectionKey] || emptySection;
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
      const section = hoursSummary?.[key] || emptySection;
      const groups: IHoursSectionGroup[] = section.sections || [];
      groups.forEach((g) => ids.push(g.id));
    });
    return ids;
  }, [hoursSummary]);

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

  return (
    <div className={styles.container}>
      {allGroupIds.length > 0 && (
        <div className={styles.collapseToolbar}>
          <button className={styles.collapseBtn} onClick={toggleAllSections}>
            {allSectionsCollapsed ? "▶ Expand All" : "▼ Collapse All"}
          </button>
        </div>
      )}
      {sectionDefs.map(({ key, label }) => {
        const section = hoursSummary?.[key] || emptySection;
        const sectionGroups: IHoursSectionGroup[] = section.sections || [];
        const unsectionedItems = section.items.filter((i) => !i.sectionId);

        return (
          <div key={key}>
            <div className={styles.sectionHeader}>
              <h4 className={styles.sectionTitle}>{label}</h4>
              {!readOnly && onSave && (
                <div style={{ display: "flex", gap: 6 }}>
                  <button className={styles.addBtn} onClick={() => addRow(key)}>
                    + Add Row
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
                                    style={{ padding: "2px 5px", fontSize: 11 }}
                                    onClick={() =>
                                      moveSectionGroup(key, group.id, "up")
                                    }
                                    title="Move section up"
                                  >
                                    ▲
                                  </button>
                                  <button
                                    className={styles.addBtn}
                                    style={{ padding: "2px 5px", fontSize: 11 }}
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
                                  <ColorPickerInline
                                    currentColor={gColor}
                                    colors={SECTION_COLORS}
                                    onChange={(c) =>
                                      updateSectionGroupColor(key, group.id, c)
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
                            </div>
                          </td>
                        </tr>
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
      <div className={styles.grandTotal}>
        <div className={styles.grandTotalRow}>
          <span>Grand Total</span>
          <span>
            {formatHours(hoursSummary?.grandTotalHours || 0)} —{" "}
            {formatCurrency(hoursSummary?.grandTotalCostBRL || 0, "BRL")}
          </span>
        </div>
      </div>
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
}) => (
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
          onClick={() => moveItem(sectionKey as SectionKey, item.id, "down")}
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
            className={styles.deleteBtn}
            onClick={() => deleteRow(sectionKey, item.id)}
          >
            ✕
          </button>
        </div>
      </td>
    )}
  </tr>
);

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
