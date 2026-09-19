import * as React from "react";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { useFavoritesStore } from "../../stores/useFavoritesStore";
import styles from "./QueryCatalogLoadingBanner.module.scss";

/**
 * Global, non-blocking notice shown while the Query Catalog (Queries.xlsx) or
 * the Favorites list are being fetched and parsed. The parse runs on the main
 * thread, so the UI may stop responding for a few seconds.
 */
export const QueryCatalogLoadingBanner: React.FC = () => {
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const favoritesLoading = useFavoritesStore((s) => s.isLoading);

  if (!catalogLoading && !favoritesLoading) return null;

  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.banner}>
        <span className={styles.spinner} aria-hidden="true" />
        <div className={styles.body}>
          <div className={styles.title}>
            {catalogLoading ? "Loading query catalog…" : "Loading favorites…"}
          </div>
          <div className={styles.message}>
            {catalogLoading
              ? "Fetching and indexing Queries.xlsx. This can take a few seconds and the screen may briefly stop responding."
              : "Fetching your saved equipment favorites."}
          </div>
        </div>
      </div>
    </div>
  );
};
