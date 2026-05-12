import * as React from "react";
import { IScopeItem, ICertificationItem } from "../../models";
import { makeId } from "../../utils/idGenerator";
import { getCurrencies } from "../../utils/currencyHelpers";
import { AttachmentService } from "../../services/AttachmentService";
import styles from "./CertificationsBreakdownTab.module.scss";

interface CertificationsBreakdownTabProps {
  scopeItems: IScopeItem[];
  certificationsBreakdown: ICertificationItem[];
  onSave: (items: ICertificationItem[]) => void;
  readOnly?: boolean;
  bidNumber?: string;
}

const blankItem = (
  lineNumber: number,
  scopeItemId?: string,
  sectionId?: string | null,
): ICertificationItem => ({
  id: makeId("cert"),
  lineNumber,
  scopeItemId: scopeItemId || null,
  sectionId: sectionId || null,
  itemRef: "",
  qty: 1,
  expiryPeriod: "",
  unitCost: 0,
  totalCost: 0,
  originalCurrency: "USD",
  costReference: "",
  notes: "",
});

const blankSection = (): ICertificationItem => ({
  id: makeId("certsec"),
  lineNumber: 0,
  scopeItemId: null,
  isSection: true,
  sectionTitle: "New Section",
  sectionColor: "",
  itemRef: "",
  qty: 0,
  expiryPeriod: "",
  unitCost: 0,
  totalCost: 0,
  originalCurrency: "USD",
  costReference: "",
  notes: "",
});

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

export const CertificationsBreakdownTab: React.FC<
  CertificationsBreakdownTabProps
