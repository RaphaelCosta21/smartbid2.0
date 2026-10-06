import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  LayoutGrid,
  Box,
  Package,
  Upload,
  ChevronDown,
  FileSearch,
  X,
} from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { useSurveyStore } from "../../stores/useSurveyStore";
import { useBidStore } from "../../stores/useBidStore";
import { usePageAccess } from "../../hooks/usePageAccess";
import { useUIStore } from "../../stores/useUIStore";
import { SurveyCatalogService } from "../../services/SurveyCatalogService";
import { IBid, ISurveyCatalog } from "../../models";
import styles from "./SurveyPortalHeader.module.scss";

export interface SurveySearchHit {
  id: string;
  title: string;
  meta: string;
}

interface SurveyPortalHeaderProps {
  view: "equipment" | "system";
  onOpenPackage: () => void;
  /** System view: equipment matching the search, offered in a dropdown. */
  searchHits?: SurveySearchHit[];
  onSearchHit?: (id: string) => void;
}

const BID_LIST_MAX = 40;
/** Survey BIDs first, then integrated ones, then the rest. */
const surveyRank = (b: IBid): number =>
  b.division === "SSR-Survey" ? 0 : b.division === "SSR-Integrated" ? 1 : 2;

export const SurveyPortalHeader: React.FC<SurveyPortalHeaderProps> = ({
  view,
  onOpenPackage,
  searchHits,
  onSearchHit,
}) => {
  const navigate = useNavigate();
  const catalog = useSurveyStore((s) => s.catalog);
  const filters = useSurveyStore((s) => s.filters);
  const setFilters = useSurveyStore((s) => s.setFilters);
  const packageLines = useSurveyStore((s) => s.packageLines);
  const spreadId = useSurveyStore((s) => s.spreadId);
  const setSpreadId = useSurveyStore((s) => s.setSpreadId);
  const bidNumber = useSurveyStore((s) => s.bidNumber);
  const setBidNumber = useSurveyStore((s) => s.setBidNumber);
  const load = useSurveyStore((s) => s.load);
  const bids = useBidStore((s) => s.bids);
  const { canEdit: canImport } = usePageAccess();
  const addToast = useUIStore((s) => s.addToast);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const bidRef = React.useRef<HTMLDivElement>(null);
  const [importing, setImporting] = React.useState(false);
  const [searchFocus, setSearchFocus] = React.useState(false);
  const [bidOpen, setBidOpen] = React.useState(false);
  const [bidQuery, setBidQuery] = React.useState("");

  const spreads = catalog?.spreads || [];
  const spread = spreads.find((s) => s.id === spreadId) || spreads[0];
  const selectedBid = bidNumber
    ? bids.find((b) => b.bidNumber === bidNumber)
    : undefined;
  const packageQty = packageLines.reduce((sum, l) => sum + l.qty, 0);

  const bidOptions = React.useMemo(() => {
    const q = bidQuery.trim().toLowerCase();
    return bids
      .filter(
        (b) =>
          !q ||
          [
            b.bidNumber,
            b.crmNumber,
            b.opportunityInfo?.client,
            b.opportunityInfo?.projectName,
          ].some((v) => (v || "").toLowerCase().indexOf(q) >= 0),
      )
      .sort(
        (a, b) =>
          surveyRank(a) - surveyRank(b) ||
          (b.createdDate || "").localeCompare(a.createdDate || ""),
      )
      .slice(0, BID_LIST_MAX);
  }, [bids, bidQuery]);

  React.useEffect(() => {
    if (!bidOpen) return undefined;
    const onDown = (e: MouseEvent): void => {
      if (bidRef.current && !bidRef.current.contains(e.target as Node))
        setBidOpen(false);
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setBidOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [bidOpen]);

  const pickBid = (value: string | null): void => {
    setBidNumber(value);
    setBidOpen(false);
    setBidQuery("");
  };

  const pickHit = (id: string): void => {
    if (onSearchHit) onSearchHit(id);
    setSearchFocus(false);
  };

  const handleImport = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    const jsonFile = files.find((f) => /\.json$/i.test(f.name));
    if (!jsonFile) {
      if (files.length > 0) {
        addToast({
          type: "warning",
          title: "Select the catalog JSON",
          message:
            "Pick survey-catalog.seed.json (optionally with the equipment photos).",
        });
      }
      return;
    }
    // Photos named after the equipment id (e.g. lbl-transceiver.png) become item attachments.
    const images: Record<string, File> = {};
    files.forEach((f) => {
      if (/\.(png|jpe?g|webp)$/i.test(f.name)) {
        images[f.name.replace(/\.[^.]+$/, "")] = f;
      }
    });
    setImporting(true);
    try {
      const parsed = JSON.parse(await jsonFile.text()) as ISurveyCatalog;
      if (
        !Array.isArray(parsed.families) ||
        !Array.isArray(parsed.equipment) ||
        !Array.isArray(parsed.systems)
      ) {
        throw new Error("Expected { families, equipment, systems } arrays");
      }
      const result = await SurveyCatalogService.importCatalog(parsed, images);
      addToast({
        type: "success",
        title: "Survey catalog imported",
        message: `${result.rows} entries and ${result.photos} photos written to SharePoint.`,
      });
      await load(true);
    } catch (err) {
      console.error("Survey catalog import failed:", err);
      addToast({
        type: "error",
        title: "Import failed",
        message: (err as Error).message,
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className={styles.root}>
      <div className={styles.bar}>
        <div className={styles.searchWrap}>
          <div className={styles.searchInput}>
            <Search size={14} />
            <input
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && searchHits && searchHits[0]) {
                  pickHit(searchHits[0].id);
                  e.currentTarget.blur();
                }
              }}
              placeholder="Search equipment, alias or technology..."
              aria-label="Search equipment, alias or technology"
            />
            {filters.search ? (
              <button
                className={styles.clearBtn}
                onClick={() => setFilters({ search: "" })}
                aria-label="Clear search"
              >
                <X size={12} />
              </button>
            ) : (
              <span className={styles.aliasHint}>ALIASES SUPPORTED</span>
            )}
          </div>
          {searchHits && searchFocus && filters.search.trim() && (
            <ul
              className={styles.hits}
              role="listbox"
              aria-label="Matching equipment"
            >
              {searchHits.length === 0 ? (
                <li className={styles.hitEmpty}>
                  No equipment in this diagram matches.
                </li>
              ) : (
                searchHits.map((h) => (
                  <li key={h.id}>
                    <button
                      className={styles.hit}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => pickHit(h.id)}
                    >
                      <span className={styles.hitTitle}>{h.title}</span>
                      <span className={styles.hitMeta}>{h.meta}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          )}
        </div>

        <div className={styles.bidPicker} ref={bidRef}>
          <button
            className={`${styles.bidBtn} ${bidNumber ? styles.bidBtnActive : ""}`}
            onClick={() => setBidOpen((o) => !o)}
            aria-expanded={bidOpen}
            title="Compare the diagram with an existing BID"
          >
            <FileSearch size={13} />
            <span className={styles.bidLabel}>
              {bidNumber || "Compare with a BID"}
            </span>
            <ChevronDown size={11} />
          </button>
          {bidNumber && (
            <button
              className={styles.bidClear}
              onClick={() => pickBid(null)}
              aria-label="Stop comparing with the BID"
              title="View the diagram without a BID"
            >
              <X size={11} />
            </button>
          )}
          {bidOpen && (
            <div className={styles.bidPopover}>
              <input
                className={styles.bidSearch}
                placeholder="Search BID number, CRM, client or project…"
                value={bidQuery}
                onChange={(e) => setBidQuery(e.target.value)}
                autoFocus
              />
              <div className={styles.bidList}>
                <button
                  className={`${styles.bidOption} ${!bidNumber ? styles.bidOptionActive : ""}`}
                  onClick={() => pickBid(null)}
                >
                  <span className={styles.bidNumber}>No BID</span>
                  <span className={styles.bidText}>View the diagram only</span>
                </button>
                {bidOptions.map((b) => (
                  <button
                    key={b.bidNumber}
                    className={`${styles.bidOption} ${
                      b.bidNumber === bidNumber ? styles.bidOptionActive : ""
                    }`}
                    onClick={() => pickBid(b.bidNumber)}
                  >
                    <span className={styles.bidNumber}>{b.bidNumber}</span>
                    <span className={styles.bidText}>
                      {[
                        b.opportunityInfo?.client,
                        b.opportunityInfo?.projectName,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "-"}
                    </span>
                    <span className={styles.bidMeta}>
                      {b.division} · {b.currentStatus}
                    </span>
                  </button>
                ))}
                {bidOptions.length === 0 && (
                  <span className={styles.bidEmpty}>No BIDs found.</span>
                )}
              </div>
            </div>
          )}
        </div>
        {selectedBid && (
          <span className={styles.bidClient}>
            {selectedBid.opportunityInfo?.client || selectedBid.currentStatus}
          </span>
        )}

        {view === "system" && spreads.length > 0 && (
          <label
            className={styles.selectChip}
            title="One-line diagram (spread template)"
          >
            <span className={styles.selectLabel}>DIAGRAM</span>
            <select
              value={spread ? spread.id : ""}
              onChange={(e) => setSpreadId(e.target.value)}
              aria-label="Diagram"
            >
              {spreads.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
            </select>
            <ChevronDown size={10} />
          </label>
        )}

        <span className={styles.spacer} />

        <div className={styles.viewToggle} role="tablist">
          <button
            role="tab"
            aria-selected={view === "equipment"}
            className={view === "equipment" ? styles.viewActive : ""}
            onClick={() => navigate(ROUTES.surveyEquipment)}
            title="Equipment explorer"
          >
            <LayoutGrid size={12} />
          </button>
          <button
            role="tab"
            aria-selected={view === "system"}
            className={view === "system" ? styles.viewActive : ""}
            onClick={() => navigate(ROUTES.surveySystem)}
            title="3D system view"
          >
            <Box size={12} />
          </button>
        </div>
        {canImport && (
          <>
            <button
              className={styles.iconBtn}
              onClick={() => fileRef.current?.click()}
              disabled={importing}
              title={
                importing
                  ? "Importing…"
                  : "Import catalog (survey-catalog.seed.json and optional photos)"
              }
              aria-label="Import catalog"
            >
              <Upload size={13} />
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json,image/png,image/jpeg,image/webp"
              multiple
              hidden
              onChange={handleImport}
            />
          </>
        )}
        <button
          className={styles.packageBtn}
          onClick={onOpenPackage}
          title={bidNumber ? `Package for ${bidNumber}` : "Bid package"}
        >
          <Package size={13} />
          Bid package
          <span className={styles.packageCount}>{packageQty}</span>
        </button>
      </div>
    </div>
  );
};
