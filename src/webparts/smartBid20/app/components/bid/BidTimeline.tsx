import * as React from "react";
import {
  IBid,
  IPhaseHistoryEntry,
  IStatusHistoryEntry,
  BidPhase,
} from "../../models";
import { BID_PHASES } from "../../config/status.config";
import { getStatusColor } from "../../config/status.config";
import { useConfigStore } from "../../stores/useConfigStore";
import { StatusBadge } from "../common/StatusBadge";
import { GlassCard } from "../common/GlassCard";
import { formatDateTime } from "../../utils/formatters";
import styles from "./BidTimeline.module.scss";

/* ─── Helpers ─── */

function formatDurationFromHours(hours: number): string {
  if (hours < 1 / 60) return "< 1 min";
  if (hours < 1) {
    const mins = Math.round(hours * 60);
    return `${mins} min`;
  }
  if (hours < 24) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  }
  const d = Math.floor(hours / 24);
  const rh = Math.round((hours % 24) * 10) / 10;
  return rh === 0 ? `${d}d` : `${d}d ${rh}h`;
}

function formatLiveElapsed(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (totalMinutes < 60) return `${totalMinutes}m ${secs}s`;
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hours < 24) return `${hours}h ${mins}m`;
  const days = Math.floor(hours / 24);
  const rh = hours % 24;
  return `${days}d ${rh}h ${mins}m`;
}

/** Compute total phase duration (sum of all completed phase entries + live for current) */
function getPhaseTotalHours(
  entries: IPhaseHistoryEntry[],
  phase: BidPhase,
): number {
  let total = 0;
  entries.forEach((e) => {
    if (e.phase === phase) {
      if (e.durationHours !== null) {
        total += e.durationHours;
      } else if (!e.end) {
        total += (Date.now() - new Date(e.start).getTime()) / (1000 * 60 * 60);
      }
    }
  });
  return total;
}

/* ─── Live Duration Hook ─── */

