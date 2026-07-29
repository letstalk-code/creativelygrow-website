# Website Restructure — One-Pager → Multi-Page Site (2026-07-28)

Scope: creativelygrow.com only. Landing pages (/epoxy, /pool-cage) PAUSED — no work there until the site is done. No photos of Devon anywhere. No AI images needed for this phase.

## New site structure

| Page | Purpose | Core content |
|---|---|---|
| `/` (homepage) | Convert + orient | Audit-driven rewrite: loss-first hero, trust strip (Coke/CeraVe/Vaya → Cornerstone/Steadfast), 2:40 Tuesday scene, "more traffic doesn't help" block, 4 concrete steps (each linking to its service page), proof block, objections, founder note (no photo), money-control promise, leak-check form (replaces GHL iframe + kills stale "Choose" dropdown) |
| `/how-it-works` | The engagement | 90-day pilot (audit/build/optimize), what we measure, client-funded ads explainer, money-control promise in full |
| `/websites` | Service page | Websites & landing pages that make the phone ring — portfolio links (Euro, Steadfast, Lumera), what's included, leak-check CTA |
| `/local-seo` | Service page | Google Business Profile, map pack, reviews, citations — targets "local SEO Tampa" terms |
| `/follow-up` | Service page | The front desk system: missed-call text-back, booking, reminders, review requests — the flagship differentiator + interactive review demo moves here |
| `/video` | Service page | Content That Works showcase moves here in full (7-video rail), AI-content vs real-shoot framing — targets "video production / content Tampa" terms |
| Nav | All pages | Logo · How It Works · Services (Websites / Local SEO / Follow-Up / Video) · CTA: "Free Leak Check" — needs a mobile hamburger (nav links currently hidden on phones) |
| Footer | All pages | Full page links (internal linking for SEO), NAP line (Tampa Bay), socials |
| `sitemap.xml` + meta | SEO | Per-page titles/descriptions/schema, sitemap, homepage keeps LocalBusiness JSON-LD |

## Homepage content decisions locked
- Leak check (48h video, no call) is THE offer everywhere; phone (727) 270-8422 is the ambient alternative
- Trust strip verb: "shot" for Coca-Cola/CeraVe/Vaya Space ✓ verified
- No pricing shown ✓
- No photo of Devon ✓
- Booking modal: removed (single door); calls welcome via the GHL number
- Portfolio showcase video stays on homepage (trimmed placement); full video rail moves to /video

## Order of work
1. [ ] Homepage rewrite + new nav/footer with mobile menu
2. [ ] /follow-up (flagship service page)
3. [ ] /websites, /local-seo, /video
4. [ ] /how-it-works
5. [ ] sitemap.xml, per-page meta, cross-linking pass
6. [ ] Verify all pages desktop + mobile, forms tested end-to-end
7. [ ] Push + confirm live

## Paused / later
- Landing page imagery (Higgsfield UI via Chrome, Nano Banana Pro, Unlimited plan — NOT the API)
- Google Ads setup
- GHL leak-check auto-responder workflow
- Repo → private (still recommended, awaiting OK)

---

## Studio (client galleries) — done 2026-07-28

Backend at `/studio` (password), client link at `/g?c=<slug>`.

- [x] Supabase project + `galleries`, `gallery_videos`, `gallery_photos` tables (RLS on)
- [x] `api/studio.js` — auth, gallery CRUD, Bunny TUS init, Supabase signed photo uploads
- [x] `studio.html` / `studio.js` / `studio.css` — login, gallery list, dropzone, progress bars, video + photo grids
- [x] `g.html` — branded client page, videos then photos, photos open full size
- [x] Photo chain verified end to end on production (sign → upload → attach → both pages → delete removes row *and* file)

Both media types drop into the same zone; videos go to Bunny library 715384, photos to the
`gallery-photos` bucket. Neither passes through the serverless function, so file size is not a limit.

### Still open on the studio
- [ ] Upload a real video to prove the Bunny TUS path with actual bytes (only the photo path has been tested)
- [ ] Change `STUDIO_PASSWORD` from `pp98n-a7yl5` to something memorable
- [ ] One leftover gallery named "Coca Cola" is sitting in the list — delete it if it was a test
