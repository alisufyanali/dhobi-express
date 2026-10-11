// Renders the reel to out/dhobi-express-reel.mp4  →  node video.mjs [--preview]
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { BASE_CSS, C, CONTACT, DIR, FOOTER, I_MAIL, I_PHONE, I_WEB, LOGO, LOGO_MARK } from "./shared.mjs";
import { ART } from "./art.mjs";

const W = 1080, H = 1920, FPS = 30, DUR = 25;

const CSS = `${BASE_CSS}
.stage{width:${W}px;height:${H}px}
.abs{position:absolute;left:0;right:0}
.scene{position:absolute;inset:0;opacity:0}
.topLogo{position:absolute;top:90px;left:0;right:0}
.footer{bottom:70px;font-size:27px}
.c{text-align:center}
.big{font-weight:900;line-height:1;letter-spacing:-2px;text-shadow:0 8px 0 rgba(8,50,100,.35),0 20px 50px rgba(0,30,70,.35)}
.kick{font-weight:600;font-size:44px;letter-spacing:14px;padding-left:14px}
.pill{display:inline-block;background:${C.yellow};color:${C.navy};font-weight:900;font-style:italic;border-radius:16px;
  padding:10px 36px 6px;box-shadow:0 10px 26px rgba(0,30,70,.35);white-space:nowrap}
.plate{position:absolute;left:50%;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff 0 55%,${C.pale} 100%);
  box-shadow:0 30px 60px rgba(0,30,70,.4),0 0 0 18px rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center}
.card{position:absolute;left:110px;right:110px;height:200px;background:#fff;border-radius:36px;color:${C.navy};display:flex;align-items:center;gap:30px;
  padding:0 40px;box-shadow:0 24px 50px rgba(0,30,70,.35)}
.card .ic{width:150px;height:150px;flex:none}
.card .n{width:64px;height:64px;border-radius:50%;background:${C.yellow};font-weight:900;font-size:34px;display:flex;align-items:center;justify-content:center;flex:none}
.card h4{font-weight:800;font-size:46px;line-height:1.1}
.card p{font-weight:500;font-size:28px;color:#41546d}
.price{position:absolute;left:110px;right:110px;height:170px;background:#fff;border-radius:32px;color:${C.navy};display:flex;align-items:center;
  justify-content:space-between;padding:0 46px;box-shadow:0 24px 50px rgba(0,30,70,.35)}
.price .l{font-weight:700;font-size:40px;line-height:1.15}.price .l small{display:block;font-weight:500;font-size:26px;color:#41546d}
.price .r{background:${C.navy};color:${C.yellow};font-weight:900;font-size:50px;border-radius:20px;padding:8px 26px}
.rise{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.4);
  background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.6) 0 12%,rgba(255,255,255,.08) 30%,rgba(255,255,255,.03) 70%)}
.contactBig{display:flex;flex-direction:column;gap:26px;align-items:center}
.contactBig div{background:rgba(8,40,80,.45);border:2px solid rgba(255,255,255,.25);border-radius:999px;padding:20px 46px;font-weight:700;font-size:44px;display:flex;gap:20px;align-items:center}
.contactBig b{color:${C.yellow}}
.contactBig svg{width:48px;height:48px;color:${C.yellow}}
`;

