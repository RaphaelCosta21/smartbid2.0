/**
 * DashboardBidTable — BID Tracker table of the Engineering Dashboard with its
 * own search, sortable headers and per-column faceted filters.
 */
import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from "lucide-react";
import { IBid, IErn } from "../../models";
import { useErnStore } from "../../stores/useErnStore";
import { useStatusColors } from "../../hooks/useStatusColors";
import { getPhaseDef } from "../../config/status.config";
import { formatDate, getDaysUntil, isPastDue } from "../../utils/formatters";
import {
  getDueFreezeDate,
  getEngineeringHours,
  isActiveBid,
} from "../../utils/bidHelpers";
import { formatHours } from "../../utils/engHoursHelpers";
import { buildErnLinkRows, getErnLinks } from "../../utils/ernHelpers";
import { getPhaseProgressByIndex } from "../../utils/phaseHelpers";
import { countFacets, withCounts } from "../../utils/facetHelpers";
import { StatusBadge } from "../common/StatusBadge";
import { ColumnFilter } from "../common/ColumnFilter";
import { ConfidentialLock } from "../bid/ConfidentialLock";
import { MultiSelectOption } from "../insights/MultiSelectDropdown";
import styles from "./DashboardBidTable.module.scss";

interface DashboardBidTableProps {
  bids: IBid[];
  onBidClick: (bidNumber: string) => void;
}

type FilterKey =
  | "client"
  | "division"
  | "creator"
  | "due"
  | "priority"
  | "phase"
  | "status"
  | "ern"
  | "engHours";

type SortKey =
  | "bidNumber"
  | "crmNumber"
  | "client"
  | "project"
  | "division"
  | "creator"
  | "due"
  | "priority"
  | "phase"
  | "status"
  | "ern"
  | "engHours"
  | "progress";

interface Column {
  key: SortKey;
  label: string;
  filter?: FilterKey;
  searchable?: boolean;
}

const COLUMNS: Column[] = [
  { key: "bidNumber", label: "BID #" },
  { key: "crmNumber", label: "CRM #" },
  { key: "client", label: "Client", filter: "client", searchable: true },
  { key: "project", label: "Project" },
  { key: "division", label: "Division", filter: "division" },
  { key: "creator", label: "Creator", filter: "creator", searchable: true },
  { key: "due", label: "Due Date", filter: "due" },
  { key: "priority", label: "Priority", filter: "priority" },
  { key: "phase", label: "Phase", filter: "phase" },
  { key: "status", label: "Status", filter: "status", searchable: true },
  { key: "ern", label: "ERN", filter: "ern" },
  { key: "engHours", label: "Eng. Hours", filter: "engHours" },
  { key: "progress", label: "Progress" },
];

const DUE_OPTIONS: MultiSelectOption[] = [
  { value: "overdue", label: "Overdue" },
  { value: "week", label: "Due in 7 days" },
  { value: "later", label: "Due later" },
  { value: "closed", label: "Closed on time" },
  { value: "none", label: "No due date" },
];

const ERN_OPTIONS: MultiSelectOption[] = [
  { value: "linked", label: "With ERN" },
  { value: "tbd", label: "TBD (no ERN)" },
  { value: "due-soon", label: "ERN due soon" },
  { value: "overdue", label: "ERN overdue" },
];

const ENG_HOURS_OPTIONS: MultiSelectOption[] = [
  { value: "with", label: "With Eng. Hours" },
  { value: "without", label: "No Eng. Hours" },
];

const EMPTY_FILTERS: Record<FilterKey, string[]> = {
  client: [],
  division: [],
  creator: [],
  due: [],
  priority: [],
  phase: [],
  status: [],
  ern: [],
  engHours: [],
};

const PRIORITY_RANK: Record<string, number> = {
  Urgent: 0,
  High: 1,
  Normal: 2,
  Medium: 2,
  Low: 3,
};

function dueBucket(b: IBid): string {
  if (!b.dueDate) return "none";
  const freeze = getDueFreezeDate(b);
  if (isPastDue(b.dueDate, freeze)) return "overdue";
  if (!isActiveBid(b)) return "closed";
  const days = getDaysUntil(b.dueDate);
  if (days === null) return "none";
  return days <= 7 ? "week" : "later";
}

