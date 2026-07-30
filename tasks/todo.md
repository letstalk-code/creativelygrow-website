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

---

## Google search presence: stale snippet, missing favicon, profile visibility (2026-07-30)

### What I checked (facts, not guesses)
- Live https://creativelygrow.com/ serves the NEW title/description. Google is showing
  the OLD ones. `index.html` title last changed 2026-07-28 (commit 4ef6f296) — Google
  simply has not recrawled in two days. Nothing is broken on the site.
- Favicon files are all present and return 200 to a Googlebot user-agent:
  `/favicon.ico` (contains 16/32/48/64px), `/assets/favicon.png` (64x64),
  `/assets/apple-touch-icon.png` (180x180). robots.txt does not block them.
  The links carry a `?v=5` cache-buster, which makes the favicon URL unstable —
  Google asks for a stable icon URL and re-verifies slowly after it changes.
- `sitemap.xml` has no `<lastmod>` on any URL, so it gives Google no freshness signal.
- The "creative" query is a generic head term. A business panel only appears for queries
  Google resolves to the entity. This is a profile-strength / authority issue, not a bug.

### Plan — site changes (small, low risk)
- [ ] Drop the `?v=5` cache-buster from the three icon links in `index.html` so the
      favicon URL is stable; do the same on `how-it-works.html` / `our-work.html` if present
- [ ] Add a 96x96 (and 192x192) PNG icon declaration — Google prefers a 48px multiple
- [ ] Add `<lastmod>` dates to `sitemap.xml`
- [ ] Strengthen the LocalBusiness schema in `index.html`: add `image`, `address`,
      `priceRange`, and the real GBP profile URL under `sameAs`, so Google ties the
      website and the Business Profile to the same entity

### Plan — things only Devon can do (outside the repo)
- [ ] Search Console → URL Inspection → Request Indexing for `/`, `/how-it-works`,
      `/our-work`. This is what actually replaces the stale headline, usually 1-7 days
- [ ] Google Business Profile: finish "Complete your profile", add social profiles,
      confirm primary + secondary categories, set service area beyond Holiday
- [ ] Reviews. The profile is showing "Get reviews" — review count and velocity are the
      single biggest lever for showing up on non-brand searches

### Booking page — DONE (not yet deployed)
- [x] `book.html` — branded booking page at `/book`, embedding GHL calendar
      `NLaBtJ1Axz8OPBhJmp7Y` ("Strategy Call — Creatively Grow", 30 min, auto-confirm)
- [x] `.cg-book-*` styles appended to `styles.css`
- [x] `/book` added to `sitemap.xml`
- [x] Verified locally: calendar loads with live availability, desktop + mobile

The GHL widget stops being responsive below ~375px — at 341px it clipped its own
calendar columns and the event title. Fixed by taking the card edge to edge under
640px so the iframe gets the full viewport width. Confirmed all seven day columns
render and the page has no horizontal overflow.

`form_embed.js` auto-resizes the iframe by matching the calendar id inside the
element id, so `id="NLaBtJ1Axz8OPBhJmp7Y_booking"` has to keep that prefix.

Added a second `creativelygrow-alt` entry (port 4322) to `.claude/launch.json`
because another session held 4321.

### Client scheduling page — DONE (needs one manual GHL step)
- [x] `call.html` — plain, non-sales scheduling page at `/call` for existing clients
- [x] `noindex, follow` and deliberately left out of `sitemap.xml` so it never
      competes with `/book`
- [x] New GHL calendar "Client Call — Creatively Grow" (`FgDHJ1yzjAVdNLmUV0ib`)
- [ ] **BLOCKED — Devon must do this in the GHL UI:** the calendar has no team
      member and no open hours, so it offers zero slots. `get_free_slots` returns
      empty and the page renders "No slot available this month."

The MCP `create_calendar` tool has no `teamMembers` parameter, so it refused to make
a `round_robin` calendar ("No team member found") and fell back to type `event`.
`update_calendar` can only set name/description/duration/flags — no team members and
no availability. So this cannot be finished from here. Fix: GHL → Calendars →
Client Call → add Devon and set hours. Alternative: duplicate the Strategy Call
calendar in the UI (it copies availability) and give me the new id to swap in.

### Review

Verified against the live site rather than assumed:
- The stale Google headline is not a site bug. Live HTML already serves the new
  title; the copy changed 2026-07-28 and Google has not recrawled.
- Favicons were never missing or malformed — `/favicon.ico` returns 200 to a
  Googlebot UA and contains a 48x48 entry, which is what Google requires. The
  `?v=5` cache-buster was the real problem, since it resets Google's verification.

Not done, and why: `priceRange` was left out of the schema because I don't know the
real number and guessing it would publish a false claim. `sameAs` still lacks the
Google Business Profile URL — send me the GBP link and I'll add it, which is the
piece that most directly ties the site and the profile to one entity.
