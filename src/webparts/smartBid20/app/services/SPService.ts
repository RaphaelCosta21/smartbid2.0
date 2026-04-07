/**
 * SPService — Base PnPjs v3 wrapper, init com context.
 * Static singleton pattern (padrão SmartFlow).
 */
import { SPFI } from "@pnp/sp";

export class SPService {
  private static _sp: SPFI | null = null;
  private static _isInitialized = false;

  public static init(sp: SPFI): void {
    SPService._sp = sp;
    SPService._isInitialized = true;
  }

  public static get sp(): SPFI {
    if (!SPService._sp) {
      throw new Error(
        "SPService not initialized. Call SPService.init(sp) first.",
      );
    }
    return SPService._sp;
  }

  public static get isInitialized(): boolean {
    return SPService._isInitialized;
  }
}
