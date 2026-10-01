import * as React from "react";
import { useNavigate } from "react-router-dom";
import { LayoutList, Search, SquareKanban, Table2, X } from "lucide-react";
import { useBidStore, ViewMode } from "../stores/useBidStore";
import { useBids } from "../hooks/useBids";
import { useStatusColors } from "../hooks/useStatusColors";
import {
  getDueFreezeDate,
  isActiveBid,
  isOverdueBid,
} from "../utils/bidHelpers";
import { getPhaseProgressByIndex } from "../utils/phaseHelpers";
import { getErnLinks } from "../utils/ernHelpers";
import { useConfigStore } from "../stores/useConfigStore";
import { BID_PHASES, getPhaseDef } from "../config/status.config";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { BidCard } from "../components/bid/BidCard";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../components/insights/MultiSelectDropdown";
import { BidPriority, Division, IBid, IQuickNote } from "../models";
import { BidService } from "../services/BidService";
import { useErnStore } from "../stores/useErnStore";
import { useDebounce } from "../hooks/useDebounce";
import { formatDate, isPastDue } from "../utils/formatters";
import styles from "./BidTrackerPage.module.scss";

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: React.ReactNode }[] =
  [
    { mode: "kanban", label: "Kanban", icon: <SquareKanban size={14} /> },
    { mode: "list", label: "List", icon: <LayoutList size={14} /> },
    { mode: "table", label: "Table", icon: <Table2 size={14} /> },
  ];

const PRIORITIES: BidPriority[] = ["Urgent", "Normal", "Low"];

