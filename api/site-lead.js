// One lead endpoint for every Open Door site (built by ~/Desktop2/open-door-sites).
// A visitor's request goes to the business owner as a text, gets logged as a note on the
// owner's Creatively Grow GHL contact (so we can show them their lead count), and Devon gets a copy.
// Leads are NOT created as GHL contacts: this location's new-contact workflows would text
// the client's customer as if they were a Creatively Grow lead.
//
// To add a client: put their site slug here with the GHL contact id they got when they paid.
const SITES = {
  // 'amped-electric': { business: 'Amped Electric', ownerContactId: 'abc123' },
};

const clip = (v, max) => String(v || '').trim().slice(0, max);

module.exports = async (req, res) => {
  // Client sites live on their own domains, so this endpoint is open to any origin.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const body = req.body || {};
  const site = clip(body.site, 60);
  const lead = {
    name: clip(body.name, 80),
    phone: clip(body.phone, 25).replace(/[^\d+() -]/g, ''),
    need: clip(body.need, 120),
    message: clip(body.message, 1000),
    page: clip(body.page, 200),
  };
  const digits = lead.phone.replace(/\D/g, '');
  const validPhone = digits.length === 10 || (digits.length === 11 && digits.startsWith('1'));
  if (!site || !lead.name || !validPhone) return res.status(400).json({ error: 'name and a valid phone are needed' });

  // Sample sites show the form working but nothing is sent anywhere.
  if (site.startsWith('sample-')) return res.status(200).json({ ok: true, sample: true });

  const client = SITES[site];
  if (!client) {
    console.error('site-lead: unknown site', site);
    return res.status(404).json({ error: 'unknown site' });
  }

  // Same bot filter as the other forms: a dropped request still gets a 200.
  const tooFast = !(Number(body.fillMs) >= 3000);
  const trapFilled = clip(body.company_site, 200) !== '';
  if (tooFast || trapFilled) {
    console.warn('site-lead dropped as spam', { site, tooFast, trapFilled });
    return res.status(200).json({ ok: true });
  }

  const ghl = (path, payload) => fetch(`https://services.leadconnectorhq.com${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.GHL_PIT}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  const send = async (label, path, payload) => {
    try {
      const r = await ghl(path, payload);
      if (!r.ok) { console.error(`site-lead ${label} failed`, r.status, await r.text()); return false; }
      return true;
    } catch (err) {
      console.error(`site-lead ${label} error`, err);
      return false;
    }
  };

  const summary = `${lead.name}, ${lead.phone}${lead.need ? `, needs: ${lead.need}` : ''}${lead.message ? `. "${lead.message}"` : ''}`;
  const ownerText = `New lead from your website: ${summary}. Call them back fast, the first business to call usually wins the job.`;

  const texted = await send('owner SMS', '/conversations/messages', { type: 'SMS', contactId: client.ownerContactId, message: ownerText });
  await send('note', `/contacts/${client.ownerContactId}/notes`, {
    body: `Website lead (${site}${lead.page ? ' ' + lead.page : ''}): ${summary}${texted ? '' : '\nOWNER TEXT FAILED: call them.'}`,
  });
  if (process.env.GHL_NOTIFY_CONTACT_ID) {
    await send('Devon SMS', '/conversations/messages', {
      type: 'SMS',
      contactId: process.env.GHL_NOTIFY_CONTACT_ID,
      message: `${texted ? '' : 'OWNER TEXT FAILED. '}${client.business} site lead: ${summary}`,
    });
  }

  // The visitor still sees success if only the texts failed: the note and Devon's copy cover it.
  return res.status(200).json({ ok: true });
};
