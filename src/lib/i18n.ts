/** 지원하는 언어. 영어 등은 고도화 단계에서 추가한다. */
export const locales = ["ko"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
