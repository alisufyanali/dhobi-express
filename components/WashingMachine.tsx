/** Animated washing machine: spinning drum with tumbling clothes, water and bubbles. Pure SVG + CSS. */
export function WashingMachine({ id, className = "" }: { id: string; className?: string }) {
  const clip = `wm-glass-${id}`;
  return (
    <svg viewBox="0 0 120 150" className={className} role="img" aria-label="Washing machine spinning clothes">
      <defs><clipPath id={clip}><circle cx="60" cy="88" r="31" /></clipPath></defs>
      <rect x="20" y="142" width="14" height="7" rx="2" fill="#b4dbfb" />
      <rect x="86" y="142" width="14" height="7" rx="2" fill="#b4dbfb" />
      <g className="wm-body">
        <rect x="8" y="6" width="104" height="138" rx="16" fill="#ffffff" stroke="#b4dbfb" strokeWidth="3" />
        <line x1="10" y1="36" x2="110" y2="36" stroke="#d9edfd" strokeWidth="2" />
        <circle cx="26" cy="21" r="5" fill="#3aa5f3" />
        <circle cx="42" cy="21" r="5" fill="#b4dbfb" />
        <rect x="64" y="14" width="36" height="13" rx="4" fill="#10243f" />
        <circle cx="72" cy="20.5" r="2" fill="#34d399" />
        <rect x="78" y="19" width="16" height="3" rx="1.5" fill="#3aa5f3" />
        <circle cx="60" cy="88" r="41" fill="#d9edfd" />
        <circle cx="60" cy="88" r="35" fill="#1a8cea" />
        <g clipPath={`url(#${clip})`}>
          <rect x="25" y="53" width="70" height="70" fill="#eef7fe" />
          <g className="wm-drum">
            <path d="M44 72 l6 -6 h8 l6 6 -5 5 -3 -3 v14 h-12 v-14 l-3 3z" fill="#3aa5f3" />
            <rect x="63" y="89" width="17" height="10" rx="3" fill="#fbbf24" transform="rotate(25 71 94)" />
            <circle cx="49" cy="104" r="6" fill="#34d399" />
            <rect x="66" y="66" width="12" height="8" rx="2" fill="#f87171" transform="rotate(-20 72 70)" />
          </g>
          <path className="wm-wave" d="M15 98 q10 -6 20 0 t20 0 t20 0 t20 0 t20 0 v40 h-100z" fill="#3aa5f3" opacity="0.35" />
          {[[46, 114, 0], [58, 118, 0.6], [70, 113, 1.1], [64, 120, 1.6]].map(([x, y, d]) => (
            <circle key={`${x}-${y}`} className="wm-bubble" cx={x} cy={y} r="2.6" fill="#ffffff" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
        <circle cx="60" cy="88" r="31" fill="none" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
        <path d="M41 73 a24 24 0 0 1 16 -10" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.75" />
      </g>
    </svg>
  );
}