function uniqueSorted(values: (string | undefined)[]): string[] {
  const seen: Record<string, true> = {};
  values.forEach((v) => {
    if (v) seen[v] = true;
  });
  return Object.keys(seen).sort((a, b) => a.localeCompare(b));
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#06b6d4",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export const BidTrackerPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids, filteredBids } = useBids();
  const config = useConfigStore((s) => s.config);
  const {
    getPhaseColor,
    getStatusColor,
    getPriorityColor,
    getDivisionColor,
    getServiceLineColor,
  } = useStatusColors();
  const viewMode = useBidStore((s) => s.viewMode);
  const setViewMode = useBidStore((s) => s.setViewMode);
  const filters = useBidStore((s) => s.filters);
  const setFilters = useBidStore((s) => s.setFilters);
  const resetFilters = useBidStore((s) => s.resetFilters);
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);

  // Load ERNs once so we can show live status in the tracker
  const erns = useErnStore((s) => s.erns);
  const loadErns = useErnStore((s) => s.loadAll);
  React.useEffect(() => {
    loadErns().catch(console.error);
  }, [loadErns]);
  const ernByTitle = React.useMemo(() => {
    const map: Record<string, string> = {};
    erns.forEach((e) => {
      map[e.title] = e.status;
    });
    return map;
  }, [erns]);

  React.useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const activeBids = React.useMemo(
    () => filteredBids.filter(isActiveBid),
    [filteredBids],
  );

  // Unfiltered active BIDs feed the filter options so choices don't vanish while filtering
  const allActiveBids = React.useMemo(() => bids.filter(isActiveBid), [bids]);

  /* ── Filter options ── */
  const divisionOptions = React.useMemo<MultiSelectOption[]>(
    () =>
      (config?.divisions || [])
        .filter((d) => d.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((d) => ({
          value: d.value,
          label: d.label || d.value,
          color: getDivisionColor(d.value),
        })),
    [config, getDivisionColor],
  );

  const serviceLineOptions = React.useMemo<MultiSelectOption[]>(() => {
    const configured = (config?.serviceLines || []).filter(
      (s) => s.isActive !== false,
    );
    if (configured.length === 0) {
      return uniqueSorted(allActiveBids.map((b) => b.serviceLine)).map((v) => ({
        value: v,
        label: v,
      }));
    }
    return configured
      .filter(
        (s) =>
          filters.divisions.length === 0 ||
          filters.divisions.indexOf(s.category as Division) >= 0,
      )
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => ({
        value: s.value,
        label: s.label || s.value,
        color: getServiceLineColor(s.value),
      }));
  }, [config, allActiveBids, filters.divisions, getServiceLineColor]);

  const clientOptions = React.useMemo<MultiSelectOption[]>(
    () =>
      uniqueSorted(
        allActiveBids
          .map((b) => b.opportunityInfo?.client)
          .concat(filters.clients),
      ).map((v) => ({ value: v, label: v })),
    [allActiveBids, filters.clients],
  );

  const creatorOptions = React.useMemo<MultiSelectOption[]>(() => {
    const nameByEmail: Record<string, string> = {};
    allActiveBids.forEach((b) => {
      if (b.creator?.email) {
        nameByEmail[b.creator.email] = b.creator.name || b.creator.email;
      }
    });
    return Object.keys(nameByEmail)
      .map((email) => ({ value: email, label: nameByEmail[email] }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [allActiveBids]);

  const priorityOptions = React.useMemo<MultiSelectOption[]>(
    () =>
      PRIORITIES.map((p) => ({
        value: p,
        label: p,
        color: getPriorityColor(p),
      })),
    [getPriorityColor],
  );

  const phaseOptions = React.useMemo<MultiSelectOption[]>(() => {
    const configured = (config?.phases || []).filter(
      (p) => p.isActive !== false,
    );
    const source: { value: string; label: string; order?: number }[] =
      configured.length > 0 ? configured : BID_PHASES;
    return source
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((p) => ({
        value: p.value,
        label: p.label || p.value,
        color: getPhaseColor(p.value),
      }));
  }, [config, getPhaseColor]);

  const statusOptions = React.useMemo<MultiSelectOption[]>(
    () =>
      uniqueSorted(
        allActiveBids.map((b) => b.currentStatus).concat(filters.statuses),
      ).map((s) => ({ value: s, label: s, color: getStatusColor(s) })),
    [allActiveBids, filters.statuses, getStatusColor],
  );

  const handleDivisionsChange = (divisions: string[]): void => {
    const configured = config?.serviceLines || [];
    const keepServiceLine = (value: string): boolean => {
      const sl = configured.find((s) => s.value === value);
      return !sl || divisions.indexOf(String(sl.category)) >= 0;
    };
    setFilters({
      divisions: divisions as Division[],
      serviceLines:
        divisions.length === 0
          ? filters.serviceLines
          : filters.serviceLines.filter(keepServiceLine),
    });
  };

  const hasActiveFilters =
    searchInput.trim() !== "" ||
    [
      filters.divisions,
      filters.serviceLines,
      filters.clients,
      filters.creators,
      filters.priorities,
      filters.phases,
      filters.statuses,
    ].some((selected) => selected.length > 0);

  const handleClearFilters = (): void => {
    setSearchInput("");
    resetFilters();
  };

  /* Kanban columns: group by top-level division from config */
  const kanbanGroups = React.useMemo(() => {
    const configured = (config?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((d) => ({ key: d.value, label: d.label || d.value }));
    const columns =
      configured.length > 0
        ? configured
        : uniqueSorted(activeBids.map((b) => b.division)).map((d) => ({
            key: d,
            label: d,
          }));
    return columns
      .filter(
        (col) =>
          filters.divisions.length === 0 ||
          filters.divisions.indexOf(col.key as Division) >= 0,
      )
      .map((col) => {
        const colBids = activeBids.filter((b) => b.division === col.key);
        return {
          key: col.key,
          label: col.label,
          color: getDivisionColor(col.key),
          bids: colBids.filter((b) => b.currentStatus !== "On Hold"),
          onHoldBids: colBids.filter((b) => b.currentStatus === "On Hold"),
          overdueCount: colBids.filter(isOverdueBid).length,
        };
      });
  }, [config, activeBids, filters.divisions, getDivisionColor]);

  const handleBidClick = (bid: IBid): void => {
    navigate(`/bid/${bid.bidNumber}`);
  };

  const handleNotesChange = React.useCallback(
    (bidNumber: string, notes: IQuickNote[]) => {
      // Optimistic update in the store
      useBidStore.getState().updateBidNotes?.(bidNumber, notes);
      // Persist to SharePoint in background
      BidService.patchByBidNumber(bidNumber, { quickNotes: notes }).catch(
        (err) => console.error("Failed to save notes:", err),
      );
    },
    [],
  );

  /* DataTable column definitions */
  const tableColumns = [
    {
      key: "bidNumber",
      header: "BID #",
      sortable: true,
      width: 130,
      render: (bid: IBid) => (
        <span className={styles.mono}>{bid.bidNumber}</span>
      ),
    },
    {
      key: "crmNumber",
      header: "CRM #",
      sortable: true,
      width: 130,
      render: (bid: IBid) => (
        <span className={styles.mono}>{bid.crmNumber || "—"}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      sortable: true,
      render: (bid: IBid) => bid.opportunityInfo?.client || "",
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      width: 200,
      render: (bid: IBid) => (
        <span className={styles.textTruncate}>
          {bid.opportunityInfo?.projectName || ""}
        </span>
      ),
    },
    {
      key: "division",
      header: "Division",
      sortable: true,
      render: (bid: IBid) => (
        <StatusBadge
          status={bid.division}
          color={getDivisionColor(bid.division)}
        />
      ),
    },
    {
      key: "serviceLine",
      header: "Service Line",
      sortable: true,
      render: (bid: IBid) =>
        bid.serviceLine ? (
          <StatusBadge
            status={bid.serviceLine}
            color={getServiceLineColor(bid.serviceLine)}
          />
        ) : (
          "—"
        ),
    },
    {
      key: "creatorName",
      header: "Creator",
      sortable: true,
      render: (bid: IBid) => {
        const name = bid.creator?.name || "";
        const photo = bid.creator?.photoUrl;
        return (
          <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {photo ? (
              <img
                src={photo}
                alt={name}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
            ) : name ? (
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: getAvatarColor(name),
                  color: "#fff",
                  fontSize: 9,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {getInitials(name)}
              </span>
            ) : null}
            <span>{name || "\u2014"}</span>
          </span>
        );
      },
    },
    {
      key: "dueDate",
      header: "Due Date",
      sortable: true,
      render: (bid: IBid) => {
        if (!bid.dueDate) return <span>—</span>;
        return (
          <span
            className={
              isPastDue(bid.dueDate, getDueFreezeDate(bid))
                ? styles.overdue
                : ""
            }
          >
            {formatDate(bid.dueDate, "MMM d")}
          </span>
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (bid: IBid) => (
        <StatusBadge
          status={bid.priority}
          color={getPriorityColor(bid.priority)}
        />
      ),
    },
    {
      key: "currentPhase",
      header: "Phase",
      sortable: true,
      render: (bid: IBid) => {
        const phase = getPhaseDef(bid.currentPhase);
        return phase ? (
          <StatusBadge
            status={phase.label}
            color={getPhaseColor(bid.currentPhase)}
          />
        ) : null;
      },
    },
    {
      key: "currentStatus",
      header: "Status",
      sortable: true,
      render: (bid: IBid) => (
        <StatusBadge
          status={bid.currentStatus}
          color={getStatusColor(bid.currentStatus)}
        />
      ),
    },
    {
      key: "ern",
      header: "ERN",
      render: (bid: IBid) => {
        const links = getErnLinks(bid);
        if (links.length === 0) {
          return <StatusBadge status="TBD" color="var(--warning)" />;
        }
        return (
          <span style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {links.map((l) => {
              const liveStatus = ernByTitle[l.ernNumber] || l.ernStatus || "";
              return (
                <span
                  key={l.ernNumber}
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <span className={styles.mono}>
                    {l.ernNumber}
                    {l.division ? ` · ${l.division}` : ""}
                  </span>
                  {liveStatus && (
                    <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                      {liveStatus}
                    </span>
                  )}
                </span>
              );
            })}
          </span>
        );
      },
    },
    {
      key: "progress",
      header: "Progress",
      render: (bid: IBid) => {
        const pct = getPhaseProgressByIndex(bid);
        return (
          <div className={styles.progressBarTrack} title={`${pct}%`}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${pct}%` }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div className={styles.page}>
      <PageHeader
        title="BID Tracker"
        subtitle={`${activeBids.length} active BIDs across all divisions`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        }
        actions={
          <div className={styles.viewToggle} role="tablist" aria-label="View">
            {VIEW_OPTIONS.map((opt) => {
              const active = viewMode === opt.mode;
              return (
                <button
                  key={opt.mode}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`${styles.viewBtn} ${active ? styles.viewBtnActive : ""}`}
                  onClick={() => setViewMode(opt.mode)}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        }
      />

      <div className={styles.filterBar}>
        <div className={styles.searchWrapper}>
          <Search size={15} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search BID #, CRM, client, project, creator…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            aria-label="Search BIDs"
          />
        </div>
        <MultiSelectDropdown
          label="Division"
          options={divisionOptions}
          selected={filters.divisions}
          onChange={handleDivisionsChange}
        />
        <MultiSelectDropdown
          label="Service Line"
          options={serviceLineOptions}
          selected={filters.serviceLines}
          onChange={(v) => setFilters({ serviceLines: v })}
        />
        <MultiSelectDropdown
          label="Client"
          options={clientOptions}
          selected={filters.clients}
          onChange={(v) => setFilters({ clients: v })}
        />
        <MultiSelectDropdown
          label="Creator"
          options={creatorOptions}
          selected={filters.creators}
          onChange={(v) => setFilters({ creators: v })}
        />
        <MultiSelectDropdown
          label="Priority"
          options={priorityOptions}
          selected={filters.priorities}
          onChange={(v) => setFilters({ priorities: v as BidPriority[] })}
        />
        <MultiSelectDropdown
          label="Phase"
          options={phaseOptions}
          selected={filters.phases}
          onChange={(v) => setFilters({ phases: v })}
        />
        <MultiSelectDropdown
          label="Status"
          options={statusOptions}
          selected={filters.statuses}
          onChange={(v) => setFilters({ statuses: v })}
        />
        {hasActiveFilters && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={handleClearFilters}
          >
            <X size={14} /> Clear
          </button>
        )}
        <span className={styles.resultCount}>
          <strong>{activeBids.length}</strong>{" "}
          {activeBids.length === 1 ? "BID" : "BIDs"}
        </span>
      </div>

      {/* Table View — uses DataTable component */}
      {viewMode === "table" && (
        <div className={styles.tableSection}>
          <DataTable<IBid>
            data={activeBids as any}
            columns={tableColumns as any}
            onRowClick={handleBidClick as any}
            emptyMessage="No active BIDs match your filters."
          />
        </div>
      )}

      {/* Kanban View — uses BidCard component */}
      {viewMode === "kanban" && (
        <div className={styles.kanbanBoard}>
          {kanbanGroups.map((group) => {
            const total = group.bids.length + group.onHoldBids.length;
            return (
              <div
                key={group.key}
                className={styles.kanbanColumn}
                style={{ "--col-color": group.color } as React.CSSProperties}
              >
                <div className={styles.kanbanColumnHeader}>
                  <span className={styles.kanbanColumnTitle}>
                    {group.label}
                  </span>
                  <span className={styles.kanbanCount}>{total}</span>
                  {group.overdueCount > 0 && (
                    <span className={styles.kanbanOverdue}>
                      {group.overdueCount} overdue
                    </span>
                  )}
                </div>
                {total === 0 && (
                  <div className={styles.kanbanEmpty}>No active BIDs</div>
                )}
                {group.bids.map((bid) => (
                  <BidCard
                    key={bid.bidNumber}
                    bid={bid}
                    onClick={handleBidClick}
                    onNotesChange={handleNotesChange}
                    hideDivision
                  />
                ))}
                {group.onHoldBids.length > 0 && (
                  <>
                    <div className={styles.onHoldDivider}>
                      <span className={styles.onHoldDividerLine} />
                      <span className={styles.onHoldDividerLabel}>On Hold</span>
                      <span className={styles.onHoldDividerLine} />
                    </div>
                    {group.onHoldBids.map((bid) => (
                      <BidCard
                        key={bid.bidNumber}
                        bid={bid}
                        onClick={handleBidClick}
                        onNotesChange={handleNotesChange}
                        hideDivision
                        dimmed
                      />
                    ))}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className={styles.listView}>
          {activeBids.length === 0 && (
            <div className={styles.emptyMessage}>
              No active BIDs match your filters.
            </div>
          )}
          {activeBids.map((bid) => (
            <div
              key={bid.bidNumber}
              onClick={() => handleBidClick(bid)}
              className={styles.listRow}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  color: "var(--secondary-accent)",
                  width: 120,
                }}
              >
                {bid.bidNumber}
              </span>
              <span style={{ width: 100 }}>
                {bid.opportunityInfo?.client || ""}
              </span>
              <span
                style={{
                  flex: 1,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {bid.opportunityInfo?.projectName || ""}
              </span>
              <StatusBadge
                status={bid.division}
                color={getDivisionColor(bid.division)}
              />
              {bid.serviceLine && (
                <StatusBadge
                  status={bid.serviceLine}
                  color={getServiceLineColor(bid.serviceLine)}
                />
              )}
              <span
                style={{
                  width: 80,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                {bid.creator?.photoUrl ? (
                  <img
                    src={bid.creator.photoUrl}
                    alt=""
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                ) : bid.creator?.name || "" ? (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: getAvatarColor(bid.creator?.name || ""),
                      color: "#fff",
                      fontSize: 8,
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {getInitials(bid.creator?.name || "")}
                  </span>
                ) : null}
                {(bid.creator?.name || "").split(" ")[0]}
              </span>
              {(() => {
                const phase = getPhaseDef(bid.currentPhase);
                return phase ? (
                  <StatusBadge
                    status={phase.label}
                    color={getPhaseColor(bid.currentPhase)}
                  />
                ) : null;
              })()}
              <StatusBadge
                status={bid.currentStatus}
                color={getStatusColor(bid.currentStatus)}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
