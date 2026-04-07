/**
 * IBidComment — Comentários com timestamp, autor, seção.
 */
import { IPersonRef } from "./IUser";
import { BidPhase } from "./IBidStatus";

export interface IBidCommentDef {
  id: string;
  author: IPersonRef;
  text: string;
  timestamp: string;
  phase: BidPhase;
  section: string;
  isEdited: boolean;
  editedAt: string | null;
  mentions: string[];
  attachments: string[];
}
