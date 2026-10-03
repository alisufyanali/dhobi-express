import { rs } from "@/lib/site";

/** Scrolling offer line at the very top of every page. Static when the phone asks for reduced motion. */
export function AnnouncementBar({ threshold }: { threshold: number }) {
  const items = [
    <>New customer? <b>10% off</b> your first order — code <b>WELCOME10</b></>,
    <>Free pickup &amp; delivery above <b>{rs(threshold)}</b></>,
    <>Any order size <b>free on Sunday</b></>,
    <>Clothes back in <b>24–48 hours</b></>,
  ];
  const strip = (hidden: boolean) => (
    <ul className="flex flex-none items-center" aria-hidden={hidden || undefined}>
      {items.map((it, i) => (
        <li key={i} className="flex flex-none items-center whitespace-nowrap px-5">
          <span>{it}</span>
          <span aria-hidden className="ml-10 h-1 w-1 rounded-full bg-white/60" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="overflow-hidden bg-brand-700 py-2 text-xs text-white md:text-[13px]" role="region" aria-label="Offers">
      <div className="marquee-track flex w-max">{strip(false)}{strip(true)}</div>
    </div>
  );
}
