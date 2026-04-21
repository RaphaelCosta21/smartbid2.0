/**
 * UnassignedRequestsPage — SMART BID 2.0
 * Shows real requests with status "submitted" or empty engineerResponsible.
 * Engineering team only: Manager assigns contributors/analysts; Contributor self-assigns.
 * List + Card dual view. Detail modal with full JSON info + assign panel.
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { DataTable } from "../components/common/DataTable";
import { StatusBadge } from "../components/common/StatusBadge";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useConfigStore } from "../stores/useConfigStore";
import { MembersService } from "../services/MembersService";
import { RequestService } from "../services/RequestService";
import { BidService } from "../services/BidService";
import { useBidStore } from "../stores/useBidStore";
import { IBidRequest } from "../models/IBidRequest";
import { IPersonRef } from "../models";
import { ITeamMember } from "../models/ITeamMember";
import { PRIORITY_COLORS } from "../utils/constants";
import { useStatusColors } from "../hooks/useStatusColors";
import { format } from "date-fns";
import styles from "./UnassignedRequestsPage.module.scss";

/* ------------------------------------------------------------------ */
/* HELPERS                                                            */
/* ------------------------------------------------------------------ */

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

type ViewMode = "list" | "cards";

/* ------------------------------------------------------------------ */
/* COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export const UnassignedRequestsPage: React.FC = () => {
  const currentUser = useCurrentUser();
  const sysConfig = useConfigStore((s) => s.config);
  const statusColors = useStatusColors();

  // Real requests fetched from SharePoint smartbid-tracker list
  const [requests, setRequests] = React.useState<IBidRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = React.useState(true);

  // Team members from MembersManagement
  const [teamMembers, setTeamMembers] = React.useState<ITeamMember[]>([]);
  const [viewMode, setViewMode] = React.useState<ViewMode>("list");
  const [search, setSearch] = React.useState("");
  const [priorityFilter, setPriorityFilter] = React.useState<string>("all");
  const [divisionFilter, setDivisionFilter] = React.useState<string>("all");
  const [selectedRequest, setSelectedRequest] =
    React.useState<IBidRequest | null>(null);
  const [showAssignPanel, setShowAssignPanel] = React.useState(false);
  const [assignTarget, setAssignTarget] = React.useState<IBidRequest | null>(
    null,
  );
  const [selectedEngineers, setSelectedEngineers] = React.useState<string[]>(
    [],
  );
  const [selectedAnalysts, setSelectedAnalysts] = React.useState<string[]>([]);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const showMsg = (type: "success" | "error", text: string): void => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  // ---- Permissions ------------------------------------------------
  const isEngineering = currentUser.sector === "engineering";
  const isManager = isEngineering && currentUser.bidRole === "manager";
  const isContributor = isEngineering && currentUser.bidRole === "contributor";
  const canAssign =
    isManager || isContributor || currentUser.isSuperAdmin === true;

  // ---- Load requests from SharePoint ------------------------------
  const loadRequests = React.useCallback(async () => {
    setLoadingRequests(true);
    try {
      const data = await RequestService.getUnassignedFromSP();
      setRequests(data);
    } catch (err) {
      console.error("Error loading requests from SharePoint:", err);
      setRequests([]);
    } finally {
      setLoadingRequests(false);
    }
  }, []);

  React.useEffect(() => {
    loadRequests().catch(console.error);
  }, [loadRequests]);

  // ---- Load team members ------------------------------------------
  React.useEffect(() => {
    MembersService.getAll()
      .then((data) => setTeamMembers(data.members))
      .catch(() => setTeamMembers([]));
  }, []);

  // ---- Data already filtered from SP — use directly
  const unassignedRequests = requests;

  // ---- Search + filter
  const filteredRequests = React.useMemo(() => {
    let list = unassignedRequests;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.requestNumber?.toLowerCase().includes(q) ||
          r.crmNumber?.toLowerCase().includes(q) ||
          r.client?.toLowerCase().includes(q) ||
          r.projectName?.toLowerCase().includes(q) ||
          r.requestedBy?.name?.toLowerCase().includes(q),
      );
    }
    if (priorityFilter !== "all") {
      list = list.filter((r) => r.priority === priorityFilter);
    }
    if (divisionFilter !== "all") {
      list = list.filter((r) => r.division === divisionFilter);
    }
    return list;
  }, [unassignedRequests, search, priorityFilter, divisionFilter]);

  // ---- Engineering contributors & analysts
  const engineeringContributors = React.useMemo(() => {
    return teamMembers.filter(
      (m) =>
        m.sector === "engineering" && m.bidRole === "contributor" && m.isActive,
    );
  }, [teamMembers]);

  const engineeringAnalysts = React.useMemo(() => {
    return teamMembers.filter(
      (m) =>
        m.sector === "engineering" && m.bidRole === "analyst" && m.isActive,
    );
  }, [teamMembers]);

  // ---- Stats
  const urgentCount = unassignedRequests.filter(
    (r) => r.priority === "Urgent",
  ).length;
  const normalCount = unassignedRequests.filter(
    (r) => r.priority === "Normal",
  ).length;
  const lowCount = unassignedRequests.filter(
    (r) => r.priority === "Low",
  ).length;

  // ---- Close all modals/panels helper -----------------------------
  const closeAll = (): void => {
    setSelectedRequest(null);
    setShowAssignPanel(false);
    setAssignTarget(null);
    setSelectedEngineers([]);
    setSelectedAnalysts([]);
  };

  // ---- Open assign panel ------------------------------------------
  const openAssignPanel = (req: IBidRequest): void => {
    setAssignTarget(req);
    setShowAssignPanel(true);
    // If contributor (not manager), auto-select and lock themselves as first
    if (isContributor && !isManager && !currentUser.isSuperAdmin) {
      const selfMember = engineeringContributors.find(
        (m) => m.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
      setSelectedEngineers(selfMember ? [selfMember.id] : []);
    } else {
      setSelectedEngineers([]);
    }
    setSelectedAnalysts([]);
  };

  // ---- Open detail modal ------------------------------------------
  const openDetailModal = (req: IBidRequest): void => {
    setSelectedRequest(req);
    setShowAssignPanel(false);
    setSelectedEngineers([]);
    setSelectedAnalysts([]);
  };

  // ---- Toggle selections
  const toggleEngineer = (memberId: string): void => {
    // If contributor (not manager), first slot is locked to self
    if (isContributor && !isManager && !currentUser.isSuperAdmin) {
      const selfMember = engineeringContributors.find(
        (m) => m.email.toLowerCase() === currentUser.email.toLowerCase(),
      );
      if (selfMember && memberId === selfMember.id) return; // can't deselect self
    }
    setSelectedEngineers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  const toggleAnalyst = (memberId: string): void => {
    setSelectedAnalysts((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId],
    );
  };

  // ---- Save assignment --------------------------------------------
  const handleAssign = async (): Promise<void> => {
    if (!assignTarget) return;
    if (selectedEngineers.length === 0) {
      showMsg("error", "Select at least one Engineer Responsible.");
      return;
    }

    setSaving(true);
    try {
      const engineers: IPersonRef[] = selectedEngineers.map((id) => {
        const m = engineeringContributors.find((t) => t.id === id)!;
        return {
          name: m.name,
          email: m.email,
          role: "contributor",
          photoUrl: m.photoUrl || "",
        };
      });
      const analysts: IPersonRef[] = selectedAnalysts.map((id) => {
        const m = engineeringAnalysts.find((t) => t.id === id)!;
        return {
          name: m.name,
          email: m.email,
          role: "analyst",
          photoUrl: m.photoUrl || "",
        };
      });

      // Update the BID in SharePoint
      const bidNumber = assignTarget.requestNumber;
      const items = await BidService.getAll();
      const bid = items.find((b) => b.bidNumber === bidNumber);
      if (!bid) {
        showMsg("error", `BID ${bidNumber} not found in SharePoint.`);
        setSaving(false);
        return;
      }

      bid.engineerResponsible = engineers;
      bid.analyst = analysts;
      bid.currentStatus = "Pending Assignment";
      bid.lastModified = new Date().toISOString();
      bid.startDate = new Date().toISOString();

      // Find SP item ID for update
      const spItems = await (BidService as any)._list.items
        .filter(`Title eq '${bidNumber}'`)
        .select("Id")
        .top(1)();
      if (spItems.length > 0) {
        const spId = (spItems[0] as { Id: number }).Id;
        await BidService.update(spId, bid);
      }

      showMsg(
        "success",
        `${assignTarget.requestNumber} assigned successfully!`,
      );
      closeAll();
      // Reload requests from SP to reflect changes
      await loadRequests();
      // Refresh global bid store so other pages (BidTracker, Dashboard) see the update
      await useBidStore.getState().refreshBids();
    } catch (err) {
      console.error("Error assigning request:", err);
      showMsg("error", "Failed to assign request.");
    } finally {
      setSaving(false);
    }
  };

  /* ================================================================ */
  /* RENDER: Assign Panel (reusable)                                  */
  /* ================================================================ */

  const renderAssignPanel = (): React.ReactElement => {
    const selfMember = engineeringContributors.find(
      (m) => m.email.toLowerCase() === currentUser.email.toLowerCase(),
    );
    const isSelf = isContributor && !isManager && !currentUser.isSuperAdmin;

    return (
      <div className={styles.assignPanel}>
        <div className={styles.assignTitle}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
          Assign Team
        </div>

        {/* Engineer Responsible (Contributors) */}
        <div className={styles.assignFieldGroup}>
          <div className={styles.assignFieldLabel}>
            🛠️ Engineer Responsible (Contributors)
          </div>

          {/* Selected chips */}
          {selectedEngineers.length > 0 && (
            <div className={styles.assignSelectedChips}>
              {selectedEngineers.map((id, idx) => {
                const m = engineeringContributors.find((t) => t.id === id);
                if (!m) return null;
                const isLocked = isSelf && selfMember && id === selfMember.id;
                return (
                  <span key={id} className={styles.assignChip}>
                    Contributor {idx + 1}: {m.name}
                    {isLocked && <span className={styles.selfBadge}>YOU</span>}
                    {!isLocked && (
                      <button
                        className={styles.assignChipRemove}
                        onClick={() => toggleEngineer(id)}
                      >
                        ✕
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          )}

          <div className={styles.assignPeopleList}>
            {engineeringContributors.map((m) => {
              const isSelected = selectedEngineers.includes(m.id);
              const isLockedSelf =
                isSelf && selfMember && m.id === selfMember.id;
              return (
                <div
                  key={m.id}
                  className={`${styles.assignPersonRow} ${isSelected ? styles.assignPersonSelected : ""}`}
                  onClick={() => toggleEngineer(m.id)}
                >
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      className={styles.assignPersonImg}
                      alt={m.name}
                    />
                  ) : (
                    <div
                      className={styles.assignPersonAvatar}
                      style={{ background: getAvatarColor(m.name) }}
                    >
                      {getInitials(m.name)}
                    </div>
                  )}
                  <div className={styles.assignPersonInfo}>
                    <div className={styles.assignPersonName}>
                      {m.name}
                      {isLockedSelf && (
                        <span className={styles.selfBadge}>YOU</span>
                      )}
                    </div>
                    <div className={styles.assignPersonRole}>
                      {m.jobTitle} · {m.businessLines.join(", ")}
                    </div>
                  </div>
                  <div
                    className={`${styles.assignCheck} ${isSelected ? styles.assignChecked : ""}`}
                  >
                    {isSelected && "✓"}
                  </div>
                </div>
              );
            })}
            {engineeringContributors.length === 0 && (
              <div
                style={{
                  padding: 12,
                  fontSize: 13,
                  color: "var(--text-tertiary)",
                }}
              >
                No engineering contributors found.
              </div>
            )}
          </div>
        </div>

        {/* Analyst */}
        <div className={styles.assignFieldGroup}>
          <div className={styles.assignFieldLabel}>📊 Analyst</div>

          {selectedAnalysts.length > 0 && (
            <div className={styles.assignSelectedChips}>
              {selectedAnalysts.map((id, idx) => {
                const m = engineeringAnalysts.find((t) => t.id === id);
                if (!m) return null;
                return (
                  <span key={id} className={styles.assignChip}>
                    Analyst {idx + 1}: {m.name}
                    <button
                      className={styles.assignChipRemove}
                      onClick={() => toggleAnalyst(id)}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          <div className={styles.assignPeopleList}>
            {engineeringAnalysts.map((m) => {
              const isSelected = selectedAnalysts.includes(m.id);
              return (
                <div
                  key={m.id}
                  className={`${styles.assignPersonRow} ${isSelected ? styles.assignPersonSelected : ""}`}
                  onClick={() => toggleAnalyst(m.id)}
                >
                  {m.photoUrl ? (
                    <img
                      src={m.photoUrl}
                      className={styles.assignPersonImg}
                      alt={m.name}
                    />
                  ) : (
                    <div
                      className={styles.assignPersonAvatar}
                      style={{ background: getAvatarColor(m.name) }}
                    >
                      {getInitials(m.name)}
                    </div>
                  )}
                  <div className={styles.assignPersonInfo}>
                    <div className={styles.assignPersonName}>{m.name}</div>
                    <div className={styles.assignPersonRole}>
                      {m.jobTitle} · {m.businessLines.join(", ")}
                    </div>
                  </div>
                  <div
                    className={`${styles.assignCheck} ${isSelected ? styles.assignChecked : ""}`}
                  >
                    {isSelected && "✓"}
                  </div>
                </div>
              );
            })}
            {engineeringAnalysts.length === 0 && (
              <div
                style={{
                  padding: 12,
                  fontSize: 13,
                  color: "var(--text-tertiary)",
                }}
              >
                No engineering analysts found.
              </div>
            )}
          </div>
        </div>

        <div className={styles.assignActions}>
          <button
            className={styles.btnPrimary}
            onClick={handleAssign}
            disabled={saving || selectedEngineers.length === 0}
          >
            {saving ? "Saving..." : "Confirm Assignment"}
          </button>
          <button className={styles.btnSecondary} onClick={closeAll}>
            Cancel
          </button>
        </div>
      </div>
    );
  };

  /* ================================================================ */
  /* RENDER: Detail Modal                                             */
  /* ================================================================ */

  const renderDetailModal = (): React.ReactElement | null => {
    if (!selectedRequest) return null;
    const r = selectedRequest;

    return (
      <div className={styles.modalOverlay} onClick={closeAll}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.modalHeader}>
            <div className={styles.modalTitle}>
              <div className={styles.modalTitleMain}>{r.projectName}</div>
              <div className={styles.modalTitleSub}>
                {r.requestNumber} · {r.crmNumber || "No CRM"}
              </div>
            </div>
            <button className={styles.modalCloseBtn} onClick={closeAll}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Body */}
          <div className={styles.modalBody}>
            {/* ── Section 1: Client & Project Information ── */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>
                📋 Client & Project Information
              </div>
              <div className={styles.modalGrid}>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Client</span>
                  <span className={styles.modalFieldValue}>
                    {r.client || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Client Contact</span>
                  <span className={styles.modalFieldValue}>
                    {r.clientContact || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>CRM</span>
                  <span className={styles.modalFieldValue}>
                    {r.crmNumber || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Project Name</span>
                  <span className={styles.modalFieldValue}>
                    {r.projectName || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Division</span>
                  <span className={styles.modalFieldValue}>
                    <StatusBadge status={r.division} />
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Service Line</span>
                  <span className={styles.modalFieldValue}>
                    {r.serviceLine || "—"}
                  </span>
                </div>
                <div
                  className={`${styles.modalField} ${styles.modalFieldFull}`}
                >
                  <span className={styles.modalFieldLabel}>Description</span>
                  <span className={styles.modalFieldValue}>
                    {r.projectDescription || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>
                    Operation Start Date
                  </span>
                  <span className={styles.modalFieldValue}>
                    {r.operationStartDate
                      ? format(new Date(r.operationStartDate), "MMM d, yyyy")
                      : "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>
                    Expected Duration
                  </span>
                  <span className={styles.modalFieldValue}>
                    {r.totalDuration ? `${r.totalDuration} days` : "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Section 2: BID Internal Details ── */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>
                🔧 BID Internal Details
              </div>
              <div className={styles.modalGrid}>
                <div
                  className={`${styles.modalField} ${styles.modalFieldFull}`}
                >
                  <span className={styles.modalFieldLabel}>
                    Project Manager(s)
                  </span>
                  <div className={styles.modalPeople}>
                    {r.projectManager && r.projectManager.length > 0 ? (
                      r.projectManager.map((pm, i) => (
                        <span key={i} className={styles.personChip}>
                          {pm.photoUrl ? (
                            <img
                              src={pm.photoUrl}
                              className={styles.personChipImg}
                              alt=""
                            />
                          ) : (
                            <span
                              className={styles.personChipAvatar}
                              style={{ background: getAvatarColor(pm.name) }}
                            >
                              {getInitials(pm.name)}
                            </span>
                          )}
                          {pm.name}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: "var(--text-tertiary)" }}>—</span>
                    )}
                  </div>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>BID Type</span>
                  <span className={styles.modalFieldValue}>
                    <StatusBadge status={r.bidType} />
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Priority</span>
                  <span className={styles.modalFieldValue}>
                    <StatusBadge
                      status={r.priority}
                      color={PRIORITY_COLORS[r.priority]}
                    />
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Creation Date</span>
                  <span className={styles.modalFieldValue}>
                    {r.creationDate
                      ? format(new Date(r.creationDate), "MMM d, yyyy")
                      : "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Requested By</span>
                  <div className={styles.modalPeople}>
                    <span className={styles.personChip}>
                      {r.creator?.photoUrl ? (
                        <img
                          src={r.creator.photoUrl}
                          className={styles.personChipImg}
                          alt=""
                        />
                      ) : (
                        <span
                          className={styles.personChipAvatar}
                          style={{
                            background: getAvatarColor(
                              r.creator?.name || r.requestedBy?.name || "?",
                            ),
                          }}
                        >
                          {getInitials(
                            r.creator?.name || r.requestedBy?.name || "?",
                          )}
                        </span>
                      )}
                      {r.creator?.name || r.requestedBy?.name || "—"}
                    </span>
                  </div>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>
                    Desired Due Date
                  </span>
                  <span className={styles.modalFieldValue}>
                    {r.desiredDueDate
                      ? format(new Date(r.desiredDueDate), "MMM d, yyyy")
                      : "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Phase</span>
                  <span className={styles.modalFieldValue}>
                    {r.currentPhase ? (
                      <StatusBadge
                        status={r.currentPhase}
                        color={
                          sysConfig?.phases?.find(
                            (p) =>
                              p.value === r.currentPhase ||
                              p.label === r.currentPhase,
                          )?.color
                        }
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Status</span>
                  <span className={styles.modalFieldValue}>
                    {r.currentStatus ? (
                      <StatusBadge
                        status={r.currentStatus}
                        color={
                          sysConfig?.subStatuses?.find(
                            (s) =>
                              s.value === r.currentStatus ||
                              s.label === r.currentStatus,
                          )?.color
                        }
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Section 3: Additional Information ── */}
            <div className={styles.modalSection}>
              <div className={styles.modalSectionTitle}>
                📎 Additional Information
              </div>
              <div className={styles.modalGrid}>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Vessel</span>
                  <span className={styles.modalFieldValue}>
                    {r.vessel || "—"}
                  </span>
                </div>
                <div className={styles.modalField}>
                  <span className={styles.modalFieldLabel}>Field</span>
                  <span className={styles.modalFieldValue}>
                    {r.field || "—"}
                  </span>
                </div>
                <div
                  className={`${styles.modalField} ${styles.modalFieldFull}`}
                >
                  <span className={styles.modalFieldLabel}>
                    Commercial BID Folder Link
                  </span>
                  <span className={styles.modalFieldValue}>
                    {r.commercialFolderUrl ? (
                      <a
                        href={r.commercialFolderUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "var(--primary-accent)" }}
                      >
                        {r.commercialFolderUrl} ↗
                      </a>
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div
                  className={`${styles.modalField} ${styles.modalFieldFull}`}
                >
                  <span className={styles.modalFieldLabel}>Notes</span>
                  <span className={styles.modalFieldValue}>
                    {r.notes || "—"}
                  </span>
                </div>
                <div
                  className={`${styles.modalField} ${styles.modalFieldFull}`}
                >
                  <span className={styles.modalFieldLabel}>
                    Attachments{" "}
                    {r.attachments && r.attachments.length > 0
                      ? `(${r.attachments.length})`
                      : ""}
                  </span>
                  {r.attachments && r.attachments.length > 0 ? (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                        marginTop: 4,
                      }}
                    >
                      {r.attachments.map((a, i) =>
                        a.path ? (
                          <a
                            key={i}
                            href={a.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.personChip}
                            style={{
                              textDecoration: "none",
                              cursor: "pointer",
                              color: "var(--primary-accent)",
                            }}
                          >
                            📄 {a.fileName}
                            {a.size > 0 && (
                              <span
                                style={{
                                  fontSize: 10,
                                  color: "var(--text-tertiary)",
                                  marginLeft: 4,
                                }}
                              >
                                ({(a.size / 1024).toFixed(0)} KB)
                              </span>
                            )}
                          </a>
                        ) : (
                          <span key={i} className={styles.personChip}>
                            📄 {a.fileName}
                          </span>
                        ),
                      )}
                    </div>
                  ) : (
                    <span
                      className={styles.modalFieldValue}
                      style={{ color: "var(--text-tertiary)" }}
                    >
                      —
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Assign Panel (inside modal) */}
            {canAssign &&
              showAssignPanel &&
              assignTarget?.id === selectedRequest.id &&
              renderAssignPanel()}
          </div>

          {/* Footer */}
          <div className={styles.modalFooter}>
            {canAssign && !showAssignPanel && (
              <button
                className={styles.btnPrimary}
                onClick={() => {
                  openAssignPanel(selectedRequest);
                }}
              >
                Assign Request
              </button>
            )}
            <button className={styles.btnSecondary} onClick={closeAll}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ================================================================ */
  /* RENDER: Card View                                                */
  /* ================================================================ */

  const renderCardView = (): React.ReactElement => (
    <div className={styles.cardsGrid}>
      {filteredRequests.map((r) => {
        const prColor = PRIORITY_COLORS[r.priority] || "#3b82f6";
        return (
          <div
            key={r.id}
            className={styles.card}
            onClick={() => openDetailModal(r)}
          >
            <div
              className={styles.cardAccent}
              style={{ background: prColor }}
            />
            <div className={styles.cardBody}>
              <div className={styles.cardTopRow}>
                <span className={styles.cardReqNum}>{r.requestNumber}</span>
                <div className={styles.cardBadges}>
                  <StatusBadge status={r.priority} color={prColor} />
                  <StatusBadge
                    status={r.division}
                    color={
                      sysConfig?.divisions?.find(
                        (d) => d.value === r.division || d.label === r.division,
                      )?.color
                    }
                  />
                </div>
              </div>
              <div className={styles.cardProject}>{r.projectName}</div>
              <div className={styles.cardClient}>🤝 {r.client}</div>
              <div className={styles.cardMeta}>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>CRM</span>
                  <span className={styles.cardMetaValue}>
                    {r.crmNumber || "—"}
                  </span>
                </div>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>Service Line</span>
                  <span className={styles.cardMetaValue}>
                    {r.serviceLine ? (
                      <StatusBadge
                        status={r.serviceLine}
                        color={
                          sysConfig?.serviceLines?.find(
                            (sl) =>
                              sl.value === r.serviceLine ||
                              sl.label === r.serviceLine,
                          )?.color
                        }
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>BID Type</span>
                  <span className={styles.cardMetaValue}>{r.bidType}</span>
                </div>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>Due Date</span>
                  <span className={styles.cardMetaValue}>
                    {r.desiredDueDate
                      ? format(new Date(r.desiredDueDate), "MMM d")
                      : "—"}
                  </span>
                </div>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>Phase</span>
                  <span className={styles.cardMetaValue}>
                    {r.currentPhase ? (
                      <StatusBadge
                        status={r.currentPhase}
                        color={statusColors.getPhaseColor(r.currentPhase)}
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
                <div className={styles.cardMetaItem}>
                  <span className={styles.cardMetaLabel}>Status</span>
                  <span className={styles.cardMetaValue}>
                    {r.currentStatus ? (
                      <StatusBadge
                        status={r.currentStatus}
                        color={statusColors.getStatusColor(r.currentStatus)}
                      />
                    ) : (
                      "—"
                    )}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.cardFooter}>
              <div className={styles.cardRequester}>
                {r.creator?.photoUrl || r.requestedBy?.photoUrl ? (
                  <img
                    src={r.creator?.photoUrl || r.requestedBy?.photoUrl}
                    className={styles.cardAvatar}
                    style={{ objectFit: "cover" }}
                    alt=""
                  />
                ) : (
                  <div
                    className={styles.cardAvatar}
                    style={{ background: getAvatarColor(r.requestedBy.name) }}
                  >
                    {getInitials(r.requestedBy.name)}
                  </div>
                )}
                {r.requestedBy.name} ·{" "}
                {r.requestDate ? format(new Date(r.requestDate), "MMM d") : ""}
              </div>
              <div
                className={styles.cardActions}
                onClick={(e) => e.stopPropagation()}
              >
                {canAssign && (
                  <button
                    className={styles.assignBtn}
                    onClick={() => openAssignPanel(r)}
                  >
                    Assign
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  /* ================================================================ */
  /* RENDER: List View (DataTable)                                    */
  /* ================================================================ */

  const columns = [
    {
      key: "requestNumber",
      header: "BID #",
      sortable: true,
      width: 130,
      render: (r: IBidRequest) => (
        <span className={styles.mono}>{r.requestNumber}</span>
      ),
    },
    {
      key: "crmNumber",
      header: "CRM",
      sortable: true,
      width: 110,
      render: (r: IBidRequest) => (
        <span className={styles.mono}>{r.crmNumber || "—"}</span>
      ),
    },
    {
      key: "client",
      header: "Client",
      sortable: true,
      render: (r: IBidRequest) => r.client,
    },
    {
      key: "projectName",
      header: "Project",
      sortable: true,
      render: (r: IBidRequest) => (
        <span className={styles.textTruncate}>{r.projectName}</span>
      ),
    },
    {
      key: "division",
      header: "Div / Service Line",
      sortable: true,
      render: (r: IBidRequest) => {
        const divColor = sysConfig?.divisions?.find(
          (d) => d.value === r.division || d.label === r.division,
        )?.color;
        const slColor = sysConfig?.serviceLines?.find(
          (sl) => sl.value === r.serviceLine || sl.label === r.serviceLine,
        )?.color;
        return (
          <span
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              alignItems: "center",
            }}
          >
            <StatusBadge status={r.division} color={divColor} />
            {r.serviceLine && (
              <StatusBadge status={r.serviceLine} color={slColor} />
            )}
          </span>
        );
      },
    },
    {
      key: "priority",
      header: "Priority",
      sortable: true,
      render: (r: IBidRequest) => (
        <StatusBadge status={r.priority} color={PRIORITY_COLORS[r.priority]} />
      ),
    },
    {
      key: "requestedBy",
      header: "Requested By",
      render: (r: IBidRequest) => (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {r.creator?.photoUrl || r.requestedBy?.photoUrl ? (
            <img
              src={r.creator?.photoUrl || r.requestedBy?.photoUrl}
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                objectFit: "cover",
              }}
              alt=""
            />
          ) : (
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: getAvatarColor(r.requestedBy.name),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 10,
                fontWeight: 600,
                color: "#fff",
              }}
            >
              {getInitials(r.requestedBy.name)}
            </div>
          )}
          {r.requestedBy.name}
        </div>
      ),
    },
    {
      key: "requestDate",
      header: "Date",
      sortable: true,
      render: (r: IBidRequest) =>
        r.requestDate ? format(new Date(r.requestDate), "MMM d, yyyy") : "—",
    },
    {
      key: "desiredDueDate",
      header: "Due Date",
      sortable: true,
      render: (r: IBidRequest) =>
        r.desiredDueDate
          ? format(new Date(r.desiredDueDate), "MMM d, yyyy")
          : "—",
    },
    {
      key: "currentPhase",
      header: "Phase",
      render: (r: IBidRequest) => {
        const phaseColor = sysConfig?.phases?.find(
          (p) => p.value === r.currentPhase || p.label === r.currentPhase,
        )?.color;
        return r.currentPhase ? (
          <StatusBadge status={r.currentPhase} color={phaseColor} />
        ) : (
          "—"
        );
      },
    },
    {
      key: "currentStatus",
      header: "Status",
      render: (r: IBidRequest) => {
        const statusColor = sysConfig?.subStatuses?.find(
          (s) => s.value === r.currentStatus || s.label === r.currentStatus,
        )?.color;
        return r.currentStatus ? (
          <StatusBadge status={r.currentStatus} color={statusColor} />
        ) : (
          "—"
        );
      },
    },
    ...(canAssign
      ? [
          {
            key: "_actions",
            header: "",
            width: 120,
            render: (r: IBidRequest) => (
              <div className={styles.rowActions}>
                <button
                  className={styles.assignBtn}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    openAssignPanel(r);
                  }}
                >
                  Assign
                </button>
              </div>
            ),
          },
        ]
      : []),
  ];

  /* ================================================================ */
  /* MAIN RENDER                                                      */
  /* ================================================================ */

  return (
    <div className={styles.page}>
      <PageHeader
        title="Unassigned Requests"
        subtitle={`${unassignedRequests.length} request${unassignedRequests.length !== 1 ? "s" : ""} awaiting assignment`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" />
            <line x1="23" y1="11" x2="17" y2="11" />
          </svg>
        }
      />

      {/* Message */}
      {message && (
        <div
          className={`${styles.messageBar} ${message.type === "success" ? styles.success : styles.error}`}
        >
          {message.text}
        </div>
      )}

      {/* No access banner for non-engineering users */}
      {!canAssign && (
        <div className={styles.noAccessMsg}>
          🔒 Only Engineering team members (Manager or Contributor) can assign
          requests.
        </div>
      )}

      {/* Stat Cards */}
      <div className={styles.statRow}>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
          >
            📋
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{unassignedRequests.length}</div>
            <div className={styles.statLabel}>Total Pending</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}
          >
            🔴
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{urgentCount}</div>
            <div className={styles.statLabel}>Urgent</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}
          >
            🔵
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{normalCount}</div>
            <div className={styles.statLabel}>Normal</div>
          </div>
        </div>
        <div className={styles.statCard}>
          <div
            className={styles.statIcon}
            style={{ background: "rgba(100,116,139,0.12)", color: "#64748b" }}
          >
            ⚪
          </div>
          <div className={styles.statInfo}>
            <div className={styles.statValue}>{lowCount}</div>
            <div className={styles.statLabel}>Low</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search by request #, CRM, client, project..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
          />
        </div>

        {/* Division filter */}
        <select
          className={styles.filterSelect}
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.currentTarget.value)}
        >
          <option value="all">All Divisions</option>
          {(sysConfig?.divisions || [])
            .filter((d) => d.isActive !== false)
            .map((d) => (
              <option key={d.id} value={d.value}>
                {d.label}
              </option>
            ))}
        </select>

        {/* Priority filter */}
        <button
          className={`${styles.filterBtn} ${priorityFilter === "all" ? styles.filterBtnActive : ""}`}
          onClick={() => setPriorityFilter("all")}
        >
          All
        </button>
        {(["Urgent", "Normal", "Low"] as const).map((p) => (
          <button
            key={p}
            className={`${styles.filterBtn} ${priorityFilter === p ? styles.filterBtnActive : ""}`}
            onClick={() => setPriorityFilter(p)}
            style={
              priorityFilter === p
                ? {
                    borderColor: PRIORITY_COLORS[p],
                    background: `${PRIORITY_COLORS[p]}18`,
                    color: PRIORITY_COLORS[p],
                  }
                : {}
            }
          >
            {p}
          </button>
        ))}

        {/* View toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${viewMode === "list" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </button>
          <button
            className={`${styles.viewBtn} ${viewMode === "cards" ? styles.viewBtnActive : ""}`}
            onClick={() => setViewMode("cards")}
            title="Card view"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content: List or Cards */}
      {loadingRequests ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>⏳</div>
          <div className={styles.emptyText}>
            Loading requests from SharePoint...
          </div>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📭</div>
          <div className={styles.emptyText}>
            {unassignedRequests.length === 0
              ? "No unassigned requests at the moment."
              : "No requests match your current filters."}
          </div>
        </div>
      ) : viewMode === "list" ? (
        <DataTable<IBidRequest>
          data={filteredRequests as any}
          columns={columns as any}
          onRowClick={openDetailModal}
          emptyMessage="No requests in this category."
        />
      ) : (
        renderCardView()
      )}

      {/* Inline assign panel (when opened from list row without modal) */}
      {showAssignPanel && assignTarget && !selectedRequest && (
        <div className={styles.modalOverlay} onClick={closeAll}>
          <div
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 560 }}
          >
            <div className={styles.modalHeader}>
              <div className={styles.modalTitle}>
                <div className={styles.modalTitleMain}>Assign Request</div>
                <div className={styles.modalTitleSub}>
                  {assignTarget.requestNumber} · {assignTarget.projectName}
                </div>
              </div>
              <button className={styles.modalCloseBtn} onClick={closeAll}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className={styles.modalBody}>{renderAssignPanel()}</div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedRequest && renderDetailModal()}
    </div>
  );
};