> = ({
  scopeItems,
  certificationsBreakdown,
  onSave,
  readOnly = false,
  bidNumber,
}) => {
  // ─── Build items: merge auto-imported + manual items ───
  const builtItems = React.useMemo(() => {
    const needsCert = (scopeItems || []).filter(
      (s) => !s.isSection && s.needsCertification,
    );
    const existingMap = new Map<string, ICertificationItem>();
    const manualItems: ICertificationItem[] = [];
    const sectionItems: ICertificationItem[] = [];

    (certificationsBreakdown || []).forEach((c) => {
      if (c.isSection) {
        sectionItems.push(c);
      } else if (c.scopeItemId) {
        existingMap.set(c.scopeItemId, c);
      } else {
        manualItems.push(c);
      }
    });

    const autoItems: ICertificationItem[] = needsCert.map((si, idx) => {
      const existing = existingMap.get(si.id);
      if (existing) {
        const autoRef = existing.itemRef || si.partNumber || "";
        return { ...existing, lineNumber: idx + 1, itemRef: autoRef };
      }
      const item = blankItem(idx + 1, si.id);
      item.itemRef = si.partNumber || "";
      return item;
    });

    const result: ICertificationItem[] = [];
    sectionItems.forEach((s) => result.push(s));
    autoItems.forEach((a) => result.push(a));
    manualItems.forEach((m) => result.push(m));
    return result;
  }, [scopeItems, certificationsBreakdown]);

  // ─── Local state with debounced save ───
  const [items, setItems] = React.useState<ICertificationItem[]>(builtItems);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditingRef = React.useRef(false);

  const debouncedSave = React.useCallback(
    (updated: ICertificationItem[]) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        saveTimerRef.current = null;
        onSave(updated);
      }, 400);
    },
    [onSave],
  );

  React.useEffect(() => {
    if (!isEditingRef.current && saveTimerRef.current === null) {
      setItems(builtItems);
    }
  }, [builtItems]);

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persist = React.useCallback(
    (updated: ICertificationItem[]) => {
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

  // ─── CRUD helpers ───
  const updateField = (
    id: string,
    field: keyof ICertificationItem,
    value: unknown,
  ): void => {
    isEditingRef.current = true;
    const updated = items.map((i) => {
      if (i.id !== id) return i;
      const patched = { ...i, [field]: value };
      if (field === "qty" || field === "unitCost") {
        patched.totalCost = (patched.qty || 0) * (patched.unitCost || 0);
      }
      return patched;
    });
    persist(updated);
    setTimeout(() => {
      isEditingRef.current = false;
    }, 500);
  };

  const addItem = (sectionId?: string | null): void => {
    persist([...items, blankItem(items.length + 1, undefined, sectionId)]);
  };

  const deleteItem = (id: string): void => {
    persist(items.filter((i) => i.id !== id));
  };

  const addSection = (): void => {
    persist([...items, blankSection()]);
  };

  const deleteSection = (id: string): void => {
    if (
      !window.confirm(
        "Delete this section? Items will be moved to unsectioned.",
      )
    )
      return;
    persist(
      items
        .filter((i) => i.id !== id)
        .map((i) => (i.sectionId === id ? { ...i, sectionId: null } : i)),
    );
  };

  const [editingSectionId, setEditingSectionId] = React.useState<string | null>(
    null,
  );
  const [colorPickerOpen, setColorPickerOpen] = React.useState<string | null>(
    null,
  );
  const [collapsedSections, setCollapsedSections] = React.useState<Set<string>>(
    new Set(),
  );

  const toggleSection = (id: string): void => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getScopeName = (scopeItemId: string | null): string => {
    if (!scopeItemId) return "";
    const si = (scopeItems || []).find((s) => s.id === scopeItemId);
    return si
      ? si.equipmentOffer || si.description || si.partNumber || "Scope Item"
      : "";
  };

  // ─── Attachment handling ───
  const fileInputRefs = React.useRef<Record<string, HTMLInputElement | null>>(
    {},
  );
  const [uploading, setUploading] = React.useState<string | null>(null);

  const handleFileUpload = async (
    itemId: string,
    file: File,
  ): Promise<void> => {
    if (!bidNumber) return;
    setUploading(itemId);
    try {
      const attachment = await AttachmentService.uploadFile(
        bidNumber,
        "Certifications",
        file,
      );
      const updated = items.map((i) => {
        if (i.id !== itemId) return i;
        return {
          ...i,
          attachments: [...(i.attachments || []), attachment],
        };
      });
      persist(updated);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(null);
    }
  };

  const removeAttachment = (itemId: string, attachmentId: string): void => {
    const updated = items.map((i) => {
      if (i.id !== itemId) return i;
      return {
        ...i,
        attachments: (i.attachments || []).filter((a) => a.id !== attachmentId),
      };
    });
    persist(updated);
  };

  // ─── Computed ───
  const sections = items.filter((i) => i.isSection);
  const dataItems = items.filter((i) => !i.isSection);
  const unsectionedItems = dataItems.filter((i) => !i.sectionId);
  const grandTotal = dataItems.reduce((sum, i) => sum + (i.totalCost || 0), 0);

  // ─── Row renderer ───
  const renderRow = (item: ICertificationItem): React.ReactNode => (
    <tr key={item.id}>
      <td className={styles.cellCenter}>{item.lineNumber}</td>
      <td className={item.scopeItemId ? styles.cellBold : undefined}>
        {getScopeName(item.scopeItemId) || "Manual"}
      </td>
      <td>
        {readOnly ? (
          item.itemRef || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.itemRef}
            onChange={(e) => updateField(item.id, "itemRef", e.target.value)}
            placeholder="OII/MFG PN"
          />
        )}
      </td>
      <td className={styles.cellCenter}>
        {readOnly ? (
          item.qty
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            value={item.qty}
            onChange={(e) =>
              updateField(item.id, "qty", Number(e.target.value) || 0)
            }
            style={{ width: 60 }}
          />
        )}
      </td>
      <td>
        {readOnly ? (
          item.expiryPeriod || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.expiryPeriod}
            onChange={(e) =>
              updateField(item.id, "expiryPeriod", e.target.value)
            }
            placeholder="e.g. 12 months"
          />
        )}
      </td>
      <td>
        {readOnly ? (
          item.originalCurrency
        ) : (
          <select
            className={styles.selectCell}
            value={item.originalCurrency}
            onChange={(e) =>
              updateField(item.id, "originalCurrency", e.target.value)
            }
          >
            {getCurrencies().map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        )}
      </td>
      <td className={styles.cellRight}>
        {readOnly ? (
          item.unitCost.toLocaleString()
        ) : (
          <input
            className={styles.numInput}
            type="number"
            min={0}
            step={0.01}
            value={item.unitCost}
            onChange={(e) =>
              updateField(item.id, "unitCost", Number(e.target.value) || 0)
            }
          />
        )}
      </td>
      <td className={`${styles.cellRight} ${styles.cellBold}`}>
        {((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}
      </td>
      <td>
        {readOnly ? (
          item.costReference || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.costReference || ""}
            onChange={(e) =>
              updateField(item.id, "costReference", e.target.value)
            }
            placeholder="Cost Ref"
          />
        )}
      </td>
      <td>
        {readOnly ? (
          item.notes || "—"
        ) : (
          <input
            className={styles.editInput}
            value={item.notes}
            onChange={(e) => updateField(item.id, "notes", e.target.value)}
          />
        )}
      </td>
      <td>
        <div className={styles.attachmentCell}>
          {(item.attachments || []).map((att) => (
            <span key={att.id} className={styles.attachmentChip}>
              <a
                href={att.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={att.fileName}
                className={styles.attachmentLink}
              >
                📎{" "}
                {att.fileName.length > 15
                  ? att.fileName.substring(0, 12) + "..."
                  : att.fileName}
              </a>
              {!readOnly && (
                <button
                  className={styles.attachmentRemove}
                  onClick={() => removeAttachment(item.id, att.id)}
                  title="Remove"
                >
                  ✕
                </button>
              )}
            </span>
          ))}
          {!readOnly && (
            <>
              <input
                type="file"
                ref={(el) => {
                  fileInputRefs.current[item.id] = el;
                }}
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(item.id, file);
                  e.target.value = "";
                }}
              />
              <button
                className={styles.attachmentBtn}
                onClick={() => fileInputRefs.current[item.id]?.click()}
                disabled={uploading === item.id}
                title="Attach file"
              >
                {uploading === item.id ? "⏳" : "📎+"}
              </button>
            </>
          )}
        </div>
      </td>
      {!readOnly && (
        <td>
          <button
            className={styles.deleteBtn}
            onClick={() => deleteItem(item.id)}
          >
            ✕
          </button>
        </td>
      )}
    </tr>
  );

  const COLS = readOnly ? 11 : 12;

  return (
    <div className={styles.container}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Certifications</span>
          <span className={styles.summaryValue}>{dataItems.length}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Cost</span>
          <span className={styles.summaryValue}>
            {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {!readOnly && (
        <div className={styles.toolbar}>
          <button className={styles.addBtn} onClick={() => addItem()}>
            + Add Item
          </button>
          <button className={styles.addBtn} onClick={addSection}>
            + Add Section
          </button>
        </div>
      )}

      {dataItems.length === 0 && sections.length === 0 ? (
        <div className={styles.empty}>
          No certifications needed. Mark items as &quot;Needs
          Certification&quot; in the Scope of Supply tab to auto-populate, or
          add items manually.
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Linked Scope Item</th>
                <th>Item Ref</th>
                <th>Qty</th>
                <th>Expiry Period</th>
                <th>Currency</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Cost Ref</th>
                <th>Notes</th>
                <th>Attachments</th>
                {!readOnly && <th />}
              </tr>
            </thead>
            <tbody>
              {unsectionedItems.map((item) => renderRow(item))}
              {sections.map((sec) => {
                const sItems = dataItems.filter((i) => i.sectionId === sec.id);
                const isCollapsed = collapsedSections.has(sec.id);
                const isEditing = editingSectionId === sec.id;
                const sColor = sec.sectionColor || "";
                return (
                  <React.Fragment key={sec.id}>
                    <tr
                      className={styles.sectionRow}
                      style={
                        sColor
                          ? {
                              background: `${sColor}15`,
                              borderBottom: `2px solid ${sColor}`,
                            }
                          : undefined
                      }
                    >
                      <td colSpan={COLS}>
                        <div
                          className={styles.sectionHeader}
                          onClick={() => toggleSection(sec.id)}
                        >
                          <span
                            className={`${styles.chevron} ${isCollapsed ? styles.chevronCollapsed : ""}`}
                            style={sColor ? { color: sColor } : undefined}
                          >
                            ▼
                          </span>
                          {isEditing && !readOnly ? (
                            <input
                              value={sec.sectionTitle || ""}
                              autoFocus
                              className={styles.sectionTitleInput}
                              onChange={(e) =>
                                updateField(
                                  sec.id,
                                  "sectionTitle",
                                  e.target.value,
                                )
                              }
                              onBlur={() => setEditingSectionId(null)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter")
                                  setEditingSectionId(null);
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span
                              className={styles.sectionTitle}
                              style={sColor ? { color: sColor } : undefined}
                              onDoubleClick={() =>
                                !readOnly && setEditingSectionId(sec.id)
                              }
                            >
                              {sec.sectionTitle || "Untitled Section"}
                            </span>
                          )}
                          <span className={styles.sectionBadge}>
                            ({sItems.length} items)
                          </span>
                          {!readOnly && (
                            <div
                              className={styles.sectionActions}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                className={styles.sectionActionBtn}
                                onClick={() => addItem(sec.id)}
                              >
                                + Item
                              </button>
                              <div
                                style={{
                                  position: "relative",
                                  display: "inline-flex",
                                }}
                              >
                                <button
                                  className={styles.sectionActionBtn}
                                  style={{
                                    background: sColor || "transparent",
                                    color: sColor
                                      ? "#fff"
                                      : "var(--text-secondary)",
                                  }}
                                  onClick={() =>
                                    setColorPickerOpen(
                                      colorPickerOpen === sec.id
                                        ? null
                                        : sec.id,
                                    )
                                  }
                                >
                                  🎨
                                </button>
                                {colorPickerOpen === sec.id && (
                                  <>
                                    <div
                                      style={{
                                        position: "fixed",
                                        inset: 0,
                                        zIndex: 99,
                                      }}
                                      onClick={() => setColorPickerOpen(null)}
                                    />
                                    <div className={styles.colorPicker}>
                                      {SECTION_COLORS.map((c) => (
                                        <button
                                          key={c || "default"}
                                          onClick={() => {
                                            updateField(
                                              sec.id,
                                              "sectionColor",
                                              c,
                                            );
                                            setColorPickerOpen(null);
                                          }}
                                          className={styles.colorSwatch}
                                          style={{
                                            background:
                                              c ||
                                              "var(--accent-color, #14b8a6)",
                                            border:
                                              (c || "") === (sColor || "")
                                                ? "2px solid #fff"
                                                : "2px solid transparent",
                                            boxShadow:
                                              (c || "") === (sColor || "")
                                                ? "0 0 0 2px var(--accent-color)"
                                                : "none",
                                          }}
                                        />
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                              <button
                                className={styles.sectionActionBtn}
                                style={{ color: "#EF4444" }}
                                onClick={() => deleteSection(sec.id)}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    {!isCollapsed && sItems.map((item) => renderRow(item))}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
          <div className={styles.totalBar}>
            <span>Total: {grandTotal.toLocaleString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
