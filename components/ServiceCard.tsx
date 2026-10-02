import Image from "next/image";
import { AddToCart } from "./AddToCart";
import { IconShirt } from "./Icons";
import { rs, UNIT_LABEL } from "@/lib/site";

type S = { id: string; name: string; nameUr: string | null; description: string | null; price: number; unit: "PER_PIECE" | "PER_KG"; imageUrl: string | null };

export function ServiceCard({ s, roman, label, addedLabel }: { s: S; roman: boolean; label: string; addedLabel: string }) {
  const name = roman && s.nameUr ? s.nameUr : s.name;
  return (
    <article className="card flex gap-4 p-3 md:flex-col md:p-0 md:overflow-hidden">
      <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl bg-brand-50 md:h-40 md:w-full md:rounded-none">
        {s.imageUrl ? (
          <Image src={s.imageUrl} alt={`${s.name} laundry service in Karachi`} fill sizes="(min-width:768px) 300px, 96px" className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-brand-500"><IconShirt className="h-10 w-10 md:h-14 md:w-14" /></div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col md:p-4">
        <h3 className="font-semibold text-slate-900">{name}</h3>
        {s.description && <p className="mt-0.5 line-clamp-2 text-sm text-slate-500">{s.description}</p>}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <p className="text-sm"><span className="text-lg font-bold text-brand-700">{rs(s.price)}</span> <span className="text-slate-500">{UNIT_LABEL[s.unit]}</span></p>
          <AddToCart item={{ serviceId: s.id, name: s.name, price: s.price, unit: s.unit }} label={label} addedLabel={addedLabel} />
        </div>
      </div>
    </article>
  );
}
