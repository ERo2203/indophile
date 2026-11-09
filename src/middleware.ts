import { NextResponse, type NextRequest } from "next/server";

/**
 * Protects the editorial dashboard.
 * - If ADMIN_USER and ADMIN_PASSWORD are set, /admin requires HTTP Basic auth.
 * - If they are not set, /admin is open only in development and returns 404
 *   in production, so a misconfigured deploy fails closed.
 * Replace with the CMS's own session auth when the editorial backend lands.
 */
export function middleware(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASSWORD;

  if (!user || !pass) {
    if (process.env.NODE_ENV === "production") return new NextResponse("Not found", { status: 404 });
    return NextResponse.next();
  }

  const header = req.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const [u, ...rest] = atob(encoded).split(":");
    if (safeEqual(u, user) && safeEqual(rest.join(":"), pass)) return NextResponse.next();
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Indophile editorial", charset="UTF-8"' },
  });
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export const config = { matcher: ["/admin/:path*"] };
