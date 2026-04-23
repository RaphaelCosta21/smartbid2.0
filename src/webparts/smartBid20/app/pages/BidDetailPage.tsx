import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
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
import { BidApprovalPanel } from "../components/bid/BidApprovalPanel";
import { BidComments } from "../components/bid/BidComments";
import { BidActivityLog } from "../components/bid/BidActivityLog";
import { BidExportButton } from "../components/bid/BidExportButton";
import { BidTimeline } from "../components/bid/BidTimeline";
import { OverviewTab } from "../components/bid/OverviewTab";
import { DocumentsTab } from "../components/bid/DocumentsTab";
import { NotesTab } from "../components/bid/NotesTab";
import { QualificationsTab } from "../components/bid/QualificationsTab";
import { AITab } from "../components/bid/AITab";
import { IntegratedDivisionTabs } from "../components/common/IntegratedDivisionTabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUIStore } from "../stores/useUIStore";
import { useConfigStore } from "../stores/useConfigStore";
import { BidService } from "../services/BidService";
import { IBid, IScopeItem, IHoursSummary, IBidComment } from "../models";
import {
  bidsToCSV,
  downloadCSV,
  getExportFilename,
} from "../utils/exportHelpers";
import { PRIORITY_COLORS } from "../utils/constants";
import { formatDate, formatDaysLeft } from "../utils/formatters";
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
  | "comments"
  | "notes"
  | "qualifications"
  | "ai"
  | "activity"
  | "export";

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
      { key: "approval", label: "Approval", icon: "🔏" },
      { key: "documents", label: "Documents", icon: "📄" },
    ],
  },
  {
    group: "Collaboration",
    items: [
      { key: "comments", label: "Comments", icon: "💬" },
      { key: "notes", label: "BID Notes", icon: "📝" },
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
  children: (isEditing: boolean) => React.ReactNode;
}> = ({ bidNumber, tabName, sectionPrefix, div, canEdit, children }) => {
  const sectionKey = div ? `${sectionPrefix}-${div}` : sectionPrefix;
  const editControl = useEditControl(bidNumber, sectionKey);
  return (
    <EditableTabContent
      editControl={editControl}
      canEdit={canEdit}
      label={div ? `${tabName} (${div})` : tabName}
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
  const savePatch = React.useCallback(
    async (patch: Partial<IBid>) => {
      if (!id) return;
      const currentBids = useBidStore.getState().bids;
      const currentBid = currentBids.find((b) => b.bidNumber === id);
      if (!currentBid) return;

      const merged = {
        ...currentBid,
        ...patch,
        lastModified: new Date().toISOString(),
      };
      useBidStore
        .getState()
        .setBids(currentBids.map((b) => (b.bidNumber === id ? merged : b)));

      try {
        await BidService.patchByBidNumber(id, {
          ...patch,
          lastModified: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save BID:", err);
        useBidStore.getState().setBids(currentBids);
      }
    },
    [id],
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
      <div className={styles.detailLayout}>
        {/* Sidebar Nav */}
        <nav className={styles.sideNav}>
          {visibleGroups.map((group) => (
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
          {activeTab === "overview" && (
            <OverviewTab
              bid={bid}
              currentPhaseIndex={currentPhaseIndex}
              canEdit={canEditBid}
              onSave={savePatch}
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
                  canEdit={canEditBid}
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
                        clarifications={filteredClars}
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
                  canEdit={canEditBid}
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
                        onSave={(items) => {
                          if (div) {
                            const otherAssets = (
                              bid.assetBreakdown || []
                            ).filter((a) => !scopeIds.has(a.scopeItemId));
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
                  canEdit={canEditBid}
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
                  canEdit={canEditBid}
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
                  canEdit={canEditBid}
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
                  bidNumber={bid.bidNumber}
                  tabName="Hours & Personnel"
                  sectionPrefix="hours"
                  div={_div}
                  canEdit={canEditBid}
                >
                  {(isEditing) => (
                    <BidHoursTable
                      hoursSummary={bid.hoursSummary || EMPTY_HOURS_SUMMARY}
                      readOnly={!isEditing}
                      onSave={(updated) => savePatch({ hoursSummary: updated })}
                      integratedDivision={_div}
                    />
                  )}
                </DivisionEditWrap>
              )}
            </IntegratedDivisionTabs>
          )}
          {activeTab === "costs" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(_div) => <BidCostSummary bid={bid} />}
            </IntegratedDivisionTabs>
          )}
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
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(_div) => (
                <BidApprovalPanel
                  approvals={bid.approvals || []}
                  onRequestApproval={
                    canEditBid
                      ? () => {
                          /* TODO: implement approval request flow */
                        }
                      : undefined
                  }
                />
              )}
            </IntegratedDivisionTabs>
          )}
          {activeTab === "documents" && (
            <DocumentsTab
              bid={bid}
              canEdit={canEditBid}
              onSave={savePatch}
              currentUser={currentUser}
            />
          )}
          {activeTab === "comments" && (
            <BidComments
              comments={bid.comments || []}
              onAdd={
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
                      savePatch({
                        comments: [...(bid.comments || []), newComment],
                      });
                    }
                  : undefined
              }
            />
          )}
          {activeTab === "notes" && (
            <NotesTab
              bid={bid}
              canEdit={canEditBid}
              onSave={savePatch}
              currentUser={currentUser}
            />
          )}
          {activeTab === "qualifications" && (
            <QualificationsTab
              bid={bid}
              canEdit={canEditBid}
              onSave={savePatch}
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
