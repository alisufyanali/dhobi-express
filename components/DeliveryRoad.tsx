import { IconPin } from "./Icons";

function Truck() {
  return (
    <svg viewBox="0 0 64 40" className="h-9 w-14" aria-hidden>
      <rect x="2" y="8" width="36" height="22" rx="3" fill="#3aa5f3" />
      <path d="M38 14h12l8 9v7H38z" fill="#1a8cea" />
      <path d="M41 16h8l5 6H41z" fill="#d9edfd" />
      <rect x="8" y="14" width="14" height="4" rx="2" fill="#ffffff" opacity="0.9" />
      <rect x="8" y="20" width="22" height="3" rx="1.5" fill="#ffffff" opacity="0.6" />
      {[13, 48].map((cx) => (
        <g key={cx} className="spin-wheel">
          <circle cx={cx} cy="32" r="6" fill="#10243f" />
          <circle cx={cx} cy="32" r="2.4" fill="#d9edfd" />
          <rect x={cx - 0.8} y="26.5" width="1.6" height="4" fill="#d9edfd" />
        </g>
      ))}
    </svg>
  );
}

/** Animated band: a delivery truck drives from the customer's home to the shop and back again. */
export function DeliveryRoad({ title, sub }: { title: string; sub: string }) {
  return (
    <section className="container-x pb-10 md:pb-16" data-reveal>
      <div className="overflow-hidden rounded-2xl bg-brand-900 px-5 pb-4 pt-5 text-white md:px-8 md:pt-7">
        <p className="font-semibold md:text-lg">{title}</p>
        <p className="mt-0.5 text-xs text-white/70 md:text-sm">{sub}</p>
        <div className="relative mt-5 h-11">
          <div className="absolute inset-x-6 bottom-1.5 border-t-2 border-dashed border-white/25" />
          <span className="absolute bottom-0 left-0 flex items-center gap-1 text-[10px] text-white/60"><IconPin className="h-4 w-4 text-brand-500" />Home</span>
          <span className="absolute bottom-0 right-0 flex items-center gap-1 text-[10px] text-white/60">Shop<IconPin className="h-4 w-4 text-brand-500" /></span>
          <div className="drive absolute inset-x-0 bottom-2"><Truck /></div>
        </div>
      </div>
    </section>
  );
}
