import assert from "node:assert/strict";
import test from "node:test";
import { isHomePath } from "./is-home-path.ts";

test("HOME-001 언어의 메인 주소와 정확히 일치할 때만 투명 헤더를 쓴다", () => {
  for (const lang of ["ko", "en"])
    assert.equal(isHomePath(`/${lang}`, lang), true);
  for (const [path, lang] of [
    ["/ko/technology", "ko"],
    ["/ko/contact", "ko"],
    ["/en/faq", "en"],
    ["/ko/newsroom/어떤-글", "ko"],
    ["/ko/", "ko"],
    ["/en", "ko"],
    [null, "ko"],
  ])
    assert.equal(isHomePath(path, lang), false);
});
