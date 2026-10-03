"use client";
import { useState } from "react";

export function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const contact = String(new FormData(e.currentTarget).get("contact") ?? "");
    setState("sending");
    const res = await fetch("/api/newsletter", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contact }) }).catch(() => null);
    if (res?.ok) return setState("done");
    setMsg((await res?.json().catch(() => null))?.error ?? "Something went wrong. Try again.");
    setState("error");
  }

  return (
    <div className="border-b border-white/10">
      <div className="container-x flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between md:gap-4 md:py-8">
        <div>
          <p className="font-semibold text-white">Get offers and Sunday deals</p>
          <p className="hidden text-sm text-slate-400 md:block">One message a month. No spam.</p>
        </div>
        {state === "done" ? (
          <p className="text-sm font-medium text-brand-200">Thanks, you&apos;re subscribed.</p>
        ) : (
          <form onSubmit={submit} className="w-full md:max-w-md">
            <div className="flex overflow-hidden rounded-xl bg-white">
              <input name="contact" required placeholder="Email or mobile number" aria-label="Email or mobile number"
                className="min-w-0 flex-1 px-4 py-2.5 text-sm text-slate-800 outline-none md:py-3" />
              <button disabled={state === "sending"} className="bg-brand-600 px-5 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-60">
                {state === "sending" ? "…" : "Subscribe"}
              </button>
            </div>
            {state === "error" && <p className="mt-2 text-sm text-red-300">{msg}</p>}
          </form>
        )}
      </div>
    </div>
  );
}
