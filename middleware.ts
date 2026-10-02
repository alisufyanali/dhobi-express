import { withAuth } from "next-auth/middleware";

export default withAuth({ pages: { signIn: "/admin/login" } });

// Protect everything under /admin except the login page
export const config = { matcher: ["/admin/((?!login).*)", "/admin"] };
