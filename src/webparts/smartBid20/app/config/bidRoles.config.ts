import { BidRole, Sector } from "../models/IUser";

export interface IBidRoleMeta {
  key: BidRole;
  label: string;
  color: string;
  bg: string;
}

export const BID_ROLE_META: IBidRoleMeta[] = [
  {
    key: "contributor",
    label: "Contributor",
    color: "#6d28d9",
    bg: "rgba(109,40,217,0.12)",
  },
  {
    key: "manager",
    label: "Manager",
    color: "#be123c",
    bg: "rgba(190,18,60,0.12)",
  },
  {
    key: "coordinator",
    label: "Coordinator",
    color: "var(--accent-700)",
    bg: "color-mix(in srgb, var(--accent-700) 12%, transparent)",
  },
  {
    key: "analyst",
    label: "Analyst",
    color: "#0284c7",
    bg: "rgba(2,132,199,0.12)",
  },
  {
    key: "lead",
    label: "Lead",
    color: "#d97706",
    bg: "rgba(217,119,6,0.12)",
  },
  {
    key: "sr-manager",
    label: "Sr. Manager",
    color: "#991b1b",
    bg: "rgba(153,27,27,0.12)",
  },
];

/** Analyst is an Engineering-only role in Members Management. */
export function getBidRolesForSector(sector: Sector): IBidRoleMeta[] {
  return BID_ROLE_META.filter(
    (r) => r.key !== "analyst" || sector === "engineering",
  );
}

export function getBidRoleLabel(role: BidRole): string {
  const meta = BID_ROLE_META.find((r) => r.key === role);
  return meta ? meta.label : role;
}
