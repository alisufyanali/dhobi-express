/**
 * Flat garment illustrations for item rows (no network images needed — instant on any phone).
 * garmentFor() picks a drawing from the item name.
 */
const B = "#3aa5f3", D = "#1272c4", L = "#d9edfd", W = "#ffffff", A = "#fbbf24", R = "#f87171", G = "#34d399", S = "#64748b", P = "#c084fc";

const ICONS: Record<string, React.ReactNode> = {
  shirt: <><path d="M14 10l6-3h8l6 3 8 6-4 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V21l-4 2-4-7z" fill={B} /><path d="M20 7l4 6 4-6" fill="none" stroke={W} strokeWidth="2" strokeLinejoin="round" /><path d="M24 13v27" stroke={W} strokeWidth="1.5" /><circle cx="26.5" cy="20" r="1" fill={W} /><circle cx="26.5" cy="27" r="1" fill={W} /><circle cx="26.5" cy="34" r="1" fill={W} /></>,
  tshirt: <><path d="M14 9l6-2q4 5 8 0l6 2 8 7-4 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V21l-4 2-4-7z" fill={A} /><path d="M18 30h12" stroke={W} strokeWidth="2" strokeLinecap="round" opacity=".7" /></>,
  kameez: <><path d="M15 8l6-3h6l6 3 6 7-3 6-3-2v25H18V19l-3 2-3-6z" fill={B} /><path d="M24 5v10" stroke={W} strokeWidth="1.5" /><path d="M18 36h12" stroke={L} strokeWidth="2" /></>,
  trouser: <><path d="M15 6h18l2 36h-8l-3-25-3 25h-8z" fill={S} /><path d="M15 10h18" stroke={W} strokeWidth="1.5" /></>,
  jeans: <><path d="M15 6h18l2 36h-8l-3-25-3 25h-8z" fill={D} /><path d="M15 10h18M19 10v5M29 10v5" stroke={L} strokeWidth="1.5" /></>,
  shorts: <><path d="M13 11h22l2 19h-10l-3-10-3 10H11z" fill={G} /><path d="M13 15h22" stroke={W} strokeWidth="1.5" /></>,
  sweater: <><path d="M14 9l6-2q4 4 8 0l6 2 8 8-4 6-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V21l-4 2-4-6z" fill={R} /><path d="M16 38h16M16 35h16" stroke={W} strokeWidth="1.2" opacity=".7" /><path d="M7 21l3 2M41 21l-3 2" stroke={W} strokeWidth="1.2" /></>,
  jacket: <><path d="M14 9l6-2h8l6 2 7 8-3 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V22l-4 2-3-7z" fill={D} /><path d="M24 8v34" stroke={A} strokeWidth="1.5" /><rect x="16" y="28" width="5" height="4" rx="1" fill={L} /><rect x="27" y="28" width="5" height="4" rx="1" fill={L} /></>,
  blazer: <><path d="M14 9l6-2h8l6 2 7 8-3 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V22l-4 2-3-7z" fill={S} /><path d="M20 7l4 14 4-14" fill={W} /><circle cx="24" cy="27" r="1.2" fill={W} /><circle cx="24" cy="33" r="1.2" fill={W} /></>,
  suit: <><path d="M14 9l6-2h8l6 2 7 8-3 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V22l-4 2-3-7z" fill="#1e293b" /><path d="M20 7l4 14 4-14" fill={W} /><path d="M24 9l-1.5 3 1.5 10 1.5-10z" fill={R} /></>,
  sherwani: <><path d="M15 8l6-3h6l6 3 6 8-3 6-3-2v26H18V20l-3 2-3-6z" fill={A} /><path d="M24 5v39" stroke={D} strokeWidth="1.2" />{[12, 18, 24, 30, 36].map((y) => <circle key={y} cx="24" cy={y} r="1" fill={D} />)}</>,
  labcoat: <><path d="M15 8l6-3h6l6 3 6 8-3 6-3-2v24H18V20l-3 2-3-6z" fill={W} stroke={B} strokeWidth="1.5" /><path d="M21 5l3 8 3-8M24 13v29" fill="none" stroke={B} strokeWidth="1.5" /><rect x="27" y="22" width="4" height="4" rx="1" fill={L} /></>,
  waistcoat: <><path d="M16 7h5l3 8 3-8h5l2 10v23a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V17z" fill={D} />{[22, 28, 34].map((y) => <circle key={y} cx="24" cy={y} r="1.1" fill={A} />)}</>,
  vest: <><path d="M17 6h4q3 5 6 0h4l1 8 3 4v24H13V18l3-4z" fill={L} stroke={B} strokeWidth="1.2" /></>,
  socks: <><path d="M17 5h10v20l8 6a5 5 0 0 1-3 9l-12-6a6 6 0 0 1-3-5z" fill={P} /><path d="M17 10h10" stroke={W} strokeWidth="2" /></>,
  dupatta: <><path d="M8 12c8-6 24-6 32 0l-4 22c-8-4-16-4-24 0z" fill={P} /><path d="M12 34v5M16 33v5M20 32v5M24 32v5M28 32v5M32 33v5M36 34v5" stroke={P} strokeWidth="1.2" /></>,
  abaya: <><path d="M19 5h10l4 6 6 31H9l6-31z" fill="#1e293b" /><path d="M24 11v31" stroke={S} strokeWidth="1" /><path d="M19 5q5 6 10 0" fill="none" stroke={S} strokeWidth="1.2" /></>,
  nightwear: <><path d="M14 9l6-2q4 4 8 0l6 2 7 7-3 6-4-2v10H14V20l-4 2-3-6z" fill={L} stroke={B} strokeWidth="1.2" /><path d="M15 31h18l1 12h-7l-3-8-3 8h-7z" fill={B} /><circle cx="20" cy="17" r="1.2" fill={A} /><circle cx="28" cy="22" r="1.2" fill={A} /></>,
  dress: <><path d="M19 5h10l1 12h-12z" fill={R} /><path d="M18 17h12l9 26H9z" fill={R} /><path d="M18 17h12" stroke={A} strokeWidth="2" /><path d="M12 38h24" stroke={A} strokeWidth="1.5" /></>,
  frock: <><path d="M15 10l5-3h8l5 3 4 6-4 2-3-2v3H18v-3l-3 2-4-2z" fill={P} /><path d="M18 19h12l8 20H10z" fill={P} /><path d="M12 35h24" stroke={W} strokeWidth="1.5" /></>,
  uniform: <><path d="M14 10l6-3h8l6 3 8 6-4 7-4-2v19a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V21l-4 2-4-7z" fill={W} stroke={B} strokeWidth="1.5" /><path d="M20 7l4 6 4-6" fill="none" stroke={B} strokeWidth="1.5" /><path d="M24 13l-1.5 3 1.5 10 1.5-10z" fill={D} /><rect x="28" y="20" width="4" height="5" rx="1" fill={A} /></>,
  bedsheet: <><rect x="8" y="30" width="32" height="9" rx="3" fill={B} /><rect x="10" y="21" width="28" height="9" rx="3" fill={L} stroke={B} strokeWidth="1" /><rect x="12" y="12" width="24" height="9" rx="3" fill={A} /></>,
  pillow: <><path d="M8 16q16-8 32 0v16q-16 8-32 0z" fill={L} stroke={B} strokeWidth="1.5" /><path d="M14 24q10-3 20 0" fill="none" stroke={B} strokeWidth="1" opacity=".6" /></>,
  blanket: <><rect x="6" y="14" width="36" height="22" rx="6" fill={R} /><path d="M6 22h36M6 28h36" stroke={W} strokeWidth="1.5" opacity=".6" /><path d="M12 14v22M36 14v22" stroke={W} strokeWidth="1" opacity=".5" /></>,
  curtain: <><path d="M6 7h36" stroke={S} strokeWidth="2.5" strokeLinecap="round" /><path d="M8 8h11c0 14-5 22-3 33H8z" fill={B} /><path d="M40 8H29c0 14 5 22 3 33h8z" fill={B} /></>,
  sofa: <><rect x="10" y="14" width="28" height="12" rx="4" fill={B} /><rect x="5" y="20" width="9" height="16" rx="3" fill={D} /><rect x="34" y="20" width="9" height="16" rx="3" fill={D} /><rect x="12" y="25" width="24" height="9" rx="2" fill={L} /><path d="M9 36v4M39 36v4" stroke={S} strokeWidth="2" /></>,
  tablecloth: <><path d="M6 16h36l-4 12H10z" fill={A} /><path d="M10 28v12M38 28v12" stroke={S} strokeWidth="2.5" /><path d="M10 28l2-12M38 28l-2-12" stroke={W} strokeWidth="1" opacity=".6" /></>,
  towel: <><path d="M8 9h32" stroke={S} strokeWidth="2.5" strokeLinecap="round" /><rect x="13" y="10" width="22" height="30" rx="3" fill={G} /><path d="M13 33h22M13 36h22" stroke={W} strokeWidth="1.5" /></>,
  prayermat: <><rect x="11" y="6" width="26" height="36" rx="2" fill={D} /><path d="M17 20v-4a7 7 0 0 1 14 0v4z" fill={A} /><rect x="14" y="9" width="20" height="30" rx="1" fill="none" stroke={A} strokeWidth="1" /></>,
  basket: <><path d="M10 20h28l-3 20H13z" fill={A} /><path d="M10 20h28" stroke={D} strokeWidth="2" /><path d="M15 20c0-6 4-9 9-9s9 3 9 9" fill={B} /><path d="M16 25v10M24 25v10M32 25v10" stroke={W} strokeWidth="1.2" opacity=".7" /></>,
  iron: <><path d="M10 34c0-9 7-16 18-16h8a4 4 0 0 1 4 4v12z" fill={B} /><path d="M18 18c0-5 3-8 8-8h10" fill="none" stroke={D} strokeWidth="3" strokeLinecap="round" /><rect x="8" y="34" width="34" height="5" rx="2" fill={D} /><circle cx="30" cy="27" r="2" fill={W} /><path d="M12 43c2-1 4 1 6 0M22 43c2-1 4 1 6 0" stroke={L} strokeWidth="1.5" fill="none" /></>,
  washer: <><rect x="9" y="5" width="30" height="38" rx="4" fill={W} stroke={B} strokeWidth="2" /><path d="M9 13h30" stroke={B} strokeWidth="1.5" /><circle cx="15" cy="9" r="1.5" fill={B} /><circle cx="20" cy="9" r="1.5" fill={A} /><circle cx="24" cy="28" r="10" fill={L} stroke={B} strokeWidth="2" /><path d="M16 30q4-4 8 0t8 0" fill="none" stroke={B} strokeWidth="2" /></>,
  hanger: <><path d="M24 14a4 4 0 1 1 4-4" fill="none" stroke={S} strokeWidth="2" strokeLinecap="round" /><path d="M24 14v3L6 30h36L24 17" fill="none" stroke={S} strokeWidth="2" strokeLinejoin="round" /><path d="M13 30l3 12h16l3-12z" fill={B} /></>,
  box: <><rect x="8" y="16" width="32" height="24" rx="3" fill={B} /><rect x="6" y="11" width="36" height="8" rx="2" fill={D} /><path d="M24 11v29" stroke={A} strokeWidth="3" /><path d="M24 11c-4-6-10-5-8 0M24 11c4-6 10-5 8 0" fill="none" stroke={A} strokeWidth="2" /></>,
};

