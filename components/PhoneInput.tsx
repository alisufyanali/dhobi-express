"use client";
import { useState } from "react";

/**
 * Pakistani mobile number field: fixed +92 prefix, digits only, 10 digits (3XX XXXXXXX).
 * Submits as 03XXXXXXXXX (hidden input) so the server receives a normal local number.
 */
export function PhoneInput({ id, name, defaultValue = "", onChange }: {
  id?: string; name: string; defaultValue?: string; onChange?: (v: string) => void;
}) {
  const clean = (v: string) => v.replace(/\D/g, "").replace(/^92(?=3)/, "").replace(/^0/, "").slice(0, 10);
  const [digits, setDigits] = useState(clean(defaultValue));
  const valid = /^3[0-5]\d{8}$/.test(digits);

  return (
    <>
      <div className="flex overflow-hidden rounded-xl border border-slate-300 bg-white focus-within:border-brand-500 focus-within:ring-4 focus-within:ring-brand-100">
        <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-base text-slate-600">+92</span>
        <input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel-national"
          placeholder="300 1234567"
          value={digits}
          onChange={(e) => {
            const d = clean(e.target.value);
            setDigits(d);
            onChange?.(d ? "0" + d : "");
          }}
          className="min-w-0 flex-1 px-3 py-3 text-base tracking-wide outline-none"
        />
        {valid && <span className="flex items-center pr-3 text-sm font-semibold text-emerald-600" aria-label="Valid number">OK</span>}
      </div>
      <input type="hidden" name={name} value={digits ? "0" + digits : ""} />
    </>
  );
}
