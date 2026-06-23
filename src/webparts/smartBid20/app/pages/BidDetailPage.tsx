import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
import { ROUTES } from "../config/routes.config";
import { StatusBadge } from "../components/common/StatusBadge";
import { GlassCard } from "../components/common/GlassCard";
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
import { BidExportButton } from "../components/bid/BidExportButton";
import { BidTimeline } from "../components/bid/BidTimeline";
import { OverviewTab } from "../components/bid/OverviewTab";
import { DocumentsTab } from "../components/bid/DocumentsTab";
import { NotesTab } from "../components/bid/NotesTab";
import { QualificationsTab } from "../components/bid/QualificationsTab";
import { AITab } from "../components/bid/AITab";
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
import { IntegratedDivisionTabs } from "../components/common/IntegratedDivisionTabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUIStore } from "../stores/useUIStore";
import { useConfigStore } from "../stores/useConfigStore";
import { BidService } from "../services/BidService";
import { MembersService } from "../services/MembersService";
import {
  IBid,
  IScopeItem,
  IHoursSummary,
  IBidComment,
  IActivityLogEntry,
} from "../models";
import { ITeamMember } from "../models/ITeamMember";
import {
  bidsToCSV,
  downloadCSV,
  getExportFilename,
} from "../utils/exportHelpers";
import { PRIORITY_COLORS } from "../utils/constants";
import { formatDate, formatDaysLeft } from "../utils/formatters";
import { isTerminalStatus } from "../utils/statusHelpers";
import { makeId } from "../utils/idGenerator";
import { useAccessLevel } from "../hooks/useAccessLevel";
import { useConfigPhases } from "../hooks/useConfigPhases";
import { EditControlService } from "../services/EditControlService";
import { useEditControl } from "../hooks/useEditControl";
import { EditableTabContent } from "../components/common/EditLockBanner";
import styles from "./BidDetailPage.module.scss";

type BidTab =
  | "overview"
  | "scope"
  | "assets"
  | "preparation"
  | "logistics"
  | "certifications"
  | "hours"
  | "costs"
  | "tasks"
  | "timeline"
  | "approval"
  | "documents"
  | "notes"
  | "qualifications"
  | "ai"
  | "activity"
  | "export"
  | "revisions";

interface INavItem {
  key: BidTab;
  label: string;
  icon: string;
  /** If true, only visible to canEditBid users */
  restricted?: boolean;
}

interface INavGroup {
  group: string;
  items: INavItem[];
}

