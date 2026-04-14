/**
 * IBidRequest — Solicitação do comercial para novo BID.
 */
import { Division, BidType, BidPriority } from "./IBidStatus";
import { IPersonRef } from "./IUser";

export interface IRequestAttachment {
  fileName: string;
  fileType: string;
  description: string;
  path: string;
  uploadedDate: string;
  size: number;
}

export interface IRequestPhase {
  idPhase: number;
  status: string;
  start: string;
  duration: number;
  durationFormatted: string;
}

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
  projectManager: IPersonRef[] | null;
  bidType: BidType;
  priority: BidPriority;
  desiredDueDate: string;
  operationStartDate: string;
  totalDuration: number;
  creationDate: string;
  creator: IPersonRef;
  engineerResponsible: IPersonRef[] | null;
  analyst: IPersonRef[] | null;
  vessel: string;
  field: string;
  commercialFolderUrl: string;
  attachments: IRequestAttachment[];
  phases: IRequestPhase[];
  notes: string;
  status: "submitted" | "assigned" | "rejected" | "converted";
  assignedTo: IPersonRef | null;
  assignedDate: string | null;
  rejectionReason: string | null;
  convertedBidNumber: string | null;
}
