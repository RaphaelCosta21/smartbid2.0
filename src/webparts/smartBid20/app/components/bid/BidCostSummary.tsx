import * as React from "react";
import { IBid } from "../../models";
import {
  buildCostSummary,
  calculateAssetsByResourceType,
} from "../../utils/costCalculations";
import { formatCurrency } from "../../utils/formatters";
import styles from "./BidCostSummary.module.scss";

interface BidCostSummaryProps {
  bid: IBid;
  className?: string;
}

export const BidCostSummary: React.FC<BidCostSummaryProps> = ({
  bid,
  className,
}) => {
  const s = React.useMemo(() => buildCostSummary(bid), [bid]);
  const assetsByType = React.useMemo(
    () =>
      calculateAssetsByResourceType(
        bid.assetBreakdown || [],
        bid.scopeItems || [],
      ),
    [bid],
  );
  const hasMultipleAssetTypes = assetsByType.length > 1;

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
    { label: "PTAX Used", value: s.ptaxUsed.toFixed(4) },
    { label: "Currency", value: s.currency },
  ];

  const breakdown: {
    label: string;
    usd: number;
    brl: number;
    indent?: boolean;
  }[] = [];

  // Assets rows — split by resource type when multiple types exist
  if (hasMultipleAssetTypes) {
    // Totals header
    breakdown.push({
      label: "Assets (CAPEX)",
      usd: s.assetsCapexUSD,
      brl: s.assetsCapexUSD * s.ptaxUsed,
    });
    assetsByType.forEach((rt) => {
      if (rt.capexUSD > 0) {
        breakdown.push({
          label: `↳ ${rt.resourceType}`,
          usd: rt.capexUSD,
          brl: rt.capexUSD * s.ptaxUsed,
          indent: true,
        });
      }
    });
    breakdown.push({
      label: "Assets (OPEX)",
      usd: s.assetsOpexUSD,
      brl: s.assetsOpexUSD * s.ptaxUsed,
    });
    assetsByType.forEach((rt) => {
      if (rt.opexUSD > 0) {
        breakdown.push({
          label: `↳ ${rt.resourceType}`,
          usd: rt.opexUSD,
          brl: rt.opexUSD * s.ptaxUsed,
          indent: true,
        });
      }
    });
  } else {
    breakdown.push({
      label: "Assets (CAPEX)",
      usd: s.assetsCapexUSD,
      brl: s.assetsCapexUSD * s.ptaxUsed,
    });
    breakdown.push({
      label: "Assets (OPEX)",
      usd: s.assetsOpexUSD,
      brl: s.assetsOpexUSD * s.ptaxUsed,
    });
  }

  breakdown.push(
    {
      label: "Engineering Hours",
      usd: s.ptaxUsed > 0 ? s.engineeringHoursCostBRL / s.ptaxUsed : 0,
      brl: s.engineeringHoursCostBRL,
    },
    {
      label: "Onshore Hours",
      usd: s.ptaxUsed > 0 ? s.onshoreHoursCostBRL / s.ptaxUsed : 0,
      brl: s.onshoreHoursCostBRL,
    },
    {
      label: "Offshore Hours",
      usd: s.ptaxUsed > 0 ? s.offshoreHoursCostBRL / s.ptaxUsed : 0,
      brl: s.offshoreHoursCostBRL,
    },
    { label: "Logistics", usd: s.logisticsCostUSD, brl: s.logisticsCostBRL },
    {
      label: "Certifications",
      usd: s.certificationsCostUSD,
      brl: s.certificationsCostBRL,
    },
    { label: "RTS (Ready To Service)", usd: s.rtsCostUSD, brl: s.rtsCostBRL },
    {
      label: "Mobilization",
      usd: s.mobilizationCostUSD,
      brl: s.mobilizationCostBRL,
    },
    {
      label: "Consumables",
      usd: s.consumablesCostUSD,
      brl: s.consumablesCostBRL,
    },
  );

  // Simple horizontal bar percentages
  const maxUSD = Math.max(...breakdown.map((b) => b.usd), 1);

  return (
    <div className={`${styles.wrapper} ${className || ""}`}>
      {/* KPI Cards */}
      <div className={styles.kpiRow}>
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`${styles.kpiCard} ${k.accent ? styles.kpiAccent : ""}`}
          >
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={styles.kpiValue}>{k.value}</div>
          </div>
        ))}
      </div>

      {/* Breakdown Table */}
      <div className={styles.breakdownSection}>
        <h4 className={styles.sectionTitle}>Cost Breakdown</h4>
        <table className={styles.breakdownTable}>
          <thead>
            <tr>
              <th>Category</th>
              <th>USD</th>
              <th>BRL</th>
              <th>% of Total</th>
              <th style={{ width: "30%" }} />
            </tr>
          </thead>
          <tbody>
            {breakdown.map((row) => {
              const pct =
                s.totalCostUSD > 0 ? (row.usd / s.totalCostUSD) * 100 : 0;
              return (
                <tr
                  key={row.label}
                  className={row.indent ? styles.indentRow : ""}
                >
                  <td>{row.label}</td>
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

      {s.notes && <div className={styles.notes}>{s.notes}</div>}
    </div>
  );
};
