import {
  cashfreeConfig,
  reconcileCashfreeOrder,
  verifyCashfreeWebhook,
} from './_purchase-utils.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const gateway = cashfreeConfig();
  if (!gateway.ready) return res.status(503).json({ error: 'Payment gateway is not configured.' });

  const timestamp = String(req.headers['x-webhook-timestamp'] || '');
  const signature = String(req.headers['x-webhook-signature'] || '');
  const raw = await readRawBody(req);

  if (!verifyCashfreeWebhook(raw, timestamp, signature)) {
    return res.status(400).json({ error: 'Invalid webhook signature.' });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return res.status(400).json({ error: 'Invalid JSON.' });
  }

  const providerOrderId = String(event?.data?.order?.order_id || '').trim();
  if (!providerOrderId) return res.status(200).json({ ok: true, ignored: true });

  try {
    // The signed event is only a trigger. We independently fetch the order from
    // Cashfree before marking it paid and granting the product entitlement.
    const result = await reconcileCashfreeOrder(providerOrderId);
    return res.status(200).json({ ok: true, status: result.status, paid: result.paid });
  } catch (error) {
    console.error('cashfree-webhook', error?.message || error);
    return res.status(503).json({ error: 'Unable to reconcile order.' });
  }
}
