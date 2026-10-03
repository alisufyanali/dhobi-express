"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";
import { FLOW_PATHS, hasCartBar } from "./StickyActions";
import { useEffect, useRef, useState } from "react";
import { IconChat, IconSend, IconWhatsApp, IconX } from "./Icons";
import { rs, waLink } from "@/lib/site";

type Price = { name: string; price: number; unit: string };
type Info = {
  whatsapp: string; phone: string; threshold: number; fee: number; slots: string[];
  areas: string[]; prices: Price[]; packages: Price[];
};
type Msg = { from: "bot" | "me"; text: string; link?: { href: string; label: string }; wa?: string };

const QUICK = ["Rates", "Free delivery", "Areas", "How long?", "Packages", "Business contract", "Book pickup"];

/**
 * Instant-answer assistant. Answers come only from the site's own rates and
 * settings — it never makes things up. Anything it can't answer goes to WhatsApp.
 */
// Roman Urdu / common words → part of the English service name
const ALIASES: [string, string][] = [
  ["razai", "quilt"], ["rajai", "quilt"], ["kambal", "blanket"], ["parda", "curtain"], ["parday", "curtain"],
  ["chadar", "bedsheet"], ["bedsheet", "bedsheet"], ["takiya", "pillow"], ["sofa", "sofa"], ["duvet", "comforter"],
  ["shalwar", "shalwar"], ["kameez", "kameez"], ["kurta", "shirt"], ["shirt", "shirt"],
  ["pant", "trouser"], ["jeans", "trouser"], ["suit", "suit"], ["sherwani", "sherwani"], ["jora", "formal"],
  ["dress", "formal"], ["uniform", "uniform"], ["jaa-namaz", "jaa-namaz"], ["jainamaz", "jaa-namaz"], ["table cloth", "table cloth"],
];

function findItems(t: string, prices: Price[]) {
  const keys = ALIASES.filter(([w]) => t.includes(w)).map(([, k]) => k);
  let found = prices.filter((p) => keys.some((k) => p.name.toLowerCase().split(" — ")[0].includes(k)));
  // Show the service type the customer asked about; default to Wash & Iron (plus Dry clean for formal wear)
  const want = /iron|press|istri/.test(t) && !/wash|dhulai/.test(t) ? "Iron only" : /dry/.test(t) ? "Dry clean" : /wash only|sirf dhulai/.test(t) ? "Wash only" : null;
  const pick = found.filter((p) => (want ? p.name.endsWith(want) : p.name.endsWith("Wash & Iron")));
  if (pick.length) found = pick;
  else if (!want) found = found.filter((p) => p.name.endsWith("Wash only") || p.name.endsWith("Dry clean")).length ? found.filter((p) => !p.name.endsWith("Iron only")) : found;
  return [...new Map(found.map((p) => [p.name, p])).values()].slice(0, 6);
}

function answer(q: string, i: Info): Msg {
  const t = q.toLowerCase();
  const has = (...w: string[]) => w.some((x) => t.includes(x));

  // Complaints first: "my razai got damaged" should reach support, not the price list
  if (has("complain", "shikayat", "shikayet", "damage", "kharab", "phat", "refund", "paisay wapas", "lost", "gum ho", "missing", "problem")) {
    return { from: "bot", text: "Sorry to hear that. Register a complaint and you'll get a ticket number — we reply within 24 hours. Refunds and compensation are explained in our refund policy.", link: { href: "/complaints", label: "Register complaint" }, wa: "Assalam o Alaikum, I have a complaint about my order." };
  }

  // A specific item always wins: "razai kitne ki" → the quilt price
  const items = findItems(t, i.prices);
  if (items.length) {
    return { from: "bot", text: items.map((p) => `${p.name} — ${rs(p.price)} ${p.unit}`).join("\n") + "\nPickup and delivery free above " + rs(i.threshold) + ".", link: { href: "/services", label: "Book now" } };
  }

  if (has("rate", "price", "kitne", "kitna", "qeemat", "rs", "charges", "cost")) {
    const hit = i.prices.find((p) => t.includes(p.name.toLowerCase().split(" ")[0]));
    if (hit) return { from: "bot", text: `${hit.name}: ${rs(hit.price)} ${hit.unit}.`, link: { href: "/services", label: "See all rates" } };
    return { from: "bot", text: "Some popular rates:\n" + i.prices.slice(0, 6).map((p) => `• ${p.name} — ${rs(p.price)} ${p.unit}`).join("\n"), link: { href: "/services", label: "See all rates" } };
  }
  if (has("razai", "quilt", "kambal", "blanket", "curtain", "parda", "parday", "bedsheet", "chadar", "sofa", "duvet")) {
    const hits = i.prices.filter((p) => /razai|quilt|blanket|kambal|curtain|bedsheet|sofa|duvet|comforter/i.test(p.name));
    return { from: "bot", text: "Yes, we wash all of these:\n" + hits.map((p) => `• ${p.name} — ${rs(p.price)} ${p.unit}`).join("\n"), link: { href: "/services#bedding", label: "See bedding rates" } };
  }
  if (has("free", "delivery", "pickup charge", "delivery charge")) {
    return { from: "bot", text: `Pickup and delivery are free on orders above ${rs(i.threshold)}, every day — and on Sundays for any order size. Below that it's ${rs(i.fee)}. Pickup slots: ${i.slots.join(" or ")}.` };
  }
  if (has("area", "kahan", "where", "location", "nazimabad", "gulshan", "malir", "north")) {
    return { from: "bot", text: `We cover ${i.areas.join(", ")}. More of Karachi soon — if your area isn't listed, message us.`, wa: "Is my area covered for laundry pickup?" };
  }
  if (has("how long", "kitne din", "time", "kab", "turnaround", "ready", "hours", "ghante")) {
    return { from: "bot", text: "Usually 24–48 hours. Dry cleaning, quilts and bulk orders can take up to 72 hours." };
  }
  if (has("package", "bundle", "monthly", "deal", "offer", "discount")) {
    return { from: "bot", text: "Our packages:\n" + i.packages.map((p) => `• ${p.name} — ${rs(p.price)}`).join("\n"), link: { href: "/services#packages", label: "View packages" } };
  }
  if (has("hospital", "company", "factory", "uniform", "banquet", "lawn", "masjid", "contract", "business", "bulk")) {
    return { from: "bot", text: "We take monthly contracts for hospitals, companies, lawns and masjids — fixed pickup days, per-piece rates and a monthly invoice.", link: { href: "/business#inquiry", label: "Request a quote" } };
  }
  if (has("pay", "payment", "jazzcash", "easypaisa", "cod", "cash", "bank")) {
    return { from: "bot", text: "Cash on delivery, JazzCash, Easypaisa or bank transfer. Businesses get a monthly invoice." };
  }
  if (has("book", "order", "pickup", "bulana", "mangwana")) {
    return { from: "bot", text: "You can book online in a minute, or send us a WhatsApp.", link: { href: "/services", label: "Book a pickup" }, wa: "I want to book a laundry pickup." };
  }
  if (has("track", "status", "mera order", "my order")) {
    return { from: "bot", text: "Track it with your order ID and phone number.", link: { href: "/track", label: "Track order" } };
  }
  if (has("salam", "salaam", "hello", "hi", "hey", "aoa")) {
    return { from: "bot", text: "Wa Alaikum Assalam! Ask me about rates, free delivery, areas or contracts." };
  }
  return { from: "bot", text: "I'm not sure about that one. Our team can answer on WhatsApp.", wa: q };
}

