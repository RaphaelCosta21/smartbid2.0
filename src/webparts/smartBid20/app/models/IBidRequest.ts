/**
 * IBidRequest — Solicitação do comercial para novo BID.
 */
import { Division, BidType, BidSize, BidPriority } from "./IBidStatus";
import { IPersonRef } from "./IUser";

export interface IBidRequest {
  id: string;
  requestNumber: string;
  requestedBy: IPersonRef;
  requestDate: string;
  client: string;
  clientContact: string;
  projectName: string;
  projectDescription: string;
  division: Division;
  serviceLine: string;
  bidType: BidType;
  bidSize: BidSize;
  priority: BidPriority;
  desiredDueDate: string;
  region: string;
  vessel: string;
  field: string;
  attachments: string[];
  notes: string;
  status: "submitted" | "assigned" | "rejected" | "converted";
  assignedTo: IPersonRef | null;
  assignedDate: string | null;
  rejectionReason: string | null;
  convertedBidNumber: string | null;
}
