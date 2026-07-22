"use server";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import {
  hmacDigest,
  SESSION_COOKIE,
  signSession,
  timingSafeEqual,
} from "@/lib/auth";

export type EnterState = { error: string } | null;

// Best-effort brute-force brake. Per-instance memory on serverless — a cold
// start forgets, so this slows guessing rather than hard-stopping it. Real
// per-user auth (the v1 track) replaces this wholesale.
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const slot = attempts.get(ip);
  if (!slot || now > slot.resetAt) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  slot.count += 1;
  return slot.count > MAX_ATTEMPTS;
}

export async function enter(
  _prev: EnterState,
  formData: FormData,
): Promise<EnterState> {
  const profile = formData.get("profile");
  const passcode = formData.get("passcode");

  if (typeof profile !== "string" || !profile) {
    return { error: "Pick who you are first." };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (throttled(ip)) {
    return { error: "The door needs a moment. Try again in a little while." };
  }

  const expected = process.env.APP_PASSCODE;
  if (!expected) throw new Error("APP_PASSCODE is not set");
  // HMAC both sides first: constant-time compare with no length leak.
  const ok =
    typeof passcode === "string" &&
    timingSafeEqual(await hmacDigest(passcode), await hmacDigest(expected));
  if (!ok) {
    return { error: "Hmm — that's not the secret word." };
  }
  attempts.delete(ip);

  // Passcode is right — confirm this keeper exists and belongs to a bond. (Real
  // per-user credentials replace the shared passcode in a later phase.)
  const [keeper] = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.id, profile));
  if (!keeper) {
    return { error: "Pick who you are first." };
  }

  const token = await signSession(keeper.id);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/");
}
