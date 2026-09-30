/** Figma "Survey Knowledge & BID Portal" images (bundled as separate assets by SPFx). */
export const SURVEY_OCEAN_BG: string = require("../../../assets/survey/ocean-bg.jpg");
export const SURVEY_VESSEL_IMG: string = require("../../../assets/survey/vessel.png");
export const SURVEY_SATELLITE_IMG: string = require("../../../assets/survey/satellite.png");
export const SURVEY_CNAV_IMG: string = require("../../../assets/survey/cnav-device.png");
export const SURVEY_CNAV_MASK: string = require("../../../assets/survey/cnav-device-mask.svg");
export const SURVEY_FLOW_ARROWS: string = require("../../../assets/survey/flow-arrows.svg");

/** "Where does it fit?" node icons, matched by label keyword. */
export const SURVEY_FIT_ICONS: { match: RegExp; src: string; height: number }[] = [
  { match: /vessel/i, src: require("../../../assets/survey/fit-vessel.png"), height: 60 },
  { match: /navigation/i, src: require("../../../assets/survey/fit-navigation.png"), height: 56 },
  { match: /\brov\b/i, src: require("../../../assets/survey/fit-rov.png"), height: 80 },
  { match: /beacon|transponder/i, src: require("../../../assets/survey/fit-beacon.png"), height: 22 },
  { match: /target/i, src: require("../../../assets/survey/fit-target.png"), height: 64 },
];
