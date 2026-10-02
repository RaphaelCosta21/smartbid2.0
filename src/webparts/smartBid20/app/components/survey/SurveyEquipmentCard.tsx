import * as React from "react";
import { Plus, Check, Radio } from "lucide-react";
import { ISurveyEquipment } from "../../models";
import styles from "./SurveyEquipmentCard.module.scss";

interface SurveyEquipmentCardProps {
  equipment: ISurveyEquipment;
  selected: boolean;
  inPackage: boolean;
  /** Not considered in the BID compared in the header (shown grey). */
  outOfBid?: boolean;
  onSelect: () => void;
  onAdd: () => void;
}

export const SurveyEquipmentPhoto: React.FC<{
  equipment: ISurveyEquipment;
  size: number;
}> = ({ equipment, size }) => {
  const [failed, setFailed] = React.useState(false);
  const hasImage = !!equipment.imageUrl && !failed;
  return (
    <span className={styles.photoWrap} style={{ width: size, height: size }}>
      <span className={styles.photoCircle} />
      {hasImage ? (
        <img
          className={styles.photoImg}
          src={equipment.imageUrl as string}
          alt={equipment.title}
          onError={() => setFailed(true)}
        />
      ) : (
        <Radio className={styles.photoIcon} size={size * 0.4} />
      )}
    </span>
  );
};

export const SurveyEquipmentCard: React.FC<SurveyEquipmentCardProps> = ({
  equipment,
  selected,
  inPackage,
  outOfBid,
  onSelect,
  onAdd,
}) => (
  <div
    className={`${styles.card} ${selected ? styles.selected : ""} ${outOfBid ? styles.outOfBid : ""}`}
    title={outOfBid ? "Not considered in the BID" : undefined}
    role="button"
    tabIndex={0}
    onClick={onSelect}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect();
      }
    }}
  >
    <div className={styles.photo}>
      <SurveyEquipmentPhoto equipment={equipment} size={80} />
    </div>
    <span className={styles.tech}>{equipment.technology}</span>
    <span className={styles.title}>{equipment.title}</span>
    {equipment.aliases.length > 0 && (
      <div className={styles.alias}>
        <span className={styles.aliasLabel}>ALSO KNOWN AS</span>
        <span className={styles.aliasLine} />
        {equipment.aliases.slice(0, 2).map((a) => (
          <span key={a} className={styles.aliasChip}>
            {a}
          </span>
        ))}
      </div>
    )}
    <div className={styles.footer}>
      <span className={styles.summary}>{equipment.summary}</span>
      <span className={styles.explore}>EXPLORE →</span>
    </div>
    <button
      className={`${styles.addBtn} ${inPackage ? styles.addBtnIn : ""}`}
      title={inPackage ? "In bid package — add more" : "Add to bid package"}
      aria-label={`Add ${equipment.title} to bid package`}
      onClick={(e) => {
        e.stopPropagation();
        onAdd();
      }}
    >
      {inPackage ? <Check size={14} /> : <Plus size={16} />}
    </button>
  </div>
);
