// Character reel with music + sound effects → out/dhobi-bhai-reel.mp4
//   node reel.mjs            full render (frames → mp4, then audio.py adds sound)
//   node reel.mjs --preview  a strip of key frames → out/reel-preview.png
import { chromium } from "/opt/node22/lib/node_modules/playwright/index.mjs";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { BASE_CSS, C, CONTACT, DIR, FOOTER, I_MAIL, I_PHONE, I_WEB, LOGO, LOGO_MARK } from "./shared.mjs";
import { ART } from "./art.mjs";
import { MASCOT } from "./mascot.mjs";

const W = 1080, H = 1920, FPS = 30, DUR = 25;

const RIDE = `<svg viewBox="0 0 420 300" width="100%" height="100%" overflow="visible">
  <rect x="6" y="120" width="96" height="86" rx="12" fill="${C.yellow}" stroke="#e7a20d" stroke-width="5"/>
  <rect x="34" y="148" width="40" height="28" rx="5" fill="#fff"/>
  <path d="M60 206h60" stroke="${C.navy}" stroke-width="10"/>
  <path d="M96 250h200q24 0 34-30l-28-128h34" fill="none" stroke="${C.blue}" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M92 214h170l-18 44H80Z" fill="${C.blue}"/>
  <rect x="320" y="84" width="54" height="16" rx="8" fill="${C.navy}"/>
  <circle cx="356" cy="140" r="12" fill="${C.yellow}"/>
  <g class="wheel"><circle cx="100" cy="256" r="42" fill="${C.navy}"/><circle cx="100" cy="256" r="16" fill="#c9d6e3"/><path d="M100 220v72M64 256h72" stroke="#2c4a73" stroke-width="5"/></g>
  <g class="wheel"><circle cx="320" cy="256" r="42" fill="${C.navy}"/><circle cx="320" cy="256" r="16" fill="#c9d6e3"/><path d="M320 220v72M284 256h72" stroke="#2c4a73" stroke-width="5"/></g>
</svg>`;

const BOX = `<svg viewBox="0 0 300 300" width="100%" height="100%"><path d="M150 30l120 50v130l-120 50-120-50V80Z" fill="${C.blue}"/>
<path d="M150 130l120-50v130l-120 50Z" fill="${C.dark}"/><path d="M30 80l120 50 120-50-120-50Z" fill="${C.blue5}"/>
<path d="M90 55l120 50v40l-26 10v-40L64 66Z" fill="${C.yellow}"/></svg>`;

const prices = [["Shirt / Kameez", "Wash & Iron", "Rs. 80"], ["Koi bhi kapra", "Sirf Press", "Rs. 45"], ["Suit (2-piece)", "Dry Clean", "Rs. 650"], ["Razai", "Wash & Dry", "Rs. 700"]];

