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
  /** Material: default glass, a lighter "subtle" tile, or a static "liquid" anchor surface. */
  variant?: "default" | "subtle" | "liquid";
  children: React.ReactNode;
  className?: string;
}

const VARIANT_CLASS: Record<string, string> = {
  subtle: styles.subtle,
  liquid: styles.liquid,
};

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  titleIcon,
  subtitle,
  actions,
  accentColor,
  interactive,
  noBodyPadding,
  variant,
  children,
  className,
}) => {
  const hasHeader = !!title || !!actions || !!subtitle;

  return (
    <div
      className={`${styles.glassCard} ${(variant && VARIANT_CLASS[variant]) || ""} ${
        interactive ? styles.interactive : ""
      } ${noBodyPadding ? styles.flush : ""} ${className || ""}`}
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
