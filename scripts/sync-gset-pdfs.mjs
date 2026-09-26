import fs from 'node:fs/promises';
import path from 'node:path';

const SOURCE_ORIGIN = 'https://smit-sir-ccsp-assets.floot.app';

const assets = [
  ['unit-2/chapter-1-accounting-foundations.pdf', '/_cdn/static/d39d08ef-667b-478a-a02f-fa02ff5c5ec1-gset-u2-c1-accounting-foundations.pdf'],
  ['unit-2/chapter-2-partnership-accounts.pdf', '/_cdn/static/6efa7b74-f7e8-4563-8205-9e41f90ea158-gset-u2-c2-partnership-accounts.pdf'],
  ['unit-2/chapter-3-corporate-accounting.pdf', '/_cdn/static/e4c2c33e-e461-41a8-ad68-cb572226c51b-gset-u2-c3-corporate-accounting.pdf'],
  ['unit-2/chapter-4-cost-management-financial-statement-analysis.pdf', '/_cdn/static/62fdae26-3110-4cda-ab51-bf5d86c546c4-gset-u2-c4-cost-management-fsa.pdf'],
  ['unit-2/chapter-5-accounting-standards-ifrs-auditing.pdf', '/_cdn/static/e5aa6f60-20f4-4de6-96fe-de48c0a7e422-gset-u2-c5-accounting-standards-ifrs-auditing.pdf'],
  ['unit-4/chapter-1-scope-sources-lease-finance.pdf', '/_cdn/static/8e166ee6-8860-451d-9a25-a24d780452a4-gset-u4-c1-scope-sources-lease-finance.pdf'],
  ['unit-4/chapter-2-cost-capital-tvm-structure-leverage.pdf', '/_cdn/static/ff6af509-6253-4b29-9633-2bbe927b4718-gset-u4-c2-cost-capital-tvm-structure-leverage.pdf'],
  ['unit-4/chapter-3-capital-budgeting.pdf', '/_cdn/static/0d18842f-6fb3-4827-8768-a07b8934465c-gset-u4-c3-capital-budgeting.pdf'],
  ['unit-4/chapter-4-working-capital-dividend-risk-international-finance.pdf', '/_cdn/static/8d0c3185-efb7-429e-808f-08ff768167e9-gset-u4-c4-working-capital-dividend-risk-international-finance.pdf'],
  ['unit-5/chapter-1-descriptive-statistics-correlation-regression.pdf', '/_cdn/static/56077f7d-d024-4843-a363-3aa836c0243f-gset-u5-c1-descriptive-correlation-regression.pdf'],
  ['unit-5/chapter-2-probability-distributions.pdf', '/_cdn/static/36f6c98f-275d-4cc9-8013-8d0dd90a4d1f-gset-u5-c2-probability-distributions.pdf'],
  ['unit-5/chapter-3-research-sampling-hypothesis-anova.pdf', '/_cdn/static/740a138e-a6ce-4b33-a74b-e4a8f0c09b02-gset-u5-c3-research-sampling-hypothesis-anova.pdf'],
];

const root = path.resolve('public', 'net-gset-pdfs');
const frozenRoot = path.join(root, 'frozen');
const libraryHtmlPath = path.resolve('public', 'net-gset-commerce.html');
const premiumStudyPath = path.resolve('api', 'premium-study.js');
const generatedStatsPath = path.resolve('src', 'data', 'netGsetStats.js');
const frozenManifestPath = path.join(frozenRoot, 'manifest.json');
const downloadCache = new Map();

async function validPdf(filePath) {
  try {
    const file = await fs.open(filePath, 'r');
    const head = Buffer.alloc(5);
    await file.read(head, 0, 5, 0);
    await file.close();
    return head.toString() === '%PDF-';
  } catch {
    return false;
  }
}

async function fetchPdf(url) {
  if (!downloadCache.has(url)) {
    downloadCache.set(url, (async () => {
      const response = await fetch(url, {
        redirect: 'follow',
        signal: AbortSignal.timeout(30000),
      });
      if (!response.ok) throw new Error(`Failed ${response.status} while fetching ${url}`);
      const body = Buffer.from(await response.arrayBuffer());
      if (body.subarray(0, 5).toString() !== '%PDF-') {
        throw new Error(`Invalid PDF received from ${url}`);
      }
      return body;
    })());
  }
  return downloadCache.get(url);
}

