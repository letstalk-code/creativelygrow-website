# Open Door Sites: 7 looks, one engine (approved + built, 2026-11-26)

## Goal
Every $150 site looks different (the client picks 1 of 7 looks) but works exactly the same
underneath: same pages, same lead form, same GHL hookup, same SEO. A new site should take
under an hour: fill one client file, pick a look, build, deploy.

## The client flow (Devon, 2026-11-26)
Meta lead form (name, phone, business) → GHL texts them → they pay $150 → THEN they pick
1 of the 7 looks and send their details. Picking happens after payment, not before.

## What exists today
- Picker: creativelygrow.com/website-start shows 14 sample looks (cg-sample-*.vercel.app),
  but it puts the pick BEFORE payment. website-details.html (after payment) has no picker,
  only a hidden `template` field.
- Sources: ~/Desktop2/site-templates/ — mixed stacks. 9 are single-page static HTML,
  3 are Next.js (3 different versions), 2 are multi-page HTML. No shared mechanics: each
  has its own form, header, footer and copy. That's the thing to fix.
- Intake: website-details.html already asks for business name, phone, email, services,
  service area, hours, differentiator, logo, photos, domain.

## The 7 looks (proposed, swap any)
| # | Look | Fits | From sample |
|---|---|---|---|
| 1 | Strong & Direct | electricians, plumbers, contractors | voltway |
| 2 | Cool & Urgent | HVAC, repair, emergency service | gulfair |
| 3 | Fresh & Bold | lawn, landscaping, cleaning | greenline |
| 4 | Dark & Industrial | trucking, hauling, auto, roofing | ironcoast |
| 5 | Classic & Trusted | lawyers, accountants, advisors | harborpoint |
| 6 | Soft & Friendly | dentists, clinics, medspa, salon | azalea |
| 7 | Bright & Friendly | pets, family services, fitness | happytails |
Dropped from the picker: gulfline, bayside, northgate, lumiere, sudsscruff, rooted,
brightpath (kept on disk; can come back as a $699 custom starting point).

## How it works (the mechanics, identical for every look)
One small build script, no framework: `site-engine/build.js client.json` writes a plain
static site to `out/`. A look is only a CSS file + fonts + a hero variant, so all 7 share
the same HTML sections.

Pages every site gets:
- Home, one page per service, one page per city served, About, Contact, Thank-you, Privacy
  (privacy is needed for A2P texting).

On every page:
- Sticky tap-to-call bar on mobile, phone in the header.
- One lead form (name, phone, what they need) → shared endpoint `api/site-lead.js` on
  creativelygrow.com → GHL contact tagged `site-lead` + `site:<slug>`, then a text alert to
  the business owner and to Devon. Same code for every client, so one fix fixes all.
- Real Google reviews pasted from intake (never invented) + "Leave us a review" GBP link.

SEO built in:
- LocalBusiness schema, sitemap.xml, robots.txt, titles/meta per page, one H1 per page
  ("<Service> in <City>"), name/address/phone identical everywhere, fast load (no JS framework).

Writing rules baked into the content step (from the video, plus ours):
- Confirmed facts from intake only. Missing info gets left out, not made up.
- No em dashes, no "marketing", plain words, no fake reviews or results.

Hosting: one Vercel project per client (`cg-site-<slug>`), commit author letstalk-code,
client's own domain pointed at it.

## Todo
- [x] 1. Build `site-engine/` (build.js, shared section templates, client.json example)
- [x] 2. Turn the 7 chosen samples into 7 look files (CSS + fonts + hero variant)
- [x] 3. Add `api/site-lead.js` (GHL upsert + tags + owner/Devon text), reuse website-start.js patterns
- [x] 4. Add the missing intake fields to website-details.html: list of cities, years in
       business, license/insurance, Google review link, 3-5 reviews to show
- [x] 5. Rebuild the 7 cg-sample sites from the engine so the samples are real proof it works
- [x] 6. Move the picker after payment: website-details.html (the page the client lands on
       after paying) shows the 7 looks first, then the details form. website-start.html
       becomes just the pay step (or the GHL text links straight to Square). Trim
       api/website-start.js to the 7 look keys.
- [x] 7. Test: build one fake client in each look, submit the form, confirm the GHL contact
       and text arrive, check mobile and page speed
- [x] 8. Write a one-page "new client checklist" (intake → client.json → build → deploy → domain)

## Open questions
- Lead alert to the owner: text only, or text + email?
- Should $150 clients get their own GHL sub-account later (upsell to Never Miss a Customer),
  with leads moved there?

## Review (2026-11-26)
Built in `~/Desktop2/open-door-sites/` (new folder, own git repo, nothing committed yet).
- **Engine:** `node build.js <slug>` turns `clients/<slug>/client.json` into a static site:
  home, a page per service, a page per city, about, contact, thank-you, privacy, plus sitemap,
  robots and LocalBusiness schema. No framework, so pages are fast. It refuses to build if the
  copy has an em dash, says "marketing", or misses a required field.
- **7 looks:** one shared stylesheet + 7 small look files. Overlay hero (Strong & Direct,
  Cool & Urgent, Fresh & Bold, Dark & Industrial) or split hero (Classic & Trusted,
  Soft & Friendly, Bright & Friendly).
- **Samples:** all 7 rebuilt from the engine and redeployed to cg-sample-<look>.vercel.app
  (live, checked). They carry a "Sample website" banner, noindex, and a placeholder review
  spot instead of made-up reviews. The other 7 old samples are untouched on Vercel.
- **Leads (`api/site-lead.js`):** one endpoint for every client site. Texts the owner, logs a
  note on the owner's GHL contact, copies Devon. Changed from the plan: leads are NOT created as
  GHL contacts, because this location's published "New Lead Nurture" / website workflows could
  text a client's customer as if they were a Creatively Grow lead.
- **Flow:** /website-start is now pay-first (shows the 7 looks as a preview, then Square).
  /website-details (after payment) has the required 7-look picker plus new fields: years,
  license/insurance, Google reviews link, reviews to show. It also accepts ?n=&p=&e=&c= from
  the GHL text link. Fixed: the "1. Pay" step pill was hidden by an unrelated `.done` rule.
- **Tests:** API handlers run against mocked GHL (sample, bad phone, unknown site, bot, real
  site, pick without look, details without look, old look key). Sample form submits and lands on
  /thank-you/; 15 internal links, 0 broken; no JS errors; desktop + mobile screenshots checked.
- **Not done yet:** creativelygrow.com changes (start/details pages, new thumbnails, both APIs)
  are not committed or deployed, so the live sample forms show "please call us" until
  `api/site-lead` is live. The GHL "Website $150 - send pick-a-look link" workflow text was not
  checked; it should link to /website-start.
- New client steps: `~/Desktop2/open-door-sites/README.md`.

# Tampa page + Meta posts (plan for approval, 2026-11-26)

