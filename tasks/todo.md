# Website Repositioning — Local-Business Growth Systems

Source: `CLAUDE_WEBSITE_REPOSITIONING_HANDOFF.md`. Implementing in root production files (`index.html`, `styles.css`, `script.js`), NOT `creativelygrow-next/`.

## Plan

1. **`<head>` metadata** — new title/description/OG/Twitter copy (outcome-led, no "$59/month"). Replace JSON-LD `hasOfferCatalog` (old $59/$97/$197 prices) with a plain LocalBusiness description, no priced offers.
2. **Nav** — links become `How It Works` / `What We Improve`; primary CTA becomes `Get My Free Audit` (scrolls to the audit/contact form instead of opening the booking modal).
3. **Hero** — new eyebrow, headline, supporting copy, CTA, small qualifier. Remove the `$59/month · no setup fees · 30-day guarantee` footnote.
4. **Portfolio showcase** — keep video + structure; keep med-spa/Euro/Steadfast links (real, already live) since they're actual delivered sites, not fabricated proof.
5. **"What We Build" → "What We Improve"** — replace the 6 feature cards with the 4 outcome cards (Get Found Locally / Turn Interest Into An Inquiry / Follow Up Before The Lead Goes Cold / Create Value After The First Sale) + paid-acquisition qualifier line.
6. **"Three Steps" → "How The 90-Day Pilot Works"** — Audit & Priorities / Build & Launch / Optimize & Retain, with the client-funded-ad qualifier.
7. **Remove pricing section entirely** — delete `rb-pricing` block, payment links, footnote. Corresponding CSS pruned/left inert (grid rules removed).
8. **AI demo section → "What We Measure"** — replace the phone-call-demo CTA block with a measurement-framework section (source of inquiry, speed to response, missed-call recovery, bookings, follow-up status, reviews/repeat). Remove the live-call CTA (it centers AI as the product).
9. **Reputation demo** — keep the interactive phone mockup, but de-identify it: "Rivera HVAC" → generic/no name, "after every job" → "after a completed service, visit, or reservation."
10. **Testimonial section** — remove the unverified Marcus Rivera quote/stats; replace with the truthful positioning copy block from the brief ("More traffic does not help if the system loses the customer...").
11. **Credentials/stats section** — remove the unverified `8,400+ / 67% / 4.9` stats. Keep the founder-story copy (Devon is the real owner) but drop the fabricated numbers.
12. **Final CTA + form section** — update headline/body to audit framing; leave the GHL iframe embed technically as-is (flag in review notes that the connected GHL form's fields/copy need an external update — that's outside this codebase).
13. **Footer** — tagline → "Growth systems for local businesses that want more booked customers."
14. **Booking modal** — keep the modal markup (still reachable/useful), but it's no longer the forced primary CTA anywhere; update its copy to drop the "$" plan-tier framing ("figure out which tier fits") since tiers no longer exist.
15. **CSS dead-space audit** — after the section edits above, load the page in the preview browser at desktop width and visually check for oversized gaps (this needs eyes on the rendered page, not just grep); trim any oversized padding/min-height found.
16. **Verify** — start the dev server, check desktop + mobile (resize_window), confirm primary CTA scrolls correctly, iframe still renders, no console errors.

## Explicitly NOT doing
- Not touching `creativelygrow-next/`.
- Not naming or advertising the addiction-treatment facility anywhere on the public site.
- Not inventing new testimonials, stats, or logos to fill the gaps left by removed proof.
- Not adding pricing anywhere (no pilot price exists yet).
- Not editing the external GHL form itself (can't reach it from this repo) — will call this out as a manual follow-up.

## Checklist
- [x] Metadata + JSON-LD updated
- [x] Nav updated
- [x] Hero rewritten
- [x] Feature cards replaced ("What We Improve")
- [x] Steps section replaced ("How The 90-Day Pilot Works")
- [x] Pricing section removed
- [x] AI demo → "What We Measure"
- [x] Reputation demo de-identified
- [x] Testimonial replaced with truthful copy
- [x] Stats/credentials cleaned up
- [x] Final CTA + footer updated
- [x] Booking modal copy adjusted
- [x] Dead-space CSS pass (visual)
- [x] Verified desktop + mobile in browser preview

## Review (2026-07-23)

### What changed
- **index.html**: full repositioning per the handoff brief. New metadata/OG/JSON-LD (offer catalog with $59/$97/$197 removed), nav with How It Works / What We Improve / "Get My Free Audit" CTA, new hero (audit CTA, qualifier footnote, no pricing), 4 outcome cards replacing the 6 tool cards, 90-day pilot steps with client-funded-ads qualifier, pricing section + payment links deleted, AI phone demo replaced with a "What We Measure" grid (6 metrics), reputation demo de-identified (no Rivera HVAC, "after a completed service, visit, or reservation", no "no bad review ever goes public" claim), Marcus Rivera testimonial + fake stats (8,400+/67%/4.9) removed and replaced with the truthful positioning block, credentials keeps Devon's real story minus fabricated numbers, final CTA reframed as the free audit with a secondary "book a call" modal link, footer tagline updated.
- **styles.css**: new styles appended (nav links, 4-card grid, measure grid, positioning section, note paragraphs, final-CTA alt link) with 960px/640px responsive rules; hero h1 cap reduced to 4.5rem so the longer headline sits on 2 lines; rep-demo background flipped to `--forest` to keep section alternation. Old pricing/testimonial/ai-demo CSS left in place but unused (inert, no visual effect).
- **script.js**: untouched — all selectors are existence-guarded, nothing broke.

### Verified
- Desktop (1280) + mobile (375): no horizontal overflow, sections contiguous (no dead vertical space — measured programmatically), headline 2 lines at desktop.
- No console errors. GHL form iframe loads. Booking modal opens from the new secondary link. Rep demo star flow routes correctly with the new copy.
- Zero remaining references to old prices, payment links, guarantees, Rivera, or fake stats (grep-verified).

### Manual follow-ups (outside this repo)
1. **GHL form `RXDbxbX7YR6zNc5Zzouw`** still asks visitors to pick a plan — update it in the GHL form builder before driving traffic. Recommended fields: name, business name, website URL, city/service area, email, phone, priority service/reservation type they want more of, optional "What happens after a new inquiry arrives today?".
2. `assets/og-image.jpg` — confirm it exists and matches the new positioning (metadata references it).
3. Portfolio showcase links (Euro LLC / Steadfast Plumbing / Lumera Medspa) retained — confirm permission to present each.
4. Deploy when ready (changes are local, uncommitted).