const NAV_GROUPS: INavGroup[] = [
  {
    group: "General",
    items: [
      { key: "overview", label: "Overview", icon: "📊" },
      { key: "timeline", label: "Timeline", icon: "📅" },
    ],
  },
  {
    group: "Scope & Costing",
    items: [
      { key: "scope", label: "Scope of Supply", icon: "📋", restricted: true },
      {
        key: "hours",
        label: "Hours & Personnel",
        icon: "⏱️",
        restricted: true,
      },
      {
        key: "assets",
        label: "Assets Breakdown",
        icon: "🔩",
        restricted: true,
      },
      {
        key: "preparation",
        label: "Prep & Mobilization",
        icon: "🔧",
        restricted: true,
      },
      { key: "logistics", label: "Logistics", icon: "🚚" },
      { key: "certifications", label: "Certifications", icon: "📜" },
      { key: "costs", label: "Cost Summary", icon: "💰" },
    ],
  },
  {
    group: "Management",
    items: [
      { key: "tasks", label: "Status & Phases", icon: "✅" },
      { key: "revisions", label: "Revisions", icon: "🔄" },
      { key: "approval", label: "Approval", icon: "🔏" },
      { key: "documents", label: "Documents", icon: "📄" },
    ],
  },
  {
    group: "Collaboration",
    items: [
      { key: "notes", label: "Notes & Comments", icon: "📝" },
      { key: "qualifications", label: "Clarif. & Qualif.", icon: "🎓" },
    ],
  },
  {
    group: "Tools",
    items: [
      { key: "ai", label: "AI Analysis", icon: "🤖", restricted: true },
      { key: "activity", label: "Activity Log", icon: "📜" },
      { key: "export", label: "Export", icon: "📤" },
    ],
  },
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

  // Access control via hook
  const { canEdit: canEditSection, isSuperAdmin } = useAccessLevel();
  const canEditBid = canEditSection("bids") || isSuperAdmin;

  // Filter nav groups based on access
  const visibleGroups = React.useMemo(
    () =>
      NAV_GROUPS.map((g) => ({
        ...g,
        items: g.items.filter((item) => (item.restricted ? canEditBid : true)),
      })).filter((g) => g.items.length > 0),
    [canEditBid],
  );

  // Save handler: patches BID JSON in SharePoint + optimistic store update
  // Also tracks changes when an active revision exists
  const savePatch = React.useCallback(
    async (patch: Partial<IBid>) => {
      if (!id) return;
      const currentBids = useBidStore.getState().bids;
      const currentBid = currentBids.find((b) => b.bidNumber === id);
      if (!currentBid) return;

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

      const merged = {
        ...currentBid,
        ...finalPatch,
        lastModified: new Date().toISOString(),
      };
      useBidStore
        .getState()
        .setBids(currentBids.map((b) => (b.bidNumber === id ? merged : b)));

      try {
        await BidService.patchByBidNumber(id, {
          ...finalPatch,
          lastModified: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save BID:", err);
        useBidStore.getState().setBids(currentBids);
      }
    },
    [id, currentUser],
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

  const daysLeftInfo = formatDaysLeft(bid.dueDate);
  const daysLeft = daysLeftInfo.days;
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

  // canEditBidTabs: false when locked OR unassigned, prevents edit on scope/costing tabs
  const canEditBidTabs = canEditBid && !isBidLocked && !isUnassigned;

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
            <span className={styles.monoValue}>{bid.bidNumber}</span>
            <span className={styles.headerSep}>—</span>
            <span>{bid.opportunityInfo?.client || "—"}</span>
            <span className={styles.headerSep}>—</span>
            <span className={styles.projectName}>
              {bid.opportunityInfo?.projectName || "—"}
            </span>
          </div>
          <div className={styles.bidHeaderMeta}>
            <span>
              CRM: <span className={styles.monoValue}>{bid.crmNumber}</span>
            </span>
            <span className={styles.headerSep}>|</span>
            <StatusBadge status={bid.currentStatus} />
            <span className={styles.headerSep}>|</span>
            <span className={styles.monoValue} style={{ fontWeight: 600 }}>
              Rev. {getCurrentRevisionLetter(bid)}
            </span>
            <span className={styles.headerSep}>|</span>
            <span>
              Due: {formatDate(bid.dueDate)}
              {daysLeftInfo.isOverdue && (
                <span className={styles.overdueTag}>
                  {" "}
                  OVERDUE {Math.abs(daysLeft)}d
                </span>
              )}
              {!daysLeftInfo.isOverdue && daysLeft <= 5 && (
                <span className={styles.warningTag}> {daysLeftInfo.text}</span>
              )}
            </span>
          </div>
        </div>
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
      </div>

      {/* Sidebar + Content Layout */}
      <div
        className={`${styles.detailLayout} ${navCollapsed ? styles.detailLayoutCollapsed : ""}`}
      >
        {/* Sidebar Nav */}
        <nav
          className={`${styles.sideNav} ${navCollapsed ? styles.sideNavCollapsed : ""}`}
        >
          {navCollapsed
            ? visibleGroups.map((group) =>
                group.items.map((item) => (
                  <button
                    key={item.key}
                    className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ""}`}
                    onClick={() => setActiveTab(item.key)}
                    title={item.label}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                  </button>
                )),
              )
            : visibleGroups.map((group) => (
                <div key={group.group} className={styles.navGroup}>
                  <div className={styles.navGroupLabel}>{group.group}</div>
                  {group.items.map((item) => (
                    <button
                      key={item.key}
                      className={`${styles.navItem} ${activeTab === item.key ? styles.navItemActive : ""}`}
                      onClick={() => setActiveTab(item.key)}
                    >
                      <span className={styles.navIcon}>{item.icon}</span>
                      <span className={styles.navLabel}>{item.label}</span>
                    </button>
                  ))}
                </div>
              ))}
        </nav>

        {/* Main Content */}
        <div className={styles.tabContent}>
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
          {activeTab === "overview" && (
            <OverviewTab
              bid={bid}
              currentPhaseIndex={currentPhaseIndex}
              canEdit={canEditBid}
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
                  canEdit={canEditBidTabs}
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
                                  integratedDivision: div as "ROV" | "SURVEY",
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
                            currentHours.engineeringHours?.engineeringItems ||
                            [];
                          const existingRes =
                            currentHours.engineeringHours
                              ?.resourceAllocations || [];
                          const mergedEng = [...existingEng, ...engItems];
                          const mergedRes = resAlloc
                            ? [...existingRes, ...resAlloc]
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
                                  (currentHours.engineeringHours?.totalHours ||
                                    0) + addedHours,
                              },
                              grandTotalHours:
                                (currentHours.grandTotalHours || 0) +
                                addedHours,
                            },
                          });
                        }}
                        clarifications={filteredClars}
                        tabNotes={
                          (bid.bidNotes as Record<string, string>)?.scope || ""
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
                        onResetSubItemCost={(scopeItemId, subItemId, kind) => {
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
                                  costCategory: kind === "pcf" ? "CAPEX" : "",
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
                                  (currentEng?.totalHours || 0) - removedHours,
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
                  canEdit={canEditBidTabs}
                  onEditChange={handleEditChange}
                >
                  {(isEditing) => {
                    const filteredScope = div
                      ? (bid.scopeItems || []).filter(
                          (i) => i.integratedDivision === div,
                        )
                      : bid.scopeItems || [];
                    const scopeIds = new Set(filteredScope.map((s) => s.id));
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
                        contingencyPerYearSaved={bid.assetsContingencyPerYear}
                        contingencyAppliedSaved={bid.assetsContingencyApplied}
                        onContingencyChange={(perYear, applied) => {
                          savePatch({
                            assetsContingencyPerYear: perYear,
                            assetsContingencyApplied: applied,
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
                  canEdit={canEditBidTabs}
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
                                  integratedDivision: div as "ROV" | "SURVEY",
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
                  canEdit={canEditBidTabs}
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
                                  integratedDivision: div as "ROV" | "SURVEY",
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
                  canEdit={canEditBidTabs}
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
                                  integratedDivision: div as "ROV" | "SURVEY",
                                })),
                              ],
                            });
                          } else {
                            savePatch({ rtsItems: items });
                          }
                        }}
                        onSaveMob={(items) => {
                          if (div) {
                            const others = (bid.mobilizationItems || []).filter(
                              (i) =>
                                i.integratedDivision &&
                                i.integratedDivision !== div,
                            );
                            savePatch({
                              mobilizationItems: [
                                ...others,
                                ...items.map((i) => ({
                                  ...i,
                                  integratedDivision: div as "ROV" | "SURVEY",
                                })),
                              ],
                            });
                          } else {
                            savePatch({ mobilizationItems: items });
                          }
                        }}
                        onSaveConsumables={(items) => {
                          if (div) {
                            const others = (bid.consumableItems || []).filter(
                              (i) =>
                                i.integratedDivision &&
                                i.integratedDivision !== div,
                            );
                            savePatch({
                              consumableItems: [
                                ...others,
                                ...items.map((i) => ({
                                  ...i,
                                  integratedDivision: div as "ROV" | "SURVEY",
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
                  canEdit={canEditBidTabs}
                  onEditChange={handleEditChange}
                >
                  {(isEditing) => {
                    const fullSummary = bid.hoursSummary || EMPTY_HOURS_SUMMARY;
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
                        ? items.filter((i) => engScopeIds.has(i.scopeItemId))
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
                          const sumHours = (items: { totalHours?: number }[]) =>
                            items.reduce((s, i) => s + (i.totalHours || 0), 0);
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
                              latestBid?.hoursSummary || EMPTY_HOURS_SUMMARY;

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
                                  integratedDivision: _div as "ROV" | "SURVEY",
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
                                  integratedDivision: _div as "ROV" | "SURVEY",
                                })),
                              ];
                            };
                            const mergeEngItems = (
                              original: typeof latestSummary.engineeringHours.engineeringItems,
                              updatedItems: typeof latestSummary.engineeringHours.engineeringItems,
                            ) => {
                              const origItems = original || [];
                              const updItems = updatedItems || [];
                              const latestScope = latestBid?.scopeItems || [];
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
                              const others = origItems.filter((i) =>
                                otherScopeIds.has(i.scopeItemId),
                              );
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
                              latestSummary.engineeringHours.engineeringItems,
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
                        scopeItems={filteredScope}
                        tabNotes={
                          (bid.bidNotes as Record<string, string>)?.hours || ""
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
              readOnly={!canEditBid}
              onSave={savePatch}
            />
          )}
          {activeTab === "timeline" && (
            <BidTimeline bid={bid} currentPhaseIndex={currentPhaseIndex} />
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
              canEdit={canEditBid}
              onSave={(approvals, approvalStatus, approvalRounds) =>
                savePatch({ approvals, approvalStatus, approvalRounds })
              }
            />
          )}
          {activeTab === "documents" && (
            <DocumentsTab
              bid={bid}
              canEdit={canEditBid}
              onSave={savePatch}
              currentUser={currentUser}
            />
          )}
          {activeTab === "notes" && (
            <NotesTab
              bid={bid}
              canEdit={canEditBid}
              onSave={saveNotes}
              currentUser={currentUser}
              onAddComment={
                canEditBid
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
              canEdit={canEditBid}
              onSave={saveQualifications}
            />
          )}
          {activeTab === "ai" && (
            <AITab
              bid={bid}
              onImportItems={(items: IScopeItem[], sourceDoc: string) => {
                const existing = bid.scopeItems || [];
                let nextLine =
                  existing.length > 0
                    ? Math.max.apply(
                        null,
                        existing.map(function (i) {
                          return i.lineNumber;
                        }),
                      ) + 1
                    : 1;

                const mapped: IScopeItem[] = [];
                let currentSectionId: string | null = null;
                items.forEach(function (item) {
                  var newId = makeId("ai");
                  if (item.isSection) {
                    currentSectionId = newId;
                    mapped.push({
                      ...item,
                      id: newId,
                      lineNumber: nextLine++,
                      sectionId: null,
                      importedFromTemplate: "ai-analysis",
                    });
                  } else {
                    mapped.push({
                      ...item,
                      id: newId,
                      lineNumber: nextLine++,
                      sectionId: currentSectionId,
                      importedFromTemplate: "ai-analysis",
                    });
                  }
                });

                const mergedScope = [...existing, ...mapped];
                const logEntry = {
                  id: makeId("log"),
                  type: "ai-import",
                  timestamp: new Date().toISOString(),
                  actor: currentUser.email,
                  actorName: currentUser.displayName || currentUser.email,
                  description:
                    "AI Analysis: imported " +
                    mapped.filter(function (i) {
                      return !i.isSection;
                    }).length +
                    " items from " +
                    sourceDoc,
                  metadata: { source: sourceDoc } as Record<string, unknown>,
                };
                const updatedLog = [...(bid.activityLog || []), logEntry];
                savePatch({ scopeItems: mergedScope, activityLog: updatedLog });
              }}
            />
          )}
          {activeTab === "activity" && (
            <BidActivityLog entries={bid.activityLog || []} />
          )}
          {activeTab === "revisions" && (
            <RevisionsTab
              bid={bid}
              canEdit={canEditBid}
              currentUser={currentUser}
              onSave={savePatch}
            />
          )}
          {activeTab === "export" && (
            <GlassCard title="Export BID Data">
              <BidExportButton
                onExportExcel={() => {
                  const csv = bidsToCSV([bid]);
                  downloadCSV(
                    csv,
                    getExportFilename(`BID-${bid.bidNumber}`, "csv"),
                  );
                }}
                onExportPDF={() => {
                  const csv = bidsToCSV([bid]);
                  downloadCSV(
                    csv,
                    getExportFilename(`BID-${bid.bidNumber}`, "csv"),
                  );
                }}
                onPrint={() => window.print()}
              />
            </GlassCard>
          )}
        </div>
        {/* end tabContent */}
      </div>
      {/* end detailLayout */}
    </div>
  );
};
