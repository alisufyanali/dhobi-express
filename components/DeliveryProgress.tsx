import { rs } from "@/lib/site";

export function DeliveryProgress({ subtotal, threshold }: { subtotal: number; threshold: number }) {
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  const left = threshold - subtotal;
  return (
    <div className="rounded-xl bg-brand-50 p-4">
      <p className="text-sm font-medium text-brand-900">
        {left > 0 ? <>Add <b>{rs(left)}</b> more for free delivery — or book pickup & delivery on Sunday.</> : <>You get free pickup &amp; delivery.</>}
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-white" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-brand-600 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
