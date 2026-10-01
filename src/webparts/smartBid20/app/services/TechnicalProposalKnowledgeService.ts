/**
 * TechnicalProposalKnowledgeService — Copies a completed BID's Technical Proposal
 * PDF into smartBidDocs/Datasheets/Technical Proposals (Knowledge Base) with
 * AI-filled catalog metadata, and records the result on `bid.technicalProposal`.
 * Static singleton pattern.
 */
import {
  IBid,
  IBidKnowledgeDoc,
  IBidTechnicalProposal,
  IPersonRef,
} from "../models";
import { IExtractedDocumentMetadata } from "../models/IAIAnalysis";
import { IDocLibraryMetadata } from "../models/IDocLibraryItem";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { useConfigStore } from "../stores/useConfigStore";
import { AIAnalysisService } from "./AIAnalysisService";
import { BidService } from "./BidService";
import { DocLibraryCatalogService } from "./DocLibraryCatalogService";
import { SPService } from "./SPService";
import {
  findGroupByName,
  findSubGroupByName,
  withCategory,
} from "../utils/docCatalogHelpers";
import { getTechnicalProposalAttachment } from "../utils/technicalProposalHelpers";
import { currentRevisionLetter } from "../utils/pastBidDocument";
import { formatDate } from "../utils/formatters";

const DOC_TYPE = "Technical Proposal";
const TEXT_COLUMN_MAX = 255;
const DESCRIPTION_MAX = 2000;

const cut = (value: string | undefined, max = TEXT_COLUMN_MAX): string =>
  (value || "").replace(/\s+/g, " ").trim().substring(0, max);

export class TechnicalProposalKnowledgeService {
  private static _columnsChecked = false;
  private static _folder: Promise<void> | undefined;
  private static _pending: Record<string, Promise<unknown>> = {};

  public static get folderServerRelativeUrl(): string {
    const lib = SHAREPOINT_CONFIG.docLibrary;
    return `${lib.serverRelativeUrl}/${lib.folders.technicalProposals}`;
  }

  /** One file per BID, so a re-published revision replaces the previous copy. */
  public static fileName(bidNumber: string): string {
    return `${bidNumber.replace(/[\\/:*?"<>|#%]/g, "_")} - Technical Proposal.pdf`;
  }

  /**
   * Publishes of the same BID run one after the other. A failed copy is recorded
   * on the BID (doc.status = "failed") instead of throwing, so it can be retried;
   * only a missing PDF or the BID write throws.
   */
  public static publish(
    bid: IBid,
    actor: IPersonRef,
  ): Promise<IBidTechnicalProposal> {
    const key = bid.bidNumber;
    const previous = TechnicalProposalKnowledgeService._pending[key];
    const run = (): Promise<IBidTechnicalProposal> =>
      TechnicalProposalKnowledgeService._publish(bid, actor);
    const next = previous ? previous.then(run, run) : run();
    TechnicalProposalKnowledgeService._pending[key] = next;
    const clear = (): void => {
      if (TechnicalProposalKnowledgeService._pending[key] === next) {
        delete TechnicalProposalKnowledgeService._pending[key];
      }
    };
    next.then(clear, clear);
    return next;
  }

