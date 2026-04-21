/**
 * AssetCatalogService — Fetches assets from the Assets Catalog_ SharePoint list.
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IAssetCatalogItem } from "../models/IAssetCatalog";

export class AssetCatalogService {
  public static async getAll(): Promise<IAssetCatalogItem[]> {
    const items: any[] = await SPService.sp.web.lists
      .getByTitle(SHAREPOINT_CONFIG.lists.assetsCatalog)
      .items.select(
        "Id",
        "Title",
        "field_0",
        "field_3",
        "field_4",
        "field_5",
        "field_6",
        "Features",
        "Features2",
        "Features3",
        "Status",
        "Comments",
        "Subtitle",
        "Attachments",
        "AttachmentFiles",
      )
      .expand("AttachmentFiles")
      .top(5000)();

    const origin = SHAREPOINT_CONFIG.siteUrl.replace(/\/sites\/.*$/, "");
    const results: IAssetCatalogItem[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const mapped = AssetCatalogService.mapFromSP(item);

      // AttachmentFiles is expanded inline — no extra API calls needed
      const files = item.AttachmentFiles || [];
      for (let j = 0; j < files.length; j++) {
        const att = files[j];
        const fullUrl = origin + att.ServerRelativeUrl;
        if (att.FileName.indexOf("Reserved_ImageAttachment") === 0) {
          // Thumbnail column image (PNG)
          mapped.imageUrl = fullUrl;
        } else {
          // User-uploaded file (PDF datasheet)
          mapped.attachmentUrl = fullUrl;
          mapped.attachmentFileName = att.FileName;
        }
      }
      results.push(mapped);
    }

    return results;
  }

  private static mapFromSP(item: any): IAssetCatalogItem {
    return {
      id: item.Id,
      title: item.Title || "",
      keyword: item.field_0 || "",
      pn: item.field_3 || "",
      description: item.field_4 || "",
      commonlyUsedNames: item.field_5 || "",
      emailForSupport: item.field_6 || "",
      imageUrl: null,
      features1: item.Features || "",
      features2: item.Features2 || "",
      features3: item.Features3 || "",
      status: item.Status || "",
      comments: item.Comments || "",
      subtitle: item.Subtitle || "",
      attachmentUrl: null,
      attachmentFileName: null,
    };
  }
}
