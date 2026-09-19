import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFile(join(ROOT, path), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const [app, routeSeo, checkout, status, webhook, purchaseUtils, vercel] = await Promise.all([
  read('src/App.jsx'),
  read('src/config/routeSeo.js'),
  read('api/create-checkout.js'),
  read('api/purchase-status.js'),
  read('api/cashfree-webhook.js'),
  read('api/_purchase-utils.js'),
  read('vercel.json'),
]);

for (const route of ['/', '/study-material', '/quizzes', '/test-series', '/premium', '/login', '/my-purchases', '/purchase-status']) {
  const needle = route === '/' ? 'path="/" ' : `path="${route}"`;
  expect(app.includes(needle), `Critical student route missing from App.jsx: ${route}`);
}
for (const privateRoute of ['/login', '/dashboard', '/learning-insights', '/my-data']) {
  expect(routeSeo.includes(`"${privateRoute}"`), `Private route missing from centralized SEO policy: ${privateRoute}`);
}
expect(checkout.includes('verifyUser(authorization)'), 'Checkout must authenticate the student.');
expect(checkout.includes('getProduct(req.body?.productId)'), 'Checkout must resolve products server-side.');
expect(checkout.includes('hasProductAccess(authorization, product.id)'), 'Checkout must prevent accidental duplicate ownership.');
expect(checkout.includes("provider: 'cashfree'"), 'Checkout provider contract changed unexpectedly.');
expect(status.includes('local.user_id !== user.id'), 'Purchase status must enforce order ownership.');
expect(status.includes('reconcileCashfreeOrder(providerOrderId, user.id)'), 'Purchase status must reconcile with Cashfree server-side.');
expect(webhook.includes('verifyCashfreeWebhook(raw, timestamp, signature)'), 'Cashfree webhook signature verification is missing.');
expect(webhook.includes('reconcileCashfreeOrder(providerOrderId)'), 'Cashfree webhook must reconcile the provider order before granting access.');
expect(purchaseUtils.includes('timingSafeEqual'), 'Webhook signature comparison must remain timing-safe.');
expect(/"source"\s*:\s*"\/login"[\s\S]*?"X-Robots-Tag"[\s\S]*?"noindex/.test(vercel), 'Login must remain server-level noindex.');

if (failures.length) {
  for (const failure of failures) console.error('[critical-journey-contract] ' + failure);
  process.exitCode = 1;
} else {
  console.log('[critical-journey-contract] PASS — core student routes and payment security invariants are intact.');
}
