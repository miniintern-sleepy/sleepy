import { cacheLife, cacheTag } from "next/cache";

import { createReadClient } from "@/lib/supabase/server";
import type {
  Faq,
  NewsArticle,
  NewsCategory,
  ProductSpec,
} from "@/types/content";

// 관리 화면(C-01) 전에는 대시보드에서 고쳐도 캐시를 지울 방법이 없어서 한 시간마다 새로 읽는다.
// 관리 Action은 저장 뒤 같은 태그(테이블 이름)로 캐시를 지운다.

/** 공개된 FAQ를 노출 순서대로 가져온다. 없으면 빈 배열. */
export async function getFaqs(): Promise<Faq[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("faqs");

  const { data, error } = await createReadClient()
    .from("faqs")
    .select("id, question, answer")
    .eq("is_published", true)
    .order("sort_order")
    .order("id");
  if (error) throw error;
  return data;
}

/** 공개된 제품 사양을 노출 순서대로 가져온다. */
export async function getProductSpecs(): Promise<ProductSpec[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("product_specs");

  const { data, error } = await createReadClient()
    .from("product_specs")
    .select("id, label, value")
    .eq("is_published", true)
    .order("sort_order")
    .order("id");
  if (error) throw error;
  return data;
}

/**
 * 구매 페이지 주소를 가져온다.
 *
 * @returns 비어 있거나 `https://`로 시작하지 않으면 `null`. 화면은 "출시 예정"을 보여 준다(F-06).
 */
export async function getPurchaseUrl(): Promise<string | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("site_settings");

  const { data, error } = await createReadClient()
    .from("site_settings")
    .select("value")
    .eq("key", "purchase_url")
    .maybeSingle();
  if (error) throw error;
  const url = data?.value;
  return url?.startsWith("https://") ? url : null;
}

/** 공개된 뉴스 기사를 최신순으로 가져온다. 분류를 빼면 전체. */
export async function getNewsList(
  category?: NewsCategory,
): Promise<NewsArticle[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("news_articles");

  let query = createReadClient()
    .from("news_articles")
    .select(newsColumns)
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .order("id", { ascending: false });
  if (category) query = query.eq("category", category);

  const { data, error } = await query;
  if (error) throw error;
  return data.map(toNewsArticle);
}

/**
 * 공개된 기사 하나를 가져온다.
 *
 * @returns 없거나 공개되지 않은 기사면 `null`. 화면은 `notFound()`로 404를 보여 준다(F-12).
 */
export async function getNewsArticle(id: number): Promise<NewsArticle | null> {
  "use cache";
  cacheLife("hours");
  cacheTag("news_articles");

  if (!Number.isSafeInteger(id) || id < 1) return null;

  const { data, error } = await createReadClient()
    .from("news_articles")
    .select(newsColumns)
    .eq("is_published", true)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data && toNewsArticle(data);
}

const newsColumns =
  "id, category, title, summary, source_name, source_url, thumbnail_url, published_at, is_featured";

type NewsRow = {
  id: number;
  category: NewsCategory;
  title: string;
  summary: string | null;
  source_name: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  published_at: string;
  is_featured: boolean;
};

function toNewsArticle(row: NewsRow): NewsArticle {
  return {
    id: row.id,
    category: row.category,
    title: row.title,
    summary: row.summary,
    sourceName: row.source_name,
    sourceUrl: row.source_url,
    thumbnailUrl: row.thumbnail_url,
    publishedAt: row.published_at,
    isFeatured: row.is_featured,
  };
}
