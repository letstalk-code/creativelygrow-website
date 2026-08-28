# Studio galleries: reorder, rename, custom thumbnails

## Goal
On /studio, inside a client gallery, let Devon:
1. Move videos up/down to set the order the client sees
2. Rename a video's title
3. Upload a custom thumbnail for each video

## Approach (minimal, no new dependencies)

### 1. Reorder
- Each video card gets ▲ / ▼ buttons.
- Client-side swaps the two rows, then POSTs the full ordered id list.
- New API action `reorder-videos`: writes `sort_order = 0..n-1` for the given ids
  (PATCH per row; already how the rest of the file talks to Supabase).
- `/g` already reads `order=sort_order.asc`, so the client view follows for free.
- No schema change — `sort_order` already exists.

### 2. Rename
- Title in the card becomes an inline text input; blur/Enter saves.
- New API action `rename-video`: PATCH `gallery_videos.title`.
- No schema change.

### 3. Thumbnail
- "Thumbnail" button on each card opens a file picker (image only).
- Reuse the existing presigned-PUT flow (`photo-upload-init`) with a new
  `kind: 'thumb'` so the path is `thumbs/<guid>-<rand>.<ext>` instead of
  landing in the gallery's photo folder. Random suffix busts CDN cache.
- New API action `set-thumbnail`: after the browser PUTs the image, the server
  calls Bunny `POST /library/{lib}/videos/{guid}/thumbnail?thumbnailUrl=<public url>`.
- Bunny then serves that as the player poster, so **g.html needs no change** —
  the client gallery picks it up automatically.
- No schema change.

## Files touched
- `api/studio.js` — 3 new actions + `kind` param on photo-upload-init
- `studio.js` — card UI: arrows, editable title, thumbnail button
- `studio.css` — styles for the new controls
- `studio.html` — cache-bust `?v=` on js/css

## Todo
- [x] api: `reorder-videos`
- [x] api: `rename-video`
- [x] api: `set-thumbnail` + `kind:'thumb'` path in photo-upload-init
- [x] studio.js: rebuild video card (arrows, title input, thumbnail upload)
- [x] studio.css: styles
- [x] studio.html: bump asset versions
- [x] Verify locally, then report

## Review

All three features built and verified. No schema change, no new dependency.

### api/studio.js
- `reorder-videos` — takes the full ordered id list, writes `sort_order = 0..n-1`.
- `rename-video` — PATCHes `title` (trimmed, capped at 200 chars, empty becomes null).
- `set-thumbnail` — takes a guid plus the storage path the browser just uploaded,
  and hands Bunny the public URL via its thumbnail endpoint.
- `photo-upload-init` now takes `kind: 'thumb'`, which writes to `thumbs/<uuid>.<ext>`
  instead of the gallery's photo folder, so posters are never mistaken for client photos.
- **Bug fixed along the way:** `attach` used to take the sort order from the browser as
  `Date.now() % 100000`. Once positions are normalised to 0..n-1 by a reorder, that value
  is almost always huge (fine), but it rolls over roughly every 100 seconds, so a newly
  uploaded video could land at the top of an ordered gallery. The server now reads the
  current maximum and appends at max + 1.

### studio.js
- Video cards render from a `VIDEOS` array that mirrors the saved order.
- ▲/▼ swap two neighbours, re-render, then persist. A failed write rolls the UI back
  and says so, so the studio can never show an order that was never saved.
- The title is an inline input: saves on blur or Enter, Escape restores the old value,
  a failed save restores the old value and shows an error on the card.
- "Thumbnail" uploads the image straight to storage (presigned PUT, same as photos)
  and then asks the server to point Bunny at it.

### studio.css
- Arrow buttons, inline title input, thumbnail button, per-card status line.
- Under 560px the title takes its own row so the buttons stay on one line
  instead of Remove wrapping off by itself.

### Not changed
- `g.html` — the client gallery already sorts by `sort_order` and already renders the
  title, and Bunny serves the custom poster inside its own player. Only the stylesheet
  cache-buster moved.
- Photos keep their existing behaviour (no reorder/rename), as scoped.

### Verification
Ran the real `studio.html`/`studio.js`/`studio.css` against a local stub of `/api/studio`
in the browser and confirmed:
- reorder swaps in the UI *and* persists as 0..n-1, and survives a reload
- a forced reorder failure rolls the UI back and alerts
- rename persists; thumbnail flow sends `kind:'thumb'` then `set-thumbnail` with the
  correct guid for the card
- up arrow disabled on the first card, down arrow disabled on the last
- desktop and mobile layouts both read cleanly

Not exercised against live Bunny/Supabase — that needs the production env vars.
The Bunny thumbnail call is the one piece worth eyeballing on the first real upload.
