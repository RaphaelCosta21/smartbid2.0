/**
 * BidSelect / MultiBidSelect — searchable pickers for BIDs. A native <select> can't be
 * filtered by typing, and a BID is found by its number or its project name.
 */
import * as React from "react";
import { IBid } from "../../models";
import styles from "./BidSelect.module.scss";

export interface IBidOption {
  bidNumber: string;
  label: string;
}

const LABEL_MAX = 48;

/** Newest BID numbers first, labelled "BID — project" */
export function buildBidOptions(bids: IBid[]): IBidOption[] {
  return bids
    .map((b) => {
      const project =
        (b.opportunityInfo && b.opportunityInfo.projectName) || "";
      return {
        bidNumber: b.bidNumber,
        label: project
          ? `${b.bidNumber} — ${project.slice(0, LABEL_MAX)}`
          : b.bidNumber,
      };
    })
    .sort((a, b) => (a.bidNumber < b.bidNumber ? 1 : -1));
}

/** Closes the dropdown on an outside click */
function useOutsideClose(
  open: boolean,
  onClose: () => void,
): React.RefObject<HTMLDivElement> {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open, onClose]);
  return ref;
}

function filterOptions(options: IBidOption[], query: string): IBidOption[] {
  const q = query.trim().toLowerCase();
  if (!q) return options;
  return options.filter((o) => o.label.toLowerCase().indexOf(q) !== -1);
}

export interface BidSelectProps {
  options: IBidOption[];
  value: string;
  onChange: (bidNumber: string) => void;
  placeholder?: string;
}

export const BidSelect: React.FC<BidSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select a BID…",
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const close = React.useCallback(() => setOpen(false), []);
  const ref = useOutsideClose(open, close);

  const selected = options.find((o) => o.bidNumber === value);
  const filtered = React.useMemo(
    () => filterOptions(options, query),
    [options, query],
  );

  return (
    <div className={styles.root} ref={ref}>
      <button
        type="button"
        className={styles.trigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
      >
        <span className={selected ? styles.value : styles.placeholder}>
          {selected ? selected.label : placeholder}
        </span>
        <span className={styles.caret} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className={styles.menu}>
          <input
            autoFocus
            className={styles.search}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search BID or project…"
          />
          <div className={styles.list} role="listbox">
            {filtered.length === 0 ? (
              <div className={styles.none}>No BID found.</div>
            ) : (
              filtered.map((o) => (
                <button
                  key={o.bidNumber}
                  type="button"
                  role="option"
                  aria-selected={o.bidNumber === value}
                  className={`${styles.option} ${
                    o.bidNumber === value ? styles.optionActive : ""
                  }`}
                  title={o.label}
                  onClick={() => {
                    onChange(o.bidNumber);
                    setOpen(false);
                  }}
                >
                  {o.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export interface MultiBidSelectProps {
  options: IBidOption[];
  values: string[];
  onToggle: (bidNumber: string) => void;
  onClear: () => void;
  placeholder?: string;
}

export const MultiBidSelect: React.FC<MultiBidSelectProps> = ({
  options,
  values,
  onToggle,
  onClear,
  placeholder = "Select BIDs…",
}) => {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const close = React.useCallback(() => setOpen(false), []);
  const ref = useOutsideClose(open, close);

  const filtered = React.useMemo(
    () => filterOptions(options, query),
    [options, query],
  );
  const labelOf = (id: string): string => {
    const o = options.find((x) => x.bidNumber === id);
    return o ? o.label : id;
  };

  return (
    <div className={styles.multi}>
      <div className={styles.root} ref={ref}>
        <button
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => {
            setOpen((o) => !o);
            setQuery("");
          }}
        >
          <span className={values.length ? styles.value : styles.placeholder}>
            {values.length ? `${values.length} BID(s) selected` : placeholder}
          </span>
          <span className={styles.caret} aria-hidden>
            ▾
          </span>
        </button>
        {open && (
          <div className={styles.menu}>
            <input
              autoFocus
              className={styles.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search BID or project…"
            />
            <div className={styles.list} role="listbox" aria-multiselectable>
              {filtered.length === 0 ? (
                <div className={styles.none}>No BID found.</div>
              ) : (
                filtered.map((o) => {
                  const on = values.indexOf(o.bidNumber) !== -1;
                  return (
                    <label
                      key={o.bidNumber}
                      className={`${styles.check} ${on ? styles.optionActive : ""}`}
                      title={o.label}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => onToggle(o.bidNumber)}
                      />
                      <span>{o.label}</span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {values.length > 0 && (
        <div className={styles.tags}>
          {values.map((id) => (
            <span key={id} className={styles.tag} title={labelOf(id)}>
              <span className={styles.tagText}>{labelOf(id)}</span>
              <button
                type="button"
                className={styles.tagRemove}
                onClick={() => onToggle(id)}
                aria-label={`Remove ${id}`}
              >
                ✕
              </button>
            </span>
          ))}
          <button type="button" className={styles.clear} onClick={onClear}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
