# Dhobi Express — Social Media Kit

- `out/posts/` — 25 square posts (1080×1080) for Instagram / Facebook: 01–16 services & offers, 17–25 problem → solution
- `out/dhobi-bhai-reel.mp4` — 25s character Reel with "Dhobi Bhai" (washing-machine mascot), original music + sound effects
- `out/dhobi-express-showcase.mp4` — 30s Reel of the 16 photo posts (`photos/real-posts/01–16.jpg`), Dhobi Bhai dancing in the corner, music + SFX
- `out/dhobi-express-problems.mp4` — 29s Reel of the 9 photo problem → solution posts (`photos/real-problem-posts/01–09.jpg`): problem spotlight + buzzer, then solution spotlight + ding
- `out/dhobi-express-reel.mp4` — 25s simple Reel without sound

Every design: logo on top, content in the middle, website + email + WhatsApp number at the bottom.

## Change contact details / regenerate

1. Edit `CONTACT` in `shared.mjs` (website, email, phone).
2. Run:

```bash
node marketing/social/posts.mjs     # posts 01–16 (or: posts.mjs 05  → just one)
node marketing/social/problems.mjs  # problem → solution posts 17–25
node marketing/social/reel.mjs      # character reel with sound (needs ffmpeg + python3 numpy)
node marketing/social/showcase.mjs  # showcase of the 16 photo posts (optional: a folder with 01.jpg … 16.jpg)
node marketing/social/problems-reel.mjs  # problem → solution reel of the 9 photo posts (optional: folder with 01.jpg … 09.jpg)
node marketing/social/video.mjs     # simple reel, no sound
```

Needs Playwright with Chromium. Post text lives in the `POSTS` list in `posts.mjs`; illustrations are in `art.mjs`; the mascot is in `mascot.mjs`.

Real photos: drop them in `photos/` (see `photos/README.md`) and re-run — they replace the illustrations.

The reel's music and sound effects are synthesised by `audio.py` (original, royalty-free), timed to the scenes in `reel.mjs` — if you move a scene, move its sound in `EVENTS` too.

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

| 17 | Daagh | Chai ya salan ka daagh? Tension na lein — special stain treatment se kapray phir se naye jaise. ✨ |
| 18 | Silwatein | Silwaton bhari shirt mein office? Bilkul nahi! Kadak steam press sirf Rs. 45. 👔 |
| 19 | Pani ka masla | Ghar mein pani nahi aata? Kapray hum dhoyenge — aapka pani bachega. 💧 |
| 20 | Load-shedding | Bijli gayi aur kal office hai? Hamara press load-shedding ka intezar nahi karta. ⚡ |
| 21 | Kapron ka pahaar | Hafte bhar ke kapron ka pahaar? Ek call karein — sab dhul kar, tay ho kar wapas. 🧺 |
| 22 | Baarish | Baarish mein kapray nahi sookhte? Hum poori tarah dry kar ke, fold kar ke dete hain. ☀️ |
| 23 | Shaadi ka jora | Shaadi ke jore par daagh? Bridal aur lehenga dry clean pooray ehtiyat se. 💍 |
| 24 | Collar | Collar aur cuff ki maili lakeer? Deep cleaning se bilkul saaf. |
| 25 | Time nahi | Office se time nahi milta? Ghar se pickup, 24–48 ghante mein delivery. 🛵 |

Reel caption: *Pani ka masla? Time nahi? Kapray hum dhoyenge! 🧺 Free pickup & delivery across Central Karachi — pehle order par 10% off with WELCOME10.*

Hashtags: `#DhobiExpress #KarachiLaundry #LaundryKarachi #DryCleanKarachi #Karachi #FBArea #Nazimabad #GulshanEIqbal`
