// Showcase reel of the 16 finished posts, with music + SFX → out/dhobi-express-showcase.mp4
//   node showcase.mjs [postsDir] [--preview]
// postsDir defaults to photos/real-posts (01.jpg … 16.jpg, square). Swap in full-size originals for a sharper video.
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, resolve } from "node:path";
import { BASE_CSS, C, CONTACT, DIR, FOOTER, I_MAIL, I_PHONE, I_WEB, LOGO, LOGO_MARK } from "./shared.mjs";
import { MASCOT } from "./mascot.mjs";

const W = 1080, H = 1920, FPS = 30, DUR = 30;
const args = process.argv.slice(2);
const preview = args.includes("--preview");
const postsDir = resolve(args.find((a) => !a.startsWith("--")) ?? join(DIR, "photos", "real-posts"));
const LABELS = ["Wash & Iron", "Dry Clean", "Steam Press", "Free Pickup", "10% OFF", "24–48 Ghante", "Bedsheets", "Razai & Kambal",
  "Curtains", "Sherwani", "Monthly Package", "4 Asaan Steps", "Service Areas", "Live Tracking", "For Business", "Easy Payment"];
const T0 = 2.5, STEP = 1.5, OUTRO = T0 + STEP * LABELS.length; // 26.5

const CSS = `${BASE_CSS}
.stage{width:${W}px;height:${H}px}
#cam{position:absolute;inset:0}
.abs{position:absolute;left:0;right:0}.c{text-align:center}
.big{font-weight:900;line-height:1;letter-spacing:-2px;text-shadow:0 8px 0 rgba(8,50,100,.35),0 20px 50px rgba(0,30,70,.35)}
.kick{font-weight:600;font-size:40px;letter-spacing:12px;padding-left:12px}
.pill{display:inline-block;background:${C.yellow};color:${C.navy};font-weight:900;font-style:italic;border-radius:18px;padding:10px 38px 6px;
  box-shadow:0 10px 26px rgba(0,30,70,.35);white-space:nowrap}
.topLogo{position:absolute;top:80px;left:0;right:0}
.footer{bottom:64px;font-size:27px}
#rays{position:absolute;left:50%;top:50%;width:3000px;height:3000px;margin:-1500px 0 0 -1500px;border-radius:50%;
  background:repeating-conic-gradient(rgba(255,255,255,.13) 0 9deg, rgba(255,255,255,0) 9deg 18deg);
  -webkit-mask:radial-gradient(circle,#000 0,#000 18%,transparent 55%);mask:radial-gradient(circle,#000 0,#000 18%,transparent 55%)}
.rise{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.45);
  background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.65) 0 12%,rgba(255,255,255,.08) 30%,rgba(255,255,255,.03) 70%)}
.card{position:absolute;left:70px;top:420px;width:940px;height:940px;border-radius:44px;overflow:hidden;border:10px solid #fff;
  box-shadow:0 40px 80px rgba(0,20,60,.5);opacity:0;transform-origin:50% 60%}
.card img{width:100%;height:100%;display:block;transform-origin:50% 45%}
#label{position:absolute;left:0;right:0;top:262px;text-align:center}
#label span{display:inline-block;font-weight:900;font-size:76px;letter-spacing:-1px;color:#fff;text-shadow:0 6px 0 rgba(8,50,100,.35)}
#label i{display:block;margin:6px auto 0;height:10px;border-radius:5px;background:${C.yellow}}
#count{position:absolute;left:70px;top:1392px;font-weight:800;font-size:30px;color:${C.yellow}}
#bar{position:absolute;left:190px;right:70px;top:1406px;display:flex;gap:8px}
#bar b{flex:1;height:10px;border-radius:5px;background:rgba(255,255,255,.25)}
#bar b.on{background:${C.yellow}}
.mw{position:absolute;left:0;top:0;width:300px;height:420px;transform-origin:150px 420px}
#say{position:absolute;background:#fff;color:${C.navy};font-weight:800;font-size:40px;padding:18px 32px;border-radius:36px;
  box-shadow:0 16px 40px rgba(0,30,70,.35);white-space:nowrap;transform-origin:80% 100%}
#say:after{content:"";position:absolute;right:-14px;bottom:30px;border:16px solid transparent;border-left:26px solid #fff;border-right:0}
#cta{position:absolute;left:70px;top:1480px}
#cta .ct1{font-weight:900;font-size:64px;line-height:1;text-shadow:0 6px 0 rgba(8,50,100,.35)}
#cta .ct2{display:inline-flex;align-items:center;gap:14px;margin-top:18px;background:${C.yellow};color:${C.navy};font-weight:900;font-size:44px;
  padding:10px 30px;border-radius:999px;box-shadow:0 10px 26px rgba(0,30,70,.35)}
#cta .ct2 svg{width:44px;height:44px}
#cta .ct3{margin-top:16px;font-weight:600;font-size:30px;opacity:.95}
.contactBig{display:flex;flex-direction:column;gap:24px;align-items:center}
.contactBig div{background:rgba(8,40,80,.5);border:2px solid rgba(255,255,255,.25);border-radius:999px;padding:18px 44px;font-weight:700;font-size:44px;display:flex;gap:20px;align-items:center}
.contactBig b{color:${C.yellow}}.contactBig svg{width:48px;height:48px;color:${C.yellow}}
.conf{position:absolute;left:0;top:0;width:22px;height:12px;border-radius:3px}
#flash{position:absolute;inset:0;background:#fff;opacity:0}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage"><div id="rays"></div><div id="bubbles"></div>
<div id="cam">
  <div id="intro">
    <div class="abs c" style="top:260px"><div id="aMark" style="display:inline-block">${LOGO_MARK(220)}</div></div>
    <div class="abs c big" id="aName" style="top:520px;font-size:124px">Dhobi <span style="color:${C.yellow}">Express</span></div>
    <div class="abs c" id="aPill" style="top:690px"><span class="pill" style="font-size:60px;transform:rotate(-3deg)">Hamari Services 👇</span></div>
  </div>
  <div class="topLogo" id="top">${LOGO(1.2)}</div>
  <div id="label"><span id="labelTxt"></span><i id="labelBar"></i></div>
  ${LABELS.map((_, k) => `<div class="card" id="card${k}"><img src="file://${join(postsDir, String(k + 1).padStart(2, "0") + ".jpg")}"></div>`).join("")}
  <div id="cta"><div class="ct1">Order karein <span>👉</span></div><div class="ct2">${I_PHONE}<b>${CONTACT.phone}</b></div><div class="ct3">Free pickup · 24–48 ghante</div></div>
  <div id="count"></div><div id="bar">${LABELS.map((_, k) => `<b id="seg${k}"></b>`).join("")}</div>
  <div id="outro">
    <div class="abs c big" id="o1" style="top:290px;font-size:120px">Abhi order<br>karein!</div>
    <div class="abs contactBig" id="o2" style="top:1180px">
      <div id="cb0">${I_WEB} <b>${CONTACT.web}</b></div><div id="cb1">${I_MAIL} ${CONTACT.email}</div><div id="cb2">${I_PHONE} <b>${CONTACT.phone}</b></div>
    </div>
    <div class="abs c kick" id="o3" style="top:1640px;font-size:30px">MON–SUN · 10AM–7PM</div>
  </div>
  <div class="mw" id="mw">${MASCOT("m")}</div>
  <div id="say"></div>
  <div id="confetti"></div>
  <div id="foot">${FOOTER()}</div>
</div><div id="flash"></div></div>
<script>
const $ = (id) => document.getElementById(id);
const clamp = (x) => Math.max(0, Math.min(1, x));
const p = (t, a, b) => clamp((t - a) / (b - a));
const out3 = (x) => 1 - Math.pow(1 - x, 3);
const in2 = (x) => x * x;
const back = (x) => { const c = 2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const LABELS = ${JSON.stringify(LABELS)}, T0 = ${T0}, STEP = ${STEP}, OUTRO = ${OUTRO}, BEAT = .5;
let seed = 5; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
const BB = Array.from({ length: 30 }, () => ({ x: rnd() * 1080, r: 12 + rnd() * 50, sp: 80 + rnd() * 150, ph: rnd() * 2400, sw: rnd() * 6 }));
$('bubbles').innerHTML = BB.map((b, i) => '<div class="rise" id="bb' + i + '"></div>').join('');
const COLS = ['${C.yellow}', '#fff', '#ff6b8a', '#5fd38a', '${C.light}'];
const CONF = [T0 + STEP * 4 + .2, OUTRO + .2];
const CP = CONF.map(() => Array.from({ length: 70 }, () => ({ a: -Math.PI / 2 + (rnd() - .5) * 2.4, v: 900 + rnd() * 1300, rot: rnd() * 720 - 360, c: COLS[Math.floor(rnd() * COLS.length)], w: .6 + rnd() * .9 })));
$('confetti').innerHTML = CP.map((ps, k) => ps.map((q, i) => '<div class="conf" id="cf' + k + '_' + i + '" style="background:' + q.c + '"></div>').join('')).join('');

function pop(el, t, a, d = .45, extra = '') { const x = p(t, a, a + d); el.style.opacity = clamp(x * 4); el.style.transform = 'scale(' + back(x) + ')' + extra; }
function slide(el, t, a, dx = 0, dy = 60, d = .45) { const x = out3(p(t, a, a + d)); el.style.opacity = x; el.style.transform = 'translate(' + dx * (1 - x) + 'px,' + dy * (1 - x) + 'px)'; }
function face(t, mood) {
  const blink = (t % 2.6) < .12; $('m-eyes').style.transform = 'scaleY(' + (blink ? .1 : 1) + ')';
  for (const m of ['Smile', 'Open', 'Worry']) $('m-mouth' + m).style.opacity = mood === m.toLowerCase() ? 1 : 0;
  $('m-sweat').style.opacity = 0;
}
const wave = (t) => -125 + Math.sin(t * 14) * 22;

window.frame = (t) => {
  // background
  $('rays').style.opacity = Math.max(1 - p(t, 2.2, 2.7), p(t, OUTRO, OUTRO + .5)) * .9 + .15;
  $('rays').style.transform = 'rotate(' + t * 12 + 'deg)';
  BB.forEach((b, i) => { const y = 2050 - ((b.ph + t * b.sp) % 2300);
    $('bb' + i).style.cssText = 'left:' + (b.x + Math.sin(t * 1.3 + b.sw) * 22) + 'px;top:' + y + 'px;width:' + b.r * 2 + 'px;height:' + b.r * 2 + 'px'; });
  // beat pulse on the camera
  const bp = ((t - 2) % BEAT) / BEAT, pulse = t > 2 && t < OUTRO ? Math.max(0, 1 - bp * 4) * .012 : 0;
  let shake = 0; for (const e of [2.0, OUTRO + .2]) { const k = t - e; if (k >= 0 && k < .3) shake = (1 - k / .3) * 18; }
  $('cam').style.transform = 'translate(' + Math.sin(t * 90) * shake + 'px,' + Math.cos(t * 70) * shake + 'px) scale(' + (1 + pulse) + ')';
  $('flash').style.opacity = [2.0, OUTRO + .2].reduce((m, e) => { const k = t - e; return k >= 0 && k < .3 ? Math.max(m, (1 - k / .3) * .6) : m; }, 0);

  // intro
  $('intro').style.opacity = 1 - p(t, 2.2, 2.5);
  pop($('aMark'), t, .1, .6, ' rotate(' + (1 - out3(p(t, .1, .7))) * -40 + 'deg)'); slide($('aName'), t, .5); pop($('aPill'), t, .9, .5);
  const mid = t >= 2.5 && t < OUTRO;
  $('top').style.opacity = p(t, 2.2, 2.6); $('foot').style.opacity = p(t, 2.2, 2.6) * (1 - p(t, OUTRO - .2, OUTRO + .1));

  // post cards
  const k = Math.floor((t - T0) / STEP);
  for (let i = 0; i < LABELS.length; i++) {
    const el = $('card' + i), a = T0 + i * STEP, img = el.firstChild;
    if (t < a - .15 || t > a + STEP + .4 || t > OUTRO + .3) { el.style.opacity = 0; continue; }
    const dir = i % 2 ? -1 : 1, x = out3(p(t, a - .15, a + .3));
    const leave = p(t, a + STEP - .15, a + STEP + .25);
    const sc = (.92 + .08 * back(x)) * (1 - .12 * leave);
    el.style.opacity = Math.min(clamp(x * 3), 1 - leave);
    el.style.zIndex = i;
    el.style.transform = 'translateX(' + dir * 1100 * (1 - x) + 'px) rotate(' + dir * 7 * (1 - x) + 'deg) scale(' + sc + ') translateY(' + (-40 * leave) + 'px)';
    img.style.transform = 'scale(' + (1 + .07 * p(t, a, a + STEP + .3)) + ')';
  }
  // label + progress
  const showMid = mid ? 1 : 0;
  $('label').style.opacity = showMid; $('count').style.opacity = showMid; $('cta').style.opacity = p(t, 2.5, 2.9) * (1 - p(t, OUTRO - .2, OUTRO + .1));
  $('cta').style.transform = 'scale(' + (1 + pulse * 3) + ')'; $('cta').style.transformOrigin = '0 50%'; $('bar').style.opacity = showMid;
  if (mid) {
    const a = T0 + k * STEP, x = p(t, a, a + .35);
    $('labelTxt').textContent = LABELS[k];
    $('labelTxt').style.transform = 'translateY(' + 40 * (1 - out3(x)) + 'px)'; $('labelTxt').style.opacity = out3(x);
    $('labelBar').style.width = (out3(p(t, a + .1, a + .5)) * Math.min(520, LABELS[k].length * 34)) + 'px';
    $('count').textContent = String(k + 1).padStart(2, '0') + '/' + LABELS.length;
    for (let i = 0; i < LABELS.length; i++) $('seg' + i).className = i <= k ? 'on' : '';
  }

  // outro
  $('outro').style.opacity = p(t, OUTRO, OUTRO + .2);
  slide($('o1'), t, OUTRO + .1); [0, 1, 2].forEach((i) => pop($('cb' + i), t, OUTRO + .8 + i * .3, .4)); slide($('o3'), t, OUTRO + 1.8, 0, 30);

  // mascot: falls in, rides in the corner dancing to the beat, then waves at the end
  let mx = 540, mby = 1560, ms = 1.2, rot = 0, armR = 0, armL = 0, mood = 'smile', op = 1;
  if (t < 2.4) { const kk = p(t, 1.5, 2.0); mby = -100 + in2(kk) * 1660; op = t >= 1.5 ? 1 : 0; armR = -150; armL = 150; mood = 'open';
    if (t > 2.0) { armR = wave(t); } }
  else if (t < OUTRO) {
    const m = out3(p(t, 2.4, 2.9)); mx = 540 + (880 - 540) * m; mby = 1560 + (1772 - 1560) * m; ms = 1.2 + (.86 - 1.2) * m;
    const hop = Math.sin((((t - 2) % BEAT) / BEAT) * Math.PI); mby -= hop * 26; rot = Math.sin(t * Math.PI * 2) * 6;
    armR = -60 - hop * 70; armL = 60 + hop * 70; mood = hop > .5 ? 'open' : 'smile';
  } else { const m = back(p(t, OUTRO, OUTRO + .4)); mx = 540; mby = 1150; ms = 1.05 * m; armR = wave(t); mood = Math.floor(t * 8) % 2 ? 'open' : 'smile'; }
  $('mw').style.opacity = op;
  $('mw').style.transform = 'translate(' + (mx - 150) + 'px,' + (mby - 420) + 'px) rotate(' + rot + 'deg) scale(' + ms + ')';
  $('m-armR').style.transform = 'rotate(' + armR + 'deg)'; $('m-armL').style.transform = 'rotate(' + armL + 'deg)';
  $('m-drum').style.transform = 'rotate(' + t * 500 + 'deg)'; $('m-body').style.transform = '';
  face(t, mood);
  // speech bubble from the corner mascot
  const sayAt = null;
  const sy = $('say'); sy.style.opacity = 0;
  if (sayAt) { sy.textContent = sayAt[2]; const x = p(t, sayAt[0], sayAt[0] + .3); sy.style.opacity = clamp(x * 4) * (1 - p(t, sayAt[1] - .15, sayAt[1]));
    sy.style.left = (740 - sy.offsetWidth) + 'px'; sy.style.top = (1480 - sy.offsetHeight / 2) + 'px'; sy.style.transformOrigin = '100% 50%'; sy.style.transform = 'scale(' + back(x) + ')'; }

  // confetti
  CP.forEach((ps, c) => ps.forEach((q, i) => { const el = $('cf' + c + '_' + i), d = t - CONF[c];
    if (d < 0 || d > 2.2) { el.style.opacity = 0; return; }
    el.style.opacity = 1 - p(d, 1.6, 2.2);
    el.style.transform = 'translate(' + (540 + Math.cos(q.a) * q.v * d * .9) + 'px,' + (900 + Math.sin(q.a) * q.v * d + 1400 * d * d) + 'px) rotate(' + q.rot * d * 3 + 'deg) scaleX(' + Math.cos(d * 12 * q.w) + ')'; }));
};
frame(0);
</script></body></html>`;

