import * as React from "react";
import { IBid, IHoursItem } from "../../models";
import {
  buildCostSummary,
  calculateAssetsByResourceType,
  calculateHoursTotals,
  calculateLogisticsTotals,
  calculateCertificationsTotals,
  calculateRTSTotals,
  calculateMobilizationTotals,
  calculateConsumablesTotals,
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
  const hours = React.useMemo(() => calculateHoursTotals(bid), [bid]);
  const assetsByType = React.useMemo(
    () =>
      calculateAssetsByResourceType(
        bid.assetBreakdown || [],
        bid.scopeItems || [],
      ),
    [bid],
  );

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

  // ─── Breakdown rows ───
  interface IBreakdownRow {
    label: string;
    usd: number;
    brl: number;
    indent?: boolean;
    hoursLabel?: string;
  }

  const isIntegrated = (bid.serviceLine || "").toLowerCase() === "integrated";
  const divisions: string[] = isIntegrated ? ["ROV", "SURVEY"] : [];
  const ptax = s.ptaxUsed;

  // ─── Per-division hours breakdown ───
  const hoursByDiv = React.useMemo(() => {
    if (!isIntegrated) return {};
    const hs = bid.hoursSummary;
    const scopeItems = bid.scopeItems || [];
    const result: Record<
      string,
      {
        engBRL: number;
        engH: number;
        onBRL: number;
        onH: number;
        offBRL: number;
        offH: number;
      }
    > = {};
    divisions.forEach((div) => {
      // Legacy row-based engineering items
      const engItems: IHoursItem[] = (hs?.engineeringHours?.items || []).filter(
        (i) => i.integratedDivision === div,
      );
      // Deliverable-based engineering items (linked via scope)
      const divScopeIds = new Set(
        scopeItems
          .filter((si) => si.integratedDivision === div)
          .map((si) => si.id),
      );
      const engDeliverableHours = (hs?.engineeringHours?.engineeringItems || [])
        .filter((ei) => divScopeIds.has(ei.scopeItemId))
        .reduce((sum, ei) => sum + (ei.totalHours || 0), 0);

      const onItems: IHoursItem[] = (hs?.onshoreHours?.items || []).filter(
        (i) => i.integratedDivision === div,
      );
      const offItems: IHoursItem[] = (hs?.offshoreHours?.items || []).filter(
        (i) => i.integratedDivision === div,
      );
      result[div] = {
        engBRL: engItems.reduce((sum, i) => sum + (i.costBRL || 0), 0),
        engH:
          engItems.reduce((sum, i) => sum + (i.totalHours || 0), 0) +
          engDeliverableHours,
        onBRL: onItems.reduce((sum, i) => sum + (i.costBRL || 0), 0),
        onH: onItems.reduce((sum, i) => sum + (i.totalHours || 0), 0),
        offBRL: offItems.reduce((sum, i) => sum + (i.costBRL || 0), 0),
        offH: offItems.reduce((sum, i) => sum + (i.totalHours || 0), 0),
      };
    });
    return result;
  }, [bid, isIntegrated]);

  // ─── Per-division logistics/certs/rts/mob/consumables ───
  const divLogistics = React.useMemo(() => {
    if (!isIntegrated) return {};
    const result: Record<string, { usd: number; brl: number }> = {};
    divisions.forEach((div) => {
      const items = (bid.logisticsBreakdown || []).filter(
        (i) => i.integratedDivision === div,
      );
      const t = calculateLogisticsTotals(items, ptax);
      result[div] = { usd: t.totalUSD, brl: t.totalBRL };
    });
    return result;
  }, [bid, isIntegrated]);

  const divCerts = React.useMemo(() => {
    if (!isIntegrated) return {};
    const result: Record<string, { usd: number; brl: number }> = {};
    divisions.forEach((div) => {
      const items = (bid.certificationsBreakdown || []).filter(
        (i) => i.integratedDivision === div,
      );
      const t = calculateCertificationsTotals(items, ptax);
      result[div] = { usd: t.totalUSD, brl: t.totalBRL };
    });
    return result;
  }, [bid, isIntegrated]);

  const divRTS = React.useMemo(() => {
    if (!isIntegrated) return {};
    const result: Record<string, { usd: number; brl: number }> = {};
    divisions.forEach((div) => {
      const items = (bid.rtsItems || []).filter(
        (i) => i.integratedDivision === div,
      );
      const t = calculateRTSTotals(items, ptax);
      result[div] = { usd: t.totalUSD, brl: t.totalBRL };
    });
    return result;
  }, [bid, isIntegrated]);

  const divMob = React.useMemo(() => {
    if (!isIntegrated) return {};
    const result: Record<string, { usd: number; brl: number }> = {};
    divisions.forEach((div) => {
      const items = (bid.mobilizationItems || []).filter(
        (i) => i.integratedDivision === div,
      );
      const t = calculateMobilizationTotals(items, ptax);
      result[div] = { usd: t.totalUSD, brl: t.totalBRL };
    });
    return result;
  }, [bid, isIntegrated]);

  const divCons = React.useMemo(() => {
    if (!isIntegrated) return {};
    const result: Record<string, { usd: number; brl: number }> = {};
    divisions.forEach((div) => {
      const items = (bid.consumableItems || []).filter(
        (i) => i.integratedDivision === div,
      );
      const t = calculateConsumablesTotals(items, ptax);
      result[div] = { usd: t.totalUSD, brl: t.totalBRL };
    });
    return result;
  }, [bid, isIntegrated]);

  const breakdown: IBreakdownRow[] = [];

  // Assets rows — always show resource type breakdown (dynamic labels)
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

  // ─── Compute real totals from items (section.totalHours can be stale) ───
  const realEngH = isIntegrated
    ? divisions.reduce(
        (sum, div) => sum + ((hoursByDiv[div] || {}).engH || 0),
        0,
      )
    : hours.engineeringHours;
  const realOnH = isIntegrated
    ? divisions.reduce(
        (sum, div) => sum + ((hoursByDiv[div] || {}).onH || 0),
        0,
      )
    : hours.onshoreHours;
  const realOffH = isIntegrated
    ? divisions.reduce(
        (sum, div) => sum + ((hoursByDiv[div] || {}).offH || 0),
        0,
      )
    : hours.offshoreHours;

  // Engineering Hours
  breakdown.push({
    label: "Engineering Hours",
    usd: s.ptaxUsed > 0 ? s.engineeringHoursCostBRL / s.ptaxUsed : 0,
    brl: s.engineeringHoursCostBRL,
    hoursLabel: realEngH > 0 ? `${realEngH.toLocaleString()}h` : undefined,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = hoursByDiv[div];
      if (d && (d.engBRL > 0 || d.engH > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: ptax > 0 ? d.engBRL / ptax : 0,
          brl: d.engBRL,
          indent: true,
          hoursLabel: d.engH > 0 ? `${d.engH.toLocaleString()}h` : undefined,
        });
      }
    });
  }

  // Onshore Hours
  breakdown.push({
    label: "Onshore Hours",
    usd: s.ptaxUsed > 0 ? s.onshoreHoursCostBRL / s.ptaxUsed : 0,
    brl: s.onshoreHoursCostBRL,
    hoursLabel: realOnH > 0 ? `${realOnH.toLocaleString()}h` : undefined,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = hoursByDiv[div];
      if (d && (d.onBRL > 0 || d.onH > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: ptax > 0 ? d.onBRL / ptax : 0,
          brl: d.onBRL,
          indent: true,
          hoursLabel: d.onH > 0 ? `${d.onH.toLocaleString()}h` : undefined,
        });
      }
    });
  }

  // Offshore Hours
  breakdown.push({
    label: "Offshore Hours",
    usd: s.ptaxUsed > 0 ? s.offshoreHoursCostBRL / s.ptaxUsed : 0,
    brl: s.offshoreHoursCostBRL,
    hoursLabel: realOffH > 0 ? `${realOffH.toLocaleString()}h` : undefined,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = hoursByDiv[div];
      if (d && (d.offBRL > 0 || d.offH > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: ptax > 0 ? d.offBRL / ptax : 0,
          brl: d.offBRL,
          indent: true,
          hoursLabel: d.offH > 0 ? `${d.offH.toLocaleString()}h` : undefined,
        });
      }
    });
  }

  // Logistics
  breakdown.push({
    label: "Logistics",
    usd: s.logisticsCostUSD,
    brl: s.logisticsCostBRL,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = divLogistics[div];
      if (d && (d.usd > 0 || d.brl > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: d.usd,
          brl: d.brl,
          indent: true,
        });
      }
    });
  }

  // Certifications
  breakdown.push({
    label: "Certifications",
    usd: s.certificationsCostUSD,
    brl: s.certificationsCostBRL,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = divCerts[div];
      if (d && (d.usd > 0 || d.brl > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: d.usd,
          brl: d.brl,
          indent: true,
        });
      }
    });
  }

  // RTS
  breakdown.push({
    label: "RTS (Ready To Service)",
    usd: s.rtsCostUSD,
    brl: s.rtsCostBRL,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = divRTS[div];
      if (d && (d.usd > 0 || d.brl > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: d.usd,
          brl: d.brl,
          indent: true,
        });
      }
    });
  }

  // Mobilization
  breakdown.push({
    label: "Mobilization",
    usd: s.mobilizationCostUSD,
    brl: s.mobilizationCostBRL,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = divMob[div];
      if (d && (d.usd > 0 || d.brl > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: d.usd,
          brl: d.brl,
          indent: true,
        });
      }
    });
  }

  // Consumables
  breakdown.push({
    label: "Consumables",
    usd: s.consumablesCostUSD,
    brl: s.consumablesCostBRL,
  });
  if (isIntegrated) {
    divisions.forEach((div) => {
      const d = divCons[div];
      if (d && (d.usd > 0 || d.brl > 0)) {
        breakdown.push({
          label: `↳ ${div}`,
          usd: d.usd,
          brl: d.brl,
          indent: true,
        });
      }
    });
  }

  // Simple horizontal bar percentages
  const maxUSD = Math.max(...breakdown.map((b) => b.usd), 1);

  // ─── CAPEX vs OPEX totals ───
  const capexBRL = React.useMemo(() => {
    // Assets CAPEX
    let c = s.assetsCapexUSD * s.ptaxUsed;
    // RTS, Certifications, Engineering, Logistics, etc. are typically CAPEX
    // For simplicity: everything non-OPEX-asset goes to CAPEX
    c +=
      s.engineeringHoursCostBRL +
      s.onshoreHoursCostBRL +
      s.offshoreHoursCostBRL;
    c += s.logisticsCostBRL;
    c += s.certificationsCostBRL;
    c += s.rtsCostBRL;
    c += s.mobilizationCostBRL;
    c += s.consumablesCostBRL;
    return c;
  }, [s]);

  const opexBRL = React.useMemo(() => {
    return s.assetsOpexUSD * s.ptaxUsed;
  }, [s]);

  const capexUSD = React.useMemo(() => {
    return s.totalCostUSD - s.assetsOpexUSD;
  }, [s]);

  const opexUSD = React.useMemo(() => {
    return s.assetsOpexUSD;
  }, [s]);

  // Chart colors for resource types
  const TYPE_COLORS = [
    "#0d9488",
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

  // Non-asset costs totals (for the "other" segment in chart)
  const nonAssetCostsBRL =
    s.engineeringHoursCostBRL +
    s.onshoreHoursCostBRL +
    s.offshoreHoursCostBRL +
    s.logisticsCostBRL +
    s.certificationsCostBRL +
    s.rtsCostBRL +
    s.mobilizationCostBRL +
    s.consumablesCostBRL;

  const nonAssetCostsUSD = s.ptaxUsed > 0 ? nonAssetCostsBRL / s.ptaxUsed : 0;

  // Stacked bar segments for CAPEX
  const capexSegments = React.useMemo(() => {
    const segs: { label: string; brl: number; usd: number; color: string }[] =
      [];
    assetsByType.forEach((rt) => {
      if (rt.capexUSD > 0) {
        segs.push({
          label: rt.resourceType,
          brl: rt.capexUSD * s.ptaxUsed,
          usd: rt.capexUSD,
          color: getTypeColor(rt.resourceType),
        });
      }
    });
    // Add non-asset costs to CAPEX
    if (nonAssetCostsBRL > 0) {
      segs.push({
        label: "Services & Others",
        brl: nonAssetCostsBRL,
        usd: nonAssetCostsUSD,
        color: "#64748b",
      });
    }
    return segs;
  }, [assetsByType, s, nonAssetCostsBRL]);

  const opexSegments = React.useMemo(() => {
    const segs: { label: string; brl: number; usd: number; color: string }[] =
      [];
    assetsByType.forEach((rt) => {
      if (rt.opexUSD > 0) {
        segs.push({
          label: rt.resourceType,
          brl: rt.opexUSD * s.ptaxUsed,
          usd: rt.opexUSD,
          color: getTypeColor(rt.resourceType),
        });
      }
    });
    return segs;
  }, [assetsByType, s]);

  // Render stacked bar
  const renderStackedBar = (
    segments: { label: string; brl: number; usd: number; color: string }[],
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
                style={{ width: `${pct}%`, background: seg.color }}
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
                style={{ background: seg.color }}
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
          </div>
        ))}
      </div>

      {/* Breakdown Table */}
      <div className={styles.breakdownSection}>
        <h4 className={styles.sectionTitle}>Cost Breakdown</h4>
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
            {breakdown.map((row) => {
              const pct =
                s.totalCostUSD > 0 ? (row.usd / s.totalCostUSD) * 100 : 0;
              return (
                <tr
                  key={row.label}
                  className={row.indent ? styles.indentRow : ""}
                >
                  <td>
                    {row.label}
                    {row.hoursLabel && (
                      <span className={styles.hoursTag}>{row.hoursLabel}</span>
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
                {formatCurrency(capexBRL, "BRL")}
              </span>
              <span className={styles.capexOpexUsd}>
                {formatCurrency(capexUSD)}
              </span>
            </div>
            {renderStackedBar(capexSegments, capexBRL)}
          </div>

          {/* OPEX Card */}
          <div className={styles.capexOpexCard}>
            <div className={styles.capexOpexHeader}>OPEX</div>
            <div className={styles.capexOpexValues}>
              <span className={styles.capexOpexBrl}>
                {formatCurrency(opexBRL, "BRL")}
              </span>
              <span className={styles.capexOpexUsd}>
                {formatCurrency(opexUSD)}
              </span>
            </div>
            {renderStackedBar(opexSegments, opexBRL)}
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
      </div>

      {s.notes && <div className={styles.notes}>{s.notes}</div>}
    </div>
  );
};
