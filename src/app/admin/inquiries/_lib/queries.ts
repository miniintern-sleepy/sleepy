import "server-only";

import { cache } from "react";
import { requireAdmin } from "../../_lib/auth";

export type InquiryRow = {
  id: string;
  name: string;
  email: string;
  type: "product" | "general";
  message: string;
  created_at: string;
  status: "new" | "answered";
  answered_at: string | null;
  reply_body: string | null;
  reply_status: "sending" | "failed" | "sent" | null;
  reply_attempt: number;
  reply_email_id: string | null;
};
export type InquiryItem = {
  id: string;
  name: string;
  email: string;
  type: "product" | "general";
  message: string;
  createdAt: string;
  status: "new" | "answered";
  answeredAt: string | null;
  replyBody: string | null;
  replyStatus: "sending" | "failed" | "sent" | null;
  replyAttempt: number;
  replyEmailId: string | null;
};
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "server" };
export const inquiryColumns =
  "id, name, email, type, message, created_at, status, answered_at, reply_body, reply_status, reply_attempt, reply_email_id";
export const inquiryPageSize = 20;

/** UUID 이외의 경로·폼 입력은 DB 쿼리에 사용하지 않는다. */
export function isInquiryId(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

function item(row: InquiryRow): InquiryItem {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    type: row.type,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
    answeredAt: row.answered_at,
    replyBody: row.reply_body,
    replyStatus: row.reply_status,
    replyAttempt: row.reply_attempt,
    replyEmailId: row.reply_email_id,
  };
}

/** 새 문의 개수는 관리자 세션에서 읽고 요청 간 캐시하지 않는다. */
export const readNewInquiryCount = cache(async (): Promise<Result<number>> => {
  const access = await requireAdmin();
  if (!access.ok) return access;
  try {
    const { count, error } = await access.client
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new");
    if (error || count === null) return { ok: false, reason: "server" };
    return { ok: true, data: count };
  } catch {
    return { ok: false, reason: "server" };
  }
});

/** 문의를 상태별 최신순으로 20건씩 읽는다. 개인정보는 공개 콘텐츠 캐시에 넣지 않는다. */
export async function readInquiries(
  status: "new" | "answered",
  page: number,
): Promise<Result<{ items: InquiryItem[]; total: number }>> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  if (
    !["new", "answered"].includes(status) ||
    !Number.isSafeInteger(page) ||
    page < 1 ||
    page > 100000
  )
    return { ok: false, reason: "server" };
  try {
    const { data, count, error } = await access.client
      .from("inquiries")
      .select(inquiryColumns, { count: "exact" })
      .eq("status", status)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range((page - 1) * inquiryPageSize, page * inquiryPageSize - 1)
      .returns<InquiryRow[]>();
    if (error || !data || count === null)
      return { ok: false, reason: "server" };
    return { ok: true, data: { items: data.map(item), total: count } };
  } catch {
    return { ok: false, reason: "server" };
  }
}

/** 상세와 답변 원문은 권한 확인 후 DB에서 읽는다. 없는 문의와 조회 장애를 구분한다. */
export async function readInquiry(
  id: string,
): Promise<Result<InquiryItem | null>> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  if (!isInquiryId(id)) return { ok: true, data: null };
  try {
    const { data, error } = await access.client
      .from("inquiries")
      .select(inquiryColumns)
      .eq("id", id)
      .maybeSingle<InquiryRow>();
    if (error) return { ok: false, reason: "server" };
    return { ok: true, data: data ? item(data) : null };
  } catch {
    return { ok: false, reason: "server" };
  }
}
