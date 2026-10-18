import * as React from "react";
import * as ReactDOM from "react-dom";
import { GLOSSARY_UI } from "../../config/surveyGlossary";
import { getGlossaryTerm, localize, splitByGlossary } from "../../utils/surveyGlossary";
import { GlossaryContext } from "./GlossaryContext";
import styles from "./GlossaryText.module.scss";

const CARD_WIDTH = 280;
const CARD_GAP = 6;
const CARD_EST_HEIGHT = 170;
const SHOW_DELAY_MS = 180;

interface ICardPos {
  left: number;
  top?: number;
  bottom?: number;
}

const GlossaryTerm: React.FC<{ termId: string; label: string }> = ({ termId, label }) => {
  const ctx = React.useContext(GlossaryContext);
  const ref = React.useRef<HTMLSpanElement>(null);
  const timer = React.useRef<number>();
  const [pos, setPos] = React.useState<ICardPos | null>(null);
  const term = getGlossaryTerm(termId);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  if (!ctx || !term) return <>{label}</>;

  const hide = (): void => {
    window.clearTimeout(timer.current);
    setPos(null);
  };

  const show = (): void => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const el = ref.current;
      const root = ctx.getPortalRoot();
      if (!el || !root) return;
      const r = el.getBoundingClientRect();
      const rr = root.getBoundingClientRect();
      const left = Math.max(8, Math.min(r.left - rr.left, rr.width - CARD_WIDTH - 8));
      const below = r.bottom - rr.top + CARD_GAP + CARD_EST_HEIGHT < rr.height;
      setPos(
        below
          ? { left, top: r.bottom - rr.top + CARD_GAP }
          : { left, bottom: rr.bottom - r.top + CARD_GAP },
      );
    }, SHOW_DELAY_MS);
  };

  const open = (e: React.SyntheticEvent): void => {
    e.stopPropagation();
    hide();
    ctx.openTerm(termId);
  };

  const onKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open(e);
    }
  };

  const root = pos ? ctx.getPortalRoot() : null;

  return (
    <>
      <span
        ref={ref}
        className={styles.term}
        role="button"
        tabIndex={0}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onClick={open}
        onKeyDown={onKeyDown}
      >
        {label}
      </span>
      {pos &&
        root &&
        ReactDOM.createPortal(
          <div
            className={styles.card}
            role="tooltip"
            style={{
              left: pos.left,
              top: pos.top,
              bottom: pos.bottom,
              width: CARD_WIDTH,
            }}
          >
            <div className={styles.cardTitle}>
              {term.term}
              {!term.validated && (
                <span className={styles.draftTag}>{localize(GLOSSARY_UI.draft, ctx.lang)}</span>
              )}
            </div>
            <div>{localize(term.oneLiner, ctx.lang)}</div>
            {term.analogy && (
              <div className={styles.cardAnalogy}>{localize(term.analogy, ctx.lang)}</div>
            )}
            <div className={styles.cardHint}>{localize(GLOSSARY_UI.hoverHint, ctx.lang)}</div>
          </div>,
          root,
        )}
    </>
  );
};

interface IGlossaryTextProps {
  text: string;
  /** Link every mention instead of only the first of each term. */
  all?: boolean;
}

/** Renders text with glossary terms underlined; hover shows a card, click opens the glossary. */
export const GlossaryText: React.FC<IGlossaryTextProps> = ({ text, all }) => {
  const enabled = React.useContext(GlossaryContext) !== null;
  const segments = React.useMemo(
    () => (enabled ? splitByGlossary(text, { all }) : null),
    [enabled, text, all],
  );
  if (!segments) return <>{text}</>;
  return (
    <>
      {segments.map((s, i) =>
        s.termId ? (
          <GlossaryTerm key={i} termId={s.termId} label={s.text} />
        ) : (
          <React.Fragment key={i}>{s.text}</React.Fragment>
        ),
      )}
    </>
  );
};
