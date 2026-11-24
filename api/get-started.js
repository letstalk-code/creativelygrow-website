// Receives the Never Miss a Customer onboarding form (/get-started) and saves it to the
// Creatively Grow GHL location: one contact, one note with every answer, a text and an
// email to Devon, and a short confirmation text to the client.
// Follows the same rules as leak-check.js (spam filter, look up before upsert).

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

// Every answer the page can send, in the order it should read in the note.
// Anything not listed here is ignored.
const FIELDS = [
  ['business_name', 'Business', 120],
  ['contact_name', 'Name', 80],
  ['email', 'Email', 254],
  ['phone', 'Phone', 25],
  ['hours', 'Hours', 200],
  ['services', 'Services', 1000],
  ['service_area', 'Towns covered', 300],
  ['notify_who', 'Notify on replies', 200],
  ['list_format', 'Customer list kept in', 40],
  ['list_software', 'List software', 120],
  ['list_size', 'Past customers', 40],
  ['shop_number', 'Main shop number', 25],
  ['carrier', 'Phone company', 80],
  ['line_type', 'Line type', 40],
  ['legal_name', 'Legal name', 160],
  ['business_address', 'Business address', 300],
  ['tax_id', 'EIN', 20],
  ['gbp_access', 'Google profile', 40],
  ['review_link', 'Review link', 500],
  ['website_url', 'Website', 300],
  ['domain_host', 'Domain registered at', 120],
  ['logo', 'Logo', 40],
  ['photos', 'Photos', 40],
  ['anything_else', 'Anything else', 1500],
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const body = req.body || {};
  const clean = {};
  for (const [key, , max] of FIELDS) {
    const value = String(body[key] || '').trim().slice(0, max);
    if (value) clean[key] = value;
  }
  if (clean.email) clean.email = clean.email.toLowerCase();
  if (clean.phone) clean.phone = clean.phone.replace(/[^\d+() -]/g, '').trim();

  const phoneDigits = String(clean.phone || '').replace(/\D/g, '');
  const validPhone = phoneDigits.length === 10 || (phoneDigits.length === 11 && phoneDigits.startsWith('1'));
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email || '');

  if (!clean.business_name || !clean.contact_name || !validPhone || !validEmail) {
    return res.status(400).json({ error: 'business name, your name, a valid phone and a valid email are required' });
  }

  // Same bot filter as the other site forms. A dropped request still gets a 200 so the
  // bot learns nothing, and nothing is saved, texted or alerted.
  const tooFast = !(Number(body.fillMs) >= 3000);
  const trapFilled = String(body.company_site || '').trim() !== '';
  const [emailLocal, emailDomain] = clean.email.split('@');
  const dottedGmail = ['gmail.com', 'googlemail.com'].includes(emailDomain)
    && (emailLocal.match(/\./g) || []).length >= 3;
  if (tooFast || trapFilled || dottedGmail) {
    console.warn('get-started dropped as spam', { tooFast, trapFilled, dottedGmail, business: clean.business_name });
    return res.status(200).json({ ok: true });
  }

  const ghlHeaders = {
    Authorization: `Bearer ${process.env.GHL_PIT}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };
  const firstName = clean.contact_name.split(/\s+/)[0];

  try {
    // The upsert matches on phone and overwrites what it is handed, so look the
    // person up first and only fill what is blank on a known contact.
    let existing = null;
    try {
      const dupUrl = `https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${encodeURIComponent(process.env.GHL_LOCATION_ID)}&number=${encodeURIComponent(clean.phone)}`;
      const dupResp = await fetch(dupUrl, { headers: ghlHeaders });
      if (dupResp.ok) {
        const dup = await dupResp.json();
        existing = (dup && dup.contact) || null;
      } else {
        console.error('duplicate lookup failed', dupResp.status, await dupResp.text());
      }
    } catch (dupErr) {
      console.error('duplicate lookup error', dupErr);
    }

    const payload = { locationId: process.env.GHL_LOCATION_ID, phone: clean.phone, tags: ['nmac-onboarding'] };
    if (!existing || !existing.firstName) payload.firstName = firstName;
    const lastName = clean.contact_name.split(/\s+/).slice(1).join(' ');
    if (lastName && (!existing || !existing.lastName)) payload.lastName = lastName;
    if (!existing || !existing.companyName) payload.companyName = clean.business_name;
    if (!existing || !existing.email) payload.email = clean.email;
    if (!existing || !existing.source) payload.source = 'nmac-get-started';

    const resp = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: ghlHeaders,
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      console.error('GHL upsert failed', resp.status, await resp.text());
      return res.status(502).json({ error: 'could not save' });
    }
    const data = await resp.json();
    const contactId = data && data.contact && data.contact.id;
    if (!contactId) return res.status(502).json({ error: 'could not save' });

    // Every answer, in one note, so the whole onboarding is on the contact.
    try {
      const lines = ['Never Miss a Customer onboarding form'];
      for (const [key, label] of FIELDS) if (clean[key]) lines.push(`${label}: ${clean[key]}`);
      const noteResp = await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({ body: lines.join('\n') }),
      });
      if (!noteResp.ok) console.error('note attach failed', noteResp.status, await noteResp.text());
    } catch (noteErr) {
      console.error('note attach error (contact still saved)', noteErr);
    }

    // Confirmation text to the client: the next step is their customer list.
    try {
      const smsResp = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify({
          type: 'SMS',
          contactId,
          message: `Hi ${firstName}, Devon here from Creatively Grow. Got your setup details for ${clean.business_name}. Next step is your customer list for the free comeback check. Reply here and I'll tell you the easiest way to send it.`,
        }),
      });
      if (!smsResp.ok) console.error('confirmation SMS failed', smsResp.status, await smsResp.text());
    } catch (smsErr) {
      console.error('confirmation SMS error (contact still saved)', smsErr);
    }

    // Tell Devon, so a ready-to-sign client never sits unnoticed in the CRM.
    const notifyId = process.env.GHL_NOTIFY_CONTACT_ID;
    if (notifyId) {
      const summary = [clean.business_name, clean.contact_name, clean.phone, clean.email].join(' — ');
      const alerts = [
        { type: 'SMS', contactId: notifyId, message: `NMAC onboarding: ${summary}` },
        {
          type: 'Email',
          contactId: notifyId,
          emailFrom: 'Creatively Grow <letstalk@creativelygrow.com>',
          subject: `NMAC onboarding: ${clean.business_name}`,
          html: FIELDS.filter(([key]) => clean[key])
            .map(([key, label]) => `<p><b>${escapeHtml(label)}:</b> ${escapeHtml(clean[key])}</p>`)
            .join(''),
        },
      ];
      for (const alert of alerts) {
        try {
          const alertResp = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
            method: 'POST',
            headers: ghlHeaders,
            body: JSON.stringify(alert),
          });
          if (!alertResp.ok) console.error(`${alert.type} notification failed`, alertResp.status, await alertResp.text());
        } catch (alertErr) {
          console.error(`${alert.type} notification error (contact still saved)`, alertErr);
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('get-started error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
