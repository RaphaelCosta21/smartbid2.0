/**
 * IDocLibraryItem — A catalogued document stored in the smartBidDocs library
 * (Datasheets, Manuals & Catalogs, Technical Proposals). Metadata lives on the
 * library columns.
 */
export type DocCatalogType =
  | "Datasheet"
  | "Manual"
  | "Catalog"
  | "Technical Proposal";

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
  /** IFavoriteGroup id (same Group/SubGroup taxonomy as Quotations/Favorites) */
  groupId: string;
  /** IFavoriteSubGroup id, scoped to groupId */
  subGroupId: string;
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
  groupId: string;
  subGroupId: string;
  /** "Group / SubGroup" names, mirrored from the ids so AI Search can index them. */
  category?: string;
  manufacturer: string;
  model: string;
  keywords: string;
  description: string;
  revision: string;
}
