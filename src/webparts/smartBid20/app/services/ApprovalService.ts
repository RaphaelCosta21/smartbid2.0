/**
 * ApprovalService — Criar, enviar, processar aprovações.
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
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

  /**
   * Ensure the columns used by the Teams approval flow exist on the
   * smartbid-approvals list. Idempotent — each add is guarded so an existing
   * column does not throw. Safe to call before every approval round.
   */
  public static async ensureApprovalColumns(): Promise<void> {
    const F = SHAREPOINT_CONFIG.approvalFields;
    const listApi = ApprovalService._approvalsList as any;
    let existing: string[] = [];
    try {
      const fields = await listApi.fields.select("InternalName")();
      existing = (fields as { InternalName: string }[]).map(
        (f) => f.InternalName,
      );
    } catch (err) {
      console.warn(
        "ApprovalService.ensureApprovalColumns: cannot read fields",
        err,
      );
      return;
    }
    const has = (name: string): boolean => existing.indexOf(name) >= 0;
    const fieldsApi = listApi.fields;

    const addText = async (name: string): Promise<void> => {
      if (has(name)) return;
      try {
        await fieldsApi.addText(name);
      } catch (e) {
        /* ignore — may already exist */
      }
    };
    const addNumber = async (name: string): Promise<void> => {
      if (has(name)) return;
      try {
        await fieldsApi.addNumber(name);
      } catch (e) {
        /* ignore */
      }
    };
    const addDateTime = async (name: string): Promise<void> => {
      if (has(name)) return;
      try {
        await fieldsApi.addDateTime(name);
      } catch (e) {
        /* ignore */
      }
    };
    const addChoice = async (
      name: string,
      choices: string[],
    ): Promise<void> => {
      if (has(name)) return;
      try {
        await fieldsApi.addChoice(name, { Choices: choices });
      } catch (e) {
        /* ignore */
      }
    };

    await addChoice(F.recordType, ["Round", "Approver"]);
    await addText(F.bidNumber);
    await addNumber(F.roundNumber);
    await addText(F.approverEmail);
    await addText(F.approverName);
    await addText(F.sector);
    await addText(F.sectorLabel);
    await addChoice(F.approvalStatus, ["Pending", "Approved"]);
    await addDateTime(F.respondedDate);
    await addText(F.chatId);
    await addText(F.statusCardMessageId);
    await addNumber(F.expectedApproverCount);
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
   * Start a new approval round — creates a single "Round" trigger item on the
   * smartbid-approvals list with all approvers grouped by sector. Power Automate
   * fires on this item (RecordType='Round') and fans out one "Approver" row per
   * person. Also carries engineerResponsible + analyst so the Teams flow can add
   * them to the approval chat (they are chat members but not approvers). The
   * base64 photoUrl is intentionally stripped to keep the row lean.
   */
  public static async startApprovalRound(
    bidNumber: string,
    sectorGroups: IApprovalSectorGroup[],
    requestedBy: IPersonRef,
    bid: IBid,
    round: number,
  ): Promise<void> {
    await ApprovalService.ensureApprovalColumns();
    const F = SHAREPOINT_CONFIG.approvalFields;
    const deepLink = `${window.location.origin}${window.location.pathname}#/bid/${bidNumber}?tab=approval`;
    const expectedApproverCount = sectorGroups.reduce(
      (sum, g) => sum + g.approvers.length,
      0,
    );
    await ApprovalService._approvalsList.items.add({
      Title: bidNumber,
      [F.recordType]: "Round",
      [F.bidNumber]: bidNumber,
      [F.roundNumber]: round,
      [F.approvalStatus]: "Pending",
      [F.expectedApproverCount]: expectedApproverCount,
      jsondata: JSON.stringify({
        bidNumber,
        round,
        approvers: sectorGroups.map((g) => ({
          sector: g.sector,
          sectorLabel: g.sectorLabel,
          members: g.approvers.map((m) => ({
            name: m.name,
            email: m.email,
            role: m.role,
          })),
          isAutoLocked: g.isAutoLocked,
        })),
        requestedBy: { name: requestedBy.name, email: requestedBy.email },
        // Chat-only participants (not approvers) so the Teams flow can add them
        engineerResponsible: (bid.engineerResponsible || []).map((p) => ({
          name: p.name,
          email: p.email,
        })),
        analyst: (bid.analyst || []).map((p) => ({
          name: p.name,
          email: p.email,
        })),
        client: bid.opportunityInfo?.client || "",
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
