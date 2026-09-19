import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { PREBUILD_STAGES, POSTBUILD_STAGES } from '../build-stages.mjs';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const read = (path) => readFile(join(ROOT, path), 'utf8');
const failures = [];
const expect = (condition, message) => { if (!condition) failures.push(message); };

const [pkgRaw, main, app, routeSeo, vite, styles, premiumPrerender] = await Promise.all([
  read('package.json'),
  read('src/main.jsx'),
  read('src/App.jsx'),
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

expect(app.includes('from "./config/routeSeo"'), 'App must consume centralized route SEO policy.');
expect(!app.includes('const ROUTE_SEO = {'), 'Route SEO metadata must not live inside App.jsx.');
expect(routeSeo.includes('export const ROUTE_SEO'), 'Central route SEO map is missing.');
expect(routeSeo.includes('export function routeUsesOwnSeo'), 'Self-managed SEO route policy is missing.');

expect(!vite.includes('enhanced-test-series-entry'), 'Obsolete Test Series Vite alias still exists.');
expect(!premiumPrerender.includes('Advanced Economics practice for ₹999 once'), 'Stale ₹999 Premium source copy remains.');
expect(!premiumPrerender.includes('premium-payment-qr.jpg'), 'Stale manual QR Premium source remains.');
expect(premiumPrerender.includes('complete current Premium access for ₹699'), 'Current ₹699 Mega Premium source is missing.');

if (failures.length) {
  for (const failure of failures) console.error('[architecture-contract] ' + failure);
  process.exitCode = 1;
} else {
  console.log(`[architecture-contract] PASS — ${stages.length} named build stages, centralized SEO policy, consolidated styles, no verified legacy alias.`);
}
