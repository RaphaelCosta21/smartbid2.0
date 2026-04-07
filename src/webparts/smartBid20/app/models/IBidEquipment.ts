/**
 * IBidEquipment — Equipamentos/Assets (CAPEX/OPEX, quantidades).
 */
export interface IBidEquipmentItem {
  id: string;
  lineNumber: number;
  requirementGroup: number;
  requirementName: string;
  engStudy: string;
  partNumber: string;
  toolDescription: string;
  qtyOperational: number;
  qtySpare: number;
  qtyOnHand: number;
  qtyToBuy: number;
  acquisitionType: string;
  leadTimeDays: number;
  unitCostUSD: number;
  totalCostUSD: number;
  costReference: string;
  isFavorite: boolean;
  costCategory: "CAPEX" | "OPEX";
  costCalcMethod: "auto" | "manual";
  originalCost: number;
  originalCurrency: string;
  costDate: string;
  quoteUrl: string | null;
  quoteLabel: string | null;
  statusIndicator: string | null;
  equipmentSubCategory: string;
  importedFromTemplate: string | null;
  notes: string;
}

export interface IEquipmentSummary {
  totalItems: number;
  capexItems: number;
  opexItems: number;
  totalCostUSD: number;
  totalCostBRL: number;
  byCategory: Record<string, { count: number; costUSD: number }>;
}
