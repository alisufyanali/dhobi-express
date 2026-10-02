import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";

export const GOOGLE_ENABLED = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.DATABASE_URL);

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 30 },
  pages: { signIn: "/login" },
  providers: [
    // Admin login (email + password from the AdminUser table)
    Credentials({
      id: "credentials",
      credentials: { email: { type: "email" }, password: { type: "password" } },
      async authorize(c) {
        if (!c?.email || !c.password) return null;
        const user = await prisma.adminUser.findUnique({ where: { email: c.email.toLowerCase().trim() } });
        if (!user || !(await bcrypt.compare(c.password, user.passwordHash))) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
    // Customer login — only when Google keys are configured
    ...(GOOGLE_ENABLED
      ? [Google({ clientId: process.env.GOOGLE_CLIENT_ID!, clientSecret: process.env.GOOGLE_CLIENT_SECRET! })]
      : []),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) token.role = account.provider === "credentials" ? "admin" : "customer";
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
  },
};

export const getSession = () => getServerSession(authOptions);

/** Use at the top of every admin page and server action. Customers are never admins. */
export async function requireAdmin() {
  const session = await getSession();
  if (session?.user?.role !== "admin") redirect("/admin/login");
  return session;
}
