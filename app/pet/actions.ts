"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { pet } from "@/db/schema";
import { safely } from "@/lib/safe";
import { currentProfile } from "@/lib/session";

export async function namePet(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  await currentProfile();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 20) {
    return { error: "A name between 1 and 20 letters, please." };
  }
  return safely(async () => {
    await db.update(pet).set({ name }).where(eq(pet.id, 1));
    revalidatePath("/");
    return null;
  });
}
