/**
 * BomWorkshopPanel - Workshop hours and cost to assemble and test one unit of the
 * BOM main item. Imported into BIDs as an Onshore hours line + a Services & Fees row.
 */
import * as React from "react";
import { Info, Wrench } from "lucide-react";
import { IBomWorkshop, IConfigOption } from "../../models";
import { useConfigStore } from "../../stores/useConfigStore";
import { formatCurrency, formatHours } from "../../utils/formatters";
import { hasWorkshop } from "../../utils/bomCostHelpers";
import { SegmentedControl } from "../insights/SegmentedControl";
import styles from "./BomWorkshopPanel.module.scss";

export interface IBomWorkshopPanelProps {
  workshop: IBomWorkshop;
  mainPartNumber: string;
  readOnly?: boolean;
  onChange: (patch: Partial<IBomWorkshop>) => void;
}

const num = (v: string): number => Math.max(0, parseFloat(v) || 0);

/** Active options, keeping a saved value that was deactivated/removed later */
function activeOptions(
  list: IConfigOption[] | undefined,
  current: string | undefined,
): IConfigOption[] {
  const out = (list || []).filter((o) => o.isActive !== false);
  if (current && !out.some((o) => o.value === current)) {
    out.push({ id: `saved-${current}`, label: current, value: current });
  }
  return out;
}

export const BomWorkshopPanel: React.FC<IBomWorkshopPanelProps> = ({
  workshop,
  mainPartNumber,
  readOnly,
  onChange,
}) => {
  const config = useConfigStore((s) => s.config);
  const functions = activeOptions(config?.jobFunctions, workshop.jobFunction);
  const phases = activeOptions(config?.hoursPhases, workshop.phase);
  const functionGroups: Record<string, IConfigOption[]> = {};
  functions.forEach((f) => {
    const cat = (f.category as string) || "General";
    if (!functionGroups[cat]) functionGroups[cat] = [];
    functionGroups[cat].push(f);
  });

  const filled = hasWorkshop(workshop);
  if (readOnly && !filled) return null;

  const showConversion = workshop.currency === "BRL" && workshop.cost > 0;

  return (
    <section className={styles.panel} aria-label="Workshop assembly and test">
      <div className={styles.header}>
        <span className={styles.icon}>
          <Wrench size={16} />
        </span>
        <div className={styles.titleWrap}>
          <h3 className={styles.title}>Workshop - Assembly &amp; Test</h3>
          <span className={styles.subtitle}>
            Hours and cost to assemble and test one unit of{" "}
            {mainPartNumber || "the main item"}. The cost is added to the BOM
            Total Cost.
          </span>
        </div>
        {filled && (
          <div className={styles.total}>
            <span className={styles.totalValue}>
              {formatCurrency(workshop.costUSD || 0, "USD")}
            </span>
            <span className={styles.totalSub}>
              {formatHours(workshop.hours || 0)} per unit
            </span>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        <label className={styles.field}>
          <span className={styles.label}>Hours (per unit)</span>
          {readOnly ? (
            <span className={styles.value}>
              {workshop.hours > 0 ? formatHours(workshop.hours) : "-"}
            </span>
          ) : (
            <input
              type="number"
              className={`${styles.input} ${styles.inputNum}`}
              min={0}
              step={0.5}
              placeholder="0"
              value={workshop.hours || ""}
              onChange={(e) => onChange({ hours: num(e.target.value) })}
            />
          )}
        </label>

        <div className={styles.field}>
          <span className={styles.label}>Cost (per unit)</span>
          {readOnly ? (
            <span className={styles.value}>
              {workshop.cost > 0
                ? formatCurrency(workshop.cost, workshop.currency)
                : "-"}
            </span>
          ) : (
            <div className={styles.costRow}>
              <input
                type="number"
                className={`${styles.input} ${styles.inputNum}`}
                min={0}
                step={0.01}
                placeholder="0.00"
                value={workshop.cost || ""}
                onChange={(e) => onChange({ cost: num(e.target.value) })}
                aria-label="Workshop cost per unit"
              />
              <SegmentedControl<"BRL" | "USD">
                size="sm"
                value={workshop.currency}
                segments={[
                  { value: "BRL", label: "BRL", title: "Brazilian Real" },
                  { value: "USD", label: "USD", title: "US Dollar" },
                ]}
                onChange={(currency) => onChange({ currency })}
                ariaLabel="Workshop cost currency"
              />
            </div>
          )}
          {showConversion &&
            (workshop.rateUsed ? (
              <span className={styles.conv}>
                ≈ {formatCurrency(workshop.costUSD || 0, "USD")} at{" "}
                {workshop.rateUsed} BRL / USD (system rate)
              </span>
            ) : (
              <span className={styles.convWarn}>
                No BRL rate in System Configuration - the cost is not converted
                to USD
              </span>
            ))}
        </div>

        <label className={styles.field}>
          <span className={styles.label}>Function</span>
          {readOnly ? (
            <span className={styles.value}>{workshop.jobFunction || "-"}</span>
          ) : (
            <select
              className={styles.select}
              value={workshop.jobFunction || ""}
              onChange={(e) =>
                onChange({ jobFunction: e.target.value || undefined })
              }
            >
              <option value="">- Select in the BID -</option>
              {Object.keys(functionGroups).map((cat) => (
                <optgroup key={cat} label={cat}>
                  {functionGroups[cat].map((f) => (
                    <option key={f.id} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          )}
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Phase</span>
          {readOnly ? (
            <span className={styles.value}>{workshop.phase || "-"}</span>
          ) : (
            <select
              className={styles.select}
              value={workshop.phase || ""}
              onChange={(e) => onChange({ phase: e.target.value || undefined })}
            >
              <option value="">- Select in the BID -</option>
              {phases.map((p) => (
                <option key={p.id} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
          )}
        </label>

        <label className={`${styles.field} ${styles.fieldWide}`}>
          <span className={styles.label}>Notes</span>
          {readOnly ? (
            <span className={styles.value}>{workshop.notes || "-"}</span>
          ) : (
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. hydrostatic test, functional test with HPU..."
              value={workshop.notes || ""}
              onChange={(e) => onChange({ notes: e.target.value })}
            />
          )}
        </label>
      </div>

      <p className={styles.dest}>
        <span className={styles.destIcon}>
          <Info size={14} />
        </span>
        <span>When this BOM is imported into a BID:</span>
        <span>
          <strong>hours</strong> go to Hours &amp; Personnel › Onshore Hours
        </span>
        <span>
          <strong>cost</strong> goes to Assets Breakdown › Services &amp; Fees
          of the item
        </span>
        <span>(both × the item quantity).</span>
      </p>
    </section>
  );
};
