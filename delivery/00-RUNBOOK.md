# Client Delivery Runbook

**What this is:** the order of operations from signed to live. Every step names an owner and links to
the template. Nothing here is invented per client — it's filled in.

**How it starts:** Devon completes intake, then tells Claude *"new client: [name]"*. Nothing
auto-detects a new client.

---

## The map

```
SIGNED
  │
  ├─ Day 0    Intake (GATE — nothing proceeds until complete)          Devon
  │
  ├─ Day 1-2  SEO audit + baseline capture                             Claude
  │           Treatment + ad concepts                                  Claude
  │           GHL sub-account + snapshot push                          Devon
  │
  ├─ Day 3-7  Landing page built                                       Claude
  │           Shoot scheduled                                          Devon
  │
  ├─ Day 8-14 SHOOT DAY                                                Devon
  │           Edit                                                     Devon
  │
  ├─ Day 15   Ads built from footage                                   Claude + Devon
  │           Tracking + lead scoring wired                            Claude
  │
  └─ Day 16   LAUNCH ─────────────────────────────────────────────────┐
                                                                       │
              Then: 90-day pilot. Weekly check, monthly report.        │
```

---

## Phase 0 — Intake `[GATE]`

**Owner: Devon.** Nothing downstream starts until this is complete. This gate exists because the
single most common way these engagements die is waiting three weeks for a client's Google login.

→ `01-intake.md`

Collect: business details, GBP access, domain/DNS access, brand assets, offer + pricing, service area,
top 3 services, **who answers the phone**, current review count, ad account access.

**Do not skip the "who answers the phone" question.** If nobody does, that's the first thing to fix and
it changes the whole engagement.

---

## Phase 1 — Foundation (Day 1–2)

**Claude:** run the SEO audit on their site → `01b-seo-audit.md`
`/seo-audit https://clientsite.com` + `/seo-local`. Do this **first** — the findings feed the landing
page, the GBP fixes, and the Day-90 baseline. **Capture the baseline numbers before changing anything**,
or there's nothing to compare against at the end.

**Claude:** write the video treatment from intake → `02-video-treatment.md`
**Claude:** draft 3 ad concepts against the angle bank → `03-ad-creative.md`

**Devon:** create the client's GHL sub-account, push the **Client Delivery** snapshot, then swap the
three per-client values → `05-ghl-snapshot.md`

| Value | Set to |
|---|---|
| `google_review_link` | client's real Google review URL |
| `review_funnel_url` | `https://creativelygrow.com/review-funnel` |
| `review_funnel_webhook` | the client sub-account's inbound webhook |

**Devon:** confirm missed-call text-back is on for the client's number. This is the highest-return
thing in the whole system and it works from day one, before any traffic exists.

---

## Phase 2 — Build (Day 3–7)

**Claude:** landing page from the closest vertical template → `04-landing-page.md`
Existing starting points: `demos/demo-hvac.html`, `demo-plumber.html`, `demo-salon.html`,
`epoxy.html`, `pool-cage.html`.

Required on the page: finished work, honest price/timeline ranges, the process, one obvious way to
make contact repeated down the page. Form posts into the client's GHL sub-account.

**Devon:** schedule the shoot. Send the call sheet from the treatment.

---

## Phase 3 — Production (Day 8–14)

**Devon:** shoot. **Devon:** edit.

Deliverables: 16:9 brand story master, 9:16 cutdowns for ads, a 6s bumper.
Shoot the vertical cutdowns *on the day* — reframing later is always worse.

---

## Phase 4 — Traffic (Day 15)

**The channel rule** → `06-traffic.md`

> **Client took video ads → Meta.** Creative is the targeting; the film is the unfair advantage.
> **Client declined video ads → Google.** Intent already exists; capture it instead of creating it.

**Claude:** campaign structure, budget floor needed to reach a verdict, kill/promote rules.
**Claude:** server-side lead scoring, so the algorithm optimizes for good leads and not any form submit.

**Before spending a dollar, confirm:** calls get answered or texted back, the page loads fast on
mobile, and the form actually lands in GHL. Ads into a leaking path are a donation.

---

## Phase 5 — Launch and run

**Day 16: live.**

Then the 90-day pilot:
- **Weekly:** check the six measures, adjust creative, kill losers
- **Monthly:** client report → `07-reporting.md`
- **Day 30:** first real read on cost per booked job
- **Day 90:** pilot review — continue, change, or stop, with the arithmetic on the table

The six measures (already promised on `/how-it-works`): source of inquiry, speed to first response,
missed calls recovered, inquiries and bookings, follow-up status, reviews and repeat signals.

---

## Rules

1. **Intake is a gate, not a form.** No production before it's complete.
2. **Fix answering before buying traffic.** Every time.
3. **Never promise a ranking or a lead volume.** Promise the system and the measurement.
4. **One vertical template per client** — don't start a landing page from scratch.
5. **Client owns their GHL sub-account data.** Never cross-contaminate between clients or with the
   agency account.

---

## Status

| Doc | State |
|---|---|
| `00-RUNBOOK.md` | ✅ this file |
| `01-intake.md` | ✅ |
| `01b-seo-audit.md` | ✅ |
| `02-video-treatment.md` | ✅ (b-roll included) |
| `03-ad-creative.md` | ✅ |
| `04-landing-page.md` | ✅ |
| `05-ghl-snapshot.md` | ⏳ Hermes building live |
| `06-traffic.md` | ✅ |
| `07-reporting.md` | ✅ |
