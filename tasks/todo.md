# Proof-to-Pipeline page + wider niche

## Why
Devon wants a "territory" page that names the method (Proof-to-Pipeline), and says the
site isn't getting hits. Findings 2026-11-06: Vercel Web Analytics is off and no other
tracking tag is on the pages, so traffic isn't measured at all. The sitemap has 6 URLs
and the two blog drafts aren't published. The homepage already says "Tampa Bay
businesses", so the site copy isn't what's keeping traffic away.

## Plan
- [x] **Measure first**: turn on Vercel Web Analytics and add its script to every page, so we can see visits and where they come from.
- [x] **Pick the niche direction**: Devon chose "run-on-calls", meaning any Tampa Bay business where a call or booking is the sale. Medspas stay with Frontdesk.
- [x] **Build the page**: `proof-to-pipeline.html` from the copy in `tasks/proof-to-pipeline.md`, reusing the existing page shell/styles (copy `how-it-works.html` structure), with the shared lead form + /book CTA.
- [x] **Link it**: add it to the nav and `sitemap.xml`.
- [x] **Verify**: run locally, check desktop + mobile, check that the form submits.

## Not changing
- No homepage redesign. Existing pages stay as they are, apart from the nav link.

## Review
- **New page** `proof-to-pipeline.html` (/proof-to-pipeline): hero, the proof + leak problem, the 3-step method (Prove, Capture, Follow up), a "why one team" comparison, our proof (Cornerstone Air + Coca-Cola films), who it's for (home services, health & care, local pros), and a CTA to /book. Built from the How It Works page shell, so it has the same header, footer, contact popup and mobile bar. Copy lives in `tasks/proof-to-pipeline.md`; it makes no claims beyond what the site already says.
- **Nav**: "The Method" added to the dropdown on all 7 pages, and to the footer of the new page.
- **Sitemap**: added /proof-to-pipeline (7 URLs now; the file is still valid XML).
- **Analytics**: added the Vercel Web Analytics script to 10 public pages (the 7 nav pages + book, epoxy, pool-cage). **Devon still has to click Enable** in Vercel > creativelygrow-website > Analytics. Until then the script does nothing.
- **Verified locally**: desktop and 375px mobile (no sideways scroll), no console errors, both videos load, the popup opens from the hero button, and the form sends the right data with a stubbed network call (no real GHL contact created).
- **Not done**: not committed or deployed.

---

# Collect email on every website lead form

## Why
Laura (Practice360) filled out the site form on 2026-11-05 and we had no way to email
her back. Every form posts to `api/leak-check.js`, and none of them ask for an email.
Her message was also cut off because the API trims the message to 160 characters
(`api/leak-check.js:20`).

## Forms in scope (12, all post to /api/leak-check)
- `index.html`: 3 forms (`lf-`, `m-lf-`, `x-lf-`), wired by `editorial.js`
- `services.html`, `brand-films.html`, `how-it-works.html`, `training-videos.html`: 1 each (`x-lf-`), wired by `editorial.js`
- `contact.html`: 4-step form, last step "Where do we reach you?"
- `epoxy.html`, `pool-cage.html`: 2 each (page form + modal), own inline scripts

## Plan
- [x] **API** (`api/leak-check.js`): accept `email`, check it looks like an email, and reject the request if it's missing or invalid. Save it to the GHL contact, but only fill it if the existing contact has no email (same rule as name and company). Add it to the contact note and to the SMS/email notification Devon gets.
- [x] **API**: raise the message limit from 160 to 1000 characters so messages stop getting cut off.
- [x] **editorial.js**: read the new `email` field, include it in the payload, and treat it as required like the other fields.
- [x] **Shared forms** (index ×3, services, brand-films, how-it-works, training-videos): add an Email field (`type="email"`, `autocomplete="email"`) with the same styling as the fields around it, placed next to Mobile number.
- [x] **contact.html**: add Email to the last step beside First name and Mobile, require it in that step's check, show it on the call sheet, and send it. Raise the "Anything else?" limit from 90 to 500 characters.
- [x] **epoxy.html / pool-cage.html**: add Email to both forms on each page and send it.
- [x] **Verify**: run the site locally, submit each form type with a missing or invalid email (it should be blocked) and a valid one (it should go through), and confirm a test contact in GHL has the email and full message. Delete the test contact after.

