/**
 * IBidTemplate — Templates de Scope of Supply + Hours.
 * A estrutura de scopeItems é idêntica à IScopeItem do BidDetailPage,
 * permitindo importação direta no Scope of Supply de um BID.
 */
import { IScopeItem, IHoursSummary } from "./IBid";

export interface IBidTemplate {
  id: string;
  name: string;
  description: string;
  division: string;
  serviceLine: string;
  category: string;
  /** Scope of Supply items — same structure as IBid.scopeItems */
  scopeItems: IScopeItem[];
  /** Hours & Personnel summary — same structure as IBid.hoursSummary */
  hoursSummary?: IHoursSummary;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  usageCount: number;
  isActive: boolean;
  tags: string[];
  version: number;
}
