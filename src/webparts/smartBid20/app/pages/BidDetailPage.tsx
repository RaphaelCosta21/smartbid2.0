import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBidStore } from "../stores/useBidStore";
import { StatusBadge } from "../components/common/StatusBadge";
import { GlassCard } from "../components/common/GlassCard";
import { BID_PHASES } from "../config/status.config";
import { differenceInDays, format } from "date-fns";
import styles from "./BidDetailPage.module.scss";

type BidTab =
  | "overview"
  | "scope"
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

const TAB_LABELS: { key: BidTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "scope", label: "Scope of Supply" },
  { key: "hours", label: "Hours & Resources" },
  { key: "costs", label: "Cost Summary" },
  { key: "tasks", label: "Tasks & Phases" },
  { key: "timeline", label: "Timeline" },
  { key: "approval", label: "Approval" },
  { key: "documents", label: "Documents" },
  { key: "comments", label: "Comments" },
  { key: "notes", label: "BID Notes" },
  { key: "qualifications", label: "Qualifications" },
  { key: "ai", label: "AI Analysis" },
  { key: "activity", label: "Activity Log" },
  { key: "export", label: "Export" },
];

export const BidDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bids = useBidStore((s) => s.bids);
  const [activeTab, setActiveTab] = React.useState<BidTab>("overview");

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

  const now = new Date();
  const daysLeft = differenceInDays(new Date(bid.dueDate), now);
  const currentPhaseIndex = BID_PHASES.findIndex(
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
            <span>{bid.opportunityInfo.client}</span>
            <span className={styles.headerSep}>—</span>
            <span className={styles.projectName}>
              {bid.opportunityInfo.projectName}
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
              Due: {format(new Date(bid.dueDate), "MMM d, yyyy")}
              {daysLeft < 0 && (
                <span className={styles.overdueTag}>
                  {" "}
                  OVERDUE {Math.abs(daysLeft)}d
                </span>
              )}
              {daysLeft >= 0 && daysLeft <= 5 && (
                <span className={styles.warningTag}> {daysLeft}d left</span>
              )}
            </span>
          </div>
        </div>
        <div className={styles.bidHeaderActions}>
          <StatusBadge status={bid.division} />
          <StatusBadge status={bid.priority} />
        </div>
      </div>

      {/* Tab Bar */}
      <div className={styles.tabBar}>
        {TAB_LABELS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tab} ${activeTab === tab.key ? styles.active : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === "overview" && (
          <OverviewTab bid={bid} currentPhaseIndex={currentPhaseIndex} />
        )}
        {activeTab === "scope" && <ScopeTab bid={bid} />}
        {activeTab === "hours" && <HoursTab bid={bid} />}
        {activeTab === "costs" && <CostTab bid={bid} />}
        {activeTab === "tasks" && <TasksTab bid={bid} />}
        {activeTab === "timeline" && (
          <TimelineTab bid={bid} currentPhaseIndex={currentPhaseIndex} />
        )}
        {activeTab === "approval" && <ApprovalTab bid={bid} />}
        {activeTab === "documents" && <DocumentsTab bid={bid} />}
        {activeTab === "comments" && <CommentsTab bid={bid} />}
        {activeTab === "notes" && <NotesTab bid={bid} />}
        {activeTab === "qualifications" && <QualificationsTab bid={bid} />}
        {activeTab === "ai" && <AITab />}
        {activeTab === "activity" && <ActivityTab bid={bid} />}
        {activeTab === "export" && <ExportTab bid={bid} />}
      </div>
    </div>
  );
};

/* ─── Tab: Overview ─── */
import { IBid } from "../models";

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div className={styles.infoItem}>
    <div className={styles.infoLabel}>{label}</div>
    <div className={styles.infoValue}>{value || "—"}</div>
  </div>
);

