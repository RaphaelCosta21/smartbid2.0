import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useBidStore, ViewMode } from "../stores/useBidStore";
import { useBids } from "../hooks/useBids";
import { useStatusColors } from "../hooks/useStatusColors";
import { isActiveBid } from "../utils/bidHelpers";
import { useConfigStore } from "../stores/useConfigStore";
import { getPhaseDef } from "../config/status.config";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { FilterPanel } from "../components/common/FilterPanel";
import { StatusBadge } from "../components/common/StatusBadge";
import { BidCard } from "../components/bid/BidCard";
import { IBid, IQuickNote } from "../models";
import { BidService } from "../services/BidService";
import { useDebounce } from "../hooks/useDebounce";
import { differenceInDays, format } from "date-fns";
import styles from "./BidTrackerPage.module.scss";

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
  const { filteredBids } = useBids();
  const { getPhaseColor, getStatusColor, getPriorityColor } = useStatusColors();
  const viewMode = useBidStore((s) => s.viewMode);
  const setViewMode = useBidStore((s) => s.setViewMode);
  const filters = useBidStore((s) => s.filters);
  const setFilters = useBidStore((s) => s.setFilters);
  const resetFilters = useBidStore((s) => s.resetFilters);
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, 300);
  const now = new Date();

  React.useEffect(() => {
    setFilters({ search: debouncedSearch });
  }, [debouncedSearch]);

  const activeBids = React.useMemo(
    () => filteredBids.filter(isActiveBid),
    [filteredBids],
  );

  /* Kanban columns: group by top-level division from config */
  const kanbanGroups = React.useMemo(() => {
    const cfg = useConfigStore.getState().config;
    const divs = (cfg?.divisions || [])
      .filter((d) => d.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    if (divs.length > 0) {
      return divs.map((div) => ({
        key: div.value,
        label: div.label,
        color: div.color || "#94a3b8",
        bids: activeBids.filter(
          (b) => b.division === div.value && b.currentStatus !== "On Hold",
        ),
        onHoldBids: activeBids.filter(
          (b) => b.division === div.value && b.currentStatus === "On Hold",
        ),
      }));
    }
    // Fallback
    return [
      {
        key: "OPG",
        label: "OPG",
        color: "#3b82f6",
        bids: activeBids.filter(
          (b) => b.division === "OPG" && b.currentStatus !== "On Hold",
        ),
        onHoldBids: activeBids.filter(
          (b) => b.division === "OPG" && b.currentStatus === "On Hold",
        ),
      },
      {
        key: "SSR",
        label: "SSR",
        color: "#10b981",
        bids: activeBids.filter(
          (b) => b.division.startsWith("SSR") && b.currentStatus !== "On Hold",
        ),
        onHoldBids: activeBids.filter(
          (b) => b.division.startsWith("SSR") && b.currentStatus === "On Hold",
        ),
      },
    ];
  }, [activeBids]);

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
      render: (bid: IBid) => {
        const cfg = useConfigStore.getState().config;
        const divColor =
          (cfg?.divisions || []).find((d) => d.value === bid.division)?.color ||
          "#94a3b8";
        return <StatusBadge status={bid.division} color={divColor} />;
      },
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
        const daysLeft = differenceInDays(new Date(bid.dueDate), now);
        return (
          <span className={daysLeft < 0 ? styles.overdue : ""}>
            {format(new Date(bid.dueDate), "MMM d")}
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
      key: "progress",
      header: "Progress",
      render: (bid: IBid) => (
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{
              width: `${bid.kpis?.phaseCompletionPercentage || 0}%`,
            }}
          />
        </div>
      ),
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
          <div className={styles.viewToggle}>
            {(["kanban", "list", "table"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                className={viewMode === mode ? styles.active : ""}
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
        }
      />

      {/* Filter Panel */}
      <FilterPanel
        isOpen={filtersOpen}
        onToggle={() => setFiltersOpen(!filtersOpen)}
      >
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search</label>
          <input
            type="text"
            placeholder="BID #, client, project..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className={styles.filterInput}
            style={{ width: 200 }}
          />
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Division</label>
          <select
            value={filters.divisions[0] || ""}
            onChange={(e) =>
              setFilters({
                divisions: e.target.value ? [e.target.value as any] : [],
              })
            }
            className={styles.filterInput}
          >
            <option value="">All</option>
            {(useConfigStore.getState().config?.divisions || [])
              .filter((d) => d.isActive !== false)
              .map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
          </select>
        </div>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Priority</label>
          <select
            value={filters.priorities[0] || ""}
            onChange={(e) =>
              setFilters({
                priorities: e.target.value ? [e.target.value as any] : [],
              })
            }
            className={styles.filterInput}
          >
            <option value="">All</option>
            {["Urgent", "Normal", "Low"].map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
        <button onClick={resetFilters} className={styles.clearBtn}>
          Clear Filters
        </button>
      </FilterPanel>

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
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${kanbanGroups.length}, 1fr)`,
            gap: 16,
          }}
        >
          {kanbanGroups.map((group) => (
            <div
              key={group.key}
              style={{
                background: "var(--card-bg)",
                borderRadius: 16,
                padding: 16,
                border: "1px solid var(--border-subtle)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: group.color,
                  }}
                />
                <strong style={{ fontSize: 14, color: "var(--text-primary)" }}>
                  {group.label}
                </strong>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--text-muted)",
                    marginLeft: "auto",
                  }}
                >
                  ({group.bids.length + group.onHoldBids.length})
                </span>
              </div>
              {group.bids.map((bid) => (
                <BidCard
                  key={bid.bidNumber}
                  bid={bid}
                  onClick={handleBidClick}
                  onNotesChange={handleNotesChange}
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
                      dimmed
                    />
                  ))}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {activeBids.map((bid) => (
            <div
              key={bid.bidNumber}
              onClick={() => handleBidClick(bid)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                padding: "14px 20px",
                background: "var(--card-bg)",
                borderRadius: 12,
                border: "1px solid var(--border-subtle)",
                cursor: "pointer",
                transition: "all 250ms",
              }}
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
                color={(() => {
                  const cfg = useConfigStore.getState().config;
                  return (
                    (cfg?.divisions || []).find((d) => d.value === bid.division)
                      ?.color || "#94a3b8"
                  );
                })()}
              />
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