export const DashboardBidTable: React.FC<DashboardBidTableProps> = ({
  bids,
  onBidClick,
}) => {
  const erns = useErnStore((s) => s.erns);
  const { getPhaseColor, getStatusColor, getPriorityColor, getDivisionColor } =
    useStatusColors();
  const [search, setSearch] = React.useState("");
  const [filters, setFilters] =
    React.useState<Record<FilterKey, string[]>>(EMPTY_FILTERS);
  const [sort, setSort] = React.useState<{
    key: SortKey;
    dir: "asc" | "desc";
  } | null>(null);

  const liveByTitle = React.useMemo(() => {
    const map: Record<string, IErn> = {};
    erns.forEach((e) => {
      map[e.title] = e;
    });
    return map;
  }, [erns]);

  // Per-BID ERN facet values: linked/tbd + live deadline states
  const ernStates = React.useMemo(() => {
    const map: Record<string, string[]> = {};
    bids.forEach((b) => {
      const rows = buildErnLinkRows([b], liveByTitle);
      if (rows.length === 0) {
        map[b.bidNumber] = ["tbd"];
        return;
      }
      const values = ["linked"];
      rows.forEach((r) => {
        if (r.deadline === "due-soon" || r.deadline === "overdue") {
          if (values.indexOf(r.deadline) < 0) values.push(r.deadline);
        }
      });
      map[b.bidNumber] = values;
    });
    return map;
  }, [bids, liveByTitle]);

  const pickers = React.useMemo<
    Record<FilterKey, (b: IBid) => string | string[]>
  >(
    () => ({
      client: (b) => b.opportunityInfo?.client || "",
      division: (b) => b.division || "",
      creator: (b) => (b.creator?.email || "").toLowerCase(),
      due: dueBucket,
      priority: (b) => b.priority || "",
      phase: (b) => b.currentPhase || "",
      status: (b) => b.currentStatus || "",
      ern: (b) => ernStates[b.bidNumber] || ["tbd"],
      engHours: (b) => (getEngineeringHours(b) > 0 ? "with" : "without"),
    }),
    [ernStates],
  );

  const searched = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return bids;
    return bids.filter((b) => {
      const hay = [
        b.bidNumber,
        b.crmNumber,
        b.opportunityInfo?.client,
        b.opportunityInfo?.projectName,
        b.creator?.name,
        ...getErnLinks(b).map((l) => l.ernNumber),
      ]
        .join(" ")
        .toLowerCase();
      return hay.indexOf(q) >= 0;
    });
  }, [bids, search]);

  const passes = React.useCallback(
    (b: IBid, skip?: FilterKey): boolean =>
      (Object.keys(filters) as FilterKey[]).every((key) => {
        const selected = filters[key];
        if (key === skip || selected.length === 0) return true;
        const v = pickers[key](b);
        const values = Array.isArray(v) ? v : [v];
        return values.some((x) => selected.indexOf(x) >= 0);
      }),
    [filters, pickers],
  );

  const facetCounts = React.useMemo(
    () => countFacets(searched, pickers, (b, skip) => passes(b, skip)),
    [searched, pickers, passes],
  );

  const options = React.useMemo(() => {
    const clients: Record<string, boolean> = {};
    const divisions: Record<string, boolean> = {};
    const creators: Record<string, string> = {};
    const priorities: Record<string, boolean> = {};
    const phases: Record<string, boolean> = {};
    const statuses: Record<string, boolean> = {};
    bids.forEach((b) => {
      if (b.opportunityInfo?.client) clients[b.opportunityInfo.client] = true;
      if (b.division) divisions[b.division] = true;
      const email = (b.creator?.email || "").toLowerCase();
      if (email && !creators[email]) creators[email] = b.creator.name || email;
      if (b.priority) priorities[b.priority] = true;
      if (b.currentPhase) phases[b.currentPhase] = true;
      if (b.currentStatus) statuses[b.currentStatus] = true;
    });
    const sorted = (m: Record<string, unknown>): string[] =>
      Object.keys(m).sort((a, b) => a.localeCompare(b));
    const out: Record<FilterKey, MultiSelectOption[]> = {
      client: sorted(clients).map((v) => ({ value: v, label: v })),
      division: sorted(divisions).map((v) => ({
        value: v,
        label: v,
        color: getDivisionColor(v),
      })),
      creator: Object.keys(creators)
        .map((v) => ({ value: v, label: creators[v] }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      due: DUE_OPTIONS,
      priority: Object.keys(priorities)
        .sort(
          (a, b) =>
            (PRIORITY_RANK[a] ?? 9) - (PRIORITY_RANK[b] ?? 9) ||
            a.localeCompare(b),
        )
        .map((v) => ({ value: v, label: v, color: getPriorityColor(v) })),
      phase: sorted(phases).map((v) => ({
        value: v,
        label: getPhaseDef(v)?.label || v,
        color: getPhaseColor(v),
      })),
      status: sorted(statuses).map((v) => ({
        value: v,
        label: v,
        color: getStatusColor(v),
      })),
      ern: ERN_OPTIONS,
      engHours: ENG_HOURS_OPTIONS,
    };
    return out;
  }, [bids, getDivisionColor, getPriorityColor, getPhaseColor, getStatusColor]);

  const rows = React.useMemo(() => {
    const filtered = searched.filter((b) => passes(b));
    if (!sort) return filtered;
    const value = (b: IBid): string | number => {
      switch (sort.key) {
        case "bidNumber":
          return b.bidNumber || "";
        case "crmNumber":
          return b.crmNumber || "";
        case "client":
          return (b.opportunityInfo?.client || "").toLowerCase();
        case "project":
          return (b.opportunityInfo?.projectName || "").toLowerCase();
        case "division":
          return b.division || "";
        case "creator":
          return (b.creator?.name || "").toLowerCase();
        case "due": {
          const d = getDaysUntil(b.dueDate, new Date(0));
          return d === null ? 1e9 : d;
        }
        case "priority":
          return PRIORITY_RANK[b.priority] ?? 9;
        case "phase":
          return getPhaseProgressByIndex(b);
        case "status":
          return b.currentStatus || "";
        case "ern":
          return getErnLinks(b)[0]?.ernNumber || "~";
        case "engHours":
          return getEngineeringHours(b);
        case "progress":
          return getPhaseProgressByIndex(b);
        default:
          return "";
      }
    };
    const dir = sort.dir === "asc" ? 1 : -1;
    return filtered.slice().sort((a, b) => {
      const va = value(a);
      const vb = value(b);
      if (typeof va === "number" && typeof vb === "number") {
        return (va - vb) * dir;
      }
      return String(va).localeCompare(String(vb)) * dir;
    });
  }, [searched, passes, sort]);

  const hasColumnFilters = (Object.keys(filters) as FilterKey[]).some(
    (k) => filters[k].length > 0,
  );
  const hasAny = hasColumnFilters || !!search.trim();

  const toggleSort = (key: SortKey): void => {
    setSort((s) =>
      !s || s.key !== key
        ? { key, dir: "asc" }
        : s.dir === "asc"
          ? { key, dir: "desc" }
          : null,
    );
  };

  return (
    <div className={styles.tableSection}>
      <div className={styles.tableHeader}>
        <div className={styles.titleWrap}>
          <h3>BID Tracker</h3>
          <span className={styles.count}>
            <strong>{rows.length}</strong>
            {hasAny ? ` of ${bids.length}` : ""}{" "}
            {bids.length === 1 ? "BID" : "BIDs"}
          </span>
        </div>
        <div className={styles.tools}>
          <div className={styles.search}>
            <Search size={14} className={styles.searchIcon} />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search BID #, CRM, client, project, ERN..."
              value={search}
              onChange={(e) => setSearch(e.currentTarget.value)}
              aria-label="Search BID Tracker"
            />
            {search && (
              <button
                type="button"
                className={styles.searchClearBtn}
                onClick={() => setSearch("")}
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>
          {hasColumnFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => setFilters(EMPTY_FILTERS)}
            >
              <X size={14} /> Clear column filters
            </button>
          )}
        </div>
      </div>
      <div className={styles.tableScroll}>
        <table className={styles.bidTable}>
          <thead>
            <tr>
              {COLUMNS.map((c) => {
                const active = sort && sort.key === c.key ? sort.dir : null;
                return (
                  <th
                    key={c.key}
                    aria-sort={
                      active === "asc"
                        ? "ascending"
                        : active === "desc"
                          ? "descending"
                          : "none"
                    }
                  >
                    <span className={styles.thInner}>
                      <button
                        type="button"
                        className={`${styles.sortBtn} ${active ? styles.sorted : ""}`}
                        onClick={() => toggleSort(c.key)}
                        title={`Sort by ${c.label}`}
                      >
                        {c.label}
                        {active === "asc" ? (
                          <ArrowUp size={11} />
                        ) : active === "desc" ? (
                          <ArrowDown size={11} />
                        ) : (
                          <ArrowUpDown size={11} className={styles.sortIdle} />
                        )}
                      </button>
                      {c.filter && (
                        <ColumnFilter
                          label={c.label}
                          options={withCounts(
                            options[c.filter],
                            facetCounts[c.filter],
                          )}
                          selected={filters[c.filter]}
                          onChange={(v) =>
                            setFilters((f) => ({
                              ...f,
                              [c.filter as FilterKey]: v,
                            }))
                          }
                          searchable={c.searchable}
                        />
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLUMNS.length} className={styles.emptyRow}>
                  No BIDs match the current search and filters.
                </td>
              </tr>
            ) : (
              rows.map((bid) => {
                const overdue = isPastDue(bid.dueDate, getDueFreezeDate(bid));
                const phaseDef = getPhaseDef(bid.currentPhase);
                const links = getErnLinks(bid);
                const engHours = getEngineeringHours(bid);
                return (
                  <tr
                    key={bid.bidNumber}
                    className={styles.clickableRow}
                    onClick={() => onBidClick(bid.bidNumber)}
                  >
                    <td className={styles.mono}>
                      {bid.bidNumber}
                      <ConfidentialLock bid={bid} />
                    </td>
                    <td className={styles.mono}>{bid.crmNumber || "-"}</td>
                    <td>{bid.opportunityInfo?.client || "-"}</td>
                    <td className={styles.projectCell}>
                      {bid.opportunityInfo?.projectName || "-"}
                    </td>
                    <td>
                      <StatusBadge
                        status={bid.division}
                        color={getDivisionColor(bid.division)}
                      />
                    </td>
                    <td>{bid.creator?.name || "-"}</td>
                    <td className={overdue ? styles.overdue : undefined}>
                      {bid.dueDate ? formatDate(bid.dueDate, "MMM d") : "-"}
                    </td>
                    <td>
                      <StatusBadge
                        status={bid.priority}
                        color={getPriorityColor(bid.priority)}
                      />
                    </td>
                    <td>
                      {phaseDef ? (
                        <StatusBadge
                          status={phaseDef.label}
                          color={getPhaseColor(bid.currentPhase)}
                        />
                      ) : null}
                    </td>
                    <td>
                      <StatusBadge
                        status={bid.currentStatus}
                        color={getStatusColor(bid.currentStatus)}
                      />
                    </td>
                    <td>
                      {links.length === 0 ? (
                        <StatusBadge status="TBD" color="var(--warning)" />
                      ) : (
                        <span className={styles.ernList}>
                          {links.map((l) => (
                            <span key={l.ernNumber} className={styles.mono}>
                              {l.ernNumber}
                              {l.division ? ` · ${l.division}` : ""}
                            </span>
                          ))}
                        </span>
                      )}
                    </td>
                    <td>
                      {engHours > 0 ? (
                        <span className={styles.engHours}>
                          {formatHours(engHours)}
                        </span>
                      ) : (
                        <span className={styles.muted}>-</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.progressTrack}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${getPhaseProgressByIndex(bid)}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
