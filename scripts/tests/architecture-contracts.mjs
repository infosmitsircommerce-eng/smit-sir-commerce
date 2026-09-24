import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { PREBUILD_STAGES, POSTBUILD_STAGES } from '../build-stages.mjs';
import { PREMIUM_MEGA_INCLUDED_PRODUCT_IDS } from '../../src/data/premiumMegaPack.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFile(join(ROOT, path), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const [
  pkgRaw,
  main,
  app,
  home,
  routes,
  routeSeoComponent,
  routeSeo,
  vite,
  styles,
  performanceStyles,
  layout,
  navbar,
  premiumPrerender,
  premiumTransition,
  requestGuard,
  chatApi,
  doubtApi,
  reelApi,
  enquiryApi,
] = await Promise.all([
  read('package.json'),
  read('src/main.jsx'),
  read('src/App.jsx'),
  read('src/pages/Home.jsx'),
  read('src/routes/AppRoutes.jsx'),
  read('src/routes/RouteSEO.jsx'),
  read('src/config/routeSeo.js'),
  read('vite.config.js'),
  read('src/styles/app.css'),
  read('src/styles/performance.css'),
  read('src/components/layout/Layout.jsx'),
  read('src/components/layout/Navbar.jsx'),
  read('scripts/prerender-core-pages.mjs'),
  read('scripts/finalize-premium-transition.mjs'),
  read('api/_request-guard.js'),
  read('api/chat.js'),
  read('api/doubt.js'),
  read('api/reel.js'),
  read('api/enquiry-email.js'),
]);

const pkg = JSON.parse(pkgRaw);
const stages = [...PREBUILD_STAGES, ...POSTBUILD_STAGES];
const stageNames = stages.map((stage) => stage.name);
const scripts = stages.flatMap((stage) => stage.scripts);

expect(stages.length >= 8 && stages.length <= 15, `Build should expose 8-15 clear stages; found ${stages.length}.`);
expect(new Set(stageNames).size === stageNames.length, 'Build stage names must be unique.');
expect(new Set(scripts).size === scripts.length, 'A build script appears in more than one stage.');
expect(pkg.scripts.prebuild === 'node scripts/run-prebuild.mjs', 'package.json prebuild must use the staged runner.');
expect(pkg.scripts.postbuild === 'node scripts/run-postbuild.mjs', 'package.json postbuild must use the staged runner.');

expect(main.includes("import './index.css'"), 'Base stylesheet import is missing.');
expect(main.includes("import './styles/app.css'"), 'Consolidated application stylesheet import is missing.');
expect(main.includes("import './styles/performance.css'"), 'Desktop performance stylesheet import is missing.');
for (const legacy of ['mobile.css','premiumVisuals.css','mobileExperience.css','scrollSafety.css','mobileLedger.css','desktopLearningHome.css','productPolish.css']) {
  expect(!main.includes(legacy), `Legacy global style import still active: ${legacy}`);
}
expect((styles.match(/\/\* ===== /g) || []).length === 7, 'Consolidated app.css should preserve seven ordered source sections.');

// Desktop scroll must remain native and cheap. These decorative effects caused
// continuous layout/compositor work and noticeable laptop scroll jank.
expect(!main.includes("import('aos')"), 'AOS desktop scroll animation bootstrap has returned.');
expect(!layout.includes('CursorSpotlight'), 'Continuous cursor spotlight must not run in the global layout.');
expect(!layout.includes('ScrollProgressBar'), 'React scroll progress bar must not run in the global layout.');
expect(!navbar.includes('backdropFilter'), 'Desktop navbar live backdrop blur has returned.');
expect(!navbar.includes('WebkitBackdropFilter'), 'Desktop navbar WebKit backdrop blur has returned.');
expect(!navbar.includes('window.addEventListener("scroll"'), 'Desktop navbar must not subscribe to scroll just for decoration.');
expect(performanceStyles.includes('will-change: auto !important'), 'Performance layer must clear permanent compositor promotion.');
expect(performanceStyles.includes('content-visibility: auto !important'), 'Homepage below-fold paint skipping must override the legacy global scroll-safety rule.');
expect(performanceStyles.includes('backdrop-filter: none !important'), 'Desktop performance layer must disable expensive live blur surfaces.');
expect(performanceStyles.includes('transition: none !important'), 'Homepage desktop motion must not animate underneath a stationary pointer during scrolling.');
expect(home.includes('import HomeBelowFold from "../components/home/HomeBelowFold"'), 'Homepage lower content must be available synchronously on desktop.');
expect(!home.includes('IntersectionObserver'), 'Homepage must not mount the lower document in response to active scrolling.');
expect(home.includes('window.matchMedia("(min-width: 1024px)").matches'), 'Homepage must render the complete lower structure immediately on desktop.');