## Not changing
- Phone stays required (the instant text-back depends on it).
- No redesign of the forms, just one more field.

## Review
- **API** now requires a valid email (400 without one), lowercases it, saves it on the GHL contact (fills only if blank on a known contact), and adds it to the contact note and to Devon's SMS + email alert. Message limit is 1000 characters (was 160).
- **12 forms** have a required Email field: index ×3, services, brand-films, how-it-works, training-videos (all through `editorial.js`), contact.html (4-step form, plus an Email line on the call sheet), epoxy ×2, pool-cage ×2 (built-in browser validation).
- `editorial.js` cache version bumped v8 → v9 on all 6 pages so no browser keeps the old script that sends no email.
- Contact page "Anything else?" limit raised from 90 to 500.
- **Verified:** API tested against a fake GHL (missing and bad emails rejected; a valid email is saved, and the full 182-character Laura message came through without being cut). Every form tested in the browser with the network call intercepted: missing and bad emails blocked, valid ones sent with `email` in the payload. No live GHL test contact was created, so there was nothing to delete.
- **Not done:** not committed or deployed. The API and the pages must go live together.

---

# Training Videos page — creativelygrow.com/training-videos

## Why
Devon has done internal training video for two companies (one closed, Coke Florida
BD&L series in progress) and wants a place for referrals and LinkedIn posts to
land. Not an ad campaign. A page plus a referral loop, kept as a service line
under Creatively Grow, not the headline.

## What the page has to do
1. Say plainly what it is: on-site training / SOP / onboarding video for companies.
2. Show proof: the Coke Florida "Every Case Counts" series (6 videos, 3 sites).
3. Give a fixed-scope offer so a referral knows roughly what it costs.
4. Send people into the existing contact form (modal → `api/leak-check.js` → GHL).

## Build (static site, same pattern as `brand-films.html`)

### 1. New page `training-videos.html`
Clone the shell of `brand-films.html` (head, header, nav, footer, contact modal,
`editorial.css` / `editorial.js`). Sections, top to bottom:
- **Hero** — eyebrow "Training Videos", H1 "Training your team / actually watches",
  one-line sub: shot on site, with your people, for onboarding, SOPs and safety.
  Orange panel: "06 videos · Coke Florida" counter (same device as the reel page).
- **Spine band / featured video** — one embedded sample. Until the BD&L series
  is cleared, use the Coca-Cola Brand Story that is already public on the reel.
- **Who it's for** — three short blocks: new-hire onboarding, SOP / process
  demos, safety and compliance. Plain language, no jargon.
- **What you get** — priced two ways, shown side by side:
  - **Shoot day: $1,500** — one day on site with your people, as many
    topics as we can get through.
  - **Edit: $400 per video** — cut, lower thirds, intro graphic, one round
    of client/legal revisions, delivered in whatever format the LMS or
    intranet needs.
  - **Ten-video bundle: $3,500 in editing** (saves $500) — for a series.
    Shoot days billed at the day rate on top.
  Worked example on the page: "A six-video series shot over three days:
  3 x $1,500 + 6 x $400 = $6,900."
- **How it works** — 4 steps: 30-min brief → shoot day(s) on site → cut +
  graphics → approvals and delivery. Mirror `how-it-works` tone.
- **Case study: Coke Florida, Every Case Counts** — the problem (BD&L loss),
  the ask (6 host-led videos for front-line associates across Tampa, Winter
  Haven, Orlando), what we did. **Gated on written permission from Coke Florida
  Legal to name them and show clips.** Ship the page with the case study
  block written but hidden until that clears.
- **FAQ** — 5 questions: do we need a script, can our own people be on
  camera, how long does it take, what if a process changes later
  (re-shoot / update pricing), who owns the footage.
- **CTA band** — "Need one video or a whole series?" → opens the contact
  modal. Modal copy on this page only changed to "Tell us what your team
  needs to learn." and the third field placeholder to "e.g. forklift
  onboarding, 3 videos".
