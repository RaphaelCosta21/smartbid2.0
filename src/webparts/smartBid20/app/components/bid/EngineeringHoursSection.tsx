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
};

export const EngineeringHoursSection: React.FC<
  EngineeringHoursSectionProps
> = ({ engineeringSection, scopeItems, readOnly = false, onSave }) => {
  const config = useConfigStore((s) => s.config);
  const engineerDeliverables = (config?.engineerDeliverables || []).filter(
    (d) => d.isActive !== false,
  );
  const jobFunctions = (config?.jobFunctions || []).filter(
    (f) =>
      f.isActive !== false &&
      (f.category || "").toUpperCase() === "ENGINEERING",
  );

  const engItems = engineeringSection.engineeringItems || [];

  const [modal, setModal] = React.useState<EditItemModalState>(INITIAL_MODAL);
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(
    new Set(),
  );

  // Auto-sync: add/remove items based on scope needsEngineering flag
  React.useEffect(() => {
    if (!onSave) return;
    const currentItems = engineeringSection.engineeringItems || [];
    const scopeIdsNeeding = new Set(
      scopeItems
        .filter((si) => !si.isSection && si.needsEngineering)
        .map((si) => si.id),
    );
    const existingIds = new Set(currentItems.map((ei) => ei.scopeItemId));

    const toAdd: IEngineeringHoursItem[] = [];
    scopeItems
      .filter(
        (si) => !si.isSection && si.needsEngineering && !existingIds.has(si.id),
      )
      .forEach((si) => {
        const parentSection = scopeItems.find(
          (s) => s.isSection && s.id === si.sectionId,
        );
        toAdd.push({
          id: makeId("eng"),
          scopeItemId: si.id,
          description: si.description || `Item #${si.lineNumber}`,
          equipmentOffer: si.equipmentOffer || "",
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
    return scopeItems.filter(
      (si) => !si.isSection && si.needsEngineering && !existingIds.has(si.id),
    );
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
    });
  };

  const openEditModal = (item: IEngineeringHoursItem): void => {
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

  const toggleDeliverable = (deliverableValue: string): void => {
    setModal((prev) => {
      const existing = prev.deliverables.find(
        (d) => d.deliverableType === deliverableValue,
      );
      if (existing) {
        return {
          ...prev,
          deliverables: prev.deliverables.filter(
            (d) => d.deliverableType !== deliverableValue,
          ),
        };
      }
      return {
        ...prev,
        deliverables: [
          ...prev.deliverables,
          {
            id: makeId("edl"),
            deliverableType: deliverableValue,
            resourceType: jobFunctions[0]?.value || "Engineer",
            hours: 0,
          },
        ],
      };
    });
  };

  const updateDeliverableHours = (
    deliverableType: string,
    hours: number,
  ): void => {
    setModal((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) =>
        d.deliverableType === deliverableType ? { ...d, hours } : d,
      ),
    }));
  };

  const updateDeliverableResource = (
    deliverableType: string,
    resourceType: string,
  ): void => {
    setModal((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) =>
        d.deliverableType === deliverableType ? { ...d, resourceType } : d,
      ),
    }));
  };

  const handleSaveItem = (): void => {
    const activeDels = modal.deliverables.filter((d) => d.hours > 0);
    const totalItemHours = activeDels.reduce((sum, d) => sum + d.hours, 0);
    if (modal.mode === "add") {
      const newItem: IEngineeringHoursItem = {
        id: makeId("eng"),
        scopeItemId: modal.scopeItemId,
        description: modal.description,
        equipmentOffer: modal.equipmentOffer,
        sectionName: modal.sectionName,
        notes: modal.notes,
        deliverables: activeDels,
        totalHours: totalItemHours,
      };
      persist([...engItems, newItem]);
    } else {
      persist(
        engItems.map((item) =>
          item.id === modal.itemId
            ? {
                ...item,
                notes: modal.notes,
                deliverables: activeDels,
                totalHours: totalItemHours,
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
                            <th>Resource</th>
                            <th className={styles.thHours}>Hours</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item.deliverables.map((d) => (
                            <tr key={d.id}>
                              <td className={styles.delivType}>
                                {d.deliverableType}
                              </td>
                              <td className={styles.delivResource}>
                                {d.resourceType}
                              </td>
                              <td className={styles.delivHours}>{d.hours}</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className={styles.footLabel}>
                              Subtotal
                            </td>
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
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>
                {modal.mode === "add" ? "Add Engineering Item" : "Edit Item"}
              </h3>
              <button className={styles.closeBtn} onClick={closeModal}>
                ✕
              </button>
            </div>
            <div className={styles.modalBody}>
              {/* Item info */}
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Item Description</label>
                  {modal.mode === "add" ? (
                    <select
                      className={styles.formSelect}
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
                    <input
                      className={styles.formInput}
                      value={modal.description}
                      readOnly
                    />
                  )}
                </div>
              </div>

              {/* Context info */}
              {(modal.sectionName || modal.equipmentOffer) && (
                <div className={styles.contextRow}>
                  {modal.sectionName && (
                    <span className={styles.contextTag}>
                      📁 Section: {modal.sectionName}
                    </span>
                  )}
                  {modal.equipmentOffer && (
                    <span className={styles.contextTag}>
                      🔧 Equipment: {modal.equipmentOffer}
                    </span>
                  )}
                </div>
              )}

              {/* Notes */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Notes / Comments</label>
                <textarea
                  className={styles.formTextarea}
                  value={modal.notes}
                  onChange={(e) =>
                    setModal((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Add any notes about this engineering item..."
                  rows={2}
                />
              </div>

              {/* Deliverable Types */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Deliverables
                  <span className={styles.formHint}>
                    {" "}
                    — Check each deliverable needed and set the hours
                  </span>
                </label>
                <div className={styles.deliverablesGrid}>
                  {engineerDeliverables.map((del) => {
                    const isChecked = modal.deliverables.some(
                      (d) => d.deliverableType === del.value,
                    );
                    const deliverable = modal.deliverables.find(
                      (d) => d.deliverableType === del.value,
                    );
                    return (
                      <div
                        key={del.id}
                        className={`${styles.deliverableRow} ${isChecked ? styles.deliverableActive : ""}`}
                      >
                        <label className={styles.deliverableCheck}>
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleDeliverable(del.value)}
                          />
                          <span>{del.label}</span>
                        </label>
                        {isChecked && (
                          <div className={styles.deliverableInputs}>
                            <select
                              className={styles.resourceSelect}
                              value={deliverable?.resourceType || ""}
                              onChange={(e) =>
                                updateDeliverableResource(
                                  del.value,
                                  e.target.value,
                                )
                              }
                            >
                              {jobFunctions.map((f) => (
                                <option key={f.id} value={f.value}>
                                  {f.label}
                                </option>
                              ))}
                              {jobFunctions.length === 0 && (
                                <option value="Engineer">Engineer</option>
                              )}
                            </select>
                            <input
                              className={styles.hoursInput}
                              type="number"
                              min={0}
                              placeholder="Hrs"
                              value={deliverable?.hours || ""}
                              onChange={(e) =>
                                updateDeliverableHours(
                                  del.value,
                                  Number(e.target.value) || 0,
                                )
                              }
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal total */}
              <div className={styles.modalTotal}>
                <span>Total Hours:</span>
                <strong>
                  {modal.deliverables.reduce((sum, d) => sum + d.hours, 0)}
                </strong>
              </div>
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
