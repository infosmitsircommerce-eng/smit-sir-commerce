import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { PREBUILD_STAGES, POSTBUILD_STAGES } from '../build-stages.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFile(join(ROOT, path), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const [pkgRaw, main, app, routes, routeSeoComponent, routeSeo, vite, styles, premiumPrerender] = await Promise.all([
  read('package.json'),
  read('src/main.jsx'),
  read('src/App.jsx'),
  read('src/routes/AppRoutes.jsx'),
  read('src/routes/RouteSEO.jsx'),
  read('src/config/routeSeo.js'),
  read('vite.config.js'),
  read('src/styles/app.css'),
  read('scripts/prerender-core-pages.mjs'),
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
for (const legacy of ['mobile.css','premiumVisuals.css','mobileExperience.css','scrollSafety.css','mobileLedger.css','desktopLearningHome.css','productPolish.css']) {
  expect(!main.includes(legacy), `Legacy global style import still active: ${legacy}`);
}
expect((styles.match(/\/\* ===== /g) || []).length === 7, 'Consolidated app.css should preserve seven ordered source sections.');

expect(app.length < 1500, `App.jsx should remain bootstrap-only; found ${app.length} characters.`);
expect(app.includes('from "./routes/AppRoutes"'), 'App must use the centralized route table.');
expect(app.includes('from "./routes/RouteSEO"'), 'App must use the centralized RouteSEO component.');
expect(routes.includes('function AnimatedRoutes()'), 'Centralized application route table is missing.');
expect(routeSeoComponent.includes('from "../config/routeSeo"'), 'RouteSEO component must consume centralized SEO policy.');
expect(!app.includes('const ROUTE_SEO = {'), 'Route SEO metadata must not live inside App.jsx.');
expect(routeSeo.includes('export const ROUTE_SEO'), 'Central route SEO map is missing.');
expect(routeSeo.includes('export function routeUsesOwnSeo'), 'Self-managed SEO route policy is missing.');

expect(!vite.includes('enhanced-test-series-entry'), 'Obsolete Test Series Vite alias still exists.');
expect(!premiumPrerender.includes('Advanced Economics practice for ₹999 once'), 'Stale ₹999 Premium source copy remains.');
expect(!premiumPrerender.includes('premium-payment-qr.jpg'), 'Stale manual QR Premium source remains.');
expect(!routes.includes('path="/test-series"'), 'Duplicate Test Series route has returned.');
expect(!routes.includes('path="/commerce-city"'), 'Retired Commerce Hub route has returned.');
expect(!routes.includes('path="/exam-tomorrow"'), 'Retired Exam Tomorrow route has returned.');
expect(!scripts.includes('scripts/prerender-exam-tomorrow.mjs'), 'Retired Exam Tomorrow is still in the build pipeline.');
expect(premiumPrerender.includes('complete current Premium access for ₹699'), 'Current ₹699 Mega Premium source is missing.');

if (failures.length) {
  for (const failure of failures) console.error('[architecture-contract] ' + failure);
  process.exitCode = 1;
} else {
  console.log(`[architecture-contract] PASS — ${stages.length} stages, bootstrap-only App.jsx, centralized routing/SEO, consolidated styles and no verified legacy alias.`);
}
