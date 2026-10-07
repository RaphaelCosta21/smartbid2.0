import * as React from "react";
import { FileStack, PenLine } from "lucide-react";
import { ClarificationBaseType } from "../../models/IClarificationDb";
import { useConfigStore } from "../../stores/useConfigStore";
import {
  allCategoryOptions,
  configOptionLabel,
} from "../../utils/clarificationHelpers";
import styles from "./ClarificationBadges.module.scss";

export const ClarificationTypeBadge: React.FC<{
  type?: ClarificationBaseType | string;
}> = ({ type }) => {
  const isQual = type === "Qualification";
  return (
    <span
      className={`${styles.typeBadge} ${isQual ? styles.typeQualification : styles.typeClarification}`}
    >
      {isQual ? "Qualification" : "Clarification"}
    </span>
  );
};

/** Category value from systemConfig clarification/qualification categories, tinted with its configured color. */
export const ClarificationCategoryChip: React.FC<{
  category: string;
  emptyLabel?: string;
}> = ({ category, emptyLabel = "-" }) => {
  const config = useConfigStore((s) => s.config);
  if (!category) return <span className={styles.empty}>{emptyLabel}</span>;
  const list = allCategoryOptions(config);
  const opt = list.find((o) => o.value === category || o.label === category);
  const style = opt?.color
    ? ({ "--chip-color": opt.color } as React.CSSProperties)
    : undefined;
  return (
    <span
      className={`${styles.categoryChip} ${opt?.color ? styles.categoryTinted : ""}`}
      style={style}
    >
      {configOptionLabel(list, category)}
    </span>
  );
};

/** "BID xxx" for rows synced from a BID, "Manual" for rows created in the library. */
export const ClarificationOriginChip: React.FC<{
  sourceBidNumber?: string;
}> = ({ sourceBidNumber }) =>
  sourceBidNumber ? (
    <span
      className={`${styles.originChip} ${styles.originBid}`}
      title={`Synced from BID ${sourceBidNumber}`}
    >
      <FileStack size={11} />
      {sourceBidNumber}
    </span>
  ) : (
    <span className={styles.originChip} title="Created manually in the library">
      <PenLine size={11} />
      Manual
    </span>
  );
