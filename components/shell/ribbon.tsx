"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookRune,
  GladeRune,
  HearthRune,
  LibraryRune,
  QuillRune,
  TrendsRune,
} from "./rune-icons";
import { useShell } from "./shell-provider";

// The ribbon reads as two clusters around the quill: the PLACES you inhabit
// (the hearth, the glade) and the ARCHIVE you keep (the Compendium's books).
const LEFT = [
  { href: "/hearth", label: "hearth", Rune: HearthRune },
  { href: "/", label: "glade", Rune: GladeRune },
] as const;

const RIGHT = [
  { href: "/library", label: "library", Rune: LibraryRune },
  { href: "/book", label: "spellbook", Rune: BookRune },
  { href: "/trends", label: "almanac", Rune: TrendsRune },
] as const;

// The book's page order — used to turn forward (deeper) or back (toward the
// front) depending on where you are. The hearth is index 0 (home — canon).
const ORDER = ["/hearth", "/", "/library", "/book", "/trends"];

function directionType(pathname: string, href: string): string {
  const from = ORDER.indexOf(pathname);
  const to = ORDER.indexOf(href);
  return from === -1 || to > from ? "nav-forward" : "nav-back";
}

function Tab({
  href,
  label,
  Rune,
  active,
  transitionType,
}: {
  href: string;
  label: string;
  Rune: (p: { size?: number }) => React.ReactElement;
  active: boolean;
  transitionType: string;
}) {
  return (
    <Link
      href={href}
      transitionTypes={[transitionType]}
      className="flex flex-col items-center gap-1 transition-transform active:scale-95"
    >
      <span
        className={`carve grid h-9 w-9 place-items-center ${
          active ? "text-terracotta" : "text-ink-soft"
        }`}
      >
        <Rune size={22} />
      </span>
      <span
        className={`font-display text-[10px] uppercase tracking-wide ${
          active ? "text-terracotta" : "text-ink-soft"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

export function Ribbon() {
  const pathname = usePathname();
  const { openCapture } = useShell();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto flex h-[70px] max-w-md items-center border-t-2 border-ink/20 bg-paper px-2 [view-transition-name:ribbon]">
      {/* PLACES — the rooms you inhabit, left of the quill */}
      <div className="flex flex-1 items-center justify-around">
        {LEFT.map((t) => (
          <Tab
            key={t.href}
            {...t}
            active={pathname === t.href}
            transitionType={directionType(pathname, t.href)}
          />
        ))}
      </div>

      {/* reserve the center for the quill, which floats absolutely so an odd
          tab count never shoves it off the axis */}
      <span className="w-16 shrink-0" aria-hidden />

      {/* ARCHIVE — the Compendium's books, right of the quill */}
      <div className="flex flex-1 items-center justify-around">
        {RIGHT.map((t) => (
          <Tab
            key={t.href}
            {...t}
            active={pathname === t.href}
            transitionType={directionType(pathname, t.href)}
          />
        ))}
      </div>

      <button
        type="button"
        onClick={() => openCapture()}
        aria-label="Log food or a workout"
        className="absolute left-1/2 -top-6 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1"
      >
        <span className="grid h-14 w-14 place-items-center rounded-full border-[3px] border-cream bg-[radial-gradient(circle_at_42%_34%,var(--color-gold),var(--color-terracotta))] text-cream shadow-card">
          <QuillRune size={26} />
        </span>
        <span className="font-display text-[10px] uppercase tracking-wide text-terracotta">
          log
        </span>
      </button>
    </nav>
  );
}
