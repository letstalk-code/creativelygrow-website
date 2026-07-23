# Creatively Grow — Website Repositioning Handoff

> **For Claude Code:** This is the authoritative implementation brief for the live site at **https://creativelygrow.com**. Implement this in the root static-site files after reading it fully.

## Goal

Reposition Creatively Grow from a cheap, generic “website + AI automation plans” vendor into a **local-business growth-systems partner**.

The company is deliberately **not niche-locked on the homepage yet.** Two real early client opportunities are already available:

1. A local car-rental business that wants more sales and plans to start SEO work next month.
2. A drug-rehab/addiction-treatment facility owned by the founder’s father, which may benefit from appropriate website, local visibility, and lead-conversion work.

The site must be broad enough to credibly serve both, while still being specific about the outcome:

> **Creatively Grow helps local businesses turn more interest into booked customers with better visibility, conversion paths, and follow-up systems.**

Do not lead with “AI,” a chatbot, voice agent, website design, a free website, or generic SEO. Those are implementation tools, not the thing the customer buys.

---

## Important Repository / Production Context

The deployed production website is a **static site in this repository root**.

**Use these production files:**

- `index.html`
- `styles.css`
- `script.js`
- `assets/`

Do **not** implement this redesign in the nested `creativelygrow-next/` directory. It does not match the deployed production site.

---

## Positioning and Messaging

### Primary audience

Local businesses where a new customer, booked appointment, reservation, or qualified call has meaningful value—and where the owner needs a more dependable way to get found, respond quickly, and convert interest.

Examples may include:

- car rental and travel-adjacent local businesses;
- professional and local service businesses;
- appointment-based businesses;
- compliant healthcare/service organizations where appropriate.

Avoid saying “we work with every local business.” The language should be broad enough for the current two clients but focused on businesses with a measurable conversion path.

### Recommended hero copy

**Eyebrow**

> FOR LOCAL BUSINESSES READY TO GROW WITH A SYSTEM

**Headline**

> TURN MORE LOCAL INTEREST INTO **BOOKED CUSTOMERS.**

**Supporting copy**

> Creatively Grow builds the growth system behind your business: stronger local visibility, focused conversion pages, faster lead follow-up, missed-call recovery, booking workflows, and measurable improvement over time.

**Primary CTA**

> GET MY FREE GROWTH SYSTEM AUDIT →

**Small qualifier**

> For established local businesses that rely on calls, appointments, reservations, or qualified inquiries.

The hero must not include “Starts at $59/month,” “no setup fees,” a guarantee, or a general “Book a Call” CTA.

---

## Offer to Communicate

### Free front-end offer

## Free Local Growth System Audit

The audit is a low-pressure first step. It should review the public customer path and identify practical opportunities across:

- local Google visibility;
- website/landing-page conversion;
- booking or inquiry flow;
- missed-call and speed-to-lead gaps;
- reviews/reputation;
- follow-up and reactivation opportunities.

Do not call it an instant automated report unless that is what the experience truly provides. Do not guarantee rankings, leads, sales, revenue, or a specific result.

### Core offer

## 90-Day Growth System Pilot

This is a **paid, defined engagement**, not free fulfillment and not a self-serve checkout product.

The work is tailored to a client’s priority customer journey:

1. **Audit & priorities** — baseline visibility, conversion path, lead sources, response process, and one priority growth objective.
2. **Build & launch** — improve conversion path, measurement, response/follow-up workflow, local visibility foundation, and any appropriate acquisition test.
3. **Optimize & retain** — use inquiry, booking, and sales feedback to improve conversion, follow-up, reviews, reactivation, and retention.

Advertising, if used, is funded directly by the client through their own Google/Meta account. Do not claim paid advertising is automatic, guaranteed, or appropriate for every client.

Do not display pricing until the owner decides the pilot terms and has evidence to support the offer.

---

## Preserve From the Current Live Website

A live review of `https://creativelygrow.com` was completed before this brief.

Preserve and refine:

1. **The dark premium visual system:** near-black/forest background, subtle grid texture, warm-orange CTA, cream typography, and Oswald/Inter heading hierarchy. It is distinctive and feels more premium than a generic agency template.
2. **The bold editorial hero treatment** and simple primary CTA pattern.
3. **The portfolio-showcase video** in `assets/portfolio-showcase.mp4`, if Creatively Grow has permission to present every example. It demonstrates credible website/conversion work.
4. **The interactive reputation/review demo** only if the workflow is genuine. Make its language business-neutral: “after a completed visit, reservation, or service” rather than “after every job.”
5. **The responsive navigation, clean final form-card composition, and existing mobile behavior.**

---

## Highest-Priority Problems to Fix

### 1. Current message is broad but feature-led

Current copy like:

> YOUR BUSINESS SHOULD RUN ITSELF.
>
> WEBSITE · BOOKING · REVIEWS · AI

