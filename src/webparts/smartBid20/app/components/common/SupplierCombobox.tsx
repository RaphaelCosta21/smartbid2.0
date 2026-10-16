/**
 * SupplierCombobox — Supplier field for quotations: suggests registered
 * suppliers (name + aliases) and still accepts a new name, which is added to
 * the Suppliers page when the quotation is saved.
 */
import * as React from "react";
import { CircleCheck, Lightbulb, Plus } from "lucide-react";
import { useSupplierStore } from "../../stores/useSupplierStore";
import {
  findPossibleMatch,
  findSupplierMatch,
  rankSupplierSuggestions,
} from "../../utils/supplierMatching";
import styles from "./SupplierCombobox.module.scss";

const MAX_SUGGESTIONS = 8;

export interface SupplierComboboxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const SupplierCombobox: React.FC<SupplierComboboxProps> = ({
  value,
  onChange,
  placeholder,
  disabled,
}) => {
  const suppliers = useSupplierStore((s) => s.suppliers);
  const isLoaded = useSupplierStore((s) => s.isLoaded);
  const loadSuppliers = useSupplierStore((s) => s.loadSuppliers);

  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(-1);
  const [pos, setPos] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    void loadSuppliers();
  }, [loadSuppliers]);

  const suggestions = React.useMemo(
    () => rankSupplierSuggestions(value, suppliers, MAX_SUGGESTIONS),
    [value, suppliers],
  );
  const match = React.useMemo(
    () => (value.trim() ? findSupplierMatch(value, suppliers) : undefined),
    [value, suppliers],
  );
  const possible = React.useMemo(
    () =>
      value.trim() && !match ? findPossibleMatch(value, suppliers) : undefined,
    [value, suppliers, match],
  );

  const updatePos = (): void => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  const openList = (): void => {
    updatePos();
    setOpen(true);
  };

  const choose = (name: string): void => {
    onChange(name);
    setOpen(false);
    setHighlight(-1);
  };

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        setOpen(false);
    };
    const onScroll = (): void => updatePos();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  const handleBlur = (): void => {
    // Typed variants of a registered supplier are saved under its registered name.
    if (match && match.name !== value) onChange(match.name);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      openList();
      return;
    }
    if (suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h < suggestions.length - 1 ? h + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h > 0 ? h - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && open && highlight >= 0) {
      e.preventDefault();
      choose(suggestions[highlight].supplier.name);
    }
  };

  const trimmed = value.trim();

  return (
    <div ref={containerRef} className={styles.container}>
      <input
        ref={inputRef}
        type="text"
        className={styles.input}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => {
          onChange(e.target.value);
          setHighlight(-1);
          openList();
        }}
        onFocus={openList}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />

      {open && suggestions.length > 0 && (
        <div
          className={styles.dropdown}
          role="listbox"
          style={
            pos
              ? {
                  top: pos.top,
                  left: pos.left,
                  width: Math.max(pos.width, 260),
                }
              : undefined
          }
        >
          {suggestions.map((s, i) => (
            <div
              key={s.supplier.id}
              role="option"
              aria-selected={i === highlight}
              className={`${styles.option} ${i === highlight ? styles.highlighted : ""}`}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s.supplier.name);
              }}
              onMouseEnter={() => setHighlight(i)}
            >
              <span className={styles.optionName}>{s.supplier.name}</span>
              {s.matchedAlias && (
                <span className={styles.optionAlias}>aka {s.matchedAlias}</span>
              )}
              {!s.supplier.active && (
                <span className={styles.inactiveTag}>Inactive</span>
              )}
            </div>
          ))}
        </div>
      )}

      {trimmed && isLoaded && (
        <div className={styles.status}>
          {match ? (
            <span className={styles.statusRegistered}>
              <CircleCheck size={12} /> Registered supplier
            </span>
          ) : possible ? (
            <span className={styles.statusPossible}>
              <Lightbulb size={12} /> Possible match: {possible.name}
              <button
                type="button"
                className={styles.useBtn}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(possible.name)}
              >
                Use {possible.name}
              </button>
            </span>
          ) : (
            <span className={styles.statusNew}>
              <Plus size={12} /> New - will be added to Suppliers
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SupplierCombobox;
