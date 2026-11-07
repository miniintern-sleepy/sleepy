"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { ContentState } from "../_lib/validation";

import { upsertProductSpec } from "../content-actions";
import type { SpecItem } from "../_lib/content";
import {
  buttonClass,
  Feedback,
  Field,
  inputClass,
  panelClass,
} from "./form-ui";

export default function ProductSpecForm({ item }: { item?: SpecItem }) {
  const [values, setValues] = useState({
    label: item?.label ?? "",
    value: item?.value ?? "",
    sortOrder: String(item?.sortOrder ?? 0),
    isPublished: item?.isPublished ?? true,
  });
  const [state, action, pending] = useActionState(
    async (previous: ContentState, form: FormData) => {
      const result = await upsertProductSpec(previous, form);
      if (result.ok && !item)
        setValues({ label: "", value: "", sortOrder: "0", isPublished: true });
      return result;
    },
    { ok: false } as ContentState,
  );
  return (
    <section className={panelClass} aria-labelledby="spec-form-title">
      <h2 id="spec-form-title" className="text-form-title">
        {item ? "제품 사양 수정" : "제품 사양 추가"}
      </h2>
      <form action={action} className="mt-5 space-y-4" aria-busy={pending}>
        {item && <input type="hidden" name="id" value={item.id} />}
        <Field name="label" label="항목명" error={state.fieldErrors?.label}>
          <input
            className={inputClass}
            id="label"
            name="label"
            required
            maxLength={100}
            aria-invalid={!!state.fieldErrors?.label}
            aria-describedby="label-error"
            value={values.label}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                label: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field name="value" label="값" error={state.fieldErrors?.value}>
          <textarea
            className={inputClass}
            id="value"
            name="value"
            required
            rows={3}
            maxLength={500}
            aria-invalid={!!state.fieldErrors?.value}
            aria-describedby="value-error"
            value={values.value}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                value: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field
          name="sortOrder"
          label="순서 (작은 번호가 위)"
          error={state.fieldErrors?.sortOrder}
        >
          <input
            className={inputClass}
            id="sortOrder"
            name="sortOrder"
            type="number"
            min={0}
            max={2147483647}
            step={1}
            required
            aria-invalid={!!state.fieldErrors?.sortOrder}
            aria-describedby="sortOrder-error"
            value={values.sortOrder}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                sortOrder: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
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
        {state.fieldErrors?.isPublished && (
          <p role="alert">{state.fieldErrors.isPublished}</p>
        )}
        <Feedback state={state} />
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={pending} className={buttonClass}>
            {pending ? "저장 중…" : "저장"}
          </button>
          {item && (
            <Link
              href="/admin/product"
              className="inline-flex min-h-11 items-center text-ink underline"
            >
              새 사양 추가
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
