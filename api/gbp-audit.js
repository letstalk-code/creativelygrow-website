// Free Google Business Profile audit. Looks up a business on Google Maps, pulls the
// competitors currently outranking it, scores the gap, and hands back a report.
//
// Two-step by design:
//   step 1 (no contact info) -> teaser: score + the two worst gaps. Cheap, ungated.
//   step 2 (name + phone)    -> full report + the lead lands in GHL.
//
// The gate exists for two reasons: it is the lead capture, and it stops a stranger
// with a share link from draining the DataForSEO balance.

const DFS_BASE = 'https://api.dataforseo.com/v3';

// Serverless instances are reused between invocations, so this survives long enough
// to absorb the repeat lookups that follow a video going out. It is a cost damper,
// not a real cache — a cold instance simply pays for the lookup again.
const cache = new Map();
const CACHE_MS = 7 * 24 * 60 * 60 * 1000;
const rate = new Map();
const RATE_MAX = 5; // audits per IP per day
const DAILY_CAP = Number(process.env.GBP_DAILY_CAP || 200);
let dayStamp = '';
let dayCount = 0;

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

const clean = (v, max) => String(v || '').trim().slice(0, max);

// DataForSEO wants "Tampa,Florida,United States". People type "Tampa" or
// "Tampa, FL", so normalise before the lookup rather than failing the request.
const STATES = {
  fl: 'Florida', ga: 'Georgia', al: 'Alabama', sc: 'South Carolina', nc: 'North Carolina',
  tn: 'Tennessee', tx: 'Texas', ny: 'New York', ca: 'California', il: 'Illinois',
  oh: 'Ohio', pa: 'Pennsylvania', mi: 'Michigan', va: 'Virginia', az: 'Arizona',
  co: 'Colorado', wa: 'Washington', ma: 'Massachusetts', nj: 'New Jersey', md: 'Maryland',
};

function normaliseLocation(input) {
  const parts = String(input).split(',').map((p) => p.trim()).filter(Boolean);
  if (!parts.length) return null;
  const city = parts[0];
  let region = parts[1] || 'Florida'; // Tampa Bay is the home market, so it is the sane default
  const key = region.toLowerCase().replace(/\./g, '');
  if (STATES[key]) region = STATES[key];
  const country = parts[2] && !/^(us|usa|united states)$/i.test(parts[2]) ? parts[2] : 'United States';
  return `${city},${region},${country}`;
}

function dfsAuth() {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) return null;
  return 'Basic ' + Buffer.from(`${login}:${password}`).toString('base64');
}

async function dfsMaps(keyword, locationName, auth, limit) {
  const resp = await fetch(`${DFS_BASE}/serp/google/maps/live/advanced`, {
    method: 'POST',
    headers: { Authorization: auth, 'Content-Type': 'application/json' },
    body: JSON.stringify([
      { keyword, location_name: locationName, language_code: 'en', device: 'desktop', depth: limit || 20 },
    ]),
  });
  if (!resp.ok) throw new Error(`dataforseo ${resp.status}`);
  const json = await resp.json();
  const items = json?.tasks?.[0]?.result?.[0]?.items;
  return Array.isArray(items) ? items : [];
}

// Maps items carry a lot of nulls. Normalise once so scoring stays readable.
function normalise(item) {
  return {
    name: item.title || '',
    rating: item.rating?.value ?? null,
    reviews: item.rating?.votes_count ?? 0,
    category: item.category || '',
    phone: item.phone || '',
    website: item.url || item.domain || '',
    address: item.address || '',
    photos: item.total_photos ?? null,
    hours: !!item.work_time,
    description: !!item.snippet,
    claimed: item.is_claimed !== false,
    placeId: item.place_id || '',
  };
}

function scoreProfile(me, rivals) {
  const checks = [];
  const add = (id, label, ok, detail, weight) => checks.push({ id, label, ok, detail, weight });

  add('claimed', 'Profile is claimed', me.claimed,
    me.claimed ? 'Claimed and under your control.' : 'Unclaimed — anyone can suggest edits and you cannot reply to reviews.', 20);

  add('website', 'Website is linked', !!me.website,
    me.website ? `Linked to ${me.website}.` : 'No website on the listing. Every click that would have gone to your site is lost.', 12);

  add('hours', 'Hours are filled in', me.hours,
    me.hours ? 'Hours are set.' : 'No hours listed. Google shows "Hours not available" and people move on.', 10);

  add('description', 'Business description written', me.description,
    me.description ? 'Description present.' : 'No description. This is free keyword real estate sitting empty.', 8);

  add('category', 'Primary category set', !!me.category,
    me.category ? `Listed as "${me.category}".` : 'No primary category, so Google is guessing what you do.', 15);

  const photoCount = me.photos ?? 0;
  add('photos', 'Photos on the listing', photoCount >= 20,
    photoCount >= 20 ? `${photoCount} photos.` :
    `${photoCount} photo${photoCount === 1 ? '' : 's'}. Listings with 20+ get materially more calls and direction requests.`, 15);

  // The comparison is the part that actually lands, so it carries the most weight.
  const rivalReviews = rivals.map((r) => r.reviews).filter((n) => n > 0).sort((a, b) => b - a);
  const topRival = rivalReviews[0] || 0;
  const reviewsOk = topRival === 0 ? me.reviews > 0 : me.reviews >= topRival * 0.6;
  add('reviews', 'Review count is competitive', reviewsOk,
    rivalReviews.length
      ? `You have ${me.reviews}. The businesses ranking above you have ${rivalReviews.slice(0, 3).join(', ')}.`
      : `You have ${me.reviews} reviews.`, 20);

  const ratingOk = me.rating === null ? false : me.rating >= 4.5;
  add('rating', 'Rating is 4.5 or better', ratingOk,
    me.rating === null ? 'No rating yet.' :
    me.rating >= 4.5 ? `${me.rating} stars.` : `${me.rating} stars. Below 4.5 people start comparing you instead of calling you.`, 15);

  const earned = checks.filter((c) => c.ok).reduce((sum, c) => sum + c.weight, 0);
  const total = checks.reduce((sum, c) => sum + c.weight, 0);
  return { score: Math.round((earned / total) * 100), checks };
}

