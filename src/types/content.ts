export type Faq = {
  id: number;
  question: string;
  answer: string;
};

export type ProductSpec = {
  id: number;
  label: string;
  value: string;
};

export const newsCategories = ["company", "press", "notice"] as const;

export type NewsCategory = (typeof newsCategories)[number];

export type NewsArticle = {
  id: number;
  category: NewsCategory;
  title: string;
  summary: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  thumbnailUrl: string | null;
  /** YYYY-MM-DD */
  publishedAt: string;
  isFeatured: boolean;
};
