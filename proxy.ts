import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const profile = await verifySession(
    request.cookies.get(SESSION_COOKIE)?.value,
  );
  if (!profile) {
    return NextResponse.redirect(new URL("/enter", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Everything except the door, Next internals, and static files (anything with a dot)
  matcher: ["/((?!enter|_next|.*\\..*).*)"],
};
