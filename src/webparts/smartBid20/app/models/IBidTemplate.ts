/**
 * IBidTemplate — Templates de Scope of Supply.
 * A estrutura de scopeItems é idêntica à IScopeItem do BidDetailPage,
 * permitindo importação direta no Scope of Supply de um BID.
 */
import { IScopeItem } from "./IBid";

export interface IBidTemplate {
  id: string;
  name: string;
  description: string;
  division: string;
  serviceLine: string;
  category: string;
  /** Scope of Supply items — same structure as IBid.scopeItems */
  scopeItems: IScopeItem[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  usageCount: number;
  isActive: boolean;
  tags: string[];
  version: number;
}
