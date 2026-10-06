import { SHAREPOINT_CONFIG } from "../config/sharepoint.config";

/** Photo URL of a part number in the SharePoint photos library ("" when there is no PN) */
export function getPartPhotoUrl(partNumber: string): string {
  const pn = (partNumber || "").trim();
  if (!pn) return "";
  return `${SHAREPOINT_CONFIG.siteUrl}${SHAREPOINT_CONFIG.photosBaseUrl}/${pn}.jpg`;
}
