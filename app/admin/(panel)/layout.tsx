import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { SignOut } from "./SignOut";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const NAV = [
  ["/admin", "Dashboard"],
  ["/admin/orders", "Orders"],
  ["/admin/services", "Services"],
  ["/admin/inquiries", "Inquiries"],
  ["/admin/settings", "Settings"],
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin();
  return (
    <div className="min-h-screen bg-slate-50 md:grid md:grid-cols-[220px_1fr]">
      <aside className="border-b border-slate-200 bg-white md:min-h-screen md:border-b-0 md:border-r print:hidden">
        <div className="flex items-center justify-between p-4 md:block">
          <Link href="/admin" className="font-extrabold text-brand-700">Dhobi<span className="text-sun-500">Express</span> <span className="text-xs font-medium text-slate-400">admin</span></Link>
          <p className="mt-1 hidden text-xs text-slate-500 md:block">{session.user?.email}</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:px-3">
          {NAV.map(([href, label]) => (
            <Link key={href} href={href} className="flex-none rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">{label}</Link>
          ))}
          <Link href="/" className="flex-none rounded-lg px-3 py-2 text-sm text-slate-500 hover:bg-slate-100">View site ↗</Link>
          <SignOut />
        </nav>
      </aside>
      <div className="p-4 md:p-8">{children}</div>
    </div>
  );
}
