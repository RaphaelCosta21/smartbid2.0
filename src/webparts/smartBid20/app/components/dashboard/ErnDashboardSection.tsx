/**
 * ErnDashboardSection — ERN KPIs ("status", live) and breakdown charts
 * ("breakdown") for the Engineering Dashboard. Live ERN list data wins over the
 * snapshot stored on the BID; the dashboard sync keeps the ERN store fresh.
 */
import * as React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { IBid, IErn } from "../../models";
import { useErnStore } from "../../stores/useErnStore";
import { useChartTheme, categoricalColor } from "../../hooks/useChartTheme";
import { useStatusColors } from "../../hooks/useStatusColors";
import { buildErnLinkRows } from "../../utils/ernHelpers";
import { getDaysUntil } from "../../utils/formatters";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { EmptyState } from "../common/EmptyState";
import { ChartTooltip } from "../charts/ChartTooltip";
import styles from "./ErnDashboardSection.module.scss";

interface ErnDashboardSectionProps {
  bids: IBid[];
  view: "status" | "breakdown";
}

export const ErnDashboardSection: React.FC<ErnDashboardSectionProps> = ({
  bids,
  view,
}) => {
  const erns = useErnStore((s) => s.erns);
  const theme = useChartTheme();
  const { getDivisionColor } = useStatusColors();

  const liveByTitle = React.useMemo(() => {
    const map: Record<string, IErn> = {};
    erns.forEach((e) => {
      map[e.title] = e;
    });
    return map;
  }, [erns]);

  // Unique ERNs across the BIDs (Integrated BIDs contribute 2)
  const links = React.useMemo(
    () => buildErnLinkRows(bids, liveByTitle),
    [bids, liveByTitle],
  );

  const kpis = React.useMemo(() => {
    let open = 0;
    let onHold = 0;
    let dueSoon = 0;
    let overdue = 0;
    let maxLate = 0;
    links.forEach((l) => {
      if (!l.closed) open++;
      if (!l.closed && l.onHold) onHold++;
      if (l.deadline === "due-soon") dueSoon++;
      if (l.deadline === "overdue") {
        overdue++;
        maxLate = Math.max(maxLate, -(getDaysUntil(l.dueDate) || 0));
      }
    });
    return {
      total: links.length,
      closed: links.length - open,
      open,
      onHold,
      dueSoon,
      overdue,
      maxLate,
    };
  }, [links]);

  const byServiceLine = React.useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      const key = l.division || l.bid.serviceLine || "-";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.keys(map)
      .map((k) => ({ name: k, count: map[k] }))
      .sort((a, b) => b.count - a.count);
  }, [links]);

  const byDivision = React.useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      const key = l.bid.division || "-";
      map[key] = (map[key] || 0) + 1;
    });
    return Object.keys(map).map((k) => ({
      name: k,
      count: map[k],
      color: getDivisionColor(k),
    }));
  }, [links, getDivisionColor]);

  const byStatus = React.useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      map[l.status] = (map[l.status] || 0) + 1;
    });
    return Object.keys(map).map((k, i) => ({
      name: k,
      value: map[k],
      color: categoricalColor(i),
    }));
  }, [links]);

  if (view === "status") {
    return (
      <div className={styles.kpiRow}>
        <KPICard
          label="ERNs Linked"
          value={kpis.total}
          accentColor={theme.accentSecondary}
          variant="glass"
          subtitle={`${kpis.closed} closed`}
        />
        <KPICard
          label="ERNs Open"
          value={kpis.open}
          accentColor={theme.info}
          variant="glass"
          subtitle={kpis.onHold > 0 ? `${kpis.onHold} on hold` : "In progress"}
        />
        <KPICard
          label="Due Soon"
          value={kpis.dueSoon}
          accentColor={theme.warning}
          variant="glass"
          subtitle={`Within ${SHAREPOINT_CONFIG.ern.dueSoonDays} days`}
        />
        <KPICard
          label="Overdue"
          value={kpis.overdue}
          accentColor={theme.danger}
          variant="glass"
          subtitle={
            kpis.overdue > 0 ? `Oldest ${kpis.maxLate}d late` : "None late"
          }
        />
      </div>
    );
  }

  return (
    <div className={styles.section}>
      {kpis.total === 0 ? (
        <GlassCard title="ERN Overview">
          <EmptyState
            variant="glass"
            title="No ERNs yet"
            description="ERNs linked to BIDs will show up here."
          />
        </GlassCard>
      ) : (
        <div className={styles.chartsRow}>
          <GlassCard title="ERNs by Service Line">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={byServiceLine}
                layout="vertical"
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid horizontal={false} stroke={theme.grid} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  stroke={theme.axis}
                  tick={{ fill: theme.tick, fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={110}
                  stroke={theme.axis}
                  tick={{ fill: theme.tick, fontSize: 12 }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: theme.referenceFill }}
                />
                <Bar
                  dataKey="count"
                  name="ERNs"
                  fill={theme.accent}
                  radius={[0, 6, 6, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard title="ERNs by Division">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart
                data={byDivision}
                margin={{ left: 8, right: 16, top: 8, bottom: 8 }}
              >
                <CartesianGrid vertical={false} stroke={theme.grid} />
                <XAxis
                  dataKey="name"
                  stroke={theme.axis}
                  tick={{ fill: theme.tick, fontSize: 12 }}
                />
                <YAxis
                  allowDecimals={false}
                  stroke={theme.axis}
                  tick={{ fill: theme.tick, fontSize: 12 }}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: theme.referenceFill }}
                />
                <Bar dataKey="count" name="ERNs" radius={[6, 6, 0, 0]}>
                  {byDivision.map((d) => (
                    <Cell key={d.name} fill={d.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          <GlassCard title="ERNs by Status">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={byStatus}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={2}
                >
                  {byStatus.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      )}
    </div>
  );
};
