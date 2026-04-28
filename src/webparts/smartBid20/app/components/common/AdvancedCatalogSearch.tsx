/**
 * AdvancedCatalogSearch — Large search modal with tabbed catalog views.
 * Tabs: "Peoplesoft - Brazil" (Active Registered) and "Peoplesoft - Financials"
 * Each tab supports PN / Description filters AND Business Unit multi-select filter.
 * Brazil tab also supports Mfg ID and Mfg Itm ID search fields.
 */
import * as React from "react";
import styles from "./AdvancedCatalogSearch.module.scss";
import { useQueryCatalogStore } from "../../stores/useQueryCatalogStore";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { ISearchResultItem } from "../../models";
import { PhotoLightbox } from "./PhotoLightbox";

export interface AdvancedCatalogSearchProps {
  onSelect: (pn: string, description: string) => void;
  onClose: () => void;
}

type TabKey = "brazil" | "financials";

function getPhotoUrl(partNumber: string): string {
  if (!partNumber) return "";
  const pn = partNumber.trim();
  if (!pn) return "";
  return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${pn}.jpg`;
}

export const AdvancedCatalogSearch: React.FC<AdvancedCatalogSearchProps> = ({
  onSelect,
  onClose,
}) => {
  const catalogData = useQueryCatalogStore((s) => s.data);
  const catalogLoaded = useQueryCatalogStore((s) => s.isLoaded);
  const catalogLoading = useQueryCatalogStore((s) => s.isLoading);
  const loadCatalog = useQueryCatalogStore((s) => s.loadCatalog);

  const [tab, setTab] = React.useState<TabKey>("brazil");
  const [pnFilter, setPnFilter] = React.useState("");
  const [descFilter, setDescFilter] = React.useState("");
  const [mfgIdFilter, setMfgIdFilter] = React.useState("");
  const [mfgItmIdFilter, setMfgItmIdFilter] = React.useState("");
  const [buFilterOpen, setBuFilterOpen] = React.useState(false);
  const [brazilSelectedBUs, setBrazilSelectedBUs] = React.useState<
    Record<string, boolean>
  >({});
  const [finSelectedBUs, setFinSelectedBUs] = React.useState<
    Record<string, boolean>
  >({});
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!catalogLoaded && !catalogLoading) loadCatalog();
  }, []);

  const brazilBUs = React.useMemo<string[]>(() => {
    if (!catalogData) return [];
    const set = new Set<string>();
    catalogData.activeRegistered.forEach((i) => {
      if (i.businessUnit) set.add(i.businessUnit);
    });
    return Array.from(set).sort();
  }, [catalogData]);

  const finBUs = React.useMemo<string[]>(() => {
    if (!catalogData) return [];
    const set = new Set<string>();
    catalogData.peopleSoftFinancials.forEach((i) => {
      if (i.businessUnit) set.add(i.businessUnit);
    });
    return Array.from(set).sort();
  }, [catalogData]);

  // Auto-select all BUs once they're known (default = all selected)
  React.useEffect(() => {
    if (brazilBUs.length && Object.keys(brazilSelectedBUs).length === 0) {
      const map: Record<string, boolean> = {};
      brazilBUs.forEach((bu) => (map[bu] = true));
      setBrazilSelectedBUs(map);
    }
  }, [brazilBUs]);

  React.useEffect(() => {
    if (finBUs.length && Object.keys(finSelectedBUs).length === 0) {
      const map: Record<string, boolean> = {};
      finBUs.forEach((bu) => (map[bu] = true));
      setFinSelectedBUs(map);
    }
  }, [finBUs]);

  const matchesText = React.useCallback(
    (value: string, filter: string): boolean => {
      if (!filter.trim()) return true;
      const words = filter.toLowerCase().trim().split(/\s+/);
      const lower = value.toLowerCase();
      for (let w = 0; w < words.length; w++) {
        if (lower.indexOf(words[w]) < 0) return false;
      }
      return true;
    },
    [],
  );

  const hasFilter =
    pnFilter.trim().length >= 2 ||
    descFilter.trim().length >= 2 ||
    (tab === "brazil" &&
      (mfgIdFilter.trim().length >= 2 || mfgItmIdFilter.trim().length >= 2));

  const currentBuMap = tab === "brazil" ? brazilSelectedBUs : finSelectedBUs;
  const currentBUs = tab === "brazil" ? brazilBUs : finBUs;
  const selectedBuCount = currentBUs.filter((b) => currentBuMap[b]).length;

  const isBuSelected = React.useCallback(
    (bu: string): boolean => {
      if (Object.keys(currentBuMap).length === 0) return true;
      return !!currentBuMap[bu];
    },
    [currentBuMap],
  );

  const results: ISearchResultItem[] = React.useMemo(() => {
    if (!catalogData || !hasFilter) return [];

    const out: ISearchResultItem[] = [];
    const MAX = 50;

    if (tab === "brazil") {
      for (
        let i = 0;
        i < catalogData.activeRegistered.length && out.length < MAX;
        i++
      ) {
        const item = catalogData.activeRegistered[i];
        if (!isBuSelected(item.businessUnit || "")) continue;
        if (
          matchesText(item.item, pnFilter) &&
          matchesText(item.longDescr, descFilter) &&
          matchesText(item.mfgId || "", mfgIdFilter) &&
          matchesText(item.mfgItmId || "", mfgItmIdFilter)
        ) {
          out.push({
            pn: item.item,
            description: item.longDescr,
            source: "AR",
            businessUnit: item.businessUnit,
            mfgId: item.mfgId,
            mfgItmId: item.mfgItmId,
          });
        }
      }
    } else {
      for (
        let i = 0;
        i < catalogData.peopleSoftFinancials.length && out.length < MAX;
        i++
      ) {
        const item = catalogData.peopleSoftFinancials[i];
        if (!isBuSelected(item.businessUnit)) continue;
        if (
          matchesText(item.pn, pnFilter) &&
          matchesText(item.description, descFilter)
        ) {
          out.push({
            pn: item.pn,
            description: item.description,
            source: "FIN",
            businessUnit: item.businessUnit,
          });
        }
      }
    }

    return out;
  }, [
    catalogData,
    pnFilter,
    descFilter,
    mfgIdFilter,
    mfgItmIdFilter,
    tab,
    matchesText,
    hasFilter,
    isBuSelected,
  ]);

  const handleSelect = (item: ISearchResultItem): void => {
    onSelect(item.pn, item.description);
  };

  const toggleBu = (bu: string): void => {
    if (tab === "brazil") {
      setBrazilSelectedBUs((prev) => ({ ...prev, [bu]: !prev[bu] }));
    } else {
      setFinSelectedBUs((prev) => ({ ...prev, [bu]: !prev[bu] }));
    }
  };

  const setAllBUs = (val: boolean): void => {
    const map: Record<string, boolean> = {};
    currentBUs.forEach((bu) => (map[bu] = val));
    if (tab === "brazil") setBrazilSelectedBUs(map);
    else setFinSelectedBUs(map);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 className={styles.title}>Advanced Catalog Search</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${tab === "brazil" ? styles.tabActive : ""}`}
            onClick={() => {
              setTab("brazil");
              setPnFilter("");
              setDescFilter("");
              setMfgIdFilter("");
              setMfgItmIdFilter("");
              setBuFilterOpen(false);
            }}
          >
            🔧 Peoplesoft - Brazil
          </button>
          <button
            className={`${styles.tab} ${tab === "financials" ? styles.tabActive : ""}`}
            onClick={() => {
              setTab("financials");
              setPnFilter("");
              setDescFilter("");
              setMfgIdFilter("");
              setMfgItmIdFilter("");
              setBuFilterOpen(false);
            }}
          >
            💰 Peoplesoft - Financials
          </button>
        </div>

        <div className={styles.filters}>
          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Part Number</label>
            <input
              className={styles.searchInput}
              type="text"
              value={pnFilter}
              onChange={(e) => setPnFilter(e.target.value)}
              placeholder="Type part number..."
              autoFocus
            />
          </div>
          <div className={styles.filterRow}>
            <label className={styles.filterLabel}>Description</label>
            <input
              className={styles.searchInput}
              type="text"
              value={descFilter}
              onChange={(e) => setDescFilter(e.target.value)}
              placeholder="Type description keywords..."
            />
          </div>
          <div className={styles.filterRow} style={{ flex: "0 0 auto" }}>
            <label className={styles.filterLabel}>Business Unit</label>
            <button
              type="button"
              className={styles.buFilterBtn}
              onClick={() => setBuFilterOpen((v) => !v)}
              disabled={currentBUs.length === 0}
            >
              {selectedBuCount === currentBUs.length
                ? `All BUs (${currentBUs.length})`
                : `${selectedBuCount} of ${currentBUs.length}`}
              <span style={{ marginLeft: 6 }}>{buFilterOpen ? "▴" : "▾"}</span>
            </button>
          </div>
          {tab === "brazil" && (
            <>
              <div className={styles.filterRow}>
                <label className={styles.filterLabel}>Mfg ID</label>
                <input
                  className={styles.searchInput}
                  type="text"
                  value={mfgIdFilter}
                  onChange={(e) => setMfgIdFilter(e.target.value)}
                  placeholder="Manufacturer ID..."
                />
              </div>
              <div className={styles.filterRow}>
                <label className={styles.filterLabel}>Mfg Ref</label>
                <input
                  className={styles.searchInput}
                  type="text"
                  value={mfgItmIdFilter}
                  onChange={(e) => setMfgItmIdFilter(e.target.value)}
                  placeholder="Manufacturer Item ID..."
                />
              </div>
            </>
          )}
        </div>

        {buFilterOpen && currentBUs.length > 0 && (
          <div className={styles.buPanel}>
            <div className={styles.buPanelActions}>
              <button
                type="button"
                className={styles.buActionBtn}
                onClick={() => setAllBUs(true)}
              >
                Select All
              </button>
              <button
                type="button"
                className={styles.buActionBtn}
                onClick={() => setAllBUs(false)}
              >
                Clear
              </button>
            </div>
            <div className={styles.buGrid}>
              {currentBUs.map((bu) => (
                <label key={bu} className={styles.buCheckLabel}>
                  <input
                    type="checkbox"
                    checked={isBuSelected(bu)}
                    onChange={() => toggleBu(bu)}
                  />
                  <span>{bu}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className={styles.resultsArea}>
          {catalogLoading && (
            <div className={styles.loadingWrap}>
              <div className={styles.spinner} />
              <div className={styles.loadingText}>
                Loading catalog data... this may take a moment.
              </div>
            </div>
          )}

          {!catalogLoading && !hasFilter && (
            <div className={styles.hint}>
              Type at least 2 characters in either field to search.
            </div>
          )}

          {!catalogLoading && hasFilter && results.length === 0 && (
            <div className={styles.noResults}>
              No items found matching the current filters.
            </div>
          )}

          {!catalogLoading && results.length > 0 && (
            <>
              <div className={styles.resultCount}>
                {results.length} result{results.length > 1 ? "s" : ""}{" "}
                {results.length >= 50 ? "(showing first 50)" : ""}
              </div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th className={styles.thImg}></th>
                      <th className={styles.thPN}>Part Number</th>
                      <th className={styles.thDesc}>Description</th>
                      <th className={styles.thBu}>BU</th>
                      {tab === "brazil" && (
                        <th className={styles.thMfg}>Mfg ID</th>
                      )}
                      {tab === "brazil" && (
                        <th className={styles.thMfg}>Mfg Ref</th>
                      )}
                      <th className={styles.thAct}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((item, idx) => {
                      const photo = getPhotoUrl(item.pn);
                      return (
                        <tr key={`${item.pn}-${idx}`} className={styles.row}>
                          <td className={styles.cellImg}>
                            <PhotoThumb
                              key={photo}
                              src={photo}
                              onClick={() => setPreviewUrl(photo)}
                            />
                          </td>
                          <td className={styles.cellPN}>{item.pn}</td>
                          <td className={styles.cellDesc}>
                            {item.description}
                          </td>
                          <td className={styles.cellBu}>
                            {item.businessUnit || "—"}
                          </td>
                          {tab === "brazil" && (
                            <td className={styles.cellMfg}>
                              {item.mfgId || "—"}
                            </td>
                          )}
                          {tab === "brazil" && (
                            <td className={styles.cellMfg}>
                              {item.mfgItmId || "—"}
                            </td>
                          )}
                          <td className={styles.cellAct}>
                            <button
                              className={styles.addBtn}
                              onClick={() => handleSelect(item)}
                            >
                              + Add
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {previewUrl && (
        <PhotoLightbox url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </div>
  );
};

/** Thumbnail that hides itself if image fails to load. */
const PhotoThumb: React.FC<{ src: string; onClick: () => void }> = ({
  src,
  onClick,
}) => {
  const [ok, setOk] = React.useState(true);
  if (!ok) return null;
  return (
    <img
      src={src}
      alt=""
      className={styles.rowThumb}
      onError={() => setOk(false)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      title="Click to enlarge"
    />
  );
};

export default AdvancedCatalogSearch;
