import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link2, Lock } from "lucide-react";
import { useBidStore } from "../stores/useBidStore";
import { useAuthStore } from "../stores/useAuthStore";
import { ROUTES } from "../config/routes.config";
import { StatusBadge } from "../components/common/StatusBadge";
import { ScopeOfSupplyTab } from "../components/bid/ScopeOfSupplyTab";
import { AssetsBreakdownTab } from "../components/bid/AssetsBreakdownTab";
import { LogisticsBreakdownTab } from "../components/bid/LogisticsBreakdownTab";
import { CertificationsBreakdownTab } from "../components/bid/CertificationsBreakdownTab";
import { PreparationMobilizationTab } from "../components/bid/PreparationMobilizationTab";
import { BidHoursTable } from "../components/bid/BidHoursTable";
import { BidCostSummary } from "../components/bid/BidCostSummary";
import { BidStatusPhasePanel } from "../components/bid/BidStatusPhasePanel";
import { ApprovalTab } from "../components/bid/ApprovalTab";
import { BidActivityLog } from "../components/bid/BidActivityLog";
import { BidExportTab } from "../components/bid/BidExportTab";
import { BidTimeline } from "../components/bid/BidTimeline";
import { BidFavoriteButton } from "../components/bid/BidFavoriteButton";
import { BidConfidentialButton } from "../components/bid/BidConfidentialButton";
import { ConfidentialLock } from "../components/bid/ConfidentialLock";
import { OverviewTab } from "../components/bid/OverviewTab";
import { DocumentsTab } from "../components/bid/DocumentsTab";
import { NotesTab } from "../components/bid/NotesTab";
import { QualificationsTab } from "../components/bid/QualificationsTab";
import {
  RevisionsTab,
  hasActiveRevision,
  getCurrentRevisionLetter,
} from "../components/bid/RevisionsTab";
import {
  detectRevisionChanges,
  getSectionFromPatch,
  appendRevisionChanges,
} from "../utils/revisionHelpers";
import {
  IntegratedDivisionTabs,
  resolveDivisions,
} from "../components/common/IntegratedDivisionTabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { usePastBidPublisher } from "../hooks/usePastBidPublisher";
import { useApprovalSync } from "../hooks/useApprovalSync";
import {
  needsClarificationLibrarySync,
  useClarificationLibrarySync,
} from "../hooks/useClarificationLibrarySync";
import {
  getMissingApprovalActivityEntries,
  getMissingApprovalHistoryPatch,
} from "../utils/approvalHelpers";
import { useTechnicalProposalPublisher } from "../hooks/useTechnicalProposalPublisher";
import { getTechnicalProposalAttachment } from "../utils/technicalProposalHelpers";
import { useUIStore } from "../stores/useUIStore";
import { useConfigStore } from "../stores/useConfigStore";
import { BidService } from "../services/BidService";
import { MembersService } from "../services/MembersService";
import {
  IBid,
  IClarificationItem,
  IScopeItem,
  IHoursSummary,
  IBidComment,
  IActivityLogEntry,
  IAIImportMeta,
  IQualificationItem,
} from "../models";
import { ITeamMember } from "../models/ITeamMember";
import { PRIORITY_COLORS } from "../utils/constants";
import { formatDate, formatDaysLeft } from "../utils/formatters";
import { getDueFreezeDate } from "../utils/bidHelpers";
import { isTerminalStatus } from "../utils/statusHelpers";
import { getErnLinks } from "../utils/ernHelpers";
import { makeId } from "../utils/idGenerator";
import { getBidFx, withCostSummary } from "../utils/costCalculations";
import {
  canOpenBid,
  getConfidentialManagers,
} from "../utils/bidConfidentiality";
import { useAccessLevel } from "../hooks/useAccessLevel";
import {
  canEditLevel,
  canDeleteLevel,
  getEffectiveBidTabLevel,
  removesCollaborationContent,
} from "../utils/accessControl";
import { useConfigPhases } from "../hooks/useConfigPhases";
import { EditControlService } from "../services/EditControlService";
import { useEditControl } from "../hooks/useEditControl";
import { EditableTabContent } from "../components/common/EditLockBanner";
import { CollapsibleSidebar } from "../components/common/CollapsibleSidebar";
import { mapSuggestedClarification } from "../utils/aiClarificationMapper";
import {
  findScopeQualification,
  normalizeQualificationTables,
  removeScopeQualifications,
  upsertQualificationItem,
} from "../utils/qualificationHelpers";
import { BID_TAB_GROUPS, BidTab } from "../config/bidTabs.config";
import { ViewOnlyBanner } from "../components/common/RequirePageAccess";
import { EmptyState } from "../components/common/EmptyState";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import styles from "./BidDetailPage.module.scss";

// Tabs with edit actions; read-only tabs (costs, timeline, activity, export) need no banner.
const EDITABLE_TABS: BidTab[] = [
  "overview",
  "scope",
  "hours",
  "assets",
  "preparation",
  "logistics",
  "certifications",
  "tasks",
  "revisions",
  "approval",
  "documents",
  "notes",
  "qualifications",
];

const EMPTY_HOURS_SUMMARY: IHoursSummary = {
  engineeringHours: { totalHours: 0, totalCostBRL: 0, items: [] },
  onshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
  offshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
  totalsByDivision: {},
  grandTotalHours: 0,
  grandTotalCostBRL: 0,
  grandTotalCostUSD: 0,
};

/**
 * DivisionEditWrap — Wraps a division-aware tab with edit lock control.
 * Uses useEditControl hook to manage concurrent editing per section/division.
 */
const DivisionEditWrap: React.FC<{
  bidNumber: string;
  tabName: string;
  sectionPrefix: string;
  div: "ROV" | "SURVEY" | "OPG" | null;
  canEdit: boolean;
  onEditChange?: (editing: boolean) => void;
  children: (isEditing: boolean) => React.ReactNode;
}> = ({
  bidNumber,
  tabName,
  sectionPrefix,
  div,
  canEdit,
  onEditChange,
  children,
}) => {
  const sectionKey = div ? `${sectionPrefix}-${div}` : sectionPrefix;
  const editControl = useEditControl(bidNumber, sectionKey);
  return (
    <EditableTabContent
      editControl={editControl}
      canEdit={canEdit}
      label={div ? `${tabName} (${div})` : tabName}
      onEditChange={onEditChange}
      controlsInHeader
    >
      {children}
    </EditableTabContent>
  );
};

