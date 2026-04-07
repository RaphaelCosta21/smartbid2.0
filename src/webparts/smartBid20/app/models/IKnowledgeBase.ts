/**
 * IKnowledgeBase — Knowledge base items.
 */
export type KBCategory =
  | "datasheets"
  | "past-bids"
  | "manuals"
  | "lessons-learned"
  | "templates"
  | "procedures";

export interface IKnowledgeBaseItem {
  id: string;
  title: string;
  description: string;
  category: KBCategory;
  tags: string[];
  fileUrl: string | null;
  fileName: string | null;
  fileType: string | null;
  fileSize: number | null;
  content: string;
  createdBy: string;
  createdDate: string;
  lastModified: string;
  lastModifiedBy: string;
  viewCount: number;
  isPublished: boolean;
  relatedBidNumbers: string[];
}