- Footer identical to other pages.

### 2. Link it
- Nav dropdown on `index.html`, `services.html`, `how-it-works.html`,
  `brand-films.html`: add "Training Videos".
- Footers on the same four pages: add the link.
- `services.html`: one sentence + link inside the existing `#video-content`
  block ("Also: internal training video for teams →"). No new section.
- `sitemap.xml`: add the URL, priority 0.8.
- `vercel.json`: nothing needed, `cleanUrls` already maps `/training-videos`.

### 3. Verify
- Preview locally, check desktop + mobile (hero clamp sizes, cols4 grid,
  burger nav, modal open/submit path).
- Confirm the form submission still hits `api/leak-check.js` with the new
  placeholder text and lands in GHL (Labif sub-account) as before.
- Check `/training-videos` resolves on the Vercel preview before merging.

## Not in scope
- No ad spend, no new campaign, no new landing-page funnel.
- No changes to `api/leak-check.js` or GHL workflows.
- No case-study clips until Coke Florida clears them (BD&L due 9/11/26).

## Devon's calls before build
- [ ] OK to write the Coke case study now and hide it until Legal clears?
- [ ] Featured video: Coca-Cola Brand Story as stand-in until then?

## Todo
- [x] Create `training-videos.html` from the brand-films shell
- [x] Write copy for hero, who-it's-for, pricing, process, case study, FAQ
- [x] Modal copy override on this page
- [x] Add nav + footer links on 4 pages
- [x] Services page one-liner (desktop and mobile blocks)
- [x] Sitemap entry
- [x] Local preview check, desktop + mobile
- [x] Form submit path check
- [x] Review section below

## Pending Devon
- [ ] **Swap the sample video** to an Every Case Counts cut once Coke Florida
  confirms it can be used publicly. Holding the public Coca-Cola Brand Story
  in that slot until then. One iframe `src` in `training-videos.html`.
- [ ] **Unhide the Coke case study block** once Legal gives written permission
  to name them. Remove the `hidden` attribute on the commented block.

## Review

### What was built
`training-videos.html`, a new static page at `/training-videos`, cloned from the
`brand-films.html` shell so it inherits the header, nav, footer, contact modal,
`editorial.css` and `editorial.js` without any new CSS or JS.

Sections: hero with the day rate in the orange panel, one sample video, three
"what we shoot" blocks (onboarding, SOP demos, safety), a pricing band, a
four-step process, a hidden Coke case study, five FAQs, and a closing CTA.

### Pricing as shown
| Line item | Price |
|---|---|
| Shoot day | $1,500 |
| Per finished video | $400 |
| Ten-video bundle | $3,500 |

A worked example sits under the cards: a six-video series over three days is
3 x $1,500 + 6 x $400 = $6,900. That is deliberately close to what Coke paid.

### Links added
Nav dropdown and footer on `index.html`, `services.html`, `how-it-works.html`
and `brand-films.html`. A cross-link inside the video block on `services.html`,
in both the desktop and the mobile copy of that section. Footer link rows got
`flex-wrap:wrap` so the fifth link does not overflow. Sitemap entry at 0.8.

### Verified
- Renders correctly at 1440px and at 390px, no horizontal overflow at either.
- Contact modal opens from every CTA and posts to `/api/leak-check` with
  `business`, `firstName`, `trade`, `phone`, `niche:"contact"` — identical to
  every other page. Checked with `fetch` stubbed, so no test lead reached GHL.
- No console errors on the new page or on `services.html`.
- Tag balance clean on all four touched pages plus the new one.

### Fixed during the build
- Hero headline was breaking to five lines and pushing the CTA below the fold.
  Measured the real text width and set the clamp so it lands on two lines.
- The sample player rendered as a black rectangle because the embed had
  `preload=false`. Switched to `preload=true` so the poster frame shows.
- Pricing and "what we shoot" cards were on `cg-cols4`, which forces two
  columns under 900px and squeezed the text. Moved them to `cg-cols`, which
  collapses to a single column.

