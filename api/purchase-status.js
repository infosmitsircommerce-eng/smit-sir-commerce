import {
  cashfreeConfig,
  getAuthorization,
  getLocalOrderByProviderId,
  getProduct,
  publicProduct,
  reconcileCashfreeOrder,
  verifyUser,
} from './_purchase-utils.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (!['GET', 'POST'].includes(req.method)) return res.status(405).json({ error: 'Method not allowed' });

  const authorization = getAuthorization(req);
  const user = await verifyUser(authorization);
  if (!user) return res.status(401).json({ error: 'Please sign in to check this purchase.', code: 'signin_required' });

  const providerOrderId = String(req.method === 'GET' ? req.query?.order_id || '' : req.body?.orderId || '').trim();
  if (!providerOrderId || providerOrderId.length > 120) return res.status(400).json({ error: 'Invalid order id.' });

  try {
    let local = await getLocalOrderByProviderId(providerOrderId);
    if (!local || local.user_id !== user.id) return res.status(404).json({ error: 'Order not found.' });

    const config = cashfreeConfig();
    let reconciled = null;
    if (config.ready && local.status !== 'paid' && local.status !== 'refunded') {
      reconciled = await reconcileCashfreeOrder(providerOrderId, user.id);
      local = await getLocalOrderByProviderId(providerOrderId) || local;
    }

    const product = getProduct(local.product_id);
    return res.status(200).json({
      orderId: providerOrderId,
      status: reconciled?.status || local.status,
      paid: reconciled?.paid || local.status === 'paid',
      product: publicProduct(product),
      accessPath: product?.accessPath || '/my-purchases',
      updatedAt: local.updated_at,
      gatewayReady: config.ready,
    });
  } catch (error) {
    console.error('purchase-status', error?.message || error);
    return res.status(503).json({ error: 'Unable to verify the payment right now. Your order is safe; please try again shortly.' });
  }
}
