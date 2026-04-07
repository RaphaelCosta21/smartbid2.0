import * as React from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../components/common/PageHeader";
import { GlassCard } from "../components/common/GlassCard";
import { BidCard } from "../components/bid/BidCard";
import { useBids } from "../hooks/useBids";
import { IBid } from "../models";

export const FavoritesPage: React.FC = () => {
  const navigate = useNavigate();
  const { bids } = useBids();

  /* Simulate favorites — first 4 bids (in real app this would be persisted) */
  const favorites = React.useMemo(() => bids.slice(0, 4), [bids]);

  const handleClick = (bid: IBid): void => {
    navigate(`/bid/${bid.bidNumber}`);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
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
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "var(--text-muted)",
            }}
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              style={{ marginBottom: 12, opacity: 0.4 }}
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <p>You haven&apos;t bookmarked any BIDs yet.</p>
            <p style={{ fontSize: 12 }}>
              Open a BID and click the star icon to add it to favorites.
            </p>
          </div>
        </GlassCard>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {favorites.map((bid) => (
            <BidCard key={bid.bidNumber} bid={bid} onClick={handleClick} />
          ))}
        </div>
      )}
    </div>
  );
};
