"use client";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Cat, Svc } from "@/lib/data";
import { Stepper } from "@/components/Stepper";
import { BillSummary } from "@/components/BillSummary";
import { GarmentIcon, TypeArt } from "@/components/GarmentIcon";
import { imageFor } from "@/lib/images";
import { itemLabel, rs, SEGMENTS, SEGMENT_LABEL, UNIT_LABEL } from "@/lib/site";

/** Bill-calculator style booking: service type → Men / Women / Kids / Household → items with − / +. */
export function ServiceBrowser({ cats, roman, autoFocus, threshold, fee }: { cats: Cat[]; roman: boolean; autoFocus?: boolean; threshold: number; fee: number }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState(cats.find((c) => c.slug === "wash-iron")?.slug ?? cats[0]?.slug);
  const [seg, setSeg] = useState<string>("men");
  const current = cats.find((c) => c.slug === type);
  const hasSegments = !!current?.services.some((s) => s.segment);

  // #wash-only/household opens that type and section
  useEffect(() => {
    const pick = () => {
      const [t, s] = decodeURIComponent(window.location.hash.slice(1)).split("/");
      if (t && cats.some((c) => c.slug === t)) { setType(t); setQ(""); }
      if (s && SEGMENT_LABEL[s]) setSeg(s);
    };
    pick();
    window.addEventListener("hashchange", pick);
    return () => window.removeEventListener("hashchange", pick);
  }, [cats]);
  const go = (t: string, s = seg) => { setType(t); setSeg(s); setQ(""); history.replaceState(null, "", `#${t}/${s}`); };

  const row = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = row.current?.querySelector<HTMLElement>(`[data-slug="${type}"]`);
    if (row.current && el) row.current.scrollTo({ left: el.offsetLeft - 16, behavior: "smooth" });
  }, [type]);

  const term = q.trim().toLowerCase();
  const groups = useMemo((): { title: string; type: Cat; items: Svc[] }[] => {
    if (term) {
      return cats.flatMap((c) => {
        const hits = c.services.filter((s) => [s.name, s.nameUr, s.description].some((v) => v?.toLowerCase().includes(term)));
        return hits.length ? [{ title: c.name, type: c, items: hits }] : [];
      });
    }
    if (!current) return [];
    if (!hasSegments) return [{ title: current.name, type: current, items: current.services }];
    return [{ title: `${current.name} · ${SEGMENT_LABEL[seg]}`, type: current, items: current.services.filter((s) => s.segment === seg) }];
  }, [cats, current, hasSegments, seg, term]);

  const name = (s: { name: string; nameUr: string | null }) => (roman && s.nameUr ? s.nameUr : s.name);

  return (
    <div className="md:grid md:grid-cols-[1fr_320px] md:items-start md:gap-8">
      <div className="min-w-0">
        {/* Search */}
        <div className="relative mt-4 md:mt-0">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute inset-y-0 left-4 my-auto h-5 w-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} autoFocus={autoFocus}
            placeholder="Search shirt, razai, suit, abaya…" aria-label="Search items"
            className="w-full rounded-2xl border-0 bg-white py-3.5 pl-12 pr-4 text-base ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-brand-500" />
        </div>

        {/* Service type */}
        <h2 className="mt-5 text-base font-semibold text-brand-900">Choose a service</h2>
        <div ref={row} className="no-scrollbar relative -mx-4 mt-3 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
          {cats.map((c) => {
            const active = !term && c.slug === type;
            return (
              <button key={c.slug} data-slug={c.slug} onClick={() => go(c.slug)} aria-pressed={active}
                className={`w-[84px] flex-none snap-start rounded-2xl p-1.5 text-left transition md:w-auto ${active ? "bg-brand-100 ring-2 ring-brand-500" : "bg-white ring-1 ring-slate-200"}`}>
                <div className="relative aspect-square overflow-hidden rounded-xl bg-brand-50">
                  <TypeArt slug={c.slug} />
                  <Image src={imageFor(c.slug)} alt="" fill sizes="110px" className="object-cover" />
                </div>
                <p className={`mt-1.5 rounded-lg px-1 py-1 text-center text-[10px] font-semibold leading-tight text-white md:text-xs ${active ? "bg-brand-700" : "bg-brand-500"}`}>{name(c)}</p>
              </button>
            );
          })}
        </div>

        {/* Men / Women / Kids / Household */}
        {!term && hasSegments && (
          <div className="mt-5 grid grid-cols-4 rounded-2xl bg-white p-1 ring-1 ring-slate-200" role="tablist">
            {SEGMENTS.map((s) => {
              const n = current?.services.filter((x) => x.segment === s.key).length ?? 0;
              const on = seg === s.key;
              return (
                <button key={s.key} role="tab" aria-selected={on} disabled={!n} onClick={() => go(type, s.key)}
                  className={`rounded-xl px-1 py-2.5 text-xs font-semibold transition disabled:opacity-40 md:text-sm ${on ? "bg-brand-600 text-white" : "text-slate-600"}`}>
                  {roman ? s.ur : s.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Items */}
        <div className="mt-4 space-y-4">
          {groups.map((g) => (
            <section key={g.title} className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="font-semibold text-brand-900">{g.title}</h3>
                <span className="text-xs text-slate-500">{g.items.length} items</span>
              </div>
              <ul className="divide-y divide-slate-100">
                {g.items.map((s) => (
                  <li key={s.id} className="flex items-center gap-3 px-3 py-2.5 md:px-4">
                    <GarmentIcon name={g.type.slug === "packages" ? "package" : s.name} />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug text-brand-900">{name(s)}</p>
                      {term && s.segment && <p className="text-[11px] text-slate-500">{SEGMENT_LABEL[s.segment]}</p>}
                      {s.description && <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{s.description}</p>}
                      <p className="mt-0.5 text-sm font-bold text-brand-700">{rs(s.price)} <span className="text-[11px] font-normal text-slate-500">{g.type.slug === "packages" ? "package" : UNIT_LABEL[s.unit]}</span></p>
                    </div>
                    <div className="flex-none">
                      <Stepper item={{ serviceId: s.id, name: itemLabel(s.name, s.segment, g.type.name, g.type.slug), price: s.price, unit: s.unit }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
          {!groups.length && (
            <div className="rounded-2xl bg-white p-8 text-center ring-1 ring-slate-200">
              <p className="font-medium text-brand-900">No item matches &ldquo;{q}&rdquo;.</p>
              <p className="mt-1 text-sm text-slate-500">Message us on WhatsApp and we&apos;ll quote it for you.</p>
            </div>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-slate-500">Prices may vary slightly for heavy or embellished items. Per-kg items are weighed at pickup.</p>
      </div>

      {/* Estimate: below the list on phones, sticky on the right on desktop */}
      <div className="mt-6 md:sticky md:top-24 md:mt-0">
        <BillSummary threshold={threshold} fee={fee} />
      </div>
    </div>
  );
}
