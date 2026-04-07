/**
 * IBidHours — Horas: Engineering, Onshore, Offshore + fases.
 */
export interface IBidHoursItem {
  id: string;
  lineNumber: number;
  resourceGroup: number;
  requirementName: string;
  engStudy: string;
  function: string;
  phase: string;
  hoursPerDay: number;
  pplQty: number;
  workDays: number;
  utilizationPercent: number;
  totalHours: number;
  costBRL: number;
}

export interface IBidHoursSection {
  sectionType: "engineering" | "onshore" | "offshore";
  totalHours: number;
  totalCostBRL: number;
  items: IBidHoursItem[];
}

export interface IBidHoursSummary {
  engineeringHours: IBidHoursSection;
  onshoreHours: IBidHoursSection;
  offshoreHours: IBidHoursSection;
  grandTotalHours: number;
  grandTotalCostBRL: number;
  grandTotalCostUSD: number;
}
