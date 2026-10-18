import * as React from "react";
import { X, Sparkles, CornerDownLeft, Bot, BookOpen } from "lucide-react";
import { ISurveyAnswer, SURVEY_QUERY_EXAMPLES } from "../../utils/surveyQuery";
import { GLOSSARY_UI } from "../../config/surveyGlossary";
import { localize } from "../../utils/surveyGlossary";
import { GlossaryContext } from "./GlossaryContext";
import { GlossaryText } from "./GlossaryText";
import styles from "./SurveyAsk.module.scss";

interface SurveyAskProps {
  /** Runs the rule-based engine against the current spread/catalog. */
  onAsk: (question: string) => ISurveyAnswer;
  /** Select / highlight an equipment in the scene from an answer chip. */
  onPickEquipment: (equipmentId: string, focusNodeId?: string | null) => void;
  onClose: () => void;
  /** Azure AI is configured — offer to escalate the question to the chat assistant. */
  aiAvailable: boolean;
  onEscalateAI?: (question: string) => void;
}

const TONE_CLASS: Record<string, string> = {
  good: styles.chipGood,
  bad: styles.chipBad,
  warn: styles.chipWarn,
};

export const SurveyAsk: React.FC<SurveyAskProps> = ({
  onAsk,
  onPickEquipment,
  onClose,
  aiAvailable,
  onEscalateAI,
}) => {
  const [question, setQuestion] = React.useState("");
  const [asked, setAsked] = React.useState("");
  const [answer, setAnswer] = React.useState<ISurveyAnswer | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const glossary = React.useContext(GlossaryContext);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  const run = (text: string): void => {
    const q = text.trim();
    if (!q) return;
    setAsked(q);
    setAnswer(onAsk(q));
  };

  const onSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    run(question);
  };

  const useExample = (ex: string): void => {
    setQuestion(ex);
    run(ex);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.topbar}>
        <span className={styles.topTitle}>
          <Sparkles size={12} /> ASK THE SPREAD
        </span>
        <button className={styles.close} onClick={onClose} aria-label="Close">
          <X size={14} />
        </button>
      </div>
      <div className={styles.content}>
        <form className={styles.form} onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about this spread…"
            aria-label="Ask about this spread"
          />
          <button className={styles.submit} type="submit" aria-label="Ask">
            <CornerDownLeft size={14} />
          </button>
        </form>

        {!answer && (
          <div className={styles.examples}>
            <span className={styles.examplesLabel}>Try asking</span>
            {SURVEY_QUERY_EXAMPLES.map((ex) => (
              <button key={ex} className={styles.exampleChip} onClick={() => useExample(ex)}>
                {ex}
              </button>
            ))}
          </div>
        )}

        {answer && (
          <div className={styles.answer}>
            <span className={styles.answerTitle}>{answer.title}</span>
            <p className={styles.answerText}>
              <GlossaryText text={answer.text} />
            </p>
            {answer.bullets && answer.bullets.length > 0 && (
              <ul className={styles.bullets}>
                {answer.bullets.map((b, i) => (
                  <li key={i} className={styles.bullet}>
                    <GlossaryText text={b} />
                  </li>
                ))}
              </ul>
            )}
            {answer.chips && answer.chips.length > 0 && (
              <div className={styles.chips}>
                {answer.chips.map((c) => (
                  <button
                    key={c.id}
                    className={`${styles.chip} ${c.tone ? TONE_CLASS[c.tone] || "" : ""}`}
                    onClick={() => onPickEquipment(c.id, answer.focusNodeId)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
            {answer.glossaryTermId && glossary && (
              <button
                className={styles.aiBtn}
                onClick={() => glossary.openTerm(answer.glossaryTermId as string)}
              >
                <BookOpen size={13} /> {localize(GLOSSARY_UI.openCard, glossary.lang)}
              </button>
            )}
            {aiAvailable && onEscalateAI && (
              <button className={styles.aiBtn} onClick={() => onEscalateAI(asked)}>
                <Bot size={13} /> Ask the AI assistant for more
              </button>
            )}
          </div>
        )}

        <p className={styles.hint}>
          Answers come from the loaded catalog and the active spread — offline, no AI needed.
        </p>
      </div>
    </div>
  );
};
