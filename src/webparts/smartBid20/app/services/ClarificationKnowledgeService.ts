/**
 * ClarificationKnowledgeService — Rewrites the Clarif. & Qualif. library knowledge
 * documents (smartBidDocs/Clarifications Library, indexed by AI Search) from the
 * whole Clarifications Database and Qualifications Database lists. Static singleton pattern.
 */
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { ClarificationBaseType } from "../models/IClarificationDb";
import { ISystemConfig } from "../models/ISystemConfig";
import { ClarificationDbService } from "./ClarificationDbService";
import { DocLibraryCatalogService } from "./DocLibraryCatalogService";
import { QualificationDbService } from "./QualificationDbService";
import {
  CLARIFICATION_LIBRARY_FILES,
  CLARIFICATION_LIBRARY_WARN_CHARS,
  buildClarificationLibraryDocument,
  buildClarificationLibraryMetadata,
  buildQualificationLibraryDocument,
} from "../utils/clarificationLibraryDocument";

export interface IClarificationKnowledgeResult {
  clarifications: number;
  qualifications: number;
  /** File names close to the indexing size limit. */
  oversized: string[];
}

const TYPES: ClarificationBaseType[] = ["Clarification", "Qualification"];

export class ClarificationKnowledgeService {
  private static _running: Promise<IClarificationKnowledgeResult> | undefined;
  private static _queued: Promise<IClarificationKnowledgeResult> | undefined;
  private static _columnsChecked = false;

  public static get folderServerRelativeUrl(): string {
    const lib = SHAREPOINT_CONFIG.docLibrary;
    return `${lib.serverRelativeUrl}/${lib.folders.clarificationLibrary}`;
  }

  /**
   * Rebuild both documents from the list. Calls made while a rebuild runs share
   * a single follow-up rebuild, so the latest change is always published.
   */
  public static publish(
    config: ISystemConfig | null,
  ): Promise<IClarificationKnowledgeResult> {
    const S = ClarificationKnowledgeService;
    if (S._queued) return S._queued;
    if (!S._running) return S._start(config);
    const next = (): Promise<IClarificationKnowledgeResult> => {
      S._queued = undefined;
      return S._start(config);
    };
    S._queued = S._running.then(next, next);
    return S._queued;
  }

  private static _start(
    config: ISystemConfig | null,
  ): Promise<IClarificationKnowledgeResult> {
    const S = ClarificationKnowledgeService;
    const run = S._publish(config);
    S._running = run;
    const clear = (): void => {
      if (S._running === run) S._running = undefined;
    };
    run.then(clear, clear);
    return run;
  }

  private static async _publish(
    config: ISystemConfig | null,
  ): Promise<IClarificationKnowledgeResult> {
    const [items, qualifications] = await Promise.all([
      ClarificationDbService.getAll(),
      QualificationDbService.getAll(),
    ]);
    const folder = ClarificationKnowledgeService.folderServerRelativeUrl;
    await ClarificationKnowledgeService._ensureColumns();
    await DocLibraryCatalogService.ensureFolder(folder);

    const result: IClarificationKnowledgeResult = {
      clarifications: 0,
      qualifications: 0,
      oversized: [],
    };
    for (const baseType of TYPES) {
      const fileName = CLARIFICATION_LIBRARY_FILES[baseType];
      const { text, count } =
        baseType === "Qualification"
          ? buildQualificationLibraryDocument(qualifications, items, config)
          : buildClarificationLibraryDocument(baseType, items, config);
      if (baseType === "Clarification") result.clarifications = count;
      else result.qualifications = count;
      if (count === 0) {
        // Nothing to index for this type; the file may not exist yet.
        await DocLibraryCatalogService.deleteFile(
          `${folder}/${fileName}`,
        ).catch(() => undefined);
        continue;
      }
      if (text.length > CLARIFICATION_LIBRARY_WARN_CHARS) {
        result.oversized.push(fileName);
      }
      await DocLibraryCatalogService.uploadFile(
        folder,
        new File([text], fileName, { type: "text/markdown" }),
        buildClarificationLibraryMetadata(baseType, count),
        true,
      );
    }
    return result;
  }

  private static async _ensureColumns(): Promise<void> {
    if (ClarificationKnowledgeService._columnsChecked) return;
    ClarificationKnowledgeService._columnsChecked = true;
    // Contributors cannot manage columns; the upload still works once they exist.
    await DocLibraryCatalogService.ensureColumns().catch(() => undefined);
  }
}
