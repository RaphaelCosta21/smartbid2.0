import * as React from "react";
import { IBid, IBidStep, IActivityLogEntry, BidPhase } from "../../models";
import { BID_STATUSES, BID_PHASES } from "../../config/status.config";
import { useConfigStore } from "../../stores/useConfigStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { StatusBadge } from "../common/StatusBadge";
import { GlassCard } from "../common/GlassCard";
import { BidTaskChecklist } from "./BidTaskChecklist";
import { formatDateTime } from "../../utils/formatters";
import styles from "./BidStatusPhasePanel.module.scss";

/* ─── Helpers ─── */

function formatDurationHours(hours: number | null): string {
  if (hours === null || hours === undefined) return "—";
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return mins <= 1 ? "< 1 min" : `${mins} min`;
  }
  if (hours < 24) {
    return `${Math.round(hours * 10) / 10}h`;
  }
  const days = Math.floor(hours / 24);
  const remainHours = Math.round((hours % 24) * 10) / 10;
  if (remainHours === 0) return `${days}d`;
  return `${days}d ${remainHours}h`;
}

function calcDurationHours(start: string, end: string): number {
  const ms = new Date(end).getTime() - new Date(start).getTime();
  return Math.round((ms / (1000 * 60 * 60)) * 10) / 10;
}

