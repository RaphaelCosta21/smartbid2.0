export const DIVISION_COLORS: Record<string, string> = {
  OPG: "#3b82f6",
  "SSR-ROV": "#f59e0b",
  "SSR-Survey": "#10b981",
  "SSR-Integrated": "#8b5cf6",
};

export const PRIORITY_COLORS: Record<string, string> = {
  Urgent: "#ef4444",
  High: "#f59e0b",
  Normal: "#3b82f6",
  Low: "#64748b",
};

export const BID_SIZE_COLORS: Record<string, string> = {
  Small: "#10b981",
  Standard: "#3b82f6",
  Epic: "#8b5cf6",
};

export const DIVISIONS = [
  "OPG",
  "SSR-Survey",
  "SSR-ROV",
  "SSR-Integrated",
] as const;

export const SERVICE_LINES = [
  "IMR",
  "UWILD",
  "Survey",
  "Controls",
  "Installation",
  "Decommissioning",
  "Tooling",
  "Multibeam",
  "Construction",
] as const;

export const BID_TYPES = [
  "Firm",
  "Budgetary",
  "RFI",
  "Extension",
  "Amendment",
] as const;

export const BID_SIZES = ["Small", "Standard", "Epic"] as const;

export const PRIORITIES = ["Urgent", "High", "Normal", "Low"] as const;

export const ACQUISITION_TYPES = [
  "Buy",
  "Rent",
  "On Hand",
  "Refurbish",
  "Client Provided",
] as const;
