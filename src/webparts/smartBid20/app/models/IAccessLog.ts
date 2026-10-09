export type AccessLogArea = "smartbid" | "peoplesoft-external";

export interface IAccessLogEntry {
  id: number;
  email: string;
  userName: string;
  area: AccessLogArea;
  /** ISO timestamp (SharePoint `Created`, server time). */
  accessedAt: string;
}
