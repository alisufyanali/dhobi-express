import Image from "next/image";
import { canOptimize } from "@/lib/images";

type Logo = { id: string; name: string; imageUrl: string };

/** Continuous logo strip with the company name under each logo. Pauses on hover. */
export function ClientSlider({ logos, placeholder }: { logos: Logo[]; placeholder?: boolean }) {
  const items: Logo[] = logos.length
    ? logos
    : placeholder
      ? Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, name: "Your client", imageUrl: "" }))
      : [];
  if (!items.length) return null;
  const loop = [...items, ...items]; // duplicated so the strip scrolls seamlessly

  return (
    <div className="group relative overflow-hidden">
      <ul className="animate-marquee flex w-max gap-4 group-hover:[animation-play-state:paused]">
        {loop.map((l, i) => (
          <li key={`${l.id}-${i}`} aria-hidden={i >= items.length} className="flex w-40 flex-none flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-4">
            <div className="relative grid h-12 w-full place-items-center">
              {l.imageUrl
                ? <Image unoptimized={!canOptimize(l.imageUrl)} src={l.imageUrl} alt={l.name} fill sizes="160px" className="object-contain" />
                : <span className="h-10 w-24 rounded-md border border-dashed border-slate-300" />}
            </div>
            <span className="truncate text-xs font-medium text-slate-600">{l.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
