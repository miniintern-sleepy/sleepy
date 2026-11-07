import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const sourceRoot = fileURLToPath(new URL("../", import.meta.url));
const tokenFile = fileURLToPath(new URL("tokens.css", import.meta.url));
const legacyColors = `fg fg-muted fg-subtle line line-image line-on-dark surface
surface-muted surface-image surface-dark surface-dark-2 brand-deep brand brand-soft
brand-lavender brand-pale tech-ip tech-spectrum-start tech-spectrum-middle
tech-spectrum-end product-surface product-gradient product-shade product-case-end`
  .split(/\s+/)
  .sort((a, b) => b.length - a.length);
const legacyText =
  `display h1 h2 h3 title body-lg body body-sm caption eyebrow label
button tab tab-base tech-hero tech-heading tech-ip-title tech-metric tech-count
tech-clinical-title tech-spectrum tech-product-name tech-subtitle tech-intro tech-body
tech-metric-label tech-patent tech-list tech-status tech-label tech-detail tech-note
tech-spectrum-en tech-category-en product-hero product-heading product-feature
product-kit-title product-metric product-step product-body product-detail
product-kit-item product-metric-label`
    .split(/\s+/)
    .sort((a, b) => b.length - a.length);

async function sources(directory = sourceRoot) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return sources(path);
      if (!/\.(?:tsx?|css)$/.test(entry.name)) return [];
      return [{ path, content: await readFile(path, "utf8") }];
    }),
  );
  return nested.flat();
}

test("DS-001 공개·관리자 소스에 옛 토큰 선언·사용·별칭이 남지 않는다", async () => {
  const color = new RegExp(
    `(?<![\\w-])(?:--color-|(?:bg|text|border|ring|outline|stroke|fill|from|via|to|decoration|divide|accent)-)(?:${legacyColors.join("|")})(?![\\w-])`,
    "g",
  );
  const textStyle = new RegExp(
    `(?<![\\w-])(?:--text-|text-)(?:${legacyText.join("|")})(?:--(?:line-height|font-weight|letter-spacing))?(?![\\w-])`,
    "g",
  );
  const failures = [];
  for (const { path, content } of await sources()) {
    const found = [
      ...content.matchAll(color),
      ...content.matchAll(textStyle),
      ...content.matchAll(/font-sans|font-noto-sans-kr|next\/font\/google/g),
    ];
    if (found.length)
      failures.push(`${path}: ${found.map((x) => x[0]).join(", ")}`);
  }
  assert.deepEqual(failures, []);
});

test("DS-002 화면에서 색·글자 임의 값 대신 디자인 토큰을 사용한다", async () => {
  const failures = [];
  for (const { path, content } of await sources()) {
    if (path === tokenFile) continue;
    const found = [
      ...content.matchAll(/#[\da-f]{3,8}\b/gi),
      ...content.matchAll(/(?:rgb|hsl)a?\(\s*\d/gi),
      ...content.matchAll(/text-\[(?!var\(--text-)[^\]]+\]/g),
      ...content.matchAll(
        /\b(?:font-size|font-weight|line-height|letter-spacing)\s*:\s*-?(?:\d|\.\d)/g,
      ),
      ...content.matchAll(
        /\b(?:fontSize|fontWeight|lineHeight|letterSpacing)\s*:\s*["']?\d/g,
      ),
    ];
    if (found.length)
      failures.push(`${path}: ${found.map((x) => x[0]).join(", ")}`);
  }
  assert.deepEqual(failures, []);
});

function luminance(hex) {
  const channels = [1, 3, 5].map((start) => {
    const v = parseInt(hex.slice(start, start + 2), 16) / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

test("DS-003 본문·버튼·성공·오류의 실제 토큰 조합은 AA 대비를 충족한다", async () => {
  const css = await readFile(tokenFile, "utf8");
  const colors = Object.fromEntries(
    [...css.matchAll(/--color-([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  );
  const pairs = [
    ["ink", "paper"],
    ["ink", "panel"],
    ["muted", "paper"],
    ["muted", "panel"],
    ["violet", "paper"],
    ["violet", "panel"],
    ["violet-strong", "paper"],
    ["violet-strong", "panel"],
    ["white", "violet-strong"],
    ["error-ink", "paper"],
    ["error-ink", "error-panel"],
    ["success-ink", "paper"],
    ["success-ink", "success-panel"],
  ];
  for (const [text, background] of pairs) {
    assert.ok(
      colors[text] && colors[background],
      `${text}/${background} 토큰 누락`,
    );
    const values = [
      luminance(colors[text]),
      luminance(colors[background]),
    ].sort((a, b) => a - b);
    const contrast = (values[1] + 0.05) / (values[0] + 0.05);
    assert.ok(
      contrast >= 4.5,
      `${text}/${background}: ${contrast.toFixed(2)}:1`,
    );
  }
});
