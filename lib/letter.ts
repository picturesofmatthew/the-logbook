// THE LETTER — the pure half of the invite.
//
// Split out from lib/invites deliberately: that module mints and redeems tokens,
// so it imports node:crypto and the database and can only ever run on the
// server. The compose UI is a client component and needs the same length law the
// server enforces — importing it from lib/invites dragged the whole server
// module into the browser bundle (which is exactly how /invite started throwing
// "the ink smudged"). Anything both sides need lives here, and stays pure.

// The summons line pressed into the letter: one line, not an essay.
export const SUMMONS_MAX = 200;

export function summonsLine(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  const oneLine = raw.replace(/\s+/g, " ").trim();
  return oneLine ? oneLine.slice(0, SUMMONS_MAX) : null;
}

// A stable visual seed for a bond's letter — the same bond always presses the
// same seal. (Not a secret: it only picks which flecks fall where.)
export function letterSeed(bondId: string): number {
  let hash = 0;
  for (const ch of bondId) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return hash;
}
