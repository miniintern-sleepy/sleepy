import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
const read = (path) =>
  readFileSync(new URL(path, import.meta.url), "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
const compact = (value) => value.replace(/\s+/g, "");
test("HOME-003 PC는 공개 배율로 나눈 창 높이에서 머리말을 빼고 모바일 높이는 유지한다", () => {
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
  assert.match(
    mobile[1],
    /height:\s*clamp\(560px,\s*100dvh,\s*calc\(640px \+ var\(--header-height-small\)\)\);/,
  );
});
