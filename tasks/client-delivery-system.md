# Client Delivery System — the "bam bam bam" kit

**Goal:** when a client signs, nothing is invented. Everything is a template with the client's name
dropped in. Delivery becomes assembly.

Status: **PLAN — awaiting approval.** Nothing built yet.

---

## 1. Inventory — what already exists

Checked the repo and both GHL accounts on 2026-08-07.

### ✅ Built and reusable

| Asset | Where | Notes |
|---|---|---|
| Review funnel page | `review-funnel.html` (522 lines) | Gated: 4–5★ → Google, 1–3★ → private feedback form. Takes `business`, `google`, `webhook`, `contact_id`, `name` as URL params, so it's **already multi-tenant** — one page serves every client |
| Reputation build spec | `Google_Reputation_System_Workflow_Guide.md` | Full spec: 6 workflows, 13 tags, 10 custom fields, 6 custom values, 6 email templates, plus snapshot instructions |
| Landing page demos | `demos/demo-hvac.html`, `demo-plumber.html`, `demo-salon.html`, `epoxy.html`, `pool-cage.html` | Five working vertical templates |
| Onboarding docs | `GMB_Onboarding_Kit.html`, `client-onboarding-templates/GMB_Template.html`, `Stripe_Template.html` | Client-facing setup collateral |
| Offer page | `content-day.html` | |
| Fast follow-up pattern | Labif GHL `Meta Lead Instant Response` (published) | Clonable |
| Review request pattern | Labif GHL `Review Request Alert and Send` (published) | Clonable |
| Site + CRM scaffold | `branded-site-crm` skill | Next.js + GHL wired, brand-tokens file per client |
| Content generation | `contentstudio` skill | On-brand social/ad creative |
| Ad structure method | `meta-ads-agent` skill | Angle bank, testing→winners structure, lead scoring |

### ❌ Actually missing

1. **The 6 REP workflows are NOT built.** The guide says *"Once all 6 workflows are built in the GHL
   UI"* — it's a build spec, not documentation of something live. No `REP -` workflow exists in the
   agency account (`xwdd`) or Labif (`NzbV`).
2. **Missed-call text-back** — no workflow by that name in either account. May exist as GHL's native
   phone-number setting rather than a workflow. **Needs confirming before we claim we sell it.**
3. **Video treatment template** — nothing exists.
4. **Ad creative templates** (2 video + 1 static) — nothing exists.
5. **The master runbook** — no single document sequencing any of it.
6. **Meta vs Google decision rule** — not written down anywhere.

---

## 2. What gets built

### A. The Runbook — `delivery/00-RUNBOOK.md`
The spine. Day-by-day from signed to live, with every artifact linked and an owner per step.
Everything below hangs off it.

### B. Intake — `delivery/01-intake.md`
One form/checklist that captures everything needed so nothing stalls later: business details, GBP
access, domain/DNS, brand assets, offer and pricing, service area, top 3 services, who answers the
phone, existing review count, Meta/Google ad account access.

**The gate:** no production starts until intake is complete. This is what prevents the 3-week
"waiting on the client" hole.

### C. Video treatment — `delivery/02-video-treatment.md`
Fill-in-the-blank brand story treatment: premise, the one thing the viewer should believe after
90 seconds, shot list by scene, interview questions, b-roll list, location/timing notes, deliverable
spec (16:9 master, 9:16 cutdowns, 6s bumper). Plus the shoot-day call sheet.

### D. Ad creative — `delivery/03-ad-creative.md`
Three templates against the same angle bank:
- **Video ad A — problem/agitate** (9:16, 15–30s, hook in first 2s)
- **Video ad B — proof/authority** (9:16, uses brand-story footage)
- **Static ad** (1:1 + 4:5, one claim, one CTA)

Built on the `meta-ads-agent` angle-bank method so creative is the targeting, not an afterthought.

### E. Landing page — `delivery/04-landing-page.md`
Which of the five existing demos to start from per vertical, the required sections (finished work,
honest ranges, process, one obvious contact path), the brand-token swap, and the GHL form wiring.
Uses `branded-site-crm` when the client needs a full site rather than one page.

### F. GHL client snapshot — `delivery/05-ghl-snapshot.md`
**This one should be a real GHL snapshot** — it's the native deploy mechanism and turns the whole CRM
side into one click per client.

**Build it in the Creatively Grow agency account (`xwddXAWgoJtFg4qpBO3u`), not a fresh sub-account.**
The template scaffolding is already there: the 10 reputation custom values exist in `xwdd` and are
already **placeholders**, not CG's real data (`google_review_link` = `https://g.page/r/YOUR-BUSINESS-ID/review`,
`review_funnel_url` = `https://YOUR-DOMAIN.com/review-funnel.html`, counters at 0). That is exactly
what a snapshot source should look like.

> **The one hazard:** `xwdd` also holds 15 of CG's *own* marketing workflows — VAPI, cold-outreach
> drips, Smart Website alerts, the Day-30 upsell. None of those can ever ship to a client.
> **Mitigation: prefix every kit workflow with `REP -`** (as the existing guide already specifies).
> At snapshot time, tick only the `REP -` items. Naming does the safety work so nobody has to
> remember which of 21 workflows is which.

Contents:
- The 6 REP workflows from the existing spec (built once, in a template sub-account)
- Missed-call text-back (confirm native setting vs workflow first)
- Fast-lead-response, cloned from Labif's `Meta Lead Instant Response`
- Tags, custom fields, custom values, email templates per the spec
- Per-client variables to swap: `google_review_link`, `review_funnel_url`, `review_funnel_webhook`

### G. Traffic — `delivery/06-traffic.md`
The decision rule, written down:

> **Client took video ads → Meta.** Creative is the targeting; video is the unfair advantage.
> **Client declined video ads → Google.** Intent already exists; capture it instead of creating it.

Plus per-channel: campaign structure, budget floor needed to reach a verdict, kill/promote rules,
and server-side lead scoring so the algorithm optimizes for good leads, not any form submit.

### H. Reporting — `delivery/07-reporting.md`
The six things `/how-it-works` already promises to measure — source of inquiry, speed to first
response, missed calls recovered, inquiries/bookings, follow-up status, reviews/repeat. Where each
number comes from and the weekly/monthly client-facing format.

---

## 3. Build order

1. **Confirm missed-call text-back** — is it native GHL or does it need building? Everything else
   assumes an answer.
2. **Runbook + intake** (A, B) — the spine and the gate. Useful immediately, even alone.
3. **Video treatment + ad creative** (C, D) — the part only Devon can execute, so it should exist first.
4. **GHL snapshot** (F) — biggest single time-saver per client. Needs a template sub-account.
5. **Landing page + traffic + reporting** (E, G, H).

## 4. Open questions

- ~~Template sub-account for the snapshot~~ — **resolved 2026-08-07: build in `xwdd`.** The reputation
  custom values are already staged there as placeholders. `REP -` prefixing keeps CG's own 15
  workflows out of the snapshot.
- **Pricing/scope per tier** — does the kit assume the full 90-day pilot, or should there be a
  smaller "video only" and "system only" variant?
- **A2P 10DLC** — SMS in a client's sub-account needs registration. There's an `a2p-compliance`
  folder in the Labif repo; worth checking whether that process is documented and how long it takes,
  since it can block launch by days.

## Review

*(to be filled in as work completes)*
