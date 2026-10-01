import { SurveySceneAnchor } from "../../models";

/** Figma frame 71:761 coordinates, cropped from y=300 so the header stays in HTML. */
export const ART_W = 1301;
export const ART_H = 1113;

export type ArtRect = [number, number, number, number];
export type ArtPoint = [number, number];

export const ART_RECTS: Record<
  "glassBox" | "vessel" | "satellite" | "glowLarge" | "glowSmall" | "cnav" | "arrows",
  ArtRect
> = {
  glassBox: [173, 19, 974, 714],
  vessel: [302, -22, 713, 892],
  satellite: [897, 21, 126, 157],
  glowLarge: [870, 9, 180, 169],
  glowSmall: [897, 41, 110, 117],
  cnav: [849, 292, 51, 36],
  arrows: [992, 93.7, 24, 233.4],
};

// gnss/vessel come from the Figma "Equipment marker chip" layers; the rest sit on the seabed area.
export const ANCHOR_POINTS: Record<SurveySceneAnchor, ArtPoint> = {
  gnss: [1040, 116],
  vessel: [825, 270],
  "vessel-hull": [705, 612],
  rov: [470, 650],
  beacons: [565, 700],
  seabed: [880, 690],
  "subsea-target": [765, 712],
};

export const FLOW_POINTS: Record<
  "satelliteTx" | "cnavRx" | "cnavOut" | "mast" | "hull" | "target",
  ArtPoint
> = {
  satelliteTx: [1069.7, 83.3],
  cnavRx: [974.85, 303.4],
  cnavOut: [860, 312],
  mast: [660, 372],
  hull: [690, 600],
  target: [765, 712],
};
