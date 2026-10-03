"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal rail that auto-advances one card at a time, loops, pauses on hover/touch,
 * and has arrows on desktop. Children are the cards (each a direct child with snap-start).
 */
export function AutoRail({ children, label, every = 3500, className = "" }: { children: React.ReactNode; label: string; every?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const step = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const w = card ? card.offsetWidth + parseFloat(getComputedStyle(el).columnGap || "16") : el.clientWidth;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const atStart = el.scrollLeft <= 4;
    if (dir === 1 && atEnd) el.scrollTo({ left: 0, behavior: "smooth" });
    else if (dir === -1 && atStart) el.scrollTo({ left: el.scrollWidth, behavior: "smooth" });
    else el.scrollBy({ left: dir * w, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => !document.hidden && step(1), every);
    return () => clearInterval(t);
  }, [paused, step, every]);

  useEffect(() => {
    if (!paused) return;
    const t = setTimeout(() => setPaused(false), 8000);
    return () => clearTimeout(t);
  }, [paused]);

  return (
    <div className="relative" aria-roledescription="carousel" aria-label={label}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onTouchStart={() => setPaused(true)} onFocus={() => setPaused(true)}>
      <div ref={ref} className={`no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-2 md:gap-5 md:scroll-px-0 md:px-0 ${className}`}>
        {children}
      </div>
      <button type="button" onClick={() => step(-1)} aria-label="Previous" className="absolute -left-5 top-[38%] hidden h-11 w-11 place-items-center rounded-full bg-white text-brand-900 shadow-md ring-1 ring-slate-200 hover:bg-brand-50 md:grid">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
      </button>
      <button type="button" onClick={() => step(1)} aria-label="Next" className="absolute -right-5 top-[38%] hidden h-11 w-11 place-items-center rounded-full bg-white text-brand-900 shadow-md ring-1 ring-slate-200 hover:bg-brand-50 md:grid">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
      </button>
    </div>
  );
}