export const BidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const config = useConfigStore((s) => s.config);

  // Config-aware phases
  const configPhases = useConfigPhases();

  const [activeTab, setActiveTab] = React.useState<BidTab>("overview");
  const [navCollapsed, setNavCollapsed] = React.useState(false);
  const [teamMembers, setTeamMembers] = React.useState<ITeamMember[]>([]);
  const currentUser = useCurrentUser();
  const setSidebarExpanded = useUIStore((s) => s.setSidebarExpanded);
  const addToast = useUIStore((s) => s.addToast);
  const publishPastBid = usePastBidPublisher();
  const publishTechnicalProposal = useTechnicalProposalPublisher();
  const syncClarificationLibrary = useClarificationLibrarySync();

  // Collapse sidebar when entering BidDetail, restore on leave
  React.useEffect(() => {
    const wasExpanded = useUIStore.getState().sidebarExpanded;
    setSidebarExpanded(false);
    return () => {
      setSidebarExpanded(wasExpanded);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-collapse/expand nav when editing state changes
  const handleEditChange = React.useCallback((editing: boolean) => {
    setNavCollapsed(editing);
  }, []);

  // Load team members for Approval tab
  React.useEffect(() => {
    MembersService.getAll()
      .then((data) => setTeamMembers(data.members))
      .catch(() => setTeamMembers([]));
  }, []);

  // Cleanup: release all edit locks for this BID when leaving the page
  React.useEffect(() => {
    return () => {
      if (id && currentUser.email) {
        EditControlService.releaseAllForBid(id, currentUser.email).catch(
          () => {},
        );
      }
    };
  }, [id, currentUser.email]);

  // Access control: every tab follows the BID Details matrix in System Configuration.
  const { getBidTabLevel, isResolved: accessResolved } = useAccessLevel();
  const canEditTab = (tab: BidTab): boolean =>
    canEditLevel(getBidTabLevel(tab));
  const canDeleteTab = (tab: BidTab): boolean =>
    canDeleteLevel(getBidTabLevel(tab));
  const isTabLocked = (tab: BidTab): boolean =>
    accessResolved && getBidTabLevel(tab) === "none";
  const firstOpenTab = BID_TAB_GROUPS.reduce<BidTab | null>(
    (found, g) =>
      found || (g.items.find((t) => !isTabLocked(t.key))?.key ?? null),
    null,
  );

  React.useEffect(() => {
    if (isTabLocked(activeTab) && firstOpenTab) setActiveTab(firstOpenTab);
  }, [activeTab, firstOpenTab, accessResolved]);

  // Save handler: patches BID JSON in SharePoint + optimistic store update
  // Also tracks changes when an active revision exists
  const savePatch = React.useCallback(
    async (patch: Partial<IBid>) => {
      if (!id) return;
      const currentBids = useBidStore.getState().bids;
      const currentBid = currentBids.find((b) => b.bidNumber === id);
      if (!currentBid) return;

      const user = useAuthStore.getState().currentUser;
      const accessConfig = useConfigStore.getState().config;
      const collaborationTabs: ("notes" | "qualifications")[] = [
        "notes",
        "qualifications",
      ];
      if (
        collaborationTabs.some(
          (tab) =>
            getEffectiveBidTabLevel(user, accessConfig, tab) ===
              "editNoDelete" &&
            removesCollaborationContent(currentBid, patch, tab),
        )
      ) {
        addToast({
          type: "warning",
          title: "Deletion is not allowed",
          message:
            "Edit* allows adding and editing, but not removing Collaboration content.",
        });
        return;
      }

      // If there's an active revision, track changes in the revision
      let finalPatch = { ...patch };
      if (hasActiveRevision(currentBid)) {
        const section = getSectionFromPatch(patch);
        if (section) {
          const revChanges = detectRevisionChanges(section, currentBid, patch, {
            name: currentUser.displayName || currentUser.email,
            email: currentUser.email,
          });
          if (revChanges.length > 0) {
            const updatedRevisions = appendRevisionChanges(
              finalPatch.revisions || currentBid.revisions || [],
              revChanges,
            );
            finalPatch.revisions = updatedRevisions;
          }
        }
      }

      const merged = withCostSummary({
        ...currentBid,
        ...finalPatch,
        lastModified: new Date().toISOString(),
      });
      useBidStore
        .getState()
        .setBids(currentBids.map((b) => (b.bidNumber === id ? merged : b)));

      try {
        await BidService.patchByBidNumber(id, {
          ...finalPatch,
          lastModified: new Date().toISOString(),
        });
        if (
          finalPatch.currentStatus === "Completed" &&
          currentBid.currentStatus !== "Completed"
        ) {
          publishPastBid(merged, { runAi: !merged.knowledgeProfile }).catch(
            () => undefined,
          );
          if (getTechnicalProposalAttachment(merged)) {
            publishTechnicalProposal(merged).catch(() => undefined);
          } else if (merged.technicalProposal?.requested) {
            addToast({
              type: "warning",
              title: "Technical Proposal missing",
              message: `BID ${merged.bidNumber} was completed without the requested Technical Proposal PDF. Attach it in the Documents tab and publish it to the Knowledge Base.`,
            });
          }
        } else if (
          merged.currentStatus === "Completed" &&
          merged.knowledgeProfile &&
          finalPatch.bidResult
        ) {
          publishPastBid(merged, { runAi: false, silent: true }).catch(
            () => undefined,
          );
        }
      } catch (err) {
        console.error("Failed to save BID:", err);
        // PnP keeps the SharePoint error text in the raw response, not in message
        const httpErr = err as { response?: { text?: () => Promise<string> } };
        if (httpErr?.response?.text) {
          httpErr.response
            .text()
            .then((body) => console.error("SharePoint response:", body))
            .catch(() => {});
        }
        // Only roll back if no newer edit has replaced this optimistic version.
        useBidStore
          .getState()
          .setBids(
            useBidStore
              .getState()
              .bids.map((b) => (b === merged ? currentBid : b)),
          );
        addToast({
          type: "error",
          title: "Changes were not saved",
          message:
            (err instanceof Error ? err.message : String(err)) ||
            "SharePoint rejected the update. Your last change was reverted.",
        });
      }
    },
    [id, currentUser, addToast, publishPastBid, publishTechnicalProposal],
  );

  /** Builds a human-readable description of the patch for activity log */
  const describeTerminalEdit = (
    tabName: string,
    patch: Partial<IBid>,
    currentBid: IBid,
  ): string => {
    const parts: string[] = [];
    if (patch.bidNotes) {
      const oldKeys = Object.keys(currentBid.bidNotes || {});
      const newKeys = Object.keys(patch.bidNotes);
      const added = newKeys.filter((k) => oldKeys.indexOf(k) === -1);
      const removed = oldKeys.filter((k) => newKeys.indexOf(k) === -1);
      const edited = newKeys.filter(
        (k) =>
          oldKeys.indexOf(k) >= 0 &&
          (currentBid.bidNotes || {})[k] !== patch.bidNotes![k],
      );
      if (added.length > 0) parts.push(`Added note: "${added.join('", "')}"`);
      if (edited.length > 0)
        parts.push(`Edited note: "${edited.join('", "')}"`);
      if (removed.length > 0)
        parts.push(`Deleted note: "${removed.join('", "')}"`);
    }
    if (patch.quickNotes) {
      const oldCount = (currentBid.quickNotes || []).length;
      const newCount = patch.quickNotes.length;
      if (newCount > oldCount) parts.push("Added a quick note");
      else if (newCount < oldCount) parts.push("Deleted a quick note");
    }
    if (patch.comments) {
      const oldCount = (currentBid.comments || []).length;
      const newCount = patch.comments.length;
      if (newCount > oldCount) parts.push("Added a comment");
    }
    if (patch.qualificationTables) parts.push("Updated qualification tables");
    if (patch.clarifications) parts.push("Updated clarifications");
    if (patch.engineerBidOverview !== undefined)
      parts.push("Updated engineer overview");
    if (parts.length === 0) parts.push(`Edited ${tabName}`);
    return parts.join("; ") + ` (BID in ${currentBid.currentStatus})`;
  };

  /** Wrapped savePatch that appends activity log when BID is in terminal status */
  const makeTerminalSave = React.useCallback(
    (tabName: string) => (patch: Partial<IBid>) => {
      const currentBids = useBidStore.getState().bids;
      const currentBid = currentBids.find((b) => b.bidNumber === id);
      if (!currentBid || !isTerminalStatus(currentBid.currentStatus)) {
        savePatch(patch);
        return;
      }
      const fields = Object.keys(patch).filter(
        (k) =>
          k !== "activityLog" &&
          k !== "lastModified" &&
          k !== "bidNotesMetadata",
      );
      if (fields.length === 0) {
        savePatch(patch);
        return;
      }
      const logEntry: IActivityLogEntry = {
        id: `log-${Date.now()}-terminal-edit`,
        type: "EDIT_IN_TERMINAL",
        timestamp: new Date().toISOString(),
        actor: currentUser.email,
        actorName: currentUser.displayName,
        description: describeTerminalEdit(tabName, patch, currentBid),
        metadata: { tab: tabName, fields },
      };
      savePatch({
        ...patch,
        activityLog: [
          ...(currentBid.activityLog || []),
          ...(patch.activityLog || []),
          logEntry,
        ],
      });
    },
    [id, currentUser, savePatch],
  );

  // Stable memoized references for each tab
  const saveOverview = React.useMemo(
    () => makeTerminalSave("Overview"),
    [makeTerminalSave],
  );
  const saveNotes = React.useMemo(
    () => makeTerminalSave("Notes & Comments"),
    [makeTerminalSave],
  );
  const saveQualifications = React.useMemo(
    () => makeTerminalSave("Clarif. & Qualif."),
    [makeTerminalSave],
  );

  const bid = bids.find((b) => b.bidNumber === id);
  const authResolved = useAuthStore((s) => s.isResolved);
  // Confidential BIDs: extra gate on top of the access matrix.
  const hasBidAccess = !!bid && canOpenBid(bid, currentUser.email);
  useApprovalSync(id, bid?.approvalStatus === "pending" && hasBidAccess);

  // The Teams approval flow writes decisions and completion straight into the BID
  // JSON; editors persist the matching activity/history entries (each tried once).
  const reconciledKeys = React.useRef<Record<string, boolean>>({});
  const canReconcileApproval = canEditTab("tasks") && hasBidAccess;
  React.useEffect(() => {
    if (!bid || !canReconcileApproval) return;
    // A child effect may have saved in this same commit; build on the store copy.
    const latest =
      useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
      bid;
    const patch: Partial<IBid> = {};
    const missing = getMissingApprovalActivityEntries(latest).filter(
      (e) => !reconciledKeys.current[e.id],
    );
    if (missing.length > 0) {
      missing.forEach((e) => {
        reconciledKeys.current[e.id] = true;
      });
      patch.activityLog = [...(latest.activityLog || []), ...missing];
    }
    const history = getMissingApprovalHistoryPatch(latest);
    const historyKey = `history-${(latest.statusHistory || []).length}`;
    if (history && !reconciledKeys.current[historyKey]) {
      reconciledKeys.current[historyKey] = true;
      Object.assign(patch, history);
    }
    if (Object.keys(patch).length === 0) return;
    savePatch(patch).catch(() => undefined);
  }, [bid, canReconcileApproval, savePatch]);

  // Covers every path to Completed (approval auto-complete/override, revision close, Teams flow).
  const syncAttemptRef = React.useRef("");
  const canSyncLibrary = canEditTab("qualifications") && hasBidAccess;
  React.useEffect(() => {
    if (!bid || !canSyncLibrary || !needsClarificationLibrarySync(bid)) return;
    const key = `${bid.bidNumber}|${bid.completedDate}`;
    if (syncAttemptRef.current === key) return;
    syncAttemptRef.current = key;
    syncClarificationLibrary(bid).catch(() => undefined);
  }, [bid, canSyncLibrary, syncClarificationLibrary]);

  if (!bid) {
    return (
      <div className={styles.bidDetail}>
        <div className={styles.notFound}>
          <h2>BID Not Found</h2>
          <p>The BID &ldquo;{id}&rdquo; could not be found.</p>
          <button onClick={() => navigate("/")}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!hasBidAccess) {
    if (!authResolved) {
      return (
        <div className={styles.bidDetail}>
          <SkeletonLoader height={120} borderRadius={16} />
          <SkeletonLoader height={18} count={6} />
        </div>
      );
    }
    const managerNames = getConfidentialManagers(bid)
      .map((p) => p.name || p.email)
      .join(", ");
    return (
      <div className={styles.bidDetail}>
        <div className={styles.confidentialDenied}>
          <EmptyState
            variant="glass"
            icon={
              <span className={styles.confidentialIcon}>
                <Lock size={28} />
              </span>
            }
            title="This BID is confidential"
            description={`Only people granted access by the BID Responsible can open BID ${bid.bidNumber}.${managerNames ? ` Ask ${managerNames} for access.` : ""}`}
            actionLabel="Go to BID Tracker"
            onAction={() => navigate("/")}
          />
        </div>
      </div>
    );
  }

  const daysLeftInfo = formatDaysLeft(bid.dueDate, getDueFreezeDate(bid));
  const daysLeft = daysLeftInfo.days;
  const bidFx = getBidFx(bid);
  const currentPhaseIndex = configPhases.findIndex(
    (p) => p.value === bid.currentPhase,
  );

  // BID is locked for editing when in a terminal status (Completed, Canceled, No Bid)
  // UNLESS there is an active revision (Rework), which unlocks editing
  const isBidLocked =
    isTerminalStatus(bid.currentStatus) && !hasActiveRevision(bid);

  // BID is unassigned when no engineer responsible is set
  const isUnassigned =
    !bid.engineerResponsible ||
    (Array.isArray(bid.engineerResponsible) &&
      bid.engineerResponsible.length === 0);

  // Scope & Costing tabs also stay read-only while the BID is locked
  // (terminal status without an active revision) or unassigned.
  const canEditBidTab = (tab: BidTab): boolean =>
    canEditTab(tab) && !isBidLocked && !isUnassigned;

  const upsertScopeClarification = (clar: IClarificationItem): void => {
    const latest =
      useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
      bid;
    const list = latest.clarifications || [];
    const exists = list.some((c) => c.id === clar.id);
    const patch: Partial<IBid> = {
      clarifications: exists
        ? list.map((c) => (c.id === clar.id ? clar : c))
        : [...list, clar],
    };
    // Switching the popup type moves the item; Edit* users keep both instead.
    const tables = normalizeQualificationTables(latest.qualificationTables);
    if (
      clar.scopeItemId &&
      canDeleteTab("qualifications") &&
      findScopeQualification(tables, clar.scopeItemId)
    ) {
      patch.qualificationTables = removeScopeQualifications(
        tables,
        clar.scopeItemId,
      );
    }
    saveQualifications(patch);
  };

  const upsertScopeQualification = (
    tableTitle: string,
    item: IQualificationItem,
  ): void => {
    const latest =
      useBidStore.getState().bids.find((b) => b.bidNumber === bid.bidNumber) ||
      bid;
    const patch: Partial<IBid> = {
      qualificationTables: upsertQualificationItem(
        normalizeQualificationTables(latest.qualificationTables),
        tableTitle,
        item,
      ),
    };
    const scopeId = item.scopeItemId;
    const list = latest.clarifications || [];
    if (
      scopeId &&
      canDeleteTab("qualifications") &&
      list.some((c) => c.scopeItemId === scopeId)
    ) {
      patch.clarifications = list.filter((c) => c.scopeItemId !== scopeId);
    }
    saveQualifications(patch);
  };

  /**
   * Merge AI-generated scope items into the BID, tag them as AI-sourced, and
   * record an activity-log entry describing what the AI produced and how the
   * user edited it before importing from the Scope of Supply AI modal.
   */
  const importAiScope = (
    aiItems: IScopeItem[],
    meta: IAIImportMeta,
    division?: "ROV" | "SURVEY" | "OPG" | null,
  ): void => {
    const existing = bid.scopeItems || [];
    let nextLine =
      existing.length > 0
        ? Math.max.apply(
            null,
            existing.map((i) => i.lineNumber),
          ) + 1
        : 1;
    const mapped: IScopeItem[] = [];
    let currentSectionId: string | null = null;
    aiItems.forEach((item) => {
      const newId = makeId("ai");
      const mappedItem: IScopeItem = {
        ...item,
        id: newId,
        lineNumber: nextLine++,
        sectionId: item.isSection ? null : currentSectionId,
        importedFromTemplate: "ai-analysis",
        source: "ai",
        aiPendingReview: true,
        integratedDivision: division || item.integratedDivision || "",
      };
      if (item.isSection) currentSectionId = newId;
      mapped.push(mappedItem);
    });

    const editSummary =
      meta.editedCount > 0 || meta.addedCount > 0 || meta.removedCount > 0
        ? ` (${meta.editedCount} edited, ${meta.addedCount} added, ${meta.removedCount} removed before import)`
        : "";
    const acceptedClarifications = (meta.suggestedClarifications || []).map(
      (s) => mapSuggestedClarification(s),
    );
    const clarSummary =
      acceptedClarifications.length > 0
        ? ` and ${acceptedClarifications.length} clarification${acceptedClarifications.length === 1 ? "" : "s"}`
        : "";
    const logEntry: IActivityLogEntry = {
      id: makeId("log"),
      type: "ai-import",
      timestamp: new Date().toISOString(),
      actor: currentUser.email,
      actorName: currentUser.displayName || currentUser.email,
      description:
        `AI Analysis: imported ${meta.finalItemCount} item${meta.finalItemCount === 1 ? "" : "s"}${clarSummary} ` +
        `from ${meta.sourceDocument}${editSummary}`,
      metadata: {
        sourceDocument: meta.sourceDocument,
        promptVersion: meta.promptVersion || "backend-managed",
        aiItemCount: meta.aiItemCount,
        finalItemCount: meta.finalItemCount,
        editedCount: meta.editedCount,
        addedCount: meta.addedCount,
        removedCount: meta.removedCount,
        clarificationsImported: acceptedClarifications.length,
        warnings: meta.warnings,
        ...(meta.userInstructions
          ? { userInstructions: meta.userInstructions }
          : {}),
      },
    };

    savePatch({
      scopeItems: [...existing, ...mapped],
      ...(acceptedClarifications.length > 0
        ? {
            clarifications: [
              ...(bid.clarifications || []),
              ...acceptedClarifications,
            ],
          }
        : {}),
      activityLog: [...(bid.activityLog || []), logEntry],
    });

    if (acceptedClarifications.length > 0) {
      addToast({
        type: "success",
        title: `${acceptedClarifications.length} clarification${acceptedClarifications.length > 1 ? "s" : ""} added`,
      });
    }
  };

  const copyShareLink = (): void => {
    const { origin, pathname, search } = window.location;
    const url = `${origin}${pathname}${search}#${ROUTES.bidDetail.replace(":id", encodeURIComponent(bid.bidNumber))}`;

    // Fallback for contexts where the async Clipboard API is blocked (e.g. Teams iframe).
    const legacyCopy = (): boolean => {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(textarea);
      return ok;
    };

    const notify = (ok: boolean): void =>
      addToast(
        ok
          ? { type: "success", title: "BID link copied", message: url }
          : { type: "error", title: "Could not copy link", message: url },
      );

    if (navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(url)
        .then(() => notify(true))
        .catch(() => notify(legacyCopy()));
    } else {
      notify(legacyCopy());
    }
  };

  return (
    <div className={styles.bidDetail}>
      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => navigate(-1)}>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        Back to Tracker
      </button>

      {/* Header */}
      <div className={styles.bidHeader}>
        <div className={styles.bidHeaderLeft}>
          <div className={styles.bidHeaderTitle}>
            <span className={styles.bidNumber}>{bid.bidNumber}</span>
            <ConfidentialLock bid={bid} showLabel />
            <span className={styles.headerSep}>-</span>
            <span>{bid.opportunityInfo?.client || "-"}</span>
            <span className={styles.headerSep}>-</span>
            <span className={styles.projectName}>
              {bid.opportunityInfo?.projectName || "-"}
            </span>
          </div>
          <div className={styles.bidHeaderMeta}>
            <span>
              <span className={styles.metaLabel}>CRM</span> {bid.crmNumber}
            </span>
            <span className={styles.headerSep}>|</span>
            <span>
              <span className={styles.metaLabel}>ERN</span>{" "}
              {(() => {
                const links = getErnLinks(bid);
                if (links.length === 0) return "TBD";
                return links
                  .map((l) =>
                    l.division ? `${l.ernNumber} (${l.division})` : l.ernNumber,
                  )
                  .join(", ");
              })()}
            </span>
            <span className={styles.headerSep}>|</span>
            <StatusBadge status={bid.currentStatus} />
            <span className={styles.headerSep}>|</span>
            <span>
              <span className={styles.metaLabel}>Rev.</span>{" "}
              {getCurrentRevisionLetter(bid)}
            </span>
            <span className={styles.headerSep}>|</span>
            <span>
              <span className={styles.metaLabel}>Due</span>{" "}
              {formatDate(bid.dueDate)}
              {daysLeftInfo.isOverdue && (
                <span className={styles.overdueTag}>{daysLeftInfo.text}</span>
              )}
              {!daysLeftInfo.isOverdue &&
                daysLeft !== null &&
                daysLeft <= 5 && (
                  <span className={styles.warningTag}>{daysLeftInfo.text}</span>
                )}
            </span>
          </div>
        </div>
        <div className={styles.bidHeaderRight}>
          <div className={styles.bidHeaderActions}>
            <StatusBadge
              status={bid.division}
              color={
                (config?.divisions || []).find((d) => d.value === bid.division)
                  ?.color
              }
            />
            <StatusBadge
              status={bid.serviceLine}
              color={
                (config?.serviceLines || []).find(
                  (sl) => sl.value === bid.serviceLine,
                )?.color
              }
            />
            <StatusBadge
              status={bid.priority}
              color={PRIORITY_COLORS[bid.priority] || PRIORITY_COLORS.Normal}
            />
          </div>
          <div className={styles.headerButtons}>
            <BidConfidentialButton
              bid={bid}
              teamMembers={teamMembers}
              onSave={savePatch}
              className={styles.shareBtn}
            />
            <BidFavoriteButton
              bid={bid}
              showLabel
              className={styles.shareBtn}
            />
            <button
              type="button"
              className={styles.shareBtn}
              onClick={copyShareLink}
              title="Copy a direct link to this BID"
            >
              <Link2 size={14} />
              Copy link
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar + Content Layout */}
      <div className={styles.detailLayout}>
        {/* Sidebar Nav */}
        <CollapsibleSidebar
          label="BID sections"
          collapsed={navCollapsed}
          onToggle={() => setNavCollapsed((collapsed) => !collapsed)}
          sticky
          stickyTop={16}
          collapsedContent={
            <nav className={`${styles.sideNav} ${styles.sideNavCollapsed}`}>
              {BID_TAB_GROUPS.map((group) =>
                group.items.map((item) => {
                  const locked = isTabLocked(item.key);
                  return (
                    <button
                      key={item.key}
                      className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ""} ${locked ? styles.navItemDisabled : ""}`}
                      onClick={() => setActiveTab(item.key)}
                      disabled={locked}
                      title={locked ? `${item.label} - no access` : item.label}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                    </button>
                  );
                }),
              )}
            </nav>
          }
        >
          <nav className={styles.sideNav}>
            {BID_TAB_GROUPS.map((group) => (
              <div key={group.key} className={styles.navGroup}>
                <div className={styles.navGroupLabel}>{group.group}</div>
                {group.items.map((item) => {
                  const locked = isTabLocked(item.key);
                  return (
                    <button
                      key={item.key}
                      className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ""} ${locked ? styles.navItemDisabled : ""}`}
                      onClick={() => setActiveTab(item.key)}
                      disabled={locked}
                      title={locked ? "No access for your team" : undefined}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                      {locked && (
                        <Lock size={12} className={styles.navLockIcon} />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </CollapsibleSidebar>

        {/* Main Content */}
        <div className={styles.tabContent}>
          {accessResolved && !firstOpenTab && (
            <EmptyState
              variant="glass"
              title="You don't have access to this BID"
              description="Your team's permissions do not include any BID Details tab. Ask a SmartBid administrator if you need access."
            />
          )}
          {!isTabLocked(activeTab) &&
            EDITABLE_TABS.indexOf(activeTab) >= 0 &&
            accessResolved &&
            getBidTabLevel(activeTab) === "view" && (
              <ViewOnlyBanner message="You can browse this tab, but changes are disabled for your team." />
            )}
          {isUnassigned &&
            (activeTab === "scope" ||
              activeTab === "hours" ||
              activeTab === "assets" ||
              activeTab === "preparation" ||
              activeTab === "logistics" ||
              activeTab === "certifications" ||
              activeTab === "costs") && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  marginBottom: 12,
                  borderRadius: 8,
                  background: "var(--warning-bg, rgba(249, 115, 22, 0.1))",
                  border: "1px solid var(--warning, #F97316)",
                  color: "var(--warning, #F97316)",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <span style={{ fontSize: 16 }}>🔒</span>
                <span>
                  This BID has no Engineer Responsible assigned. Scope &amp;
                  Costing tabs are read-only until a team member is assigned via
                  the Unassigned Requests page.
                </span>
              </div>
            )}
          {!isTabLocked(activeTab) && (
            <>
              {activeTab === "overview" && (
                <OverviewTab
                  bid={bid}
                  currentPhaseIndex={currentPhaseIndex}
                  canEdit={canEditTab("overview")}
                  onSave={saveOverview}
                  currentUser={currentUser}
                />
              )}
              {activeTab === "scope" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(div) => (
                    <DivisionEditWrap
                      bidNumber={bid.bidNumber}
                      tabName="Scope of Supply"
                      sectionPrefix="scope"
                      div={div}
                      canEdit={canEditBidTab("scope")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const filtered = div
                          ? (bid.scopeItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.scopeItems || [];
                        const filteredClars = div
                          ? (bid.clarifications || []).filter((c) => {
                              const si = (bid.scopeItems || []).find(
                                (s) => s.id === c.scopeItemId,
                              );
                              return si && si.integratedDivision === div;
                            })
                          : bid.clarifications || [];
                        return (
                          <ScopeOfSupplyTab
                            scopeItems={filtered}
                            readOnly={!isEditing}
                            bidNumber={bid.bidNumber}
                            onAiImport={(aiItems, meta) =>
                              importAiScope(aiItems, meta, div)
                            }
                            onSave={(items) => {
                              if (div) {
                                const others = (bid.scopeItems || []).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  scopeItems: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ scopeItems: items });
                              }
                            }}
                            onImportEngHours={(engItems, resAlloc) => {
                              const currentHours =
                                bid.hoursSummary || EMPTY_HOURS_SUMMARY;
                              const existingEng =
                                currentHours.engineeringHours
                                  ?.engineeringItems || [];
                              const existingRes =
                                currentHours.engineeringHours
                                  ?.resourceAllocations || [];
                              const mergedEng = [...existingEng, ...engItems];
                              const mergedRes = resAlloc
                                ? [
                                    ...existingRes,
                                    ...resAlloc.filter(
                                      (r) =>
                                        !existingRes.some(
                                          (e) =>
                                            e.resourceType === r.resourceType,
                                        ),
                                    ),
                                  ]
                                : existingRes;
                              const addedHours = engItems.reduce(
                                (s, e) => s + (e.totalHours || 0),
                                0,
                              );
                              savePatch({
                                hoursSummary: {
                                  ...currentHours,
                                  engineeringHours: {
                                    ...currentHours.engineeringHours,
                                    engineeringItems: mergedEng,
                                    resourceAllocations: mergedRes,
                                    totalHours:
                                      (currentHours.engineeringHours
                                        ?.totalHours || 0) + addedHours,
                                  },
                                  grandTotalHours:
                                    (currentHours.grandTotalHours || 0) +
                                    addedHours,
                                },
                              });
                            }}
                            clarifications={filteredClars}
                            onSaveClarification={
                              canEditTab("qualifications")
                                ? upsertScopeClarification
                                : undefined
                            }
                            qualificationTables={bid.qualificationTables}
                            onSaveQualification={
                              canEditTab("qualifications")
                                ? upsertScopeQualification
                                : undefined
                            }
                            tabNotes={
                              (bid.bidNotes as Record<string, string>)?.scope ||
                              ""
                            }
                            onSaveTabNotes={(notes) =>
                              savePatch({
                                bidNotes: {
                                  ...(bid.bidNotes || {}),
                                  scope: notes,
                                },
                              })
                            }
                            currentDivision={div}
                            onMoveSectionToDivision={
                              div
                                ? (sectionId, targetDiv) => {
                                    const allItems = bid.scopeItems || [];
                                    const updated = allItems.map((i) => {
                                      if (
                                        i.id === sectionId ||
                                        i.sectionId === sectionId
                                      ) {
                                        return {
                                          ...i,
                                          integratedDivision: targetDiv as
                                            | "ROV"
                                            | "SURVEY",
                                        };
                                      }
                                      return i;
                                    });
                                    savePatch({ scopeItems: updated });
                                  }
                                : undefined
                            }
                            onCopySectionToDivision={
                              div
                                ? (sectionId, targetDiv) => {
                                    const allItems = bid.scopeItems || [];
                                    const sectionHeader = allItems.find(
                                      (i) => i.id === sectionId,
                                    );
                                    const sectionChildren = allItems.filter(
                                      (i) => i.sectionId === sectionId,
                                    );
                                    if (!sectionHeader) return;
                                    const newSectionId = makeId("scope");
                                    const copiedHeader: IScopeItem = {
                                      ...sectionHeader,
                                      id: newSectionId,
                                      integratedDivision: targetDiv as
                                        | "ROV"
                                        | "SURVEY",
                                    };
                                    const copiedChildren: IScopeItem[] =
                                      sectionChildren.map((c) => ({
                                        ...c,
                                        id: makeId("scope"),
                                        sectionId: newSectionId,
                                        integratedDivision: targetDiv as
                                          | "ROV"
                                          | "SURVEY",
                                      }));
                                    savePatch({
                                      scopeItems: [
                                        ...allItems,
                                        copiedHeader,
                                        ...copiedChildren,
                                      ],
                                    });
                                  }
                                : undefined
                            }
                            assetBreakdown={bid.assetBreakdown || []}
                            onResetSubItemCost={(
                              scopeItemId,
                              subItemId,
                              kind,
                            ) => {
                              const updatedBreakdown = (
                                bid.assetBreakdown || []
                              ).map((a) => {
                                if (a.scopeItemId !== scopeItemId) return a;
                                const resetCost = (arr: unknown[]) =>
                                  (arr || []).map((sic: any) => {
                                    if (sic.subItemId !== subItemId) return sic;
                                    return {
                                      ...sic,
                                      unitCostUSD: 0,
                                      totalCostUSD: 0,
                                      costReference: "",
                                      dateReference: "",
                                      costCategory:
                                        kind === "pcf" ? "CAPEX" : "",
                                      supplier: "",
                                      leadTimeDays: 0,
                                      dailyRate: null,
                                      rentalDays: null,
                                      notes: "",
                                      subCosts: [],
                                      availabilitySplits: [],
                                    };
                                  });
                                if (kind === "pcf") {
                                  return {
                                    ...a,
                                    pcfCosts: resetCost(a.pcfCosts || []),
                                  };
                                }
                                return {
                                  ...a,
                                  subItemCosts: resetCost(a.subItemCosts || []),
                                };
                              });
                              savePatch({ assetBreakdown: updatedBreakdown });
                            }}
                            engineeringItems={
                              (bid.hoursSummary || EMPTY_HOURS_SUMMARY)
                                .engineeringHours?.engineeringItems || []
                            }
                            onClearEngineeringHours={(scopeItemId) => {
                              const currentHours =
                                bid.hoursSummary || EMPTY_HOURS_SUMMARY;
                              const currentEng = currentHours.engineeringHours;
                              const currentItems =
                                currentEng?.engineeringItems || [];
                              const removedItem = currentItems.find(
                                (ei) => ei.scopeItemId === scopeItemId,
                              );
                              const removedHours = removedItem?.totalHours || 0;
                              const updatedItems = currentItems.filter(
                                (ei) => ei.scopeItemId !== scopeItemId,
                              );
                              savePatch({
                                hoursSummary: {
                                  ...currentHours,
                                  engineeringHours: {
                                    ...currentEng,
                                    engineeringItems: updatedItems,
                                    totalHours:
                                      (currentEng?.totalHours || 0) -
                                      removedHours,
                                  },
                                  grandTotalHours:
                                    (currentHours.grandTotalHours || 0) -
                                    removedHours,
                                },
                              });
                            }}
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "assets" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(div) => (
                    <DivisionEditWrap
                      bidNumber={bid.bidNumber}
                      tabName="Assets Breakdown"
                      sectionPrefix="assets"
                      div={div}
                      canEdit={canEditBidTab("assets")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const filteredScope = div
                          ? (bid.scopeItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.scopeItems || [];
                        const scopeIds = new Set(
                          filteredScope.map((s) => s.id),
                        );
                        const filteredAssets = div
                          ? (bid.assetBreakdown || []).filter((a) =>
                              scopeIds.has(a.scopeItemId),
                            )
                          : bid.assetBreakdown || [];
                        return (
                          <AssetsBreakdownTab
                            scopeItems={filteredScope}
                            assetBreakdown={filteredAssets}
                            readOnly={!isEditing}
                            contingencyPerYearSaved={
                              bid.assetsContingencyPerYear
                            }
                            contingencyAppliedSaved={
                              bid.assetsContingencyApplied
                            }
                            onContingencyChange={(perYear, applied) => {
                              savePatch({
                                assetsContingencyPerYear: perYear,
                                assetsContingencyApplied: applied,
                              });
                            }}
                            engSolutionsContingencySaved={
                              bid.assetsEngSolutionsContingencyPct
                            }
                            onEngSolutionsContingencyChange={(pct) => {
                              savePatch({
                                assetsEngSolutionsContingencyPct: pct,
                              });
                            }}
                            onCreateBom={(partNumber, description) => {
                              navigate(
                                ROUTES.bomCosts +
                                  "?pn=" +
                                  encodeURIComponent(partNumber) +
                                  "&desc=" +
                                  encodeURIComponent(description),
                              );
                            }}
                            onSave={(items) => {
                              if (div) {
                                const allScopeIds = new Set(
                                  (bid.scopeItems || []).map((s) => s.id),
                                );
                                const otherAssets = (
                                  bid.assetBreakdown || []
                                ).filter(
                                  (a) =>
                                    !scopeIds.has(a.scopeItemId) &&
                                    allScopeIds.has(a.scopeItemId),
                                );
                                savePatch({
                                  assetBreakdown: [...otherAssets, ...items],
                                });
                              } else {
                                savePatch({ assetBreakdown: items });
                              }
                            }}
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "logistics" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(div) => (
                    <DivisionEditWrap
                      bidNumber={bid.bidNumber}
                      tabName="Logistics"
                      sectionPrefix="logistics"
                      div={div}
                      canEdit={canEditBidTab("logistics")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const filtered = div
                          ? (bid.logisticsBreakdown || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.logisticsBreakdown || [];
                        return (
                          <LogisticsBreakdownTab
                            logisticsBreakdown={filtered}
                            fx={bidFx}
                            readOnly={!isEditing}
                            onSave={(items) => {
                              if (div) {
                                const others = (
                                  bid.logisticsBreakdown || []
                                ).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  logisticsBreakdown: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ logisticsBreakdown: items });
                              }
                            }}
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "certifications" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(div) => (
                    <DivisionEditWrap
                      bidNumber={bid.bidNumber}
                      tabName="Certifications"
                      sectionPrefix="certifications"
                      div={div}
                      canEdit={canEditBidTab("certifications")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const filteredScope = div
                          ? (bid.scopeItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.scopeItems || [];
                        const filtered = div
                          ? (bid.certificationsBreakdown || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.certificationsBreakdown || [];
                        return (
                          <CertificationsBreakdownTab
                            scopeItems={filteredScope}
                            certificationsBreakdown={filtered}
                            fx={bidFx}
                            readOnly={!isEditing}
                            bidNumber={bid.bidNumber}
                            onSave={(items) => {
                              if (div) {
                                const others = (
                                  bid.certificationsBreakdown || []
                                ).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  certificationsBreakdown: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ certificationsBreakdown: items });
                              }
                            }}
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "preparation" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(div) => (
                    <DivisionEditWrap
                      bidNumber={bid.bidNumber}
                      tabName="Prep & Mobilization"
                      sectionPrefix="preparation"
                      div={div}
                      canEdit={canEditBidTab("preparation")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const filteredScope = div
                          ? (bid.scopeItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.scopeItems || [];
                        const filteredRTS = div
                          ? (bid.rtsItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.rtsItems || [];
                        const filteredMob = div
                          ? (bid.mobilizationItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.mobilizationItems || [];
                        const filteredCons = div
                          ? (bid.consumableItems || []).filter(
                              (i) => i.integratedDivision === div,
                            )
                          : bid.consumableItems || [];
                        return (
                          <PreparationMobilizationTab
                            scopeItems={filteredScope}
                            rtsItems={filteredRTS}
                            mobilizationItems={filteredMob}
                            consumableItems={filteredCons}
                            fx={bidFx}
                            rtsSections={bid.rtsSections || []}
                            mobSections={bid.mobSections || []}
                            consSections={bid.consSections || []}
                            readOnly={!isEditing}
                            onSaveRTS={(items) => {
                              if (div) {
                                const others = (bid.rtsItems || []).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  rtsItems: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ rtsItems: items });
                              }
                            }}
                            onSaveMob={(items) => {
                              if (div) {
                                const others = (
                                  bid.mobilizationItems || []
                                ).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  mobilizationItems: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ mobilizationItems: items });
                              }
                            }}
                            onSaveConsumables={(items) => {
                              if (div) {
                                const others = (
                                  bid.consumableItems || []
                                ).filter(
                                  (i) =>
                                    i.integratedDivision &&
                                    i.integratedDivision !== div,
                                );
                                savePatch({
                                  consumableItems: [
                                    ...others,
                                    ...items.map((i) => ({
                                      ...i,
                                      integratedDivision: div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ],
                                });
                              } else {
                                savePatch({ consumableItems: items });
                              }
                            }}
                            onSaveRTSSections={(sections) =>
                              savePatch({ rtsSections: sections })
                            }
                            onSaveMobSections={(sections) =>
                              savePatch({ mobSections: sections })
                            }
                            onSaveConsSections={(sections) =>
                              savePatch({ consSections: sections })
                            }
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "hours" && (
                <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
                  {(_div) => (
                    <DivisionEditWrap
                      key={_div || "default"}
                      bidNumber={bid.bidNumber}
                      tabName="Hours & Personnel"
                      sectionPrefix="hours"
                      div={_div}
                      canEdit={canEditBidTab("hours")}
                      onEditChange={handleEditChange}
                    >
                      {(isEditing) => {
                        const fullSummary =
                          bid.hoursSummary || EMPTY_HOURS_SUMMARY;
                        const filteredScope = _div
                          ? (bid.scopeItems || []).filter(
                              (i) => i.integratedDivision === _div,
                            )
                          : bid.scopeItems || [];
                        // IDs of scope items/sub-items that currently need engineering
                        const engScopeIds = new Set(
                          filteredScope.reduce<string[]>((acc, s) => {
                            if (!s.isSection && s.needsEngineering) {
                              acc.push(s.id);
                            }
                            if (s.subItems) {
                              s.subItems.forEach((sub) => {
                                if (sub.needsEngineering) acc.push(sub.id);
                              });
                            }
                            return acc;
                          }, []),
                        );

                        // Filter hours items by integratedDivision
                        const filterItems = (
                          items: typeof fullSummary.onshoreHours.items,
                        ) =>
                          _div
                            ? items.filter((i) => i.integratedDivision === _div)
                            : items;

                        // Filter section groups by integratedDivision
                        const filterSections = (
                          sections: typeof fullSummary.onshoreHours.sections,
                        ) =>
                          _div
                            ? (sections || []).filter(
                                (s) =>
                                  !s.integratedDivision ||
                                  s.integratedDivision === _div,
                              )
                            : sections;

                        // Filter engineering items by scope linkage
                        const filterEngItems = (
                          items: typeof fullSummary.engineeringHours.engineeringItems,
                        ) =>
                          _div && items
                            ? items.filter((i) =>
                                i.source === "manual" || !i.scopeItemId
                                  ? // Standalone items predating division tagging stay visible
                                    !i.integratedDivision ||
                                    i.integratedDivision === _div
                                  : engScopeIds.has(i.scopeItemId),
                              )
                            : items;

                        const filteredSummary: typeof fullSummary = _div
                          ? (() => {
                              const engItems = filterItems(
                                fullSummary.engineeringHours.items,
                              );
                              const engEngItems = filterEngItems(
                                fullSummary.engineeringHours.engineeringItems,
                              );
                              const onItems = filterItems(
                                fullSummary.onshoreHours.items,
                              );
                              const offItems = filterItems(
                                fullSummary.offshoreHours.items,
                              );
                              const sumHours = (
                                items: { totalHours?: number }[],
                              ) =>
                                items.reduce(
                                  (s, i) => s + (i.totalHours || 0),
                                  0,
                                );
                              const sumCost = (items: { costBRL?: number }[]) =>
                                items.reduce((s, i) => s + (i.costBRL || 0), 0);
                              const engEngTotal = (engEngItems || []).reduce(
                                (s, i) => s + (i.totalHours || 0),
                                0,
                              );
                              return {
                                ...fullSummary,
                                engineeringHours: {
                                  ...fullSummary.engineeringHours,
                                  items: engItems,
                                  sections: filterSections(
                                    fullSummary.engineeringHours.sections,
                                  ),
                                  engineeringItems: engEngItems,
                                  totalHours: sumHours(engItems) + engEngTotal,
                                  totalCostBRL: sumCost(engItems),
                                },
                                onshoreHours: {
                                  ...fullSummary.onshoreHours,
                                  items: onItems,
                                  sections: filterSections(
                                    fullSummary.onshoreHours.sections,
                                  ),
                                  totalHours: sumHours(onItems),
                                  totalCostBRL: sumCost(onItems),
                                },
                                offshoreHours: {
                                  ...fullSummary.offshoreHours,
                                  items: offItems,
                                  sections: filterSections(
                                    fullSummary.offshoreHours.sections,
                                  ),
                                  totalHours: sumHours(offItems),
                                  totalCostBRL: sumCost(offItems),
                                },
                                grandTotalHours:
                                  sumHours(engItems) +
                                  engEngTotal +
                                  sumHours(onItems) +
                                  sumHours(offItems),
                                grandTotalCostBRL:
                                  sumCost(engItems) +
                                  sumCost(onItems) +
                                  sumCost(offItems),
                              };
                            })()
                          : fullSummary;

                        return (
                          <BidHoursTable
                            hoursSummary={filteredSummary}
                            readOnly={!isEditing}
                            onSave={(updated) => {
                              if (_div) {
                                // Read LATEST hours from store to avoid stale-closure race conditions
                                const latestBid = useBidStore
                                  .getState()
                                  .bids.find((b) => b.bidNumber === id);
                                const latestSummary =
                                  latestBid?.hoursSummary ||
                                  EMPTY_HOURS_SUMMARY;

                                // Merge: keep items from the other division, add updated items tagged with current division
                                const mergeItems = (
                                  original: typeof latestSummary.onshoreHours.items,
                                  updatedItems: typeof latestSummary.onshoreHours.items,
                                ) => {
                                  const others = original.filter(
                                    (i) =>
                                      i.integratedDivision &&
                                      i.integratedDivision !== _div,
                                  );
                                  return [
                                    ...others,
                                    ...updatedItems.map((i) => ({
                                      ...i,
                                      integratedDivision: _div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ];
                                };
                                // Merge section groups: keep other division's sections, add current division's
                                const mergeSections = (
                                  original: typeof latestSummary.onshoreHours.sections,
                                  updatedSections: typeof latestSummary.onshoreHours.sections,
                                ) => {
                                  const origSections = original || [];
                                  const updSections = updatedSections || [];
                                  const others = origSections.filter(
                                    (s) =>
                                      s.integratedDivision &&
                                      s.integratedDivision !== _div,
                                  );
                                  return [
                                    ...others,
                                    ...updSections.map((s) => ({
                                      ...s,
                                      integratedDivision: _div as
                                        | "ROV"
                                        | "SURVEY",
                                    })),
                                  ];
                                };
                                const mergeEngItems = (
                                  original: typeof latestSummary.engineeringHours.engineeringItems,
                                  updatedItems: typeof latestSummary.engineeringHours.engineeringItems,
                                ) => {
                                  const origItems = original || [];
                                  const updItems = updatedItems || [];
                                  const latestScope =
                                    latestBid?.scopeItems || [];
                                  const otherScopeIds = new Set(
                                    latestScope
                                      .filter(
                                        (s) =>
                                          s.integratedDivision &&
                                          s.integratedDivision !== _div,
                                      )
                                      .reduce<string[]>((acc, s) => {
                                        acc.push(s.id);
                                        if (s.subItems) {
                                          s.subItems.forEach((sub) =>
                                            acc.push(sub.id),
                                          );
                                        }
                                        return acc;
                                      }, []),
                                  );
                                  const others = origItems.filter((i) => {
                                    if (
                                      i.source === "manual" ||
                                      !i.scopeItemId
                                    ) {
                                      return (
                                        !!i.integratedDivision &&
                                        i.integratedDivision !== _div
                                      );
                                    }
                                    return otherScopeIds.has(i.scopeItemId);
                                  });
                                  return [...others, ...updItems];
                                };

                                // Perform the merge
                                const mergedOnshoreItems = mergeItems(
                                  latestSummary.onshoreHours.items,
                                  updated.onshoreHours.items,
                                );
                                const mergedOffshoreItems = mergeItems(
                                  latestSummary.offshoreHours.items,
                                  updated.offshoreHours.items,
                                );
                                const mergedEngItems = mergeItems(
                                  latestSummary.engineeringHours.items,
                                  updated.engineeringHours.items,
                                );
                                const mergedEngEngineeringItems = mergeEngItems(
                                  latestSummary.engineeringHours
                                    .engineeringItems,
                                  updated.engineeringHours.engineeringItems,
                                );

                                // Recalculate totals from ALL merged items
                                const calcTotal = (
                                  items: typeof mergedOnshoreItems,
                                ) =>
                                  items.reduce(
                                    (sum, i) => sum + (i.totalHours || 0),
                                    0,
                                  );
                                const calcCost = (
                                  items: typeof mergedOnshoreItems,
                                ) =>
                                  items.reduce(
                                    (sum, i) => sum + (i.costBRL || 0),
                                    0,
                                  );
                                const engItemsTotal =
                                  mergedEngEngineeringItems.reduce(
                                    (sum, i) => sum + (i.totalHours || 0),
                                    0,
                                  );

                                const merged: typeof latestSummary = {
                                  ...updated,
                                  engineeringHours: {
                                    ...updated.engineeringHours,
                                    items: mergedEngItems,
                                    sections: mergeSections(
                                      latestSummary.engineeringHours.sections,
                                      updated.engineeringHours.sections,
                                    ),
                                    engineeringItems: mergedEngEngineeringItems,
                                    totalHours:
                                      calcTotal(mergedEngItems) + engItemsTotal,
                                    totalCostBRL: calcCost(mergedEngItems),
                                  },
                                  onshoreHours: {
                                    ...updated.onshoreHours,
                                    items: mergedOnshoreItems,
                                    sections: mergeSections(
                                      latestSummary.onshoreHours.sections,
                                      updated.onshoreHours.sections,
                                    ),
                                    totalHours: calcTotal(mergedOnshoreItems),
                                    totalCostBRL: calcCost(mergedOnshoreItems),
                                  },
                                  offshoreHours: {
                                    ...updated.offshoreHours,
                                    items: mergedOffshoreItems,
                                    sections: mergeSections(
                                      latestSummary.offshoreHours.sections,
                                      updated.offshoreHours.sections,
                                    ),
                                    totalHours: calcTotal(mergedOffshoreItems),
                                    totalCostBRL: calcCost(mergedOffshoreItems),
                                  },
                                };
                                // Recalculate grand totals
                                merged.grandTotalHours =
                                  merged.engineeringHours.totalHours +
                                  merged.onshoreHours.totalHours +
                                  merged.offshoreHours.totalHours;
                                merged.grandTotalCostBRL =
                                  merged.engineeringHours.totalCostBRL +
                                  merged.onshoreHours.totalCostBRL +
                                  merged.offshoreHours.totalCostBRL;
                                savePatch({ hoursSummary: merged });
                              } else {
                                savePatch({ hoursSummary: updated });
                              }
                            }}
                            integratedDivision={_div}
                            availableDivisions={resolveDivisions(
                              bid.serviceLine,
                            )}
                            scopeItems={filteredScope}
                            fx={bidFx}
                            tabNotes={
                              (bid.bidNotes as Record<string, string>)?.hours ||
                              ""
                            }
                            onSaveTabNotes={(notes) =>
                              savePatch({
                                bidNotes: {
                                  ...(bid.bidNotes || {}),
                                  hours: notes,
                                },
                              })
                            }
                          />
                        );
                      }}
                    </DivisionEditWrap>
                  )}
                </IntegratedDivisionTabs>
              )}
              {activeTab === "costs" && <BidCostSummary bid={bid} />}
              {activeTab === "tasks" && (
                <BidStatusPhasePanel
                  bid={bid}
                  readOnly={!canEditTab("tasks")}
                  onSave={savePatch}
                />
              )}
              {activeTab === "timeline" && (
                <BidTimeline
                  bid={{ ...bid, ...getMissingApprovalHistoryPatch(bid) }}
                  currentPhaseIndex={currentPhaseIndex}
                />
              )}
              {activeTab === "approval" && (
                <ApprovalTab
                  bid={bid}
                  teamMembers={teamMembers}
                  currentUser={{
                    name: currentUser.displayName,
                    email: currentUser.email,
                    role: currentUser.jobTitle || currentUser.role,
                    photoUrl: currentUser.photoUrl,
                  }}
                  canEdit={canEditTab("approval")}
                  onPatchBid={savePatch}
                />
              )}
              {activeTab === "documents" && (
                <DocumentsTab
                  bid={bid}
                  canEdit={canEditTab("documents")}
                  onSave={savePatch}
                  currentUser={currentUser}
                />
              )}
              {activeTab === "notes" && (
                <NotesTab
                  bid={bid}
                  canEdit={canEditTab("notes")}
                  canDelete={canDeleteTab("notes")}
                  onSave={saveNotes}
                  currentUser={currentUser}
                  onAddComment={
                    canEditTab("notes")
                      ? (text) => {
                          const newComment: IBidComment = {
                            id: `comment-${Date.now()}`,
                            author: {
                              name: currentUser.displayName,
                              email: currentUser.email,
                            },
                            text,
                            timestamp: new Date().toISOString(),
                            phase: bid.currentPhase,
                            section: "general",
                            isEdited: false,
                            editedAt: null,
                            mentions: [],
                            attachments: [],
                          };
                          saveNotes({
                            comments: [...(bid.comments || []), newComment],
                          });
                        }
                      : undefined
                  }
                />
              )}
              {activeTab === "qualifications" && (
                <QualificationsTab
                  bid={bid}
                  canEdit={canEditTab("qualifications")}
                  canDelete={canDeleteTab("qualifications")}
                  onSave={saveQualifications}
                />
              )}
              {activeTab === "activity" && (
                <BidActivityLog
                  entries={[
                    ...(bid.activityLog || []),
                    ...getMissingApprovalActivityEntries(bid),
                  ]}
                />
              )}
              {activeTab === "revisions" && (
                <RevisionsTab
                  bid={bid}
                  canEdit={canEditTab("revisions")}
                  currentUser={currentUser}
                  onSave={savePatch}
                />
              )}
              {activeTab === "export" && (
                <BidExportTab
                  bid={bid}
                  currentUser={currentUser}
                  onSave={savePatch}
                />
              )}
            </>
          )}
        </div>
        {/* end tabContent */}
      </div>
      {/* end detailLayout */}
    </div>
  );
};
