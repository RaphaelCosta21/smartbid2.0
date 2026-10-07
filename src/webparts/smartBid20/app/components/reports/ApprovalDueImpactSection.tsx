import * as React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  Label,
  LabelProps,
  Pie,
  PieChart,
  ResponsiveContainer,
} from "recharts";
import { IBid } from "../../models";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { EmptyState } from "../common/EmptyState";
import { DataTable } from "../common/DataTable";
import { ChartTooltip } from "../charts/ChartTooltip";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useOpenBid } from "../../hooks/useOpenBid";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import {
  ApprovalDueCategory,
  PendingApprovalDueRisk,
  getPendingApprovalDueRisk,
  summarizeApprovalDueImpact,
} from "../../utils/approvalHelpers";
import { approvalImpactTrend } from "../../utils/analyticsHelpers";
import {
  formatDate,
  formatDateTime,
  formatElapsedHours,
} from "../../utils/formatters";
import styles from "./ApprovalDueImpactSection.module.scss";

interface ApprovalDueImpactSectionProps {
  bids: IBid[];
}

interface LateRow {
  bidNumber: string;
  client: string;
  dueDate: string;
  started: number;
  finished: number;
  daysLate: number;
  slowestLabel: string;
  slowestHours: number;
}

export const ApprovalDueImpactSection: React.FC<
  ApprovalDueImpactSectionProps
