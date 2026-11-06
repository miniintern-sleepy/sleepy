"use server";

import { refresh, updateTag } from "next/cache";

import { requireAdmin } from "./_lib/auth";
import {
  imageBytes,
  removeUnusedThumbnail,
  thumbnailBucket,
} from "./_lib/storage";
import {
  validateFaq,
  validateId,
  validateNews,
  validatePurchaseUrl,
  validateSpec,
  type ContentState,
} from "./_lib/validation";

/** FAQ를 추가하거나 수정하고 공개 FAQ 캐시를 즉시 만료한다. */
export async function upsertFaq(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateFaq(form);
  if (Object.keys(parsed.errors).length)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  try {
    const values = { ...parsed.values, updated_at: new Date().toISOString() };
    const query = parsed.id
      ? access.client.from("faqs").update(values).eq("id", parsed.id)
      : access.client.from("faqs").insert(values);
    const { data, error } = await query.select("id").maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "notFound" };
  } catch {
    return { ok: false, reason: "server" };
  }
  updateTag("faqs");
  refresh();
  return { ok: true };
}

/** 존재하는 FAQ만 삭제하고 공개 목록을 갱신한다. */
export async function deleteFaq(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateId(form);
  if (!parsed.id)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  try {
    const { data, error } = await access.client
      .from("faqs")
      .delete()
      .eq("id", parsed.id)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "notFound" };
  } catch {
    return { ok: false, reason: "server" };
  }
  updateTag("faqs");
  refresh();
  return { ok: true };
}

/** 제품 사양을 추가하거나 수정하고 제품 사양 캐시를 즉시 만료한다. */
export async function upsertProductSpec(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateSpec(form);
  if (Object.keys(parsed.errors).length)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  try {
    const query = parsed.id
      ? access.client
          .from("product_specs")
          .update(parsed.values)
          .eq("id", parsed.id)
      : access.client.from("product_specs").insert(parsed.values);
    const { data, error } = await query.select("id").maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "notFound" };
  } catch {
    return { ok: false, reason: "server" };
  }
  updateTag("product_specs");
  refresh();
  return { ok: true };
}

/** 제품 사양을 삭제하고 공개 제품 화면의 캐시를 즉시 만료한다. */
export async function deleteProductSpec(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateId(form);
  if (!parsed.id)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  try {
    const { data, error } = await access.client
      .from("product_specs")
      .delete()
      .eq("id", parsed.id)
      .select("id")
      .maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "notFound" };
  } catch {
    return { ok: false, reason: "server" };
  }
  updateTag("product_specs");
  refresh();
  return { ok: true };
}

/** 구매 주소만 저장하고 메인·제품 화면에서 사용하는 설정 캐시를 만료한다. */
export async function updatePurchaseUrl(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validatePurchaseUrl(form);
  if (Object.keys(parsed.errors).length)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  try {
    const { data, error } = await access.client
      .from("site_settings")
      .upsert({
        key: "purchase_url",
        value: parsed.value,
        updated_at: new Date().toISOString(),
      })
      .select("key")
      .maybeSingle();
    if (error || !data) return { ok: false, reason: "server" };
  } catch {
    return { ok: false, reason: "server" };
  }
  updateTag("site_settings");
  refresh();
  return { ok: true };
}

