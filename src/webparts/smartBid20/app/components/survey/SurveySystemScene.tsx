import * as React from "react";
import { MousePointer2 } from "lucide-react";
import { SHAREPOINT_CONFIG } from "../../config/sharepoint.config";
import { SurveySceneAnchor } from "../../models";
import {
  createSurveyScene,
  isWebGLAvailable,
  SurveySceneApi,
} from "./survey3d/createSurveyScene";
import styles from "./SurveySystemScene.module.scss";

export interface SurveySceneLabel {
  anchor: SurveySceneAnchor;
  items: { id: string; text: string }[];
}

interface SurveySystemSceneProps {
  labels: SurveySceneLabel[];
  highlight: SurveySceneAnchor | "";
  selectedId: string | null;
  onSelect: (equipmentId: string) => void;
}

const SurveySystemScene: React.FC<SurveySystemSceneProps> = ({
  labels,
  highlight,
  selectedId,
  onSelect,
}) => {
  const hostRef = React.useRef<HTMLDivElement>(null);
  const apiRef = React.useRef<SurveySceneApi | null>(null);
  const labelEls = React.useRef<Partial<Record<SurveySceneAnchor, HTMLElement>>>({});
  const [supported] = React.useState(isWebGLAvailable);

  React.useEffect(() => {
    if (!supported || !hostRef.current) return undefined;
    const reducedMotion =
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const api = createSurveyScene(hostRef.current, {
      reducedMotion,
      vesselModelUrl: SHAREPOINT_CONFIG.surveyVesselModelUrl,
    });
    apiRef.current = api;
    (Object.keys(labelEls.current) as SurveySceneAnchor[]).forEach((k) =>
      api.setLabel(k, labelEls.current[k] || null),
    );
    return () => {
      apiRef.current = null;
      api.dispose();
    };
  }, [supported]);

  React.useEffect(() => {
    apiRef.current?.setHighlight(highlight);
  }, [highlight]);

  const registerLabel = (anchor: SurveySceneAnchor) => (el: HTMLDivElement | null) => {
    if (el) labelEls.current[anchor] = el;
    else delete labelEls.current[anchor];
    apiRef.current?.setLabel(anchor, el);
  };

  if (!supported) {
    return (
      <div className={styles.fallback}>
        3D view needs WebGL, which is disabled or unsupported in this browser.
        Use the equipment explorer instead.
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div ref={hostRef} className={styles.canvasHost} />
      <div className={styles.labels}>
        {labels.map((group) => (
          <div
            key={group.anchor}
            ref={registerLabel(group.anchor)}
            className={`${styles.label} ${group.anchor === highlight ? styles.labelActive : ""}`}
          >
            {group.items.map((item) => (
              <button
                key={item.id}
                className={item.id === selectedId ? styles.itemSelected : ""}
                onClick={() => onSelect(item.id)}
              >
                {item.text}
              </button>
            ))}
          </div>
        ))}
      </div>
      <span className={styles.hint}>
        <MousePointer2 size={11} /> Drag to orbit · scroll to zoom
      </span>
    </div>
  );
};

export default SurveySystemScene;
