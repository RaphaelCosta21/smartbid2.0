import * as React from "react";
import styles from "./GlassCard.module.scss";

interface GlassCardProps {
  title?: string;
  titleIcon?: React.ReactNode;
  subtitle?: string;
  /** Right-aligned header content (view toggles, menus, export). */
  actions?: React.ReactNode;
  /** Thin gradient accent bar along the top edge. */
  accentColor?: string;
  /** Adds a lift/press affordance for clickable cards. */
  interactive?: boolean;
  /** Removes the default body padding (e.g. for edge-to-edge tables). */
  noBodyPadding?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  titleIcon,
  subtitle,
  actions,
  accentColor,
  interactive,
  noBodyPadding,
  children,
  className,
}) => {
  const hasHeader = !!title || !!actions || !!subtitle;

  return (
    <div
      className={`${styles.glassCard} ${interactive ? styles.interactive : ""} ${
        noBodyPadding ? styles.flush : ""
      } ${className || ""}`}
    >
      {accentColor && (
        <span className={styles.accent} style={{ background: accentColor }} />
      )}

      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.titleBlock}>
            {title && (
              <h3 className={styles.cardTitle}>
                {titleIcon}
                {title}
              </h3>
            )}
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          {actions && <div className={styles.actions}>{actions}</div>}
        </div>
      )}

      {children}
    </div>
  );
};
