/**
 * ApprovalService — Criar, enviar, processar aprovações.
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  IBidApprovalState,
  IApprovalChain,
  IApprovalSectorGroup,
} from "../models/IBidApproval";
import { IPersonRef } from "../models";
import { IBid } from "../models/IBid";

export class ApprovalService {
  private static get _approvalsList() {
    return SPService.sp.web.lists.getByTitle(SHAREPOINT_CONFIG.lists.approvals);
  }

  public static async requestApproval(
    bidNumber: string,
    chains: IApprovalChain[],
    requestedBy: IPersonRef,
  ): Promise<void> {
    // Create notification items for the first approver of each chain
    for (const chain of chains) {
      const firstStep = chain.steps[0];
      if (!firstStep) continue;

      await ApprovalService._approvalsList.items.add({
        Title: bidNumber,
        jsondata: JSON.stringify({
          bidNumber,
          chainId: chain.chainId,
          chainName: chain.chainName,
          approverEmail: firstStep.approver.email,
          approverName: firstStep.approver.name,
          approverRole: firstStep.role,
          stepOrder: firstStep.stepOrder,
          requestedBy: requestedBy.name,
          requestedByEmail: requestedBy.email,
          deepLink: `${window.location.origin}${window.location.pathname}#/bid/${bidNumber}?tab=approvals`,
          timestamp: new Date().toISOString(),
        }),
      });
    }
  }

  public static async processDecision(
    approval: IBidApprovalState,
    chainId: string,
    stepOrder: number,
    decision: "approved" | "rejected" | "revision-requested",
    comments: string,
  ): Promise<IBidApprovalState> {
    const chain = approval.chains.find((c) => c.chainId === chainId);
    if (!chain) throw new Error(`Chain ${chainId} not found`);

    const step = chain.steps.find((s) => s.stepOrder === stepOrder);
    if (!step) throw new Error(`Step ${stepOrder} not found`);

    step.decision = decision;
    step.decisionDate = new Date().toISOString();
    step.comments = comments;

    if (decision === "approved") {
      approval.approvedCount++;
      // Advance to next step if exists
      const nextStep = chain.steps.find((s) => s.stepOrder === stepOrder + 1);
      if (nextStep) {
        chain.currentStep = nextStep.stepOrder;
        // Create notification for next approver
        await ApprovalService._approvalsList.items.add({
          Title: approval.bidNumber,
          jsondata: JSON.stringify({
            bidNumber: approval.bidNumber,
            chainId: chain.chainId,
            chainName: chain.chainName,
            approverEmail: nextStep.approver.email,
            approverName: nextStep.approver.name,
            approverRole: nextStep.role,
            stepOrder: nextStep.stepOrder,
            timestamp: new Date().toISOString(),
          }),
        });
      } else {
        chain.status = "approved";
        chain.completedDate = new Date().toISOString();
      }
    } else if (decision === "rejected") {
      chain.status = "rejected";
      chain.completedDate = new Date().toISOString();
      approval.rejectedCount++;
      approval.status = "rejected";
    } else {
      chain.status = "revision-requested";
      approval.status = "revision-requested";
    }

    // Check if all chains are approved
    approval.allChainsApproved = approval.chains.every(
      (c) => c.status === "approved",
    );
    if (approval.allChainsApproved) {
      approval.status = "approved";
      approval.completedDate = new Date().toISOString();
    }

    return approval;
  }

  /**
   * Start a new approval round — creates one SP list item with all approvers
   * grouped by sector. This item serves as trigger for Power Automate.
   */
  public static async startApprovalRound(
    bidNumber: string,
    sectorGroups: IApprovalSectorGroup[],
    requestedBy: IPersonRef,
    bid: IBid,
  ): Promise<void> {
    const deepLink = `${window.location.origin}${window.location.pathname}#/bid/${bidNumber}?tab=approval`;
    await ApprovalService._approvalsList.items.add({
      Title: bidNumber,
      jsondata: JSON.stringify({
        bidNumber,
        approvers: sectorGroups.map((g) => ({
          sector: g.sector,
          sectorLabel: g.sectorLabel,
          members: g.approvers,
          isAutoLocked: g.isAutoLocked,
        })),
        requestedBy: { name: requestedBy.name, email: requestedBy.email },
        requestedDate: new Date().toISOString(),
        deepLink,
        status: "pending",
        capexUSD: bid.costSummary.assetsCapexUSD,
        division: bid.division,
        serviceLine: bid.serviceLine,
      }),
    });
  }
}
