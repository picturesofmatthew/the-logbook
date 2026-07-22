// The grimoire plate — the app's ornate panel, echoing the sigil's gold frame
// (a parchment ground, a gold double-border, cabochon corner-bosses). Wrap any
// card/section in <Plate> and it becomes a page of the same illuminated book.
// Styling lives in globals.css (.plate / .plate-corner / .gilt-heading).

import type { ReactNode } from "react";

export function Plate({
  children,
  className = "",
  corners = true,
  glow = false,
  frameOnly = false,
}: {
  children: ReactNode;
  className?: string;
  corners?: boolean;
  // a soft lantern glow behind the plate — for the surfaces that matter at night
  glow?: boolean;
  // an ornate window: gold border + corners only, no parchment fill (the glade)
  frameOnly?: boolean;
}) {
  return (
    <div className={`plate ${frameOnly ? "frame-only" : ""} ${glow ? "lantern-pool" : ""} ${className}`}>
      {corners ? (
        <>
          <span className="plate-corner tl" aria-hidden />
          <span className="plate-corner tr" aria-hidden />
          <span className="plate-corner bl" aria-hidden />
          <span className="plate-corner br" aria-hidden />
        </>
      ) : null}
      {children}
    </div>
  );
}

// A struck-not-typed section heading: the title flanked by a fading gold rule
// with a small star pip. Pass the star via children or use the default.
export function GiltHeading({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <h2 className={`gilt-heading ${className}`}>{children}</h2>;
}
