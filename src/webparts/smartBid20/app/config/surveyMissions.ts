/**
 * surveyMissions.ts — Guided learning missions for the Survey Knowledge Portal.
 *
 * Each mission is a short, self-contained knowledge check: a one-line briefing
 * followed by a handful of multiple-choice questions, every one with a written
 * explanation so the user learns the "why" even when they miss it. Content is
 * static (no catalog dependency) so missions work before a spread is imported.
 *
 * Progress (best score per mission) is persisted per user in localStorage via
 * utils/surveyProgress.ts — nothing here touches storage.
 */

export type SurveyMissionLevel = "intro" | "core" | "expert";

/** Lucide icon key rendered by the missions panel (kept as a string to avoid importing icons here). */
export type SurveyMissionIcon =
  | "route"
  | "shield"
  | "scale"
  | "radar"
  | "server";

export interface ISurveyMissionQuestion {
  id: string;
  prompt: string;
  options: string[];
  /** Zero-based index of the correct option. */
  answerIndex: number;
  /** Shown after the user answers, right or wrong. */
  explanation: string;
}

export interface ISurveyMission {
  id: string;
  title: string;
  summary: string;
  level: SurveyMissionLevel;
  icon: SurveyMissionIcon;
  /** Rough time to complete, minutes. */
  minutes: number;
  /** One or two sentences shown before the questions start. */
  brief: string;
  questions: ISurveyMissionQuestion[];
}

export const SURVEY_MISSION_LEVELS: Record<
  SurveyMissionLevel,
  { label: string; order: number }
> = {
  intro: { label: "Intro", order: 0 },
  core: { label: "Core", order: 1 },
  expert: { label: "Expert", order: 2 },
};

/** Pass mark (fraction of correct answers) that marks a mission as cleared. */
export const SURVEY_MISSION_PASS = 0.7;

