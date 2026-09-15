import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/tools/market-price-from-factor-cost-calculator.html', import.meta.url),
  new URL('../dist/tools/market-price-from-factor-cost-calculator/index.html', import.meta.url),
];

const title = 'Factor Cost to Market Price Calculator | Formula & Examples';
const description = 'Convert factor cost to market price using Market Price = Factor Cost + Net Indirect Taxes. Free Class 12 Economics calculator with NIT formula, solved examples and sign rules.';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const block = `<section data-factor-cost-upgrade="true" style="margin:28px 0;padding:24px;border:1px solid #e5dfd3;border-radius:20px;background:#fffdf8">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8a631c">Class 12 Economics · Factor Cost ↔ Market Price</p>
  <h2>Factor cost to market price formula</h2>
  <p><strong>Market Price = Factor Cost + Net Indirect Taxes</strong></p>
  <p>And:</p>
  <p><strong>Net Indirect Taxes (NIT) = Indirect Taxes − Subsidies</strong></p>
  <p>So if a question gives indirect taxes and subsidies separately, calculate NIT first and then add it to factor cost.</p>

  <h3>Solved example 1 — NIT already given</h3>
  <p>Factor cost = ₹920 crore and NIT = ₹80 crore.</p>
  <p><strong>Market Price = 920 + 80 = ₹1,000 crore.</strong></p>

  <h3>Solved example 2 — taxes and subsidies given separately</h3>
  <p>Factor cost = ₹1,200 crore, indirect taxes = ₹150 crore and subsidies = ₹30 crore.</p>
  <ol>
    <li>NIT = 150 − 30 = ₹120 crore.</li>
    <li>Market Price = 1,200 + 120 = <strong>₹1,320 crore</strong>.</li>
  </ol>

  <h3>Solved example 3 — when subsidies exceed indirect taxes</h3>
  <p>Factor cost = ₹800 crore, indirect taxes = ₹20 crore and subsidies = ₹50 crore.</p>
  <ol>
    <li>NIT = 20 − 50 = −₹30 crore.</li>
    <li>Market Price = 800 + (−30) = <strong>₹770 crore</strong>.</li>
  </ol>
  <p>A negative NIT simply means subsidies exceed indirect taxes in the figures given.</p>

  <h3>Reverse formula</h3>
  <p>If market price is given and factor cost is required:</p>
  <p><strong>Factor Cost = Market Price − Net Indirect Taxes</strong></p>

  <h3>Sign rule to remember</h3>
  <ul>
    <li><strong>Factor Cost → Market Price:</strong> add NIT.</li>
    <li><strong>Market Price → Factor Cost:</strong> subtract NIT.</li>
    <li><strong>NIT:</strong> indirect taxes minus subsidies.</li>
  </ul>

  <h3>Quick self-check</h3>
  <ol>
    <li>FC = 500, NIT = 40. MP = ? <strong>Answer: 540.</strong></li>
    <li>FC = 700, taxes = 80, subsidies = 20. MP = ? <strong>Answer: 760.</strong></li>
    <li>MP = 900, NIT = 50. FC = ? <strong>Answer: 850.</strong></li>
  </ol>

  <p><a href="/tools/net-indirect-tax-calculator"><strong>Need to calculate NIT first? Open the Net Indirect Tax calculator →</strong></a></p>
  <p><a href="/tools/factor-cost-from-market-price-calculator">Need the reverse conversion? Open Market Price to Factor Cost →</a></p>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    html = setTitle(html, title);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'name', 'twitter:description', description);

    html = html.replaceAll('Factor Cost to Market Price Calculator — Free Class 12 Economics Tool', title);
    html = html.replaceAll('Convert an aggregate measured at factor cost to market price by adding net indirect taxes.', description);

    if (!html.includes('data-factor-cost-upgrade="true"')) {
      const worked = /(<section><h2>Worked example<\/h2>[\s\S]*?<\/section>)/i;
      if (worked.test(html)) html = html.replace(worked, `$1${block}`);
      else html = html.replace(/(<section><h2>Frequently asked questions<\/h2>)/i, `${block}$1`);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded Factor Cost to Market Price calculator for search intent and exam practice.');
