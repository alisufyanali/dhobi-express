import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server";
import { withAuth, type NextRequestWithAuth } from "next-auth/middleware";

// Only admins (credentials login) get into /admin. A signed-in customer is sent to the admin login.
const adminOnly = withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: { authorized: ({ token }) => token?.role === "admin" },
});

export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  if (!process.env.DATABASE_URL || !process.env.NEXTAUTH_SECRET) {
    if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  return adminOnly(req as NextRequestWithAuth, ev);
}

export const config = { matcher: ["/admin/((?!login).*)", "/admin"] };
