import assert from "node:assert/strict";
import test from "node:test";
import { searchFaqs } from "./search.ts";

test("FAQ-001 DB 질문과 답변을 검색하고 공백·빈 결과·원래 순서를 유지한다", () => {
  const items = Object.freeze([
    Object.freeze({ id: 7, question: "SLEEBY 사용", answer: "낮에도 휴식" }),
    Object.freeze({ id: 2, question: "충전", answer: "케이스 사용" }),
  ]);
  assert.deepEqual(
    searchFaqs(items, " SLEEby ").map((x) => x.id),
    [7],
  );
  assert.deepEqual(
    searchFaqs(items, "케이스").map((x) => x.id),
    [2],
  );
  assert.deepEqual(
    searchFaqs(items, "사용").map((x) => x.id),
    [7, 2],
  );
  assert.deepEqual(searchFaqs(items, " "), items);
  assert.deepEqual(searchFaqs(items, "해당 없음"), []);
  assert.deepEqual(
    items.map((x) => x.id),
    [7, 2],
  );
});
