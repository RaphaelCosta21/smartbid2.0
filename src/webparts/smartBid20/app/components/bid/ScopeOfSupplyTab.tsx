import * as React from "react";
import { IScopeItem, IClarificationItem } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./ScopeOfSupplyTab.module.scss";

interface ScopeOfSupplyTabProps {
  scopeItems: IScopeItem[];
  onSave: (items: IScopeItem[]) => void;
  readOnly?: boolean;
  clarifications?: IClarificationItem[];
}

const makeId = (): string =>
  `scope-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const blankItem = (
  sectionId: string | null,
  lineNumber: number,
): IScopeItem => ({
  id: makeId(),
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
  oiiPartNumber: "",
  mfgReference: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
});

const blankSection = (lineNumber: number): IScopeItem => ({
  id: makeId(),
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
  oiiPartNumber: "",
  mfgReference: "",
  qtyOperational: 0,
  qtySpare: 0,
  needsCertification: false,
  comments: "",
  importedFromTemplate: null,
});

export const ScopeOfSupplyTab: React.FC<ScopeOfSupplyTabProps> = ({
  scopeItems,
  onSave,
  readOnly = false,
  clarifications = [],
}) => {
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

  // ─── Handlers ───
  const addSection = (): void => {
    persist([...items, blankSection(items.length + 1)]);
  };

  const addItem = (sectionId: string | null): void => {
    persist([...items, blankItem(sectionId, items.length + 1)]);
  };

  const deleteItem = (id: string): void => {
    persist(items.filter((i) => i.id !== id));
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

  const toggleSection = (sectionId: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
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

  // Visible ordered items (respects collapsed)
  const visibleOrderedItems = React.useMemo(() => {
    return orderedItems.filter((item) => {
      if (
        !item.isSection &&
        item.sectionId &&
        collapsedSections.has(item.sectionId)
      )
        return false;
      return true;
    });
  }, [orderedItems, collapsedSections]);

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
    "Description",
    "Compliance",
    "Resource Type",
    "Sub-Type",
    "Equipment Offer",
    "OII PN",
    "MFG Ref",
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
                  return (
                    <tr key={item.id} className={styles.sectionRow}>
                      <td colSpan={columns.length + (!readOnly ? 1 : 0)}>
                        <div
                          className={styles.sectionHeader}
                          onClick={() => toggleSection(item.id)}
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
                  );
                }

                // Data row
                const subTypes = getSubTypes(item.resourceType);
                const commentsKey = `comments-${item.id}`;
                const clientDocKey = `clientDoc-${item.id}`;
                const isCommentsExpanded = expandedCells.has(commentsKey);
                const isClientDocExpanded = expandedCells.has(clientDocKey);
                return (
                  <tr key={item.id}>
                    {/* Reorder */}
                    <td
                      className={styles.cellCenter}
                      style={{ width: 28, padding: "0 2px" }}
                    >
                      {!readOnly && (
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
                      )}
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
                            updateField(item.id, "clientDocRef", e.target.value)
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
                      <EditableCell
                        value={item.description}
                        readOnly={readOnly}
                        isEditing={
                          editingCell?.id === item.id &&
                          editingCell?.field === "description"
                        }
                        onStartEdit={() =>
                          setEditingCell({ id: item.id, field: "description" })
                        }
                        onEndEdit={() => setEditingCell(null)}
                        onChange={(v) => updateField(item.id, "description", v)}
                      />
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
                          className={styles.editSelect}
                          value={item.resourceType}
                          onChange={(e) =>
                            updateField(item.id, "resourceType", e.target.value)
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
                          className={styles.editSelect}
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
                        value={item.oiiPartNumber}
                        readOnly={readOnly}
                        mono
                        isEditing={
                          editingCell?.id === item.id &&
                          editingCell?.field === "oiiPartNumber"
                        }
                        onStartEdit={() =>
                          setEditingCell({
                            id: item.id,
                            field: "oiiPartNumber",
                          })
                        }
                        onEndEdit={() => setEditingCell(null)}
                        onChange={(v) =>
                          updateField(item.id, "oiiPartNumber", v)
                        }
                      />
                    </td>
                    <td>
                      <EditableCell
                        value={item.mfgReference}
                        readOnly={readOnly}
                        isEditing={
                          editingCell?.id === item.id &&
                          editingCell?.field === "mfgReference"
                        }
                        onStartEdit={() =>
                          setEditingCell({ id: item.id, field: "mfgReference" })
                        }
                        onEndEdit={() => setEditingCell(null)}
                        onChange={(v) =>
                          updateField(item.id, "mfgReference", v)
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
                            className={`${styles.actionBtn} ${styles.delete}`}
                            onClick={() => deleteItem(item.id)}
                          >
                            ✕
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
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
