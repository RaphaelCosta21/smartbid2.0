import * as React from "react";
import { Check, ChevronDown, Plus } from "lucide-react";
import { makeId } from "../../utils/idGenerator";
import styles from "./SuggestionInput.module.scss";

export interface SuggestionInputProps {
  /** Text shown in the input */
  value: string;
  onChange: (text: string) => void;
  onBlur?: (text: string) => void;
  suggestions: string[];
  /** Hint prefix shown when the text matches no suggestion, e.g. "New table" */
  customHint?: string;
  id?: string;
  className?: string;
  placeholder?: string;
  title?: string;
  autoFocus?: boolean;
}

/** Free-text input with a themed suggestion list (replaces the native datalist). */
export const SuggestionInput: React.FC<SuggestionInputProps> = ({
  value,
  onChange,
  onBlur,
  suggestions,
  customHint,
  id,
  className,
  placeholder,
  title,
  autoFocus,
}) => {
  const listId = React.useRef(makeId("sugg")).current;

  const [open, setOpen] = React.useState(false);
  const [highlight, setHighlight] = React.useState(-1);
  // Show every option until the user types, so a selected value doesn't hide the rest.
  const [filtering, setFiltering] = React.useState(false);
  const [pos, setPos] = React.useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const query = value.trim().toLowerCase();
  const visible = React.useMemo(
    () =>
      filtering && query
        ? suggestions.filter((s) => s.toLowerCase().indexOf(query) !== -1)
        : suggestions,
    [suggestions, filtering, query],
  );
  const isNew =
    !!customHint &&
    !!query &&
    !suggestions.some((s) => s.toLowerCase() === query);

  const updatePos = (): void => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  const openList = (): void => {
    updatePos();
    setOpen(true);
  };

  const closeList = (): void => {
    setOpen(false);
    setFiltering(false);
    setHighlight(-1);
  };

  const choose = (text: string): void => {
    onChange(text);
    closeList();
  };

  React.useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e: MouseEvent): void => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      )
        closeList();
    };
    const onScroll = (): void => updatePos();
    document.addEventListener("mousedown", onDoc);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Escape") {
      if (open) e.stopPropagation();
      closeList();
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      openList();
      return;
    }
    if (visible.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h < visible.length - 1 ? h + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h > 0 ? h - 1 : visible.length - 1));
    } else if (e.key === "Enter" && open && highlight >= 0) {
      e.preventDefault();
      choose(visible[highlight]);
    }
  };

  const showList = open && (visible.length > 0 || isNew);

  return (
    <div ref={containerRef} className={styles.container}>
      <input
        ref={inputRef}
        id={id}
        type="text"
        className={className || styles.input}
        value={value}
        placeholder={placeholder}
        title={title}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck={false}
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        onFocus={openList}
        onClick={() => !open && openList()}
        onChange={(e) => {
          onChange(e.target.value);
          setFiltering(true);
          setHighlight(-1);
          if (!open) openList();
        }}
        onBlur={(e) => onBlur?.(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        className={`${styles.toggle} ${showList ? styles.toggleOpen : ""}`}
        tabIndex={-1}
        aria-label="Show suggestions"
        onMouseDown={(e) => {
          e.preventDefault();
          if (open) {
            closeList();
          } else {
            inputRef.current?.focus();
            openList();
          }
        }}
      >
        <ChevronDown size={14} />
      </button>

      {showList && (
        <div
          id={listId}
          className={styles.dropdown}
          role="listbox"
          style={
            pos
              ? {
                  top: pos.top,
                  left: pos.left,
                  width: Math.max(pos.width, 220),
                }
              : undefined
          }
        >
          {visible.map((s, i) => {
            const selected = s.toLowerCase() === query;
            return (
              <div
                key={s}
                role="option"
                aria-selected={selected}
                className={`${styles.option} ${i === highlight ? styles.highlighted : ""} ${selected ? styles.selected : ""}`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(s);
                }}
                onMouseEnter={() => setHighlight(i)}
              >
                <span className={styles.optionLabel}>{s}</span>
                {selected && <Check size={14} className={styles.check} />}
              </div>
            );
          })}
          {isNew && (
            <div className={styles.newHint}>
              <Plus size={12} /> {customHint}: &quot;{value.trim()}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SuggestionInput;
