"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Fades sections in as they scroll into view. Elements opt in with data-reveal. */
export function RevealObserver() {
  const path = usePathname();
  useEffect(() => {
    (window as unknown as { __revealReady?: boolean }).__revealReady = true;
    const supported = "IntersectionObserver" in window;
    const io = supported
      ? new IntersectionObserver(
          (entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io!.unobserve(en.target); } }),
          { rootMargin: "0px 0px -6% 0px", threshold: 0.06 },
        )
      : null;
    const seen = new WeakSet<Element>();
    const scan = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        if (io) io.observe(el); else el.classList.add("is-in");
      });
    };
    scan();
    // Page content streams in after the loading skeleton, so watch for sections that arrive later
    let raf = 0;
    const mo = new MutationObserver(() => { cancelAnimationFrame(raf); raf = requestAnimationFrame(scan); });
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { mo.disconnect(); io?.disconnect(); cancelAnimationFrame(raf); };
  }, [path]);
  return null;
}

/** Runs in <head>: enables reveal styles, and shows everything after 3 s if the page script never loads. */
export const REVEAL_SCRIPT = `try{var h=document.documentElement;h.classList.add('js-reveal');setTimeout(function(){if(!window.__revealReady){h.classList.remove('js-reveal')}},3000)}catch(e){}`;
