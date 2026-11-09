import { mkdir, writeFile } from "node:fs/promises";

// 메인 wave.ts의 point를 amount=0으로 고정한 좌표다(#60).
function point(u, v, group, phase, width, height) {
  const x = u * 1.15,
    z = (v - 0.5) * 1.75;
  const y =
    Math.sin(u * 7.3 + v * 1.6 - phase + group * 0.7) * 0.55 +
    (group ? -0.31 : 0.31);
  const angle = -0.24;
  const xx = x * Math.cos(angle) - z * Math.sin(angle);
  const zz = x * Math.sin(angle) + z * Math.cos(angle);
  const depth = 1 / (1 + zz * 0.12);
  return [
    width * (0.5 + xx * 0.36 * depth),
    height * (0.5 - y * 0.25 * depth + zz * 0.12),
  ];
}
const directory = new URL("../public/images/hero/", import.meta.url);
await mkdir(directory, { recursive: true });
for (const [name, phase] of [
  ["newsroom", 1],
  ["faq", 3.2],
  ["contact", 5.3],
]) {
  for (const [suffix, width, height] of [
    ["", 1960, 480],
    ["-mobile", 900, 300],
  ]) {
    const paths = [];
    const line = (points, opacity, weight) =>
      paths.push(
        `<path d="${points.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ")}" opacity="${opacity.toFixed(3)}" stroke-width="${weight}"/>`,
      );
    for (let group = 0; group < 2; group++) {
      for (let row = 0; row < 32; row++)
        line(
          Array.from({ length: 111 }, (_, n) =>
            point(n / 55 - 1, row / 31, group, phase, width, height),
          ),
          0.15 + (row / 31) * 0.32,
          0.85,
        );
      for (let col = 0; col < 22; col++)
        line(
          Array.from({ length: 41 }, (_, row) =>
            point(col / 10.5 - 1, row / 40, group, phase, width, height),
          ),
          0.12,
          0.7,
        );
    }
    await writeFile(
      new URL(`wave-${name}${suffix}.svg`, directory),
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" stroke="#7754ab">\n${paths.join("\n")}\n</svg>\n`,
    );
  }
}
