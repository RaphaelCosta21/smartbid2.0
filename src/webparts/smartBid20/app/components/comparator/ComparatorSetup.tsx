/**
 * ComparatorSetup — picks the BID being quoted, the earlier BIDs to measure it against and
 * how loosely descriptions may match when part numbers don't settle it.
 */
import * as React from "react";
import { COMPARATOR_CONFIG } from "../../config/comparator.config";
import { BidSelect, IBidOption, MultiBidSelect } from "../common/BidSelect";
import { GlassCard } from "../common/GlassCard";
import styles from "./ComparatorSetup.module.scss";

export interface ComparatorSetupProps {
  options: IBidOption[];
  newBid: string;
  histBids: string[];
  threshold: number;
  /** Items in the BID being quoted, shown once it is picked */
  newItemCount: number;
  running: boolean;
  onNewBid: (bidNumber: string) => void;
  onToggleHist: (bidNumber: string) => void;
  onClearHist: () => void;
  onThreshold: (pct: number) => void;
  onCompare: () => void;
}

export const ComparatorSetup: React.FC<ComparatorSetupProps> = ({
  options,
  newBid,
  histBids,
  threshold,
  newItemCount,
  running,
  onNewBid,
  onToggleHist,
  onClearHist,
  onThreshold,
  onCompare,
}) => {
  const histOptions = React.useMemo(
    () => options.filter((o) => o.bidNumber !== newBid),
    [options, newBid],
  );
  const ready = !!newBid && histBids.length > 0;

  return (
    <GlassCard
      title="Compare BIDs"
      subtitle="See where you saved, where you spend more and what changed in scope. Items are paired by part number first, then by description similarity."
    >
      <div className={styles.grid}>
        <div className={styles.step}>
          <div className={styles.eyebrow}>1 · BID being quoted</div>
          <BidSelect options={options} value={newBid} onChange={onNewBid} />
          {newBid && (
            <p className={styles.note}>{newItemCount} item(s) in this BID.</p>
          )}
        </div>

        <div className={styles.step}>
          <div className={styles.eyebrow}>2 · Earlier BIDs (baseline)</div>
          <MultiBidSelect
            options={histOptions}
            values={histBids}
            onToggle={onToggleHist}
            onClear={onClearHist}
            placeholder="Select earlier BIDs…"
          />
        </div>

        <div className={styles.step}>
          <div className={styles.eyebrow}>
            3 · Description match - {threshold}%
          </div>
          <input
            type="range"
            className={styles.slider}
            min={COMPARATOR_CONFIG.minThresholdPct}
            max={COMPARATOR_CONFIG.maxThresholdPct}
            step={COMPARATOR_CONFIG.thresholdStepPct}
            value={threshold}
            onChange={(e) => onThreshold(Number(e.target.value))}
            aria-label="Minimum description similarity"
          />
          <p className={styles.note}>
            Minimum similarity to pair items that share no part number. Lower
            finds more matches, higher is stricter.
          </p>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.primary}
          disabled={!ready || running}
          onClick={onCompare}
        >
          {running ? "Comparing…" : "Compare now"}
        </button>
        {!ready && (
          <span className={styles.note}>
            {newBid
              ? "Pick at least one earlier BID."
              : "Pick the BID being quoted first."}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
