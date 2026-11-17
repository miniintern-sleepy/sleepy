/** 지원하는 언어. 첫 번째가 기본 언어다. */
export const locales = ["ko", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "ko";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** 주소의 언어가 지원 목록에 없으면 기본 언어로 본다. 레이아웃이 먼저 404를 내므로 화면에서는 늘 맞는 값이다. */
export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale;
}

/** 언어 선택 버튼에 쓰는 이름. short는 버튼, name은 목록(각 언어로 적어 그 언어 사용자가 알아보게 한다). */
export const localeLabels: Record<Locale, { short: string; name: string }> = {
  ko: { short: "KOR", name: "한국어" },
  en: { short: "ENG", name: "English" },
};
