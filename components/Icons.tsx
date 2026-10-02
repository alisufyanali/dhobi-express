type P = { className?: string };
const base = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24" };

export const IconWhatsApp = ({ className }: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
    <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.2-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm0-21.6a11.8 11.8 0 0 0-10.2 17.7L.1 24l6.3-1.7A11.8 11.8 0 1 0 12 .2z" />
  </svg>
);
export const IconCart = ({ className }: P) => (<svg {...base} className={className} aria-hidden><circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" /><path d="M2 3h3l2.7 12.4a1.5 1.5 0 0 0 1.5 1.1h8.6a1.5 1.5 0 0 0 1.5-1.1L21 7H6" /></svg>);
export const IconMenu = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M4 7h16M4 12h16M4 17h16" /></svg>);
export const IconX = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>);
export const IconTruck = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7" /><circle cx="7" cy="17.5" r="1.8" /><circle cx="17" cy="17.5" r="1.8" /></svg>);
export const IconDrop = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z" /></svg>);
export const IconIron = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 17h18l-2-7a4 4 0 0 0-4-3H8M3 17l2-4h14" /><path d="M8 7V5h5" /></svg>);
export const IconBox = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 8l9-5 9 5v8l-9 5-9-5z" /><path d="M3 8l9 5 9-5M12 13v8" /></svg>);
export const IconCheck = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>);
export const IconPin = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>);
export const IconShirt = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M8 3 3 6l2 5 2-1v11h10V10l2 1 2-5-5-3a4 4 0 0 1-8 0z" /></svg>);
export const IconStar = ({ className }: P) => (<svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden><path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>);
export const IconHanger = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M12 7a2 2 0 1 1 2-2c0 1-2 1.5-2 3v1L3 16a1.5 1.5 0 0 0 1 2.7h16A1.5 1.5 0 0 0 21 16l-9-7" /></svg>);
export const IconCurtain = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 3h18M5 3v18M19 3v18M5 3c0 7 3 9 5 10-2 1-5 3-5 8M19 3c0 7-3 9-5 10 2 1 5 3 5 8" /></svg>);
export const IconBed = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 18V7M21 18v-5a3 3 0 0 0-3-3H10v5M3 15h18M3 18h18" /><circle cx="6.5" cy="11.5" r="1.8" /></svg>);
export const IconBadge = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M8 3 4 6l2 4 2-1v12h8V9l2 1 2-4-4-3-2 2h-4z" /><path d="M11 12h2" /></svg>);
export const IconClock = ({ className }: P) => (<svg {...base} className={className} aria-hidden><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
export const IconShield = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6z" /><path d="m9 12 2 2 4-4" /></svg>);
export const IconTag = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M3 12V4h8l10 10-8 8z" /><circle cx="7.5" cy="8" r="1.5" /></svg>);
export const IconArrow = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M5 12h14M13 6l6 6-6 6" /></svg>);
export const IconUser = ({ className }: P) => (<svg {...base} className={className} aria-hidden><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>);
export const IconChat = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></svg>);
export const IconSend = ({ className }: P) => (<svg {...base} className={className} aria-hidden><path d="M4 12 20 4l-6 16-3-7z" /></svg>);
