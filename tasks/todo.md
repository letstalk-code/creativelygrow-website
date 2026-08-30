# Studio: share a single video + real link previews

## The two asks
1. Share one video from a gallery, not just the whole gallery.
2. When that link is texted, the preview card shows what is actually being sent.

## The constraint behind #2
Link previews (iMessage, WhatsApp, Slack, Facebook) are built by a crawler that
fetches the URL and reads `<meta property="og:...">` tags **out of the HTML**.
Crawlers do not run JavaScript.

`/g` today is a static shell that fetches everything client-side and has no OG
tags at all, so a texted gallery link previews as a bare URL. No amount of
client-side work can fix that — the tags have to be in the HTML the server sends.
So the share pages have to be server-rendered.

## Approach

### The share page becomes a function
- New `api/share.js` renders both share pages server-side. It looks the gallery
  (or single video) up in Supabase and emits a small HTML document: a real
  `<head>` with the correct title/OG tags, plus the data preloaded into the page
  as JSON so the browser does not re-fetch it.
- The page body and all rendering logic move out of `g.html`'s inline script into
  a normal static `share.js`. That keeps the markup out of JS template strings
  and leaves one copy of the render code. The function only emits a `<head>`
  and one empty `<div>`.

### Routes (no collisions with static files)
- `/s?c=<slug>` — whole gallery
- `/v?c=<slug>&g=<guid>` — one video
- `/g` redirects to `/s`, preserving the query, so links already texted to
  clients keep working *and* start previewing properly.

Both new routes are rewrites to the function. Neither has a static file at that
path, which matters: Vercel checks the filesystem before applying rewrites, so a
rewrite for `/g` would never fire while `g.html` exists.

### What the preview will actually show
- **Single video** — title: the video's title (the one set in the studio).
  Image: `https://<bunny-cdn>/<guid>/thumbnail.jpg`, which is the *same* poster
  the thumbnail upload sets. So the preview image is literally the thumbnail
  chosen for that video.
- **Whole gallery** — title: the gallery title or client name. Description: the
  note to the client. Image: the first video's thumbnail.

### Studio
- Each video card gets a "Copy link" button that copies its `/v` URL.
- The gallery's existing share box switches to the `/s` URL.

## Files
- `api/share.js` — new, server-rendered share pages
- `api/studio.js` — new public `video` action (one video by slug + guid)
- `share.js` — new, render logic moved out of `g.html`
- `g.html` — reduced to a redirect for anyone hitting the old file directly
- `vercel.json` — `/s` and `/v` rewrites, `/g` redirect
- `studio.js` / `studio.css` — per-video Copy link button

## Judgment calls (say if you disagree)
- **Single video share is by Bunny guid**, matching how the download endpoint
  already scopes a video to its gallery. Same privacy model: the guid only works
  for the gallery it belongs to.
- **Videos stay unlisted, not secret.** A `/v` link is shareable by anyone who
  has it, exactly like the gallery link is today. Both stay `noindex`.
- **Old `/g` links keep working** via redirect rather than being broken.

## Todo
- [x] api/studio.js: public `video` action
- [x] share.js: move render logic out of g.html, handle single-video mode
- [x] api/share.js: server-rendered head + OG tags for both modes
- [x] vercel.json: routes
- [x] g.html: redirect to /s
- [x] studio: per-video Copy link, gallery link -> /s
- [x] Verify: preview tags, both pages, old links, then report

## Review

### New files
- **`api/share.js`** — renders both share pages server-side. Looks the gallery up,
  builds a real `<head>` with OG/Twitter tags, and preloads the data into the page
  as JSON so the browser does not re-fetch what the server already read.
- **`share.js`** — the render logic, moved out of `g.html`'s inline script. Handles
  gallery mode and single-video mode. Falls back to fetching if the server could
  not preload; shows the "not found" message directly when the server already
  resolved the link and found nothing.

### Changed
- **`api/studio.js`** — public `video` action: one video by slug + guid, scoped so
  a guid from another gallery returns 404.
- **`studio.css`** — absorbed `g.html`'s inline styles, plus the Copy link button.
- **`vercel.json`** — `/s` and `/v` rewrite to the function; `/g` redirects to `/s`.
- **`g.html`** — now just a redirect to `/s`, preserving the query.
- **`studio.js`** — per-video Copy link button; gallery link and Preview use `/s`.

### Why /g became a redirect rather than a rewrite
Vercel checks the filesystem *before* applying `rewrites`, so a rewrite on `/g`
would never fire while `g.html` exists. Redirects run *before* the filesystem, so
`/g` -> `/s` fires reliably and old client links keep working.

### What a texted link now previews as
- **One video** — title is the video's title; image is
  `https://<bunny-cdn>/<guid>/thumbnail.jpg`, which is the same URL the Thumbnail
  button writes to. The poster set in the studio *is* the preview image.
- **Whole gallery** — title is the gallery title, description is the note to the
  client, image is the first video's thumbnail.

### Layout change
The video card's title now takes its own row at every width, not just on mobile.
With five controls, cards sitting two-up on a desktop could not fit them on one
line either. Arrows / Copy link / Thumbnail sit left, Remove sits right.

### Verification
- Ran `api/share.js` directly against a fake Supabase and read the emitted HTML:
  correct title, description, og:image, og:url and og:type for gallery mode,
  single-video mode, and a guid belonging to another gallery (404, nothing leaked).
- Served the real function plus the real static files in a browser: single-video
  page shows one film with its own title and a link back to the gallery; gallery
  page renders exactly as before; an invalid guid shows the not-found message
  without re-fetching; `g.html?c=...` lands on `/s?c=...` and renders.
- Re-ran the reorder, rename and thumbnail flows after the refactor — all still
  work, and the Copy link button produces `/v?c=<slug>&g=<guid>`.
- Checked desktop two-column and mobile layouts.

Not exercised against live Supabase/Bunny. The first real check worth doing is
texting yourself a `/v` link and confirming the card shows the film's thumbnail.