/** 기존 summary에 요약을 저장하고 이미지와 공개 기사 캐시를 갱신한다. */
export async function upsertNewsArticle(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateNews(form);
  if (Object.keys(parsed.errors).length)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  const client = access.client;
  let uploadedPath: string | null = null;
  let oldUrl: string | null = null;
  let thumbnailUrl: string | null = null;
  let cleanupWarning = false;
  try {
    if (parsed.id) {
      const { data, error } = await client
        .from("news_articles")
        .select("thumbnail_url")
        .eq("id", parsed.id)
        .maybeSingle();
      if (error) return { ok: false, reason: "server" };
      if (!data) return { ok: false, reason: "notFound" };
      oldUrl = data.thumbnail_url;
    }
    thumbnailUrl = parsed.removeThumbnail ? null : oldUrl;
    if (parsed.file) {
      const bytes = await imageBytes(parsed.file);
      if (!bytes)
        return {
          ok: false,
          reason: "invalid",
          fieldErrors: {
            thumbnail: "이미지 형식과 파일 내용이 일치하지 않습니다.",
          },
        };
      const extension = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
      }[parsed.file.type];
      uploadedPath = `news/${crypto.randomUUID()}.${extension}`;
      const { error } = await client.storage
        .from(thumbnailBucket)
        .upload(uploadedPath, bytes, {
          contentType: parsed.file.type,
          upsert: false,
        });
      if (error) return { ok: false, reason: "server" };
      thumbnailUrl = client.storage
        .from(thumbnailBucket)
        .getPublicUrl(uploadedPath).data.publicUrl;
    }
    const values = { ...parsed.values, thumbnail_url: thumbnailUrl };
    const query = parsed.id
      ? client.from("news_articles").update(values).eq("id", parsed.id)
      : client.from("news_articles").insert(values);
    const { data, error } = await query.select("id").maybeSingle();
    if (error || !data) {
      let warning: string | undefined;
      if (uploadedPath) {
        try {
          const { error: cleanupError } = await client.storage
            .from(thumbnailBucket)
            .remove([uploadedPath]);
          if (cleanupError)
            warning =
              "새 이미지 정리에 실패했습니다. 담당자에게 문의해 주세요.";
        } catch {
          warning = "새 이미지 정리에 실패했습니다. 담당자에게 문의해 주세요.";
        }
      }
      return { ok: false, reason: error ? "server" : "notFound", warning };
    }
  } catch {
    let warning: string | undefined;
    if (uploadedPath) {
      try {
        // 통신 실패여도 DB에 저장됐을 수 있어 참조가 없는 파일만 정리한다(#44).
        const uploadedUrl = client.storage
          .from(thumbnailBucket)
          .getPublicUrl(uploadedPath).data.publicUrl;
        if (!(await removeUnusedThumbnail(client, uploadedUrl)))
          warning = "새 이미지 정리에 실패했습니다. 담당자에게 문의해 주세요.";
      } catch {
        warning = "새 이미지 정리에 실패했습니다. 담당자에게 문의해 주세요.";
      }
    }
    return { ok: false, reason: "server", warning };
  }
  if (oldUrl !== thumbnailUrl)
    cleanupWarning = !(await removeUnusedThumbnail(client, oldUrl));
  updateTag("news_articles");
  refresh();
  return {
    ok: true,
    ...(cleanupWarning
      ? { warning: "기사는 저장했지만 이전 이미지 정리에 실패했습니다." }
      : {}),
  };
}

/** 기사 삭제가 성공한 뒤 다른 기사에서 쓰지 않는 썸네일만 정리한다. */
export async function deleteNewsArticle(
  _previous: ContentState,
  form: FormData,
): Promise<ContentState> {
  const access = await requireAdmin();
  if (!access.ok) return access;
  const parsed = validateId(form);
  if (!parsed.id)
    return { ok: false, reason: "invalid", fieldErrors: parsed.errors };
  let oldUrl: string | null;
  try {
    const { data, error } = await access.client
      .from("news_articles")
      .delete()
      .eq("id", parsed.id)
      .select("thumbnail_url")
      .maybeSingle();
    if (error) return { ok: false, reason: "server" };
    if (!data) return { ok: false, reason: "notFound" };
    oldUrl = data.thumbnail_url;
  } catch {
    return { ok: false, reason: "server" };
  }
  const cleaned = await removeUnusedThumbnail(access.client, oldUrl);
  updateTag("news_articles");
  // 정리 실패 안내를 확인한 뒤 목록을 갱신하도록 삭제 대화상자를 유지한다(#44).
  if (cleaned) refresh();
  return {
    ok: true,
    ...(!cleaned
      ? { warning: "기사는 삭제했지만 이미지 정리에 실패했습니다." }
      : {}),
  };
}
