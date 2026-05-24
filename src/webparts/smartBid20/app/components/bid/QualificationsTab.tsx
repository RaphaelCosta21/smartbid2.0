import * as React from "react";
import {
  IBid,
  IClarificationItem,
  IQualificationTable,
  IQualificationItem,
} from "../../models";
import { GlassCard } from "../common/GlassCard";
import { EditToolbar } from "../common/EditLockBanner";
import { EmptySection } from "./EmptySection";
import { ExportClarificationModal } from "./ExportClarificationModal";
import { useEditControl } from "../../hooks/useEditControl";
import { makeId } from "../../utils/idGenerator";
import styles from "../../pages/BidDetailPage.module.scss";

export interface QualificationsTabProps {
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
}

export const QualificationsTab: React.FC<QualificationsTabProps> = ({
  bid,
  canEdit,
  onSave,
}) => {
  const tables = bid.qualificationTables || [];
  const clarifications = bid.clarifications || [];
  const scopeItems = bid.scopeItems || [];

  // Export modal state
  const [exportModalOpen, setExportModalOpen] = React.useState(false);

  // Edit lock hooks — separate locks for Qualifications and Clarifications
  const qualLock = useEditControl(bid.bidNumber, "qualifications");
  const clarLock = useEditControl(bid.bidNumber, "clarifications");
  const canEditQual = !!canEdit && qualLock.isEditing;
  const canEditClar = !!canEdit && clarLock.isEditing;

  // Auto-import clarifications from scope items with compliance === "no"
  const autoImported = React.useMemo(() => {
    const nonCompliant = scopeItems.filter(
      (s) => !s.isSection && s.compliance === "no",
    );
    const existingIds = new Set(
      clarifications.filter((c) => c.isAutoImported).map((c) => c.scopeItemId),
    );
    const newAuto: IClarificationItem[] = [];
    nonCompliant.forEach((si) => {
      if (!existingIds.has(si.id)) {
        newAuto.push({
          id: makeId("q"),
          scopeItemId: si.id,
          item: si.clientDocRef || `#${si.lineNumber}`,
          description: si.description,
          clarification: "",
          clientResponse: "",
          isAutoImported: true,
          createdDate: new Date().toISOString(),
        });
      }
    });
    return newAuto;
  }, [scopeItems, clarifications]);

  const allClarifications = React.useMemo(() => {
    // Merge existing + auto-imported (dedupe by scopeItemId)
    const merged = [...clarifications];
    autoImported.forEach((a) => {
      if (
        !merged.some((m) => m.isAutoImported && m.scopeItemId === a.scopeItemId)
      ) {
        merged.push(a);
      }
    });
    // Remove auto-imported entries whose scope item is no longer compliance="no"
    const nonCompliantIds = new Set(
      scopeItems
        .filter((s) => !s.isSection && s.compliance === "no")
        .map((s) => s.id),
    );
    return merged.filter(
      (c) => !c.isAutoImported || nonCompliantIds.has(c.scopeItemId || ""),
    );
  }, [clarifications, autoImported, scopeItems]);

  // ─── Local state to prevent input lag ───
  const [localTables, setLocalTables] =
    React.useState<IQualificationTable[]>(tables);
  const [localClarifications, setLocalClarifications] =
    React.useState<IClarificationItem[]>(allClarifications);

  // ─── Debounced save to prevent input lag ───
  const clarTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const qualTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditingRef = React.useRef(false);

  // Sync external changes when NOT actively editing
  React.useEffect(() => {
    if (!isEditingRef.current && !qualTimerRef.current) {
      setLocalTables(tables);
    }
  }, [tables]);

  React.useEffect(() => {
    if (!isEditingRef.current && !clarTimerRef.current) {
      setLocalClarifications(allClarifications);
    }
  }, [allClarifications]);

  const debouncedSaveClar = React.useCallback(
    (updated: IClarificationItem[]) => {
      if (clarTimerRef.current) clearTimeout(clarTimerRef.current);
      clarTimerRef.current = setTimeout(() => {
        clarTimerRef.current = null;
        if (onSave) onSave({ clarifications: updated });
      }, 400);
    },
    [onSave],
  );
  const debouncedSaveQual = React.useCallback(
    (updated: IQualificationTable[]) => {
      if (qualTimerRef.current) clearTimeout(qualTimerRef.current);
      qualTimerRef.current = setTimeout(() => {
        qualTimerRef.current = null;
        if (onSave) onSave({ qualificationTables: updated });
      }, 400);
    },
    [onSave],
  );

  React.useEffect(() => {
    return () => {
      if (clarTimerRef.current) clearTimeout(clarTimerRef.current);
      if (qualTimerRef.current) clearTimeout(qualTimerRef.current);
    };
  }, []);

  // Persist clarifications
  const saveClarifications = (updated: IClarificationItem[]): void => {
    setLocalClarifications(updated);
    if (!onSave) return;
    debouncedSaveClar(updated);
  };

  const addClarification = (): void => {
    saveClarifications([
      ...localClarifications,
      {
        id: makeId("q"),
        scopeItemId: null,
        item: "",
        description: "",
        clarification: "",
        clientResponse: "",
        isAutoImported: false,
        createdDate: new Date().toISOString(),
      },
    ]);
  };

  const updateClarification = (
    id: string,
    field: keyof IClarificationItem,
    value: string,
  ): void => {
    isEditingRef.current = true;
    saveClarifications(
      localClarifications.map((c) => {
        if (c.id !== id) return c;
        const updated = { ...c, [field]: value };
        // Auto-set responseDate when clientResponse is first filled
        if (field === "clientResponse" && value && !c.responseDate) {
          updated.responseDate = new Date().toISOString();
        }
        // Clear responseDate if clientResponse is emptied
        if (field === "clientResponse" && !value) {
          updated.responseDate = undefined;
        }
        return updated;
      }),
    );
    setTimeout(() => {
      isEditingRef.current = false;
    }, 500);
  };

  const deleteClarification = (id: string): void => {
    saveClarifications(localClarifications.filter((c) => c.id !== id));
  };

  // Qualification tables
  const saveQualTables = (updated: IQualificationTable[]): void => {
    setLocalTables(updated);
    if (!onSave) return;
    debouncedSaveQual(updated);
  };

  const addTable = (): void => {
    saveQualTables([
      ...localTables,
      { id: makeId("q"), title: "New Qualification Table", items: [] },
    ]);
  };

  const updateTableTitle = (tableId: string, title: string): void => {
    saveQualTables(
      localTables.map((t) => (t.id === tableId ? { ...t, title } : t)),
    );
  };

  const deleteTable = (tableId: string): void => {
    saveQualTables(localTables.filter((t) => t.id !== tableId));
  };

  const addQualItem = (tableId: string): void => {
    saveQualTables(
      localTables.map((t) => {
        if (t.id !== tableId) return t;
        const nextItem =
          (t.items.length > 0 ? Math.max(...t.items.map((i) => i.item)) : 0) +
          1;
        return {
          ...t,
          items: [
            ...t.items,
            { id: makeId("q"), item: nextItem, description: "", comments: "" },
          ],
        };
      }),
    );
  };

  const updateQualItem = (
    tableId: string,
    itemId: string,
    field: keyof IQualificationItem,
    value: unknown,
  ): void => {
    isEditingRef.current = true;
    saveQualTables(
      localTables.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          items: t.items.map((i) =>
            i.id === itemId ? { ...i, [field]: value } : i,
          ),
        };
      }),
    );
    setTimeout(() => {
      isEditingRef.current = false;
    }, 500);
  };

  const deleteQualItem = (tableId: string, itemId: string): void => {
    saveQualTables(
      localTables.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, items: t.items.filter((i) => i.id !== itemId) };
      }),
    );
  };

  return (
    <div className={styles.flexColumn}>
      {/* ─── Qualifications ─── */}
      <GlassCard title="Qualifications">
        {canEdit && (
          <EditToolbar
            editControl={qualLock}
            canEdit={!!canEdit}
            label="Qualifications"
          />
        )}
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}
        >
          Qualification tables for client / vessel owner requirements.
        </p>
        {localTables.length === 0 && (
          <EmptySection message="No qualification tables yet." />
        )}
        {localTables.map((table) => (
          <div
            key={table.id}
            className={styles.infoSection}
            style={{ marginBottom: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {canEditQual ? (
                <input
                  value={table.title}
                  onChange={(e) => updateTableTitle(table.id, e.target.value)}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "4px 8px",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "var(--card-bg-elevated)",
                    color: "var(--text-primary)",
                    flex: 1,
                    marginRight: 8,
                  }}
                />
              ) : (
                <h4
                  className={styles.infoTitle}
                  style={{ marginBottom: 0, borderBottom: "none" }}
                >
                  {table.title}
                </h4>
              )}
              {canEditQual && (
                <button
                  className={styles.backBtn}
                  style={{ color: "var(--error-color, #EF4444)", fontSize: 12 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete table "${table.title}"? This cannot be undone.`,
                      )
                    )
                      deleteTable(table.id);
                  }}
                >
                  Remove Table
                </button>
              )}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      width: 50,
                      color: "var(--text-secondary)",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Comments
                  </th>
                  {canEditQual && (
                    <th
                      style={{
                        width: 40,
                        borderBottom: "1px solid var(--border)",
                      }}
                    />
                  )}
                </tr>
              </thead>
              <tbody>
                {table.items.map((qi) => (
                  <tr key={qi.id}>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        fontWeight: 600,
                      }}
                    >
                      {qi.item}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditQual ? (
                        <input
                          value={qi.description}
                          onChange={(e) =>
                            updateQualItem(
                              table.id,
                              qi.id,
                              "description",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        qi.description || "—"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditQual ? (
                        <input
                          value={qi.comments}
                          onChange={(e) =>
                            updateQualItem(
                              table.id,
                              qi.id,
                              "comments",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        qi.comments || "—"
                      )}
                    </td>
                    {canEditQual && (
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid var(--border)",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--error-color, #EF4444)",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                          onClick={() => deleteQualItem(table.id, qi.id)}
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {canEditQual && (
              <button
                className={styles.backBtn}
                style={{ marginTop: 8, fontSize: 12 }}
                onClick={() => addQualItem(table.id)}
              >
                + Add Item
              </button>
            )}
          </div>
        ))}
        {canEditQual && (
          <button
            className={styles.backBtn}
            style={{
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
              marginTop: 8,
            }}
            onClick={addTable}
          >
            + Add Qualification Table
          </button>
        )}
      </GlassCard>

      {/* ─── Clarifications ─── */}
      <GlassCard title="Clarifications">
        {canEdit && (
          <EditToolbar
            editControl={clarLock}
            canEdit={!!canEdit}
            label="Clarifications"
          />
        )}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Items with Compliance = &quot;No&quot; are auto-imported. You can
            also add manual entries.
          </p>
          {localClarifications.length > 0 && (
            <button
              onClick={() => setExportModalOpen(true)}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s ease",
              }}
            >
              📥 Export Excel
            </button>
          )}
        </div>
        {localClarifications.length === 0 ? (
          <EmptySection message="No clarifications needed." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
                minWidth: 900,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      width: 30,
                    }}
                  >
                    #
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Client Doc Ref
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Clarification / Qualification
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Client Response
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      width: 90,
                    }}
                  >
                    Created
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      width: 90,
                    }}
                  >
                    Responded
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "center",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                      width: 60,
                    }}
                  >
                    Source
                  </th>
                  {canEditClar && (
                    <th
                      style={{
                        width: 40,
                        borderBottom: "1px solid var(--border)",
                      }}
                    />
                  )}
                </tr>
              </thead>
              <tbody>
                {localClarifications.map((c, idx) => (
                  <tr key={c.id}>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        fontWeight: 600,
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditClar && !c.isAutoImported ? (
                        <input
                          value={c.item}
                          onChange={(e) =>
                            updateClarification(c.id, "item", e.target.value)
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontStyle: c.isAutoImported ? "italic" : undefined,
                            color: c.isAutoImported
                              ? "var(--text-secondary)"
                              : undefined,
                          }}
                        >
                          {c.item || "—"}
                        </span>
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditClar ? (
                        <input
                          value={c.description}
                          onChange={(e) =>
                            updateClarification(
                              c.id,
                              "description",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        c.description || "—"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditClar ? (
                        <input
                          value={c.clarification}
                          onChange={(e) =>
                            updateClarification(
                              c.id,
                              "clarification",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        c.clarification || "—"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEditClar ? (
                        <input
                          value={c.clientResponse}
                          onChange={(e) =>
                            updateClarification(
                              c.id,
                              "clientResponse",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        c.clientResponse || "—"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "center",
                        fontSize: 11,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {c.createdDate
                        ? new Date(c.createdDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "center",
                        fontSize: 11,
                        color: c.responseDate
                          ? "var(--success-color, #10b981)"
                          : "var(--text-secondary)",
                      }}
                    >
                      {c.responseDate
                        ? new Date(c.responseDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "center",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background: c.isAutoImported
                            ? "rgba(234, 179, 8, 0.15)"
                            : "rgba(59, 130, 246, 0.15)",
                          color: c.isAutoImported
                            ? "var(--warning-color, #EAB308)"
                            : "var(--primary-accent)",
                        }}
                      >
                        {c.isAutoImported ? "Auto" : "Manual"}
                      </span>
                    </td>
                    {canEditClar && (
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid var(--border)",
                          textAlign: "center",
                        }}
                      >
                        {!c.isAutoImported && (
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "var(--error-color, #EF4444)",
                              cursor: "pointer",
                              fontSize: 14,
                            }}
                            onClick={() => deleteClarification(c.id)}
                          >
                            ✕
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {canEditClar && (
          <button
            className={styles.backBtn}
            style={{
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
              marginTop: 12,
            }}
            onClick={addClarification}
          >
            + Add Clarification
          </button>
        )}
      </GlassCard>

      {/* Export Modal */}
      <ExportClarificationModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        bid={bid}
        clarifications={localClarifications}
      />
    </div>
  );
};
