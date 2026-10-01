/**
 * Survey Knowledge & BID Portal — catalog of survey families, equipment and
 * systems (smartbid-survey-catalog list). Rich fields live in the row JSON.
 */

/** 3D scene anchor keys a catalog entry can be pinned to. */
export type SurveySceneAnchor =
  | "gnss"
  | "vessel"
  | "mast"
  | "bridge"
  | "survey-online"
  | "rov-control"
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
  spreads: ISurveySpread[];
}

export interface ISurveySpreadLine {
  equipmentId: string;
  qty: number;
  /** Free-text quantity when it isn't a plain count (e.g. "1 set", "multiple channels"). */
  qtyLabel?: string;
  /** Provided by the vessel/client — kept in the scope but not priced. */
  vesselSupplied?: boolean;
}

export interface ISurveySpreadZone {
  id: string;
  title: string;
  lines: ISurveySpreadLine[];
}

/** Cable prefixes on the one-line diagram: SD data, SP power, SV video, SS RF, SPD subsea. */
export type SurveyLinkKind = "data" | "power" | "video" | "rf" | "subsea" | "fibre" | "acoustic";

export interface ISurveySpreadLink {
  from: string;
  to: string;
  kind: SurveyLinkKind;
  cable?: string;
}

/** A full equipment spread taken from a one-line diagram, reusable as a BID scope template. */
export interface ISurveySpread {
  id: string;
  title: string;
  drawingNo: string;
  revision: string;
  description: string;
  zones: ISurveySpreadZone[];
  links: ISurveySpreadLink[];
  order: number;
}

export interface ISurveyPackageLine {
  equipmentId: string;
  qty: number;
  qtyLabel?: string;
  vesselSupplied?: boolean;
  /** Spread template the line came from (traceability in the BID scope). */
  spreadId?: string;
}

export interface ISurveyBidIntel {
  sampleCount: number;
  medianCostUSD: number | null;
  leadTimeWeeksMin: number | null;
  leadTimeWeeksMax: number | null;
  frequency: { inHouse: number; purchase: number; rent: number };
}
