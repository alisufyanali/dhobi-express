"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { IconCart, IconClock, IconMenu, IconTag, IconTruck, IconX } from "./Icons";
import type { Dict, Lang } from "@/lib/dict";

export function Header({ t, lang, phone }: { t: Dict; lang: Lang; phone: string }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const path = usePathname();
  const router = useRouter();

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/business", label: t.nav.business },
    { href: "/track", label: t.nav.track },
    { href: "/contact", label: t.nav.contact },
  ];

  function toggleLang() {
    document.cookie = `lang=${lang === "en" ? "ru" : "en"}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }

  return (
    <>
      <div className="hidden border-b border-brand-100 bg-brand-50 text-xs text-brand-900 md:block">
        <div className="container-x flex h-9 items-center gap-6">
          <span className="flex items-center gap-1.5"><IconTruck className="h-4 w-4 text-brand-600" />Free pickup & delivery on Sundays</span>
          <span className="flex items-center gap-1.5"><IconClock className="h-4 w-4 text-brand-600" />24–48 hour turnaround</span>
          <span className="flex items-center gap-1.5"><IconTag className="h-4 w-4 text-brand-600" />Every order tagged separately</span>
          <a href={`tel:${phone}`} className="ml-auto font-semibold">Call {phone}</a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="container-x flex h-16 items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="3" /><circle cx="12" cy="13" r="4.5" /><path d="M8 6.5h.01M11 6.5h.01" strokeLinecap="round" /></svg>
            </span>
            <span className="text-lg font-bold tracking-tight text-brand-900">Dhobi<span className="text-brand-600">Express</span></span>
          </Link>

          <nav className="ml-8 hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href}
                className={`rounded-lg px-3.5 py-2 text-sm font-medium transition ${path === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-brand-900"}`}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleLang} className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-500" aria-label="Switch language">
              {lang === "en" ? "Roman Urdu" : "English"}
            </button>
            <Link href="/cart" className="relative hidden rounded-lg p-2 text-brand-900 hover:bg-brand-50 md:block" aria-label={`Cart, ${count} items`}>
              <IconCart className="h-6 w-6" />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">{count}</span>}
            </Link>
            <Link href="/services" className="btn-primary hidden md:inline-flex">{t.orderNow}</Link>
            <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu" aria-expanded={open}>
              {open ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <nav className="border-t border-slate-200 bg-white lg:hidden">
            <div className="container-x flex flex-col py-2">
              {links.map((l) => (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-base font-medium text-brand-900 hover:bg-brand-50">{l.label}</Link>
              ))}
            </div>
          </nav>
        )}
      </header>
    </>
  );
}
