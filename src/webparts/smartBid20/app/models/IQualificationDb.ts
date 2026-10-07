/**
 * IQualificationDbItem — A row in the "Qualifications Database" SharePoint list:
 * one qualification of a qualification table (real columns, not a JSON blob).
 */
export interface IQualificationDbItem {
  /** SharePoint list item Id (0 for new, unsaved items) */
  id: number;
  /** Qualification table title (Title column) */
  tableTitle: string;
  /** systemConfig.qualificationCategories value, or free text */
  category: string;
  qualification: string;
  client: string;
  /** Division value (systemConfig.divisions) */
  division: string;
  /** Service line value (systemConfig.serviceLines) */
  serviceLine: string;
  /** BID this row was synced from (empty = created manually in the library) */
  sourceBidNumber: string;
  /** Id of the qualification table inside the source BID */
  sourceTableId: string;
  /** Id of the qualification item inside the source BID */
  sourceItemId: string;
  /** Item number inside its table */
  itemOrder: number;
  /** Library table this row belongs to; empty = derived from the source BID table or the title */
  tableKey?: string;

  // ─── Read-only system fields ───
  created?: string;
  modified?: string;
  createdBy?: string;
  modifiedBy?: string;
}

/** Rows to write when saving one library table in the table editor */
export interface IQualificationTableChanges {
  create: IQualificationDbItem[];
  update: IQualificationDbItem[];
  deleteIds: number[];
}

export interface IQualificationTableSaveResult {
  created: number;
  updated: number;
  deleted: number;
  failed: number;
}
