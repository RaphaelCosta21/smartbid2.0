import * as React from "react";
import styles from "./MultiSelectDropdown.module.scss";

export interface MultiSelectOption {
  value: string;
  label: string;
  color?: string;
}

interface MultiSelectDropdownProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  icon?: React.ReactNode;
}

/**
 * MultiSelectDropdown — compact glass popover multi-select with checkboxes.
 */
export const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  label,
  options,
  selected,
  onChange,
  icon,
}) => {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const toggle = (v: string): void => {
    if (selected.indexOf(v) >= 0) {
      onChange(selected.filter((s) => s !== v));
    } else {
      onChange(selected.concat(v));
    }
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={`${styles.trigger} ${selected.length ? styles.hasValue : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {icon && <span className={styles.tIcon}>{icon}</span>}
        <span className={styles.tLabel}>{label}</span>
        {selected.length > 0 && (
          <span className={styles.count}>{selected.length}</span>
        )}
        <svg
          className={styles.chevron}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className={styles.panel} role="listbox">
          <div className={styles.panelHead}>
            <span>{label}</span>
            {selected.length > 0 && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => onChange([])}
              >
                Limpar
              </button>
            )}
          </div>
          <div className={styles.options}>
            {options.map((o) => (
              <label className={styles.option} key={o.value}>
                <input
                  type="checkbox"
                  checked={selected.indexOf(o.value) >= 0}
                  onChange={() => toggle(o.value)}
                />
                {o.color && (
                  <span
                    className={styles.swatch}
                    style={{ background: o.color }}
                  />
                )}
                <span className={styles.optLabel}>{o.label}</span>
              </label>
            ))}
            {options.length === 0 && (
              <div className={styles.empty}>Sem opções</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
