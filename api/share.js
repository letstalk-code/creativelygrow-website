// Server-rendered client share pages.
//
// Why this is a function and not a static file: link previews (iMessage,
// WhatsApp, Slack, Facebook) are built by a crawler that reads <meta> tags out
// of the HTML and never runs JavaScript. A client-rendered page therefore has
// nothing to preview. The <head> below is built on the server from the real
// gallery record, so the card shows the actual film and its actual thumbnail.
//
// Routes (see vercel.json):
//   /s?c=<slug>            one gallery
//   /v?c=<slug>&g=<guid>   one video
const SB_URL = process.env.CG_SUPABASE_URL;
const SB_KEY = process.env.CG_SUPABASE_SERVICE_KEY;
const BUNNY_LIB = process.env.BUNNY_CG_LIBRARY_ID;
const BUNNY_CDN = process.env.BUNNY_CG_CDN_HOSTNAME;
const SITE = 'https://creativelygrow.com';
const FALLBACK_IMAGE = `${SITE}/assets/og-image.jpg`;

function sb(path) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
    },
  });
}

function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

/** Bunny serves the current poster here, so a thumbnail set in the studio is
 *  exactly what the preview card shows. */
function posterFor(guid) {
  return (BUNNY_CDN && guid) ? `https://${BUNNY_CDN}/${guid}/thumbnail.jpg` : FALLBACK_IMAGE;
}

/** Previews truncate anyway; keep the description to one readable line. */
function trim(s, max = 160) {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
}

function page({ title, description, image, url, data, type = 'website', noindex = true }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
${noindex ? '<meta name="robots" content="noindex, nofollow">' : ''}
<meta name="description" content="${esc(description)}">
<meta property="og:type" content="${esc(type)}">
<meta property="og:site_name" content="Creatively Grow">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${esc(image)}">
<meta property="og:image:width" content="1280">
<meta property="og:image:height" content="720">
<meta property="og:url" content="${esc(url)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(image)}">
<link rel="icon" href="/favicon.ico?v=5" sizes="48x48">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/studio.css?v=8">
</head>
<body class="st">
<div id="gallery"><p class="cg-g-msg">Loading…</p></div>
<script id="cg-data" type="application/json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>
<script src="/share.js?v=1"></script>
</body>
</html>`;
}

module.exports = async (req, res) => {
  const q = req.query || {};
  const slug = String(q.c || '').slice(0, 64);
  const guid = String(q.g || '').slice(0, 64);
  const single = Boolean(guid);
  const url = `${SITE}${single ? `/v?c=${encodeURIComponent(slug)}&g=${encodeURIComponent(guid)}` : `/s?c=${encodeURIComponent(slug)}`}`;

  const send = (status, html) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    // Short cache: a renamed video or a new thumbnail should show up in later
    // previews without waiting on a long TTL.
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(status).send(html);
  };

  const missing = () => send(404, page({
    title: 'Link not found · Creatively Grow',
    description: 'This link is no longer available.',
    image: FALLBACK_IMAGE,
    url,
    data: { slug, guid, gallery: null, notFound: true },
  }));

  if (!slug) return missing();

  try {
    const gRes = await sb(`galleries?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=id,client_name,title,note`);
    const rows = await gRes.json();
    if (!Array.isArray(rows) || !rows.length) return missing();
    const g = rows[0];

    const vQuery = single
      ? `gallery_videos?gallery_id=eq.${g.id}&bunny_guid=eq.${encodeURIComponent(guid)}&select=bunny_guid,title`
      : `gallery_videos?gallery_id=eq.${g.id}&order=sort_order.asc&select=bunny_guid,title`;
    const vRes = await sb(vQuery);
    const videos = await vRes.json();
    if (!vRes.ok || !Array.isArray(videos)) throw new Error(`videos lookup failed for ${slug}`);
    // A single-video link whose guid is not in this gallery is simply not found,
    // so a link cannot be edited to reach another client's film.
    if (single && !videos.length) return missing();

    let photos = [];
    if (!single) {
      const pRes = await sb(`gallery_photos?gallery_id=eq.${g.id}&order=sort_order.asc&select=storage_path,title`);
      const got = await pRes.json();
      if (!pRes.ok || !Array.isArray(got)) throw new Error(`photos lookup failed for ${slug}`);
      photos = got;
    }

    const gallery = {
      clientName: g.client_name,
      title: g.title,
      note: g.note,
      libraryId: BUNNY_LIB,
      cdn: BUNNY_CDN,
      photoBase: null, // filled below only when photos are in play
      videos,
      photos,
    };

    // The photo base URL is derived the same way the studio API derives it.
    const B_CDN = process.env.BUNNY_S3_CDN_HOSTNAME;
    const bunnyPhotos = Boolean(process.env.BUNNY_S3_REGION && process.env.BUNNY_S3_BUCKET
      && process.env.BUNNY_S3_ACCESS_KEY && process.env.BUNNY_S3_SECRET_KEY && B_CDN);
    gallery.photoBase = bunnyPhotos
      ? `https://${B_CDN}/`
      : `${SB_URL}/storage/v1/object/public/gallery-photos/`;

    const first = videos[0];
    const title = single
      ? `${(first && first.title) || 'Your film'} · Creatively Grow`
      : `${g.title || g.client_name} · Creatively Grow`;
    const description = single
      ? trim(g.note || `A film for ${g.client_name}, from Creatively Grow.`)
      : trim(g.note || `${videos.length + photos.length} file${(videos.length + photos.length) === 1 ? '' : 's'} for ${g.client_name}.`);

    return send(200, page({
      title,
      description,
      image: posterFor(first && first.bunny_guid),
      url,
      type: single ? 'video.other' : 'website',
      data: { slug, guid: single ? guid : null, gallery },
    }));
  } catch (err) {
    console.error('share page error', err);
    // The record may well exist, so do not tell the client their link is bad.
    // An empty preload makes share.js fetch the data itself.
    return send(500, page({
      title: 'Creatively Grow',
      description: 'Your files, from Creatively Grow.',
      image: FALLBACK_IMAGE,
      url,
      data: { slug, guid: single ? guid : null, gallery: null },
    }));
  }
};
