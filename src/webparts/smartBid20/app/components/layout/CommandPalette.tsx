/**
 * CommandPalette — Ctrl+K quick search overlay
 * Fuzzy search across navigation, BIDs, and quick actions.
 */

import * as React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CommandPalette.module.scss";
import { useUIStore } from "../../stores/useUIStore";
import { useBidStore } from "../../stores/useBidStore";
import { NAVIGATION_ITEMS } from "../../config/navigation.config";

interface ICommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  category: "navigation" | "bid" | "action";
}

export const CommandPalette: React.FC = () => {
  const navigate = useNavigate();
  const isOpen = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const bids = useBidStore((s) => s.bids);

  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  /* ---- build command list ---------------------------------------- */

  const allCommands = React.useMemo<ICommandItem[]>(() => {
    const navCommands: ICommandItem[] = NAVIGATION_ITEMS.filter(
      (n) => n.route,
    ).map((n) => ({
      id: `nav-${n.key}`,
      label: n.label,
      description: `Go to ${n.label}`,
      icon: "→",
      action: () => {
        navigate(n.route!);
        setOpen(false);
      },
      category: "navigation" as const,
    }));

    const bidCommands: ICommandItem[] = bids.slice(0, 20).map((b) => ({
      id: `bid-${b.bidNumber}`,
      label: `${b.bidNumber} — ${b.opportunityInfo.projectName}`,
      description: `${b.opportunityInfo.client} · ${b.currentStatus}`,
      icon: "📋",
      action: () => {
        navigate(`/bid/${b.bidNumber}`);
        setOpen(false);
      },
      category: "bid" as const,
    }));

    const actionCommands: ICommandItem[] = [
      {
        id: "action-theme",
        label: "Toggle Theme",
        description: "Switch between dark and light mode",
        icon: "🌓",
        action: () => {
          useUIStore.getState().toggleTheme();
          setOpen(false);
        },
        category: "action",
      },
      {
        id: "action-new-bid",
        label: "Create New Request",
        description: "Start a new BID request",
        icon: "➕",
        action: () => {
          navigate("/requests/new");
          setOpen(false);
        },
        category: "action",
      },
    ];

    return [...actionCommands, ...navCommands, ...bidCommands];
  }, [bids, navigate, setOpen]);

  /* ---- filter ---------------------------------------------------- */

  const filtered = React.useMemo(() => {
    if (!query.trim()) return allCommands.slice(0, 12);
    const q = query.toLowerCase();
    return allCommands
      .filter(
        (c) =>
          c.label.toLowerCase().includes(q) ||
          (c.description && c.description.toLowerCase().includes(q)),
      )
      .slice(0, 12);
  }, [allCommands, query]);

  /* ---- keyboard -------------------------------------------------- */

  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent): void => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!isOpen);
      }
      if (e.key === "Escape" && isOpen) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleGlobalKey);
    return () => window.removeEventListener("keydown", handleGlobalKey);
  }, [isOpen, setOpen]);

  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[selectedIndex]) filtered[selectedIndex].action();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setOpen(false)}>
      <div className={styles.palette} onClick={(e) => e.stopPropagation()}>
        <div className={styles.inputRow}>
          <svg
            className={styles.searchIcon}
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Search pages, BIDs, or actions..."
            value={query}
            onChange={(e) => {
              setQuery(e.currentTarget.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className={styles.escHint}>ESC</span>
        </div>

        <div className={styles.results}>
          {filtered.length === 0 && (
            <div className={styles.emptyState}>
              No results found for "{query}"
            </div>
          )}
          {filtered.map((cmd, i) => (
            <button
              key={cmd.id}
              className={`${styles.resultItem} ${i === selectedIndex ? styles.selected : ""}`}
              onClick={cmd.action}
              onMouseEnter={() => setSelectedIndex(i)}
            >
              <span className={styles.resultIcon}>{cmd.icon}</span>
              <div className={styles.resultText}>
                <span className={styles.resultLabel}>{cmd.label}</span>
                {cmd.description && (
                  <span className={styles.resultDesc}>{cmd.description}</span>
                )}
              </div>
              <span className={styles.categoryBadge}>{cmd.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
