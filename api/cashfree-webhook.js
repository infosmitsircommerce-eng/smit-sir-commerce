import {
  cashfreeConfig,
  reconcileCashfreeOrder,
  verifyCashfreeWebhook,
} from './_purchase-utils.js';

function rawPayload(req) {
  if (Buffer.isBuffer(req.body)) return req.body.toString('utf8');
  if (typeof req.body === 'string') return req.body;
  // Vercel may pre-parse JSON in classic functions. Re-serialization can change bytes,
  // so signature verification will fail safely rather than grant access incorrectly.
  return req.body && typeof req.body === 'object' ? JSON.stringify(req.body) : '';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const config = cashfreeConfig();
  if (!config.ready) return res.status(503).json({ error: 'Payment gateway is not configured.' });

  const timestamp = String(req.headers['x-webhook-timestamp'] || '');
  const signature = String(req.headers['x-webhook-signature'] || '');
  const raw = rawPayload(req);
  if (!verifyCashfreeWebhook(raw, timestamp, signature)) {
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  let event;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  const providerOrderId = String(event?.data?.order?.order_id || '').trim();
  if (!providerOrderId) return res.status(200).json({ ok: true, ignored: true });

  try {
    // Never trust the webhook status alone. Confirm the order directly with Cashfree
    // before granting an entitlement.
    const result = await reconcileCashfreeOrder(providerOrderId);
    return res.status(200).json({ ok: true, status: result.status, paid: result.paid });
  } catch (error) {
    console.error('cashfree-webhook', error?.message || error);
    return res.status(503).json({ error: 'Unable to reconcile order.' });
  }
}
