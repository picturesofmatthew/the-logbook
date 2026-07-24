// THE DOOR — the ground every pre-account page stands on (/enter, /join).
//
// Before tonight these pages were a flat card on flat paper: brand-less, and a
// stranger's first impression of the app was a login box. The world already has
// a front door — the cold-open vista the app opens on (the island, the tower,
// the ONE lamp lit) — so the door reuses it verbatim, dimmed behind a veil, with
// the gilt wordmark over it and the business (a form, a letter) on warm paper in
// the middle. Arriving at signedxsealed.com and arriving in the world are now
// the same picture.

import { OverviewScene, OVERVIEW_VIEWBOX } from "./rooms/overview-scene";

export function DoorGround({
  children,
  wordmark = true,
  footer,
}: {
  children: React.ReactNode;
  /** the gilt wordmark over the vista (off when the panel carries its own head) */
  wordmark?: boolean;
  footer?: React.ReactNode;
}) {
  return (
    <main className="door">
      <div className="door-vista" aria-hidden>
        <svg
          viewBox={`0 0 ${OVERVIEW_VIEWBOX.width} ${OVERVIEW_VIEWBOX.height}`}
          preserveAspectRatio="xMidYMid slice"
          role="img"
          aria-label="The island in a dark sea, the lighthouse rising with its lamp lit, under strung stars."
        >
          <OverviewScene />
        </svg>
      </div>
      <div className="door-veil" aria-hidden />
      <div className="world-grain" aria-hidden />

      <div className="door-panel">
        {wordmark ? (
          <div className="door-wordmark" aria-hidden>
            <span>Signed</span>
            <span className="world-wordmark-x">✕</span>
            <span>Sealed</span>
          </div>
        ) : null}
        {children}
        {footer ? <div className="door-footer">{footer}</div> : null}
      </div>
    </main>
  );
}
