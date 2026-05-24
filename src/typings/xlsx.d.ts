declare module "xlsx" {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  export interface WorkSheet {
    [key: string]: unknown;
    "!ref"?: string;
    "!cols"?: Array<{ wch?: number; wpx?: number }>;
    "!rows"?: Array<{ hpt?: number; hpx?: number }>;
    "!merges"?: Array<{
      s: { r: number; c: number };
      e: { r: number; c: number };
    }>;
  }
  export interface CellObject {
    t?: string;
    v?: unknown;
    s?: unknown;
  }
  export const utils: {
    book_new(): WorkBook;
    json_to_sheet(data: unknown[], opts?: Record<string, unknown>): WorkSheet;
    aoa_to_sheet(data: unknown[][], opts?: Record<string, unknown>): WorkSheet;
    book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
    sheet_to_json(ws: WorkSheet, opts?: Record<string, unknown>): any[];
    encode_cell(cell: { r: number; c: number }): string;
    encode_range(range: {
      s: { r: number; c: number };
      e: { r: number; c: number };
    }): string;
  };
  export function read(
    data: ArrayBuffer | Uint8Array | string,
    opts?: Record<string, unknown>,
  ): WorkBook;
  export function writeFile(wb: WorkBook, filename: string): void;
  export function write(wb: WorkBook, opts?: Record<string, unknown>): any;
}
