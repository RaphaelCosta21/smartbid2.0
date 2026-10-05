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
  | "umbilical"
  | "rov"
  | "beacons"
  | "seabed"
  | "subsea-target";

/** Procedural 3D archetype used when equipment "emerges" in a spread zone. */
export type SurveySceneShape =
  | "monitor"
  | "workstation"
  | "rack"
  | "switch"
  | "serial-box"
  | "receiver"
  | "gnss-dome"
  | "whip-antenna"
  | "panel-antenna"
  | "radio"
  | "ups"
  | "printer"
  | "gyro"
  | "probe"
  | "subsea-bottle"
  | "sonar-head"
  | "camera"
  | "laser"
  | "coil-frame"
  | "transponder"
  | "fibre-reel"
  | "network-cloud"
  | "system-core";

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

/** Kind of information an equipment produces or carries, used to follow data to client deliverables. */
export type SurveyDataType =
  | "position"
  | "heading"
  | "motion"
  | "depth"
  | "altitude"
  | "sound-velocity"
  | "bathymetry"
  | "acoustic-position"
  | "pipe-tracking"
  | "video"
  | "time-sync"
  | "corrections"
  | "comms";

/** Part an equipment plays in the data flow (source = sensor that originates data). */
export type SurveyDataRole =
  | "source"
  | "rf-frontend"
  | "transport"
  | "compute"
  | "storage"
  | "display"
  | "support";

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
  sceneShape?: SurveySceneShape | "";
  /** Optional GLB that replaces the procedural shape (https or site-relative). */
  modelUrl?: string | null;
  dataRole?: SurveyDataRole;
  dataTypes?: SurveyDataType[];
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
  /** Diagram instance numbers this line covers when one equipment sits in several rooms (e.g. switch [2] on the bridge). */
  instances?: number[];
  /** BID grouping the line belongs to (spread `categories` id). */
  category?: string;
}

export interface ISurveySpreadZone {
  id: string;
  title: string;
  /** Room location in the 3D scene; empty for BID-only groups that are not physical equipment. */
  sceneAnchor: SurveySceneAnchor | "";
  /** One-paragraph explanation, also used as the guided-tour caption. */
  description: string;
  lines: ISurveySpreadLine[];
}

export interface ISurveySpreadCategory {
  id: string;
  title: string;
}

/** Cable prefixes on the one-line diagram: SD data, SP power, SV video, SS RF, SPD subsea; timing = PPS/ZDA. */
export type SurveyLinkKind =
  | "data"
  | "power"
  | "video"
  | "rf"
  | "subsea"
  | "fibre"
  | "acoustic"
  | "timing";

export interface ISurveySpreadLink {
  from: string;
  to: string;
  kind: SurveyLinkKind;
  cable?: string;
}

export type SurveyPipelineStage = "software" | "storage" | "processing" | "deliverable";

/** Logical step after the hardware (software, storage, processing, client deliverable). */
export interface ISurveyPipelineNode {
  id: string;
  title: string;
  stage: SurveyPipelineStage;
  description?: string;
  /** Equipment the step runs on or lives in; may be absent from the diagram. */
  hostEquipmentId?: string;
  /** Data types the step takes in; omitted = accepts whatever reaches it. */
  consumes?: SurveyDataType[];
  /** Next pipeline node ids. */
  feeds?: string[];
  /** Real-time displays a software step drives. */
  displays?: string[];
  /** Confirmed by a survey SME; false = inferred. */
  validated?: boolean;
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
  categories?: ISurveySpreadCategory[];
  pipeline?: ISurveyPipelineNode[];
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