  private static async _publish(
    bid: IBid,
    actor: IPersonRef,
  ): Promise<IBidTechnicalProposal> {
    const attachment = getTechnicalProposalAttachment(bid);
    if (!attachment) {
      throw new Error(
        `BID ${bid.bidNumber} has no Technical Proposal PDF attached.`,
      );
    }
    const base: IBidTechnicalProposal = bid.technicalProposal || {
      requested: false,
    };
    const folder = TechnicalProposalKnowledgeService.folderServerRelativeUrl;
    const fileName = TechnicalProposalKnowledgeService.fileName(bid.bidNumber);
    let aiStatus: IBidTechnicalProposal["aiStatus"] = "skipped";
    let doc: IBidKnowledgeDoc = {
      status: "published",
      fileName,
      serverRelativeUrl: `${folder}/${fileName}`,
      publishedDate: new Date().toISOString(),
      publishedBy: actor,
      error: null,
    };

    try {
      const source = await DocLibraryCatalogService.downloadFileAsFile(
        attachment.fileUrl,
        attachment.fileName,
      );
      const group = findGroupByName(
        useConfigStore.getState().config?.favoriteGroups || [],
        SHAREPOINT_CONFIG.technicalProposal.knowledgeGroupName,
      );
      let extracted: IExtractedDocumentMetadata | undefined;
      try {
        const result = await AIAnalysisService.extractDocumentMetadata(
          source,
          [DOC_TYPE],
          group
            ? [
                {
                  name: group.name,
                  subGroups: group.subGroups.map((sg) => sg.name),
                },
              ]
            : [],
        );
        extracted = result.items[0];
        aiStatus = extracted ? "ok" : "failed";
      } catch (err) {
        // Metadata falls back to BID data; the copy itself must not depend on the AI.
        console.warn(
          `Technical Proposal AI metadata failed for ${bid.bidNumber}:`,
          err,
        );
        aiStatus = "failed";
      }

      await TechnicalProposalKnowledgeService._ensureColumns();
      await TechnicalProposalKnowledgeService._ensureFolder();
      const file = new File([source], fileName, { type: "application/pdf" });
      await DocLibraryCatalogService.uploadFile(
        folder,
        file,
        TechnicalProposalKnowledgeService._buildMetadata(
          bid,
          group ? group.id : "",
          extracted,
        ),
        true,
      );
    } catch (err) {
      console.error(
        `Technical Proposal copy failed for ${bid.bidNumber}:`,
        err,
      );
      doc = {
        ...doc,
        status: "failed",
        publishedDate: base.doc?.publishedDate || null,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    const technicalProposal: IBidTechnicalProposal = {
      ...base,
      doc,
      aiStatus,
    };
    await BidService.patchByBidNumber(bid.bidNumber, { technicalProposal });
    return technicalProposal;
  }

  /** Client and BID number come from the BID; the AI fills what only the PDF knows. */
  private static _buildMetadata(
    bid: IBid,
    groupId: string,
    extracted: IExtractedDocumentMetadata | undefined,
  ): IDocLibraryMetadata {
    const opp = bid.opportunityInfo || ({} as IBid["opportunityInfo"]);
    const client = cut(opp.client);
    const groups = useConfigStore.getState().config?.favoriteGroups || [];
    const group = groups.filter((g) => g.id === groupId)[0];
    const sub = extracted
      ? findSubGroupByName(group, extracted.subGroupName || "")
      : undefined;
    const rev = currentRevisionLetter(bid);
    const fallbackRevision = [
      rev ? `Rev ${rev}` : "",
      bid.completedDate ? `Completed ${formatDate(bid.completedDate)}` : "",
    ]
      .filter(Boolean)
      .join(" · ");
    const fallbackKeywords = [
      bid.division,
      bid.serviceLine,
      opp.vessel,
      opp.field,
    ]
      .filter((v) => cut(v))
      .join(", ");

    return withCategory({
      title: cut(
        extracted?.title ||
          `Technical Proposal ${bid.bidNumber}${client ? ` - ${client}` : ""}`,
      ),
      docType: DOC_TYPE,
      groupId,
      subGroupId: sub ? sub.id : "",
      manufacturer: client || cut(extracted?.manufacturer),
      model: cut(bid.bidNumber),
      keywords: cut(extracted?.keywords || fallbackKeywords),
      description: cut(
        extracted?.description || opp.projectName,
        DESCRIPTION_MAX,
      ),
      revision: cut(extracted?.revision || fallbackRevision),
    });
  }

  private static _ensureFolder(): Promise<void> {
    if (!TechnicalProposalKnowledgeService._folder) {
      const pending = TechnicalProposalKnowledgeService._createFolderIfMissing();
      TechnicalProposalKnowledgeService._folder = pending;
      // A failed attempt (e.g. no permission) is retried on the next publish.
      pending.catch(() => {
        if (TechnicalProposalKnowledgeService._folder === pending) {
          TechnicalProposalKnowledgeService._folder = undefined;
        }
      });
    }
    return TechnicalProposalKnowledgeService._folder;
  }

  private static async _createFolderIfMissing(): Promise<void> {
    const url = TechnicalProposalKnowledgeService.folderServerRelativeUrl;
    const web = SPService.sp.web as any;
    const exists: boolean = await web
      .getFolderByServerRelativePath(url)
      .select("Exists")()
      .then(
        (info: { Exists?: boolean }) => !!info.Exists,
        () => false,
      );
    if (!exists) await web.folders.addUsingPath(url);
  }

  private static async _ensureColumns(): Promise<void> {
    if (TechnicalProposalKnowledgeService._columnsChecked) return;
    TechnicalProposalKnowledgeService._columnsChecked = true;
    try {
      await DocLibraryCatalogService.ensureColumns();
    } catch {
      // Contributors cannot manage columns; the upload still works once they exist.
    }
  }
}
