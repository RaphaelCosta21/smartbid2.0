import * as React from "react";
import { useColorTheme } from "../../hooks/useColorTheme";
import { TargetTone } from "../../utils/kpiHelpers";
import styles from "./KPICard.module.scss";

export interface KPIBreakdownItem {
  label: string;
  value: string;
  /** Dot color before the label. */
  color?: string;
  /** Colors the value against its target. */
  tone?: TargetTone;
  /** Muted text after the value, e.g. the target. */
  hint?: string;
}

const TONE_CLASS: Record<TargetTone, string> = {
  success: styles.toneSuccess,
  warning: styles.toneWarning,
  danger: styles.toneDanger,
  neutral: styles.toneNeutral,
};

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  subtitle?: string;
  progress?: { value: number; max: number };
  /** Visual style — "glass" for frosted analytics cards. */
  variant?: "solid" | "glass";
  /** Optional mini-chart rendered at the bottom (e.g. a Sparkline). */
  sparkline?: React.ReactNode;
  /** Configured KPI target, colored by whether it is met. `at` marks it on the progress bar. */
  target?: { label: string; tone: TargetTone; at?: number };
  /** Compact rows under the value (per-category values, mini counters). */
  breakdown?: KPIBreakdownItem[];
  /** Smaller tile without subtitle, breakdown and sparkline. */
  compact?: boolean;
  /** Makes the card a toggle (e.g. a list filter). */
  onClick?: () => void;
  selected?: boolean;
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  accentColor: accentColorProp,
  trend,
  subtitle,
  progress,
  variant = "solid",
  sparkline,
  target,
  breakdown,
  compact,
  onClick,
  selected,
}) => {
  const colorTheme = useColorTheme();
  const accentColor = accentColorProp || colorTheme.accents.brand;
  const pct = (v: number): number =>
    progress && progress.max > 0
      ? Math.max(0, Math.min((v / progress.max) * 100, 100))
      : 0;
  const hasDetails = !!subtitle || (!!breakdown && breakdown.length > 0);
  return (
    <div
      className={`${styles.kpiCard} ${variant === "glass" ? styles.glass : ""} ${
        compact ? styles.compact : ""
      } ${onClick ? styles.clickable : ""} ${selected ? styles.selected : ""}`}
      style={{ "--kpi-accent": accentColor } as React.CSSProperties}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-pressed={onClick ? !!selected : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className={styles.accentBar} style={{ background: accentColor }} />

      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        {icon && (
          <div
            className={styles.iconBox}
            style={{ background: `${accentColor}14`, color: accentColor }}
          >
            {icon}
          </div>
        )}
      </div>

      <div className={styles.valueRow}>
        <span className={styles.value}>{value}</span>
        {trend && (
          <span className={`${styles.trend} ${styles[trend.direction]}`}>
            {trend.direction === "up"
              ? "▲"
              : trend.direction === "down"
                ? "▼"
                : null}
            {trend.value}
          </span>
        )}
      </div>

      {target && !progress && (
        <div
          className={`${styles.targetText} ${styles.targetLine} ${TONE_CLASS[target.tone]}`}
        >
          <span className={styles.targetDot} />
          {target.label}
        </div>
      )}

      {hasDetails && (
        <div
          className={`${styles.details} ${compact ? styles.detailsCollapsed : ""}`}
          aria-hidden={compact || undefined}
        >
          <div className={styles.detailsInner}>
            {subtitle && <div className={styles.subtitle}>{subtitle}</div>}

            {breakdown && breakdown.length > 0 && (
              <div className={styles.breakdown}>
                {breakdown.map((row) => (
                  <div key={row.label} className={styles.breakdownRow}>
                    <span className={styles.breakdownLabel}>
                      {row.color && (
                        <span
                          className={styles.breakdownDot}
                          style={{ background: row.color }}
                        />
                      )}
                      {row.label}
                    </span>
                    <span
                      className={`${styles.breakdownValue} ${row.tone ? TONE_CLASS[row.tone] : ""}`}
                    >
                      {row.value}
                    </span>
                    {row.hint && (
                      <span className={styles.breakdownHint}>{row.hint}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!compact && sparkline && (
        <div className={styles.sparkline}>{sparkline}</div>
      )}

      {progress && (
        <div
          className={`${styles.meter} ${target ? TONE_CLASS[target.tone] : ""}`}
        >
          <div className={styles.meterTrack}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width: `${pct(progress.value)}%`,
                  background: target ? "var(--tone-color)" : accentColor,
                }}
              />
            </div>
            {target && target.at !== undefined && (
              <span
                className={styles.targetMarker}
                style={{ left: `${pct(target.at)}%` }}
              />
            )}
          </div>
          {target && <span className={styles.targetText}>{target.label}</span>}
        </div>
      )}
    </div>
  );
};