async function ensurePdf(destination, url, label) {
  if (await validPdf(destination)) {
    console.log(`[gset-pdf] keep existing ${label}`);
    return true;
  }

  try {
    const body = await fetchPdf(url);
    await fs.mkdir(path.dirname(destination), { recursive: true });
    await fs.writeFile(destination, body);
    console.log(`[gset-pdf] synced ${label} (${body.length} bytes)`);
    return true;
  } catch (error) {
    console.warn(`[gset-pdf] could not freeze ${label}: ${error?.message || error}`);
    return false;
  }
}

async function readGsetCatalog() {
  const source = await fs.readFile(premiumStudyPath, 'utf8');
  const entries = [];
  const pattern = /\b(u\d+c\d+)\s*:\s*\[\s*'([^']+\.pdf)'\s*,\s*'(https:\/\/[^']+\.pdf)'\s*\]/g;

  for (const match of source.matchAll(pattern)) {
    entries.push({ key: match[1], filename: match[2], url: match[3] });
  }

  if (entries.length < 40) {
    throw new Error(`Expected the NET/GSET PDF catalog, found only ${entries.length} entries.`);
  }
  return entries;
}

async function freezeGsetLibrary() {
  const catalog = await readGsetCatalog();
  const manifest = {};
  let cursor = 0;

  async function worker() {
    while (cursor < catalog.length) {
      const item = catalog[cursor++];
      const relative = `frozen/${item.key}-${item.filename}`;
      const destination = path.join(root, relative);
      if (await ensurePdf(destination, item.url, relative)) {
        manifest[item.key] = `/net-gset-pdfs/${relative}`;
      }
    }
  }

  await Promise.all(Array.from({ length: 4 }, () => worker()));
  await fs.mkdir(frozenRoot, { recursive: true });
  await fs.writeFile(
    frozenManifestPath,
    `${JSON.stringify({ count: Object.keys(manifest).length, files: manifest }, null, 2)}\n`,
  );

  let html = await fs.readFile(libraryHtmlPath, 'utf8');
  const resolver = `const frozenPdfs=${JSON.stringify(manifest)};\nconst pdf=(u,c)=>{const key=\`u\${u}c\${c}\`,local=frozenPdfs[key];return local?[local,local]:[\`/api/premium-study?gset=\${key}\`,\`/api/premium-study?gset=\${key}&download=1\`];};`;
  const originalResolver = 'const pdf=(u,c)=>[`/api/premium-study?gset=u${u}c${c}`,`/api/premium-study?gset=u${u}c${c}&download=1`];';

  if (html.includes('const frozenPdfs=')) {
    html = html.replace(
      /const frozenPdfs=[\s\S]*?\nconst units=\[/,
      `${resolver}\nconst units=[`,
    );
  } else if (html.includes(originalResolver)) {
    html = html.replace(originalResolver, resolver);
  } else {
    throw new Error('Could not find the NET/GSET PDF resolver in the library page.');
  }

  html = html.replace(
    'href="${x[4]}">Download PDF</a>',
    'href="${x[4]}" download>Download PDF</a>',
  );
  await fs.writeFile(libraryHtmlPath, html);
  console.log(`[gset-freeze] ${Object.keys(manifest).length}/${catalog.length} PDFs frozen into the deployment`);
}

async function syncLibraryStats() {
  const html = await fs.readFile(libraryHtmlPath, 'utf8');
  const chapterKeys = new Set();

  for (const match of html.matchAll(/\.\.\.pdf\(\s*(\d+)\s*,\s*(\d+)\s*\)/g)) {
    chapterKeys.add(`${match[1]}:${match[2]}`);
  }

  if (chapterKeys.size === 0) {
    throw new Error('No NET/GSET chapter PDFs found while generating platform stats.');
  }

  const generated = `// Generated by scripts/sync-gset-pdfs.mjs during prebuild.\n// Keeping the generated value in source also lets local development start before prebuild runs.\nexport const netGsetFreePdfCount = ${chapterKeys.size};\n`;

  let existing = '';
  try {
    existing = await fs.readFile(generatedStatsPath, 'utf8');
  } catch {
    // The first build creates the generated stats module.
  }

  if (existing !== generated) {
    await fs.mkdir(path.dirname(generatedStatsPath), { recursive: true });
    await fs.writeFile(generatedStatsPath, generated);
  }

  console.log(`[gset-stats] ${chapterKeys.size} unique free PDFs included in platform totals`);
}

for (const [relativePath, sourcePath] of assets) {
  const destination = path.join(root, relativePath);
  const url = `${SOURCE_ORIGIN}${sourcePath}`;
  const ok = await ensurePdf(destination, url, relativePath);
  if (!ok) throw new Error(`Required NET/GSET PDF could not be synced: ${relativePath}`);
}

await freezeGsetLibrary();
await syncLibraryStats();
