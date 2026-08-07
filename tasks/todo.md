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
- [x] **RESOLVED.** Devon duplicated the Strategy Call calendar in the GHL UI.
      The working client calendar is `BjHdsMbfp7j8BPPa3LUR` — round robin, Devon
      attached, Google Meet, and availability running later than the sales
      calendar (to 7:30 PM). `/call` now points at it and renders real slots.
      Its description was still the sales copy, so I updated it to match the page.
- [ ] The empty API-made calendar `FgDHJ1yzjAVdNLmUV0ib` is still in GHL, unused.
      Delete it once Devon confirms.

The MCP `create_calendar` tool has no `teamMembers` parameter, so it refused to make
a `round_robin` calendar ("No team member found") and fell back to type `event`.
`update_calendar` can only set name/description/duration/flags — no team members and
no availability. So this cannot be finished from here. Fix: GHL → Calendars →
Client Call → add Devon and set hours. Alternative: duplicate the Strategy Call
calendar in the UI (it copies availability) and give me the new id to swap in.

### SERP check — why no knowledge panel (2026-07-30)

Ran one `organic_serp` credit on "Creatively Grow" from Holiday, FL. Result:

- `knowledge_panel: null`, `local_pack: []` — confirmed, no panel for a neutral
  searcher. Devon's incognito observation was right.
- `creativelygrow.com` ranks #2 organically, so the site itself is findable.
- The indexed title is still the OLD one, hours after the deploy. Google has not
  recrawled. Request Indexing is still the gating step.
- The rest of page 1 is generic: Grow Creative, Grow Creativity, Grow Creative
  Studio (Pensacola), Creative Growth Art Center (Oakland), Bloom and Grow
  Creative, and Creatively Grown at #10.

That last point is the diagnosis. Google is treating "Creatively Grow" as the
generic phrase grow + creative and serving semantic matches from across the
country, not as a brand. It is an entity-recognition problem, NOT a verification
problem — the profile is verified ("You manage this Business Profile" + green
profile strength). Contrast "Labif Filmhouse", a unique string that resolves to
one entity instantly, which is why that panel fires and this one doesn't.

Fixes, in order of directness: GBP URL into `sameAs`, recrawl, more reviews,
consistent NAP citations on third-party directories.

Note: `facebook.com/creativelygrow` returned 400 to a scripted request. Probably
just bot-blocking rather than a dead page, but worth Devon confirming — a
`sameAs` pointing at a page that does not exist weakens the entity signal.

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

---

## Email signature — rebuilt on the new logo (2026-08-01)

The old signature used the retired horizontal "CREATIVELY GROW" wordmark
(`assets/old_logo.png`). The live mark is the square C/G tile (`assets/logo.png`),
already served at https://creativelygrow.com/assets/logo.png (verified 200).

### Decisions (confirmed with Devon)
- Layout: square C/G mark on the LEFT, divider, text block on the right.
- Drop the Meta/Coursera + Mailchimp badges — no longer relevant.
- Replace with credentials people actually care about: Claude AI, CRM builds,
  landing pages, Meta Ads.