## Why
creativelygrow.com never uses the word "marketing" (0 times on the homepage), so Google has
nothing to rank for "marketing agency Tampa". Blogs target national topics and can't fix that.
Meta is showing good signals, and we already have 20 blog posts to turn into posts.

## Part 1: Tampa page (`/tampa-marketing-agency`)
- [x] 1. Build `tampa-marketing-agency.html` from the existing page template (same header/footer/fonts).
  - Title: "Marketing Agency in Tampa Bay · Creatively Grow". H1 and copy use the words people search
    ("marketing agency", "Tampa", "Tampa Bay"). SEO exception to the no-"marketing" rule, like the blog.
  - Sections: what we do (brand, website, Google, ads, customer follow-up), how it works, areas served
    (Tampa, St. Pete, Clearwater, Brandon, Wesley Chapel, Pinellas/Pasco/Hillsborough), links to
    4–6 relevant blog posts, short FAQ, book-a-call button.
  - No prices, no number promises, no fake address. Schema: ProfessionalService, areaServed Tampa Bay.
- [x] 2. Add it to `sitemap.xml` and link it from the site footer (so Google finds it).
- [x] 3. Check it in the browser (desktop + mobile), then commit as letstalk-code and push.
- [ ] 4. You: in Google Business Profile, set the primary category to "Marketing agency" if it isn't already.

**Part 1 review (2026-11-26):** live at creativelygrow.com/tampa-marketing-agency (commit a0268ccf). Linked from the footer on 6 pages + sitemap. Checked desktop + mobile, 6 blog links all 200. Contact-modal/booking reused from the template. Kept the template's mobile grid as-is (stacked cells keep their side padding, same as /creative-director).

## Part 2: Meta posts through GHL (Creatively Grow sub-account `xwdd…`)
Connected and active: Creatively Grow Facebook page + creativelygrow Instagram.
(YouTube connection expired 2026-11-03; needs a reconnect in GHL if you want it.)
- [x] 5. Write one post per blog post (20 total), in the creative director voice (no "marketing",
  "agency", "leads"). Facebook gets the blog link; Instagram says "link in bio".
  Images: reuse each blog's own images (no paid generation).
- [x] 6. Show you the first 3 captions + images for approval before anything goes into GHL.
- [x] 7. After approval: upload images to GHL media and **schedule** (not post now) all 20 for
  FB + IG, 3 a week (Mon/Wed/Fri, ~11am ET) starting Mon Dec 1 → runs through mid-January.
- [x] 8. Confirm every post shows as scheduled in GHL and list the calendar here.

**Part 2 review (2026-11-26):** 25 blog posts (not 20; 5 more were published) → 50 scheduled posts
(FB + IG each), Mon/Wed/Fri 11:00 AM ET, Dec 1 2026 → Jan 26 2027. Devon approved posts 1–3 as written.
Captions + order in `tasks/meta-posts/posts.py`; GHL post IDs in `tasks/meta-posts/schedule.json`;
JPGs in `tasks/meta-posts/img/`. Verified via API: 50 scheduled, 1 FB + 1 IG per date, all with an image.
Note: GHL's API labels every API-created post `platform: google`, but each targets only the FB page or
IG account. Confirm Dec 1's post actually lands on Facebook/Instagram.

---

# Morning summary — overnight work (2026-11-26)

Nothing was published, sent, or contacted overnight. Three things are ready for you:

1. **Maps without a partner** → `tasks/maps-options-no-partner.md`
   - As a referral site, Google Business Profile, Yelp, Apple Maps, Local Services Ads and Thumbtack
     are all off-limits (they ban lead generators / referral services by name or in effect).
   - **Skip today's Google verification** as "Dunedin Polyaspartic" — it would likely be rejected or suspended.
   - Allowed now: the SEO pages, a Facebook page, Nextdoor (probably), and paid ads.
   - The only legit GBP path: you become the actual company that sells the job and stands behind it
     (LLC, subcontracted insured installers, your phone, a real base). That's ONE profile, not three.
   - Licensing looks light (no state license for flooring/painting, locals barred from licensing them),
     but epoxy isn't named — call to confirm, incl. Pinellas licensing board 727-582-3100.
2. **Partner shortlist (for later, nobody contacted)** → `tasks/epoxy-partner-shortlist.md`
   Top 5: Suncoast Floor Coatings (Seminole), Ideal Garages (Dunedin), Pirate Cove Epoxy (Largo),
   New Millennium Flooring (Largo), Coconut Coatings (St. Pete). Also flags competitor lead-gen sites.
3. **7 new pages — LIVE 2026-11-26** (Devon approved; linked from More Guides / service-area city
   names, sitemaps now 16/14/12 URLs, all 42 pages link-checked, committed as letstalk-code, all 200 live):
   - Largo: why-garage-floor-epoxy-peels, garage-floor-epoxy-vs-polyaspartic
   - Pinellas: city pages for Tarpon Springs, Safety Harbor, Gulfport
   - Dunedin: polyaspartic-over-existing-epoxy, polyaspartic-garage-floor-problems
   Checked: no prices/reviews/brand claims, no "we install", no email. Not yet viewed in a browser.

---

# Epoxy lead sites: get the leads to Devon (plan for approval, 2026-11-25)

## What's true right now (checked 2026-11-25)
- All 3 sites are live and indexed on Google.
- Rankings: dunedinpolyaspartic.com is #1 for "polyaspartic garage floor dunedin". Largo and
  Pinellas are not in the top 9 for their main searches.
- The contact forms DO work: each saves the lead into its own GHL sub-account (Pinellas
  `GYRH32ChmJmRvUl4L1mL`, Largo `6d6ycbULEOHNNgK9BNFZ`, Dunedin `gvfRnSFmIrjInKNibSzI`), tested 2026-08-31.
- CORRECTION after step 1: the email alert DOES work. Each sub-account has a "Devon Notify" contact,
  and alerts arrive at letstalk@creativelygrow.com from letstalk@msg.msgsndrdeliver.com with subject
  "Rank-rent lead (...)". The real gap: email only, easy to miss; no text alert.

## Step 1 result (2026-11-25)
- Pinellas: no real leads (only the old test + Devon Notify).
- Largo: no real leads (only the old test + Devon Notify).
- **Dunedin: 1 real lead.** Alison Starkenburg, (954) 547-3173, 2026-10-21 10:47 AM. "3 car garage
  (one double door and one single door), currently has a painted concrete surface I believe. Zip
  code is 34698." Alert email reached Devon's inbox. Follow-up status unknown.
- No phone number on any site (a tracked number costs money monthly; skipped for now).

## Plan
- [x] **1. Checked the 3 sub-accounts for unseen leads — done 2026-11-25** (see Step 1 result above).
- [x] **2. Lead alert in each sub-account — done 2026-11-25, as push not text.** Sub-accounts have no
  phone number (texts would need a paid number + A2P), so: added letstalk@creativelygrow.com (agency
  owner) to Dunedin, Largo and Pinellas via Agency Settings → Users → Devon → Add sub-accounts. Then in
  each sub-account built and published workflow **"Lead alert - push to Devon"**: trigger Contact
  Created → Internal notification (type Notification, to Devon Curry, opens the contact). Title
  "New <site> lead: {{contact.name}}", message "Call now: {{contact.phone}} ...". Email alert from
  `api/lead.js` still fires too. Devon needs the LeadConnector app with notifications on.
