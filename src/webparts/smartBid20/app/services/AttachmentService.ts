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
}
