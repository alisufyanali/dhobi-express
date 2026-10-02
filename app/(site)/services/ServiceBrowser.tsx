"use client";
import { useMemo, useState } from "react";
import type { Cat } from "@/lib/data";
import { ServiceCard } from "@/components/ServiceCard";

export function ServiceBrowser({ cats, roman, label, addedLabel }: { cats: Cat[]; roman: boolean; label: string; addedLabel: string }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const shown = useMemo(() => {
    const term = q.trim().toLowerCase();
    return cats
      .filter((c) => cat === "all" || c.slug === cat)
      .map((c) => ({
        ...c,
        services: c.services.filter((s) =>
          !term || [s.name, s.nameUr, s.description, c.name].some((v) => v?.toLowerCase().includes(term))),
      }))
      .filter((c) => c.services.length);
  }, [cats, q, cat]);

  const chip = (active: boolean) =>
    `flex-none rounded-full border px-4 py-2 text-sm font-medium transition ${active ? "border-brand-600 bg-brand-600 text-white" : "border-slate-300 bg-white text-slate-700 hover:border-brand-500"}`;

  return (
    <>
      <div className="sticky top-16 z-30 -mx-4 mt-6 border-b border-slate-200 bg-white px-4 pb-3 pt-3 md:static md:mx-0 md:border-0 md:px-0">
        <div className="relative">
          <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search e.g. shalwar kameez, razai, suit" className="input pl-11" aria-label="Search services" />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          <button className={chip(cat === "all")} onClick={() => setCat("all")}>All</button>
          {cats.map((c) => (
            <button key={c.slug} className={chip(cat === c.slug)} onClick={() => setCat(c.slug)}>{roman && c.nameUr ? c.nameUr : c.name}</button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-10">
        {shown.map((c) => (
          <section key={c.id} id={c.slug} className="scroll-mt-40">
            <h2 className="text-lg font-semibold text-brand-900">{roman && c.nameUr ? c.nameUr : c.name}</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
              {c.services.map((s) => <ServiceCard key={s.id} s={s} roman={roman} label={label} addedLabel={addedLabel} />)}
            </div>
          </section>
        ))}
        {!shown.length && (
          <div className="card p-8 text-center">
            <p className="font-medium text-brand-900">No service matches &ldquo;{q}&rdquo;.</p>
            <p className="mt-1 text-sm text-slate-500">Message us on WhatsApp and we&apos;ll quote it for you.</p>
          </div>
        )}
      </div>
    </>
  );
}
