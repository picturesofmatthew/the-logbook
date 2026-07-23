"use client";

// The World Engine — RoomStage.
//
// The reusable, full-viewport, dvh-safe, center-anchored container every room
// drops into (WORLD-ENGINE.md: stage / scene / layer-far·mid·heart + the
// whisper pointer-parallax). It scales the room's SVG viewBox to fit
// (xMidYMid-meet), gives the three planes their parallax, mounts the shared
// Atmosphere canvas in the SAME scene-space, and lays the grain, the warm-dark
// vignette, and the foot inscription over the top. Rooms author art; this
// authors the room.

import { useRef } from "react";
import type { AtmosphereHandle } from "./atmosphere-config";
import { Atmosphere } from "./atmosphere";
import { DEFAULT_PARALLAX, type Hotspot, type Room } from "./room";

// CSS custom properties (the parallax depths + live offsets) alongside the
// standard style props.
type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

export function RoomStage({
  room,
  atmosphereRef,
  onScenePress,
  className,
  children,
}: {
  room: Room;
  atmosphereRef?: React.Ref<AtmosphereHandle>;
  /** a press inside the scene — with the hotspot it landed in, if any. */
  onScenePress?: (pt: { x: number; y: number }, hotspot: Hotspot | null) => void;
  className?: string;
  children?: React.ReactNode;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduced = useRef(false);
  const { width: VW, height: VH } = room.viewBox;
  const par = room.parallax ?? DEFAULT_PARALLAX;

  // scene-space transform for the current viewport (mirrors the SVG's
  // xMidYMid-meet fit and the Atmosphere's canvas mapping).
  function toScene(clientX: number, clientY: number) {
    const el = stageRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const S = Math.min(rect.width / VW, rect.height / VH);
    const OX = (rect.width - VW * S) / 2;
    const OY = (rect.height - VH * S) / 2;
    return {
      x: (clientX - rect.left - OX) / S,
      y: (clientY - rect.top - OY) / S,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (reduced.current) return;
    const el = stageRef.current;
    if (!el) return;
    const px = Math.max(-1, Math.min(1, (e.clientX / window.innerWidth - 0.5) * 2));
    const py = Math.max(-1, Math.min(1, (e.clientY / window.innerHeight - 0.5) * 2));
    el.style.setProperty("--px", px.toFixed(4));
    el.style.setProperty("--py", py.toFixed(4));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (!onScenePress) return;
    const pt = toScene(e.clientX, e.clientY);
    if (!pt) return;
    let hit: Hotspot | null = null;
    for (const h of room.hotspots ?? []) {
      const dx = pt.x - h.x;
      const dy = pt.y - h.y;
      if (dx * dx + dy * dy <= h.r * h.r) {
        hit = h;
        break;
      }
    }
    onScenePress(pt, hit);
  }

  // sync the reduced-motion flag once on mount (a ref callback avoids an effect)
  const setStage = (el: HTMLDivElement | null) => {
    stageRef.current = el;
    if (el && typeof window !== "undefined") {
      reduced.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
    }
  };

  const layerStyle = (depth: readonly [number, number]): CSSVars => ({
    "--dx": depth[0],
    "--dy": depth[1],
  });

  return (
    <div
      ref={setStage}
      className={`world-stage ${className ?? ""}`}
      style={{ "--px": 0, "--py": 0 } as CSSVars}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
    >
      <svg
        className="world-scene"
        viewBox={`0 0 ${VW} ${VH}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={room.ariaLabel}
      >
        {room.defs}
        <g className="world-layer-far" style={layerStyle(par.far)}>
          {room.layers.far}
        </g>
        <g className="world-layer-mid" style={layerStyle(par.mid)}>
          {room.layers.mid}
        </g>
        <g className="world-layer-heart" style={layerStyle(par.heart)}>
          {room.layers.heart}
        </g>
      </svg>

      <Atmosphere
        config={room.atmosphere}
        handleRef={atmosphereRef}
        className="world-air"
      />

      <div className="world-grain" aria-hidden="true" />
      <div className="world-vignette" aria-hidden="true" />

      {room.inscription ? (
        <div className="world-inscription">
          <div className="world-eyebrow">{room.inscription.eyebrow}</div>
          <div className="world-line">{room.inscription.line}</div>
        </div>
      ) : null}

      {children}
    </div>
  );
}
