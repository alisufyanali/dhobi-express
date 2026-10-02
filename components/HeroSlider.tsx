"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  eyebrow: string; title: string; highlight?: string; text: string; image: string; alt: string;
  primary: { label: string; href: string }; secondary?: { label: string; href: string; external?: boolean };
};

/** Full-width photo slider. Swipe on phones, arrows on desktop, auto-advances every 6 s, pauses on hover. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => {
    const el = ref.current;
    if (!el) return;
    const next = (n + slides.length) % slides.length;
    el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setI(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => !document.hidden && go(i + 1), 6000);
    return () => clearInterval(t);
  }, [i, paused, go]);

  return (
    <section className="relative" aria-roledescription="carousel" aria-label="Highlights"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div ref={ref} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {slides.map((s, n) => (
          <div key={s.title} className="relative h-[440px] w-full flex-none snap-center md:h-[520px]" aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}`}>
            <Image src={s.image} alt={s.alt} fill priority={n === 0} sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-brand-900/60" />
            <div className="container-x relative flex h-full flex-col justify-center text-white">
              <p className="text-xs font-semibold uppercase tracking-[.14em] text-brand-200">{s.eyebrow}</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
                {s.title} {s.highlight && <span className="text-brand-200">{s.highlight}</span>}
              </h2>
              <p className="mt-3 max-w-lg text-base text-white/85 md:text-lg">{s.text}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href={s.primary.href} className="btn bg-white text-base text-brand-900 hover:bg-brand-50">{s.primary.label}</Link>
                {s.secondary && (s.secondary.external
                  ? <a href={s.secondary.href} target="_blank" rel="noopener" className="btn border border-white/50 text-base text-white hover:bg-white/10">{s.secondary.label}</a>
                  : <Link href={s.secondary.href} className="btn border border-white/50 text-base text-white hover:bg-white/10">{s.secondary.label}</Link>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-900 hover:bg-white md:grid">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
      </button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-900 hover:bg-white md:grid">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
      </button>
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        {slides.map((s, n) => (
          <button key={s.title} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`}
            className={`h-2 rounded-full transition-all ${n === i ? "w-7 bg-white" : "w-2 bg-white/50"}`} />
        ))}
      </div>
    </section>
  );
}