const steps = [["Pickup", "Rider ghar se kapray le jayega", "scooter"], ["Wash", "Har order alag, tag ke saath", "machine"], ["Press", "Steam press, tay aur pack", "iron"], ["Delivery", "24–48 ghante mein wapas", "box"]];
const prices = [["Shirt / Kameez", "Wash & Iron", "Rs. 80"], ["Koi bhi kapra", "Sirf Press", "Rs. 45"], ["Suit (2-piece)", "Dry Clean", "Rs. 650"], ["Razai", "Wash & Dry", "Rs. 700"]];

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage" id="stage">
  <div id="bubbles"></div>

  <!-- S1 intro -->
  <div class="scene" id="s1">
    <div class="abs c" style="top:560px"><div id="s1mark" style="display:inline-block">${LOGO_MARK(300)}</div></div>
    <div class="abs c big" id="s1name" style="top:930px;font-size:130px">Dhobi <span style="color:${C.yellow}">Express</span></div>
    <div class="abs c kick" id="s1tag" style="top:1100px;font-size:36px">LAUNDRY · PICKUP · DELIVERY</div>
    <div class="abs c" id="s1city" style="top:1210px"><span class="pill" style="font-size:52px">Karachi</span></div>
  </div>

  <div class="topLogo" id="top">${LOGO(1.25)}</div>

  <!-- S2 hook -->
  <div class="scene" id="s2">
    <div class="abs c big" id="s2a" style="top:300px;font-size:120px">Pani ka<br>masla?</div>
    <div class="abs c big" id="s2b" style="top:580px;font-size:120px">Time nahi?</div>
    <div class="abs c" id="s2c" style="top:790px"><span class="pill" style="font-size:66px;transform:rotate(-4deg);display:inline-block">Kapray hum dhoyenge!</span></div>
    <div class="plate" id="s2plate" style="top:1000px;width:560px;height:560px;margin-left:-280px"><div style="width:440px;height:440px" id="s2m">${ART.machine}</div></div>
  </div>

  <!-- S3 steps -->
  <div class="scene" id="s3">
    <div class="abs c kick" style="top:330px">4 ASAAN</div>
    <div class="abs c big" style="top:390px;font-size:170px">STEPS</div>
    ${steps.map(([t, d, a], i) => `<div class="card" id="st${i}" style="top:${640 + i * 240}px"><div class="n">${i + 1}</div><div class="ic">${ART[a]}</div><div><h4>${t}</h4><p>${d}</p></div></div>`).join("")}
  </div>

  <!-- S4 prices -->
  <div class="scene" id="s4">
    <div class="abs c kick" style="top:330px">MARKET SE KAM</div>
    <div class="abs c big" style="top:390px;font-size:170px">RATES</div>
    ${prices.map(([a, b, r], i) => `<div class="price" id="pr${i}" style="top:${650 + i * 210}px"><div class="l">${a}<small>${b}</small></div><div class="r">${r}</div></div>`).join("")}
  </div>

  <!-- S5 sunday -->
  <div class="scene" id="s5">
    <div class="abs c kick" style="top:330px">HAR ITWAR</div>
    <div class="abs c big" id="s5free" style="top:390px;font-size:230px">FREE</div>
    <div class="abs c" style="top:650px"><span class="pill" style="font-size:62px;transform:rotate(-4deg);display:inline-block">Pickup & Delivery</span></div>
    <div id="s5sc" style="position:absolute;top:870px;left:0;width:520px;height:520px">${ART.scooter}</div>
    <div class="abs c" style="top:1440px;font-weight:600;font-size:40px">Rs. 2,000+ ke order par <b style="color:${C.yellow}">har din free</b></div>
  </div>

  <!-- S6 offer -->
  <div class="scene" id="s6">
    <div class="abs c kick" style="top:330px">PEHLA ORDER</div>
    <div class="abs c big" id="s6big" style="top:390px;font-size:200px">10% OFF</div>
    <div class="plate" id="s6plate" style="top:700px;width:560px;height:560px;margin-left:-280px"><div style="width:440px;height:440px">${ART.coupon}</div></div>
    <div class="abs c" id="s6code" style="top:1340px"><span style="font-weight:600;font-size:40px">Code lagayein:</span><br><span class="pill" style="font-size:80px;margin-top:14px">WELCOME10</span></div>
  </div>

  <!-- S7 outro -->
  <div class="scene" id="s7">
    <div class="abs c big" id="s7a" style="top:360px;font-size:130px">Abhi order<br>karein!</div>
    <div class="abs c" id="s7b" style="top:700px;font-weight:600;font-size:38px;padding:0 90px;line-height:1.5">FB Area · Nazimabad · North Nazimabad · Gulshan-e-Iqbal & Central Karachi</div>
    <div class="abs contactBig" id="s7c" style="top:990px">
      <div id="cb0">${I_WEB} <b>${CONTACT.web}</b></div>
      <div id="cb1">${I_MAIL} ${CONTACT.email}</div>
      <div id="cb2">${I_PHONE} <b>${CONTACT.phone}</b></div>
    </div>
    <div class="abs c kick" id="s7d" style="top:1440px;font-size:32px">MON–SUN · 10AM–7PM</div>
  </div>

  <div id="foot">${FOOTER()}</div>
