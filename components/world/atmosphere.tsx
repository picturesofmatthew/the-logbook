"use client";

// The World Engine — Atmosphere renderer.
//
// The proto's <canvas> "breath" (embers, sigil-motes, dust, and the warm
// flicker-glows of fire/candle/lantern), lifted verbatim in behavior but driven
// entirely by an AtmosphereConfig so every room reuses it. Engineering kept from
// the proof: SCENE-SPACE coordinates (registered at any viewport via the same
// xMidYMid-meet scale as the SVG), DPR capped at 2, one requestAnimationFrame,
// pause on tab-hide, and a prefers-reduced-motion still-frame path.
//
// Stillness is the resting state; this layer is only the drift and the warmth.

import { useEffect, useImperativeHandle, useRef } from "react";
import type {
  AtmosphereConfig,
  AtmosphereHandle,
  Emitter,
  RGB,
} from "./atmosphere-config";

type Particle = {
  e: number; // emitter index (to reseed in place)
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
  r: number;
  a: number;
  c: RGB;
  wob: number;
  wph: number;
  twinkle: boolean;
  tw: number;
  ph: number;
};

const rnd = (a: number, b: number) => a + Math.random() * (b - a);
const pick = <T,>(arr: T[]): T => arr[(Math.random() * arr.length) | 0];

