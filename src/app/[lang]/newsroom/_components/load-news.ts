import "server-only";

import { getNewsList } from "@/lib/content";

import { previewArticles } from "./preview-articles";

export async function loadNewsroom() {
  const articles = await getNewsList();
  const isPreview = articles.length === 0;
  return { articles: isPreview ? previewArticles : articles, isPreview };
}
