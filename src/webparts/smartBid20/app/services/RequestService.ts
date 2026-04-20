/**
 * RequestService — Operações em solicitações (create, assign, reject).
 * Static singleton pattern (padrão SmartFlow).
 */
import { IBidRequest } from "../models/IBidRequest";
import { IBid, IPersonRef } from "../models";
import { BidService } from "./BidService";

export class RequestService {
  /**
   * Fetch unassigned requests directly from SharePoint smartbid-tracker list.
   * Returns BIDs that have status "Request Submitted" OR empty engineerResponsible.
   */
  public static async getUnassignedFromSP(): Promise<IBidRequest[]> {
    const allBids = await BidService.getAll();
    const unassigned = allBids.filter((bid) => {
      if (bid.currentStatus === "Request Submitted") return true;
      if (
        !bid.engineerResponsible ||
        (Array.isArray(bid.engineerResponsible) &&
          bid.engineerResponsible.length === 0)
      ) {
        return true;
      }
      return false;
    });

    return unassigned.map((bid) => RequestService.bidToRequest(bid));
  }

  /**
   * Convert an IBid (SharePoint JSON) to IBidRequest for display.
   */
  private static bidToRequest(bid: IBid): IBidRequest {
    const opp = bid.opportunityInfo || ({} as any);
    return {
      id: bid.bidNumber,
      requestNumber: bid.bidNumber,
      requestedBy: bid.creator || { name: "", email: "" },
      requestDate: bid.createdDate || "",
      client: opp.client || "",
      clientContact: opp.clientContact || "",
      crmNumber: bid.crmNumber || "",
      projectName: opp.projectName || "",
      projectDescription: opp.projectDescription || "",
      division: bid.division,
      serviceLine: bid.serviceLine || "",
      projectManager:
        bid.projectManager && bid.projectManager.length > 0
          ? bid.projectManager
          : null,
      bidType: bid.bidType,
      priority: bid.priority,
      desiredDueDate: bid.desiredDueDate || bid.dueDate || "",
      operationStartDate: opp.operationStartDate || "",
      totalDuration: opp.totalDuration || 0,
      creationDate: bid.createdDate || "",
      creator: bid.creator || { name: "", email: "" },
      engineerResponsible: bid.engineerResponsible || null,
      analyst: bid.analyst || null,
      vessel: opp.vessel || "",
      field: opp.field || "",
      commercialFolderUrl: bid.commercialFolderUrl || "",
      attachments: (bid.attachments || []).map((a) => ({
        fileName: a.fileName,
        fileType: a.fileType,
        description: "",
        path: a.fileUrl || "",
        uploadedDate: a.uploadedDate || "",
        size: a.fileSize || 0,
      })),
      phases: (bid.steps || []).map((s) => ({
        idPhase: s.idStep,
        status: s.status,
        start: s.start,
        duration: s.duration || 0,
        durationFormatted: s.durationFormatted || "",
      })),
      notes: bid.bidNotes ? Object.values(bid.bidNotes).join("\n") : "",
      status:
        bid.currentStatus === "Request Submitted" ? "submitted" : "assigned",
      assignedTo: bid.engineerResponsible?.[0] || null,
      assignedDate: null,
      rejectionReason: null,
      convertedBidNumber: null,
    };
  }

