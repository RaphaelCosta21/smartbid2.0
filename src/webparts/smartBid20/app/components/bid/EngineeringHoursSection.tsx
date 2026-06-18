import * as React from "react";
import {
  IScopeItem,
  IEngineeringHoursSection,
  IEngineeringHoursItem,
  IEngineeringDeliverable,
  IResourceAllocation,
} from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { formatHours } from "../../utils/formatters";
import { makeId } from "../../utils/idGenerator";
import styles from "./EngineeringHoursSection.module.scss";

interface EngineeringHoursSectionProps {
  engineeringSection: IEngineeringHoursSection;
  scopeItems: IScopeItem[];
  readOnly?: boolean;
  onSave?: (updated: IEngineeringHoursSection) => void;
}

interface EditItemModalState {
  open: boolean;
  mode: "add" | "edit";
  itemId?: string;
  scopeItemId: string;
  description: string;
  equipmentOffer: string;
  sectionName: string;
  notes: string;
  deliverables: IEngineeringDeliverable[];
  /** Hours grid: deliverableType -> resourceType -> hours */
  hoursGrid: Record<string, Record<string, number>>;
  /** Whether to include Manufacturing Support (20%) */
  includeManufacturing: boolean;
}

const INITIAL_MODAL: EditItemModalState = {
  open: false,
  mode: "add",
  scopeItemId: "",
  description: "",
  equipmentOffer: "",
  sectionName: "",
  notes: "",
  deliverables: [],
  hoursGrid: {},
  includeManufacturing: false,
};

export const EngineeringHoursSection: React.FC<
  EngineeringHoursSectionProps
