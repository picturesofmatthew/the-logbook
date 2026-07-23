"use client";

// The in-world book spread — a book opens IN PLACE over the world (never a route
// change), and closing sinks it back to the shelf where you were standing. This
// is the reusable "interior" pattern: the shell holds which book is open (by its
// href), and this draws the opened book. v1 shows an evocative title-page spread
// bound to the real counts; a discreet "read the full book" still deep-links to
// the full page, so nothing is lost while the true in-world reader is built.

import { useEffect, useRef } from "react";
import type { LibrarySnapshot } from "./rooms/library-room";

type BookMeta = {
  title: string;
  ornament: string; // a gilt fleuron on the frontispiece (per-book emblems later)
  line: string;
  progress: (s: LibrarySnapshot) => string;
};

// keyed by the href the book hotspot fires — the shell passes it straight through
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

export function WorldSpread({
  open,
  snapshot,
  onClose,
  onDeepLink,
}: {
  /** the open book's href, or null when the shelf is closed */
  open: string | null;
  snapshot: LibrarySnapshot;
  onClose: () => void;
  onDeepLink: (href: string) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const book = open ? BOOKS[open] : null;

  // when a book opens: take focus (so a keyboard user lands in the spread, and
  // the world's arrow-nav stays quiet), and let Escape close it.
  useEffect(() => {
    if (!book) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [book, onClose]);

  if (!book || open === null) return null;

  return (
    <div className="world-spread-scrim" onClick={onClose}>
      <div
        className="world-spread"
        role="dialog"
        aria-modal="true"
        aria-label={book.title}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="world-spread-book">
          {/* the frontispiece — an illuminated ornament */}
          <div className="world-spread-page world-spread-left">
            <span className="world-spread-ornament" aria-hidden>
              {book.ornament}
            </span>
          </div>
          <div className="world-spread-seam" aria-hidden />
          {/* the title page — what this book holds, in a couple's real numbers */}
          <div className="world-spread-page world-spread-right">
            <div className="world-spread-progress">{book.progress(snapshot)}</div>
            <h2 className="world-spread-title">{book.title}</h2>
            <p className="world-spread-line">{book.line}</p>
            <button
              type="button"
              className="world-spread-deep"
              onClick={() => onDeepLink(open)}
            >
              read the full book <span aria-hidden>❯</span>
            </button>
          </div>
        </div>
        <button
          ref={closeRef}
          type="button"
          className="world-spread-close"
          onClick={onClose}
        >
          close the book
        </button>
      </div>
    </div>
  );
}
