"use client";
import { useState } from "react";
import { Stepper } from "./Stepper";
import { GarmentIcon } from "./GarmentIcon";
import { PACKAGE_GROUPS, packageGroup, rs, type PackageGroup } from "@/lib/site";
import type { Svc } from "@/lib/data";

/** Monthly packages and bundles in tabs: Wash & Iron · Iron only · Bundles. */
export function PackageTabs({ items }: { items: Svc[] }) {
  const groups = PACKAGE_GROUPS.filter((g) => items.some((p) => packageGroup(p.name) === g.id));
  const [tab, setTab] = useState<PackageGroup>(groups[0]?.id ?? "wash-iron");
  const list = items.filter((p) => packageGroup(p.name) === tab);
  if (!groups.length) return null;

  return (
    <div>
      <div role="tablist" aria-label="Package type" className="mx-auto flex w-full max-w-md rounded-full bg-white p-1 ring-1 ring-slate-200">
        {groups.map((g) => (
          <button key={g.id} role="tab" aria-selected={tab === g.id} onClick={() => setTab(g.id)}
            className={`flex-1 rounded-full px-2 py-2 text-xs font-semibold transition md:text-sm ${tab === g.id ? "bg-brand-600 text-white" : "text-slate-600"}`}>
            {g.label}
          </button>
        ))}
      </div>
      <ul className="mt-5 grid grid-cols-2 gap-3 md:mt-8 md:grid-cols-4 md:gap-5">
        {list.map((p, i) => {
          const [title, sub] = p.name.split(" – ");
          const lines = (p.description ?? "").split("·").map((x) => x.trim()).filter(Boolean);
          const best = tab !== "bundles" && i === 1;
          return (
            <li key={p.id} className={`lift relative flex flex-col rounded-2xl bg-white p-3.5 text-center md:p-6 ${best ? "ring-2 ring-brand-500" : "ring-1 ring-slate-200"}`}>
              {best && <span className="absolute -top-2.5 left-1/2 whitespace-nowrap rounded-full bg-amber-400 px-2.5 py-0.5 text-[10px] font-bold text-brand-900 md:text-xs" style={{ transform: "translateX(-50%)" }}>Best value</span>}
              <span className="mx-auto"><GarmentIcon name={tab === "iron-only" ? "iron" : /shalwar/i.test(p.name) ? "kameez" : /bedding/i.test(p.name) ? "blanket" : "shirt"} className="h-12 w-12 md:h-14 md:w-14" /></span>
              <h3 className="mt-2 text-sm font-bold leading-tight text-brand-900 md:text-lg">{tab === "bundles" ? title : title.replace(/^Monthly /, "") + " clothes"}</h3>
              <p className="text-[11px] text-slate-500 md:text-sm">{tab === "bundles" ? sub ?? "Bundle" : "per month"}</p>
              <p className="mt-2 text-xl font-extrabold text-brand-700 md:text-3xl">{rs(p.price)}</p>
              <p className="mt-1 flex-1 text-[11px] leading-snug text-slate-500 md:text-sm">{lines[tab === "bundles" ? 0 : 1] ?? ""}</p>
              <div className="mt-3 flex justify-center">
                <Stepper item={{ serviceId: p.id, name: p.name, price: p.price, unit: p.unit }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
