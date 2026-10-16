/**
 * PastBidKnowledgeService — Publishes a completed BID to the Knowledge Base:
 * classifies it (AI + scope sub-types), writes its Markdown knowledge document to
 * smartBidDocs/Past Bids (indexed by AI Search) and stores the resulting
 * `knowledgeProfile` on the BID. Static singleton pattern.
 */
import { IBid, IBidKnowledgeProfile, IPersonRef } from "../models";
import { IPastBidProfileSuggestion } from "../models/IAIAnalysis";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { AIAnalysisService } from "./AIAnalysisService";
import { BidService } from "./BidService";
import { DocLibraryCatalogService } from "./DocLibraryCatalogService";
import {
  buildPastBidAiDigest,
  buildPastBidDocument,
  buildPastBidFileName,
  buildPastBidMetadata,
  derivePastBidTags,
  mergeUnique,
} from "../utils/pastBidDocument";

export type PastBidProfileFields = Pick<
  IBidKnowledgeProfile,
  "scopeCategories" | "tags" | "summary"
>;

export interface IPastBidPublishOptions {
  /** Ask the AI for categories / tags / summary before publishing. */
  runAi: boolean;
  /** Configured scope categories (System Config). */
  scopeCategories: string[];
  /** User-edited classification — used as-is, no AI or derived tags merged. */
  profile?: PastBidProfileFields;
}

export class PastBidKnowledgeService {
  private static _columnsChecked = false;
  private static _pending: Record<string, Promise<unknown>> = {};

  public static get folderServerRelativeUrl(): string {
    const lib = SHAREPOINT_CONFIG.docLibrary;
    return `${lib.serverRelativeUrl}/${lib.folders.pastBids}`;
  }

  /** Absolute URL of a published knowledge document. */
  public static fileUrl(serverRelativeUrl: string): string {
    const origin = SHAREPOINT_CONFIG.siteUrl.replace(/\/sites\/.*$/, "");
    return origin + serverRelativeUrl;
  }

  /** AI suggestion only — nothing is saved. */
  public static async suggestProfile(
    bid: IBid,
    scopeCategories: string[],
  ): Promise<IPastBidProfileSuggestion> {
    const suggestion = await AIAnalysisService.suggestPastBidProfile(
      buildPastBidAiDigest(bid),
      bid.bidNumber,
      scopeCategories,
    );
    return {
      ...suggestion,
      tags: mergeUnique(suggestion.tags, derivePastBidTags(bid)),
    };
  }

  /**
   * Classify, write the knowledge document and save the profile on the BID.
   * Publishes of the same BID run one after the other. A failed document upload
   * is recorded on the profile (doc.status = "failed") instead of throwing, so
   * it can be retried from the Past Bids page; only the BID write can throw.
   */
  public static publish(
    bid: IBid,
    actor: IPersonRef,
    opts: IPastBidPublishOptions,
  ): Promise<IBidKnowledgeProfile> {
    const key = bid.bidNumber;
    const previous = PastBidKnowledgeService._pending[key];
    const run = (): Promise<IBidKnowledgeProfile> =>
      PastBidKnowledgeService._publish(bid, actor, opts);
    const next = previous ? previous.then(run, run) : run();
    PastBidKnowledgeService._pending[key] = next;
    const clear = (): void => {
      if (PastBidKnowledgeService._pending[key] === next) {
        delete PastBidKnowledgeService._pending[key];
      }
    };
    next.then(clear, clear);
    return next;
  }

  private static async _publish(
    bid: IBid,
    actor: IPersonRef,
    opts: IPastBidPublishOptions,
  ): Promise<IBidKnowledgeProfile> {
    const now = new Date().toISOString();
    const existing = bid.knowledgeProfile;
    let fields: PastBidProfileFields = opts.profile
      ? {
          scopeCategories: opts.profile.scopeCategories.slice(),
          tags: mergeUnique(opts.profile.tags),
          summary: opts.profile.summary.trim(),
        }
      : {
          scopeCategories: existing ? existing.scopeCategories.slice() : [],
          tags: existing ? existing.tags.slice() : [],
          summary: existing ? existing.summary : "",
        };
    let aiStatus: IBidKnowledgeProfile["aiStatus"] = existing
      ? existing.aiStatus
      : "skipped";
    let aiSuggestedDate = existing ? existing.aiSuggestedDate || null : null;

    if (!opts.profile) {
      if (opts.runAi) {
        try {
          const ai = await AIAnalysisService.suggestPastBidProfile(
            buildPastBidAiDigest(bid),
            bid.bidNumber,
            opts.scopeCategories,
          );
          fields = {
            scopeCategories: fields.scopeCategories.length
              ? fields.scopeCategories
              : ai.scopeCategories,
            tags: mergeUnique(fields.tags, ai.tags),
            summary: fields.summary || ai.summary,
          };
          aiStatus = "ok";
          aiSuggestedDate = now;
        } catch (err) {
          console.warn(
            `Past Bid AI classification failed for ${bid.bidNumber}:`,
            err,
          );
          aiStatus = "failed";
        }
      }
      fields.tags = mergeUnique(fields.tags, derivePastBidTags(bid));
    }

    const fileName = buildPastBidFileName(bid.bidNumber);
    const folder = PastBidKnowledgeService.folderServerRelativeUrl;
    const profile: IBidKnowledgeProfile = {
      ...fields,
      aiStatus,
      aiSuggestedDate,
      editedBy: opts.profile
        ? actor
        : existing
          ? existing.editedBy || null
          : null,
      editedDate: opts.profile
        ? now
        : existing
          ? existing.editedDate || null
          : null,
      doc: {
        status: "published",
        fileName,
        serverRelativeUrl: `${folder}/${fileName}`,
        publishedDate: now,
        publishedBy: actor,
        error: null,
      },
    };

    try {
      await PastBidKnowledgeService._ensureColumns();
      await DocLibraryCatalogService.ensureFolder(folder);
      const text = buildPastBidDocument(bid, fields);
      const file = new File([text], fileName, { type: "text/markdown" });
      await DocLibraryCatalogService.uploadFile(
        folder,
        file,
        buildPastBidMetadata(bid, fields),
        true,
      );
    } catch (err) {
      console.error(
        `Past Bid document upload failed for ${bid.bidNumber}:`,
        err,
      );
      profile.doc = {
        ...profile.doc,
        status: "failed",
        publishedDate: existing?.doc?.publishedDate || null,
        error: err instanceof Error ? err.message : String(err),
      };
    }

    await BidService.patchByBidNumber(bid.bidNumber, {
      knowledgeProfile: profile,
    });
    return profile;
  }

  private static async _ensureColumns(): Promise<void> {
    if (PastBidKnowledgeService._columnsChecked) return;
    PastBidKnowledgeService._columnsChecked = true;
    try {
      await DocLibraryCatalogService.ensureColumns();
    } catch {
      // Contributors cannot manage columns; the upload still works once they exist.
    }
  }
}
