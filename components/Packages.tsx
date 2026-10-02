import { AddToCart } from "./AddToCart";
import { IconCheck } from "./Icons";
import { rs } from "@/lib/site";
import type { Svc } from "@/lib/data";

/** Package cards. Contents are stored in the service description, separated by "·". */
export function Packages({ items, label, addedLabel }: { items: Svc[]; label: string; addedLabel: string }) {
  return (
    <div className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:grid md:grid-cols-4 md:gap-5 md:overflow-visible md:px-0">
      {items.map((p, i) => (
        <article key={p.id} className={`card flex w-[72%] flex-none snap-start flex-col p-5 md:w-auto ${i === 0 ? "border-brand-500 ring-1 ring-brand-500" : ""}`}>
          {i === 0 && <span className="mb-2 w-fit rounded-full bg-brand-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">Most popular</span>}
          <h3 className="font-semibold text-brand-900">{p.name}</h3>
          <p className="mt-1 text-2xl font-bold text-brand-900">{rs(p.price)}</p>
          <ul className="mt-3 flex-1 space-y-1.5 text-sm text-slate-600">
            {(p.description ?? "").split("·").map((x) => x.trim()).filter(Boolean).map((x) => (
              <li key={x} className="flex gap-2"><IconCheck className="h-4 w-4 flex-none translate-y-0.5 text-brand-600" />{x}</li>
            ))}
          </ul>
          <div className="mt-4 [&>button]:w-full">
            <AddToCart item={{ serviceId: p.id, name: p.name, price: p.price, unit: p.unit }} label={label} addedLabel={addedLabel} />
          </div>
        </article>
      ))}
    </div>
  );
}
