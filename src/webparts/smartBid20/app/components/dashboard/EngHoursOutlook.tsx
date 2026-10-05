/**
 * EngHoursOutlook — engineering-hours demand: what is confirmed (Won), what may
 * come (pipeline, weighted by win chance), and when (request month or operation start).
 */
import * as React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import { IBid } from "../../models";
import { useChartTheme } from "../../hooks/useChartTheme";
import { useResultStatus } from "../../hooks/useResultStatus";
import {
  buildEngHoursItems,
  buildEngHoursTimeline,
  EngHoursTimelineMode,
  formatHours,
  NO_DATE_KEY,
} from "../../utils/engHoursHelpers";
import { getWinProbability, IWinRateIndex } from "../../utils/winProbability";
import { OPEN_STATUS } from "../../utils/reportHelpers";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { EmptyState } from "../common/EmptyState";
import { ChartTooltip } from "../charts/ChartTooltip";
import { SegmentedControl, SegmentOption } from "../insights/SegmentedControl";
import { EngHoursRanking } from "./EngHoursRanking";
import styles from "./EngHoursOutlook.module.scss";

interface EngHoursOutlookProps {
  bids: IBid[];
  winIndex: IWinRateIndex;
  onBidClick: (bidNumber: string) => void;
}

const MODE_SEGMENTS: SegmentOption<EngHoursTimelineMode>[] = [
  { value: "created", label: "Request month" },
  { value: "operationStart", label: "Operation start" },
];

const hoursFormatter = (v: number | string | undefined): string =>
  formatHours(Number(v) || 0);

