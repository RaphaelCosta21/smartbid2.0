/**
 * IBidCost — Cost summary compilado.
 */
export interface IBidCostBreakdown {
  assetsCostUSD: number;
  assetsCostBRL: number;
  onshoreHoursCostBRL: number;
  offshoreHoursCostBRL: number;
  engineeringHoursCostBRL: number;
  totalHoursCostBRL: number;
  totalHoursCostUSD: number;
  totalCostUSD: number;
  totalCostBRL: number;
  currency: string;
  ptaxUsed: number;
  notes: string;
}

export interface IDivisionCostBreakdown {
  division: string;
  capex: number;
  opex: number;
  hoursCost: number;
  total: number;
}

export interface IBidCostReport {
  bidNumber: string;
  costBreakdown: IBidCostBreakdown;
  byDivision: IDivisionCostBreakdown[];
  generatedDate: string;
  generatedBy: string;
}
