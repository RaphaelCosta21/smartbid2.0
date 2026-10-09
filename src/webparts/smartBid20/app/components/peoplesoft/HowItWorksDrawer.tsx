/**
 * HowItWorksDrawer — Peoplesoft Consulting guide (right-side drawer):
 * guided tour launcher, EN / PT switch and how to navigate, search and filter.
 */
import * as React from "react";
import * as ReactDOM from "react-dom";
import {
  BookOpen,
  CirclePlay,
  Coins,
  Compass,
  Database,
  ExternalLink,
  Info,
  Languages,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Table2,
  X,
} from "lucide-react";
import { useAppRootHost } from "../../hooks/useAppRootHost";
import {
  IPeoplesoftConsultingText,
  IPeoplesoftHelpSection,
  PeoplesoftLang,
  PeoplesoftSourceKey,
  PeoplesoftViewKey,
} from "../../config/peoplesoftConsulting.i18n";
import styles from "./HowItWorksDrawer.module.scss";

type SectionId =
  | "overview"
  | "navigation"
  | "search"
  | "filters"
  | "table"
  | "costs"
  | "external";

const SECTIONS: { id: SectionId; icon: React.ReactNode }[] = [
  { id: "overview", icon: <Info size={16} /> },
  { id: "navigation", icon: <Compass size={16} /> },
  { id: "search", icon: <Search size={16} /> },
  { id: "filters", icon: <SlidersHorizontal size={16} /> },
  { id: "table", icon: <Table2 size={16} /> },
  { id: "costs", icon: <Coins size={16} /> },
  { id: "external", icon: <ExternalLink size={16} /> },
];

const SOURCE_NAMES: [PeoplesoftSourceKey, string][] = [
  ["financials", "Peoplesoft Financials"],
  ["brazil", "Peoplesoft Brazil"],
];
const VIEW_KEYS: PeoplesoftViewKey[] = ["priceConsulting", "activeRegistered"];

const CLOSE_MS = 220;

/** EN / PT segmented switch, styled for the dark hero header */
export const LanguageSwitch: React.FC<{
  lang: PeoplesoftLang;
  onChange: (lang: PeoplesoftLang) => void;
  ariaLabel: string;
  tourId?: string;
}> = ({ lang, onChange, ariaLabel, tourId }) => (
  <div
    className={styles.langSwitch}
    role="group"
    aria-label={ariaLabel}
    title={ariaLabel}
    data-tour={tourId}
  >
    <Languages size={14} className={styles.langIcon} />
    {(["en", "pt"] as PeoplesoftLang[]).map((l) => (
      <button
        key={l}
        type="button"
        className={`${styles.langBtn}${lang === l ? ` ${styles.langBtnActive}` : ""}`}
        aria-pressed={lang === l}
        onClick={() => onChange(l)}
      >
        {l.toUpperCase()}
      </button>
    ))}
  </div>
);

interface HowItWorksDrawerProps {
  open: boolean;
  t: IPeoplesoftConsultingText;
  lang: PeoplesoftLang;
  onLangChange: (lang: PeoplesoftLang) => void;
  onStartTour: () => void;
  onClose: () => void;
}

