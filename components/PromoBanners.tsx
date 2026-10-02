"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export type Banner = { title: string; text: string; cta: string; href: string; image: string; tone: "blue" | "navy" | "light" };

const TONE = {
  blue: "bg-brand-600 text-white",
  navy: "bg-brand-900 text-white",
  light: "bg-brand-100 text-brand-900",
};

/** Swipeable promo banners on mobile (auto-advance), three-up grid on desktop. */
export function PromoBanners({ banners }: { banners: Banner[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => setActive(Math.round(el.scrollLeft / el.clientWidth));
    el.addEventListener("scroll", onScroll, { passive: true });
    const timer = setInterval(() => {
      if (window.innerWidth >= 768 || document.hidden) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % banners.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, 5000);
    return () => { el.removeEventListener("scroll", onScroll); clearInterval(timer); };
  }, [banners.length]);

  return (
    <div>
      <div ref={ref} className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible [&::-webkit-scrollbar]:hidden">
        {banners.map((b) => (
          <div key={b.title} className="w-full flex-none snap-center px-4 md:px-0">
            <Link href={b.href} className={`relative flex h-44 overflow-hidden rounded-2xl md:h-52 ${TONE[b.tone]}`}>
              <div className="relative z-10 flex w-[62%] flex-col p-5">
                <h3 className="text-lg font-bold leading-snug">{b.title}</h3>
                <p className={`mt-1 text-sm ${b.tone === "light" ? "text-slate-600" : "text-white/80"}`}>{b.text}</p>
                <span className={`mt-auto inline-flex w-fit rounded-lg px-3 py-1.5 text-xs font-semibold ${b.tone === "light" ? "bg-brand-600 text-white" : "bg-white text-brand-900"}`}>{b.cta}</span>
              </div>
              <div className="absolute inset-y-0 right-0 w-[42%]">
                <Image src={b.image} alt="" fill sizes="(min-width:768px) 180px, 40vw" className="object-cover" />
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-center gap-1.5 md:hidden" aria-hidden>
        {banners.map((b, i) => <span key={b.title} className={`h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-brand-600" : "w-1.5 bg-slate-300"}`} />)}
      </div>
    </div>
  );
}
