# Phase 4 — Traffic

**Owner: Claude builds the structure, Devon runs the account.**

**Do not spend a dollar before this checklist passes.** Ads into a leaking path are a donation, not
an investment.

---

## Pre-flight — every client, no exceptions

- [ ] Someone answers the phone, or missed-call text-back is confirmed live
- [ ] Landing page loads fast on an actual phone, not just dev-tools mobile view
- [ ] The form submission actually lands in the client's GHL sub-account — test it yourself
- [ ] Ad copy and landing page headline use the same words (`03-ad-creative.md` rule)
- [ ] Tracking is wired: source of inquiry has to be attributable per channel from day one

If any box is unchecked, fix it before launch. A week's delay here is cheaper than a month of ads
into a page nobody can load.

---

## The channel decision

Set once, at intake §2.4, and it doesn't change mid-pilot without a real conversation.

> **Client took video ads → Meta.**
> The film is the unfair advantage. Creative-led targeting works because the ad itself pre-qualifies
> the viewer — someone who watches 8 seconds of an epoxy floor going down is already self-selecting.
>
> **Client declined video ads → Google.**
> Intent already exists in the search. Capture it instead of trying to create it with a feed ad nobody
> asked for.

**Why not both from day one:** splitting a local budget across two platforms means neither gets enough
volume to produce a real signal. Pick one, get a verdict, then consider adding the second once the
first is proven.

---

## Meta structure

**Campaign:** one, objective = Leads (on-platform form or to the landing page — test both if budget allows past month one).

**Ad sets:** by angle, not by demographic slice. A local business audience is small; slicing it further
kills volume before the algorithm can learn.

- Ad set 1 — broad, no interest targeting beyond location + trade-adjacent, radius from `service_area`
- Ad set 2 — retargeting: site visitors + video viewers ≥50%, last 30 days

**Ads per set:** the 2 video cuts + static from `03-ad-creative.md`, run together, let the platform
allocate spend. Don't hand-pick a "winner" before it has real impressions.

**Budget floor to reach a verdict:** roughly 50 leads' worth of spend before judging an angle. Below
that, you're reading noise. If the local CPL is unknown, start at $30–50/day and recalculate after
week one.

## Google Ads structure

**Campaign type:** Search, not Performance Max, for the first 90 days. PMax obscures what's working;
a new account needs to see it.

**Keywords:** service + city, tight match types. Pull the highest-intent terms from the SEO audit
(`01b-seo-audit.md`) rather than guessing.

**Ad groups:** one per service from intake §2.1, not one giant group. Tighter groups → higher quality
score → cheaper clicks.

**Assets:** 15 headlines / 4 descriptions from `03-ad-creative.md` Step 5, sitelinks to landing page
sections, callouts for anything intake confirmed as true (licensed, insured, years in business).

**Negative keywords from day one:** "jobs," "how to," "DIY," "free," "cheap" — filters the browsers
and job-seekers before they cost a click.

---

## Lead scoring — wire this before spending

The point: the algorithm should optimize for **a real customer**, not for any form submit. An
unscored funnel teaches the platform to bring you more of whatever fills the form cheapest — which is
often junk.

**Server-side, at minimum:**
1. Tag every lead in GHL by source (ad platform + campaign + ad)
2. Fire a conversion event back to the platform only when a lead is qualified — not at form submit
   - Meta: Conversions API, a "Qualified Lead" custom event
   - Google: offline conversion import, or a GHL → Google Ads integration if available
3. Qualified = a real human criterion agreed with the client at intake — e.g. "booked an estimate,"
   not "filled a form." Get this definition in writing before launch.

**Without this, month one looks great and month three looks terrible** — the algorithm optimized for
cheap form fills, which are disproportionately unqualified once real spend flows toward what it thinks
is working.

---

## Kill / promote rules

Check weekly, not daily — a local budget doesn't produce daily-significant data and reacting to noise
wastes spend chasing it.

**Kill an ad when:**
- Spend has passed the budget floor above with no qualified lead
- CTR sits meaningfully below the account average after real impressions, not the first 100

**Promote an ad when:**
- Cost per *qualified* lead is best in the set — not cheapest form-fill, cheapest qualified
- Reallocate budget toward it rather than launching something new

**Kill a channel (not just an ad) when:**
- After the full budget floor, cost per qualified lead is clearly worse than the client's stated
  acceptable range from intake §2.5 — and the creative variable has already been tested, so it isn't
  a creative problem in disguise

---

## Rules

1. **Fix answering before buying traffic.** Repeated because it's the rule most often skipped.
2. **One channel first.** Prove it, then consider the second.
3. **Score for qualified, not for form submits.** Otherwise the algorithm optimizes against you.
4. **Weekly review, not daily.** Local volume doesn't support daily decisions.
5. **Never promise a lead volume or a ranking.** Promise the structure and the measurement — see
   `07-reporting.md`.
