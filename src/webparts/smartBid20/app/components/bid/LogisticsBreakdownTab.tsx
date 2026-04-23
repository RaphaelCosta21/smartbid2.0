import * as React from "react";
import { ILogisticsItem } from "../../models";
import { makeId } from "../../utils/idGenerator";
import { getCurrencies } from "../../utils/currencyHelpers";
import styles from "./BreakdownTab.module.scss";

interface LogisticsBreakdownTabProps {
  logisticsBreakdown: ILogisticsItem[];
  onSave: (items: ILogisticsItem[]) => void;
  readOnly?: boolean;
}

const blankItem = (lineNumber: number): ILogisticsItem => ({
  id: makeId("log"),
  lineNumber,
  item: "",
  description: "",
  originalCurrency: "BRL",
  qty: 1,
  unitCost: 0,
  totalCost: 0,
  notes: "",
});

export const LogisticsBreakdownTab: React.FC<LogisticsBreakdownTabProps> = ({
  logisticsBreakdown,
  onSave,
  readOnly = false,
}) => {
  const [items, setItems] = React.useState<ILogisticsItem[]>(
    logisticsBreakdown || [],
  );

  React.useEffect(() => {
    setItems(logisticsBreakdown || []);
  }, [logisticsBreakdown]);

  const persist = React.useCallback(
    (updated: ILogisticsItem[]) => {
      const renumbered = updated.map((item, idx) => ({
        ...item,
        lineNumber: idx + 1,
      }));
      setItems(renumbered);
      onSave(renumbered);
    },
    [onSave],
  );

  const addItem = (): void => {
    persist([...items, blankItem(items.length + 1)]);
  };

  const deleteItem = (id: string): void => {
    persist(items.filter((i) => i.id !== id));
  };

  const updateField = (
    id: string,
    field: keyof ILogisticsItem,
    value: unknown,
  ): void => {
    const updated = items.map((i) => {
      if (i.id !== id) return i;
      const patched = { ...i, [field]: value };
      // Auto-calc total
      if (field === "qty" || field === "unitCost") {
        patched.totalCost = (patched.qty || 0) * (patched.unitCost || 0);
      }
      return patched;
    });
    persist(updated);
  };

  const grandTotal = items.reduce((sum, i) => sum + (i.totalCost || 0), 0);

  return (
    <div className={styles.container}>
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <span className={styles.summaryLabel}>Items</span>
          <span className={styles.summaryValue}>{items.length}</span>
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
          <button className={styles.addBtn} onClick={addItem}>
            + Add Logistics Item
          </button>
        </div>
      )}

      {items.length === 0 ? (
        <div className={styles.empty}>No logistics items yet.</div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>Description</th>
                <th>Currency</th>
                <th>Qty</th>
                <th>Unit Cost</th>
                <th>Total Cost</th>
                <th>Notes</th>
                {!readOnly && <th />}
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td className={styles.cellCenter}>{item.lineNumber}</td>
                  <td>
                    {readOnly ? (
                      item.item || "—"
                    ) : (
                      <input
                        className={styles.editInput}
                        value={item.item}
                        onChange={(e) =>
                          updateField(item.id, "item", e.target.value)
                        }
                      />
                    )}
                  </td>
                  <td>
                    {readOnly ? (
                      item.description || "—"
                    ) : (
                      <input
                        className={styles.editInput}
                        value={item.description}
                        onChange={(e) =>
                          updateField(item.id, "description", e.target.value)
                        }
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
