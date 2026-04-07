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
import { DIVISION_COLORS, DIVISIONS } from "../utils/constants";
import { formatPercentage } from "../utils/formatters";
import { KPI_DEFINITIONS } from "../config/kpi.config";

type AnalyticsView = "overview" | "performance" | "bottlenecks" | "team";

export const AnalyticsPage: React.FC = () => {
  const { view } = useParams<{ view: string }>();
  const [activeView, setActiveView] = React.useState<AnalyticsView>(
    (view as AnalyticsView) || "overview",
  );
  const { filteredBids } = useBids();
  const kpis = useKPIs();

  const views: { key: AnalyticsView; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "performance", label: "Performance" },
    { key: "bottlenecks", label: "Bottlenecks" },
    { key: "team", label: "Team" },
  ];

  const divisionStats = React.useMemo(() => {
    return DIVISIONS.map((div) => {
      const divBids = filteredBids.filter((b) => b.division === div);
      const completed = divBids.filter(
        (b) => b.currentStatus === "Completed",
      ).length;
      return {
        division: div,
        total: divBids.length,
        completed,
        winRate:
          divBids.length > 0
            ? Math.round((completed / divBids.length) * 100)
            : 0,
        color: DIVISION_COLORS[div] || "#94a3b8",
      };
    });
  }, [filteredBids]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
      <div style={{ display: "flex", gap: 8 }}>
        {views.map((v) => (
          <button
            key={v.key}
            onClick={() => setActiveView(v.key)}
            style={{
              padding: "8px 20px",
              borderRadius: 8,
              border:
                activeView === v.key
                  ? "none"
                  : "1px solid var(--border-subtle)",
              background:
                activeView === v.key
                  ? "var(--accent-color, #3B82F6)"
                  : "transparent",
              color: activeView === v.key ? "#fff" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: activeView === v.key ? 600 : 400,
            }}
          >
            {v.label}
          </button>
        ))}
      </div>

      {activeView === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* KPI Summary */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
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
                  style={{
                    padding: 20,
                    background: "var(--card-bg)",
                    borderRadius: 12,
                    border: `1px solid ${def.color}30`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 12,
                      color: def.color,
                      marginBottom: 4,
                      fontWeight: 600,
                    }}
                  >
                    {def.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>
                    {valueMap[def.id] ?? kpis.totalBids}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-secondary)",
                      marginTop: 2,
                    }}
                  >
                    {def.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Division breakdown */}
          <div
            style={{
              background: "var(--card-bg)",
              borderRadius: 12,
              padding: 20,
              border: "1px solid var(--border-subtle)",
            }}
          >
            <h4 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 600 }}>
              Division Breakdown
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {divisionStats.map((ds) => (
                <div
                  key={ds.division}
                  style={{ display: "flex", alignItems: "center", gap: 12 }}
                >
                  <DivisionBadge division={ds.division} />
                  <div style={{ flex: 1 }}>
                    <ProgressBar
                      value={ds.total}
                      max={Math.max(...divisionStats.map((d) => d.total), 1)}
                      color={ds.color}
                      showLabel
                    />
                  </div>
                  <span
                    style={{
                      fontSize: 13,
                      color: "var(--text-secondary)",
                      minWidth: 80,
                    }}
                  >
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
