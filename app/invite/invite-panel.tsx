"use client";

import { useState } from "react";
import { makeInvite } from "./actions";

export function InvitePanel() {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function generate() {
    setBusy(true);
    setError(null);
    const res = await makeInvite();
    setBusy(false);
    if (res.error || !res.token) {
      setError(res.error ?? "Couldn't make a link — try again.");
      return;
    }
    setLink(`${window.location.origin}/join?invite=${res.token}`);
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard blocked — the link is on screen to copy by hand.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!link ? (
        <button
          type="button"
          onClick={generate}
          disabled={busy}
          className="wobbly cursor-pointer bg-terracotta py-3 text-lg text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
        >
          {busy ? "conjuring..." : "create an invite link"}
        </button>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-soft">
            Send this to the other keeper. It works once, and fades in a week.
          </p>
          <div className="wobbly-sm break-all border-2 border-ink/20 bg-cream px-3 py-2 text-xs">
            {link}
          </div>
          <button
            type="button"
            onClick={copy}
            className="wobbly-sm cursor-pointer border-2 border-ink/25 bg-cream px-4 py-2 text-sm shadow-card active:scale-[0.98]"
          >
            {copied ? "copied ✓" : "copy link"}
          </button>
        </div>
      )}
      {error ? (
        <p className="text-center text-sm text-terracotta">{error}</p>
      ) : null}
    </div>
  );
}
