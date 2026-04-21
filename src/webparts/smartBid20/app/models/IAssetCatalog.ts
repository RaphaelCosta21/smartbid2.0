/**
 * IAssetCatalog — Assets Catalog item from SharePoint list.
 */
export interface IAssetCatalogItem {
  id: number;
  title: string;
  keyword: string;
  pn: string;
  description: string;
  commonlyUsedNames: string;
  emailForSupport: string;
  imageUrl: string | null;
  features1: string;
  features2: string;
  features3: string;
  status: string;
  comments: string;
  subtitle: string;
  attachmentUrl: string | null;
  attachmentFileName: string | null;
}
