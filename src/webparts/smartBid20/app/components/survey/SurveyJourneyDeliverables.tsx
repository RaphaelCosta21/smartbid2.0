import * as React from "react";
import { ChartLine, FileText, Grip, LucideIcon, Mountain, Ruler, Video } from "lucide-react";
import type { DeliverableVisual } from "../../config/surveyDataFormats";
import styles from "./SurveyJourneyDeliverables.module.scss";

export interface ISurveyDeliverableItem {
  id: string;
  title: string;
  format: string;
  visual: DeliverableVisual;
}

interface SurveyJourneyDeliverablesProps {
  label: string;
  items: ISurveyDeliverableItem[];
}

const ICONS: Record<DeliverableVisual, LucideIcon> = {
  report: FileText,
  dtm: Mountain,
  chart: ChartLine,
  video: Video,
  points: Grip,
  calibration: Ruler,
};

/** Client deliverables reached at the end of a data journey, listed under the spread card. */
export const SurveyJourneyDeliverables: React.FC<SurveyJourneyDeliverablesProps> = ({
  label,
  items,
}) => (
  <div className={styles.card} aria-live="polite">
    <span className={styles.eyebrow}>{label}</span>
    <ul className={styles.list}>
      {items.map((d) => {
        const Icon = ICONS[d.visual] || FileText;
        return (
          <li key={d.id} className={styles.item}>
            <Icon size={14} className={styles.icon} />
            <span className={styles.copy}>
              <span className={styles.title}>{d.title}</span>
              <span className={styles.format}>{d.format}</span>
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);
