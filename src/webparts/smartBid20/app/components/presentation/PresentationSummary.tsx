/**
 * PresentationSummary — the closing sections of the BID Presentation: how the cost splits
 * (CAPEX/OPEX and acquisition type), how items are supplied, and the labor effort.
 */
import * as React from "react";
import {
  acquisitionToken,
  groupByAcquisition,
  IHoursByPhase,
  IPresentationItem,
  IPresentationStats,
} from "../../utils/bidPresentation";
import { formatCurrency, formatNumber } from "../../utils/formatters";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { ProgressBar } from "../common/ProgressBar";
import styles from "./PresentationSummary.module.scss";

type DisplayCurrency = { currency: "USD" | "BRL"; rate: number };

// ─── Composition: CAPEX vs OPEX and cost by acquisition type ───

export const PresentationComposition: React.FC<{
  items: IPresentationItem[];
  stats: IPresentationStats;
  displayCurrency: DisplayCurrency;
}> = ({ items, stats, displayCurrency }) => {
  const { currency, rate } = displayCurrency;
  const fmt = (usd: number): string => formatCurrency(usd * rate, currency);

  const mix = React.useMemo(
    () =>
      groupByAcquisition(items)
        .filter((g) => g.valueUSD > 0)
        .sort((a, b) => b.valueUSD - a.valueUSD)
        .slice(0, 6),
    [items],
  );
  const mixTotal = mix.reduce((s, g) => s + g.valueUSD, 0) || 1;
  const split = stats.capexUSD + stats.opexUSD || 1;

  return (
    <GlassCard title="Composition" subtitle="How the cost is distributed">
      <div className={styles.twoCols}>
        <div>
          <div className={styles.eyebrow}>CAPEX vs. OPEX</div>
          <div className={styles.stack}>
            <div
              className={styles.segment}
              style={{
                width: `${(stats.capexUSD / split) * 100}%`,
                background: "var(--primary-accent)",
              }}
            />
            <div
              className={styles.segment}
              style={{
                width: `${(stats.opexUSD / split) * 100}%`,
                background: "var(--secondary-accent)",
              }}
            />
          </div>
          <div className={styles.legend}>
            <span>
              <i style={{ background: "var(--primary-accent)" }} /> CAPEX{" "}
              {fmt(stats.capexUSD)}
            </span>
            <span>
              <i style={{ background: "var(--secondary-accent)" }} /> OPEX{" "}
              {fmt(stats.opexUSD)}
            </span>
          </div>
        </div>

        <div>
          <div className={styles.eyebrow}>Composition by acquisition type</div>
          {mix.length === 0 ? (
            <p className={styles.empty}>No priced items.</p>
          ) : (
            <div className={styles.rows}>
              {mix.map((g) => (
                <div key={g.label}>
                  <div className={styles.rowHead}>
                    <span>{g.label}</span>
                    <span className={styles.muted}>
                      {fmt(g.valueUSD)} ·{" "}
                      {((g.valueUSD / mixTotal) * 100).toFixed(0)}%
                    </span>
                  </div>
                  <ProgressBar
                    value={g.valueUSD}
                    max={mix[0].valueUSD}
                    color={acquisitionToken(g.label)}
                    height={6}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};

// ─── Acquisition mix: how many items per supply mode ───

export const PresentationAcquisitionMix: React.FC<{
  items: IPresentationItem[];
  displayCurrency: DisplayCurrency;
}> = ({ items, displayCurrency }) => {
  const { currency, rate } = displayCurrency;
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const groups = React.useMemo(() => groupByAcquisition(items), [items]);

  return (
    <GlassCard
      title="Acquisition mix"
      subtitle="Share and count of items by supply mode (in house, purchase, rental…). Click a group to see its items."
    >
      {groups.length === 0 ? (
        <p className={styles.empty}>No acquisition items for this BID.</p>
      ) : (
        <>
          <div className={styles.stack}>
            {groups.map((g) => (
              <div
                key={g.label}
                className={styles.segment}
                style={{
                  width: `${g.pct}%`,
                  background: acquisitionToken(g.label),
                }}
                title={`${g.label}: ${g.count} item(s) · ${g.pct.toFixed(1)}%`}
              />
            ))}
          </div>
          <div className={styles.groups}>
            {groups.map((g) => {
              const open = expanded === g.label;
              return (
                <div key={g.label} className={styles.group}>
                  <button
                    type="button"
                    className={styles.groupHead}
                    onClick={() => setExpanded(open ? null : g.label)}
                    aria-expanded={open}
                  >
                    <i style={{ background: acquisitionToken(g.label) }} />
                    <span className={styles.groupName}>{g.label}</span>
                    <span className={styles.groupMeta}>
                      <strong>{g.pct.toFixed(1)}%</strong>
                      <span className={styles.count}>
                        {g.count} {g.count === 1 ? "item" : "items"}
                      </span>
                      <span className={styles.muted} aria-hidden>
                        {open ? "▲" : "▼"}
                      </span>
                    </span>
                  </button>
                  {open && (
                    <div className={styles.groupBody}>
                      {g.valueUSD > 0 && (
                        <div className={styles.muted}>
                          Group total value:{" "}
                          {formatCurrency(g.valueUSD * rate, currency)}
                        </div>
                      )}
                      {g.items.map((it) => (
                        <div key={it.key} className={styles.itemRow}>
                          <span
                            className={styles.itemName}
                            title={it.description}
                          >
                            {it.description || "(no description)"}
                            {it.hasPn && (
                              <span className={styles.muted}>
                                {" "}
                                · {it.partNumber}
                              </span>
                            )}
                          </span>
                          <span className={styles.muted}>
                            {it.totalUSD > 0
                              ? formatCurrency(it.totalUSD * rate, currency)
                              : "—"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </GlassCard>
  );
};

// ─── Hours: labor effort by phase ───

export const PresentationHours: React.FC<{
  rows: IHoursByPhase[];
  totalHours: number;
  roles: number;
}> = ({ rows, totalHours, roles }) => (
  <GlassCard title="Effort" subtitle="Hours & labor summary">
    {totalHours <= 0 ? (
      <p className={styles.empty}>No labor data for this BID.</p>
    ) : (
      <>
        <div className={styles.kpis}>
          <KPICard
            variant="glass"
            label="Total hours"
            value={`${formatNumber(Math.round(totalHours))} hh`}
            accentColor="var(--primary-accent)"
          />
          <KPICard
            variant="glass"
            label="Distinct roles"
            value={formatNumber(roles)}
            accentColor="var(--secondary-accent)"
          />
          <KPICard
            variant="glass"
            label="Phases"
            value={formatNumber(rows.length)}
            accentColor="var(--secondary-accent)"
          />
        </div>
        <div className={styles.rows}>
          {rows.map((r) => (
            <div key={r.phase}>
              <div className={styles.rowHead}>
                <span>{r.phase}</span>
                <span className={styles.muted}>
                  {formatNumber(Math.round(r.hours))} hh ·{" "}
                  {((r.hours / totalHours) * 100).toFixed(0)}%
                </span>
              </div>
              <ProgressBar
                value={r.hours}
                max={rows[0].hours}
                color="var(--primary-accent)"
                height={7}
              />
            </div>
          ))}
        </div>
      </>
    )}
  </GlassCard>
);