const RULES: [RegExp, string][] = [
  [/socks/, "socks"], [/vest|undergarment/, "vest"], [/waistcoat/, "waistcoat"], [/lab coat/, "labcoat"],
  [/t-shirt|polo/, "tshirt"], [/uniform/, "uniform"], [/sherwani/, "sherwani"], [/suit \(|formal suit/, "suit"],
  [/coat|blazer/, "blazer"], [/jacket/, "jacket"], [/track/, "tracksuit"], [/sweater|hoodie|cardigan/, "sweater"],
  [/kameez|kurta|kurti/, "kameez"], [/jeans/, "jeans"], [/shalwar|trouser|pant/, "trouser"], [/shorts/, "shorts"],
  [/shirt/, "shirt"], [/dupatta|shawl/, "dupatta"], [/abaya/, "abaya"], [/night/, "nightwear"],
  [/saree|lehenga|bridal|fancy/, "dress"], [/frock/, "frock"], [/quilt cover|bedsheet/, "bedsheet"],
  [/pillow|cushion/, "pillow"], [/razai|quilt|blanket|comforter|duvet/, "blanket"], [/curtain/, "curtain"],
  [/sofa/, "sofa"], [/table/, "tablecloth"], [/towel/, "towel"], [/namaz|prayer/, "prayermat"], [/mixed|kg/, "basket"],
];

export function garmentFor(name: string): string {
  const n = name.toLowerCase();
  for (const [re, key] of RULES) if (re.test(n)) return key === "tracksuit" ? "jacket" : key;
  return "box";
}

export function GarmentIcon({ name, className = "h-11 w-11" }: { name: string; className?: string }) {
  return (
    <span className={`grid flex-none place-items-center rounded-xl bg-brand-50 ${className}`} aria-hidden>
      <svg viewBox="0 0 48 48" className="h-[78%] w-[78%]">{ICONS[garmentFor(name)]}</svg>
    </span>
  );
}

const TYPE_ART: Record<string, string> = { "wash-iron": "shirt", "iron-only": "iron", "wash-only": "washer", "dry-clean": "suit", "per-kg": "basket", packages: "box" };

/** Large illustration placed behind a service photo — what shows while the photo loads or if it can't load. */
export function TypeArt({ slug }: { slug: string }) {
  return (
    <span className="absolute inset-0 grid place-items-center bg-brand-50" aria-hidden>
      <svg viewBox="0 0 48 48" className="h-1/2 w-1/2">{ICONS[TYPE_ART[slug] ?? "hanger"]}</svg>
    </span>
  );
}
