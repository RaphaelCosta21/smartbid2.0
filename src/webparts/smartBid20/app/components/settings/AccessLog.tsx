/**
 * AccessLog — who opened SmartBid / the PeopleSoft Consulting External View.
 * Shown in System Configuration to the super admin master only.
 */
import * as React from "react";
import styles from "./AccessLog.module.scss";
import { AccessLogArea, IAccessLogEntry } from "../../models";
import { AccessLogService } from "../../services/AccessLogService";
import { DataTable } from "../common/DataTable";
import { KPICard } from "../common/KPICard";
import { SkeletonLoader } from "../common/SkeletonLoader";
import { EmptyState } from "../common/EmptyState";
import { formatDateTime, formatRelativeTime } from "../../utils/formatters";

type AreaFilter = "all" | AccessLogArea;
type PeriodFilter = "today" | "7" | "30" | "all";
type ViewMode = "accesses" | "users";

const AREA_LABELS: Record<AccessLogArea, string> = {
  smartbid: "SmartBid",
  "peoplesoft-external": "PeopleSoft External View",
};

interface IUserSummary {
  email: string;
  userName: string;
  accesses: number;
  smartbid: number;
  peoplesoft: number;
  lastAccess: string;
}

const periodStart = (period: PeriodFilter): number => {
  if (period === "all") return 0;
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  if (period !== "today") d.setDate(d.getDate() - (Number(period) - 1));
  return d.getTime();
};

const AreaBadge: React.FC<{ area: AccessLogArea }> = ({ area }) => (
  <span
    className={`${styles.areaBadge} ${
      area === "peoplesoft-external" ? styles.areaPeoplesoft : styles.areaApp
    }`}
  >
    {AREA_LABELS[area]}
  </span>
);

export const AccessLog: React.FC = () => {
  const [entries, setEntries] = React.useState<IAccessLogEntry[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [area, setArea] = React.useState<AreaFilter>("all");
  const [period, setPeriod] = React.useState<PeriodFilter>("7");
  const [view, setView] = React.useState<ViewMode>("accesses");

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await AccessLogService.ensureList();
      setEntries(await AccessLogService.getRecent());
    } catch (err) {
      console.error("Failed to load access log:", err);
      setError(
        "Could not load the access log. Creating the list needs Manage Lists rights on the site.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    load().catch(() => undefined);
  }, [load]);

  const filtered = React.useMemo(() => {
    const from = periodStart(period);
    const q = search.trim().toLowerCase();
    return entries.filter(
      (e) =>
        (area === "all" || e.area === area) &&
        new Date(e.accessedAt).getTime() >= from &&
        (!q ||
          e.email.toLowerCase().indexOf(q) >= 0 ||
          e.userName.toLowerCase().indexOf(q) >= 0),
    );
  }, [entries, search, area, period]);

  const users = React.useMemo(() => {
    const map: Record<string, IUserSummary> = {};
    filtered.forEach((e) => {
      const u =
        map[e.email] ||
        (map[e.email] = {
          email: e.email,
          userName: e.userName,
          accesses: 0,
          smartbid: 0,
          peoplesoft: 0,
          lastAccess: e.accessedAt,
        });
      u.accesses++;
      if (e.area === "peoplesoft-external") u.peoplesoft++;
      else u.smartbid++;
      if (e.accessedAt > u.lastAccess) u.lastAccess = e.accessedAt;
    });
    return Object.keys(map)
      .map((k) => map[k])
      .sort((a, b) => (a.lastAccess < b.lastAccess ? 1 : -1));
  }, [filtered]);

  const peoplesoftEntries = filtered.filter(
    (e) => e.area === "peoplesoft-external",
  );
  const peoplesoftUsers = users.filter((u) => u.peoplesoft > 0).length;

  return (
    <div className={styles.accessLog}>
      <div className={styles.header}>
        <div>
          <h3>Access Log</h3>
          <p>
            Who opened SmartBid and the PeopleSoft Consulting External View. One
            row per app load; reloads within 15 minutes are not repeated.
            Visible only to the super admin master.
          </p>
        </div>
        <button
          className={styles.refreshBtn}
          onClick={() => load().catch(() => undefined)}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          type="search"
          placeholder="Search name or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className={styles.select}
          value={area}
          onChange={(e) => setArea(e.target.value as AreaFilter)}
          aria-label="Area"
        >
          <option value="all">All areas</option>
          <option value="smartbid">{AREA_LABELS.smartbid}</option>
          <option value="peoplesoft-external">
            {AREA_LABELS["peoplesoft-external"]}
          </option>
        </select>
        <select
          className={styles.select}
          value={period}
          onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
          aria-label="Period"
        >
          <option value="today">Today</option>
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="all">All loaded</option>
        </select>
        <div className={styles.segmented} role="group" aria-label="View">
          <button
            className={view === "accesses" ? styles.segActive : ""}
            onClick={() => setView("accesses")}
          >
            Accesses
          </button>
          <button
            className={view === "users" ? styles.segActive : ""}
            onClick={() => setView("users")}
          >
            By user
          </button>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader height={40} count={6} />
      ) : error ? (
        <EmptyState
          title="Access log unavailable"
          description={error}
          actionLabel="Try again"
          onAction={() => load().catch(() => undefined)}
        />
      ) : (
        <>
          <div className={styles.kpis}>
            <KPICard label="Accesses" value={filtered.length} compact />
            <KPICard label="Unique users" value={users.length} compact />
            <KPICard
              label="PeopleSoft External accesses"
              value={peoplesoftEntries.length}
              accentColor="var(--secondary-accent)"
              compact
            />
            <KPICard
              label="PeopleSoft External users"
              value={peoplesoftUsers}
              accentColor="var(--secondary-accent)"
              compact
            />
          </div>

          {view === "accesses" ? (
            <DataTable<IAccessLogEntry>
              data={filtered}
              emptyMessage="No accesses in this period"
              columns={[
                {
                  key: "accessedAt",
                  header: "Date & time",
                  sortable: true,
                  width: 170,
                  render: (e) => formatDateTime(e.accessedAt),
                },
                { key: "userName", header: "Name", sortable: true },
                { key: "email", header: "Email", sortable: true },
                {
                  key: "area",
                  header: "Area",
                  sortable: true,
                  render: (e) => <AreaBadge area={e.area} />,
                },
              ]}
            />
          ) : (
            <DataTable<IUserSummary>
              data={users}
              emptyMessage="No users in this period"
              columns={[
                { key: "userName", header: "Name", sortable: true },
                { key: "email", header: "Email", sortable: true },
                { key: "accesses", header: "Accesses", sortable: true },
                { key: "smartbid", header: "SmartBid", sortable: true },
                {
                  key: "peoplesoft",
                  header: "PeopleSoft External",
                  sortable: true,
                },
                {
                  key: "lastAccess",
                  header: "Last access",
                  sortable: true,
                  render: (u) => (
                    <span title={formatRelativeTime(u.lastAccess)}>
                      {formatDateTime(u.lastAccess)}
                    </span>
                  ),
                },
              ]}
            />
          )}
        </>
      )}
    </div>
  );
};
