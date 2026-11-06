/**
 * PresentationToolbar — floating liquid-glass bar: display currency, share link,
 * export and present (focus) mode.
 */
import * as React from "react";
import {
  Check,
  ChevronDown,
  Download,
  FileText,
  Link2,
  Maximize2,
  Minimize2,
  Presentation,
} from "lucide-react";
import { ExportKind } from "./presentationTypes";
import styles from "./PresentationToolbar.module.scss";

export type ShareState = "idle" | "copied" | "error";

export interface PresentationToolbarProps {
  bidNumber: string;
  projectName: string;
  currency: "USD" | "BRL";
  onCurrency: (currency: "USD" | "BRL") => void;
  canShowBRL: boolean;
  shareState: ShareState;
  onShare: () => void;
  exporting: ExportKind | null;
  onExport: (kind: ExportKind) => void;
  presenting: boolean;
  onTogglePresent: () => void;
}

export const PresentationToolbar: React.FC<PresentationToolbarProps> = ({
  bidNumber,
  projectName,
  currency,
  onCurrency,
  canShowBRL,
  shareState,
  onShare,
  exporting,
  onExport,
  presenting,
  onTogglePresent,
}) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!menuOpen) return undefined;
    const onDown = (e: MouseEvent): void => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    // Capture phase + preventDefault: Esc closes the menu without also leaving present mode
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey, true);
    };
  }, [menuOpen]);

  const runExport = (kind: ExportKind): void => {
    setMenuOpen(false);
    onExport(kind);
  };

  return (
    <div className={styles.bar} role="toolbar" aria-label="Presentation tools">
      <div className={styles.identity}>
        <span className={styles.badge}>
          <Presentation size={14} />
        </span>
        <span className={styles.bidNumber}>{bidNumber}</span>
        {projectName && (
          <span className={styles.project} title={projectName}>
            {projectName}
          </span>
        )}
      </div>

      <div className={styles.actions}>
        <div className={styles.segment} role="radiogroup" aria-label="Currency">
          {(["USD", "BRL"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="radio"
              aria-checked={currency === c}
              className={`${styles.segmentBtn} ${currency === c ? styles.segmentActive : ""}`}
              onClick={() => onCurrency(c)}
              disabled={c === "BRL" && !canShowBRL}
              title={
                c === "BRL" && !canShowBRL
                  ? "No BRL rate registered on this BID"
                  : `Show values in ${c}`
              }
            >
              {c}
            </button>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.btn} ${shareState === "copied" ? styles.btnDone : ""}`}
          onClick={onShare}
          title="Copy a link that opens this presentation"
        >
          {shareState === "copied" ? <Check size={14} /> : <Link2 size={14} />}
          {shareState === "copied"
            ? "Link copied"
            : shareState === "error"
              ? "Copy failed"
              : "Share"}
        </button>

        <div className={styles.menuWrap} ref={menuRef}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => setMenuOpen((o) => !o)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            disabled={!!exporting}
          >
            <Download size={14} />
            {exporting ? "Exporting…" : "Export"}
            <ChevronDown size={12} />
          </button>
          {menuOpen && (
            <div className={styles.menu} role="menu">
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => runExport("pptx")}
              >
                <Presentation size={14} />
                PowerPoint (.pptx)
              </button>
              <button
                type="button"
                role="menuitem"
                className={styles.menuItem}
                onClick={() => runExport("pdf")}
              >
                <FileText size={14} />
                PDF report
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onTogglePresent}
          title={presenting ? "Exit present mode (Esc)" : "Present full screen"}
        >
          {presenting ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          {presenting ? "Exit" : "Present"}
        </button>
      </div>
    </div>
  );
};
