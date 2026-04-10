import * as React from "react";
import styles from "./SkeletonLoader.module.scss";

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  count?: number;
  className?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = "100%",
  height = 20,
  borderRadius = 8,
  count = 1,
  className,
}) => {
  return (
    <div className={`${styles.container} ${className || ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.bar}
          style={{ width, height, borderRadius }}
        />
      ))}
    </div>
  );
};
