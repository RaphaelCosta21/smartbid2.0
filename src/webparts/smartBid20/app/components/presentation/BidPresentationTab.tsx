import * as React from "react";
import { EmptyState } from "../common/EmptyState";
import { PresentationHero } from "./PresentationHero";
import { PresentationParetoSection } from "./PresentationParetoSection";
import { PresentationItemCard } from "./PresentationItemCard";
import {
  PresentationAcquisitionMix,
  PresentationComposition,
  PresentationHours,
} from "./PresentationSummary";
import { useBids } from "../../hooks/useBids";
import { useQuotationStore } from "../../stores/useQuotationStore";
import {
  buildHistoryIndex,
  buildHoursByPhase,
  buildPresentationItems,
  computeStats,
  rankItems,
} from "../../utils/bidPresentation";
import {
  getBidDisplayCurrency,
  indexQuotations,
} from "../../utils/quotationLinks";
import { formatCurrency } from "../../utils/formatters";
import { IBid } from "../../models";
import styles from "./BidPresentationTab.module.scss";

const SectionHead: React.FC<{
  eyebrow: string;
  title: string;
  hint?: string;
}> = ({ eyebrow, title, hint }) => (
  <div className={styles.sectionHead}>
    <p className={styles.eyebrow}>{eyebrow}</p>
    <h2>{title}</h2>
    {hint && <p className={styles.hint}>{hint}</p>}
  </div>
);

export interface BidPresentationTabProps {
  bid: IBid;
}

/** Consolidated presentation of the open BID, built from its live data. */
export const BidPresentationTab: React.FC<BidPresentationTabProps> = ({
  bid,
}) => {
  const { bids } = useBids();
  const quotationItems = useQuotationStore((s) => s.items);
  const loadQuotations = useQuotationStore((s) => s.loadQuotations);

  const [category, setCategory] = React.useState("All");
  const [minValue, setMinValue] = React.useState(0);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

  // Supplier quotes in the cards are resolved against the catalog
  React.useEffect(() => {
    void loadQuotations();
  }, [loadQuotations]);

  React.useEffect(() => {
    setCategory("All");
    setMinValue(0);
    setSelectedKey(null);
  }, [bid.bidNumber]);

  const display = React.useMemo(() => getBidDisplayCurrency(bid), [bid]);
  const items = React.useMemo(() => buildPresentationItems(bid), [bid]);
  const stats = React.useMemo(() => computeStats(items), [items]);
  const ranked = React.useMemo(() => rankItems(items), [items]);
  const categories = React.useMemo(() => {
    const seen: Record<string, boolean> = {};
    const out: string[] = [];
    ranked.forEach((i) => {
      if (!seen[i.category]) {
        seen[i.category] = true;
        out.push(i.category);
      }
    });
    return out.sort();
  }, [ranked]);
  const categoryItems = React.useMemo(
    () =>
      category === "All"
        ? ranked
        : ranked.filter((i) => i.category === category),
    [ranked, category],
  );
  const cards = React.useMemo(
    () => categoryItems.filter((i) => i.totalUSD * display.rate >= minValue),
    [categoryItems, minValue, display.rate],
  );
  const hours = React.useMemo(() => buildHoursByPhase(bid), [bid]);
  const historyIndex = React.useMemo(() => buildHistoryIndex(bids), [bids]);
  const quotationIndex = React.useMemo(
    () => indexQuotations(quotationItems),
    [quotationItems],
  );

  React.useEffect(() => {
    if (!selectedKey) return;
    const el = document.getElementById(`bid-item-${selectedKey}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [selectedKey]);

  const maxTotalUSD = cards.length ? cards[0].totalUSD : 1;

  return (
    <div className={styles.page}>
      {items.length === 0 && (
        <EmptyState
          variant="glass"
          title="No cost items yet"
          description="This BID has no Assets Breakdown yet - the presentation shows whatever is available."
        />
      )}

      <PresentationHero
        bidNumber={bid.bidNumber}
        title={(bid.opportunityInfo && bid.opportunityInfo.projectName) || ""}
        stats={stats}
        displayCurrency={display}
      />

      {ranked.length > 0 && (
        <PresentationParetoSection
          items={categoryItems}
          categories={categories}
          selectedCategory={category}
          onCategory={setCategory}
          minValue={minValue}
          onMinValue={setMinValue}
          selectedKey={selectedKey}
          onSelectItem={setSelectedKey}
          displayCurrency={display}
        />
      )}

      <section className={styles.section}>
        <SectionHead
          eyebrow="Top items"
          title="Where the proposal value is"
          hint={`Items${category === "All" ? "" : ` in ${category}`} sorted by price, with a minimum value filter of ${formatCurrency(minValue, display.currency)}.`}
        />
        {cards.length === 0 ? (
          <EmptyState
            variant="glass"
            title="No items match"
            description="No items match the current category and value selection."
          />
        ) : (
          <div className={styles.grid}>
            {cards.map((item) => (
              <div key={item.key} id={`bid-item-${item.key}`}>
                <PresentationItemCard
                  rank={ranked.indexOf(item) + 1}
                  item={item}
                  shareOfTotal={
                    stats.totalUSD ? (item.totalUSD / stats.totalUSD) * 100 : 0
                  }
                  maxTotalUSD={maxTotalUSD}
                  bidNumber={bid.bidNumber}
                  historyIndex={historyIndex}
                  quotationIndex={quotationIndex}
                  displayCurrency={display}
                  highlighted={selectedKey === item.key}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {items.length > 0 && (
        <>
          <PresentationComposition
            items={items}
            stats={stats}
            displayCurrency={display}
          />
          <PresentationAcquisitionMix
            items={items}
            displayCurrency={display}
          />
        </>
      )}

      <PresentationHours
        rows={hours.rows}
        totalHours={hours.totalHours}
        roles={hours.roles}
      />
    </div>
  );
};
