import * as React from "react";
import { SurveyLang } from "../../models";

export interface IGlossaryContextValue {
  lang: SurveyLang;
  /** Opens the glossary modal on a term. */
  openTerm: (termId: string) => void;
  /** Element the hover cards render into: keeps the survey theme tokens and escapes clipped panels. */
  getPortalRoot: () => HTMLElement | null;
}

/** Without a provider `GlossaryText` renders plain text. */
export const GlossaryContext = React.createContext<IGlossaryContextValue | null>(null);
