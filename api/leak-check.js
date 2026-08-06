// Receives leak-check requests from landing pages and upserts a tagged
// contact into the Creatively Grow GHL location.

// The lead's own words end up inside the notification email, so they get escaped
// before they are dropped into markup.
const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

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

    const data = await resp.json();
    const contactId = data && data.contact && data.contact.id;
    const ghlHeaders = {
      Authorization: `Bearer ${process.env.GHL_PIT}`,
      Version: '2021-07-28',
      'Content-Type': 'application/json',
    };

    if (contactId) {
      // Attach "what they do" so Devon has context before he replies
      if (cleanTrade) {
        try {
          await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
            method: 'POST',
            headers: ghlHeaders,
            body: JSON.stringify({
              body: isContact ? `Website contact: ${cleanTrade}` : `Leak check request, what they do: ${cleanTrade}`,
            }),
          });
        } catch (noteErr) {
          console.error('note attach failed (lead still saved)', noteErr);
        }
      }

      // Instant acknowledgement text. The site promises a fast response, so this is the product demonstrating itself.
      try {
        const name = cleanFirst || 'there';
        const message = isContact
          ? `Hi ${name}, Devon here from Creatively Grow. Got your message about ${cleanBusiness}. I'll take a look at your setup and get back to you personally. You can reply right here.`
          : `Hi ${name}, Devon here from Creatively Grow. Got your request for ${cleanBusiness}. I record these video reviews myself, so yours lands within 48 hours. Reply here if you need anything sooner.`;
        const smsResp = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
          method: 'POST',
          headers: ghlHeaders,
          body: JSON.stringify({ type: 'SMS', contactId, message }),
        });
        if (!smsResp.ok) {
          console.error('auto-reply SMS failed', smsResp.status, await smsResp.text());
        }
      } catch (smsErr) {
        console.error('auto-reply SMS error (lead still saved)', smsErr);
      }

      // Tell Devon a lead came in. Without this the lead lands silently in the CRM
      // and the fast follow-up this site sells depends on someone happening to look.
      const notifyId = process.env.GHL_NOTIFY_CONTACT_ID;
      if (notifyId) {
        const label = isContact ? 'Website contact' : `Leak check (${cleanNiche})`;
        const summary = [
          cleanBusiness,
          cleanFirst,
          cleanPhone,
          cleanTrade && `"${cleanTrade}"`,
        ].filter(Boolean).join(' — ');
        const alerts = [
          { type: 'SMS', contactId: notifyId, message: `${label}: ${summary}` },
          {
            type: 'Email',
            contactId: notifyId,
            subject: `${label}: ${cleanBusiness}`,
            html: `<p>${escapeHtml(summary)}</p>`,
          },
        ];
        // Sent independently so a failure on one channel still leaves the other.
        for (const alert of alerts) {
          try {
            const alertResp = await fetch('https://services.leadconnectorhq.com/conversations/messages', {
              method: 'POST',
              headers: ghlHeaders,
              body: JSON.stringify(alert),
            });
            if (!alertResp.ok) {
              console.error(`${alert.type} notification failed`, alertResp.status, await alertResp.text());
            }
          } catch (alertErr) {
            console.error(`${alert.type} notification error (lead still saved)`, alertErr);
          }
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('leak-check error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
