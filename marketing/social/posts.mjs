// Renders every post to out/posts/*.png  →  node posts.mjs [onlyFile]
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { BASE_CSS, BUBBLES, C, DIR, FOOTER, LOGO } from "./shared.mjs";
import { ART } from "./art.mjs";

const STEP_ICONS = {
  Pickup: ART.scooter, Wash: ART.machine, Press: ART.iron, Delivery: ART.box,
};

const POSTS = [
  { file: "01-wash-iron", kicker: "WASH &", title: "IRON", pill: "Rs. 80 se", art: "shirt", sub: "Dhulai + steam press · ghar se pickup" },
  { file: "02-dry-clean", kicker: "PROFESSIONAL", title: "DRY CLEAN", pill: "Suit Rs. 650", art: "suit", sub: "Suit · Coat · Blazer · Waistcoat" },
  { file: "03-steam-press", kicker: "STEAM", title: "PRESS", pill: "Sirf Rs. 45", art: "iron", sub: "Kadak press, tay kar ke pack" },
  { file: "04-free-pickup", kicker: "HAR ITWAR", title: "FREE", pill: "Pickup & Delivery", art: "scooter", sub: "Rs. 2,000+ ke order par har din free" },
  { file: "05-welcome-offer", kicker: "PEHLA ORDER", title: "10% OFF", pill: "Code: WELCOME10", art: "coupon", sub: "Checkout par code lagayein" },
  { file: "06-24-48-hours", kicker: "SAAF KAPRAY WAPAS", title: "24–48", pill: "Ghante mein", art: "clock", sub: "Pickup se delivery tak — super fast" },
  { file: "07-bedsheets", kicker: "FRESH", title: "BEDSHEETS", pill: "Rs. 120 se", art: "sheets", sub: "Chadar · Takiye ke ghilaf · Towels" },
  { file: "08-razai-blanket", kicker: "SARDI KI TAYYARI", title: "RAZAI", pill: "Kambal bhi!", art: "quilt", badge: ["SIRF", "Rs. 500", "se shuru"], sub: "Razai · Kambal · Comforter — poori tarah dry" },
  { file: "09-curtains", kicker: "SPOTLESS", title: "CURTAINS", pill: "Rs. 300 / panel", art: "curtains", sub: "Parday · Sofa covers · Table cloth" },
  { file: "10-sherwani", kicker: "SHAADI SEASON", title: "SHERWANI", pill: "Dry Clean Rs. 900", art: "sherwani", sub: "Sherwani · Lehenga · Bridal — pooray ehtiyat se" },
  { file: "11-monthly-package", kicker: "MONTHLY", title: "PACKAGE", pill: "50 kapray Rs. 3,999", art: "box", badge: ["SIRF", "Rs. 80", "per piece"], sub: "Har mahine ki tension khatam" },
  { file: "12-how-it-works", kicker: "4 ASAAN", title: "STEPS", pill: "Bas order karein", center: "steps" },
  { file: "13-areas", kicker: "HUM YAHAN", title: "SERVICE", pill: "Central Karachi", center: "areas" },
  { file: "14-live-tracking", kicker: "LIVE ORDER", title: "TRACKING", pill: "Har step dekhein", art: "phone", sub: "Order code se website par track karein" },
  { file: "15-for-business", kicker: "COMMERCIAL", title: "LAUNDRY", pill: "For Business", art: "building", sub: "Hotels · Hospitals · Banquets · Offices" },
  { file: "16-easy-payment", kicker: "EASY", title: "PAYMENT", pill: "Jo aapko pasand", art: "wallet", sub: "Cash on Delivery · JazzCash · Easypaisa · Bank" },
];

const AREAS = ["Federal B Area", "Nazimabad", "North Nazimabad", "Naya Nazimabad", "Liaquatabad", "North Karachi", "New Karachi", "Gulshan-e-Iqbal"];

