/**
 * AIAnalysisService — Uploads document to SharePoint AI-Analysis folder,
 * Power Automate flow triggers on file creation, processes with AI Builder,
 * and writes the result to the AIResponse column.
 * Supports both BIDs (smartbid-tracker) and Templates (smartbid-templates).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IScopeItem } from "../models";
import { IAIAnalysisResult } from "../models/IAIAnalysis";
import { makeId } from "../utils/idGenerator";

/** Polling interval in ms */
const POLL_INTERVAL_MS = 8000;
/** Maximum polling time before timeout (5 minutes) */
const MAX_POLL_TIME_MS = 300000;

/** Where to poll for the AI response */
type TargetType = "bid" | "template";

export class AIAnalysisService {
  /**
   * Validate and normalize the raw response from Power Automate (stored in AIResponse column).
   */
  private static validateResponse(
    data: unknown,
    fileName: string,
  ): IAIAnalysisResult {
    const raw = data as Record<string, unknown>;

    // Check if it's an error response
    if (raw.error) {
      const errMsg = raw.details
        ? `${raw.error}: ${raw.details}`
        : String(raw.error);
      throw new Error(errMsg);
    }

    // Validate scopeItems is an array (accept both "scopeItems" and "items" keys)
    const rawItems = raw.scopeItems || raw.items;
    const scopeItems = Array.isArray(rawItems) ? rawItems : [];
    const warnings = Array.isArray(raw.warnings) ? raw.warnings : [];
    const chunksProcessed =
      typeof raw.chunksProcessed === "number" ? raw.chunksProcessed : 1;
    // Accept both "isComplete" and "complete" keys
    const rawComplete =
      raw.isComplete !== undefined ? raw.isComplete : raw.complete;
    const isComplete = typeof rawComplete === "boolean" ? rawComplete : true;

    // Normalize each scope item — assign IDs and lineNumbers
    let lineNum = 1;
    let currentSectionId: string | null = null;
    const normalized: IScopeItem[] = [];

    scopeItems.forEach((item: Record<string, unknown>) => {
      const id = makeId("ai");
      const isSection = !!item.isSection;

      if (isSection) {
        currentSectionId = id;
        normalized.push({
          id,
          lineNumber: lineNum++,
          isSection: true,
          sectionId: null,
          sectionTitle: String(item.sectionTitle || "Untitled Section"),
          clientDocRef: "",
          description: "",
          compliance: null,
          resourceType: "",
          resourceSubType: "",
          equipmentOffer: "",
          partNumber: "",
          qtyOperational: 0,
          qtySpare: 0,
          needsCertification: false,
          comments: "",
          importedFromTemplate: "ai-analysis",
          integratedDivision: "",
          clientRequirement: "",
          clientSpecs: [],
          sectionColor: item.sectionColor
            ? String(item.sectionColor)
            : undefined,
        });
      } else {
        normalized.push({
          id,
          lineNumber: lineNum++,
          isSection: false,
          sectionId: currentSectionId,
          sectionTitle: "",
          clientDocRef: String(item.clientDocRef || ""),
          description: String(item.description || ""),
          compliance:
            item.compliance === "yes" || item.compliance === "no"
              ? (item.compliance as "yes" | "no")
              : null,
          resourceType: String(item.resourceType || ""),
          resourceSubType: String(item.resourceSubType || ""),
          equipmentOffer: "",
          partNumber: String(item.oiiPartNumber || item.partNumber || ""),
          qtyOperational:
            typeof item.qtyOperational === "number" ? item.qtyOperational : 1,
          qtySpare: typeof item.qtySpare === "number" ? item.qtySpare : 0,
          needsCertification: false,
          comments: "",
          importedFromTemplate: "ai-analysis",
          integratedDivision: "",
          clientRequirement: String(item.clientRequirement || ""),
          clientSpecs: Array.isArray(item.clientSpecs)
            ? (item.clientSpecs as string[])
            : [],
        });
      }
    });

    // Add incompleteness warning
    if (!isComplete) {
      warnings.push(
        "Analysis may be incomplete. The document may be too large for a single analysis pass.",
      );
    }
    if (chunksProcessed > 1) {
      warnings.push(
        "Document was analyzed in " +
          chunksProcessed +
          " parts. Some items may be duplicated across section boundaries.",
      );
    }

    return {
      scopeItems: normalized,
      warnings: warnings.map(String),
      chunksProcessed,
      isComplete,
      sourceDocument: raw.sourceDocument
        ? String(raw.sourceDocument)
        : fileName,
      analyzedAt: raw.analyzedAt
        ? String(raw.analyzedAt)
        : new Date().toISOString(),
    };
  }

  /**
   * Upload file to AI-Analysis folder with naming convention: {bidNumber}___{fileName}
   */
  private static async uploadFileToAIFolder(
    file: File,
    bidNumber: string,
  ): Promise<void> {
    const folderPath =
      SHAREPOINT_CONFIG.libraries.attachments +
      "/" +
      SHAREPOINT_CONFIG.folders.aiAnalysis;

    // Ensure AI-Analysis folder exists
    try {
      await SPService.sp.web
        .getFolderByServerRelativePath(SHAREPOINT_CONFIG.libraries.attachments)
        .addSubFolderUsingPath(SHAREPOINT_CONFIG.folders.aiAnalysis);
    } catch {
      // Folder may already exist
    }

    const uploadName = bidNumber + "___" + file.name;

    await SPService.sp.web
      .getFolderByServerRelativePath(folderPath)
      .files.addUsingPath(uploadName, file, { Overwrite: true });
  }

