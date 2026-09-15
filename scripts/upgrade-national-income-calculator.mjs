import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/tools/topics/national-income-gdp';

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, selector, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = selector.startsWith('og:')
    ? new RegExp(`<meta\\s+property=["']${selector}["'][^>]*>`, 'i')
    : new RegExp(`<meta\\s+name=["']${selector}["'][^>]*>`, 'i');
  const replacement = selector.startsWith('og:')
    ? `<meta property="${selector}" content="${escaped}">`
    : `<meta name="${selector}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const title = 'National Income Calculator + GDP, NDP, GNP & NNP Formulas | Class 12';
const description = 'Free Class 12 National Income calculator and formula guide for GDP, NDP, GNP/GNI, NNP, depreciation, NFIA and Net Indirect Tax with easy conversion rules.';

const block = `<section data-traffic-winner="national-income" style="margin:28px 0;padding:24px;border:1px solid #e4ddf2;border-radius:20px;background:#fcfaff">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#70549a">CLASS 12 ECONOMICS · NATIONAL INCOME</p>
  <h2>National Income calculator: the conversion ladder</h2>
  <p>Most National Income numericals become easier when you separate the three adjustments: <strong>gross/net</strong>, <strong>domestic/national</strong> and <strong>market price/factor cost</strong>.</p>

  <h3>1. Gross to Net</h3>
  <p><strong>Net = Gross − Depreciation</strong></p>
  <ul>
    <li>NDP = GDP − Depreciation</li>
    <li>NNP = GNP − Depreciation</li>
  </ul>

  <h3>2. Domestic to National</h3>
  <p><strong>National = Domestic + NFIA</strong></p>
  <ul>
    <li>GNP/GNI = GDP + Net Factor Income from Abroad (NFIA)</li>
    <li>NNP = NDP + NFIA</li>
  </ul>

  <h3>3. Factor Cost and Market Price</h3>
  <p><strong>Market Price = Factor Cost + Net Indirect Tax</strong></p>
  <p><strong>Factor Cost = Market Price − Net Indirect Tax</strong></p>
  <p>And remember: <strong>Net Indirect Tax = Indirect Taxes − Subsidies.</strong></p>

  <h3>One worked example</h3>
  <p>Suppose GDP at market price = ₹1,000 crore, depreciation = ₹100 crore, NFIA = ₹20 crore and NIT = ₹80 crore.</p>
  <ol>
    <li>NDP at market price = 1,000 − 100 = ₹900 crore.</li>
    <li>NNP at market price = 900 + 20 = ₹920 crore.</li>
    <li>NNP at factor cost = 920 − 80 = <strong>₹840 crore</strong>.</li>
  </ol>

  <h3>The sign rule students forget</h3>
  <ul>
    <li>Gross → Net: <strong>subtract depreciation</strong>.</li>
    <li>Domestic → National: <strong>add NFIA</strong>.</li>
    <li>Factor Cost → Market Price: <strong>add NIT</strong>.</li>
    <li>Market Price → Factor Cost: <strong>subtract NIT</strong>.</li>
  </ul>

  <h3>Quick self-check</h3>
  <ul>
    <li>GDP = 500 and depreciation = 50. What is NDP?</li>
    <li>NDP = 450 and NFIA = −10. What is NNP?</li>
    <li>NNP at market price = 600 and NIT = 40. What is NNP at factor cost?</li>
  </ul>

  <p><a href="/tools/net-indirect-tax-calculator"><strong>Need help with NIT? Open the Net Indirect Tax calculator →</strong></a></p>
</section>`;

const existing = /<section\s+data-traffic-winner=["']national-income["'][\s\S]*?<\/section>/i;

let patched = 0;
for (const file of routeFiles(PATH)) {
  try {
    let html = await readFile(file, 'utf8');
    const before = html;

    html = setTitle(html, title);
    html = setMeta(html, 'description', description);
    html = setMeta(html, 'og:title', title);
    html = setMeta(html, 'og:description', description);
    html = setMeta(html, 'twitter:title', title);
    html = setMeta(html, 'twitter:description', description);

    if (existing.test(html)) {
      html = html.replace(existing, block);
    } else if (!html.includes('data-traffic-winner="national-income"')) {
      const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
      let inserted = false;
      for (const anchor of anchors) {
        if (html.includes(anchor)) {
          html = html.replace(anchor, `${block}${anchor}`);
          inserted = true;
          break;
        }
      }
      if (!inserted) html = html.replace('</body>', `${block}</body>`);
    }

    if (html !== before) {
      await writeFile(file, html, 'utf8');
      patched += 1;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log(`Upgraded National Income calculator hub: ${patched} files patched.`);
