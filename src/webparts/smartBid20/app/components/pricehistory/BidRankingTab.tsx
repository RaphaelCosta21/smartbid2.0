/**
 * BidRankingTab — where one BID's cost sits: the Pareto of its items, the biggest CAPEX and
 * OPEX contributors, cost by category and the services and sub-items behind the equipment.
 */
import * as React from "react";
import { IBid } from "../../models";
import {
  buildParetoRows,
  buildPresentationItems,
  computeStats,
  rankItems,
} from "../../utils/bidPresentation";
import {
  buildAccessoryRows,
  IAccessoryRow,
  IRankRow,
  isNoCostItem,
  rankByBucket,
  rankByCategory,
} from "../../utils/priceHistory";
import { formatCurrency } from "../../utils/formatters";
import { ParetoChart } from "../charts/ParetoChart";
import { BidSelect, buildBidOptions } from "../common/BidSelect";
import { DataTable } from "../common/DataTable";
import { EmptyState } from "../common/EmptyState";
import { GlassCard } from "../common/GlassCard";
import { KPICard } from "../common/KPICard";
import { ProgressBar } from "../common/ProgressBar";
import { SegmentedTabs } from "../common/SegmentedTabs";
import styles from "./BidRankingTab.module.scss";

type RankView = "pareto" | "capex" | "opex" | "categories" | "accessories";

const PARETO_ROWS = 30;
const RANK_ROWS = 15;
const usd = (v: number): string => formatCurrency(v, "USD");

const RankBars: React.FC<{ rows: IRankRow[]; token: string }> = ({
  rows,
  token,
}) => {
  const max = rows.length ? rows[0].valueUSD : 1;
  return (
    <div className={styles.rank}>
      {rows.map((r) => (
        <div
          key={r.key}
          className={styles.rankRow}
          title={`${r.label}\n${usd(r.valueUSD)} (${r.pctOfBid.toFixed(1)}% of the BID)`}
        >
          <div className={styles.rankLabel}>{r.label}</div>
          <ProgressBar value={r.valueUSD} max={max} color={token} height={10} />
          <div className={styles.rankValue}>
            {usd(r.valueUSD)} ({r.pctOfBid.toFixed(1)}%)
          </div>
        </div>
      ))}
    </div>
  );
};

export interface BidRankingTabProps {
  /** BIDs that have an Assets Breakdown */
  bids: IBid[];
}

