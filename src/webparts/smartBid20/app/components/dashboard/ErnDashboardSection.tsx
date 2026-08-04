/**
 * ErnDashboardSection — ERN KPIs and breakdowns for the Engineering Dashboard.
 * Combines linked ERNs on BIDs with live ERN data from the store.
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
import { IBid } from "../../models";
import { useErnStore } from "../../stores/useErnStore";
import { useChartTheme, categoricalColor } from "../../hooks/useChartTheme";
import { useStatusColors } from "../../hooks/useStatusColors";
import { getErnDeadlineState, getErnLinks } from "../../utils/ernHelpers";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { EmptyState } from "../common/EmptyState";
import { ChartTooltip } from "../charts/ChartTooltip";
import styles from "./ErnDashboardSection.module.scss";

interface ErnDashboardSectionProps {
  bids: IBid[];
}

export const ErnDashboardSection: React.FC<ErnDashboardSectionProps> = ({
  bids,
}) => {
  const erns = useErnStore((s) => s.erns);
  const loadAll = useErnStore((s) => s.loadAll);
  const theme = useChartTheme();
  const { getDivisionColor } = useStatusColors();

  React.useEffect(() => {
    if (erns.length === 0) loadAll().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ernStatusByTitle = React.useMemo(() => {
    const map: Record<string, { status: string; dueDate: string }> = {};
    erns.forEach((e) => {
      map[e.title] = { status: e.status, dueDate: e.dueDate };
    });
    return map;
  }, [erns]);

  // Flattened ERN links across all BIDs (Integrated BIDs contribute 2)
  const links = React.useMemo(() => {
    const out: {
      bid: IBid;
      ernNumber: string;
      division: string | null;
      status: string;
      dueDate: string;
      serviceLine: string;
    }[] = [];
    bids.forEach((b) => {
      getErnLinks(b).forEach((l) => {
        const live = ernStatusByTitle[l.ernNumber];
        out.push({
          bid: b,
          ernNumber: l.ernNumber,
          division: l.division,
          status: live?.status || l.ernStatus || "Unknown",
          dueDate: live?.dueDate || l.ernDueDate || "",
          serviceLine: l.division || b.serviceLine || "—",
        });
      });
    });
    return out;
  }, [bids, ernStatusByTitle]);

  const kpis = React.useMemo(() => {
    let open = 0;
    let dueSoon = 0;
    let overdue = 0;
    links.forEach((l) => {
      const s = l.status.toLowerCase();
      if (s !== "completed" && s !== "closed" && s !== "cancelled") open++;
      const state = getErnDeadlineState(l.dueDate, l.status);
      if (state === "due-soon") dueSoon++;
      if (state === "overdue") overdue++;
    });
    return { total: links.length, open, dueSoon, overdue };
  }, [links]);

  const byServiceLine = React.useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      map[l.serviceLine] = (map[l.serviceLine] || 0) + 1;
    });
    return Object.keys(map)
      .map((k) => ({ name: k, count: map[k] }))
      .sort((a, b) => b.count - a.count);
  }, [links]);

  const byDivision = React.useMemo(() => {
    const map: Record<string, number> = {};
    links.forEach((l) => {
      const key = l.bid.division || "—";
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

  return (
    <div className={styles.section}>
      <div className={styles.kpiRow}>
        <KPICard
          label="ERNs Linked"
          value={kpis.total}
          accentColor="var(--secondary-accent)"
          variant="glass"
        />
        <KPICard
          label="ERNs Open"
          value={kpis.open}
          accentColor="var(--info)"
          variant="glass"
        />
        <KPICard
          label="Due Soon"
          value={kpis.dueSoon}
          accentColor="var(--warning)"
          variant="glass"
        />
        <KPICard
          label="Overdue"
          value={kpis.overdue}
          accentColor="var(--danger)"
          variant="glass"
        />
      </div>

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
