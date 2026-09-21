import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function routeCandidates(route) {
  if (route === '/') return [join(DIST, 'index.html')];
  const relative = route.replace(/^\//, '');
  const candidates = [];
  if (relative.endsWith('.html')) candidates.push(join(DIST, relative));
  else candidates.push(join(DIST, `${relative}.html`));
  candidates.push(join(DIST, relative, 'index.html'));
  return [...new Set(candidates)];
}

function injectBeforeEnd(html, block) {
  if (/<\/article>/i.test(html)) return html.replace(/<\/article>/i, `${block}\n</article>`);
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, `${block}\n</main>`);
  return html.replace(/<\/body>/i, `${block}\n</body>`);
}

const bridges = [
  {
    source: '/commerce-coaching-mehsana',
    marker: 'data-seo-online-batch-bridge',
    block: `<section data-seo-online-batch-bridge>
  <h2>Prefer learning online?</h2>
  <p>If travelling for tuition is difficult, students can also explore the <a href="/online-batch">online Commerce batch</a> for a structured Class 11–12 learning path.</p>
</section>`
  },
  {
    source: '/gseb-class-12-economics.html',
    marker: 'data-seo-gseb-chapter-bridge',
    block: `<section data-seo-gseb-chapter-bridge>
  <h2>Continue with GSEB Class 12 Economics chapters</h2>
  <p>Open the chapter you need next for focused revision:</p>
  <ul>
    <li><a href="/gseb/class-12/economics/poverty-notes">Chapter 5: Poverty Notes</a></li>
    <li><a href="/gseb/class-12/economics/unemployment-notes">Chapter 6: Unemployment Notes</a></li>
    <li><a href="/gseb/class-12/economics/foreign-trade-notes">Chapter 9: Foreign Trade Notes</a></li>
    <li><a href="/gseb/class-12/economics/industrial-sector-notes">Chapter 10: Industrial Sector Notes</a></li>
    <li><a href="/gseb/class-12/economics/emerging-issues-in-indian-economy-notes">Chapter 11: Emerging Issues Notes</a></li>
  </ul>
</section>`
  },
  {
    source: '/cbse-notes',
    marker: 'data-seo-cbse-practice-bridge',
    block: `<section data-seo-cbse-practice-bridge>
  <h2>CBSE Class 12 numerical practice</h2>
  <p>After revising the concepts, practise with <a href="/cbse-class-12-macroeconomics-numericals.html">Class 12 Macroeconomics numericals</a> to move from theory to exam application.</p>
</section>`
  },
  {
    source: '/study-material',
    marker: 'data-seo-accountancy-formula-bridge',
    block: `<section data-seo-accountancy-formula-bridge>
  <h2>Quick Accountancy revision</h2>
  <p>For Class 12 Accountancy, use the <a href="/accountancy-ratio-formulas-class-12.html">accounting ratio formulas revision page</a> for a faster formula check before practice.</p>
</section>`
  }
];

let patchedFiles = 0;
const missingSources = [];

for (const bridge of bridges) {
  let foundSource = false;
  for (const candidate of routeCandidates(bridge.source)) {
    if (!(await exists(candidate))) continue;
    foundSource = true;
    let html = await readFile(candidate, 'utf8');
    if (html.includes(bridge.marker)) continue;
    html = injectBeforeEnd(html, bridge.block);
    await writeFile(candidate, html, 'utf8');
    patchedFiles += 1;
  }
  if (!foundSource) missingSources.push(bridge.source);
}

if (missingSources.length) {
  console.warn(`[seo-orphans] Source pages not found in dist: ${missingSources.join(', ')}`);
}

console.log(`[seo-orphans] Added contextual internal links for 8 previously orphaned sitemap pages across ${patchedFiles} generated HTML files.`);
