/**
 * 커밋 메시지 규칙을 검사한다. 규칙은 scripts/lib/git-rules.mjs, 설명은 CONTRIBUTING.md 2절.
 *
 * 셸 스크립트 대신 Node로 작성해 맥·윈도우에서 같은 방식으로 동작한다.
 */
import { readFileSync } from "node:fs";

import { checkCommitMessage } from "../lib/git-rules.mjs";

const message = readFileSync(process.argv[2], "utf8")
  .split("\n")
  // git이 붙이는 안내 주석 줄은 실제 메시지가 아니다.
  .filter((line) => !line.startsWith("#"))
  .join("\n")
  .trim();

const errors = checkCommitMessage(message);

if (errors.length > 0) {
  console.error("\n커밋 메시지 규칙 위반:");
  for (const error of errors) console.error(`  - ${error}`);
  console.error(
    `\n지금 메시지 첫 줄: ${message.split("\n")[0] || "(비어 있음)"}\n`,
  );
  process.exit(1);
}
