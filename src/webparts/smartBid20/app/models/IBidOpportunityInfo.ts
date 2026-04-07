/**
 * IBidOpportunityInfo — Info da oportunidade (Region, Vessel, PTAX...).
 */
export interface IBidOpportunityInfo {
  client: string;
  clientContact: string;
  projectName: string;
  projectDescription: string;
  region: string;
  vessel: string;
  field: string;
  waterDepth: number;
  waterDepthUnit: string;
  operationStartDate: string;
  totalDuration: number;
  totalDurationUnit: string;
  currency: string;
  ptax: number;
  ptaxDate: string;
  qualifications: string[];
}
