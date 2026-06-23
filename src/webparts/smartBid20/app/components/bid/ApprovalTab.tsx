import * as React from "react";
import { IBid, IApprovalRound } from "../../models/IBid";
import { IBidApproval } from "../../models/IBid";
import { IApprovalSectorGroup } from "../../models/IBidApproval";
import { ITeamMember } from "../../models/ITeamMember";
import { IPersonRef, Sector } from "../../models/IUser";
import { ApprovalStatus } from "../../models/IBidStatus";
import { PersonaCard } from "../common/PersonaCard";
import { ApprovalService } from "../../services/ApprovalService";
import { formatDate } from "../../utils/formatters";
import styles from "./ApprovalTab.module.scss";

interface ApprovalTabProps {
  bid: IBid;
  teamMembers: ITeamMember[];
  currentUser: IPersonRef;
  canEdit: boolean;
  onSave: (
    approvals: IBidApproval[],
    approvalStatus: ApprovalStatus,
    approvalRounds: IApprovalRound[],
  ) => void;
}

interface SectorConfig {
  sector: Sector;
  label: string;
  icon: string;
  required: boolean;
  minCount: number;
  filterFn: (m: ITeamMember, bid: IBid) => boolean;
  preSelectFn: (bid: IBid) => IPersonRef[];
  autoLockFn: (bid: IBid, members: ITeamMember[]) => IPersonRef[];
  isVisible: (bid: IBid) => boolean;
}

const CAPEX_THRESHOLD_USD = 200000;

function matchesDivision(member: ITeamMember, bid: IBid): boolean {
  if (
    bid.division === "SSR-ROV" ||
    bid.division === "SSR-Survey" ||
    bid.division === "SSR-Integrated"
  ) {
    if (bid.division === "SSR-ROV") return member.businessLines.includes("ROV");
    if (bid.division === "SSR-Survey")
      return member.businessLines.includes("SURVEY");
    if (bid.division === "SSR-Integrated") {
      return (
        member.businessLines.includes("ROV") ||
        member.businessLines.includes("SURVEY")
      );
    }
  }
  return (
    member.businessLines.includes(bid.division as any) ||
    member.businessLines.length === 0
  );
}

const SECTOR_CONFIGS: SectorConfig[] = [
  {
    sector: "commercial",
    label: "Commercial",
    icon: "💼",
    required: true,
    minCount: 1,
    filterFn: (m) => m.sector === "commercial" && m.isActive,
    preSelectFn: (bid) =>
      bid.commercialRequester ? [bid.commercialRequester] : [],
    autoLockFn: () => [],
    isVisible: () => true,
  },
  {
    sector: "engineering",
    label: "Engineering",
    icon: "🛠️",
    required: true,
    minCount: 1,
    filterFn: (m) =>
      m.sector === "engineering" &&
      m.isActive &&
      (m.bidRole === "lead" ||
        m.bidRole === "manager" ||
        m.bidRole === "sr-manager"),
    preSelectFn: () => [],
    autoLockFn: (bid, members) => {
      if (bid.costSummary.assetsCapexUSD > CAPEX_THRESHOLD_USD) {
        return members
          .filter(
            (m) =>
              m.sector === "engineering" &&
              m.bidRole === "sr-manager" &&
              m.isActive,
          )
          .map((m) => ({
            name: m.name,
            email: m.email,
            role: m.jobTitle,
            photoUrl: m.photoUrl,
          }));
      }
      return [];
    },
    isVisible: () => true,
  },
  {
    sector: "project",
    label: "Project",
    icon: "📋",
    required: true,
    minCount: 1,
    filterFn: (m, bid) =>
      m.sector === "project" && m.isActive && matchesDivision(m, bid),
    preSelectFn: (bid) => bid.projectManager || [],
    autoLockFn: () => [],
    isVisible: () => true,
  },
  {
    sector: "operation",
    label: "Operation",
    icon: "⚙️",
    required: true,
    minCount: 1,
    filterFn: (m, bid) =>
      m.sector === "operation" && m.isActive && matchesDivision(m, bid),
    preSelectFn: () => [],
    autoLockFn: () => [],
    isVisible: () => true,
  },
  {
    sector: "dataCenter",
    label: "Data Center",
    icon: "📡",
    required: false,
    minCount: 1,
    filterFn: (m) => m.sector === "dataCenter" && m.isActive,
    preSelectFn: () => [],
    autoLockFn: () => [],
    isVisible: (bid) => {
      const sl = (bid.serviceLine || "").toLowerCase();
      return sl === "survey" || sl === "integrated";
    },
  },
  {
    sector: "equipmentInstallation",
    label: "Equipment & Installation",
    icon: "🔧",
    required: false,
    minCount: 0,
    filterFn: (m) => m.sector === "equipmentInstallation" && m.isActive,
    preSelectFn: () => [],
    autoLockFn: () => [],
    isVisible: () => true,
  },
  {
    sector: "supplyChain",
    label: "Supply Chain",
    icon: "📦",
    required: false,
    minCount: 0,
    filterFn: (m) => m.sector === "supplyChain" && m.isActive,
    preSelectFn: () => [],
    autoLockFn: () => [],
    isVisible: () => true,
  },
];

