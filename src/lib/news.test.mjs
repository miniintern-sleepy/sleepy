import assert from "node:assert/strict";
import test from "node:test";
import { formatDate, imageUrl, sourceUrl } from "./news.ts";

test("NEWS-014 임시 1일을 포함한 날짜를 YYYY.MM.DD로 표시한다", () => {
  assert.equal(formatDate("2026-06-01"), "2026.06.01");
});
test("NEWS-008 HTTPS 원문과 안전한 썸네일 주소를 허용하고 주소 누락에는 링크를 만들지 않는다", () => {
  const credentialUrl = new URL("https://example.com");
  credentialUrl.username = "test-user";
  credentialUrl.password = "test-password";
  assert.equal(
    sourceUrl("https://example.com/news"),
    "https://example.com/news",
  );
  for (const value of [
    null,
    "",
    "http://example.com",
    "javascript:alert(1)",
    "//example.com",
    credentialUrl.href,
  ])
    assert.equal(sourceUrl(value), null);
  assert.equal(
    imageUrl("/images/newsroom/proposal.webp"),
    "/images/newsroom/proposal.webp",
  );
  assert.equal(
    imageUrl("https://example.com/storage/news.png"),
    "https://example.com/storage/news.png",
  );
  for (const value of [
    "//example.com/a.png",
    "/\\example.com/a.png",
    "data:image/png;base64,a",
  ])
    assert.equal(imageUrl(value), null);
});
