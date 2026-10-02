"use client";
import { useState } from "react";

/**
 * Upload an image to Cloudinary and keep its URL in a hidden form field.
 * When Cloudinary isn't configured, the admin can still paste an image URL.
 */
export function ImageUpload({ name, defaultValue, label = "Image" }: { name: string; defaultValue?: string | null; label?: string }) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) return setErr("Image must be under 5 MB.");
    setBusy(true); setErr("");
    try {
      const sig = await fetch("/api/admin/upload-signature", { method: "POST" });
      if (sig.status === 501) throw new Error("Image upload isn't set up yet. Add the Cloudinary keys in Vercel, or paste an image URL below.");
      if (!sig.ok) throw new Error("Couldn't start the upload.");
      const s = await sig.json();
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", s.apiKey);
      fd.append("timestamp", String(s.timestamp));
      fd.append("folder", s.folder);
      fd.append("signature", s.signature);
      const up = await fetch(`https://api.cloudinary.com/v1_1/${s.cloudName}/image/upload`, { method: "POST", body: fd });
      const data = await up.json();
      if (!up.ok) throw new Error(data?.error?.message ?? "Upload failed.");
      setUrl(data.secure_url);
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <span className="label">{label}</span>
      <input type="hidden" name={name} value={url} />
      <div className="flex items-center gap-3">
        <div className="grid h-16 w-16 flex-none place-items-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {url ? <img src={url} alt="" className="h-full w-full object-contain" /> : <span className="text-[10px] text-slate-400">No image</span>}
        </div>
        <label className="btn-ghost cursor-pointer px-3 py-2">
          {busy ? "Uploading…" : url ? "Change" : "Upload"}
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={busy} />
        </label>
        {url && <button type="button" onClick={() => setUrl("")} className="text-xs text-red-600">Remove</button>}
      </div>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="…or paste an image URL" className="input mt-2 py-2 text-sm" />
      {err && <p className="err">{err}</p>}
    </div>
  );
}
