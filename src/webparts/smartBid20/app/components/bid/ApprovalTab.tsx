import * as React from "react";
import {
  Check,
  X,
  Clock,
  Circle,
  RefreshCw,
  FastForward,
  ShieldCheck,
  Ban,
  Undo2,
} from "lucide-react";
import {
  IActivityLogEntry,
  IBid,
  IApprovalRound,
  IApprovalOverride,
  IApprovalSectorWaiver,
} from "../../models/IBid";
import { IBidApproval } from "../../models/IBid";
import { IApprovalSectorGroup } from "../../models/IBidApproval";
import { ITeamMember } from "../../models/ITeamMember";
import { IPersonRef, Sector } from "../../models/IUser";
import { ApprovalStatus } from "../../models/IBidStatus";
import { PersonaCard } from "../common/PersonaCard";
import { ApprovalOverrideBanner } from "../approval/ApprovalOverrideBanner";
import { ApprovalService } from "../../services/ApprovalService";
import { useUIStore } from "../../stores/useUIStore";
import {
  APPROVAL_FLOW_ACTOR,
  computeRoundSectorDurations,
  computeApprovalCycleTime,
  getActiveApprovalOverride,
  getMissingApprovalActivityEntries,
} from "../../utils/approvalHelpers";
import { buildHistoryTransition } from "../../utils/phaseHelpers";
import { isTerminalStatus } from "../../utils/statusHelpers";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import { formatDate } from "../../utils/formatters";
import styles from "./ApprovalTab.module.scss";

interface ApprovalTabProps {
  bid: IBid;
  teamMembers: ITeamMember[];
  currentUser: IPersonRef;
  canEdit: boolean;
  onPatchBid: (patch: Partial<IBid>) => void;
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
  const bl = member.businessLines;
  const div: string = bid.division || "";
  const sl = (bid.serviceLine || "").toLowerCase();

  if (div === "SSR") {
    if (sl === "rov") return bl.includes("ROV");
    if (sl === "survey") return bl.includes("SURVEY");
    if (sl === "integrated") return bl.includes("ROV") || bl.includes("SURVEY");
    // unknown SSR service line — accept any SSR member
    return bl.includes("ROV") || bl.includes("SURVEY");
  }
  if (div === "OPG") {
    return bl.includes("OPG") || bl.length === 0;
  }

  // Legacy division values saved before the SSR/serviceLine split
  if (div === "SSR-ROV") return bl.includes("ROV");
  if (div === "SSR-Survey") return bl.includes("SURVEY");
  if (div === "SSR-Integrated")
    return bl.includes("ROV") || bl.includes("SURVEY");

  return bl.includes(div as any) || bl.length === 0;
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
  { icon: React.ReactNode; color: string; label: string }
> = {
  approved: {
    icon: <Check size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--success)",
    label: "Approved",
  },
  rejected: {
    icon: <X size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--danger)",
    label: "Rejected",
  },
  pending: {
    icon: <Clock size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--warning)",
    label: "Pending",
  },
  "not-started": {
    icon: <Circle size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--text-muted)",
    label: "Not Started",
  },
  "revision-requested": {
    icon: <RefreshCw size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--warning)",
    label: "Revision Requested",
  },
  overridden: {
    icon: <ShieldCheck size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--tertiary-accent)",
    label: "Approved (Override)",
  },
  bypassed: {
    icon: <FastForward size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--tertiary-accent)",
    label: "Bypassed by override",
  },
  waived: {
    icon: <Ban size={14} style={{ verticalAlign: "-2px" }} />,
    color: "var(--text-secondary)",
    label: "Not required",
  },
};