</div>
<script>
const $ = (id) => document.getElementById(id);
const clamp = (x) => Math.max(0, Math.min(1, x));
const p = (t, a, b) => clamp((t - a) / (b - a));
const out3 = (x) => 1 - Math.pow(1 - x, 3);
const back = (x) => { const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
// scene windows [start, end]
const S = { s1: [0, 3.2], s2: [3.2, 7.2], s3: [7.2, 12.4], s4: [12.4, 16.6], s5: [16.6, 19.8], s6: [19.8, 22.4], s7: [22.4, 25.5] };
function sceneOp(t, [a, b]) { return Math.min(p(t, a, a + .35), 1 - p(t, b - .3, b)); }
function pop(el, t, a, d = .5, from = 0) { const x = p(t, a, a + d); el.style.opacity = clamp(x * 3); el.style.transform = 'scale(' + (from + (1 - from) * back(x)) + ')'; }
function slide(el, t, a, dx = 0, dy = 80, d = .5) { const x = out3(p(t, a, a + d)); el.style.opacity = x; el.style.transform = 'translate(' + dx * (1 - x) + 'px,' + dy * (1 - x) + 'px)'; }

// rising bubbles
let seed = 7; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const B = Array.from({ length: 26 }, () => ({ x: rnd() * 1080, r: 12 + rnd() * 50, sp: 60 + rnd() * 120, ph: rnd() * 2400, sw: rnd() * 6 }));
$('bubbles').innerHTML = B.map((b, i) => '<div class="rise" id="b' + i + '"></div>').join('');

window.frame = (t) => {
  B.forEach((b, i) => { const el = $('b' + i); const y = 2050 - ((b.ph + t * b.sp) % 2300);
    el.style.cssText = 'left:' + (b.x + Math.sin(t + b.sw) * 18) + 'px;top:' + y + 'px;width:' + b.r * 2 + 'px;height:' + b.r * 2 + 'px'; });
  for (const k in S) $(k).style.opacity = sceneOp(t, S[k]);
  // top logo + footer visible after intro
  const tl = p(t, 3.0, 3.5); $('top').style.opacity = tl; $('top').style.transform = 'translateY(' + (-40 * (1 - tl)) + 'px)';
  $('foot').style.opacity = p(t, 2.6, 3.1) * (1 - p(t, 22.2, 22.6));
  // S1
  pop($('s1mark'), t, .15, .7); slide($('s1name'), t, .7); slide($('s1tag'), t, 1.1, 0, 40); pop($('s1city'), t, 1.5, .5);
  $('s1mark').style.transform += ' rotate(' + (1 - out3(p(t, .15, .9))) * -30 + 'deg)';
  // S2
  slide($('s2a'), t, 3.4, -120, 0); slide($('s2b'), t, 4.1, 120, 0); pop($('s2c'), t, 4.8, .5); pop($('s2plate'), t, 3.6, .7);
  $('s2m').style.transform = 'rotate(' + Math.sin(t * 9) * 2 + 'deg)';
  // S3
  [0, 1, 2, 3].forEach((i) => slide($('st' + i), t, 7.6 + i * .9, i % 2 ? 200 : -200, 0, .55));
  // S4
  [0, 1, 2, 3].forEach((i) => slide($('pr' + i), t, 12.8 + i * .6, 0, 100, .5));
  // S5 scooter drives in
  const sx = out3(p(t, 16.8, 18.0)); $('s5sc').style.transform = 'translateX(' + (-560 + sx * 840) + 'px) translateY(' + Math.sin(t * 22) * 4 + 'px)';
  pop($('s5free'), t, 16.8, .6, .6);
  // S6
  pop($('s6big'), t, 20.0, .6, .5); pop($('s6plate'), t, 20.3, .6); pop($('s6code'), t, 20.8, .5);
  $('s6plate').style.transform += ' rotate(' + Math.sin(t * 4) * 4 + 'deg)';
  // S7
  slide($('s7a'), t, 22.6); slide($('s7b'), t, 23.0, 0, 40); [0, 1, 2].forEach((i) => pop($('cb' + i), t, 23.3 + i * .25, .45)); slide($('s7d'), t, 24.0, 0, 30);
  const pulse = 1 + Math.max(0, Math.sin((t - 24) * 5)) * .04 * p(t, 24, 24.3); $('cb2').style.transform = 'scale(' + pulse + ')';
};
frame(0);
</script></body></html>`;

const f = join(DIR, "_video.html");
writeFileSync(f, html);
const preview = process.argv.includes("--preview");
const frames = join(DIR, "_frames");
rmSync(frames, { recursive: true, force: true }); mkdirSync(frames, { recursive: true });
mkdirSync(join(DIR, "out"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto("file://" + f, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const times = preview ? [1.6, 5.6, 11.5, 15.8, 18.5, 21.5, 24.8] : Array.from({ length: DUR * FPS }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.frame(t), t);
  await page.screenshot({ path: join(frames, String(i).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
  if (i % 150 === 0) console.log("frame", i, "/", times.length);
}
await browser.close();

if (preview) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", join(frames, "*.jpg"), "-vf", "scale=360:640,tile=7x1", "-frames:v", "1", join(DIR, "out", "video-preview.png")]);
} else {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(frames, "%04d.jpg"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-preset", "medium", "-movflags", "+faststart", join(DIR, "out", "dhobi-express-reel.mp4")]);
}
console.log("done");
