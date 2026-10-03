"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type Slide = {
  eyebrow: string; title: string; highlight?: string; text: string; code?: string;
  image: string; alt: string; tone?: "blue" | "deep";
  primary: { label: string; href: string }; secondary?: { label: string; href: string; external?: boolean };
};

/** Deal-card carousel (Laundo-style): solid blue card, text left, photo right. Swipe, arrows, auto-advance. */
export function HeroSlider({ slides }: { slides: Slide[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback((n: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ left: ((n + slides.length) % slides.length) * el.clientWidth, behavior: "smooth" });
  }, [slides.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setI(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => !document.hidden && go(i + 1), 5000);
    return () => clearInterval(t);
  }, [i, paused, go]);

  return (
    <section className="container-x pt-4 md:pt-8" aria-roledescription="carousel" aria-label="Offers"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)}>
      <div className="relative">
        <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto rounded-2xl md:rounded-3xl">
          {slides.map((s, n) => (
            <div key={s.title} aria-roledescription="slide" aria-label={`${n + 1} of ${slides.length}`}
              className={`relative flex h-44 w-full flex-none snap-center overflow-hidden md:h-[380px] ${s.tone === "deep" ? "bg-brand-700" : "bg-brand-500"}`}>
              {[[8, 14, 0], [22, 8, 2.5], [36, 18, 5], [48, 10, 1.2], [14, 22, 6.5]].map(([left, size, delay]) => (
                <span key={left} aria-hidden className="bubble" style={{ left: `${left}%`, width: size, height: size, animationDelay: `${delay}s` }} />
              ))}
              <div className="relative z-10 flex w-[60%] flex-col justify-center p-4 text-white md:w-1/2 md:p-12">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/85 md:text-sm">{s.eyebrow}</p>
                <h2 className="mt-1 text-lg font-extrabold leading-tight md:mt-3 md:text-5xl">
                  {s.title} {s.highlight && <span className="text-brand-100">{s.highlight}</span>}
                </h2>
                <p className="mt-3 hidden max-w-md text-lg text-white/85 md:block">{s.text}</p>
                {s.code && <p className="mt-1.5 text-[11px] font-semibold underline underline-offset-2 md:mt-4 md:text-base">APPLY CODE: {s.code}</p>}
                <div className="mt-3 flex gap-3 md:mt-7">
                  <Link href={s.primary.href} className="btn bg-white px-3.5 py-1.5 text-xs text-brand-700 hover:bg-brand-50 md:px-6 md:py-3 md:text-base">{s.primary.label}</Link>
                  {s.secondary && (
                    <span className="hidden md:contents">
                      {s.secondary.external
                        ? <a href={s.secondary.href} target="_blank" rel="noopener" className="btn border border-white/60 text-base text-white hover:bg-white/10">{s.secondary.label}</a>
                        : <Link href={s.secondary.href} className="btn border border-white/60 text-base text-white hover:bg-white/10">{s.secondary.label}</Link>}
                    </span>
                  )}
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 w-[44%] overflow-hidden rounded-l-[48px] md:w-1/2 md:rounded-l-[140px]">
                <Image src={s.image} alt={s.alt} fill priority={n === 0} sizes="(min-width:768px) 560px, 45vw" className="object-cover" />
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => go(i - 1)} aria-label="Previous offer" className="absolute inset-y-0 -left-5 my-auto hidden h-11 w-11 place-items-center rounded-full bg-white text-brand-900 shadow-md hover:bg-brand-50 md:grid">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
        </button>
        <button onClick={() => go(i + 1)} aria-label="Next offer" className="absolute inset-y-0 -right-5 my-auto hidden h-11 w-11 place-items-center rounded-full bg-white text-brand-900 shadow-md hover:bg-brand-50 md:grid">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
        </button>
      </div>
      <div className="mt-2.5 flex justify-center gap-1.5">
        {slides.map((s, n) => (
          <button key={s.title} onClick={() => go(n)} aria-label={`Go to offer ${n + 1}`}
            className={`h-1.5 rounded-full transition-all ${n === i ? "w-5 bg-brand-600" : "w-1.5 bg-slate-300"}`} />
        ))}
      </div>
    </section>
  );
}
