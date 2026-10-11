// Problem → Solution posts → out/posts/17-*.png … 25-*.png   →  node problems.mjs [onlyFile]
// Drop a real photo at photos/<key>-before.jpg / photos/<key>-after.jpg and it replaces the illustration.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE_CSS, BUBBLES, C, DIR, FOOTER, LOGO } from "./shared.mjs";
import { ART } from "./art.mjs";

const svg = (b) => `<svg viewBox="0 0 400 400" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${b}</svg>`;
const spark = (x, y, s = 1, c = C.yellow) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0-22C3-6 6-3 22 0 6 3 3 6 0 22-3 6-6 3-22 0-6-3-3-6 0-22Z" fill="${c}"/>`;
const STAIN = "#9a6a3a";
const blob = (x, y, r, c = STAIN, o = .85) =>
  `<path transform="translate(${x} ${y}) scale(${r / 30})" d="M0-30c14 0 18 12 28 14s4 22-6 26-8 18-24 16-18-12-26-18-10-22 2-30 12-8 26-8Z" fill="${c}" opacity="${o}"/>`;

const SHIRT_PATH = "M128 110l46-18q26 26 52 0l46 18 52 54-36 34-18-14v152q-72 16-144 0V184l-18 14-36-34Z";
const shirt = ({ fill = "#fff", line = "#c9d6e3", stains = "", wrinkles = false, sparkles = false } = {}) => `
  <g ${wrinkles ? 'transform="rotate(-7 200 220) skewX(4)"' : ""}>
    <path d="${SHIRT_PATH}" fill="${fill}" stroke="${line}" stroke-width="5" stroke-linejoin="round"/>
    <path d="M128 110l46-18 26 42-20 14Zm144 0-46-18-26 42 20 14Z" fill="${fill}" stroke="${line}" stroke-width="5" stroke-linejoin="round"/>
    <rect x="197" y="134" width="6" height="200" fill="${line}"/>
    ${[170, 210, 250, 290].map((y) => `<circle cx="200" cy="${y}" r="6" fill="${line}"/>`).join("")}
    ${wrinkles ? `<g fill="none" stroke="#9fb0c3" stroke-width="5" stroke-linecap="round">
      <path d="M140 180l20 14-16 12 22 10"/><path d="M230 170l18 18-20 8 24 16"/><path d="M150 260l26-8-8 22 26-6"/><path d="M226 250l22 12-24 10 20 14"/><path d="M90 160l20 6"/><path d="M290 150l20 10"/></g>` : ""}
    ${stains}
  </g>
  ${sparkles ? spark(330, 96, 1.1) + spark(78, 250, .8) + spark(320, 300, .6, C.blue5) : ""}`;

const cross = `<g transform="translate(330 70)"><circle r="34" fill="#ef4444"/><path d="M-13-13l26 26M13-13l-26 26" stroke="#fff" stroke-width="9" stroke-linecap="round"/></g>`;

