"use client";
import { useState } from "react";
import Link from "next/link";
import { GarmentIcon } from "./GarmentIcon";
import { SEGMENTS } from "@/lib/site";
import type { Svc } from "@/lib/data";

type Cat = { slug: string; name: string; services: Svc[] };
const COLS = [
  { slug: "wash-iron", short: "Wash & Iron" }, { slug: "iron-only", short: "Iron" },
  { slug: "wash-only", short: "Wash" }, { slug: "dry-clean", short: "Dry clean" },
];

/** One readable price table: item rows × service-type columns, tabs for Men / Women / Kids / Household. */
export function PriceMatrix({ cats }: { cats: Cat[] }) {
  const [seg, setSeg] = useState<string>(SEGMENTS[0].key);
  const cols = COLS.filter((c) => cats.some((x) => x.slug === c.slug));
  const rows = new Map<string, Record<string, number>>();
  for (const c of cols) {
    for (const s of cats.find((x) => x.slug === c.slug)?.services ?? []) {
      if (s.segment !== seg || s.unit !== "PER_PIECE") continue;
      rows.set(s.name, { ...(rows.get(s.name) ?? {}), [c.slug]: s.price });
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200">
      <div role="tablist" aria-label="Who it's for" className="grid grid-cols-4 gap-1 border-b border-slate-100 p-1.5">
        {SEGMENTS.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={seg === key} onClick={() => setSeg(key)}
            className={`rounded-xl py-2 text-xs font-semibold transition md:text-sm ${seg === key ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-brand-50"}`}>
            {label}
          </button>
        ))}
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="bg-brand-50 text-[10px] font-semibold uppercase tracking-wide text-brand-700 md:text-xs">
            <th className="px-3 py-2.5 md:px-5">Item</th>
            {cols.map((c) => <th key={c.slug} className="w-[15%] px-1 py-2.5 text-center md:w-[14%]">{c.short}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {[...rows].map(([name, p]) => (
            <tr key={name}>
              <td className="px-3 py-2 md:px-5">
                <span className="flex items-center gap-2.5">
                  <GarmentIcon name={name} className="h-8 w-8 md:h-10 md:w-10" />
                  <span className="text-xs font-medium leading-tight text-brand-900 md:text-sm">{name}</span>
                </span>
              </td>
              {cols.map((c) => (
                <td key={c.slug} className="px-1 py-2 text-center text-xs font-semibold text-brand-900 md:text-sm">
                  {p[c.slug] ? p[c.slug].toLocaleString("en-PK") : <span className="text-slate-300">—</span>}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-100 px-4 py-3 text-xs text-slate-500 sm:flex-row md:px-5">
        <span>All prices in Rs., per piece.</span>
        <Link href={`/bill-calculator#wash-iron/${seg}`} className="font-semibold text-brand-600">Calculate my bill →</Link>
      </div>
    </div>
  );
}
