import "server-only";

import { requireAdmin } from "./auth";

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
};
export type SpecItem = {
  id: number;
  label: string;
  value: string;
  sortOrder: number;
  isPublished: boolean;
};
export type NewsItem = {
  id: number;
  category: string;
  title: string;
  summary: string | null;
  sourceName: string | null;
  sourceUrl: string | null;
  thumbnailUrl: string | null;
  publishedAt: string;
  isFeatured: boolean;
  isPublished: boolean;
};

type Failure = {
  ok: false;
  reason: "unauthenticated" | "forbidden" | "server";
};
type Result<T> = { ok: true; data: T } | Failure;
type FaqRow = {
  id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_published: boolean;
};
type SpecRow = {
  id: number;
  label: string;
  value: string;
  sort_order: number;
  is_published: boolean;
};
type NewsRow = {
  id: number;
  category: string;
  title: string;
  summary: string | null;
  source_name: string | null;
  source_url: string | null;
  thumbnail_url: string | null;
  published_at: string;
  is_featured: boolean;
  is_published: boolean;
};

/** 관리자에게만 비공개 FAQ를 포함한 전체 목록을 노출 순서로 반환한다. */
export async function readAdminFaqs(): Promise<Result<FaqItem[]>> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  try {
    const { data, error } = await access.client
      .from("faqs")
      .select("id, question, answer, sort_order, is_published")
      .order("sort_order")
      .order("id")
      .returns<FaqRow[]>();
    if (error || !data) return { ok: false, reason: "server" };
    return {
      ok: true,
      data: data.map((row) => ({
        id: row.id,
        question: row.question,
        answer: row.answer,
        sortOrder: row.sort_order,
        isPublished: row.is_published,
      })),
    };
  } catch {
    return { ok: false, reason: "server" };
  }
}

/** 비공개 사양과 구매 주소를 관리자 세션으로 읽는다. */
export async function readAdminProduct(): Promise<
  Result<{ specs: SpecItem[]; purchaseUrl: string | null }>
> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  try {
    const [specs, settings] = await Promise.all([
      access.client
        .from("product_specs")
        .select("id, label, value, sort_order, is_published")
        .order("sort_order")
        .order("id")
        .returns<SpecRow[]>(),
      access.client
        .from("site_settings")
        .select("value")
        .eq("key", "purchase_url")
        .maybeSingle(),
    ]);
    if (specs.error || !specs.data || settings.error)
      return { ok: false, reason: "server" };
    return {
      ok: true,
      data: {
        specs: specs.data.map((row) => ({
          id: row.id,
          label: row.label,
          value: row.value,
          sortOrder: row.sort_order,
          isPublished: row.is_published,
        })),
        purchaseUrl: settings.data?.value ?? null,
      },
    };
  } catch {
    return { ok: false, reason: "server" };
  }
}

/** 예시 기사를 섞지 않고 DB의 공개·비공개 기사 전체를 최신순으로 읽는다. */
export async function readAdminNews(): Promise<Result<NewsItem[]>> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  try {
    const { data, error } = await access.client
      .from("news_articles")
      .select(
        "id, category, title, summary, source_name, source_url, thumbnail_url, published_at, is_featured, is_published",
      )
      .order("published_at", { ascending: false })
      .order("id", { ascending: false })
      .returns<NewsRow[]>();
    if (error || !data) return { ok: false, reason: "server" };
    return {
      ok: true,
      data: data.map((row) => ({
        id: row.id,
        category: row.category,
        title: row.title,
        summary: row.summary,
        sourceName: row.source_name,
        sourceUrl: row.source_url,
        thumbnailUrl: row.thumbnail_url,
        publishedAt: row.published_at,
        isFeatured: row.is_featured,
        isPublished: row.is_published,
      })),
    };
  } catch {
    return { ok: false, reason: "server" };
  }
}
