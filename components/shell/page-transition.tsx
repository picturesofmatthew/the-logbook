"use client";

import { ViewTransition } from "react";

// A stable ViewTransition wrapping the routed page. On navigation Next runs the
// transition and React applies an animation class to this group's snapshots
// based on the navigation's transitionType (set on each Link):
//   · nav-back → flip-back  (turn the page toward the front)
//   · nav-home → bloom-home (close the book; the glade blooms back)
//   · anything else (nav-forward / untyped) → flip-fwd (deeper into the book)
// The keyframes live in globals.css; the top bar and ribbon are pinned by their
// own view-transition-name, so only the page turns inside the chrome.
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      default="flip-fwd"
      update={{
        "nav-back": "flip-back",
        "nav-home": "bloom-home",
        default: "flip-fwd",
      }}
    >
      {children}
    </ViewTransition>
  );
}
