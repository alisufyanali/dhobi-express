import Image from "next/image";
import { AddToCart } from "./AddToCart";
import { rs, UNIT_LABEL } from "@/lib/site";
import { imageFor } from "@/lib/images";
import type { Svc } from "@/lib/data";

export function ServiceCard({ s, roman, label, addedLabel }: { s: Svc; roman: boolean; label: string; addedLabel: string }) {
  const name = roman && s.nameUr ? s.nameUr : s.name;
  return (
    <article className="card flex gap-3 overflow-hidden p-3 md:flex-col md:gap-0 md:p-0">
      <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl bg-brand-50 md:h-44 md:w-full md:rounded-none">
        <Image src={s.imageUrl || imageFor(s.category.slug)} alt={`${s.name} — laundry service in Karachi`} fill sizes="(min-width:768px) 360px, 96px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col md:p-4">
        <h3 className="font-semibold text-brand-900">{name}</h3>
        {s.description && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{s.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-sm"><span className="text-lg font-bold text-brand-900">{rs(s.price)}</span> <span className="text-slate-500">{UNIT_LABEL[s.unit]}</span></p>
          <AddToCart item={{ serviceId: s.id, name: s.name, price: s.price, unit: s.unit }} label={label} addedLabel={addedLabel} />
        </div>
      </div>
    </article>
  );
}
