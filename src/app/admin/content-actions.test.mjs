import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { after, beforeEach, test } from "node:test";

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only")
      return { url: "data:text/javascript,export {}", shortCircuit: true };
    if (specifier === "./_lib/auth")
      return {
        url: "data:text/javascript,export async function requireAdmin(){const s=globalThis.__contentTest;s.events.push('auth');return s.access??{ok:true,client:s.client}}",
        shortCircuit: true,
      };
    if (specifier === "next/cache")
      return {
        url: "data:text/javascript,export function updateTag(tag){globalThis.__contentTest.events.push('tag:'+tag)} export function refresh(){globalThis.__contentTest.events.push('refresh')}",
        shortCircuit: true,
      };
    if (
      ["./_lib/storage", "./_lib/validation", "./validation"].includes(
        specifier,
      )
    )
      return nextResolve(
        new URL(`${specifier}.ts`, context.parentURL).href,
        context,
      );
    return nextResolve(specifier, context);
  },
});
const actions = await import("./content-actions.ts");
const { thumbnailLimit } = await import("./_lib/validation.ts");
let scenario;
const baseUrl =
  "https://storage.example.test/storage/v1/object/public/news-thumbnails/";
const oldPath = "news/11111111-1111-4111-8111-111111111111.png";

beforeEach(() => {
  scenario = {
    events: [],
    writes: [],
    uploads: [],
    removals: [],
    oldUrl: null,
    mutationError: null,
    missing: false,
    lookupError: null,
    uploadError: null,
    removeError: null,
    references: [],
  };
  scenario.client = {
    from(table) {
      let operation = "select";
      let values;
      let id;
      const query = {
        insert(value) {
          operation = "insert";
          values = value;
          return this;
        },
        update(value) {
          operation = "update";
          values = value;
          return this;
        },
        upsert(value) {
          operation = "upsert";
          values = value;
          return this;
        },
        delete() {
          operation = "delete";
          return this;
        },
        select() {
          return this;
        },
        eq(key, value) {
          if (key === "id") id = value;
          return this;
        },
        async maybeSingle() {
          scenario.events.push(`db:${table}:${operation}`);
          if (operation === "select")
            return {
              data: scenario.missing
                ? null
                : { thumbnail_url: scenario.oldUrl },
              error: scenario.lookupError,
            };
          scenario.writes.push({ table, operation, values, id });
          if (scenario.mutationThrows) throw new Error("저장 응답 유실");
          return {
            data: scenario.missing
              ? null
              : {
                  id: id ?? 1,
                  key: "purchase_url",
                  thumbnail_url: scenario.oldUrl,
                },
            error: scenario.mutationError,
          };
        },
        async limit() {
          scenario.events.push("references");
          return { data: scenario.references, error: scenario.lookupError };
        },
      };
      return query;
    },
    storage: {
      from(bucket) {
        assert.equal(bucket, "news-thumbnails");
        return {
          getPublicUrl(path) {
            return { data: { publicUrl: baseUrl + path } };
          },
          async upload(path, bytes, options) {
            scenario.events.push("upload");
            scenario.uploads.push({ path, bytes, options });
            return { error: scenario.uploadError };
          },
          async remove(paths) {
            scenario.events.push("remove");
            scenario.removals.push(...paths);
            return { error: scenario.removeError };
          },
        };
      },
    },
  };
  globalThis.__contentTest = scenario;
});
after(() => {
  delete globalThis.__contentTest;
  hooks.deregister();
});

function form(values = {}) {
  const data = new FormData();
  for (const [name, value] of Object.entries(values))
    if (value !== null) data.set(name, value);
  return data;
}
const faq = (extra = {}) =>
  form({
    question: " 질문 ",
    answer: " 답변 ",
    sortOrder: "0",
    isPublished: "on",
    ...extra,
  });
const spec = (extra = {}) =>
  form({
    label: "무게",
    value: "1.5g",
    sortOrder: "1",
    isPublished: "on",
    ...extra,
  });
const news = (extra = {}) =>
  form({
    category: "notice",
    title: "테스트 기사",
    summary: " 요약 ",
    publishedAt: "2026-11-06",
    isPublished: "on",
    ...extra,
  });
