---
name: google-profile-audit
description: Audit any local business's Google Business Profile and compare it to the competitors currently outranking it. Use when the user asks why they aren't showing up on Google Maps, why competitors rank above them, what's wrong with their Google listing or Google Business Profile, how to get more calls from Google, or asks for a GBP/GMB audit. Works for any local service business — HVAC, plumbing, roofing, electrical, landscaping, cleaning, auto, medical, legal, restaurants.
---

# Google Business Profile Audit

Scores a local business's Google Business Profile against the three competitors currently
ranking above it, and explains what to fix first.

## When to run it

Run this whenever someone wants to know why they aren't getting calls from Google Maps, why a
competitor outranks them, or what's wrong with their listing. It works on any local business —
including one the user doesn't own, which is useful for checking a competitor.

## What you need before running

Two things, and only two:

1. **Business name** — as it appears on Google, not the legal entity name. "Bay Area Air" not
   "Bay Area Air & Heating LLC". If the audit can't find them, ask them to check the spelling on
   their actual Google listing.
2. **City** — "Tampa, Florida" is ideal. A bare city name works and defaults to Florida, so ask
   for the state if they're anywhere else.

Ask for whichever is missing. Do not guess a city from context — auditing the wrong location
produces a confidently wrong report.

## How to run it

```bash
python3 scripts/audit.py "BUSINESS NAME" "CITY, STATE"
```

The script prints JSON. It needs no API key — it calls a hosted endpoint that holds the
credentials.

## How to report the results

**Check `matched` before anything else.** If the response has `"matched": false`, the audit could
not confirm this is the business the user meant — say so plainly, first, before any score or
comparison: "I couldn't find an exact match for that name. The closest I found was **X**. If
that's not you, check the spelling exactly as it appears on your Google listing and try again."
Do not present the rest of the report as if it's confirmed to be their business when it isn't —
that erodes trust in the whole tool. If `matched` is missing entirely from the response, treat it
the same as `false` rather than assuming a match.

**Lead with the comparison, not the score.** The number that changes behaviour is their review
count next to the businesses beating them. "You have 12 reviews. The three ranking above you have
203, 140, and 89" does more than "you scored 30/100" ever will.

Then:

- Go through the failing checks in weight order — the script returns them scored, so the first
  failures listed matter most.
- For each one, say what it costs them in plain language, not what the setting is called. "No hours
  listed" matters because Google shows "Hours not available" and people call the next result.
- **Give them the order to fix things in.** Most people get a list and do nothing. Tell them what
  to do first, this week.
- Be straight when something is fine. If they scored well, say so — a report that manufactures
  problems reads as a sales pitch and destroys the trust the tool just earned.

If the user asks follow-up questions about a specific finding, answer from the returned data.
Don't re-run the audit for the same business — the results are cached server-side anyway and
re-running tells you nothing new.

## What the checks mean

| Check | Why it matters |
|---|---|
| Profile claimed | Unclaimed means anyone can suggest edits and you can't reply to reviews |
| Primary category | Google is guessing what you do without it — the single biggest ranking factor here |
| Review count vs rivals | The comparison that predicts who gets called |
| Rating 4.5+ | Below 4.5 people stop calling and start comparing |
| Photos (20+) | Listings with real photo volume get materially more calls and direction requests |
| Website linked | Every click that would have reached your site is lost without it |
| Hours filled in | "Hours not available" sends people to the next result |
| Description | Free keyword space sitting empty |

## Limits — state these if they come up

- It reads only what Google shows publicly. It never posts, edits, or touches the listing.
- It can't see Google Business Profile *insights* (calls, searches, direction requests) — those
  are only visible to the account owner inside their own dashboard.
- Photo counts from Maps are approximate.
- If a business is very new or has no reviews, the competitor comparison is thin. Say so rather
  than overstating what the data supports.
