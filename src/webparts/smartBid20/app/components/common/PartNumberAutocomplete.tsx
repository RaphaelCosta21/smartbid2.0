/**
 * PartNumberAutocomplete — Multi-source autocomplete input for Part Number
 * and Equipment description fields. Searches across Query Catalog,
 * Favorites, and BOM sheets with grouped dropdown results.
 */
import * as React from "react";
import styles from "./PartNumberAutocomplete.module.scss";
import { useQuerySearch } from "../../hooks/useQuerySearch";
import { ISearchResultItem, IMultiSourceResults } from "../../models";

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
  /** Restrict which source sections to display. E.g. ["query","bomCosts"] to hide favorites. */
  sourcesFilter?: (keyof IMultiSourceResults)[];
}

/** Source label map */
const SOURCE_LABELS: Record<string, { label: string; cls: string }> = {
  AR: { label: "PS Brazil", cls: "badgeAR" },
  PS: { label: "PS Financials", cls: "badgePS" },
  FAV: { label: "Favorite", cls: "badgeFAV" },
  BUMBL: { label: "BUMBL", cls: "badgeBOM" },
  BUMBR: { label: "BUMBR", cls: "badgeBOM" },
  FIN: { label: "Financials", cls: "badgeFIN" },
};

interface SectionDef {
  key: keyof IMultiSourceResults;
  icon: string;
  label: string;
}

const SECTIONS: SectionDef[] = [
  { key: "query", icon: "📋", label: "Peoplesoft Catalog" },
  { key: "favorites", icon: "⭐", label: "Favorites" },
];

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
    limitPerSource: 5,
  });

  // Filter sections to display based on sourcesFilter prop
  const visibleSections = React.useMemo(
    () =>
      sourcesFilter
        ? SECTIONS.filter((s) => sourcesFilter.indexOf(s.key) >= 0)
        : SECTIONS,
    [sourcesFilter],
  );

  const filteredTotalResults = React.useMemo(() => {
    let count = 0;
    visibleSections.forEach((sec) => {
      const items = results[sec.key];
      if (items) count += items.length;
    });
    return count;
  }, [results, visibleSections]);

  const [showDropdown, setShowDropdown] = React.useState(false);
  const [highlightIndex, setHighlightIndex] = React.useState(-1);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Build flat list for keyboard navigation
  const flatItems = React.useMemo((): ISearchResultItem[] => {
    const list: ISearchResultItem[] = [];
    visibleSections.forEach((sec) => {
      const items = results[sec.key];
      if (items && items.length > 0) {
        items.forEach((item) => list.push(item));
      }
    });
    return list;
  }, [results, visibleSections]);

  // Update search query when value changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const v = e.target.value;
    onChange(v);
    setQuery(v);
    setShowDropdown(true);
    setHighlightIndex(-1);
  };

  const handleFocus = (): void => {
    if (value && value.length >= 2) {
      setQuery(value);
      setShowDropdown(true);
    }
  };

  const handleSelectItem = (item: ISearchResultItem): void => {
    onSelect(item.pn, item.description);
    setShowDropdown(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!showDropdown || flatItems.length === 0) {
      if (e.key === "Escape" && onBlur) onBlur();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev < flatItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev > 0 ? prev - 1 : flatItems.length - 1));
    } else if (e.key === "Enter" && highlightIndex >= 0) {
      e.preventDefault();
      handleSelectItem(flatItems[highlightIndex]);
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

  // Auto-focus
  React.useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  if (readOnly) {
    return (
      <span className={mono ? styles.monoText : styles.plainText}>
        {value || "—"}
      </span>
    );
  }

  let flatIdx = -1; // Track position for highlight

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
        (filteredTotalResults > 0 || isSearching || isCatalogLoading) && (
          <div className={styles.dropdown}>
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
              visibleSections.map((sec) => {
                const items = results[sec.key];
                if (!items || items.length === 0) return null;
                return (
                  <div key={sec.key} className={styles.section}>
                    <div className={styles.sectionHeader}>
                      <span className={styles.sectionIcon}>{sec.icon}</span>
                      {sec.label}
                      <span className={styles.sectionCount}>
                        {items.length}
                      </span>
                    </div>
                    {items.map((item, i) => {
                      flatIdx++;
                      const currentFlatIdx = flatIdx;
                      const isHighlighted = currentFlatIdx === highlightIndex;
                      const srcDef = SOURCE_LABELS[item.source] || {
                        label: item.source,
                        cls: "badgeAR",
                      };
                      return (
                        <div
                          key={`${sec.key}-${i}`}
                          className={`${styles.resultRow} ${isHighlighted ? styles.highlighted : ""}`}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSelectItem(item);
                          }}
                          onMouseEnter={() => setHighlightIndex(currentFlatIdx)}
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
                  </div>
                );
              })}

            {!isCatalogLoading &&
              !isSearching &&
              filteredTotalResults === 0 &&
              value.length >= 2 && (
                <div className={styles.emptyRow}>No items found</div>
              )}
          </div>
        )}
    </div>
  );
};

export default PartNumberAutocomplete;
