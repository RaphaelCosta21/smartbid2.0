/**
 * AttachmentService — Upload/download arquivos (padrão SmartFlow).
 * Static singleton pattern.
 */
import { SPService } from "./SPService";
import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";
import { IBidAttachment } from "../models/IBid";

export class AttachmentService {
  public static async uploadFile(
    bidNumber: string,
    category: string,
    file: File,
  ): Promise<IBidAttachment> {
    const folderPath = `${SHAREPOINT_CONFIG.libraries.attachments}/${bidNumber}/${category}`;

    // Ensure folder exists
    await SPService.sp.web
      .getFolderByServerRelativePath(folderPath)
      .addSubFolderUsingPath(category)
      .catch(() => {
        // Folder may already exist
      });

    const result = await SPService.sp.web
      .getFolderByServerRelativePath(folderPath)
      .files.addUsingPath(file.name, file, { Overwrite: true });

    return {
      id: crypto.randomUUID(),
      fileName: file.name,
      fileUrl: (result.data as { ServerRelativeUrl: string }).ServerRelativeUrl,
      fileSize: file.size,
      fileType: file.type,
      uploadedBy: "",
      uploadedDate: new Date().toISOString(),
      category,
    };
  }

  public static async deleteFile(fileUrl: string): Promise<void> {
    await SPService.sp.web.getFileByServerRelativePath(fileUrl).delete();
  }

  public static async getFilesInFolder(
    bidNumber: string,
    category: string,
  ): Promise<IBidAttachment[]> {
    const folderPath = `${SHAREPOINT_CONFIG.libraries.attachments}/${bidNumber}/${category}`;
    const files = await SPService.sp.web
      .getFolderByServerRelativePath(folderPath)
      .files.select("Name", "ServerRelativeUrl", "Length", "TimeCreated")();

    return files.map(
      (f: {
        Name: string;
        ServerRelativeUrl: string;
        Length: string;
        TimeCreated: string;
      }) => ({
        id: crypto.randomUUID(),
        fileName: f.Name,
        fileUrl: f.ServerRelativeUrl,
        fileSize: parseInt(f.Length, 10),
        fileType: f.Name.split(".").pop() || "",
        uploadedBy: "",
        uploadedDate: f.TimeCreated,
        category,
      }),
    );
  }

  /**
   * Upload request files into a folder named by SP item ID, CRM number, and creator.
   * Folder pattern: {spItemId}-{crm}-{createdByName}
   */
  public static async uploadRequestFiles(
    spItemId: number,
    crmNumber: string,
    createdByName: string,
    files: File[],
  ): Promise<IBidAttachment[]> {
    const safeCrm = (crmNumber || "no-crm").replace(/[\\/:*?"<>|]/g, "_");
    const safeName = createdByName.replace(/[\\/:*?"<>|]/g, "_");
    const folderName = `${spItemId}-${safeCrm}-${safeName}`;
    const libraryPath = SHAREPOINT_CONFIG.libraries.attachments;

    // Ensure folder exists
    await SPService.sp.web
      .getFolderByServerRelativePath(libraryPath)
      .addSubFolderUsingPath(folderName)
      .catch(() => {
        // Folder may already exist
      });

    const folderPath = `${libraryPath}/${folderName}`;
    const results: IBidAttachment[] = [];

    for (const file of files) {
      const result = await SPService.sp.web
        .getFolderByServerRelativePath(folderPath)
        .files.addUsingPath(file.name, file, { Overwrite: true });

      results.push({
        id: crypto.randomUUID(),
        fileName: file.name,
        fileUrl: (result.data as { ServerRelativeUrl: string })
          .ServerRelativeUrl,
        fileSize: file.size,
        fileType: file.type,
        uploadedBy: createdByName,
        uploadedDate: new Date().toISOString(),
        category: "request",
      });
    }

    return results;
  }
}
