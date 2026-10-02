import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSession } from "@/lib/auth";

/** Signs a direct browser → Cloudinary upload. Admins only; the API secret never leaves the server. */
export async function POST() {
  const session = await getSession();
  if (session?.user?.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !secret) return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 501 });

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "dhobi-express";
  const signature = crypto.createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${secret}`).digest("hex");
  return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature });
}
