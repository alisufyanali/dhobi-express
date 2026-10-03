import Link from "next/link";
import { AREA_PAGES } from "@/lib/areas";
import { directionsUrl, hasShopLocation } from "@/lib/location";
import { waLink } from "@/lib/site";
import { Newsletter } from "./Newsletter";
import { IconWhatsApp } from "./Icons";

type S = { phone: string; email: string; address: string; whatsappNumber: string; mapsUrl: string; latitude: number | null; longitude: number | null; openingHours: string };

const GROUPS = [
  { title: "Services", links: [["All services & rates", "/services"], ["Packages", "/services#packages"], ["Business contracts", "/business"], ["Track your order", "/track"]] },
  { title: "Company", links: [["About us", "/about"], ["Why choose us", "/why-choose-us"], ["Blog", "/blog"], ["Contact", "/contact"]] },
  { title: "Help", links: [["Complaints", "/complaints"], ["Refund policy", "/refund-policy"], ["Privacy policy", "/privacy-policy"], ["Terms", "/terms"]] },
  { title: "Areas", links: AREA_PAGES.map((a) => [a.name, `/${a.path}`]) },
];

const MAIN_LINKS: [string, string][] = [["Services", "/services"], ["Packages", "/services#packages"], ["Business", "/business"], ["Track order", "/track"], ["About", "/about"], ["Why us", "/why-choose-us"], ["Blog", "/blog"], ["Contact", "/contact"]];
const HELP_LINKS: [string, string][] = [["Complaints", "/complaints"], ["Refund policy", "/refund-policy"], ["Privacy", "/privacy-policy"], ["Terms", "/terms"]];

const iconBtn = "grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20";
const PhoneIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" /></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>;

export function Footer({ s }: { s: S }) {
  return (
    <footer className="mt-12 bg-brand-900 pb-24 text-slate-300 md:mt-20 md:pb-0">
      <Newsletter />

      {/* Phones: compact, app-style */}
      <div className="container-x space-y-4 py-6 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-bold text-white">Dhobi<span className="text-brand-500">Express</span></p>
          <div className="flex gap-2">
            <a href={`tel:${s.phone}`} aria-label={`Call ${s.phone}`} className={iconBtn}><PhoneIcon /></a>
            <a href={waLink(s.whatsappNumber)} target="_blank" rel="noopener" aria-label="WhatsApp" className={iconBtn}><IconWhatsApp className="h-5 w-5 text-wa" /></a>
            <a href={`mailto:${s.email}`} aria-label={`Email ${s.email}`} className={iconBtn}><MailIcon /></a>
          </div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {MAIN_LINKS.map(([l, h]) => <Link key={h} href={h} className="text-slate-200">{l}</Link>)}
        </nav>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 border-t border-white/10 pt-4 text-xs text-slate-400">
          {HELP_LINKS.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
          {hasShopLocation(s) && <a href={directionsUrl(s)} target="_blank" rel="noopener" className="font-semibold text-brand-500">Directions</a>}
        </div>
        <p className="text-[11px] text-slate-500">© {new Date().getFullYear()} Dhobi Express, Karachi · 7 days, 10am–7pm</p>
      </div>

      {/* Desktop: full columns */}
      <div className="container-x hidden gap-10 py-14 md:grid md:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold text-white">Dhobi<span className="text-brand-500">Express</span></p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-400">Laundry pickup and delivery for homes and businesses across Karachi.</p>
          <div className="mt-5 flex gap-2">
            <a href={`tel:${s.phone}`} aria-label={`Call ${s.phone}`} className={iconBtn}><PhoneIcon /></a>
            <a href={waLink(s.whatsappNumber)} target="_blank" rel="noopener" aria-label="WhatsApp" className={iconBtn}><IconWhatsApp className="h-5 w-5 text-wa" /></a>
            <a href={`mailto:${s.email}`} aria-label={`Email ${s.email}`} className={iconBtn}><MailIcon /></a>
          </div>
          <p className="mt-4 text-sm text-slate-400">{s.phone} · {s.address}</p>
          {hasShopLocation(s) && <a href={directionsUrl(s)} target="_blank" rel="noopener" className="mt-1 inline-block text-sm font-semibold text-brand-500 hover:text-white">Get directions →</a>}
        </div>
        {GROUPS.map((g) => (
          <div key={g.title}>
            <p className="font-semibold text-white">{g.title}</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {g.links.map(([l, h]) => <li key={h}><Link href={h} className="hover:text-white">{l}</Link></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="hidden border-t border-white/10 md:block">
        <div className="container-x flex justify-between py-5 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Dhobi Express, Karachi.</span>
          <span>Pickup & delivery 7 days a week, 10am–7pm.</span>
        </div>
      </div>
    </footer>
  );
}
