/**
 * PresentationSupplyCards — how the scope is supplied (purchase, rental, in house…):
 * one card per mode, joined by a thin 100% bar. A card opens its items.
 */
import * as React from "react";
import {
  Ban,
  CalendarRange,
  CircleHelp,
  Home,
  Ship,
  ShoppingCart,
  Wrench,
} from "lucide-react";
import { IPresentationModel } from "../../hooks/usePresentationModel";
import { acquisitionToken, normalizeText } from "../../utils/bidPresentation";
import { formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import tile from "./PresentationTile.module.scss";
import styles from "./PresentationSupplyCards.module.scss";

export interface PresentationSupplyCardsProps {
  model: IPresentationModel;
  onSelect: (label: string) => void;
}

type Measure = "value" | "count";

function acquisitionIcon(label: string): React.ReactNode {
  const n = normalizeText(label);
  if (n.indexOf("purchase") !== -1) return <ShoppingCart size={16} />;
  if (n.indexOf("rental") !== -1) return <CalendarRange size={16} />;
  if (n.indexOf("in house") !== -1 || n.indexOf("in-house") !== -1) {
    return <Home size={16} />;
  }
  if (n.indexOf("onboard") !== -1) return <Ship size={16} />;
  if (n.indexOf("workshop") !== -1) return <Wrench size={16} />;
  if (n.indexOf("not available") !== -1 || n.indexOf("not offered") !== -1) {
    return <Ban size={16} />;
  }
  return <CircleHelp size={16} />;
}

export const PresentationSupplyCards: React.FC<
  PresentationSupplyCardsProps
> = ({ model, onSelect }) => {
  const { acquisitionGroups: groups, items, money } = model;
  const [measure, setMeasure] = React.useState<Measure>("value");
  const totalValue = groups.reduce((s, g) => s + g.valueUSD, 0);
  const useValue = measure === "value" && totalValue > 0;
  const share = (value: number, count: number): number =>
    useValue
      ? (value / totalValue) * 100
      : items.length > 0
        ? (count / items.length) * 100
        : 0;
  const ordered = groups
    .slice()
    .sort((a, b) =>
      useValue ? b.valueUSD - a.valueUSD : b.count - a.count,
    );

  return (
    <GlassCard
      title="How it's supplied"
      subtitle="Asset items by acquisition mode"
      className={`${tile.tile} ${tile.tileSupply}`}
      actions={
        <div className={tile.toggle} role="tablist" aria-label="Measure">
          {(
            [
              ["value", "Value"],
              ["count", "Items"],
            ] as [Measure, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={measure === key}
              className={`${tile.toggleBtn} ${measure === key ? tile.toggleActive : ""}`}
              onClick={() => setMeasure(key)}
            >
              {label}
            </button>
          ))}
        </div>
      }
    >
      <div className={tile.body}>
        {groups.length === 0 ? (
          <p className={tile.empty}>No asset items in this BID yet.</p>
        ) : (
          <>
            <div className={styles.bar} aria-hidden>
              {ordered.map((g) => {
                const pct = share(g.valueUSD, g.count);
                return pct > 0 ? (
                  <span
                    key={g.label}
                    style={{
                      width: `${pct}%`,
                      background: acquisitionToken(g.label),
                    }}
                  />
                ) : null;
              })}
            </div>
            <div className={`${tile.scroll} ${styles.grid}`}>
              {ordered.map((g) => {
                const token = acquisitionToken(g.label);
                const pct = share(g.valueUSD, g.count);
                return (
                  <button
                    key={g.label}
                    type="button"
                    className={styles.card}
                    onClick={() => onSelect(g.label)}
                    style={{ "--mode-color": token } as React.CSSProperties}
                  >
                    <span className={styles.icon}>{acquisitionIcon(g.label)}</span>
                    <span className={styles.name} title={g.label}>
                      {g.label}
                    </span>
                    <span className={styles.pct}>{pct.toFixed(0)}%</span>
                    <span className={styles.value}>
                      {g.valueUSD > 0 ? money(g.valueUSD) : "No cost"}
                    </span>
                    <span className={styles.count}>
                      {formatNumber(g.count)} {g.count === 1 ? "item" : "items"}
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </GlassCard>
  );
};
