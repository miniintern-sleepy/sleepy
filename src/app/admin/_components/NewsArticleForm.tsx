"use client";

import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";

import type { ContentState } from "../_lib/validation";

import { upsertNewsArticle } from "../content-actions";
import type { NewsItem } from "../_lib/content";
import {
  buttonClass,
  Feedback,
  Field,
  inputClass,
  panelClass,
} from "./form-ui";

export default function NewsArticleForm({ item }: { item?: NewsItem }) {
  const [values, setValues] = useState({
    title: item?.title ?? "",
    category: item?.category ?? "company",
    summary: item?.summary ?? "",
    publishedAt: item?.publishedAt ?? "",
    sourceName: item?.sourceName ?? "",
    sourceUrl: item?.sourceUrl ?? "",
    isPublished: item?.isPublished ?? false,
    isFeatured: item?.isFeatured ?? false,
    removeThumbnail: false,
  });
  const [state, action, pending] = useActionState(
    async (previous: ContentState, form: FormData) => {
      const result = await upsertNewsArticle(previous, form);
      if (result.ok && !item)
        setValues({
          title: "",
          category: "company",
          summary: "",
          publishedAt: "",
          sourceName: "",
          sourceUrl: "",
          isPublished: false,
          isFeatured: false,
          removeThumbnail: false,
        });
      return result;
    },
    { ok: false } as ContentState,
  );
  const image = item?.thumbnailUrl;
  const safeImage =
    image &&
    ((image.startsWith("/") &&
      !image.startsWith("//") &&
      !image.includes("\\")) ||
      image.startsWith("https://"))
      ? image
      : null;
  return (
    <section className={panelClass} aria-labelledby="news-form-title">
      <h2 id="news-form-title" className="text-title">
        {item ? "기사 수정" : "기사 추가"}
      </h2>
      <form action={action} className="mt-5 space-y-4" aria-busy={pending}>
        {item && <input type="hidden" name="id" value={item.id} />}
        <Field name="title" label="제목" error={state.fieldErrors?.title}>
          <input
            className={inputClass}
            id="title"
            name="title"
            maxLength={200}
            required
            aria-invalid={!!state.fieldErrors?.title}
            aria-describedby="title-error"
            value={values.title}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                title: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field name="category" label="분류" error={state.fieldErrors?.category}>
          <select
            className={inputClass}
            id="category"
            name="category"
            aria-describedby="category-error"
            value={values.category}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                category: event.target.value,
              }))
            }
            disabled={pending}
          >
            <option value="company">기업 소식</option>
            <option value="press">보도자료</option>
            <option value="notice">공지사항</option>
          </select>
        </Field>
        <Field name="summary" label="요약" error={state.fieldErrors?.summary}>
          <textarea
            className={inputClass}
            id="summary"
            name="summary"
            rows={8}
            maxLength={10000}
            aria-invalid={!!state.fieldErrors?.summary}
            aria-describedby="summary-error"
            value={values.summary}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                summary: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field
          name="publishedAt"
          label="기사 날짜"
          error={state.fieldErrors?.publishedAt}
        >
          <input
            className={inputClass}
            id="publishedAt"
            name="publishedAt"
            type="date"
            min="1000-01-01"
            max="9999-12-31"
            required
            aria-invalid={!!state.fieldErrors?.publishedAt}
            aria-describedby="publishedAt-error"
            value={values.publishedAt}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                publishedAt: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field
          name="sourceName"
          label="언론사명"
          error={state.fieldErrors?.sourceName}
        >
          <input
            className={inputClass}
            id="sourceName"
            name="sourceName"
            maxLength={100}
            aria-invalid={!!state.fieldErrors?.sourceName}
            aria-describedby="sourceName-error"
            value={values.sourceName}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                sourceName: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field
          name="sourceUrl"
          label="원문 주소"
          error={state.fieldErrors?.sourceUrl}
        >
          <input
            className={inputClass}
            id="sourceUrl"
            name="sourceUrl"
            type="url"
            maxLength={2048}
            aria-invalid={!!state.fieldErrors?.sourceUrl}
            aria-describedby="sourceUrl-error"
            value={values.sourceUrl}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                sourceUrl: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <div className="flex flex-wrap gap-x-6">
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              name="isPublished"
              checked={values.isPublished}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  isPublished: event.target.checked,
                }))
              }
              disabled={pending}
            />
            공개
          </label>
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              name="isFeatured"
              checked={values.isFeatured}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  isFeatured: event.target.checked,
                }))
              }
              disabled={pending}
            />
            주요 기사
          </label>
        </div>
        {state.fieldErrors?.isPublished && (
          <p role="alert">{state.fieldErrors.isPublished}</p>
        )}
        {state.fieldErrors?.isFeatured && (
          <p role="alert">{state.fieldErrors.isFeatured}</p>
        )}
        {safeImage && (
          <div>
            <p className="text-label">현재 썸네일</p>
            <Image
              src={safeImage}
              alt={`${item?.title} 썸네일`}
              width={320}
              height={180}
              unoptimized
              className="mt-2 h-auto max-w-full rounded-lg"
            />
          </div>
        )}
        <Field
          name="thumbnail"
          label="썸네일 이미지 (선택)"
          error={state.fieldErrors?.thumbnail}
        >
          <input
            className={inputClass}
            id="thumbnail"
            name="thumbnail"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-invalid={!!state.fieldErrors?.thumbnail}
            aria-describedby="thumbnail-help thumbnail-error"
          />
        </Field>
        <p id="thumbnail-help" className="text-body-sm text-fg-muted">
          JPEG·PNG·WebP, 900KB(921,600바이트) 이하. 파일을 선택하지 않으면 기존
          이미지를 유지합니다. 비공개 기사 이미지도 URL은 공개됩니다.
        </p>
        {item?.thumbnailUrl && (
          <label className="flex min-h-11 items-center gap-3">
            <input
              type="checkbox"
              name="removeThumbnail"
              checked={values.removeThumbnail}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  removeThumbnail: event.target.checked,
                }))
              }
              disabled={pending}
            />
            기존 썸네일 제거
          </label>
        )}
        <Feedback state={state} />
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={pending} className={buttonClass}>
            {pending ? "저장 중…" : "저장"}
          </button>
          {item && (
            <Link
              href="/admin/newsroom"
              className="inline-flex min-h-11 items-center text-brand-deep underline"
            >
              새 기사 추가
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
