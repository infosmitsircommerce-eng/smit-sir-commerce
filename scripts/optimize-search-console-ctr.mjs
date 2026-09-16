import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);

const targets = [
  {
    path: '/cbse/class-12/business-studies/controlling-notes',
    title: 'Controlling Class 12 Notes PDF (Free) | Business Studies Ch 8',
    description: 'Free Controlling Class 12 notes PDF for CBSE Business Studies Chapter 8: meaning, importance, planning relationship, 5-step process, deviations, case-study clues and revision.',
    marker: 'controlling-search-intent',
    insertBefore: '<h2>Controlling Class 12: understand the process, then practise the clues</h2>',
    snippet: '<p data-gsc-intent="controlling-search-intent"><strong>Looking for Controlling Class 12 notes PDF?</strong> Open the free Chapter 8 notes below, then use the process table and case-study clues for quick revision.</p>',
  },
  {
    path: '/tools/net-indirect-tax-calculator',
    title: 'How to Calculate NIT | Net Indirect Tax Formula + Free Calculator',
    description: 'How to calculate NIT: Net Indirect Tax = Indirect Taxes − Subsidies. Use the free calculator and learn the NIT formula for factor cost and market price numericals.',
    marker: 'nit-search-intent',
    insertBefore: '<h2>How to calculate Net Indirect Tax (NIT)</h2>',
    snippet: '<p data-gsc-intent="nit-search-intent"><strong>Formula of NIT:</strong> Net Indirect Tax = Indirect Taxes − Subsidies. Use the free calculator on this page, then check the examples below.</p>',
  },
  {
    path: '/tools/topics/national-income-gdp',
    title: 'National Income Calculator (Free) | GDP, NDP, GNP/GNI & NNP Formulas',
    description: 'Free National Income calculator and Class 12 formula guide for GDP, NDP, GNP/GNI, NNP, depreciation, NFIA and Net Indirect Tax with easy conversion rules.',
    marker: 'national-income-search-intent',
    insertBefore: '<h2>National Income calculator: the conversion ladder</h2>',
    snippet: '<p data-gsc-intent="national-income-search-intent"><strong>National Income calculator:</strong> use the free tools on this page for GDP, NDP, GNP/GNI and NNP, then use the conversion ladder below to understand every adjustment.</p>',
  },
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function esc(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, selector, value) {
  const pattern = selector.startsWith('og:')
    ? new RegExp(`<meta\\s+property=["']${selector}["'][^>]*>`, 'i')
    : new RegExp(`<meta\\s+name=["']${selector}["'][^>]*>`, 'i');
  const replacement = selector.startsWith('og:')
    ? `<meta property="${selector}" content="${esc(value)}">`
    : `<meta name="${selector}" content="${esc(value)}">`;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `${replacement}\n</head>`);
}

let patched = 0;
for (const target of targets) {
  for (const file of routeFiles(target.path)) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;

      html = setTitle(html, target.title);
      html = setMeta(html, 'description', target.description);
      html = setMeta(html, 'og:title', target.title);
      html = setMeta(html, 'og:description', target.description);
      html = setMeta(html, 'twitter:title', target.title);
      html = setMeta(html, 'twitter:description', target.description);

      if (!html.includes(`data-gsc-intent="${target.marker}"`) && html.includes(target.insertBefore)) {
        html = html.replace(target.insertBefore, `${target.snippet}\n${target.insertBefore}`);
      }

      if (html !== before) {
        await writeFile(file, html, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log(`Search Console CTR pass: ${patched} generated HTML files patched for exact live query intent.`);
