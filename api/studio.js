// Creatively Grow studio API.
// Galleries live in Supabase; video files live in Bunny Stream.
// The browser uploads straight to storage so large files never pass
// through this function (Vercel caps request bodies at ~4.5MB).
const crypto = require('crypto');

const SB_URL = process.env.CG_SUPABASE_URL;
const SB_KEY = process.env.CG_SUPABASE_SERVICE_KEY;
const BUNNY_LIB = process.env.BUNNY_CG_LIBRARY_ID;
const BUNNY_KEY = process.env.BUNNY_CG_API_KEY;
const BUNNY_CDN = process.env.BUNNY_CG_CDN_HOSTNAME;
const PASSWORD = process.env.STUDIO_PASSWORD;
const PHOTO_BUCKET = 'gallery-photos';

// ---------------------------------------------------------------------------
// Photo storage: Bunny Storage when configured, Supabase Storage otherwise.
//
// Bunny's S3-compatible API supports presigned PUTs, so the browser still
// uploads directly and storage secrets never reach it. The zone must be
// created with S3 compatibility ticked; Bunny cannot enable it afterwards.
// ---------------------------------------------------------------------------
const B_REGION = process.env.BUNNY_S3_REGION;
const B_BUCKET = process.env.BUNNY_S3_BUCKET;
const B_ACCESS = process.env.BUNNY_S3_ACCESS_KEY;
const B_SECRET = process.env.BUNNY_S3_SECRET_KEY;
const B_PHOTO_CDN = process.env.BUNNY_S3_CDN_HOSTNAME;

function photoBackend() {
  return (B_REGION && B_BUCKET && B_ACCESS && B_SECRET && B_PHOTO_CDN) ? 'bunny' : 'supabase';
}

function photoBase() {
  return photoBackend() === 'bunny'
    ? `https://${B_PHOTO_CDN}/`
    : `${SB_URL}/storage/v1/object/public/${PHOTO_BUCKET}/`;
}

// RFC 3986 escaping. encodeURIComponent leaves !'()* alone; AWS does not.
function rfc3986(s) {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) =>
    '%' + c.charCodeAt(0).toString(16).toUpperCase());
}

function hmac(key, data) {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest();
}

function sha256hex(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Presigned S3 PUT for one object, SigV4 query-string form.
 *
 * Only `host` is signed. Content-Type is deliberately left unsigned so the
 * browser can send whatever the File carries without breaking the signature;
 * Bunny still records the header it receives.
 */
function presignBunnyPut(key, expiresIn = 3600) {
  const host = `${B_REGION}-s3.storage.bunnycdn.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/${B_REGION}/s3/aws4_request`;

  // Path-style: Bunny does not support virtual-hosted (bucket.host) addressing.
  const canonicalUri = '/' + [B_BUCKET, ...key.split('/')].map(rfc3986).join('/');

  // Sorted by key, as SigV4 requires. X-Amz-Content-Sha256 is carried in the
  // query (not as a signed header) so the payload hash is UNSIGNED-PAYLOAD:
  // the body is chosen by the browser after signing, so it cannot be hashed here.
  const query = [
    ['X-Amz-Algorithm', 'AWS4-HMAC-SHA256'],
    ['X-Amz-Content-Sha256', 'UNSIGNED-PAYLOAD'],
    ['X-Amz-Credential', `${B_ACCESS}/${scope}`],
    ['X-Amz-Date', amzDate],
    ['X-Amz-Expires', String(expiresIn)],
    ['X-Amz-SignedHeaders', 'host'],
  ].map(([k, v]) => `${rfc3986(k)}=${rfc3986(v)}`).join('&');

  const canonicalRequest = [
    'PUT', canonicalUri, query,
    `host:${host}`, '', 'host', 'UNSIGNED-PAYLOAD',
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256', amzDate, scope, sha256hex(canonicalRequest),
  ].join('\n');

  let signing = hmac('AWS4' + B_SECRET, dateStamp);
  signing = hmac(signing, B_REGION);
  signing = hmac(signing, 's3');
  signing = hmac(signing, 'aws4_request');
  const signature = crypto.createHmac('sha256', signing).update(stringToSign, 'utf8').digest('hex');

  return `https://${host}${canonicalUri}?${query}&X-Amz-Signature=${signature}`;
}

/** Signed AWS4 header auth for a server-side DELETE (no body). */
async function bunnyDelete(key) {
  const host = `${B_REGION}-s3.storage.bunnycdn.com`;
  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const scope = `${dateStamp}/${B_REGION}/s3/aws4_request`;
  const canonicalUri = '/' + [B_BUCKET, ...key.split('/')].map(rfc3986).join('/');
  const emptyHash = sha256hex('');

  const canonicalRequest = [
    'DELETE', canonicalUri, '',
    `host:${host}`, `x-amz-content-sha256:${emptyHash}`, `x-amz-date:${amzDate}`, '',
    'host;x-amz-content-sha256;x-amz-date', emptyHash,
  ].join('\n');

  const stringToSign = [
    'AWS4-HMAC-SHA256', amzDate, scope, sha256hex(canonicalRequest),
  ].join('\n');

  let signing = hmac('AWS4' + B_SECRET, dateStamp);
  signing = hmac(signing, B_REGION);
  signing = hmac(signing, 's3');
  signing = hmac(signing, 'aws4_request');
  const signature = crypto.createHmac('sha256', signing).update(stringToSign, 'utf8').digest('hex');

  return fetch(`https://${host}${canonicalUri}`, {
    method: 'DELETE',
    headers: {
      Authorization: `AWS4-HMAC-SHA256 Credential=${B_ACCESS}/${scope}, `
        + `SignedHeaders=host;x-amz-content-sha256;x-amz-date, Signature=${signature}`,
      'x-amz-content-sha256': emptyHash,
      'x-amz-date': amzDate,
    },
  });
}

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
        photoBase: photoBase(),
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

    // Short-lived credential scoped to one object, so the browser uploads
    // the image straight to storage and the secrets stay on the server.
    if (action === 'photo-upload-init' && req.method === 'POST') {
      const { filename, galleryId } = req.body || {};
      if (!galleryId) return res.status(400).json({ error: 'galleryId required' });
      const ext = String(filename || '').split('.').pop().toLowerCase().replace(/[^a-z0-9]/g, '') || 'jpg';
      const path = `${galleryId}/${crypto.randomUUID()}.${ext}`;

      if (photoBackend() === 'bunny') {
        return res.status(200).json({ path, uploadUrl: presignBunnyPut(path) });
      }

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
        photoBase: photoBase(),
      });
    }

    if (action === 'remove-photo' && req.method === 'POST') {
      const { id, path } = req.body || {};
      if (!id) return res.status(400).json({ error: 'id required' });
      await sb(`gallery_photos?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE', prefer: 'return=minimal' });
      // Best-effort: the row is already gone, so a storage hiccup must not
      // surface as a failed delete and leave a photo the studio can't remove.
      if (path) {
        const gone = photoBackend() === 'bunny'
          ? bunnyDelete(path)
          : fetch(`${SB_URL}/storage/v1/object/${PHOTO_BUCKET}/${path}`, {
              method: 'DELETE',
              headers: { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` },
            });
        await gone.catch(() => {});
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(400).json({ error: 'unknown action' });
  } catch (err) {
    console.error('studio api error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
