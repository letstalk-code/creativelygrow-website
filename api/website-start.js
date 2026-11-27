// The $150 website flow (/website-start then /website-details), saved to the Creatively
// Grow GHL location. Same rules as get-started.js: spam filter, look up before upsert,
// only fill blanks on a known contact, one note per submission, tell Devon.
//   step "pick":    they gave name/phone/email and are being sent to Square checkout.
//   step "details": they paid, picked 1 of the 7 looks and sent the rest of their info.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

// The 7 looks, picked on /website-details after payment (built by ~/Desktop2/open-door-sites).
const TEMPLATES = {
  voltway: 'Strong & Direct (Voltway)',
  gulfair: 'Cool & Urgent (Gulf Air HVAC)',
  greenline: 'Fresh & Bold (Greenline Lawn)',
  ironcoast: 'Dark & Industrial (Iron Coast Freight)',
  harborpoint: 'Classic & Trusted (Harbor Point Law)',
  azalea: 'Soft & Friendly (Azalea Dental)',
  happytails: 'Bright & Friendly (Happy Tails)',
};

// Every answer the pages can send, in note order. Anything else is ignored.
const FIELDS = [
  ['template', 'Look', 40],
  ['contact_name', 'Name', 80],
  ['phone', 'Phone', 25],
  ['email', 'Email', 254],
  ['business_name', 'Business', 120],
  ['services', 'What they do', 1000],
  ['service_area', 'Towns', 300],
  ['hours', 'Hours', 200],
  ['years', 'Years in business', 20],
  ['license', 'License / insurance', 200],
  ['review_link', 'Google reviews link', 300],
  ['reviews', 'Reviews to show', 2500],
  ['site_phone', 'Phone on site', 25],
  ['site_email', 'Email on site', 254],
  ['differentiator', 'What makes them different', 1000],
  ['custom_request', 'Custom site request', 1500],
  ['logo', 'Logo', 40],
  ['photos', 'Photos', 40],
  ['website_url', 'Current website', 300],
  ['domain_host', 'Domain registered at', 120],
  ['hosting', '$15/mo hosting', 40],
  ['anything_else', 'Anything else', 1500],
  ['contact_id', 'GHL contact id (from link)', 40],
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const body = req.body || {};
  const step = ['details', 'custom'].includes(body.step) ? body.step : 'pick';
  const clean = {};
  for (const [key, , max] of FIELDS) {
    const value = String(body[key] || '').trim().slice(0, max);
    if (value) clean[key] = value;
  }
  if (clean.email) clean.email = clean.email.toLowerCase();
  if (clean.phone) clean.phone = clean.phone.replace(/[^\d+() -]/g, '').trim();
  if (clean.template && !TEMPLATES[clean.template]) delete clean.template;

  const phoneDigits = String(clean.phone || '').replace(/\D/g, '');
  const validPhone = phoneDigits.length === 10 || (phoneDigits.length === 11 && phoneDigits.startsWith('1'));
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean.email || '');
  const missingStepField = step === 'details' ? !clean.business_name || !clean.template : step === 'custom' ? !clean.business_name : false;
  if (!clean.contact_name || !validPhone || !validEmail || missingStepField) {
    return res.status(400).json({ error: 'name, a valid phone, a valid email and the step\'s required field are needed' });
  }

  // Same bot filter as the other site forms: a dropped request still gets a 200.
  const tooFast = !(Number(body.fillMs) >= 3000);
  const trapFilled = String(body.company_site || '').trim() !== '';
  const [emailLocal, emailDomain] = clean.email.split('@');
  const dottedGmail = ['gmail.com', 'googlemail.com'].includes(emailDomain)
    && (emailLocal.match(/\./g) || []).length >= 3;
  if (tooFast || trapFilled || dottedGmail) {
    console.warn('website-start dropped as spam', { step, tooFast, trapFilled, dottedGmail });
    return res.status(200).json({ ok: true });
  }

  const ghlHeaders = {
    Authorization: `Bearer ${process.env.GHL_PIT}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };
  const ghl = (path, payload) => fetch(`https://services.leadconnectorhq.com${path}`, {
    method: 'POST', headers: ghlHeaders, body: JSON.stringify(payload),
  });
  const firstName = clean.contact_name.split(/\s+/)[0];
  const look = clean.template ? TEMPLATES[clean.template] : 'not picked';

  try {
    // Look the person up first; the upsert matches on phone and overwrites what it's given.
    let existing = null;
    try {
      const dupResp = await fetch(`https://services.leadconnectorhq.com/contacts/search/duplicate?locationId=${encodeURIComponent(process.env.GHL_LOCATION_ID)}&number=${encodeURIComponent(clean.phone)}`, { headers: ghlHeaders });
      if (dupResp.ok) existing = ((await dupResp.json()) || {}).contact || null;
      else console.error('duplicate lookup failed', dupResp.status, await dupResp.text());
    } catch (dupErr) {
      console.error('duplicate lookup error', dupErr);
    }

    const payload = {
      locationId: process.env.GHL_LOCATION_ID,
      phone: clean.phone,
    };
    if (!existing || !existing.firstName) payload.firstName = firstName;
    const lastName = clean.contact_name.split(/\s+/).slice(1).join(' ');
    if (lastName && (!existing || !existing.lastName)) payload.lastName = lastName;
    if (clean.business_name && (!existing || !existing.companyName)) payload.companyName = clean.business_name;
    if (!existing || !existing.email) payload.email = clean.email;
    if (!existing || !existing.source) payload.source = 'website-150';

    const resp = await ghl('/contacts/upsert', payload);
    if (!resp.ok) {
      console.error('GHL upsert failed', resp.status, await resp.text());
      return res.status(502).json({ error: 'could not save' });
    }
    const contactId = (((await resp.json()) || {}).contact || {}).id;
    if (!contactId) return res.status(502).json({ error: 'could not save' });

    // Tags go on separately: the upsert replaces a known contact's whole tag list,
    // which would wipe tags like website-lead that the GHL workflow relies on.
    try {
      const tagResp = await ghl(`/contacts/${contactId}/tags`, { tags: [step === 'pick' ? 'website-picked' : step === 'custom' ? 'website-custom' : 'website-intake'] });
      if (!tagResp.ok) console.error('tag add failed', tagResp.status, await tagResp.text());
    } catch (tagErr) {
      console.error('tag add error (contact still saved)', tagErr);
    }

    const headline = {
      pick: '$150 website: sent to Square checkout',
      details: '$150 website: details after payment (check Square for the $150)',
      custom: 'Custom website request ($699 and up): Devon to call',
    };
    const lines = [headline[step]];
    for (const [key, label] of FIELDS) {
      if (!clean[key]) continue;
      lines.push(`${label}: ${key === 'template' ? look : clean[key]}`);
    }
    try {
      const noteResp = await ghl(`/contacts/${contactId}/notes`, { body: lines.join('\n') });
      if (!noteResp.ok) console.error('note attach failed', noteResp.status, await noteResp.text());
    } catch (noteErr) {
      console.error('note attach error (contact still saved)', noteErr);
    }

    // After the details step the client gets a confirmation text: next up is their logo and photos.
    if (step === 'details') {
      try {
        const smsResp = await ghl('/conversations/messages', {
          type: 'SMS',
          contactId,
          message: `Hi ${firstName}, Devon here from Creatively Grow. Got your details for ${clean.business_name}. Reply here with your logo and a few photos of your work. Your site gets 2 rounds of changes, and if you're not happy after those, your $150 is refunded. Want us to host it? $15/mo with 2 small edits a month, just reply HOST.`,
        });
        if (!smsResp.ok) console.error('confirmation SMS failed', smsResp.status, await smsResp.text());
      } catch (smsErr) {
        console.error('confirmation SMS error (contact still saved)', smsErr);
      }
    }

    // Tell Devon at each step, so a paid client never waits on someone checking the CRM.
    const notifyId = process.env.GHL_NOTIFY_CONTACT_ID;
    if (notifyId) {
      const who = [clean.business_name, clean.contact_name, clean.phone, clean.email].filter(Boolean).join(' — ');
      const alerts = [{
        type: 'SMS',
        contactId: notifyId,
        message: step === 'pick'
          ? `$150 site: sent to checkout. ${who}`
          : step === 'custom'
            ? `CUSTOM site request ($699 and up): ${who}`
            : `$150 site DETAILS in, look: ${look} (check Square): ${who}`,
      }];
      if (step !== 'pick') {
        alerts.push({
          type: 'Email',
          contactId: notifyId,
          emailFrom: 'Creatively Grow <letstalk@creativelygrow.com>',
          subject: step === 'custom' ? `Custom site request: ${clean.business_name}` : `$150 website details: ${clean.business_name}`,
          html: lines.map((l) => `<p>${escapeHtml(l)}</p>`).join(''),
        });
      }
      for (const alert of alerts) {
        try {
          const alertResp = await ghl('/conversations/messages', alert);
          if (!alertResp.ok) console.error(`${alert.type} notification failed`, alertResp.status, await alertResp.text());
        } catch (alertErr) {
          console.error(`${alert.type} notification error (contact still saved)`, alertErr);
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('website-start error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
