"use client";
import Link from "next/link";
import { useState } from "react";
import { PhoneInput } from "@/components/PhoneInput";
import { IconCheck, IconWhatsApp } from "@/components/Icons";
import { COMPLAINT_TYPES, complaintSchema } from "@/lib/validators";
import { waLink } from "@/lib/site";

export function ComplaintForm({ whatsapp }: { whatsapp: string }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "demo" | "error">("idle");
  const [ticket, setTicket] = useState("");
  const [summary, setSummary] = useState("");
  const [pref, setPref] = useState<"WHATSAPP" | "CALL">("WHATSAPP");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), contactPref: pref };
    const parsed = complaintSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      document.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setErrors({});
    setSummary(`${parsed.data.type}${parsed.data.orderCode ? ` (order ${parsed.data.orderCode})` : ""}: ${parsed.data.message}`);
    setState("sending");
    const res = await fetch("/api/complaints", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    const body = await res?.json().catch(() => null);
    if (res?.status === 201) { setTicket(body.code); setState("done"); }
    else if (body?.demo) setState("demo");
    else { if (body?.errors) setErrors(body.errors); setState("error"); }
  }

  if (state === "done" || state === "demo") {
    const msg = state === "done" ? `Assalam o Alaikum, my complaint ticket is ${ticket}.` : `Assalam o Alaikum, I have a complaint. ${summary}`;
    return (
      <div className="card p-6 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600"><IconCheck className="h-7 w-7" /></span>
        {state === "done" ? (
          <>
            <h2 className="mt-4 text-xl font-bold text-brand-900">Complaint received</h2>
            <p className="mt-1 text-slate-600">Your ticket number is</p>
            <p className="mt-2 inline-block rounded-xl bg-brand-50 px-4 py-2 font-mono text-xl font-bold text-brand-700">{ticket}</p>
            <p className="mt-3 text-sm text-slate-600">We&apos;ll contact you within 24 hours. Keep this number to follow up.</p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-bold text-brand-900">Send it on WhatsApp</h2>
            <p className="mt-1 text-sm text-slate-600">Online complaints aren&apos;t switched on yet. Tap below and your message is ready to send.</p>
          </>
        )}
        <a href={waLink(whatsapp, msg)} target="_blank" rel="noopener" className="btn-wa mt-5 w-full"><IconWhatsApp className="h-5 w-5" />{state === "done" ? "Follow up on WhatsApp" : "Send on WhatsApp"}</a>
        <Link href="/" className="mt-3 inline-block text-sm font-medium text-brand-600">Back to home</Link>
      </div>
    );
  }

  const E = ({ k }: { k: string }) => (errors[k] ? <p className="err">{errors[k]}</p> : null);
  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-4 md:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="c-name">Your name</label><input id="c-name" name="name" className="input" autoComplete="name" /><E k="name" /></div>
        <div><label className="label" htmlFor="c-phone">Mobile number</label><PhoneInput id="c-phone" name="phone" /><E k="phone" /></div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="c-order">Order ID (if you have it)</label><input id="c-order" name="orderCode" placeholder="DE-12345" className="input uppercase" /></div>
        <div>
          <label className="label" htmlFor="c-type">What went wrong?</label>
          <select id="c-type" name="type" defaultValue="" className="input"><option value="" disabled>Choose one</option>{COMPLAINT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          <E k="type" />
        </div>
      </div>
      <div>
        <label className="label" htmlFor="c-msg">Tell us what happened</label>
        <textarea id="c-msg" name="message" rows={4} className="input" placeholder="Which item, what's wrong, and what you'd like us to do" />
        <E k="message" />
      </div>
      <div>
        <span className="label">How should we contact you?</span>
        <div className="grid grid-cols-2 gap-2">
          {([["WHATSAPP", "WhatsApp"], ["CALL", "Phone call"]] as const).map(([v, l]) => (
            <button type="button" key={v} onClick={() => setPref(v)} aria-pressed={pref === v}
              className={`rounded-2xl border p-3 text-sm font-semibold ${pref === v ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 text-slate-700"}`}>{l}</button>
          ))}
        </div>
      </div>
      {state === "error" && <p className="err">Couldn&apos;t send. Please check the fields, or WhatsApp us.</p>}
      <button disabled={state === "sending"} className="btn-primary w-full py-3.5 text-base">{state === "sending" ? "Sending…" : "Submit complaint"}</button>
      <p className="text-center text-xs text-slate-500">For damage or a missing item, please complain within 24 hours of delivery and keep the item and its tag.</p>
    </form>
  );
}
