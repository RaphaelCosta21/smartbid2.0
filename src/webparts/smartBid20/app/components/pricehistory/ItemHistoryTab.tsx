/**
 * ItemHistoryTab — how items were priced across every BID. Search any item by part number or
 * description, or open one BID and see each of its items against what the others paid.
 */
import * as React from "react";
import { IBid } from "../../models";
import {
  acquisitionToken,
  buildHistoryIndex,
  buildPresentationItems,
  getHistoryForQuery,
  getItemHistory,
  IHistoryIndex,
  IPresentationItem,
  normalizeText,
} from "../../utils/bidPresentation";
import {
  IItemGroup,
  isNoCostItem,
  searchItemGroups,
} from "../../utils/priceHistory";
import { BidSelect, buildBidOptions } from "../common/BidSelect";
import { EmptyState } from "../common/EmptyState";
import { SegmentedTabs } from "../common/SegmentedTabs";
import { HistoryItemCard } from "./HistoryItemCard";
import styles from "./ItemHistoryTab.module.scss";

type Mode = "item" | "bid";

const GROUP_MATCH_LABEL: Record<IItemGroup["kind"], string> = {
  pn: "PN",
  et: "requirement (ET)",
  desc: "description",
};

const PAGE_SIZE = 100;

// ─── Search by item ───

