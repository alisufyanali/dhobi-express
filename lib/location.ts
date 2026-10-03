type Loc = { address: string; mapsUrl: string; latitude: number | null; longitude: number | null };

/** True once the shop has a real address or map pin (not just the default "Karachi, Pakistan"). */
export const hasShopLocation = (s: Loc) => (s.latitude != null && s.longitude != null) || (s.address.trim().length > 0 && s.address !== "Karachi, Pakistan");

/** Google Maps embed URL — no API key needed. Prefers the exact pin, falls back to the address. */
export function mapEmbedUrl(s: Loc) {
  const q = s.latitude != null && s.longitude != null ? `${s.latitude},${s.longitude}` : s.address;
  return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
}

/** "Get directions" link: the owner's share link if set, otherwise Google Maps directions. */
export function directionsUrl(s: Loc) {
  if (s.mapsUrl) return s.mapsUrl;
  const dest = s.latitude != null && s.longitude != null ? `${s.latitude},${s.longitude}` : s.address;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}
