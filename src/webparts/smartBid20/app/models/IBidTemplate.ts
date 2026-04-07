/**
 * IBidTemplate — Templates de equipamento.
 */
import { IEquipmentItem } from "./IBid";

export interface IBidTemplate {
  id: string;
  name: string;
  description: string;
  division: string;
  serviceLine: string;
  category: string;
  equipmentItems: IEquipmentItem[];
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  usageCount: number;
  isActive: boolean;
  tags: string[];
  version: number;
}
