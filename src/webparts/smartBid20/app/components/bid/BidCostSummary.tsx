import * as React from "react";
import { IBid } from "../../models";
import {
  ICostSegment,
  buildCostSummaryView,
} from "../../utils/costSummaryView";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { useColorTheme } from "../../hooks/useColorTheme";
import { BidFxNote } from "./BidFxNote";
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

  const kpis = [
    {
      label: "Total Cost USD",
      value: formatCurrency(s.totalCostUSD),
      accent: true,
    },
    {
      label: "Total Cost BRL",
      value: formatCurrency(s.totalCostBRL, "BRL"),
      accent: true,
    },
    {
      label: "PTAX Used (USD→BRL)",
      value: s.ptaxUsed > 0 ? s.ptaxUsed.toFixed(4) : "-",
      sub: fx.capturedDate
        ? `Registered ${formatDate(fx.capturedDate)}`
        : undefined,
    },
    { label: "Currency", value: s.currency },
  ];

  // Simple horizontal bar percentages
  const maxUSD = Math.max(...breakdown.map((b) => b.usd), 1);

  // Expand/collapse sub-categories (open by default)
  const [subCatsExpanded, setSubCatsExpanded] = React.useState(true);

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

  // Render stacked bar
  const renderStackedBar = (
    segments: ICostSegment[],
    totalBRL: number,
  ): React.ReactNode => {
    if (totalBRL <= 0) return null;
    return (
      <div className={styles.stackedBarContainer}>
        <div className={styles.stackedBar}>
          {segments.map((seg) => {
            const pct = (seg.brl / totalBRL) * 100;
            if (pct < 0.5) return null;
            return (
              <div
                key={seg.label}
                className={styles.stackedSegment}
                style={{ width: `${pct}%`, background: segmentColor(seg) }}
                title={`${seg.label}: ${formatCurrency(seg.brl, "BRL")} (${pct.toFixed(1)}%)`}
              >
                {pct > 10 && (
                  <span className={styles.segmentLabel}>
                    {formatCurrency(seg.brl, "BRL")}
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
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      {/* Service Line Badge */}
      <div className={styles.serviceLineBadge}>
        <span className={styles.serviceLineLabel}>Service Line</span>
        <span className={styles.serviceLineValue}>
          {(bid.serviceLine || "N/A").toUpperCase()}
        </span>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiRow}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`${styles.kpiCard} ${k.accent ? styles.kpiAccent : ""}`}
          >
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiValue}>{k.value}</div>
            {k.sub && <div className={styles.kpiLabel}>{k.sub}</div>}
          </div>
        ))}
      </div>
      <BidFxNote fx={fx} currencies={view.itemCurrencies} requireBrl />

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
        </h4>
        <table className={styles.breakdownTable}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Category</th>
              <th style={{ textAlign: "right" }}>USD</th>
              <th style={{ textAlign: "right" }}>BRL</th>
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
                  <td className={styles.cellRight}>
                    {formatCurrency(row.brl, "BRL")}
                  </td>
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
              <td className={styles.cellRight}>
                {formatCurrency(s.totalCostBRL, "BRL")}
              </td>
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
            {renderStackedBar(view.capex.segments, capexBRL)}
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
            {renderStackedBar(view.opex.segments, opexBRL)}
          </div>
        </div>

        {/* Percentage bar */}
        <div className={styles.capexOpexBarSection}>
          <div className={styles.capexOpexBarLabels}>
            <span>
              CAPEX:{" "}
              {s.totalCostBRL > 0
                ? ((capexBRL / (capexBRL + opexBRL)) * 100).toFixed(1)
                : 0}
              %
            </span>
            <span>
              OPEX:{" "}
              {s.totalCostBRL > 0
                ? ((opexBRL / (capexBRL + opexBRL)) * 100).toFixed(1)
                : 0}
              %
            </span>
          </div>
          <div className={styles.capexOpexBar}>
            <div
              className={styles.capexPortion}
              style={{
                width: `${capexBRL + opexBRL > 0 ? (capexBRL / (capexBRL + opexBRL)) * 100 : 50}%`,
              }}
            />
            <div
              className={styles.opexPortion}
              style={{
                width: `${capexBRL + opexBRL > 0 ? (opexBRL / (capexBRL + opexBRL)) * 100 : 50}%`,
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
