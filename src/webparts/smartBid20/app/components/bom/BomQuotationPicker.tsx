import * as React from "react";
import { ExternalLink, Eye, Paperclip, Search, X } from "lucide-react";
import { IExchangeRate, IQuotationItem } from "../../models";
import { QuotationService } from "../../services/QuotationService";
import { convertToUSD } from "../../utils/costCalculations";
import {
  formatAmount,
  formatCurrency,
  formatDate,
} from "../../utils/formatters";
import { dateAgeBucket } from "../../utils/bomCostHelpers";
import { getAdoptBlockReason } from "../../utils/quotationLinks";
import {
  MultiSelectDropdown,
  MultiSelectOption,
} from "../insights/MultiSelectDropdown";
import { SegmentedControl } from "../insights/SegmentedControl";
import styles from "./BomQuotationPicker.module.scss";

type TypeFilter = "all" | "acquisition" | "rental";

const MAX_RESULTS = 50;

export interface IBomQuotationPickerProps {
  quotes: IQuotationItem[];
  loading: boolean;
  initialQuery: string;
  /** Quotations created from this drawer, shown first with a "New" chip */
  recentIds: string[];
  /** Quotation currently applied to the BOM row */
  selectedId?: string;
  exchangeRates: IExchangeRate[];
  readOnly: boolean;
  onSelect: (q: IQuotationItem) => void;
  onView: (q: IQuotationItem) => void;
  /** Link to the Quotations page for one quotation; omit when the user can't open it */
  getOpenHref?: (q: IQuotationItem) => string;
}