function calcElapsedDays(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

/* ─── Props ─── */

interface BidStatusPhasePanelProps {
  bid: IBid;
  readOnly?: boolean;
  onSave: (patch: Partial<IBid>) => void;
}

export const BidStatusPhasePanel: React.FC<BidStatusPhasePanelProps> = ({
  bid,
  readOnly = false,
  onSave,
}) => {
  const config = useConfigStore((s) => s.config);
  const currentUser = useCurrentUser();
  const [confirmAction, setConfirmAction] = React.useState<{
    type: "phase" | "status";
    phase: BidPhase;
    status: string;
    phaseLabel: string;
    statusLabel: string;
  } | null>(null);

  /** Phase-change picker: choose a status before confirming */
  const [phasePickerTarget, setPhasePickerTarget] = React.useState<{
    phase: BidPhase;
    phaseLabel: string;
  } | null>(null);
  const [phasePickerStatus, setPhasePickerStatus] = React.useState<string>("");

  /* ─── Phases from config (fallback to hardcoded) ─── */
  const phases = React.useMemo(() => {
    const cfgPhases = config?.phases;
    if (cfgPhases && cfgPhases.length > 0) {
      return cfgPhases
        .filter((p) => p.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((p) => ({
          id: p.id,
          label: p.label,
          value: p.value as BidPhase,
          order: p.order || 0,
          color: p.color || "#94A3B8",
        }));
    }
    return BID_PHASES.map((p) => ({ ...p }));
  }, [config]);

  /* ─── Current phase index ─── */
  const currentPhaseIndex = phases.findIndex(
    (p) => p.value === bid.currentPhase,
  );

  /* ─── Statuses from config subStatuses (fallback to hardcoded) ─── */
  const allStatuses = React.useMemo(() => {
    const cfgSub = config?.subStatuses;
    if (cfgSub && cfgSub.length > 0) {
      return cfgSub
        .filter((s) => s.isActive !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .map((s) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          color: s.color || "#94A3B8",
          order: s.order || 0,
          isTerminal: false,
          phase: null as BidPhase | null,
          /** Comma-separated phase labels or "all" */
          applicablePhases: (s.category || "all") as string,
        }));
    }
    // Fallback: use hardcoded BID_STATUSES
    return BID_STATUSES.map((s) => ({
      ...s,
      applicablePhases: s.phase || "all",
    }));
  }, [config]);

  /* ─── Group statuses by applicable phase ─── */
  const statusesByPhase = React.useMemo(() => {
    const map: Record<string, typeof allStatuses> = {};
    allStatuses.forEach((s) => {
      const phases_str = s.applicablePhases;
      if (phases_str === "all") {
        // Global status: appears in all phases
        if (!map["global"]) map["global"] = [];
        map["global"].push(s);
      } else if (
        typeof phases_str === "string" &&
        phases_str.indexOf(",") >= 0
      ) {
        // Multiple phases
        const phaseList = phases_str.split(",").map((p) => p.trim());
        phaseList.forEach((ph) => {
          if (!map[ph]) map[ph] = [];
          map[ph].push(s);
        });
      } else {
        // Single phase
        const key = phases_str || "global";
        if (!map[key]) map[key] = [];
        map[key].push(s);
      }
    });
    return map;
  }, [allStatuses]);

  /* ─── Terminal statuses from config (fallback to hardcoded) ─── */
  const terminalStatuses = React.useMemo(() => {
    const cfgTerminal = (config as any)?.terminalStatuses;
    if (cfgTerminal && cfgTerminal.length > 0) {
      return cfgTerminal
        .filter((s: any) => s.isActive !== false)
        .sort((a: any, b: any) => (a.order || 0) - (b.order || 0))
        .map((s: any) => ({
          id: s.id,
          label: s.label,
          value: s.value,
          color: s.color || "#94A3B8",
          order: s.order || 0,
          isTerminal: true,
          phase: "Close Out" as BidPhase,
        }));
    }
    // Fallback: hardcoded terminal statuses (no "Returned to Commercial")
    return BID_STATUSES.filter(
      (s) => s.isTerminal && s.value !== "Returned to Commercial",
    );
  }, [config]);

  /* ─── Duration in current phase ─── */
  const currentStepDuration = React.useMemo(() => {
    const currentSteps = bid.steps || [];
    if (currentSteps.length === 0) {
      return calcElapsedDays(bid.createdDate);
    }
    const lastStep = currentSteps[currentSteps.length - 1];
    if (!lastStep.end) {
      return calcElapsedDays(lastStep.start);
    }
    return 0;
  }, [bid.steps, bid.createdDate]);

  const totalElapsedDays = calcElapsedDays(bid.createdDate);

  /* ─── Phase completion (tasks) ─── */
  const currentPhaseTasks = React.useMemo(() => {
    return (bid.tasks || []).filter((t) => t.phase === bid.currentPhase);
  }, [bid.tasks, bid.currentPhase]);

  const completedTasks = currentPhaseTasks.filter(
    (t) => t.status === "completed",
  ).length;
  const taskProgress =
    currentPhaseTasks.length > 0
      ? Math.round((completedTasks / currentPhaseTasks.length) * 100)
      : 0;

  /* ─── Change handler ─── */
  const executeChange = React.useCallback(
    (newPhase: BidPhase, newStatus: string) => {
      const now = new Date().toISOString();
      const currentSteps = bid.steps || [];

      // Close previous step
      const updatedSteps: IBidStep[] = currentSteps.map((step, idx) => {
        if (idx === currentSteps.length - 1 && !step.end) {
          const dur = calcDurationHours(step.start, now);
          return {
            ...step,
            end: now,
            duration: dur,
            durationFormatted: formatDurationHours(dur),
          };
        }
        return step;
      });

      // Create new step
      const newStep: IBidStep = {
        idStep: updatedSteps.length + 1,
        status: newStatus,
        phase: newPhase,
        start: now,
        end: null,
        duration: null,
        durationFormatted: "",
        actor: currentUser.displayName,
        comments: "",
      };

      // Activity log entries
      const logs: IActivityLogEntry[] = [];
      if (newPhase !== bid.currentPhase) {
        const fromLabel =
          phases.find((p) => p.value === bid.currentPhase)?.label ||
          bid.currentPhase;
        const toLabel =
          phases.find((p) => p.value === newPhase)?.label || newPhase;
        logs.push({
          id: `log-${Date.now()}-phase`,
          type: "PHASE_CHANGED",
          timestamp: now,
          actor: currentUser.email,
          actorName: currentUser.displayName,
          description: `Phase changed from "${fromLabel}" to "${toLabel}"`,
          metadata: { fromPhase: bid.currentPhase, toPhase: newPhase },
        });
      }
      if (newStatus !== bid.currentStatus) {
        logs.push({
          id: `log-${Date.now()}-status`,
          type: "STATUS_CHANGED",
          timestamp: now,
          actor: currentUser.email,
          actorName: currentUser.displayName,
          description: `Status changed from "${bid.currentStatus}" to "${newStatus}"`,
          metadata: { fromStatus: bid.currentStatus, toStatus: newStatus },
        });
      }

      onSave({
        currentPhase: newPhase,
        currentStatus: newStatus,
        steps: [...updatedSteps, newStep],
        activityLog: [...(bid.activityLog || []), ...logs],
      });

      setConfirmAction(null);
    },
    [bid, currentUser, onSave, phases],
  );

  /* ─── Click handlers ─── */
  const handleStatusClick = (statusDef: {
    value: string;
    label: string;
    phase: BidPhase | null;
    isTerminal?: boolean;
  }) => {
    if (readOnly) return;
    if (statusDef.value === bid.currentStatus) return;

    // Terminal statuses (Completed, Canceled, No Bid) → force Close Out phase
    const isTerminal =
      statusDef.isTerminal ||
      terminalStatuses.some((t) => t.value === statusDef.value);
    const targetPhase: BidPhase = isTerminal
      ? ("Close Out" as BidPhase)
      : statusDef.phase || bid.currentPhase;
    const phaseLabel =
      phases.find((p) => p.value === targetPhase)?.label || targetPhase;

    setConfirmAction({
      type: targetPhase !== bid.currentPhase ? "phase" : "status",
      phase: targetPhase,
      status: statusDef.value,
      phaseLabel,
      statusLabel: statusDef.label,
    });
  };

  const handlePhaseClick = (phase: (typeof phases)[0]) => {
    if (readOnly) return;
    if (phase.value === bid.currentPhase) return;

    // Open status picker for target phase
    setPhasePickerTarget({ phase: phase.value, phaseLabel: phase.label });
    setPhasePickerStatus("");
  };

  const handleAdvancePhase = () => {
    if (readOnly) return;
    const nextIdx = currentPhaseIndex + 1;
    if (nextIdx >= phases.length) return;
    handlePhaseClick(phases[nextIdx]);
  };

  const handleRevertPhase = () => {
    if (readOnly) return;
    const prevIdx = currentPhaseIndex - 1;
    if (prevIdx < 0) return;
    handlePhaseClick(phases[prevIdx]);
  };

  /** Confirm phase change after status is selected in the picker */
  const handlePhasePickerConfirm = () => {
    if (!phasePickerTarget || !phasePickerStatus) return;
    executeChange(phasePickerTarget.phase, phasePickerStatus);
    setPhasePickerTarget(null);
    setPhasePickerStatus("");
  };

  /* ─── Task toggle handler ─── */
  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = (bid.tasks || []).map((t) =>
      t.taskId === taskId
        ? {
            ...t,
            status:
              t.status === "completed"
                ? ("not-started" as const)
                : ("completed" as const),
            completedDate:
              t.status === "completed" ? null : new Date().toISOString(),
          }
        : t,
    );
    const logEntry: IActivityLogEntry = {
      id: `log-${Date.now()}-task`,
      type: "TASK_UPDATED",
      timestamp: new Date().toISOString(),
      actor: currentUser.email,
      actorName: currentUser.displayName,
      description: `Task "${taskId}" ${
        (bid.tasks || []).find((t) => t.taskId === taskId)?.status ===
        "completed"
          ? "unchecked"
          : "completed"
      }`,
      metadata: { taskId },
    };
    onSave({
      tasks: updatedTasks,
      activityLog: [...(bid.activityLog || []), logEntry],
    });
  };

  /* ─── Current status color ─── */
  const currentStatusDef = BID_STATUSES.find(
    (s) => s.value === bid.currentStatus,
  );
  const currentPhaseColor =
    phases.find((p) => p.value === bid.currentPhase)?.color || "#94A3B8";

  /* ─── Last change info ─── */
  const lastStep =
    (bid.steps || []).length > 0 ? bid.steps[bid.steps.length - 1] : null;

  return (
    <div className={styles.container}>
      {/* ─── Phase Stepper ─── */}
      <GlassCard title="Phase Progress">
        <div className={styles.phaseStepper}>
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            const isClickable = !readOnly && !isCurrent;

            return (
              <React.Fragment key={phase.id}>
                <div
                  className={`${styles.phaseStep} ${isClickable ? styles.phaseStepClickable : ""}`}
                  onClick={() => isClickable && handlePhaseClick(phase)}
                  title={
                    isClickable
                      ? `Click to change to ${phase.label}`
                      : phase.label
                  }
                >
                  <div
                    className={`${styles.phaseCircle} ${
                      isCompleted
                        ? styles.phaseCircleCompleted
                        : isCurrent
                          ? styles.phaseCircleCurrent
                          : styles.phaseCirclePending
                    }`}
                    style={
                      isCurrent
                        ? {
                            borderColor: phase.color,
                            boxShadow: `0 0 12px ${phase.color}40`,
                          }
                        : isCompleted
                          ? { background: phase.color }
                          : {}
                    }
                  >
                    {isCompleted ? (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    ) : (
                      <span>{idx}</span>
                    )}
                  </div>
                  <div
                    className={styles.phaseStepLabel}
                    style={
                      isCurrent ? { color: phase.color, fontWeight: 700 } : {}
                    }
                  >
                    {phase.label}
                  </div>
                  {isCurrent && (
                    <div
                      className={styles.phaseCurrentBadge}
                      style={{
                        background: `${phase.color}20`,
                        color: phase.color,
                      }}
                    >
                      Current
                    </div>
                  )}
                </div>
                {idx < phases.length - 1 && (
                  <div
                    className={`${styles.phaseConnector} ${
                      isCompleted
                        ? styles.phaseConnectorDone
                        : styles.phaseConnectorPending
                    }`}
                    style={
                      isCompleted ? { background: phases[idx + 1].color } : {}
                    }
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Phase navigation buttons */}
        {!readOnly && (
          <div className={styles.phaseNavRow}>
            <button
              className={styles.phaseNavBtn}
              disabled={currentPhaseIndex <= 0}
              onClick={handleRevertPhase}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M19 12H5" />
                <path d="M12 19l-7-7 7-7" />
              </svg>
              Previous Phase
            </button>
            <button
              className={`${styles.phaseNavBtn} ${styles.phaseNavBtnPrimary}`}
              disabled={currentPhaseIndex >= phases.length - 1}
              onClick={handleAdvancePhase}
            >
              Advance Phase
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </GlassCard>

      {/* ─── KPI Stats ─── */}
      <div className={styles.kpiRow}>
        <div className={styles.kpiCard}>
          <div
            className={styles.kpiIcon}
            style={{ background: `${currentPhaseColor}18` }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke={currentPhaseColor}
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiValue}>{currentStepDuration}d</div>
            <div className={styles.kpiLabel}>In Current Phase</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div
            className={styles.kpiIcon}
            style={{ background: "rgba(59,130,246,0.1)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="2"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiValue}>{totalElapsedDays}d</div>
            <div className={styles.kpiLabel}>Total Elapsed</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div
            className={styles.kpiIcon}
            style={{ background: "rgba(16,185,129,0.1)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10B981"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiValue}>{taskProgress}%</div>
            <div className={styles.kpiLabel}>Phase Tasks</div>
          </div>
        </div>
        <div className={styles.kpiCard}>
          <div
            className={styles.kpiIcon}
            style={{ background: "rgba(139,92,246,0.1)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="2"
            >
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
          </div>
          <div className={styles.kpiContent}>
            <div className={styles.kpiValue}>{(bid.steps || []).length}</div>
            <div className={styles.kpiLabel}>Total Steps</div>
          </div>
        </div>
      </div>

      {/* ─── Current Status & Change Status ─── */}
      <div className={styles.statusSection}>
        {/* Current Status Card */}
        <GlassCard title="Current Status">
          <div className={styles.currentStatusDisplay}>
            <div
              className={styles.statusIndicator}
              style={{ background: currentStatusDef?.color || "#94A3B8" }}
            />
            <div className={styles.currentStatusInfo}>
              <div className={styles.currentStatusLabel}>
                {bid.currentStatus}
              </div>
              <div className={styles.currentPhaseBadge}>
                <span
                  className={styles.phaseDot}
                  style={{ background: currentPhaseColor }}
                />
                {phases.find((p) => p.value === bid.currentPhase)?.label ||
                  bid.currentPhase}
              </div>
              {lastStep && (
                <div className={styles.lastChangeInfo}>
                  Last changed by <strong>{lastStep.actor || "—"}</strong> on{" "}
                  {formatDateTime(lastStep.start)}
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Status Selector */}
        <GlassCard title="Change Status">
          {readOnly ? (
            <div className={styles.readOnlyMsg}>
              You don&apos;t have permission to change the status.
            </div>
          ) : (
            <div className={styles.statusSelectorWrap}>
              {/* Phase statuses */}
              <div className={styles.statusGroupLabel}>
                Current Phase Statuses
              </div>
              <div className={styles.statusGrid}>
                {(statusesByPhase[bid.currentPhase] || []).map((s) => {
                  const isActive = s.value === bid.currentStatus;
                  return (
                    <button
                      key={s.id}
                      className={`${styles.statusCard} ${isActive ? styles.statusCardActive : ""}`}
                      style={
                        isActive
                          ? {
                              borderColor: s.color,
                              background: `${s.color}12`,
                            }
                          : {}
                      }
                      onClick={() =>
                        handleStatusClick({
                          value: s.value,
                          label: s.label,
                          phase: s.phase,
                        })
                      }
                      disabled={isActive}
                    >
                      <span
                        className={styles.statusCardDot}
                        style={{ background: s.color }}
                      />
                      <span className={styles.statusCardLabel}>{s.label}</span>
                      {isActive && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="2.5"
                          className={styles.statusCardCheck}
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Global statuses (On Hold, Returned for Revision) */}
              {(statusesByPhase["global"] || []).filter((s) => !s.isTerminal)
                .length > 0 && (
                <>
                  <div className={styles.statusGroupLabel}>
                    Workflow Actions
                  </div>
                  <div className={styles.statusGrid}>
                    {(statusesByPhase["global"] || [])
                      .filter((s) => !s.isTerminal)
                      .map((s) => {
                        const isActive = s.value === bid.currentStatus;
                        return (
                          <button
                            key={s.id}
                            className={`${styles.statusCard} ${isActive ? styles.statusCardActive : ""}`}
                            style={
                              isActive
                                ? {
                                    borderColor: s.color,
                                    background: `${s.color}12`,
                                  }
                                : {}
                            }
                            onClick={() =>
                              handleStatusClick({
                                value: s.value,
                                label: s.label,
                                phase: s.phase,
                              })
                            }
                            disabled={isActive}
                          >
                            <span
                              className={styles.statusCardDot}
                              style={{ background: s.color }}
                            />
                            <span className={styles.statusCardLabel}>
                              {s.label}
                            </span>
                            {isActive && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={s.color}
                                strokeWidth="2.5"
                                className={styles.statusCardCheck}
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                  </div>
                </>
              )}

              {/* Terminal statuses (collapsible) */}
              <TerminalStatusSection
                statuses={terminalStatuses}
                currentStatus={bid.currentStatus}
                onSelect={handleStatusClick}
              />
            </div>
          )}
        </GlassCard>
      </div>

      {/* ─── Phase Tasks ─── */}
      {currentPhaseTasks.length > 0 && (
        <GlassCard
          title={`Phase Tasks — ${phases.find((p) => p.value === bid.currentPhase)?.label || ""}`}
        >
          <BidTaskChecklist
            tasks={currentPhaseTasks}
            readOnly={readOnly}
            onToggle={readOnly ? undefined : handleTaskToggle}
          />
        </GlassCard>
      )}

      {/* ─── Recent Step History (mini) ─── */}
      {(bid.steps || []).length > 0 && (
        <GlassCard title="Recent Changes">
          <div className={styles.recentSteps}>
            {(bid.steps || [])
              .slice(-5)
              .reverse()
              .map((step) => {
                const pDef = phases.find((p) => p.value === step.phase);
                const sDef = BID_STATUSES.find((s) => s.value === step.status);
                return (
                  <div key={step.idStep} className={styles.recentStepItem}>
                    <div
                      className={styles.recentStepDot}
                      style={{
                        background: sDef?.color || pDef?.color || "#94A3B8",
                      }}
                    />
                    <div className={styles.recentStepContent}>
                      <div className={styles.recentStepTitle}>
                        <StatusBadge status={step.status} />
                        <span className={styles.recentStepPhase}>
                          {pDef?.label || step.phase}
                        </span>
                      </div>
                      <div className={styles.recentStepMeta}>
                        {step.actor || "—"} · {formatDateTime(step.start)}
                        {step.duration !== null && (
                          <span className={styles.recentStepDuration}>
                            {" "}
                            · Duration: {formatDurationHours(step.duration)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </GlassCard>
      )}

      {/* ─── Confirmation Dialog ─── */}
      {confirmAction && (
        <div className={styles.overlay} onClick={() => setConfirmAction(null)}>
          <div
            className={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.confirmIcon}>
              {confirmAction.type === "phase" ? (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary-accent)"
                  strokeWidth="2"
                >
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              ) : (
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--primary-accent)"
                  strokeWidth="2"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="M12 6v6l4 2" />
                </svg>
              )}
            </div>
            <h3 className={styles.confirmTitle}>
              Confirm{" "}
              {confirmAction.type === "phase" ? "Phase & Status" : "Status"}{" "}
              Change
            </h3>
            <div className={styles.confirmChanges}>
              {confirmAction.type === "phase" && (
                <div className={styles.confirmChangeRow}>
                  <span className={styles.confirmLabel}>Phase</span>
                  <span className={styles.confirmFrom}>
                    {phases.find((p) => p.value === bid.currentPhase)?.label}
                  </span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-secondary)"
                    strokeWidth="2"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <span className={styles.confirmTo}>
                    {confirmAction.phaseLabel}
                  </span>
                </div>
              )}
              <div className={styles.confirmChangeRow}>
                <span className={styles.confirmLabel}>Status</span>
                <span className={styles.confirmFrom}>{bid.currentStatus}</span>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--text-secondary)"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
                <span className={styles.confirmTo}>
                  {confirmAction.statusLabel}
                </span>
              </div>
            </div>
            <div className={styles.confirmMeta}>
              This action will be recorded in the Activity Log and Timeline.
            </div>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => setConfirmAction(null)}
              >
                Cancel
              </button>
              <button
                className={styles.confirmSubmit}
                onClick={() =>
                  executeChange(confirmAction.phase, confirmAction.status)
                }
              >
                Confirm Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Phase Change Status Picker ─── */}
      {phasePickerTarget && (
        <div
          className={styles.overlay}
          onClick={() => {
            setPhasePickerTarget(null);
            setPhasePickerStatus("");
          }}
        >
          <div
            className={styles.confirmDialog}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 520 }}
          >
            <div className={styles.confirmIcon}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--primary-accent)"
                strokeWidth="2"
              >
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3 className={styles.confirmTitle}>
              Change Phase to &ldquo;{phasePickerTarget.phaseLabel}&rdquo;
            </h3>
            <div className={styles.confirmMeta}>
              Select the initial status for this phase:
            </div>
            <div className={styles.statusGrid} style={{ width: "100%" }}>
              {(() => {
                const targetPhaseVal = phasePickerTarget.phase;
                // Get statuses applicable to target phase
                const phaseSpecific = statusesByPhase[targetPhaseVal] || [];
                const globalStatuses = statusesByPhase["global"] || [];
                const available = [...phaseSpecific, ...globalStatuses];
                // Also include terminal statuses if target is Close Out
                const extras =
                  targetPhaseVal === "Close Out" ? terminalStatuses : [];
                const allAvailable = [...available, ...extras];
                // Deduplicate by value
                const seen = new Set<string>();
                const deduped: typeof allAvailable = [];
                allAvailable.forEach((s) => {
                  if (!seen.has(s.value)) {
                    seen.add(s.value);
                    deduped.push(s);
                  }
                });
                return deduped.map((s) => {
                  const isSelected = phasePickerStatus === s.value;
                  return (
                    <button
                      key={s.id}
                      className={`${styles.statusCard} ${isSelected ? styles.statusCardActive : ""}`}
                      style={
                        isSelected
                          ? {
                              borderColor: s.color,
                              background: `${s.color}12`,
                            }
                          : {}
                      }
                      onClick={() => setPhasePickerStatus(s.value)}
                    >
                      <span
                        className={styles.statusCardDot}
                        style={{ background: s.color }}
                      />
                      <span className={styles.statusCardLabel}>{s.label}</span>
                      {isSelected && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={s.color}
                          strokeWidth="2.5"
                          className={styles.statusCardCheck}
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </button>
                  );
                });
              })()}
            </div>
            <div className={styles.confirmActions}>
              <button
                className={styles.confirmCancel}
                onClick={() => {
                  setPhasePickerTarget(null);
                  setPhasePickerStatus("");
                }}
              >
                Cancel
              </button>
              <button
                className={styles.confirmSubmit}
                disabled={!phasePickerStatus}
                onClick={handlePhasePickerConfirm}
                style={
                  !phasePickerStatus
                    ? { opacity: 0.5, cursor: "not-allowed" }
                    : {}
                }
              >
                Confirm Phase Change
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Terminal Status Section (collapsible) ─── */

const TerminalStatusSection: React.FC<{
  statuses: Array<{
    id: string;
    label: string;
    value: string;
    color: string;
    isTerminal?: boolean;
    phase: BidPhase | null;
  }>;
  currentStatus: string;
  onSelect: (s: {
    value: string;
    label: string;
    phase: BidPhase | null;
    isTerminal?: boolean;
  }) => void;
}> = ({ statuses, currentStatus, onSelect }) => {
  const [expanded, setExpanded] = React.useState(false);

  if (statuses.length === 0) return null;

  return (
    <div className={styles.terminalSection}>
      <button
        className={styles.terminalToggle}
        onClick={() => setExpanded(!expanded)}
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
            transition: "transform 200ms",
          }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
        Terminal Statuses
        <span className={styles.terminalHint}>
          (Completed, Canceled, No Bid)
        </span>
      </button>
      {expanded && (
        <div className={styles.statusGrid}>
          {statuses.map((s) => {
            const isActive = s.value === currentStatus;
            return (
              <button
                key={s.id}
                className={`${styles.statusCard} ${isActive ? styles.statusCardActive : ""} ${styles.statusCardTerminal}`}
                style={
                  isActive
                    ? {
                        borderColor: s.color,
                        background: `${s.color}12`,
                      }
                    : {}
                }
                onClick={() =>
                  onSelect({
                    value: s.value,
                    label: s.label,
                    phase: s.phase,
                    isTerminal: true,
                  })
                }
                disabled={isActive}
              >
                <span
                  className={styles.statusCardDot}
                  style={{ background: s.color }}
                />
                <span className={styles.statusCardLabel}>{s.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
