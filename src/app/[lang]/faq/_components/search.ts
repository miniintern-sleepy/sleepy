import type { Faq } from "@/types/content";

export function searchFaqs(items: Faq[], value: string) {
  const query = value.trim().toLocaleLowerCase("ko");
  return items.filter((item) =>
    `${item.question} ${item.answer}`.toLocaleLowerCase("ko").includes(query),
  );
}