const f = join(DIR, "_showcase.html");
writeFileSync(f, html);
const frames = join(DIR, "_frames");
rmSync(frames, { recursive: true, force: true }); mkdirSync(frames, { recursive: true });
mkdirSync(join(DIR, "out"), { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto("file://" + f, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(() => Promise.all([...document.images].map((i) => i.decode())));
const times = preview ? [1.3, 2.2, 3.2, 3.5, 7.2, 9.0, 14.0, 21.0, 25.6, 27.0, 28.9] : Array.from({ length: DUR * FPS }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.frame(t), t);
  await page.screenshot({ path: join(frames, String(i).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
  if (i % 150 === 0) console.log("frame", i, "/", times.length);
}
await browser.close();
if (preview) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", join(frames, "*.jpg"), "-vf", "scale=270:480,tile=6x2", "-frames:v", "1", join(DIR, "out", "showcase-preview.png")]);
} else {
  const silent = join(DIR, "_showcase-silent.mp4"), wav = join(DIR, "_showcase.wav");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(frames, "%04d.jpg"), "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "medium", silent]);
  execFileSync("python3", [join(DIR, "audio.py"), wav, "showcase"]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", silent, "-i", wav, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k", "-shortest", "-movflags", "+faststart", join(DIR, "out", "dhobi-express-showcase.mp4")]);
}
console.log("done");
