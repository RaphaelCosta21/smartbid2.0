import * as React from "react";
import { X, BookOpen, Search, Lightbulb, Briefcase, FlaskConical } from "lucide-react";
import {
  IGlossaryAnatomy,
  ISurveyEquipment,
  ISurveyGlossaryTerm,
  SurveyGlossaryCategory,
  SurveyLang,
} from "../../models";
import {
  GLOSSARY_UI,
  NMEA_LAB_SAMPLES,
  SURVEY_GLOSSARY,
  SURVEY_GLOSSARY_CATEGORIES,
} from "../../config/surveyGlossary";
import { getGlossaryTerm, localize, searchGlossary } from "../../utils/surveyGlossary";
import { LINK_COLORS, LINK_LABELS } from "./survey3d/sceneTypes";
import { SurveyNmeaLab } from "./SurveyNmeaLab";
import styles from "./SurveyGlossary.module.scss";

export type SurveyGlossaryTab = "terms" | "decode";

interface ISurveyGlossaryProps {
  lang: SurveyLang;
  onLangChange: (lang: SurveyLang) => void;
  /** Term shown when the modal opens. */
  initialTermId?: string | null;
  /** Opens on the Decode tab with this sentence. */
  initialSentence?: string | null;
  equipmentById: Record<string, ISurveyEquipment>;
  /** Highlights an equipment in the scene; the glossary closes afterwards. */
  onPickEquipment: (equipmentId: string) => void;
  onClose: () => void;
}

const CATEGORY_ORDER = (Object.keys(SURVEY_GLOSSARY_CATEGORIES) as SurveyGlossaryCategory[]).sort(
  (a, b) => SURVEY_GLOSSARY_CATEGORIES[a].order - SURVEY_GLOSSARY_CATEGORIES[b].order,
);

/** Terms that have a runnable sample in the NMEA lab. */
const DECODE_SAMPLE_FOR: Record<string, string> = {
  "nmea-0183": "gga",
  "nmea-gga": "gga",
  "nmea-hdt": "hdt",
  "nmea-zda": "zda",
  "nmea-checksum": "gga",
};

const TONES = [styles.tone0, styles.tone1, styles.tone2, styles.tone3, styles.tone4, styles.tone5];

const hexOf = (n: number): string => `#${`000000${n.toString(16)}`.slice(-6)}`;

