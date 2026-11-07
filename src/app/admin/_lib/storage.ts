import "server-only";

import type { createAdminClient } from "./supabase";
import { thumbnailLimit, thumbnailTypes } from "./validation";

type Client = Awaited<ReturnType<typeof createAdminClient>>;
export const thumbnailBucket = "news-thumbnails";

/** 파일의 표시 형식과 시작 바이트가 일치하는 제한 크기 이미지만 허용한다. */
export async function imageBytes(file: File) {
  if (
    file.size < 1 ||
    file.size > thumbnailLimit ||
    !thumbnailTypes.includes(file.type)
  )
    return null;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const png = [137, 80, 78, 71, 13, 10, 26, 10];
  const matches =
    (file.type === "image/png" &&
      png.every((value, i) => bytes[i] === value)) ||
    (file.type === "image/jpeg" &&
      bytes[0] === 255 &&
      bytes[1] === 216 &&
      bytes[2] === 255) ||
    (file.type === "image/webp" &&
      String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...bytes.slice(8, 12)) === "WEBP");
  return matches ? bytes : null;
}

/** 관리 버킷에서 서버가 생성한 파일 경로만 추출한다. */
export function thumbnailPath(client: Client, url: string | null) {
  if (!url) return null;
  const base = client.storage.from(thumbnailBucket).getPublicUrl("")
    .data.publicUrl;
  if (!url.startsWith(base)) return null;
  const path = url.slice(base.length);
  return /^news\/[0-9a-f-]{36}\.(jpg|png|webp)$/.test(path) ? path : null;
}

/** 다른 기사에서 사용하지 않는 관리용 파일만 삭제한다. 실패는 저장 결과와 구분한다. */
export async function removeUnusedThumbnail(
  client: Client,
  url: string | null,
) {
  try {
    const path = thumbnailPath(client, url);
    if (!path) return true;
    const { data, error } = await client
      .from("news_articles")
      .select("id")
      .eq("thumbnail_url", url)
      .limit(1);
    if (error) return false;
    if (data?.length) return true;
    const { error: removeError } = await client.storage
      .from(thumbnailBucket)
      .remove([path]);
    return !removeError;
  } catch {
    return false;
  }
}