export const ApprovalTab: React.FC<ApprovalTabProps> = ({
  bid,
  teamMembers,
  currentUser,
  canEdit,
  onPatchBid,
}) => {
  const isGateOpen =
    bid.currentPhase === "Close Out" &&
    bid.currentStatus === "Pending Approval";

  // Engineering members can start/manage approval rounds
  const isEngineeringUser = React.useMemo(() => {
    return teamMembers.some(
      (m) =>
        m.email.toLowerCase() === currentUser.email.toLowerCase() &&
        m.sector === "engineering" &&
        m.isActive,
    );
  }, [teamMembers, currentUser.email]);

  // The BID's assigned analyst may also start/manage approval rounds
  const isBidAnalyst = React.useMemo(() => {
    return (bid.analyst || []).some(
      (p) => p.email.toLowerCase() === currentUser.email.toLowerCase(),
    );
  }, [bid.analyst, currentUser.email]);

  const canManageApproval = canEdit && (isEngineeringUser || isBidAnalyst);

  // Override is restricted to active Engineering members (no analyst / super admin bypass)
  const canOverride = canEdit && isEngineeringUser;
  const isCloseOutPhase = bid.currentPhase === "Close Out";
  const activeOverride = getActiveApprovalOverride(bid);

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
  const hasRunningRound = isTrackingMode && bid.approvalStatus !== "approved";
  const showOverride =
    canOverride &&
    !isTerminalStatus(bid.currentStatus) &&
    (hasRunningRound || !isTrackingMode);

  // ── Auto-complete: when all approvals are approved, transition to "Completed" ──
  React.useEffect(() => {
    if (bid.approvalStatus !== "approved") return;
    if (bid.currentStatus === "Completed") return;
    const approvals = bid.approvals || [];
    if (approvals.length === 0) return;
    const allApproved = approvals.every((a) => a.status === "approved");
    if (allApproved) {
      const nowIso = new Date().toISOString();
      // Persist per-sector approval durations for the closing round + cycle time.
      const rounds = bid.approvalRounds || [];
      let updatedRounds = rounds;
      if (rounds.length > 0) {
        const last = rounds[rounds.length - 1];
        const enriched: IApprovalRound = {
          ...last,
          approvals: approvals.length ? approvals : last.approvals,
          status: "approved",
          completedDate: last.completedDate || nowIso,
        };
        enriched.sectorDurations = computeRoundSectorDurations(enriched);
        updatedRounds = [...rounds.slice(0, -1), enriched];
      }
      const cycle = computeApprovalCycleTime({
        ...bid,
        approvalRounds: updatedRounds,
      });
      const missingLogs = getMissingApprovalActivityEntries({
        ...bid,
        approvalRounds: updatedRounds,
        currentStatus: "Completed",
        completedDate: nowIso,
      });
      onPatchBid({
        currentStatus: "Completed",
        currentPhase: "Close Out" as any,
        completedDate: nowIso,
        ...buildHistoryTransition(
          bid,
          "Close Out" as any,
          "Completed",
          APPROVAL_FLOW_ACTOR,
          nowIso,
        ),
        approvalRounds: updatedRounds,
        kpis: { ...bid.kpis, approvalCycleTime: cycle },
        activityLog: [...(bid.activityLog || []), ...missingLogs],
      });
    }
  }, [bid.approvalStatus, bid.approvals, bid.currentStatus]);

  // ── State ──
  const [sectorSelections, setSectorSelections] = React.useState<
    Record<Sector, IPersonRef[]>
  >({} as any);
  const selectionsRef = React.useRef<Record<Sector, IPersonRef[]>>({} as any);
  const [lockedApprovers, setLockedApprovers] = React.useState<
    Record<Sector, IPersonRef[]>
  >({} as any);
  const [searchTerms, setSearchTerms] = React.useState<Record<Sector, string>>(
    {} as any,
  );
  const [openPicker, setOpenPicker] = React.useState<Sector | null>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [showPhaseTransitionConfirm, setShowPhaseTransitionConfirm] =
    React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [showOverrideConfirm, setShowOverrideConfirm] = React.useState(false);
  const [overrideReason, setOverrideReason] = React.useState("");
  const [overriding, setOverriding] = React.useState(false);
  const [waiverTarget, setWaiverTarget] = React.useState<SectorConfig | null>(
    null,
  );
  const [waiverReason, setWaiverReason] = React.useState("");
  const addToast = useUIStore((s) => s.addToast);

  const pickerRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  // ── Initialize pre-selections and auto-locks ──
  React.useEffect(() => {
    const selections: Record<string, IPersonRef[]> = {};
    const locks: Record<string, IPersonRef[]> = {};

    SECTOR_CONFIGS.forEach((cfg) => {
      if (!cfg.isVisible(bid)) return;
      const saved = bid.approvalDraftSelections?.[cfg.sector];
      const preSelected = saved !== undefined ? saved : cfg.preSelectFn(bid);
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

    selectionsRef.current = selections as Record<Sector, IPersonRef[]>;
    setSectorSelections(selections as any);
    setLockedApprovers(locks as any);
  }, [
    bid.bidNumber,
    bid.approvalDraftSelections,
    bid.commercialRequester,
    bid.projectManager,
    bid.costSummary.assetsCapexUSD,
    bid.serviceLine,
    teamMembers,
  ]);

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
    if (!canManageApproval) return;
    const next = {
      ...selectionsRef.current,
      [sector]: [
        ...(selectionsRef.current[sector] || []),
        {
          name: member.name,
          email: member.email,
          role: member.jobTitle,
          photoUrl: member.photoUrl,
        },
      ],
    };
    selectionsRef.current = next;
    setSectorSelections(next);
    onPatchBid({ approvalDraftSelections: next });
    setSearchTerms((prev) => ({ ...prev, [sector]: "" }));
    setOpenPicker(null);
  };

  const removeApprover = (sector: Sector, email: string): void => {
    if (!canManageApproval) return;
    const locked = lockedApprovers[sector] || [];
    if (locked.some((l) => l.email === email)) return; // Can't remove locked
    const next = {
      ...selectionsRef.current,
      [sector]: (selectionsRef.current[sector] || []).filter(
        (p) => p.email !== email,
      ),
    };
    selectionsRef.current = next;
    setSectorSelections(next);
    onPatchBid({ approvalDraftSelections: next });
  };

  const isLocked = (sector: Sector, email: string): boolean => {
    return (lockedApprovers[sector] || []).some((l) => l.email === email);
  };

  // ── Sector waivers (required sector marked as not required for this BID) ──
  const sectorWaivers = bid.approvalSectorWaivers || {};
  // Auto-locked sectors (e.g. CAPEX rule) can't be waived
  const getWaiver = (cfg: SectorConfig): IApprovalSectorWaiver | null =>
    cfg.required && (lockedApprovers[cfg.sector] || []).length === 0
      ? sectorWaivers[cfg.sector] || null
      : null;

  const closeWaiverDialog = (): void => {
    setWaiverTarget(null);
    setWaiverReason("");
  };

  const handleWaiveSector = (): void => {
    const reason = waiverReason.trim();
    if (!waiverTarget || !reason || !canManageApproval) return;
    const actor: IPersonRef = {
      name: currentUser.name,
      email: currentUser.email,
      role: currentUser.role,
    };
    const waiver: IApprovalSectorWaiver = {
      sector: waiverTarget.sector,
      sectorLabel: waiverTarget.label,
      reason,
      waivedBy: actor,
      waivedDate: new Date().toISOString(),
    };
    const logEntry = createActivityLogEntry(
      "APPROVAL_SECTOR_WAIVED",
      `${waiver.sectorLabel} approval marked as not required for this BID. Justification: "${reason}"`,
      actor.email,
      actor.name,
      {
        sector: waiver.sector,
        sectorLabel: waiver.sectorLabel,
        round: currentRoundNumber,
        reason,
      },
    );
    onPatchBid({
      approvalSectorWaivers: { ...sectorWaivers, [waiver.sector]: waiver },
      activityLog: [...(bid.activityLog || []), logEntry],
    });
    closeWaiverDialog();
  };

  const handleReinstateSector = (
    cfg: SectorConfig,
    waiver: IApprovalSectorWaiver,
  ): void => {
    if (!canManageApproval) return;
    const next = { ...sectorWaivers };
    delete next[cfg.sector];
    const logEntry = createActivityLogEntry(
      "APPROVAL_SECTOR_REINSTATED",
      `${cfg.label} approval marked as required again for this BID (previous justification: "${waiver.reason}")`,
      currentUser.email,
      currentUser.name,
      {
        sector: cfg.sector,
        sectorLabel: cfg.label,
        round: currentRoundNumber,
        previousReason: waiver.reason,
        previousWaivedBy: waiver.waivedBy,
        previousWaivedDate: waiver.waivedDate,
      },
    );
    onPatchBid({
      approvalSectorWaivers: next,
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

  const renderWaiverNote = (waiver: IApprovalSectorWaiver): JSX.Element => (
    <div className={styles.waiverNote}>
      <span className={styles.waiverLabel}>Not required for this BID</span>
      <span className={styles.waiverReason}>{waiver.reason}</span>
      <span className={styles.waiverMeta}>
        by {waiver.waivedBy.name} · {formatDate(waiver.waivedDate)}
      </span>
    </div>
  );

  // ── Validation ──
  const validationErrors: string[] = [];
  const visibleSectors = SECTOR_CONFIGS.filter((cfg) => cfg.isVisible(bid));
  const activeSectors = visibleSectors.filter((cfg) => !getWaiver(cfg));
  const activeWaivers: IApprovalSectorWaiver[] = [];
  visibleSectors.forEach((cfg) => {
    const w = getWaiver(cfg);
    if (w) activeWaivers.push(w);
  });

  activeSectors.forEach((cfg) => {
    if (cfg.required) {
      const count = (sectorSelections[cfg.sector] || []).length;
      if (count < Math.max(cfg.minCount, 1)) {
        validationErrors.push(
          `${cfg.label}: at least ${Math.max(cfg.minCount, 1)} approver required`,
        );
      }
    }
  });

  const totalSelectedApprovers = activeSectors.reduce(
    (sum, cfg) => sum + (sectorSelections[cfg.sector] || []).length,
    0,
  );
  if (validationErrors.length === 0 && totalSelectedApprovers === 0) {
    validationErrors.push("Select at least one approver");
  }

  const canStart = validationErrors.length === 0 && canManageApproval;

  // ── Start Approval ──
  const handleStartApproval = async (): Promise<void> => {
    setSubmitting(true);
    try {
      const now = new Date().toISOString();
      const roundNumber = currentRoundNumber;
      const logs: IActivityLogEntry[] = [];

      // If BID is not in Close Out / Pending Approval, transition it first
      const transition: Partial<IBid> = {};
      if (
        bid.currentPhase !== "Close Out" ||
        bid.currentStatus !== "Pending Approval"
      ) {
        transition.currentPhase = "Close Out" as any;
        transition.currentStatus = "Pending Approval";
        Object.assign(
          transition,
          buildHistoryTransition(
            bid,
            "Close Out" as any,
            "Pending Approval",
            currentUser.name,
            now,
          ),
        );
        if (bid.currentPhase !== "Close Out") {
          logs.push(
            createActivityLogEntry(
              "PHASE_CHANGED",
              `Phase changed from "${bid.currentPhase}" to "Close Out"`,
              currentUser.email,
              currentUser.name,
              { fromPhase: bid.currentPhase, toPhase: "Close Out" },
            ),
          );
        }
        if (bid.currentStatus !== "Pending Approval") {
          logs.push(
            createActivityLogEntry(
              "STATUS_CHANGED",
              `Status changed from "${bid.currentStatus}" to "Pending Approval"`,
              currentUser.email,
              currentUser.name,
              {
                fromStatus: bid.currentStatus,
                toStatus: "Pending Approval",
              },
            ),
          );
        }
      }

      // Build IBidApproval[] from selections
      const approvals: IBidApproval[] = [];
      let stepOrder = 1;
      activeSectors.forEach((cfg) => {
        const selected = sectorSelections[cfg.sector] || [];
        selected.forEach((person) => {
          approvals.push({
            id: `apr-r${roundNumber}-${cfg.sector}-${stepOrder}`,
            round: roundNumber,
            stakeholderRole: cfg.label,
            sector: cfg.sector,
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
      const sectorGroups: IApprovalSectorGroup[] = activeSectors.map(
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
        roundNumber,
      );

      // Build new round record for history
      const newRound: IApprovalRound = {
        round: roundNumber,
        startedDate: now,
        startedBy: currentUser,
        status: "pending",
        completedDate: null,
        approvals,
        ...(activeWaivers.length > 0 ? { waivedSectors: activeWaivers } : {}),
      };

      // Append to rounds history (preserve all previous rounds)
      const updatedRounds = [...existingRounds, newRound];

      const approverList = approvals
        .map((a) => `${a.stakeholder.name} (${a.stakeholderRole})`)
        .join(", ");
      const waivedList = activeWaivers.map((w) => w.sectorLabel).join(", ");
      logs.push(
        createActivityLogEntry(
          "APPROVAL_REQUESTED",
          `Approval round ${roundNumber} started with ${approvals.length} approver${approvals.length === 1 ? "" : "s"}: ${approverList}` +
            (waivedList ? `. Not required: ${waivedList}` : ""),
          currentUser.email,
          currentUser.name,
          {
            round: roundNumber,
            approvers: approvals.map((a) => ({
              name: a.stakeholder.name,
              email: a.stakeholder.email,
              sector: a.stakeholderRole,
            })),
            waivedSectors: activeWaivers.map((w) => w.sector),
          },
        ),
      );

      // Save to BID JSON
      onPatchBid({
        ...transition,
        approvals,
        approvalStatus: "pending",
        approvalRounds: updatedRounds,
        approvalDraftSelections: {},
        activityLog: [...(bid.activityLog || []), ...logs],
      });
      setShowConfirm(false);
    } catch (err) {
      console.error("Failed to start approval:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Override Approval (Engineering only, phase must already be Close Out) ──
  const overrideApprovals = hasRunningRound ? bid.approvals || [] : [];
  const overrideApproved = overrideApprovals.filter(
    (a) => a.status === "approved",
  );
  const overridePending = overrideApprovals.filter(
    (a) => a.status !== "approved",
  );
  const bypassedText = overridePending
    .map((a) => `${a.stakeholder.name} (${a.stakeholderRole})`)
    .join(", ");

  const closeOverrideDialog = (): void => {
    setShowOverrideConfirm(false);
    setOverrideReason("");
  };

  const handleOverride = async (): Promise<void> => {
    const reason = overrideReason.trim();
    if (!reason || !showOverride || !isCloseOutPhase) return;
    setOverriding(true);
    try {
      const nowIso = new Date().toISOString();
      const rounds = bid.approvalRounds || [];
      const actor: IPersonRef = {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
      };
      const override: IApprovalOverride = {
        overriddenBy: actor,
        overriddenDate: nowIso,
        reason,
        previousApprovalStatus: bid.approvalStatus || "not-started",
        totalApprovers: overrideApprovals.length,
        approvedCount: overrideApproved.length,
        approvalsAtOverride: overrideApprovals.map((a) => ({
          stakeholder: {
            name: a.stakeholder.name,
            email: a.stakeholder.email,
            role: a.stakeholder.role,
          },
          stakeholderRole: a.stakeholderRole,
          sector: a.sector,
          status: a.status,
          respondedDate: a.respondedDate,
        })),
      };

      let closedRound: IApprovalRound;
      let updatedRounds: IApprovalRound[];
      if (hasRunningRound) {
        // Legacy BIDs may carry approvals without a rounds history
        const base: IApprovalRound =
          rounds.length > 0
            ? rounds[rounds.length - 1]
            : {
                round: overrideApprovals[0]?.round || 1,
                startedDate: overrideApprovals[0]?.requestedDate || nowIso,
                startedBy: { name: "", email: "" },
                status: "pending",
                completedDate: null,
                approvals: overrideApprovals,
              };
        closedRound = {
          ...base,
          approvals: overrideApprovals,
          status: "approved",
          completedDate: nowIso,
          override,
        };
        closedRound.sectorDurations = computeRoundSectorDurations(closedRound);
        updatedRounds =
          rounds.length > 0
            ? [...rounds.slice(0, -1), closedRound]
            : [closedRound];
      } else {
        closedRound = {
          round: currentRoundNumber,
          startedDate: nowIso,
          startedBy: actor,
          status: "approved",
          completedDate: nowIso,
          approvals: [],
          override,
        };
        updatedRounds = [...rounds, closedRound];
      }

      const cycle = computeApprovalCycleTime({
        ...bid,
        approvalRounds: updatedRounds,
      });

      const description =
        overrideApprovals.length === 0
          ? `Approval overridden (Round ${closedRound.round}) before the approval flow was started. BID set to Completed. Reason: "${reason}"`
          : `Approval overridden (Round ${closedRound.round}) - ${overrideApproved.length} of ${overrideApprovals.length} approvers had approved` +
            (bypassedText ? `; bypassed: ${bypassedText}` : "") +
            `. BID set to Completed. Reason: "${reason}"`;
      const logEntry = createActivityLogEntry(
        "APPROVAL_OVERRIDE",
        description,
        actor.email,
        actor.name,
        {
          round: closedRound.round,
          previousApprovalStatus: override.previousApprovalStatus,
          previousStatus: bid.currentStatus,
          approvedCount: override.approvedCount,
          totalApprovers: override.totalApprovers,
          approved: overrideApproved.map((a) => ({
            name: a.stakeholder.name,
            email: a.stakeholder.email,
            sector: a.stakeholderRole,
            respondedDate: a.respondedDate,
          })),
          bypassed: overridePending.map((a) => ({
            name: a.stakeholder.name,
            email: a.stakeholder.email,
            sector: a.stakeholderRole,
            status: a.status,
          })),
          reason,
        },
      );
      const statusLog = createActivityLogEntry(
        "STATUS_CHANGED",
        `Status changed from "${bid.currentStatus}" to "Completed" - approval overridden (Round ${closedRound.round})`,
        actor.email,
        actor.name,
        {
          fromStatus: bid.currentStatus,
          toStatus: "Completed",
          round: closedRound.round,
          note: `Approval overridden (Round ${closedRound.round})`,
        },
      );

      onPatchBid({
        approvals: overrideApprovals,
        approvalStatus: "approved",
        approvalRounds: updatedRounds,
        approvalDraftSelections: {},
        currentStatus: "Completed",
        currentPhase: "Close Out" as any,
        completedDate: nowIso,
        ...buildHistoryTransition(
          bid,
          "Close Out" as any,
          "Completed",
          actor.name,
          nowIso,
        ),
        kpis: { ...bid.kpis, approvalCycleTime: cycle },
        activityLog: [...(bid.activityLog || []), logEntry, statusLog],
      });
      closeOverrideDialog();
      addToast({
        type: "success",
        title: "Approval overridden",
        message: `BID ${bid.bidNumber} was set to Completed.`,
      });

      if (hasRunningRound) {
        ApprovalService.markRoundOverridden(
          bid.bidNumber,
          closedRound.round,
          override,
        ).catch((err) => {
          console.error("Failed to flag approval round as Overridden:", err);
          addToast({
            type: "warning",
            title: "Teams approval flow not updated",
            message:
              "The override was saved, but the approval round in SharePoint could not be flagged as Overridden.",
          });
        });
      }
    } finally {
      setOverriding(false);
    }
  };

  const overrideButton = showOverride ? (
    <button
      className={styles.overrideBtn}
      disabled={!isCloseOutPhase || overriding}
      title={
        isCloseOutPhase
          ? "Force-close this approval as approved (Engineering only)"
          : "Override is only available when the BID phase is Close Out"
      }
      onClick={() => setShowOverrideConfirm(true)}
    >
      <ShieldCheck size={14} /> Override Approval
    </button>
  ) : null;

  const overrideDialog = showOverrideConfirm ? (
    <div className={styles.confirmOverlay}>
      <div className={`${styles.confirmBox} ${styles.overrideBox}`}>
        <div className={styles.confirmTitle}>Override Approval?</div>
        <div className={styles.confirmText}>
          The approval will be closed as <strong>Approved</strong> and the BID
          status set to <strong>Completed</strong>. The override is recorded
          with your name, the date and the reason below.
        </div>
        <div className={styles.overrideSummary}>
          {overrideApprovals.length === 0 ? (
            <span>
              The approval flow has not been started - the BID will be approved
              without approver responses.
            </span>
          ) : (
            <>
              <span>
                <strong>
                  {overrideApproved.length} of {overrideApprovals.length}
                </strong>{" "}
                approvers have already approved.
              </span>
              {overrideApproved.length > 0 && (
                <span>
                  <span className={styles.overrideListLabel}>Approved:</span>{" "}
                  {overrideApproved.map((a) => a.stakeholder.name).join(", ")}
                </span>
              )}
              {overridePending.length > 0 && (
                <span>
                  <span className={styles.overrideListLabel}>
                    Will be bypassed:
                  </span>{" "}
                  {bypassedText}
                </span>
              )}
            </>
          )}
        </div>
        <label
          className={styles.overrideLabel}
          htmlFor="approval-override-reason"
        >
          Reason for override <span className={styles.requiredMark}>*</span>
        </label>
        <textarea
          id="approval-override-reason"
          className={styles.overrideReason}
          value={overrideReason}
          onChange={(e) => setOverrideReason(e.target.value)}
          placeholder="Explain why the approval is being overridden..."
          maxLength={1000}
          rows={4}
          disabled={overriding}
        />
        <div className={styles.confirmActions}>
          <button
            className={styles.confirmBtnCancel}
            onClick={closeOverrideDialog}
            disabled={overriding}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtnOverride}
            onClick={handleOverride}
            disabled={!overrideReason.trim() || overriding}
          >
            {overriding ? "Overriding..." : "Confirm Override"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  const waiverDialog = waiverTarget ? (
    <div className={styles.confirmOverlay}>
      <div className={`${styles.confirmBox} ${styles.overrideBox}`}>
        <div className={styles.confirmTitle}>
          Mark {waiverTarget.label} as not required?
        </div>
        <div className={styles.confirmText}>
          The <strong>{waiverTarget.label}</strong> team will not be included
          in the approval flow for this BID. The justification is saved on the
          Approvals tab and in the activity log.
        </div>
        <label className={styles.overrideLabel} htmlFor="approval-waiver-reason">
          Justification <span className={styles.requiredMark}>*</span>
        </label>
        <textarea
          id="approval-waiver-reason"
          className={styles.overrideReason}
          value={waiverReason}
          onChange={(e) => setWaiverReason(e.target.value)}
          placeholder={`Explain why ${waiverTarget.label} is not involved in this BID...`}
          maxLength={1000}
          rows={4}
        />
        <div className={styles.confirmActions}>
          <button
            className={styles.confirmBtnCancel}
            onClick={closeWaiverDialog}
          >
            Cancel
          </button>
          <button
            className={styles.confirmBtnStart}
            onClick={handleWaiveSector}
            disabled={!waiverReason.trim()}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  ) : null;

  // ═══════════════════════════════════════════════════════
  // RENDER: Gate Banner (not in Close Out / Pending Approval)
  // Only shown for users who cannot manage approvals
  // ═══════════════════════════════════════════════════════
  if (!isGateOpen && !isTrackingMode && !canManageApproval) {
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
    const overallStatus = activeOverride
      ? STATUS_DISPLAY["overridden"]
      : STATUS_DISPLAY[bid.approvalStatus] || STATUS_DISPLAY["pending"];
    const progressPct = totalCount > 0 ? (approvedCount / totalCount) * 100 : 0;

    // Bypassed = not approved at the moment of the override (snapshot, not live status)
    const bypassedEmails = activeOverride
      ? activeOverride.approvalsAtOverride
          .filter((p) => p.status !== "approved")
          .map((p) => p.stakeholder.email.toLowerCase())
      : [];
    const isBypassed = (a: IBidApproval): boolean =>
      bypassedEmails.indexOf(a.stakeholder.email.toLowerCase()) >= 0;

    const roundWaivers =
      existingRounds.length > 0
        ? existingRounds[existingRounds.length - 1].waivedSectors || []
        : [];
    const waivedDisplay = STATUS_DISPLAY["waived"];

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
              background: `color-mix(in srgb, ${overallStatus.color} 10%, transparent)`,
              border: `1px solid color-mix(in srgb, ${overallStatus.color} 30%, transparent)`,
              color: overallStatus.color,
            }}
          >
            {overallStatus.icon} {overallStatus.label}
          </div>
          {totalCount > 0 && (
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
                {bypassedEmails.length > 0
                  ? ` · ${bypassedEmails.length} bypassed by override`
                  : ""}
              </span>
            </div>
          )}
          {overrideButton}
        </div>

        {activeOverride && <ApprovalOverrideBanner override={activeOverride} />}

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
            const anyBypassed = sectorApprovals.some(isBypassed);
            const sectorStatus = anyBypassed
              ? STATUS_DISPLAY["bypassed"]
              : allApproved
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
                      background: `color-mix(in srgb, ${sectorStatus.color} 10%, transparent)`,
                      color: sectorStatus.color,
                    }}
                  >
                    {sectorStatus.icon} {sectorStatus.label}
                  </span>
                </div>
                {sectorApprovals.map((approval) => {
                  const bypassed = isBypassed(approval);
                  const display = bypassed
                    ? STATUS_DISPLAY["bypassed"]
                    : STATUS_DISPLAY[approval.status] ||
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
                        <span
                          className={styles.trackingDecisionIcon}
                          title={display.label}
                          style={
                            bypassed ? { color: display.color } : undefined
                          }
                        >
                          {display.icon}
                        </span>
                        {bypassed ? (
                          <span className={styles.trackingBypassedTag}>
                            Bypassed
                          </span>
                        ) : (
                          approval.respondedDate && (
                            <span className={styles.trackingDecisionDate}>
                              {formatDate(approval.respondedDate)}
                            </span>
                          )
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
          {roundWaivers.map((waiver) => (
            <div
              key={`waived-${waiver.sector}`}
              className={`${styles.trackingCard} ${styles.sectorCardWaived}`}
            >
              <div className={styles.trackingCardHeader}>
                <span className={styles.sectorIcon}>
                  {SECTOR_CONFIGS.find((c) => c.sector === waiver.sector)
                    ?.icon || "📌"}
                </span>
                <span className={styles.sectorName}>{waiver.sectorLabel}</span>
                <span
                  className={styles.trackingSectorStatus}
                  style={{
                    background: `color-mix(in srgb, ${waivedDisplay.color} 12%, transparent)`,
                    color: waivedDisplay.color,
                  }}
                >
                  {waivedDisplay.icon} {waivedDisplay.label}
                </span>
              </div>
              {renderWaiverNote(waiver)}
            </div>
          ))}
        </div>

        {overrideDialog}
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
        <div className={styles.headerActions}>
          {overrideButton}
          <button
            className={styles.startBtn}
            disabled={!canStart || submitting}
            onClick={() => {
              // If not already in Close Out / Pending Approval, show phase transition confirmation first
              if (
                bid.currentPhase !== "Close Out" ||
                bid.currentStatus !== "Pending Approval"
              ) {
                setShowPhaseTransitionConfirm(true);
              } else {
                setShowConfirm(true);
              }
            }}
          >
            {submitting ? "Starting..." : "🚀 Start Approval"}
          </button>
        </div>
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
          ⚠️ CAPEX exceeds $200k USD - Engineering Sr. Manager is automatically
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
          const waiver = getWaiver(cfg);
          const canWaive = canManageApproval && cfg.required && !hasAutoLock;

          return (
            <div
              key={cfg.sector}
              className={`${styles.sectorCard} ${hasAutoLock ? styles.sectorCardLocked : ""} ${waiver ? styles.sectorCardWaived : ""}`}
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
                ) : waiver ? (
                  <span
                    className={`${styles.sectorBadge} ${styles.badgeWaived}`}
                  >
                    Not required
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

              {waiver && (
                <>
                  {renderWaiverNote(waiver)}
                  {canManageApproval && (
                    <button
                      className={styles.waiverToggleBtn}
                      onClick={() => handleReinstateSector(cfg, waiver)}
                    >
                      <Undo2 size={13} /> Mark as required
                    </button>
                  )}
                </>
              )}

              {/* Selected Approvers */}
              {!waiver && selected.length > 0 && (
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
                        {locked || !canManageApproval ? (
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
              {!waiver && canManageApproval && (
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
              )}

              {!waiver && canWaive && (
                <button
                  className={styles.waiverToggleBtn}
                  onClick={() => {
                    setOpenPicker(null);
                    setWaiverTarget(cfg);
                  }}
                >
                  <Ban size={13} /> Not required for this BID
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Phase Transition Confirm Dialog */}
      {showPhaseTransitionConfirm && (
        <div className={styles.confirmOverlay}>
          <div className={styles.confirmBox}>
            <div className={styles.confirmTitle}>
              Phase & Status Change Required
            </div>
            <div className={styles.confirmText}>
              To start the approval flow, the BID will be updated:
              <br />
              <br />
              <strong>Phase:</strong> {bid.currentPhase} →{" "}
              <strong>Close Out</strong>
              <br />
              <strong>Status:</strong> {bid.currentStatus} →{" "}
              <strong>Pending Approval</strong>
              <br />
              <br />
              Do you want to proceed with this change and start the approval
              setup?
            </div>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmBtnCancel}
                onClick={() => setShowPhaseTransitionConfirm(false)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmBtnStart}
                onClick={() => {
                  setShowPhaseTransitionConfirm(false);
                  setShowConfirm(true);
                }}
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

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
              <strong>{totalSelectedApprovers} approvers</strong> across{" "}
              <strong>
                {
                  activeSectors.filter(
                    (cfg) => (sectorSelections[cfg.sector] || []).length > 0,
                  ).length
                }
              </strong>{" "}
              sectors will be included.
              {activeWaivers.length > 0 && (
                <>
                  <br />
                  <br />
                  <strong>Not required for this BID:</strong>{" "}
                  {activeWaivers.map((w) => w.sectorLabel).join(", ")}
                </>
              )}
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

      {overrideDialog}
      {waiverDialog}
    </div>
  );
};
