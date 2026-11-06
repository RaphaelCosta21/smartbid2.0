/**
 * Drill-down views of the BID Presentation side drawer. The drawer keeps a stack of them,
 * so "Back" returns to the list an item was opened from.
 */
import { EffortKind, PriceStepKey } from "../../utils/presentationView";

export type PresentationDrawerView =
  /** One cost item; `list` is the ordered keys ← / → walk through */
  | { kind: "item"; key: string; list: string[] }
  | { kind: "step"; step: PriceStepKey }
  | { kind: "acquisition"; label: string }
  /** Priced items of a resource type, or every priced item when null */
  | { kind: "assets"; category: string | null }
  | { kind: "effort"; effort: EffortKind; role: string | null }
  | { kind: "team" }
  | { kind: "clarifications" }
  | { kind: "qualifications" }
  | { kind: "approval" };

export interface IDrawerNav {
  /** Replace the stack with a single view */
  open: (view: PresentationDrawerView) => void;
  /** Drill into a view from the current one */
  push: (view: PresentationDrawerView) => void;
}

export type ExportKind = "pdf" | "pptx";
