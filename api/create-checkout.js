import {
  cashfreeConfig,
  cashfreeRequest,
  getAuthorization,
  getProduct,
  hasProductAccess,
  newProviderOrderId,
  publicProduct,
  serviceRequest,
  verifyUser,
} from './_purchase-utils.js';

const SITE = 'https://www.smitsircommerce.in';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store');
  res.setHeader('Vary', 'Authorization');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const authorization = getAuthorization(req);
  const user = await verifyUser(authorization);
  if (!user) return res.status(401).json({ error: 'Please sign in before buying a pack.', code: 'signin_required' });

  const product = getProduct(req.body?.productId);
  if (!product) return res.status(404).json({ error: 'Pack not found.' });

  if (await hasProductAccess(authorization, product.id)) {
    return res.status(200).json({ alreadyOwned: true, product: publicProduct(product), accessPath: product.accessPath });
  }

  const phone = String(req.body?.phone || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return res.status(400).json({ error: 'Enter a valid 10-digit Indian mobile number.', code: 'phone_required' });
  }

  const config = cashfreeConfig();
  if (!config.ready) {
    return res.status(503).json({
      error: 'Secure Cashfree checkout is being activated. No payment has been taken.',
      code: 'gateway_activation_pending',
    });
  }

  try {
    const providerOrderId = newProviderOrderId();
    const now = new Date().toISOString();

    const rows = await serviceRequest('/rest/v1/payment_orders', {
      method: 'POST',
      prefer: 'return=representation',
      body: {
        user_id: user.id,
        product_id: product.id,
        amount_paise: product.price * 100,
        currency: 'INR',
        provider: 'cashfree',
        provider_order_id: providerOrderId,
        status: 'created',
        created_at: now,
        updated_at: now,
        raw_status: {},
      },
    });
    const localOrder = Array.isArray(rows) ? rows[0] : null;
    if (!localOrder) throw new Error('Unable to create local order');

    const customerName = String(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student').slice(0, 100);
    const providerOrder = await cashfreeRequest('/pg/orders', {
      method: 'POST',
      idempotencyKey: localOrder.id,
      body: {
        order_id: providerOrderId,
        order_amount: product.price,
        order_currency: 'INR',
        customer_details: {
          customer_id: `ssc_${user.id.replaceAll('-', '').slice(0, 24)}`,
          customer_name: customerName,
          customer_email: user.email || undefined,
          customer_phone: phone,
        },
        order_meta: {
          return_url: `${SITE}/purchase-status?order_id={order_id}`,
          notify_url: `${SITE}/api/cashfree-webhook`,
        },
        order_note: `${product.shortName} one-time access`,
        order_tags: {
          product_id: product.id,
          local_order_id: localOrder.id,
        },
      },
    });

    await serviceRequest(`/rest/v1/payment_orders?id=eq.${encodeURIComponent(localOrder.id)}`, {
      method: 'PATCH',
      prefer: 'return=minimal',
      body: {
        status: 'pending',
        payment_session_id: providerOrder.payment_session_id || null,
        updated_at: new Date().toISOString(),
        raw_status: providerOrder,
      },
    });

    return res.status(200).json({
      orderId: providerOrderId,
      paymentSessionId: providerOrder.payment_session_id,
      environment: config.production ? 'production' : 'sandbox',
      product: publicProduct(product),
    });
  } catch (error) {
    console.error('create-checkout', error?.message || error);
    return res.status(503).json({ error: 'Unable to start secure checkout right now. Please try again shortly.', code: 'checkout_unavailable' });
  }
}
