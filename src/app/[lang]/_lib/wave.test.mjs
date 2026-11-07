import assert from "node:assert/strict";
import test from "node:test";
import { startWave } from "./wave.ts";

function fixture(t, reducedAtStart = false) {
  const previous = { window: globalThis.window, document: globalThis.document };
  const raf = new Map(),
    mediaListeners = new Set(),
    visibilityListeners = new Set();
  let sequence = 0,
    draws = 0,
    strokes = 0,
    first = [],
    transform = [],
    resized,
    intersected;
  const observers = [];
  const ctx = {
    clearRect() {
      draws++;
      strokes = 0;
      first = [];
    },
    beginPath() {},
    moveTo(x, y) {
      if (!first.length) first = [x, y];
    },
    lineTo() {},
    stroke() {
      strokes++;
    },
    setTransform(...v) {
      transform = v;
    },
  };
  const canvas = {
    dataset: {},
    getContext() {
      return ctx;
    },
    getBoundingClientRect() {
      return { width: 1000, height: 350 };
    },
  };
  const media = {
    matches: reducedAtStart,
    addEventListener(_, fn) {
      mediaListeners.add(fn);
    },
    removeEventListener(_, fn) {
      mediaListeners.delete(fn);
    },
  };
  const document = {
    documentElement: {},
    hidden: false,
    addEventListener(_, fn) {
      visibilityListeners.add(fn);
    },
    removeEventListener(_, fn) {
      visibilityListeners.delete(fn);
    },
  };
  globalThis.document = document;
  globalThis.window = {
    devicePixelRatio: 3,
    getComputedStyle() {
      return {
        getPropertyValue() {
          return "reference";
        },
      };
    },
    matchMedia() {
      return media;
    },
    requestAnimationFrame(fn) {
      const id = ++sequence;
      raf.set(id, fn);
      return id;
    },
    cancelAnimationFrame(id) {
      raf.delete(id);
    },
    ResizeObserver: class {
      constructor(fn) {
        resized = fn;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    },
    IntersectionObserver: class {
      constructor(fn) {
        intersected = fn;
        observers.push(this);
      }
      observe() {}
      disconnect() {
        this.disconnected = true;
      }
    },
  };
  const unmount = startWave(canvas);
  let stopped = false;
  function stop() {
    if (!stopped) {
      stopped = true;
      unmount();
    }
  }
  t.after(() => {
    stop();
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete globalThis[key];
      else globalThis[key] = value;
    }
  });
  return {
    canvas,
    raf,
    mediaListeners,
    visibilityListeners,
    observers,
    stop,
    get draws() {
      return draws;
    },
    get strokes() {
      return strokes;
    },
    get first() {
      return first;
    },
    get transform() {
      return transform;
    },
    step(now) {
      const pending = [...raf.values()];
      raf.clear();
      pending.forEach((fn) => fn(now));
    },
    reduce(value) {
      media.matches = value;
      mediaListeners.forEach((fn) => fn());
    },
    hide(value) {
      document.hidden = value;
      visibilityListeners.forEach((fn) => fn());
    },
    intersect(value) {
      intersected([{ isIntersecting: value }]);
    },
    resize() {
      resized();
    },
  };
}

test("MOT-001 B의 파동 좌표·선 수·12초 합류량과 30fps 제한을 유지한다", (t) => {
  const env = fixture(t);
  // B waves.js를 별도 실행해 얻은 1000×350 기준 첫 좌표다.
  assert.ok(Math.abs(env.first[0] - -12.466540447318764) < 1e-8);
  assert.ok(Math.abs(env.first[1] - 165.61255427460995) < 1e-8);
  assert.equal(env.strokes, 108);
  env.step(1);
  const draws = env.draws;
  env.step(10);
  assert.equal(env.draws, draws);
  for (let now = 101; now <= 6001; now += 100) env.step(now);
  assert.equal(env.canvas.dataset.phase, "1.000");
  assert.ok(Math.abs(env.first[1] - 171.2227425876848) < 1e-8);
  for (let now = 6101; now <= 12001; now += 100) env.step(now);
  assert.equal(env.canvas.dataset.phase, "0.000");
});

test("MOT-002 숨김·화면 밖에서 멈추고 복귀 때 시간 점프와 과도한 경과를 막는다", (t) => {
  const env = fixture(t);
  env.step(1);
  env.step(101);
  const phase = env.canvas.dataset.phase;
  env.hide(true);
  assert.equal(env.raf.size, 0);
  assert.equal(env.canvas.dataset.running, "false");
  env.step(10000);
  assert.equal(env.canvas.dataset.phase, phase);
  env.hide(false);
  env.step(20000);
  assert.equal(env.canvas.dataset.phase, phase);
  env.step(21000);
  assert.equal(env.canvas.dataset.phase, "0.003");
  env.intersect(false);
  assert.equal(env.raf.size, 0);
  env.intersect(true);
  env.step(30000);
  assert.equal(env.canvas.dataset.phase, "0.003");
});

test("MOT-003 동작 줄이기에는 정지 프레임을 그리고 관찰자·이벤트·RAF를 정리한다", (t) => {
  const env = fixture(t, true);
  assert.equal(env.raf.size, 0);
  assert.equal(env.canvas.dataset.running, "false");
  assert.equal(env.canvas.dataset.ready, "true");
  assert.equal(env.canvas.width, 2000);
  assert.equal(env.canvas.height, 700);
  assert.deepEqual(env.transform, [2, 0, 0, 2, 0, 0]);
  env.reduce(false);
  assert.equal(env.raf.size, 1);
  env.stop();
  const draws = env.draws;
  assert.equal(env.raf.size, 0);
  assert.equal(env.mediaListeners.size, 0);
  assert.equal(env.visibilityListeners.size, 0);
  assert.ok(env.observers.every((observer) => observer.disconnected));
  env.intersect(true);
  env.resize();
  assert.equal(env.raf.size, 0);
  assert.equal(env.draws, draws);
});
