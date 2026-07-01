/**
 * Links & Recommendations — important links and notes/recommendations for the
 * BID sector. Persisted as a JSON blob in the smartbid-config list.
 */
export interface IBidLink {
  id: string;
  title: string;
  url: string;
  description: string;
  category?: string;
  createdBy: string;
  createdDate: string;
}

export interface IBidRecommendation {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdDate: string;
  lastModified?: string;
}

export interface ILinksRecommendationsData {
  links: IBidLink[];
  recommendations: IBidRecommendation[];
}
