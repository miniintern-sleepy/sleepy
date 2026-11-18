import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) =>
  readFileSync(new URL(path, import.meta.url), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
const compact = (value) => value.replace(/\s+/g, "");
test("HOME-003 첫 화면 높이: 기본은 창 높이, 1101px 이상과 휴대폰은 사진 비율을 따른다", () => {
  const home = read("./home.css");
  assert.match(
    home,
    /\.home-hero\s*\{[^}]*height:\s*calc\(clamp\(640px,\s*100svh,\s*900px\)\s*-\s*var\(--header-height\)\);/,
  );
  const zoom = read("../../styles/public.css")
    .match(/zoom:\s*([^;{}]+);/)[1]
    .trim();
  const wide = home.match(
    /@supports\s*\(zoom: min\(1\.7778, tan\(atan2\(100vw, 1440px\)\)\)\)\s*\{\s*@media\s*\(min-width: 1441px\)\s*\{\s*\.home-hero\s*\{([^}]*)\}/,
  );
  assert.ok(wide);
  const height = wide[1].match(/height:\s*([^;]+);/)[1];
  assert.equal(
    compact(height),
    compact(
      `calc(clamp(640px, var(--public-vh) / ${zoom}, 900px) - var(--header-height))`,
    ),
  );
  const mobile = home.match(
    /@media\s*\(max-width: 760px\)\s*\{[\s\S]*?\.home-hero\s*\{([^}]*)\}/,
  );
  assert.ok(mobile);
  // #98: 휴대폰은 글 위·사진 아래로 나누고 사진은 원래 비율을 지킨다(창 높이 기준 금지).
  assert.match(mobile[1], /height:\s*auto;/);
  assert.match(mobile[1], /flex-direction:\s*column;/);
  assert.match(
    home,
    /@media\s*\(max-width: 760px\)\s*\{[\s\S]*?\.home-hero > img\s*\{[^}]*aspect-ratio:\s*4 \/ 3;/,
  );
  // #98: 1101px 이상은 사진 비율로 높이를 정한다.
  assert.match(
    home,
    /@media\s*\(min-width: 1101px\)\s*\{\s*\.home-hero\s*\{[^}]*aspect-ratio:\s*1024 \/ 577;/,
  );
});
