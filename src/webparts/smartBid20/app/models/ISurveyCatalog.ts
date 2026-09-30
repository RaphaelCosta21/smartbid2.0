/**
 * Survey Knowledge & BID Portal — catalog of survey families, equipment and
 * systems (smartbid-survey-catalog list). Rich fields live in the row JSON.
 */

/** 3D scene anchor keys a catalog entry can be pinned to. */
export type SurveySceneAnchor =
  | "gnss"
  | "vessel"
  | "vessel-hull"
  | "rov"
  | "beacons"
  | "seabed"
  | "subsea-target";

export interface ISurveyFamily {
  id: string;
  title: string;
  description: string;
  order: number;
}

/** One step of the "Where does it fit?" chain; `stack` renders stacked siblings (e.g. 3 beacons). */
export interface ISurveyFitNode {
  label: string;
  equipmentId?: string;
  stack?: string[];
}

export interface ISurveyEquipment {
  id: string;
  familyId: string;
  title: string;
  /** Upper-case technology tag shown above the title (e.g. "ACOUSTIC POSITIONING"). */
  technology: string;
  aliases: string[];
  summary: string;
  whatIsIt: string;
  whatDoesItDo: string;
  partNumber: string;
  manufacturer: string;
  model: string;
  divisions: string[];
  serviceLines: string[];
  status: string;
  usedIn: string[];
  connectsTo: string[];
  whereItFits: ISurveyFitNode[];
  bidConsiderations: string[];
  sceneAnchor: SurveySceneAnchor | "";
  imageUrl: string | null;
  datasheetUrl: string | null;
  order: number;
}

export interface ISurveySystem {
  id: string;
  familyId: string;
  title: string;
  description: string;
  /** Bullet list shown in the system panel (hardware + software). */
  components: string[];
  equipmentIds: string[];
  sceneAnchor: SurveySceneAnchor | "";
  order: number;
}

export interface ISurveyCatalog {
  families: ISurveyFamily[];
  equipment: ISurveyEquipment[];
  systems: ISurveySystem[];
}

export interface ISurveyPackageLine {
  equipmentId: string;
  qty: number;
}

export interface ISurveyBidIntel {
  sampleCount: number;
  medianCostUSD: number | null;
  leadTimeWeeksMin: number | null;
  leadTimeWeeksMax: number | null;
  frequency: { inHouse: number; purchase: number; rent: number };
}
