import "server-only";

import { requireAdmin } from "./auth";
import { readNewInquiryCount } from "../inquiries/_lib/queries";

export type DashboardResult<T> = { ok: true; data: T } | { ok: false };
export type DashboardInquiry = {
  id: string;
  name: string;
  type: "product" | "general";
  message: string;
  created_at: string;
  reply_status: "sending" | "failed" | "sent" | null;
};
export type DashboardData = {
  newInquiries: DashboardResult<number>;
  failedReplies: DashboardResult<number>;
  publishedFaqs: DashboardResult<number>;
  publishedNews: DashboardResult<number>;
  inquiries: DashboardResult<DashboardInquiry[]>;
  purchaseUrl: DashboardResult<string | null>;
};

async function countResult(
  query: () => PromiseLike<{ count: number | null; error: unknown }>,
): Promise<DashboardResult<number>> {
  try {
    const result = await query();
    return result.error || result.count === null
      ? { ok: false }
      : { ok: true, data: result.count };
  } catch {
    return { ok: false };
  }
}

async function dataResult<T>(
  query: () => PromiseLike<{ data: T | null; error: unknown }>,
): Promise<DashboardResult<T | null>> {
  try {
    const result = await query();
    return result.error ? { ok: false } : { ok: true, data: result.data };
  } catch {
    return { ok: false };
  }
}

/** 각 집계와 목록을 동시에 읽고 실패한 영역만 실패로 반환한다. */
export async function readAdminDashboard() {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const { client } = access;
  const columns = "id, name, type, message, created_at, reply_status";
  const recent = () =>
    client.from("inquiries").select(columns).eq("status", "new");
  // 상태 문자열 정렬은 실패 이외 문의의 최신순을 깨뜨리므로 상한이 있는 두 결과를 합친다(#57)
  const [
    newInquiries,
    failedReplies,
    publishedFaqs,
    publishedNews,
    failed,
    other,
    settings,
  ] = await Promise.all([
    readNewInquiryCount(),
    countResult(() =>
      client
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("status", "new")
        .eq("reply_status", "failed"),
    ),
    countResult(() =>
      client
        .from("faqs")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
    ),
    countResult(() =>
      client
        .from("news_articles")
        .select("id", { count: "exact", head: true })
        .eq("is_published", true),
    ),
    dataResult(() =>
      recent()
        .eq("reply_status", "failed")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(5)
        .returns<DashboardInquiry[]>(),
    ),
    dataResult(() =>
      recent()
        .or("reply_status.is.null,reply_status.neq.failed")
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(5)
        .returns<DashboardInquiry[]>(),
    ),
    dataResult(() =>
      client
        .from("site_settings")
        .select("value")
        .eq("key", "purchase_url")
        .maybeSingle<{ value: string | null }>(),
    ),
  ]);
  const inquiries: DashboardResult<DashboardInquiry[]> =
    failed.ok && failed.data && other.ok && other.data
      ? { ok: true, data: [...failed.data, ...other.data].slice(0, 5) }
      : { ok: false };
  const purchaseUrl: DashboardResult<string | null> = settings.ok
    ? {
        ok: true,
        data: settings.data?.value?.startsWith("https://")
          ? settings.data.value
          : null,
      }
    : { ok: false };
  const data: DashboardData = {
    newInquiries,
    failedReplies,
    publishedFaqs,
    publishedNews,
    inquiries,
    purchaseUrl,
  };
  return { ok: true as const, data };
}
