/**
 * LaborTab — every labor line recorded in the BIDs (function, phase, people, days, hours and
 * cost), to see how roles were staffed and priced before. Cost is in BRL, as it is stored.
 */
import * as React from "react";
import { IBid } from "../../models";
import { buildLaborRows, ILaborRow } from "../../utils/priceHistory";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import { DataTable } from "../common/DataTable";
import { EmptyState } from "../common/EmptyState";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import styles from "./LaborTab.module.scss";

const MAX_ROWS = 400;
const ALL = "All";

function uniqueSorted(values: string[]): string[] {
  const seen: Record<string, boolean> = {};
  const out: string[] = [];
  values.forEach((v) => {
    if (v && !seen[v]) {
      seen[v] = true;
      out.push(v);
    }
  });
  return [ALL].concat(out.sort());
}

function average(values: number[]): number {
  return values.length ? values.reduce((s, v) => s + v, 0) / values.length : 0;
}

export interface LaborTabProps {
  bids: IBid[];
}

export const LaborTab: React.FC<LaborTabProps> = ({ bids }) => {
  const labor = React.useMemo(() => buildLaborRows(bids), [bids]);
  const [search, setSearch] = React.useState("");
  const [bidText, setBidText] = React.useState("");
  const [type, setType] = React.useState(ALL);
  const [phase, setPhase] = React.useState(ALL);

  const types = React.useMemo(
    () => uniqueSorted(labor.map((l) => l.type)),
    [labor],
  );
  const phases = React.useMemo(
    () => uniqueSorted(labor.map((l) => l.phase)),
    [labor],
  );

  const filtered = React.useMemo(() => {
    const s = search.trim().toLowerCase();
    const b = bidText.trim().toLowerCase();
    return labor.filter(
      (l) =>
        (!s || l.function.toLowerCase().indexOf(s) !== -1) &&
        (!b || l.bidNumber.toLowerCase().indexOf(b) !== -1) &&
        (type === ALL || l.type === type) &&
        (phase === ALL || l.phase === phase),
    );
  }, [labor, search, bidText, type, phase]);

  const hours = filtered.map((l) => l.totalHours).filter((v) => v > 0);
  const rates = filtered.map((l) => l.rateBRL).filter((v) => v > 0);
  const totalHours = hours.reduce((s, v) => s + v, 0);

  if (labor.length === 0) {
    return (
      <EmptyState
        variant="glass"
        title="No labor data"
        description="No BID has onshore or offshore hours recorded yet."
      />
    );
  }

  return (
    <div className={styles.stack}>
      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Search function</span>
          <input
            className={styles.input}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Filter by BID</span>
          <input
            className={styles.input}
            value={bidText}
            onChange={(e) => setBidText(e.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Type</span>
          <select
            className={styles.input}
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Phase</span>
          <select
            className={styles.input}
            value={phase}
            onChange={(e) => setPhase(e.target.value)}
          >
            {phases.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className={styles.kpis}>
        <KPICard
          label="Records"
          value={formatNumber(filtered.length)}
          accentColor="var(--primary-accent)"
        />
        <KPICard
          label="Total hours"
          value={hours.length ? formatNumber(Math.round(totalHours)) : "-"}
          accentColor="var(--secondary-accent)"
        />
        <KPICard
          label="Avg hours / role"
          value={hours.length ? average(hours).toFixed(1) : "-"}
          accentColor="var(--tertiary-accent)"
        />
        <KPICard
          label="Avg rate / hour"
          value={rates.length ? formatCurrency(average(rates), "BRL") : "-"}
          accentColor="var(--info)"
        />
      </div>

      <GlassCard
        noBodyPadding
        subtitle={
          filtered.length > MAX_ROWS
            ? `Showing the first ${MAX_ROWS} of ${filtered.length} lines - narrow the filters to see the rest.`
            : undefined
        }
      >
        <DataTable<ILaborRow>
          data={filtered.slice(0, MAX_ROWS)}
          emptyMessage="No labor lines match the filters."
          columns={[
            { key: "function", header: "Function", sortable: true },
            { key: "type", header: "Type", sortable: true },
            { key: "phase", header: "Phase", sortable: true },
            {
              key: "hoursPerDay",
              header: "Hours / day",
              sortable: true,
              render: (l) => (
                <span className={styles.num}>{l.hoursPerDay}</span>
              ),
            },
            {
              key: "people",
              header: "People",
              sortable: true,
              render: (l) => <span className={styles.num}>{l.people}</span>,
            },
            {
              key: "days",
              header: "Days",
              sortable: true,
              render: (l) => <span className={styles.num}>{l.days}</span>,
            },
            {
              key: "utilizationPercent",
              header: "Util.",
              sortable: true,
              render: (l) => (
                <span className={styles.num}>{l.utilizationPercent}%</span>
              ),
            },
            {
              key: "totalHours",
              header: "Total hours",
              sortable: true,
              render: (l) => (
                <span className={styles.num}>{formatNumber(l.totalHours)}</span>
              ),
            },
            {
              key: "rateBRL",
              header: "Rate / hour",
              sortable: true,
              render: (l) => (
                <span className={styles.num}>
                  {l.rateBRL > 0 ? formatCurrency(l.rateBRL, "BRL") : "-"}
                </span>
              ),
            },
            { key: "bidNumber", header: "BID", sortable: true },
          ]}
        />
      </GlassCard>
    </div>
  );
};
