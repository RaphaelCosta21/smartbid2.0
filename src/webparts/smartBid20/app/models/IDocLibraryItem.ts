/**
 * IDocLibraryItem — A catalogued document stored in the smartBidDocs library
 * (Datasheets, Manuals & Catalogs). Metadata lives on the library columns.
 */
export type DocCatalogType = "Datasheet" | "Manual" | "Catalog";

export interface IDocLibraryItem {
  /** SharePoint list item Id of the file */
  id: number;
  fileName: string;
  /** Server-relative URL of the file (used for delete/download) */
  fileServerRelativeUrl: string;
  /** Absolute URL of the file (used for opening/preview) */
  fileAbsoluteUrl: string;
  /** SharePoint-generated preview image URL (first page) */
  previewUrl: string;
  /** File extension (pdf, docx, ...) */
  fileType: string;
  /** File size in bytes */
  size: number;
  /** Last modified ISO date */
  modified: string;

  // ─── Catalog metadata (library columns) ───
  title: string;
  docType: DocCatalogType | "";
  category: string;
  manufacturer: string;
  model: string;
  keywords: string;
  description: string;
  revision: string;
}

/** Editable catalog metadata subset */
export interface IDocLibraryMetadata {
  title: string;
  docType: DocCatalogType | "";
  category: string;
  manufacturer: string;
  model: string;
  keywords: string;
  description: string;
  revision: string;
}
