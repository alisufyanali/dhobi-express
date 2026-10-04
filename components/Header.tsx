"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { IconCart, IconClock, IconMenu, IconTag, IconTruck, IconUser, IconWhatsApp, IconX } from "./Icons";
import { InstallApp } from "./InstallApp";
import { AnnouncementBar } from "./AnnouncementBar";
import { waLink } from "@/lib/site";
import type { Dict, Lang } from "@/lib/dict";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="3" width="16" height="18" rx="3" /><circle cx="12" cy="13" r="4.5" /><path d="M8 6.5h.01M11 6.5h.01" strokeLinecap="round" /></svg>
      </span>
      <span className="text-lg font-bold tracking-tight text-brand-900">Dhobi<span className="text-brand-600">Express</span></span>
    </Link>
  );
}

function pageTitle(path: string, t: Dict): string {
  const exact: Record<string, string> = {
    "/orders": "My orders", "/services": t.nav.services, "/pricing": "Pricing", "/bill-calculator": "Bill calculator", "/cart": t.cart, "/checkout": t.checkout, "/track": t.nav.track,
    "/business": t.nav.business, "/contact": t.nav.contact, "/about": "About us", "/login": "Sign in",
    "/account": "My account", "/blog": "Blog", "/privacy-policy": "Privacy policy", "/terms": "Terms",
    "/why-choose-us": "Why choose us", "/refund-policy": "Refund policy", "/complaints": "Complaints",
  };
  if (exact[path]) return exact[path];
  if (path.startsWith("/blog/")) return "Blog";
  if (path.startsWith("/order/")) return "Order status";
  if (path.startsWith("/laundry-service-")) return "Service area";
  return "Dhobi Express";
}

