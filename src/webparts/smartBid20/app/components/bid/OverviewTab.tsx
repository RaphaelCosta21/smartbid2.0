import * as React from "react";
import {
  IBid,
  ITeamMember,
  Division,
  BidType,
  BidSize,
} from "../../models";
import { StatusBadge } from "../common/StatusBadge";
import {
  EditLockBanner,
} from "../common/EditLockBanner";
import { useConfigStore } from "../../stores/useConfigStore";
import { useConfigPhases } from "../../hooks/useConfigPhases";
import { useEditControl } from "../../hooks/useEditControl";
import { useSpfxContext } from "../../config/SpfxContext";
import { MembersService } from "../../services/MembersService";
import { isTerminalStatus } from "../../utils/statusHelpers";
import { PRIORITY_COLORS } from "../../utils/constants";
import { createActivityLogEntry } from "../../utils/activityLogHelpers";
import {
  formatDate,
  formatDateTime,
} from "../../utils/formatters";
import { getPhaseLabelForBid } from "../../utils/phaseHelpers";
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
    currencyLock.stopEditing();
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
              Currency & PTAX
            </h4>
            {canEdit && !isClosed && !editingCurrency && (
              <button
                style={editBtnStyle}
                disabled={currencyLock.loading}
                onClick={async () => {
                  const ok = await currencyLock.startEditing();
                  if (ok) {
                    setCurrDraft({
                      currency:
                        bid.opportunityInfo?.currency ||
                        config?.currencySettings?.defaultCurrency ||
                        "USD",
                      ptax: bid.opportunityInfo?.ptax || 0,
                      ptaxDate: bid.opportunityInfo?.ptaxDate || "",
                    });
                    setEditingCurrency(true);
                  }
                }}
              >
                {currencyLock.loading ? "Checking..." : "Edit"}
              </button>
            )}
            {editingCurrency && (
              <div style={{ display: "flex", gap: 6 }}>
                <button style={saveBtnStyle} onClick={saveCurrency}>
                  Save
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
