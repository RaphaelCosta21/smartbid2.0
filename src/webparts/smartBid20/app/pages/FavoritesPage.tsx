import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { BidCard } from "../components/bid/BidCard";
import { useBids } from "../hooks/useBids";
import { IBid } from "../models";
import styles from "./FavoritesPage.module.scss";

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();

  /* Simulate favorites — first 4 bids (in real app this would be persisted) */
  const favorites = React.useMemo(() => bids.slice(0, 4), [bids]);

  const handleClick = (bid: IBid): void => {
    navigate(`/bid/${bid.bidNumber}`);
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title="Favorites"
        subtitle={`${favorites.length} bookmarked BIDs`}
        icon={
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        }
      />

      {favorites.length === 0 ? (
        <GlassCard>
          <div className={styles.emptyState}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className={styles.emptyIcon}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p>You haven&apos;t bookmarked any BIDs yet.</p>
            <p className={styles.emptyHint}>
              Open a BID and click the star icon to add it to favorites.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div className={styles.cardGrid}>
          {favorites.map((bid) => (
            <BidCard key={bid.bidNumber} bid={bid} onClick={handleClick} />
          ))}
        </div>
      )}
    </div>
  );
};
