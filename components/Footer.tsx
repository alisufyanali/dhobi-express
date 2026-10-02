import Link from "next/link";
import { AREA_PAGES } from "@/lib/areas";

type S = { phone: string; email: string; address: string };

export function Footer({ s }: { s: S }) {
  return (
    <footer className="bg-navy-glow mt-16 pb-32 text-brand-100 md:pb-10">
      <div className="container-x grid gap-10 py-12 md:grid-cols-4">
        <div>
          <p className="text-lg font-extrabold text-white">Dhobi<span className="text-sun-400">Express</span></p>
          <p className="mt-3 text-sm leading-relaxed">Laundry pickup and delivery for homes and businesses across Karachi.</p>
          <p className="mt-4 text-sm">{s.phone}<br />{s.email}<br />{s.address}</p>
        </div>
        <div>
          <p className="font-semibold text-white">Services</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/services">All services & rates</Link></li>
            <li><Link href="/business">Companies & hospitals</Link></li>
            <li><Link href="/track">Track your order</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Areas</p>
          <ul className="mt-3 grid grid-cols-2 gap-2 text-sm md:grid-cols-1">
            {AREA_PAGES.map((a) => <li key={a.path}><Link href={`/${a.path}`}>{a.name}</Link></li>)}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Company</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-x border-t border-white/10 pt-6 text-xs text-brand-200">© {new Date().getFullYear()} Dhobi Express, Karachi.</div>
    </footer>
  );
}
