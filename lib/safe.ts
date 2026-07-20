// Wraps a server action's work so an unexpected failure (Neon hiccup,
// network drop) becomes a warm { error } instead of an unhandled 500.
// Next.js control-flow throws (redirect, notFound) pass through untouched.

import { unstable_rethrow } from "next/navigation";

export const INK_ERROR = "The ink didn't take — give it another try.";

export async function safely<T>(
  fn: () => Promise<T>,
): Promise<T | { error: string }> {
  try {
    return await fn();
  } catch (err) {
    unstable_rethrow(err);
    console.error("[action]", err);
    return { error: INK_ERROR };
  }
}
