// Creatively Grow studio API.
// Galleries live in Supabase; video files live in Bunny Stream.
// The browser uploads straight to Bunny via TUS so large files never
// pass through this function (Vercel caps request bodies at ~4.5MB).
const crypto = require('crypto');

const SB_URL = process.env.CG_SUPABASE_URL;
const SB_KEY = process.env.CG_SUPABASE_SERVICE_KEY;
const BUNNY_LIB = process.env.BUNNY_CG_LIBRARY_ID;
const BUNNY_KEY = process.env.BUNNY_CG_API_KEY;
const BUNNY_CDN = process.env.BUNNY_CG_CDN_HOSTNAME;
const PASSWORD = process.env.STUDIO_PASSWORD;
const PHOTO_BUCKET = 'gallery-photos';

function sb(path, opts = {}) {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...opts,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      Prefer: opts.prefer || 'return=representation',
      ...(opts.headers || {}),
    },
  });
}

function slugify(s) {
  return String(s).toLowerCase().trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 48) || 'client';
}

function authed(req) {
  const given = req.headers['x-studio-key'];
  if (!PASSWORD || !given) return false;
  const a = Buffer.from(String(given));
  const b = Buffer.from(String(PASSWORD));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Studio-Key');
  if (req.method === 'OPTIONS') return res.status(204).end();

  const action = (req.query && req.query.action) || '';

  try {
    // ---- Public: a client viewing their gallery by slug ----
    if (action === 'view') {
      const slug = String((req.query && req.query.slug) || '').slice(0, 64);
      if (!slug) return res.status(400).json({ error: 'slug required' });
      const gRes = await sb(`galleries?slug=eq.${encodeURIComponent(slug)}&published=eq.true&select=id,client_name,title,note`);
      const rows = await gRes.json();
      if (!Array.isArray(rows) || !rows.length) return res.status(404).json({ error: 'not found' });
      const g = rows[0];
      const vRes = await sb(`gallery_videos?gallery_id=eq.${g.id}&order=sort_order.asc&select=bunny_guid,title`);
      const videos = await vRes.json();
      const pRes = await sb(`gallery_photos?gallery_id=eq.${g.id}&order=sort_order.asc&select=storage_path,title`);
      const photos = await pRes.json();
      return res.status(200).json({
        clientName: g.client_name,
        title: g.title,
        note: g.note,
        libraryId: BUNNY_LIB,
        cdn: BUNNY_CDN,
        photoBase: `${SB_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`,
        videos: Array.isArray(videos) ? videos : [],
        photos: Array.isArray(photos) ? photos : [],
      });
    }

    // ---- Everything below requires the studio password ----
    if (!authed(req)) return res.status(401).json({ error: 'unauthorized' });

    if (action === 'check') return res.status(200).json({ ok: true });

    if (action === 'list') {
      const r = await sb('galleries?select=id,slug,client_name,title,created_at&order=created_at.desc');
      const galleries = await r.json();
      const withCounts = await Promise.all((galleries || []).map(async (g) => {
        const [c, p] = await Promise.all([
          sb(`gallery_videos?gallery_id=eq.${g.id}&select=id`),
          sb(`gallery_photos?gallery_id=eq.${g.id}&select=id`),
        ]);
        const vids = await c.json();
        const pics = await p.json();
        return {
          ...g,
          videoCount: Array.isArray(vids) ? vids.length : 0,
          photoCount: Array.isArray(pics) ? pics.length : 0,
        };
      }));
      return res.status(200).json({ galleries: withCounts });
    }

    if (action === 'create' && req.method === 'POST') {
      const { clientName, title, note } = req.body || {};
      if (!clientName) return res.status(400).json({ error: 'clientName required' });
      const base = slugify(clientName);
      const slug = `${base}-${crypto.randomBytes(3).toString('hex')}`;
      const r = await sb('galleries', {
        method: 'POST',
        body: JSON.stringify({ slug, client_name: clientName, title: title || null, note: note || null }),
      });
      if (!r.ok) return res.status(502).json({ error: await r.text() });
      const [row] = await r.json();
      return res.status(200).json({ gallery: row });
    }

    if (action === 'delete' && req.method === 'POST') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      await sb(`galleries?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=minimal' });
      return res.status(200).json({ ok: true });
    }

    // Create the Bunny video record and hand back TUS credentials so the
    // browser can upload the file directly to Bunny.
    if (action === 'upload-init' && req.method === 'POST') {
      const { title } = req.body || {};
      const createRes = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIB}/videos`, {
        method: 'POST',
        headers: { AccessKey: BUNNY_KEY, 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || 'Untitled' }),
      });
      if (!createRes.ok) return res.status(502).json({ error: 'bunny create failed' });
      const { guid } = await createRes.json();
      const expiration = Date.now() + 24 * 60 * 60 * 1000;
      const signature = crypto.createHash('sha256')
        .update(String(BUNNY_LIB) + BUNNY_KEY + expiration + guid)
        .digest('hex');
      return res.status(200).json({
        guid, libraryId: BUNNY_LIB, signature, expiration,
        endpoint: 'https://video.bunnycdn.com/tusupload',
      });
    }

    if (action === 'attach' && req.method === 'POST') {
      const { galleryId, guid, title, sortOrder } = req.body || {};
      if (!galleryId || !guid) return res.status(400).json({ error: 'galleryId and guid required' });
      const r = await sb('gallery_videos', {
        method: 'POST',
        body: JSON.stringify({
          gallery_id: galleryId, bunny_guid: guid,
          title: title || null, sort_order: sortOrder || 0,
        }),
      });
      if (!r.ok) return res.status(502).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    if (action === 'videos') {
      const galleryId = String((req.query && req.query.galleryId) || '');
      if (!galleryId) return res.status(400).json({ error: 'galleryId required' });
      const r = await sb(`gallery_videos?gallery_id=eq.${encodeURIComponent(galleryId)}&order=sort_order.asc&select=id,bunny_guid,title`);
      return res.status(200).json({ videos: await r.json(), libraryId: BUNNY_LIB, cdn: BUNNY_CDN });
    }

    if (action === 'remove-video' && req.method === 'POST') {
      const { id } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      await sb(`gallery_videos?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=minimal' });
      return res.status(200).json({ ok: true });
    }

    // Signed URL so the browser uploads the image straight to Supabase Storage
    if (action === 'photo-upload-init' && req.method === 'POST') {
      const { filename, galleryId } = req.body || {};
      if (!galleryId) return res.status(400).json({ error: 'galleryId required' });
      const ext = String(filename || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${galleryId}/${crypto.randomUUID()}.${ext}`;
      const r = await fetch(`${SB_URL}/storage/v1/object/upload/sign/${PHOTO_BUCKET}/${path}`, {
        method: 'POST',
        headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ expiresIn: 3600 }),
      });
      if (!r.ok) return res.status(502).json({ error: 'could not sign upload' });
      const { url } = await r.json();
      return res.status(200).json({ path, uploadUrl: `${SB_URL}/storage/v1${url}` });
    }

    if (action === 'attach-photo' && req.method === 'POST') {
      const { galleryId, path, title, sortOrder } = req.body || {};
      if (!galleryId || !path) return res.status(400).json({ error: 'galleryId and path required' });
      const r = await sb('gallery_photos', {
        method: 'POST',
        body: JSON.stringify({
          gallery_id: galleryId, storage_path: path,
          title: title || null, sort_order: sortOrder || 0,
        }),
      });
      if (!r.ok) return res.status(502).json({ error: await r.text() });
      return res.status(200).json({ ok: true });
    }

    if (action === 'photos') {
      const galleryId = String((req.query && req.query.galleryId) || '');
      if (!galleryId) return res.status(400).json({ error: 'galleryId required' });
      const r = await sb(`gallery_photos?gallery_id=eq.${encodeURIComponent(galleryId)}&order=sort_order.asc&select=id,storage_path,title`);
      return res.status(200).json({
        photos: await r.json(),
        photoBase: `${SB_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`,
      });
    }

    if (action === 'remove-photo' && req.method === 'POST') {
      const { id, path } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      await sb(`gallery_photos?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=minimal' });
      if (path) {
        await fetch(`${SB_URL}/storage/v1/object/${PHOTO_BUCKET}/${path}`, {
          method: 'DELETE',
          headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
        }).catch(() => {});
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'unknown action' });
  } catch (err) {
    console.error('studio api error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
