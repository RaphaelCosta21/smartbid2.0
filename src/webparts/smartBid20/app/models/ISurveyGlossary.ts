/**
 * Survey Knowledge Portal - glossary of survey terms (protocols, sensors, timing...).
 * Content is static reference material (config/surveyGlossary.ts), not business data.
 */
import { SurveyLinkKind } from "./ISurveyCatalog";

export type SurveyLang = "pt" | "en";

export interface ILocalizedText {
  pt: string;
  en: string;
}

export type SurveyGlossaryCategory =
  | "protocol"
  | "network"
  | "timing"
  | "positioning"
  | "motion"
  | "acoustic";

/** One slice of an annotated sample; slices without a label are plain separators (commas, colons). */
export interface IGlossaryAnatomySegment {
  text: string;
  label?: ILocalizedText;
}

/** Sample text split into labelled fields, rendered as a colour-coded "anatomy". */
export interface IGlossaryAnatomy {
  segments: IGlossaryAnatomySegment[];
  note?: ILocalizedText;
}

export interface ISurveyGlossaryTerm {
  id: string;
  /** Display name, same in every language (e.g. "NMEA 0183"). */
  term: string;
  /** Extra spellings that auto-link to this term in portal texts. */
  aliases: string[];
  category: SurveyGlossaryCategory;
  fullName?: ILocalizedText;
  oneLiner: ILocalizedText;
  analogy?: ILocalizedText;
  details?: ILocalizedText[];
  anatomy?: IGlossaryAnatomy;
  /** Why it matters when scoping a BID. */
  bidNote?: ILocalizedText;
  /** Catalog equipment ids where the user meets this term. */
  equipmentIds?: string[];
  /** Cable kinds that typically carry it. */
  linkKinds?: SurveyLinkKind[];
  related?: string[];
  /** Confirmed by a survey SME; false = draft. */
  validated: boolean;
}
