"use client";
import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void> };

/**
 * "Install the app" — appears only when the browser offers installation (Android Chrome, desktop Chrome/Edge)
 * and the site isn't already installed. variant="card" is the home-page banner; "button" is for the menu.
 */
export function InstallApp({ variant = "button" }: { variant?: "button" | "card" }) {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    try { if (localStorage.getItem("install-dismissed") === "1" && variant === "card") setDismissed(true); } catch {}
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    const onInstalled = () => setEvt(null);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => { window.removeEventListener("beforeinstallprompt", onPrompt); window.removeEventListener("appinstalled", onInstalled); };
  }, [variant]);

  if (!evt || dismissed) return null;
  const install = async () => { try { await evt.prompt(); } catch {} setEvt(null); };

  if (variant === "button") {
    return <button onClick={install} className="btn-ghost w-full">Install the app</button>;
  }
  return (
    <div className="container-x pt-3 md:hidden">
      <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-slate-200">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon-192.png" alt="" className="h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-brand-900">Get the Dhobi Express app</p>
          <p className="text-xs text-slate-500">Book in 2 taps from your home screen</p>
        </div>
        <button onClick={install} className="rounded-lg bg-brand-600 px-3 py-2 text-xs font-semibold text-white">Install</button>
        <button onClick={() => { setDismissed(true); try { localStorage.setItem("install-dismissed", "1"); } catch {} }} aria-label="Dismiss" className="p-1 text-slate-400">
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </div>
    </div>
  );
}
