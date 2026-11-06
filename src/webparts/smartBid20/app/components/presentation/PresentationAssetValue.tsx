/**
 * PresentationAssetValue — where the asset money sits: a treemap by resource type that
 * drills into its items (the Top items list follows the same selection), or the Pareto.
 */
import * as React from "react";
import { ChevronRight } from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { buildParetoRows } from "../../utils/bidPresentation";
import { formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { ParetoChart } from "../charts/ParetoChart";
import { TREEMAP_OTHER_KEY, TreemapChart } from "../charts/TreemapChart";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationAssetValue.module.scss";

type AssetMode = "map" | "pareto";

export interface PresentationAssetValueProps {
  model: IPresentationModel;
  /** Resource type drilled into; null = all types */
  category: string | null;
  onCategory: (category: string | null) => void;
  onOpenItem: (key: string, list: string[]) => void;
  onOpenAssets: (category: string | null) => void;
  chartRef?: React.Ref<HTMLDivElement>;
}

const CHART_HEIGHT = 352;

export const PresentationAssetValue: React.FC<PresentationAssetValueProps> = ({
  model,
  category,
  onCategory,
  onOpenItem,
  onOpenAssets,
  chartRef,
}) => {
  const { assetGroups, ranked, colors, money, display } = model;
  const [mode, setMode] = React.useState<AssetMode>("map");

  const scoped = React.useMemo(
    () => (category ? ranked.filter((i) => i.category === category) : ranked),
    [ranked, category],
  );
  const scopedKeys = React.useMemo(() => scoped.map((i) => i.key), [scoped]);

  const nodes = React.useMemo(() => {
    if (!category) {
      return assetGroups.map((g) => ({
        key: g.category,
        label: g.category,
        value: g.usd,
        color: colors.category(g.category),
        sub: `${formatNumber(g.items.length)} ${g.items.length === 1 ? "item" : "items"}`,
      }));
    }
    const color = colors.category(category);
    return scoped.map((i) => ({
      key: i.key,
      label: i.description || i.partNumber || "(no description)",
      value: i.totalUSD,
      color,
      sub: i.acquisition,
    }));
  }, [category, assetGroups, scoped, colors]);

  const paretoRows = React.useMemo(
    () => buildParetoRows(scoped, 0, display.rate),
    [scoped, display.rate],
  );

  const onTile = (key: string): void => {
    if (!category) {
      if (key === TREEMAP_OTHER_KEY) onOpenAssets(null);
      else onCategory(key);
      return;
    }
    if (key === TREEMAP_OTHER_KEY) onOpenAssets(category);
    else onOpenItem(key, scopedKeys);
  };

  const crumbs = (
    <span className={styles.crumbs}>
      {category ? (
        <>
          <button
            type="button"
            className={styles.crumbBtn}
            onClick={() => onCategory(null)}
          >
            All resource types
          </button>
          <ChevronRight size={12} />
          <span
            className={styles.crumbCurrent}
            style={{ color: colors.category(category) }}
          >
            {category}
          </span>
        </>
      ) : (
        <span>
          {assetGroups.length} resource types · click one to drill in
        </span>
      )}
    </span>
  );

  return (
    <GlassCard
      title="Where the asset value is"
      className={`${tile.tile} ${tile.tileAssets}`}
      actions={
        <div className={tile.toggle} role="tablist" aria-label="Chart">
          {(
            [
              ["map", "Map"],
              ["pareto", "Pareto"],
            ] as [AssetMode, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={mode === key}
              className={`${tile.toggleBtn} ${mode === key ? tile.toggleActive : ""}`}
              onClick={() => setMode(key)}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      <div className={tile.body}>
        {crumbs}
        {ranked.length === 0 ? (
          <p className={tile.empty}>No priced asset items yet.</p>
        ) : (
          <div ref={chartRef} className={styles.chart}>
            {mode === "map" ? (
              <TreemapChart
                nodes={nodes}
                formatValue={money}
                height={CHART_HEIGHT - 24}
                otherColor={colors.theme.textMuted}
                onSelect={onTile}
              />
            ) : (
              <ParetoChart
                data={paretoRows}
                currency={display.currency}
                height={CHART_HEIGHT - 24}
                onSelect={(key) => onOpenItem(key, scopedKeys)}
              />
            )}
          </div>
        )}
      </div>
    </GlassCard>
  );
};