const CSS = `${BASE_CSS}
.stage{width:${W}px;height:${H}px}
#cam{position:absolute;inset:0}
.abs{position:absolute;left:0;right:0}
.scene{position:absolute;inset:0;opacity:0}
.c{text-align:center}
.big{font-weight:900;line-height:1;letter-spacing:-2px;text-shadow:0 8px 0 rgba(8,50,100,.35),0 20px 50px rgba(0,30,70,.35)}
.kick{font-weight:600;font-size:44px;letter-spacing:14px;padding-left:14px}
.pill{display:inline-block;background:${C.yellow};color:${C.navy};font-weight:900;font-style:italic;border-radius:18px;
  padding:10px 38px 6px;box-shadow:0 10px 26px rgba(0,30,70,.35);white-space:nowrap}
.navyPill{background:${C.navy};color:${C.yellow};font-style:normal}
.topLogo{position:absolute;top:80px;left:0;right:0}
.footer{bottom:64px;font-size:27px}
#rays{position:absolute;left:50%;top:50%;width:3000px;height:3000px;margin:-1500px 0 0 -1500px;border-radius:50%;
  background:repeating-conic-gradient(rgba(255,255,255,.13) 0 9deg, rgba(255,255,255,0) 9deg 18deg);
  -webkit-mask:radial-gradient(circle, #000 0, #000 18%, transparent 55%);mask:radial-gradient(circle, #000 0, #000 18%, transparent 55%)}
.rise{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.45);
  background:radial-gradient(circle at 32% 30%,rgba(255,255,255,.65) 0 12%,rgba(255,255,255,.08) 30%,rgba(255,255,255,.03) 70%)}
.mw{position:absolute;left:0;top:0;width:300px;height:420px;transform-origin:150px 420px}
#ride{position:absolute;left:0;top:0;width:520px;height:670px;transform-origin:260px 670px}
#ride .rider{position:absolute;left:98px;top:236px;width:240px;height:336px}
#ride .scoot{position:absolute;left:0;top:300px;width:520px;height:372px}
.wheel{transform-box:fill-box;transform-origin:center}
#say{position:absolute;background:#fff;color:${C.navy};font-weight:800;font-size:46px;padding:22px 38px;border-radius:40px;
  box-shadow:0 16px 40px rgba(0,30,70,.35);white-space:nowrap;transform-origin:50% 100%}
#say:after{content:"";position:absolute;left:50%;bottom:-26px;margin-left:-20px;border:20px solid transparent;border-top:28px solid #fff;border-bottom:0}
.price{position:absolute;left:90px;right:90px;height:150px;background:#fff;border-radius:32px;color:${C.navy};display:flex;align-items:center;
  justify-content:space-between;padding:0 44px;box-shadow:0 24px 50px rgba(0,30,70,.35)}
.price .l{font-weight:700;font-size:40px;line-height:1.15}.price .l small{display:block;font-weight:500;font-size:26px;color:#41546d}
.price .r{background:${C.navy};color:${C.yellow};font-weight:900;font-size:50px;border-radius:20px;padding:8px 26px}
.stepTag{display:inline-flex;align-items:center;gap:22px}
.stepTag .n{width:110px;height:110px;border-radius:50%;background:${C.yellow};color:${C.navy};font-weight:900;font-size:64px;display:flex;align-items:center;justify-content:center;
  box-shadow:0 10px 26px rgba(0,30,70,.35);text-shadow:none;letter-spacing:0}
.plate{position:absolute;border-radius:50%;background:radial-gradient(circle at 40% 35%,#fff 0 55%,${C.pale} 100%);
  box-shadow:0 30px 60px rgba(0,30,70,.4),0 0 0 18px rgba(255,255,255,.15);display:flex;align-items:center;justify-content:center}
.conf{position:absolute;left:0;top:0;width:22px;height:12px;border-radius:3px}
.speed{position:absolute;height:10px;border-radius:5px;background:rgba(255,255,255,.7)}
.contactBig{display:flex;flex-direction:column;gap:24px;align-items:center}
.contactBig div{background:rgba(8,40,80,.5);border:2px solid rgba(255,255,255,.25);border-radius:999px;padding:18px 44px;font-weight:700;font-size:44px;display:flex;gap:20px;align-items:center}
.contactBig b{color:${C.yellow}}
.contactBig svg{width:48px;height:48px;color:${C.yellow}}
#flash{position:absolute;inset:0;background:#fff;opacity:0;pointer-events:none}
`;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}</style></head><body>
<div class="stage">
  <div id="rays"></div>
  <div id="bubbles"></div>
  <div id="cam">

  <!-- A: intro -->
  <div class="scene" id="sA">
    <div class="abs c" style="top:250px"><div id="aMark" style="display:inline-block">${LOGO_MARK(230)}</div></div>
    <div class="abs c big" id="aName" style="top:520px;font-size:124px">Dhobi <span style="color:${C.yellow}">Express</span></div>
    <div class="abs c kick" id="aTag" style="top:670px;font-size:34px">LAUNDRY · PICKUP · DELIVERY</div>
  </div>

  <!-- B: hook -->
  <div class="scene" id="sB">
    <div class="abs c big" id="b1" style="top:330px;font-size:132px">Pani ka<br>masla? 💧</div>
    <div class="abs c big" id="b2" style="top:330px;font-size:150px">Time<br>nahi? ⏰</div>
    <div class="abs c" id="b3" style="top:360px"><div class="big" style="font-size:96px">Fikar not!</div>
      <span class="pill" style="font-size:78px;margin-top:26px;transform:rotate(-4deg)">Kapray hum<br>dhoyenge!</span></div>
  </div>

  <!-- C: steps -->
  <div class="scene" id="sC">
    ${[["1", "PICKUP", "Ghar se, free!"], ["2", "WASH", "Har order alag"], ["3", "PRESS", "Kadak steam press"], ["4", "DELIVERY", "24–48 ghante mein"]].map(([n, t, d], i) => `
    <div class="abs c" id="c${i}" style="top:300px">
      <div class="stepTag big" style="font-size:${t.length > 6 ? 118 : 140}px"><span class="n">${n}</span>${t}</div>
      <div style="margin-top:22px"><span class="pill" style="font-size:52px">${d}</span></div>
    </div>`).join("")}
    <div id="iron" style="position:absolute;left:560px;top:900px;width:440px;height:440px">${ART.iron}</div>
    <div id="box" style="position:absolute;left:560px;top:960px;width:400px;height:400px">${BOX}</div>
  </div>

  <!-- D: rates -->
  <div class="scene" id="sD">
    <div class="abs c kick" style="top:300px">MARKET SE KAM</div>
    <div class="abs c big" style="top:360px;font-size:170px">RATES</div>
    ${prices.map(([a, b, r], i) => `<div class="price" id="pr${i}" style="top:${590 + i * 172}px"><div class="l">${a}<small>${b}</small></div><div class="r">${r}</div></div>`).join("")}
  </div>

  <!-- E: free -->
  <div class="scene" id="sE">
    <div class="abs c kick" style="top:330px">HAR ITWAR</div>
    <div class="abs c big" id="eFree" style="top:390px;font-size:260px;color:${C.yellow}">FREE</div>
    <div class="abs c" id="ePill" style="top:690px"><span class="pill navyPill" style="font-size:62px;transform:rotate(-4deg)">Pickup & Delivery</span></div>
    <div class="abs c" id="eLine" style="top:1530px;font-weight:700;font-size:42px">Rs. 2,000+ ke order par <span style="color:${C.yellow}">har din free!</span></div>
  </div>

  <!-- F: offer -->
  <div class="scene" id="sF">
    <div class="abs c kick" style="top:300px">PEHLA ORDER</div>
    <div class="abs c big" id="fOff" style="top:360px;font-size:210px">10% OFF</div>
    <div class="plate" id="fPlate" style="left:310px;top:640px;width:460px;height:460px"><div style="width:360px;height:360px">${ART.coupon}</div></div>
    <div class="abs c" id="fCode" style="top:1160px"><span style="font-weight:600;font-size:40px">Code lagayein</span><br><span class="pill" style="font-size:84px;margin-top:10px">WELCOME10</span></div>
  </div>

  <!-- G: outro -->
  <div class="scene" id="sG">
    <div class="abs c big" id="g1" style="top:290px;font-size:120px">Abhi order<br>karein!</div>
    <div class="abs contactBig" id="g2" style="top:1180px">
      <div id="cb0">${I_WEB} <b>${CONTACT.web}</b></div>
      <div id="cb1">${I_MAIL} ${CONTACT.email}</div>
      <div id="cb2">${I_PHONE} <b>${CONTACT.phone}</b></div>
    </div>
    <div class="abs c kick" id="g3" style="top:1640px;font-size:30px">MON–SUN · 10AM–7PM</div>
  </div>

  <div id="speed"></div>
  <div class="mw" id="mw">${MASCOT("m")}</div>
  <div id="ride"><div class="rider">${MASCOT("r")}</div><div class="scoot">${RIDE}</div></div>
  <div id="say"></div>
  <div id="confetti"></div>
  <div class="topLogo" id="top">${LOGO(1.2)}</div>
  <div id="foot">${FOOTER()}</div>
  </div>
  <div id="flash"></div>
