import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { BOARD_BOOSTER_PRODUCTS } from '../src/data/boardBoosterProducts.js';
import {
  PREMIUM_MEGA_INCLUDED_PRODUCT_IDS,
  PREMIUM_MEGA_PACK,
} from '../src/data/premiumMegaPack.js';

export const SUPABASE_URL = 'https://abpruwygnsmeqisaehip.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_9eybAsihq3-YNL1uGmGo3w_DWheWwRg';
export const CASHFREE_API_VERSION = '2025-01-01';

const PRODUCTS = new Map(
  [...BOARD_BOOSTER_PRODUCTS, PREMIUM_MEGA_PACK].map((product) => [product.id, product]),
);
const MEGA_INCLUDED_PRODUCTS = new Set(PREMIUM_MEGA_INCLUDED_PRODUCT_IDS);

export function getProduct(productId) {
  return PRODUCTS.get(productId) || null;
}

export function publicProduct(product) {
  if (!product) return null;
  return {
    id: product.id,
    name: product.name,
    shortName: product.shortName,
    price: product.price,
    board: product.board,
    classLevel: product.classLevel,
    subject: product.subject,
    accessPath: product.accessPath,
    previewPath: product.previewPath,
  };
}

export function productIdForQuizPack(pack) {
  if (!pack || pack.subject !== 'Economics') return null;
  if (pack.board === 'GSEB' && pack.classLevel === 12) return 'gseb-12-economics';
  if (pack.board === 'CBSE' && pack.classLevel === 12) return 'cbse-12-economics';
  if (pack.board === 'CBSE' && pack.classLevel === 11) return 'cbse-11-microeconomics';
  return null;
}

export function getAuthorization(req) {
  const value = req.headers?.authorization || req.headers?.Authorization || '';
  return typeof value === 'string' && value.startsWith('Bearer ') ? value : '';
}

export async function verifyUser(authorization) {
  if (!authorization) return null;
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: authorization },
  });
  if (!response.ok) return null;
  const user = await response.json();
  return user?.id ? user : null;
}

async function hasDirectProductAccess(authorization, productId) {
  if (!authorization || !productId) return false;
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/has_product_entitlement`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ p_product_id: productId }),
  });
  if (!response.ok) return false;
  return (await response.json()) === true;
}

export async function hasProductAccess(authorization, productId) {
  const direct = await hasDirectProductAccess(authorization, productId);
  if (direct) return true;

  if (MEGA_INCLUDED_PRODUCTS.has(productId)) {
    return hasDirectProductAccess(authorization, PREMIUM_MEGA_PACK.id);
  }

  return false;
}

export function serviceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || '';
}

export async function serviceRequest(path, { method = 'GET', body, prefer } = {}) {
  const key = serviceRoleKey();
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (prefer) headers.Prefer = prefer;
  const response = await fetch(`${SUPABASE_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(`Database request failed (${response.status}) ${text.slice(0, 200)}`);
  }
  if (response.status === 204) return null;
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

export function cashfreeConfig() {
  const clientId = process.env.CASHFREE_CLIENT_ID || '';
  const clientSecret = process.env.CASHFREE_CLIENT_SECRET || '';
  const production = (process.env.CASHFREE_ENV || '').toLowerCase() === 'production';
  return {
    clientId,
    clientSecret,
    production,
    ready: Boolean(clientId && clientSecret && serviceRoleKey()),
    apiBase: production ? 'https://api.cashfree.com' : 'https://sandbox.cashfree.com',
  };
}

export async function cashfreeRequest(path, { method = 'GET', body, idempotencyKey } = {}) {
  const config = cashfreeConfig();
  if (!config.clientId || !config.clientSecret) throw new Error('Cashfree credentials are not configured');
  const headers = {
    'x-client-id': config.clientId,
    'x-client-secret': config.clientSecret,
    'x-api-version': CASHFREE_API_VERSION,
    'Content-Type': 'application/json',
  };
  if (idempotencyKey) headers['x-idempotency-key'] = idempotencyKey;
  const response = await fetch(`${config.apiBase}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let data = {};
  try { data = text ? JSON.parse(text) : {}; } catch { data = { message: text }; }
  if (!response.ok) {
    const error = new Error(data?.message || data?.type || `Cashfree request failed (${response.status})`);
    error.status = response.status;
    error.details = data;
    throw error;
  }
  return data;
}

export function newProviderOrderId() {
  return `ssc_${Date.now()}_${randomUUID().replaceAll('-', '').slice(0, 12)}`;
}

export async function getLocalOrderByProviderId(providerOrderId) {
  const rows = await serviceRequest(`/rest/v1/payment_orders?provider_order_id=eq.${encodeURIComponent(providerOrderId)}&select=*`);
  return Array.isArray(rows) ? rows[0] || null : null;
}

export async function markOrderAndGrant({ order, providerStatus, providerPaymentId = null, rawStatus = {} }) {
  if (!order) throw new Error('Local order not found');
  const now = new Date().toISOString();
  const paid = providerStatus === 'PAID';
  const status = paid
    ? 'paid'
    : ['EXPIRED', 'TERMINATED'].includes(providerStatus)
      ? 'cancelled'
      : ['FAILED', 'FAILURE'].includes(providerStatus)
        ? 'failed'
        : 'pending';

  await serviceRequest(`/rest/v1/payment_orders?id=eq.${encodeURIComponent(order.id)}`, {
    method: 'PATCH',
    prefer: 'return=minimal',
    body: {
      status,
      provider_payment_id: providerPaymentId || order.provider_payment_id || null,
      updated_at: now,
      paid_at: paid ? (order.paid_at || now) : order.paid_at,
      raw_status: rawStatus || {},
    },
  });

  if (paid) {
    await serviceRequest('/rest/v1/product_entitlements?on_conflict=user_id,product_id', {
      method: 'POST',
      prefer: 'resolution=merge-duplicates,return=minimal',
      body: {
        user_id: order.user_id,
        product_id: order.product_id,
        order_id: order.id,
        source: 'cashfree',
        granted_at: now,
        expires_at: null,
        revoked_at: null,
        metadata: { provider_order_id: order.provider_order_id },
      },
    });
  }

  return { status, paid };
}

export async function reconcileCashfreeOrder(providerOrderId, expectedUserId = null) {
  const order = await getLocalOrderByProviderId(providerOrderId);
  if (!order) return { found: false, status: 'unknown', paid: false };
  if (expectedUserId && order.user_id !== expectedUserId) return { found: false, status: 'unknown', paid: false };

  const provider = await cashfreeRequest(`/pg/orders/${encodeURIComponent(providerOrderId)}`);
  const providerStatus = String(provider?.order_status || 'ACTIVE').toUpperCase();
  const result = await markOrderAndGrant({ order, providerStatus, rawStatus: provider });
  return { found: true, ...result, order, provider };
}

export function verifyCashfreeWebhook(rawBody, timestamp, signature) {
  const secret = process.env.CASHFREE_CLIENT_SECRET || '';
  if (!secret || !rawBody || !timestamp || !signature) return false;
  const expected = createHmac('sha256', secret).update(`${timestamp}${rawBody}`).digest('base64');
  const left = Buffer.from(expected);
  const right = Buffer.from(signature);
  return left.length === right.length && timingSafeEqual(left, right);
}