export const HowItWorksDrawer: React.FC<HowItWorksDrawerProps> = ({
  open,
  t,
  lang,
  onLangChange,
  onStartTour,
  onClose,
}) => {
  const [probeRef, host] = useAppRootHost(open);
  const [mounted, setMounted] = React.useState(false);
  const [closing, setClosing] = React.useState(false);
  const bodyRef = React.useRef<HTMLDivElement>(null);
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const sectionRefs = React.useRef<Partial<Record<SectionId, HTMLElement>>>(
    {},
  );

  React.useEffect(() => {
    if (open) {
      setMounted(true);
      setClosing(false);
      return undefined;
    }
    if (!mounted) return undefined;
    setClosing(true);
    const timer = window.setTimeout(() => {
      setMounted(false);
      setClosing(false);
    }, CLOSE_MS);
    return () => window.clearTimeout(timer);
  }, [open]);

  React.useEffect(() => {
    if (!open || !mounted) return undefined;
    const returnFocus = document.activeElement as HTMLElement | null;
    if (closeRef.current) closeRef.current.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      if (returnFocus && returnFocus.focus && document.contains(returnFocus))
        returnFocus.focus({ preventScroll: true });
    };
  }, [open, mounted]);

  const scrollToSection = (id: SectionId): void => {
    const body = bodyRef.current;
    const el = sectionRefs.current[id];
    if (!body || !el) return;
    body.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
  };

  const renderSection = (
    id: SectionId,
    icon: React.ReactNode,
    extra?: React.ReactNode,
  ): React.ReactElement => {
    const section: IPeoplesoftHelpSection = t.help[id];
    return (
      <section
        key={id}
        className={styles.section}
        ref={(el) => {
          if (el) sectionRefs.current[id] = el;
        }}
      >
        <h3 className={styles.sectionTitle}>
          <span className={styles.sectionIcon}>{icon}</span>
          {section.title}
        </h3>
        {section.paragraphs &&
          section.paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p}
            </p>
          ))}
        {section.bullets && (
          <ul className={styles.bullets}>
            {section.bullets.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        )}
        {extra}
      </section>
    );
  };

  const pagesGrid = (
    <div className={styles.pages}>
      <h4 className={styles.pagesTitle}>{t.help.pagesTitle}</h4>
      <p className={styles.paragraph}>{t.help.pagesIntro}</p>
      {SOURCE_NAMES.map(([source, name]) => (
        <div key={source} className={styles.sourceGroup}>
          <div className={styles.sourceHead}>
            <Database size={14} />
            <span className={styles.sourceName}>{name}</span>
          </div>
          <p className={styles.sourceHint}>{t.sourceHints[source]}</p>
          <div className={styles.viewCards}>
            {VIEW_KEYS.map((view) => (
              <div key={view} className={styles.viewCard}>
                <span className={styles.viewName}>{t.views[view]}</span>
                <span className={styles.viewText}>
                  {t.viewLegends[source][view]}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const drawer =
    mounted && host
      ? ReactDOM.createPortal(
          <div className={`${styles.root}${closing ? ` ${styles.closing}` : ""}`}>
            <div className={styles.scrim} onMouseDown={onClose} />
            <aside
              className={styles.panel}
              role="dialog"
              aria-modal="true"
              aria-labelledby="psc-help-title"
            >
              <header className={styles.header}>
                <span className={styles.headerIcon}>
                  <BookOpen size={20} />
                </span>
                <div className={styles.headerText}>
                  <h2 id="psc-help-title" className={styles.headerTitle}>
                    {t.help.title}
                  </h2>
                </div>
                <LanguageSwitch
                  lang={lang}
                  onChange={onLangChange}
                  ariaLabel={t.languageAria}
                />
                <button
                  ref={closeRef}
                  type="button"
                  className={styles.closeBtn}
                  onClick={onClose}
                  aria-label={t.help.close}
                  title={t.help.close}
                >
                  <X size={18} />
                </button>
              </header>

              <div ref={bodyRef} className={styles.body}>
                <div className={styles.tourCard}>
                  <span className={styles.tourIcon}>
                    <CirclePlay size={22} />
                  </span>
                  <div className={styles.tourText}>
                    <span className={styles.tourTitle}>{t.help.tourTitle}</span>
                    <span className={styles.tourBody}>{t.help.tourBody}</span>
                  </div>
                  <button
                    type="button"
                    className={styles.tourBtn}
                    onClick={onStartTour}
                  >
                    {t.help.startTour}
                  </button>
                </div>

                <nav className={styles.toc} aria-label={t.help.contents}>
                  <span className={styles.tocLabel}>{t.help.contents}</span>
                  <div className={styles.tocChips}>
                    {SECTIONS.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        className={styles.tocChip}
                        onClick={() => scrollToSection(s.id)}
                      >
                        {t.help[s.id].title}
                      </button>
                    ))}
                  </div>
                </nav>

                {SECTIONS.map((s) =>
                  renderSection(
                    s.id,
                    s.icon,
                    s.id === "navigation" ? pagesGrid : undefined,
                  ),
                )}

                <div className={styles.refreshNote}>
                  <RefreshCw size={14} />
                  {t.help.refreshNote}
                </div>
              </div>
            </aside>
          </div>,
          host,
        )
      : null;

  return (
    <>
      <span ref={probeRef} hidden />
      {drawer}
    </>
  );
};
