import * as React from "react";
import { ClarificationCategoryChip } from "../knowledge/ClarificationBadges";
import styles from "./QualificationGroupList.module.scss";

export interface IQualificationPickRow {
  id: string;
  category: string;
  qualification: string;
  /** Muted line under the text (e.g. the AI rationale) */
  note?: string;
  /** Row cannot be picked; the label explains why */
  lockedLabel?: string;
}

export interface IQualificationPickGroup {
  key: string;
  title: string;
  /** Chips shown next to the table title */
  meta?: React.ReactNode;
  rows: IQualificationPickRow[];
}

export interface QualificationGroupListProps {
  groups: IQualificationPickGroup[];
  selected: Record<string, boolean>;
  onChange: (next: Record<string, boolean>) => void;
}

/** Qualification tables with a tri-state checkbox per table and one per row. */
export const QualificationGroupList: React.FC<QualificationGroupListProps> = ({
  groups,
  selected,
  onChange,
}) => {
  const toggleRow = (id: string): void =>
    onChange({ ...selected, [id]: !selected[id] });

  const toggleGroup = (group: IQualificationPickGroup, on: boolean): void => {
    const next = { ...selected };
    group.rows.forEach((r) => {
      if (!r.lockedLabel) next[r.id] = on;
    });
    onChange(next);
  };

  return (
    <div className={styles.groups}>
      {groups.map((g) => {
        const pickable = g.rows.filter((r) => !r.lockedLabel);
        const count = pickable.filter((r) => selected[r.id]).length;
        const all = pickable.length > 0 && count === pickable.length;
        return (
          <section key={g.key} className={styles.group}>
            <label className={styles.groupHead}>
              <input
                type="checkbox"
                checked={all}
                disabled={pickable.length === 0}
                ref={(el) => {
                  if (el) el.indeterminate = count > 0 && !all;
                }}
                onChange={() => toggleGroup(g, !all)}
                aria-label={`Select the whole table ${g.title}`}
              />
              <span className={styles.groupTitle}>{g.title}</span>
              {g.meta}
              <span className={styles.groupCount}>
                {count} of {pickable.length} selected
              </span>
            </label>
            <div className={styles.rows}>
              {g.rows.map((r, i) => {
                const locked = !!r.lockedLabel;
                const on = !locked && !!selected[r.id];
                return (
                  <label
                    key={r.id}
                    className={`${styles.row} ${on ? styles.rowSelected : ""} ${locked ? styles.rowLocked : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={on}
                      disabled={locked}
                      onChange={() => toggleRow(r.id)}
                    />
                    <span className={styles.itemNo}>{i + 1}</span>
                    <span className={styles.rowBody}>
                      <span className={styles.rowMeta}>
                        <ClarificationCategoryChip
                          category={r.category}
                          emptyLabel="No category"
                        />
                        {locked && (
                          <span className={styles.lockedPill}>
                            {r.lockedLabel}
                          </span>
                        )}
                      </span>
                      <span className={styles.text}>{r.qualification}</span>
                      {r.note && <span className={styles.note}>{r.note}</span>}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
};
