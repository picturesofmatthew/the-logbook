import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, readToken } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Edge gate: confirm the cookie carries our signature (cheap, no DB). The real
  // session validity/expiry check runs server-side in getSessionUser().
  const token = await readToken(request.cookies.get(SESSION_COOKIE)?.value);
  if (!token) {
    // API callers get a proper 401, not an HTML redirect.
    if (request.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/enter", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Everything except the door + signup, Next internals, and static files.
  matcher: ["/((?!enter|join|_next|.*\\..*).*)"],
};