export const EngHoursOutlook: React.FC<EngHoursOutlookProps> = ({
  bids,
  winIndex,
  onBidClick,
}) => {
  const t = useChartTheme();
  const { getResult, getColor, getLabel } = useResultStatus();
  const [mode, setMode] = React.useState<EngHoursTimelineMode>("created");

  const items = React.useMemo(
    () =>
      buildEngHoursItems(bids, getResult, (b) => {
        const p = getWinProbability(b, winIndex);
        return p ? p.value / 100 : null;
      }),
    [bids, getResult, winIndex],
  );

  const totals = React.useMemo(() => {
    const acc = {
      won: 0,
      wonCount: 0,
      pipeline: 0,
      pipelineCount: 0,
      inEngineering: 0,
      expectedPipeline: 0,
      noChance: 0,
      lost: 0,
      lostCount: 0,
      all: 0,
    };
    items.forEach((it) => {
      acc.all += it.hours;
      if (it.bucket === "won") {
        acc.won += it.hours;
        acc.wonCount++;
      } else if (it.bucket === "pipeline") {
        acc.pipeline += it.hours;
        acc.pipelineCount++;
        if (it.result === OPEN_STATUS) acc.inEngineering += it.hours;
        if (it.chance === null) acc.noChance++;
        else acc.expectedPipeline += it.hours * it.chance;
      } else {
        acc.lost += it.hours;
        acc.lostCount++;
      }
    });
    return acc;
  }, [items]);

  const timeline = React.useMemo(
    () => buildEngHoursTimeline(items, mode),
    [items, mode],
  );

  const noDate = timeline.find((r) => r.key === NO_DATE_KEY);
  const datedCount = timeline.reduce(
    (s, r) => (r.key === NO_DATE_KEY ? s : s + r.bidCount),
    0,
  );
  const currentMonthLabel = format(new Date(), "MMM yy");
  const showToday =
    mode === "operationStart" &&
    timeline.some((r) => r.label === currentMonthLabel);

  const byResult = React.useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((it) => {
      map[it.result] = (map[it.result] || 0) + it.hours;
    });
    return Object.keys(map)
      .map((k) => ({
        value: k,
        name: getLabel(k),
        hours: Math.round(map[k]),
        color: getColor(k),
      }))
      .sort((a, b) => b.hours - a.hours);
  }, [items, getLabel, getColor]);

  if (items.length === 0) {
    return (
      <GlassCard title="Engineering Hours Outlook">
        <EmptyState
          variant="glass"
          title="No engineering hours"
          description="No BIDs with engineering hours match the current filters."
        />
      </GlassCard>
    );
  }

  const pct = (h: number): number =>
    totals.all > 0 ? Math.round((h / totals.all) * 100) : 0;

  return (
    <div className={styles.section}>
      <div className={styles.kpiRow}>
        <KPICard
          label="Won - Eng. Hours"
          value={formatHours(totals.won)}
          accentColor={t.success}
          variant="glass"
          subtitle={`${totals.wonCount} BID${totals.wonCount === 1 ? "" : "s"} · confirmed demand`}
        />
        <KPICard
          label="Pipeline - Eng. Hours"
          value={formatHours(totals.pipeline)}
          accentColor={t.accentSecondary}
          variant="glass"
          subtitle={`${totals.pipelineCount} BIDs · ${formatHours(totals.inEngineering)} still in engineering`}
        />
        <KPICard
          label="Expected Demand"
          value={formatHours(totals.won + totals.expectedPipeline)}
          accentColor={t.accentTertiary}
          variant="glass"
          subtitle={
            totals.noChance > 0
              ? `Won + pipeline x win chance (${totals.noChance} without history)`
              : "Won + pipeline x win chance"
          }
        />
        <KPICard
          label="Lost / Canceled"
          value={formatHours(totals.lost)}
          accentColor={t.danger}
          variant="glass"
          subtitle={`${totals.lostCount} BID${totals.lostCount === 1 ? "" : "s"} · ${pct(totals.lost)}% of estimated hours`}
        />
      </div>

      <GlassCard
        title="Engineering Hours by Month"
        subtitle={
          mode === "created"
            ? "Won and pipeline hours by BID request month"
            : "Won and pipeline hours by Operation Start month (when the demand lands)"
        }
        actions={
          <SegmentedControl<EngHoursTimelineMode>
            value={mode}
            segments={MODE_SEGMENTS}
            onChange={setMode}
            size="sm"
            ariaLabel="Timeline date"
          />
        }
      >
        {timeline.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No won or pipeline hours"
            description="Only lost or canceled BIDs match the current filters."
          />
        ) : (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart
                data={timeline}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid vertical={false} stroke={t.grid} />
                <XAxis
                  dataKey="label"
                  stroke={t.axis}
                  tick={{ fill: t.tick, fontSize: 12 }}
                />
                <YAxis
                  stroke={t.axis}
                  tick={{ fill: t.tick, fontSize: 12 }}
                  tickFormatter={(v: number) => v.toLocaleString()}
                  label={{
                    value: "Hours",
                    angle: -90,
                    position: "insideLeft",
                    fill: t.textMuted,
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  content={<ChartTooltip valueFormatter={hoursFormatter} />}
                  cursor={{ fill: t.referenceFill }}
                />
                <Legend
                  wrapperStyle={{ fontSize: 12, color: t.textSecondary }}
                />
                {showToday && (
                  <ReferenceLine
                    x={currentMonthLabel}
                    stroke={t.textMuted}
                    strokeDasharray="4 4"
                    label={{
                      value: "Today",
                      position: "top",
                      fill: t.textMuted,
                      fontSize: 11,
                    }}
                  />
                )}
                <Bar dataKey="won" name="Won" stackId="h" fill={t.success} />
                <Bar
                  dataKey="awaiting"
                  name="Awaiting result"
                  stackId="h"
                  fill={t.warning}
                />
                <Bar
                  dataKey="inEngineering"
                  name="In engineering"
                  stackId="h"
                  fill={t.accentSecondary}
                  radius={[6, 6, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="expected"
                  name="Expected"
                  stroke={t.accentTertiary}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
            {mode === "operationStart" && noDate && (
              <div className={styles.note}>
                {noDate.bidCount} of {datedCount + noDate.bidCount} BIDs (
                {formatHours(
                  noDate.won + noDate.awaiting + noDate.inEngineering,
                )}
                ) have no Operation Start Date and are shown as "No date".
              </div>
            )}
          </>
        )}
      </GlassCard>

      <div className={styles.row}>
        <EngHoursRanking items={items} onBidClick={onBidClick} />

        <GlassCard
          title="Hours by Follow-up Result"
          subtitle="Share of estimated engineering hours"
        >
          <div className={styles.donutWrap}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={byResult}
                  dataKey="hours"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={92}
                  paddingAngle={2}
                >
                  {byResult.map((r) => (
                    <Cell key={r.value} fill={r.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <ChartTooltip hideLabel valueFormatter={hoursFormatter} />
                  }
                />
              </PieChart>
            </ResponsiveContainer>
            <div className={styles.donutCenter}>
              <span className={styles.donutValue}>
                {Math.round(totals.all).toLocaleString()}
              </span>
              <span className={styles.donutUnit}>total hours</span>
            </div>
          </div>
          <ul className={styles.legend}>
            {byResult.map((r) => (
              <li key={r.value} className={styles.legendItem}>
                <span
                  className={styles.legendDot}
                  style={{ background: r.color }}
                />
                <span className={styles.legendLabel}>{r.name}</span>
                <span className={styles.legendValue}>
                  {formatHours(r.hours)}
                </span>
                <span className={styles.legendPct}>{pct(r.hours)}%</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </div>
  );
};
