import { UserRole } from "../models";

export interface AccessRule {
  workspace: "edit" | "view" | "none";
  insights: "edit" | "view" | "none";
  reports: "edit" | "view" | "none";
  settings: "edit" | "view" | "none";
  approvals: "edit" | "view" | "none";
  templates: "edit" | "view" | "none";
}

const ACCESS_MAP: Record<UserRole, AccessRule> = {
  commercial: {
    workspace: "edit",
    insights: "edit",
    reports: "edit",
    settings: "edit",
    approvals: "edit",
    templates: "edit",
  },
  engineering: {
    workspace: "edit",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "view",
    templates: "edit",
  },
  project: {
    workspace: "edit",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "edit",
    templates: "view",
  },
  operation: {
    workspace: "edit",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "view",
    templates: "view",
  },
  dataCenter: {
    workspace: "view",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "view",
    templates: "none",
  },
  equipmentInstallation: {
    workspace: "view",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "view",
    templates: "none",
  },
  supplyChain: {
    workspace: "view",
    insights: "view",
    reports: "view",
    settings: "none",
    approvals: "view",
    templates: "none",
  },
  guest: {
    workspace: "view",
    insights: "none",
    reports: "none",
    settings: "none",
    approvals: "none",
    templates: "none",
  },
};

export function hasAccess(
  role: UserRole,
  section: keyof AccessRule,
  level: "view" | "edit",
): boolean {
  const userAccess = ACCESS_MAP[role]?.[section] ?? "none";
  if (level === "view") return userAccess === "view" || userAccess === "edit";
  return userAccess === "edit";
}

export function canEdit(role: UserRole, section: keyof AccessRule): boolean {
  return hasAccess(role, section, "edit");
}

export function canView(role: UserRole, section: keyof AccessRule): boolean {
  return hasAccess(role, section, "view");
}

export const SUPER_ADMIN_EMAILS = [
  "rcosta@oceaneering.com",
  "rsouza@oceaneering.com",
];

export function isSuperAdmin(email: string): boolean {
  return SUPER_ADMIN_EMAILS.indexOf(email.toLowerCase()) >= 0;
}
