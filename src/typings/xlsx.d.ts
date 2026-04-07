declare module "xlsx" {
  export interface WorkBook {
    SheetNames: string[];
    Sheets: Record<string, WorkSheet>;
  }
  export interface WorkSheet {
    [key: string]: unknown;
  }
  export const utils: {
    book_new(): WorkBook;
    json_to_sheet(data: unknown[]): WorkSheet;
    book_append_sheet(wb: WorkBook, ws: WorkSheet, name: string): void;
  };
  export function writeFile(wb: WorkBook, filename: string): void;
}
