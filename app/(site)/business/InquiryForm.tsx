"use client";
import { useState } from "react";
import { inquirySchema } from "@/lib/validators";

const TYPES = [["COMPANY", "Company / Factory"], ["HOSPITAL", "Hospital / Clinic"], ["LAWN_BANQUET", "Lawn / Banquet"], ["MASJID", "Masjid / Madrasa"], ["OTHER", "Other"]];

export function InquiryForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const parsed = inquirySchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      return setErrors(errs);
    }
    setErrors({});
    setState("sending");
    const res = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }).catch(() => null);
    setState(res?.ok ? "done" : "error");
  }

  if (state === "done") {
    return <div className="card mt-8 p-6 md:mt-0"><p className="text-lg font-semibold">Thank you! We&apos;ve received your inquiry.</p><p className="mt-2 text-slate-600">We&apos;ll call or WhatsApp you within one working day.</p></div>;
  }

  const E = ({ k }: { k: string }) => (errors[k] ? <p className="err">{errors[k]}</p> : null);
  return (
    <form onSubmit={onSubmit} noValidate className="card mt-8 grid gap-4 p-5 sm:grid-cols-2 md:mt-0 md:p-6">
      <div><label className="label" htmlFor="b-name">Your name</label><input id="b-name" name="name" className="input" /><E k="name" /></div>
      <div><label className="label" htmlFor="b-org">Organization</label><input id="b-org" name="organization" className="input" /><E k="organization" /></div>
      <div><label className="label" htmlFor="b-type">Type</label><select id="b-type" name="type" className="input" defaultValue="COMPANY">{TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></div>
      <div><label className="label" htmlFor="b-vol">Approx. monthly volume</label><input id="b-vol" name="monthlyVolume" className="input" placeholder="e.g. 300 uniforms / 200 kg" /></div>
      <div><label className="label" htmlFor="b-phone">Phone</label><input id="b-phone" name="phone" type="tel" className="input" /><E k="phone" /></div>
      <div><label className="label" htmlFor="b-email">Email (optional)</label><input id="b-email" name="email" type="email" className="input" /><E k="email" /></div>
      <div className="sm:col-span-2"><label className="label" htmlFor="b-msg">Message</label><textarea id="b-msg" name="message" rows={3} className="input" /></div>
      {state === "error" && <p className="err sm:col-span-2">Couldn&apos;t send (the site may be in demo mode). Please WhatsApp us.</p>}
      <button disabled={state === "sending"} className="btn-primary sm:col-span-2">{state === "sending" ? "Sending…" : "Send inquiry"}</button>
    </form>
  );
}