const ItemSearchView: React.FC<{ index: IHistoryIndex }> = ({ index }) => {
  const [query, setQuery] = React.useState("");
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const groups = React.useMemo(
    () => searchItemGroups(index, query),
    [index, query],
  );
  React.useEffect(() => setExpanded(null), [query]);

  // Only the open card needs its history; searching stays instant
  const openGroup = groups.find((g) => g.key === expanded);
  const openHistory = React.useMemo(
    () => (openGroup ? getHistoryForQuery(index, openGroup.query, "") : null),
    [index, openGroup],
  );

  return (
    <div className={styles.stack}>
      <p className={styles.lead}>
        Search any item by part number or description — no BID needed. See how
        it was acquired and what it cost in every BID that offered it.
      </p>
      <label className={styles.field}>
        <span className={styles.label}>Search by description or PN</span>
        <input
          className={styles.input}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. GNSS receiver · C-NAV · ROV class III · 0000143"
        />
      </label>

      {!query.trim() ? (
        <p className={styles.hint}>
          Type a description or part number to search all BIDs.
        </p>
      ) : groups.length === 0 ? (
        <p className={styles.warn}>No items found for “{query}”.</p>
      ) : (
        <>
          <p className={styles.hint}>
            {groups.length} distinct item{groups.length === 1 ? "" : "s"} — open
            “Full history” for the acquisition mix and the cost in each BID.
          </p>
          <div className={styles.list}>
            {groups.map((g) => {
              const rep = g.representative;
              return (
                <HistoryItemCard
                  key={g.key}
                  title={g.label}
                  tag={
                    g.kind === "et"
                      ? { label: "Requirement", token: "var(--info)" }
                      : undefined
                  }
                  partNumber={g.kind === "pn" ? rep.partNumber : ""}
                  acquisition={rep.acquisition}
                  matchLabel={GROUP_MATCH_LABEL[g.kind]}
                  referenceUSD={g.medianUSD || 0}
                  aliases={g.kind === "et" ? g.aliases : undefined}
                  summary={`${g.bidCount} bid(s) · ${g.occurrences}×`}
                  history={expanded === g.key ? openHistory : null}
                  expanded={expanded === g.key}
                  onToggle={() =>
                    setExpanded(expanded === g.key ? null : g.key)
                  }
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

// ─── Search by BID ───

function matchLabelFor(index: IHistoryIndex, item: IPresentationItem): string {
  const et = normalizeText(item.scopeItem.clientRequirement);
  if (et && index.byEt.has(et)) return "requirement (ET)";
  return item.hasPn ? "PN" : "description";
}

const BidHistoryView: React.FC<{
  bids: IBid[];
  index: IHistoryIndex;
}> = ({ bids, index }) => {
  const options = React.useMemo(() => buildBidOptions(bids), [bids]);
  const [selBid, setSelBid] = React.useState(
    options.length ? options[0].bidNumber : "",
  );
  const [filter, setFilter] = React.useState("");
  const [showNoCost, setShowNoCost] = React.useState(true);
  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [visible, setVisible] = React.useState(PAGE_SIZE);

  React.useEffect(() => {
    setExpanded(null);
    setVisible(PAGE_SIZE);
  }, [selBid, filter, showNoCost]);

  const bid = bids.find((b) => b.bidNumber === selBid);
  const items = React.useMemo(() => {
    if (!bid) return [];
    const q = normalizeText(filter);
    return buildPresentationItems(bid).filter((i) => {
      if (!showNoCost && isNoCostItem(i)) return false;
      if (!q) return true;
      return (
        normalizeText(i.description).indexOf(q) !== -1 ||
        normalizeText(i.partNumber).indexOf(q) !== -1
      );
    });
  }, [bid, filter, showNoCost]);

  // Each badge compares with the other BIDs, so every item's history is looked up once
  const histories = React.useMemo(
    () => items.map((i) => getItemHistory(index, i, selBid)),
    [items, index, selBid],
  );
  const pricedCount = items.filter((i) => i.totalUSD > 0).length;
  const noCostCount = items.filter(isNoCostItem).length;

  return (
    <div className={styles.stack}>
      <p className={styles.lead}>
        Pick a BID and see the full cost of each item (equipment plus services,
        sub-items and PCF) against what the other BIDs paid.
      </p>
      <p className={styles.hint}>
        Items with no part number are matched by their client requirement or by
        description similarity.
      </p>

      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>BID</span>
          <BidSelect options={options} value={selBid} onChange={setSelBid} />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Filter items</span>
          <input
            className={styles.input}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="e.g. ROV, USBL…"
          />
        </label>
        <label className={styles.check}>
          <input
            type="checkbox"
            checked={showNoCost}
            onChange={(e) => setShowNoCost(e.target.checked)}
          />
          Include items with no cost (in house, onboard…)
        </label>
      </div>

      {items.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No items"
          description="This BID has no items for the current filter."
        />
      ) : (
        <>
          <p className={styles.hint}>
            {items.length} items — {pricedCount} priced, {noCostCount} with no
            cost. Open one to see its history.
          </p>
          <div className={styles.list}>
            {items.slice(0, visible).map((item, i) => {
              const noCost = isNoCostItem(item);
              return (
                <HistoryItemCard
                  key={item.key}
                  title={item.description}
                  tag={
                    noCost
                      ? {
                          label: item.acquisition,
                          token: acquisitionToken(item.acquisition),
                        }
                      : undefined
                  }
                  partNumber={item.hasPn ? item.partNumber : ""}
                  acquisition={item.acquisition}
                  matchLabel={matchLabelFor(index, item)}
                  referenceUSD={item.ownUSD > 0 ? item.ownUSD : item.totalUSD}
                  current={{
                    label: `${selBid} (current)`,
                    totalUSD: item.totalUSD,
                    ownUSD: item.ownUSD,
                    extrasUSD: Math.max(item.totalUSD - item.ownUSD, 0),
                  }}
                  history={histories[i]}
                  expanded={expanded === item.key}
                  onToggle={() =>
                    setExpanded(expanded === item.key ? null : item.key)
                  }
                />
              );
            })}
          </div>
          {visible < items.length && (
            <button
              type="button"
              className={styles.more}
              onClick={() => setVisible((v) => v + PAGE_SIZE)}
            >
              Show more ({items.length - visible} left)
            </button>
          )}
        </>
      )}
    </div>
  );
};

// ─── Tab ───

export interface ItemHistoryTabProps {
  /** BIDs that have an Assets Breakdown */
  bids: IBid[];
}

export const ItemHistoryTab: React.FC<ItemHistoryTabProps> = ({ bids }) => {
  const [mode, setMode] = React.useState<Mode>("item");
  const index = React.useMemo(() => buildHistoryIndex(bids), [bids]);

  return (
    <div className={styles.stack}>
      <SegmentedTabs<Mode>
        variant="chips"
        value={mode}
        onChange={setMode}
        ariaLabel="History search"
        tabs={[
          { key: "item", label: "Search by item" },
          { key: "bid", label: "Search by BID" },
        ]}
      />
      {mode === "item" ? (
        <ItemSearchView index={index} />
      ) : (
        <BidHistoryView bids={bids} index={index} />
      )}
    </div>
  );
};
