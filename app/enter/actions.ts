"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isProfile, SESSION_COOKIE, signSession } from "@/lib/auth";

export type EnterState = { error: string } | null;

export async function enter(
  _prev: EnterState,
  formData: FormData,
): Promise<EnterState> {
  const profile = formData.get("profile");
  const passcode = formData.get("passcode");

  if (!isProfile(profile)) {
    return { error: "Pick who you are first." };
  }
  if (typeof passcode !== "string" || passcode !== process.env.APP_PASSCODE) {
    return { error: "Hmm - that's not the secret word." };
  }

  const token = await signSession(profile);
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
  redirect("/");
}
