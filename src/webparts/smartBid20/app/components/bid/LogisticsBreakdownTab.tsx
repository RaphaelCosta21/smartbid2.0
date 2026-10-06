import * as React from "react";
import { TriangleAlert, Truck } from "lucide-react";
import { ILogisticsItem } from "../../models";
import { makeId } from "../../utils/idGenerator";
import { getCurrencies } from "../../utils/currencyHelpers";
import {
  IBidFx,
  calculateMultiCurrencyTotals,
  toUSDWithBidRates,
} from "../../utils/costCalculations";
import { formatCurrency } from "../../utils/formatters";
import { BidFxNote, UsdAmountCell } from "./BidFxNote";
import {
  BidTabHeader,
  HeaderChip,
  IHeaderStat,
  IShareSegment,
  ShareBar,
} from "./BidTabHeader";
import styles from "./BreakdownTab.module.scss";

interface LogisticsBreakdownTabProps {
  logisticsBreakdown: ILogisticsItem[];
  fx: IBidFx;
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
  fx,
  onSave,
  readOnly = false,
}) => {
  const [items, setItems] = React.useState<ILogisticsItem[]>(
    logisticsBreakdown || [],
  );

  // Debounced save to prevent input lag
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const isEditingRef = React.useRef(false);

  const debouncedSave = React.useCallback(
    (updated: ILogisticsItem[]) => {
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
      setItems(logisticsBreakdown || []);
    }
  }, [logisticsBreakdown]);

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const persist = React.useCallback(
    (updated: ILogisticsItem[]) => {
      const renumbered = updated.map((item, idx) => ({
        ...item,
        lineNumber: idx + 1,
      }));
      setItems(renumbered);
      debouncedSave(renumbered);
    },
    [debouncedSave],
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
    isEditingRef.current = true;
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
    setTimeout(() => {
      isEditingRef.current = false;
    }, 500);
  };

  const totals = calculateMultiCurrencyTotals(items, fx);

  const header = React.useMemo(() => {
    const byCurrency: Record<string, number> = {};
    const currencies: string[] = [];
    let top: { label: string; usd: number } | null = null;
    let withoutCost = 0;
    items.forEach((i) => {
      const cur = (i.originalCurrency || "USD").toUpperCase();
      if (currencies.indexOf(cur) < 0) currencies.push(cur);
      if (!(i.totalCost > 0)) withoutCost++;
      const usd = toUSDWithBidRates(i.totalCost || 0, cur, fx);
      if (usd === null) return;
      byCurrency[cur] = (byCurrency[cur] || 0) + usd;
      if (usd > 0 && (top === null || usd > top.usd)) {
        top = {
          label: i.item || i.description || `Item #${i.lineNumber}`,
          usd,
        };
      }
    });
    const largest = top as { label: string; usd: number } | null;
    const stats: IHeaderStat[] = [
      { label: "Currencies", value: currencies.join(", ") || "-" },
      {
        label: "Largest item",
        value: largest ? formatCurrency(largest.usd) : "-",
        sub: largest ? largest.label : undefined,
      },
    ];
    const currencySegments: IShareSegment[] = Object.keys(byCurrency)
      .map((c) => ({ label: c, value: byCurrency[c] }))
      .sort((a, b) => b.value - a.value);
    return { stats, currencySegments, withoutCost };
  }, [items, fx]);

  return (
    <div className={styles.container}>
      <BidTabHeader
        title="Logistics"
        subtitle="Freight and transport costs"
        icon={<Truck size={18} />}
        hero={{
          label: "Total cost (USD)",
          value: formatCurrency(totals.totalUSD),
          sub: `${items.length} item${items.length !== 1 ? "s" : ""}`,
        }}
        stats={header.stats}
        footer={
          <>
            <BidFxNote
              fx={fx}
              currencies={items.map((i) => i.originalCurrency)}
            />
            {header.withoutCost > 0 && (
              <HeaderChip tone="warning" icon={<TriangleAlert size={13} />}>
                {header.withoutCost} item{header.withoutCost !== 1 ? "s" : ""}{" "}
                without cost
              </HeaderChip>
            )}
          </>
        }
      >
        {header.currencySegments.length > 1 && (
          <ShareBar
            title="By original currency (USD)"
            segments={header.currencySegments}
            format={formatCurrency}
          />
        )}
      </BidTabHeader>

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
                <th>Total (USD)</th>
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
                      item.item || "-"
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
                      item.description || "-"
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
                  <UsdAmountCell
                    className={styles.cellRight}
                    amount={(item.qty || 0) * (item.unitCost || 0)}
                    currency={item.originalCurrency}
                    fx={fx}
                  />
                  <td>
                    {readOnly ? (
                      item.notes || "-"
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
            <span>Total (USD): {formatCurrency(totals.totalUSD)}</span>
          </div>
        </div>
      )}
    </div>
  );
};
