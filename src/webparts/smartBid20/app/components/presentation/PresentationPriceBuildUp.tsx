/**
 * PresentationPriceBuildUp — the BID total told as a story: each cost category adds to the
 * running total (waterfall). A step opens the lines behind it.
 */
import * as React from "react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { PriceStepKey } from "../../utils/presentationView";
import { GlassCard } from "../common/GlassCard";
import { WaterfallChart } from "../charts/WaterfallChart";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationPriceBuildUp.module.scss";

export interface PresentationPriceBuildUpProps {
  model: IPresentationModel;
  selectedStep: PriceStepKey | null;
  onSelectStep: (step: PriceStepKey) => void;
  chartRef?: React.Ref<HTMLDivElement>;
}

export const PresentationPriceBuildUp: React.FC<
  PresentationPriceBuildUpProps
> = ({ model, selectedStep, onSelectStep, chartRef }) => {
  const { steps, colors, money, moneyCompact, totalUSD, display } = model;
  const theme = colors.theme;
  const scale = display.rate;

  return (
    <GlassCard
      title="How the price is built"
      subtitle="Click a step to see what's inside"
      className={`${tile.tile} ${tile.tileBuild}`}
    >
      <div className={tile.body}>
        {steps.length === 0 ? (
          <p className={tile.empty}>No costs registered for this BID yet.</p>
        ) : (
          <div className={styles.chart} ref={chartRef}>
          <WaterfallChart
            steps={steps.map((s) => ({
              key: s.key,
              label: s.label,
              value: s.usd * scale,
              color: colors.step[s.key],
            }))}
            total={{
              label: "Total",
              value: totalUSD * scale,
              color: theme.accent,
              colorTo: theme.accentSecondary,
            }}
            formatLabel={(v) => moneyCompact(v / scale)}
            formatValue={(v) => money(v / scale)}
            height={218}
            selectedKey={selectedStep}
            onSelect={(key) => onSelectStep(key as PriceStepKey)}
            mutedColor={theme.textMuted}
            gridColor={theme.grid}
            labelColor={theme.textSecondary}
            textColor={theme.textPrimary}
          />
          </div>
        )}
      </div>
    </GlassCard>
  );
};