export const BomQuotationPicker: React.FC<IBomQuotationPickerProps> = ({
  quotes,
  loading,
  initialQuery,
  recentIds,
  selectedId,
  exchangeRates,
  readOnly,
  onSelect,
  onView,
  getOpenHref,
}) => {
  const [query, setQuery] = React.useState(initialQuery);
  const [type, setType] = React.useState<TypeFilter>("all");
  const [suppliers, setSuppliers] = React.useState<string[]>([]);

  const matchesQuery = React.useCallback(
    (q: IQuotationItem): boolean => {
      const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
      if (terms.length === 0) return true;
      const hay =
        `${q.partNumber} ${q.description} ${q.supplier} ${q.reference || ""} ${q.notes || ""}`.toLowerCase();
      return terms.every((t) => hay.indexOf(t) !== -1);
    },
    [query],
  );

  const supplierOptions = React.useMemo<MultiSelectOption[]>(() => {
    const counts: Record<string, number> = {};
    quotes.forEach((q) => {
      if (!q.supplier) return;
      if (type !== "all" && q.type !== type) return;
      if (!matchesQuery(q)) return;
      counts[q.supplier] = (counts[q.supplier] || 0) + 1;
    });
    const all: Record<string, true> = {};
    quotes.forEach((q) => {
      if (q.supplier) all[q.supplier] = true;
    });
    return Object.keys(all)
      .sort((a, b) => a.localeCompare(b))
      .map((s) => ({ value: s, label: s, count: counts[s] || 0 }));
  }, [quotes, type, matchesQuery]);

  const filtered = React.useMemo(() => {
    const list = quotes.filter(
      (q) =>
        (type === "all" || q.type === type) &&
        (suppliers.length === 0 || suppliers.indexOf(q.supplier) >= 0) &&
        matchesQuery(q),
    );
    const rank = (q: IQuotationItem): number =>
      recentIds.indexOf(q.id) >= 0 ? 0 : q.id === selectedId ? 1 : 2;
    return list.sort((a, b) => {
      const byRank = rank(a) - rank(b);
      if (byRank !== 0) return byRank;
      return (b.quotationDate || "").localeCompare(a.quotationDate || "");
    });
  }, [quotes, type, suppliers, matchesQuery, recentIds, selectedId]);

  const hasFilters = query !== "" || type !== "all" || suppliers.length > 0;

  const usd = (q: IQuotationItem): number =>
    q.costUSD > 0 ? q.costUSD : convertToUSD(q.cost, q.currency, exchangeRates);

  return (
    <div className={styles.root}>
      <div className={styles.headRow}>
        <h3>Quotations catalog</h3>
        <span className={styles.count}>
          {filtered.length} of {quotes.length}
        </span>
      </div>

      <div className={styles.filters}>
        <div className={styles.search}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search part number, description, supplier or ref..."
            value={query}
            onChange={(e) => setQuery(e.currentTarget.value)}
            aria-label="Search quotations"
          />
          {query && (
            <button
              type="button"
              className={styles.searchClear}
              onClick={() => setQuery("")}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>
        <div className={styles.filterRow}>
          <SegmentedControl<TypeFilter>
            value={type}
            size="sm"
            ariaLabel="Quotation type"
            segments={[
              { value: "all", label: "All" },
              { value: "acquisition", label: "Purchase" },
              { value: "rental", label: "Rental" },
            ]}
            onChange={setType}
          />
          <MultiSelectDropdown
            label="Supplier"
            options={supplierOptions}
            selected={suppliers}
            onChange={setSuppliers}
            searchable
          />
          {hasFilters && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={() => {
                setQuery("");
                setType("all");
                setSuppliers([]);
              }}
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <p className={styles.empty}>Loading quotations...</p>
      ) : filtered.length === 0 ? (
        <p className={styles.empty}>
          {hasFilters
            ? "No quotations match the filters."
            : "The catalog has no quotations yet."}{" "}
          {!readOnly && "Create one below."}
        </p>
      ) : (
        <div className={styles.list}>
          {filtered.slice(0, MAX_RESULTS).map((q) => {
            const block = getAdoptBlockReason(q, false);
            const age = dateAgeBucket(q.quotationDate);
            const isNew = recentIds.indexOf(q.id) >= 0;
            const isUsed = q.id === selectedId;
            return (
              <div
                key={q.id}
                className={`${styles.row} ${isUsed ? styles.rowUsed : ""}`}
              >
                <div className={styles.main}>
                  <div className={styles.top}>
                    <span className={styles.pn}>{q.partNumber || "-"}</span>
                    {isNew && <span className={styles.chipNew}>New</span>}
                    {isUsed && <span className={styles.chipUsed}>In use</span>}
                    <span
                      className={`${styles.typeTag} ${q.type === "rental" ? styles.typeRental : ""}`}
                    >
                      {q.type === "rental" ? "Rental" : "Purchase"}
                    </span>
                  </div>
                  <div className={styles.desc} title={q.description}>
                    {q.description || "-"}
                  </div>
                  <div className={styles.meta}>
                    <span>{q.supplier || "-"}</span>
                    {q.reference && <span>Ref {q.reference}</span>}
                    {q.leadTimeDays > 0 && <span>{q.leadTimeDays}d lead</span>}
                    <span
                      className={
                        age === "old"
                          ? styles.ageOld
                          : age === "warn"
                            ? styles.ageWarn
                            : undefined
                      }
                    >
                      {q.quotationDate ? formatDate(q.quotationDate) : "-"}
                    </span>
                    {q.fileUrl && (
                      <a
                        className={styles.fileLink}
                        href={QuotationService.getFileOpenUrl(q.fileUrl)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Paperclip size={11} /> File
                      </a>
                    )}
                  </div>
                </div>
                <div className={styles.priceCol}>
                  <span className={styles.price}>
                    {formatCurrency(usd(q), "USD")}
                    {q.type === "rental" ? " / day" : ""}
                  </span>
                  {q.currency !== "USD" && (
                    <span className={styles.approx}>
                      {formatAmount(q.cost, q.currency)}
                    </span>
                  )}
                </div>
                <div className={styles.actions}>
                  {!readOnly && (
                    <button
                      type="button"
                      className={styles.selectBtn}
                      disabled={!!block || isUsed}
                      title={
                        block || (isUsed ? "Already applied" : "Use this price")
                      }
                      onClick={() => onSelect(q)}
                    >
                      Select
                    </button>
                  )}
                  <button
                    type="button"
                    className={styles.iconBtn}
                    title="View details"
                    aria-label="View details"
                    onClick={() => onView(q)}
                  >
                    <Eye size={14} />
                  </button>
                  {getOpenHref && (
                    <a
                      className={styles.iconBtn}
                      href={getOpenHref(q)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Quotations"
                      aria-label="Open in Quotations"
                    >
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {filtered.length > MAX_RESULTS && (
            <p className={styles.more}>
              Showing {MAX_RESULTS} of {filtered.length}. Refine the search.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
