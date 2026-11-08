"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import type { ContentState } from "../_lib/validation";

import { upsertFaq } from "../content-actions";
import FormHeading from "./FormHeading";
import type { FaqItem } from "../_lib/content";
import {
  buttonClass,
  Feedback,
  Field,
  inputClass,
  panelClass,
} from "./form-ui";

export default function FaqForm({ item }: { item?: FaqItem }) {
  const [values, setValues] = useState({
    question: item?.question ?? "",
    answer: item?.answer ?? "",
    sortOrder: String(item?.sortOrder ?? 0),
    isPublished: item?.isPublished ?? false,
  });
  const [state, action, pending] = useActionState(
    async (previous: ContentState, form: FormData) => {
      const result = await upsertFaq(previous, form);
      if (result.ok && !item)
        setValues({
          question: "",
          answer: "",
          sortOrder: "0",
          isPublished: false,
        });
      return result;
    },
    { ok: false } as ContentState,
  );
  return (
    <section className={panelClass} aria-labelledby="faq-form-title">
      <FormHeading id="faq-form-title">
        {item ? "FAQ 수정" : "FAQ 추가"}
      </FormHeading>
      <form action={action} className="mt-5 space-y-4" aria-busy={pending}>
        {item && <input type="hidden" name="id" value={item.id} />}
        <Field name="question" label="질문" error={state.fieldErrors?.question}>
          <input
            className={inputClass}
            id="question"
            name="question"
            required
            maxLength={200}
            aria-invalid={!!state.fieldErrors?.question}
            aria-describedby="question-error"
            value={values.question}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                question: event.target.value,
              }))
            }
            disabled={pending}
          />
        </Field>
        <Field name="answer" label="답변" error={state.fieldErrors?.answer}>
          <textarea
            className={inputClass}
            id="answer"
            name="answer"
            required
            maxLength={5000}
            rows={6}
            aria-invalid={!!state.fieldErrors?.answer}
            aria-describedby="answer-error"
            value={values.answer}
            onChange={(event) =>
              setValues((current) => ({
                ...current,
                answer: event.target.value,
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
          <p role="alert" className="text-helper text-error-ink">
            {state.fieldErrors.isPublished}
          </p>
        )}
        <Feedback state={state} />
        <div className="flex flex-wrap items-center gap-4">
          <button disabled={pending} className={buttonClass}>
            {pending ? "저장 중…" : "저장"}
          </button>
          {item && (
            <Link
              href="/admin/faq"
              className="inline-flex min-h-11 items-center text-ink underline"
            >
              새 FAQ 추가
            </Link>
          )}
        </div>
      </form>
    </section>
  );
}