export function Atmosphere({
  config,
  handleRef,
  className,
}: {
  config: AtmosphereConfig;
  handleRef?: React.Ref<AtmosphereHandle>;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Keep the engine's imperative burst reachable from the ref without
  // re-running the effect: the effect writes it, the handle reads it.
  const burstRef = useRef<AtmosphereHandle["burst"]>(() => {});

  useImperativeHandle(
    handleRef,
    () => ({ burst: (x, y, kind, count) => burstRef.current(x, y, kind, count) }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const VW = config.viewBox.width;
    const VH = config.viewBox.height;
    const emitters = config.emitters;
    const prm = window.matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0,
      H = 0,
      S = 1,
      OX = 0,
      OY = 0,
      DPR = 1;
    let raf = 0;
    let last = 0;

    // ── weighted emitter table ──
    const totalWeight = emitters.reduce((s, e) => s + e.weight, 0) || 1;
    function emitterForSlot(i: number, n: number): number {
      const t = (i / n) * totalWeight;
      let acc = 0;
      for (let e = 0; e < emitters.length; e++) {
        acc += emitters[e].weight;
        if (t < acc) return e;
      }
      return emitters.length - 1;
    }

    // ── seed one particle from its emitter ──
    function seed(
      p: Particle,
      ei: number,
      burst: boolean,
      cx?: number,
      cy?: number,
    ): Particle {
      const e: Emitter = emitters[ei];
      p.e = ei;
      p.age = 0;

      const useAlt = !!e.alt && !burst && Math.random() < e.alt.chance;
      if (useAlt && e.alt) {
        p.x = rnd(e.alt.x[0], e.alt.x[1]);
        p.y = rnd(e.alt.y[0], e.alt.y[1]);
      } else if (e.spawn.type === "rect") {
        p.x = rnd(e.spawn.x[0], e.spawn.x[1]);
        p.y = rnd(e.spawn.y[0], e.spawn.y[1]);
      } else {
        const s = e.spawn;
        const ox = cx ?? s.cx;
        const oy = cy ?? s.cy;
        const an = rnd(0, Math.PI * 2);
        const rr =
          burst && s.burstR ? rnd(s.burstR[0], s.burstR[1]) : rnd(s.r[0], s.r[1]);
        p.x = ox + Math.cos(an) * rr;
        p.y = oy + Math.sin(an) * rr * (s.yScale ?? 1);
      }

      p.vx = rnd(e.vx[0], e.vx[1]);
      if (e.vxFromCenter) p.vx += (p.x - e.vxFromCenter.cx) * e.vxFromCenter.factor;
      const vyR = burst && e.vyBurst ? e.vyBurst : e.vy;
      p.vy = rnd(vyR[0], vyR[1]);

      p.life = rnd(e.life[0], e.life[1]);
      p.r = rnd(e.radius[0], e.radius[1]);
      p.a = rnd(e.alpha[0], e.alpha[1]);
      p.c = pick(e.colors);
      p.twinkle = !!e.twinkle;
      p.tw = rnd(2, 5);
      p.ph = rnd(0, 6.28);
      const wob = e.wobble ?? [0.6, 2.2];
      p.wob = rnd(wob[0], wob[1]);
      p.wph = rnd(0, 6.28);
      return p;
    }

    let P: Particle[] = [];
    function fillPool() {
      const area = W * H;
      const density = config.density ?? 22000;
      const total = Math.max(
        config.minParticles ?? 36,
        Math.min(config.maxParticles ?? 84, Math.round(area / density)),
      );
      P = [];
      for (let i = 0; i < total; i++) {
        const ei = emitterForSlot(i, total);
        const p = seed({} as Particle, ei, false);
        p.age = rnd(0, p.life); // desynchronise
        P.push(p);
      }
    }

    function resize() {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = Math.round(W * DPR);
      canvas!.height = Math.round(H * DPR);
      S = Math.min(W / VW, H / VH);
      OX = (W - VW * S) / 2;
      OY = (H - VH * S) / 2;
      if (prm.matches) drawStatic();
    }

    function glow(x: number, y: number, r: number, c: RGB, a: number) {
      if (a <= 0.004) return;
      const g = ctx!.createRadialGradient(x, y, 0, x, y, r);
      const rgb = c[0] + "," + c[1] + "," + c[2];
      g.addColorStop(0, "rgba(" + rgb + "," + a.toFixed(3) + ")");
      g.addColorStop(1, "rgba(" + rgb + ",0)");
      ctx!.fillStyle = g;
      ctx!.beginPath();
      ctx!.arc(x, y, r, 0, 6.2832);
      ctx!.fill();
    }

    function drawAmbience(t: number, live: boolean) {
      for (const gl of config.glows) {
        let a = gl.alpha;
        if (live && gl.flicker) {
          const { amp, freq, phase = 0 } = gl.flicker;
          // a slow multi-sine breath, centered on the resting alpha — warm,
          // never strobing (the fire dips and swells, it doesn't blink)
          const f =
            0.34 * Math.sin(t * freq + phase) +
            0.16 * Math.sin(t * freq * 1.87 + phase + 1.2);
          a += amp * f;
        }
        glow(gl.x, gl.y, gl.r, gl.color, a);
      }
    }

    function toSceneTransform() {
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      ctx!.clearRect(0, 0, W, H);
      ctx!.setTransform(S * DPR, 0, 0, S * DPR, OX * DPR, OY * DPR);
    }

    function frame(now: number) {
      raf = requestAnimationFrame(frame);
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;
      const t = now / 1000;

      toSceneTransform();
      drawAmbience(t, true);

      for (let i = 0; i < P.length; i++) {
        const p = P[i];
        p.age += dt;
        if (p.age >= p.life) {
          seed(p, p.e, false);
          continue;
        }
        p.x += (p.vx + Math.sin(t * p.wob + p.wph) * 6) * dt;
        p.y += p.vy * dt;
        const k = p.age / p.life;
        let al = p.a * Math.sin(Math.PI * Math.min(1, k)); // fade in, fade out
        if (p.twinkle) al *= 0.7 + 0.3 * Math.sin(t * p.tw + p.ph);
        if (al <= 0.004) continue;
        ctx!.fillStyle =
          "rgba(" + p.c[0] + "," + p.c[1] + "," + p.c[2] + "," + al.toFixed(3) + ")";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx!.fill();
      }
    }

    // reduced motion: one still, warm frame — the room at rest
    function drawStatic() {
      toSceneTransform();
      drawAmbience(0, false);
      const n = Math.min(16, Math.max(8, emitters.length * 5));
      for (let i = 0; i < n; i++) {
        const ei = emitterForSlot(i, n);
        const p = seed({} as Particle, ei, false);
        ctx!.fillStyle =
          "rgba(" +
          p.c[0] +
          "," +
          p.c[1] +
          "," +
          p.c[2] +
          "," +
          (p.a * 0.5).toFixed(3) +
          ")";
        ctx!.beginPath();
        ctx!.arc(p.x, p.y - rnd(0, 60), p.r, 0, 6.2832);
        ctx!.fill();
      }
    }

    function start() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      if (prm.matches) {
        drawStatic();
        return;
      }
      fillPool();
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    // burst — spark particles of `kind` around a scene point (an interaction)
    burstRef.current = (x, y, kind, count) => {
      if (prm.matches) return;
      const ei = emitters.findIndex((e) => e.kind === kind);
      if (ei < 0 || !P.length) return;
      for (let i = 0; i < count; i++) {
        const p = P[(Math.random() * P.length) | 0];
        if (p) seed(p, ei, true, x, y);
      }
    };

    function onResize() {
      resize();
      if (!prm.matches && !raf) start();
    }
    function onVisibility() {
      if (document.hidden) {
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
      } else {
        start();
      }
    }
    function onMotionChange() {
      resize();
      start();
    }

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    prm.addEventListener?.("change", onMotionChange);

    resize();
    start();

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      prm.removeEventListener?.("change", onMotionChange);
      burstRef.current = () => {};
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
