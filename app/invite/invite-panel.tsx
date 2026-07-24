"use client";

// Writing the letter. The invite is the growth engine — the half-lit seal you
// SEND is the acquisition unit — so this is not a "generate link" button: you
// write one line, you press the seal, and what comes out is a letter that
// unfurls for them (app/join). The transport stays a $0 share link.

import { useState } from "react";
import { SUMMONS_MAX } from "@/lib/invites";
import { ritualChime } from "@/lib/sounds";
import { makeInvite } from "./actions";

export function InvitePanel() {
  const [message, setMessage] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  async function press() {
    setBusy(true);
    setError(null);
    const res = await makeInvite({ message });
    setBusy(false);
    if (res.error || !res.token) {
      setError(res.error ?? "Couldn't press the seal — try again.");
      return;
    }
    ritualChime();
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

  // On a phone this is the real send: hand the letter to whatever they already
  // use. Falls back to copy where the API doesn't exist.
  const canShare = typeof navigator !== "undefined" && !!navigator.share;
  async function send() {
    if (!link) return;
    try {
      await navigator.share({
        title: "signed × sealed",
        text: message.trim() || "keep the light with me",
        url: link,
      });
    } catch {
      // Dismissed or unsupported — the link is still on screen.
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {!link ? (
        <>
          <label className="flex flex-col gap-1.5">
            <span className="font-display text-[10px] tracking-wide text-ink-soft">
              THE LINE YOU SEND
            </span>
            <textarea
              value={message}
              maxLength={SUMMONS_MAX}
              rows={2}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="keep the light with me"
              className="wobbly-sm resize-none border-2 border-ink/30 bg-cream px-3 py-2 text-sm outline-none focus:border-violet"
            />
            <span className="text-[11px] italic text-ink-soft">
              they read this when the letter unfurls — one line is plenty
            </span>
          </label>
          <button
            type="button"
            onClick={press}
            disabled={busy}
            className="wobbly cursor-pointer bg-terracotta py-3 text-lg text-cream shadow-card transition-all active:translate-y-0.5 active:shadow-pressed disabled:opacity-60"
          >
            {busy ? "pressing the seal..." : "press the seal"}
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-ink-soft">
            The letter is sealed. Send it to the other keeper — it opens once,
            and fades in a week.
          </p>
          <div className="wobbly-sm break-all border-2 border-ink/20 bg-cream px-3 py-2 text-xs">
            {link}
          </div>
          <div className="flex gap-2">
            {canShare ? (
              <button
                type="button"
                onClick={send}
                className="wobbly-sm flex-1 cursor-pointer border-2 border-violet bg-cream px-4 py-2 text-sm text-violet shadow-card active:scale-[0.98]"
              >
                send the letter
              </button>
            ) : null}
            <button
              type="button"
              onClick={copy}
              className="wobbly-sm flex-1 cursor-pointer border-2 border-ink/25 bg-cream px-4 py-2 text-sm shadow-card active:scale-[0.98]"
            >
              {copied ? "copied ✓" : "copy link"}
            </button>
          </div>
        </div>
      )}
      {error ? (
        <p className="text-center text-sm text-terracotta">{error}</p>
      ) : null}
    </div>
  );
}
