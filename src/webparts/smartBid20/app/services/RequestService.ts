/**
 * RequestService — Operações em solicitações (create, assign, reject).
 * Static singleton pattern (padrão SmartFlow).
 */
import { IBidRequest } from "../models/IBidRequest";
import { IBid, IPersonRef } from "../models";
import { BidService } from "./BidService";

export class RequestService {
  public static async createRequest(request: IBidRequest): Promise<number> {
    // Requests are stored as BIDs in Phase 0
    const bid: Partial<IBid> = {
      bidNumber: request.requestNumber,
      crmNumber: request.crmNumber || "",
      division: request.division,
      serviceLine: request.serviceLine,
      bidType: request.bidType,
      bidSize: "Standard",
      priority: request.priority,
      opportunityInfo: {
        client: request.client,
        clientContact: request.clientContact,
        projectName: request.projectName,
        projectDescription: request.projectDescription,
        region: "",
        vessel: request.vessel,
        field: request.field,
        waterDepth: 0,
        waterDepthUnit: "m",
        operationStartDate: request.operationStartDate || "",
        totalDuration: request.totalDuration || 0,
        totalDurationUnit: "days",
        currency: "USD",
        ptax: 0,
        ptaxDate: "",
        qualifications: [],
      },
      bidder: request.creator,
      creator: request.creator,
      owner: { name: "", email: "" },
      engineerResponsible: [],
      analyst: [],
      currentStatus: "Request Submitted",
      currentPhase: "PHASE_0",
      createdDate: new Date().toISOString(),
      dueDate: request.desiredDueDate,
      desiredDueDate: request.desiredDueDate,
    };
    return await BidService.create(bid as IBid);
  }

  public static async assignRequest(
    bidNumber: string,
    assignTo: IPersonRef,
  ): Promise<void> {
    const bid = await BidService.getByBidNumber(bidNumber);
    if (!bid) throw new Error(`BID ${bidNumber} not found`);
    bid.engineerResponsible = [assignTo];
    bid.owner = assignTo;
    bid.currentStatus = "Pending Assignment";
    bid.lastModified = new Date().toISOString();
    // Find the SP item Id and update
    // Implementation depends on SP item lookup
  }

  public static async rejectRequest(
    bidNumber: string,
    reason: string,
  ): Promise<void> {
    const bid = await BidService.getByBidNumber(bidNumber);
    if (!bid) throw new Error(`BID ${bidNumber} not found`);
    bid.currentStatus = "No Bid";
    bid.lastModified = new Date().toISOString();
    bid.activityLog.push({
      id: crypto.randomUUID(),
      type: "REQUEST_REJECTED",
      timestamp: new Date().toISOString(),
      actor: "",
      actorName: "",
      description: `Request rejected: ${reason}`,
      metadata: { reason },
    });
  }
}
