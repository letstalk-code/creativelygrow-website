# Phase 2 — Landing Page

**Owner: Claude builds, Devon reviews and pushes DNS.**

---

## What already exists — and what it isn't

Checked the repo before writing this. Two different things exist and neither is a ready-made client
template as-is:

| Files | What they actually are |
|---|---|
| `demos/demo-hvac.html`, `demo-plumber.html`, `demo-salon.html` | **Visual references only.** Hero, services grid, CTA band, footer. No form, no GHL wiring. Good for structure and styling; not wired for leads. |
| `epoxy.html`, `pool-cage.html` | **Creatively Grow's own outbound tool** — the "leak check" offer, posting to `/api/leak-check`. This sells *Creatively Grow's services*, not the client's. Do not clone this as a client page. |

**So every client landing page needs its own lead form built and wired.** The demos give you the look;
they don't give you the function. Budget for that — it's not a copy-paste.

---

## Structure

One page, five sections. Do not build more; a contractor's landing page that's twenty pages loses to
one that answers the four questions fast.

### 1. Hero
- Headline: the angle from `03-ad-creative.md` #1 — same words as the ad that brought them here.
  **Mismatch between ad and headline is the single biggest silent conversion killer.**
- One line sub-headline: the specific (service area, or the honest range)
- One button: the same CTA text as everywhere else in the funnel
- Background: a still from the shoot, never stock

### 2. The work
- 6–12 photos of finished jobs, real, from the shoot
- If pre-launch and no shoot yet: 3–4 from intake §5, clearly captioned with real job details
- **Never a stock photo of a smiling stranger.** It's the fastest way to look fake.

### 3. How it works / the process
- 3–4 steps, plain language, matching what intake said actually happens
- This section exists to answer "will they disappear halfway" — the fear from the treatment

### 4. Honest ranges
- Price range and typical timeline per service, from intake §2
- State it. Most competitors won't, which is why saying it is an advantage, not a risk.

### 5. Contact
- Form: name, phone, one-line "what do you need"
- Phone number, click-to-call
- Embed the offer spot here too (or the longer brand story cut, if one exists) — this is where
  undecided traffic lands

---

## The form — build this per client

Two ways to wire it. Pick one per client, don't mix.

**A. Direct to their GHL sub-account (default).** A plain form posting straight to the client's
inbound webhook. Simplest, and it's their data in their CRM from day one.

**B. Multi-tenant page, URL-param wired** — the pattern already proven on `review-funnel.html` and
`client-intake-form.html`. One hosted page, `?business=&webhook=` per client. Worth it only if you
expect to spin up landing pages fast and don't want a new file per client. Skip this for the first few
clients — build direct until the volume justifies the extra layer.

**Either way, non-negotiable:**
- Submit button disables on click, shows a status message — no double-submits
- Success state confirms *and* tells them what happens next ("we'll text you within the hour")
- Never a dead end on network failure — same fallback pattern as `client-intake-form.html`
  (fall back to a pre-filled `mailto:` rather than losing the lead)
- `robots.txt`: no `Disallow` needed here — unlike the intake form, you want this one indexed

---

## Build steps

1. Pull the closest visual reference from the three demos, or start from the editorial system in
   `creativelygrow-next/app/blog/blog.css` if the client's brand leans that direction
2. Swap in the client's brand tokens — colors, logo, fonts if they have them
3. Write the five sections from intake + the SEO audit's findings (`01b-seo-audit.md`) — the audit
   tells you what the old page was missing
4. Build and wire the form (above)
5. Add the client's schema: `LocalBusiness`, correct `areaServed`, no fabricated `PostalAddress` if
   they're a service-area business — see the fix already made to `index.html` for the pattern
6. Mobile pass — most of this traffic is a phone, test at 375px width before anything else
7. Page speed check — a slow page kills paid traffic before it converts

---

## Rules

1. **Ad copy and page headline must match.** Write them together, not separately.
2. **No stock photography, ever.** Real work or nothing.
3. **One page, five sections.** Resist adding more.
4. **State the price range.** Hiding it costs more leads than it protects.
5. **Test on a phone before launch.** Not the browser dev-tools mobile view — an actual phone.