const Anatomy: React.FC<{ anatomy: IGlossaryAnatomy; lang: SurveyLang }> = ({ anatomy, lang }) => {
  const [active, setActive] = React.useState<number | null>(null);
  const labelled: { index: number; text: string; label: string }[] = [];
  anatomy.segments.forEach((s, i) => {
    if (s.label) labelled.push({ index: i, text: s.text, label: localize(s.label, lang) });
  });
  const toneOf = (segIndex: number): string => {
    const n = labelled.map((l) => l.index).indexOf(segIndex);
    return TONES[n % TONES.length];
  };
  return (
    <div className={styles.anatomy}>
      <div className={styles.sample}>
        {anatomy.segments.map((s, i) =>
          s.label ? (
            <span
              key={i}
              className={`${styles.seg} ${toneOf(i)} ${active === i ? styles.segActive : ""}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
            >
              {s.text}
            </span>
          ) : (
            <span key={i} className={styles.sep}>
              {s.text}
            </span>
          ),
        )}
      </div>
      <ul className={styles.legend}>
        {labelled.map((l) => (
          <li
            key={l.index}
            className={`${styles.legendItem} ${active === l.index ? styles.legendActive : ""}`}
            onMouseEnter={() => setActive(l.index)}
            onMouseLeave={() => setActive(null)}
          >
            <span className={`${styles.legendKey} ${toneOf(l.index)}`}>{l.text}</span>
            <span>{l.label}</span>
          </li>
        ))}
      </ul>
      {anatomy.note && <p className={styles.note}>{localize(anatomy.note, lang)}</p>}
    </div>
  );
};

export const SurveyGlossary: React.FC<ISurveyGlossaryProps> = ({
  lang,
  onLangChange,
  initialTermId,
  initialSentence,
  equipmentById,
  onPickEquipment,
  onClose,
}) => {
  const [tab, setTab] = React.useState<SurveyGlossaryTab>(initialSentence ? "decode" : "terms");
  const [termId, setTermId] = React.useState<string>(
    initialTermId && getGlossaryTerm(initialTermId) ? initialTermId : SURVEY_GLOSSARY[0].id,
  );
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<SurveyGlossaryCategory | "all">("all");
  const [labSentence, setLabSentence] = React.useState<string | undefined>(
    initialSentence || undefined,
  );
  const L = (key: keyof typeof GLOSSARY_UI): string => localize(GLOSSARY_UI[key], lang);

  // Capture phase + stopPropagation so an Escape here does not also close the panel underneath.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      e.stopPropagation();
      onClose();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  const visible = React.useMemo(
    () => searchGlossary(query, lang).filter((t) => category === "all" || t.category === category),
    [query, lang, category],
  );

  const term = getGlossaryTerm(termId);

  const openDecode = (sampleId: string): void => {
    const sample = NMEA_LAB_SAMPLES.filter((s) => s.id === sampleId)[0];
    setLabSentence(sample ? sample.sentence : undefined);
    setTab("decode");
  };

  const renderTermButton = (t: ISurveyGlossaryTerm): React.ReactNode => (
    <button
      key={t.id}
      className={`${styles.termBtn} ${t.id === termId ? styles.termBtnActive : ""}`}
      onClick={() => setTermId(t.id)}
    >
      <span>{t.term}</span>
      {!t.validated && <span className={styles.draftDot} title={L("draftHint")} />}
    </button>
  );

  const renderList = (): React.ReactNode => {
    if (!visible.length) return <p className={styles.empty}>{L("noResults")}</p>;
    return CATEGORY_ORDER.map((cat) => {
      const inCat = visible.filter((t) => t.category === cat);
      if (!inCat.length) return null;
      return (
        <div key={cat} className={styles.group}>
          <span className={styles.groupLabel}>
            {localize(SURVEY_GLOSSARY_CATEGORIES[cat].label, lang)}
          </span>
          {inCat.map(renderTermButton)}
        </div>
      );
    });
  };

  const renderTerm = (t: ISurveyGlossaryTerm): React.ReactNode => {
    const equipment = (t.equipmentIds || []).filter((id) => !!equipmentById[id]);
    const related = (t.related || []).filter((id) => !!getGlossaryTerm(id));
    const decodeId = DECODE_SAMPLE_FOR[t.id];
    return (
      <div className={styles.card}>
        <div className={styles.cardHead}>
          <h3 className={styles.cardTitle}>{t.term}</h3>
          <span className={styles.catBadge}>
            {localize(SURVEY_GLOSSARY_CATEGORIES[t.category].label, lang)}
          </span>
          {!t.validated && (
            <span className={styles.draftBadge} title={L("draftHint")}>
              {L("draft")}
            </span>
          )}
        </div>
        {t.fullName && <p className={styles.fullName}>{localize(t.fullName, lang)}</p>}

        <h4 className={styles.section}>{L("oneLine")}</h4>
        <p className={styles.oneLiner}>{localize(t.oneLiner, lang)}</p>

        {t.analogy && (
          <div className={styles.callout}>
            <Lightbulb size={14} className={styles.calloutIcon} />
            <span>
              <strong>{L("analogy")}:</strong> {localize(t.analogy, lang)}
            </span>
          </div>
        )}

        {t.anatomy && (
          <>
            <h4 className={styles.section}>{L("anatomy")}</h4>
            <Anatomy anatomy={t.anatomy} lang={lang} />
          </>
        )}

        {t.details && t.details.length > 0 && (
          <>
            <h4 className={styles.section}>{L("details")}</h4>
            <ul className={styles.details}>
              {t.details.map((d, i) => (
                <li key={i}>{localize(d, lang)}</li>
              ))}
            </ul>
          </>
        )}

        {t.bidNote && (
          <div className={`${styles.callout} ${styles.calloutBid}`}>
            <Briefcase size={14} className={styles.calloutIcon} />
            <span>
              <strong>{L("bid")}:</strong> {localize(t.bidNote, lang)}
            </span>
          </div>
        )}

        {(equipment.length > 0 || (t.linkKinds && t.linkKinds.length > 0)) && (
          <>
            <h4 className={styles.section}>{L("where")}</h4>
            <div className={styles.chips}>
              {equipment.map((id) => (
                <button
                  key={id}
                  className={styles.chip}
                  onClick={() => {
                    onPickEquipment(id);
                    onClose();
                  }}
                >
                  {equipmentById[id].title}
                </button>
              ))}
              {(t.linkKinds || []).map((k) => (
                <span key={k} className={styles.kind}>
                  <span className={styles.swatch} style={{ background: hexOf(LINK_COLORS[k]) }} />
                  {LINK_LABELS[k]}
                </span>
              ))}
            </div>
          </>
        )}

        {related.length > 0 && (
          <>
            <h4 className={styles.section}>{L("related")}</h4>
            <div className={styles.chips}>
              {related.map((id) => (
                <button key={id} className={styles.chip} onClick={() => setTermId(id)}>
                  {getGlossaryTerm(id)!.term}
                </button>
              ))}
            </div>
          </>
        )}

        {decodeId && (
          <button className={styles.tryDecode} onClick={() => openDecode(decodeId)}>
            <FlaskConical size={13} /> {L("tryDecode")}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-label={L("title")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <span className={styles.headTitle}>
            <span className={styles.headIcon}>
              <BookOpen size={16} />
            </span>
            {L("title")}
          </span>
          <div className={styles.tabs} role="tablist">
            <button
              role="tab"
              aria-selected={tab === "terms"}
              className={`${styles.tab} ${tab === "terms" ? styles.tabActive : ""}`}
              onClick={() => setTab("terms")}
            >
              <BookOpen size={12} /> {L("terms")}
            </button>
            <button
              role="tab"
              aria-selected={tab === "decode"}
              className={`${styles.tab} ${tab === "decode" ? styles.tabActive : ""}`}
              onClick={() => setTab("decode")}
            >
              <FlaskConical size={12} /> {L("decode")}
            </button>
          </div>
          <div className={styles.headEnd}>
            <div className={styles.lang} role="group" aria-label={L("langLabel")}>
              {(["pt", "en"] as SurveyLang[]).map((l) => (
                <button
                  key={l}
                  aria-pressed={lang === l}
                  className={`${styles.langBtn} ${lang === l ? styles.langActive : ""}`}
                  onClick={() => onLangChange(l)}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <button className={styles.close} onClick={onClose} aria-label="Close">
              <X size={16} />
            </button>
          </div>
        </div>

        {tab === "terms" ? (
          <div className={styles.body}>
            <div className={styles.side}>
              <label className={styles.search}>
                <Search size={13} />
                <input
                  value={query}
                  placeholder={L("search")}
                  aria-label={L("search")}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className={styles.cats}>
                <button
                  className={`${styles.cat} ${category === "all" ? styles.catActive : ""}`}
                  onClick={() => setCategory("all")}
                >
                  {L("all")}
                </button>
                {CATEGORY_ORDER.map((c) => (
                  <button
                    key={c}
                    className={`${styles.cat} ${category === c ? styles.catActive : ""}`}
                    onClick={() => setCategory(c)}
                  >
                    {localize(SURVEY_GLOSSARY_CATEGORIES[c].label, lang)}
                  </button>
                ))}
              </div>
              <div className={styles.list}>{renderList()}</div>
            </div>
            <div className={styles.main}>
              {term ? renderTerm(term) : <p className={styles.empty}>{L("pickTerm")}</p>}
            </div>
          </div>
        ) : (
          <div className={styles.lab}>
            <SurveyNmeaLab
              key={labSentence || "default"}
              lang={lang}
              initialSentence={labSentence}
            />
          </div>
        )}
      </div>
    </div>
  );
};
