/**
 * npm ci·install 때 커밋 훅 폴더(.githooks)를 git에 연결한다.
 *
 * 주의: Vercel 빌드처럼 git 저장소가 없는 곳에서도 설치가 실패하면 안 되므로,
 * 연결에 실패하면 조용히 넘어간다.
 */
import { execSync } from "node:child_process";

try {
  execSync("git rev-parse --is-inside-work-tree", { stdio: "ignore" });
  execSync("git config core.hooksPath .githooks", { stdio: "ignore" });
} catch {
  // git이 없거나 저장소 밖이면 훅이 필요 없다.
}
