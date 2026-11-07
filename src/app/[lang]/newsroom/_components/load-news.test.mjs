import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

const hook = registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export%20{}", shortCircuit: true };
    if (specifier === "@/lib/content")
      return {
        url: "data:text/javascript,export async function getNewsList(){return globalThis.__sleepyNews54();}",
        shortCircuit: true,
      };
    return next(specifier, context);
  },
});
const { loadNewsroom } = await import("./load-news.ts");
hook.deregister();

test("NEWS-010 DB가 비면 예시·고정 공지를 넣지 않고 조회 장애를 숨기지 않는다", async (t) => {
  t.after(() => delete globalThis.__sleepyNews54);
  globalThis.__sleepyNews54 = async () => [];
  assert.deepEqual(await loadNewsroom(), []);
  const rows = [{ id: 6, title: "DB 기사" }];
  globalThis.__sleepyNews54 = async () => rows;
  assert.equal(await loadNewsroom(), rows);
  const error = new Error("조회 실패");
  globalThis.__sleepyNews54 = async () => {
    throw error;
  };
  await assert.rejects(loadNewsroom(), error);
});
