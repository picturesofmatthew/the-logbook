"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { familiar } from "@/db/schema";
import { safely } from "@/lib/safe";
import { currentUser } from "@/lib/session";

export async function nameFamiliar(
  _prev: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | null> {
  const { bondId } = await currentUser();
  const name = String(formData.get("name") ?? "").trim();
  if (name.length < 1 || name.length > 20) {
    return { error: "A name between 1 and 20 letters, please." };
  }
  return safely(async () => {
    await db.update(familiar).set({ name }).where(eq(familiar.bondId, bondId));
    revalidatePath("/");
    return null;
  });
}
