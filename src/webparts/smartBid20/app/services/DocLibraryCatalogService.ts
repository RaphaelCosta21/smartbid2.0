/**
 * DocLibraryCatalogService — Reads/writes catalogued documents in the
 * `smartBidDocs` library (Datasheets, Manuals & Catalogs). Catalog metadata is
 * stored as columns on the library and auto-provisioned if missing.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import "@pnp/sp/fields";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import {
  IDocLibraryItem,
  IDocLibraryMetadata,
  DocCatalogType,
} from "../models/IDocLibraryItem";

const LIB = SHAREPOINT_CONFIG.docLibrary.name;
const F = SHAREPOINT_CONFIG.docCatalogFields;

export class DocLibraryCatalogService {
  private static get _list() {
    return SPService.sp.web.lists.getByTitle(LIB);
  }

  private static _origin(): string {
    return SHAREPOINT_CONFIG.siteUrl.replace(/\/sites\/.*$/, "");
  }

  /** Build the SharePoint native first-page preview URL for a file */
  public static buildPreviewUrl(fileAbsoluteUrl: string): string {
    return `${SHAREPOINT_CONFIG.siteUrl}/_layouts/15/getpreview.ashx?path=${encodeURIComponent(
      fileAbsoluteUrl,
    )}`;
  }

  /**
   * Ensure the catalog columns exist on the library. Idempotent — each add is
   * wrapped so an existing column does not throw.
   */
  public static async ensureColumns(): Promise<void> {
    let existing: string[] = [];
    const listApi = DocLibraryCatalogService._list as any;
    try {
      const fields = await listApi.fields.select("InternalName")();
      existing = (fields as { InternalName: string }[]).map(
        (f) => f.InternalName,
      );
    } catch (err) {
      console.warn(
        "DocLibraryCatalogService.ensureColumns: cannot read fields",
        err,
      );
      return;
    }
    const has = (name: string): boolean => existing.indexOf(name) >= 0;
    const fieldsApi = listApi.fields;

    const addText = async (name: string): Promise<void> => {
      if (has(name)) return;
      try {
        await fieldsApi.addText(name);
      } catch (e) {
        /* ignore — may already exist */
      }
    };

    if (!has(F.docType)) {
      try {
        await fieldsApi.addChoice(F.docType, {
          Choices: ["Datasheet", "Manual", "Catalog"],
        });
      } catch (e) {
        /* ignore */
      }
    }
    await addText(F.category);
    await addText(F.manufacturer);
    await addText(F.model);
    await addText(F.keywords);
    await addText(F.revision);
    if (!has(F.description)) {
      try {
        await fieldsApi.addMultilineText(F.description);
      } catch (e) {
        /* ignore */
      }
    }
  }

  /** List all catalogued files inside a folder (server-relative URL) */
  public static async getItems(
    folderServerRelativeUrl: string,
  ): Promise<IDocLibraryItem[]> {
    // Scope the query to the folder's Files collection. Filtering the whole
    // library by FileDirRef hits the 5000-item list view threshold when the
    // library is large; enumerating a single folder's files does not.
    // ListItemAllFields is expanded without selecting specific catalog columns
    // so the query still works before the columns have been provisioned.
    const files: any[] = await (
      SPService.sp.web.getFolderByServerRelativePath(folderServerRelativeUrl)
        .files as any
    )
      .expand("ListItemAllFields")
      .top(5000)();

    const origin = DocLibraryCatalogService._origin();
    const results: IDocLibraryItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const laf = f.ListItemAllFields || {};
      const serverRelativeUrl: string = f.ServerRelativeUrl;
      const fileName: string = f.Name || "";
      const absoluteUrl = origin + serverRelativeUrl;
      const dotIdx = fileName.lastIndexOf(".");
      const ext =
        dotIdx >= 0 ? fileName.substring(dotIdx + 1).toLowerCase() : "";
      results.push({
        id: laf.Id || 0,
        fileName,
        fileServerRelativeUrl: serverRelativeUrl,
        fileAbsoluteUrl: absoluteUrl,
        previewUrl: DocLibraryCatalogService.buildPreviewUrl(absoluteUrl),
        fileType: ext,
        size: f.Length ? parseInt(f.Length, 10) : 0,
        modified: f.TimeLastModified,
        title: laf.Title || fileName,
        docType: (laf[F.docType] || "") as DocCatalogType | "",
        category: laf[F.category] || "",
        manufacturer: laf[F.manufacturer] || "",
        model: laf[F.model] || "",
        keywords: laf[F.keywords] || "",
        description: laf[F.description] || "",
        revision: laf[F.revision] || "",
      });
    }
    return results;
  }

  private static _mapMetadata(
    metadata: IDocLibraryMetadata,
  ): Record<string, unknown> {
    return {
      Title: metadata.title,
      [F.docType]: metadata.docType || null,
      [F.category]: metadata.category,
      [F.manufacturer]: metadata.manufacturer,
      [F.model]: metadata.model,
      [F.keywords]: metadata.keywords,
      [F.description]: metadata.description,
      [F.revision]: metadata.revision,
    };
  }

  /** Update catalog metadata for an existing item */
  public static async updateMetadata(
    itemId: number,
    metadata: IDocLibraryMetadata,
  ): Promise<void> {
    await DocLibraryCatalogService._list.items
      .getById(itemId)
      .update(DocLibraryCatalogService._mapMetadata(metadata));
  }

  /** Upload a new file to a folder and set its catalog metadata */
  public static async uploadFile(
    folderServerRelativeUrl: string,
    file: File,
    metadata: IDocLibraryMetadata,
    overwrite = false,
  ): Promise<void> {
    const result = await SPService.sp.web
      .getFolderByServerRelativePath(folderServerRelativeUrl)
      .files.addUsingPath(file.name, file, { Overwrite: overwrite });
    const serverRelativeUrl = (result.data as { ServerRelativeUrl: string })
      .ServerRelativeUrl;
    const laf = await (
      SPService.sp.web.getFileByServerRelativePath(serverRelativeUrl) as any
    ).listItemAllFields.select("Id")();
    const itemId = (laf as { Id: number }).Id;
    await DocLibraryCatalogService._list.items
      .getById(itemId)
      .update(DocLibraryCatalogService._mapMetadata(metadata));
  }

  /** Delete a file by its server-relative URL */
  public static async deleteFile(fileServerRelativeUrl: string): Promise<void> {
    await SPService.sp.web
      .getFileByServerRelativePath(fileServerRelativeUrl)
      .delete();
  }
}
