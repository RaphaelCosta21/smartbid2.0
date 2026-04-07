import * as React from "react";
import styles from "./GlassCard.module.scss";

interface GlassCardProps {
  title?: string;
  titleIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  title,
  titleIcon,
  children,
  className,
}) => {
  return (
    <div className={`${styles.glassCard} ${className || ""}`}>
      {title && (
        <h3 className={styles.cardTitle}>
          {titleIcon}
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