function useLiveElapsed(startIso: string | null): string {
  const [elapsed, setElapsed] = React.useState("");
  React.useEffect(() => {
    if (!startIso) {
      setElapsed("");
      return;
    }
    const calc = (): void => {
      const ms = Date.now() - new Date(startIso).getTime();
      setElapsed(formatLiveElapsed(Math.max(0, ms)));
    };
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [startIso]);
  return elapsed;
}

/* ─── Props ─── */

interface BidTimelineProps {
  bid: IBid;
  currentPhaseIndex: number;
}

export const BidTimeline: React.FC<BidTimelineProps> = ({
  bid,
  currentPhaseIndex,
}) => {
  const config = useConfigStore((s) => s.config);

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
          color: p.color || "#94A3B8",
        }));
    }
    return BID_PHASES.map((p) => ({
      id: p.id,
      label: p.label,
      value: p.value as BidPhase,
      color: p.color || "#94A3B8",
    }));
  }, [config]);

  const phaseHistory = React.useMemo(() => bid.phaseHistory || [], [bid]);
  const statusHistory = React.useMemo(() => bid.statusHistory || [], [bid]);

  // Live timer for current phase
  const currentPhaseEntry =
    phaseHistory.length > 0 ? phaseHistory[phaseHistory.length - 1] : null;
  const livePhaseElapsed = useLiveElapsed(
    currentPhaseEntry && !currentPhaseEntry.end
      ? currentPhaseEntry.start
      : null,
  );

  // Live timer for current status
  const currentStatusEntry =
    statusHistory.length > 0 ? statusHistory[statusHistory.length - 1] : null;
  const liveStatusElapsed = useLiveElapsed(
    currentStatusEntry && !currentStatusEntry.end
      ? currentStatusEntry.start
      : null,
  );

  // Group statuses by phase for the detailed view
  const statusesByPhase = React.useMemo(() => {
    const map: Record<string, IStatusHistoryEntry[]> = {};
    statusHistory.forEach((sh) => {
      const key = sh.phase as string;
      if (!map[key]) map[key] = [];
      map[key].push(sh);
    });
    return map;
  }, [statusHistory]);

  // Total elapsed
  const totalElapsedMs = bid.createdDate
    ? Date.now() - new Date(bid.createdDate).getTime()
    : 0;
  const totalElapsed = formatLiveElapsed(totalElapsedMs);

  return (
    <div className={styles.timelineContainer}>
      {/* ─── Summary Cards ─── */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Total Elapsed</span>
            <span className={styles.summaryValue}>{totalElapsed}</span>
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.summaryIconPhase}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
              <line x1="4" y1="22" x2="4" y2="15" />
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Current Phase</span>
            <span className={styles.summaryValue}>
              {phases.find((p) => p.value === bid.currentPhase)?.label ||
                bid.currentPhase}
            </span>
            {livePhaseElapsed && (
              <span className={styles.summaryLive}>
                <span className={styles.liveDot} /> {livePhaseElapsed}
              </span>
            )}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.summaryIconStatus}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Current Status</span>
            <span className={styles.summaryValue}>
              <StatusBadge status={bid.currentStatus} />
            </span>
            {liveStatusElapsed && (
              <span className={styles.summaryLive}>
                <span className={styles.liveDot} /> {liveStatusElapsed}
              </span>
            )}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={`${styles.summaryIcon} ${styles.summaryIconSteps}`}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Total Transitions</span>
            <span className={styles.summaryValue}>
              {statusHistory.length} status · {phaseHistory.length} phase
            </span>
          </div>
        </div>
      </div>

      {/* ─── Phase Stepper ─── */}
      <GlassCard title="Phase Progress">
        <div className={styles.phaseStepperRow}>
          {phases.map((phase, idx) => {
            const isCompleted = idx < currentPhaseIndex;
            const isCurrent = idx === currentPhaseIndex;
            const phaseColor = phase.color;

            // Duration for this phase
            let durationText = "";
            if (isCurrent && livePhaseElapsed) {
              durationText = livePhaseElapsed;
            } else if (isCompleted) {
              const totalHrs = getPhaseTotalHours(phaseHistory, phase.value);
              if (totalHrs > 0)
                durationText = formatDurationFromHours(totalHrs);
            }

            return (
              <React.Fragment key={phase.id}>
                <div className={styles.phaseStepItem}>
                  <div
                    className={`${styles.phaseCircle} ${
                      isCompleted
                        ? styles.phaseCircleCompleted
                        : isCurrent
                          ? styles.phaseCircleCurrent
                          : styles.phaseCirclePending
                    }`}
                    style={
                      isCompleted
                        ? { background: phaseColor, borderColor: phaseColor }
                        : isCurrent
                          ? {
                              borderColor: phaseColor,
                              boxShadow: `0 0 16px ${phaseColor}50`,
                            }
                          : {}
                    }
                  >
                    {isCompleted ? (
                      <svg
                        width="16"
                        height="16"
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
                  <span className={styles.phaseStepLabel}>{phase.label}</span>
                  {isCurrent && (
                    <div className={styles.phaseCurrentInfo}>
                      <StatusBadge status={bid.currentStatus} />
                    </div>
                  )}
                  {durationText && (
                    <span
                      className={`${styles.phaseDurationBadge} ${
                        isCurrent
                          ? styles.phaseDurationLive
                          : styles.phaseDurationDone
                      }`}
                    >
                      {isCurrent && <span className={styles.liveDotSmall} />}
                      {isCompleted ? "✓ " : ""}
                      {durationText}
                    </span>
                  )}
                </div>
                {idx < phases.length - 1 && (
                  <div
                    className={`${styles.phaseConnector} ${
                      isCompleted
                        ? styles.phaseConnectorDone
                        : isCurrent
                          ? styles.phaseConnectorActive
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
      </GlassCard>

      {/* ─── Detailed Flow ─── */}
      <GlassCard title="Detailed Flow">
        {phaseHistory.length === 0 && statusHistory.length === 0 ? (
          <div className={styles.emptyFlow}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth="1.5"
              opacity={0.4}
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <p>
              No history yet. Change the status or phase in the &quot;Status
              &amp; Phases&quot; tab to start tracking.
            </p>
          </div>
        ) : (
          <div className={styles.flowTimeline}>
            {phases.map((phase, phaseIdx) => {
              const isCompleted = phaseIdx < currentPhaseIndex;
              const isCurrent = phaseIdx === currentPhaseIndex;
              const isFuture = phaseIdx > currentPhaseIndex;
              const phaseColor = phase.color;

              // Get phase history entry
              const phaseEntry = phaseHistory.find(
                (e) => e.phase === phase.value,
              );
              if (!phaseEntry && isFuture) return null;

              // Get statuses for this phase
              const phaseStatuses =
                statusesByPhase[phase.value as string] || [];

              // Phase duration
              let phaseDuration = "";
              if (phaseEntry) {
                if (phaseEntry.start && phaseEntry.end) {
                  const ms =
                    new Date(phaseEntry.end).getTime() -
                    new Date(phaseEntry.start).getTime();
                  phaseDuration = formatDurationFromHours(
                    ms / (1000 * 60 * 60),
                  );
                } else if (phaseEntry.durationHours !== null) {
                  phaseDuration = formatDurationFromHours(
                    phaseEntry.durationHours,
                  );
                }
              }

              return (
                <div
                  key={phase.id}
                  className={`${styles.flowPhaseBlock} ${
                    isCurrent
                      ? styles.flowPhaseBlockCurrent
                      : isCompleted
                        ? styles.flowPhaseBlockCompleted
                        : styles.flowPhaseBlockFuture
                  }`}
                >
                  {/* Phase Header */}
                  <div className={styles.flowPhaseHeader}>
                    <div
                      className={styles.flowPhaseMarker}
                      style={{
                        background:
                          isCompleted || isCurrent
                            ? phaseColor
                            : "var(--border-subtle)",
                      }}
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
                        <span
                          style={{
                            color: isCurrent ? "white" : "var(--text-muted)",
                            fontWeight: 700,
                            fontSize: 12,
                          }}
                        >
                          {phaseIdx}
                        </span>
                      )}
                    </div>
                    <div className={styles.flowPhaseInfo}>
                      <span
                        className={styles.flowPhaseTitle}
                        style={isCurrent ? { color: phaseColor } : {}}
                      >
                        {phase.label}
                      </span>
                      <span className={styles.flowPhaseMeta}>
                        {phaseEntry ? formatDateTime(phaseEntry.start) : "—"}
                        {phaseEntry?.end && (
                          <span> → {formatDateTime(phaseEntry.end)}</span>
                        )}
                        {phaseEntry?.actor && (
                          <span className={styles.flowActor}>
                            {" "}
                            · {phaseEntry.actor}
                          </span>
                        )}
                      </span>
                    </div>
                    <div className={styles.flowPhaseDuration}>
                      {isCurrent && livePhaseElapsed ? (
                        <span className={styles.flowDurationLive}>
                          <span className={styles.liveDotSmall} />
                          {livePhaseElapsed}
                        </span>
                      ) : phaseDuration ? (
                        <span className={styles.flowDurationDone}>
                          ✓ {phaseDuration}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Status entries for this phase */}
                  {phaseStatuses.length > 0 && (
                    <div className={styles.flowStatusList}>
                      {phaseStatuses.map((sh, shIdx) => {
                        const isLastAndOpen =
                          shIdx === phaseStatuses.length - 1 && !sh.end;
                        const isCurrentStatus = isCurrent && isLastAndOpen;
                        const statusColor = getStatusColor(sh.status);

                        let sDuration = "";
                        if (sh.start && sh.end) {
                          const ms =
                            new Date(sh.end).getTime() -
                            new Date(sh.start).getTime();
                          sDuration = formatDurationFromHours(
                            ms / (1000 * 60 * 60),
                          );
                        } else if (sh.durationHours !== null) {
                          sDuration = formatDurationFromHours(sh.durationHours);
                        }

                        return (
                          <div
                            key={sh.id}
                            className={`${styles.flowStatusItem} ${
                              isCurrentStatus
                                ? styles.flowStatusItemCurrent
                                : ""
                            }`}
                          >
                            <div className={styles.flowStatusConnector}>
                              <div
                                className={styles.flowStatusDot}
                                style={{ background: statusColor }}
                              />
                              {shIdx < phaseStatuses.length - 1 && (
                                <div className={styles.flowStatusLine} />
                              )}
                            </div>
                            <div className={styles.flowStatusContent}>
                              <div className={styles.flowStatusHeader}>
                                <StatusBadge status={sh.status} />
                                {isCurrentStatus && liveStatusElapsed ? (
                                  <span
                                    className={styles.flowStatusDurationLive}
                                  >
                                    <span className={styles.liveDotSmall} />
                                    {liveStatusElapsed}
                                  </span>
                                ) : sDuration ? (
                                  <span
                                    className={styles.flowStatusDurationDone}
                                  >
                                    {sDuration}
                                  </span>
                                ) : null}
                              </div>
                              <div className={styles.flowStatusMeta}>
                                {sh.actor || "—"} · {formatDateTime(sh.start)}
                                {sh.end && (
                                  <span> → {formatDateTime(sh.end)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Connector line to next phase */}
                  {phaseIdx < phases.length - 1 && !isFuture && (
                    <div
                      className={styles.flowPhaseConnector}
                      style={
                        isCompleted
                          ? { borderColor: phases[phaseIdx + 1].color }
                          : {}
                      }
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </GlassCard>
    </div>
  );
};