const STATUS_DISPLAY: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  approved: { icon: "✅", color: "#10B981", label: "Approved" },
  rejected: { icon: "❌", color: "#EF4444", label: "Rejected" },
  pending: { icon: "⏳", color: "#F59E0B", label: "Pending" },
  "not-started": { icon: "⚪", color: "#94A3B8", label: "Not Started" },
  "revision-requested": {
    icon: "🔄",
    color: "#F97316",
    label: "Revision Requested",
  },
};

export const ApprovalTab: React.FC<ApprovalTabProps> = ({
  bid,
  teamMembers,
  currentUser,
  canEdit,
  onSave,
}) => {
  const isGateOpen =
    bid.currentPhase === "Close Out" &&
    bid.currentStatus === "Pending Approval";

  // Only Engineering members can start/manage approval rounds
  const isEngineeringUser = React.useMemo(() => {
    return teamMembers.some(
      (m) =>
        m.email.toLowerCase() === currentUser.email.toLowerCase() &&
        m.sector === "engineering" &&
        m.isActive,
    );
  }, [teamMembers, currentUser.email]);

  const canManageApproval = canEdit && isEngineeringUser;

  // Current round number (based on existing rounds history)
  const existingRounds = bid.approvalRounds || [];
  const currentRoundNumber = existingRounds.length + 1;

  // A new approval round is needed when:
  // - Gate is open AND approvalStatus was reset to "not-started" (after revision)
  // - OR gate is open AND there's an active revision that hasn't been re-approved
  const hasActiveRevisionPending = React.useMemo(() => {
    const revisions = bid.revisions || [];
    if (revisions.length === 0) return false;
    const lastRevision = revisions[revisions.length - 1];
    // If the last revision is open (no closedDate) and we're back at Close Out/Pending Approval
    return !lastRevision.closedDate && isGateOpen;
  }, [bid.revisions, isGateOpen]);

  const needsNewRound =
    isGateOpen &&
    (bid.approvalStatus === "not-started" || hasActiveRevisionPending);
  const isTrackingMode = bid.approvalStatus !== "not-started" && !needsNewRound;

  // ── State ──
  const [sectorSelections, setSectorSelections] = React.useState<
    Record<Sector, IPersonRef[]>
  >({} as any);
  const [lockedApprovers, setLockedApprovers] = React.useState<
    Record<Sector, IPersonRef[]>
  >({} as any);
  const [searchTerms, setSearchTerms] = React.useState<Record<Sector, string>>(
    {} as any,
  );
  const [openPicker, setOpenPicker] = React.useState<Sector | null>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const pickerRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // ── Initialize pre-selections and auto-locks ──
  React.useEffect(() => {
    const selections: Record<string, IPersonRef[]> = {};
    const locks: Record<string, IPersonRef[]> = {};

    SECTOR_CONFIGS.forEach((cfg) => {
      if (!cfg.isVisible(bid)) return;
      const preSelected = cfg.preSelectFn(bid);
      const autoLocked = cfg.autoLockFn(bid, teamMembers);
      // Merge auto-locked into selections (no duplicates)
      const combined = [...autoLocked];
      preSelected.forEach((p) => {
        if (!combined.some((c) => c.email === p.email)) {
          combined.push(p);
        }
      });
      selections[cfg.sector] = combined;
      locks[cfg.sector] = autoLocked;
    });

    setSectorSelections(selections as any);
    setLockedApprovers(locks as any);
  }, [bid.bidNumber]);

  // ── Close picker on outside click ──
  React.useEffect(() => {
    const handle = (e: MouseEvent): void => {
      if (openPicker) {
        const ref = pickerRefs.current[openPicker];
        if (ref && !ref.contains(e.target as Node)) {
          setOpenPicker(null);
        }
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [openPicker]);

  // ── Helpers ──
  const getFilteredMembers = (cfg: SectorConfig): ITeamMember[] => {
    const available = teamMembers.filter((m) => cfg.filterFn(m, bid));
    const selected = sectorSelections[cfg.sector] || [];
    return available.filter((m) => !selected.some((s) => s.email === m.email));
  };

  const getSearchFiltered = (cfg: SectorConfig): ITeamMember[] => {
    const members = getFilteredMembers(cfg);
    const q = (searchTerms[cfg.sector] || "").toLowerCase();
    if (!q) return members;
    return members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q),
    );
  };

  const addApprover = (sector: Sector, member: ITeamMember): void => {
    setSectorSelections((prev) => ({
      ...prev,
      [sector]: [
        ...(prev[sector] || []),
        {
          name: member.name,
          email: member.email,
          role: member.jobTitle,
          photoUrl: member.photoUrl,
        },
      ],
    }));
    setSearchTerms((prev) => ({ ...prev, [sector]: "" }));
    setOpenPicker(null);
  };

  const removeApprover = (sector: Sector, email: string): void => {
    const locked = lockedApprovers[sector] || [];
    if (locked.some((l) => l.email === email)) return; // Can't remove locked
    setSectorSelections((prev) => ({
      ...prev,
      [sector]: (prev[sector] || []).filter((p) => p.email !== email),
    }));
  };

  const isLocked = (sector: Sector, email: string): boolean => {
    return (lockedApprovers[sector] || []).some((l) => l.email === email);
  };

  // ── Validation ──
  const validationErrors: string[] = [];
  const visibleSectors = SECTOR_CONFIGS.filter((cfg) => cfg.isVisible(bid));

  visibleSectors.forEach((cfg) => {
    if (cfg.required) {
      const count = (sectorSelections[cfg.sector] || []).length;
      if (count < Math.max(cfg.minCount, 1)) {
        validationErrors.push(
          `${cfg.label}: at least ${Math.max(cfg.minCount, 1)} approver required`,
        );
      }
    }
  });

  const canStart = validationErrors.length === 0 && canManageApproval;

  // ── Start Approval ──
  const handleStartApproval = async (): Promise<void> => {
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const roundNumber = currentRoundNumber;

      // Build IBidApproval[] from selections
      const approvals: IBidApproval[] = [];
      let stepOrder = 1;
      visibleSectors.forEach((cfg) => {
        const selected = sectorSelections[cfg.sector] || [];
        selected.forEach((person) => {
          approvals.push({
            id: `apr-r${roundNumber}-${cfg.sector}-${stepOrder}`,
            round: roundNumber,
            stakeholderRole: cfg.label,
            stakeholder: person,
            status: "pending" as ApprovalStatus,
            requestedDate: now,
            respondedDate: null,
            decision: null,
            comments: null,
            approvedVia: null,
            notificationSent: false,
            reminderCount: 0,
          });
          stepOrder++;
        });
      });

      // Build sector groups for SP list
      const sectorGroups: IApprovalSectorGroup[] = visibleSectors.map(
        (cfg) => ({
          sector: cfg.sector,
          sectorLabel: cfg.label,
          approvers: sectorSelections[cfg.sector] || [],
          isAutoLocked: (lockedApprovers[cfg.sector] || []).length > 0,
          isPreSelected: cfg.preSelectFn(bid).length > 0,
        }),
      );

      // Write to smartbid-approvals SP list
      await ApprovalService.startApprovalRound(
        bid.bidNumber,
        sectorGroups,
        currentUser,
        bid,
      );

      // Build new round record for history
      const newRound: IApprovalRound = {
        round: roundNumber,
        startedDate: now,
        startedBy: currentUser,
        status: "pending",
        completedDate: null,
        approvals,
      };

      // Append to rounds history (preserve all previous rounds)
      const updatedRounds = [...existingRounds, newRound];

      // Save to BID JSON
      onSave(approvals, "pending", updatedRounds);
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to start approval:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ═══════════════════════════════════════════════════════
  // RENDER: Gate Banner (not in Close Out / Pending Approval)
  // ═══════════════════════════════════════════════════════
  if (!isGateOpen && !isTrackingMode) {
    return (
      <div className={styles.container}>
        <div className={styles.gateBanner}>
          <span className={styles.gateBannerIcon}>🔒</span>
          <div className={styles.gateBannerContent}>
            <span className={styles.gateBannerTitle}>
              Approval Not Available
            </span>
            <span className={styles.gateBannerText}>
              The approval flow is available when the BID reaches the{" "}
              <strong>Close Out</strong> phase with{" "}
              <strong>Pending Approval</strong> status. Complete all previous
              phases before requesting approval.
            </span>
            <div className={styles.gateBannerStatus}>
              <span className={styles.statusChip}>
                📍 Phase: {bid.currentPhase}
              </span>
              <span className={styles.statusChip}>
                📌 Status: {bid.currentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: Tracking Mode (approval already started)
  // ═══════════════════════════════════════════════════════
  if (isTrackingMode) {
    const approvals = bid.approvals || [];
    const totalCount = approvals.length;
    const approvedCount = approvals.filter(
      (a) => a.status === "approved",
    ).length;
    const rejectedCount = approvals.filter(
      (a) => a.status === "rejected",
    ).length;
    const overallStatus =
      STATUS_DISPLAY[bid.approvalStatus] || STATUS_DISPLAY["pending"];
    const progressPct = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

    // Group approvals by stakeholderRole
    const grouped: Record<string, IBidApproval[]> = {};
    approvals.forEach((a) => {
      if (!grouped[a.stakeholderRole]) grouped[a.stakeholderRole] = [];
      grouped[a.stakeholderRole].push(a);
    });

    return (
      <div className={styles.container}>
        {/* Summary Bar */}
        <div className={styles.summaryBar}>
          <div
            className={styles.summaryStatusBadge}
            style={{
              background: `${overallStatus.color}18`,
              border: `1px solid ${overallStatus.color}50`,
              color: overallStatus.color,
            }}
          >
            {overallStatus.icon} {overallStatus.label}
          </div>
          <div className={styles.summaryProgress}>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{
                  width: `${progressPct}%`,
                  background: overallStatus.color,
                }}
              />
            </div>
            <span className={styles.progressLabel}>
              {approvedCount} of {totalCount} approved
              {rejectedCount > 0 ? ` · ${rejectedCount} rejected` : ""}
            </span>
          </div>
        </div>

        {/* Tracking Cards by Sector */}
        <div className={styles.trackingGrid}>
          {Object.keys(grouped).map((sectorLabel) => {
            const sectorApprovals = grouped[sectorLabel];
            const sectorCfg = SECTOR_CONFIGS.find(
              (c) => c.label === sectorLabel,
            );
            const allApproved = sectorApprovals.every(
              (a) => a.status === "approved",
            );
            const anyRejected = sectorApprovals.some(
              (a) => a.status === "rejected",
            );
            const sectorStatus = allApproved
              ? STATUS_DISPLAY["approved"]
              : anyRejected
                ? STATUS_DISPLAY["rejected"]
                : STATUS_DISPLAY["pending"];

            return (
              <div key={sectorLabel} className={styles.trackingCard}>
                <div className={styles.trackingCardHeader}>
                  <span className={styles.sectorIcon}>
                    {sectorCfg?.icon || "📌"}
                  </span>
                  <span className={styles.sectorName}>{sectorLabel}</span>
                  <span
                    className={styles.trackingSectorStatus}
                    style={{
                      background: `${sectorStatus.color}18`,
                      color: sectorStatus.color,
                    }}
                  >
                    {sectorStatus.icon} {sectorStatus.label}
                  </span>
                </div>
                {sectorApprovals.map((approval) => {
                  const display =
                    STATUS_DISPLAY[approval.status] ||
                    STATUS_DISPLAY["pending"];
                  return (
                    <div
                      key={approval.id}
                      className={styles.trackingApproverRow}
                    >
                      <div className={styles.trackingApproverInfo}>
                        <PersonaCard
                          name={approval.stakeholder.name}
                          email={approval.stakeholder.email}
                          role={approval.stakeholder.role}
                          photoUrl={approval.stakeholder.photoUrl}
                          size="small"
                        />
                      </div>
                      <div className={styles.trackingApproverDecision}>
                        <span className={styles.trackingDecisionIcon}>
                          {display.icon}
                        </span>
                        {approval.respondedDate && (
                          <span className={styles.trackingDecisionDate}>
                            {formatDate(approval.respondedDate)}
                          </span>
                        )}
                      </div>
                      {approval.comments && (
                        <span className={styles.trackingComments}>
                          "{approval.comments}"
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════
  // RENDER: Setup Mode (selecting approvers)
  // ═══════════════════════════════════════════════════════
  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>
          Select Approvers by Sector
          {currentRoundNumber > 1 && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: "var(--text-secondary)",
                marginLeft: 8,
              }}
            >
              (Round {currentRoundNumber})
            </span>
          )}
        </h3>
        <button
          className={styles.startBtn}
          disabled={!canStart || submitting}
          onClick={() => setShowConfirm(true)}
        >
          {submitting ? "Starting..." : "🚀 Start Approval"}
        </button>
      </div>

      {/* Non-engineering user warning */}
      {!isEngineeringUser && (
        <div className={styles.validationWarning}>
          🔒 Only Engineering team members can start and manage approval rounds.
        </div>
      )}

      {/* CAPEX Warning */}
      {bid.costSummary.assetsCapexUSD > CAPEX_THRESHOLD_USD && (
        <div className={styles.validationWarning}>
          ⚠️ CAPEX exceeds $200k USD — Engineering Sr. Manager is automatically
          required and locked.
        </div>
      )}

      {/* Validation Errors */}
      {validationErrors.length > 0 && !canStart && isEngineeringUser && (
        <div className={styles.validationWarning}>
          ⚠️ {validationErrors[0]}
          {validationErrors.length > 1 &&
            ` (+${validationErrors.length - 1} more)`}
        </div>
      )}

      {/* Sector Cards */}
      <div className={styles.sectorGrid}>
        {visibleSectors.map((cfg) => {
          const selected = sectorSelections[cfg.sector] || [];
          const sectorLocks = lockedApprovers[cfg.sector] || [];
          const hasAutoLock = sectorLocks.length > 0;
          const filteredMembers = getSearchFiltered(cfg);

          return (
            <div
              key={cfg.sector}
              className={`${styles.sectorCard} ${hasAutoLock ? styles.sectorCardLocked : ""}`}
              ref={(el) => {
                pickerRefs.current[cfg.sector] = el;
              }}
            >
              {/* Card Header */}
              <div className={styles.sectorCardHeader}>
                <span className={styles.sectorIcon}>{cfg.icon}</span>
                <span className={styles.sectorName}>{cfg.label}</span>
                {hasAutoLock ? (
                  <span
                    className={`${styles.sectorBadge} ${styles.badgeLocked}`}
                  >
                    🔒 Auto-locked
                  </span>
                ) : cfg.required ? (
                  <span
                    className={`${styles.sectorBadge} ${styles.badgeRequired}`}
                  >
                    Required
                  </span>
                ) : (
                  <span
                    className={`${styles.sectorBadge} ${styles.badgeOptional}`}
                  >
                    Optional
                  </span>
                )}
              </div>

              {/* Selected Approvers */}
              {selected.length > 0 && (
                <div className={styles.selectedList}>
                  {selected.map((person) => {
                    const locked = isLocked(cfg.sector, person.email);
                    return (
                      <div
                        key={person.email}
                        className={`${styles.selectedItem} ${locked ? styles.selectedItemLocked : ""}`}
                      >
                        <div className={styles.selectedItemContent}>
                          <PersonaCard
                            name={person.name}
                            email={person.email}
                            role={person.role}
                            photoUrl={person.photoUrl}
                            size="small"
                          />
                        </div>
                        {locked ? (
                          <span className={styles.lockIcon}>🔒</span>
                        ) : (
                          <button
                            className={styles.removeBtn}
                            onClick={() =>
                              removeApprover(cfg.sector, person.email)
                            }
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Picker Input */}
              <div className={styles.pickerWrapper}>
                <input
                  className={styles.pickerInput}
                  value={searchTerms[cfg.sector] || ""}
                  onChange={(e) => {
                    setSearchTerms((prev) => ({
                      ...prev,
                      [cfg.sector]: e.target.value,
                    }));
                    setOpenPicker(cfg.sector);
                  }}
                  onFocus={() => setOpenPicker(cfg.sector)}
                  placeholder={`Search ${cfg.label} team...`}
                />
                {openPicker === cfg.sector && (
                  <div className={styles.pickerDropdown}>
                    {filteredMembers.length === 0 ? (
                      <div className={styles.pickerDropdownEmpty}>
                        No available members found
                      </div>
                    ) : (
                      filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className={styles.pickerDropdownItem}
                          onClick={() => addApprover(cfg.sector, member)}
                        >
                          <PersonaCard
                            name={member.name}
                            email={member.email}
                            role={member.jobTitle}
                            photoUrl={member.photoUrl}
                            size="small"
                          />
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>Start Approval Round?</div>
            <div className={styles.confirmText}>
              This will notify all selected approvers and start the approval
              flow. You won't be able to modify approvers after starting.
              <br />
              <br />
              <strong>
                {visibleSectors.reduce(
                  (sum, cfg) =>
                    sum + (sectorSelections[cfg.sector] || []).length,
                  0,
                )}{" "}
                approvers
              </strong>{" "}
              across{" "}
              <strong>
                {
                  visibleSectors.filter(
                    (cfg) => (sectorSelections[cfg.sector] || []).length > 0,
                  ).length
                }
              </strong>{" "}
              sectors will be included.
            </div>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmBtnCancel}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtnStart}
                onClick={handleStartApproval}
                disabled={submitting}
              >
                {submitting ? "Starting..." : "Confirm & Start"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
