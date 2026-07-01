/**
 * IClarificationDbItem — A row in the "Clarifications Database" SharePoint list.
 * Unlike most SmartBid data, this list uses real SharePoint columns (not a JSON blob).
 */
export type ClarificationBaseType = "Clarification" | "Qualification";

export interface IClarificationDbItem {
  /** SharePoint list item Id (0 for new, unsaved items) */
  id: number;
  baseType: ClarificationBaseType;
  /** Client Doc Ref (Title column) */
  clientDocRef: string;
  /** ET's Topic (TextodaET column) */
  etTopic: string;
  /** Clarification text sent (ClarificationEnviado column) */
  clarification: string;
  /** Client reply (RespostaaoClarification column) */
  clientReply: string;
  /** Approved / Accepted (Aprovado_x002f_Aceito_x003f_ column) */
  approved: boolean;
  /** Date the clarification was responded (Data column) — ISO string */
  date: string;
  keyword: string;
  client: string;

  // ─── Read-only system fields ───
  created?: string;
  modified?: string;
  createdBy?: string;
  modifiedBy?: string;
}