export const BidRankingTab: React.FC<BidRankingTabProps> = ({ bids }) => {
  const options = React.useMemo(() => buildBidOptions(bids), [bids]);
  const [selBid, setSelBid] = React.useState(
    options.length ? options[0].bidNumber : "",
  );
  const [hidden, setHidden] = React.useState<string[]>([]);
  const [view, setView] = React.useState<RankView>("pareto");

  React.useEffect(() => setHidden([]), [selBid]);

  const bid = bids.find((b) => b.bidNumber === selBid);
  const allItems = React.useMemo(
    () => (bid ? buildPresentationItems(bid) : []),
    [bid],
  );
  const modes = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    const out: string[] = [];
    allItems.forEach((i) => {
      if (!seen[i.acquisition]) {
        seen[i.acquisition] = true;
        out.push(i.acquisition);
      }
    });
    return out.sort();
  }, [allItems]);
  const items = React.useMemo(
    () => allItems.filter((i) => hidden.indexOf(i.acquisition) === -1),
    [allItems, hidden],
  );

  const stats = React.useMemo(() => computeStats(items), [items]);
  const missing = React.useMemo(
    () => items.filter((i) => i.missingCost),
    [items],
  );
  const noCostCount = items.filter(isNoCostItem).length;

  const paretoAll = React.useMemo(
    () => buildParetoRows(rankItems(items), 0, 1),
    [items],
  );
  const n80Index = paretoAll.findIndex((r) => r.pct >= 80);
  const n80 = n80Index === -1 ? paretoAll.length : n80Index + 1;
  const n80Value = paretoAll.slice(0, n80).reduce((s, r) => s + r.value, 0);
  const paretoTotal = paretoAll.reduce((s, r) => s + r.value, 0);

  const capexRows = React.useMemo(
    () => rankByBucket(items, "capexUSD", stats.totalUSD, RANK_ROWS),
    [items, stats.totalUSD],
  );
  const opexRows = React.useMemo(
    () => rankByBucket(items, "opexUSD", stats.totalUSD, RANK_ROWS),
    [items, stats.totalUSD],
  );
  const categoryRows = React.useMemo(
    () => rankByCategory(items, stats.totalUSD),
    [items, stats.totalUSD],
  );
  const accessoryRows = React.useMemo(
    () => (bid && view === "accessories" ? buildAccessoryRows(bid, items) : []),
    [bid, items, view],
  );
  const accessoryTotal = accessoryRows.reduce((s, r) => s + r.valueUSD, 0);

  const toggleMode = (mode: string): void =>
    setHidden((prev) =>
      prev.indexOf(mode) !== -1
        ? prev.filter((m) => m !== mode)
        : [...prev, mode],
    );

  return (
    <div className={styles.stack}>
      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>BID</span>
          <BidSelect options={options} value={selBid} onChange={setSelBid} />
        </label>
        <div className={styles.field}>
          <span className={styles.label}>
            Acquisition type (click to toggle)
          </span>
          <div className={styles.chips}>
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                className={`${styles.chip} ${
                  hidden.indexOf(m) === -1 ? styles.chipOn : ""
                }`}
                aria-pressed={hidden.indexOf(m) === -1}
                onClick={() => toggleMode(m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No cost data"
          description="This BID has no items for the selected acquisition types."
        />
      ) : (
        <>
          <div className={styles.kpis}>
            <KPICard
              label="Total BID (USD)"
              value={usd(stats.totalUSD)}
              accentColor="var(--primary-accent)"
            />
            <KPICard
              label="CAPEX (USD)"
              value={stats.capexUSD > 0 ? usd(stats.capexUSD) : "—"}
              accentColor="var(--secondary-accent)"
            />
            <KPICard
              label="OPEX (USD)"
              value={stats.opexUSD > 0 ? usd(stats.opexUSD) : "—"}
              accentColor="var(--tertiary-accent)"
            />
            <KPICard
              label="In house / onboard"
              value={noCostCount}
              subtitle="items with no cost expected"
              accentColor="var(--success)"
            />
            <KPICard
              label="Missing price"
              value={missing.length}
              subtitle={
                missing.length ? "items that should have one" : undefined
              }
              accentColor={
                missing.length ? "var(--danger)" : "var(--text-muted)"
              }
            />
          </div>

          {missing.length > 0 && (
            <div className={styles.alert}>
              <div className={styles.alertTitle}>
                {missing.length} item(s) with a missing price
              </div>
              <div className={styles.alertList}>
                {missing.map((m) => (
                  <div key={m.key} className={styles.alertRow}>
                    <span className={styles.alertName}>
                      {m.description || m.partNumber || "(no description)"}
                    </span>
                    <span className={styles.alertMode}>{m.acquisition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <SegmentedTabs<RankView>
            variant="chips"
            value={view}
            onChange={setView}
            ariaLabel="Ranking views"
            tabs={[
              { key: "pareto", label: "Pareto" },
              { key: "capex", label: "Top CAPEX" },
              { key: "opex", label: "Top OPEX" },
              { key: "categories", label: "Categories" },
              { key: "accessories", label: "Accessories" },
            ]}
          />

          <GlassCard noBodyPadding={view === "accessories"}>
            {view === "pareto" && (
              <div className={styles.stack}>
                {paretoAll.length === 0 ? (
                  <p className={styles.empty}>No priced items.</p>
                ) : (
                  <>
                    <ParetoChart
                      data={paretoAll.slice(0, PARETO_ROWS)}
                      currency="USD"
                    />
                    <div className={styles.insight}>
                      <strong>
                        {n80} item{n80 === 1 ? "" : "s"}
                      </strong>{" "}
                      make up 80% of the cost ({usd(n80Value)} of{" "}
                      {usd(paretoTotal)}). The chart shows the top{" "}
                      {Math.min(PARETO_ROWS, paretoAll.length)}.
                    </div>
                  </>
                )}
              </div>
            )}

            {view === "capex" &&
              (capexRows.length ? (
                <RankBars rows={capexRows} token="var(--secondary-accent)" />
              ) : (
                <p className={styles.empty}>No CAPEX items.</p>
              ))}

            {view === "opex" &&
              (opexRows.length ? (
                <RankBars rows={opexRows} token="var(--tertiary-accent)" />
              ) : (
                <p className={styles.empty}>No OPEX items.</p>
              ))}

            {view === "categories" &&
              (categoryRows.length ? (
                <RankBars rows={categoryRows} token="var(--primary-accent)" />
              ) : (
                <p className={styles.empty}>No data.</p>
              ))}

            {view === "accessories" &&
              (accessoryRows.length === 0 ? (
                <p className={styles.empty}>
                  No services, fees or sub-items are priced in this BID.
                </p>
              ) : (
                <div>
                  <div className={styles.accSummary}>
                    <span>
                      <strong>{accessoryRows.length}</strong> lines
                    </span>
                    <span>
                      Total <strong>{usd(accessoryTotal)}</strong>
                    </span>
                  </div>
                  <DataTable<IAccessoryRow>
                    data={accessoryRows}
                    columns={[
                      {
                        key: "label",
                        header: "Accessory",
                        sortable: true,
                        render: (r) => (
                          <div>
                            <div className={styles.accName}>{r.label}</div>
                            <div className={styles.accParent}>
                              for {r.parent}
                            </div>
                          </div>
                        ),
                      },
                      {
                        key: "partNumber",
                        header: "PN",
                        render: (r) => <span>{r.partNumber || "—"}</span>,
                      },
                      { key: "kind", header: "Type", sortable: true },
                      {
                        key: "valueUSD",
                        header: "Cost",
                        sortable: true,
                        render: (r) => (
                          <span className={styles.num}>{usd(r.valueUSD)}</span>
                        ),
                      },
                    ]}
                  />
                </div>
              ))}
          </GlassCard>
        </>
      )}
    </div>
  );
};
