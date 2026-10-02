"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { IconCart, IconTruck, IconWhatsApp } from "./Icons";
import { waLink } from "@/lib/site";

const I = {
  home: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  grid: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>,
  track: <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>,
};

/** Mobile: bottom nav with a raised Order button. Desktop: WhatsApp bubble. */
export function StickyActions({ whatsapp, orderLabel, waLabel }: { whatsapp: string; orderLabel: string; waLabel: string }) {
  const path = usePathname();
  const { count } = useCart();
  const href = waLink(whatsapp, "Assalam o Alaikum, I want to book a laundry pickup.");
  const tab = (p: string) => (path === p ? "text-brand-600" : "text-slate-500");

  return (
    <>
      <a href={href} target="_blank" rel="noopener" aria-label={waLabel}
        className="fixed bottom-24 right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-wa text-white shadow-lg md:bottom-6 md:right-6 md:h-14 md:w-14">
        <IconWhatsApp className="h-6 w-6 md:h-7 md:w-7" />
      </a>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)] md:hidden" aria-label="Quick navigation">
        <div className="grid grid-cols-5 items-end px-1 pb-1.5 pt-1">
          <Link href="/" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/")}`}>{I.home}Home</Link>
          <Link href="/services" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/services")}`}>{I.grid}Services</Link>
          <Link href="/services" aria-label={orderLabel} className="-mt-6 flex flex-col items-center gap-1 text-[11px] font-semibold text-brand-700">
            <span className="grid h-13 w-13 place-items-center rounded-full bg-brand-600 p-3.5 text-white ring-4 ring-white"><IconTruck className="h-6 w-6" /></span>
            {orderLabel}
          </Link>
          <Link href="/cart" className={`relative flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/cart")}`}>
            <IconCart className="h-5 w-5" />Cart
            {count > 0 && <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{count}</span>}
          </Link>
          <Link href="/track" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/track")}`}>{I.track}Track</Link>
        </div>
      </nav>
    </>
  );
}