async function pushToGhl({ business, firstName, phone, city, score, failing }) {
  const headers = {
    Authorization: `Bearer ${process.env.GHL_PIT}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };
  const note = `GBP audit — score ${score}/100 for "${business}" (${city}). Failing: ${failing.join('; ') || 'none'}`;
  const resp = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers,
    body: JSON.stringify({
      locationId: process.env.GHL_LOCATION_ID,
      firstName: firstName || business,
      companyName: business,
      phone,
      source: 'gbp-audit',
      tags: ['gbp-audit', 'lead-magnet'],
    }),
  });
  if (!resp.ok) return;
  const contactId = (await resp.json())?.contact?.id;
  if (!contactId) return;
  await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ body: note }),
  }).catch(() => {});
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const business = clean(req.body?.business, 120);
  const city = clean(req.body?.city, 80);
  const firstName = clean(req.body?.firstName, 60);
  const phone = clean(req.body?.phone, 25).replace(/[^\d+() -]/g, '');
  // The Claude skill is deliberately ungated — no phone, no email, no signup. We still
  // see every run server-side, which is better lead data than a form fill anyway.
  const fromSkill = req.body?.source === 'skill';
  const wantsFull = fromSkill || !!req.body?.full;

  if (!business || !city) return res.status(400).json({ error: 'business name and city are required' });
  if (wantsFull && !fromSkill && phone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'a valid phone number is required for the full report' });
  }

  const auth = dfsAuth();
  if (!auth) return res.status(503).json({ error: 'audit is temporarily unavailable' });

  const locationName = normaliseLocation(city);
  if (!locationName) return res.status(400).json({ error: 'please enter a city' });

  // Daily cap. Resets on date change; a cold instance resets it early, which is
  // acceptable for a damper but means this is not a hard billing guarantee.
  const today = new Date().toISOString().slice(0, 10);
  if (today !== dayStamp) { dayStamp = today; dayCount = 0; }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const rateKey = `${ip}:${today}`;
  const used = rate.get(rateKey) || 0;

  const cacheKey = `${business.toLowerCase()}|${city.toLowerCase()}`;
  const hit = cache.get(cacheKey);
  const fresh = hit && Date.now() - hit.at < CACHE_MS;

  try {
    let payload;
    if (fresh) {
      payload = hit.payload;
    } else {
      if (dayCount >= DAILY_CAP) return res.status(429).json({ error: 'audit limit reached for today — try tomorrow' });
      if (used >= RATE_MAX) return res.status(429).json({ error: 'you have run several audits today — try again tomorrow' });

      const found = await dfsMaps(business, locationName, auth, 10);
      dayCount += 1;
      rate.set(rateKey, used + 1);

      const target = found.map(normalise).find((b) =>
        b.name.toLowerCase().includes(business.toLowerCase().slice(0, 12))) || (found[0] ? normalise(found[0]) : null);

      if (!target) return res.status(404).json({ error: `Could not find "${business}" on Google Maps in ${city}. Check the spelling as it appears on your listing.` });

      let rivals = [];
      if (target.category) {
        const pack = await dfsMaps(`${target.category} ${city}`, locationName, auth, 10);
        dayCount += 1;
        rivals = pack.map(normalise).filter((b) => b.placeId !== target.placeId).slice(0, 3);
      }

      const { score, checks } = scoreProfile(target, rivals);
      payload = { business: target.name, category: target.category, city, score, checks, rivals: rivals.map((r) => ({ name: r.name, rating: r.rating, reviews: r.reviews })) };
      cache.set(cacheKey, { at: Date.now(), payload });
    }

    const failing = payload.checks.filter((c) => !c.ok);

    if (!wantsFull) {
      return res.status(200).json({
        business: payload.business,
        score: payload.score,
        failingCount: failing.length,
        teaser: failing.sort((a, b) => b.weight - a.weight).slice(0, 2).map((c) => ({ label: c.label, detail: c.detail })),
        gated: true,
      });
    }

    if (fromSkill) {
      // No contact details to upsert, so record the run in the logs instead. Anonymous
      // skill runs would only pollute the CRM with nameless, phoneless contacts.
      console.log(`gbp-audit skill run: "${payload.business}" (${city}) scored ${payload.score}/100 — failing: ${failing.map((c) => c.label).join(', ') || 'none'}`);
    } else {
      await pushToGhl({
        business: payload.business, firstName, phone, city,
        score: payload.score, failing: failing.map((c) => c.label),
      }).catch(() => {});
    }

    return res.status(200).json({ ...payload, gated: false });
  } catch (err) {
    console.error('gbp-audit failed:', err.message);
    return res.status(502).json({ error: 'could not reach Google right now — try again in a minute' });
  }
};
