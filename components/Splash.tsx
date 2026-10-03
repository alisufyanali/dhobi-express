import { WashingMachine } from "./WashingMachine";

/**
 * Phone-only welcome screen, once per visit (~1 s). Pure CSS: it fades itself out even
 * before JavaScript loads, and a tiny script in <head> hides it on later page loads,
 * inside the installed app (Android already shows its own splash), and on desktop.
 */
export function Splash() {
  return (
    <div id="splash" aria-hidden className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-600 text-white md:hidden">
      <div className="splash-pop flex flex-col items-center">
        <WashingMachine id="splash" className="h-36 w-28 drop-shadow-xl" />
        <p className="mt-5 text-2xl font-bold tracking-tight">Dhobi Express</p>
        <p className="mt-1 text-sm text-white/80">Kapray hum dhoyenge</p>
      </div>
      <div className="absolute bottom-16 flex gap-1.5">
        {[0, 1, 2].map((i) => <span key={i} className="splash-dot h-2 w-2 rounded-full bg-white" style={{ animationDelay: `${i * 0.15}s` }} />)}
      </div>
      <p className="absolute bottom-8 text-xs text-white/70">Laundry pickup &amp; delivery · Karachi</p>
    </div>
  );
}

/** Runs before first paint: decides whether the splash shows at all. */
export const SPLASH_SCRIPT = `try{var d=document.documentElement;if(sessionStorage.getItem('de-splash')||window.matchMedia('(display-mode: standalone)').matches||window.innerWidth>=768){d.classList.add('no-splash')}else{sessionStorage.setItem('de-splash','1')}}catch(e){document.documentElement.classList.add('no-splash')}`;
