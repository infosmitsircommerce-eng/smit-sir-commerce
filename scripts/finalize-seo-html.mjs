import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const distRoot = join(root, 'dist');
const SITE = 'Smit Sir Commerce';
const hubById = Object.fromEntries(seoHubs.map((hub) => [hub.id, hub]));

async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function keepLast(html, regex) {
  const matches = [...html.matchAll(regex)];
  if (matches.length <= 1) return html;
  let seen = 0;
  return html.replace(regex, (match) => {
    seen += 1;
    return seen === matches.length ? match : '';
  });
}

function dedupeSeoTags(html) {
  const patterns = [
    /<meta\s+name=["']description["'][^>]*>\s*/gi,
    /<meta\s+name=["']robots["'][^>]*>\s*/gi,
    /<meta\s+name=["']googlebot["'][^>]*>\s*/gi,
    /<meta\s+name=["']bingbot["'][^>]*>\s*/gi,
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:type["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:site_name["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:locale["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:title["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:description["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:url["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:width["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:height["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:alt["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:card["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:title["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:description["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:image["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:image:alt["'][^>]*>\s*/gi,
  ];
  return patterns.reduce((result, pattern) => keepLast(result, pattern), html);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function chapterMeta(material) {
  const hub = hubById[material.hubId];
  const subject = hub?.label?.replace(`Class ${material.class_level} `, '') || material.subject;
  const title = material.gscTitle || `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`;
  const description = material.gscDescription || `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} notes PDF. View online or download chapter-wise notes with key topics, important questions, MCQs and exam-focused revision.`;
  return { title, description, subject };
}

function replaceMetaContent(html, selector, value) {
  const escaped = escapeHtml(value);
  return html.replace(selector, (match) => match.replace(/content=["'][^"']*["']/i, `content="${escaped}"`));
}

function routeFromRel(rel) {
  let route = rel.replaceAll('\\', '/');
  if (route === 'index.html') return '/';
  route = route.replace(/\/index\.html$/i, '').replace(/\.html$/i, '');
  return `/${route.replace(/^\//, '')}`;
}

const AUTHORITY_CLUSTERS = [
  {
    test: /(business-studies|bst-)/,
    title: 'Continue your Business Studies learning path',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes'],
      ['/cbse/class-12/business-studies-important-questions', 'Business Studies important questions'],
      ['/cbse/class-12/business-studies-case-study-questions', 'Business Studies case-study questions'],
      ['/cbse/class-12/business-studies-mcq', 'Business Studies MCQs'],
      ['/business-studies-tuition-mehsana', 'Business Studies tuition in Mehsana'],
    ],
  },
  {
    test: /(microeconomics|price-elasticity|theory-of-demand|production-function|concepts-of-cost|concept-of-revenue|market-equilibrium|producers-equilibrium|economics-numericals)/,
    title: 'Continue your Class 11 Economics learning path',
    links: [
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes'],
      ['/cbse/class-11/microeconomics-important-questions', 'Microeconomics important questions'],
      ['/cbse/class-11/economics-numericals', 'Class 11 Economics numericals'],
      ['/tools/price-elasticity-demand-calculator', 'Price elasticity of demand calculator'],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana'],
    ],
  },
  {
    test: /(macroeconomics|national-income|gdp|income-determination|investment-multiplier|money-multiplier|consumption-function|saving-function|equilibrium-income|nfia|net-indirect-tax)/,
    title: 'Continue your Class 12 Economics learning path',
    links: [
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes'],
      ['/cbse/class-12/economics-revision-guide', 'Class 12 Economics revision guide'],
      ['/tools/topics/national-income-gdp', 'National Income and GDP calculator toolkit'],
      ['/tools/topics/income-determination', 'Income Determination calculator toolkit'],
      ['/economics-tuition-mehsana', 'Economics tuition in Mehsana'],
    ],
  },
  {
    test: /(accounting-ratios|current-ratio|quick-ratio|debt-equity|proprietary-ratio|inventory-turnover|receivables-turnover|working-capital-turnover|profit-ratio|operating-ratio|return-on-investment|trade-payables|collection-period|payment-period|assets-to-debt|interest-coverage|common-size|accountancy-ratios-cashflow)/,
    title: 'Continue with free Accountancy learning tools',
    links: [
      ['/tools/topics/accounting-ratios', 'Accounting Ratios toolkit'],
      ['/tools/current-ratio-calculator', 'Current Ratio calculator'],
      ['/tools/debt-equity-ratio-calculator', 'Debt–Equity Ratio calculator'],
      ['/tools/return-on-investment-calculator', 'Return on Investment calculator'],
      ['/tests/class-12-accountancy-ratios-cashflow-exam', 'Ratios and Cash Flow practice test'],
    ],
  },
  {
    test: /(cbse-notes|cbse-practice|study-material)/,
    title: 'Explore the connected CBSE Commerce library',
    links: [
      ['/cbse/class-12/business-studies-notes', 'Class 12 Business Studies notes'],
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics notes'],
      ['/cbse/class-12/macroeconomics-notes', 'Class 12 Macroeconomics notes'],
      ['/cbse-practice', 'Chapter-wise Commerce practice'],
      ['/tools', 'Free Commerce calculators'],
    ],
  },
  {
    test: /(commerce-coaching-mehsana|commerce-classes-mehsana|commerce-tuition-mehsana|economics-tuition-mehsana|business-studies-tuition-mehsana)/,
    title: 'Mehsana student learning pathway',
    links: [
      ['/commerce-coaching-mehsana', 'Commerce tuition in Mehsana'],
      ['/cbse-notes', 'Free CBSE Commerce notes'],
      ['/cbse-practice', 'Chapter-wise Commerce practice'],
      ['/tools', 'Free Commerce calculators'],
      ['/book-demo', 'Free paper analysis and demo'],
    ],
  },
];

function injectTopicalAuthority(html, rel) {
  if (html.includes('data-topical-authority=')) return html;
  const route = routeFromRel(rel);
  const cluster = AUTHORITY_CLUSTERS.find((item) => item.test.test(route.toLowerCase()));
  if (!cluster) return html;

  const links = cluster.links.filter(([path]) => path !== route);
  if (!links.length) return html;

  const block = `<section data-topical-authority="true"><h2>${escapeHtml(cluster.title)}</h2><p>Use these related pages to move from explanation to practice and tools without leaving the same subject area.</p><ul>${links.map(([path, label]) => `<li><a href="${escapeHtml(path)}">${escapeHtml(label)}</a></li>`).join('')}</ul></section>`;

  if (/<\/article>/i.test(html)) return html.replace(/<\/article>/i, `${block}</article>`);
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, `${block}</main>`);
  return html;
}

const materialByFile = new Map();
for (const material of seoMaterials) {
  const route = material.seo_path.replace(/^\//, '');
  materialByFile.set(`${route}.html`, material);
  materialByFile.set(`${route}/index.html`, material);
}

const htmlFiles = await listHtml(distRoot);
let deduped = 0;
let strengthened = 0;
let authorityLinked = 0;

for (const file of htmlFiles) {
  const rel = relative(distRoot, file).replaceAll('\\', '/');
  let html = await readFile(file, 'utf8');
  const before = html;

  if (rel !== 'index.html') html = dedupeSeoTags(html);

  const material = materialByFile.get(rel);
  if (material) {
    const { title, description, subject } = chapterMeta(material);
    const fullTitle = `${title} | ${SITE}`;

    html = html.replaceAll(material.seoTitle, title);
    html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(fullTitle)}</title>`);
    html = replaceMetaContent(html, /<meta\s+name=["']description["'][^>]*>/i, description);
    html = replaceMetaContent(html, /<meta\s+property=["']og:title["'][^>]*>/i, fullTitle);
    html = replaceMetaContent(html, /<meta\s+property=["']og:description["'][^>]*>/i, description);
    html = replaceMetaContent(html, /<meta\s+name=["']twitter:title["'][^>]*>/i, fullTitle);
    html = replaceMetaContent(html, /<meta\s+name=["']twitter:description["'][^>]*>/i, description);

    const exactHeading = material.gscH1 || `${title}`;
    if (material.gscH1) {
      html = html.replace(/<h1[^>]*>.*?<\/h1>/is, `<h1>${escapeHtml(exactHeading)}</h1>`);
    } else {
      html = html.replace(
        /<h1>.*?Notes PDF\s*[—-]\s*CBSE Class\s*\d+<\/h1>/is,
        `<h1>${escapeHtml(exactHeading)}</h1>`
      );
    }
    html = html.replace(
      '<h2>Chapter overview</h2>',
      `<h2>${escapeHtml(material.chapter)} chapter overview and revision notes</h2>`
    );
    html = html.replace(
      `<p><a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} PDF</a>.</p>`,
      `<h2>Download ${escapeHtml(material.chapter)} notes PDF for CBSE Class ${material.class_level} ${escapeHtml(subject)}</h2><p>Use the complete chapter PDF for school tests, board-exam revision and concept review. <a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} notes PDF</a>.</p>`
    );
    strengthened += 1;
  }

  const beforeAuthority = html;
  html = injectTopicalAuthority(html, rel);
  if (html !== beforeAuthority) authorityLinked += 1;

  if (html !== before) {
    await writeFile(file, html, 'utf8');
    if (!material) deduped += 1;
  }
}

console.log(`Finalized SEO HTML: strengthened ${strengthened} chapter files, normalized ${deduped} other prerendered files, and added topical authority links to ${authorityLinked} HTML files.`);
