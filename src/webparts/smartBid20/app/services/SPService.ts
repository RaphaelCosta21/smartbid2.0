/**
 * SPService — Base PnPjs v3 wrapper, init com context.
 * Static singleton pattern (padrão SmartFlow).
 */
import { spfi, SPFI, SPFx } from "@pnp/sp";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/attachments";
import "@pnp/sp/site-users/web";

export class SPService {
  private static _sp: SPFI | null = null;
  private static _context: WebPartContext | null = null;
  private static _isInitialized = false;

  public static init(context: WebPartContext): void {
    SPService._context = context;
    SPService._sp = spfi().using(SPFx(context));
    SPService._isInitialized = true;
  }

  public static get sp(): SPFI {
    if (!SPService._sp) {
      throw new Error(
        "SPService not initialized. Call SPService.init(context) first.",
      );
    }
    return SPService._sp;
  }

  /**
   * Raw SPFx WebPartContext — used for Entra ID-authenticated calls
   * (AadHttpClientFactory) to the Azure AI backend, Teams SDK, etc.
   */
  public static get context(): WebPartContext {
    if (!SPService._context) {
      throw new Error(
        "SPService not initialized. Call SPService.init(context) first.",
      );
    }
    return SPService._context;
  }

  public static get isInitialized(): boolean {
    return SPService._isInitialized;
  }

  /** Readable reason from a PnPjs error (the SharePoint odata.error text when present). */
  public static errorMessage(err: unknown): string {
    const raw = err instanceof Error ? err.message : String(err || "");
    const sp = /"value"\s*:\s*"((?:[^"\\]|\\.)*)"/.exec(raw);
    return sp ? sp[1] : raw;
  }
}
