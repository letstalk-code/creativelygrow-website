// Receives ratings/feedback from review.html (the review gate for Creatively Grow's own
// Google Business Profile) and records them in GHL. Mirrors api/leak-check.js's pattern —
// same account, same shape. 4-5 star ratings never reach Google through us (the page links
// straight to the GBP review URL); this endpoint just logs the signal and tags the contact.
// 1-3 star ratings carry real feedback text and get an internal alert since those never
// touch Google at all.

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]));

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://creativelygrow.com');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'method not allowed' });

  const { contact_id, name, email, phone, rating, sentiment, feedback } = req.body || {};
  const cleanRating = Number(rating);
  if (!Number.isInteger(cleanRating) || cleanRating < 1 || cleanRating > 5) {
    return res.status(400).json({ error: 'invalid rating' });
  }
  const isNegative = sentiment === 'negative';
  const cleanName = String(name || '').trim().slice(0, 120);
  const cleanEmail = String(email || '').trim().slice(0, 160);
  const cleanPhone = String(phone || '').replace(/[^\d+() -]/g, '').trim().slice(0, 25);
  const cleanFeedback = String(feedback || '').trim().slice(0, 2000);
  const cleanContactId = String(contact_id || '').trim().slice(0, 60);

  const ghlHeaders = {
    Authorization: `Bearer ${process.env.GHL_PIT}`,
    Version: '2021-07-28',
    'Content-Type': 'application/json',
  };

  const tags = [isNegative ? 'review-negative' : 'review-positive', `review-${cleanRating}-star`];

  try {
    let contactId = cleanContactId || null;

    // No contact_id on the link (e.g. a QR code / direct visit) — only create a contact
    // record if we actually have something to identify them by.
    if (!contactId && (cleanPhone || cleanEmail)) {
      const payload = {
        locationId: process.env.GHL_LOCATION_ID,
        tags,
        source: 'review-gate',
      };
      if (cleanPhone) payload.phone = cleanPhone;
      if (cleanEmail) payload.email = cleanEmail;
      if (cleanName) payload.firstName = cleanName;

      const resp = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
        method: 'POST',
        headers: ghlHeaders,
        body: JSON.stringify(payload),
      });
      if (resp.ok) {
        const data = await resp.json();
        contactId = (data && data.contact && data.contact.id) || null;
      } else {
        console.error('GHL upsert failed', resp.status, await resp.text());
      }
    } else if (contactId) {
      // Known contact — just tag them, no field overwrite.
      try {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/tags`, {
          method: 'POST',
          headers: ghlHeaders,
          body: JSON.stringify({ tags }),
        });
      } catch (tagErr) {
        console.error('tag add failed', tagErr);
      }
    }

    if (contactId && cleanFeedback) {
      try {
        await fetch(`https://services.leadconnectorhq.com/contacts/${contactId}/notes`, {
          method: 'POST',
          headers: ghlHeaders,
          body: JSON.stringify({
            body: `Review gate feedback (${cleanRating} star): ${cleanFeedback}`,
          }),
        });
      } catch (noteErr) {
        console.error('note attach failed (feedback still logged)', noteErr);
      }
    }

    // Negative reviews never reach Google through this page, so this alert is the only
    // signal Devon gets — worth pinging both SMS and email. Positive ratings don't need
    // an urgent nudge since the customer is already being sent to the public GBP.
    if (isNegative) {
      const notifyId = process.env.GHL_NOTIFY_CONTACT_ID;
      if (notifyId) {
        const who = cleanName || cleanEmail || cleanPhone || 'Anonymous';
        const summary = `${cleanRating}-star from ${who}: ${cleanFeedback || '(no comment left)'}`;
        const alerts = [
          { type: 'SMS', contactId: notifyId, message: `Review gate (negative): ${summary}` },
          {
            type: 'Email',
            contactId: notifyId,
            emailFrom: 'Creatively Grow <letstalk@creativelygrow.com>',
            subject: `Negative review gate feedback (${cleanRating} star)`,
            html: `<p><strong>${escapeHtml(who)}</strong> — ${cleanRating} star</p><p>${escapeHtml(cleanFeedback || '(no comment left)')}</p>`,
          },
        ];
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
            console.error(`${alert.type} notification error (feedback still logged)`, alertErr);
          }
        }
      }
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('review-feedback error', err);
    return res.status(500).json({ error: 'server error' });
  }
};
