// Receives leak-check requests from landing pages and upserts a tagged
// contact into the Creatively Grow GHL location.
module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { business, phone, niche, firstName, trade } = req.body || {};
  const cleanBusiness = String(business || '').trim().slice(0, 120);
  const cleanPhone = String(phone || '').replace(/[^\d+() -]/g, '').trim().slice(0, 25);
  const cleanFirst = String(firstName || '').trim().slice(0, 60);
  const cleanTrade = String(trade || '').trim().slice(0, 160);
  const allowedNiches = ['epoxy', 'pool-cage', 'general', 'contact'];
  const cleanNiche = allowedNiches.includes(niche) ? niche : 'general';
  const isContact = cleanNiche === 'contact';
  const tagList = isContact ? ['website-contact'] : ['leak-check', cleanNiche];
  const sourceLabel = isContact ? 'website-contact' : `leak-check-${cleanNiche}`;

  if (!cleanBusiness || cleanPhone.replace(/\D/g, '').length < 10) {
    return res.status(400).json({ error: 'business name and a valid phone are required' });
  }

  try {
    const resp = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.GHL_PIT}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        firstName: cleanFirst || cleanBusiness,
        lastName: cleanFirst ? `(${cleanBusiness})` : '',
        companyName: cleanBusiness,
        phone: cleanPhone,
        tags: tagList,
        source: sourceLabel,
      }),
    });
    if (!resp.ok) {
      console.error('GHL upsert failed', resp.status, await resp.text());
      return res.status(502).json({ error: 'could not save request' });
    }

    // Attach "what they do" as a contact note so Devon sees it when recording
    if (cleanTrade) {
      try {
        const data = await resp.json();
        const contactId = data && data.contact && data.contact.id;
        if (contactId) {
          await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${process.env.GHL_PIT}`,
              Version: '2021-07-28',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ body: isContact ? `Website contact: ${cleanTrade}` : `Leak check request, what they do: ${cleanTrade}` }),
          });
        }
      } catch (noteErr) {
        console.error('note attach failed (lead still saved)', noteErr);
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('leak-check error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
