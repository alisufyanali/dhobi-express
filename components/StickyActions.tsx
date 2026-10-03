"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { IconUser } from "./Icons";
import { rs } from "@/lib/site";

const I = {
  home: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>,
  grid: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="4" width="7" height="7" rx="2" /><rect x="13" y="4" width="7" height="7" rx="2" /><rect x="4" y="13" width="7" height="7" rx="2" /><rect x="13" y="13" width="7" height="7" rx="2" /></svg>,
  track: <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 8h6M9 12h6M9 16h3" /></svg>,
};

/** Paths where the tab bar is replaced by the page's own bottom action bar */
export const FLOW_PATHS = ["/cart", "/checkout"];
export const hasCartBar = (path: string, count: number) => count > 0 && !FLOW_PATHS.some((p) => path.startsWith(p));

/** Phones: app tab bar with a raised Order button, plus a "View cart" bar when the cart has items. */
export function StickyActions({ orderLabel }: { orderLabel: string }) {
  const path = usePathname();
  const { count, subtotal } = useCart();
  if (FLOW_PATHS.some((p) => path.startsWith(p))) return null;
  const tab = (p: string) => (path === p ? "text-brand-600" : "text-slate-500");

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden" aria-label="App navigation">
      {hasCartBar(path, count) && (
        <Link href="/cart" className="mx-4 mb-2 flex items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-brand-600/30 active:scale-[.99]">
          Continue <span className="text-white/60">·</span> {count} item{count > 1 ? "s" : ""} <span className="text-white/60">·</span> {rs(subtotal)}
        </Link>
      )}
      <div className="border-t border-slate-200 bg-white pb-[env(safe-area-inset-bottom)]">
        <div className="grid grid-cols-5 items-end px-1 pb-1.5 pt-1">
          <Link href="/" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/")}`}>{I.home}Home</Link>
          <Link href="/services" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/services")}`}>{I.grid}Services</Link>
          <Link href="/services" aria-label={orderLabel} className="-mt-6 flex flex-col items-center gap-1 text-[11px] font-semibold text-brand-700">
            <span className="relative grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 ring-4 ring-white">
              <span aria-hidden className="pulse-ring absolute inset-0 rounded-full bg-brand-500" />
              <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
            </span>
            Book Now
          </Link>
          <Link href="/track" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${tab("/track")}`}>{I.track}Orders</Link>
          <Link href="/login" className={`flex flex-col items-center gap-0.5 py-1.5 text-[11px] font-medium ${path === "/login" || path === "/account" ? "text-brand-600" : "text-slate-500"}`}>
            <IconUser className="h-6 w-6" />Profile
          </Link>
        </div>
      </div>
    </nav>
  );
}
