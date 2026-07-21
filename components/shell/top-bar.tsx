"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted } from "@/lib/sounds";
import { GladeRune } from "./rune-icons";

const chip =
  "flex items-center gap-2 border-[1.5px] border-ink/25 bg-cream/70 px-2.5 py-1.5 text-ink shadow-[0_1px_0_rgba(74,59,42,0.15)] transition-all hover:border-ink/40 active:scale-[0.97]";

export function TopBar({
  name,
  dateLabel,
}: {
  name: string;
  dateLabel: string;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  // Muted lives in localStorage; subscribe so the label stays in sync and
  // server-renders as muted (true) to avoid a hydration mismatch.
  const muted = useSyncExternalStore(subscribeMuted, isMuted, () => true);

  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-30 mx-auto flex max-w-md items-center justify-between p-3 [view-transition-name:top-bar]">
      {/* return to the glade, from anywhere */}
      <Link
        href="/"
        transitionTypes={["nav-home"]}
        aria-label="Return to the glade"
        className={`${chip} rounded-[16px_8px_14px_8px/8px_14px_8px_16px] cursor-pointer`}
      >
        <GladeRune size={20} />
        <span className="font-display text-[9.5px] uppercase tracking-widest">
          glade
        </span>
      </Link>

      {/* profile — tap for settings */}
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen((v) => !v);
          }}
          className={`${chip} rounded-[8px_16px_8px_14px/14px_8px_16px_8px] cursor-pointer`}
        >
          <span className="text-right leading-none">
            <span className="block font-display text-[10.5px] uppercase tracking-wide">
              {name}
            </span>
            <span className="mt-0.5 block text-[9.5px] text-ink-soft">
              {dateLabel}
            </span>
          </span>
          <span className="grid h-[30px] w-[30px] place-items-center rounded-full border-2 border-ink/40 bg-[radial-gradient(circle_at_40%_35%,var(--color-terracotta-soft),var(--color-terracotta))] font-display text-sm text-cream">
            {name.slice(0, 1)}
          </span>
        </button>

        {menuOpen ? (
          <div className="absolute right-0 top-[calc(100%+6px)] w-52 rounded-[14px_8px_14px_8px] border-[1.5px] border-ink/25 bg-paper p-2 shadow-card">
            <Link
              href="/settings"
              onClick={() => setMenuOpen(false)}
              className="block cursor-pointer px-2.5 py-2 text-sm text-ink hover:text-terracotta"
            >
              Profile &amp; targets
            </Link>
            <button
              type="button"
              onClick={() => setMuted(!muted)}
              className="w-full cursor-pointer border-t border-ink/10 px-2.5 py-2 text-left text-sm text-ink hover:text-terracotta"
            >
              Sound: {muted ? "off" : "on"}
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
