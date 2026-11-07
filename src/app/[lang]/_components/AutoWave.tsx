"use client";
import { useEffect, useRef } from "react";
import { startWave } from "../_lib/wave";

export default function AutoWave() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (ref.current) return startWave(ref.current);
  }, []);
  return (
    <div className="home-wave">
      <canvas
        ref={ref}
        role="img"
        aria-label="두 소리의 파동이 물결처럼 흐르며 하나로 모였다가 다시 멀어지는 모습"
      />
    </div>
  );
}
