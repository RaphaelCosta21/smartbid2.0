/**
 * PartNumberAutocomplete — Autocomplete input for Part Number and Equipment
 * description fields. Shows up to 8 results searched in cascade across the
 * "Add Items from Catalog" sources: Query Consulting → Quotations →
 * BOM Costs → Assets Catalog → Favorites.
 */
import * as React from "react";
import styles from "./PartNumberAutocomplete.module.scss";
import { useQuerySearch } from "../../hooks/useQuerySearch";
import { ISearchResultItem, CatalogSearchBucket } from "../../models";

export interface PartNumberAutocompleteProps {
  /** Current field value */
  value: string;
  /** Which field to match: PN prefix, description substring, or both */
  searchField: "pn" | "description" | "both";
  /** Called when text changes (typed value) */
  onChange: (value: string) => void;
  /** Called when an item is selected from dropdown — fills both fields */
  onSelect: (pn: string, description: string) => void;
  /** Disable editing */
  readOnly?: boolean;
  /** Use monospace font (for PN fields) */
  mono?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Called on blur (after dropdown interactions) */
  onBlur?: () => void;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Restrict which sources are searched. E.g. ["query"] for the Peoplesoft catalog only. */
  sourcesFilter?: CatalogSearchBucket[];
}

/** Source label map */
const SOURCE_LABELS: Record<string, { label: string; cls: string }> = {
  AR: { label: "PS Brazil", cls: "badgeAR" },
  PS: { label: "PS Financials", cls: "badgePS" },
  FAR: { label: "PS Fin. Registered", cls: "badgePS" },
  QUOTE: { label: "Quotation", cls: "badgeQUOTE" },
  BOMCOST: { label: "BOM Cost", cls: "badgeBOM" },
  ASSET: { label: "Asset", cls: "badgeASSET" },
  FAV: { label: "Favorite", cls: "badgeFAV" },
  BUMBL: { label: "BUMBL", cls: "badgeBOM" },
  BUMBR: { label: "BUMBR", cls: "badgeBOM" },
  FIN: { label: "Financials", cls: "badgeFIN" },
};

export const PartNumberAutocomplete: React.FC<PartNumberAutocompleteProps> = (
  props,
) => {
  const {
    value,
    searchField,
    onChange,
    onSelect,
    readOnly,
    mono,
    placeholder,
    onBlur,
    autoFocus,
    sourcesFilter,
  } = props;

  const { setQuery, results, isSearching, isCatalogLoading } = useQuerySearch({
    searchField,
    debounceMs: 300,
    limit: 8,
    skipLoad: readOnly,
    sources: sourcesFilter,
  });

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const [dropdownPos, setDropdownPos] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Update search query when value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    onChange(v);
    setQuery(v);
    setShowDropdown(true);
    setHighlightIndex(-1);
    updateDropdownPos();
  };

  const handleFocus = (): void => {
    if (value && value.length >= 2) {
      setQuery(value);
      setShowDropdown(true);
      updateDropdownPos();
    }
  };

  /** Calculate fixed position for dropdown based on input rect */
  const updateDropdownPos = (): void => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 4,
        left: rect.left,
        width: Math.max(rect.width, 360),
      });
    }
  };

  const handleSelectItem = (item: ISearchResultItem): void => {
    onSelect(item.pn, item.description);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!showDropdown || results.length === 0) {
      if (e.key === "Escape" && onBlur) onBlur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelectItem(results[highlightIndex]);
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      if (onBlur) onBlur();
    }
  };

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close/reposition dropdown on scroll
  React.useEffect(() => {
    if (!showDropdown) return;
    const handleScroll = (): void => {
      updateDropdownPos();
    };
    window.addEventListener("scroll", handleScroll, true);
    return () => window.removeEventListener("scroll", handleScroll, true);
  }, [showDropdown]);

  // Auto-focus
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  if (readOnly) {
    return (
      <span className={mono ? styles.monoText : styles.plainText}>
        {value || "-"}
      </span>
    );
  }

  return (
    <div ref={containerRef} className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={`${styles.input} ${mono ? styles.mono : ""}`}
        value={value}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
      />

      {showDropdown &&
        (results.length > 0 || isSearching || isCatalogLoading) && (
          <div
            className={styles.dropdown}
            style={
              dropdownPos
                ? {
                    position: "fixed",
                    top: dropdownPos.top,
                    left: dropdownPos.left,
                    width: dropdownPos.width,
                  }
                : undefined
            }
          >
            {isCatalogLoading && (
              <div className={styles.loadingRow}>
                <span className={styles.spinner} />
                Loading catalog...
              </div>
            )}

            {!isCatalogLoading && isSearching && (
              <div className={styles.loadingRow}>
                <span className={styles.spinner} />
                Searching...
              </div>
            )}

            {!isCatalogLoading &&
              !isSearching &&
              results.map((item, i) => {
                const srcDef = SOURCE_LABELS[item.source] || {
                  label: item.source,
                  cls: "badgeAR",
                };
                return (
                  <div
                    key={`${item.source}-${i}`}
                    className={`${styles.resultRow} ${i === highlightIndex ? styles.highlighted : ""}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleSelectItem(item);
                    }}
                    onMouseEnter={() => setHighlightIndex(i)}
                  >
                    <span className={styles.resultPN}>{item.pn}</span>
                    <span className={styles.resultDesc}>
                      {item.description.length > 60
                        ? item.description.substring(0, 57) + "..."
                        : item.description}
                    </span>
                    <span
                      className={`${styles.sourceBadge} ${styles[srcDef.cls] || ""}`}
                    >
                      {srcDef.label}
                    </span>
                  </div>
                );
              })}

            {!isCatalogLoading &&
              !isSearching &&
              results.length === 0 &&
              value.length >= 2 && (
                <div className={styles.emptyRow}>No items found</div>
              )}
          </div>
        )}
    </div>
  );
};

export default PartNumberAutocomplete;
