"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bonds, familiar, profiles } from "@/db/schema";
import { redeemInvite } from "@/lib/invites";
import { hashPassword } from "@/lib/passwords";
import { createSession } from "@/lib/session";

export type JoinState = { error: string } | null;

const KINDS = ["couple", "gym_partners", "friends"] as const;
type Kind = (typeof KINDS)[number];

function validEmail(e: string): boolean {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
}

// Signup — two paths on the same form. With an invite token, join that bond's
// ember slot. Without one, start a new bond as moss and provision its familiar.
export async function signup(
  _prev: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "")
    .trim()
    .slice(0, 40);
  const invite = String(formData.get("invite") ?? "").trim();
  const kindRaw = String(formData.get("kind") ?? "couple");

  if (!validEmail(email)) return { error: "That email doesn't look right." };
  if (password.length < 8) {
    return { error: "Your secret word needs at least 8 characters." };
  }
  if (!displayName) return { error: "What should we call you?" };

  // All DB work in one place so redirect()/createSession() (which throw) stay
  // outside the try — a catch must never swallow the redirect.
  const outcome = await (async (): Promise<
    { error: string } | { userId: string }
  > => {
    try {
      const [existing] = await db
        .select({ id: profiles.id })
        .from(profiles)
        .where(eq(profiles.email, email));
      if (existing) {
        return { error: "That email is already in a book — try signing in." };
      }

      const passwordHash = await hashPassword(password);
      const userId = randomUUID();

      if (invite) {
        const redeemed = await redeemInvite(invite);
        if (!redeemed) {
          return { error: "That invitation has expired or was already used." };
        }
        await db.insert(profiles).values({
          id: userId,
          bondId: redeemed.bondId,
          slot: "ember",
          displayName,
          email,
          passwordHash,
        });
      } else {
        const kind: Kind = (KINDS as readonly string[]).includes(kindRaw)
          ? (kindRaw as Kind)
          : "couple";
        const bondId = randomUUID();
        await db.insert(bonds).values({ id: bondId, kind });
        await db.insert(profiles).values({
          id: userId,
          bondId,
          slot: "moss",
          displayName,
          email,
          passwordHash,
        });
        await db.insert(familiar).values({ bondId });
      }
      return { userId };
    } catch {
      return { error: "Something went wrong making your book. Please try again." };
    }
  })();

  if ("error" in outcome) return outcome;
  await createSession(outcome.userId);
  redirect("/");
}
