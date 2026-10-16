import * as React from "react";
import {
  X,
  ArrowLeft,
  GraduationCap,
  Route,
  Shield,
  Scale,
  Radar,
  Server,
  Check,
  Lightbulb,
  RotateCcw,
  Trophy,
  LucideIcon,
} from "lucide-react";
import {
  SURVEY_MISSIONS,
  SURVEY_MISSION_LEVELS,
  SURVEY_MISSION_PASS,
  ISurveyMission,
  SurveyMissionIcon,
  SurveyMissionLevel,
} from "../../config/surveyMissions";
import {
  loadMissionProgress,
  saveMissionResult,
  SurveyMissionProgress,
} from "../../utils/surveyProgress";
import styles from "./SurveyMissions.module.scss";
import { GlossaryText } from "./GlossaryText";

interface SurveyMissionsProps {
  /** Current user id/email — scopes the saved progress. */
  user: string | null;
  onClose: () => void;
}

const MISSION_ICON: Record<SurveyMissionIcon, LucideIcon> = {
  route: Route,
  shield: Shield,
  scale: Scale,
  radar: Radar,
  server: Server,
};

const LEVEL_CLASS: Record<SurveyMissionLevel, string> = {
  intro: styles.levelIntro,
  core: styles.levelCore,
  expert: styles.levelExpert,
};

const OPTION_LETTERS = ["A", "B", "C", "D", "E"];

