import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/tools/debt-equity-ratio-calculator.html', import.meta.url),
  new URL('../dist/tools/debt-equity-ratio-calculator/index.html', import.meta.url),
];

const title = 'Debt to Equity Ratio Calculator | Formula & Working';
const description = 'Calculate debt to equity ratio = Long-term Debt ÷ Shareholders’ Funds. Free Class 12 Accountancy calculator with solved examples, step-by-step working and common mistakes.';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const block = `<section data-debt-equity-upgrade="true" style="margin:28px 0;padding:24px;border:1px solid #e1ddd3;border-radius:20px;background:#fffdf8">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#8a631c">Debt to Equity Ratio · Class 12 Accountancy</p>
  <h2>How to calculate debt to equity ratio</h2>
  <p><strong>Debt-Equity Ratio = Long-term Debt ÷ Shareholders’ Funds</strong></p>
  <ol>
    <li>Identify the long-term debt given in the question.</li>
    <li>Identify shareholders’ funds.</li>
    <li>Divide long-term debt by shareholders’ funds.</li>
    <li>Write the answer as a ratio, for example <strong>0.5:1</strong>.</li>
  </ol>

  <h3>Solved example 1</h3>
  <p>Long-term debt = ₹3,00,000 and shareholders’ funds = ₹6,00,000.</p>
  <p><strong>Debt-Equity Ratio = 3,00,000 ÷ 6,00,000 = 0.5:1.</strong></p>
  <p>This means long-term debt is half of shareholders’ funds.</p>

  <h3>Solved example 2</h3>
  <p>Long-term debt = ₹8,00,000 and shareholders’ funds = ₹4,00,000.</p>
  <p><strong>Debt-Equity Ratio = 8,00,000 ÷ 4,00,000 = 2:1.</strong></p>
  <p>This means the long-term debt amount is twice the shareholders’ funds amount. The ratio itself describes the relationship; whether a particular level is desirable depends on the context and the convention used in the question or textbook.</p>

  <h3>Read the ratio correctly</h3>
  <ul>
    <li><strong>0.5:1</strong> → ₹0.50 of long-term debt for every ₹1 of shareholders’ funds.</li>
    <li><strong>1:1</strong> → Long-term debt and shareholders’ funds are equal.</li>
    <li><strong>2:1</strong> → ₹2 of long-term debt for every ₹1 of shareholders’ funds.</li>
  </ul>

  <h3>Common exam mistakes</h3>
  <ul>
    <li>Reversing the formula and dividing equity by debt.</li>
    <li>Using total assets in place of shareholders’ funds.</li>
    <li>Forgetting to simplify the final answer into ratio form.</li>
    <li>Mixing values from different periods or units.</li>
    <li>Assuming every textbook or exam question classifies every liability in exactly the same way — follow the definitions supplied in your prescribed material.</li>
  </ul>

  <p><strong>Exam habit:</strong> write the formula first, substitute the figures, show the division and then write the final ratio.</p>
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

    html = html.replaceAll('Debt-Equity Ratio Calculator — Free Class 12 Accountancy Tool', title);
    html = html.replaceAll('Calculate debt-equity ratio from long-term debt and shareholders funds with formula and working.', description);

    if (!html.includes('data-debt-equity-upgrade="true"')) {
      const oldExample = /(<section><h2>Worked example<\/h2>[\s\S]*?<\/section>)/i;
      if (oldExample.test(html)) html = html.replace(oldExample, `$1${block}`);
      else html = html.replace(/(<section><h2>Frequently asked questions<\/h2>)/i, `${block}$1`);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded Debt to Equity Ratio calculator search intent and learning content.');
