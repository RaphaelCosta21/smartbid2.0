import * as React from "react";
import {
  IBid,
  ITeamMember,
  Division,
  BidType,
  BidSize,
  BidPhase,
} from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import { EditLockBanner } from "../common/EditLockBanner";
import { useConfigStore } from "../../stores/useConfigStore";
import { useConfigPhases } from "../../hooks/useConfigPhases";
import { useEditControl } from "../../hooks/useEditControl";
import { useSpfxContext } from "../../config/SpfxContext";
import { MembersService } from "../../services/MembersService";
import { CurrencyService } from "../../services/CurrencyService";
import { isTerminalStatus } from "../../utils/statusHelpers";
import { PRIORITY_COLORS } from "../../utils/constants";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import {
  formatDate,
  formatDateTime,
  formatCurrency,
} from "../../utils/formatters";
import {
  buildCostSummary,
  calculateAssetsByResourceType,
} from "../../utils/costCalculations";
import { EmptySection } from "./EmptySection";
import { getPhaseLabelForBid } from "../../utils/phaseHelpers";
import { calcElapsedDays } from "../../utils/durationHelpers";
import { getCurrentRevisionLetter, hasActiveRevision } from "./RevisionsTab";
import styles from "../../pages/BidDetailPage.module.scss";

/* ─── Helpers ─── */

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value || "—"}</div>
  </div>
);

/* ─── Approval Status Card (Overview sidebar) ─── */

const APPROVAL_STATUS_DISPLAY: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  approved: { icon: "✅", color: "#10B981", label: "Approved" },
  rejected: { icon: "❌", color: "#EF4444", label: "Rejected" },
  pending: { icon: "⏳", color: "#F59E0B", label: "In Progress" },
  "not-started": { icon: "⚪", color: "#94A3B8", label: "Not Started" },
  "revision-requested": {
    icon: "🔄",
    color: "#F97316",
    label: "Revision Requested",
  },
};