is visually strong but still makes Creatively Grow sound like an automation-product vendor. Lead with growth outcomes and use tools as the mechanism.

### 2. Remove the current low-ticket product pricing model

The existing `$59 / $97 / $197` plans, direct payment links, “no setup fees,” “cancel anytime,” and money-back guarantee are incompatible with a hands-on 90-day growth pilot.

Remove:

- all three pricing cards;
- payment links;
- “Starts at $59/month” hero footnote;
- “no setup fees,” “cancel anytime,” and money-back guarantee claims;
- stale structured-data offers with those prices.

### 3. Fix the deployed page’s dead space

The live desktop page has very large empty/near-empty vertical areas between visible sections, particularly after the portfolio showcase and around later sections. Audit `styles.css` for oversized fixed/min-height values, hidden content, animation/opacity rules, and excess spacing. Remove dead zones so each scroll advances a clear narrative.

### 4. Remove or verify unsupported proof

Do not retain the following unless the owner provides authentic documentation, permission, and exact approved wording:

- `Marcus Rivera / Rivera HVAC` testimonial;
- “23 after-hours calls,” “19 booked,” and “$14,200 in jobs”;
- “8,400+ Calls Handled,” “67% Avg. Lead Increase,” “4.9/5 Client Satisfaction”;
- any client relationship or portfolio asset that cannot be substantiated.

Do not replace them with invented testimonials, performance claims, logos, or stock-photo customer identities.

---

## Required Page Architecture

### 1. Navigation

Keep it minimal:

- `How It Works`
- `What We Improve`
- primary CTA: `Get My Free Audit`

Replace “Book a Call” as the universal primary CTA. Calls can still happen after someone requests an audit, but the site should not force a cold visitor into a call first.

### 2. Hero + portfolio showcase

Keep the hero visual language and portfolio showcase structure, but use the new hero copy above.

The showcase can retain multiple vertical examples, with these safeguards:

- portfolio examples must be real and approved;
- labels must not imply results that have not been verified;
- keep the med-spa example, but do not make it appear that Creatively Grow only serves med spas;
- ensure the showcase does not introduce large dead vertical space.

### 3. Replace “What We Build” with outcome-led system cards

**Eyebrow:** `THE GROWTH SYSTEM BEHIND MORE BOOKED CUSTOMERS`

**Headline:**

> FROM LOCAL DISCOVERY TO A REAL CUSTOMER—WITH FEWER LEAKS IN BETWEEN.

Use four cards:

1. **GET FOUND LOCALLY**
   - Improve the local visibility foundation around the services, reservations, or appointments the client wants more of.

2. **TURN INTEREST INTO AN INQUIRY**
   - Create a focused, mobile-first path with a clear offer and a simple booking/contact action—not a generic brochure website.

3. **FOLLOW UP BEFORE THE LEAD GOES COLD**
   - Fast responses, missed-call recovery, booking reminders, and clear handoff so legitimate inquiries do not wait for a reply.

4. **CREATE VALUE AFTER THE FIRST SALE**
   - Review, reactivation, rebooking, and retention workflows that make the first customer more valuable over time.

State paid acquisition accurately in nearby copy:

> Once the conversion path is ready and tracked, we can test client-funded acquisition where it makes business sense.

Do not guarantee SEO rankings or imply paid ads work by copying competitors.

### 4. Replace “Three Steps. Then It Runs Without You.”

Use:

**Eyebrow:** `HOW THE 90-DAY PILOT WORKS`

**Headline:**

> BUILD THE SYSTEM. LAUNCH WITH INTENT. IMPROVE WHAT THE DATA SHOWS.

Steps:

1. **AUDIT & PRIORITIES** — Review customer path, current lead sources, response process, and the most valuable growth opportunity.
2. **BUILD & LAUNCH** — Improve the conversion path, tracking, local foundation, and fast follow-up. Launch only the acquisition activities that fit the client’s readiness and compliance requirements.
3. **OPTIMIZE & RETAIN** — Review inquiry quality and business feedback, then improve conversion, response, reputation, reactivation, and retention.

Qualifier:

> A paid, defined engagement for local businesses that are ready to measure and improve their customer journey. Any advertising budget is funded directly by the client and remains under its control.

### 5. Replace the pricing section

Remove the `rb-pricing` section and direct payment links entirely. The 90-day pilot system/process is the replacement.

### 6. Rework the AI voice section

AI receptionist is an optional operational tool, not the core offer. Replace the standalone AI-demo section with:

**Eyebrow:** `WHAT WE MEASURE`

**Headline:**

> MORE THAN LEADS: THE MOMENTS THAT CREATE A BOOKED CUSTOMER.

Measure/display:

- source of inquiry;
- speed to first response;
- missed calls recovered;
- inquiries and bookings/reservations;
- follow-up status;
- reviews and repeat/rebooking signals.

