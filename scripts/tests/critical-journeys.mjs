import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFile(join(ROOT, path), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const [routes, routeSeo, checkout, status, webhook, purchaseUtils, vercel] = await Promise.all([
  read('src/routes/AppRoutes.jsx'),
  read('src/config/routeSeo.js'),
  read('api/create-checkout.js'),
  read('api/purchase-status.js'),
  read('api/cashfree-webhook.js'),
  read('api/_purchase-utils.js'),
  read('vercel.json'),
]);

for (const route of ['/', '/study-material', '/quizzes', '/premium', '/login', '/my-purchases', '/purchase-status']) {
  const needle = route === '/' ? 'path="/" ' : `path="${route}"`;
  expect(routes.includes(needle), `Critical student route missing from centralized route table: ${route}`);
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
expect(/"source"\s*:\s*"\/test-series"[\s\S]*?"destination"\s*:\s*"\/quizzes"/.test(vercel), 'Retired Test Series must redirect to Practice.');
expect(/"source"\s*:\s*"\/commerce-city"[\s\S]*?"destination"\s*:\s*"\/study-material"/.test(vercel), 'Retired Commerce Hub must redirect to Notes.');
expect(/"source"\s*:\s*"\/exam-tomorrow"[\s\S]*?"destination"\s*:\s*"\/quizzes"/.test(vercel), 'Retired Exam Tomorrow must redirect to Practice.');
expect(!routes.includes('path="/test-series"'), 'Test Series must not return as a duplicate top-level route.');
expect(!routes.includes('path="/commerce-city"'), 'Commerce Hub must not return to the student route table.');
expect(!routes.includes('path="/exam-tomorrow"'), 'Exam Tomorrow must not return to the student route table.');

if (failures.length) {
  for (const failure of failures) console.error('[critical-journey-contract] ' + failure);
  process.exitCode = 1;
} else {
  console.log('[critical-journey-contract] PASS — core student routes and payment security invariants are intact.');
}
