// English + Roman Urdu. Add keys to both objects.
export type Lang = "en" | "ru";

const en = {
  nav: { home: "Home", services: "Services", business: "For Business", track: "Track Order", contact: "Contact" },
  orderNow: "Order Now",
  whatsapp: "WhatsApp Us",
  heroTitle: "Pani ka masla? Time nahi? Kapray hum dhoyenge.",
  heroSub: "Wash, press and dry clean with free pickup & delivery across Karachi. Clean clothes back in 24–48 hours.",
  freeDeliveryNote: "Free pickup & delivery every Sunday, and on orders above Rs. 2,000 any day.",
  howItWorks: "How it works",
  steps: [
    { t: "Pickup", d: "Book online or on WhatsApp. Our rider collects from your door." },
    { t: "Wash", d: "Separate wash for every order, tagged so nothing gets mixed." },
    { t: "Press", d: "Steam pressed, folded and packed." },
    { t: "Delivery", d: "Back at your door in 24–48 hours." },
  ],
  featured: "Popular services",
  viewAll: "View all services",
  clients: "Trusted by",
  reviews: "What customers say",
  faq: "Common questions",
  areas: "Areas we serve",
  addToCart: "Add to cart",
  added: "Added",
  cart: "Cart",
  checkout: "Checkout",
};

const ru: typeof en = {
  nav: { home: "Home", services: "Services", business: "Business ke liye", track: "Order Track", contact: "Rabta" },
  orderNow: "Order Karein",
  whatsapp: "WhatsApp Karein",
  heroTitle: "Pani ka masla? Time nahi? Kapray hum dhoyenge.",
  heroSub: "Dhulai, press aur dry clean — ghar se pickup aur delivery free. 24–48 ghante mein saaf kapray wapas.",
  freeDeliveryNote: "Har Itwar free pickup aur delivery, aur Rs. 2,000 se zyada ke order par har din free.",
  howItWorks: "Kaise kaam karta hai",
  steps: [
    { t: "Pickup", d: "Online ya WhatsApp par book karein. Rider ghar se kapray le jayega." },
    { t: "Dhulai", d: "Har order alag dhulta hai, tag ke saath taake kapray mix na hon." },
    { t: "Press", d: "Steam press, tay aur pack." },
    { t: "Delivery", d: "24–48 ghante mein aapke ghar wapas." },
  ],
  featured: "Mashhoor services",
  viewAll: "Sab services dekhein",
  clients: "Hamare clients",
  reviews: "Customers kya kehte hain",
  faq: "Aam sawalat",
  areas: "Hum yahan service dete hain",
  addToCart: "Cart mein dalein",
  added: "Dal diya",
  cart: "Cart",
  checkout: "Checkout",
};

export const dict = { en, ru };
export type Dict = typeof en;
