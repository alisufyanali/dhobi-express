import { directionsUrl, hasShopLocation, mapEmbedUrl } from "@/lib/location";
import { IconClock, IconPin } from "./Icons";

type S = { address: string; mapsUrl: string; latitude: number | null; longitude: number | null; openingHours: string; phone: string };

/** "Visit our shop" card with a lazy-loaded Google map and a directions button. Renders nothing until a location is set. */
export function ShopLocation({ s, compact = false }: { s: S; compact?: boolean }) {
  if (!hasShopLocation(s)) return null;
  return (
    <section className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200 md:grid md:grid-cols-[1fr_1.2fr]">
      <div className="p-5 md:p-7">
        <h2 className="text-lg font-semibold text-brand-900 md:text-xl">Visit our shop</h2>
        <p className="mt-3 flex gap-2.5 text-slate-700"><IconPin className="mt-0.5 h-5 w-5 flex-none text-brand-600" />{s.address}</p>
        <p className="mt-2 flex gap-2.5 text-slate-700"><IconClock className="mt-0.5 h-5 w-5 flex-none text-brand-600" />{s.openingHours}</p>
        {!compact && <p className="mt-3 text-sm text-slate-500">Drop off and collect at the shop, or book a free pickup from home.</p>}
        <div className="mt-5 flex flex-wrap gap-2">
          <a href={directionsUrl(s)} target="_blank" rel="noopener" className="btn-primary">Get directions</a>
          <a href={`tel:${s.phone}`} className="btn-ghost">Call</a>
        </div>
      </div>
      <iframe
        title="Dhobi Express shop location on Google Maps"
        src={mapEmbedUrl(s)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`block w-full border-0 ${compact ? "h-48" : "h-56"} md:h-full md:min-h-[280px]`}
      />
    </section>
  );
}
