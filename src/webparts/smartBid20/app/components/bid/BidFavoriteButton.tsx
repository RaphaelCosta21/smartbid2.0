import * as React from "react";
import { Star } from "lucide-react";
import { IBid } from "../../models";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import { useUIStore } from "../../stores/useUIStore";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import { isTerminalStatus } from "../../utils/statusHelpers";
import styles from "./BidFavoriteButton.module.scss";

interface BidFavoriteButtonProps {
  bid: IBid;
  showLabel?: boolean;
  /** Replaces the default icon-only styling (e.g. to match a host toolbar) */
  className?: string;
}

/** Only closed-out BIDs can be added; an existing favorite can always be removed. */
export const BidFavoriteButton: React.FC<BidFavoriteButtonProps> = ({
  bid,
  showLabel,
  className,
}) => {
  const isLoaded = useFavoritesStore((s) => s.isLoaded);
  const loadFavorites = useFavoritesStore((s) => s.loadFavorites);
  const toggleBidFavorite = useFavoritesStore((s) => s.toggleBidFavorite);
  const isFavorite = useFavoritesStore(
    (s) => !!s.data && s.data.bids.some((b) => b.bidNumber === bid.bidNumber),
  );
  const addToast = useUIStore((s) => s.addToast);
  const currentUser = useCurrentUser();
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (!isLoaded) loadFavorites().catch(() => undefined);
  }, [isLoaded, loadFavorites]);

  if (!isTerminalStatus(bid.currentStatus) && !isFavorite) return null;

  const label = isFavorite ? "Remove from favorites" : "Add to favorites";

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.stopPropagation();
    if (busy) return;
    const wasFavorite = isFavorite;
    setBusy(true);
    try {
      await toggleBidFavorite(
        bid.bidNumber,
        currentUser.displayName || currentUser.email || "",
      );
      addToast({
        type: "success",
        title: wasFavorite ? "Removed from favorites" : "Added to favorites",
        message: bid.bidNumber,
      });
    } catch (err) {
      addToast({
        type: "error",
        title: "Could not update favorites",
        message: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      className={className || styles.iconBtn}
      onClick={handleClick}
      disabled={!isLoaded || busy}
      aria-pressed={isFavorite}
      aria-label={label}
      title={label}
    >
      <Star
        size={14}
        color={isFavorite ? "var(--warning)" : "currentColor"}
        fill={isFavorite ? "var(--warning)" : "none"}
      />
      {showLabel && (isFavorite ? "Favorited" : "Favorite")}
    </button>
  );
};