  public static async createRequest(request: IBidRequest): Promise<number> {
    // Requests are stored as BIDs in Phase 0 — initialize ALL fields
    const now = new Date().toISOString();
    const creatorRef = request.creator || { name: "", email: "" };
    const bid: IBid = {
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
      bidder: creatorRef,
      creator: creatorRef,
      owner: creatorRef,
      engineerResponsible: [],
      analyst: [],
      projectManager: request.projectManager || [],
      reviewers: [],
      createdDate: now,
      dueDate: request.desiredDueDate,
      desiredDueDate: request.desiredDueDate,
      startDate: null,
      completedDate: null,
      lastModified: now,
      currentStatus: "Pending Assignment",
      currentPhase: "Request Submitted",
      steps: [],
      tasks: [],
      assetsCostSummary: {
        capexTotal: 0,
        capexTotalBRL: 0,
        opexTotal: 0,
        opexTotalBRL: 0,
        grandTotal: 0,
        grandTotalBRL: 0,
        byDivision: {},
      },
      equipmentList: [],
      scopeItems: [],
      assetBreakdown: [],
      logisticsBreakdown: [],
      certificationsBreakdown: [],
      rtsItems: [],
      mobilizationItems: [],
      consumableItems: [],
      rtsSections: [],
      mobSections: [],
      consSections: [],
      hoursSummary: {
        engineeringHours: { totalHours: 0, totalCostBRL: 0, items: [] },
        onshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
        offshoreHours: { totalHours: 0, totalCostBRL: 0, items: [] },
        totalsByDivision: {},
        grandTotalHours: 0,
        grandTotalCostBRL: 0,
        grandTotalCostUSD: 0,
      },
      costSummary: {
        assetsCostUSD: 0,
        assetsCostBRL: 0,
        assetsCapexUSD: 0,
        assetsOpexUSD: 0,
        onshoreHoursCostBRL: 0,
        offshoreHoursCostBRL: 0,
        engineeringHoursCostBRL: 0,
        totalHoursCostBRL: 0,
        totalHoursCostUSD: 0,
        logisticsCostUSD: 0,
        logisticsCostBRL: 0,
        certificationsCostUSD: 0,
        certificationsCostBRL: 0,
        rtsCostUSD: 0,
        rtsCostBRL: 0,
        mobilizationCostUSD: 0,
        mobilizationCostBRL: 0,
        consumablesCostUSD: 0,
        consumablesCostBRL: 0,
        totalCostUSD: 0,
        totalCostBRL: 0,
        currency: "USD",
        ptaxUsed: 0,
        notes: "",
      },
      bidResult: {
        outcome: null,
        outcomeDate: null,
        contractValue: null,
        contractCurrency: null,
        lostReason: null,
        competitorName: null,
        feedbackNotes: null,
        followUpDate: null,
        lastUpdatedBy: null,
        lastUpdatedDate: null,
      },
      approvals: [],
      approvalStatus: "not-started",
      attachments: (request.attachments || []).map((a) => ({
        id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        fileName: a.fileName,
        fileUrl: a.path,
        fileSize: a.size,
        fileType: a.fileType,
        uploadedBy: creatorRef.name,
        uploadedDate: a.uploadedDate,
        category: "request",
      })),
      comments: [],
      activityLog: [
        {
          id: `log-${Date.now()}`,
          type: "BID_CREATED",
          timestamp: now,
          actor: creatorRef.email,
          actorName: creatorRef.name,
          description: "Request created",
          metadata: {},
        },
      ],
      templateUsed: null,
      bidFolderUrl: null,
      commercialFolderUrl: request.commercialFolderUrl || null,
      bidNotes: request.notes ? { general: request.notes } : {},
      quickNotes: [],
      engineerBidOverview: "",
      revisions: [],
      metadata: {
        version: "1.0",
        createdBy: creatorRef.email,
        lastModifiedBy: creatorRef.email,
        source: "web",
        schemaVersion: 1,
      },
      kpis: {
        daysInCurrentPhase: 0,
        totalDaysElapsed: 0,
        estimatedDaysRemaining: 0,
        isOverdue: false,
        overdueBy: 0,
        approvalCycleTime: null,
        phaseCompletionPercentage: 0,
        templateMatchScore: null,
      },
      qualificationTables: [],
      clarifications: [],
    };
    return await BidService.create(bid);
  }

  public static async assignRequest(
    bidNumber: string,
    assignTo: IPersonRef,
  ): Promise<void> {
    const bid = await BidService.getByBidNumber(bidNumber);
    if (!bid) throw new Error(`BID ${bidNumber} not found`);
    bid.engineerResponsible = [assignTo];
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
    if (!bid.activityLog) bid.activityLog = [];
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
