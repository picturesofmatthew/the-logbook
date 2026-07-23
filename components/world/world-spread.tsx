"use client";

// The in-world interior — a book (library) or the far shore (docks) opens IN
// PLACE over the world, never a route change, and closing sinks it back to the
// room where you were standing. The reusable room-interior pattern: the shell
// holds which interior is open (by the href its hotspot fires); this draws it.
// v1 shows an evocative title-page bound to the couple's real numbers; a discreet
// deep-link still opens the full page, so nothing is lost while the true in-world
// readers are built.

import { useEffect, useRef } from "react";
import type { LibrarySnapshot } from "./rooms/library-room";
import type { DocksSnapshot } from "./rooms/docks-room";

// what a spread shows, once resolved from the open href + the right snapshot
type SpreadContent = {
  title: string;
  ornament: string; // a gilt mark on the frontispiece
  progress: string;
  line: string;
  deepLabel: string; // the deep-link's label ("read the full book", …)
};

type BookMeta = {
  title: string;
  ornament: string;
  line: string;
  progress: (s: LibrarySnapshot) => string;
};

// the five books, keyed by the href their hotspot fires
const BOOKS: Record<string, BookMeta> = {
  "/book": {
    title: "Book of Days",
    ornament: "❦",
    line: "Every day you both kept, pressed between these pages — the seal, and the two hands that closed it.",
    progress: (s) => `${s.days} ${s.days === 1 ? "day" : "days"} sealed`,
  },
  "/library#legendarium": {
    title: "Legendarium",
    ornament: "✦",
    line: "The seals you have struck together — illuminated forever — and the ones still waiting to be found.",
    progress: (s) => `${s.legendary.got} of ${s.legendary.total} struck`,
  },
  "/library#bestiary": {
    title: "Bestiary",
    ornament: "❧",
    line: "The company that has found your glade — who came, and when they came.",
    progress: (s) => `${s.beasts.got} of ${s.beasts.total} arrived`,
  },
  "/library#apothecary": {
    title: "Apothecary",
    ornament: "✽",
    line: "Every provision you have catalogued — the plain fuel of the work, pressed and named.",
    progress: (s) => `${s.provisions} ${s.provisions === 1 ? "provision" : "provisions"}`,
  },
  "/trends": {
    title: "Almanac",
    ornament: "☾",
    line: "The long arc — the seasons, the moons, the quiet trend of two people showing up.",
    progress: (s) => (s.days ? "the arc, begun" : "the arc awaits"),
  },
};

// the shore the vessel sails toward — resolved from the docks snapshot
function shoreContent(docks: DocksSnapshot): SpreadContent {
  const d = docks.dream;
  return {
    title: d ? d.name : "The Far Shore",
    ornament: "✦", // the speck of gold on the horizon — the star you steer by
    progress: docks.complete
      ? "the shore, reached"
      : d
        ? `${docks.planksLaid} of ${docks.plankGoal} planks`
        : "no Dream named yet",
    line: docks.complete
      ? "You reached it, together — the vessel rests at the shore."
      : d
        ? "The Dream you are sailing toward, plank by plank. Every day you both keep lays another."
        : "Name the far shore you sail toward, and the vessel begins to build.",
    deepLabel: docks.complete ? "stand on the shore" : "look toward the shore",
  };
}

function resolveContent(
  open: string,
  library: LibrarySnapshot,
  docks: DocksSnapshot,
): SpreadContent | null {
  if (open === "/shore") return shoreContent(docks);
  const b = BOOKS[open];
  return b
    ? {
        title: b.title,
        ornament: b.ornament,
        progress: b.progress(library),
        line: b.line,
        deepLabel: "read the full book",
      }
    : null;
}

export function WorldSpread({
  open,
  library,
  docks,
  onClose,
  onDeepLink,
}: {
  /** the open interior's href (a book, or "/shore"), or null when closed */
  open: string | null;
  library: LibrarySnapshot;
  docks: DocksSnapshot;
  onClose: () => void;
  onDeepLink: (href: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const content = open ? resolveContent(open, library, docks) : null;

  // when an interior opens: take focus (so a keyboard user lands in it, and the
  // world's arrow-nav stays quiet), and let Escape close it. Keyed on `open` so
  // it fires once per opening, not every render.
  useEffect(() => {
    if (open === null) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!content || open === null) return null;

  return (
    <div className="world-spread-scrim" onClick={onClose}>
      <div
        className="world-spread"
        role="dialog"
        aria-modal="true"
        aria-label={content.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="world-spread-book">
          {/* the frontispiece — an illuminated ornament */}
          <div className="world-spread-page world-spread-left">
            <span className="world-spread-ornament" aria-hidden>
              {content.ornament}
            </span>
          </div>
          <div className="world-spread-seam" aria-hidden />
          {/* the title page — what this holds, in the couple's real numbers */}
          <div className="world-spread-page world-spread-right">
            <div className="world-spread-progress">{content.progress}</div>
            <h2 className="world-spread-title">{content.title}</h2>
            <p className="world-spread-line">{content.line}</p>
            <button
              type="button"
              className="world-spread-deep"
              onClick={() => onDeepLink(open)}
            >
              {content.deepLabel} <span aria-hidden>❯</span>
            </button>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="world-spread-close"
          onClick={onClose}
        >
          close
        </button>
      </div>
    </div>
  );
}
