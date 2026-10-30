/**
 * PR 규칙을 검사한다(GitHub Actions에서 실행). 규칙은 scripts/lib/git-rules.mjs.
 *
 * 커밋 훅은 --no-verify로 건너뛰거나 연결을 안 했을 수 있어서, PR에 들어간 커밋을 여기서 다시 검사한다.
 * 입력은 워크플로가 환경 변수로 넘긴다: PR_TITLE, PR_BODY, HEAD_REF, BASE_REF, BASE_SHA, HEAD_SHA
 */
import { execFileSync } from "node:child_process";

import {
  checkCommitMessage,
  checkPullRequest,
  findSignatureErrors,
} from "../lib/git-rules.mjs";

const { PR_TITLE, PR_BODY, HEAD_REF, BASE_REF, BASE_SHA, HEAD_SHA } =
  process.env;

const errors = checkPullRequest({
  title: PR_TITLE ?? "",
  body: PR_BODY ?? "",
  headRef: HEAD_REF ?? "",
  baseRef: BASE_REF ?? "",
});

const log = execFileSync(
  "git",
  ["log", "--format=%h%x00%B%x1e", `${BASE_SHA}..${HEAD_SHA}`],
  {
    encoding: "utf8",
  },
);
const commits = log
  .split("\x1e")
  .map((entry) => entry.trim())
  .filter(Boolean)
  .map((entry) => {
    const [hash, message] = entry.split("\x00");
    return { hash, message: message.trim() };
  });

for (const { hash, message } of commits) {
  // 배포 PR(dev → main)의 커밋은 이미 작업 PR에서 형식 검사를 받았으므로 서명만 다시 본다.
  const commitErrors =
    BASE_REF === "main"
      ? findSignatureErrors(message)
      : checkCommitMessage(message);
  for (const error of commitErrors) {
    errors.push(`커밋 ${hash} "${message.split("\n")[0]}": ${error}`);
  }
}

if (errors.length > 0) {
  console.error("PR 규칙 위반:");
  for (const error of errors) console.error(`  - ${error}`);
  console.error("\n규칙: CONTRIBUTING.md");
  process.exit(1);
}

console.log(`PR 규칙 통과 (커밋 ${commits.length}개 검사)`);