> = ({ bids }) => {
  const chart = useChartTheme();
  const { openBid } = useOpenBid();

  const summary = React.useMemo(() => summarizeApprovalDueImpact(bids), [bids]);
  const impacts = summary.impacts;

  const pendingRisk = React.useMemo(() => {
    const out: PendingApprovalDueRisk[] = [];
    bids.forEach((b) => {
      const risk = getPendingApprovalDueRisk(b);
      if (risk) out.push(risk);
    });
    return out;
  }, [bids]);

  const categories: {
    key: ApprovalDueCategory;
    label: string;
    color: string;
  }[] = [
    { key: "onTime", label: "On Time", color: chart.success },
    {
      key: "lateDueToApproval",
      label: "Late Due to Approval",
      color: chart.danger,
    },
    {
      key: "lateBeforeApproval",
      label: "Late Before Approval",
      color: chart.warning,
    },
  ];

  const counts = React.useMemo(() => {
    const c = summary.counts;
    let lateDays = 0;
    summary.impacts.forEach((i) => {
      if (i.category === "lateDueToApproval") lateDays += i.daysLate;
    });
    const startedBeforeDue = c.onTime + c.lateDueToApproval;
    return {
      ...c,
      startedBeforeDue,
      lateShare: startedBeforeDue
        ? Math.round((c.lateDueToApproval / startedBeforeDue) * 100)
        : 0,
      avgDaysLate: c.lateDueToApproval
        ? Math.round((lateDays / c.lateDueToApproval) * 10) / 10
        : 0,
    };
  }, [summary]);

  const donutData = categories
    .map((c) => ({ ...c, count: counts[c.key] }))
    .filter((d) => d.count > 0);

  const trend = React.useMemo(
    () => approvalImpactTrend(impacts, "month"),
    [impacts],
  );

  const lateRows = React.useMemo(
    (): LateRow[] =>
      impacts
        .filter((i) => i.category === "lateDueToApproval")
        .map((i) => ({
          bidNumber: i.bid.bidNumber,
          client: i.bid.opportunityInfo?.client || "-",
          dueDate: i.dueDate,
          started: i.startedDate.getTime(),
          finished: i.finishedDate.getTime(),
          daysLate: i.daysLate,
          slowestLabel: i.slowestSector?.sectorLabel || "-",
          slowestHours: i.slowestSector?.durationHours || 0,
        }))
        .sort((a, b) => b.daysLate - a.daysLate),
    [impacts],
  );

  const pendingStartedBeforeDue = pendingRisk.filter(
    (r) => r.startedBeforeDue,
  ).length;

  const axisTick = { fill: chart.tick, fontSize: 12 };
  const legendStyle = { fontSize: 12, color: chart.textSecondary };

  const columns = [
    {
      key: "bidNumber",
      header: "BID",
      render: (r: LateRow) => (
        <span className={styles.bidNumber}>
          {r.bidNumber}
          <ConfidentialLock bidNumber={r.bidNumber} />
        </span>
      ),
    },
    { key: "client", header: "Client" },
    {
      key: "dueDate",
      header: "Due Date",
      render: (r: LateRow) => formatDate(r.dueDate),
    },
    {
      key: "started",
      header: "Approval Started",
      sortable: true,
      render: (r: LateRow) => (
        <span className={styles.cellMuted}>
          {formatDateTime(new Date(r.started).toISOString())}
        </span>
      ),
    },
    {
      key: "finished",
      header: "Approval Finished",
      sortable: true,
      render: (r: LateRow) => (
        <span className={styles.cellMuted}>
          {formatDateTime(new Date(r.finished).toISOString())}
        </span>
      ),
    },
    {
      key: "daysLate",
      header: "Days Late",
      sortable: true,
      render: (r: LateRow) => (
        <span className={styles.daysLate}>{r.daysLate}d</span>
      ),
    },
    {
      key: "slowestHours",
      header: "Slowest Department",
      sortable: true,
      render: (r: LateRow) =>
        r.slowestHours > 0 ? (
          <span>
            <span className={styles.cellStrong}>{r.slowestLabel}</span>{" "}
            <span className={styles.cellMuted}>
              {formatElapsedHours(r.slowestHours)}
            </span>
          </span>
        ) : (
          "-"
        ),
    },
  ];

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>Approval Impact on Due Date</h2>
        <p className={styles.sectionSubtitle}>
          Final approved round compared to the due date in effect when the
          approval finished
        </p>
      </div>

      <div className={styles.kpiRow}>
        <KPICard
          variant="glass"
          label="Started Before Due"
          value={counts.startedBeforeDue}
          accentColor={chart.accentSecondary}
          subtitle={`of ${impacts.length} approved BIDs`}
        />
        <KPICard
          variant="glass"
          label="Late Due to Approval"
          value={counts.lateDueToApproval}
          accentColor={chart.danger}
          subtitle={
            counts.lateDueToApproval
              ? `${counts.lateShare}% of on-time starts, avg ${counts.avgDaysLate}d late`
              : "no BID closed late during approval"
          }
        />
        <KPICard
          variant="glass"
          label="Late Before Approval"
          value={counts.lateBeforeApproval}
          accentColor={chart.warning}
          subtitle="already past due when approval started"
        />
        <KPICard
          variant="glass"
          label="In Approval, Past Due"
          value={pendingRisk.length}
          accentColor={chart.info}
          subtitle={`now, ${pendingStartedBeforeDue} started before due date`}
        />
      </div>

      <div className={styles.chartsGrid2}>
        <GlassCard
          title="Due Date Outcome"
          subtitle="Approved BIDs by due date outcome"
          accentColor={chart.danger}
        >
          {impacts.length === 0 ? (
            <EmptyState
              title="No Approved BIDs"
              description="Approved BIDs with a due date will appear here."
            />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Tooltip content={<ChartTooltip hideLabel />} />
                <Pie
                  data={donutData}
                  dataKey="count"
                  nameKey="label"
                  innerRadius={66}
                  outerRadius={98}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {donutData.map((d) => (
                    <Cell key={d.key} fill={d.color} />
                  ))}
                  <Label
                    content={(props: LabelProps) => {
                      const vb = props.viewBox as
                        | { cx?: number; cy?: number }
                        | undefined;
                      const cx = vb?.cx || 0;
                      const cy = vb?.cy || 0;
                      return (
                        <g>
                          <text
                            x={cx}
                            y={cy - 4}
                            textAnchor="middle"
                            fill={chart.textPrimary}
                            style={{ fontSize: 26, fontWeight: 800 }}
                          >
                            {impacts.length}
                          </text>
                          <text
                            x={cx}
                            y={cy + 16}
                            textAnchor="middle"
                            fill={chart.textMuted}
                            style={{ fontSize: 11 }}
                          >
                            Approved
                          </text>
                        </g>
                      );
                    }}
                  />
                </Pie>
                <Legend wrapperStyle={legendStyle} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </GlassCard>

        <GlassCard
          title="Monthly Trend"
          subtitle="By month the approval finished"
          accentColor={chart.accentSecondary}
        >
          {trend.length === 0 ? (
            <EmptyState title="No Approved BIDs" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={trend}
                margin={{ top: 8, right: 16, bottom: 4, left: -8 }}
              >
                <CartesianGrid vertical={false} stroke={chart.grid} />
                <XAxis
                  dataKey="period"
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={axisTick}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: chart.referenceFill }}
                  content={<ChartTooltip />}
                />
                <Legend wrapperStyle={legendStyle} />
                {categories.map((c, i) => (
                  <Bar
                    key={c.key}
                    dataKey={c.key}
                    name={c.label}
                    stackId="impact"
                    fill={c.color}
                    radius={
                      i === categories.length - 1 ? [4, 4, 0, 0] : undefined
                    }
                    maxBarSize={44}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          )}
        </GlassCard>
      </div>

      <GlassCard
        title="BIDs Late Due to Approval"
        subtitle="Approval started on time but finished after the due date"
        accentColor={chart.danger}
        noBodyPadding
      >
        <div className={styles.tableWrap}>
          <DataTable<LateRow>
            data={lateRows}
            columns={columns}
            onRowClick={(r) => openBid(r.bidNumber)}
            emptyMessage="No BIDs closed late due to approval"
          />
        </div>
      </GlassCard>
    </div>
  );
};