const OverviewTab: React.FC<{ bid: IBid; currentPhaseIndex: number }> = ({
  bid,
  currentPhaseIndex,
}) => (
  <div className={styles.overviewGrid}>
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* General Information */}
      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>General Information</h4>
        <div className={styles.infoGrid}>
          <InfoRow
            label="BID Number"
            value={<span className={styles.monoValue}>{bid.bidNumber}</span>}
          />
          <InfoRow
            label="CRM Number"
            value={<span className={styles.monoValue}>{bid.crmNumber}</span>}
          />
          <InfoRow
            label="Division"
            value={<StatusBadge status={bid.division} />}
          />
          <InfoRow label="Service Line" value={bid.serviceLine} />
          <InfoRow label="Type" value={bid.bidType} />
          <InfoRow label="Size" value={bid.bidSize} />
          <InfoRow
            label="Priority"
            value={<StatusBadge status={bid.priority} />}
          />
          <InfoRow
            label="Status"
            value={<StatusBadge status={bid.currentStatus} />}
          />
        </div>
      </div>

      {/* Operational Summary */}
      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>Operational Summary</h4>
        <div className={styles.infoGrid}>
          <InfoRow label="Client" value={bid.opportunityInfo.client} />
          <InfoRow
            label="Client Contact"
            value={bid.opportunityInfo.clientContact}
          />
          <InfoRow label="Region" value={bid.opportunityInfo.region} />
          <InfoRow label="Vessel" value={bid.opportunityInfo.vessel} />
          <InfoRow label="Field" value={bid.opportunityInfo.field} />
          <InfoRow
            label="Water Depth"
            value={
              bid.opportunityInfo.waterDepth
                ? `${bid.opportunityInfo.waterDepth} ${bid.opportunityInfo.waterDepthUnit}`
                : "—"
            }
          />
          <InfoRow
            label="Operation Start"
            value={
              bid.opportunityInfo.operationStartDate
                ? format(
                    new Date(bid.opportunityInfo.operationStartDate),
                    "MMM d, yyyy",
                  )
                : "—"
            }
          />
          <InfoRow
            label="Duration"
            value={`${bid.opportunityInfo.totalDuration} ${bid.opportunityInfo.totalDurationUnit}`}
          />
        </div>
      </div>

      {/* Scope */}
      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>Scope of Work</h4>
        <p
          style={{
            fontSize: 13,
            color: "var(--text-secondary)",
            lineHeight: 1.6,
          }}
        >
          {bid.opportunityInfo.projectDescription || "No description provided."}
        </p>
      </div>

      {/* People */}
      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>Key People</h4>
        <div className={styles.infoGrid}>
          <InfoRow
            label="Owner"
            value={`${bid.owner.name} (${bid.owner.role})`}
          />
          <InfoRow
            label="Bidder"
            value={`${bid.bidder.name} (${bid.bidder.role})`}
          />
          <InfoRow
            label="Reviewers"
            value={
              bid.reviewers.length > 0
                ? bid.reviewers.map((r) => r.name).join(", ")
                : "None assigned"
            }
          />
        </div>
      </div>
    </div>

    {/* Right Column — Phase Progress + KPIs */}
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className={styles.progressSection}>
        <h4 className={styles.infoTitle}>Phase Progress</h4>
        {BID_PHASES.map((phase, idx) => {
          const isCompleted = idx < currentPhaseIndex;
          const isCurrent = idx === currentPhaseIndex;
          const stateClass = isCompleted
            ? styles.completed
            : isCurrent
              ? styles.current
              : styles.pending;

          return (
            <div key={phase.id} className={`${styles.phaseStep} ${stateClass}`}>
              <div className={`${styles.phaseCircle} ${stateClass}`}>
                {isCompleted ? "✓" : idx}
              </div>
              <div className={styles.phaseInfo}>
                <div className={styles.phaseLabel}>{phase.label}</div>
                <div className={styles.phaseStatus}>
                  {isCompleted
                    ? "Completed"
                    : isCurrent
                      ? "In Progress"
                      : "Pending"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>BID KPIs</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InfoRow
            label="Days Elapsed"
            value={`${bid.kpis.totalDaysElapsed} days`}
          />
          <InfoRow
            label="Days in Phase"
            value={`${bid.kpis.daysInCurrentPhase} days`}
          />
          <InfoRow
            label="Est. Remaining"
            value={`${bid.kpis.estimatedDaysRemaining} days`}
          />
          <InfoRow
            label="Completion"
            value={`${bid.kpis.phaseCompletionPercentage}%`}
          />
          <InfoRow
            label="Overdue"
            value={
              bid.kpis.isOverdue ? `Yes (${bid.kpis.overdueBy} days)` : "No"
            }
          />
        </div>
      </div>

      {/* Dates */}
      <div className={styles.infoSection}>
        <h4 className={styles.infoTitle}>Key Dates</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <InfoRow
            label="Created"
            value={format(new Date(bid.createdDate), "MMM d, yyyy HH:mm")}
          />
          <InfoRow
            label="Start Date"
            value={
              bid.startDate
                ? format(new Date(bid.startDate), "MMM d, yyyy")
                : "Not started"
            }
          />
          <InfoRow
            label="Due Date"
            value={format(new Date(bid.dueDate), "MMM d, yyyy")}
          />
          <InfoRow
            label="Completed"
            value={
              bid.completedDate
                ? format(new Date(bid.completedDate), "MMM d, yyyy")
                : "—"
            }
          />
          <InfoRow
            label="Last Modified"
            value={format(new Date(bid.lastModified), "MMM d, yyyy HH:mm")}
          />
        </div>
      </div>
    </div>
  </div>
);

/* ─── Tab: Scope of Supply ─── */
const ScopeTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Equipment / Assets">
    {bid.equipmentList.length === 0 ? (
      <EmptySection message="No equipment items added yet." />
    ) : (
      <div style={{ overflowX: "auto" }}>
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>#</th>
              <th>Requirement</th>
              <th>Part Number</th>
              <th>Description</th>
              <th>Qty Op.</th>
              <th>Qty Spare</th>
              <th>Acq. Type</th>
              <th>Unit Cost (USD)</th>
              <th>Total (USD)</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {bid.equipmentList.map((item) => (
              <tr key={item.id}>
                <td>{item.lineNumber}</td>
                <td>{item.requirementName}</td>
                <td className={styles.monoValue}>{item.partNumber}</td>
                <td>{item.toolDescription}</td>
                <td>{item.qtyOperational}</td>
                <td>{item.qtySpare}</td>
                <td>{item.acquisitionType}</td>
                <td>${item.unitCostUSD.toLocaleString()}</td>
                <td>${item.totalCostUSD.toLocaleString()}</td>
                <td>
                  <StatusBadge
                    status={item.costCategory}
                    color={
                      item.costCategory === "CAPEX" ? "#3b82f6" : "#f59e0b"
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: Hours & Resources ─── */
const HoursTab: React.FC<{ bid: IBid }> = ({ bid }) => {
  const [subTab, setSubTab] = React.useState<
    "engineering" | "onshore" | "offshore"
  >("engineering");
  const hs = bid.hoursSummary;

  const sections = {
    engineering: { label: "Engineering Hours", data: hs.engineeringHours },
    onshore: { label: "Onshore Hours", data: hs.onshoreHours },
    offshore: { label: "Offshore Hours", data: hs.offshoreHours },
  };

  const current = sections[subTab];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Summary Cards */}
      <div className={styles.costGrid}>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Engineering</div>
          <div className={styles.costValue}>
            {hs.engineeringHours.totalHours.toLocaleString()}h
          </div>
        </div>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Onshore</div>
          <div className={styles.costValue}>
            {hs.onshoreHours.totalHours.toLocaleString()}h
          </div>
        </div>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Offshore</div>
          <div className={styles.costValue}>
            {hs.offshoreHours.totalHours.toLocaleString()}h
          </div>
        </div>
      </div>
      <div className={styles.costCard} style={{ textAlign: "center" }}>
        <div className={styles.costLabel}>Grand Total Hours</div>
        <div className={styles.costValue} style={{ fontSize: 28 }}>
          {hs.grandTotalHours.toLocaleString()}h
        </div>
      </div>

      {/* Sub-tabs */}
      <div className={styles.tabBar}>
        {(Object.keys(sections) as (keyof typeof sections)[]).map((key) => (
          <button
            key={key}
            className={`${styles.tab} ${subTab === key ? styles.active : ""}`}
            onClick={() => setSubTab(key)}
          >
            {sections[key].label}
          </button>
        ))}
      </div>

      <GlassCard title={current.label}>
        {current.data.items.length === 0 ? (
          <EmptySection message="No hours items added yet for this section." />
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Requirement</th>
                  <th>Function</th>
                  <th>Phase</th>
                  <th>Hrs/Day</th>
                  <th>People</th>
                  <th>Work Days</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {current.data.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.lineNumber}</td>
                    <td>{item.requirementName}</td>
                    <td>{item.function}</td>
                    <td>{item.phase}</td>
                    <td>{item.hoursPerDay}</td>
                    <td>{item.pplQty}</td>
                    <td>{item.workDays}</td>
                    <td>{item.totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>
    </div>
  );
};

/* ─── Tab: Cost Summary ─── */
const CostTab: React.FC<{ bid: IBid }> = ({ bid }) => {
  const cs = bid.costSummary;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div className={styles.costGrid}>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Assets Cost (USD)</div>
          <div className={styles.costValue}>
            ${cs.assetsCostUSD.toLocaleString()}
          </div>
          <div className={styles.costSub}>
            R$ {cs.assetsCostBRL.toLocaleString()}
          </div>
        </div>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Hours Cost (BRL)</div>
          <div className={styles.costValue}>
            R$ {cs.totalHoursCostBRL.toLocaleString()}
          </div>
          <div className={styles.costSub}>
            ${cs.totalHoursCostUSD.toLocaleString()} USD
          </div>
        </div>
        <div className={styles.costCard}>
          <div className={styles.costLabel}>Total Cost (USD)</div>
          <div
            className={styles.costValue}
            style={{ color: "var(--primary-accent)" }}
          >
            ${cs.totalCostUSD.toLocaleString()}
          </div>
          <div className={styles.costSub}>
            R$ {cs.totalCostBRL.toLocaleString()}
          </div>
        </div>
      </div>

      <GlassCard title="Cost Breakdown">
        <div className={styles.infoGrid}>
          <InfoRow
            label="Engineering Hours (BRL)"
            value={`R$ ${cs.engineeringHoursCostBRL.toLocaleString()}`}
          />
          <InfoRow
            label="Onshore Hours (BRL)"
            value={`R$ ${cs.onshoreHoursCostBRL.toLocaleString()}`}
          />
          <InfoRow
            label="Offshore Hours (BRL)"
            value={`R$ ${cs.offshoreHoursCostBRL.toLocaleString()}`}
          />
          <InfoRow label="PTAX Used" value={cs.ptaxUsed} />
          <InfoRow label="Currency" value={cs.currency} />
          <InfoRow label="Notes" value={cs.notes || "—"} />
        </div>
      </GlassCard>

      {/* Assets CAPEX/OPEX */}
      <GlassCard title="Assets Cost Summary (CAPEX / OPEX)">
        <div className={styles.costGrid}>
          <div className={styles.costCard}>
            <div className={styles.costLabel}>CAPEX Total</div>
            <div className={styles.costValue}>
              ${bid.assetsCostSummary.capexTotal.toLocaleString()}
            </div>
          </div>
          <div className={styles.costCard}>
            <div className={styles.costLabel}>OPEX Total</div>
            <div className={styles.costValue}>
              ${bid.assetsCostSummary.opexTotal.toLocaleString()}
            </div>
          </div>
          <div className={styles.costCard}>
            <div className={styles.costLabel}>Grand Total</div>
            <div className={styles.costValue}>
              ${bid.assetsCostSummary.grandTotal.toLocaleString()}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

/* ─── Tab: Tasks & Phases ─── */
const TasksTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="BID Tasks (RACI)">
    {bid.tasks.length === 0 ? (
      <EmptySection message="No tasks defined for this BID." />
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bid.tasks.map((task) => (
          <div
            key={task.taskId}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "var(--card-bg-elevated)",
              borderRadius: 8,
              borderLeft: `3px solid ${
                task.status === "completed"
                  ? "var(--success)"
                  : task.status === "in-progress"
                    ? "var(--primary-accent)"
                    : "var(--border)"
              }`,
            }}
          >
            <input
              type="checkbox"
              checked={task.status === "completed"}
              readOnly
              style={{ accentColor: "var(--primary-accent)" }}
            />
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {task.name}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {task.phase} · Assigned: {task.assignedTo || "Unassigned"}
              </div>
            </div>
            <StatusBadge status={task.status} />
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: Timeline ─── */
const TimelineTab: React.FC<{ bid: IBid; currentPhaseIndex: number }> = ({
  bid,
  currentPhaseIndex,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <GlassCard title="BID Timeline">
      {/* Horizontal step circles */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: "24px 0",
          overflowX: "auto",
        }}
      >
        {BID_PHASES.map((phase, idx) => {
          const isCompleted = idx < currentPhaseIndex;
          const isCurrent = idx === currentPhaseIndex;
          return (
            <React.Fragment key={phase.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  minWidth: 100,
                }}
              >
                <div
                  className={`${styles.phaseCircle} ${isCompleted ? styles.completed : isCurrent ? styles.current : styles.pending}`}
                  style={{ width: 40, height: 40, fontSize: 14 }}
                >
                  {isCompleted ? "✓" : idx}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginTop: 8,
                  }}
                >
                  {phase.label}
                </div>
              </div>
              {idx < BID_PHASES.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: 2,
                    minWidth: 30,
                    background: isCompleted
                      ? "var(--success)"
                      : "var(--border-subtle)",
                    marginBottom: 24,
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </GlassCard>

    <GlassCard title="Step History">
      {bid.steps.length === 0 ? (
        <EmptySection message="No step history recorded." />
      ) : (
        bid.steps.map((step, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: 12,
              padding: "10px 0",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                marginTop: 5,
                background: "var(--primary-accent)",
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                Step {step.idStep}: {step.status} ({step.phase})
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {step.start} {step.actor ? `· ${step.actor}` : ""}
              </div>
            </div>
          </div>
        ))
      )}
    </GlassCard>
  </div>
);

/* ─── Tab: Approval ─── */
const ApprovalTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <h3 style={{ color: "var(--text-primary)", margin: 0 }}>
        Approval Status:{" "}
        <StatusBadge
          status={bid.approvalStatus}
          color={
            bid.approvalStatus === "approved"
              ? "#10b981"
              : bid.approvalStatus === "pending"
                ? "#f59e0b"
                : bid.approvalStatus === "rejected"
                  ? "#ef4444"
                  : "#94a3b8"
          }
        />
      </h3>
    </div>

    {bid.approvals.length === 0 ? (
      <GlassCard>
        <EmptySection message="No approvals configured for this BID." />
      </GlassCard>
    ) : (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {bid.approvals.map((approval) => (
          <div
            key={approval.id}
            style={{
              background: "var(--card-bg)",
              borderRadius: 16,
              padding: 20,
              border: "1px solid var(--border-subtle)",
              borderLeft: `4px solid ${
                approval.status === "approved"
                  ? "#10b981"
                  : approval.status === "rejected"
                    ? "#ef4444"
                    : approval.status === "pending"
                      ? "#f59e0b"
                      : "#94a3b8"
              }`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
              }}
            >
              <strong style={{ color: "var(--text-primary)", fontSize: 14 }}>
                {approval.stakeholder.name}
              </strong>
              <StatusBadge status={approval.status} />
            </div>
            <div style={{ fontSize: 12, color: "var(--text-secondary)" }}>
              {approval.stakeholderRole}
            </div>
            {approval.respondedDate && (
              <div
                style={{
                  fontSize: 11,
                  color: "var(--text-muted)",
                  marginTop: 8,
                }}
              >
                Responded:{" "}
                {format(new Date(approval.respondedDate), "MMM d, yyyy")}
              </div>
            )}
            {approval.comments && (
              <div
                style={{
                  fontSize: 12,
                  color: "var(--text-secondary)",
                  marginTop: 8,
                  padding: 8,
                  background: "var(--card-bg-elevated)",
                  borderRadius: 8,
                }}
              >
                {approval.comments}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

/* ─── Tab: Documents ─── */
const DocumentsTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Documents & Attachments">
    {bid.attachments.length === 0 ? (
      <EmptySection message="No documents uploaded yet." />
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {bid.attachments.map((att) => (
          <div
            key={att.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 16px",
              background: "var(--card-bg-elevated)",
              borderRadius: 8,
            }}
          >
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
            <div style={{ flex: 1 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {att.fileName}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {att.category} · {(att.fileSize / 1024).toFixed(0)} KB ·{" "}
                {att.uploadedBy}
              </div>
            </div>
            <StatusBadge status={att.fileType.toUpperCase()} color="#3b82f6" />
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: Comments ─── */
const CommentsTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Comments & Discussion">
    {bid.comments.length === 0 ? (
      <EmptySection message="No comments yet. Start the conversation!" />
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {bid.comments.map((comment) => (
          <div
            key={comment.id}
            style={{
              padding: 16,
              background: "var(--card-bg-elevated)",
              borderRadius: 12,
              borderLeft: "3px solid var(--secondary-accent)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <strong style={{ fontSize: 13, color: "var(--text-primary)" }}>
                {comment.author.name}
              </strong>
              <span style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {format(new Date(comment.timestamp), "MMM d, yyyy HH:mm")}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {comment.text}
            </p>
            <div
              style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 6 }}
            >
              {comment.section} · {comment.phase}
            </div>
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: BID Notes ─── */
const NotesTab: React.FC<{ bid: IBid }> = ({ bid }) => {
  const notes = bid.bidNotes as Record<string, string> | undefined;
  const entries = notes ? Object.entries(notes) : [];

  return (
    <GlassCard title="BID Analysis Notes">
      {entries.length === 0 ? (
        <EmptySection message="No analysis notes added yet." />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {entries.map(([section, content]) => (
            <div key={section} className={styles.infoSection}>
              <h4 className={styles.infoTitle}>{section}</h4>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                }}
              >
                {content}
              </p>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
};

/* ─── Tab: Qualifications ─── */
const QualificationsTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Required Qualifications">
    {bid.opportunityInfo.qualifications.length === 0 ? (
      <EmptySection message="No qualifications specified." />
    ) : (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {bid.opportunityInfo.qualifications.map((q, idx) => (
          <span
            key={idx}
            style={{
              padding: "6px 14px",
              background: "var(--card-bg-elevated)",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 500,
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
            }}
          >
            {q}
          </span>
        ))}
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: AI Analysis ─── */
const AITab: React.FC = () => (
  <GlassCard title="AI Analysis">
    <div
      style={{
        textAlign: "center",
        padding: 32,
        color: "var(--text-muted)",
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        style={{ marginBottom: 12, opacity: 0.5 }}
      >
        <path d="M12 2a4 4 0 014 4v1a1 1 0 001 1h1a4 4 0 010 8h-1a1 1 0 00-1 1v1a4 4 0 01-8 0v-1a1 1 0 00-1-1H6a4 4 0 010-8h1a1 1 0 001-1V6a4 4 0 014-4z" />
      </svg>
      <h3 style={{ fontSize: 16, fontWeight: 500, margin: "0 0 8px" }}>
        AI Analysis Coming Soon
      </h3>
      <p style={{ fontSize: 13 }}>
        The AI-powered analysis feature will be available in a future release.
      </p>
    </div>
  </GlassCard>
);

/* ─── Tab: Activity Log ─── */
const ActivityTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Activity Log">
    {bid.activityLog.length === 0 ? (
      <EmptySection message="No activity recorded yet." />
    ) : (
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {bid.activityLog.map((entry, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--primary-accent)",
                marginTop: 5,
                flexShrink: 0,
              }}
            />
            <div>
              <div style={{ fontSize: 13, color: "var(--text-primary)" }}>
                {entry.description}
              </div>
              <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                {entry.actor} · {entry.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </GlassCard>
);

/* ─── Tab: Export ─── */
const ExportTab: React.FC<{ bid: IBid }> = ({ bid }) => (
  <GlassCard title="Export Options">
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: 16,
      }}
    >
      {[
        {
          label: "Export Excel",
          icon: "📊",
          desc: "Multi-tab spreadsheet with all BID data",
        },
        {
          label: "Export PDF",
          icon: "📄",
          desc: "Formatted PDF report for stakeholders",
        },
        { label: "Export CSV", icon: "📋", desc: "Raw data in CSV format" },
        { label: "Print Report", icon: "🖨️", desc: "Printer-friendly version" },
      ].map((opt) => (
        <button
          key={opt.label}
          style={{
            background: "var(--card-bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 16,
            padding: 24,
            cursor: "pointer",
            textAlign: "center",
            transition: "all 200ms ease",
            color: "var(--text-primary)",
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 12 }}>{opt.icon}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>
            {opt.label}
          </div>
          <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
            {opt.desc}
          </div>
        </button>
      ))}
    </div>
  </GlassCard>
);

/* ─── Empty State Helper ─── */
const EmptySection: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      textAlign: "center",
      padding: 32,
      color: "var(--text-muted)",
      fontSize: 13,
    }}
  >
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      style={{ marginBottom: 8, opacity: 0.4 }}
    >
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <path d="M12 12h.01" />
    </svg>
    <p>{message}</p>
  </div>
);
