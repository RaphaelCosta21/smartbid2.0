/**
 * QueryCatalogService — Fetches and parses the Queries.xlsx Excel file
 * from SharePoint, extracting equipment/cost catalog data from multiple tabs.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  IQueryCatalogData,
  IActiveRegisteredItem,
  IPeopleSoftFinancialsItem,
  IBomSheetItem,
  IRawTabData,
} from "../models";

export class QueryCatalogService {
  /**
   * Fetch and parse the Queries.xlsx from SharePoint.
   * Extracts 4 tabs: Active Registered, Peoplesoft Financials, BUMBL, BUMBR.
   * Only parses needed columns to minimize memory footprint.
   */
  public static async loadCatalog(): Promise<IQueryCatalogData> {
    const XLSX = await import("xlsx");

    // Fetch Excel file as ArrayBuffer from SharePoint
    const arrayBuffer: ArrayBuffer = await SPService.sp.web
      .getFileByServerRelativePath(SHAREPOINT_CONFIG.queriesExcelPath)
      .getBuffer();

    const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

    const activeRegistered = QueryCatalogService.parseActiveRegistered(
      workbook,
      XLSX,
    );
    const peopleSoftFinancials = QueryCatalogService.parsePeopleSoftFinancials(
      workbook,
      XLSX,
    );
    const bumbl = QueryCatalogService.parseBomSheet(
      workbook,
      XLSX,
      "Peoplesoft Brazil - BUMBL",
    );
    const bumbr = QueryCatalogService.parseBomSheet(
      workbook,
      XLSX,
      "Peoplesoft Brazil - BUMBR",
    );

    // Parse raw tab data for Query Consulting page (all columns)
    const rawFinancials = QueryCatalogService.parseRawSheet(
      workbook,
      XLSX,
      "Peoplesoft Financials",
    );
    const rawBrazilBumbl = QueryCatalogService.parseRawSheet(
      workbook,
      XLSX,
      "Peoplesoft Brazil - BUMBL",
    );
    const rawBrazilBumbr = QueryCatalogService.parseRawSheet(
      workbook,
      XLSX,
      "Peoplesoft Brazil - BUMBR",
    );
    const rawActiveRegistered = QueryCatalogService.parseRawSheet(
      workbook,
      XLSX,
      "Active Registered - Brazil",
    );
    const rawCurrency = QueryCatalogService.parseRawSheet(
      workbook,
      XLSX,
      "Currency",
    );

    return {
      activeRegistered,
      peopleSoftFinancials,
      bumbl,
      bumbr,
      lastLoaded: new Date().toISOString(),
      rawFinancials,
      rawBrazilBumbl,
      rawBrazilBumbr,
      rawActiveRegistered,
      rawCurrency,
    };
  }

  /**
   * Parse "Active Registered - Brazil" tab — columns: Item, Long Descr.
   * Sheet has a title in row 0 and real headers in row 1, so range:1 is required.
   */
  private static parseActiveRegistered(
    workbook: any,
    XLSX: any,
  ): IActiveRegisteredItem[] {
    const sheetName = "Active Registered - Brazil";
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      range: 1,
      defval: "",
    });
    const result: IActiveRegisteredItem[] = [];

    rows.forEach((row: any) => {
      const item = String(row["Item"] || "").trim();
      const longDescr = String(row["Long Descr"] || "").trim();
      const bu = String(row["Business Unit"] || row["Unit"] || "").trim();
      const mfgId = String(row["Mfg ID"] || "").trim();
      const mfgItmId = String(row["Mfg Itm ID"] || "").trim();
      if (item) {
        result.push({ item, longDescr, businessUnit: bu, mfgId, mfgItmId });
      }
    });

    return result;
  }

  /**
   * Parse "Peoplesoft Financials" tab — 8 columns.
   * Sheet has a title row in row 0 and real headers in row 1, so range:1 is required.
   */
  private static parsePeopleSoftFinancials(
    workbook: any,
    XLSX: any,
  ): IPeopleSoftFinancialsItem[] {
    const sheetName = "Peoplesoft Financials";
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];

    const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
      range: 1,
      defval: "",
    });
    const result: IPeopleSoftFinancialsItem[] = [];

    rows.forEach((row: any) => {
      const pn = String(row["PN"] || row["Item"] || "").trim();
      if (!pn) return;

      result.push({
        businessUnit: String(row["Business Unit"] || row["Unit"] || "").trim(),
        pn,
        description: String(
          row["Descripton"] || row["Description"] || row["Descript"] || "",
        ).trim(),
        lastOrderDate: QueryCatalogService.toISODate(row["Last Order Date"]),
        originalPrice: QueryCatalogService.toNumber(
          row["Original Currency Price"],
        ),
        currency: String(row["Currency"] || "USD")
          .trim()
          .toUpperCase(),
        leadTimeDays: QueryCatalogService.toNumber(row["Lead Time"]),
        brlPrice: QueryCatalogService.toNumber(row["BRL Currency"]),
      });
    });

    return result;
  }

  /**
   * Parse a BOM sheet (BUMBL or BUMBR) using positional column access.
   * Columns: 1=Unit, 2=Item, 3=Descript, 26=PO Date, 27=PO Due, 28=Last Price Paid
   */
  private static parseBomSheet(
    workbook: any,
    XLSX: any,
    sheetName: string,
  ): IBomSheetItem[] {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];

    // Use header:1 for positional (array) access — row[0] = col1, row[1] = col2, etc.
    const rows: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

    const result: IBomSheetItem[] = [];
    // Skip title row (index 0) AND header row (index 1) — data starts at row 2
    for (let i = 2; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length < 3) continue;

      const partNumber = String(row[1] || "").trim(); // column 2 (0-indexed: 1)
      if (!partNumber) continue;

      const poDateRaw = row[25]; // column 26 (0-indexed: 25)
      const poDueRaw = row[26]; // column 27 (0-indexed: 26)
      const lastPricePaid = QueryCatalogService.toNumber(row[27]); // column 28 (0-indexed: 27)

      const poDateStr = QueryCatalogService.toISODate(poDateRaw);
      const leadTimeDays = QueryCatalogService.dateDiffDays(
        poDateRaw,
        poDueRaw,
      );

      result.push({
        businessUnit: String(row[0] || "").trim(), // column 1
        partNumber,
        description: String(row[2] || "").trim(), // column 3
        dataReference: poDateStr,
        costPerItem: lastPricePaid,
        leadTimeDays,
      });
    }

    return result;
  }

  /** Safely convert a value to number, returns 0 on failure */
  private static toNumber(val: any): number {
    if (val === null || val === undefined || val === "") return 0;
    const n = Number(val);
    return isNaN(n) ? 0 : n;
  }

  /** Convert an Excel date value to ISO date string */
  private static toISODate(val: any): string {
    if (!val) return "";
    if (val instanceof Date) return val.toISOString();
    if (typeof val === "number") {
      // Excel serial date number
      const d = new Date((val - 25569) * 86400000);
      return isNaN(d.getTime()) ? "" : d.toISOString();
    }
    const d = new Date(val);
    return isNaN(d.getTime()) ? String(val) : d.toISOString();
  }

  /** Calculate difference in days between two dates */
  private static dateDiffDays(startVal: any, endVal: any): number {
    const toMs = (v: any): number => {
      if (!v) return 0;
      if (v instanceof Date) return v.getTime();
      if (typeof v === "number") return (v - 25569) * 86400000;
      const d = new Date(v);
      return isNaN(d.getTime()) ? 0 : d.getTime();
    };
    const startMs = toMs(startVal);
    const endMs = toMs(endVal);
    if (!startMs || !endMs) return 0;
    return Math.max(0, Math.round((endMs - startMs) / 86400000));
  }

  /**
   * Parse any sheet into raw { headers, rows } format.
   * Skips title row (index 0), uses row 1 as headers, data from row 2 onward.
   */
  private static parseRawSheet(
    workbook: any,
    XLSX: any,
    sheetName: string,
  ): IRawTabData {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return { headers: [], rows: [] };

    const rawData: any[][] = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });
    if (rawData.length < 2) return { headers: [], rows: [] };

    const headers: string[] = (rawData[1] as any[]).map((h: any) =>
      String(h || "").trim(),
    );
    const rows: Record<string, any>[] = [];
    for (let i = 2; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row) continue;
      const obj: Record<string, any> = {};
      headers.forEach((header: string, idx: number) => {
        obj[header] = row[idx] !== undefined ? row[idx] : "";
      });
      rows.push(obj);
    }
    return { headers, rows };
  }
}
