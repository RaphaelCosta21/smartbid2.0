import * as React from "react";
import styles from "./KPICard.module.scss";

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  accentColor?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  subtitle?: string;
  progress?: { value: number; max: number };
}

export const KPICard: React.FC<KPICardProps> = ({
  label,
  value,
  icon,
  accentColor = "#00c9a7",
  trend,
  subtitle,
  progress,
}) => {
  return (
    <div className={styles.kpiCard}>
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
                : "—"}
            {trend.value}
          </span>
        )}
      </div>

      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}

      {progress && (
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${Math.min((progress.value / progress.max) * 100, 100)}%`,
              background: accentColor,
            }}
          />
        </div>
      )}
    </div>
  );
};