- [x] **3. Test lead per site — done 2026-11-25 10:49 PM.** POSTed "TEST - alert check" /
  (727) 555-0100 to each site's /api/lead (all 200). All 3 workflow execution logs show "New lead
  push alert" = Executed; Devon saw the 3 alerts grouped on his phone. Backup email: GHL shows
  Dunedin's as "Delivered" to letstalk@creativelygrow.com, but it wasn't findable in Gmail ~15 min later.
- [x] **4. Test contacts deleted — 2026-11-25.** Removed "TEST - alert check" and "TEST - Claude
  verification" from all 3 sub-accounts (restorable in GHL for 60 days). Left: Pinellas = Devon Notify;
  Largo = Devon Notify; Dunedin = Alison Starkenburg + Devon Notify.
- [ ] **5. Get more leads before ads** — see plan below.

---

# More leads from the 3 epoxy sites, before ads (plan for approval, 2026-11-25)

## What the research shows
- The 3 sites are built the same way (8 pages, ~300–800 words each, same schema). Page quality
  isn't why Dunedin ranks.
- **Dunedin ranks #1 only for its niche phrase** ("polyaspartic garage floor dunedin"). For the
  broad phrase "garage floor coating dunedin fl" it's not in the top 9 either.
- Largo and Pinellas aren't in the top 30 for their broad phrases ("garage floor epoxy largo fl",
  "garage floor coating pinellas county"). Those are owned by real contractors, Yelp, Angi.
- Google Maps competition is weak (top 3 epoxy listings in St. Pete: 79 / 6 / 15 reviews), but
  none of the 3 sites has a Google Business Profile, so they're absent from Maps entirely.
- Quote form only exists on contact.html. No sitemap.xml or robots.txt on any site.
- No phone number on any site. (Earlier decision kept: no Search Console/Analytics, to avoid
  linking the sites together.)

## Plan, in order of impact (all $0 unless noted)
- [x] **1. Quote form on every page — built 2026-11-25 (local, not yet pushed).** The cta-band
  button on every page except contact.html is now a name/phone/project form (`quote-form.js`,
  posts to `/api/lead`, appends `[page: /path]` to the message). On failure it shows a retry
  message instead of the contact page's mailto fallback (that fallback exposes
  letstalk@creativelygrow.com — left as is on contact.html, flagged for Devon).
- [x] **2. sitemap.xml + robots.txt — built 2026-11-25 (local, not yet pushed).**
- [x] **LIVE 2026-11-25.** Steps 1–3 pushed to all 3 repos and deployed (first pushes were BLOCKED by
  Vercel because of the commit author; fixed with an empty commit as letstalk-code). Also removed
  the contact-page email fallback on all 3 sites (Devon: no personal email on the sites). Verified
  on the live domains: new pages + sitemap + robots return 200, no mailto/creativelygrow anywhere.
  Live end-to-end test 11:41 PM: submitted the new form on largogaragefloorepoxy.com/flake-vs-metallic-epoxy.html
  → success message, Largo push workflow Executed, contact note ended "[page: /flake-vs-metallic-epoxy.html]".
  Test contact deleted (bulk action Complete); Largo back to just Devon Notify.
