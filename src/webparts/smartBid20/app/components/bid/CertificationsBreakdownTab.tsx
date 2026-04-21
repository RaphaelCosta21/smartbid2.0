import * as React from "react";
import { IScopeItem, ICertificationItem } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import styles from "./BreakdownTab.module.scss";

interface CertificationsBreakdownTabProps {
  scopeItems: IScopeItem[];
  certificationsBreakdown: ICertificationItem[];
  onSave: (items: ICertificationItem[]) => void;
  readOnly?: boolean;
}

const makeId = (): string =>
  `cert-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const blankItem = (
  lineNumber: number,
  scopeItemId?: string,
): ICertificationItem => ({
  id: makeId(),
  lineNumber,
  scopeItemId: scopeItemId || null,
  itemRef: "",
  qty: 1,
  expiryPeriod: "",
  unitCost: 0,
  totalCost: 0,
  originalCurrency: "USD",
  notes: "",
});

function getCurrencies(): string[] {
  const cfg = useConfigStore.getState().config;
  const rates = cfg?.currencySettings?.exchangeRates;
  if (rates && rates.length > 0) {
    const list = [cfg.currencySettings.defaultCurrency || "USD"];
    rates.forEach((r: any) => {
      if (list.indexOf(r.currency) < 0) list.push(r.currency);
    });
    return list;
  }
  return ["USD", "BRL", "EUR", "GBP", "NOK"];
}

export const CertificationsBreakdownTab: React.FC<
  CertificationsBreakdownTabProps
> = ({ scopeItems, certificationsBreakdown, onSave, readOnly = false }) => {
  // Build items purely from scope items needing certification
  const items = React.useMemo(() => {
    const needsCert = (scopeItems || []).filter(
      (s) => !s.isSection && s.needsCertification,
    );
    const existingMap = new Map(
      (certificationsBreakdown || []).map((c) => [c.scopeItemId, c]),
    );

    return needsCert.map((si, idx) => {
      const existing = existingMap.get(si.id);
      if (existing) {
        return { ...existing, lineNumber: idx + 1 };
      }
      return blankItem(idx + 1, si.id);
    });
  }, [scopeItems, certificationsBreakdown]);

  // Persist only editable field changes
  const persist = React.useCallback(
    (updated: ICertificationItem[]) => {
      const renumbered = updated.map((item, idx) => ({
        ...item,
        lineNumber: idx + 1,
      }));
      onSave(renumbered);
    },
    [onSave],
  );

  const updateField = (
    id: string,
    field: keyof ICertificationItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== id) return i;
      const patched = { ...i, [field]: value };
      if (field === "qty" || field === "unitCost") {
        patched.totalCost = (patched.qty || 0) * (patched.unitCost || 0);
      }
      return patched;
    });
    persist(updated);
  };

  const getScopeName = (scopeItemId: string | null): string => {
    if (!scopeItemId) return "";
    const si = (scopeItems || []).find((s) => s.id === scopeItemId);
    return si
      ? si.equipmentOffer || si.description || si.oiiPartNumber || "Scope Item"
      : "";
  };

  const grandTotal = items.reduce((sum, i) => sum + (i.totalCost || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Certifications</span>
          <span className={styles.summaryValue}>{items.length}</span>
        </div>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Total Cost</span>
          <span className={styles.summaryValue}>
            {grandTotal.toLocaleString()}
          </span>
        </div>
      </div>

      {items.length === 0 ? (
        <div className={styles.empty}>
          No certifications needed. Mark items as &quot;Needs
          Certification&quot; in the Scope of Supply tab to auto-populate.
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
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.cellCenter}>{item.lineNumber}</td>
                  <td
                    className={item.scopeItemId ? styles.cellBold : undefined}
                  >
                    {getScopeName(item.scopeItemId) || "Manual"}
                  </td>
                  <td>
                    {readOnly ? (
                      item.itemRef || "—"
                    ) : (
                      <input
                        className={styles.editInput}
                        value={item.itemRef}
                        onChange={(e) =>
                          updateField(item.id, "itemRef", e.target.value)
                        }
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
                          updateField(
                            item.id,
                            "qty",
                            Number(e.target.value) || 0,
                          )
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
                          updateField(
                            item.id,
                            "originalCurrency",
                            e.target.value,
                          )
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
                          updateField(
                            item.id,
                            "unitCost",
                            Number(e.target.value) || 0,
                          )
                        }
                      />
                    )}
                  </td>
                  <td className={`${styles.cellRight} ${styles.cellBold}`}>
                    {((item.qty || 0) * (item.unitCost || 0)).toLocaleString()}
                  </td>
                  <td>
                    {readOnly ? (
                      item.notes || "—"
                    ) : (
                      <input
                        className={styles.editInput}
                        value={item.notes}
                        onChange={(e) =>
                          updateField(item.id, "notes", e.target.value)
                        }
                      />
                    )}
                  </td>
                </tr>
              ))}
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