export function Header({ t, lang, phone, whatsapp, threshold }: { t: Dict; lang: Lang; phone: string; whatsapp: string; threshold: number }) {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const path = usePathname();
  const router = useRouter();
  const isHome = path === "/";

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const links = [
    { href: "/", label: t.nav.home },
    { href: "/services", label: t.nav.services },
    { href: "/pricing", label: "Pricing" },
    { href: "/bill-calculator", label: "Bill calculator" },
    { href: "/business", label: t.nav.business },
    { href: "/orders", label: "My orders" },
    { href: "/track", label: t.nav.track },
    { href: "/contact", label: t.nav.contact },
  ];

  function toggleLang() {
    document.cookie = `lang=${lang === "en" ? "ru" : "en"}; path=/; max-age=31536000; samesite=lax`;
    router.refresh();
  }
  function back() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  const iconBtn = "grid h-11 w-11 place-items-center rounded-full text-brand-900 active:bg-slate-100";

  return (
    <>
      <AnnouncementBar threshold={threshold} />

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white pt-[env(safe-area-inset-top)]">
        {/* Phones: home = menu | logo | account ; inner pages = back | title | cart */}
        <div className="grid h-14 grid-cols-[48px_1fr_48px] items-center px-1 lg:hidden">
          {isHome ? (
            <>
              <button onClick={() => setOpen(true)} className={iconBtn} aria-label="Open menu" aria-expanded={open}><IconMenu className="h-6 w-6" /></button>
              <div className="flex justify-center"><Logo /></div>
              <Link href="/login" className={iconBtn} aria-label="Sign in or create account"><IconUser className="h-6 w-6" /></Link>
            </>
          ) : (
            <>
              <button onClick={back} className={iconBtn} aria-label="Go back">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <p className="truncate text-center text-base font-semibold text-brand-900">{pageTitle(path, t)}</p>
              {path === "/cart" || path === "/checkout" ? (
                <button onClick={() => setOpen(true)} className={iconBtn} aria-label="Open menu"><IconMenu className="h-6 w-6" /></button>
              ) : (
                <Link href="/cart" className={`relative ${iconBtn}`} aria-label={`Cart, ${count} items`}>
                  <IconCart className="h-6 w-6" />
                  {count > 0 && <span className="absolute right-1 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">{count}</span>}
                </Link>
              )}
            </>
          )}
        </div>

        {/* Desktop */}
        <div className="container-x hidden h-16 items-center gap-3 lg:flex">
          <Logo />
          <nav className="ml-4 flex items-center gap-0.5 xl:ml-6">
            {links.filter((l) => l.href !== "/orders" && l.href !== "/track").map((l) => (
              <Link key={l.href} href={l.href}
                className={`whitespace-nowrap rounded-lg px-2 py-2 text-sm xl:px-3 font-medium transition ${path === l.href ? "bg-brand-50 text-brand-700" : "text-slate-600 hover:text-brand-900"}`}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={toggleLang} className="whitespace-nowrap rounded-lg border border-slate-200 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-500">
              <span className="xl:hidden">{lang === "en" ? "Urdu" : "EN"}</span><span className="hidden xl:inline">{lang === "en" ? "Roman Urdu" : "English"}</span>
            </button>
            <Link href="/login" aria-label="Sign in" className="flex items-center gap-1.5 whitespace-nowrap rounded-lg p-2 text-sm font-medium text-slate-700 hover:bg-brand-50"><IconUser className="h-5 w-5" /><span className="sr-only">Sign in</span></Link>
            <Link href="/cart" className="relative rounded-lg p-2 text-brand-900 hover:bg-brand-50" aria-label={`Cart, ${count} items`}>
              <IconCart className="h-6 w-6" />
              {count > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">{count}</span>}
            </Link>
            <Link href="/bill-calculator" className="btn-primary">{t.orderNow}</Link>
          </div>
        </div>
      </header>

      {/* Side drawer (phones) */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-slate-900/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} />
        <aside className="absolute inset-y-0 left-0 flex w-[82%] max-w-xs flex-col bg-white pt-[env(safe-area-inset-top)] shadow-xl transition-transform duration-300" style={{ transform: open ? "translateX(0)" : "translateX(-100%)" }} role="dialog" aria-label="Menu">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4">
            <Logo />
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full active:bg-slate-100" aria-label="Close menu"><IconX className="h-6 w-6" /></button>
          </div>
          <nav className="flex-1 overflow-y-auto p-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className={`block rounded-xl px-3 py-3 text-base font-medium ${path === l.href ? "bg-brand-50 text-brand-700" : "text-brand-900 active:bg-slate-50"}`}>{l.label}</Link>
            ))}
            <Link href="/why-choose-us" className="block rounded-xl px-3 py-3 text-base font-medium text-brand-900 active:bg-slate-50">Why choose us</Link>
            <Link href="/blog" className="block rounded-xl px-3 py-3 text-base font-medium text-brand-900 active:bg-slate-50">Blog</Link>
            <Link href="/complaints" className="block rounded-xl px-3 py-3 text-base font-medium text-brand-900 active:bg-slate-50">Help &amp; complaints</Link>
            <Link href="/cart" className="flex items-center justify-between rounded-xl px-3 py-3 text-base font-medium text-brand-900 active:bg-slate-50">
              {t.cart}{count > 0 && <span className="rounded-full bg-brand-600 px-2 text-xs font-bold text-white">{count}</span>}
            </Link>
          </nav>
          <div className="space-y-2 border-t border-slate-200 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <InstallApp />
            <Link href="/login" className="btn-primary w-full"><IconUser className="h-5 w-5" />Sign in / Sign up</Link>
            <a href={waLink(whatsapp)} target="_blank" rel="noopener" className="btn-ghost w-full"><IconWhatsApp className="h-5 w-5 text-wa" />{t.whatsapp}</a>
            <button onClick={toggleLang} className="w-full py-2 text-sm text-slate-600">{lang === "en" ? "Roman Urdu mein dekhein" : "View in English"}</button>
          </div>
        </aside>
      </div>
    </>
  );
}