export const SurveyMissions: React.FC<SurveyMissionsProps> = ({ user, onClose }) => {
  const [progress, setProgress] = React.useState<SurveyMissionProgress>(() =>
    loadMissionProgress(user),
  );
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [qIndex, setQIndex] = React.useState(0);
  const [answers, setAnswers] = React.useState<number[]>([]);
  const [picked, setPicked] = React.useState<number | null>(null);
  const [finished, setFinished] = React.useState(false);

  const mission = React.useMemo<ISurveyMission | undefined>(
    () => SURVEY_MISSIONS.find((m) => m.id === activeId),
    [activeId],
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const openMission = (id: string): void => {
    setActiveId(id);
    setQIndex(0);
    setAnswers([]);
    setPicked(null);
    setFinished(false);
  };

  const backToList = (): void => {
    setActiveId(null);
    setFinished(false);
  };

  const pickOption = (index: number): void => {
    if (picked !== null) return;
    setPicked(index);
    setAnswers((prev) => {
      const next = prev.slice();
      next[qIndex] = index;
      return next;
    });
  };

  const goNext = (): void => {
    if (!mission) return;
    if (qIndex + 1 >= mission.questions.length) {
      const score = mission.questions.reduce(
        (sum, q, i) => sum + (answers[i] === q.answerIndex ? 1 : 0),
        0,
      );
      setProgress(saveMissionResult(user, mission.id, score, mission.questions.length));
      setFinished(true);
      return;
    }
    setQIndex(qIndex + 1);
    setPicked(null);
  };

  const renderList = (): React.ReactNode => (
    <>
      <p className={styles.subtitle}>
        Short, guided checks that teach how a survey spread is built, traced and priced. Pick a
        mission — your best score is saved on this device.
      </p>
      <div className={styles.grid}>
        {SURVEY_MISSIONS.map((m) => {
          const Icon = MISSION_ICON[m.icon];
          const result = progress[m.id];
          const cleared =
            result && result.bestScore / result.total >= SURVEY_MISSION_PASS;
          return (
            <button key={m.id} className={styles.card} onClick={() => openMission(m.id)}>
              <span className={styles.cardIcon}>
                <Icon size={18} />
              </span>
              <span className={styles.cardBody}>
                <span className={styles.cardTopline}>
                  <span className={`${styles.level} ${LEVEL_CLASS[m.level]}`}>
                    {SURVEY_MISSION_LEVELS[m.level].label}
                  </span>
                  <span className={styles.minutes}>{m.minutes} min</span>
                </span>
                <span className={styles.cardTitle}>{m.title}</span>
                <span className={styles.cardSummary}>{m.summary}</span>
                <span
                  className={`${styles.status} ${
                    cleared
                      ? styles.statusCleared
                      : result
                        ? styles.statusAttempted
                        : styles.statusNew
                  }`}
                >
                  {cleared ? (
                    <>
                      <Check size={11} /> Cleared · {result.bestScore}/{result.total}
                    </>
                  ) : result ? (
                    <>
                      Best {result.bestScore}/{result.total} · try again
                    </>
                  ) : (
                    <>{m.questions.length} questions</>
                  )}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </>
  );

  const renderMission = (m: ISurveyMission): React.ReactNode => {
    if (finished) {
      const score = m.questions.reduce(
        (sum, q, i) => sum + (answers[i] === q.answerIndex ? 1 : 0),
        0,
      );
      const passed = score / m.questions.length >= SURVEY_MISSION_PASS;
      return (
        <div className={styles.result}>
          <span className={`${styles.resultBadge} ${passed ? styles.badgePass : styles.badgeFail}`}>
            {passed ? <Trophy size={22} /> : <RotateCcw size={22} />}
          </span>
          <span className={styles.resultValue}>
            {score}
            <span className={styles.resultOf}>/{m.questions.length}</span>
          </span>
          <span className={styles.resultLabel}>
            {passed ? "Mission cleared" : "Almost there"}
          </span>
          <p className={styles.resultNote}>
            {passed
              ? "You read the spread like a surveyor. Try the next level or revisit the explanations."
              : "Review the explanations below the questions and give it another run — the best score is kept."}
          </p>
          <div className={styles.resultActions}>
            <button className={styles.retry} onClick={() => openMission(m.id)}>
              <RotateCcw size={13} /> Retry
            </button>
            <button className={styles.done} onClick={backToList}>
              Back to missions
            </button>
          </div>
        </div>
      );
    }

    const q = m.questions[qIndex];
    const answered = picked !== null;
    return (
      <div className={styles.mission}>
        <div className={styles.missionHead}>
          <button className={styles.back} onClick={backToList}>
            <ArrowLeft size={13} /> Missions
          </button>
          <span className={`${styles.level} ${LEVEL_CLASS[m.level]}`}>
            {SURVEY_MISSION_LEVELS[m.level].label}
          </span>
        </div>
        <h3 className={styles.missionTitle}>{m.title}</h3>
        {qIndex === 0 && !answered && (
          <p className={styles.brief}>
            <GlossaryText text={m.brief} />
          </p>
        )}

        <div className={styles.progressTrack}>
          <span
            className={styles.progressFill}
            style={{ width: `${((qIndex + (answered ? 1 : 0)) / m.questions.length) * 100}%` }}
          />
        </div>
        <span className={styles.qCounter}>
          Question {qIndex + 1} of {m.questions.length}
        </span>

        <p className={styles.qPrompt}>
          <GlossaryText text={q.prompt} />
        </p>
        <div className={styles.options}>
          {q.options.map((opt, i) => {
            const isCorrect = i === q.answerIndex;
            const isPicked = picked === i;
            const cls = !answered
              ? styles.option
              : isCorrect
                ? `${styles.option} ${styles.optionCorrect}`
                : isPicked
                  ? `${styles.option} ${styles.optionWrong}`
                  : styles.option;
            return (
              <button
                key={i}
                className={cls}
                onClick={() => pickOption(i)}
                disabled={answered}
              >
                <span className={styles.optionLetter}>{OPTION_LETTERS[i]}</span>
                <span className={styles.optionText}>{opt}</span>
                {answered && isCorrect && <Check size={14} className={styles.optionTick} />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={styles.explain}>
            <Lightbulb size={14} className={styles.explainIcon} />
            <span>
              <GlossaryText text={q.explanation} />
            </span>
          </div>
        )}

        <div className={styles.footer}>
          <button className={styles.nextBtn} onClick={goNext} disabled={!answered}>
            {qIndex + 1 >= m.questions.length ? "See score" : "Next question"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-label="Survey learning missions"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.head}>
          <span className={styles.headTitle}>
            <span className={styles.headIcon}>
              <GraduationCap size={16} />
            </span>
            Learning missions
          </span>
          <button className={styles.close} onClick={onClose} aria-label="Close">
            <X size={16} />
          </button>
        </div>
        <div className={styles.content}>
          {mission ? renderMission(mission) : renderList()}
        </div>
      </div>
    </div>
  );
};
