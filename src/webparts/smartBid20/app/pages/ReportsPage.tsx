import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { KPICard } from "../components/common/KPICard";
import { EmptyState } from "../components/common/EmptyState";
import { Sparkline } from "../components/charts/Sparkline";
import { useChartTheme } from "../hooks/useChartTheme";
import { useBids } from "../hooks/useBids";
import { useKPIs } from "../hooks/useKPIs";
import { ROUTES } from "../config/routes.config";
import { formatPercentage } from "../utils/formatters";
import { volumeTrend } from "../utils/analyticsHelpers";
import styles from "./ReportsPage.module.scss";

interface PreviewDef {
  key: string;
  route: string;
  title: string;
  description: string;
  color: string;
  series: number[];
  icon: React.ReactNode;
}

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();
  const kpis = useKPIs();
  const chart = useChartTheme();

  const monthly = React.useMemo(() => volumeTrend(bids, "month"), [bids]);
  const createdSeries = monthly.map((p) => p.created);
  const completedSeries = monthly.map((p) => p.completed);
  const completed = React.useMemo(
    () => bids.filter((b) => b.currentStatus === "Completed").length,
    [bids],
  );

  const previews: PreviewDef[] = [
    {
      key: "period",
      route: ROUTES.periodPerformance,
      title: "Period Performance",
      description:
        "Consolidated overview: status, division, clients, requesters, and monthly trends.",
      color: chart.accentSecondary,
      series: createdSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
    },
    {
      key: "details",
      route: ROUTES.bidDetailsReport,
      title: "BID Details",
      description:
        "Detailed BID report: costs, hours, equipment, history, and approvals.",
      color: chart.accentTertiary,
      series: completedSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      ),
    },
    {
      key: "operational",
      route: ROUTES.operationalSummary,
      title: "Operational Summary",
      description:
        "Operational overview, workloads by division, throughput, and approval time by department.",
      color: chart.accent,
      series: completedSeries,
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="Reports & Export"
        subtitle="Consolidated reports and exports"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        }
      />

      {bids.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No BIDs to Report"
          description="Reports will appear here once BIDs are available."
        />
      ) : (
        <>
          <div className={styles.heroGrid}>
            <KPICard
              variant="glass"
              label="Total BIDs"
              value={kpis.totalBids}
              accentColor={chart.accentSecondary}
              subtitle="in selected period"
              sparkline={
                <Sparkline
                  data={createdSeries}
                  color={chart.accentSecondary}
                  height={34}
                />
              }
            />
            <KPICard
              variant="glass"
              label="In Progress"
              value={kpis.activeBids}
              accentColor={chart.accent}
              subtitle="active BIDs"
            />
            <KPICard
              variant="glass"
              label="Completed"
              value={completed}
              accentColor={chart.info}
              subtitle="terminal statuses"
              sparkline={
                <Sparkline
                  data={completedSeries}
                  color={chart.info}
                  height={34}
                />
              }
            />
            <KPICard
              variant="glass"
              label="Win Rate"
              value={formatPercentage(kpis.winRate)}
              accentColor={chart.success}
              subtitle="won / decididos"
            />
          </div>

          <div className={styles.previewGrid}>
            {previews.map((p) => (
              <div
                key={p.key}
                className={styles.previewCard}
                role="button"
                tabIndex={0}
                onClick={() => navigate(p.route)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") navigate(p.route);
                }}
              >
                <div
                  className={styles.previewSheen}
                  style={{ background: p.color }}
                />
                <div className={styles.previewHead}>
                  <span
                    className={styles.previewIcon}
                    style={{ background: `${p.color}1f`, color: p.color }}
                  >
                    {p.icon}
                  </span>
                  <span className={styles.previewArrow}>
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                </div>
                <div className={styles.previewTitle}>{p.title}</div>
                <div className={styles.previewDesc}>{p.description}</div>
                <div className={styles.previewSpark}>
                  <Sparkline data={p.series} color={p.color} height={44} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