### Todo
- [x] Confirm the current logo file (`assets/logo.png` = C/G mark)
- [x] Pull brand tokens from `styles.css` (forest #1a2a1a, cream #f9f8eb, orange #ef7938)
- [x] Verify the hosted logo URL returns 200
- [x] Build `email-signature.html` — table layout, inline styles, email-client safe
- [x] Render and visually verify at desktop and phone width

### Constraints that shaped the build
- Tables only. Gmail and Outlook strip flexbox and grid.
- Inline styles only — Gmail drops `<style>` blocks and classes when you paste.
- No web fonts. Gmail strips `@font-face`, so Oswald/Inter fall back anyway;
  used a system sans stack so it renders the same everywhere.
- Logo referenced by absolute https URL. A local path breaks the moment it is sent.
- Credentials are typeset, not borrowed logos — see Review.

### Logo marks added on request (2026-08-01, second pass)
Devon asked again for the Claude and Meta marks after I raised the trademark
concern, so they are in. Framing chosen to keep the authority without the
exposure: the row is labelled **"BUILDS WITH"**, which states the tools he works
in — true and defensible — rather than showing bare logos, which read as
certification or partnership. That distinction is the whole risk.

Marks rendered locally rather than hotlinked from a third-party CDN, because a
hotlink can break, change, or be pulled and would take the strip down inside
already-sent mail. Generator kept at `scratchpad/gen_marks.py`:
- `assets/sig-claude-mark.png` — 54x54 (3x of 18), terracotta #D97757 burst
- `assets/sig-meta-mark.png` — 90x54 (3x), blue gradient loop
Both `alt=""`, so a client blocking images degrades to the wordmarks beside them
instead of printing each name twice.

Text pills reduced to Devon's own claims (CRM Builder, Landing Pages That Sell);
Claude and Meta moved into the logo row so nothing is stated twice. Logo tile
went 84px → 100px to balance the now-180px text block.

Label later changed "BUILDS WITH" → **"EXPERT IN"** at Devon's request. Still a
claim about his own skill rather than a credential issued by Meta or Anthropic,
so the distinction that matters holds.

Generator copied to `tasks/gen_marks.py` so the marks can be re-rendered at a
different size without reverse-engineering the paths.

### Copy rewritten (2026-08-01, third pass)
Both lines were flagged in the previous review as off-position; Devon picked the
recommended replacement for each.
- Title: "Senior Content Strategist" → **"Founder & Growth Systems Builder"**.
  The signature now claims CRM, landing pages and ads, so "content" undersold it.
  "Systems" is the word that separates him from one-off freelancers.
- Green pill: "A Content Creation Company" → **"We Make The Phone Ring"**.
  Lifted from his own site copy. Names the result the client wants rather than
  the service sold.

### Google Ads added (2026-08-01, fourth pass)
Third mark rendered the same way: `assets/sig-gads-mark.png`, the yellow/blue "A"
monogram with the green foot. Row now reads EXPERT IN · Claude · Meta Ads ·
Google Ads. Measured after the change: 473px wide, 127px of headroom to the 600px
email limit, height unchanged at 180px. Three marks still read as a capability
strip rather than a badge farm because they are small and the label is muted.

Two things Devon should weigh, neither of them blocking:
- **Google Partners is a real badge program**, unlike the Meta case. The Google
  Ads product logo sitting under "EXPERT IN" reads close to a Partner claim.
  The badge is earnable (certifications + spend + performance) and is verifiable,
  so it is worth materially more than the logo. Worth pursuing rather than
  approximating.
- `Google Ads setup` is still sitting under "Paused / later" in this same file
  (line ~38). That is about CG's own account, not client work — but if Devon is
  not actively running Google Ads for clients today, this line gets caught on a
  discovery call and costs more trust than it buys. Confirm before sending.

### Tagline bar promoted (2026-08-01, fifth pass)
Green pill → full-width bar spanning the text block, uppercase and centred, so it
reads as a statement rather than a caption. Contact line was briefly enlarged too,
then reverted at Devon's request — website and phone are back to 13px exactly as
before.

Bar sizing was tuned across three passes: 11px/6px padding (original chip),
16px/14px (too loud), settled at **12px, 9px 14px padding, 1.2px letter-spacing**.
Reasoning for the smaller end: a signature is seen repeatedly by the same
recipient across a thread, so the bar must not outweigh Devon's own name (19px).
At 16px on a full-width dark fill it did. Bigger would only win if this were
purely first-touch cold outreach.

- [x] **Deploy gate cleared 2026-08-01.** Pushed to `main` as `ba438b4d` (six files
      only — the repo has a lot of unrelated untracked images, left alone). Pushed
      to `main` rather than a branch deliberately: Vercel deploys from `main`, so a
      branch would not have made the marks reachable, which was the whole point.
      Vercel served all three ~20s later. Verified by sha256 that the live bytes
      are identical to the local files, not a 200-with-error-page, and re-rendered
      `email-signature.html` against production — all four images resolve, natural
      dimensions 512/54/90/54 against 100/17/28/17 display, so they stay crisp on
      retina.

### Bar text went black in a real send — fixed 2026-08-01 (sixth pass)
Devon sent a live test: the green bar rendered with near-black text, unreadable
on the dark fill. Correct in Gmail's compose view, broken in the received message.

Root cause: the cream was declared only on the `<td>`, so the text inherited it.
Apple Mail (and some webmail) run a contrast pass that rewrites `color` on
whichever element directly holds the text while leaving `background-color`
alone — it assumes a white page behind the text and does not account for the
cell's dark fill. Compose looks right because Gmail's editor never runs that
pass; only the rendered message does.

Fix: carry the colour on three layers, since sanitisers drop different ones.
1. inner `<span style="color:#f9f8eb !important">` — beats the client stylesheet
2. legacy `<font color="#f9f8eb">` — survives sanitisers that strip CSS
3. the `<td>` colour retained as final fallback
Verified all three present and the computed colour is rgb(249,248,235).

**No deploy needed for this.** The HTML is pasted into Gmail directly; only the
images are fetched over the network and those are already live. Devon must
re-copy from the file and replace the signature in Gmail.

### The !important fix did NOT solve it — real cause found (seventh pass)
Second live test still rendered dark, on BOTH iPhone and Mac, both in light mode.
That rules out dark mode, and it rules out the sanitiser theory the three-layer
fix was built for. `!important` cannot win here: Apple Mail's transform runs at
the rendering layer, below the CSS cascade.

The evidence was sitting in Devon's own screenshot the whole time. Apple Mail
rendered `#ef7938` on the contact line correctly, and the orange-brown pill
correctly. It honoured every colour in the signature EXCEPT the near-white one.
So it is not dropping colour declarations — it specifically darkens text it reads
as too light for the background it assumes is behind it, and ignores the cell's
actual background-color.

Fix: bar text cream `#f9f8eb` → orange `#ef7938`. A saturated mid-tone passes the
contrast pass untouched, proven by that same orange already surviving elsewhere in
the same send. Contrast on `#1a2a1a` is 5.37:1, above WCAG AA for normal text, and
it is bold uppercase on top of that. Keeps the dark green block Devon likes.

The three-layer declaration (span + font + td) is retained — it guards a genuinely
different failure, sanitisers that strip styles. Two problems, two guards; the
mistake earlier was assuming one fix covered both.

### Orange did NOT fix it either — the client is Canary Mail (eighth pass)
Third live test: orange came through black too. That kills the contrast-transform
theory outright — a lightness-based pass would have left a saturated mid-tone
alone. Since cream and orange both land on black, Canary is forcing its own
default foreground onto text in this cell, and NO colour value can win that.

Also a misread on my part worth recording: Devon said "black and canary" two
passes ago and I took it for a dictation slip, then assumed Apple Mail from the
screenshot. The client was **Canary Mail** (macOS + iOS) the whole time. The two
earlier fixes were aimed at the wrong renderer.

Reverted to cream `#f9f8eb`. Rationale: no colour fixes Canary, so there is
nothing to buy by compromising the design for it, and cream is correct in Gmail.

The three-layer declaration (span + font + td) stays. It guards a genuinely
separate failure — sanitisers that strip styles — and costs nothing.

### What actually matters here
Canary is DEVON'S client, not his recipients'. Its market share is negligible;
prospects are on Gmail, Apple Mail, Outlook, and Gmail is already confirmed
correct. Optimising the design around Canary would be backwards.

- [ ] **The test that matters:** send to an address read in a MAINSTREAM client —
      Gmail mobile app, Apple Mail, or Outlook. If the bar is fine there, this is
      a Canary quirk and should simply be ignored.
- [ ] Only if a mainstream client also fails: drop the dark fill so that
      forced-black text stays readable. That is structural, not another colour
      guess. Costs the green block.

### Still open for Devon
- [ ] **Confirm the Google Ads claim is true today.** `Google Ads setup` is still
      under "Paused / later" (line ~38 of this file). If he is not actively running
      Google Ads for clients, delete the last two `<td>` blocks in the EXPERT IN row.
- [ ] Consider earning the Google Partner badge — the only independently verifiable
      credential in that row, and worth more than the drawn logo.
- [ ] Decide whether pushing straight to `main` on this repo is the standing
      preference, or whether to branch by default in future.

### Review
Built `email-signature.html`. Once the marks are live: open it in a browser,
select from the logo through the tagline, copy, paste into Gmail Settings →
Signature.

Verified rather than assumed: hosted logo URL returns 200; the divider cell
measures full-height (144px, then 180px) rather than collapsing; total width
546px, under the 600px email safe width; pills render as `<td>`s so Outlook keeps
their padding, which it would drop on inline-block spans.

Kept as-is because they weren't in scope: the title "Senior Content Strategist"
and the tagline "A Content Creation Company". Both now sit off from the
CRM/AI/landing-page positioning the rest of the signature states. Worth a look.

---

## Website contact form — lead notification (2026-08-05)

### Background (verified, not assumed)
- The contact form at `index.html:526` posts to `/api/leak-check` with `niche: 'contact'`.
  It is NOT a GHL form — no GHL form is ever submitted.
- `api/leak-check.js` calls the GHL v2 REST API directly: upserts the contact
  (tag + source `website-contact`), attaches a note, and sends the lead an SMS.
- A live test submission on 2026-08-06 03:41:39 UTC produced exactly ONE outbound
  message (the code's SMS, `source: "app"`, no `userId`) and the contact record
  carries only the single `website-contact` tag. Confirms the GHL workflow
  "01. Smart Website New Leads Website Contact Form" does NOT fire on this form.
- Gap: nothing notifies Devon. Leads land silently.
- Workflow triggers cannot be edited via the GHL API, and the GHL automation
  module will not render in the automated browser. That route is manual-only.

### Plan
1. [x] Add `GHL_NOTIFY_CONTACT_ID` to Vercel env (Devon's GHL contact
       `FOB1WDgpORfTsc3PdzTa` / +1 813 999 0012). Env var, not hardcoded, so a
       deleted or merged contact is a config change rather than a code change.
2. [x] In `api/leak-check.js`, after the lead auto-reply, send Devon a
       notification via `POST /conversations/messages` with that contact id.
       Body: business name, first name, phone, and what they wrote.
3. [x] Wrap it in its own try/catch and skip cleanly when the env var is unset —
       a failed notification must never fail the lead capture. Same pattern the
       note and auto-reply already use.
4. [ ] Deploy, submit a real test through the live form, and verify from the API
       that two outbound messages now exist: the lead's and Devon's.

### Resolved
- Channel: both. SMS and email, both addressed to GHL contact
  `FOB1WDgpORfTsc3PdzTa`, which carries +1 813 999 0012 and
  letstalk@creativelygrow.com — one id drives both channels.

### Not doing (and why)
- Repointing the "01. Smart Website…" workflow trigger. Its 20 versions of
  actions have never been inspected; pointing it at the `website-contact` tag
  could double-text every lead or drop them into a drip written for a different
  funnel.

### Cleanup
- [x] Restored contact `TT3BWc4mYwQXgHNRvSF8` (+1 212 390 1416), which the test
      submission had overwritten. Cleared the injected `firstName` "Thomas",
      `lastName` "(Route Care)", `companyName` "Route Care", `source`
      "website-contact", and the `website-contact` tag. Empty strings are ignored
      by both the MCP tool and the REST API — explicit `null` is what clears a
      field. Their message history is untouched; the test auto-reply is still in
      the thread and cannot be unsent.

### Review
Shipped as `902831bb`, deployed to production (Ready, 12s). `/api/leak-check`
answers on the live domain and still returns 400 to an empty body, so validation
is intact.

What changed: `api/leak-check.js` now sends Devon an SMS and an email after the
lead's auto-reply, both addressed to `GHL_NOTIFY_CONTACT_ID`. Each send is
independently wrapped and the block is skipped when the env var is unset, so a
notification failure cannot cost a lead. Lead input is HTML-escaped before it
enters the email body.

Not verified end to end. Every live test needs a phone number, and each option
has a real cost — see below.

### Open — the form clobbers existing contacts
`/contacts/upsert` matches on phone, so a submission from anyone already in the
CRM overwrites their `firstName`, `lastName`, `companyName`, and `source`. That
is what happened to +1 212 390 1416 during testing, and it will happen to any
real lead who was previously a prospect. It also means there is no safe way to
test the form: a made-up number texts a stranger, and a known number damages a
record. Worth fixing before the next test — read the contact first and only
write fields that are empty, or stop sending `source` on an existing match.

## Upsert no longer overwrites known contacts (2026-08-06)

Shipped `/contacts/search/duplicate` lookup before the upsert. Existing record
wins: only blank fields are filled, `source` is never restated, tags stay
additive. Verified against the live API that the lookup matches `+1...`,
`(212) 390-1416` and bare digits alike — GHL normalises the number, so the guard
holds however a visitor types it.

Note now carries the full submission (business, name, need) on every submission,
since the business name no longer always reaches `companyName`.

### Verified end to end 2026-08-06 04:43 UTC
Dummy submission via the live endpoint using `(727) 555-0134`, a NANP
fiction-reserved number that reaches no one. Result:
- Notification SMS to +1 813 999 0012 — **delivered**
- Notification email "Website contact: Dummy Test Co" — sent
- Contact created with correct name, company, source, tag
- Note written with all three fields

- [x] Deploy and verify (closes the open item from the previous section)

### Left behind
- [x] Dummy contacts `kdHe1eR12kJKJSkcx9DA` and `3dzExx2iCpzpzusPuYWK` deleted
      after the results were confirmed.

## Lead-alert email sender (2026-08-06)

Devon's alert arrived from `talktous@labiffilmhouse.com`. Cause was not the code:
sub-account `xwdd…` has that address as its **business profile email**, and a
send without an explicit sender inherits it.

- [x] Pinned `emailFrom: 'Creatively Grow <letstalk@creativelygrow.com>'` on the
      notification send. Verified on the sent record: `from` now reads
      `Creatively Grow <letstalk@creativelygrow.com>`, provider mailgun.

### Closed
- [x] Sub-account `xwdd…` business profile corrected by Devon in the UI on
      2026-08-06 — now `letstalk@creativelygrow.com` / `Creativelygrow.com`,
      verified via the API. The Labif values were left over from A2P
      verification. Every email this location sends without an explicit sender
      now carries the Creatively Grow brand, not just the lead alert.
      Note for future work: `PUT /locations/{id}` with the location PIT returns
      401 — sub-account profile edits need an agency-scoped token or the UI.

## Editorial redesign from Design — ported 2026-07-29

Handoff bundle (zip was named "Epoxy Marketing Images" but contains the full
creativelygrow.com redesign): three pages, brutalist/editorial, cream ground,
ink type, orange as the only accent. Copy is verbatim from the live site and
the handoff says explicitly not to rewrite it.

Built: `index-editorial.html`, `how-it-works.html`, `brand-films.html`,
`editorial.css`, `editorial.js`. All three noindex until signed off. The live
homepage is untouched — `index-editorial.html` is the staged replacement.

### Video placement (what Devon asked for)
- How It Works step two: the handoff wanted 3 landing-page screenshots. Instead
  the two real client screenshots we already have flank the live
  `portfolio-showcase.mp4`, autoplaying muted in the centre frame. The trio
  assembles into its fan on scroll and lifts on hover.
- Brand Films: all 8 films, featured player swaps on Play.
- Homepage Selected Work: the 3 films embedded directly.

### Worth knowing
- Bunny thumbnails 403 off-domain, which is why the handoff asked for 11 manual
  still exports. They serve fine from creativelygrow.com, so no exports needed.
  Same referrer gate as the gallery MP4 downloads.
- Fixed while porting: an `aspect-ratio` box cannot resolve when its child asks
  for `height:100%`; portrait stills stretched their cards. Frames are now
  positioning contexts with media pinned inside.
- Reveal styles are gated behind `.cg-js` plus a 2.5s timeout backstop, so a
  page whose JS fails is fully visible rather than blank.

### Done 2026-07-29 — the editorial design IS the live homepage
- [x] Contact form wired to `/api/leak-check` (same payload and niche the old
      homepage sent). Verified end to end on production: contact created in
      GHL location xwddXAWgoJtFg4qpBO3u, tagged website-contact, note carrying
      business + name + what-they-do, and the auto-reply SMS fired (rejected
      only because the test number was a 555). Test contacts deleted.
- [x] Guarded against double submit — a disabled button stops a second click
      but not a second submit event, and one lead must not write two notes.
- [x] Old homepage removed rather than left in the tree; a second copy would
      be crawlable and compete. Recoverable from git history.
- [x] All three pages off noindex, canonicals added, sitemap now lists the
      three routes that exist (/our-work and /book were listed and never
      existed).

### Open
- [x] Header nav added (Home / How It Works / Brand Films, current page in
      orange). The handoff had footer-only links, which hid the other pages.
- [x] The two client screenshots in the How It Works fan were never committed,
      so production 404'd them and two of the three frames rendered empty.
- [x] Cutout sprite retimed: 7s with a 30% opening hold and ~280ms per frame
      read as a slideshow. Now 4s, movement starts at 18%, ~96ms per frame.
- [ ] Contact form on the new homepage is still the handoff's non-functional
      divs; wire to `api/leak-check.js` before it goes live
- [ ] Handoff asks for the logo as vector before shipping
- [ ] Landing pages (/epoxy, /pool-cage) still use the old dark styling

## Editorial polish pass — 2026-07-29 (second round)

- [x] Logo links home on all three pages
- [x] Menu lists only pages you are not on. Home → How It Works + Brand Films;
      How It Works → Home + Brand Films; Brand Films → Home + How It Works
- [x] Header given a stacking order; the hero block had been painting over the
      dropdown and swallowing it
- [x] Hero figure capped (was 731px tall, colliding with the header). It was
      never distorted — the box matches the sprite ratio 344/576 exactly — just
      far too large
- [x] Cutout smoothness: cross-fading layers were tried and REVERTED. Blending
      shows two frames at once, which reads as flashing. The hard cut is what
      makes it stop motion. Back to one stepped layer at 4s. Do not try this
      again — if it needs to be smoother, the answer is more frames in the
      sprite sheet, not blending between the ten we have.

### The showcase film's green background — open decision
It was composited on the old site's dark green backdrop with glow and bokeh.
Desaturating it was tried and REVERTED — it looked worse than the old site did.

The thing to understand: on the old site this film was never cut out. The page
was dark green and so was the film's backdrop, so it simply disappeared. That
was camouflage, not transparency, which is why no filter reproduces it on cream.

Options, best first:

1. Re-render from the source project without the backdrop, exported with alpha.
   H.264 MP4 cannot carry alpha, so it ships as WebM/VP9 for Chrome, Firefox
   and Edge plus HEVC-with-alpha MOV for Safari, as two <source> tags.
2. Replace it with a plain screen recording of one site scrolling on white or
   on the cream ground. The frame already sits in a fan of three, so the film's
   own fan of three is redundant anyway.
3. Shoot a third static screenshot and drop the video from this slot entirely,
   matching the two frames beside it.

Rejected: cropping to the centre panel. Tried it — the composition animates and
the green returns at 3 of 4 sample points. Also rejected: browser chroma key.
The backdrop is textured with bokeh and glow, not a flat key colour, so it
would leave halos and eat the dark parts of the screenshots.

## New showcase film + mobile pass — 2026-08-07

The green is solved at the source. Devon regenerated the film on cream, so it
needs no filter and no frame — it sits directly on the paper, the same way the
green one sat on the old dark page.

Two fixes to the delivered file, both baked into `assets/showcase-cream.mp4`:
- Cropped the bottom quarter. The model invented a dark reflective floor that
  would have drawn a black band across the cream. It starts at y=772 in every
  frame, so it cropped cleanly to 960x768.
- Lifted each channel so the generated cream (#f1efdd) lands on the page's
  #f9f8eb. A CSS mask feathers the outer few percent so no rectangle shows.
- 7.2MB -> 0.5MB.

The handoff's fan of three static screenshots is gone from that slot: the film
is already a fan of three, and one inside the other read as clutter.

### Mobile
Real bug found and fixed: the hero figure column aligns children to the bottom,
so a cutout taller than the column did not clip — it climbed 147px up and sat
on top of the primary CTA. Cutouts are now capped per breakpoint with room in
the columns. Verified no horizontal overflow on any page at 375px.

### Tooling note, to save the next session an hour
The in-app browser pane does not run intersection logic when hidden. That means
IntersectionObserver never fires, `loading="lazy"` images never load, video
never advances, and screenshots come back blank or stale. All of it looks like
broken code and is not. Headless Chrome renders correctly — verify there.
Conversely headless at a phone width lays out at desktop width and crops, so
text looks cut off when it is not. Use the pane's JS for measurements, headless
for pictures, and trust neither on its own.

### Open
- [ ] `our-work.html` is an orphan from the old site, still crawlable and still
      referencing the old green `portfolio-showcase.mp4`. Decide: delete, or
      redirect to /brand-films.

## Mobile design built + new film — 2026-08-07 (second)

Built to the Claude Design mobile screenshots:
- [x] Hamburger replaces the centred menu below 900px. Opens a panel under the
      header, closes on link tap, outside tap, or Escape. Burger animates to an X.
- [x] Sticky bottom bar: Call Now plus each page's own primary CTA. Body carries
      matching bottom padding so it never covers the footer.
- [x] Reel stays two-up on phones; one-up made that page endless.
- [x] New showcase film. Same treatment as the last one, since the render again
      carried an invented dark floor — cropped at y=1159, channels lifted to meet
      #f9f8eb, scaled to 1200x960. 387KB.

Found while wiring the bar: the primary CTAs on How It Works and Brand Films
pointed at "/" rather than the form. Both pages' main call to action dropped
people at the top of the homepage with nothing to do. Now /#contact.

### Still open
- [ ] `our-work.html` — orphan from the old site, crawlable, still references the
      old green film. Delete or redirect to /brand-films.
- [ ] Bunny Storage secret key, to finish the studio photo migration
- [ ] /epoxy and /pool-cage still use the old dark styling and now look like a
      different company than the rest of the site

## Condensed mobile homepage — 2026-08-07

New handoff bundle adds mobile prototypes and a CLAUDE.md with an acceptance
checklist. Built the condensed homepage hero from
`Homepage Mobile Condensed.dc.html`, checked against
`reference/homepage-mobile-condensed.png`. All CSS at <=900px on the same DOM,
per the handoff's build order ("Homepage, mobile. Same page. Not a second page").

Done and verified live at 360px:
- Hero is one 500px stage, not a ~1,100px stack. Headline over the orange block
  with a cream glow across the join, figure behind, lede + CTA on a dark
  translucent overlay. h1 exactly 50px per the checklist.
- Chips are one horizontal scroller instead of three wrapped rows.
- Sticky translucent header with blur; hamburger's third bar is the accent; nav
  panel is dark with an orange rule.
- Bottom bar clears `env(safe-area-inset-bottom)`, root reserves 76px, tap
  targets >=44px, `:active` states added since touch has no hover.

### Whole homepage done 2026-08-07
Bands 5-13 are forked: the condensed markup lives in a `.cg-m` block shown only
below 900px, and the desktop bands it replaces carry `.cg-d` and are hidden
there. This was unavoidable - the condensed variant genuinely uses shorter copy.

NOT duplicated: header, nav, hero, chips, bottom bar. Those stay one set of
markup restyled by the mobile rules, so the page still has exactly one h1 and
one header. Verified live: h1 count 1.

The four controls the condensed design uses to shorten the page are wired and
verified on production: crew/AI monthly copy, launch/monthly package lists, the
map expander, and the objections accordion (one row open at a time).

Mobile contact form is real and posts to the same endpoint. The submit handler
is shared by both forms rather than duplicated. Verified end to end: contact
created in GHL with all four fields, then deleted.

**Phone page height: 10,051px -> 5,079px.**

Trap worth remembering: several prototype blocks set `display` inline, which
outranks the `[hidden]` attribute, so collapsed panels rendered open (both
package lists showed at once). `body.cg-ed [hidden] { display: none !important }`
is now in the stylesheet.

### Checklist items still to audit against the new spec
- [ ] Brand Films h1 82px on mobile, How It Works "90" 104px (currently clamped
      to smaller minimums)
- [ ] Second intentional horizontal scroller in the condensed variant
- [ ] Copy diff, character by character, against the reference files
