import type { MetadataRoute } from "next";

// Makes the site installable: "Add to home screen" gives an app icon that opens full-screen.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dhobi Express — Laundry Karachi",
    short_name: "Dhobi Express",
    description: "Laundry pickup and delivery in Karachi.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#1a8cea", // Android launch splash: brand blue with the app icon
    theme_color: "#ffffff",
    categories: ["lifestyle", "shopping"],
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Book a pickup", url: "/bill-calculator" },
      { name: "Track my order", url: "/track" },
    ],
  };
}
