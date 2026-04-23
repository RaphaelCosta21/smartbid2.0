/**
 * AIAnalysisService — Calls Power Automate flow to analyze client documents.
 * Static singleton pattern.
 */
import { APP_CONFIG } from "../config/app.config";
import { IScopeItem, ISystemConfig } from "../models";
import {
  IAIAnalysisRequest,
  IAIAnalysisResult,
  IAIAnalysisError,
} from "../models/IAIAnalysis";
import { makeId } from "../utils/idGenerator";

/** Timeout for the analysis request (120 seconds) */
const ANALYSIS_TIMEOUT_MS = 120000;

export class AIAnalysisService {
  /**
   * Convert a File to a base64 string.
   */
  private static fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove data URL prefix (e.g. "data:application/pdf;base64,")
        const base64 =
          result.indexOf(",") >= 0
            ? result.substring(result.indexOf(",") + 1)
            : result;
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Build resource type list from system config.
   */
  private static getResourceTypes(config: ISystemConfig | null): string[] {
    if (!config || !config.resourceTypes) return [];
    const result: string[] = [];
    config.resourceTypes.forEach((rt) => {
      result.push(rt.id || rt.label || "");
      if (rt.subTypes) {
        rt.subTypes.forEach((st) => {
          result.push(st.value || st.label || "");
        });
      }
    });
    return result.filter(Boolean);
  }

  /**
   * Validate and normalize the raw response from Power Automate.
   */
  private static validateResponse(
    data: unknown,
    fileName: string,
  ): IAIAnalysisResult {
    const raw = data as Record<string, unknown>;

    // Check if it's an error response
    if (raw.error) {
      const err = raw as unknown as IAIAnalysisError;
      throw new Error(err.details ? `${err.error}: ${err.details}` : err.error);
    }

    // Validate scopeItems is an array
    const scopeItems = Array.isArray(raw.scopeItems) ? raw.scopeItems : [];
    const warnings = Array.isArray(raw.warnings) ? raw.warnings : [];
    const chunksProcessed =
      typeof raw.chunksProcessed === "number" ? raw.chunksProcessed : 1;
    const isComplete =
      typeof raw.isComplete === "boolean" ? raw.isComplete : true;

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
        `Document was analyzed in ${chunksProcessed} parts. Some items may be duplicated across section boundaries.`,
      );
    }

    return {
      scopeItems: normalized,
      warnings: warnings.map(String),
      chunksProcessed,
      isComplete,
      sourceDocument: fileName,
      analyzedAt: new Date().toISOString(),
    };
  }

  /**
   * Analyze a client document and return structured scope items.
   * @param file - The PDF or Word file to analyze
   * @param division - BID division
   * @param serviceLine - BID service line
   * @param config - System configuration (for resource types)
   * @param abortSignal - Optional AbortSignal for cancellation
   */
  public static async analyzeDocument(
    file: File,
    division: string,
    serviceLine: string,
    config: ISystemConfig | null,
    abortSignal?: AbortSignal,
  ): Promise<IAIAnalysisResult> {
    const flowUrl = APP_CONFIG.aiFlowUrl;

    if (!flowUrl) {
      throw new Error(
        "AI Analysis is not configured. Please contact your administrator to set up the Power Automate flow URL.",
      );
    }

    // Convert file to base64
    const fileContent = await AIAnalysisService.fileToBase64(file);

    // Build request
    const request: IAIAnalysisRequest = {
      fileContent,
      fileName: file.name,
      division: division || "",
      serviceLine: serviceLine || "",
      resourceTypes: AIAnalysisService.getResourceTypes(config),
      contextSummary: "",
    };

    // Set up timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ANALYSIS_TIMEOUT_MS);

    // If caller provides an abort signal, listen to it
    if (abortSignal) {
      if (abortSignal.aborted) {
        clearTimeout(timeoutId);
        throw new Error("Analysis was cancelled.");
      }
      abortSignal.addEventListener("abort", () => {
        controller.abort();
        clearTimeout(timeoutId);
      });
    }

    try {
      const response = await fetch(flowUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorMsg = `Analysis service returned status ${response.status}`;
        try {
          const errBody = await response.json();
          if (errBody && errBody.error) {
            errorMsg = errBody.details
              ? `${errBody.error}: ${errBody.details}`
              : errBody.error;
          }
        } catch {
          // ignore JSON parse failure for error body
        }
        throw new Error(errorMsg);
      }

      let data: unknown;
      try {
        data = await response.json();
      } catch {
        throw new Error(
          "The AI returned an invalid response. The output may have been truncated. Please try again with a smaller document.",
        );
      }

      return AIAnalysisService.validateResponse(data, file.name);
    } catch (err) {
      clearTimeout(timeoutId);

      if (err instanceof Error) {
        if (err.name === "AbortError") {
          if (abortSignal && abortSignal.aborted) {
            throw new Error("Analysis was cancelled.");
          }
          throw new Error(
            "Analysis timed out. The document may be too large. Try with a smaller document or fewer pages.",
          );
        }
        throw err;
      }
      throw new Error(
        "Could not reach the analysis service. Check your network connection.",
      );
    }
  }
}