const CSS = `${BASE_CSS}
.stage{width:1080px;height:1080px}
.top{position:absolute;top:44px;left:0;right:0}
.head{position:absolute;top:176px;left:0;right:0;text-align:center}
.kicker{font-weight:600;font-size:34px;letter-spacing:12px;padding-left:12px;opacity:.95}
.title{font-weight:900;line-height:.98;letter-spacing:-2px;white-space:nowrap;display:inline-block;
  text-shadow:0 6px 0 rgba(8,50,100,.35), 0 18px 40px rgba(0,30,70,.35)}
.tw{position:relative;display:inline-block}
.pill{position:absolute;right:-40px;bottom:-54px;transform:rotate(-4deg);background:${C.yellow};color:${C.navy};
  font-weight:900;font-style:italic;font-size:40px;padding:6px 26px 4px;border-radius:12px;white-space:nowrap;
  box-shadow:0 8px 20px rgba(0,30,70,.3)}
.plate{position:absolute;left:50%;top:478px;width:430px;height:430px;margin-left:-215px;border-radius:50%;
  background:radial-gradient(circle at 40% 35%, #fff 0 55%, ${C.pale} 100%);
  box-shadow:0 30px 60px rgba(0,30,70,.4), inset 0 -12px 30px rgba(26,140,234,.15), 0 0 0 14px rgba(255,255,255,.15);
  display:flex;align-items:center;justify-content:center}
.plate .art{width:340px;height:340px}
.plate .photo{width:100%;height:100%;border-radius:50%;object-fit:cover}
.badge{position:absolute;left:50%;margin-left:140px;top:640px;width:180px;height:180px;border-radius:50%;background:${C.navy};
  border:6px solid ${C.yellow};display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(8deg);
  box-shadow:0 14px 30px rgba(0,20,50,.4)}
.badge b{font-size:44px;font-weight:900;color:${C.yellow};line-height:1.05}
.badge small{font-size:17px;font-weight:600;letter-spacing:2px}
.sub{position:absolute;left:0;right:0;top:930px;text-align:center;font-weight:600;font-size:29px;
  text-shadow:0 2px 8px rgba(0,30,70,.4)}
.steps{position:absolute;left:90px;right:90px;top:500px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
.step{background:#fff;border-radius:28px;padding:22px 10px 20px;text-align:center;color:${C.navy};box-shadow:0 20px 40px rgba(0,30,70,.35);position:relative}
.step .ic{width:150px;height:150px;margin:0 auto 6px}
.step .n{position:absolute;top:-22px;left:50%;margin-left:-24px;width:48px;height:48px;border-radius:50%;background:${C.yellow};
  font-weight:900;font-size:26px;display:flex;align-items:center;justify-content:center}
.step h4{font-weight:800;font-size:28px}
.step p{font-weight:500;font-size:17px;line-height:1.3;color:#41546d;margin-top:4px;min-height:66px}
.areas{position:absolute;left:80px;right:80px;top:480px;display:flex;flex-direction:column;align-items:center;gap:26px}
.pin{width:170px;height:170px}
.chips{display:flex;flex-wrap:wrap;gap:14px;justify-content:center}
.chip{background:#fff;color:${C.navy};font-weight:700;font-size:28px;padding:10px 24px;border-radius:999px;box-shadow:0 10px 24px rgba(0,30,70,.3)}
.chip:before{content:"";display:inline-block;width:12px;height:12px;border-radius:50%;background:${C.blue};margin-right:12px;vertical-align:middle}
`;

const STEP_TEXT = [
  ["Pickup", "Rider ghar se kapray le jayega"],
  ["Wash", "Har order alag, tag ke saath"],
  ["Press", "Steam press, tay aur pack"],
  ["Delivery", "24–48 ghante mein wapas"],
];

const PIN = `<svg viewBox="0 0 100 100" width="100%" height="100%"><ellipse cx="50" cy="94" rx="22" ry="5" fill="rgba(0,20,60,.3)"/>
<path d="M50 4a32 32 0 0 1 32 32c0 24-32 56-32 56S18 60 18 36A32 32 0 0 1 50 4Z" fill="${C.yellow}"/><circle cx="50" cy="36" r="14" fill="${C.navy}"/></svg>`;

function center(p) {
  if (p.center === "steps")
    return `<div class="steps">${STEP_TEXT.map(([t, d], i) => `<div class="step"><div class="n">${i + 1}</div><div class="ic">${STEP_ICONS[t]}</div><h4>${t}</h4><p>${d}</p></div>`).join("")}</div>
      <div class="sub" style="top:905px">Online ya WhatsApp par book karein</div>`;
  if (p.center === "areas")
    return `<div class="areas"><div class="pin">${PIN}</div><div class="chips">${AREAS.map((a) => `<span class="chip">${a}</span>`).join("")}</div></div>`;
  const ph = ["jpg", "jpeg", "png", "webp"].map((e) => join(DIR, "photos", `${p.file}.${e}`)).find(existsSync);
  return `<div class="plate">${ph ? `<img class="photo" src="file://${ph}">` : `<div class="art">${ART[p.art]}</div>`}</div>
    ${p.badge ? `<div class="badge"><small>${p.badge[0]}</small><b>${p.badge[1]}</b><small>${p.badge[2]}</small></div>` : ""}
    ${p.sub ? `<div class="sub">${p.sub}</div>` : ""}`;
}

const html = (p, i) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage">
  ${BUBBLES(i + 3)}
  <div class="top">${LOGO(0.95)}</div>
  <div class="head">
    <div class="kicker">${p.kicker}</div>
    <div class="tw"><div class="title" data-fit>${p.title}</div><div class="pill">${p.pill}</div></div>
  </div>
  ${center(p)}
  ${FOOTER()}
</div>
<script>
  // Fit the big headline to the width, like the reference's one-word titles.
  const t = document.querySelector('[data-fit]'); let s = 170; t.style.fontSize = s + 'px';
  while (t.scrollWidth > 860 && s > 60) { s -= 2; t.style.fontSize = s + 'px'; }
</script></body></html>`;

const only = process.argv[2];
const out = join(DIR, "out", "posts");
mkdirSync(out, { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 } });
for (const [i, p] of POSTS.entries()) {
  if (only && !p.file.startsWith(only)) continue;
  const f = join(DIR, "_post.html"); writeFileSync(f, html(p, i));
  await page.goto("file://" + f, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: join(out, p.file + ".png"), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
  console.log("✓", p.file);
}
await browser.close();
