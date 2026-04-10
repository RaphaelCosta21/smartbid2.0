/**
 * IBidRequest — Solicitação do comercial para novo BID.
 */
import { Division, BidType, BidPriority } from "./IBidStatus";
import { IPersonRef } from "./IUser";

export interface IBidRequest {
  id: string;
  requestNumber: string;
  requestedBy: IPersonRef;
  requestDate: string;
  client: string;
  clientContact: string;
  crmNumber: string;
  projectName: string;
  projectDescription: string;
  division: Division;
  serviceLine: string;
  projectManager: IPersonRef | null;
  bidType: BidType;
  priority: BidPriority;
  desiredDueDate: string;
  creationDate: string;
  createdBy: IPersonRef;
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
