import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { technologyCopy } from "../../../content/ko/technology.ts";
import { companyCopy } from "../../../content/ko/company.ts";
const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
test("TECH-001 교수·임상 링크는 확정 주소와 공통 새 창 안내를 쓴다", () => {
  assert.deepEqual(
    companyCopy.ceo.links.map((x) => x.href),
    [
      "https://www.snuh.org/blog/65626/philosophy.do",
      "https://snu.elsevierpure.com/en/persons/y-seo-7/",
    ],
  );
  assert.equal(
    technologyCopy.clinical.moreHref,
    "https://www.ncbi.nlm.nih.gov/sites/myncbi/1JEcj2X0fdP/collections/68016625/public/",
  );
  const common = read("../../../components/ui/ExternalLink.tsx");
  assert.match(common, /target="_blank"/);
  assert.match(common, /rel="noopener noreferrer"/);
  assert.match(common, /새 창/);
  assert.match(
    read("../../../components/ui/ExternalLinks.tsx"),
    /href.startsWith\("https:\/\/"\)/,
  );
  assert.match(read("./_components/ClinicalSection.tsx"), /<ExternalLinks/);
  assert.match(read("../company/_components/CeoSection.tsx"), /<ExternalLinks/);
});
test("TECH-002 영상 두 개는 시작 시각을 보존하고 임상연구와 특허 사이에 놓인다", () => {
  assert.deepEqual(
    technologyCopy.video.items.map((x) => x.href),
    [
      "https://www.youtube.com/watch?v=hVidH-v1SwM",
      "https://www.youtube.com/watch?v=iuWn5CnKjQ0&t=1094s",
    ],
  );
  assert.equal(
    technologyCopy.clinical.metric.label,
    "전신마취 유도 시 프로포폴 요구량",
  );
  const page = read("./page.tsx");
  assert.ok(page.indexOf("<ClinicalSection") < page.indexOf("<VideoSection"));
  assert.ok(page.indexOf("<VideoSection") < page.indexOf("<PatentsSection"));
  const video = read("./_components/VideoSection.tsx");
  assert.match(video, /<ExternalLink/);
  assert.match(video, /<svg/);
  assert.match(video, /aria-hidden="true"/);
  assert.match(video, /width=\{640\}/);
  assert.match(video, /height=\{480\}/);
  assert.doesNotMatch(video, /▶/);
  assert.equal("videos" in companyCopy.easyTech, false);
  assert.doesNotMatch(
    read("../company/_components/EasyTechSection.tsx"),
    /copy.videos/,
  );
});