const ApprovalStatusCard: React.FC<{ bid: IBid }> = ({ bid }) => {
  const approvals = bid.approvals || [];
  const status = bid.approvalStatus || "not-started";
  const display =
    APPROVAL_STATUS_DISPLAY[status] || APPROVAL_STATUS_DISPLAY["not-started"];
  const totalCount = approvals.length;
  const approvedCount = approvals.filter((a) => a.status === "approved").length;
  const rejectedCount = approvals.filter((a) => a.status === "rejected").length;
  const pendingCount = approvals.filter((a) => a.status === "pending").length;
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
        <div style={{ fontSize: 13, color: "var(--text-secondary)" }}>
          Approval not started yet. Go to the Approval tab to select approvers
          and start the flow.
        </div>
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
                background: `${display.color}18`,
                color: display.color,
                border: `1px solid ${display.color}40`,
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
              const sectorIcon = sectorDone
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
                      const aStatus =
                        APPROVAL_STATUS_DISPLAY[a.status] ||
                        APPROVAL_STATUS_DISPLAY["pending"];
                      return (
                        <div
                          key={a.id}
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
                          <span style={{ fontSize: 11 }}>{aStatus.icon}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary stats */}
          {(rejectedCount > 0 || pendingCount > 0) && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 4,
                fontSize: 11,
                color: "var(--text-secondary)",
              }}
            >
              {pendingCount > 0 && <span>⏳ {pendingCount} pending</span>}
              {rejectedCount > 0 && (
                <span style={{ color: "#EF4444" }}>
                  ❌ {rejectedCount} rejected
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
    photoUrl?: string;
  }> = ({ name, email, role, photoUrl }) => {
    const imgSrc = photoMap[email] || photoUrl;
    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          marginRight: 12,
          marginBottom: 6,
        }}
      >
        {imgSrc ? (
          <img
            src={imgSrc}
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
    opsLock.stopEditing();
  };

  const saveCurrency = async (): Promise<void> => {
    setFetchingRates(true);
    try {
      const currencies = (config?.currencySettings?.exchangeRates || []).map(
        (er) => er.currency,
      );
      const rates = await CurrencyService.getRatesWithFallback(currencies);
      if (rates.length === 0) {
        setFetchingRates(false);
        return;
      }
      const now = new Date().toISOString();
      const newSnapshot = rates.map((r) => ({
        currency: r.currency,
        rate: r.rate,
        capturedDate: now,
      }));
      // Also update the BRL rate as ptax for backward compat
      const brlRate = rates.find((r) => r.currency === "BRL");
      logAndSave(
        {
          opportunityInfo: {
            ...bid.opportunityInfo,
            ptax: brlRate ? brlRate.rate : bid.opportunityInfo?.ptax || 0,
            ptaxDate: now.split("T")[0],
            exchangeRatesSnapshot: newSnapshot,
          },
        },
        `Exchange rates updated from BCB PTAX (${rates.map((r) => r.currency).join(", ")})`,
      );
    } catch (err) {
      console.error("Failed to fetch BCB rates:", err);
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
          {bid.serviceLine === "Integrated" ? (
            (() => {
              const groupByDiv = (
                people: {
                  name: string;
                  email: string;
                  role?: string;
                  photoUrl?: string;
                }[],
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
              const renderGroup = (
                label: string,
                groups: {
                  rov: {
                    name: string;
                    email: string;
                    role?: string;
                    photoUrl?: string;
                  }[];
                  survey: (typeof groups)["rov"];
                  other: (typeof groups)["rov"];
                },
              ): React.ReactNode => (
                <div>
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
                          photoUrl={p.photoUrl}
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
                          photoUrl={p.photoUrl}
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
                          photoUrl={p.photoUrl}
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
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "16px 24px",
                  }}
                >
                  <div>
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
                        photoUrl={bid.creator.photoUrl}
                      />
                    ) : (
                      "—"
                    )}
                  </div>
                  <div>
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
                          photoUrl={pm.photoUrl}
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
                    photoUrl={bid.creator.photoUrl}
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
                    <PersonChip
                      key={e.email}
                      name={e.name}
                      email={e.email}
                      photoUrl={e.photoUrl}
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
                  Analyst
                </div>
                {(bid.analyst || []).length > 0 ? (
                  bid.analyst.map((a) => (
                    <PersonChip
                      key={a.email}
                      name={a.name}
                      email={a.email}
                      photoUrl={a.photoUrl}
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
                  Project Manager
                </div>
                {(bid.projectManager || []).length > 0 ? (
                  bid.projectManager.map((pm) => (
                    <PersonChip
                      key={pm.email}
                      name={pm.name}
                      email={pm.email}
                      photoUrl={pm.photoUrl}
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
            </div>
          )}
        </div>
      </div>

      {/* Right Column — Phase Progress + KPIs */}
      <div className={styles.flexColumn}>
        <div className={styles.progressSection}>
          <h4 className={styles.infoTitle}>
            Phase Progress — {getPhaseLabelForBid(bid)}
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
                if (!bid.dueDate) return "No";
                const now =
                  isClosed && bid.completedDate
                    ? new Date(bid.completedDate)
                    : new Date();
                const due = new Date(bid.dueDate);
                const diffMs = now.getTime() - due.getTime();
                if (diffMs > 0) {
                  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                  return `Yes (${days} days)`;
                }
                return "No";
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
            <InfoRow label="Due Date" value={formatDate(bid.dueDate)} />
            <InfoRow
              label="Completed"
              value={bid.completedDate ? formatDate(bid.completedDate) : "—"}
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
                    ?.openedBy?.name || "—"
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
                    ?.reason || "—"
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
                    {er.rate > 0 ? (1 / er.rate).toFixed(4) : "—"}
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
                    {er.rate > 0 ? (1 / er.rate).toFixed(4) : "—"}
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
        Currency locked — BID is closed.
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
              color: "#fff",
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
        (bid.assetsContingencyPerYear || 0) > 0
          ? { perYear: bid.assetsContingencyPerYear || 0, applied: true }
          : undefined,
      ),
    [bid],
  );

  const TYPE_COLORS = [
    "#0d9488",
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
              background: "linear-gradient(90deg, #0d9488, #14b8a6)",
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