### Noted, not touched
`index.html` has an unbalanced `<form>` tag. It predates this work (present at
HEAD) and is out of scope here.

---

# Coke Florida Way — Gainesville edit (2026-11-01)

## Brief
- Script: "The Coke Florida Way — Five Standards. Every Visit. Every Time." Leadership talk track: Opening → 1 Reflect Our Values → 2 Own the Outlet → 3 Maximize Availability → 4 Build Baskets → 5 Winning CDE → Closing.
- Client is sending the footage they shot in the morning: **Opening + Reflect Our Values**. We shot the rest.
- **Family Dollar** = one take covering everything combined → cut last.
- Footage: `/Volumes/NEXTODI_00/Coke Gainesville/` (Walmart 81 clips, Big Mills 43, Family Dollar 33, Interview with John 3). FCP library: `/Volumes/GamerKing  1/Coke Gainesville Edit/Coke Gainsville 26.fcpbundle`.

## What's a mess right now (found)
- FCP has 3 loose events: "Coke Gainsville Walmart", "Coke Gainsville picked clips", "Coke Gainsville synced" (holds "Walmart 2, part 2…12", which says nothing about the content).
- Weddit library has 2 overlapping Walmart syncs ("Walmart" and "Walmart 2"); Big Mills, Family Dollar and John aren't synced in it.
- 132 stray clip entries at the top of the Weddit library (left over from the folder rename), counted twice next to the real ones.
- The project is still set to **Wedding**, so the commercial tools (Label shots, Soundbite spine) are hidden.
- No transcripts, so nobody can tell which recorder take covers which standard.
- Weddit's old exports all pass Apple's DTD and do import, so the trouble is the layout, not broken files.

## Plan
- [ ] 1. Back up the Weddit library, then clean it up: drop the 132 stray entries, keep one Walmart sync (delete the old "Walmart"), set the project to Commercial.
- [ ] 2. Sync Big Mills, Family Dollar and Interview with John (with the fixed sync engine).
- [ ] 3. Transcribe the recorder takes **locally** (whisper.cpp, free, nothing uploaded since Legal is in the chain).
- [ ] 4. Use the transcripts to match every take to a script section; tag each clip with its section, plus Location and Interview / B-roll.
- [ ] 5. Build one clean FCP event, "Coke Florida Way", with keyword collections per section (01 Opening … 07 Closing, Family Dollar – Combined) and synced clips named like "Own the Outlet – Walmart take 3", not "part 6".
- [ ] 6. Rough-cut project in script order, with marked gaps for Opening + Reflect Our Values until the client's footage arrives; Family Dollar goes last.
- [ ] 7. Validate against Apple's DTD and import into a NEW library, leaving the current one alone. Devon removes the old events only when he's happy with the new one.

## Pending Devon
- What exactly goes wrong when you send to Final Cut (error message, missing audio, wrong clips)?
- Who's on camera delivering the talk track (John? another leader)?

