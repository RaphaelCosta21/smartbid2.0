import * as React from "react";
import { Check, X } from "lucide-react";
import { GLOSSARY_UI, NMEA_LAB_SAMPLES } from "../../config/surveyGlossary";
import { SurveyLang } from "../../models";
import { localize } from "../../utils/surveyGlossary";
import { parseNmea } from "../../utils/nmeaDecode";
import styles from "./SurveyNmeaLab.module.scss";

interface ISurveyNmeaLabProps {
  lang: SurveyLang;
  /** Sentence loaded when the lab opens (e.g. from a glossary term). */
  initialSentence?: string;
}

export const SurveyNmeaLab: React.FC<ISurveyNmeaLabProps> = ({ lang, initialSentence }) => {
  const [input, setInput] = React.useState(initialSentence || NMEA_LAB_SAMPLES[0].sentence);
  const [active, setActive] = React.useState<number | null>(null);
  const result = React.useMemo(() => parseNmea(input), [input]);
  const L = (key: keyof typeof GLOSSARY_UI): string => localize(GLOSSARY_UI[key], lang);
  const prefix = input.trim().charAt(0) === "!" ? "!" : "$";

  const checksum = result.checksum;
  const checksumBadge =
    checksum.valid === true ? (
      <span className={`${styles.badge} ${styles.badgeOk}`}>
        <Check size={12} /> {L("labChecksum")} {L("labChecksumOk")} · {checksum.computed}
      </span>
    ) : checksum.valid === false ? (
      <span className={`${styles.badge} ${styles.badgeBad}`}>
        <X size={12} /> {L("labChecksum")} {L("labChecksumBad")} {checksum.computed})
      </span>
    ) : (
      <span className={`${styles.badge} ${styles.badgeNone}`}>
        {L("labChecksum")} {L("labChecksumNone")}
      </span>
    );

  return (
    <div className={styles.root}>
      <p className={styles.intro}>{L("labIntro")}</p>

      <textarea
        className={styles.input}
        value={input}
        rows={2}
        spellCheck={false}
        placeholder={L("labPlaceholder")}
        aria-label="NMEA"
        onChange={(e) => setInput(e.target.value)}
      />

      <div className={styles.samples}>
        <span className={styles.samplesLabel}>{L("labSamples")}</span>
        {NMEA_LAB_SAMPLES.map((s) => (
          <button
            key={s.id}
            className={`${styles.sample} ${input.trim() === s.sentence ? styles.sampleActive : ""}`}
            onClick={() => setInput(s.sentence)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {!result.ok && input.trim() && result.error && (
        <div className={styles.error}>{localize(result.error, lang)}</div>
      )}

      {result.ok && (
        <>
          <div className={styles.badges}>
            <span className={styles.badge}>
              {L("labTalker")}: <strong>{result.talker}</strong>
              {result.talkerName ? ` · ${localize(result.talkerName, lang)}` : ""}
            </span>
            <span className={styles.badge}>
              {L("labSentence")}: <strong>{result.sentence}</strong>
              {result.sentenceName ? ` · ${localize(result.sentenceName, lang)}` : ""}
            </span>
            {checksumBadge}
          </div>

          <div className={styles.sentence}>
            <span className={styles.tokHead}>
              {prefix}
              {result.header}
            </span>
            {result.fields.map((f) => (
              <React.Fragment key={f.index}>
                <span className={styles.comma}>,</span>
                <span
                  className={`${styles.tok} ${active === f.index ? styles.tokActive : ""} ${
                    f.raw ? "" : styles.tokEmpty
                  }`}
                  onMouseEnter={() => setActive(f.index)}
                  onMouseLeave={() => setActive(null)}
                >
                  {f.raw || "·"}
                </span>
              </React.Fragment>
            ))}
            {checksum.given !== null && (
              <>
                <span className={styles.comma}>*</span>
                <span className={styles.tokSum}>{checksum.given}</span>
              </>
            )}
          </div>

          {result.warnings.map((w, i) => (
            <div key={i} className={styles.warn}>
              {localize(w, lang)}
            </div>
          ))}

          {result.summary.length > 0 && (
            <>
              <h4 className={styles.heading}>{L("labDecoded")}</h4>
              <div className={styles.summary}>
                {result.summary.map((s, i) => (
                  <div key={i} className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>{localize(s.label, lang)}</span>
                    <span className={styles.summaryValue}>{localize(s.value, lang)}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {result.fields.length > 0 && (
            <>
              <h4 className={styles.heading}>{L("labFields")}</h4>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{L("labColField")}</th>
                    <th>{L("labColValue")}</th>
                    <th>{L("labColMeaning")}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.fields.map((f) => (
                    <tr
                      key={f.index}
                      className={active === f.index ? styles.rowActive : ""}
                      onMouseEnter={() => setActive(f.index)}
                      onMouseLeave={() => setActive(null)}
                    >
                      <td>{f.index}</td>
                      <td>{localize(f.label, lang)}</td>
                      <td className={styles.mono}>{f.raw || "·"}</td>
                      <td>{f.meaning ? localize(f.meaning, lang) : ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}

      <p className={styles.scope}>{L("labScope")}</p>
    </div>
  );
};
