"use client";

import { useActionState, useState } from "react";

import { updatePurchaseUrl } from "../content-actions";
import {
  buttonClass,
  Feedback,
  Field,
  inputClass,
  panelClass,
} from "./form-ui";

export default function PurchaseUrlForm({ url }: { url: string | null }) {
  const [value, setValue] = useState(url ?? "");
  const [state, action, pending] = useActionState(updatePurchaseUrl, {
    ok: false,
  });
  return (
    <section className={panelClass} aria-labelledby="purchase-title">
      <h2 id="purchase-title" className="text-title">
        구매 주소
      </h2>
      <p className="mt-3 text-body-sm text-fg-muted">
        https:// 주소를 입력해 주세요. 비우고 저장하면 공개 화면에 출시 예정으로
        표시됩니다.
      </p>
      <form action={action} className="mt-5 space-y-4" aria-busy={pending}>
        <Field
          name="url"
          label="구매 페이지 주소"
          error={state.fieldErrors?.url}
        >
          <input
            type="url"
            className={inputClass}
            id="url"
            name="url"
            maxLength={2048}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            disabled={pending}
            aria-invalid={!!state.fieldErrors?.url}
            aria-describedby="url-error"
          />
        </Field>
        <Feedback state={state} />
        <button disabled={pending} className={buttonClass}>
          {pending ? "저장 중…" : "구매 주소 저장"}
        </button>
      </form>
    </section>
  );
}