  /**
   * Get the list name based on target type.
   */
  private static getListName(target: TargetType): string {
    return target === "bid"
      ? SHAREPOINT_CONFIG.lists.bidTracker
      : SHAREPOINT_CONFIG.lists.templates;
  }

  /**
   * Clear the AIResponse column before starting analysis.
   */
  private static async clearAIResponse(
    identifier: string,
    target: TargetType,
  ): Promise<void> {
    const listName = AIAnalysisService.getListName(target);
    const items = await SPService.sp.web.lists
      .getByTitle(listName)
      .items.filter("Title eq '" + identifier + "'")
      .select("Id")
      .top(1)();

    if (items.length > 0) {
      await SPService.sp.web.lists
        .getByTitle(listName)
        .items.getById((items[0] as { Id: number }).Id)
        .update({ AIResponse: "" });
    }
  }

  /**
   * Poll the AIResponse column until it has a non-empty value.
   */
  private static async pollForResult(
    identifier: string,
    target: TargetType,
    abortSignal?: AbortSignal,
  ): Promise<string> {
    const listName = AIAnalysisService.getListName(target);
    const startTime = Date.now();

    while (Date.now() - startTime < MAX_POLL_TIME_MS) {
      if (abortSignal && abortSignal.aborted) {
        throw new Error("Analysis was cancelled.");
      }

      // Wait before polling
      await new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, POLL_INTERVAL_MS);
        if (abortSignal) {
          const onAbort = (): void => {
            clearTimeout(timer);
            reject(new Error("Analysis was cancelled."));
          };
          if (abortSignal.aborted) {
            clearTimeout(timer);
            reject(new Error("Analysis was cancelled."));
            return;
          }
          abortSignal.addEventListener("abort", onAbort, { once: true });
        }
      });

      // Check AIResponse column
      const items = await SPService.sp.web.lists
        .getByTitle(listName)
        .items.filter("Title eq '" + identifier + "'")
        .select("AIResponse")
        .top(1)();

      if (items.length > 0 && (items[0] as { AIResponse: string }).AIResponse) {
        const val = String(
          (items[0] as { AIResponse: string }).AIResponse,
        ).trim();
        if (val.length > 0) {
          return val;
        }
      }
    }

    throw new Error(
      "Analysis timed out after 5 minutes. The Power Automate flow may still be processing. Check back later.",
    );
  }

  /**
   * Analyze a client document for a BID:
   * 1. Clear AIResponse column on smartbid-tracker
   * 2. Upload file to AI-Analysis folder (triggers Power Automate)
   * 3. Poll AIResponse column until result appears
   * 4. Parse and return the result
   *
   * @param file - The PDF or Word file to analyze
   * @param bidNumber - BID number (e.g. "REQ-2026-0007")
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async analyzeDocument(
    file: File,
    bidNumber: string,
    abortSignal?: AbortSignal,
  ): Promise<IAIAnalysisResult> {
    if (!bidNumber) {
      throw new Error(
        "BID number is required for AI analysis. Please save the BID first.",
      );
    }

    await AIAnalysisService.clearAIResponse(bidNumber, "bid");
    await AIAnalysisService.uploadFileToAIFolder(file, bidNumber);

    const responseJson = await AIAnalysisService.pollForResult(
      bidNumber,
      "bid",
      abortSignal,
    );

    let data: unknown;
    try {
      data = JSON.parse(responseJson);
    } catch {
      throw new Error("The AI returned an invalid response. Please try again.");
    }

    await AIAnalysisService.clearAIResponse(bidNumber, "bid").catch(() => {});

    return AIAnalysisService.validateResponse(data, file.name);
  }

  /**
   * Analyze a client document for a Template:
   * 1. Clear AIResponse column on smartbid-templates
   * 2. Upload file to AI-Analysis folder with TEMPLATE-{id} prefix
   * 3. Poll AIResponse column on smartbid-templates until result appears
   * 4. Parse and return the result
   *
   * @param file - The PDF or Word file to analyze
   * @param templateId - Template ID (Title in smartbid-templates)
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async analyzeDocumentForTemplate(
    file: File,
    templateId: string,
    abortSignal?: AbortSignal,
  ): Promise<IAIAnalysisResult> {
    if (!templateId) {
      throw new Error("Template ID is required for AI analysis.");
    }

    await AIAnalysisService.clearAIResponse(templateId, "template");
    await AIAnalysisService.uploadFileToAIFolder(file, "TPL-" + templateId);

    const responseJson = await AIAnalysisService.pollForResult(
      templateId,
      "template",
      abortSignal,
    );

    let data: unknown;
    try {
      data = JSON.parse(responseJson);
    } catch {
      throw new Error("The AI returned an invalid response. Please try again.");
    }

    await AIAnalysisService.clearAIResponse(templateId, "template").catch(
      () => {},
    );

    return AIAnalysisService.validateResponse(data, file.name);
  }
}
