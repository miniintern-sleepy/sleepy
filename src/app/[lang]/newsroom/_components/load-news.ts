import "server-only";

import { getNewsList } from "@/lib/content";

import { withRenewalNotice } from "./announcement";
import { previewArticles } from "./preview-articles";

export async function loadNewsroom() {
  const articles = await getNewsList();
  const isPreview = articles.length === 0;
  return {
    articles: withRenewalNotice(isPreview ? previewArticles : articles),
    isPreview,
  };
}
