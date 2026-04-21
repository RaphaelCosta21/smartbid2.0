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
import { IntegratedDivisionTabs } from "../components/common/IntegratedDivisionTabs";
import { useCurrentUser } from "../hooks/useCurrentUser";
import { useUIStore } from "../stores/useUIStore";
import { useConfigStore } from "../stores/useConfigStore";
import { BidService } from "../services/BidService";
import {
  IBid,
  IHoursSummary,
  IBidComment,
  IActivityLogEntry,
  IQuickNote,
  IQualificationTable,
  IQualificationItem,
  IClarificationItem,
  IBidAttachment,
  Division,
  BidType,
  BidSize,
} from "../models";
import { BID_PHASES } from "../config/status.config";
import {
  bidsToCSV,
  downloadCSV,
  getExportFilename,
} from "../utils/exportHelpers";
import { getPhaseLabelForBid } from "../utils/phaseHelpers";
import { isTerminalStatus } from "../utils/statusHelpers";
import { PRIORITY_COLORS } from "../utils/constants";
import {
  formatDate,
  formatDateTime,
  formatDaysLeft,
  formatFileSize,
} from "../utils/formatters";
import { useAccessLevel } from "../hooks/useAccessLevel";
import { useSpfxContext } from "../config/SpfxContext";
import { MembersService } from "../services/MembersService";
import { ITeamMember } from "../models";
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