expect(app.length < 1500, `App.jsx should remain bootstrap-only; found ${app.length} characters.`);
expect(app.includes('from "./routes/AppRoutes"'), 'App must use the centralized route table.');
expect(app.includes('from "./routes/RouteSEO"'), 'App must use the centralized RouteSEO component.');
expect(routes.includes('function AnimatedRoutes()'), 'Centralized application route table is missing.');
expect(routeSeoComponent.includes('from "../config/routeSeo"'), 'RouteSEO component must consume centralized SEO policy.');
expect(!app.includes('const ROUTE_SEO = {'), 'Route SEO metadata must not live inside App.jsx.');
expect(routeSeo.includes('export const ROUTE_SEO'), 'Central route SEO map is missing.');
expect(routeSeo.includes('export function routeUsesOwnSeo'), 'Self-managed SEO route policy is missing.');
for (const selfManagedSeoPath of [
  '/premium/economics',
  '/premium/cbse-12-business-studies',
  '/cbse-class-12-accountancy-financial-ratios-notes',
]) {
  expect(
    routeSeo.includes(`pathname === "${selfManagedSeoPath}"`),
    `Self-managed SEO route is missing from routeUsesOwnSeo: ${selfManagedSeoPath}`,
  );
}

expect(!vite.includes('enhanced-test-series-entry'), 'Obsolete Test Series Vite alias still exists.');
expect(!premiumPrerender.includes('Advanced Economics practice for ₹999 once'), 'Stale ₹999 Premium source copy remains.');
expect(!premiumPrerender.includes('premium-payment-qr.jpg'), 'Stale manual QR Premium source remains.');
expect(premiumPrerender.includes('import { PREMIUM_MEGA_PACK } from "../src/data/premiumMegaPack.js";'), 'Premium prerender must import the canonical Mega Premium product model.');
expect(premiumPrerender.includes('price: String(PREMIUM_MEGA_PACK.price)'), 'Premium Product schema price must come from the canonical product model.');
expect(premiumTransition.includes('PREMIUM_MEGA_PACK.price'), 'Final Premium static copy must derive price from the canonical product model.');
expect(premiumTransition.includes('Cashfree'), 'Final Premium static copy must describe the current secure checkout flow.');
expect(!premiumTransition.includes('QR payment and UTR'), 'Retired manual QR/UTR Premium copy has returned.');
expect(scripts.includes('scripts/normalize-premium-pricing.mjs'), 'Final build must normalize stale Mega Premium price copy from the canonical product model.');
expect(scripts.includes('scripts/prerender-bst-premium.mjs'), 'CBSE 12 Business Studies Premium must receive crawlable prerendered HTML.');
expect(scripts.includes('scripts/ensure-indexable-premium-sitemap.mjs'), 'Indexable Business Studies Premium must be added to the generated sitemap.');
expect(PREMIUM_MEGA_INCLUDED_PRODUCT_IDS.includes('cbse-12-business-studies'), 'Complete Commerce entitlements must include CBSE 12 Business Studies Premium.');
expect(!routes.includes('path="/test-series"'), 'Duplicate Test Series route has returned.');
expect(!routes.includes('path="/commerce-city"'), 'Retired Commerce Hub route has returned.');
expect(!routes.includes('path="/exam-tomorrow"'), 'Retired Exam Tomorrow route has returned.');
expect(!scripts.includes('scripts/prerender-exam-tomorrow.mjs'), 'Retired Exam Tomorrow is still in the build pipeline.');

expect(requestGuard.includes('enforceRateLimit'), 'Shared API rate-limit guard is missing.');
expect(requestGuard.includes('enforceSiteOrigin'), 'Shared same-site API origin guard is missing.');
for (const [name, source] of [
  ['chat', chatApi],
  ['doubt', doubtApi],
  ['reel', reelApi],
  ['enquiry', enquiryApi],
]) {
  expect(source.includes("from './_request-guard.js'"), `${name} API must use the shared request guard.`);
  expect(source.includes('enforceRateLimit'), `${name} API must enforce application-level throttling.`);
  expect(source.includes('enforceSiteOrigin'), `${name} API must reject cross-site browser abuse.`);
}
expect(!chatApi.includes('200+ students'), 'Unsupported student-count claim has returned to Smit Sir AI.');
expect(!chatApi.includes('91% score above 80%'), 'Unsupported results claim has returned to Smit Sir AI.');
expect(!chatApi.includes('smitsircommerce.vercel.app'), 'Old Vercel domain has returned to the AI system prompt.');
expect(chatApi.includes('www.smitsircommerce.in'), 'AI system prompt must use the official production domain.');
expect(chatApi.includes("item.role === 'user' || item.role === 'assistant'"), 'Chat history roles must be restricted to user/assistant.');
expect(!doubtApi.includes("Access-Control-Allow-Origin', '*'"), 'Wildcard CORS must not return on the paid AI doubt endpoint.');
expect(!reelApi.includes("Access-Control-Allow-Origin', '*'"), 'Wildcard CORS must not return on the AI reel endpoint.');

if (failures.length) {
  for (const failure of failures) console.error('[architecture-contract] ' + failure);
  process.exitCode = 1;
} else {
  console.log(`[architecture-contract] PASS — ${stages.length} stages, stable native desktop scroll, centralized routing/SEO, protected Premium contracts and hardened public APIs.`);
}