## Review (2026-11-01)
- Footage copied NEXTODI_00 → `GamerKing 1/Coke Gainesville Edit/Footage/` (NEXTODI read at 39 MB/s = USB 2 speed; GamerKing 892 MB/s). 477 files / 90 GB verified byte-for-byte. NEXTODI left as backup. Devon added DJI_0978.MOV (drone, 5K 50p) to Big Mills afterwards.
- Weddit library cleanup (plan steps 1–2) deferred — Devon: "worry about the app later". Weddit's own exports were DTD-valid; the stalled import was Final Cut's "Which library?" dialog opening off-screen.
- 33 recorder takes transcribed locally (whisper.cpp) → `tasks/coke-gainesville/transcripts/`; takes mapped to sections in `tasks/coke-gainesville/section-map.md`.
- Synced with Weddit's engine run from the command line on the GamerKing copy: 68 camera clips married to recorder takes; 60 b-roll clips.
- `scripts/build_fcpxml.py` → event **Coke Florida Way** imported into the existing Coke Gainsville 26 library (Final Cut ignored the new-library location). Keyword folders: Script sections (0 Opening … 7 Family Dollar – Combined), B-roll by location, Locations. Projects: "00 Assembly – script order" + 7 stringouts. Drone imported separately (keyword "Drone").
- Loose collections at the event top level from the drone import: Drone, Big Mills, B-roll · Big Mills, Interview · John — cosmetic.
- Waiting on: client's Opening + Reflect Our Values footage.
- Devon moved A7S30930/0931 Big Mills → Family Dollar. Re-synced Family Dollar: both sync to the 14:42 walk take (margins 39 / 34). Imported as 2 synced clips + "00 Assembly – script order (updated)" and "Stringout · 7 Family Dollar – Combined (updated)". Old Big Mills copies of both clips and the two superseded projects moved to Final Cut trash (Devon OK).
- Old events Coke Gainsville Walmart / picked clips / synced moved to Final Cut trash (Devon asked; all were symlinks only, no unique media). Loose duplicate keyword collections deleted, Drone → B-roll, Interview · John → Locations. Coke Gainsville 26 now holds only the Coke Florida Way event.
- Library renamed Coke Gainsville 26 → Coke Florida Way (closed in FCP, bundle renamed, reopened; same library ID).
- Folder renamed GamerKing 1/Coke Gainesville Edit → GamerKing 1/Coke Florida Way (library closed first; 96 Final Cut media links repointed, 0 broken; reopened fine). Script paths in tasks/coke-gainesville/ (sync jobs, fcpxml) still name the old folder — regenerate with the new path if rebuilding.
- Suno prompts: tasks/coke-gainesville/music-prompt.md (108 BPM rally bed + "I do" closing button; Legal clearance flagged).
- First cut "Coke Florida Way – first cut" imported (4:55, 19 bites + 2 client placeholders). Picks: cut/picks.json, edl: cut/edl.json, report: cut/report.txt, preview: cut/…PREVIEW.mp4. Every bite sync-checked against the camera mic (≤62 ms). Family Dollar left out (client: cut it last).
- Gaps: woman's best Walmart availability take (09:32) was never filmed ("we didn't press record"); used the man's full take 09:21 (camera missed "Hi Coke Florida Champions"). GOAT tag line dropped (camera stops before "way"). Big Mills A-frame ends at "A-frame" (camera cut during "napkins").
- 2026-11-02: "B-roll – all clips" project (57 clips, 17.2 min, chapter per location). FX3A-0463 = the woman's 09:32 availability take — it WAS filmed (camera +2.43 s into the take, z=6.9, frames confirm); added to Walmart sync by hand (backup: sync/Walmart.events.before-0463.jsonl).
- Cut v2 (10.3 min, 34 bites) replaces the first cut: Family Dollar worked into every section (Devon: don't hold it), both FD lavs under FD bites, her take cut per the on-set producer (intro → "priced, full, rotated" → "that's the Coke Florida way"), GOAT tag from the 10:29 retake. A-frame: every take loses camera on "A-frame"/"napkins"; kept the one that finishes on camera. Placeholders now 240 frames (fixed FCP "not on an edit frame boundary" warning).
- Cut v3 "Coke Florida Way – cut v3" (4:26): 21 bites + 7 Basic Title cards (Coke red headline / white key message from the script) + 2 client placeholders. Edges refined by short-window re-transcription + silence trim (scripts/refine_edges.py), every bite's audio re-transcribed to confirm no stray words; all 21 bites sync-checked ≤80 ms; DTW word timing tried, no change. v2 kept in the event for comparison. edl_v2.json saved.
- 2026-11-03 client clips (C0191, C0194, C0197, C0198 + zip "5. Winning CDE-selected" = C0197/C0198) → `Footage/Client – Walmart AM/` (originals untouched). Camera mic audio present. Rec.709 with a strong blue-green cast (R 20–60% low) → ProRes 422 HQ copies in `corrected/*_wb80.mov` at 80% of per-clip gains solved on neutral surfaces, applied in linear light (scripts/correct_client.sh). Cut v4 (5:04): C0191 → Reflect Our Values (full speech 2.3–28.0 s), C0194 → Own the Outlet ("Outlet's doing great… up 18%… 11% up in cases", 40.2–49.3 s; rest of that clip's audio too mumbled to cut), C0197 → Winning CDE (0.6–27.2 s). Only the client's Opening placeholder remains. Not in batch: Opening. Client clips are Rec.709 vs our unlogged FX3/A7S — final grade must unify.
- 2026-11-03: DELIVERABLE CORRECTION — PO 4001327266 (Footage/4001327266.pdf) bills 'Video Editing — 5 × 60-Second Shorts @ $400'; client zip is numbered '5. Winning CDE'. Cut v2–v4 assumed ONE film; likely should be five ~60 s shorts (one per standard). Awaiting Devon: vertical vs 16:9, and Opening/Closing placement.
- 2026-11-03 FIVE SHORTS built and imported (16:9 only — Devon: one format, "not 9:16 and 16:9" = don't make both): Short 1 Reflect Our Values 38.5 s · Short 2 Own the Outlet 56.1 s · Short 3 Maximize Availability 52.1 s · Short 4 Build Baskets 53.3 s · Short 5 Winning CDE 55.9 s (client C0197 + FD coolers + "I do" button, no end card). Each = 3 s title card + bites (+ 3 s end card, except #5). New builder mode: edl items with "short" key (cut/edl_shorts.json; scripts/build_cut.py). All 15 recorder-synced bites ≤80 ms; no FCP import warnings. New doc "Standards Scripts" = 25-script outline for a whole series (90–120 s each, 25 videos incl. foodservice) — NOT what the PO covers (5 × 60 s); title lines on the shorts borrow its wording (A/B/C framework). cut v2/v3/v4 still in the event. Unused: Opening bites, FD Q&A, Walmart "best position", Big Mills availability/bundling/A-frame.


---

# Studio: client logo on each gallery (Frame.io-style project tile)

## Why
In `/studio` the gallery list is plain text rows. Devon wants to set a logo or
picture per gallery so the client is recognizable at a glance, the way Frame.io
shows a project tile.

## Approach (reuses the poster-upload path, no new infrastructure)
Logo is stored exactly like a video poster: uploaded straight to storage under
`thumbs/` via the existing `photo-upload-init` (kind `thumb`), then its path is
saved on the gallery row. No new upload code on the server.

## Todo
- [x] 1. `studio-schema.sql`: add `alter table galleries add column if not exists logo_path text;`
      (Devon runs this once in the Supabase SQL editor; code must tolerate the column missing until then.)
- [x] 2. `api/studio.js`:
      - `list`: include `logo_path` in the select.
      - new action `set-logo` (POST `{ galleryId, path }`): saves `logo_path` (null clears it).
      - `view` (public): also return `logoPath` + `photoBase` so the client page can show it (step 5).
- [x] 3. `studio.js` list rows: show the logo as a square tile on the left of each row,
      falling back to the client's initial in a neutral circle when none is set.
- [x] 4. `studio.js` / `studio.html` gallery detail: a "Logo" tile beside the name with
      "Add logo" / "Change" / "Remove", using the same upload helper the thumbnail modal uses.
- [x] 5. (Confirmed by Devon) Show the same logo at the top of the client-facing page `/s?c=...`.
- [x] 6. `studio.css`: tile styles (rows + detail header), bump `?v=` on css/js so the cache refreshes.
- [x] 7. Verified list tiles, initial fallback, and Remove against a mocked API. NOT yet exercised against the real backend: a real file upload, and the client page.

## Out of scope (unless Devon says otherwise)
Frame.io's review features: timestamped comments, approvals, versioning.

## Review
- Logo path is stored in `galleries.logo_path`; `logoPaths()` in `api/studio.js` and a
  best-effort query in `api/share.js` read it separately, so a database without the
  column still serves every gallery (logo just stays blank).
- `set-logo` is the only new API action; uploads reuse `photo-upload-init` kind `thumb`.
- Studio list rows show a 52px tile (logo or client initial); gallery detail has
  Add / Change / Remove. Client page (`/s`, `/v`) shows the logo above the heading.
- Cache-busting: `studio.css` v11, `studio.js` v10, `share.js` v2.
- Not done: removing or replacing a logo leaves the old file in storage (same as video
  posters today). Not committed or deployed.
- **Before deploy:** run `alter table galleries add column if not exists logo_path text;` in Supabase.
- 2026-11-05: Devon: remove the Family Dollar 'Hey Brian… how are you' greeting from Short 1. Done (Short 1 now 31.7 s: title + C0191 values speech + end card). Imported as 'Short 1 – Reflect Our Values (no greeting)'; the old Short 1 is still in the event (couldn't safely delete it while FCP was frontmost) — delete it and rename the new one. Devon on Short 2 (Walmart→Family Dollar): fine as is.


---

# Contact page — creativelygrow.com/contact

## Why
There is no `/contact` URL. Today "contact" is a modal plus an in-page `#contact`
band on each page, both posting to `/api/leak-check`. Nothing to link, index, or
put in an email signature. Devon wants it to be interactive, not a plain form.

## Concept: "The Call Sheet"
A film call sheet that fills itself in as the visitor answers, one question at a
time. On brand for a video company, and it is still just four fields underneath.

Left: one question per step, big Oswald type, tap-to-answer chips.
Right: a paper call-sheet card that types each answer into its line as they go.

1. **What are we making?** chips: Brand film · Training video · Reels / content · Lead system · Not sure yet
2. **Who is it for?** business name (text)
3. **When do you need it?** chips: This month · Next 1–2 months · Just exploring (plus an optional one-line note)
4. **Where do we reach you?** first name + mobile
5. Submit → the clapperboard snaps shut ("SCENE 01 · TAKE 01 · GOT IT"), then
   "Watch your texts." Same promise the auto-reply SMS already makes.

Also on the page, no form needed: tap to text/call (727) 270-8422, Book a
Strategy Call (`/book`), and email letstalk@creativelygrow.com.

## Plan
- [ ] 1. `contact.html` — clone the shell of `brand-films.html` (head, header, nav, footer, mobile bar). Page-specific CSS in one `<style>` block, step logic in one small inline script. Reuses `editorial.css` / `editorial.js` unchanged.
- [ ] 2. Wire submit to the existing `POST /api/leak-check` with `niche: "contact"`. Chip answers + note are folded into the existing `trade` field ("Brand film · This month · note"), so the GHL note and Devon's SMS/email alert carry them. **No change to `api/leak-check.js`.**
- [ ] 3. Mobile: call sheet collapses to a compact strip above the question, big tap targets, no horizontal scroll. Respect `prefers-reduced-motion` (skip the typing and clapper animation). Keyboard: Enter advances, Back works, labels and focus states kept.
- [ ] 4. Discoverability: add `/contact` to `sitemap.xml`, canonical + `ContactPage` JSON-LD, and (if approved) a "Contact" link in the nav dropdown on the pages that have it.
- [ ] 5. Verify locally in the preview: desktop + mobile screenshots, walk the flow, confirm the POST body. Real submissions NOT sent during testing (would text Devon and the tester) unless approved.

## Open questions
- Add "Contact" to the nav on every page, or only ship the page for now?
- OK to do one real test submission to Devon's own number at the end?

## Review
Built 2026-11-06.
- New `contact.html` (call sheet, 4 steps, clapper success, text/call/book tiles). Self-contained CSS/JS; reuses `editorial.css`/`editorial.js` unchanged.
- Posts to existing `/api/leak-check` with `niche:"contact"`; chips + note folded into `trade`. `api/leak-check.js` untouched.
- "Contact" added to nav dropdown on index, how-it-works, services, brand-films, training-videos; `/contact` added to `sitemap.xml`.
- Verified in preview with fetch mocked: step flow, phone formatting, payload, success state, mobile 375px (no horizontal scroll). No real submission sent.
- Deviations: call sheet sits BELOW the question on mobile (keeps the question above the fold); no email shown (not published anywhere on the site today).
- Not done: local python server has no cleanUrls, so test at `/contact.html`; `/contact` resolves on Vercel via `cleanUrls`. Nothing committed or deployed.