export const BidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const config = useConfigStore((s) => s.config);

  // Config-aware phases
  const configPhases = React.useMemo(() => {
    if (config?.phases && config.phases.length > 0) {
      return config.phases
        .filter((p) => p.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => ({
          id: p.id,
          label: p.label,
          value: p.value,
          color: p.color || "#94A3B8",
          order: p.order || 0,
        }));
    }
    return BID_PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      value: p.value,
      color: p.color,
      order: p.order,
    }));
  }, [config]);

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
              {(div) => {
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
                    readOnly={!canEditBid}
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
            </IntegratedDivisionTabs>
          )}
          {activeTab === "assets" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(div) => {
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
                    readOnly={!canEditBid}
                    onSave={(items) => {
                      if (div) {
                        const otherAssets = (bid.assetBreakdown || []).filter(
                          (a) => !scopeIds.has(a.scopeItemId),
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
            </IntegratedDivisionTabs>
          )}
          {activeTab === "logistics" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(div) => {
                const filtered = div
                  ? (bid.logisticsBreakdown || []).filter(
                      (i) => i.integratedDivision === div,
                    )
                  : bid.logisticsBreakdown || [];
                return (
                  <LogisticsBreakdownTab
                    logisticsBreakdown={filtered}
                    readOnly={!canEditBid}
                    onSave={(items) => {
                      if (div) {
                        const others = (bid.logisticsBreakdown || []).filter(
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
            </IntegratedDivisionTabs>
          )}
          {activeTab === "certifications" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(div) => {
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
                    readOnly={!canEditBid}
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
            </IntegratedDivisionTabs>
          )}
          {activeTab === "preparation" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(div) => {
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
                    readOnly={!canEditBid}
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
            </IntegratedDivisionTabs>
          )}
          {activeTab === "hours" && (
            <IntegratedDivisionTabs serviceLine={bid.serviceLine}>
              {(_div) => (
                <BidHoursTable
                  hoursSummary={bid.hoursSummary || EMPTY_HOURS_SUMMARY}
                  readOnly={!canEditBid}
                  onSave={(updated) => savePatch({ hoursSummary: updated })}
                  integratedDivision={_div}
                />
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
          {activeTab === "ai" && <AITab />}
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

/* ─── Tab: Overview ─── */

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value || "—"}</div>
  </div>
);

const OverviewTab: React.FC<{
  bid: IBid;
  currentPhaseIndex: number;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}> = ({ bid, currentPhaseIndex, canEdit, onSave, currentUser }) => {
  const overviewConfig = useConfigStore((s) => s.config);
  const configPhases = React.useMemo(() => {
    if (overviewConfig?.phases && overviewConfig.phases.length > 0) {
      return overviewConfig.phases
        .filter((p) => p.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => ({
          id: p.id,
          label: p.label,
          value: p.value,
          color: p.color || "#94A3B8",
          order: p.order || 0,
        }));
    }
    return BID_PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      value: p.value,
      color: p.color,
      order: p.order,
    }));
  }, [overviewConfig]);
  const config = useConfigStore((s) => s.config);
  const isClosed = isTerminalStatus(bid.currentStatus);
  const spfxContext = useSpfxContext();

  // Photo loading for Key People
  const [photoMap, setPhotoMap] = React.useState<Record<string, string>>({});
  const [membersMap, setMembersMap] = React.useState<
    Record<string, ITeamMember>
  >({});

  const allPeople: { email: string }[] = React.useMemo(() => {
    const list: { email: string }[] = [];
    if (bid.creator?.email) list.push(bid.creator);
    (bid.engineerResponsible || []).forEach((p) => {
      if (p.email) list.push(p);
    });
    (bid.analyst || []).forEach((p) => {
      if (p.email) list.push(p);
    });
    (bid.projectManager || []).forEach((p) => {
      if (p.email) list.push(p);
    });
    (bid.reviewers || []).forEach((p) => {
      if (p.email) list.push(p);
    });
    return list;
  }, [bid]);

  React.useEffect(() => {
    let cancelled = false;
    const load = async (): Promise<void> => {
      try {
        const graphClient = await (
          spfxContext as any
        ).msGraphClientFactory.getClient("3");
        const emails = Array.from(new Set(allPeople.map((p) => p.email)));
        emails.forEach((email) => {
          graphClient
            .api(`/users/${email}/photo/$value`)
            .get()
            .then((blob: Blob) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                if (cancelled) return;
                const b64 = (reader.result as string).split(",")[1];
                const url = `data:image/jpeg;base64,${b64}`;
                setPhotoMap((prev) => ({ ...prev, [email]: url }));
              };
              reader.readAsDataURL(blob);
            })
            .catch(() => {
              /* no photo */
            });
        });

        if (bid.serviceLine === "Integrated") {
          const data = await MembersService.getAll();
          if (!cancelled) {
            const map: Record<string, ITeamMember> = {};
            (data.members || []).forEach((m) => {
              map[m.email.toLowerCase()] = m;
            });
            setMembersMap(map);
          }
        }
      } catch {
        /* ignore */
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [allPeople, spfxContext, bid.serviceLine]);

  const getPersonDivision = (email: string): "ROV" | "SURVEY" | null => {
    const member = membersMap[email.toLowerCase()];
    if (!member) return null;
    if (member.businessLines.indexOf("ROV" as any) >= 0) return "ROV";
    if (member.businessLines.indexOf("SURVEY" as any) >= 0) return "SURVEY";
    return null;
  };

  const PersonChip: React.FC<{
    name: string;
    email: string;
    role?: string;
  }> = ({ name, email, role }) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        marginRight: 12,
        marginBottom: 6,
      }}
    >
      {photoMap[email] ? (
        <img
          src={photoMap[email]}
          alt=""
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
      ) : (
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "var(--border-subtle)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      <span style={{ fontSize: 13 }}>
        {name}
        {role ? ` (${role})` : ""}
      </span>
    </span>
  );

  // Edit mode state for General Info
  const [editingGeneral, setEditingGeneral] = React.useState(false);
  const [genDraft, setGenDraft] = React.useState({
    crmNumber: bid.crmNumber,
    division: bid.division,
    serviceLine: bid.serviceLine,
    bidType: bid.bidType,
    bidSize: bid.bidSize,
  });

  // Edit mode state for Operational Summary
  const [editingOps, setEditingOps] = React.useState(false);
  const [opsDraft, setOpsDraft] = React.useState({ ...bid.opportunityInfo });

  // Currency & PTAX edit
  const [editingCurrency, setEditingCurrency] = React.useState(false);
  const [currDraft, setCurrDraft] = React.useState({
    currency:
      bid.opportunityInfo?.currency ||
      config?.currencySettings?.defaultCurrency ||
      "USD",
    ptax: bid.opportunityInfo?.ptax || 0,
    ptaxDate: bid.opportunityInfo?.ptaxDate || "",
  });

  // Engineer BID Overview
  const [editingOverview, setEditingOverview] = React.useState(false);
  const [overviewDraft, setOverviewDraft] = React.useState(
    bid.engineerBidOverview || "",
  );

  const logAndSave = (patch: Partial<IBid>, description: string): void => {
    if (!onSave) return;
    const logEntry: IActivityLogEntry = {
      id: `log-${Date.now()}`,
      type: "FIELD_UPDATED",
      timestamp: new Date().toISOString(),
      actor: currentUser?.email || "",
      actorName: currentUser?.displayName || "",
      description,
      metadata: {},
    };
    onSave({
      ...patch,
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

  const saveGeneral = (): void => {
    const changes: string[] = [];
    if (genDraft.crmNumber !== bid.crmNumber)
      changes.push(`CRM Number → "${genDraft.crmNumber}"`);
    if (genDraft.division !== bid.division)
      changes.push(`Division → "${genDraft.division}"`);
    if (genDraft.serviceLine !== bid.serviceLine)
      changes.push(`Service Line → "${genDraft.serviceLine}"`);
    if (genDraft.bidType !== bid.bidType)
      changes.push(`Type → "${genDraft.bidType}"`);
    if (genDraft.bidSize !== bid.bidSize)
      changes.push(`Size → "${genDraft.bidSize}"`);
    if (changes.length > 0) {
      logAndSave(
        {
          crmNumber: genDraft.crmNumber,
          division: genDraft.division as IBid["division"],
          serviceLine: genDraft.serviceLine,
          bidType: genDraft.bidType as IBid["bidType"],
          bidSize: genDraft.bidSize as IBid["bidSize"],
        },
        `General Information updated: ${changes.join("; ")}`,
      );
    }
    setEditingGeneral(false);
  };

  const saveOps = (): void => {
    const changes: string[] = [];
    const prev = bid.opportunityInfo;
    if (opsDraft.client !== prev?.client)
      changes.push(`Client → "${opsDraft.client}"`);
    if (opsDraft.clientContact !== prev?.clientContact)
      changes.push(`Client Contact → "${opsDraft.clientContact}"`);
    if (opsDraft.region !== prev?.region)
      changes.push(`Region → "${opsDraft.region}"`);
    if (opsDraft.vessel !== prev?.vessel)
      changes.push(`Vessel → "${opsDraft.vessel}"`);
    if (opsDraft.field !== prev?.field)
      changes.push(`Field → "${opsDraft.field}"`);
    if (opsDraft.waterDepth !== prev?.waterDepth)
      changes.push(`Water Depth → ${opsDraft.waterDepth}`);
    if (opsDraft.operationStartDate !== prev?.operationStartDate)
      changes.push(`Operation Start → "${opsDraft.operationStartDate}"`);
    if (opsDraft.totalDuration !== prev?.totalDuration)
      changes.push(`Duration → ${opsDraft.totalDuration}`);
    if (changes.length > 0) {
      logAndSave(
        { opportunityInfo: { ...prev, ...opsDraft } },
        `Operational Summary updated: ${changes.join("; ")}`,
      );
    }
    setEditingOps(false);
  };

  const saveCurrency = (): void => {
    const changes: string[] = [];
    if (currDraft.currency !== bid.opportunityInfo?.currency)
      changes.push(`Currency → "${currDraft.currency}"`);
    if (currDraft.ptax !== bid.opportunityInfo?.ptax)
      changes.push(`PTAX → ${currDraft.ptax}`);
    if (currDraft.ptaxDate !== bid.opportunityInfo?.ptaxDate)
      changes.push(`PTAX Date → "${currDraft.ptaxDate}"`);
    if (changes.length > 0) {
      logAndSave(
        { opportunityInfo: { ...bid.opportunityInfo, ...currDraft } },
        `Currency/PTAX updated: ${changes.join("; ")}`,
      );
    }
    setEditingCurrency(false);
  };

  const saveOverview = (): void => {
    if (overviewDraft !== (bid.engineerBidOverview || "")) {
      logAndSave(
        { engineerBidOverview: overviewDraft },
        "Engineer BID Overview updated",
      );
    }
    setEditingOverview(false);
  };

  const editBtnStyle: React.CSSProperties = {
    background: "none",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "3px 10px",
    fontSize: 12,
    cursor: "pointer",
    color: "var(--primary-accent)",
  };
  const saveBtnStyle: React.CSSProperties = {
    ...editBtnStyle,
    background: "var(--primary-accent)",
    color: "#fff",
    border: "none",
  };
  const cancelBtnStyle: React.CSSProperties = { ...editBtnStyle };

  const EditInput: React.FC<{
    value: string;
    onChange: (v: string) => void;
    type?: string;
    style?: React.CSSProperties;
  }> = ({ value, onChange, type, style }) => (
    <input
      type={type || "text"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: "4px 8px",
        border: "1px solid var(--border)",
        borderRadius: 6,
        background: "var(--card-bg-elevated)",
        color: "var(--text-primary)",
        fontSize: 13,
        ...style,
      }}
    />
  );

  const slColor = (config?.serviceLines || []).find(
    (sl) => sl.value === bid.serviceLine,
  )?.color;

  return (
    <div className={styles.overviewGrid}>
      <div className={styles.flexColumn}>
        {/* General Information */}
        <div className={styles.infoSection}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4
              className={styles.infoTitle}
              style={{ borderBottom: "none", marginBottom: 0 }}
            >
              General Information
            </h4>
            {canEdit && !editingGeneral && (
              <button
                style={editBtnStyle}
                onClick={() => {
                  setGenDraft({
                    crmNumber: bid.crmNumber,
                    division: bid.division,
                    serviceLine: bid.serviceLine,
                    bidType: bid.bidType,
                    bidSize: bid.bidSize,
                  });
                  setEditingGeneral(true);
                }}
              >
                Edit
              </button>
            )}
            {editingGeneral && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveGeneral}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => setEditingGeneral(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className={styles.infoGrid}>
            <InfoRow
              label="BID Number"
              value={<span className={styles.monoValue}>{bid.bidNumber}</span>}
            />
            {editingGeneral ? (
              <>
                <InfoRow
                  label="CRM Number"
                  value={
                    <EditInput
                      value={genDraft.crmNumber}
                      onChange={(v) =>
                        setGenDraft((d) => ({ ...d, crmNumber: v }))
                      }
                    />
                  }
                />
                <InfoRow
                  label="Division"
                  value={
                    <select
                      value={genDraft.division}
                      onChange={(e) => {
                        const newDiv = e.target.value as Division;
                        const matchingSL = (config?.serviceLines || []).filter(
                          (sl) =>
                            sl.isActive !== false && sl.category === newDiv,
                        );
                        const firstSL =
                          matchingSL.length > 0 ? matchingSL[0].value : "";
                        setGenDraft((d) => ({
                          ...d,
                          division: newDiv,
                          serviceLine: firstSL,
                        }));
                      }}
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        background: "var(--card-bg-elevated)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                      }}
                    >
                      {(config?.divisions || [])
                        .filter((d) => d.isActive !== false)
                        .map((d) => (
                          <option key={d.id} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                    </select>
                  }
                />
                <InfoRow
                  label="Service Line"
                  value={
                    <select
                      value={genDraft.serviceLine}
                      onChange={(e) =>
                        setGenDraft((d) => ({
                          ...d,
                          serviceLine: e.target.value,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        background: "var(--card-bg-elevated)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                      }}
                    >
                      {(config?.serviceLines || [])
                        .filter(
                          (sl) =>
                            sl.isActive !== false &&
                            (!genDraft.division ||
                              sl.category === genDraft.division),
                        )
                        .map((sl) => (
                          <option key={sl.id} value={sl.value}>
                            {sl.label}
                          </option>
                        ))}
                    </select>
                  }
                />
                <InfoRow
                  label="Type"
                  value={
                    <select
                      value={genDraft.bidType}
                      onChange={(e) =>
                        setGenDraft((d) => ({
                          ...d,
                          bidType: e.target.value as BidType,
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "4px 8px",
                        border: "1px solid var(--border)",
                        borderRadius: 6,
                        background: "var(--card-bg-elevated)",
                        color: "var(--text-primary)",
                        fontSize: 13,
                      }}
                    >
                      {(config?.bidTypes || [])
                        .filter((bt) => bt.isActive !== false)
                        .map((bt) => (
                          <option key={bt.id} value={bt.value}>
                            {bt.label}
                          </option>
                        ))}
                    </select>
                  }
                />
                <InfoRow
                  label="Size"
                  value={
                    <EditInput
                      value={genDraft.bidSize}
                      onChange={(v) =>
                        setGenDraft((d) => ({ ...d, bidSize: v as BidSize }))
                      }
                    />
                  }
                />
              </>
            ) : (
              <>
                <InfoRow
                  label="CRM Number"
                  value={
                    <span className={styles.monoValue}>{bid.crmNumber}</span>
                  }
                />
                <InfoRow
                  label="Division"
                  value={
                    <StatusBadge
                      status={bid.division}
                      color={
                        (config?.divisions || []).find(
                          (d) => d.value === bid.division,
                        )?.color
                      }
                    />
                  }
                />
                <InfoRow
                  label="Service Line"
                  value={
                    <StatusBadge status={bid.serviceLine} color={slColor} />
                  }
                />
                <InfoRow label="Type" value={bid.bidType} />
                <InfoRow label="Size" value={bid.bidSize} />
              </>
            )}
            <InfoRow
              label="Priority"
              value={
                <StatusBadge
                  status={bid.priority}
                  color={
                    PRIORITY_COLORS[bid.priority] || PRIORITY_COLORS.Normal
                  }
                />
              }
            />
            <InfoRow
              label="Status"
              value={<StatusBadge status={bid.currentStatus} />}
            />
          </div>
        </div>

        {/* Operational Summary */}
        <div className={styles.infoSection}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4
              className={styles.infoTitle}
              style={{ borderBottom: "none", marginBottom: 0 }}
            >
              Operational Summary
            </h4>
            {canEdit && !editingOps && (
              <button
                style={editBtnStyle}
                onClick={() => {
                  setOpsDraft({ ...bid.opportunityInfo });
                  setEditingOps(true);
                }}
              >
                Edit
              </button>
            )}
            {editingOps && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveOps}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => setEditingOps(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingOps ? (
            <div className={styles.infoGrid}>
              <InfoRow
                label="Client"
                value={
                  <select
                    value={opsDraft.client || ""}
                    onChange={(e) =>
                      setOpsDraft((d) => ({ ...d, client: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: "var(--card-bg-elevated)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  >
                    <option value="">— Select —</option>
                    {(config?.clientList || [])
                      .filter((c) => c.isActive !== false)
                      .map((c) => (
                        <option key={c.id} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                }
              />
              <InfoRow
                label="Client Contact"
                value={
                  <EditInput
                    value={opsDraft.clientContact || ""}
                    onChange={(v) =>
                      setOpsDraft((d) => ({ ...d, clientContact: v }))
                    }
                  />
                }
              />
              <InfoRow
                label="Region"
                value={
                  <select
                    value={opsDraft.region || ""}
                    onChange={(e) =>
                      setOpsDraft((d) => ({ ...d, region: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: "var(--card-bg-elevated)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  >
                    <option value="">— Select —</option>
                    {(config?.regions || [])
                      .filter((r) => r.isActive !== false)
                      .map((r) => (
                        <option key={r.id} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                  </select>
                }
              />
              <InfoRow
                label="Vessel"
                value={
                  <EditInput
                    value={opsDraft.vessel || ""}
                    onChange={(v) => setOpsDraft((d) => ({ ...d, vessel: v }))}
                  />
                }
              />
              <InfoRow
                label="Field"
                value={
                  <EditInput
                    value={opsDraft.field || ""}
                    onChange={(v) => setOpsDraft((d) => ({ ...d, field: v }))}
                  />
                }
              />
              <InfoRow
                label="Water Depth"
                value={
                  <EditInput
                    type="number"
                    value={String(opsDraft.waterDepth || 0)}
                    onChange={(v) =>
                      setOpsDraft((d) => ({ ...d, waterDepth: Number(v) || 0 }))
                    }
                  />
                }
              />
              <InfoRow
                label="Operation Start"
                value={
                  <EditInput
                    type="date"
                    value={opsDraft.operationStartDate || ""}
                    onChange={(v) =>
                      setOpsDraft((d) => ({ ...d, operationStartDate: v }))
                    }
                  />
                }
              />
              <InfoRow
                label="Duration (days)"
                value={
                  <EditInput
                    type="number"
                    value={String(opsDraft.totalDuration || 0)}
                    onChange={(v) =>
                      setOpsDraft((d) => ({
                        ...d,
                        totalDuration: Number(v) || 0,
                      }))
                    }
                  />
                }
              />
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <InfoRow label="Client" value={bid.opportunityInfo?.client} />
              <InfoRow
                label="Client Contact"
                value={bid.opportunityInfo?.clientContact}
              />
              <InfoRow label="Region" value={bid.opportunityInfo?.region} />
              <InfoRow label="Vessel" value={bid.opportunityInfo?.vessel} />
              <InfoRow label="Field" value={bid.opportunityInfo?.field} />
              <InfoRow
                label="Water Depth"
                value={
                  bid.opportunityInfo?.waterDepth
                    ? `${bid.opportunityInfo.waterDepth} ${bid.opportunityInfo.waterDepthUnit || "m"}`
                    : "—"
                }
              />
              <InfoRow
                label="Operation Start"
                value={
                  bid.opportunityInfo?.operationStartDate
                    ? formatDate(bid.opportunityInfo.operationStartDate)
                    : "—"
                }
              />
              <InfoRow
                label="Duration"
                value={
                  bid.opportunityInfo?.totalDuration
                    ? `${bid.opportunityInfo.totalDuration} ${bid.opportunityInfo.totalDurationUnit || "days"}`
                    : "—"
                }
              />
            </div>
          )}
        </div>

        {/* Currency & PTAX */}
        <div className={styles.infoSection}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4
              className={styles.infoTitle}
              style={{ borderBottom: "none", marginBottom: 0 }}
            >
              Currency & PTAX
            </h4>
            {canEdit && !isClosed && !editingCurrency && (
              <button
                style={editBtnStyle}
                onClick={() => {
                  setCurrDraft({
                    currency:
                      bid.opportunityInfo?.currency ||
                      config?.currencySettings?.defaultCurrency ||
                      "USD",
                    ptax: bid.opportunityInfo?.ptax || 0,
                    ptaxDate: bid.opportunityInfo?.ptaxDate || "",
                  });
                  setEditingCurrency(true);
                }}
              >
                Edit
              </button>
            )}
            {editingCurrency && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveCurrency}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => setEditingCurrency(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingCurrency ? (
            <div className={styles.infoGrid}>
              <InfoRow
                label="Currency"
                value={
                  <select
                    value={currDraft.currency}
                    onChange={(e) => {
                      const newCurr = e.target.value;
                      const rateEntry = (
                        config?.currencySettings?.exchangeRates || []
                      ).find((r) => r.currency === newCurr);
                      setCurrDraft((d) => ({
                        ...d,
                        currency: newCurr,
                        ptax: rateEntry ? rateEntry.rate : d.ptax,
                        ptaxDate:
                          rateEntry && rateEntry.lastUpdate
                            ? rateEntry.lastUpdate.split("T")[0]
                            : d.ptaxDate,
                      }));
                    }}
                    style={{
                      width: "100%",
                      padding: "4px 8px",
                      border: "1px solid var(--border)",
                      borderRadius: 6,
                      background: "var(--card-bg-elevated)",
                      color: "var(--text-primary)",
                      fontSize: 13,
                    }}
                  >
                    {(() => {
                      const rates =
                        config?.currencySettings?.exchangeRates || [];
                      const currencies = [
                        config?.currencySettings?.defaultCurrency || "USD",
                        ...rates.map((r) => r.currency),
                      ];
                      // deduplicate
                      const unique: string[] = [];
                      currencies.forEach((c) => {
                        if (unique.indexOf(c) < 0) unique.push(c);
                      });
                      return unique.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ));
                    })()}
                  </select>
                }
              />
              <InfoRow
                label="PTAX Rate"
                value={
                  <EditInput
                    type="number"
                    value={String(currDraft.ptax)}
                    onChange={(v) =>
                      setCurrDraft((d) => ({ ...d, ptax: Number(v) || 0 }))
                    }
                  />
                }
              />
              <InfoRow
                label="PTAX Date"
                value={
                  <EditInput
                    type="date"
                    value={currDraft.ptaxDate}
                    onChange={(v) =>
                      setCurrDraft((d) => ({ ...d, ptaxDate: v }))
                    }
                  />
                }
              />
            </div>
          ) : (
            <div className={styles.infoGrid}>
              <InfoRow
                label="Currency"
                value={
                  bid.opportunityInfo?.currency ||
                  config?.currencySettings?.defaultCurrency ||
                  "USD"
                }
              />
              <InfoRow
                label="PTAX Rate"
                value={
                  bid.opportunityInfo?.ptax
                    ? bid.opportunityInfo.ptax.toFixed(4)
                    : "—"
                }
              />
              <InfoRow
                label="PTAX Date"
                value={
                  bid.opportunityInfo?.ptaxDate
                    ? formatDate(bid.opportunityInfo.ptaxDate)
                    : "—"
                }
              />
            </div>
          )}
          {isClosed && (
            <p
              style={{
                fontSize: 11,
                color: "var(--text-tertiary)",
                marginTop: 4,
                fontStyle: "italic",
              }}
            >
              Currency locked — BID is closed.
            </p>
          )}
        </div>

        {/* Project Description (Commercial Input) */}
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>
            Project Description (Commercial Input)
          </h4>
          <p className={styles.scopeDescription}>
            {bid.opportunityInfo?.projectDescription ||
              "No description provided."}
          </p>
        </div>

        {/* Engineer BID Overview */}
        <div className={styles.infoSection}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h4
              className={styles.infoTitle}
              style={{ borderBottom: "none", marginBottom: 0 }}
            >
              Engineer BID Overview
            </h4>
            {canEdit && !editingOverview && (
              <button
                style={editBtnStyle}
                onClick={() => {
                  setOverviewDraft(bid.engineerBidOverview || "");
                  setEditingOverview(true);
                }}
              >
                Edit
              </button>
            )}
            {editingOverview && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveOverview}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => setEditingOverview(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingOverview ? (
            <textarea
              value={overviewDraft}
              onChange={(e) => setOverviewDraft(e.target.value)}
              placeholder="Write your engineering overview of this BID..."
              style={{
                width: "100%",
                minHeight: 120,
                padding: 10,
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: 13,
                resize: "vertical",
                marginTop: 8,
              }}
            />
          ) : (
            <p className={styles.scopeDescription}>
              {bid.engineerBidOverview || "No overview written yet."}
            </p>
          )}
        </div>

        {/* Request Notes (bidNotes.general) */}
        {(bid.bidNotes as Record<string, string>)?.general && (
          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle}>Request Notes</h4>
            <p className={styles.scopeDescription}>
              {(bid.bidNotes as Record<string, string>).general}
            </p>
          </div>
        )}

        {/* People */}
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>Key People</h4>
          {bid.serviceLine === "Integrated" ? (
            (() => {
              const groupByDiv = (
                people: { name: string; email: string; role?: string }[],
              ): {
                rov: typeof people;
                survey: typeof people;
                other: typeof people;
              } => {
                const rov: typeof people = [];
                const survey: typeof people = [];
                const other: typeof people = [];
                people.forEach((p) => {
                  const div = getPersonDivision(p.email);
                  if (div === "ROV") rov.push(p);
                  else if (div === "SURVEY") survey.push(p);
                  else other.push(p);
                });
                return { rov, survey, other };
              };
              const engineers = groupByDiv(bid.engineerResponsible || []);
              const analysts = groupByDiv(bid.analyst || []);
              const reviewersList = groupByDiv(bid.reviewers || []);
              const renderGroup = (
                label: string,
                groups: {
                  rov: { name: string; email: string; role?: string }[];
                  survey: (typeof groups)["rov"];
                  other: (typeof groups)["rov"];
                },
              ): React.ReactNode => (
                <div style={{ marginBottom: 12 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                      marginBottom: 4,
                    }}
                  >
                    {label}
                  </div>
                  {groups.rov.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--primary-accent)",
                          marginRight: 8,
                        }}
                      >
                        ROV
                      </span>
                      {groups.rov.map((p) => (
                        <PersonChip
                          key={p.email}
                          name={p.name}
                          email={p.email}
                          role={p.role}
                        />
                      ))}
                    </div>
                  )}
                  {groups.survey.length > 0 && (
                    <div style={{ marginBottom: 4 }}>
                      <span
                        style={{
                          fontSize: 11,
                          fontWeight: 700,
                          color: "var(--warning)",
                          marginRight: 8,
                        }}
                      >
                        SURVEY
                      </span>
                      {groups.survey.map((p) => (
                        <PersonChip
                          key={p.email}
                          name={p.name}
                          email={p.email}
                          role={p.role}
                        />
                      ))}
                    </div>
                  )}
                  {groups.other.length > 0 && (
                    <div>
                      {groups.other.map((p) => (
                        <PersonChip
                          key={p.email}
                          name={p.name}
                          email={p.email}
                          role={p.role}
                        />
                      ))}
                    </div>
                  )}
                  {groups.rov.length === 0 &&
                    groups.survey.length === 0 &&
                    groups.other.length === 0 && (
                      <span
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        —
                      </span>
                    )}
                </div>
              );
              return (
                <div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 4,
                      }}
                    >
                      Creator
                    </div>
                    {bid.creator ? (
                      <PersonChip
                        name={bid.creator.name}
                        email={bid.creator.email}
                        role={bid.creator.role}
                      />
                    ) : (
                      "—"
                    )}
                  </div>
                  <div style={{ marginBottom: 12 }}>
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "var(--text-secondary)",
                        marginBottom: 4,
                      }}
                    >
                      Project Manager
                    </div>
                    {(bid.projectManager || []).length > 0 ? (
                      (bid.projectManager || []).map((pm) => (
                        <PersonChip
                          key={pm.email}
                          name={pm.name}
                          email={pm.email}
                        />
                      ))
                    ) : (
                      <span
                        style={{ fontSize: 13, color: "var(--text-secondary)" }}
                      >
                        —
                      </span>
                    )}
                  </div>
                  {renderGroup("Engineer Responsible", engineers)}
                  {renderGroup("Analyst", analysts)}
                  {renderGroup("Reviewers", reviewersList)}
                </div>
              );
            })()
          ) : (
            <div className={styles.infoGrid}>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  Creator
                </div>
                {bid.creator ? (
                  <PersonChip
                    name={bid.creator.name}
                    email={bid.creator.email}
                    role={bid.creator.role}
                  />
                ) : (
                  "—"
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  Engineer Responsible
                </div>
                {(bid.engineerResponsible || []).length > 0 ? (
                  bid.engineerResponsible.map((e) => (
                    <PersonChip key={e.email} name={e.name} email={e.email} />
                  ))
                ) : (
                  <span
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    —
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  Analyst
                </div>
                {(bid.analyst || []).length > 0 ? (
                  bid.analyst.map((a) => (
                    <PersonChip key={a.email} name={a.name} email={a.email} />
                  ))
                ) : (
                  <span
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    —
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  Project Manager
                </div>
                {(bid.projectManager || []).length > 0 ? (
                  bid.projectManager.map((pm) => (
                    <PersonChip
                      key={pm.email}
                      name={pm.name}
                      email={pm.email}
                    />
                  ))
                ) : (
                  <span
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    —
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-secondary)",
                    marginBottom: 4,
                  }}
                >
                  Reviewers
                </div>
                {(bid.reviewers || []).length > 0 ? (
                  bid.reviewers.map((r) => (
                    <PersonChip key={r.email} name={r.name} email={r.email} />
                  ))
                ) : (
                  <span
                    style={{ fontSize: 13, color: "var(--text-secondary)" }}
                  >
                    None assigned
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Phase Progress + KPIs */}
      <div className={styles.flexColumn}>
        <div className={styles.progressSection}>
          <h4 className={styles.infoTitle}>
            Phase Progress — {getPhaseLabelForBid(bid)}
          </h4>
          {configPhases.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            const stateClass = isCompleted
              ? styles.completed
              : isCurrent
                ? styles.current
                : styles.pending;
            return (
              <div
                key={phase.id}
                className={`${styles.phaseStep} ${stateClass}`}
              >
                <div className={`${styles.phaseCircle} ${stateClass}`}>
                  {isCompleted ? "✓" : idx}
                </div>
                <div className={styles.phaseInfo}>
                  <div className={styles.phaseLabel}>{phase.label}</div>
                  <div className={styles.phaseStatus}>
                    {isCompleted
                      ? "Completed"
                      : isCurrent
                        ? bid.currentStatus
                        : "Pending"}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>BID KPIs</h4>
          <div className={styles.flexColumnSmall}>
            <InfoRow
              label="Days Elapsed"
              value={`${bid.kpis?.totalDaysElapsed ?? 0} days`}
            />
            <InfoRow
              label="Days in Phase"
              value={`${bid.kpis?.daysInCurrentPhase ?? 0} days`}
            />
            <InfoRow
              label="Est. Remaining"
              value={`${bid.kpis?.estimatedDaysRemaining ?? 0} days`}
            />
            <InfoRow
              label="Completion"
              value={`${bid.kpis?.phaseCompletionPercentage ?? 0}%`}
            />
            <InfoRow
              label="Overdue"
              value={
                bid.kpis?.isOverdue ? `Yes (${bid.kpis.overdueBy} days)` : "No"
              }
            />
          </div>
        </div>

        {/* Dates */}
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>Key Dates</h4>
          <div className={styles.flexColumnSmall}>
            <InfoRow label="Created" value={formatDateTime(bid.createdDate)} />
            <InfoRow
              label="Start Date"
              value={bid.startDate ? formatDate(bid.startDate) : "Not started"}
            />
            <InfoRow label="Due Date" value={formatDate(bid.dueDate)} />
            <InfoRow
              label="Completed"
              value={bid.completedDate ? formatDate(bid.completedDate) : "—"}
            />
            <InfoRow
              label="Last Modified"
              value={formatDateTime(bid.lastModified)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

/* Scope, Hours, Cost, Tasks tabs now use sub-components: BidEquipmentTable, BidHoursTable, BidCostSummary, BidTaskChecklist */

/* TimelineTab is now BidTimeline component in components/bid/BidTimeline.tsx */

/* Approval tab now uses BidApprovalPanel sub-component */

/* ─── Tab: Documents ─── */
const DocumentsTab: React.FC<{
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}> = ({ bid, canEdit, onSave, currentUser }) => {
  const [showUpload, setShowUpload] = React.useState(false);
  const [docTitle, setDocTitle] = React.useState("");
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [uploading, setUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const addActivityEntry = (
    description: string,
    attachments: IBidAttachment[],
  ): IActivityLogEntry => ({
    id: `log-${Date.now()}`,
    type: "DOCUMENT_CHANGE",
    timestamp: new Date().toISOString(),
    actor: currentUser?.email || "",
    actorName: currentUser?.displayName || "",
    description,
    metadata: {},
  });

  const handleUpload = async (): Promise<void> => {
    if (!onSave || selectedFiles.length === 0 || !docTitle.trim()) return;
    setUploading(true);
    try {
      const newAttachments: IBidAttachment[] = selectedFiles.map((file) => ({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        fileName: file.name,
        fileUrl: URL.createObjectURL(file),
        fileSize: file.size,
        fileType: file.name.split(".").pop() || "",
        uploadedBy: currentUser?.displayName || "",
        uploadedDate: new Date().toISOString(),
        category: docTitle.trim(),
      }));

      const logEntry = addActivityEntry(
        `Documents uploaded: "${docTitle.trim()}" (${selectedFiles.length} file${selectedFiles.length > 1 ? "s" : ""})`,
        newAttachments,
      );

      onSave({
        attachments: [...(bid.attachments || []), ...newAttachments],
        activityLog: [...(bid.activityLog || []), logEntry],
      });

      setShowUpload(false);
      setDocTitle("");
      setSelectedFiles([]);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = (attId: string): void => {
    if (!onSave) return;
    const att = (bid.attachments || []).find((a) => a.id === attId);
    const logEntry = addActivityEntry(
      `Document deleted: "${att?.fileName || "unknown"}" (${att?.category || ""})`,
      [],
    );
    onSave({
      attachments: (bid.attachments || []).filter((a) => a.id !== attId),
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

  return (
    <div className={styles.flexColumn}>
      {/* Commercial Folder Link */}
      {bid.commercialFolderUrl && (
        <GlassCard title="Commercial Folder">
          <div className={styles.docItem}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--secondary-accent)"
              strokeWidth="2"
            >
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
            </svg>
            <div className={styles.docItemInfo}>
              <a
                href={bid.commercialFolderUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "var(--primary-accent)",
                  textDecoration: "underline",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                Open Commercial Folder in SharePoint
              </a>
              <div className={styles.docItemMeta}>
                Link provided by commercial team at request creation
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <GlassCard title="Documents & Attachments">
        {canEdit && (
          <div style={{ marginBottom: 16 }}>
            {!showUpload ? (
              <button
                className={styles.backBtn}
                style={{
                  background: "var(--primary-accent)",
                  color: "#fff",
                  border: "none",
                }}
                onClick={() => setShowUpload(true)}
              >
                + Attach Document
              </button>
            ) : (
              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  border: "1px solid var(--border)",
                  background: "var(--card-bg-elevated)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <input
                  placeholder="Document title / category..."
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card-bg)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                  }}
                />
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <button
                    className={styles.backBtn}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "1px dashed var(--border)",
                      background: "transparent",
                      fontSize: 12,
                    }}
                  >
                    📎 Choose Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const files = e.target.files;
                      if (files) {
                        const arr: File[] = [];
                        for (let i = 0; i < files.length; i++)
                          arr.push(files[i]);
                        setSelectedFiles(arr);
                      }
                    }}
                  />
                  {selectedFiles.length > 0 && (
                    <span
                      style={{ fontSize: 12, color: "var(--text-secondary)" }}
                    >
                      {selectedFiles.length} file(s) selected
                    </span>
                  )}
                </div>
                {selectedFiles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {selectedFiles.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          fontSize: 11,
                          padding: "2px 8px",
                          borderRadius: 4,
                          background: "rgba(59,130,246,0.1)",
                          color: "var(--primary-accent)",
                        }}
                      >
                        {f.name}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    className={styles.backBtn}
                    onClick={() => {
                      setShowUpload(false);
                      setDocTitle("");
                      setSelectedFiles([]);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className={styles.backBtn}
                    style={{
                      background: "var(--primary-accent)",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={handleUpload}
                    disabled={
                      uploading ||
                      !docTitle.trim() ||
                      selectedFiles.length === 0
                    }
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {(bid.attachments || []).length === 0 ? (
          <EmptySection message="No documents uploaded yet." />
        ) : (
          <div className={styles.docList}>
            {bid.attachments.map((att) => (
              <div key={att.id} className={styles.docItem}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--secondary-accent)"
                  strokeWidth="2"
                >
                  <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                  <path d="M14 2v6h6" />
                </svg>
                <div className={styles.docItemInfo} style={{ flex: 1 }}>
                  <a
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.docItemName}
                    style={{
                      color: "var(--primary-accent)",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {att.fileName}
                  </a>
                  <div className={styles.docItemMeta}>
                    {att.category} · {formatFileSize(att.fileSize)} ·{" "}
                    {att.uploadedBy} · {formatDateTime(att.uploadedDate)}
                  </div>
                </div>
                <StatusBadge
                  status={att.fileType.toUpperCase()}
                  color="var(--primary-accent)"
                />
                {canEdit && (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error-color, #EF4444)",
                      cursor: "pointer",
                      fontSize: 14,
                      marginLeft: 8,
                    }}
                    onClick={() => handleDeleteAttachment(att.id)}
                    title="Remove document"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

/* Comments tab now uses BidComments sub-component */

/* ─── Tab: BID Notes ─── */
const NotesTab: React.FC<{
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}> = ({ bid, canEdit, onSave, currentUser }) => {
  const notes = (bid.bidNotes || {}) as Record<string, string>;
  const entries = Object.entries(notes);
  const quickNotes: IQuickNote[] = bid.quickNotes || [];
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [newKey, setNewKey] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [newQuickNote, setNewQuickNote] = React.useState("");

  const handleSave = (key: string, value: string): void => {
    if (!onSave) return;
    onSave({ bidNotes: { ...notes, [key]: value } });
    setEditingKey(null);
  };

  const handleAddNote = (): void => {
    if (!onSave || !newKey.trim()) return;
    onSave({ bidNotes: { ...notes, [newKey.trim()]: editValue } });
    setNewKey("");
    setEditValue("");
    setShowAddForm(false);
  };

  const handleDelete = (key: string): void => {
    if (!onSave) return;
    const updated = { ...notes };
    delete updated[key];
    onSave({ bidNotes: updated });
  };

  const addQuickNote = (): void => {
    if (!onSave || !newQuickNote.trim()) return;
    const qn: IQuickNote = {
      id: `note-${Date.now()}`,
      text: newQuickNote.trim(),
      author: {
        name: currentUser?.displayName || "",
        email: currentUser?.email || "",
      },
      createdAt: new Date().toISOString(),
    };
    onSave({ quickNotes: [...quickNotes, qn] });
    setNewQuickNote("");
  };

  const deleteQuickNote = (noteId: string): void => {
    if (!onSave) return;
    onSave({ quickNotes: quickNotes.filter((n) => n.id !== noteId) });
  };

  return (
    <div className={styles.flexColumn}>
      {/* Request Notes (bidNotes.general) */}
      {notes.general && (
        <GlassCard title="Request Notes (from Commercial)">
          <p className={styles.scopeDescription}>{notes.general}</p>
        </GlassCard>
      )}

      {/* Quick Notes */}
      <GlassCard title="Quick Notes">
        {quickNotes.length === 0 && !canEdit && (
          <EmptySection message="No quick notes yet." />
        )}
        <div className={styles.flexColumn}>
          {quickNotes.map((qn) => (
            <div
              key={qn.id}
              className={styles.infoSection}
              style={{
                padding: "10px 14px",
                borderLeft: "3px solid var(--primary-accent)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-primary)",
                  }}
                >
                  {qn.text}
                </p>
                {canEdit && (
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--error-color, #EF4444)",
                      cursor: "pointer",
                      fontSize: 13,
                      marginLeft: 8,
                      flexShrink: 0,
                    }}
                    onClick={() => deleteQuickNote(qn.id)}
                  >
                    ✕
                  </button>
                )}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  marginTop: 4,
                }}
              >
                {qn.author?.name || "Unknown"} ·{" "}
                {qn.createdAt ? formatDateTime(qn.createdAt) : ""}
              </div>
            </div>
          ))}
        </div>
        {canEdit && (
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <input
              value={newQuickNote}
              onChange={(e) => setNewQuickNote(e.target.value)}
              placeholder="Write a quick note..."
              onKeyDown={(e) => {
                if (e.key === "Enter") addQuickNote();
              }}
              style={{
                flex: 1,
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: 13,
              }}
            />
            <button
              className={styles.backBtn}
              style={{
                background: "var(--primary-accent)",
                color: "#fff",
                border: "none",
              }}
              onClick={addQuickNote}
              disabled={!newQuickNote.trim()}
            >
              + Add
            </button>
          </div>
        )}
      </GlassCard>

      {/* Analysis Notes (bidNotes) */}
      <GlassCard title="BID Analysis Notes">
        {entries.filter(([k]) => k !== "general").length === 0 &&
        !showAddForm ? (
          <EmptySection message="No analysis notes added yet." />
        ) : (
          <div className={styles.flexColumn}>
            {entries
              .filter(([k]) => k !== "general")
              .map(([section, content]) => (
                <div key={section} className={styles.infoSection}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h4
                      className={styles.infoTitle}
                      style={{
                        marginBottom: 0,
                        borderBottom: "none",
                        paddingBottom: 0,
                        flex: 1,
                      }}
                    >
                      {section}
                    </h4>
                    {canEdit && editingKey !== section && (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button
                          className={styles.backBtn}
                          onClick={() => {
                            setEditingKey(section);
                            setEditValue(content);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className={styles.backBtn}
                          style={{ color: "var(--error-color, #EF4444)" }}
                          onClick={() => handleDelete(section)}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {editingKey === section ? (
                    <div style={{ marginTop: "12px" }}>
                      <textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        style={{
                          width: "100%",
                          minHeight: "100px",
                          padding: "10px",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: "13px",
                          resize: "vertical",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "8px",
                        }}
                      >
                        <button
                          className={styles.backBtn}
                          style={{
                            background: "var(--primary-accent)",
                            color: "white",
                            border: "none",
                          }}
                          onClick={() => handleSave(section, editValue)}
                        >
                          Save
                        </button>
                        <button
                          className={styles.backBtn}
                          onClick={() => setEditingKey(null)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      className={styles.noteContent}
                      style={{ marginTop: "12px" }}
                    >
                      {content}
                    </p>
                  )}
                </div>
              ))}
          </div>
        )}
        {canEdit && !showAddForm && (
          <button
            className={styles.backBtn}
            style={{
              marginTop: "16px",
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
            }}
            onClick={() => setShowAddForm(true)}
          >
            + Add Note
          </button>
        )}
        {canEdit && showAddForm && (
          <div className={styles.infoSection} style={{ marginTop: "16px" }}>
            <input
              placeholder="Section title (e.g., Gap Analysis, Technical Notes...)"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "14px",
                marginBottom: "8px",
              }}
            />
            <textarea
              placeholder="Note content..."
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: "100%",
                minHeight: "100px",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--card-bg-elevated)",
                color: "var(--text-primary)",
                fontSize: "13px",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
              <button
                className={styles.backBtn}
                style={{
                  background: "var(--primary-accent)",
                  color: "white",
                  border: "none",
                }}
                onClick={handleAddNote}
                disabled={!newKey.trim()}
              >
                Save Note
              </button>
              <button
                className={styles.backBtn}
                onClick={() => {
                  setShowAddForm(false);
                  setNewKey("");
                  setEditValue("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

/* ─── Tab: Clarifications & Qualifications ─── */
const makeQId = (): string =>
  `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

const QualificationsTab: React.FC<{
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
}> = ({ bid, canEdit, onSave }) => {
  const tables = bid.qualificationTables || [];
  const clarifications = bid.clarifications || [];
  const scopeItems = bid.scopeItems || [];

  // Auto-import clarifications from scope items with compliance === "no"
  const autoImported = React.useMemo(() => {
    const nonCompliant = scopeItems.filter(
      (s) => !s.isSection && s.compliance === "no",
    );
    const existingIds = new Set(
      clarifications.filter((c) => c.isAutoImported).map((c) => c.scopeItemId),
    );
    const newAuto: IClarificationItem[] = [];
    nonCompliant.forEach((si) => {
      if (!existingIds.has(si.id)) {
        newAuto.push({
          id: makeQId(),
          scopeItemId: si.id,
          item: si.equipmentOffer || si.oiiPartNumber || `#${si.lineNumber}`,
          description: si.description,
          clarification: "",
          clientResponse: "",
          isAutoImported: true,
        });
      }
    });
    return newAuto;
  }, [scopeItems, clarifications]);

  const allClarifications = React.useMemo(() => {
    // Merge existing + auto-imported (dedupe by scopeItemId)
    const merged = [...clarifications];
    autoImported.forEach((a) => {
      if (
        !merged.some((m) => m.isAutoImported && m.scopeItemId === a.scopeItemId)
      ) {
        merged.push(a);
      }
    });
    // Remove auto-imported entries whose scope item is no longer compliance="no"
    const nonCompliantIds = new Set(
      scopeItems
        .filter((s) => !s.isSection && s.compliance === "no")
        .map((s) => s.id),
    );
    return merged.filter(
      (c) => !c.isAutoImported || nonCompliantIds.has(c.scopeItemId || ""),
    );
  }, [clarifications, autoImported, scopeItems]);

  // Persist clarifications
  const saveClarifications = (updated: IClarificationItem[]): void => {
    if (!onSave) return;
    onSave({ clarifications: updated });
  };

  const addClarification = (): void => {
    saveClarifications([
      ...allClarifications,
      {
        id: makeQId(),
        scopeItemId: null,
        item: "",
        description: "",
        clarification: "",
        clientResponse: "",
        isAutoImported: false,
      },
    ]);
  };

  const updateClarification = (
    id: string,
    field: keyof IClarificationItem,
    value: string,
  ): void => {
    saveClarifications(
      allClarifications.map((c) =>
        c.id === id ? { ...c, [field]: value } : c,
      ),
    );
  };

  const deleteClarification = (id: string): void => {
    saveClarifications(allClarifications.filter((c) => c.id !== id));
  };

  // Qualification tables
  const saveQualTables = (updated: IQualificationTable[]): void => {
    if (!onSave) return;
    onSave({ qualificationTables: updated });
  };

  const addTable = (): void => {
    saveQualTables([
      ...tables,
      { id: makeQId(), title: "New Qualification Table", items: [] },
    ]);
  };

  const updateTableTitle = (tableId: string, title: string): void => {
    saveQualTables(tables.map((t) => (t.id === tableId ? { ...t, title } : t)));
  };

  const deleteTable = (tableId: string): void => {
    saveQualTables(tables.filter((t) => t.id !== tableId));
  };

  const addQualItem = (tableId: string): void => {
    saveQualTables(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        const nextItem =
          (t.items.length > 0 ? Math.max(...t.items.map((i) => i.item)) : 0) +
          1;
        return {
          ...t,
          items: [
            ...t.items,
            { id: makeQId(), item: nextItem, description: "", comments: "" },
          ],
        };
      }),
    );
  };

  const updateQualItem = (
    tableId: string,
    itemId: string,
    field: keyof IQualificationItem,
    value: unknown,
  ): void => {
    saveQualTables(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          items: t.items.map((i) =>
            i.id === itemId ? { ...i, [field]: value } : i,
          ),
        };
      }),
    );
  };

  const deleteQualItem = (tableId: string, itemId: string): void => {
    saveQualTables(
      tables.map((t) => {
        if (t.id !== tableId) return t;
        return { ...t, items: t.items.filter((i) => i.id !== itemId) };
      }),
    );
  };

  return (
    <div className={styles.flexColumn}>
      {/* ─── Qualifications ─── */}
      <GlassCard title="Qualifications">
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}
        >
          Qualification tables for client / vessel owner requirements.
        </p>
        {tables.length === 0 && (
          <EmptySection message="No qualification tables yet." />
        )}
        {tables.map((table) => (
          <div
            key={table.id}
            className={styles.infoSection}
            style={{ marginBottom: 20 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              {canEdit ? (
                <input
                  value={table.title}
                  onChange={(e) => updateTableTitle(table.id, e.target.value)}
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    padding: "4px 8px",
                    border: "1px solid var(--border)",
                    borderRadius: 6,
                    background: "var(--card-bg-elevated)",
                    color: "var(--text-primary)",
                    flex: 1,
                    marginRight: 8,
                  }}
                />
              ) : (
                <h4
                  className={styles.infoTitle}
                  style={{ marginBottom: 0, borderBottom: "none" }}
                >
                  {table.title}
                </h4>
              )}
              {canEdit && (
                <button
                  className={styles.backBtn}
                  style={{ color: "var(--error-color, #EF4444)", fontSize: 12 }}
                  onClick={() => {
                    if (
                      window.confirm(
                        `Delete table "${table.title}"? This cannot be undone.`,
                      )
                    )
                      deleteTable(table.id);
                  }}
                >
                  Remove Table
                </button>
              )}
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      width: 50,
                      color: "var(--text-secondary)",
                    }}
                  >
                    Item
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      borderBottom: "1px solid var(--border)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Comments
                  </th>
                  {canEdit && (
                    <th
                      style={{
                        width: 40,
                        borderBottom: "1px solid var(--border)",
                      }}
                    />
                  )}
                </tr>
              </thead>
              <tbody>
                {table.items.map((qi) => (
                  <tr key={qi.id}>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        fontWeight: 600,
                      }}
                    >
                      {qi.item}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEdit ? (
                        <input
                          value={qi.description}
                          onChange={(e) =>
                            updateQualItem(
                              table.id,
                              qi.id,
                              "description",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        qi.description || "—"
                      )}
                    </td>
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                      }}
                    >
                      {canEdit ? (
                        <input
                          value={qi.comments}
                          onChange={(e) =>
                            updateQualItem(
                              table.id,
                              qi.id,
                              "comments",
                              e.target.value,
                            )
                          }
                          style={{
                            width: "100%",
                            padding: "4px 6px",
                            border: "1px solid var(--border)",
                            borderRadius: 4,
                            background: "var(--card-bg-elevated)",
                            color: "var(--text-primary)",
                            fontSize: 13,
                          }}
                        />
                      ) : (
                        qi.comments || "—"
                      )}
                    </td>
                    {canEdit && (
                      <td
                        style={{
                          padding: "6px 10px",
                          borderBottom: "1px solid var(--border)",
                          textAlign: "center",
                        }}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--error-color, #EF4444)",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                          onClick={() => deleteQualItem(table.id, qi.id)}
                        >
                          ✕
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {canEdit && (
              <button
                className={styles.backBtn}
                style={{ marginTop: 8, fontSize: 12 }}
                onClick={() => addQualItem(table.id)}
              >
                + Add Item
              </button>
            )}
          </div>
        ))}
        {canEdit && (
          <button
            className={styles.backBtn}
            style={{
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
              marginTop: 8,
            }}
            onClick={addTable}
          >
            + Add Qualification Table
          </button>
        )}
      </GlassCard>

      {/* ─── Clarifications ─── */}
      <GlassCard title="Clarifications">
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            marginBottom: 12,
          }}
        >
          Items with Compliance = &quot;No&quot; are auto-imported. You can also
          add manual entries.
        </p>
        {allClarifications.length === 0 ? (
          <EmptySection message="No clarifications needed." />
        ) : (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    width: 30,
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Item
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Clarification / Qualification
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "left",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                  }}
                >
                  Client Response
                </th>
                <th
                  style={{
                    padding: "8px 10px",
                    textAlign: "center",
                    borderBottom: "1px solid var(--border)",
                    color: "var(--text-secondary)",
                    width: 60,
                  }}
                >
                  Source
                </th>
                {canEdit && (
                  <th
                    style={{
                      width: 40,
                      borderBottom: "1px solid var(--border)",
                    }}
                  />
                )}
              </tr>
            </thead>
            <tbody>
              {allClarifications.map((c, idx) => (
                <tr key={c.id}>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                      fontWeight: 600,
                    }}
                  >
                    {idx + 1}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {canEdit && !c.isAutoImported ? (
                      <input
                        value={c.item}
                        onChange={(e) =>
                          updateClarification(c.id, "item", e.target.value)
                        }
                        style={{
                          width: "100%",
                          padding: "4px 6px",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          fontStyle: c.isAutoImported ? "italic" : undefined,
                        }}
                      >
                        {c.item || "—"}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {canEdit && !c.isAutoImported ? (
                      <input
                        value={c.description}
                        onChange={(e) =>
                          updateClarification(
                            c.id,
                            "description",
                            e.target.value,
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "4px 6px",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                    ) : (
                      c.description || "—"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {canEdit ? (
                      <input
                        value={c.clarification}
                        onChange={(e) =>
                          updateClarification(
                            c.id,
                            "clarification",
                            e.target.value,
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "4px 6px",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                    ) : (
                      c.clarification || "—"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                    }}
                  >
                    {canEdit ? (
                      <input
                        value={c.clientResponse}
                        onChange={(e) =>
                          updateClarification(
                            c.id,
                            "clientResponse",
                            e.target.value,
                          )
                        }
                        style={{
                          width: "100%",
                          padding: "4px 6px",
                          border: "1px solid var(--border)",
                          borderRadius: 4,
                          background: "var(--card-bg-elevated)",
                          color: "var(--text-primary)",
                          fontSize: 13,
                        }}
                      />
                    ) : (
                      c.clientResponse || "—"
                    )}
                  </td>
                  <td
                    style={{
                      padding: "6px 10px",
                      borderBottom: "1px solid var(--border)",
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: c.isAutoImported
                          ? "rgba(234, 179, 8, 0.15)"
                          : "rgba(59, 130, 246, 0.15)",
                        color: c.isAutoImported
                          ? "var(--warning-color, #EAB308)"
                          : "var(--primary-accent)",
                      }}
                    >
                      {c.isAutoImported ? "Auto" : "Manual"}
                    </span>
                  </td>
                  {canEdit && (
                    <td
                      style={{
                        padding: "6px 10px",
                        borderBottom: "1px solid var(--border)",
                        textAlign: "center",
                      }}
                    >
                      {!c.isAutoImported && (
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            color: "var(--error-color, #EF4444)",
                            cursor: "pointer",
                            fontSize: 14,
                          }}
                          onClick={() => deleteClarification(c.id)}
                        >
                          ✕
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {canEdit && (
          <button
            className={styles.backBtn}
            style={{
              background: "var(--primary-accent)",
              color: "white",
              border: "none",
              marginTop: 12,
            }}
            onClick={addClarification}
          >
            + Add Clarification
          </button>
        )}
      </GlassCard>
    </div>
  );
};

/* ─── Tab: AI Analysis ─── */
const AITab: React.FC = () => (
  <GlassCard title="AI Analysis">
    <div className={styles.emptyTabContent}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className={styles.emptyTabIconLg}
      >
        <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
      </svg>
      <h3 className={styles.emptyTabTitle}>AI Analysis Coming Soon</h3>
      <p className={styles.emptyTabText}>
        The AI-powered analysis feature will be available in a future release.
      </p>
    </div>
  </GlassCard>
);

/* Activity tab now uses BidActivityLog sub-component */

/* Export tab now uses BidExportButton sub-component */

/* ─── Empty State Helper ─── */
const EmptySection: React.FC<{ message: string }> = ({ message }) => (
  <div className={styles.emptyTabContent}>
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      className={styles.emptyTabIcon}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
    </svg>
    <p>{message}</p>
  </div>
);