> = ({ engineeringSection, scopeItems, readOnly = false, onSave }) => {
  const config = useConfigStore((s) => s.config);
  const engineerDeliverables = (config?.engineerDeliverables || []).filter(
    (d) => d.isActive !== false,
  );
  const deliverableCategories: string[] =
    config?.engineerDeliverableCategories || [];
  const jobFunctions = (config?.jobFunctions || []).filter(
    (f) =>
      f.isActive !== false &&
      (f.category || "").toUpperCase() === "ENGINEERING",
  );

  // Resource column labels for the hours grid
  const resourceColumns = React.useMemo(() => {
    return jobFunctions.map((f) => f.value);
  }, [jobFunctions]);

  // Group deliverables by category
  const deliverablesByCategory = React.useMemo(() => {
    const map: Record<string, typeof engineerDeliverables> = {};
    const categories =
      deliverableCategories.length > 0 ? deliverableCategories : ["General"];
    categories.forEach((cat) => {
      map[cat] = [];
    });
    engineerDeliverables.forEach((d) => {
      const cat = (d as any).category || "General";
      if (!map[cat]) map[cat] = [];
      map[cat].push(d);
    });
    return map;
  }, [engineerDeliverables, deliverableCategories]);

  const engItems = engineeringSection.engineeringItems || [];

  const [modal, setModal] = React.useState<EditItemModalState>(INITIAL_MODAL);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

  // Track previous scope IDs to avoid unnecessary auto-sync triggers
  const prevScopeIdsRef = React.useRef<string>("");

  // Auto-sync: add/remove items based on scope needsEngineering flag
  React.useEffect(() => {
    if (!onSave) return;

    // Build list of all items/sub-items needing engineering
    const engSources: Array<{
      id: string;
      description: string;
      equipmentOffer: string;
      sectionId?: string;
    }> = [];
    scopeItems.forEach((si) => {
      if (!si.isSection && si.needsEngineering) {
        engSources.push({
          id: si.id,
          description:
            si.description || si.equipmentOffer || `Item #${si.lineNumber}`,
          equipmentOffer: si.equipmentOffer || "",
          sectionId: si.sectionId || undefined,
        });
      }
      if (si.subItems) {
        si.subItems.forEach((sub) => {
          if (sub.needsEngineering) {
            engSources.push({
              id: sub.id,
              description: sub.description || "Sub-item",
              equipmentOffer: sub.equipmentOffer || "",
              sectionId: si.sectionId || undefined,
            });
          }
        });
      }
    });

    // Build a stable key to avoid firing on mere reference changes
    const scopeIdsKey = engSources
      .map((s) => s.id)
      .sort()
      .join(",");
    if (scopeIdsKey === prevScopeIdsRef.current) return;
    prevScopeIdsRef.current = scopeIdsKey;

    const currentItems = engineeringSection.engineeringItems || [];
    const scopeIdsNeeding = new Set(engSources.map((s) => s.id));
    const existingIds = new Set(currentItems.map((ei) => ei.scopeItemId));

    const toAdd: IEngineeringHoursItem[] = [];
    engSources
      .filter((s) => !existingIds.has(s.id))
      .forEach((s) => {
        const parentSection = scopeItems.find(
          (sec) => sec.isSection && sec.id === s.sectionId,
        );
        toAdd.push({
          id: makeId("eng"),
          scopeItemId: s.id,
          description: s.description,
          equipmentOffer: s.equipmentOffer,
          sectionName: parentSection?.sectionTitle || "",
          notes: "",
          deliverables: [],
          totalHours: 0,
        });
      });

    const filtered = currentItems.filter((ei) =>
      scopeIdsNeeding.has(ei.scopeItemId),
    );

    // Update description/equipmentOffer/sectionName from scope if changed
    const synced = filtered.map((ei) => {
      const si = scopeItems.find((s) => s.id === ei.scopeItemId);
      if (!si) return ei;
      const parentSection = scopeItems.find(
        (s) => s.isSection && s.id === si.sectionId,
      );
      return {
        ...ei,
        description: si.description || ei.description,
        equipmentOffer: si.equipmentOffer || ei.equipmentOffer || "",
        sectionName: parentSection?.sectionTitle || ei.sectionName || "",
      };
    });

    if (toAdd.length > 0 || synced.length !== currentItems.length) {
      const merged = [...synced, ...toAdd];
      const totalHours = merged.reduce((sum, i) => sum + i.totalHours, 0);
      onSave({
        ...engineeringSection,
        engineeringItems: merged,
        totalHours:
          engineeringSection.items.reduce((s, i) => s + i.totalHours, 0) +
          totalHours,
        totalCostBRL: engineeringSection.totalCostBRL,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeItems]);

  // Scope items available for manual add
  const availableScopeItems = React.useMemo(() => {
    const existingIds = new Set(engItems.map((ei) => ei.scopeItemId));
    const results: IScopeItem[] = [];
    scopeItems.forEach((si) => {
      if (!si.isSection && si.needsEngineering && !existingIds.has(si.id)) {
        results.push(si);
      }
      if (si.subItems) {
        si.subItems.forEach((sub) => {
          if (sub.needsEngineering && !existingIds.has(sub.id)) {
            results.push({
              ...si,
              id: sub.id,
              description: sub.description,
              equipmentOffer: sub.equipmentOffer || "",
              subItems: undefined,
            } as any);
          }
        });
      }
    });
    return results;
  }, [scopeItems, engItems]);

  // Grand total
  const grandTotal = engItems.reduce((sum, item) => sum + item.totalHours, 0);

  // Toggle expand/collapse
  const toggleExpand = (id: string): void => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = (): void => {
    setExpandedItems(new Set(engItems.map((i) => i.id)));
  };

  const collapseAll = (): void => {
    setExpandedItems(new Set());
  };

  // ─── CRUD ───
  const persist = (items: IEngineeringHoursItem[]): void => {
    if (!onSave) return;
    const totalHours = items.reduce((sum, i) => sum + i.totalHours, 0);
    onSave({
      ...engineeringSection,
      engineeringItems: items,
      totalHours:
        engineeringSection.items.reduce((s, i) => s + i.totalHours, 0) +
        totalHours,
      totalCostBRL: engineeringSection.totalCostBRL,
    });
  };

  const openAddModal = (): void => {
    const first = availableScopeItems[0];
    const parentSection = first
      ? scopeItems.find((s) => s.isSection && s.id === first.sectionId)
      : undefined;
    setModal({
      open: true,
      mode: "add",
      scopeItemId: first?.id || "",
      description: first?.description || "",
      equipmentOffer: first?.equipmentOffer || "",
      sectionName: parentSection?.sectionTitle || "",
      notes: "",
      deliverables: [],
      hoursGrid: {},
      includeManufacturing: false,
    });
  };

  const openEditModal = (item: IEngineeringHoursItem): void => {
    // Build hoursGrid from existing deliverables
    const grid: Record<string, Record<string, number>> = {};
    item.deliverables.forEach((d) => {
      if (d.hoursByResource) {
        grid[d.deliverableType] = { ...d.hoursByResource };
      } else if (d.hours > 0) {
        // Legacy: single resource
        grid[d.deliverableType] = { [d.resourceType]: d.hours };
      }
    });
    setModal({
      open: true,
      mode: "edit",
      itemId: item.id,
      scopeItemId: item.scopeItemId,
      description: item.description,
      equipmentOffer: item.equipmentOffer || "",
      sectionName: item.sectionName || "",
      notes: item.notes || "",
      deliverables: [...item.deliverables],
      hoursGrid: grid,
      includeManufacturing: item.includeManufacturing || false,
    });
  };

  const closeModal = (): void => setModal(INITIAL_MODAL);

  const handleScopeItemChange = (scopeItemId: string): void => {
    const scope = scopeItems.find((si) => si.id === scopeItemId);
    const parentSection = scope
      ? scopeItems.find((s) => s.isSection && s.id === scope.sectionId)
      : undefined;
    setModal((prev) => ({
      ...prev,
      scopeItemId,
      description: scope?.description || "",
      equipmentOffer: scope?.equipmentOffer || "",
      sectionName: parentSection?.sectionTitle || "",
    }));
  };

  // Update a single cell in the hours grid
  const updateGridCell = (
    deliverableType: string,
    resourceType: string,
    hours: number,
  ): void => {
    setModal((prev) => {
      const newGrid = { ...prev.hoursGrid };
      if (!newGrid[deliverableType]) newGrid[deliverableType] = {};
      newGrid[deliverableType] = {
        ...newGrid[deliverableType],
        [resourceType]: hours,
      };
      return { ...prev, hoursGrid: newGrid };
    });
  };

  // Compute totals from the grid
  const getGridColumnTotals = (): Record<string, number> => {
    const totals: Record<string, number> = {};
    resourceColumns.forEach((rc) => {
      totals[rc] = 0;
    });
    Object.values(modal.hoursGrid).forEach((resourceMap) => {
      resourceColumns.forEach((rc) => {
        totals[rc] += resourceMap[rc] || 0;
      });
    });
    return totals;
  };

  // Manufacturing Support = 20% of design totals per column
  const getManufacturingSupportHours = (
    columnTotals: Record<string, number>,
  ): Record<string, number> => {
    const mfg: Record<string, number> = {};
    resourceColumns.forEach((rc) => {
      mfg[rc] = Math.round(columnTotals[rc] * 0.2 * 100) / 100;
    });
    return mfg;
  };

  const handleSaveItem = (): void => {
    // Build deliverables from hoursGrid
    const newDeliverables: IEngineeringDeliverable[] = [];
    Object.keys(modal.hoursGrid).forEach((deliverableType) => {
      const resourceMap = modal.hoursGrid[deliverableType];
      const totalHrs = Object.values(resourceMap).reduce(
        (sum, h) => sum + (h || 0),
        0,
      );
      if (totalHrs > 0) {
        // Find the primary resource (the one with most hours)
        let primaryResource = resourceColumns[0] || "Engineer";
        let maxHrs = 0;
        Object.entries(resourceMap).forEach(([res, hrs]) => {
          if (hrs > maxHrs) {
            maxHrs = hrs;
            primaryResource = res;
          }
        });
        newDeliverables.push({
          id: makeId("edl"),
          deliverableType,
          resourceType: primaryResource,
          hours: totalHrs,
          hoursByResource: { ...resourceMap },
        });
      }
    });

    const designHours = newDeliverables.reduce((sum, d) => sum + d.hours, 0);
    // Add 20% manufacturing support hours if enabled
    let mfgHoursTotal = 0;
    if (modal.includeManufacturing) {
      const colTotals = getGridColumnTotals();
      const mfgHrs = getManufacturingSupportHours(colTotals);
      mfgHoursTotal = Object.values(mfgHrs).reduce((s, v) => s + v, 0);
    }
    const totalItemHours = designHours + mfgHoursTotal;

    if (modal.mode === "add") {
      const newItem: IEngineeringHoursItem = {
        id: makeId("eng"),
        scopeItemId: modal.scopeItemId,
        description: modal.description,
        equipmentOffer: modal.equipmentOffer,
        sectionName: modal.sectionName,
        notes: modal.notes,
        deliverables: newDeliverables,
        totalHours: totalItemHours,
        includeManufacturing: modal.includeManufacturing,
      };
      persist([...engItems, newItem]);
    } else {
      persist(
        engItems.map((item) =>
          item.id === modal.itemId
            ? {
                ...item,
                notes: modal.notes,
                deliverables: newDeliverables,
                totalHours: totalItemHours,
                includeManufacturing: modal.includeManufacturing,
              }
            : item,
        ),
      );
    }
    closeModal();
  };

  const handleDeleteItem = (itemId: string): void => {
    if (!window.confirm("Remove this engineering item?")) return;
    persist(engItems.filter((i) => i.id !== itemId));
  };

  const updateItemNotes = (itemId: string, notes: string): void => {
    persist(engItems.map((i) => (i.id === itemId ? { ...i, notes } : i)));
  };

  // ─── Resource Allocation ───
  const resourceAllocations = engineeringSection.resourceAllocations || [];

  // Compute hours per resource from deliverables
  const hoursByResource = React.useMemo(() => {
    const map: Record<string, number> = {};
    engItems.forEach((item) => {
      item.deliverables.forEach((d) => {
        const key = d.resourceType || "Unassigned";
        map[key] = (map[key] || 0) + d.hours;
      });
    });
    return map;
  }, [engItems]);

  const updateResourceAllocation = (
    resourceType: string,
    field: "hoursPerDay" | "people",
    value: number,
  ): void => {
    if (!onSave) return;
    const totalHrs = hoursByResource[resourceType] || 0;
    const current = resourceAllocations.find(
      (r) => r.resourceType === resourceType,
    );
    const hoursPerDay =
      field === "hoursPerDay" ? value : current?.hoursPerDay || 8;
    const people = field === "people" ? value : current?.people || 1;
    const estimatedDays =
      hoursPerDay > 0 && people > 0
        ? Math.ceil(totalHrs / (hoursPerDay * people))
        : 0;

    const updated: IResourceAllocation = {
      id: current?.id || makeId("ra"),
      resourceType,
      totalHours: totalHrs,
      hoursPerDay,
      people,
      estimatedDays,
    };

    const newAllocations = current
      ? resourceAllocations.map((r) =>
          r.resourceType === resourceType ? updated : r,
        )
      : [...resourceAllocations, updated];

    onSave({
      ...engineeringSection,
      resourceAllocations: newAllocations,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h4 className={styles.title}>Engineering Hours</h4>
        <div className={styles.headerActions}>
          {engItems.length > 0 && (
            <button
              className={styles.collapseBtn}
              onClick={
                expandedItems.size === engItems.length ? collapseAll : expandAll
              }
            >
              {expandedItems.size === engItems.length
                ? "▼ Collapse All"
                : "▶ Expand All"}
            </button>
          )}
          {!readOnly && onSave && (
            <button className={styles.addBtn} onClick={openAddModal}>
              + Add Item
            </button>
          )}
        </div>
      </div>

      {engItems.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📐</span>
          <p>No engineering items yet.</p>
          <p className={styles.emptyHint}>
            Mark items in Scope of Supply with the &quot;Eng?&quot; checkbox to
            add them here automatically, then define deliverable hours for each.
          </p>
        </div>
      ) : (
        <div className={styles.itemsList}>
          {engItems.map((item, idx) => {
            const isExpanded = expandedItems.has(item.id);
            return (
              <div key={item.id} className={styles.itemCard}>
                {/* Item Header Row */}
                <div
                  className={styles.itemHeader}
                  onClick={() => toggleExpand(item.id)}
                >
                  <span
                    className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ""}`}
                  >
                    ▶
                  </span>
                  <span className={styles.itemNumber}>{idx + 1}</span>
                  <div className={styles.itemInfo}>
                    <span className={styles.itemDesc}>{item.description}</span>
                    <div className={styles.itemMeta}>
                      {item.sectionName && (
                        <span className={styles.metaTag}>
                          📁 {item.sectionName}
                        </span>
                      )}
                      {item.equipmentOffer && (
                        <span className={styles.metaTag}>
                          🔧 {item.equipmentOffer}
                        </span>
                      )}
                      {item.deliverables.length > 0 && (
                        <span className={styles.metaCount}>
                          {item.deliverables.length} deliverable
                          {item.deliverables.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className={styles.itemTotalBadge}>
                    <span className={styles.totalLabel}>Total</span>
                    <span className={styles.totalValue}>
                      {formatHours(item.totalHours)}
                    </span>
                  </div>
                  {!readOnly && onSave && (
                    <div
                      className={styles.itemActions}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className={styles.editBtn}
                        onClick={() => openEditModal(item)}
                        title="Edit deliverables"
                      >
                        ✎
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteItem(item.id)}
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>

                {/* Expanded: deliverables table + notes */}
                {isExpanded && (
                  <div className={styles.itemBody}>
                    {item.deliverables.length === 0 ? (
                      <div className={styles.noDeliverables}>
                        No deliverables defined yet. Click ✎ to add.
                      </div>
                    ) : (
                      <table className={styles.deliverablesTable}>
                        <thead>
                          <tr>
                            <th>Deliverable Type</th>
                            {resourceColumns.map((rc) => (
                              <th key={rc} className={styles.thHours}>
                                {rc}
                              </th>
                            ))}
                            <th className={styles.thHours}>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.deliverables.map((d) => (
                            <tr key={d.id}>
                              <td className={styles.delivType}>
                                {d.deliverableType}
                              </td>
                              {resourceColumns.map((rc) => (
                                <td key={rc} className={styles.delivHours}>
                                  {d.hoursByResource?.[rc] || "—"}
                                </td>
                              ))}
                              <td className={styles.delivHours}>{d.hours}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td className={styles.footLabel}>Subtotal</td>
                            {resourceColumns.map((rc) => {
                              const colTotal = item.deliverables.reduce(
                                (sum, d) =>
                                  sum + (d.hoursByResource?.[rc] || 0),
                                0,
                              );
                              return (
                                <td key={rc} className={styles.delivHours}>
                                  {colTotal > 0 ? colTotal : "—"}
                                </td>
                              );
                            })}
                            <td className={styles.delivHours}>
                              {item.totalHours}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    )}
                    {/* Notes */}
                    <div className={styles.notesSection}>
                      <label className={styles.notesLabel}>Notes</label>
                      {readOnly ? (
                        <p className={styles.notesText}>{item.notes || "—"}</p>
                      ) : (
                        <textarea
                          className={styles.notesInput}
                          value={item.notes || ""}
                          placeholder="Add notes or comments..."
                          onChange={(e) =>
                            updateItemNotes(item.id, e.target.value)
                          }
                          rows={2}
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Grand Total + Resource Allocation */}
          <div className={styles.grandTotal}>
            <div className={styles.grandTotalHeader}>
              <span>Grand Total Engineering Hours</span>
              <span className={styles.grandTotalValue}>
                {formatHours(grandTotal)}
              </span>
            </div>

            {/* Resource breakdown */}
            {Object.keys(hoursByResource).length > 0 && (
              <div className={styles.resourceBreakdown}>
                <div className={styles.resourceBreakdownTitle}>
                  Hours by Resource
                </div>
                <table className={styles.resourceTable}>
                  <thead>
                    <tr>
                      <th>Resource</th>
                      <th className={styles.thCenter}>Total Hrs</th>
                      <th className={styles.thCenter}>Hrs/Day</th>
                      <th className={styles.thCenter}>People</th>
                      <th className={styles.thCenter}>Est. Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(hoursByResource).map(([resource, hrs]) => {
                      const alloc = resourceAllocations.find(
                        (r) => r.resourceType === resource,
                      );
                      const hoursPerDay = alloc?.hoursPerDay || 8;
                      const people = alloc?.people || 1;
                      const estDays =
                        hoursPerDay > 0 && people > 0
                          ? Math.ceil(hrs / (hoursPerDay * people))
                          : 0;
                      return (
                        <tr key={resource}>
                          <td className={styles.resourceName}>{resource}</td>
                          <td className={styles.resourceCenter}>
                            {formatHours(hrs)}
                          </td>
                          <td className={styles.resourceCenter}>
                            {!readOnly && onSave ? (
                              <input
                                className={styles.allocInput}
                                type="number"
                                min={1}
                                max={24}
                                value={hoursPerDay}
                                onChange={(e) =>
                                  updateResourceAllocation(
                                    resource,
                                    "hoursPerDay",
                                    Number(e.target.value) || 8,
                                  )
                                }
                              />
                            ) : (
                              hoursPerDay
                            )}
                          </td>
                          <td className={styles.resourceCenter}>
                            {!readOnly && onSave ? (
                              <input
                                className={styles.allocInput}
                                type="number"
                                min={1}
                                max={50}
                                value={people}
                                onChange={(e) =>
                                  updateResourceAllocation(
                                    resource,
                                    "people",
                                    Number(e.target.value) || 1,
                                  )
                                }
                              />
                            ) : (
                              people
                            )}
                          </td>
                          <td className={styles.resourceCenter}>
                            <span className={styles.estDaysBadge}>
                              {estDays} day{estDays !== 1 ? "s" : ""}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Add/Edit Modal ─── */}
      {modal.open && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalWide}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3>
                {modal.mode === "add"
                  ? "Add Engineering Item"
                  : "Edit Engineering Hours"}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Compact item info row */}
              <div className={styles.modalInfoBar}>
                <div className={styles.infoBarItem}>
                  <span className={styles.infoBarLabel}>Item:</span>
                  {modal.mode === "add" ? (
                    <select
                      className={styles.infoBarSelect}
                      value={modal.scopeItemId}
                      onChange={(e) => handleScopeItemChange(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a scope item...
                      </option>
                      {availableScopeItems.map((si) => (
                        <option key={si.id} value={si.id}>
                          {si.description || `Item #${si.lineNumber}`}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={styles.infoBarValue}>
                      {modal.description}
                    </span>
                  )}
                </div>
                {modal.sectionName && (
                  <div className={styles.infoBarItem}>
                    <span className={styles.infoBarLabel}>Section:</span>
                    <span className={styles.infoBarValue}>
                      {modal.sectionName}
                    </span>
                  </div>
                )}
                {modal.equipmentOffer && (
                  <div className={styles.infoBarItem}>
                    <span className={styles.infoBarLabel}>Equipment:</span>
                    <span className={styles.infoBarValue}>
                      {modal.equipmentOffer}
                    </span>
                  </div>
                )}
              </div>

              {/* ─── Hours Grid Table ─── */}
              <div className={styles.hoursGridWrapper}>
                <table className={styles.hoursGridTable}>
                  <thead>
                    <tr>
                      <th className={styles.gridColDesc}>
                        Deliverable Description
                      </th>
                      {resourceColumns.map((rc) => (
                        <th key={rc} className={styles.gridColHours}>
                          {rc} Hours
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(deliverablesByCategory).map(
                      ([category, deliverables]) => {
                        if (deliverables.length === 0) return null;
                        return (
                          <React.Fragment key={category}>
                            {/* Category header row */}
                            <tr className={styles.gridCategoryRow}>
                              <td
                                colSpan={resourceColumns.length + 1}
                                className={styles.gridCategoryCell}
                              >
                                {category}
                              </td>
                            </tr>
                            {/* Deliverable rows */}
                            {deliverables.map((del) => (
                              <tr key={del.id} className={styles.gridItemRow}>
                                <td className={styles.gridItemLabel}>
                                  {del.label}
                                </td>
                                {resourceColumns.map((rc) => (
                                  <td key={rc} className={styles.gridItemCell}>
                                    <input
                                      className={styles.gridInput}
                                      type="number"
                                      min={0}
                                      value={
                                        modal.hoursGrid[del.value]?.[rc] || ""
                                      }
                                      placeholder="0"
                                      onChange={(e) =>
                                        updateGridCell(
                                          del.value,
                                          rc,
                                          Number(e.target.value) || 0,
                                        )
                                      }
                                    />
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      },
                    )}
                    {/* Manufacturing Support row (auto-calculated, toggleable) */}
                    {modal.includeManufacturing &&
                      (() => {
                        const colTotals = getGridColumnTotals();
                        const mfgHours =
                          getManufacturingSupportHours(colTotals);

                        return (
                          <tr className={styles.gridMfgRow}>
                            <td className={styles.gridMfgLabel}>
                              Manufacturing Support (20%)
                            </td>
                            {resourceColumns.map((rc) => (
                              <td key={rc} className={styles.gridMfgCell}>
                                {mfgHours[rc] > 0
                                  ? mfgHours[rc].toFixed(1)
                                  : "—"}
                              </td>
                            ))}
                          </tr>
                        );
                      })()}
                  </tbody>
                </table>
              </div>

              {/* Manufacturing toggle */}
              <div className={styles.mfgToggleRow}>
                <label className={styles.mfgToggleLabel}>
                  <input
                    type="checkbox"
                    checked={modal.includeManufacturing}
                    onChange={(e) =>
                      setModal((prev) => ({
                        ...prev,
                        includeManufacturing: e.target.checked,
                      }))
                    }
                  />
                  Include Manufacturing Support (20%)
                </label>
              </div>

              {/* ─── Summary Totals ─── */}
              {(() => {
                const colTotals = getGridColumnTotals();
                const mfgHours = getManufacturingSupportHours(colTotals);
                const designTotal = Object.values(colTotals).reduce(
                  (s, v) => s + v,
                  0,
                );
                // Get "Support - Project" hours specifically
                const projectSupportHours = resourceColumns.reduce(
                  (sum, rc) => {
                    return (
                      sum + (modal.hoursGrid["Support - Project"]?.[rc] || 0)
                    );
                  },
                  0,
                );
                const mfgTotal = modal.includeManufacturing
                  ? Object.values(mfgHours).reduce((s, v) => s + v, 0)
                  : 0;
                const grandTotal2 = designTotal + mfgTotal;

                return (
                  <div className={styles.gridSummary}>
                    <table className={styles.gridSummaryTable}>
                      <tbody>
                        <tr>
                          <td className={styles.summaryLabel}>Total Design</td>
                          <td className={styles.summaryValue}>
                            {designTotal.toFixed(1)}
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.summaryLabel}>
                            Total Project Support
                          </td>
                          <td className={styles.summaryValue}>
                            {projectSupportHours.toFixed(1)}
                          </td>
                        </tr>
                        {modal.includeManufacturing && (
                          <tr>
                            <td className={styles.summaryLabel}>
                              Total w/ Manufacturing Support
                            </td>
                            <td className={styles.summaryValue}>
                              {(designTotal + mfgTotal).toFixed(1)}
                            </td>
                          </tr>
                        )}
                        <tr className={styles.summaryTotalRow}>
                          <td className={styles.summaryTotalLabel}>
                            Total for BID
                          </td>
                          <td className={styles.summaryTotalValue}>
                            {grandTotal2.toFixed(1)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.cancelBtn} onClick={closeModal}>
                Cancel
              </button>
              <button
                className={styles.saveBtn}
                onClick={handleSaveItem}
                disabled={!modal.scopeItemId}
              >
                {modal.mode === "add" ? "Add Item" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
