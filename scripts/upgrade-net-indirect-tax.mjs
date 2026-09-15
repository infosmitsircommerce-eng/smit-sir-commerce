import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/tools/net-indirect-tax-calculator';

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

const title = 'Net Indirect Tax Formula (NIT) + Calculator | Class 12 Economics';
const description = 'How to calculate Net Indirect Tax (NIT): Indirect Taxes − Subsidies. Use the free Class 12 Economics calculator with examples and factor-cost/market-price rules.';

const block = `<section data-traffic-winner="nit-calculator" style="margin:28px 0;padding:24px;border:1px solid #d9e5f5;border-radius:20px;background:#f8fbff">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#315f8b">CLASS 12 ECONOMICS · NATIONAL INCOME</p>
  <h2>How to calculate Net Indirect Tax (NIT)</h2>
  <p style="font-size:1.08rem"><strong>Net Indirect Tax = Indirect Taxes − Subsidies</strong></p>
  <p>So the shortcut is simple: take total indirect taxes and subtract subsidies. Do not add subsidies.</p>

  <h3>Example 1</h3>
  <p>Indirect taxes = ₹80 crore and subsidies = ₹20 crore.</p>
  <p><strong>NIT = 80 − 20 = ₹60 crore.</strong></p>

  <h3>Example 2: when subsidies are bigger</h3>
  <p>Indirect taxes = ₹30 crore and subsidies = ₹50 crore.</p>
  <p><strong>NIT = 30 − 50 = −₹20 crore.</strong> A negative NIT simply means subsidies are greater than indirect taxes.</p>

  <h3>Where NIT is used in national income numericals</h3>
  <ul>
    <li><strong>Market Price = Factor Cost + NIT</strong></li>
    <li><strong>Factor Cost = Market Price − NIT</strong></li>
  </ul>
  <p>That means if you are moving from factor cost to market price, add NIT. If you are moving from market price to factor cost, subtract NIT.</p>

  <h3>Common mistakes</h3>
  <ul>
    <li>Using only indirect taxes and forgetting subsidies.</li>
    <li>Adding subsidies instead of subtracting them.</li>
    <li>Using the wrong sign while converting factor cost and market price.</li>
  </ul>

  <h3>Quick self-check</h3>
  <ul>
    <li>If indirect taxes are ₹100 crore and subsidies are ₹25 crore, what is NIT?</li>
    <li>If NIT is negative, which is larger: indirect taxes or subsidies?</li>
    <li>To convert factor cost into market price, do you add or subtract NIT?</li>
  </ul>

  <p><a href="/tools/topics/national-income-gdp"><strong>Continue with National Income formulas and calculators →</strong></a></p>
</section>`;

const existing = /<section\s+data-traffic-winner=["']nit-calculator["'][\s\S]*?<\/section>/i;

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
    } else if (!html.includes('data-traffic-winner="nit-calculator"')) {
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

console.log(`Upgraded Net Indirect Tax calculator: ${patched} files patched.`);
