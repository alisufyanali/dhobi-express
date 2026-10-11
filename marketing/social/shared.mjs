import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

export const DIR = dirname(fileURLToPath(import.meta.url));

// ---- Edit these and re-run to update every post and the video ----
export const CONTACT = {
  web: "dhobiexpress.pk",
  email: "info@dhobiexpress.pk",
  phone: "0300-0000000",
};

export const C = {
  blue: "#1a8cea", blue5: "#3aa5f3", dark: "#1272c4", navy: "#10243f",
  light: "#d9edfd", pale: "#eef7fe", yellow: "#fbbf24", wa: "#25d366",
};

export const FONTS_CSS = readFileSync(join(DIR, "fonts.css"), "utf8");

export const LOGO_MARK = (size = 92) => `
<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
  <rect width="100" height="100" rx="26" fill="#fff"/>
  <rect x="28" y="19" width="46" height="62" rx="9" fill="none" stroke="${C.blue}" stroke-width="6.5"/>
  <circle cx="38" cy="31" r="3.8" fill="${C.blue}"/><circle cx="48" cy="31" r="3.8" fill="${C.blue}"/>
  <circle cx="51" cy="56" r="13" fill="none" stroke="${C.blue}" stroke-width="6.5"/>
  <path d="M10 46h11M6 56h15M10 66h11" stroke="${C.yellow}" stroke-width="5" stroke-linecap="round"/>
</svg>`;

export const LOGO = (scale = 1) => `
<div class="logo" style="transform:scale(${scale})">
  ${LOGO_MARK(88)}
  <div class="logo-txt">
    <div class="logo-name">Dhobi <span>Express</span></div>
    <div class="logo-tag">LAUNDRY · PICKUP · DELIVERY</div>
  </div>
</div>`;

export const I_WEB = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/></svg>`;
export const I_MAIL = `<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></svg>`;
export const I_PHONE = `<svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1.1c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.5.3.1.2.1.7-.1 1.3Z"/></svg>`;

export const FOOTER = () => `
<div class="footer">
  <span>${I_WEB}${CONTACT.web}</span><i></i>
  <span>${I_MAIL}${CONTACT.email}</span><i></i>
  <span>${I_PHONE}${CONTACT.phone}</span>
</div>`;

// Soft bubbles scattered at the edges, like the leaves peeking in the reference.
export const BUBBLES = (seed = 1, w = 1080, h = 1080) => {
  let s = seed * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  const spots = [[0, 0], [1, 0], [0, 1], [1, 1], [0, 0.5], [1, 0.5]];
  let out = "";
  for (const [ex, ey] of spots) {
    const n = 3 + Math.floor(rnd() * 3);
    for (let i = 0; i < n; i++) {
      const r = 14 + rnd() * 46;
      const x = ex * w + (ex ? -1 : 1) * rnd() * 150 - r;
      const y = ey * h + (ey === 1 ? -1 : ey === 0 ? 1 : rnd() - 0.5) * rnd() * 220 - r;
      out += `<div class="bub" style="left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px"></div>`;
    }
  }
  return out;
};

export const BASE_CSS = `
${FONTS_CSS}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Poppins,sans-serif;-webkit-font-smoothing:antialiased}
.stage{position:relative;overflow:hidden;color:#fff;
  background:
    radial-gradient(ellipse 70% 55% at 50% 58%, rgba(255,255,255,.22), transparent 70%),
    radial-gradient(circle at 15% 10%, rgba(255,255,255,.18), transparent 35%),
    linear-gradient(160deg, ${C.blue5} 0%, ${C.blue} 38%, ${C.dark} 72%, #0b4c8c 100%);}
.bub{position:absolute;border-radius:50%;border:2px solid rgba(255,255,255,.35);
  background:radial-gradient(circle at 32% 30%, rgba(255,255,255,.55) 0 12%, rgba(255,255,255,.08) 30%, rgba(255,255,255,.03) 70%);}
.logo{display:flex;align-items:center;gap:20px;justify-content:center;transform-origin:center}
.logo-name{font-weight:800;font-size:52px;line-height:1;letter-spacing:-.5px}
.logo-name span{color:${C.yellow}}
.logo-tag{font-weight:600;font-size:17px;letter-spacing:5px;opacity:.9;margin-top:8px}
.footer{position:absolute;left:50%;bottom:34px;transform:translateX(-50%);display:flex;align-items:center;gap:22px;
  white-space:nowrap;padding:16px 34px;border-radius:999px;background:rgba(8,40,80,.45);border:1.5px solid rgba(255,255,255,.22);
  font-weight:600;font-size:25px}
.footer span{display:flex;align-items:center;gap:11px}
.footer svg{color:${C.yellow};flex:none}
.footer i{width:7px;height:7px;border-radius:50%;background:rgba(255,255,255,.5)}
`;
