/** B waves.js의 좌표·시간 진행을 유지하며 React 수명에 맞춰 관찰자를 정리한다. */
export function startWave(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  let width = 0,
    height = 0,
    scale = 1,
    elapsed = 0,
    last = 0,
    frame = 0,
    visible = true,
    active = true;
  const color = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--color-violet")
    .trim();
  const paused = () => reduced.matches || document.hidden || !visible;

  function draw() {
    if (!ctx || !active) return;
    ctx.clearRect(0, 0, width, height);
    const phase = elapsed * 0.00065;
    const amount = (1 - Math.cos((elapsed / 12000) * Math.PI * 2)) / 2;
    function point(u: number, v: number, group: number): [number, number] {
      const x = u * 1.15,
        z = (v - 0.5) * 1.75;
      const y =
        Math.sin(u * 7.3 + v * 1.6 - phase + group * 0.7 * (1 - amount)) *
          (0.55 * (1 - amount) +
            amount * (0.16 + 0.42 * Math.cos(u * 2.4 - phase * 0.3))) +
        (group ? -0.31 : 0.31) * (1 - amount);
      const angle = -0.24,
        xx = x * Math.cos(angle) - z * Math.sin(angle);
      const zz = x * Math.sin(angle) + z * Math.cos(angle),
        depth = 1 / (1 + zz * 0.12);
      return [
        width * (0.5 + xx * 0.36 * depth),
        height * (0.5 - y * 0.25 * depth + zz * 0.12),
      ];
    }
    function line(points: [number, number][], alpha: number, weight: number) {
      if (!ctx) return;
      ctx.beginPath();
      ctx.globalAlpha = alpha;
      ctx.lineWidth = weight * scale;
      ctx.strokeStyle = color;
      points.forEach((p, i) => (i ? ctx.lineTo(...p) : ctx.moveTo(...p)));
      ctx.stroke();
    }
    for (let group = 0; group < 2; group++) {
      const opacity = group ? 1 - amount * 0.75 : 1;
      for (let row = 0; row < 32; row++) {
        const points: [number, number][] = [];
        for (let n = 0; n <= 110; n++)
          points.push(point(n / 55 - 1, row / 31, group));
        line(points, (0.15 + (row / 31) * 0.32) * opacity, 0.85);
      }
      for (let col = 0; col < 22; col++) {
        const points: [number, number][] = [];
        for (let row = 0; row <= 40; row++)
          points.push(point(col / 10.5 - 1, row / 40, group));
        line(points, 0.12 * opacity, 0.7);
      }
    }
    ctx.globalAlpha = 1;
    canvas.dataset.phase = amount.toFixed(3);
    canvas.dataset.ready = "true";
  }
  function tick(now: number) {
    frame = 0;
    if (!active || paused()) {
      last = 0;
      return;
    }
    if (!last || now - last >= 1000 / 30) {
      if (last) elapsed += Math.min(now - last, 100);
      last = now;
      draw();
    }
    frame = window.requestAnimationFrame(tick);
  }
  function sync() {
    if (!active) return;
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    last = 0;
    canvas.dataset.running = String(!paused());
    if (!paused()) frame = window.requestAnimationFrame(tick);
    else draw();
  }
  function resize() {
    if (!active || !ctx) return;
    const box = canvas.getBoundingClientRect(),
      dpr = Math.min(window.devicePixelRatio || 1, 2);
    scale = canvas.offsetWidth ? box.width / canvas.offsetWidth : 1;
    width = box.width;
    height = box.height;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }
  const resizeObserver = new window.ResizeObserver(resize);
  const intersectionObserver = new window.IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    sync();
  });
  resizeObserver.observe(canvas);
  intersectionObserver.observe(canvas);
  // 이유: zoom만 바뀌면 캔버스의 CSS 폭(1000px)이 그대로라 ResizeObserver가 울리지 않는다.
  // 2560→1920px에서 WebKit·Chromium 모두 버퍼가 3556으로 남았다(기대 2667, 2026-11-09, #62).
  window.addEventListener("resize", resize);
  reduced.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  resize();
  sync();
  return () => {
    active = false;
    if (frame) window.cancelAnimationFrame(frame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    window.removeEventListener("resize", resize);
    reduced.removeEventListener("change", sync);
    document.removeEventListener("visibilitychange", sync);
  };
}
