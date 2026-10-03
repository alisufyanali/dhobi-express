/** Grey placeholder block that gently pulses while content loads. */
export function Sk({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200 ${className}`} aria-hidden />;
}

/** A list-row placeholder: text lines on the left, a round button on the right. */
export function SkRow() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="flex-1 space-y-2"><Sk className="h-3.5 w-2/3" /><Sk className="h-3 w-1/2" /></div>
      <Sk className="h-4 w-12" />
      <Sk className="h-8 w-8 rounded-full" />
    </div>
  );
}

export function LoadingLabel() {
  return <span className="sr-only" role="status">Loading…</span>;
}
