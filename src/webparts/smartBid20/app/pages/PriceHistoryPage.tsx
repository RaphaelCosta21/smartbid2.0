/**
 * PriceHistoryPage — what things cost across BIDs: where one BID's cost sits, how each item
 * was priced and acquired before, and how labor was staffed. Built from the live BID data.
 */
import * as React from "react";
import { PageHeader } from "../components/common/PageHeader";
import { EmptyState } from "../components/common/EmptyState";
import { SegmentedTabs } from "../components/common/SegmentedTabs";
import { SkeletonLoader } from "../components/common/SkeletonLoader";
import { BidRankingTab } from "../components/pricehistory/BidRankingTab";
import { ItemHistoryTab } from "../components/pricehistory/ItemHistoryTab";
import { LaborTab } from "../components/pricehistory/LaborTab";
import { useBids } from "../hooks/useBids";
import { useOpenBid } from "../hooks/useOpenBid";
import styles from "./PriceHistoryPage.module.scss";

type HistoryTab = "ranking" | "history" | "labor";

const TABS: { key: HistoryTab; label: string }[] = [
  { key: "ranking", label: "BID ranking" },
  { key: "history", label: "History" },
  { key: "labor", label: "Labor" },
];

export const PriceHistoryPage: React.FC = () => {
  const { bids: allBids, isLoading } = useBids();
  const { canOpen } = useOpenBid();
  const [tab, setTab] = React.useState<HistoryTab>("ranking");

  // Confidential BIDs stay out unless the user can open them
  const bids = React.useMemo(
    () => allBids.filter((b) => canOpen(b)),
    [allBids, canOpen],
  );

  // Cost views need an Assets Breakdown; labor lives in the hours summary
  const costBids = React.useMemo(
    () => bids.filter((b) => (b.assetBreakdown || []).length > 0),
    [bids],
  );

  return (
    <div className={styles.page}>
      <PageHeader
        title="Price History"
        subtitle="Historical prices and acquisition modes from live BIDs (USD)"
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
        }
      />

      {isLoading && bids.length === 0 ? (
        <SkeletonLoader height={160} borderRadius={16} />
      ) : bids.length === 0 ? (
        <EmptyState
          variant="glass"
          title="No BIDs yet"
          description="Price history is built from the BIDs in the tracker."
        />
      ) : (
        <>
          <SegmentedTabs<HistoryTab>
            tabs={TABS}
            value={tab}
            onChange={setTab}
            ariaLabel="Price history views"
          />
          {tab !== "labor" && costBids.length === 0 ? (
            <EmptyState
              variant="glass"
              title="No cost data"
              description="No BID has an Assets Breakdown yet."
            />
          ) : (
            <>
              {tab === "ranking" && <BidRankingTab bids={costBids} />}
              {tab === "history" && <ItemHistoryTab bids={costBids} />}
              {tab === "labor" && <LaborTab bids={bids} />}
            </>
          )}
        </>
      )}
    </div>
  );
};
