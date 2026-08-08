# Phase 1 — SEO Audit

**Owner: Claude.** Runs the moment intake gives us a URL. Output feeds three later steps, so do it
before the landing page, not after.

This is the "Audit & Priorities" phase that `/how-it-works` already promises clients: *"You'll know
exactly what's leaking before we build anything."*

---

## Run these

**Every client:**
```
/seo-audit https://clientsite.com
```
Full crawl, detects business type, delegates to specialists, returns a health score.

```
/seo-local
```
The one that actually matters for these clients — GBP signals, NAP consistency across citations,
review velocity, local schema, service-area setup.

**Add when relevant:**
| Skill | When |
|---|---|
| `/seo-technical` | site is slow, JS-heavy, or won't index |
| `/seo-schema` | no structured data, or it's broken |
| `/seo-content` | they have a blog or service pages already |
| `/seo-geo` | they want AI Overview / ChatGPT visibility |

**No website yet?** Skip the audit, run `/seo-local` against the GBP alone, and go straight to
building. Note it in the report so the Day-90 review isn't comparing against nothing.

---

## What the output feeds

1. **The landing page** (`04-landing-page.md`) — what's broken tells you what the new page must fix.
2. **GBP fixes** — categories, services, service area, NAP mismatches. Usually the fastest wins on the
   whole engagement and they cost nothing.
3. **The baseline** (`07-reporting.md`) — **capture the numbers on day one.** Health score, indexed
   pages, review count, current rankings. Without a baseline the Day-90 review is an opinion.

---

## Deliver to the client

A short written summary, not the raw dump. Three sections:

- **What's leaking** — plain language, no jargon. "Your site doesn't tell Google what city you serve."
- **What we're fixing in the pilot** — mapped to the 90 days
- **What we're not fixing, and why** — the things that don't matter for their business

Keep it to a page. The audit tool produces a lot; most of it is noise to a contractor.

---

## Rules

1. **Never send the raw tool output to a client.** It reads as intimidating and unfocused.
2. **Never promise rankings** off the back of an audit. Report what's broken and what you'll do.
3. **Capture the baseline before touching anything.** Once you start fixing, the before-picture is gone.
4. **Local beats technical for these clients.** A perfect Core Web Vitals score on a business with 3
   reviews and a wrong GBP category is worthless. Sequence accordingly.
