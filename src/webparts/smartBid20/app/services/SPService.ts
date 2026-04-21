/**
 * SPService — Base PnPjs v3 wrapper, init com context.
 * Static singleton pattern (padrão SmartFlow).
 */
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/folders";
import "@pnp/sp/files";
import "@pnp/sp/attachments";
import "@pnp/sp/site-users/web";

export class SPService {
  private static _sp: SPFI | null = null;
  private static _isInitialized = false;

  public static init(context: any): void {
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

  public static get isInitialized(): boolean {
    return SPService._isInitialized;
  }
}