export function ChatBot({ info }: { info: Info }) {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", text: "Assalam o Alaikum! How can we help? Tap a question or type your own." }]);
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const { count } = useCart();
  // On phones, sit above the tab bar (and the cart bar when it shows); hide in cart/checkout flows
  // Booking screens have + buttons on the right edge, so the chat button stays out of the way there
  const inFlow = [...FLOW_PATHS, "/services"].some((p) => path.startsWith(p));
  const lifted = hasCartBar(path, count);
  const btnPos = inFlow ? "hidden md:grid" : `grid ${lifted ? "bottom-40" : "bottom-24"}`;
  const panelPos = lifted ? "bottom-56" : "bottom-40";

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, open]);

  function ask(q: string) {
    if (!q.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: q }, answer(q, info)]);
    setInput("");
  }

  return (
    <>
      <button onClick={() => setOpen(!open)} aria-label={open ? "Close chat" : "Open chat"}
        className={`fixed right-4 z-40 ${btnPos} h-13 w-13 place-items-center rounded-full bg-brand-600 p-3.5 text-white shadow-lg md:bottom-6 md:right-6 md:h-14 md:w-14`}>
        {open ? <IconX className="h-6 w-6" /> : <IconChat className="h-6 w-6" />}
      </button>

      {open && (
        <div className={`fixed inset-x-3 ${panelPos} z-40 flex max-h-[60vh] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl md:inset-x-auto md:bottom-24 md:right-6 md:w-[370px]`} role="dialog" aria-label="Chat with Dhobi Express">
          <div className="flex items-center gap-3 bg-brand-600 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/20"><IconChat className="h-5 w-5" /></span>
            <div className="flex-1"><p className="text-sm font-semibold">Dhobi Express</p><p className="text-xs text-white/80">Instant answers · team on WhatsApp</p></div>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 p-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : ""}`}>
                <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm ${m.from === "me" ? "rounded-br-md bg-brand-600 text-white" : "rounded-bl-md border border-slate-200 bg-white text-slate-700"}`}>
                  {m.text}
                  {(m.link || m.wa) && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {m.link && <Link href={m.link.href} onClick={() => setOpen(false)} className="rounded-lg bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">{m.link.label}</Link>}
                      {m.wa && <a href={waLink(info.whatsapp, m.wa)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 rounded-lg bg-wa px-2.5 py-1 text-xs font-semibold text-white"><IconWhatsApp className="h-3.5 w-3.5" />WhatsApp</a>}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={end} />
          </div>

          <div className="flex gap-2 overflow-x-auto border-t border-slate-200 bg-white px-3 py-2 [scrollbar-width:none]">
            {QUICK.map((q) => (
              <button key={q} onClick={() => ask(q)} className="flex-none rounded-full border border-brand-200 px-3 py-1 text-xs font-medium text-brand-700 hover:bg-brand-50">{q}</button>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex gap-2 border-t border-slate-200 bg-white p-3">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a question…" aria-label="Your question" className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand-500" />
            <button className="grid h-10 w-10 place-items-center rounded-xl bg-brand-600 text-white" aria-label="Send"><IconSend className="h-5 w-5" /></button>
          </form>
        </div>
      )}
    </>
  );
}
