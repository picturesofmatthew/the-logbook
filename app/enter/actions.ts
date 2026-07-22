"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { verifyPassword } from "@/lib/passwords";
import { createSession } from "@/lib/session";

export type EnterState = { error: string } | null;

// Best-effort brute-force brake. Per-instance memory on serverless — a cold
// start forgets, so this slows guessing rather than hard-stopping it. A durable
// limiter is a later hardening step (B4).
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

// A well-formed dummy hash (salt:64-byte-key) so a missing account still runs
// one scrypt verify — equalizing timing so the door doesn't leak which emails
// exist.
const DUMMY_HASH = `${"0".repeat(32)}:${"0".repeat(128)}`;

export async function enter(
  _prev: EnterState,
  formData: FormData,
): Promise<EnterState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = formData.get("password");

  if (!email || typeof password !== "string" || !password) {
    return { error: "Enter your email and secret word." };
  }

  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (throttled(ip)) {
    return { error: "The door needs a moment. Try again in a little while." };
  }

  const [keeper] = await db
    .select({ id: profiles.id, passwordHash: profiles.passwordHash })
    .from(profiles)
    .where(eq(profiles.email, email));

  // Always verify (against the dummy hash when the account/credential is
  // missing) so timing doesn't reveal which emails are registered.
  const ok = await verifyPassword(password, keeper?.passwordHash ?? DUMMY_HASH);
  if (!keeper || !keeper.passwordHash || !ok) {
    return { error: "That email and secret word don't match." };
  }

  attempts.delete(ip);
  await createSession(keeper.id);
  redirect("/");
}
