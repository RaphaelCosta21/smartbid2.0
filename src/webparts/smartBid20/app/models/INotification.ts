export interface INotification {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  bidNumber?: string;
  bidId?: string;
  actionUrl?: string;
  actor?: string;
  actorName?: string;
  priority?: "low" | "normal" | "high" | "urgent";
}
