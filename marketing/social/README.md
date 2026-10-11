# Dhobi Express — Social Media Kit

- `out/posts/` — 16 square posts (1080×1080) for Instagram / Facebook
- `out/dhobi-express-reel.mp4` — 25s Reel / Story / TikTok video (1080×1920, no audio — add a trending sound in the app)

Every design: logo on top, content in the middle, website + email + WhatsApp number at the bottom.

## Change contact details / regenerate

1. Edit `CONTACT` in `shared.mjs` (website, email, phone).
2. Run:

```bash
node marketing/social/posts.mjs     # all posts  (or: posts.mjs 05  → just one)
node marketing/social/video.mjs     # the reel   (needs ffmpeg)
```

Needs Playwright with Chromium. Post text lives in the `POSTS` list in `posts.mjs`; illustrations are in `art.mjs`.

## Captions

| # | Post | Caption |
|---|---|---|
| 01 | Wash & Iron | Kapray dhulay bhi, press bhi — sirf Rs. 80 se! 👕 Ghar se pickup, ghar par delivery. #DhobiExpress #KarachiLaundry |
| 02 | Dry Clean | Suit, coat, blazer — professional dry clean sirf Rs. 650 mein. 🤵 #DryCleanKarachi |
| 03 | Steam Press | Kadak steam press sirf Rs. 45 per piece. 🔥 Office ke kapray ab tension free. |
| 04 | Free Pickup | Har Itwar pickup & delivery FREE! 🚚 Aur Rs. 2,000+ ke order par har din free. |
| 05 | 10% Off | Pehla order? Code WELCOME10 lagayein aur 10% bachayein. 🎉 |
| 06 | 24–48 Hours | Saaf kapray 24–48 ghante mein wapas aapke darwaze par. ⏱️ |
| 07 | Bedsheets | Fresh chadarein, saaf takiye — bedsheet Rs. 120 se. 🛏️ |
| 08 | Razai | Sardi aa rahi hai! Razai, kambal, comforter — poori tarah dhul kar aur sukha kar. ❄️ |
| 09 | Curtains | Parday saaf, ghar fresh. Curtains Rs. 300 per panel. 🪟 |
| 10 | Sherwani | Shaadi season ki tayyari — sherwani dry clean Rs. 900, pooray ehtiyat se. ✨ |
| 11 | Monthly Package | 50 kapray har mahine sirf Rs. 3,999 — free pickup & delivery ke saath. 📦 |
| 12 | 4 Steps | Pickup → Wash → Press → Delivery. Bas order karein, baqi hum par chhor dein. |
| 13 | Areas | FB Area, Nazimabad, North Nazimabad, Naya Nazimabad, Liaquatabad, North Karachi, New Karachi aur Gulshan-e-Iqbal. 📍 |
| 14 | Live Tracking | Aapka order kahan hai? Website par order code se har step live dekhein. 📱 |
| 15 | For Business | Hotels, hospitals, banquets aur offices ke liye commercial laundry. Inquiry bhejein! 🏢 |
| 16 | Easy Payment | Cash on Delivery, JazzCash, Easypaisa ya bank transfer — jo aapko pasand. 💳 |

Reel caption: *Pani ka masla? Time nahi? Kapray hum dhoyenge! 🧺 Free pickup & delivery across Central Karachi — pehle order par 10% off with WELCOME10.*

Hashtags: `#DhobiExpress #KarachiLaundry #LaundryKarachi #DryCleanKarachi #Karachi #FBArea #Nazimabad #GulshanEIqbal`
