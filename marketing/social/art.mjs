import { C } from "./shared.mjs";

const svg = (body, vb = "0 0 400 400") => `<svg viewBox="${vb}" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const sparkle = (x, y, s = 1, c = C.yellow) =>
  `<path transform="translate(${x} ${y}) scale(${s})" d="M0-22C3-6 6-3 22 0 6 3 3 6 0 22-3 6-6 3-22 0-6-3-3-6 0-22Z" fill="${c}"/>`;
const hanger = (y = 70) =>
  `<path d="M200 ${y + 32}V${y + 14}c0-10 6-15 13-15s12 5 12 12" fill="none" stroke="#8aa0b8" stroke-width="7" stroke-linecap="round"/>
   <path d="M200 ${y + 32}L120 ${y + 62}h160Z" fill="none" stroke="#8aa0b8" stroke-width="7" stroke-linejoin="round"/>`;

export const ART = {
  shirt: svg(`
    ${hanger(40)}
    <path d="M128 110l46-18q26 26 52 0l46 18 52 54-36 34-18-14v152q-72 16-144 0V184l-18 14-36-34Z" fill="${C.blue}"/>
    <path d="M128 110l46-18 26 42-20 14Zm144 0-46-18-26 42 20 14Z" fill="#fff"/>
    <path d="M174 92l26 42 26-42" fill="none" stroke="${C.dark}" stroke-width="5"/>
    <rect x="196" y="134" width="8" height="200" fill="${C.dark}"/>
    ${[170, 210, 250, 290].map((y) => `<circle cx="200" cy="${y}" r="6" fill="#fff"/>`).join("")}
    <rect x="232" y="176" width="34" height="38" rx="4" fill="none" stroke="${C.dark}" stroke-width="5"/>
    ${sparkle(318, 92, 1.1)}${sparkle(84, 252, .8)}${sparkle(330, 300, .6, C.blue5)}`),

  suit: svg(`
    ${hanger(34)}
    <path d="M108 112l58-22 34 70 34-70 58 22 26 230H82Z" fill="${C.navy}"/>
    <path d="M166 90l34 70 34-70Z" fill="#fff"/>
    <path d="M191 108h18l-4 14 12 74-17 22-17-22 12-74Z" fill="${C.yellow}"/>
    <path d="M166 90l-12 24 22 18-18 22 42 96Zm68 0 12 24-22 18 18 22-42 96Z" fill="#1d3b63"/>
    <circle cx="200" cy="270" r="6" fill="${C.yellow}"/><circle cx="200" cy="300" r="6" fill="${C.yellow}"/>
    <rect x="112" y="226" width="44" height="8" rx="3" fill="#1d3b63"/><rect x="244" y="226" width="44" height="8" rx="3" fill="#1d3b63"/>
    <path d="M250 150h22l-4 14h-16Z" fill="#fff"/>
    ${sparkle(330, 96, 1.1)}${sparkle(70, 170, .7)}${sparkle(334, 320, .6, C.blue5)}`),

  iron: svg(`
    <path d="M110 120q-18-26 0-50m40 50q-18-26 0-50m40 50q-18-26 0-50" fill="none" stroke="${C.blue5}" stroke-width="9" stroke-linecap="round" opacity=".7"/>
    <path d="M150 200q8-62 70-62h52q20 0 14 22l-12 40" fill="none" stroke="${C.navy}" stroke-width="22" stroke-linecap="round"/>
    <path d="M70 300q6-104 120-104h112q36 0 26 60l-8 44Z" fill="${C.blue}"/>
    <path d="M70 300h258l-4 22H66Z" fill="#c9d6e3"/>
    <path d="M110 248q30-36 90-36" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity=".55"/>
    <circle cx="270" cy="248" r="16" fill="${C.yellow}"/>
    <path d="M90 352h230" stroke="${C.light}" stroke-width="10" stroke-linecap="round"/>
    ${sparkle(330, 120, 1)}${sparkle(60, 210, .7)}`),

  scooter: svg(`
    <path d="M20 200h70M36 236h60M20 272h50" stroke="${C.light}" stroke-width="10" stroke-linecap="round"/>
    <rect x="108" y="118" width="104" height="92" rx="12" fill="${C.yellow}"/>
    <path d="M108 150h104" stroke="#e7a20d" stroke-width="6"/>
    <rect x="140" y="160" width="40" height="30" rx="5" fill="#fff"/>
    <path d="M100 290q0-74 90-74h70l36-96h28" fill="none" stroke="${C.blue}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M100 290h176q30 0 44-40l-20-80" fill="none" stroke="${C.blue}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M118 238h120l-14 50H104Z" fill="${C.blue}"/>
    <rect x="300" y="110" width="40" height="14" rx="7" fill="${C.navy}"/>
    <circle cx="120" cy="300" r="40" fill="${C.navy}"/><circle cx="120" cy="300" r="16" fill="#c9d6e3"/>
    <circle cx="312" cy="300" r="40" fill="${C.navy}"/><circle cx="312" cy="300" r="16" fill="#c9d6e3"/>
    ${sparkle(350, 70, .9)}`),

  coupon: svg(`
    <g transform="rotate(-12 200 200)">
      <path d="M70 120h230l50 80-50 80H70q-20 0-20-20V140q0-20 20-20Z" fill="${C.yellow}"/>
      <circle cx="300" cy="200" r="14" fill="#fff"/>
      <path d="M110 140v120" stroke="#e7a20d" stroke-width="5" stroke-dasharray="12 10"/>
      <text x="200" y="222" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="70" fill="${C.navy}">10%</text>
      <text x="200" y="258" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="26" fill="${C.navy}" letter-spacing="6">OFF</text>
    </g>
    <path d="M300 200q40-10 70-60" fill="none" stroke="${C.blue}" stroke-width="6" stroke-linecap="round"/>
    ${sparkle(80, 80, 1, C.blue)}${sparkle(330, 330, .9)}${sparkle(60, 320, .6, C.blue5)}`),

  clock: svg(`
    <circle cx="200" cy="205" r="140" fill="${C.pale}" stroke="${C.blue}" stroke-width="18"/>
    ${Array.from({ length: 12 }, (_, i) => { const a = (i * Math.PI) / 6, r1 = i % 3 ? 112 : 102; return `<line x1="${200 + Math.sin(a) * r1}" y1="${205 - Math.cos(a) * r1}" x2="${200 + Math.sin(a) * 122}" y2="${205 - Math.cos(a) * 122}" stroke="${C.navy}" stroke-width="${i % 3 ? 5 : 9}" stroke-linecap="round"/>`; }).join("")}
    <path d="M200 205V120M200 205l58 34" stroke="${C.navy}" stroke-width="14" stroke-linecap="round"/>
    <circle cx="200" cy="205" r="14" fill="${C.yellow}"/>
    <path d="M318 82a175 175 0 0 1 36 92" fill="none" stroke="${C.yellow}" stroke-width="14" stroke-linecap="round"/>
    <path d="M338 172l16 12 14-16" fill="none" stroke="${C.yellow}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
    ${sparkle(64, 70, .9)}`),

  sheets: svg(`
    <rect x="70" y="262" width="260" height="62" rx="16" fill="${C.blue}"/>
    <rect x="80" y="200" width="244" height="62" rx="16" fill="#fff" stroke="${C.light}" stroke-width="4"/>
    <path d="M100 216h206M100 246h206" stroke="${C.blue5}" stroke-width="6" stroke-dasharray="20 12"/>
    <rect x="92" y="138" width="220" height="62" rx="16" fill="${C.light}"/>
    <rect x="104" y="76" width="196" height="62" rx="16" fill="${C.yellow}"/>
    <path d="M200 76v248" stroke="${C.navy}" stroke-width="10" opacity=".85"/>
    <path d="M178 62l22 18 22-18" fill="none" stroke="${C.navy}" stroke-width="10" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M70 290h260" stroke="${C.dark}" stroke-width="4" opacity=".5"/>
    ${sparkle(340, 92, 1)}${sparkle(56, 160, .7)}`),

  quilt: svg(`
    <path d="M60 140q0-30 30-30h220q30 0 30 30v150q0 30-30 30H90q-30 0-30-30Z" fill="${C.blue}"/>
    <clipPath id="q"><path d="M60 140q0-30 30-30h220q30 0 30 30v150q0 30-30 30H90q-30 0-30-30Z"/></clipPath>
    <g clip-path="url(#q)" stroke="${C.blue5}" stroke-width="5">
      ${Array.from({ length: 9 }, (_, i) => `<path d="M${i * 60 - 80} 110l220 220M${i * 60 + 40} 110l-220 220"/>`).join("")}
    </g>
    ${[[110, 160], [170, 160], [230, 160], [290, 160], [140, 215], [200, 215], [260, 215], [110, 270], [170, 270], [230, 270], [290, 270]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#fff"/>`).join("")}
    <path d="M60 250h280v40q0 30-30 30H90q-30 0-30-30Z" fill="${C.dark}"/>
    <path d="M60 250h280" stroke="#fff" stroke-width="6" stroke-dasharray="14 10"/>
    <ellipse cx="200" cy="350" rx="150" ry="12" fill="${C.light}"/>
    ${sparkle(340, 76, 1)}${sparkle(52, 90, .7, C.blue5)}`),

  curtains: svg(`
    <rect x="110" y="80" width="180" height="250" rx="8" fill="${C.pale}"/>
    <path d="M200 80v250M110 205h180" stroke="#fff" stroke-width="10"/>
    <circle cx="250" cy="130" r="22" fill="${C.yellow}"/>
    <rect x="60" y="56" width="280" height="14" rx="7" fill="${C.navy}"/>
    <circle cx="60" cy="63" r="13" fill="${C.yellow}"/><circle cx="340" cy="63" r="13" fill="${C.yellow}"/>
    <path d="M74 70h96q-10 70 -30 130 30 70 40 150H74Z" fill="${C.blue}"/>
    <path d="M326 70h-96q10 70 30 130-30 70-40 150h106Z" fill="${C.blue}"/>
    <path d="M100 76v270M132 76q-4 80-2 122M260 200q2 80 0 146M300 76v270" stroke="${C.dark}" stroke-width="6" stroke-linecap="round"/>
    <rect x="124" y="190" width="40" height="18" rx="9" fill="${C.yellow}"/><rect x="236" y="190" width="40" height="18" rx="9" fill="${C.yellow}"/>`),

  sherwani: svg(`
    ${hanger(26)}
    <path d="M118 96l52-12h60l52 12 34 240-46 20H130l-46-20Z" fill="#f3e3c3"/>
    <path d="M170 84h60l-6 26h-48Z" fill="#e2c48e"/>
    <path d="M200 110v246" stroke="#c99b45" stroke-width="5"/>
    ${[140, 175, 210, 245, 280, 315].map((y) => `<circle cx="200" cy="${y}" r="7" fill="#c99b45"/>`).join("")}
    <path d="M118 96l-34 120 26 8 22-72M282 96l34 120-26 8-22-72" fill="#ead2a6"/>
    <path d="M136 300q64 26 128 0" fill="none" stroke="#c99b45" stroke-width="5" stroke-dasharray="4 8" stroke-linecap="round"/>
    <path d="M150 140q20 10 0 30M250 140q-20 10 0 30" fill="none" stroke="#c99b45" stroke-width="4"/>
    ${sparkle(330, 90, 1.1)}${sparkle(72, 280, .8)}${sparkle(340, 300, .6, C.blue5)}`),

  box: svg(`
    <path d="M200 70l140 60v150l-140 60-140-60V130Z" fill="${C.blue}"/>
    <path d="M200 190l140-60v150l-140 60Z" fill="${C.dark}"/>
    <path d="M60 130l140 60 140-60-140-60Z" fill="${C.blue5}"/>
    <path d="M130 100l140 60v46l-30 12v-46L100 112Z" fill="${C.yellow}"/>
    <text x="150" y="292" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="74" fill="#fff" transform="skewY(23) translate(0 -64)">50</text>
    <path d="M286 230l14 14 26-30" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    ${sparkle(340, 70, 1)}${sparkle(60, 300, .7)}`),

  phone: svg(`
    <rect x="120" y="40" width="160" height="320" rx="28" fill="${C.navy}"/>
    <rect x="132" y="70" width="136" height="262" rx="10" fill="#fff"/>
    <rect x="178" y="52" width="44" height="8" rx="4" fill="#2c4a73"/>
    ${["Picked up", "Washing", "Pressing", "Delivery"].map((t, i) => `
      <circle cx="158" cy="${104 + i * 56}" r="13" fill="${i < 3 ? C.blue : C.light}"/>
      ${i < 3 ? `<path d="M152 ${104 + i * 56}l5 5 9-10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
      ${i < 3 ? `<path d="M158 ${117 + i * 56}v30" stroke="${C.blue}" stroke-width="4"/>` : ""}
      <text x="180" y="${110 + i * 56}" font-family="Poppins" font-weight="700" font-size="17" fill="${C.navy}">${t}</text>`).join("")}
    <circle cx="300" cy="300" r="42" fill="${C.yellow}"/>
    <path d="M300 276a18 18 0 0 1 18 18c0 14-18 30-18 30s-18-16-18-30a18 18 0 0 1 18-18Z" fill="${C.navy}"/><circle cx="300" cy="294" r="6" fill="${C.yellow}"/>
    ${sparkle(80, 90, .9)}`),

  building: svg(`
    <rect x="70" y="150" width="110" height="200" rx="6" fill="${C.blue5}"/>
    <rect x="160" y="70" width="170" height="280" rx="6" fill="${C.blue}"/>
    ${Array.from({ length: 6 }, (_, r) => [0, 1, 2].map((c) => `<rect x="${182 + c * 48}" y="${98 + r * 38}" width="30" height="24" rx="3" fill="${(r + c) % 3 ? C.light : C.yellow}"/>`).join("")).join("")}
    ${Array.from({ length: 4 }, (_, r) => [0, 1].map((c) => `<rect x="${88 + c * 34}" y="${176 + r * 38}" width="22" height="22" rx="3" fill="#fff" opacity=".8"/>`).join("")).join("")}
    <rect x="222" y="300" width="46" height="50" rx="4" fill="${C.navy}"/>
    <path d="M40 350h320" stroke="${C.navy}" stroke-width="10" stroke-linecap="round"/>
    ${sparkle(350, 80, 1)}`),

  wallet: svg(`
    <rect x="70" y="96" width="210" height="110" rx="10" fill="#7ccf8a" transform="rotate(-12 175 151)"/>
    <rect x="96" y="120" width="210" height="110" rx="10" fill="#5fbf70" transform="rotate(-5 200 175)"/>
    <circle cx="200" cy="175" r="26" fill="none" stroke="#fff" stroke-width="6" transform="rotate(-5 200 175)"/>
    <rect x="60" y="180" width="280" height="160" rx="22" fill="${C.navy}"/>
    <rect x="250" y="226" width="110" height="68" rx="18" fill="${C.blue}"/>
    <circle cx="282" cy="260" r="13" fill="${C.yellow}"/>
    <path d="M90 214h120" stroke="#2c4a73" stroke-width="8" stroke-linecap="round"/>
    ${sparkle(340, 110, 1)}${sparkle(60, 120, .7)}`),

  machine: svg(`
    <rect x="90" y="50" width="220" height="300" rx="26" fill="#fff" stroke="${C.blue}" stroke-width="14"/>
    <path d="M97 120h206" stroke="${C.blue}" stroke-width="8"/>
    <circle cx="130" cy="86" r="10" fill="${C.blue}"/><circle cx="162" cy="86" r="10" fill="${C.blue}"/>
    <rect x="220" y="78" width="60" height="16" rx="8" fill="${C.light}"/>
    <circle cx="200" cy="232" r="84" fill="${C.light}" stroke="${C.blue}" stroke-width="14"/>
    <clipPath id="w"><circle cx="200" cy="232" r="70"/></clipPath>
    <g clip-path="url(#w)"><path d="M120 236q20-16 40 0t40 0 40 0 40 0V320H120Z" fill="${C.blue5}"/>
      <circle cx="176" cy="200" r="10" fill="#fff" opacity=".9"/><circle cx="214" cy="184" r="6" fill="#fff" opacity=".9"/><circle cx="232" cy="214" r="8" fill="#fff" opacity=".9"/></g>
    ${sparkle(340, 80, 1)}${sparkle(60, 300, .8)}`),
};
