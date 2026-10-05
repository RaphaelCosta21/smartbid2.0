/**
 * ColumnFilter — funnel button for a table header that opens a faceted
 * multi-select. The panel is portaled into the app root so table overflow and
 * sticky/blurred headers can't clip it.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import { Filter } from "lucide-react";
import {
  MultiSelectOption,
  MultiSelectPanel,
} from "../insights/MultiSelectDropdown";
import globalStyles from "../../styles/globals.module.scss";
import styles from "./ColumnFilter.module.scss";

interface ColumnFilterProps {
  label: string;
  options: MultiSelectOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
}

const PANEL_WIDTH = 280;
const PANEL_STYLE: React.CSSProperties = { position: "static" };

export const ColumnFilter: React.FC<ColumnFilterProps> = ({
  label,
  options,
  selected,
  onChange,
  searchable,
}) => {
  const [pos, setPos] = React.useState<{ top: number; left: number } | null>(
    null,
  );
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const open = pos !== null;

  const toggle = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (open || !btnRef.current) {
      setPos(null);
      return;
    }
    const r = btnRef.current.getBoundingClientRect();
    const left = Math.max(
      8,
      Math.min(r.left - 8, window.innerWidth - PANEL_WIDTH - 8),
    );
    setPos({ top: r.bottom + 6, left });
  };

  React.useEffect(() => {
    if (!open) return undefined;
    const close = (): void => setPos(null);
    const inside = (t: EventTarget | null): boolean =>
      !!t &&
      ((!!panelRef.current && panelRef.current.contains(t as Node)) ||
        (!!btnRef.current && btnRef.current.contains(t as Node)));
    const onDown = (e: MouseEvent): void => {
      if (!inside(e.target)) close();
    };
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") close();
    };
    const onScroll = (e: Event): void => {
      if (!inside(e.target)) close();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", close);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  const host =
    (btnRef.current?.closest(
      `.${globalStyles.smartBidRoot}`,
    ) as HTMLElement | null) || document.body;

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`${styles.trigger} ${selected.length ? styles.active : ""} ${open ? styles.open : ""}`}
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Filter ${label}`}
        title={
          selected.length
            ? `${label}: ${selected.length} selected`
            : `Filter ${label}`
        }
      >
        <Filter size={12} />
        {selected.length > 0 && (
          <span className={styles.count}>{selected.length}</span>
        )}
      </button>
      {pos &&
        ReactDOM.createPortal(
          <div
            ref={panelRef}
            className={styles.portal}
            style={{ top: pos.top, left: pos.left, width: PANEL_WIDTH }}
            onClick={(e) => e.stopPropagation()}
          >
            <MultiSelectPanel
              label={label}
              options={options}
              selected={selected}
              onChange={onChange}
              searchable={searchable}
              style={PANEL_STYLE}
            />
          </div>,
          host,
        )}
    </>
  );
};
