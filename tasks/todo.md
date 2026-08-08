# TODO — Client acquisition sprint (2026-08-07)

Goal: book 2 paid shoots in the next 2 weeks. Offer = **Content Day, $1,500**
(half day on site, 20-30 vertical clips + 10 stills, edited + captioned, 5-day delivery).
Positioning stays Creatively Grow — video is the entry product, not the brand.

## Agency partner channel

- [x] Build agency candidate list (web search — localseodata balance is 0, no paid scrape)
- [x] Qualify each: check services + portfolio for in-house video
- [x] Write up qualified list → `tasks/agency-partners.md` (9 qualified, 2 dropped, 2 unverified)
- [ ] Manually check Nathan Currin (403'd) + Mack Media Group (truncated)
- [ ] Import Tiers 1-2 to GHL agency account (`ghl-mcp` / `xwdd…`) tagged `partner-prospect`
- [x] Write partner intro message — white-label framing, trade rate, hands off their client
      → `tasks/partner-outreach.md` (Tier 1 email, Tier 2 email, text version, objection answer, send order)
- [ ] Call My SEO Guys (813) 333-9666 + Clearwater SEO (727) 900-5585 first

## One-pagers — TWO different documents, two different buyers

- [x] Design system received — `~/Downloads/design_handoff_creatively_grow 3/`
- [x] `partner-sheet.html` — AGENCY sheet. **$695 half day shoot-only (up to 4 hrs), raw files in
      72 hrs, editing quoted per job with a same-day number.** Monthly product and volume discount
      both cut — agencies don't want to resell someone else's package.
      Zone: Tampa Bay / Sarasota / Orlando, mileage past ~90 min.
- [x] `content-day.html` — CLIENT sheet, $1,500 retail
- [ ] ⚠️ **CLIENT SHEET IS NOW INCONSISTENT.** It sells a half day + 20–30 edited clips + 10 stills
      for $1,500. At Devon's own rates ($695 shoot + ~$100/clip one-off) that is $2,500–3,500 of work.
      Needs either a batch clip rate, far fewer clips, or a higher price. Devon's call — do not guess.
- [ ] Add real sample clips to both (currently no proof section)
- [ ] Wire both forms to the API (see `api/leak-check.js` pattern — the site is API-driven, not GHL forms)
- [ ] Draft the non-solicit the partner sheet promises

**Do not send the client sheet to an agency** — it shows retail and pitches them as the client,
which kills the markup that makes the partnership worth anything to them.

## Warm outreach (from CRM audit)

- [ ] 5 past payers, agency acct: Robert Releford, Elisabeth Graydon (repeat), David Larry, Shannon Owens
- [ ] 3 fresh Meta leads, Labif acct — Avery Gordon (Aug 3), Liza Capó Ocasio (Jul 31), "K" (Aug 5, $6k+ budget)
- [ ] 2 epoxy replies gone cold: MACH ONE (813) 428-2840, Van Delta (513) 652-1555
- [ ] Referral ask to real wedding leads (Labif acct) — they are NOT Content Day buyers

## Organic / SEO (long game — see `tasks/cg-blog-plan.md`)

- [x] Pull live keyword data (DataForSEO) to validate a CG blog thesis
- [x] Write the plan → `tasks/cg-blog-plan.md`
- [x] Re-tested for the epoxy / pool-cage pivot — vertical-named keywords are all zero-volume,
      backlog rewritten at contractor altitude
- [x] Phase 1: `/blog` built in `creativelygrow-next` (schema, sitemap, draft gating, build passes)
- [x] 5 posts drafted — `marketing-for-contractors`, `contractor-seo`,
      `google-guaranteed-for-contractors`, `remodeling-marketing`, `construction-marketing`
      — **all need Devon's review before deploy**
- [x] Removed false `addressLocality: "Holiday"` from index.html schema
- [x] 15 images generated (Higgsfield, 38 credits) → WebP in `creativelygrow-next/public/blog/`
      3 per post, hero + 2 inline, all sized + lazy-loaded, descriptive alt on every one
- [ ] Deploy blog as its own Vercel project, then add the `/blog/:path*` zone rewrite to root vercel.json
- [ ] Phase 0: GBP optimization (localseodata credits being topped up)
- [ ] Phase 2: clone the Labif Hermes → review/publish pipeline

## Parked

- [ ] Static ad w/ offer — revisit ~Sept 2026, after 2-3 Content Days produce real footage
- [ ] Contact form honeypot — Labif form spam is running ~2:1 over real inquiries

## Review

_(fill in after execution)_
