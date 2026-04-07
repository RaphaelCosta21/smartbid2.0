/**
 * IActivityLog — Log de atividades.
 */
export interface IActivityLogEntry {
  id: string;
  type: string;
  timestamp: string;
  actor: string;
  actorName: string;
  description: string;
  bidNumber?: string;
  metadata: Record<string, unknown>;
}

export interface IActivityLog {
  entries: IActivityLogEntry[];
  lastUpdated: string;
  maxEntries: number;
}
