"use client";
import { signOut } from "next-auth/react";

export function SignOut() {
  return <button onClick={() => signOut({ callbackUrl: "/admin/login" })} className="flex-none rounded-lg px-3 py-2 text-left text-sm text-slate-500 hover:bg-slate-100">Sign out</button>;
}
