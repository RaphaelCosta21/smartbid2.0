import { JourneyEffectKind } from "../../../../config/surveyDataFormats";
import { EffectBuilder } from "./effectTypes";
import { buildAirPressure, buildHeading, buildVesselMotion } from "./vesselEffects";
import {
  buildAltimeterEcho,
  buildCameraView,
  buildRovMotion,
  buildWaterPressure,
} from "./rovEffects";
import { buildBathymetry, buildPipeField, buildSoundColumn, buildUsblPing } from "./seabedEffects";
import { buildCorrections, buildPpsTick, buildRadioWaves } from "./signalEffects";

export const EFFECT_BUILDERS: Record<JourneyEffectKind, EffectBuilder> = {
  "motion-vessel": buildVesselMotion,
  "motion-rov": buildRovMotion,
  heading: buildHeading("vessel"),
  "heading-rov": buildHeading("rov"),
  bathymetry: buildBathymetry,
  "usbl-ping": buildUsblPing,
  "altimeter-echo": buildAltimeterEcho,
  "water-pressure": buildWaterPressure,
  "air-pressure": buildAirPressure,
  "sound-column": buildSoundColumn,
  "pipe-field": buildPipeField,
  "camera-view": buildCameraView,
  "pps-tick": buildPpsTick,
  "radio-waves": buildRadioWaves,
  corrections: buildCorrections,
};
