# Dhobi Express

Laundry pickup and delivery website for Karachi — customer site, ordering, tracking and admin panel.

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind CSS 4 · Prisma + PostgreSQL · NextAuth · Cloudinary (optional) · Resend (optional)

---

## How it runs

| What you have set | What works |
|---|---|
| Nothing | **Demo mode.** Full public site from built-in sample content. Ordering, tracking and admin are off; a banner says it's a demo. |
| `DATABASE_URL` + `NEXTAUTH_SECRET` + admin login | Everything: orders, tracking, admin, coupons, blog, newsletter. |
| + Cloudinary keys | Photo upload in admin. |
| + Google keys | Customer sign-in with Google and order history. |
| + Resend key | Email alert to you on every new order and business inquiry. |

The build sets up the database by itself: when `DATABASE_URL` is set, `npm run build` creates/updates the tables and adds the starting content (services, areas, FAQ, reviews, blog posts, `WELCOME10` coupon, admin user). It only adds what's missing, so it's safe on every deploy. It refuses schema changes that would delete data.

---

## Deploy on Vercel

1. Import the GitHub repo in Vercel. It deploys in demo mode straight away.
2. **Database:** Vercel → your project → **Storage** → Create → **Neon** (free). It adds the database variables for you — nothing to copy.
   - Supabase also works: Connect → ORMs → Prisma, and add both lines as `DATABASE_URL` and `DIRECT_URL`.
3. Add in **Settings → Environment Variables**:

   | Variable | Value |
   |---|---|
   | `NEXTAUTH_SECRET` | any long random text (e.g. `openssl rand -base64 32`) |
   | `NEXTAUTH_URL` | your site URL, e.g. `https://dhobiexpress.pk` |
   | `NEXT_PUBLIC_SITE_URL` | same as above (used in sitemap, Google schema, share links) |
   | `ADMIN_EMAIL` / `ADMIN_PASSWORD` | your admin login — choose a strong password now; changing it later does not update an existing admin |

4. **Redeploy.** Then open `/admin` and sign in.
5. In **Admin → Settings**, set your real WhatsApp number, phone, email and address.

### Optional extras

- **Photo upload:** free account at cloudinary.com → add `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
- **Google sign-in:** console.cloud.google.com → APIs & Services → Credentials → OAuth client (Web). Redirect URI: `https://YOUR-DOMAIN/api/auth/callback/google`. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.
- **Email alerts:** free key at resend.com → `RESEND_API_KEY`, and `NOTIFY_EMAIL` (where alerts go). Until you verify your own domain in Resend, alerts can only go to the email you signed up with.

---

## Run locally

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, DIRECT_URL, NEXTAUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npx prisma db push        # create tables
npm run db:seed           # starting content + admin user
npm run dev               # http://localhost:3000
```

Leave `DATABASE_URL` empty to run in demo mode.

---

## Admin panel (`/admin`)

| Screen | Use it to |
|---|---|
| Dashboard | Today's orders, pickups due, booked revenue |
| Orders | Filter, change status, internal notes, print invoice, WhatsApp the customer |
| Customers | Order count and total spent per customer |
| Reports | Daily (30 days) and monthly (12 months) sales |
| Services / Categories | Prices, photos, per piece or per kg, show/hide, featured on home |
| Inquiries | Business leads; reply on WhatsApp or email, mark replied |
| Client logos | The "Trusted by" slider — only list companies that agreed |
| Coupons | Codes like `EID20`: % or Rs. off, minimum order, usage limit, expiry, first order only |
| Reviews | Add real customer feedback; approve or hide |
| Blog | Write articles (`## ` heading, `- ` bullet, blank line between paragraphs) |
| Subscribers | Newsletter list, CSV download |
| Areas | Turn service areas on/off, add new ones |
| Settings | Delivery fee, free-delivery threshold, Sunday rule, time slots, contact details |

---

## Things to edit in code

| File | What |
|---|---|
| `lib/images.ts` | Stock photos — replace with real photos of your machines and orders |
| `lib/areas.ts` | Area landing pages for Google. A new area added in admin has no landing page until you add it here |
| `lib/dict.ts` | English / Roman Urdu text |
| `lib/seed-data.ts`, `lib/posts-seed.ts` | Starting content (only used when the database is empty, and in demo mode) |
| `docs/pricing-research.md` | Competitor price comparison used to set rates |

## Delivery rule

Free pickup and delivery when the order is above the threshold (Rs. 1,000 by default), or when pickup *and* delivery are both on a Sunday. Otherwise the delivery fee applies. All three values are in Admin → Settings. The server always recalculates prices, delivery and coupon discounts — nothing from the browser is trusted.
