"use server";

import { headers } from "next/headers";
import { after } from "next/server";

import { createServiceClient } from "@/lib/supabase/server";
import { sendInquiryNotification } from "@/lib/mail/send";

import { validateInquiry, type InquiryState } from "./_components/form";

/** 허니팟·보안 확인·입력 검증을 거친 문의만 저장한다. */
export async function submitInquiry(
  previous: InquiryState,
  formData: FormData,
): Promise<InquiryState> {
  const attempt = Number.isSafeInteger(previous?.attempt)
    ? previous.attempt + 1
    : 1;
  const text = (key: string) => {
    const value = formData.get(key);
    return typeof value === "string" ? value : "";
  };

  if (text("company_website")) return { ok: true, attempt };

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (
    !secret ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL
  )
    return { ok: false, attempt, reason: "server" };

  const token = text("cf-turnstile-response");
  if (!token || token.length > 2048)
    return { ok: false, attempt, reason: "captcha" };

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, response: token }),
        cache: "no-store",
        signal: AbortSignal.timeout(10000),
      },
    );
    if (!response.ok) return { ok: false, attempt, reason: "captcha" };
    const verification: {
      success?: boolean;
      action?: string;
      hostname?: string;
    } = await response.json();
    const requestHeaders = await headers();
    const host =
      requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
    if (!host) return { ok: false, attempt, reason: "server" };
    const hostname = new URL(`https://${host}`).hostname;
    if (
      verification.success !== true ||
      verification.action !== "contact" ||
      verification.hostname !== hostname
    )
      return { ok: false, attempt, reason: "captcha" };

    const values = {
      name: text("name").trim(),
      email: text("email").trim().toLowerCase(),
      type: text("type"),
      message: text("message").trim(),
      consent: text("consent") === "on",
    };
    const fieldErrors = validateInquiry(values);
    if (Object.keys(fieldErrors).length)
      return { ok: false, attempt, reason: "invalid", fieldErrors };

    const client = createServiceClient();
    const { data, error: lookupError } = await client
      .from("inquiries")
      .select("id")
      .eq("email", values.email)
      .eq("message", values.message)
      .gte("created_at", new Date(Date.now() - 60000).toISOString())
      .limit(1);
    if (lookupError) return { ok: false, attempt, reason: "server" };
    if (data?.length) return { ok: true, attempt };

    const { data: saved, error } = await client
      .from("inquiries")
      .insert({
        name: values.name,
        email: values.email,
        type: values.type,
        message: values.message,
        consented_at: new Date().toISOString(),
      })
      .select("id, created_at")
      .single();
    if (error || !saved) return { ok: false, attempt, reason: "server" };

    // 저장이 확정된 새 문의만 등록하고 알림 장애로 문의 재전송을 유발하지 않는다(#45).
    try {
      after(async () => {
        try {
          const result = await sendInquiryNotification({
            id: saved.id,
            created_at: saved.created_at,
            name: values.name,
            type: values.type as "product" | "general",
            message: values.message,
          });
          if (!result.ok)
            console.error("문의 알림 실패", saved.id, result.reason);
        } catch {
          console.error("문의 알림 실패", saved.id, "unexpected");
        }
      });
    } catch {
      console.error("문의 알림 실패", saved.id, "schedule");
    }
    return { ok: true, attempt };
  } catch {
    return { ok: false, attempt, reason: "server" };
  }
}
