# Brief for Hermes — build the 6 REP workflows in Creatively Grow

**Hand this whole file to Hermes.** It is self-contained.

## Context

Build the Google Reputation System workflows in the **Creatively Grow** GHL sub-account so they can be
captured as a reusable snapshot and pushed to every future client sub-account.

- **Location ID:** `xwddXAWgoJtFg4qpBO3u`
- **Full build spec:** `/Users/labiffilmhouse/Desktop2/creativelygrow-clone/Google_Reputation_System_Workflow_Guide.md`
  — read this first. It has every trigger, action, wait, condition, and message body written out verbatim.
- You built the equivalent for Labif Filmhouse already (`Review Request Alert and Send`, location
  `NzbVVSNFa2G2M2oCiRWD`). Same pattern.

## Why this is a Hermes job

Claude Code cannot do it: the GHL API has no workflow-create endpoint, and GHL's workflow builder runs
in an iframe that browser automation can't reach (tested 2026-08-07 — clicks and keystrokes don't
register, accessibility tree is empty).

## What already exists — do NOT rebuild

- **Review funnel page:** live at `https://creativelygrow.com/review-funnel`. Already multi-tenant —
  takes `business`, `google`, `webhook`, `contact_id`, `name`, `email`, `phone` as URL params.
  Gate is `rating >= 4` → Google, else → private feedback form.
- **10 custom values** already staged in `xwdd` as placeholders (`google_review_link`,
  `review_funnel_url`, `review_funnel_webhook`, `total_reviews`, `avg_rating`, `reviews_this_month`,
  `response_rate`, plus 3 others). Leave them as placeholders — they get overwritten per client.
- Per the guide, the 13 tags, 10 custom fields, and 6 email templates are also already created.
  **Verify before creating duplicates.**

## Build these 6 workflows

Names must use the **`REP - `** prefix exactly. This is load-bearing: the account also holds 15 of
Creatively Grow's own marketing workflows (VAPI, cold outreach, Smart Website alerts, Day-30 upsell),
and the prefix is what makes the snapshot selection unambiguous. **None of CG's own workflows may ever
end up in the client snapshot.**

1. `REP - Review Request After Service`
2. `REP - Positive Review Handler`
3. `REP - Negative Review Handler`
4. `REP - Neutral Review Handler`
5. `REP - Monthly Reputation Report`
6. `REP - Review Request Exclusion Guard`

Take the trigger, steps, waits, conditions, and message copy verbatim from the guide. Do not improvise
copy or restructure the logic.

## Constraints

- **Do not modify, rename, pause, or delete any existing workflow.** Only create new `REP - ` ones.
- **Leave every new workflow in Draft.** Devon publishes after reviewing. Nothing should be able to
  message a real contact while this is being built.
- Do not touch the Labif (`NzbVVSNFa2G2M2oCiRWD`) or Frontdesk (`S3yIQK5DykJA8OuXNz2f`) accounts.
- Do not create the snapshot yourself — Devon does that step once the workflows are reviewed.

## Also check while you're in there

**Missed-call text-back.** Settings → Phone Numbers → the CG number. Is it enabled natively, or does it
need a workflow? It's sold on creativelygrow.com as a core deliverable but appears nowhere as a
workflow in either account. Report what you find; don't enable or change it.

## Report back

Per workflow: name, trigger, step count, draft status. Then the missed-call text-back finding, and
anything in the guide that was ambiguous or that you had to interpret.