Mention AI only in body copy as one option when it improves response time, routing, or booking. Remove the standalone AI phone demo unless it is verified, polished, and appropriate for the specific client/use case.

### 7. Adapt the review demo

If retained, make it vertical-neutral:

- “After a completed service, visit, or reservation” rather than “after every job.”
- Replace HVAC-specific names/copy.
- Ensure the flow is truthful and does not suppress, manipulate, or misrepresent reviews.

### 8. Replace testimonial/stats with truthful positioning

Until the company has verified, permissioned case studies, use:

**Headline:**

> MORE TRAFFIC DOES NOT HELP IF THE SYSTEM LOSES THE CUSTOMER.

**Copy:**

> A better website alone is not enough. A business needs a clear path from local discovery to a fast response, a booking or sale, and a reason for that customer to come back. Creatively Grow connects those moments into one measurable growth system.

Do not retain “I’m Devon” unless that is the actual owner identity and it is approved.

### 9. Final audit CTA + embedded GHL form

**Eyebrow:** `FREE LOCAL GROWTH SYSTEM AUDIT`

**Headline:**

> SEE WHERE YOUR BUSINESS MAY BE LOSING CUSTOMERS.

**Body:**

> Request a free growth-system audit. We’ll review your public customer path and identify practical opportunities to improve local visibility, conversion, follow-up, and booking.

Keep the iframe technically intact, but the connected GoHighLevel form must be changed externally before traffic is driven to it. It currently asks visitors to choose a plan, which is stale.

Recommended GHL fields:

- name;
- business name;
- website URL;
- city/service area;
- email;
- phone;
- priority service/product/reservation type they want more of;
- optional: “What happens after a new inquiry arrives today?”

### 10. Metadata and footer

Footer tagline:

> Growth systems for local businesses that want more booked customers.

Update title, meta description, Open Graph content, keywords, and JSON-LD description in `index.html` for the new outcome-oriented positioning. Remove the existing structured-data offer catalog with the old prices until final pilot pricing is approved.

---

## Current Two Pilot Opportunities: Implementation Context

### Car rental business

This is the best first growth-system pilot because it has a clear commercial path:

- local search → reservation inquiry/booking;
- clear sales/revenue feedback;
- natural website/booking/SEO/conversion work;
- review and repeat/returning-renter opportunities.

Do not promise that “SEO next month” automatically produces sales. Build a baseline first: current rankings/visibility, Google Business Profile, conversion/booking flow, call/form source tracking, fleet availability/priority locations, and what a profitable reservation looks like. Then implement focused local SEO and conversion work, with paid acquisition only if unit economics and tracking support it.

### Addiction-treatment / drug-rehab facility

This can be a valuable internal/warm-client opportunity, but it is **not the first low-risk paid-ad pilot**.

Google’s current healthcare policy explicitly restricts promotion of recovery-oriented drug and alcohol addiction services. In allowed locations, advertisers must be certified by Google to run those ads. Treat paid acquisition, data handling, CRM/automation, calls, and intake workflows as a compliance-sensitive project.

Before any paid advertising or automation involving prospective-patient information:

- confirm the facility’s Google certification/status and applicable state/local requirements;
- establish who approves claims, landing-page copy, and intake workflows;
- do not use unreviewed AI to give medical guidance or handle sensitive clinical information;
- confirm privacy/HIPAA obligations and whether every vendor/tool has the needed agreement and configuration;
- prefer foundational website, local visibility, measurement, and compliant conversion work until this is clear.

The public Creatively Grow site should not name the facility or advertise addiction-treatment marketing as a generic service.

---

## Guardrails

- No “free website” offer.
- No price, money-back guarantee, fixed lead count, ranking promise, revenue promise, or pay-per-job claim.
- No fake testimonials, fake stats, fake logos, or stock-photo people presented as clients.
- Do not lead with AI, chatbots, voice agents, automation, or generic SEO.
- Do not claim the business can “run itself.” Automation supports the team; it does not replace accountability.
- Do not market addiction-treatment services or use sensitive patient information without the required certifications, approvals, and privacy controls.

---

## Validation Checklist

- [ ] Work is implemented in the root production static files, not `creativelygrow-next/`.
- [ ] Hero and CTAs describe booked-customer outcomes and a free growth-system audit.
- [ ] Homepage is broad enough for current car-rental and compliant healthcare/service clients, without claiming to serve everyone.
- [ ] Old $59/$97/$197 plans, checkout links, old guarantees, stale structured-data offers, and “Book a Call” primary CTA are removed.
- [ ] The 90-day paid pilot and client-funded advertising are described accurately.
- [ ] Unsupported proof/metrics/testimonials are removed unless verified.
- [ ] The external GHL form is flagged for required field/copy updates.
- [ ] Large empty desktop layout gaps are fixed.
- [ ] Desktop and mobile are manually tested; primary CTA and iframe form still work.