const cases = () => [
  ["upsertFaq", faq(), "faqs"],
  ["deleteFaq", form({ id: "1" }), "faqs"],
  ["upsertProductSpec", spec(), "product_specs"],
  ["deleteProductSpec", form({ id: "1" }), "product_specs"],
  [
    "updatePurchaseUrl",
    form({ url: "https://example.test/shop" }),
    "site_settings",
  ],
  ["upsertNewsArticle", news(), "news_articles"],
  ["deleteNewsArticle", form({ id: "1" }), "news_articles"],
];
const call = (name, input) => actions[name]({ ok: false }, input);
function timestamp(value) {
  assert.ok(Math.abs(Date.now() - Date.parse(value)) < 2000);
}
function changed(tag) {
  assert.ok(scenario.events.includes(`tag:${tag}`));
  assert.equal(scenario.events.at(-1), "refresh");
}
function unchanged() {
  assert.ok(!scenario.events.some((event) => event.startsWith("tag:")));
  assert.ok(!scenario.events.includes("refresh"));
}
function image(size = 70, type = "image/png") {
  const bytes = new Uint8Array(size);
  bytes.set([137, 80, 78, 71, 13, 10, 26, 10].slice(0, size));
  return new File([bytes], "synthetic.png", { type });
}

test("ACM-001 모든 관리 Action은 입력보다 먼저 권한을 확인하고 거부 시 외부 접근을 하지 않는다", async () => {
  for (const reason of ["unauthenticated", "forbidden", "server"]) {
    scenario.access = { ok: false, reason };
    for (const [name] of cases()) {
      scenario.events = [];
      assert.deepEqual(
        await call(name, {
          get() {
            throw new Error("권한 검사 전 입력 접근");
          },
        }),
        { ok: false, reason },
      );
      assert.deepEqual(scenario.events, ["auth"]);
    }
  }
});
test("ACM-002 FAQ 추가는 공백을 정리하고 현재 시각과 함께 저장한 뒤 캐시를 갱신한다", async () => {
  assert.equal((await call("upsertFaq", faq())).ok, true);
  const { values, operation } = scenario.writes[0];
  assert.equal(operation, "insert");
  assert.equal(values.question, "질문");
  assert.equal(values.answer, "답변");
  timestamp(values.updated_at);
  changed("faqs");
  assert.deepEqual(scenario.events.slice(0, 2), ["auth", "db:faqs:insert"]);
});
test("ACM-003 FAQ 수정은 updated_at을 현재 시각으로 바꾸고 없는 대상은 추가하지 않는다", async () => {
  assert.equal((await call("upsertFaq", faq({ id: "2" }))).ok, true);
  assert.equal(scenario.writes[0].operation, "update");
  assert.equal(scenario.writes[0].id, 2);
  timestamp(scenario.writes[0].values.updated_at);
  scenario.events = [];
  scenario.missing = true;
  assert.equal((await call("upsertFaq", faq({ id: "2" }))).reason, "notFound");
  unchanged();
});
test("ACM-004 FAQ는 필수 값과 길이·순서·공개 여부의 경계값을 검증한다", async () => {
  for (const input of [
    { question: " " },
    { question: "가".repeat(201) },
    { answer: "가".repeat(5001) },
    { sortOrder: "-1" },
    { sortOrder: "1.5" },
    { sortOrder: "2147483648" },
    { isPublished: "false" },
    { id: "1e2" },
  ])
    assert.equal((await call("upsertFaq", faq(input))).reason, "invalid");
  assert.equal(scenario.writes.length, 0);
  unchanged();
  assert.equal(
    (
      await call(
        "upsertFaq",
        faq({
          question: "가".repeat(200),
          answer: "가".repeat(5000),
          sortOrder: "2147483647",
        }),
      )
    ).ok,
    true,
  );
});
test("ACM-005 FAQ 삭제는 유효한 ID와 삭제된 행을 확인한 뒤 캐시를 갱신한다", async () => {
  assert.equal((await call("deleteFaq", form({ id: "0" }))).reason, "invalid");
  unchanged();
  assert.equal((await call("deleteFaq", form({ id: "3" }))).ok, true);
  changed("faqs");
  assert.equal(scenario.writes[0].id, 3);
  scenario.events = [];
  scenario.missing = true;
  assert.equal((await call("deleteFaq", form({ id: "3" }))).reason, "notFound");
  unchanged();
});
test("ACM-006 제품 사양 추가·수정은 같은 사용자 세션으로 저장한 뒤 캐시를 갱신한다", async () => {
  assert.equal((await call("upsertProductSpec", spec())).ok, true);
  assert.equal((await call("upsertProductSpec", spec({ id: "4" }))).ok, true);
  assert.deepEqual(
    scenario.writes.map((write) => write.operation),
    ["insert", "update"],
  );
  changed("product_specs");
});
test("ACM-007 제품 사양은 필수 값과 길이·순서·공개 여부를 검증한다", async () => {
  for (const input of [
    { label: "" },
    { label: "가".repeat(101) },
    { value: "" },
    { value: "가".repeat(501) },
    { sortOrder: "" },
    { isPublished: "true" },
  ])
    assert.equal(
      (await call("upsertProductSpec", spec(input))).reason,
      "invalid",
    );
  assert.equal(scenario.writes.length, 0);
  unchanged();
});
test("ACM-008 제품 사양 삭제는 잘못된 ID와 없는 대상을 거부하고 성공 후 캐시를 갱신한다", async () => {
  assert.equal(
    (await call("deleteProductSpec", form({ id: "9007199254740992" }))).reason,
    "invalid",
  );
  scenario.missing = true;
  assert.equal(
    (await call("deleteProductSpec", form({ id: "4" }))).reason,
    "notFound",
  );
  unchanged();
  scenario.missing = false;
  assert.equal((await call("deleteProductSpec", form({ id: "4" }))).ok, true);
  changed("product_specs");
});
test("ACM-009 구매 주소는 정해진 키와 현재 시각을 저장하고 빈 값은 null로 초기화한다", async () => {
  assert.equal(
    (
      await call(
        "updatePurchaseUrl",
        form({ key: "다른키", url: " https://example.test/shop " }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.writes[0].values.key, "purchase_url");
  assert.equal(scenario.writes[0].values.value, "https://example.test/shop");
  timestamp(scenario.writes[0].values.updated_at);
  changed("site_settings");
  assert.equal((await call("updatePurchaseUrl", form({ url: " " }))).ok, true);
  assert.equal(scenario.writes[1].values.value, null);
  timestamp(scenario.writes[1].values.updated_at);
});
test("ACM-010 구매 주소는 HTTPS 이외의 주소와 인증정보·과도한 길이를 거부한다", async () => {
  const authenticatedUrl = new URL("https://example.test");
  authenticatedUrl.username = "synthetic-user";
  authenticatedUrl.password = "synthetic-input";
  for (const url of [
    "http://example.test",
    "https:example.test",
    "javascript:alert(1)",
    "https://",
    authenticatedUrl.href,
    `https://example.test/${"a".repeat(2048)}`,
  ])
    assert.equal(
      (await call("updatePurchaseUrl", form({ url }))).reason,
      "invalid",
    );
  assert.equal(scenario.writes.length, 0);
  unchanged();
});
test("ACM-011 뉴스 추가·수정은 기존 summary에 요약을 저장하고 캐시를 갱신한다", async () => {
  assert.equal((await call("upsertNewsArticle", news())).ok, true);
  assert.equal((await call("upsertNewsArticle", news({ id: "2" }))).ok, true);
  assert.equal(scenario.writes[0].values.summary, "요약");
  assert.ok(!("body" in scenario.writes[0].values));
  assert.deepEqual(
    scenario.writes.map((write) => write.operation),
    ["insert", "update"],
  );
  changed("news_articles");
});
test("ACM-012 뉴스는 분류·실제 날짜·주소·텍스트 길이·선택 값을 검증한다", async () => {
  for (const input of [
    { category: "other" },
    { publishedAt: "2026-02-29" },
    { publishedAt: "2026-13-01" },
    { publishedAt: "" },
    { title: "" },
    { summary: "가".repeat(10001) },
    { sourceName: "가".repeat(101) },
    { sourceUrl: "http://example.test" },
    { isFeatured: "yes" },
  ])
    assert.equal(
      (await call("upsertNewsArticle", news(input))).reason,
      "invalid",
    );
  assert.equal(scenario.writes.length, 0);
  unchanged();
  assert.equal(
    (await call("upsertNewsArticle", news({ publishedAt: "2024-02-29" }))).ok,
    true,
  );
});
test("ACM-013 썸네일을 선택하지 않으면 기존 URL을 유지하고 명시적으로 제거할 수 있다", async () => {
  scenario.oldUrl = "https://example.test/legacy.png";
  assert.equal(
    (
      await call(
        "upsertNewsArticle",
        news({ id: "2", thumbnail: new File([], "") }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.writes[0].values.thumbnail_url, scenario.oldUrl);
  assert.equal(
    (await call("upsertNewsArticle", news({ id: "2", removeThumbnail: "on" })))
      .ok,
    true,
  );
  assert.equal(scenario.writes[1].values.thumbnail_url, null);
  assert.deepEqual(scenario.removals, []);
  assert.equal(
    (
      await call(
        "upsertNewsArticle",
        news({ thumbnail: image(), removeThumbnail: "on" }),
      )
    ).reason,
    "invalid",
  );
});
test("ACM-014 썸네일은 형식·시작 바이트·900KB 경계값을 검증하고 다른 입력과 함께 저장한다", async () => {
  for (const thumbnail of [
    new File([], "empty.png", { type: "image/png" }),
    image(70, "image/svg+xml"),
    image(thumbnailLimit + 1),
    new File(["다른 내용"], "fake.png", { type: "image/png" }),
  ])
    assert.equal(
      (await call("upsertNewsArticle", news({ thumbnail }))).reason,
      "invalid",
    );
  assert.equal(scenario.uploads.length, 0);
  unchanged();
  assert.equal(
    (
      await call(
        "upsertNewsArticle",
        news({
          thumbnail: image(thumbnailLimit),
          summary: "가".repeat(9998) + "\r\n나",
        }),
      )
    ).ok,
    true,
  );
  assert.equal(scenario.uploads[0].bytes.length, 921600);
  assert.equal(scenario.writes[0].values.summary.length, 10000);
  assert.equal(scenario.uploads[0].options.upsert, false);
  assert.match(scenario.uploads[0].path, /^news\/[0-9a-f-]{36}\.png$/);
});
test("ACM-015 업로드 실패 시 기사 저장과 캐시 갱신을 하지 않는다", async () => {
  scenario.uploadError = { message: "업로드 오류" };
  assert.equal(
    (await call("upsertNewsArticle", news({ thumbnail: image() }))).reason,
    "server",
  );
  assert.equal(scenario.writes.length, 0);
  unchanged();
});
test("ACM-016 기사 저장 실패 시 새로 업로드한 파일만 정리한다", async () => {
  scenario.mutationError = { message: "저장 오류" };
  assert.equal(
    (await call("upsertNewsArticle", news({ thumbnail: image() }))).reason,
    "server",
  );
  assert.deepEqual(scenario.removals, [scenario.uploads[0].path]);
  unchanged();
  scenario.mutationError = null;
  scenario.mutationThrows = true;
  scenario.removals = [];
  scenario.references = [{ id: 2 }];
  assert.equal(
    (await call("upsertNewsArticle", news({ thumbnail: image() }))).reason,
    "server",
  );
  assert.deepEqual(scenario.removals, []);
  unchanged();
});
test("ACM-017 이미지 교체 후 참조가 없는 기존 관리 파일만 정리한다", async () => {
  scenario.oldUrl = baseUrl + oldPath;
  assert.equal(
    (await call("upsertNewsArticle", news({ id: "2", thumbnail: image() }))).ok,
    true,
  );
  assert.deepEqual(scenario.removals, [oldPath]);
  scenario.removals = [];
  scenario.references = [{ id: 3 }];
  assert.equal(
    (await call("upsertNewsArticle", news({ id: "2", removeThumbnail: "on" })))
      .ok,
    true,
  );
  assert.deepEqual(scenario.removals, []);
});
test("ACM-018 기사 삭제 후 관리 이미지와 캐시를 정리하고 외부 이미지는 삭제하지 않는다", async () => {
  for (const url of [
    baseUrl + oldPath,
    "/images/legacy.png",
    "https://other.example.test/image.png",
    baseUrl + "../other.png",
  ]) {
    scenario.oldUrl = url;
    scenario.removals = [];
    assert.equal((await call("deleteNewsArticle", form({ id: "2" }))).ok, true);
    assert.deepEqual(
      scenario.removals,
      url === baseUrl + oldPath ? [oldPath] : [],
    );
    changed("news_articles");
  }
});
test("ACM-019 이미지 정리 실패는 저장 성공과 구분해서 안내하고 캐시는 갱신한다", async () => {
  scenario.oldUrl = baseUrl + oldPath;
  scenario.removeError = { message: "정리 오류" };
  for (const [name, input] of [
    ["upsertNewsArticle", news({ id: "2", removeThumbnail: "on" })],
    ["deleteNewsArticle", form({ id: "2" })],
  ]) {
    const result = await call(name, input);
    assert.equal(result.ok, true);
    assert.ok(result.warning);
    assert.ok(scenario.events.includes("tag:news_articles"));
  }
});
test("ACM-020 DB 실패와 변경된 행 없음은 성공으로 표시하거나 캐시를 갱신하지 않는다", async () => {
  for (const [name, input] of cases()) {
    scenario.events = [];
    scenario.mutationError = { message: "DB 오류" };
    assert.equal((await call(name, input)).ok, false);
    unchanged();
    scenario.events = [];
    scenario.mutationError = null;
    scenario.missing = true;
    assert.equal((await call(name, input)).ok, false);
    unchanged();
    scenario.missing = false;
  }
});
