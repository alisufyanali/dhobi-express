"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Cat } from "@/lib/data";
import { Stepper } from "@/components/Stepper";
import { imageFor } from "@/lib/images";
import { rs, UNIT_LABEL } from "@/lib/site";

/** Laundo-style booking screen: service tiles on top, item rows with − / + below. */
export function ServiceBrowser({ cats, roman, autoFocus }: { cats: Cat[]; roman: boolean; autoFocus?: boolean }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(cats.find((c) => c.slug === "wash-press")?.slug ?? cats[0]?.slug);

  // /services#bedding opens that tab
  useEffect(() => {
    const pick = () => {
      const h = decodeURIComponent(window.location.hash.slice(1));
      if (h && cats.some((c) => c.slug === h)) { setCat(h); setQ(""); }
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [cats]);

  // Keep the selected tile visible in the swipe row
  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>(`[data-slug="${cat}"]`);
    if (row.current && el) row.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [cat]);

  const term = q.trim().toLowerCase();
  const shown = useMemo(() => {
    if (!term) return cats.filter((c) => c.slug === cat);
    return cats
      .map((c) => ({ ...c, services: c.services.filter((s) => [s.name, s.nameUr, s.description, c.name].some((v) => v?.toLowerCase().includes(term))) }))
      .filter((c) => c.services.length);
  }, [cats, cat, term]);
  const label = (c: { name: string; nameUr: string | null }) => (roman && c.nameUr ? c.nameUr : c.name);

  return (
    <div className="md:mx-auto md:max-w-3xl">
      {/* Search */}
      <div className="relative mt-4 md:mt-6">
        <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={autoFocus}
          placeholder="Search shalwar kameez, razai, suit…" aria-label="Search services"
          className="w-full rounded-2xl border-0 bg-white py-3.5 pl-12 pr-4 text-base ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500" />
      </div>

      {/* Service tiles */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="text-base font-semibold text-brand-900 md:text-lg">Services</h2>
        {term && <button onClick={() => setQ("")} className="text-sm font-medium text-brand-600">Clear search</button>}
      </div>
      <div ref={row} className="no-scrollbar relative -mx-4 mt-3 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-7 md:overflow-visible md:px-0">
        {cats.map((c) => {
          const active = !term && c.slug === cat;
          return (
            <button key={c.slug} data-slug={c.slug} onClick={() => { setCat(c.slug); setQ(""); history.replaceState(null, "", `#${c.slug}`); }}
              className={`w-[84px] flex-none snap-start rounded-2xl p-1.5 text-left transition active:scale-[.97] md:w-auto ${active ? "bg-brand-100 ring-2 ring-brand-500" : "bg-white ring-1 ring-slate-200"}`}
              aria-pressed={active}>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-50">
                <Image src={imageFor(c.slug)} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <p className={`mt-1.5 rounded-lg px-1 py-1 text-center text-[10px] font-semibold leading-tight ${active ? "bg-brand-600 text-white" : "bg-brand-500 text-white"}`}>{label(c)}</p>
            </button>
          );
        })}
      </div>

      {/* Item list */}
      <div className="mt-6 space-y-4">
        {shown.map((c) => (
          <section key={c.slug} id={c.slug} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h3 className="font-semibold text-brand-900">{label(c)}</h3>
              <span className="text-xs text-slate-500">{c.services.length} items</span>
            </div>
            <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 bg-brand-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-wide text-brand-700">
              <span>Item</span><span className="w-16 text-right">Price</span><span className="w-[100px]" />
            </div>
            <ul className="divide-y divide-slate-100">
              {c.services.map((s) => (
                <li key={s.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug text-brand-900">{roman && s.nameUr ? s.nameUr : s.name}</p>
                    {s.description && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{s.description}</p>}
                  </div>
                  <p className="w-16 text-right text-sm font-semibold text-brand-900">
                    {rs(s.price)}<span className="block text-[10px] font-normal text-slate-500">{c.slug === "packages" ? "package" : UNIT_LABEL[s.unit]}</span>
                  </p>
                  <div className="flex w-[100px] justify-end">
                    <Stepper item={{ serviceId: s.id, name: s.name, price: s.price, unit: s.unit }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
        {!shown.length && (
          <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
            <p className="font-medium text-brand-900">No service matches &ldquo;{q}&rdquo;.</p>
            <p className="mt-1 text-sm text-slate-500">Message us on WhatsApp and we&apos;ll quote it for you.</p>
          </div>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Per-kg items are weighed at pickup.</p>
    </div>
  );
}
