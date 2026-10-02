import { IconCheck, IconDrop, IconIron, IconTruck } from "./Icons";

/** Decorative app-style order card for the hero (inspired by the app references). Pure markup, no images. */
export function HeroPhone() {
  const steps = [
    { I: IconCheck, l: "Picked up", done: true },
    { I: IconDrop, l: "Washing", done: true },
    { I: IconIron, l: "Pressing", done: false },
    { I: IconTruck, l: "Delivery", done: false },
  ];
  return (
    <div className="relative mx-auto w-[300px] lg:w-[330px]" aria-hidden>
      <div className="absolute -inset-10 rounded-full bg-glow/20 blur-3xl" />
      <div className="relative rounded-[44px] border border-white/15 bg-white/5 p-3 shadow-2xl shadow-black/50 backdrop-blur">
        <div className="bg-navy-glow overflow-hidden rounded-[34px] px-5 pb-6 pt-5 text-white">
          <div className="flex items-center justify-between text-[11px] text-brand-200"><span>9:41</span><span className="h-1.5 w-16 rounded-full bg-white/20" /><span>●●●</span></div>
          <p className="mt-5 text-xs text-brand-200">Assalam o Alaikum</p>
          <p className="text-lg font-semibold">Ayesha</p>
          <div className="mt-4 rounded-3xl bg-white/10 p-4 ring-1 ring-white/10">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Order DE-24817</p>
              <span className="rounded-full bg-glow/20 px-2 py-0.5 text-[10px] font-semibold text-glow">In progress</span>
            </div>
            <p className="mt-0.5 text-[11px] text-brand-200">Pickup today · 4pm–7pm</p>
            <div className="mt-4 flex items-center justify-between">
              {steps.map(({ I, l, done }, i) => (
                <div key={l} className="flex flex-1 items-center">
                  <span className={`grid h-9 w-9 flex-none place-items-center rounded-full ${done ? "bg-brand-500 text-white" : "bg-white/10 text-brand-200"}`}><I className="h-4 w-4" /></span>
                  {i < steps.length - 1 && <span className={`mx-1 h-0.5 flex-1 rounded ${done ? "bg-brand-500" : "border-t border-dashed border-white/25"}`} />}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs"><b>Washing</b> <span className="text-brand-200">— your clothes are in safe hands</span></p>
          </div>
          <p className="mt-5 text-xs font-semibold text-brand-200">Your items</p>
          {[["Shalwar Kameez", "× 4", "Rs. 480"], ["Bedsheet set", "× 2", "Rs. 500"], ["Quilt (Razai)", "× 1", "Rs. 700"]].map(([n, q, p]) => (
            <div key={n} className="mt-2 flex items-center gap-3 rounded-2xl bg-white/5 p-2.5 ring-1 ring-white/10">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600/60"><IconDrop className="h-4 w-4" /></span>
              <span className="flex-1 text-xs">{n} <span className="text-brand-200">{q}</span></span>
              <span className="text-xs font-semibold text-glow">{p}</span>
            </div>
          ))}
          <div className="mt-4 rounded-full bg-brand-600 py-3 text-center text-sm font-semibold">Track Order</div>
        </div>
      </div>
      <div className="absolute -left-10 top-24 hidden rounded-2xl bg-white px-4 py-3 text-brand-900 shadow-xl lg:block">
        <p className="text-[10px] font-bold uppercase tracking-wider text-brand-600">Sunday</p>
        <p className="text-sm font-extrabold">Free delivery</p>
      </div>
      <div className="absolute -right-8 bottom-28 hidden rounded-2xl bg-sun-400 px-4 py-3 text-brand-900 shadow-xl lg:block">
        <p className="text-sm font-extrabold">24–48h</p><p className="text-[10px] font-semibold">turnaround</p>
      </div>
    </div>
  );
}
