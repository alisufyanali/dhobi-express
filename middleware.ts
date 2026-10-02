import { NextResponse, type NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";

const authed = withAuth({ pages: { signIn: "/admin/login" } });

export default function middleware(req: NextRequest) {
  // Demo mode (no database/secret): the admin panel is closed
  if (!process.env.DATABASE_URL || !process.env.NEXTAUTH_SECRET) {
    if (req.nextUrl.pathname === "/admin/login") return NextResponse.next();
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // @ts-expect-error withAuth's middleware signature takes an extra event arg we don't need
  return authed(req);
}

export const config = { matcher: ["/admin/((?!login).*)", "/admin"] };
