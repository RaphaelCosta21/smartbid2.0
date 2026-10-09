import * as React from "react";
import {
  Check,
  X,
  Clock,
  Circle,
  RefreshCw,
  FastForward,
  ShieldCheck,
  FileText,
  Wrench,
  Briefcase,
} from "lucide-react";
import {
  IBid,
  IExchangeRateSnapshot,
  ITeamMember,
  BusinessLine,
  Division,
  BidType,
  BidSize,
  BidPhase,
} from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { EditLockBanner } from "../common/EditLockBanner";
import { ApprovalOverrideBanner } from "../approval/ApprovalOverrideBanner";
import { useConfigStore } from "../../stores/useConfigStore";
import { useUIStore } from "../../stores/useUIStore";
import { useConfigPhases } from "../../hooks/useConfigPhases";
import { useEditControl } from "../../hooks/useEditControl";
import { useColorTheme } from "../../hooks/useColorTheme";
import { useSpfxContext } from "../../config/SpfxContext";
import { MembersService } from "../../services/MembersService";
import { CurrencyService } from "../../services/CurrencyService";
import { isTerminalStatus } from "../../utils/statusHelpers";
import { PRIORITY_COLORS } from "../../utils/constants";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import { getActiveApprovalOverride } from "../../utils/approvalHelpers";
import {
  buildDueDateChangePatch,
  DUE_DATE_CHANGED,
} from "../../utils/revisionHelpers";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
  getDaysUntil,
} from "../../utils/formatters";
import { getDueFreezeDate } from "../../utils/bidHelpers";
import {
  buildCostSummary,
  calculateAssetsByResourceType,
  getBidContingency,
} from "../../utils/costCalculations";
import { EmptySection } from "./EmptySection";
import { TechnicalProposalChip } from "./TechnicalProposalChip";
import { getTechnicalProposalState } from "../../utils/technicalProposalHelpers";
import { getPhaseLabelForBid } from "../../utils/phaseHelpers";
import { calcElapsedDays } from "../../utils/durationHelpers";
import { withCurrentOption } from "../../utils/clarificationHelpers";
import { getCurrentRevisionLetter, hasActiveRevision } from "./RevisionsTab";
import { ErnCreateModal } from "./ErnCreateModal";
import { ErnDetailsModal } from "./ErnDetailsModal";
import { ErnSearchModal } from "./ErnSearchModal";
import { DueDateChangeModal } from "./DueDateChangeModal";
import {
  getErnDeadlineState,
  getErnSlots,
  getErnLinkForSlot,
  getLinkedErnTitles,
  ErnDivision,
} from "../../utils/ernHelpers";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import styles from "../../pages/BidDetailPage.module.scss";

/* ─── Helpers ─── */

const PM_BUSINESS_LINES: BusinessLine[] = ["ROV", "SURVEY", "OPG"];

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value || "-"}</div>
  </div>
);

// Keep the component type stable so draft updates do not remount focused inputs.
const EditInput: React.FC<{
  value: string;
  onChange: (v: string) => void;
  type?: string;
  style?: React.CSSProperties;
}> = ({ value, onChange, type, style }) => (
  <input
    type={type || "text"}
    value={value || ""}
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

/* ─── Approval Status Card (Overview sidebar) ─── */

const APPROVAL_STATUS_DISPLAY: Record<
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
    label: "In Progress",
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
    icon: (
      <FastForward
        size={14}
        style={{ verticalAlign: "-2px", color: "var(--tertiary-accent)" }}
      />
    ),
    color: "var(--tertiary-accent)",
    label: "Bypassed by override",
  },
};

