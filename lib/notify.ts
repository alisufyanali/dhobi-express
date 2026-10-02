/**
 * Owner alerts by email via Resend (free tier: resend.com). Optional — does nothing
 * unless RESEND_API_KEY and NOTIFY_EMAIL are set. Never blocks or fails the request.
 */
import { SITE, rs, waLink } from "./site";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function send(subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  if (!key || !to) return;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: process.env.NOTIFY_FROM ?? "Dhobi Express <onboarding@resend.dev>", to: to.split(",").map((x) => x.trim()), subject, html }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("notify: Resend responded", res.status, await res.text());
  } catch (e) {
    console.error("notify: failed", e);
  }
}

export function notifyNewOrder(o: {
  id: string; code: string; name: string; phone: string; address: string; area: string;
  pickupDate: string; pickupSlot: string; total: number; items: { name: string; quantity: number }[]; notes?: string | null;
}) {
  const wa = waLink(o.phone.replace(/^0/, "92"), `Assalam o Alaikum ${o.name}, Dhobi Express here about order ${o.code}.`);
  return send(
    `New order ${o.code} — ${rs(o.total)} — ${o.area}`,
    `<h2>New order ${esc(o.code)}</h2>
     <p><b>${esc(o.name)}</b> · ${esc(o.phone)}<br>${esc(o.address)}, ${esc(o.area)}</p>
     <p>Pickup: <b>${esc(o.pickupDate)}, ${esc(o.pickupSlot)}</b></p>
     <ul>${o.items.map((i) => `<li>${esc(i.name)} × ${i.quantity}</li>`).join("")}</ul>
     <p>Total: <b>${rs(o.total)}</b></p>
     ${o.notes ? `<p>Note: ${esc(o.notes)}</p>` : ""}
     <p><a href="${SITE.url}/admin/orders/${o.id}">Open in admin</a> · <a href="${wa}">WhatsApp customer</a></p>`,
  );
}

export function notifyNewInquiry(q: { name: string; organization: string; type: string; phone: string; email?: string | null; monthlyVolume?: string | null; message?: string | null }) {
  return send(
    `Business inquiry — ${q.organization}`,
    `<h2>New business inquiry</h2>
     <p><b>${esc(q.organization)}</b> (${esc(q.type)})<br>${esc(q.name)} · ${esc(q.phone)}${q.email ? ` · ${esc(q.email)}` : ""}</p>
     ${q.monthlyVolume ? `<p>Volume: ${esc(q.monthlyVolume)}</p>` : ""}
     ${q.message ? `<p>${esc(q.message)}</p>` : ""}
     <p><a href="${SITE.url}/admin/inquiries">Open inquiries</a></p>`,
  );
}