export const SURVEY_MISSIONS: ISurveyMission[] = [
  {
    id: "data-chain",
    title: "Read the data chain",
    summary: "Follow a position fix from the sensor to the client deliverable.",
    level: "intro",
    icon: "route",
    minutes: 4,
    brief:
      "Every survey number starts at a sensor and ends in a client deliverable. Learn the hops in between: acquisition, storage, processing and delivery.",
    questions: [
      {
        id: "q1",
        prompt: "Which equipment originates the vessel's primary position?",
        options: [
          "The GNSS receiver",
          "The online master PC",
          "The multibeam echosounder",
          "The video overlay recorder",
        ],
        answerIndex: 0,
        explanation:
          "The GNSS receiver is a data source: it originates position, which everything downstream depends on. The online PC only stores and processes what the sensors feed it.",
      },
      {
        id: "q2",
        prompt:
          "An INS (inertial navigation system) blends GNSS with its own motion sensing to deliver what?",
        options: [
          "Only raw satellite ranges",
          "Continuous position and attitude, bridging GNSS gaps",
          "Seabed bathymetry",
          "Video for the client report",
        ],
        answerIndex: 1,
        explanation:
          "The INS fuses GNSS with gyros and accelerometers to output continuous position, heading and motion — it keeps a solution during brief GNSS dropouts.",
      },
      {
        id: "q3",
        prompt:
          "In the pipeline, which stage turns acquired sensor data into a client deliverable?",
        options: [
          "Acquisition",
          "Storage",
          "Processing",
          "Power distribution",
        ],
        answerIndex: 2,
        explanation:
          "Acquisition records the raw data and storage keeps it; processing is where the data becomes charts, point clouds and reports — the deliverable.",
      },
      {
        id: "q4",
        prompt: "Why does the portal trace a signal path through the rooms?",
        options: [
          "To show which cables carry power only",
          "To prove a sensor's data physically reaches the online PC and the deliverable",
          "To hide equipment that is vessel-supplied",
          "To price the spread",
        ],
        answerIndex: 1,
        explanation:
          "The trace confirms a continuous wired route from the sensor, through the switches and the online room, to where the data is logged and processed.",
      },
    ],
  },
  {
    id: "single-point",
    title: "Spot the single point of failure",
    summary: "Find the nodes that take the whole spread offline when they drop.",
    level: "core",
    icon: "shield",
    minutes: 4,
    brief:
      "Redundancy is what keeps a survey running. Use the \"What if it fails?\" mode to see which equipment, when it fails, cascades across the spread.",
    questions: [
      {
        id: "q1",
        prompt:
          "In \"What if it fails?\" mode, a node is marked offline when it…",
        options: [
          "Is the most expensive item",
          "Loses every wired path to the online hub",
          "Is supplied by the vessel",
          "Has no GLB 3D model",
        ],
        answerIndex: 1,
        explanation:
          "A node goes offline when removing the failed equipment leaves it with no route to the online hub — the cascade follows the physical wiring.",
      },
      {
        id: "q2",
        prompt:
          "A network switch that every room connects through is a classic…",
        options: [
          "Redundant pair",
          "Single point of failure",
          "Client deliverable",
          "Vessel-supplied spare",
        ],
        answerIndex: 1,
        explanation:
          "If all data funnels through one switch, losing it isolates everything behind it. That is why critical switches are often duplicated.",
      },
      {
        id: "q3",
        prompt:
          "The best mitigation for a single point of failure on a survey spread is to…",
        options: [
          "Add redundancy — a second unit or an alternate path",
          "Remove the equipment from the BID",
          "Lower its quantity to one",
          "Mark it vessel-supplied",
        ],
        answerIndex: 0,
        explanation:
          "Redundancy — a hot spare, a dual switch, or a second acquisition PC — removes the single point by giving the data another way through.",
      },
      {
        id: "q4",
        prompt:
          "If a failed sensor has no downstream cascade, the panel reports…",
        options: [
          "A total blackout",
          "That no other node loses the hub — the loss is contained",
          "That the BID is wrong",
          "That the vessel must supply a replacement",
        ],
        answerIndex: 1,
        explanation:
          "When only the failed node is affected, its data is lost but the rest of the spread keeps its path to the hub — the impact is contained.",
      },
    ],
  },
  {
    id: "bid-gap",
    title: "Mind the BID gap",
    summary: "Tell covered, missing and extra items apart against a BID.",
    level: "core",
    icon: "scale",
    minutes: 3,
    brief:
      "The gap overlay compares the spread template with a selected BID. Green is covered, red is in the spread but missing from the BID, amber is in the BID only.",
    questions: [
      {
        id: "q1",
        prompt: "A red node in BID gap mode means the equipment is…",
        options: [
          "In the BID but not the spread",
          "In the spread but missing from the BID",
          "Vessel-supplied, so never priced",
          "A client deliverable",
        ],
        answerIndex: 1,
        explanation:
          "Red flags a priced spread line that the selected BID does not cover yet — a likely omission to review before submitting.",
      },
      {
        id: "q2",
        prompt: "Why are vessel-supplied lines never counted as a gap?",
        options: [
          "They are the cheapest items",
          "They are provided by the vessel/client and are not priced in the BID",
          "They have no data role",
          "They always appear amber",
        ],
        answerIndex: 1,
        explanation:
          "Vessel-supplied equipment stays in the scope for context but is not priced, so it can neither be covered nor missing from the BID.",
      },
      {
        id: "q3",
        prompt: "An amber (BID extra) item is useful to spot because it…",
        options: [
          "Is always an error",
          "Is in the BID but outside this spread — worth confirming it belongs",
          "Must be deleted",
          "Is vessel-supplied",
        ],
        answerIndex: 1,
        explanation:
          "Amber items are considered by the BID but are not part of this spread template — they may be intentional add-ons or a sign the wrong spread was compared.",
      },
    ],
  },
  {
    id: "acoustic-positioning",
    title: "Acoustic positioning",
    summary: "Know when USBL or LBL puts a subsea target on the map.",
    level: "core",
    icon: "radar",
    minutes: 4,
    brief:
      "Subsea assets have no GNSS. Acoustic positioning — USBL and LBL — measures a transponder's position relative to the vessel or an array on the seabed.",
    questions: [
      {
        id: "q1",
        prompt: "USBL positioning measures a subsea beacon's position…",
        options: [
          "From satellites directly",
          "Relative to a hull-mounted transceiver on the vessel",
          "Only after the dive, in processing",
          "From the client's office",
        ],
        answerIndex: 1,
        explanation:
          "USBL (Ultra-Short BaseLine) uses one hull transceiver to measure range and bearing to a beacon, then ties it to the vessel's GNSS/INS position.",
      },
      {
        id: "q2",
        prompt: "Why does acoustic positioning need sound-velocity data?",
        options: [
          "To price the beacons",
          "Because the speed of sound in water varies and sets the range accuracy",
          "To power the transponders",
          "To record video",
        ],
        answerIndex: 1,
        explanation:
          "Acoustic ranges are time-of-flight times sound speed. A wrong sound-velocity profile biases every acoustic position, so an SVP is essential.",
      },
      {
        id: "q3",
        prompt: "LBL differs from USBL mainly because it…",
        options: [
          "Uses an array of seabed transponders for high local accuracy",
          "Needs no transponders at all",
          "Works only above water",
          "Is a type of multibeam",
        ],
        answerIndex: 0,
        explanation:
          "LBL (Long BaseLine) deploys several seabed transponders and triangulates within that array, giving high, position-stable accuracy over a worksite.",
      },
      {
        id: "q4",
        prompt: "A beacon charger appears in the catalog but not in spread lines because it…",
        options: [
          "Is a client deliverable",
          "Supports the beacons on deck and is not wired into the live spread",
          "Produces bathymetry",
          "Is the online hub",
        ],
        answerIndex: 1,
        explanation:
          "Support items like a beacon charger keep gear ready between dives; they are catalog context, not part of the powered, data-carrying spread.",
      },
    ],
  },
  {
    id: "online-room",
    title: "Inside the survey online room",
    summary: "Trace acquisition, recording and QC where the data lands.",
    level: "expert",
    icon: "server",
    minutes: 5,
    brief:
      "The survey online room is where sensor data is acquired, time-stamped, logged and quality-checked in real time before it becomes a deliverable.",
    questions: [
      {
        id: "q1",
        prompt: "The online master PC's primary job on the spread is to…",
        options: [
          "Originate position",
          "Acquire, time-tag and log the sensor streams in real time",
          "Charge the beacons",
          "Supply power to the mast",
        ],
        answerIndex: 1,
        explanation:
          "It is the acquisition hub: every sensor stream converges here to be time-synced and recorded, which is why losing it cascades widely.",
      },
      {
        id: "q2",
        prompt: "Why does precise time-sync (PPS/ZDA) matter in the online room?",
        options: [
          "It makes cables cheaper",
          "It aligns every sensor to a common clock so data merges correctly",
          "It replaces the GNSS receiver",
          "It is only for video",
        ],
        answerIndex: 1,
        explanation:
          "Bathymetry, position and motion must share one time base; a PPS pulse and ZDA string keep them aligned so the merged solution is coherent.",
      },
      {
        id: "q3",
        prompt: "Real-time QC in the online room exists to…",
        options: [
          "Catch data problems while the vessel can still re-run a line",
          "Price the BID",
          "Replace processing entirely",
          "Hide vessel-supplied items",
        ],
        answerIndex: 0,
        explanation:
          "Catching gaps or bad data offshore — while on site — avoids an expensive remobilisation; QC is cheaper than a return trip.",
      },
      {
        id: "q4",
        prompt: "Redundant recording (two logging PCs) protects against…",
        options: [
          "A wrong BID",
          "Loss of already-acquired data if one logger fails",
          "High sound velocity",
          "Amber gap items",
        ],
        answerIndex: 1,
        explanation:
          "If one acquisition PC drops, the second keeps the record intact — the survey data is often irreplaceable, so it is logged twice.",
      },
    ],
  },
];