const ApprovalStatusCard: React.FC<{ bid: IBid }> = ({ bid }) => {
  const approvals = bid.approvals || [];
  const status = bid.approvalStatus || "not-started";
  const override = getActiveApprovalOverride(bid);
  const display = override
    ? APPROVAL_STATUS_DISPLAY["overridden"]
    : APPROVAL_STATUS_DISPLAY[status] || APPROVAL_STATUS_DISPLAY["not-started"];
  const bypassedEmails = override
    ? override.approvalsAtOverride
        .filter((p) => p.status !== "approved")
        .map((p) => p.stakeholder.email.toLowerCase())
    : [];
  const isBypassed = (email: string): boolean =>
    bypassedEmails.indexOf(email.toLowerCase()) >= 0;
  const totalCount = approvals.length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const rejectedCount = approvals.filter(
    (a) => a.status === "rejected" && !isBypassed(a.stakeholder.email),
  ).length;
  const pendingCount = approvals.filter(
    (a) => a.status === "pending" && !isBypassed(a.stakeholder.email),
  ).length;
  const bypassedCount = approvals.filter((a) =>
    isBypassed(a.stakeholder.email),
  ).length;
  const progressPct =
    totalCount > 0 ? Math.round((approvedCount / totalCount) * 100) : 0;

  // Determine approval round number from persisted rounds
  const rounds = bid.approvalRounds || [];
  const roundLabel = rounds.length > 0 ? `Round ${rounds.length}` : "Round 1";

  // Group by stakeholderRole for sector summary
  const sectorGroups: Record<
    string,
    { total: number; approved: number; rejected: number }
  > = {};
  approvals.forEach((a) => {
    if (!sectorGroups[a.stakeholderRole]) {
      sectorGroups[a.stakeholderRole] = { total: 0, approved: 0, rejected: 0 };
    }
    sectorGroups[a.stakeholderRole].total++;
    if (a.status === "approved") sectorGroups[a.stakeholderRole].approved++;
    if (a.status === "rejected") sectorGroups[a.stakeholderRole].rejected++;
  });

  return (
    <div className={styles.infoSection}>
      <h4
        className={styles.infoTitle}
        style={{ display: "flex", alignItems: "center", gap: 8 }}
      >
        <span>{display.icon}</span>
        <span style={{ flex: 1 }}>Approval Status</span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            color: "var(--text-secondary)",
            background: "var(--glass-bg)",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {roundLabel}
        </span>
      </h4>

      {totalCount === 0 ? (
        override ? (
          <ApprovalOverrideBanner override={override} compact />
        ) : (
          <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
            Approval not started yet. Go to the Approval tab to select approvers
            and start the flow.
          </div>
        )
      ) : (
        <div className={styles.flexColumnSmall}>
          {/* Overall Status Badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 10px",
                borderRadius: 6,
                fontSize: 12,
                fontWeight: 600,
                background: `color-mix(in srgb, ${display.color} 10%, transparent)`,
                color: display.color,
                border: `1px solid color-mix(in srgb, ${display.color} 25%, transparent)`,
              }}
            >
              {display.icon} {display.label}
            </span>
            <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {approvedCount}/{totalCount} approved
            </span>
          </div>

          {/* Progress Bar */}
          <div
            style={{
              width: "100%",
              height: 5,
              borderRadius: 3,
              background: "var(--border-subtle)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progressPct}%`,
                borderRadius: 3,
                background: display.color,
                transition: "width 400ms ease",
              }}
            />
          </div>

          {override && <ApprovalOverrideBanner override={override} compact />}

          {/* Sector Breakdown with approver names + photos */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
              marginTop: 4,
            }}
          >
            {Object.keys(sectorGroups).map((sector) => {
              const g = sectorGroups[sector];
              const sectorApprovals = approvals.filter(
                (a) => a.stakeholderRole === sector,
              );
              const sectorDone = g.approved === g.total;
              const sectorRejected = g.rejected > 0;
              const sectorBypassed = sectorApprovals.some((a) =>
                isBypassed(a.stakeholder.email),
              );
              const sectorIcon = sectorBypassed
                ? "⏩"
                : sectorDone
                  ? "✅"
                  : sectorRejected
                    ? "❌"
                    : "⏳";
              return (
                <div key={sector}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      fontSize: 12,
                      marginBottom: 4,
                    }}
                  >
                    <span style={{ width: 16, textAlign: "center" }}>
                      {sectorIcon}
                    </span>
                    <span
                      style={{ fontWeight: 600, color: "var(--text-primary)" }}
                    >
                      {sector}
                    </span>
                    <span
                      style={{
                        color: "var(--text-secondary)",
                        marginLeft: "auto",
                      }}
                    >
                      {g.approved}/{g.total}
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 3,
                      paddingLeft: 22,
                    }}
                  >
                    {sectorApprovals.map((a) => {
                      const aStatus = isBypassed(a.stakeholder.email)
                        ? APPROVAL_STATUS_DISPLAY["bypassed"]
                        : APPROVAL_STATUS_DISPLAY[a.status] ||
                          APPROVAL_STATUS_DISPLAY["pending"];
                      return (
                        <div key={a.id}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 6,
                              fontSize: 12,
                            }}
                          >
                            {a.stakeholder.photoUrl ? (
                              <img
                                src={a.stakeholder.photoUrl}
                                alt=""
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  objectFit: "cover",
                                }}
                              />
                            ) : (
                              <span
                                style={{
                                  width: 22,
                                  height: 22,
                                  borderRadius: "50%",
                                  background: "var(--border-subtle)",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 10,
                                  fontWeight: 600,
                                  color: "var(--text-secondary)",
                                }}
                              >
                                {a.stakeholder.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                            <span
                              style={{ flex: 1, color: "var(--text-primary)" }}
                            >
                              {a.stakeholder.name}
                            </span>
                            <span
                              style={{ fontSize: 11 }}
                              title={aStatus.label}
                            >
                              {aStatus.icon}
                            </span>
                          </div>
                          {a.comments && (
                            <div
                              style={{
                                paddingLeft: 28,
                                fontSize: 11,
                                fontStyle: "italic",
                                color: "var(--text-secondary)",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word",
                              }}
                            >
                              &ldquo;{a.comments}&rdquo;
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary stats */}
          {(rejectedCount > 0 || pendingCount > 0 || bypassedCount > 0) && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 4,
                fontSize: 11,
                color: "var(--text-secondary)",
              }}
            >
              {pendingCount > 0 && (
                <span>
                  <Clock size={12} style={{ verticalAlign: "-2px" }} />{" "}
                  {pendingCount} pending
                </span>
              )}
              {rejectedCount > 0 && (
                <span style={{ color: "var(--danger)" }}>
                  <X size={12} style={{ verticalAlign: "-2px" }} />{" "}
                  {rejectedCount} rejected
                </span>
              )}
              {bypassedCount > 0 && (
                <span style={{ color: "var(--tertiary-accent)" }}>
                  <FastForward size={12} style={{ verticalAlign: "-2px" }} />{" "}
                  {bypassedCount} bypassed by override
                </span>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── OverviewTab ─── */

export interface OverviewTabProps {
  bid: IBid;
  currentPhaseIndex: number;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  bid,
  currentPhaseIndex,
  canEdit,
  onSave,
  currentUser,
}) => {
  const configPhases = useConfigPhases();
  const config = useConfigStore((s) => s.config);
  const isClosed = isTerminalStatus(bid.currentStatus);
  const tpState = getTechnicalProposalState(bid);
  const spfxContext = useSpfxContext();

  // ERN and due date follow the Overview tab permission; due date also needs a reason and an open BID.
  const canEditErn = !!canEdit;
  const canEditDueDate = !!canEdit && !isClosed;
  const [dueDateModalOpen, setDueDateModalOpen] = React.useState(false);
  const lastDueDateChange = (bid.activityLog || [])
    .filter((e) => e.type === DUE_DATE_CHANGED)
    .pop();

  // ERN modals
  const [ernCreate, setErnCreate] = React.useState<{
    division: ErnDivision;
  } | null>(null);
  const [ernSearch, setErnSearch] = React.useState<{
    division: ErnDivision;
  } | null>(null);
  const [ernDetails, setErnDetails] = React.useState<string | null>(null);
  const ernSlots = getErnSlots(bid);
  const ernAppUrl = SHAREPOINT_CONFIG.ern.appUrl;

  // Photo loading for Key People
  const [photoMap, setPhotoMap] = React.useState<Record<string, string>>({});
  const [membersMap, setMembersMap] = React.useState<
    Record<string, ITeamMember>
  >({});

  const allPeople: { email: string }[] = React.useMemo(() => {
    const list: { email: string }[] = [];
    if (bid.creator?.email) list.push(bid.creator);
    if (bid.commercialRequester?.email) list.push(bid.commercialRequester);
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

        const data = await MembersService.getAll();
        if (!cancelled) {
          const map: Record<string, ITeamMember> = {};
          (data.members || []).forEach((m) => {
            if (m.email) map[m.email.toLowerCase()] = m;
          });
          setMembersMap(map);
        }
      } catch {
        /* ignore */
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [allPeople, spfxContext]);

  const PersonChip: React.FC<{
    name: string;
    email: string;
    role?: string;
    photoUrl?: string;
  }> = ({ name, email, role, photoUrl }) => {
    const imgSrc = photoMap[email] || photoUrl;
    return (
      <span className={styles.kpPerson} title={`${name} (${email})`}>
        {imgSrc ? (
          <img src={imgSrc} alt="" className={styles.kpAvatar} />
        ) : (
          <span className={styles.kpAvatar}>
            {(name || "?").charAt(0).toUpperCase()}
          </span>
        )}
        <span className={styles.kpPersonText}>
          <span className={styles.kpPersonName}>{name}</span>
          {role && <span className={styles.kpPersonRole}>{role}</span>}
        </span>
      </span>
    );
  };

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

  // Currency & Exchange Rates edit
  const [editingCurrency, setEditingCurrency] = React.useState(false);
  const [fetchingRates, setFetchingRates] = React.useState(false);
  const addToast = useUIStore((s) => s.addToast);

  // Engineer BID Overview
  const [editingOverview, setEditingOverview] = React.useState(false);
  const [overviewDraft, setOverviewDraft] = React.useState(
    bid.engineerBidOverview || "",
  );

  // Edit lock hooks for concurrent edit control
  const generalLock = useEditControl(bid.bidNumber, "overview-general");
  const opsLock = useEditControl(bid.bidNumber, "overview-ops");
  const currencyLock = useEditControl(bid.bidNumber, "overview-currency");
  const engineerLock = useEditControl(bid.bidNumber, "overview-engineer");

  const logAndSave = (patch: Partial<IBid>, description: string): void => {
    if (!onSave) return;
    const logEntry = createActivityLogEntry(
      "FIELD_UPDATED",
      description,
      currentUser?.email || "",
      currentUser?.displayName || "",
    );
    onSave({
      ...patch,
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

  const changeDueDate = (newDueDate: string, reason: string): void => {
    if (!onSave) return;
    onSave(
      buildDueDateChangePatch(bid, newDueDate, reason, {
        name: currentUser?.displayName || currentUser?.email || "",
        email: currentUser?.email || "",
      }),
    );
    setDueDateModalOpen(false);
    addToast({
      type: "success",
      title: "Due date updated",
      message: `${bid.bidNumber} is now due ${formatDate(newDueDate)}.`,
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
    generalLock.stopEditing();
  };

  const saveOps = (): void => {
    const changes: string[] = [];
    const prev = bid.opportunityInfo;
    if (opsDraft.projectName !== prev?.projectName)
      changes.push(`Project Name → "${opsDraft.projectName}"`);
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
        {
          opportunityInfo: {
            ...prev,
            projectName: opsDraft.projectName,
            client: opsDraft.client,
            clientContact: opsDraft.clientContact,
            region: opsDraft.region,
            vessel: opsDraft.vessel,
            field: opsDraft.field,
            waterDepth: opsDraft.waterDepth,
            operationStartDate: opsDraft.operationStartDate,
            totalDuration: opsDraft.totalDuration,
          },
        },
        `Operational Summary updated: ${changes.join("; ")}`,
      );
    }
    setEditingOps(false);
    opsLock.stopEditing();
  };

  const saveCurrency = async (): Promise<void> => {
    setFetchingRates(true);
    try {
      const currencies = (config?.currencySettings?.exchangeRates || []).map(
        (er) => er.currency,
      );
      // BRL is always needed for the Cost Summary BRL column
      if (currencies.indexOf("BRL") < 0) currencies.push("BRL");
      const rates = await CurrencyService.getRatesWithFallback(currencies);
      if (rates.length === 0) {
        addToast({
          type: "error",
          title: "Could not fetch exchange rates from Banco Central",
          message: "The rates registered on this BID were kept unchanged.",
        });
        return;
      }
      const now = new Date().toISOString();
      const newSnapshot: IExchangeRateSnapshot[] = rates.map((r) => ({
        currency: r.currency,
        rate: r.rate,
        capturedDate: now,
        rateDate: r.timestamp || "",
        source: "BCB PTAX" as const,
      }));
      const kept = (bid.opportunityInfo?.exchangeRatesSnapshot || []).filter(
        (old) => !newSnapshot.some((n) => n.currency === old.currency),
      );
      if (kept.length > 0) {
        addToast({
          type: "warning",
          title: `BCB returned no rate for ${kept.map((k) => k.currency).join(", ")}`,
          message: "The previously registered rate was kept.",
        });
      }
      // Also update the BRL rate as ptax for backward compat
      const brlRate = rates.find((r) => r.currency === "BRL");
      logAndSave(
        {
          opportunityInfo: {
            ...bid.opportunityInfo,
            ptax: brlRate ? brlRate.rate : bid.opportunityInfo?.ptax || 0,
            ptaxDate: now.split("T")[0],
            exchangeRatesSnapshot: [...newSnapshot, ...kept],
          },
        },
        `Exchange rates updated from BCB PTAX (${rates.map((r) => `${r.currency} ${r.rate}`).join(", ")})`,
      );
    } catch (err) {
      console.error("Failed to fetch BCB rates:", err);
      addToast({
        type: "error",
        title: "Could not fetch exchange rates from Banco Central",
        message: "The rates registered on this BID were kept unchanged.",
      });
    } finally {
      setFetchingRates(false);
      setEditingCurrency(false);
      currencyLock.stopEditing();
    }
  };

  const saveOverview = (): void => {
    if (overviewDraft !== (bid.engineerBidOverview || "")) {
      logAndSave(
        { engineerBidOverview: overviewDraft },
        "Engineer BID Overview updated",
      );
    }
    setEditingOverview(false);
    engineerLock.stopEditing();
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
    color: "var(--primary-accent-contrast)",
    border: "none",
  };
  const cancelBtnStyle: React.CSSProperties = { ...editBtnStyle };
  const ernLinkBtnStyle: React.CSSProperties = {
    ...editBtnStyle,
    padding: "2px 8px",
    fontSize: 11,
  };
  const ernCreateBtnStyle: React.CSSProperties = {
    ...saveBtnStyle,
    padding: "2px 8px",
    fontSize: 11,
  };

  const slColor = (config?.serviceLines || []).find(
    (sl) => sl.value === bid.serviceLine,
  )?.color;

  return (
    <div className={styles.overviewGrid}>
      <div className={styles.flexColumn}>
        {/* General Information */}
        <div className={styles.infoSection}>
          {generalLock.errorMessage && (
            <EditLockBanner
              message={generalLock.errorMessage}
              onDismiss={generalLock.dismissError}
            />
          )}
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
                disabled={generalLock.loading}
                onClick={async () => {
                  const ok = await generalLock.startEditing();
                  if (ok) {
                    setGenDraft({
                      crmNumber: bid.crmNumber,
                      division: bid.division,
                      serviceLine: bid.serviceLine,
                      bidType: bid.bidType,
                      bidSize: bid.bidSize,
                    });
                    setEditingGeneral(true);
                  }
                }}
              >
                {generalLock.loading ? "Checking..." : "Edit"}
              </button>
            )}
            {editingGeneral && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveGeneral}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => {
                    setEditingGeneral(false);
                    generalLock.stopEditing();
                  }}
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
                      <option value="">- Select -</option>
                      {withCurrentOption(
                        (config?.divisions || []).filter(
                          (d) => d.isActive !== false,
                        ),
                        genDraft.division,
                      )
                        .map((d) => (
                          <option key={d.value} value={d.value}>
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
                      onChange={(e) => {
                        const serviceLine = e.target.value;
                        setGenDraft((d) => ({
                          ...d,
                          serviceLine,
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
                      <option value="">- Select -</option>
                      {withCurrentOption(
                        (config?.serviceLines || []).filter(
                          (sl) =>
                            sl.isActive !== false &&
                            (!genDraft.division ||
                              sl.category === genDraft.division),
                        ),
                        genDraft.serviceLine,
                      )
                        .map((sl) => (
                          <option key={sl.value} value={sl.value}>
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
                      onChange={(e) => {
                        const bidType = e.target.value as BidType;
                        setGenDraft((d) => ({
                          ...d,
                          bidType,
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
                      <option value="">- Select -</option>
                      {withCurrentOption(
                        (config?.bidTypes || []).filter(
                          (bt) => bt.isActive !== false,
                        ),
                        genDraft.bidType,
                      )
                        .map((bt) => (
                          <option key={bt.value} value={bt.value}>
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
                <>
                  <StatusBadge
                    status={bid.priority}
                    color={
                      PRIORITY_COLORS[bid.priority] || PRIORITY_COLORS.Normal
                    }
                  />
                  {bid.priority === "Urgent" && bid.urgencyReason && (
                    <div
                      className={styles.urgencyReason}
                      title="Urgency reason"
                    >
                      {bid.urgencyReason}
                    </div>
                  )}
                </>
              }
            />
            <InfoRow
              label="Status"
              value={<StatusBadge status={bid.currentStatus} />}
            />
            {ernSlots.map((slot) => {
              const link = getErnLinkForSlot(bid, slot.division);
              const slotLabel = slot.label
                ? `ERN (${slot.label})`
                : "ERN Number";
              const slotDeadline = link
                ? getErnDeadlineState(
                    link.ernDueDate,
                    link.ernStatus,
                    link.ernFinishDate,
                  )
                : "none";
              return (
                <InfoRow
                  key={slot.label || "single"}
                  label={slotLabel}
                  value={
                    link ? (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <span className={styles.monoValue}>
                          {link.ernNumber}
                        </span>
                        <button
                          type="button"
                          style={ernLinkBtnStyle}
                          onClick={() => setErnDetails(link.ernNumber)}
                        >
                          View details
                        </button>
                        {canEditErn && (
                          <button
                            type="button"
                            style={ernLinkBtnStyle}
                            onClick={() =>
                              setErnSearch({ division: slot.division })
                            }
                          >
                            Change
                          </button>
                        )}
                        {slotDeadline === "overdue" && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--danger)",
                            }}
                          >
                            ERN OVERDUE
                          </span>
                        )}
                        {slotDeadline === "due-soon" && (
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 700,
                              color: "var(--warning)",
                            }}
                          >
                            ERN due soon
                          </span>
                        )}
                        {(slotDeadline === "overdue" ||
                          slotDeadline === "due-soon") && (
                          <a
                            href={ernAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "var(--primary-accent)",
                            }}
                          >
                            Open ERN app ↗
                          </a>
                        )}
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          flexWrap: "wrap",
                        }}
                      >
                        <StatusBadge status="TBD" color="var(--warning)" />
                        {canEditErn && (
                          <>
                            <button
                              type="button"
                              style={ernCreateBtnStyle}
                              onClick={() =>
                                setErnCreate({ division: slot.division })
                              }
                            >
                              Create ERN
                            </button>
                            <button
                              type="button"
                              style={ernLinkBtnStyle}
                              onClick={() =>
                                setErnSearch({ division: slot.division })
                              }
                            >
                              Select existing
                            </button>
                          </>
                        )}
                      </span>
                    )
                  }
                />
              );
            })}
          </div>
        </div>

        {ernCreate && (
          <ErnCreateModal
            bid={bid}
            isOpen={!!ernCreate}
            division={ernCreate.division}
            onDismiss={() => setErnCreate(null)}
            onCreated={() => setErnCreate(null)}
          />
        )}
        {ernSearch && (
          <ErnSearchModal
            bid={bid}
            isOpen={!!ernSearch}
            division={ernSearch.division}
            excludeTitles={getLinkedErnTitles(bid)}
            onDismiss={() => setErnSearch(null)}
            onSelected={() => setErnSearch(null)}
          />
        )}
        {ernDetails && (
          <ErnDetailsModal
            ernNumber={ernDetails}
            isOpen={!!ernDetails}
            onDismiss={() => setErnDetails(null)}
          />
        )}

        {/* Operational Summary */}
        <div className={styles.infoSection}>
          {opsLock.errorMessage && (
            <EditLockBanner
              message={opsLock.errorMessage}
              onDismiss={opsLock.dismissError}
            />
          )}
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
                disabled={opsLock.loading}
                onClick={async () => {
                  const ok = await opsLock.startEditing();
                  if (ok) {
                    setOpsDraft({ ...bid.opportunityInfo });
                    setEditingOps(true);
                  }
                }}
              >
                {opsLock.loading ? "Checking..." : "Edit"}
              </button>
            )}
            {editingOps && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveOps}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => {
                    setEditingOps(false);
                    opsLock.stopEditing();
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
          {editingOps ? (
            <div className={styles.infoGrid}>
              <InfoRow
                label="Project Name"
                value={
                  <EditInput
                    value={opsDraft.projectName || ""}
                    onChange={(v) =>
                      setOpsDraft((d) => ({ ...d, projectName: v }))
                    }
                  />
                }
              />
              <InfoRow
                label="Client"
                value={
                  <select
                    value={opsDraft.client || ""}
                    onChange={(e) => {
                      const client = e.target.value;
                      setOpsDraft((d) => ({ ...d, client }));
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
                    <option value="">- Select -</option>
                    {withCurrentOption(
                      (config?.clientList || []).filter(
                        (c) => c.isActive !== false,
                      ),
                      opsDraft.client,
                    )
                      .map((c) => (
                        <option key={c.value} value={c.value}>
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
                    onChange={(e) => {
                      const region = e.target.value;
                      setOpsDraft((d) => ({ ...d, region }));
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
                    <option value="">- Select -</option>
                    {withCurrentOption(
                      (config?.regions || []).filter(
                        (r) => r.isActive !== false,
                      ),
                      opsDraft.region,
                    )
                      .map((r) => (
                        <option key={r.value} value={r.value}>
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
                label={`Water Depth (${opsDraft.waterDepthUnit || "m"})`}
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
                    value={(opsDraft.operationStartDate || "").split("T")[0]}
                    onChange={(v) =>
                      setOpsDraft((d) => ({ ...d, operationStartDate: v }))
                    }
                  />
                }
              />
              <InfoRow
                label={`Duration (${opsDraft.totalDurationUnit || "days"})`}
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
              <InfoRow
                label="Project Name"
                value={bid.opportunityInfo?.projectName}
              />
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
                    : "-"
                }
              />
              <InfoRow
                label="Operation Start"
                value={
                  bid.opportunityInfo?.operationStartDate
                    ? formatDate(bid.opportunityInfo.operationStartDate)
                    : "-"
                }
              />
              <InfoRow
                label="Duration"
                value={
                  bid.opportunityInfo?.totalDuration
                    ? `${bid.opportunityInfo.totalDuration} ${bid.opportunityInfo.totalDurationUnit || "days"}`
                    : "-"
                }
              />
            </div>
          )}
        </div>

        {/* BID Analysis Notes / Premisses */}
        <AnalysisNotesCard
          bid={bid}
          canEdit={canEdit}
          onSave={onSave}
          currentUser={currentUser}
        />

        {/* Project Description (Commercial Input) */}
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>
            Project Description (Commercial Input)
          </h4>
          <p
            className={styles.scopeDescription}
            style={{ whiteSpace: "pre-wrap" }}
          >
            {bid.opportunityInfo?.projectDescription ||
              "No description provided."}
          </p>
        </div>

        {/* Request Notes (Commercial Input) */}
        {(bid.bidNotes as Record<string, string>)?.general && (
          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle}>
              Request Notes (Commercial Input)
            </h4>
            <p
              className={styles.scopeDescription}
              style={{ whiteSpace: "pre-wrap" }}
            >
              {(bid.bidNotes as Record<string, string>).general}
            </p>
          </div>
        )}

        {/* Engineer BID Overview */}
        <div className={styles.infoSection}>
          {engineerLock.errorMessage && (
            <EditLockBanner
              message={engineerLock.errorMessage}
              onDismiss={engineerLock.dismissError}
            />
          )}
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
                disabled={engineerLock.loading}
                onClick={async () => {
                  const ok = await engineerLock.startEditing();
                  if (ok) {
                    setOverviewDraft(bid.engineerBidOverview || "");
                    setEditingOverview(true);
                  }
                }}
              >
                {engineerLock.loading ? "Checking..." : "Edit"}
              </button>
            )}
            {editingOverview && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveOverview}>
                  Save
                </button>
                <button
                  style={cancelBtnStyle}
                  onClick={() => {
                    setEditingOverview(false);
                    engineerLock.stopEditing();
                  }}
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

        {/* People */}
        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>Key People</h4>
          {(() => {
            type Person = {
              name: string;
              email: string;
              role?: string;
              photoUrl?: string;
            };
            const renderPeople = (people: Person[]): React.ReactNode =>
              people.length > 0 ? (
                <div className={styles.kpPeople}>
                  {people.map((p) => (
                    <PersonChip
                      key={p.email}
                      name={p.name}
                      email={p.email}
                      role={p.role}
                      photoUrl={p.photoUrl}
                    />
                  ))}
                </div>
              ) : (
                <span className={styles.kpEmpty}>-</span>
              );
            const renderRole = (
              label: string,
              people: Person[],
            ): React.ReactNode => (
              <div className={styles.kpRole}>
                <div className={styles.kpRoleLabel}>{label}</div>
                {renderPeople(people)}
              </div>
            );
            const pmByLine: Record<BusinessLine, Person[]> = {
              ROV: [],
              SURVEY: [],
              OPG: [],
            };
            const pmUnassigned: Person[] = [];
            (bid.projectManager || []).forEach((pm) => {
              const lines =
                membersMap[(pm.email || "").toLowerCase()]?.businessLines ||
                [];
              const matched = PM_BUSINESS_LINES.filter(
                (bl) => lines.indexOf(bl) >= 0,
              );
              if (matched.length === 0) pmUnassigned.push(pm);
              matched.forEach((bl) => pmByLine[bl].push(pm));
            });
            return (
              <div className={styles.kpLayout}>
                <div className={styles.kpPanel}>
                  <div className={styles.kpPanelTitle}>
                    <FileText size={14} /> Request
                  </div>
                  <div className={styles.kpPanelBody}>
                    {renderRole("Creator", bid.creator ? [bid.creator] : [])}
                    {renderRole(
                      "Commercial Requester",
                      bid.commercialRequester ? [bid.commercialRequester] : [],
                    )}
                  </div>
                </div>
                <div className={styles.kpPanel}>
                  <div className={styles.kpPanelTitle}>
                    <Wrench size={14} /> Engineering
                  </div>
                  <div className={styles.kpPanelBody}>
                    {renderRole(
                      "Engineer Responsible",
                      bid.engineerResponsible || [],
                    )}
                    {renderRole("Analyst", bid.analyst || [])}
                  </div>
                </div>
                <div className={`${styles.kpPanel} ${styles.kpPanelWide}`}>
                  <div className={styles.kpPanelTitle}>
                    <Briefcase size={14} /> Project Manager
                  </div>
                  <div className={styles.kpDivisionGrid}>
                    {PM_BUSINESS_LINES.filter(
                      (bl) => pmByLine[bl].length > 0,
                    ).map((bl) => (
                      <React.Fragment key={bl}>
                        {renderRole(bl, pmByLine[bl])}
                      </React.Fragment>
                    ))}
                    {pmUnassigned.length > 0 &&
                      renderRole("No business line", pmUnassigned)}
                    {(bid.projectManager || []).length === 0 &&
                      renderPeople([])}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Right Column — Phase Progress + KPIs */}
      <div className={styles.flexColumn}>
        <div className={styles.progressSection}>
          <h4 className={styles.infoTitle}>
            Phase Progress - {getPhaseLabelForBid(bid)}
            {(bid.revisions || []).length > 0 && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#F97316",
                }}
              >
                (Rev. {getCurrentRevisionLetter(bid)})
              </span>
            )}
          </h4>
          {configPhases
            .filter((phase) => {
              // Rework is optional: only show if the BID has used it
              if (phase.value === "Rework") {
                const hasReworkHistory = (bid.phaseHistory || []).some(
                  (ph) => ph.phase === ("Rework" as BidPhase),
                );
                return (
                  hasReworkHistory ||
                  bid.currentPhase === ("Rework" as BidPhase)
                );
              }
              return true;
            })
            .map((phase, idx) => {
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
                    <div className={styles.phaseLabel}>
                      {phase.label}
                      {phase.value === "Technical Proposal" &&
                        tpState !== "not-requested" && (
                          <TechnicalProposalChip
                            state={tpState}
                            showRequested
                            className={styles.tpChipInline}
                          />
                        )}
                    </div>
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

        {/* Approval Status Card — shown once BID reaches Close Out + Pending Approval or has approvals */}
        {(bid.approvalStatus !== "not-started" ||
          (bid.currentPhase === "Close Out" &&
            bid.currentStatus === "Pending Approval")) && (
          <ApprovalStatusCard bid={bid} />
        )}

        <div className={styles.infoSection}>
          <h4 className={styles.infoTitle}>BID KPIs</h4>
          <div className={styles.flexColumnSmall}>
            <InfoRow
              label="Days Elapsed"
              value={(() => {
                const refDate = bid.startDate || bid.createdDate;
                if (!refDate) return "0 days";
                if (isClosed && bid.completedDate) {
                  const ms =
                    new Date(bid.completedDate).getTime() -
                    new Date(refDate).getTime();
                  return `${Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))} days`;
                }
                return `${calcElapsedDays(refDate)} days`;
              })()}
            />
            <InfoRow
              label="Days in Phase"
              value={(() => {
                const ph = bid.phaseHistory || [];
                if (ph.length === 0) {
                  return `${calcElapsedDays(bid.createdDate)} days`;
                }
                const lastEntry = ph[ph.length - 1];
                if (!lastEntry.end) {
                  if (isClosed && bid.completedDate) {
                    const ms =
                      new Date(bid.completedDate).getTime() -
                      new Date(lastEntry.start).getTime();
                    return `${Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))} days`;
                  }
                  return `${calcElapsedDays(lastEntry.start)} days`;
                }
                return "0 days";
              })()}
            />
            <InfoRow
              label="Completion"
              value={(() => {
                // Phases go from 0 to 5, active phases are 1-5 (20% each)
                const phaseNum = currentPhaseIndex >= 0 ? currentPhaseIndex : 0;
                const pct = Math.round((phaseNum / 5) * 100);
                return `${Math.min(100, pct)}%`;
              })()}
            />
            <InfoRow
              label="Overdue"
              value={(() => {
                const days = getDaysUntil(bid.dueDate, getDueFreezeDate(bid));
                return days !== null && days < 0 ? `Yes (${-days} days)` : "No";
              })()}
            />
            <InfoRow
              label="Rework Required"
              value={
                (bid.revisions || []).length > 0
                  ? `Yes (${(bid.revisions || []).length} revision${(bid.revisions || []).length > 1 ? "s" : ""})`
                  : "No"
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
            <InfoRow
              label="Due Date"
              value={
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 4 }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <span>{formatDate(bid.dueDate)}</span>
                    {canEditDueDate && (
                      <button
                        style={editBtnStyle}
                        title="Change the BID due date (reason required)"
                        onClick={() => setDueDateModalOpen(true)}
                      >
                        Change
                      </button>
                    )}
                  </div>
                  {lastDueDateChange && (
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 400,
                        color: "var(--text-muted)",
                      }}
                      title={lastDueDateChange.description}
                    >
                      Changed by {lastDueDateChange.actorName} on{" "}
                      {formatDateTime(lastDueDateChange.timestamp)} - &ldquo;
                      {String(lastDueDateChange.metadata?.reason || "")}
                      &rdquo;
                    </span>
                  )}
                </div>
              }
            />
            <DueDateChangeModal
              bid={bid}
              isOpen={dueDateModalOpen}
              onDismiss={() => setDueDateModalOpen(false)}
              onConfirm={changeDueDate}
            />
            <InfoRow
              label="Completed"
              value={bid.completedDate ? formatDate(bid.completedDate) : "-"}
            />
            {/* Revision completion dates */}
            {(bid.revisions || [])
              .filter((r) => r.closedDate)
              .map((r) => (
                <InfoRow
                  key={r.revisionLetter}
                  label={`Revision ${r.revisionLetter} Completed`}
                  value={formatDate(r.closedDate!)}
                />
              ))}
            <InfoRow
              label="Last Modified"
              value={formatDateTime(bid.lastModified)}
            />
          </div>
        </div>

        {/* Exchange Rates */}
        <ExchangeRatesCard
          bid={bid}
          config={config}
          canEdit={canEdit}
          isClosed={isClosed}
          currencyLock={currencyLock}
          editingCurrency={editingCurrency}
          setEditingCurrency={setEditingCurrency}
          fetchingRates={fetchingRates}
          saveCurrency={saveCurrency}
          editBtnStyle={editBtnStyle}
          saveBtnStyle={saveBtnStyle}
          cancelBtnStyle={cancelBtnStyle}
        />

        {/* BID CAPEX x OPEX (Vertical) */}
        <CapexOpexVerticalChart bid={bid} />

        {/* Current Revision Info */}
        {hasActiveRevision(bid) && (
          <div className={styles.infoSection}>
            <h4 className={styles.infoTitle} style={{ color: "#F97316" }}>
              🔄 Active Revision
            </h4>
            <div className={styles.flexColumnSmall}>
              <InfoRow
                label="Revision"
                value={
                  <span style={{ fontWeight: 700, color: "#F97316" }}>
                    {getCurrentRevisionLetter(bid)}
                  </span>
                }
              />
              <InfoRow
                label="Opened By"
                value={
                  (bid.revisions || []).find((r) => r.status === "open")
                    ?.openedBy?.name || "-"
                }
              />
              <InfoRow
                label="Opened Date"
                value={formatDateTime(
                  (bid.revisions || []).find((r) => r.status === "open")
                    ?.openedDate || "",
                )}
              />
              <InfoRow
                label="Reason"
                value={
                  (bid.revisions || []).find((r) => r.status === "open")
                    ?.reason || "-"
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Exchange Rates Card (Right Column) ─── */
const ExchangeRatesCard: React.FC<{
  bid: IBid;
  config: any;
  canEdit?: boolean;
  isClosed: boolean;
  currencyLock: any;
  editingCurrency: boolean;
  setEditingCurrency: (v: boolean) => void;
  fetchingRates: boolean;
  saveCurrency: () => void;
  editBtnStyle: React.CSSProperties;
  saveBtnStyle: React.CSSProperties;
  cancelBtnStyle: React.CSSProperties;
}> = ({
  bid,
  config,
  canEdit,
  isClosed,
  currencyLock,
  editingCurrency,
  setEditingCurrency,
  fetchingRates,
  saveCurrency,
  editBtnStyle,
  saveBtnStyle,
  cancelBtnStyle,
}) => (
  <div className={styles.infoSection}>
    {currencyLock.errorMessage && (
      <EditLockBanner
        message={currencyLock.errorMessage}
        onDismiss={currencyLock.dismissError}
      />
    )}
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
        Exchange Rates
      </h4>
      {canEdit && !isClosed && !editingCurrency && (
        <button
          style={editBtnStyle}
          disabled={currencyLock.loading}
          onClick={async () => {
            const ok = await currencyLock.startEditing();
            if (ok) setEditingCurrency(true);
          }}
        >
          {currencyLock.loading ? "Checking..." : "Edit"}
        </button>
      )}
      {editingCurrency && (
        <div style={{ display: "flex", gap: 6 }}>
          <button
            style={saveBtnStyle}
            disabled={fetchingRates}
            onClick={saveCurrency}
          >
            {fetchingRates ? "Updating..." : "🔄 Update Rates (BCB)"}
          </button>
          <button
            style={cancelBtnStyle}
            onClick={() => {
              setEditingCurrency(false);
              currencyLock.stopEditing();
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
    <div style={{ marginTop: 8 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: "var(--text-secondary)",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
        }}
      >
        Rates saved in BID
        {editingCurrency && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 10,
              fontWeight: 400,
              color: "var(--primary-accent)",
              textTransform: "none",
            }}
          >
            Click &quot;Update Rates&quot; to fetch latest from Banco Central
          </span>
        )}
      </span>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginTop: 6,
        }}
      >
        {(() => {
          const snapshot = bid.opportunityInfo?.exchangeRatesSnapshot || [];
          const configRates = config?.currencySettings?.exchangeRates || [];
          const hasSnapshot = snapshot.length > 0;
          const ratesList = hasSnapshot ? snapshot : configRates;

          if (ratesList.length === 0) {
            return (
              <span
                style={{
                  fontSize: 12,
                  color: "var(--text-muted)",
                  fontStyle: "italic",
                }}
              >
                No exchange rates configured
              </span>
            );
          }

          const chips: React.ReactNode[] = [];
          ratesList.forEach((er: any) => {
            const isBRL = er.currency === "BRL";
            const chipStyle = {
              padding: "4px 10px",
              borderRadius: 6,
              background: "var(--card-bg-elevated, rgba(0,0,0,0.04))",
              border: "1px solid var(--border-subtle)",
              fontSize: 12,
              opacity: hasSnapshot ? 1 : 0.7,
            };

            if (isBRL) {
              chips.push(
                <div key="USD-BRL" style={chipStyle}>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    1 USD → BRL
                  </span>
                  <span
                    style={{
                      marginLeft: 6,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {er.rate.toFixed(4)}
                  </span>
                </div>,
              );
              chips.push(
                <div key="BRL-USD" style={chipStyle}>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    1 BRL → USD
                  </span>
                  <span
                    style={{
                      marginLeft: 6,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {er.rate > 0 ? (1 / er.rate).toFixed(4) : "-"}
                  </span>
                </div>,
              );
            } else {
              chips.push(
                <div key={er.currency} style={chipStyle}>
                  <span
                    style={{ fontWeight: 600, color: "var(--text-primary)" }}
                  >
                    1 {er.currency} → USD
                  </span>
                  <span
                    style={{
                      marginLeft: 6,
                      color: "var(--text-secondary)",
                      fontWeight: 600,
                    }}
                  >
                    {er.rate > 0 ? (1 / er.rate).toFixed(4) : "-"}
                  </span>
                </div>,
              );
            }
          });
          return chips;
        })()}
      </div>
      {bid.opportunityInfo?.exchangeRatesSnapshot &&
        bid.opportunityInfo.exchangeRatesSnapshot.length > 0 &&
        bid.opportunityInfo.exchangeRatesSnapshot[0]?.capturedDate && (
          <span
            style={{
              fontSize: 10,
              color: "var(--text-tertiary)",
              marginTop: 4,
              display: "block",
            }}
          >
            Last updated:{" "}
            {formatDate(
              bid.opportunityInfo.exchangeRatesSnapshot[0].capturedDate,
            )}
            {bid.opportunityInfo.exchangeRatesSnapshot[0].source &&
              ` · Source: ${bid.opportunityInfo.exchangeRatesSnapshot[0].source}`}
            {bid.opportunityInfo.exchangeRatesSnapshot[0].rateDate &&
              ` · Quote date: ${formatDate(bid.opportunityInfo.exchangeRatesSnapshot[0].rateDate)}`}
          </span>
        )}
    </div>
    {isClosed && (
      <p
        style={{
          fontSize: 11,
          color: "var(--text-tertiary)",
          marginTop: 4,
          fontStyle: "italic",
        }}
      >
        Currency locked - BID is closed.
      </p>
    )}
  </div>
);

/* ─── BID Analysis Notes / Premisses Card ─── */
const AnalysisNotesCard: React.FC<{
  bid: IBid;
  canEdit?: boolean;
  onSave?: (patch: Partial<IBid>) => void;
  currentUser?: { displayName: string; email: string };
}> = ({ bid, canEdit, onSave, currentUser }) => {
  const notes = (bid.bidNotes || {}) as Record<string, string>;
  const notesMetadata = (bid.bidNotesMetadata || {}) as Record<
    string,
    {
      author: string;
      date: string;
      lastEditedBy?: string;
      lastEditedDate?: string;
    }
  >;
  const entries = Object.entries(notes).filter(([k]) => k !== "general");
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [newKey, setNewKey] = React.useState("");
  const [showAddForm, setShowAddForm] = React.useState(false);

  const handleSave = (key: string, value: string): void => {
    if (!onSave) return;
    const now = new Date().toISOString();
    const userName =
      currentUser?.displayName || currentUser?.email || "Unknown";
    const existingMeta = notesMetadata[key];
    const updatedMeta = existingMeta
      ? { ...existingMeta, lastEditedBy: userName, lastEditedDate: now }
      : { author: userName, date: now };
    onSave({
      bidNotes: { ...notes, [key]: value },
      bidNotesMetadata: { ...notesMetadata, [key]: updatedMeta },
    });
    setEditingKey(null);
  };

  const handleAddNote = (): void => {
    if (!onSave || !newKey.trim()) return;
    const now = new Date().toISOString();
    const userName =
      currentUser?.displayName || currentUser?.email || "Unknown";
    const trimmedKey = newKey.trim();
    onSave({
      bidNotes: { ...notes, [trimmedKey]: editValue },
      bidNotesMetadata: {
        ...notesMetadata,
        [trimmedKey]: { author: userName, date: now },
      },
    });
    setNewKey("");
    setEditValue("");
    setShowAddForm(false);
  };

  const handleDelete = (key: string): void => {
    if (!onSave) return;
    const updated = { ...notes };
    delete updated[key];
    const updatedMeta = { ...notesMetadata };
    delete updatedMeta[key];
    onSave({ bidNotes: updated, bidNotesMetadata: updatedMeta });
  };

  return (
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
          BID Analysis Notes / Premisses
        </h4>
        {canEdit && !showAddForm && (
          <button
            style={{
              background: "var(--primary-accent)",
              color: "var(--primary-accent-contrast)",
              border: "none",
              borderRadius: 6,
              padding: "3px 10px",
              fontSize: 12,
              cursor: "pointer",
            }}
            onClick={() => setShowAddForm(true)}
          >
            + Add Note
          </button>
        )}
      </div>
      {entries.length === 0 && !showAddForm && (
        <EmptySection message="No analysis notes added yet." />
      )}
      <div
        className={styles.flexColumn}
        style={{ marginTop: entries.length > 0 ? 12 : 0 }}
      >
        {entries.map(([section, content]) => (
          <div
            key={section}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid var(--border-subtle)",
              background: "var(--card-bg-elevated, rgba(0,0,0,0.02))",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                {section}
              </strong>
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
              <div style={{ marginTop: 8 }}>
                <textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  style={{
                    width: "100%",
                    minHeight: 80,
                    padding: 10,
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    background: "var(--card-bg-elevated)",
                    color: "var(--text-primary)",
                    fontSize: 13,
                    resize: "vertical",
                  }}
                />
                <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                  <button
                    className={styles.backBtn}
                    style={{
                      background: "var(--primary-accent)",
                      color: "var(--primary-accent-contrast)",
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
              <>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {content}
                </p>
                {notesMetadata[section] && (
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      marginTop: 6,
                    }}
                  >
                    Created by <strong>{notesMetadata[section].author}</strong>{" "}
                    · {formatDateTime(notesMetadata[section].date)}
                    {notesMetadata[section].lastEditedBy && (
                      <>
                        {" "}
                        | Last edited by{" "}
                        <strong>
                          {notesMetadata[section].lastEditedBy}
                        </strong> ·{" "}
                        {formatDateTime(
                          notesMetadata[section].lastEditedDate || "",
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
      {canEdit && showAddForm && (
        <div
          style={{
            marginTop: 12,
            padding: 12,
            borderRadius: 8,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <input
            placeholder="Section title (e.g., Gap Analysis, Technical Notes...)"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card-bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 14,
              marginBottom: 8,
            }}
          />
          <textarea
            placeholder="Note content..."
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            style={{
              width: "100%",
              minHeight: 80,
              padding: 10,
              borderRadius: 8,
              border: "1px solid var(--border)",
              background: "var(--card-bg-elevated)",
              color: "var(--text-primary)",
              fontSize: 13,
              resize: "vertical",
            }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <button
              className={styles.backBtn}
              style={{
                background: "var(--primary-accent)",
                color: "var(--primary-accent-contrast)",
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
    </div>
  );
};

/* ─── CAPEX x OPEX Vertical Chart Card ─── */
const CapexOpexVerticalChart: React.FC<{ bid: IBid }> = ({ bid }) => {
  const s = React.useMemo(() => buildCostSummary(bid), [bid]);
  const assetsByType = React.useMemo(
    () =>
      calculateAssetsByResourceType(
        bid.assetBreakdown || [],
        bid.scopeItems || [],
        getBidContingency(bid),
      ),
    [bid],
  );

  const colorTheme = useColorTheme();
  const TYPE_COLORS = [
    colorTheme.accents.a600,
    "#3b82f6",
    "#8b5cf6",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
  ];

  const allTypes = React.useMemo(() => {
    const set: string[] = [];
    assetsByType.forEach((rt) => {
      if (set.indexOf(rt.resourceType) === -1) set.push(rt.resourceType);
    });
    return set;
  }, [assetsByType]);

  const getTypeColor = (label: string): string => {
    const idx = allTypes.indexOf(label);
    return TYPE_COLORS[idx >= 0 ? idx % TYPE_COLORS.length : 0];
  };

  const nonAssetCostsBRL =
    s.engineeringHoursCostBRL +
    s.onshoreHoursCostBRL +
    s.offshoreHoursCostBRL +
    s.logisticsCostBRL +
    s.certificationsCostBRL +
    s.rtsCostBRL +
    s.mobilizationCostBRL +
    s.consumablesCostBRL;

  const capexBRL = s.assetsCapexUSD * s.ptaxUsed + nonAssetCostsBRL;
  const opexBRL = s.assetsOpexUSD * s.ptaxUsed;
  const capexUSD = s.totalCostUSD - s.assetsOpexUSD;
  const opexUSD = s.assetsOpexUSD;
  const totalBRL = capexBRL + opexBRL;

  const capexSegments = React.useMemo(() => {
    const segs: { label: string; brl: number; color: string }[] = [];
    assetsByType.forEach((rt) => {
      if (rt.capexUSD > 0) {
        segs.push({
          label: rt.resourceType,
          brl: rt.capexUSD * s.ptaxUsed,
          color: getTypeColor(rt.resourceType),
        });
      }
    });
    if (nonAssetCostsBRL > 0) {
      segs.push({
        label: "Services & Others",
        brl: nonAssetCostsBRL,
        color: "#64748b",
      });
    }
    return segs;
  }, [assetsByType, s, nonAssetCostsBRL]);

  const opexSegments = React.useMemo(() => {
    const segs: { label: string; brl: number; color: string }[] = [];
    assetsByType.forEach((rt) => {
      if (rt.opexUSD > 0) {
        segs.push({
          label: rt.resourceType,
          brl: rt.opexUSD * s.ptaxUsed,
          color: getTypeColor(rt.resourceType),
        });
      }
    });
    return segs;
  }, [assetsByType, s]);

  const maxBarBRL = Math.max(capexBRL, opexBRL, 1);
  const barMaxHeight = 160;

  const renderVerticalBar = (
    segments: { label: string; brl: number; color: string }[],
    totalVal: number,
  ): React.ReactNode => {
    if (totalVal <= 0) return <div style={{ height: barMaxHeight }} />;
    const barH = (totalVal / maxBarBRL) * barMaxHeight;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          height: barMaxHeight,
        }}
      >
        <div
          style={{
            width: 60,
            height: barH,
            borderRadius: "6px 6px 0 0",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {segments.map((seg) => {
            const pct = totalVal > 0 ? (seg.brl / totalVal) * 100 : 0;
            if (pct < 0.5) return null;
            return (
              <div
                key={seg.label}
                style={{
                  flex: `${pct} 0 0%`,
                  background: seg.color,
                  minHeight: 3,
                }}
                title={`${seg.label}: ${formatCurrency(seg.brl, "BRL")} (${pct.toFixed(1)}%)`}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.infoSection}>
      <h4 className={styles.infoTitle}>BID CAPEX x OPEX</h4>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          gap: 32,
          padding: "16px 0",
        }}
      >
        {/* CAPEX bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {renderVerticalBar(capexSegments, capexBRL)}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                letterSpacing: 1,
              }}
            >
              CAPEX
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {formatCurrency(capexUSD)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {formatCurrency(capexBRL, "BRL")}
            </div>
          </div>
        </div>

        {/* OPEX bar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {renderVerticalBar(opexSegments, opexBRL)}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                color: "var(--text-secondary)",
                letterSpacing: 1,
              }}
            >
              OPEX
            </div>
            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "var(--text-primary)",
              }}
            >
              {formatCurrency(opexUSD)}
            </div>
            <div style={{ fontSize: 11, color: "var(--text-secondary)" }}>
              {formatCurrency(opexBRL, "BRL")}
            </div>
          </div>
        </div>
      </div>

      {/* Percentage split bar */}
      <div style={{ marginTop: 8 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            fontWeight: 600,
            color: "var(--text-secondary)",
            marginBottom: 6,
          }}
        >
          <span>
            CAPEX:{" "}
            {totalBRL > 0 ? ((capexBRL / totalBRL) * 100).toFixed(1) : "0"}%
          </span>
          <span>
            OPEX: {totalBRL > 0 ? ((opexBRL / totalBRL) * 100).toFixed(1) : "0"}
            %
          </span>
        </div>
        <div
          style={{
            display: "flex",
            height: 12,
            borderRadius: 6,
            overflow: "hidden",
            background: "var(--glass-bg, rgba(255,255,255,0.06))",
          }}
        >
          <div
            style={{
              width: `${totalBRL > 0 ? (capexBRL / totalBRL) * 100 : 50}%`,
              height: "100%",
              background:
                "linear-gradient(90deg, var(--accent-600), var(--accent-500))",
              transition: "width 0.3s ease",
            }}
          />
          <div
            style={{
              width: `${totalBRL > 0 ? (opexBRL / totalBRL) * 100 : 50}%`,
              height: "100%",
              background: "linear-gradient(90deg, #3b82f6, #60a5fa)",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Legend */}
      <div
        style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}
      >
        {[...capexSegments, ...opexSegments]
          .filter(
            (seg, idx, arr) =>
              arr.findIndex((s2) => s2.label === seg.label) === idx,
          )
          .map((seg) => (
            <span
              key={seg.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11,
                color: "var(--text-secondary)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: seg.color,
                  flexShrink: 0,
                }}
              />
              {seg.label}
            </span>
          ))}
      </div>
    </div>
  );
};