- [x] **3. Long-tail pages — written 2026-11-25.** Largo 4, Pinellas 5 city
  pages, Dunedin 2. Linked from a "More Guides" section on Largo/Dunedin index + FAQ, and from
  the city names on Pinellas service-area.html. All 35 pages link-checked; desktop + mobile checked.
  Original brief — phrases the big contractors don't cover, each a
  real, useful page (no thin copies):
  - Largo: "epoxy over a painted garage floor" (Alison's exact situation), "flake vs. metallic
    epoxy", "garage floor epoxy in Florida humidity", "how long before you can park on epoxy".
  - Pinellas: one page per nearby city it serves (Clearwater, Seminole, Palm Harbor, St. Pete,
    Pinellas Park), each with local details, not a copy-paste with the city swapped.
  - Dunedin: 1–2 more polyaspartic questions, since that niche already works.
- [x] **3b. 9 more guide pages — written 2026-11-26 (local, not yet pushed).** Pinellas: coating cost,
  coastal/salt-air homes, home value (new More Guides on index + FAQ). Largo: cleaning epoxy, DIY kit vs. pro,
  cracked floors. Dunedin: polyaspartic vs. polyurea, how long it lasts, is it slippery. All have the quote
  form; links checked; sitemaps regenerated (19 / 17 / 15 URLs). Facebook pages dropped (Devon heard FB is
  deleting pages).
- [ ] **4. Google Business Profile for Dunedin first (Devon).** The biggest single lever: Maps is
  where weak competition is. Service-area business, no public address. Google verifies by video,
  which only Devon can do. Risk: Google suspends lead-gen listings that don't look like a real
  business; a phone number (~$1.15/mo GHL number) makes it look more real. Start with one site,
  see if it sticks before doing the other two.
- [~] **5. Facebook pages (kit: tasks/facebook-pages-kit.md).** 2026-11-26: Pinellas (id 61597097515322) and
  Largo (id 61596646425029) created and linked in every page footer (live). Dunedin blocked by Facebook's
  "too many pages" limit; create it after 24-48h, then add its footer link.
  Kit posts scheduled in each sub-account's GHL Social Planner (10:00 AM ET): Pinellas Tuesdays Dec 1-29,
  Largo Thursdays Dec 3-31. Dunedin: connect its page in its sub-account and schedule its 5 posts once it exists.
  Original note: Facebook pages show up
  in these local searches (seen in the Dunedin and Largo results) and give each site a link.

## Not doing
- Ads. Contractor outreach until real leads are coming in (Devon's call: don't promise leads before
  they exist). Search Console/Analytics (kept off on purpose).

# Pool deck resurfacing lead site: on hold (no budget for a domain, 2026-11-25)

## Why
Trade research (`tasks/trade-selection-pinellas.md`) picked pool deck resurfacing as the add-on to
garage epoxy. Google Maps competition is weak in St. Pete (top 3 have 10 / 16 / 44 reviews). It gets
100–1K searches a month in Tampa Bay, and advertisers pay $4.88–$20 per click. Many coatings crews
do both garage floors and pool decks, so one lead buyer can take leads from two sites.

## What exists
Three epoxy sites in `rank-and-rent/` (Pinellas Garage Floors, Largo Garage Floor Epoxy, Dunedin
Polyaspartic). They're static HTML with a shared design system (see `tasks/rank-and-rent-redesign.md`)
and an `api/lead.js` form handler. None of them mentions pool decks.

## Plan
**Model: leads, not jobs.** Devon owns the site and Google listing and sends each lead to a local pool
deck company (the "lead buyer"), who quotes and does the work. Devon gets paid per lead or appointment
(like the $75 Lead Engine) or a flat monthly rent. Devon never does or sells the work.

- [ ] **0. Find the lead buyer first (Devon).** Ask the epoxy contractor(s) we're already talking to
  whether they do pool deck resurfacing (coatings, spray texture or cool deck, pavers over concrete).
  If none of them do, line up a pool deck company before the site goes live. Leads with nobody to
  send them to are worthless.
- [ ] **1. Copy the Pinellas Garage Floors site** to `rank-and-rent/st-pete-pool-deck-resurfacing/`.
  Keep the structure, design system and `api/lead.js`; swap the accent color, name, logo and photos.
- [ ] **2. Write the pages:** home, pool deck resurfacing, pool deck repair (cracks, hollow spots, rust
  stains), resurfacing options compared (coating vs. spray texture vs. pavers), cost guide, service
  area, FAQ, contact. Plain homeowner language, no made-up reviews, counts or years in business.
- [ ] **3. Photos.** Get real job photos from the lead buyer if possible, otherwise use Higgsfield web
  (no paid generation without asking).
- [ ] **4. Point the lead form at the right GHL place** (same handler as the epoxy sites, tagged
  `pool-deck`), and send a test lead.
- [ ] **5. Deploy on Vercel** with its own domain. Devon buys the domain (I'll suggest 3 that are available).
- [ ] **6. Google Business Profile (Devon).** Set it up as a service-area business with no public
  address and category "Pool deck contractor" or the closest match. Verification is on Devon.
  Note: Google suspends lead-gen profiles that don't look like real businesses, so the profile
  should be tied to the lead buyer we actually work with.
- [ ] **7. Check in 30 days:** Maps rank for "pool deck resurfacing St. Petersburg", leads, and
  whether the lead buyer closed any.

## Not doing yet
- Paid ads for this site. Get organic and Maps working first; ads come after the lead buyer proves they close.
- Owning the jobs (the video model). Only if the lead buyer can't keep up with the leads.

---

# "Never Miss a Customer": recurring GHL offer (2026-11-23)

## Why
Devon lost a few website clients. Websites at $50–$97/month are getting harder to sell
because owners can build their own with AI. The new lead offer is a monthly GHL service
built around outcomes: more reviews, faster replies, booked jobs, past customers brought
back. A website can be included as a bonus. Sources: two videos analyzed 2026-11-23
(Pavlo's lead-finding system, and Dominic Baptist on GHL "Host a Number").

## What's in the package
- **Review requests**: after each job, the customer gets a text asking for a Google review. Unhappy replies go to the owner privately.
- **Fast follow-up and booking**: every form, call or Google message gets an instant reply with a booking link, then follow-ups for a few days.
- **AI receptionist: separate add-on, not in the $97.** GHL's native Voice AI answers missed and after-hours calls and books the job. No VAPI. GHL charges about $97/mo per sub-account for its AI, so this has to be priced on top (add-on price TBD).
- **Old-customer reactivation**: a text campaign to past customers (seasonal or a special offer).
- **Missed-call text-back**: included, but not sold on its own.
- **Their own shop number**: the business keeps its landline and customers can text it, using GHL Host a Number.
- **One inbox and app**: every text, call, form and Google message in one place, plus the GHL mobile app.
- **Free website**: a one-page site built after they sign. Hosting is included.
- **Monthly results text**: reviews gained, leads answered, jobs booked, customers brought back.
- **Price**: $97/month for everything above except the AI receptionist. Devon decided 2026-11-23 that the website is free.

## Plan
- [x] **1. Write the offer sheet** (draft done 2026-11-23; contract term and setup fee still open) in `tasks/never-miss-a-customer.md`: what's included, price, what isn't included, and what the owner has to do. Plain customer words, never "marketing".
- [ ] **2. Test Host a Number and call forwarding on one real number.** Test in the **Labif Filmhouse** sub-account (`NzbVVSNFa2G2M2oCiRWD`). Host a US landline there, link it to a Low Volume A2P campaign, then set the carrier to forward unanswered calls to a GHL number. Confirm the missed-call workflow and the Voice AI both pick up the forwarded call. If forwarding doesn't work, the receptionist part needs a different setup before we sell it.
- [ ] **3. Build the setup once in Labif**: a pipeline, a calendar, the 4 workflows (review request, fast follow-up, missed-call text-back, reactivation), and, separately, a Voice AI agent for the add-on. Name every new piece "NMAC – …" and leave Labif's existing workflows and calendars alone. Save the result as a **Creatively Grow agency snapshot**, so each new client sub-account under the Creatively Grow agency is a one-click import. Note: client sub-accounts have to be created in the GHL web app, because the API returns 403 on our plan. Building workflows is also web-app work, done through the Dia browser.
- [ ] **4. Write an onboarding checklist** for each new client: a brand-new sub-account, KYC, A2P registration (takes days, so start it on day 1), Host a Number with the service address matching the carrier and the LOA signed, call forwarding, the Google review link, and importing past customers for reactivation.
- [ ] **5. Work out the cost per client.** Phone ($1.15/mo per number in the video), SMS, and Voice AI minutes all come out of the agency wallet, since we're not reselling. Set the price so a typical month leaves real margin.
- [ ] **6. Build a target list.** Make one list for each niche: pet businesses, lessons and studios, and marine services, all in one Tampa Bay area. Pull businesses with 40+ Google reviews and no or weak website (GHL Prospector, or Outscraper's "without website" filter). Reach them through an audit or "gift" approach that gets them to book you. No cold calls.
- [ ] **7. Pilot with 3–5 businesses** for 30 days. Track reviews gained, response time, jobs booked, and customers brought back. Use the results as proof for the next sale.

## Step 2 detail: call-forwarding test (needs Devon's phone)
- [ ] **a. Pick the numbers.** (1) A GHL number in Labif that will catch forwarded calls; buy one (about $1.15/mo) if Labif has none. (2) The "business" phone to test with; Devon's cell works. (3) A second phone to place the test call.
- [ ] **b. Build a test workflow in Labif.** "NMAC – TEST missed call": trigger is a missed or unanswered call on the GHL number; action is a text back saying "Sorry we missed you…". I build it in GHL through Dia; Devon approves before it's switched on.
- [ ] **c. Turn on no-answer forwarding** on the test phone's carrier, pointing at the GHL number. Common codes (they vary by carrier): AT&T and T-Mobile `**61*<number>#`, Verizon `*71<number>`.
- [ ] **d. Call the test phone from the second phone and don't answer.** Pass means the call lands on the GHL number, the workflow fires, and the caller gets the text.
- [ ] **e. Record the result here**, including what caller ID GHL saw: the original caller, or the forwarding phone. That decides whether the text goes to the right person.
- [ ] **f. Turn forwarding back off** (`##61#` or `*73`) and pause the test workflow.

## Static ads (new, 2026-11-23): plan for approval
**Goal:** Meta (Facebook/Instagram) feed ads that get pet, studio and marine business owners to request a free check, so they come to Devon and he never cold-calls.
**Format:** 1080×1350 PNGs built the same way as `tasks/mockups/ads-final/` (HTML/CSS → PNG, Oswald + Inter, the dark/cream/orange brand colors, CG logo). No paid image generation. Each visual is a demo of the claim, such as a phone screen showing "Missed call → text sent in 4 sec", not stock photos.
- [ ] **1. Angle bank**: 2 angles per niche, written in owners' own words:
  - **Missed calls**, e.g. pet: "You can't answer mid-groom. Your next client won't wait." / marine: "You can't answer from under a hull. We will." / studios: "Every unanswered call is a student who signed up somewhere else."
  - **Reviews and regulars**, e.g. "Your happiest clients never left a review. Let's fix that."
- [ ] **2. Build 6 statics** (3 niches × 2 angles) in `tasks/mockups/nmac-ads/`, render them to PNG, and send them to Devon.
- [ ] **3. Write copy for each ad**: primary text, headline and CTA, no "marketing", no invented results or testimonials.
- [ ] **4. Devon reviews**, we revise, then he picks which ones go live.
- Out of scope for now: launching the campaign, budget, and the landing page. Those come after Devon approves the creatives.

**Questions before building ads:**
- Where should the ads send people: a Meta instant form straight into GHL (fastest), or a new page on creativelygrow.com?
- Which ad account? Creatively Grow's own, or a new one in the CG portfolio?
- What's the free offer called? Suggestion: "Free Missed-Customer Check". We look up their Google profile and show them how many calls and reviews they're leaving on the table.

## Questions for Devon
- ~~Contract~~: month to month. They keep the free website after 6 months.
- Setup fee: recommend none (Devon to confirm).
- ~~Price~~: $97/mo.
- ~~Website~~: free.
- ~~Test account~~: Labif. Everything is set up through the Creatively Grow agency.
- ~~**AI receptionist add-on price**~~ (decided 2026-11-23): GHL's AI cost plus $50 margin. Default is **AI Employee Growth** ($50/mo, about 100 Voice AI minutes and 1,000 Conversation AI replies per sub-account), so the add-on is **+$100/mo** and the client pays $197 total. If a client regularly goes over 100 minutes, move them to **Unlimited** ($97/mo) and the add-on becomes **+$147/mo**. Phone-minute charges are extra on every GHL tier, so watch usage. Third-party sources only; confirm the prices in GHL billing.
- **Niche (decided 2026-11-23)**: these three. No weddings, and not the crowded home-service trades:
  - **Pet businesses** (groomers, trainers, boarding). Repeat bookings make reactivation work well.
  - **Lessons and studios** (music, martial arts, dance, tutoring). The inquiry leads to a trial booking, and past students can be brought back.
  - **Marine services** (boat repair, detailing, charters). Specific to Tampa Bay, and few agencies target them.

## Not changing
- No website changes and no ad spend yet. No VAPI. No GHL reselling or SaaS mode.

---

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


---

# Site fixes — blog menu, blog dates, contact spam (2026-11-07)

## Findings
1. **Blog menu** — the blog is a separate Next app (`creativelygrow-next`). Its header
   (`app/blog/BlogHeader.tsx`) hard-codes only How It Works / Services / Brand Films.
   The static pages list The Method, How It Works, Services, Brand Films, Training
   Videos, Blog, Contact. `contact.html` is also missing Training Videos (I removed it
   when that page was not yet committed; it is live now).
2. **"Last post Oct 1"** — the date shown is the date Hermes stamps on the *draft*, not
   the day it went live. The Oct 1 post actually published Nov 6; the HVAC SEO post is
   dated Sep 28 but went live Oct 28. The publisher never updates `date` on publish.
   One more draft is waiting: roofing (dated Oct 5, status draft).
3. **Contact spam** — 5 bot leads since Nov 6, all the same bot: gibberish
   "Xxxxx LLC" business, gibberish first name, Gmail with dots sprinkled through
   (`tubu.ni.w.u01.6@gmail.com`), random phone. Every one fired the auto-reply SMS
   to a stranger's number (Twilio 30005/30006 errors on 3) and alerted Devon.
   Root cause: all checks are client-side. The honeypot only exists on `/contact`;
   the modal on every other page has none, and `/api/leak-check` accepts any POST.

## Plan
- [ ] 1. `BlogHeader.tsx`: nav drop = The Method, How It Works, Services, Brand Films,
      Training Videos, Blog (current), Contact. `contact.html`: put Training Videos back.
- [ ] 2. Blog dates: when the publisher publishes, set `date` to the publish day. Fix the
      18 live posts' `date` to their real go-live date from git history? **(ask)** —
      changes visible dates + sitemap lastmod. Update the publisher routine prompt rule.
- [ ] 3. Spam, server-side in `api/leak-check.js` (forms unchanged except a hidden field):
      a. Honeypot field `company_site` on every form (modal + /contact); API drops the
         lead silently if it is filled.
      b. Form-open timestamp sent with the post; API drops anything submitted < 3 s
         after the form opened or with no timestamp (direct API hits).
      c. Drop Gmail addresses with 3+ dots in the local part (catches 5/5 of these).
      Dropped requests still get `200 ok` so the bot learns nothing; logged to Vercel.
      No SMS, no alert, no GHL contact for dropped leads.
- [ ] 4. If spam continues after a week: add Cloudflare Turnstile (free, invisible).
      Needs a Cloudflare site key + secret from Devon, so not doing it now.
- [ ] 5. Delete the 5 spam contacts in GHL **(ask — permanent delete)**.
- [ ] 6. Verify: build the Next app, preview both navs, POST test bodies to the API locally
      (honeypot / too-fast / dotted gmail rejected, normal lead passes, mocked GHL).
      Commit, push, deploy `creativelygrow-next` (`vercel --prod`).

## Review (2026-11-07)
- Blog header now lists The Method, How It Works, Services, Brand Films, Training Videos, Blog (current), Contact. `/contact` nav has Training Videos back.
- 8 post dates corrected to their go-live commit date; newest post now shows Nov 6. Publisher routine (`~/.claude/scheduled-tasks/creativelygrow-blog-review-publish/SKILL.md`) now sets `date` to the publish day.
- Spam: `api/leak-check.js` drops leads with no/short `fillMs` (<3 s on page), a filled `company_site` trap, or a Gmail local part with 3+ dots. All 6 form senders (modal/band via `editorial.js`, `/contact`, epoxy x2, pool-cage x2) send `fillMs`; editorial forms and `/contact` carry the trap. `editorial.js` cache-buster bumped to v=10. Tested: real lead passes, every spam case dropped with no GHL calls.
- Dot rule catches 4 of the 5 Nov spam emails (`adufu.j.aq41@gmail.com` has 2 dots); timing/trap cover the rest. If spam continues, add Cloudflare Turnstile.
- Deleted the 5 spam contacts in GHL (xwdd).


---

# Spread out the Coca-Cola video (2026-11-07)

Coke Brand Story (`afcdbe14…`) is embedded on: home (x2, mobile + desktop copies of
one section), proof-to-pipeline, training-videos (featured player), brand-films (gallery).
Other films are barely used: Vaya Space, CeraVe, Heal Precisely, SSHC Live, Short-Form
Social only appear on brand-films.

## Plan (swap the embed GUID + its caption only, no layout changes)
- [ ] Home: keep Coke (it is the headline brand) + Cornerstone + Publix×Charmin.
- [ ] Brand Films: keep (it is the full gallery).
- [x] Proof-to-Pipeline: Coke → **Vaya Space Brand Story** (`faa8242f…`), a brand story film like the copy describes.
- [x] Training Videos: Coke → two BD&L training videos Devon picked (Video 4 Warehouse Expectations `96851b3d…`, Video 6 Production Proper Handling `4baf481a…`), side by side, captions do not name the client.
- [ ] Verify in preview, commit, push.
- 2026-11-09 SHORT 5 AUDIO FIX: the Family Dollar 15:14 take had two lavs — 2XQ8 = Brian, 2NRG = John (20261026_1514_0161_32Float_2NRG.wav). The sync marked 0161 'failed', so John was never in Short 5 (only faint bleed on Brian's mic: -41/-46 LUFS). PHAT cross-correlation (z=60) puts 0161 at +2.998 s vs 0155 (other FD takes: -2.195 s). Added to sync/Family Dollar.events.jsonl (backup: .before-0161.jsonl); build_cut.py has LANE_GAIN (+5 dB on 0161). John's lines now -27/-30 LUFS vs Brian -26 (were -41/-46). Short 5 restored John's reply ('Outstanding job, Brian… cold drink equipment') → 65.1 s (was 55.9 s, over 60). Imported as 'Short 5 – Winning CDE (both mics)' — landed in the Nov-6 SNAPSHOT library 'Coke Florida Way 20261106_1142_EST' (FCP picker default), not the original bundle. Devon works with 2 mics only on Family Dollar takes; all other recorder files are synced. Also fixed preview_cut.py (mixes all lanes).
- 2026-11-10 CLIENT EDITOR FEEDBACK (docx "Outlet Standards_Editor Feedback_11.10.2026"): now SIX videos — 1 Opening "5 Standards - The Coke Florida Way" (30 s, Box audio link), 2 Reflect Our Values (needs a clip of the black-quarter-zip man or the lady by the Christmas display talking about the 5 values), 3 Own the Outlet (start with the "Dollar General" [=Family Dollar] clip, drop the Walmart clip, one outlet only), 4 Maximize Availability (Big Mills only), 5 Basket Building (open with the Sales Director greeting the SAM at the Walmart entrance = C0194 conversation until he asks if Johnny the store manager is in; callouts: black pullover = Sales Account Manager, blazer = Sales Director; 2 Box audio links), 6 Winning CDE (keep all except the clip outside Big Mills). DONE + imported into the ORIGINAL library (not the snapshot): 'Short 3 – Own the Outlet (11.10 notes)' 53.5 s, 'Short 4 – Maximize Availability (11.10 notes)' 68.0 s, 'Short 6 – Winning CDE (11.10 notes)' 55.0 s (both FD mics). NOT DONE: Short 1 (needs audio), Short 2 (no values clip exists — searched all recorder transcripts + camera audio of all 47 unsynced Walmart clips: none), Short 5 (needs the 2 Box audio files + callouts). Box downloads need Devon's OK. Scope note: PO 4001327266 = 5 shorts, client now asks for 6. Old 'Short N' projects (pre-11.10 numbering) still in the library. New scripts: scripts/check_sync.py, scripts/transcribe_camera_audio.py.
- 2026-11-11 Short 5 – Basket Building (11.10 notes) built + imported into the ORIGINAL library: title '4 · BASKET BUILDING', client C0194 entrance conversation 0–70.1 s (ends on 'You said Johnny's here today? / Johnny is here.') with camera audio, then the 4 Walmart basket bites, end card = 2:03. Callouts = Basic Lower Third: 'Sales Account Manager / Coke Florida' at 0.8 s (he's alone at the door), 'Sales Director / Coke Florida' at 9.0 s nudged right (adjust-transform x=88.9) — CHECK placement in FCP. To swap later: client's clean audio (Devon getting it), real names for callouts. Lady FX3A-0486 = best-position line, no values (text sent).
- 2026-11-11 'Harry': named by others at all 3 stores (Walmart 0129 'Harry, what is it?' → he answers >98%; Big Mills 0152 lineup 'T.J., Jelani, me, Harry, you'; Family Dollar 0153 'Harry said I don't need to move the sign') — never introduced on camera, face not identifiable from footage. Values search now covers ALL footage (every recorder take + camera audio of every unsynced clip at all 4 locations): nobody says the five values (only FD 'collaborated with the store manager'). camera-audio transcripts in transcripts/camera-audio/.
- 2026-11-11 CLIENT DJI AUDIO (in /Volumes/GamerKing 1/Coke Florida Way/, left in place): DJI_20 = John's lav (all his values takes; C0191 starts at 797.125 s, z=41); DJI_21 = Dewey's lav (Sales Account Manager, black pullover); DJI_17 = Eric's lav (Sales Director, blazer); C0194 starts at 374.949 s in DJI_21 (z=17) and 418.284 s in DJI_17 (z=11) — consistent with file start times 43 s apart. Store = Palatka Walmart. Built + imported into the ORIGINAL library: 'Short 1 – 5 Standards - The Coke Florida Way' (31.7 s, title '5 STANDARDS – THE COKE FLORIDA WAY', John's speech on DJI_20) and 'Short 5 – Basket Building (clean audio)' (2:03, both DJI lavs, Eric +3 dB → Eric/Dewey within 1 dB; callouts now 'Dewey / Sales Account Manager' and 'Eric / Sales Director'). Lanes snapped from one shared base so the two DJI lavs stay 43.335 s apart (≈2 ms) — avoids echo. builder: item ext_audio. Superseded: 'Short 5 – Basket Building (11.10 notes)' (camera audio). Still open: Short 2 Reflect Our Values (no values clip from the black-zip man / the lady; DJI_20 has all of JOHN's values takes).

---

# NMAC get-started page + onboarding form (2026-11-24)

Goal: a live page at creativelygrow.com/get-started that walks a Never Miss a Customer client through the six steps and collects what we need, landing in the Creatively Grow GHL account. Based on `tasks/mockups/nmac-ads/onboarding-steps.html`.

## Plan
- [ ] **1. New page `get-started.html`** (served at `/get-started` via cleanUrls). Same look as `client-intake-form.html` (cream, Oswald/Inter, pill radios). Top: the six steps in short form. Below: one form, grouped by step:
  - Your shop: business name, your name, email, phone, services, towns you cover, hours, who gets notified.
  - Customer list: how you keep it (spreadsheet / invoices / phone contacts / other) and roughly how many. No file upload: we text or email them after for the file.
  - Your phone: main number, mobile or landline, carrier. Legal business name and address for texting registration. Tax ID optional ("or give it to us on the call").
  - Google: added us as manager / need help / no profile. Review link if they have it.
  - Website: have one? URL, where the domain lives, logo and photos (have / somewhere / none).
  - Sign and start: no payment on the page. "We send your agreement and a payment link." 
  - `noindex`, honeypot + time-on-page spam check, same as the other site forms.
- [ ] **2. New API `api/get-started.js`**, modeled on `api/leak-check.js`: validate, spam filter, look up existing contact by phone, upsert with tag `nmac-onboarding`, attach every answer as one note, text Devon + email Devon (same notify pattern), short confirmation text to the client. Uses the existing env vars (GHL_PIT, GHL_LOCATION_ID, GHL_NOTIFY_CONTACT_ID). No new env vars.
- [ ] **3. Leave alone:** `client-intake-form.html` (film/package intake), `leak-check.js`, sitemap (page is noindex).
- [ ] **4. Test locally** with the browser pane: layout on desktop and phone, required fields, spam path. Real GHL submission only with Devon's OK (it creates a contact and texts him); delete the test contact after.
- [ ] **5. No commit or deploy** until Devon says so.

## Open questions
- "Page and the phone together" read as "page and the form together".
- Payment: left off the page until the GHL e-sign agreement and Square link exist.

---

# $150 website offer · Mobile, AL Meta test (2026-11-24)

**Decision (Devon, 2026-11-24):** hold the NMAC marine ads (out of season, harder sale). Put the $100 behind a simple website offer that brings in fast money, reviews and an email list for upselling NMAC later.

## The offer
- **$150, the site is yours.** Built from our templates, swapped to their name, logo, photos and text.
- **Optional $15/month:** we host it, keep it running, and make 2 small edits a month (text, photos, hours, phone). Edits come in through a request form and are done within 3 business days. Extra edit batches about $20. Bigger changes quoted. Free for NMAC clients.
- **If they don't take hosting:** we hand over the site files. Templates are built so nothing breaks on handover: Call and Text buttons (plain phone links), and a contact form that emails the owner directly through a form service (Web3Forms or Formspree). Hosted with us, the form goes into our GHL instead.
- Both prices are stated plainly in the ad and on the order page. "No hidden fees" only where it is true.

## Plan
- [x] **1. Pick 3 sample sites** (done 2026-11-24: Amped → Voltway Electric, Swift → Northgate Drug Screening, Sistah Soul → Rooted Wellness Studio; all in `Desktop2/site-templates/`, fictional names, 555 numbers, no real people or claims) from what is already on Vercel. Candidates: watts-electric / amped-electric / darling-electric, ocean-plumbing-site / roan-plumbing-site / steadfast-plumbing / shawn-the-plumber, medspa-site, lizzys-pet-sitting, sullysshinenride, dunedin-polyaspartic / largo-garage-floor-epoxy. Check each: does it look good on a phone, is it a demo or a real client's brand. Real client sites only as samples with that client's OK; otherwise use the demo ones.
- [x] **2. Turn the 3 into reusable templates** (done: static export, Call/Text buttons, sample ribbon, noindex): Call/Text buttons + owner-email form, nothing tied to our server.
- [x] **1b. Four more eye-catching samples** (2026-11-24, Devon's picks): Euro → Gulfline Luxury Rentals (`rental-luxury`), Grecian Glows → Lumière Skin Studio (`medspa-glow`), Lizzy's → Happy Tails Pet Care (`pets-friendly`), Role Models → Bright Path Foundation (`nonprofit-bold`). Ads now use these four. Open: confirm Devon owns the spa hero video and the Lizzy dog footage.
- [x] **3. Ad images (3–4):** (done: `tasks/mockups/website-ads/` web-three, web-calls, web-what, web-nofees) sample sites on a phone, "$150, it's yours", "optional hosting + 2 edits for $15/mo". Same render setup as the NMAC ads. No invented reviews or results.
- [x] **4. Meta lead form** (done 2026-11-24: "Website $150 v1", higher intent + SMS verification, flexible delivery off, privacy creativelygrow.com/privacy) "Website $150": name, business, phone, email, "do you have a site now?". Leads into GHL (Creatively Grow) tagged `website-lead`, Devon gets notified.
- [x] **5. Meta draft campaign** (done 2026-11-24: campaign 52774117484490 "Website $150 - Mobile AL - Test", $100 lifetime, Nov 24 to Dec 4, Mobile +25 mi only, 4 ads web-three/web-calls/web-what/web-nofees, all AI enhancements and multi-advertiser off; NMAC marine campaign toggled off; NOT published) "Website $150 · Mobile AL", Mobile +25 mi, $100 lifetime, all Meta AI enhancements off. Draft only. Devon publishes.
- [ ] **6. Later:** edit-request form, order page, email sequence (site check-in → "we also bring your past customers back" → free comeback check).

## Open
- Vercel plan: client sites need a paid (commercial) plan. Confirm which plan the team is on.
- NMAC marine draft stays unpublished in Meta.

---

# $150 website: auto-send intake after the Meta form (2026-11-24)

**Devon's call:** no "pay now" on the instant form. Instead, when someone submits the Meta form, GHL automatically texts and emails them a link to a page that asks everything we need. Once they fill it in, we start building.

**Already in place:** the Creatively Grow page's Meta leads sync into the CG GHL account (`xwddXAWgoJtFg4qpBO3u`, "All Leads"). Field mapping for the new form is not done yet.

## Plan
- [x] **1. Put the 7 samples online** (done: cg-sample-{voltway,northgate,rooted,gulfline,lumiere,happytails,brightpath}.vercel.app) so people can pick a look: one Vercel project per sample (e.g. `cg-sample-gulfline.vercel.app`). They stay noindex with the "Sample website" tag. No custom domain needed.
- [x] **2. Intake page `creativelygrow.com/website-start`** (live 2026-11-24, plus /website-details; SQUARE_URL still empty in website-start.html) in two steps (Devon, 2026-11-24: pay right after choosing a look, ask the rest after payment so nobody gets scared off):
  - **Step 1, before payment:** pick a look (7 sample cards with "View sample"), then "Lock in your site: $150" → saves the choice to their GHL contact and sends them to the Square payment link.
  - **Step 2, after payment:** Square sends them back to `creativelygrow.com/website-start/details?c=...` with the questions below. Devon confirms payment in Square; a Square webhook can come later.
  - Old single-page outline, now step 2 only:
  - Pick your look: 7 cards with screenshot + "View sample" link, choose one.
  - Your business: name, what you do, towns, hours, phone and email to show on the site.
  - Your stuff: have a logo / photos (yes / some / none); we text them to collect files (no uploads on the page).
  - Your domain: have one? where is it registered?
  - Hosting: "$15/month hosting + 2 edits" yes / no / not sure.
  - The link carries the GHL contact id (`?c={{contact.id}}`) so the answers land on the same contact.
- [x] **3. API `api/website-start.js`** (live, tested end to end with a 555 test contact, deleted; tags now added separately so the upsert can't wipe them, same fix in get-started.js), copy of `api/get-started.js`: saves answers as one note, tag `website-intake`, texts + emails Devon. If the contact id is missing, falls back to phone match like get-started.
- [x] **4. GHL setup (web app, browser):** (built 2026-11-24 as DRAFT workflow "Website $150 - send pick-a-look link": FB form Website $150 v1 on CG page → tag website-lead → SMS + email link with ?n=&p=&e=&c= → internal SMS to Devon → wait 1 day → if no website-picked tag, reminder SMS. Square link https://square.link/u/sUg41XF4 is live on the page, redirect set by Devon. Field mapping of the 2 custom questions not done; name/phone/email come over by default.)
  - Map the "Website $150 v1" form fields in Integrations so leads arrive with name, phone, email, business and "have a website?".
  - Workflow "Website $150 - send intake": trigger Facebook lead form submitted (Website $150 v1) → tag `website-lead` → text: "Hi {{contact.first_name}}, Devon from Creatively Grow. Got your request for a $150 website. Pick your look and send your details here (2 min): creativelygrow.com/website-start?c={{contact.id}}" → same as email → notify Devon. If no intake after 1 day, one reminder text.
- [ ] **5. Test end to end** with a Meta test lead (Meta's Lead Ads Testing tool) → GHL contact → text/email arrives → intake submitted → note on the contact. Delete test contact.
- [ ] **6. Nothing goes live** until Devon publishes the Meta campaign.

## Open
- Payment: decided. They pay $150 right after picking a look. Needs a Square payment link for $150 with its "after checkout" redirect set to the details page. Devon creates it in Square (account action).
- Text-sending from the CG number needs its texting registration active; the get-started test showed it can send.

---

# 7 niche sample websites for the $150 offer (2026-11-24)

**Ask (Devon):** good-looking samples for lawyers, realtors, dog groomers, lawn care, HVAC, trucking, dentists.

## Rules (same as the first samples)
- Made-up business in Mobile, AL, 251-555-01xx numbers, hello@example.com, "Sample website by Creatively Grow" tag, noindex.
- No invented reviews or stats: review cards are placeholders ("Your best Google reviews go right here").
- Call and Text buttons + a contact form that emails the owner (works on any host, nothing tied to our server).
- Plain static HTML/CSS, one page plus anchors, so it can be handed over as files.
- Each one gets its own look, built for how that trade sells. Never "marketing" in the copy.

## The 7
| Niche | Made-up name | Look | Main ask on the page |
|---|---|---|---|
| Lawyers | Harbor Point Law | navy + brass, serif, calm and serious | Free case review |
| Realtors | Bayside Home Group | clean editorial, big property photos | See homes / what's my home worth |
| Dog groomers | Suds & Scruff | bright pastel, rounded, playful | Book a groom |
| Lawn care | Greenline Lawn Co. | fresh green, before/after strip | Free quote |
| HVAC | Gulf Air Heating & Cooling | bold blue/orange, urgent | Call now, 24/7 repair |
| Trucking | Iron Coast Freight | dark, industrial, big type | Request a quote + Drive for us |
| Dentists | Azalea Family Dental | soft white/teal, friendly | Book new patient visit |

## Plan
- [x] 1. Photos for each site (21 Higgsfield Nano Banana Pro 2K images on Unlimited, credits unchanged).
- [x] 2. Build the 7 sites in parallel (one agent each, same rules), in `Desktop2/site-templates/<niche>/`.
- [x] 3. Check each on a phone myself; fix anything weak.
- [x] 4. Deployed: cg-sample-{harborpoint,bayside,sudsscruff,greenline,gulfair,ironcoast,azalea}.vercel.app
- [x] 5. Added to `/website-start` (14 looks in 3 groups + "don't see your trade" line; API accepts the new keys) (group the picker by trade so it doesn't get too long).

## Open: where the photos come from
- **A. Free stock photos (Unsplash):** free for commercial use, no credit needed, real-looking, fastest. Downloaded into each site so they never break.
- **B. Higgsfield (your Unlimited plan, web):** custom AI photos that match each brand exactly, but slower (I drive the web app for ~25 images).

---

# $150 site: guarantee, $699 custom option, $15/mo hosting push (2026-11-25)

## Decided (Devon)
- 2 rounds of changes, and a refund if they're still not happy.

## 1. "What you get" + guarantee (pick page, under the deal box)
- Your chosen look with your name, colors, photos and info. One page, like the sample.
- A private preview link before anything goes live.
- 2 rounds of changes. Want a different look after seeing it? You can switch once, early.
- **Love it or your money back:** if you're not happy after the 2 rounds, we refund the $150 and the site doesn't launch. Once you approve it and it goes live, it's yours and the sale is final.
- Extra pages, booking systems or a whole new design are quoted separately.
- Same promise repeated in one line on the details page and in the confirmation text.

## 2. Custom site, from $699 (new option on the pick page, below the 14 looks)
- Card: "Want something built just for you? Custom website from $699." Designed from scratch around your brand, up to 5 pages, help with your words and photos, 3 rounds of changes, same "love it or your money back" before launch.
- Button "Talk to Devon about a custom site": a short form (name, phone, email, what you need) → GHL tag `website-custom` + text/email to Devon. No checkout: custom needs a quick conversation first, then a Square link for a deposit.
- Open: is $699 a flat price or "from $699"? Deposit (e.g. half up front)?

## 3. Make the $15/month the easy yes (details page hosting question)
Honest side-by-side, so they see what "send me the files" really means:
- **We host it ($15/mo):** site stays online and secure, your domain connected for you, contact form set up, 2 small changes every month (hours, prices, photos, text), we fix it if anything breaks, cancel any time.
- **Do it yourself (free):** you get the files. You'll need to: pick a hosting company and set up an account, connect your domain (DNS settings), set up the contact form key so messages reach you, make every change yourself, and fix it if something breaks.
- Default the choice to "Yes, host it", keep "No, send me the files" fully available. No scare tactics, just the real list.
- Same comparison in the confirmation text: one line nudging the $15 plan.

## Review (2026-11-25)
Decided: custom site is **from $699**.
- `website-start.html`: "What you get" + money-back block under the deal box; "Want something built just for you?" section below checkout with a reveal form (step `custom`).
- `api/website-start.js`: new step `custom` (tag `website-custom`, note, SMS + email to Devon, no text to the client); details confirmation text now carries the guarantee and the $15/mo hosting nudge.
- `website-details.html`: guarantee line under the header; hosting question is now a side-by-side (We host it $15/mo vs Do it yourself), "Yes, host it" preselected, "Not sure yet" still available.
- Tested: handler run with mocked GHL calls (custom ok, custom missing business 400, details, pick missing look 400, honeypot dropped); both pages loaded and checked at phone width. Not pushed yet.
