import { BidTabGroupKey } from "../models/ISystemConfig";

export type BidTab =
  | "overview"
  | "scope"
  | "assets"
  | "preparation"
  | "logistics"
  | "certifications"
  | "hours"
  | "costs"
  | "tasks"
  | "timeline"
  | "approval"
  | "documents"
  | "notes"
  | "qualifications"
  | "activity"
  | "export"
  | "revisions";

export interface IBidTabDef {
  key: BidTab;
  label: string;
  icon: string;
}

export interface IBidTabGroupDef {
  key: BidTabGroupKey;
  group: string;
  items: IBidTabDef[];
}

/** BID Details navigation; also the rows of the "BID Details tabs" access matrix. */
export const BID_TAB_GROUPS: IBidTabGroupDef[] = [
  {
    key: "general",
    group: "General",
    items: [
      { key: "overview", label: "Overview", icon: "📊" },
      { key: "timeline", label: "Timeline", icon: "📅" },
    ],
  },
  {
    key: "scopeCosting",
    group: "Scope & Costing",
    items: [
      { key: "scope", label: "Scope of Supply", icon: "📋" },
      { key: "hours", label: "Hours & Personnel", icon: "⏱️" },
      { key: "assets", label: "Assets Breakdown", icon: "🔩" },
      { key: "preparation", label: "Prep & Mobilization", icon: "🔧" },
      { key: "logistics", label: "Logistics", icon: "🚚" },
      { key: "certifications", label: "Certifications", icon: "📜" },
      { key: "costs", label: "Cost Summary", icon: "💰" },
    ],
  },
  {
    key: "management",
    group: "Management",
    items: [
      { key: "tasks", label: "Status & Phases", icon: "✅" },
      { key: "revisions", label: "Revisions", icon: "🔄" },
      { key: "approval", label: "Approval", icon: "🔏" },
      { key: "documents", label: "Documents", icon: "📄" },
    ],
  },
  {
    key: "collaboration",
    group: "Collaboration",
    items: [
      { key: "notes", label: "Notes & Comments", icon: "📝" },
      { key: "qualifications", label: "Clarif. & Qualif.", icon: "🎓" },
    ],
  },
  {
    key: "tools",
    group: "Tools",
    items: [
      { key: "activity", label: "Activity Log", icon: "📜" },
      { key: "export", label: "Export", icon: "📤" },
    ],
  },
];

export const BID_TAB_GROUP: Record<string, BidTabGroupKey> = {};
BID_TAB_GROUPS.forEach((g) => {
  g.items.forEach((t) => {
    BID_TAB_GROUP[t.key] = g.key;
  });
});
