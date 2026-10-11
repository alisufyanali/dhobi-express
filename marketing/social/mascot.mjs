import { C } from "./shared.mjs";

// "Dhobi Bhai" — the washing-machine mascot. Parts carry ids (prefixed) so the
// video script can animate them: body, armL, armR, eyes, pupils, mouth*, drum, sweat.
export const MASCOT = (id = "m") => `
<svg viewBox="0 0 300 420" width="100%" height="100%" overflow="visible" xmlns="http://www.w3.org/2000/svg">
  <ellipse id="${id}-shadow" cx="150" cy="408" rx="96" ry="12" fill="rgba(0,20,60,.3)"/>
  <g id="${id}-body" style="transform-origin:150px 400px">
    <!-- legs -->
    <path d="M108 340v44M192 340v44" stroke="${C.navy}" stroke-width="20" stroke-linecap="round"/>
    <path d="M84 392q0-16 24-16t26 16Zm82 0q0-16 26-16t24 16Z" fill="#fff" stroke="${C.navy}" stroke-width="6" stroke-linejoin="round"/>
    <!-- arms (behind body) -->
    <g id="${id}-armL" style="transform-origin:46px 200px">
      <path d="M46 200q-40 20-48 70" fill="none" stroke="${C.navy}" stroke-width="18" stroke-linecap="round"/>
      <circle cx="-2" cy="276" r="20" fill="#fff" stroke="${C.navy}" stroke-width="6"/>
    </g>
    <g id="${id}-armR" style="transform-origin:254px 200px">
      <path d="M254 200q40 20 48 70" fill="none" stroke="${C.navy}" stroke-width="18" stroke-linecap="round"/>
      <circle cx="302" cy="276" r="20" fill="#fff" stroke="${C.navy}" stroke-width="6"/>
    </g>
    <!-- machine body -->
    <rect x="40" y="60" width="220" height="290" rx="44" fill="#fff" stroke="${C.blue}" stroke-width="12"/>
    <rect x="52" y="72" width="196" height="96" rx="32" fill="${C.pale}"/>
    <path d="M46 172h208" stroke="${C.blue}" stroke-width="8"/>
    <!-- cap -->
    <path d="M70 66q80-80 160 0Z" fill="${C.yellow}" stroke="#e7a20d" stroke-width="5"/>
    <path d="M200 60q50-4 70 10q-30 8-74 2Z" fill="#e7a20d"/>
    <circle cx="150" cy="22" r="8" fill="#e7a20d"/>
    <text x="150" y="58" text-anchor="middle" font-family="Poppins" font-weight="900" font-size="22" fill="${C.navy}">DE</text>
    <!-- face -->
    <g id="${id}-eyes" style="transform-origin:150px 112px">
      <ellipse cx="112" cy="112" rx="24" ry="28" fill="#fff" stroke="${C.navy}" stroke-width="5"/>
      <ellipse cx="188" cy="112" rx="24" ry="28" fill="#fff" stroke="${C.navy}" stroke-width="5"/>
      <g id="${id}-pupils">
        <circle cx="116" cy="116" r="12" fill="${C.navy}"/><circle cx="192" cy="116" r="12" fill="${C.navy}"/>
        <circle cx="120" cy="111" r="4.5" fill="#fff"/><circle cx="196" cy="111" r="4.5" fill="#fff"/>
      </g>
    </g>
    <ellipse cx="80" cy="146" rx="13" ry="7" fill="#ff9db0" opacity=".8"/><ellipse cx="220" cy="146" rx="13" ry="7" fill="#ff9db0" opacity=".8"/>
    <path id="${id}-mouthSmile" d="M132 144q18 18 36 0" fill="none" stroke="${C.navy}" stroke-width="6" stroke-linecap="round"/>
    <path id="${id}-mouthOpen" d="M128 142q22 0 44 0q-2 22-22 22t-22-22Z" fill="${C.navy}" opacity="0"/>
    <path id="${id}-mouthWorry" d="M134 154q16-12 32 0" fill="none" stroke="${C.navy}" stroke-width="6" stroke-linecap="round" opacity="0"/>
    <path id="${id}-sweat" d="M238 92q10 16 0 22q-10-6 0-22Z" fill="${C.blue5}" opacity="0"/>
    <!-- door + spinning drum -->
    <circle cx="150" cy="262" r="70" fill="${C.light}" stroke="${C.blue}" stroke-width="14"/>
    <clipPath id="${id}-clip"><circle cx="150" cy="262" r="58"/></clipPath>
    <g clip-path="url(#${id}-clip)">
      <path d="M86 268q16-12 32 0t32 0 32 0 32 0V330H86Z" fill="${C.blue5}"/>
      <g id="${id}-drum" style="transform-origin:150px 262px">
        <path d="M120 230h26l6 10-8 4v26h-22v-26l-8-4Z" fill="${C.yellow}"/>
        <path d="M160 270h30v14h-30Z" fill="#ff6b8a" transform="rotate(30 175 277)"/>
        <circle cx="140" cy="292" r="9" fill="#fff" opacity=".9"/><circle cx="178" cy="244" r="6" fill="#fff" opacity=".9"/>
        <path d="M112 280q8-12 16 0" fill="none" stroke="#fff" stroke-width="5"/>
      </g>
      <path d="M112 226q16-14 36-12" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".7"/>
    </g>
  </g>
</svg>`;
