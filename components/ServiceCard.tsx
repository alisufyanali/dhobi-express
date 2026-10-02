import Image from "next/image";
import { AddToCart } from "./AddToCart";
import { rs, UNIT_LABEL } from "@/lib/site";
import { imageFor, canOptimize } from "@/lib/images";
import type { Svc } from "@/lib/data";

/** Vertical photo card: two per row on phones, three or four on larger screens. */
export function ServiceCard({ s, roman, label, addedLabel }: { s: Svc; roman: boolean; label: string; addedLabel: string }) {
  const name = roman && s.nameUr ? s.nameUr : s.name;
  const src = s.imageUrl || imageFor(s.category.slug);
  const isPackage = s.category.slug === "packages";
  return (
    <article className="card flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-brand-50">
        <Image unoptimized={!canOptimize(src)} src={src} alt={`${s.name} — laundry service in Karachi`} fill sizes="(min-width:1024px) 280px, (min-width:768px) 33vw, 50vw" className="object-cover" />
      </div>
      <div className="flex flex-1 flex-col p-3 md:p-4">
        <h3 className="text-sm font-semibold leading-snug text-brand-900 md:text-base">{name}</h3>
        {s.description && <p className="mt-1 line-clamp-2 text-xs text-slate-500 md:text-sm">{s.description}</p>}
        <p className="mt-auto pt-2 text-sm">
          <span className="text-base font-bold text-brand-900 md:text-lg">{rs(s.price)}</span>{" "}
          <span className="text-xs text-slate-500">{isPackage ? "package" : UNIT_LABEL[s.unit]}</span>
        </p>
        <div className="mt-2 [&>button]:w-full [&>button]:px-3 [&>button]:py-2.5">
          <AddToCart item={{ serviceId: s.id, name: s.name, price: s.price, unit: s.unit }} label={label} addedLabel={addedLabel} />
        </div>
      </div>
    </article>
  );
}
