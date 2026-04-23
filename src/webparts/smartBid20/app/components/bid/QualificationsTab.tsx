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
          item: si.equipmentOffer || si.partNumber || `#${si.lineNumber}`,
          description: si.description,
          clarification: "",
          clientResponse: "",
          isAutoImported: true,
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

  // Persist clarifications
  const saveClarifications = (updated: IClarificationItem[]): void => {
    if (!onSave) return;
    onSave({ clarifications: updated });
  };

  const addClarification = (): void => {
    saveClarifications([
      ...allClarifications,
      {
        id: makeId("q"),
        scopeItemId: null,
        item: "",
        description: "",
        clarification: "",
        clientResponse: "",
        isAutoImported: false,
      },
    ]);
  };

  const updateClarification = (
    id: string,
    field: keyof IClarificationItem,
    value: string,
  ): void => {
    saveClarifications(
      allClarifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    );
  };

  const deleteClarification = (id: string): void => {
    saveClarifications(allClarifications.filter((c) => c.id !== id));
  };

  // Qualification tables
  const saveQualTables = (updated: IQualificationTable[]): void => {
    if (!onSave) return;
    onSave({ qualificationTables: updated });
  };

  const addTable = (): void => {
    saveQualTables([
      ...tables,
      { id: makeId("q"), title: "New Qualification Table", items: [] },
    ]);
  };

  const updateTableTitle = (tableId: string, title: string): void => {
    saveQualTables(tables.map((t) => (t.id === tableId ? { ...t, title } : t)));
  };

  const deleteTable = (tableId: string): void => {
    saveQualTables(tables.filter((t) => t.id !== tableId));
  };

  const addQualItem = (tableId: string): void => {
    saveQualTables(
      tables.map((t) => {
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
    saveQualTables(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          items: t.items.map((i) =>
            i.id === itemId ? { ...i, [field]: value } : i,
          ),
        };
      }),
    );
  };

  const deleteQualItem = (tableId: string, itemId: string): void => {
    saveQualTables(
      tables.map((t) => {
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
        {tables.length === 0 && (
          <EmptySection message="No qualification tables yet." />
        )}
        {tables.map((table) => (
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
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}
        >
          Items with Compliance = &quot;No&quot; are auto-imported. You can also
          add manual entries.
        </p>
        {allClarifications.length === 0 ? (
          <EmptySection message="No clarifications needed." />
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
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
              {allClarifications.map((c, idx) => (
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
                    {canEditClar && !c.isAutoImported ? (
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
    </div>
  );
};