</div>
<script>
const $ = (id) => document.getElementById(id);
const clamp = (x) => Math.max(0, Math.min(1, x));
const p = (t, a, b) => clamp((t - a) / (b - a));
const out3 = (x) => 1 - Math.pow(1 - x, 3);
const in2 = (x) => x * x;
const back = (x) => { const c = 2.2; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
const elastic = (x) => x === 0 || x === 1 ? x : Math.pow(2, -10 * x) * Math.sin((x * 10 - .75) * (2 * Math.PI) / 3) + 1;
const BEAT = 0.5;
let seed = 11; const rnd = () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

const S = { sA: [0, 3.5], sB: [3.5, 7.5], sC: [7.5, 12], sD: [12, 15.5], sE: [15.5, 18.5], sF: [18.5, 21.5], sG: [21.5, 25.6] };
const SHAKE = [2.0, 5.5, 9.9, 11.1, 12.4, 12.9, 13.4, 13.9, 15.75, 18.75];
const FLASH = [2.0, 5.5, 15.75, 18.75];
const CONF = [5.5, 18.75, 22.0];

// rising bubbles
const BB = Array.from({ length: 30 }, () => ({ x: rnd() * 1080, r: 12 + rnd() * 52, sp: 80 + rnd() * 160, ph: rnd() * 2400, sw: rnd() * 6 }));
$('bubbles').innerHTML = BB.map((b, i) => '<div class="rise" id="bb' + i + '"></div>').join('');
// confetti particles per burst
const COLS = ['${C.yellow}', '#fff', '#ff6b8a', '#5fd38a', '${C.light}', '${C.navy}'];
const CP = CONF.map(() => Array.from({ length: 70 }, () => ({ a: -Math.PI / 2 + (rnd() - .5) * 2.4, v: 900 + rnd() * 1300, rot: rnd() * 720 - 360, c: COLS[Math.floor(rnd() * COLS.length)], w: .6 + rnd() * .9 })));
$('confetti').innerHTML = CP.map((ps, k) => ps.map((q, i) => '<div class="conf" id="cf' + k + '_' + i + '" style="background:' + q.c + '"></div>').join('')).join('');
$('speed').innerHTML = Array.from({ length: 6 }, (_, i) => '<div class="speed" id="sp' + i + '"></div>').join('');

function sceneOp(t, [a, b]) { return Math.min(p(t, a, a + .25), 1 - p(t, b - .2, b)); }
function pop(el, t, a, d = .45, extra = '') { const x = p(t, a, a + d); el.style.opacity = clamp(x * 4); el.style.transform = 'scale(' + back(x) + ')' + extra; }
function slam(el, t, a, d = .3) { const x = p(t, a, a + d); el.style.opacity = clamp(x * 3); el.style.transform = 'scale(' + (1 + 1.2 * (1 - out3(x))) + ')'; }
function slide(el, t, a, dx = 0, dy = 80, d = .45) { const x = out3(p(t, a, a + d)); el.style.opacity = x; el.style.transform = 'translate(' + dx * (1 - x) + 'px,' + dy * (1 - x) + 'px)'; }
function show(el, t, a, b) { el.style.opacity = (t >= a && t < b) ? 1 : 0; }

// mascot pose helpers
function face(pre, t, mood, look = [0, 0]) {
  const blink = (t % 2.6) < .12 || (t % 3.7) < .1;
  $(pre + '-eyes').style.transform = 'scaleY(' + (blink ? .1 : 1) + ')';
  $(pre + '-pupils').style.transform = 'translate(' + look[0] + 'px,' + look[1] + 'px)';
  $(pre + '-mouthSmile').style.opacity = mood === 'smile' ? 1 : 0;
  $(pre + '-mouthOpen').style.opacity = mood === 'open' ? 1 : 0;
  $(pre + '-mouthWorry').style.opacity = mood === 'worry' ? 1 : 0;
  $(pre + '-sweat').style.opacity = mood === 'worry' ? 1 : 0;
  $(pre + '-sweat').style.transform = 'translateY(' + ((t * 40) % 20) + 'px)';
}
function pose(pre, { sq = 0, armR = 0, armL = 0, drum = 0 }) {
  $(pre + '-body').style.transform = 'scale(' + (1 + sq * .6) + ',' + (1 - sq) + ')';
  $(pre + '-armR').style.transform = 'rotate(' + armR + 'deg)';
  $(pre + '-armL').style.transform = 'rotate(' + armL + 'deg)';
  $(pre + '-drum').style.transform = 'rotate(' + drum + 'deg)';
}
const talk = (t) => (Math.floor(t * 8) % 2 ? 'open' : 'smile');
const wave = (t) => -125 + Math.sin(t * 14) * 22;
const hop = (t, a) => { const x = ((t - a) % BEAT) / BEAT; return -Math.sin(x * Math.PI) * 60; };

function placeM(x, by, s, r = 0, op = 1) { const m = $('mw'); m.style.opacity = op; m.style.transform = 'translate(' + (x - 150) + 'px,' + (by - 420) + 'px) rotate(' + r + 'deg) scale(' + s + ')'; }
function placeRide(x, by, s, op = 1) { const m = $('ride'); m.style.opacity = op; m.style.transform = 'translate(' + (x - 260) + 'px,' + (by - 670) + 'px) scale(' + s + ')'; }
function say(t, a, b, text, x, y) {
  const el = $('say'); if (t < a || t >= b) return false;
  el.textContent = text; const k = p(t, a, a + .3);
  el.style.opacity = clamp(k * 4) * (1 - p(t, b - .15, b));
  el.style.left = (x - el.offsetWidth / 2) + 'px'; el.style.top = (y - el.offsetHeight) + 'px';
  el.style.transform = 'scale(' + back(k) + ')'; return true;
}

function mascot(t) {
  let x = 540, by = 1640, s = 1.4, r = 0, op = 1, sq = 0, armR = 0, armL = 0, drumSp = 1, mood = 'smile', look = [0, 0];
  if (t < 2) { // falls in
    const k = p(t, 1.5, 2.0); by = -100 + in2(k) * 1740; op = t >= 1.5 ? 1 : 0; armR = -150; armL = 150; mood = 'open'; look = [0, -6];
  } else if (t < 3.5) {
    const k = p(t, 2.0, 2.45); sq = (1 - k) * Math.sin(k * Math.PI * 3) * .22 + (k < .15 ? .2 : 0);
    armR = wave(t); mood = talk(t);
  } else if (t < 7.5) {
    if (t < 5.5) { mood = 'worry'; look = [Math.sin(t * 3) * 6, -6]; armL = 20 + Math.sin(t * 6) * 10; armR = -20 - Math.sin(t * 6) * 10; drumSp = .3; r = Math.sin(t * 4) * 2; }
    else { const k = p(t, 5.5, 6.1); by = 1640 - Math.sin(k * Math.PI) * 260; r = k < 1 ? k * 360 : 0;
      armR = -150; armL = 150; mood = 'open'; drumSp = 6; if (t > 6.1) { by = 1640 + hop(t, 6.1) * .6; armR = wave(t); armL = 120; } }
    if (t < 3.8) { s = 1.4 * back(p(t, 3.5, 3.8)); }
  } else if (t < 12) {
    if (t < 8.6) op = 0; // riding scooter instead
    else if (t < 9.7) { s = 1.5 * back(p(t, 8.6, 8.9)); by = 1600; drumSp = 14; r = Math.sin(t * 50) * 3; mood = 'open'; armR = -150; armL = 150; sq = Math.abs(Math.sin(t * 25)) * .05; }
    else { x = 290; by = 1600; s = 1.05 * (t < 10 ? back(p(t, 9.7, 10)) : 1); armR = t > 11.1 ? wave(t) : -95; mood = t > 11.1 ? talk(t) : 'smile'; look = [8, 4]; }
  } else if (t < 15.5) {
    x = 540; by = 1760; s = .82 * back(p(t, 12, 12.3)); armR = -100; mood = 'smile'; look = [0, -8];
    if (t > 14.2) { armR = wave(t); mood = talk(t); }
  } else if (t < 18.5) { op = 0; }
  else if (t < 21.5) {
    x = 540; by = 1745 + hop(t, 18.5); s = .95 * back(p(t, 18.5, 18.8)); armR = -150; armL = 150; mood = 'open'; drumSp = 4;
  } else {
    x = 540; by = 1150; s = 1.05 * back(p(t, 21.5, 21.85)); armR = wave(t); mood = t < 23 ? talk(t) : 'smile'; look = [0, 4];
  }
  placeM(x, by, s, r, op);
  pose('m', { sq, armR, armL, drum: t * 360 * drumSp }); face('m', t, mood, look);
}

function rider(t) {
  let op = 0, x = 0, by = 1500, s = 1;
  if (t >= 7.5 && t < 8.6) { op = 1; x = -300 + out3(p(t, 7.5, 8.0)) * 840 + in2(p(t, 8.1, 8.6)) * 900; by = 1560; s = 1.05; }
  if (t >= 16.1 && t < 18.5) { op = 1; x = -300 + out3(p(t, 16.1, 16.8)) * 840 + in2(p(t, 17.6, 18.4)) * 1000; by = 1450; s = 1; }
  placeRide(x, by + Math.sin(t * 30) * 4, s, op);
  pose('r', { armR: -40 + Math.sin(t * 12) * 6, armL: 30, drum: t * 600 });
  face('r', t, 'open', [8, 0]);
  document.querySelectorAll('#ride .wheel').forEach((w) => (w.style.transform = 'rotate(' + t * 900 + 'deg)'));
  for (let i = 0; i < 6; i++) { const el = $('sp' + i); el.style.opacity = op * .8;
    const len = 120 + (i * 53) % 140; el.style.width = len + 'px';
    el.style.left = (x - 330 - len - ((t * 1400 + i * 97) % 260)) + 'px'; el.style.top = (by - 300 + i * 34) + 'px'; }
}

window.frame = (t) => {
  // camera shake + flash
  let sx = 0, sy = 0; for (const e of SHAKE) { const k = t - e; if (k >= 0 && k < .3) { const a = (1 - k / .3) * 22; sx += Math.sin(k * 90) * a; sy += Math.cos(k * 75) * a; } }
  const punch = SHAKE.reduce((m, e) => { const k = t - e; return k >= 0 && k < .25 ? Math.max(m, (1 - k / .25) * .04) : m; }, 0);
  $('cam').style.transform = 'translate(' + sx + 'px,' + sy + 'px) scale(' + (1 + punch) + ')';
  $('flash').style.opacity = FLASH.reduce((m, e) => { const k = t - e; return k >= 0 && k < .3 ? Math.max(m, (1 - k / .3) * .7) : m; }, 0);
  // rays: strong on intro / free / offer
  const rayOp = Math.max(1 - p(t, 3.2, 3.6), Math.min(p(t, 15.5, 15.8), 1 - p(t, 21.3, 21.6)), p(t, 21.5, 22));
  $('rays').style.opacity = rayOp; $('rays').style.transform = 'rotate(' + t * 12 + 'deg)';
  BB.forEach((b, i) => { const el = $('bb' + i); const y = 2050 - ((b.ph + t * b.sp * (t > 5.5 && t < 7.5 ? 2.5 : 1)) % 2300);
    el.style.cssText = 'left:' + (b.x + Math.sin(t * 1.3 + b.sw) * 22) + 'px;top:' + y + 'px;width:' + b.r * 2 + 'px;height:' + b.r * 2 + 'px'; });
  for (const k in S) $(k).style.opacity = sceneOp(t, S[k]);
  const tl = p(t, 3.3, 3.7); $('top').style.opacity = tl; $('top').style.transform = 'translateY(' + -60 * (1 - tl) + 'px)';
  $('foot').style.opacity = p(t, 3.3, 3.7) * (1 - p(t, 21.3, 21.6));

  // A
  pop($('aMark'), t, .15, .6, ' rotate(' + (1 - out3(p(t, .15, .8))) * -40 + 'deg)'); slide($('aName'), t, .6, 0, 60); slide($('aTag'), t, 1.0, 0, 40);
  // B
  show($('b1'), t, 3.5, 4.5); slam($('b1'), t, 3.5); if (t >= 4.5) $('b1').style.opacity = 0;
  slam($('b2'), t, 4.5); if (t < 4.5 || t >= 5.5) $('b2').style.opacity = 0;
  pop($('b3'), t, 5.5, .5); if (t < 5.5) $('b3').style.opacity = 0;
  // C
  [7.5, 8.6, 9.7, 10.8].forEach((a, i) => { const el = $('c' + i); if (t >= a && t < a + 1.1 + (i === 3 ? 1 : 0)) { slam(el, t, a, .25); } else el.style.opacity = 0; });
  { const k = p(t, 9.75, 9.9); const ir = $('iron'); ir.style.opacity = t >= 9.7 && t < 10.8 ? 1 : 0;
    ir.style.transform = 'translateY(' + (-700 * (1 - in2(k))) + 'px) rotate(' + (t > 9.9 ? Math.sin((t - 9.9) * 30) * 4 * (1 - p(t, 9.9, 10.3)) : -10) + 'deg)'; }
  { const k = p(t, 10.85, 11.1); const bx = $('box'); bx.style.opacity = t >= 10.8 ? 1 : 0;
    const sq = t > 11.1 ? Math.sin(p(t, 11.1, 11.4) * Math.PI) * .15 : 0;
    bx.style.transform = 'translateY(' + (-800 * (1 - in2(k))) + 'px) scale(' + (1 + sq) + ',' + (1 - sq) + ')'; }
  // D
  [12.4, 12.9, 13.4, 13.9].forEach((a, i) => slam($('pr' + i), t, a, .28));
  // E
  slam($('eFree'), t, 15.75, .3); pop($('ePill'), t, 16.0, .45, ' rotate(-2deg)'); slide($('eLine'), t, 16.6, 0, 40);
  // F
  slam($('fOff'), t, 18.75, .3); pop($('fPlate'), t, 18.9, .5, ' rotate(' + Math.sin(t * 5) * 8 + 'deg)'); pop($('fCode'), t, 19.5, .45);
  // G
  slide($('g1'), t, 21.6, 0, 60); [0, 1, 2].forEach((i) => pop($('cb' + i), t, 22.2 + i * .3, .4)); slide($('g3'), t, 23.2, 0, 30);
  if (t > 23.5) $('cb2').style.transform = 'scale(' + (1 + Math.max(0, Math.sin((t - 23.5) * 6)) * .05) + ')';

  // confetti
  CP.forEach((ps, k) => ps.forEach((q, i) => { const el = $('cf' + k + '_' + i); const d = t - CONF[k];
    if (d < 0 || d > 2.2) { el.style.opacity = 0; return; }
    const x = 540 + Math.cos(q.a) * q.v * d * .9, y = 1000 + Math.sin(q.a) * q.v * d + 1400 * d * d;
    el.style.opacity = 1 - p(d, 1.6, 2.2);
    el.style.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + q.rot * d * 3 + 'deg) scaleX(' + Math.cos(d * 12 * q.w) + ')'; }));

  mascot(t); rider(t);
  $('say').style.opacity = 0;
  say(t, 2.2, 3.4, 'Assalam o Alaikum, Karachi! 👋', 540, 1000) ||
  say(t, 9.75, 10.8, 'Kadak press! 🔥', 290, 1130) ||
  say(t, 11.2, 12, 'Aapke ghar tak! 🏠', 340, 1130) ||
  say(t, 14.2, 15.4, 'Itne kam rates! 😍', 540, 1405) ||
  say(t, 23, 25.5, 'Main aa raha hoon! 🛵', 540, 690);
};
frame(0);
</script></body></html>`;

const f = join(DIR, "_reel.html");
writeFileSync(f, html);
const preview = process.argv.includes("--preview");
const frames = join(DIR, "_frames");
rmSync(frames, { recursive: true, force: true }); mkdirSync(frames, { recursive: true });
mkdirSync(join(DIR, "out"), { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: W, height: H } });
await page.goto("file://" + f, { waitUntil: "load" });
await page.evaluate(() => document.fonts.ready);
const times = preview ? [1.8, 2.8, 4.0, 5.9, 7.9, 9.0, 10.1, 11.5, 14.5, 17.0, 19.2, 24.0]
  : Array.from({ length: DUR * FPS }, (_, i) => i / FPS);
for (const [i, t] of times.entries()) {
  await page.evaluate((t) => window.frame(t), t);
  await page.screenshot({ path: join(frames, String(i).padStart(4, "0") + ".jpg"), type: "jpeg", quality: 92 });
  if (i % 150 === 0) console.log("frame", i, "/", times.length);
}
await browser.close();

if (preview) {
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-pattern_type", "glob", "-i", join(frames, "*.jpg"), "-vf", "scale=270:480,tile=6x2", "-frames:v", "1", join(DIR, "out", "reel-preview.png")]);
} else {
  const silent = join(DIR, "_reel-silent.mp4"), wav = join(DIR, "_reel.wav");
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-framerate", String(FPS), "-i", join(frames, "%04d.jpg"),
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "medium", silent]);
  execFileSync("python3", [join(DIR, "audio.py"), wav]);
  execFileSync("ffmpeg", ["-loglevel", "error", "-y", "-i", silent, "-i", wav, "-c:v", "copy", "-c:a", "aac", "-b:a", "192k",
    "-shortest", "-movflags", "+faststart", join(DIR, "out", "dhobi-bhai-reel.mp4")]);
}
console.log("done");
