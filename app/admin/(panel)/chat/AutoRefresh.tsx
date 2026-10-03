"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Re-fetches the page every few seconds so new customer messages appear without reloading. */
export function AutoRefresh({ seconds = 6 }: { seconds?: number }) {
  const router = useRouter();
  useEffect(() => {
    const t = setInterval(() => !document.hidden && router.refresh(), seconds * 1000);
    return () => clearInterval(t);
  }, [router, seconds]);
  return null;
}
