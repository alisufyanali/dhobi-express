import Link from "next/link";
import { AREA_PAGES } from "@/lib/areas";
import { waLink } from "@/lib/site";
import { Newsletter } from "./Newsletter";
import { IconWhatsApp } from "./Icons";

type S = { phone: string; email: string; address: string; whatsappNumber: string };

const GROUPS = [
  { title: "Services", links: [["All services & rates", "/services"], ["Packages", "/services#packages"], ["Business contracts", "/business"], ["Track your order", "/track"]] },
  { title: "Company", links: [["About", "/about"], ["Blog", "/blog"], ["Contact", "/contact"], ["Privacy Policy", "/privacy-policy"], ["Terms", "/terms"]] },
  { title: "Areas", links: AREA_PAGES.map((a) => [a.name, `/${a.path}`]) },
];

export function Footer({ s }: { s: S }) {
  return (
    <footer className="mt-20 bg-brand-900 pb-24 text-slate-300 md:pb-0">
      <Newsletter />

      <div className="container-x grid gap-8 py-10 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:gap-10 md:py-14">
        {/* Brand + quick contact */}
        <div>
          <p className="text-xl font-bold text-white">Dhobi<span className="text-brand-500">Express</span></p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">Laundry pickup and delivery for homes and businesses across Karachi.</p>
          <div className="mt-5 grid grid-cols-3 gap-2 md:max-w-xs">
            <a href={`tel:${s.phone}`} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>Call
            </a>
            <a href={waLink(s.whatsappNumber)} target="_blank" rel="noopener" className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/10">
              <IconWhatsApp className="h-5 w-5 text-wa" />WhatsApp
            </a>
            <a href={`mailto:${s.email}`} className="flex flex-col items-center gap-1 rounded-xl bg-white/5 py-3 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>Email
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-400">{s.phone} · {s.address}</p>
        </div>

        {/* Link groups: collapsible on phones, open columns on desktop */}
        {GROUPS.map((g) => (
          <div key={g.title}>
            <details className="group border-t border-white/10 md:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-semibold text-white">
                {g.title}<span className="text-xl text-brand-500 transition group-open:rotate-45">+</span>
              </summary>
              <ul className={`pb-4 text-sm ${g.title === "Areas" ? "grid grid-cols-2 gap-2.5" : "space-y-2.5"}`}>
                {g.links.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>)}
              </ul>
            </details>
            <div className="hidden md:block">
              <p className="font-semibold text-white">{g.title}</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {g.links.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>)}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-1 py-5 text-xs text-slate-500 md:flex-row md:justify-between">
          <span>© {new Date().getFullYear()} Dhobi Express, Karachi.</span>
          <span>Pickup & delivery 7 days a week, 10am–7pm.</span>
        </div>
      </div>
    </footer>
  );
}
