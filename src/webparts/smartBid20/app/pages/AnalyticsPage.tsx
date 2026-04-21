import * as React from "react";
import { useParams } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { PerformanceTrends } from "../components/insights/PerformanceTrends";
import { BottleneckAnalysis } from "../components/insights/BottleneckAnalysis";
import { TeamAnalytics } from "../components/insights/TeamAnalytics";
import { useBids } from "../hooks/useBids";
import { useKPIs } from "../hooks/useKPIs";
import { DivisionBadge } from "../components/common/DivisionBadge";
import { ProgressBar } from "../components/common/ProgressBar";
import { useConfigStore } from "../stores/useConfigStore";
import { formatPercentage } from "../utils/formatters";
import { KPI_DEFINITIONS } from "../config/kpi.config";
import styles from "./AnalyticsPage.module.scss";

type AnalyticsView = "overview" | "performance" | "bottlenecks" | "team";

export const AnalyticsPage: React.FC = () => {
  const { view } = useParams<{ view: string }>();
  const [activeView, setActiveView] = React.useState<AnalyticsView>(
    (view as AnalyticsView) || "overview",
  );
  const { filteredBids } = useBids();
  const kpis = useKPIs();
  const config = useConfigStore((s) => s.config);

  const views: { key: AnalyticsView; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "performance", label: "Performance" },
    { key: "bottlenecks", label: "Bottlenecks" },
    { key: "team", label: "Team" },
  ];

  const divisionStats = React.useMemo(() => {
    const divs = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    const divValues =
      divs.length > 0
        ? divs
        : ([
            { value: "OPG", label: "OPG", color: "#3b82f6" },
            { value: "SSR", label: "SSR", color: "#10b981" },
          ] as any[]);
    return divValues.map((div: any) => {
      const divBids = filteredBids.filter((b) => b.division === div.value);
      const completed = divBids.filter(
        (b) => b.currentStatus === "Completed",
      ).length;
      return {
        division: div.value,
        total: divBids.length,
        completed,
        winRate:
          divBids.length > 0
            ? Math.round((completed / divBids.length) * 100)
            : 0,
        color: div.color || "#94a3b8",
      };
    });
  }, [filteredBids, config]);

  return (
    <div className={styles.page}>
      <PageHeader
        title="Analytics"
        subtitle="Advanced analytics and insights"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
        }
      />

      {/* Tab navigation */}
      <div className={styles.tabBar}>
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            className={`${styles.tabBtn} ${activeView === v.key ? styles.tabBtnActive : ""}`}
          >
            {v.label}
          </button>
        ))}
      </div>

      {activeView === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* KPI Summary */}
          <div className={styles.kpiGrid}>
            {KPI_DEFINITIONS.slice(0, 6).map((def) => {
              const valueMap: Record<string, string | number> = {
                "on-time-delivery": formatPercentage(100 - kpis.overdueRate),
                "avg-completion-days": `${Math.round(kpis.avgCycleTimeDays)}d`,
                "overdue-rate": formatPercentage(kpis.overdueRate),
                "win-rate": formatPercentage(kpis.winRate),
                "cancellation-rate": "0%",
                otif: formatPercentage(100 - kpis.overdueRate),
              };
              return (
                <div
                  key={def.id}
                  className={styles.kpiCard}
                  style={{ borderColor: `${def.color}30` }}
                >
                  <div className={styles.kpiLabel} style={{ color: def.color }}>
                    {def.label}
                  </div>
                  <div className={styles.kpiValue}>
                    {valueMap[def.id] ?? kpis.totalBids}
                  </div>
                  <div className={styles.kpiDescription}>{def.description}</div>
                </div>
              );
            })}
          </div>

          {/* Division breakdown */}
          <div className={styles.sectionCard}>
            <h4 className={styles.sectionTitle}>Division Breakdown</h4>
            <div className={styles.divisionRows}>
              {divisionStats.map((ds) => (
                <div key={ds.division} className={styles.divisionRow}>
                  <DivisionBadge division={ds.division} />
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={ds.total}
                      max={Math.max(...divisionStats.map((d) => d.total), 1)}
                      color={ds.color}
                      showLabel
                    />
                  </div>
                  <span className={styles.divisionLabel}>
                    {ds.total} BIDs ({ds.winRate}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeView === "performance" && <PerformanceTrends />}
      {activeView === "bottlenecks" && <BottleneckAnalysis />}
      {activeView === "team" && <TeamAnalytics />}
    </div>
  );
};