const PAIRS = {
  stain: [svg(shirt({ stains: blob(170, 200, 34) + blob(238, 262, 22) + blob(150, 290, 14, "#b5462a") })), svg(shirt({ sparkles: true }))],
  wrinkle: [svg(shirt({ fill: "#dce9f7", line: "#9fb0c3", wrinkles: true })), svg(shirt({ fill: C.blue, line: C.dark, sparkles: true }))],
  water: [svg(`
    <rect x="40" y="70" width="120" height="30" rx="8" fill="#9fb0c3"/>
    <path d="M150 85h80q30 0 30 30v40" fill="none" stroke="#9fb0c3" stroke-width="30" stroke-linecap="round"/>
    <rect x="216" y="56" width="50" height="22" rx="6" fill="#7b8da3"/>
    <path d="M260 185q10 18 0 26q-10-8 0-26Z" fill="${C.blue5}"/>
    <path d="M150 240h220l-24 120H174Z" fill="#cbd5e1" stroke="#94a3b8" stroke-width="6"/>
    <path d="M150 240q110-30 220 0" fill="none" stroke="#94a3b8" stroke-width="6"/>
    <path d="M190 330h140" stroke="#94a3b8" stroke-width="5" stroke-dasharray="4 10" stroke-linecap="round"/>
    <text x="80" y="320" font-family="Poppins" font-weight="900" font-size="64" fill="#ef4444">?!</text>`), ART.machine],
  power: [svg(`
    <rect x="0" y="0" width="400" height="400" fill="#1e293b"/>
    <circle cx="200" cy="150" r="70" fill="#334155" stroke="#64748b" stroke-width="8"/>
    <path d="M170 220h60v30h-60Z" fill="#64748b"/><path d="M175 262h50" stroke="#64748b" stroke-width="10" stroke-linecap="round"/>
    <path d="M185 160l15-25 15 25" fill="none" stroke="#475569" stroke-width="6"/>
    <rect x="70" y="300" width="34" height="70" rx="6" fill="#f8fafc"/><path d="M87 300q-14-20 0-40q14 20 0 40Z" fill="${C.yellow}"/>
    <path d="M250 330q40 0 60-30" fill="none" stroke="#64748b" stroke-width="8" stroke-linecap="round"/>
    <rect x="300" y="276" width="44" height="34" rx="6" fill="#64748b"/><path d="M344 284h18M344 302h18" stroke="#64748b" stroke-width="6"/>
    ${spark(90, 90, .5, "#475569")}`), ART.iron],
  pile: [svg(`
    <path d="M90 230h220l-24 140H114Z" fill="#d6b48a" stroke="#a87f51" stroke-width="6"/>
    ${[0, 1, 2, 3].map((i) => `<path d="M${100 + i * 4} ${262 + i * 28}h${200 - i * 8}" stroke="#a87f51" stroke-width="4"/>`).join("")}
    <path d="M70 240q30-80 80-60t60-50 70 30 60 70" fill="#ef7d9a"/>
    <path d="M110 200q20-60 70-40 40-40 80-10 40 10 50 60Z" fill="${C.blue5}"/>
    <path d="M150 160q30-50 70-30t60 20l-20 40H140Z" fill="${C.yellow}"/>
    <path d="M60 300q20-10 30 20l-30 30q-20-20 0-50Z" fill="#5fbf70"/>
    <path d="M320 330q30-20 40 10l-10 30-30-10Z" fill="#ef7d9a"/>
    <path d="M60 380h80" stroke="#94a3b8" stroke-width="10" stroke-linecap="round"/>`), svg(`
    <rect x="80" y="282" width="240" height="56" rx="14" fill="${C.blue}"/>
    <rect x="90" y="226" width="220" height="56" rx="14" fill="#ef7d9a"/>
    <rect x="100" y="170" width="200" height="56" rx="14" fill="#fff" stroke="${C.light}" stroke-width="4"/>
    <rect x="110" y="114" width="180" height="56" rx="14" fill="${C.yellow}"/>
    <rect x="120" y="58" width="160" height="56" rx="14" fill="#5fbf70"/>
    <path d="M60 350h280" stroke="${C.light}" stroke-width="10" stroke-linecap="round"/>
    ${spark(340, 80, 1)}${spark(60, 140, .7)}`)],
  rain: [svg(`
    <rect width="400" height="400" fill="#cbd5e1"/>
    <path d="M90 110a50 50 0 0 1 96-20 40 40 0 0 1 70 10 40 40 0 0 1 20 78H100a40 40 0 0 1-10-68Z" fill="#64748b"/>
    ${Array.from({ length: 14 }, (_, i) => `<path d="M${60 + i * 24} ${200 + (i % 3) * 14}l-10 26" stroke="${C.blue}" stroke-width="5" stroke-linecap="round"/>`).join("")}
    <path d="M20 250q180 30 360 0" fill="none" stroke="#475569" stroke-width="5"/>
    <path d="M80 256h70v100l-12-8-10 10-12-8-12 8-12-10-12 8Z" fill="#ef7d9a" opacity=".9"/>
    <path d="M230 262h90v80h-90Z" fill="${C.blue5}" opacity=".9"/>
    ${[[110, 372], [140, 380], [260, 360], [300, 372]].map(([x, y]) => `<path d="M${x} ${y}q6 10 0 14q-6-4 0-14Z" fill="${C.blue}"/>`).join("")}`), svg(`
    <circle cx="300" cy="100" r="46" fill="${C.yellow}"/>
    ${Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path d="M${300 + Math.cos(a) * 62} ${100 + Math.sin(a) * 62}L${300 + Math.cos(a) * 82} ${100 + Math.sin(a) * 82}" stroke="${C.yellow}" stroke-width="10" stroke-linecap="round"/>`; }).join("")}
    <rect x="70" y="270" width="250" height="60" rx="18" fill="#fff" stroke="${C.light}" stroke-width="5"/>
    <rect x="80" y="210" width="230" height="60" rx="18" fill="${C.blue5}"/>
    <rect x="90" y="150" width="210" height="60" rx="18" fill="#ef7d9a"/>
    <path d="M100 300h230M110 240h190" stroke="#fff" stroke-width="4" stroke-dasharray="10 10" opacity=".7"/>
    <path d="M60 350h280" stroke="${C.light}" stroke-width="10" stroke-linecap="round"/>`)],
  bridal: [svg(`
    <path d="M170 70h60l10 90H160Z" fill="#c81d4e"/><path d="M160 160h80l100 200H60Z" fill="#c81d4e"/>
    <path d="M60 360h280" stroke="#e2b04a" stroke-width="14"/><path d="M170 70q30 20 60 0" fill="none" stroke="#e2b04a" stroke-width="8"/>
    ${[[120, 300], [200, 260], [270, 320], [160, 220], [240, 210]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e2b04a"/>`).join("")}
    ${blob(210, 290, 30, "#7a4a1a", .8)}${blob(150, 330, 16, "#7a4a1a", .7)}`), svg(`
    <path d="M170 70h60l10 90H160Z" fill="#c81d4e"/><path d="M160 160h80l100 200H60Z" fill="#c81d4e"/>
    <path d="M60 360h280" stroke="#e2b04a" stroke-width="14"/><path d="M170 70q30 20 60 0" fill="none" stroke="#e2b04a" stroke-width="8"/>
    ${[[120, 300], [200, 260], [270, 320], [160, 220], [240, 210], [200, 330], [110, 340], [290, 345]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#e2b04a"/>`).join("")}
    ${spark(330, 110, 1.1)}${spark(70, 150, .8)}${spark(320, 250, .6, "#fff")}`)],
  collar: [svg(`
    <path d="M60 140q140-60 280 0v80q-140-50-280 0Z" fill="#fff" stroke="#c9d6e3" stroke-width="6"/>
    <path d="M70 200q130-46 260 0" fill="none" stroke="#b08d3c" stroke-width="18" opacity=".55" stroke-linecap="round"/>
    <path d="M80 214q120-36 240 0" fill="none" stroke="#6b7280" stroke-width="10" opacity=".45" stroke-linecap="round"/>
    <path d="M60 220l90 120 50-90 50 90 90-120" fill="#fff" stroke="#c9d6e3" stroke-width="6" stroke-linejoin="round"/>
    <path d="M150 340l50-90 50 90" fill="none" stroke="#b08d3c" stroke-width="10" opacity=".45"/>
    ${blob(110, 150, 12, "#b08d3c", .5)}${blob(300, 160, 10, "#b08d3c", .5)}`), svg(`
    <path d="M60 140q140-60 280 0v80q-140-50-280 0Z" fill="#fff" stroke="#c9d6e3" stroke-width="6"/>
    <path d="M60 220l90 120 50-90 50 90 90-120" fill="#fff" stroke="#c9d6e3" stroke-width="6" stroke-linejoin="round"/>
    <circle cx="200" cy="190" r="10" fill="#c9d6e3"/>
    ${spark(330, 80, 1.1)}${spark(70, 300, .8)}${spark(300, 330, .6, C.blue5)}`)],
  time: [svg(`
    <circle cx="120" cy="120" r="80" fill="#fff" stroke="#ef4444" stroke-width="12"/>
    <path d="M120 120V70M120 120l36 22" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>
    <rect x="130" y="220" width="220" height="130" rx="12" fill="${C.navy}"/><rect x="144" y="234" width="192" height="102" rx="6" fill="#94a3b8"/>
    <path d="M110 360h260" stroke="${C.navy}" stroke-width="16" stroke-linecap="round"/>
    ${[0, 1, 2, 3].map((i) => `<rect x="160" y="${248 + i * 20}" width="${150 - i * 26}" height="8" rx="4" fill="#64748b"/>`).join("")}
    <path d="M300 90q10 16 0 22q-10-6 0-22ZM330 130q8 12 0 18q-8-6 0-18Z" fill="${C.blue5}"/>`), svg(`
    <rect x="200" y="60" width="150" height="300" rx="10" fill="#c98b4a"/><rect x="216" y="76" width="118" height="128" rx="6" fill="#b7793b"/>
    <rect x="216" y="216" width="118" height="128" rx="6" fill="#b7793b"/><circle cx="322" cy="210" r="8" fill="${C.yellow}"/>
    <path d="M40 360h340" stroke="${C.light}" stroke-width="10" stroke-linecap="round"/>
    <path d="M60 210h120l-10 150H70Z" fill="${C.blue}"/><path d="M90 210q30-50 60 0" fill="none" stroke="${C.navy}" stroke-width="10"/>
    <rect x="96" y="250" width="48" height="36" rx="6" fill="#fff"/>
    <g transform="translate(130 150)"><circle r="34" fill="#22c55e"/><path d="M-14 0l9 10 19-20" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${spark(60, 120, .8)}`)],
};

const POSTS = [
  { file: "17-problem-stain", key: "stain", title: "DAAGH NAHI JAATA?", sol: "Chai, salan, ink — special stain treatment" },
  { file: "18-problem-wrinkle", key: "wrinkle", title: "SILWATON BHARE KAPRAY?", sol: "Professional steam press — sirf Rs. 45" },
  { file: "19-problem-water", key: "water", title: "PANI KA MASLA?", sol: "Hum dhoyenge — aap ka pani bachega" },
  { file: "20-problem-power", key: "power", title: "BIJLI GAYI? PRESS KAISE?", sol: "Load-shedding ho ya na ho — press ready" },
  { file: "21-problem-pile", key: "pile", title: "KAPRON KA PAHAAR?", sol: "Ek call — sab dhul kar, tay ho kar wapas" },
  { file: "22-problem-rain", key: "rain", title: "BAARISH MEIN NAHI SOOKHTE?", sol: "Poori tarah dry, fresh aur folded" },
  { file: "23-problem-bridal", key: "bridal", title: "SHAADI KA JORA KHARAB?", sol: "Bridal & lehenga dry clean — pooray ehtiyat se" },
  { file: "24-problem-collar", key: "collar", title: "COLLAR PAR MAIL?", sol: "Collar & cuff ki deep cleaning" },
  { file: "25-problem-time", key: "time", title: "OFFICE SE TIME NAHI?", sol: "Ghar se pickup, 24–48 ghante mein delivery" },
];

const photo = (key, side) => {
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    const f = join(DIR, "photos", `${key}-${side}.${ext}`);
    if (existsSync(f)) return `<img src="file://${f}" style="width:100%;height:100%;object-fit:cover">`;
  }
  return null;
};

const CSS = `${BASE_CSS}
.stage{width:1080px;height:1080px}
.top{position:absolute;top:44px;left:0;right:0}
.head{position:absolute;top:168px;left:0;right:0;text-align:center}
.prob{display:inline-block;background:#ef4444;color:#fff;font-weight:800;font-size:26px;letter-spacing:6px;padding:6px 22px 4px 28px;border-radius:999px;
  box-shadow:0 6px 16px rgba(120,0,0,.3)}
.title{font-weight:900;line-height:1;letter-spacing:-1.5px;white-space:nowrap;display:inline-block;margin-top:14px;
  text-shadow:0 6px 0 rgba(8,50,100,.35), 0 18px 40px rgba(0,30,70,.35)}
.pair{position:absolute;top:378px;left:60px;right:60px;display:flex;justify-content:space-between}
.card{position:relative;width:440px;height:440px;border-radius:40px;overflow:hidden;border:10px solid #fff;
  box-shadow:0 24px 50px rgba(0,30,70,.4)}
.card .in{position:absolute;left:0;right:0;top:0;bottom:58px;display:flex;align-items:center;justify-content:center}
.card .in > svg{width:92%;height:92%}
.card.bleed .in{bottom:0}.card.bleed .in > svg{width:100%;height:100%}
.card .in > img{position:absolute;inset:0}
.card.photo .in{bottom:0}
.before{background:#fde8e8}.after{background:radial-gradient(circle at 40% 35%,#fff 0 50%,${C.pale} 100%)}
.tag{position:absolute;left:50%;bottom:16px;transform:translateX(-50%);display:flex;align-items:center;gap:10px;white-space:nowrap;
  font-weight:800;font-size:26px;color:#fff;padding:8px 22px;border-radius:999px;box-shadow:0 6px 16px rgba(0,0,0,.25)}
.before .tag{background:#ef4444}.after .tag{background:#16a34a}
.tag b{font-size:28px}
.arrow{position:absolute;left:50%;top:548px;margin-left:-58px;width:116px;height:116px;border-radius:50%;background:${C.yellow};
  border:8px solid #fff;display:flex;align-items:center;justify-content:center;box-shadow:0 14px 30px rgba(0,30,70,.4);z-index:2}
.sol{position:absolute;left:0;right:0;top:852px;text-align:center}
.sol span{display:inline-block;background:${C.navy};color:#fff;font-weight:700;font-size:30px;padding:14px 34px;border-radius:999px;
  border:3px solid ${C.yellow};white-space:nowrap}
.sol b{color:${C.yellow};font-weight:800}
`;

const html = (p, i) => {
  const [b, a] = PAIRS[p.key];
  return `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage">
  ${BUBBLES(i + 31)}
  <div class="top">${LOGO(0.95)}</div>
  <div class="head"><div class="prob">PROBLEM?</div><br><div class="title" data-fit>${p.title}</div></div>
  <div class="pair">
    <div class="card before ${photo(p.key, "before") ? "photo" : ["power", "rain"].includes(p.key) ? "bleed" : ""}"><div class="in">${photo(p.key, "before") ?? b}</div><div class="tag"><b>✕</b> PEHLE</div></div>
    <div class="card after ${photo(p.key, "after") ? "photo" : ""}"><div class="in">${photo(p.key, "after") ?? a}</div><div class="tag"><b>✓</b> DHOBI EXPRESS</div></div>
  </div>
  <div class="arrow"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="${C.navy}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15M13 5l7 7-7 7"/></svg></div>
  <div class="sol"><span><b>Solution:</b> ${p.sol}</span></div>
  ${FOOTER()}
</div>
<script>
  const t = document.querySelector('[data-fit]'); let s = 110; t.style.fontSize = s + 'px';
  while (t.scrollWidth > 960 && s > 50) { s -= 2; t.style.fontSize = s + 'px'; }
  const sol = document.querySelector('.sol span'); let f = 30;
  while (sol.scrollWidth > 980 && f > 20) { f -= 1; sol.style.fontSize = f + 'px'; }
</script></body></html>`;
};

const only = process.argv[2];
const out = join(DIR, "out", "posts");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
for (const [i, p] of POSTS.entries()) {
  if (only && !p.file.startsWith(only)) continue;
  const f = join(DIR, "_problem.html"); writeFileSync(f, html(p, i));
  await page.goto("file://" + f, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, p.file + ".png") });
  console.log("✓", p.file);
}
await browser.close();
