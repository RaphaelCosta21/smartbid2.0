/**
 * sectors.config — Single source of truth for approval sectors (value/label/color/icon).
 * Mirrors the SECTOR_CONFIGS used in the Approval flow, for consistent
 * grouping/coloring in analytics + reports.
 */
import { Sector } from "../models/IUser";

export interface ISectorDef {
  value: Sector;
  label: string;
  color: string;
  icon: string;
}

export const SECTORS: ISectorDef[] = [
  { value: "commercial", label: "Commercial", color: "#3b82f6", icon: "💼" },
  { value: "engineering", label: "Engineering", color: "#00c9a7", icon: "🛠️" },
  { value: "project", label: "Project", color: "#8b5cf6", icon: "📋" },
  { value: "operation", label: "Operation", color: "#f59e0b", icon: "⚙️" },
  { value: "dataCenter", label: "Data Center", color: "#06b6d4", icon: "📡" },
  {
    value: "equipmentInstallation",
    label: "Equipment & Installation",
    color: "#ec4899",
    icon: "🔧",
  },
  { value: "supplyChain", label: "Supply Chain", color: "#10b981", icon: "📦" },
];

const BY_VALUE: { [k: string]: ISectorDef } = {};
const BY_LABEL: { [k: string]: ISectorDef } = {};
SECTORS.forEach((s) => {
  BY_VALUE[s.value] = s;
  BY_LABEL[s.label.toLowerCase()] = s;
});

export function getSectorDef(value: string): ISectorDef | undefined {
  return BY_VALUE[value];
}

export function getSectorLabel(value: string): string {
  return (BY_VALUE[value] && BY_VALUE[value].label) || value;
}

export function getSectorColor(value: string): string {
  return (BY_VALUE[value] && BY_VALUE[value].color) || "#94a3b8";
}

/** Map a stakeholderRole label (e.g. "Engineering") back to a Sector value. */
export function sectorFromLabel(label: string): Sector | undefined {
  const def = BY_LABEL[(label || "").toLowerCase()];
  return def ? def.value : undefined;
}
