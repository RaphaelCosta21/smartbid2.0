import * as React from "react";
import { Wallet } from "lucide-react";
import { IBid } from "../../models";
import {
  ICostSegment,
  buildCostSummaryView,
} from "../../utils/costSummaryView";
import { formatCurrency } from "../../utils/formatters";
import { useColorTheme } from "../../hooks/useColorTheme";
import { BidFxNote } from "./BidFxNote";
import { BidTabHeader, HeaderChip, IHeaderStat } from "./BidTabHeader";
import styles from "./BidCostSummary.module.scss";

interface BidCostSummaryProps {
  bid: IBid;
  className?: string;
}

export const BidCostSummary: React.FC<BidCostSummaryProps> = ({
  bid,
  className,
}) => {
  const view = React.useMemo(() => buildCostSummaryView(bid), [bid]);
  const colorTheme = useColorTheme();
  const { summary: s, fx, assetsByType, rows: breakdown } = view;

  const topRows = breakdown.filter((r) => !r.indent);
  const largest = topRows.reduce<(typeof topRows)[number] | null>(
    (best, r) => (r.usd > 0 && (!best || r.usd > best.usd) ? r : best),
    null,
  );
  const capexOpexUSD = view.capex.usd + view.opex.usd;
  const headerStats: IHeaderStat[] = [
    {
      label: "Largest category",
      value: largest ? largest.label : "-",
      sub:
        largest && s.totalCostUSD > 0
          ? `${Math.round((largest.usd / s.totalCostUSD) * 100)}% of total`
          : undefined,
    },
    {
      label: "CAPEX share",
      value:
        capexOpexUSD > 0
          ? `${Math.round((view.capex.usd / capexOpexUSD) * 100)}%`
          : "-",
      sub:
        capexOpexUSD > 0
          ? `OPEX ${Math.round((view.opex.usd / capexOpexUSD) * 100)}%`
          : undefined,
    },
  ];

  // Simple horizontal bar percentages
  const maxUSD = Math.max(...breakdown.map((b) => b.usd), 1);

  const [subCatsExpanded, setSubCatsExpanded] = React.useState(false);
  const [showBRL, setShowBRL] = React.useState(false);

  const capexBRL = view.capex.brl;
  const opexBRL = view.opex.brl;
  const capexUSD = view.capex.usd;
  const opexUSD = view.opex.usd;

  // Chart colors for resource types
  const TYPE_COLORS = [
    colorTheme.accents.a600,
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];

  const allTypes = React.useMemo(() => {
    const set: string[] = [];
    assetsByType.forEach((rt) => {
      if (set.indexOf(rt.resourceType) === -1) set.push(rt.resourceType);
    });
    return set;
  }, [assetsByType]);

  const getTypeColor = (label: string): string => {
    const idx = allTypes.indexOf(label);
    return TYPE_COLORS[idx >= 0 ? idx % TYPE_COLORS.length : 0];
  };

  const segmentColor = (seg: ICostSegment): string =>
    seg.isServices ? "#64748b" : getTypeColor(seg.label);

  // Render stacked bar (amounts in USD)
  const renderStackedBar = (
    segments: ICostSegment[],
    totalUSD: number,
  ): React.ReactNode => {
    if (totalUSD <= 0) return null;
    return (
      <div className={styles.stackedBarContainer}>
        <div className={styles.stackedBar}>
          {segments.map((seg) => {
            const pct = (seg.usd / totalUSD) * 100;
            if (pct < 0.5) return null;
            return (
              <div
                key={seg.label}
                className={styles.stackedSegment}
                style={{ width: `${pct}%`, background: segmentColor(seg) }}
                title={`${seg.label}: ${formatCurrency(seg.usd)} (${pct.toFixed(1)}%) · ${formatCurrency(seg.brl, "BRL")}`}
              >
                {pct > 10 && (
                  <span className={styles.segmentLabel}>
                    {formatCurrency(seg.usd)}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <div className={styles.stackedLegend}>
          {segments.map((seg) => (
            <span key={seg.label} className={styles.legendItem}>
              <span
                className={styles.legendDot}
                style={{ background: segmentColor(seg) }}
              />
              {seg.label}
              <span className={styles.legendValue}>
                {formatCurrency(seg.usd)}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      <BidTabHeader
        title="Cost Summary"
        subtitle="Consolidated BID cost across all tabs"
        icon={<Wallet size={18} />}
        meta={
          <>
            <HeaderChip>Service line: {bid.serviceLine || "N/A"}</HeaderChip>
            <HeaderChip>Currency: {s.currency}</HeaderChip>
          </>
        }
        hero={{
          label: "Total cost (USD)",
          value: formatCurrency(s.totalCostUSD),
          sub: formatCurrency(s.totalCostBRL, "BRL"),
        }}
        stats={headerStats}
        footer={
          <BidFxNote fx={fx} currencies={view.itemCurrencies} requireBrl />
        }
      />

      {/* Breakdown Table */}
      <div className={styles.breakdownSection}>
        <h4 className={styles.sectionTitle}>
          Cost Breakdown
          <button
            className={styles.toggleSubCats}
            onClick={() => setSubCatsExpanded(!subCatsExpanded)}
            title={
              subCatsExpanded
                ? "Collapse sub-categories"
                : "Expand sub-categories"
            }
          >
            {subCatsExpanded ? "▾ Hide details" : "▸ Show details"}
          </button>
          <button
            className={styles.toggleSubCats}
            onClick={() => setShowBRL(!showBRL)}
            aria-pressed={showBRL}
            title={showBRL ? "Hide BRL column" : "Show BRL column"}
          >
            {showBRL ? "Hide BRL" : "Show BRL"}
          </button>
        </h4>
        <table className={styles.breakdownTable}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Category</th>
              <th style={{ textAlign: "right" }}>USD</th>
              {showBRL && <th style={{ textAlign: "right" }}>BRL</th>}
              <th style={{ textAlign: "right" }}>% of Total</th>
              <th style={{ width: "30%" }} />
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row, idx) => {
              if (row.indent && !subCatsExpanded) return null;
              const pct =
                s.totalCostUSD > 0 ? (row.usd / s.totalCostUSD) * 100 : 0;
              return (
                <tr
                  key={`${idx}-${row.label}`}
                  className={row.indent ? styles.indentRow : ""}
                >
                  <td>
                    {row.indent ? `↳ ${row.label}` : row.label}
                    {row.hours !== undefined && (
                      <span className={styles.hoursTag}>
                        {`${row.hours.toLocaleString()}h`}
                      </span>
                    )}
                  </td>
                  <td className={styles.cellRight}>
                    {formatCurrency(row.usd)}
                  </td>
                  {showBRL && (
                    <td className={styles.cellRight}>
                      {formatCurrency(row.brl, "BRL")}
                    </td>
                  )}
                  <td className={styles.cellRight}>{pct.toFixed(1)}%</td>
                  <td>
                    <div className={styles.barWrapper}>
                      <div
                        className={styles.bar}
                        style={{
                          width: `${Math.max((row.usd / maxUSD) * 100, 0)}%`,
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className={styles.totalRow}>
              <td>Total</td>
              <td className={styles.cellRight}>
                {formatCurrency(s.totalCostUSD)}
              </td>
              {showBRL && (
                <td className={styles.cellRight}>
                  {formatCurrency(s.totalCostBRL, "BRL")}
                </td>
              )}
              <td className={styles.cellRight}>100%</td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* CAPEX vs OPEX Section */}
      <div className={styles.breakdownSection}>
        <h4 className={styles.sectionTitle}>BID CAPEX x OPEX</h4>
        <div className={styles.capexOpexRow}>
          {/* CAPEX Card */}
          <div className={styles.capexOpexCard}>
            <div className={styles.capexOpexHeader}>CAPEX</div>
            <div className={styles.capexOpexValues}>
              <span className={styles.capexOpexBrl}>
                {formatCurrency(capexUSD)}
              </span>
              <span className={styles.capexOpexUsd}>
                {formatCurrency(capexBRL, "BRL")}
              </span>
            </div>
            {renderStackedBar(view.capex.segments, capexUSD)}
          </div>

          {/* OPEX Card */}
          <div className={styles.capexOpexCard}>
            <div className={styles.capexOpexHeader}>OPEX</div>
            <div className={styles.capexOpexValues}>
              <span className={styles.capexOpexBrl}>
                {formatCurrency(opexUSD)}
              </span>
              <span className={styles.capexOpexUsd}>
                {formatCurrency(opexBRL, "BRL")}
              </span>
            </div>
            {renderStackedBar(view.opex.segments, opexUSD)}
          </div>
        </div>

        {/* Percentage bar */}
        <div className={styles.capexOpexBarSection}>
          <div className={styles.capexOpexBarLabels}>
            <span>
              CAPEX:{" "}
              {capexOpexUSD > 0
                ? ((capexUSD / capexOpexUSD) * 100).toFixed(1)
                : 0}
              %
            </span>
            <span>
              OPEX:{" "}
              {capexOpexUSD > 0
                ? ((opexUSD / capexOpexUSD) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className={styles.capexOpexBar}>
            <div
              className={styles.capexPortion}
              style={{
                width: `${capexOpexUSD > 0 ? (capexUSD / capexOpexUSD) * 100 : 50}%`,
              }}
            />
            <div
              className={styles.opexPortion}
              style={{
                width: `${capexOpexUSD > 0 ? (opexUSD / capexOpexUSD) * 100 : 50}%`,
              }}
            />
          </div>
        </div>
        {view.uncategorized.usd > 0 && (
          <div className={styles.notes}>
            Uncategorized assets (no CAPEX/OPEX set):{" "}
            {formatCurrency(view.uncategorized.usd)} ·{" "}
            {formatCurrency(view.uncategorized.brl, "BRL")} - included in the
            total but not in CAPEX or OPEX.
          </div>
        )}
      </div>

      {s.notes && <div className={styles.notes}>{s.notes}</div>}
    </div>
  );
};
