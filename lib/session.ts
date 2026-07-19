import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySession, type Profile } from "./auth";

export async function currentProfile(): Promise<Profile> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  const profile = await verifySession(token);
  if (!profile) redirect("/enter");
  return profile;
}
