import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
test("SCALE-001 확대와 공개 전용 고정값은 지원 조건·1441px 분기 안에서만 적용한다", () => {
  for (const file of ["./public.css", "./tokens.css"]) {
    const css = read(file).replace(/\/\*[\s\S]*?\*\//g, "");
    const rules = [
      ...css.matchAll(
        /@supports\s*\(zoom:\s*min\(1\.7778,\s*tan\(atan2\(100vw,\s*1440px\)\)\)\)\s*\{\s*@media\s*\(min-width:\s*1441px\)\s*\{\s*(\.public-body(?:\s*>\s*\*)?)\s*\{([^{}]*)\}\s*\}\s*\}/g,
      ),
    ];
    assert.equal(rules.length, 1);
    assert.equal((css.match(/\.public-body\b[^{}]*\{/g) || []).length, 1);
    const [, selector, declarations] = rules[0];
    const values = Object.fromEntries(
      [...declarations.matchAll(/([\w-]+)\s*:\s*([^;{}]+);/g)].map(
        ([, name, value]) => [name, value.trim()],
      ),
    );
    if (file === "./public.css") {
      assert.equal(selector, ".public-body > *");
      assert.deepEqual(values, {
        zoom: "min(1.7778, tan(atan2(100vw, 1440px)))",
      });
    } else {
      assert.equal(selector, ".public-body");
      assert.deepEqual(values, {
        "--layout-gutter": "79.92px",
        "--layout-page-side": "147.5px",
        "--layout-page-width": "1145px",
        "--text-detail-heading": "2.97rem",
      });
    }
  }
});
test("SCALE-002 제품의 1700px 전용 궤도 확대 규칙은 없다", () => {
  assert.doesNotMatch(
    read("../app/[lang]/product/product.css"),
    /min-width:\s*1700px/,
  );
});
test("SCALE-003 공개 레이아웃에만 확대 식별자가 있고 관리자는 그대로다", () => {
  assert.match(
    read("../app/[lang]/layout.tsx"),
    /<body className="public-body /,
  );
  assert.doesNotMatch(read("../app/admin/layout.tsx"), /public-body/);
});
