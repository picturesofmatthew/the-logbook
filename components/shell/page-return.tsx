"use client";

// The way back, on the pages that aren't the world yet.
//
// The old screen-app chrome (a top bar with a profile chip, a five-tab ribbon)
// is retired: the world IS the navigation now — you cross the island, and a room
// opens the page it holds. But the pages a hotspot opens still need one honest
// way home, so they get this and nothing else: a line back to the lighthouse,
// and the keeper's key. It hides itself on `/`, which is the world.

import Link from "next/link";
import { usePathname } from "next/navigation";

export function PageReturn() {
  const pathname = usePathname();
  if (pathname === "/") return null;
  return (
    <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
      <Link
        href="/"
        className="font-display text-[11px] tracking-[0.14em] text-ink-soft transition-colors hover:text-terracotta"
      >
        ← back to the lighthouse
      </Link>
      {pathname.startsWith("/settings") ? null : (
        <Link
          href="/settings"
          className="font-display text-[10px] tracking-[0.14em] text-ink-soft/70 transition-colors hover:text-terracotta"
        >
          the keeper&apos;s key
        </Link>
      )}
    </div>
  );
}
