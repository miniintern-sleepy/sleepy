import assert from "node:assert/strict";
import { test } from "node:test";

import {
  escapeMailHtml,
  inquiryPreviewHtml,
  normalizeReply,
  replyError,
} from "./template.ts";

test("MAIL-003 사용자 입력의 태그·앰퍼샌드·따옴표는 텍스트로 바꾸고 줄바꿈을 보존한다", () => {
  assert.equal(
    escapeMailHtml("<script>\"이름\" & '문의'</script>\r\n다음\r끝"),
    "&lt;script&gt;&quot;이름&quot; &amp; &#39;문의&#39;&lt;/script&gt;<br>다음<br>끝",
  );
  assert.equal(escapeMailHtml("&lt;"), "&amp;lt;");
  assert.equal(normalizeReply(" \r\n답변\r두 줄 \n"), "답변\n두 줄");
});

test("MAIL-004 요약은 원문 300자로 추리고 답변은 원문과 HTML 변수 한도를 모두 검사한다", () => {
  assert.equal(inquiryPreviewHtml('"'.repeat(301)), "&quot;".repeat(300));
  assert.equal(inquiryPreviewHtml("😀".repeat(301)), "😀".repeat(300));
  assert.equal(
    inquiryPreviewHtml("가".repeat(300) + "누락할 전문"),
    "가".repeat(300),
  );
  assert.equal(replyError("가".repeat(2000)), undefined);
  assert.ok(replyError("가".repeat(2001)));
  assert.ok(replyError(""));
  assert.equal(replyError("&".repeat(400)), undefined);
  assert.ok(replyError("&".repeat(401)));
  assert.equal(replyError("a\n".repeat(400)), undefined);
  assert.ok(replyError("a\n".repeat(401)));
});
