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

## Google Business Profile — created 2026-07-28, verification pending

Live state: name "Creatively Grow", primary category Marketing agency, phone (727) 270-8422,
website creativelygrow.com. Status NOT PUBLICLY VISIBLE, video verification in review (up to 5 days).

Deliberately NOT on the profile: "Video production service" category. Labif Filmhouse holds that
category and likely shares an address, so overlapping categories risk a duplicate suspension.

### Safe to do while verification is pending
- [ ] Paste the 750-char description (drafted, 676 chars, in session notes)
- [ ] Fill out Edit Services with what CG actually sells
- [ ] Add photos + logo (Devon doing later)

### Wait until verified (these can restart the review clock)
- [ ] Replace "Florida, USA" service area with real cities: Tampa, St. Pete, Clearwater,
      Brandon, Largo, Riverview, Palm Harbor, Wesley Chapel. Statewide is too broad and
      service area is not a ranking signal anyway.
- [ ] Grab the review short link once live, wire it into review-funnel.html + GHL review requests

### Open question
- [ ] Hours mismatch. Site schema says Mo-Fr 09:00-17:00 (index.html:53), GBP says 10:00-18:00.
      Devon to confirm real times AND real days, then update the site to match.

## Studio photos — Bunny Storage backend shipped 2026-07-28

`api/studio.js` now picks its photo backend from config: all five `BUNNY_S3_*` vars
present means Bunny, anything missing falls back to Supabase. Code is deployed and
inert until the vars exist, so nothing changed on the live site yet.

SigV4 is hand-rolled on node `crypto` (this repo has no dependencies, and the AWS SDK
is ~20MB for one signing call). Verified byte-identical to the reference signer for
both the presigned PUT and the header-signed DELETE, across keys with spaces, plus
signs, AWS reserved characters, and unicode.

- [ ] Create a Bunny Storage zone with **S3 compatibility ticked at creation**
      (Bunny cannot enable it afterwards) plus a linked pull zone
- [ ] Set BUNNY_S3_REGION / _BUCKET / _ACCESS_KEY / _SECRET_KEY / _CDN_HOSTNAME
      in .env and Vercel
- [ ] Re-run the end-to-end photo test against Bunny
- Use a zone separate from Labif's: the CDN hostname is visible in every photo URL a
  Creatively Grow client sees, so sharing Labif's zone leaks the other brand.
- No migration needed. Production currently holds zero photos.

## Studio preview + client downloads — done 2026-07-29

- [x] Studio: "Preview" next to Copy opens `/g?c=<slug>` in a new tab
- [x] Client gallery: per-file Download on every video and photo, plus "Download everything"
      when a gallery holds more than one item
- [x] Verified on production with a real 10.2MB video and a real photo

Why downloads fetch a blob instead of using a plain link: the `download` attribute is
ignored cross-origin, so a link would open the file rather than save it, and the client
would get `play_720p.mp4` instead of the film's title. Fetching lets us set the real
filename and show progress. Falls back to opening the file if a fetch is ever blocked.

Videos resolve their best encoded MP4 on demand via `action=download`, because Bunny
only knows the resolution ladder after encoding finishes. That action checks the guid
belongs to the requested published gallery — verified a video from the same Bunny
library but a different gallery returns 404.

Two things worth knowing:
- The Stream pull zone gates files by referrer. Downloads work from creativelygrow.com
  and will 403 anywhere else, so the buttons only function on the real gallery page.
- Supabase serves public photo URLs through a CDN, so a removed photo can stay
  reachable by direct URL for a while after the row and file are gone. The gallery stops
  listing it immediately. Worth confirming Bunny's cache behaviour after the switch.
