/**
 * Shared ExcelJS runtime for the SmartBid workbooks (lazy library chunk, OII logo, download helpers).
 */
import type * as ExcelJSTypes from "exceljs";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const logoUrl: string = require("../../../assets/OII-white.png");
export const LOGO_ASPECT = 2358 / 690;

export const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

export async function loadExcelJS(): Promise<typeof ExcelJSTypes> {
  // The package's "browser" field resolves this to the prebuilt dist bundle (own chunk, lazy)
  const mod = await import(/* webpackChunkName: 'exceljs' */ "exceljs");
  const m = mod as unknown as {
    Workbook?: unknown;
    default?: typeof ExcelJSTypes;
  };
  return (m.Workbook ? mod : m.default) as typeof ExcelJSTypes;
}

export async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(logoUrl);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string | null>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    // The logo is decorative — export without it
    return null;
  }
}

/** Strips characters Windows does not allow in file names. */
export function sanitizeFilePart(val: string): string {
  return val
    .replace(/[\\/:*?"<>|\r\n\t]+/g, "-")
    .replace(/\s+/g, " ")
    .trim();
}
