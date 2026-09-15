import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-5-accounting-equation-notes';

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

const title = 'Accounting Equation Class 11 Notes | GSEB Chapter 5';
const description = 'Free GSEB Class 11 Accountancy Chapter 5 Accounting Equation notes with Assets = Capital + Liabilities, transaction effects, solved examples and quick revision.';

const block = `<section data-accounting-equation-growth="true" style="margin:32px 0;padding:26px;border:1px solid #d9e4ef;border-radius:22px;background:#f9fcff">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#315f8b">GSEB CLASS 11 · ACCOUNTANCY CHAPTER 5</p>
  <h2>Accounting Equation: understand the logic before memorising entries</h2>
  <p>The accounting equation shows the relationship between what a business owns and the claims against those resources.</p>

  <h3>Core formula</h3>
  <p style="font-size:1.12rem"><strong>Assets = Capital + Liabilities</strong></p>
  <p>You can also rearrange it as <strong>Capital = Assets − Liabilities</strong>.</p>

  <h3>What each part means</h3>
  <ul>
    <li><strong>Assets:</strong> resources owned or controlled by the business, such as cash, furniture, stock and debtors.</li>
    <li><strong>Capital:</strong> the owner's claim in the business.</li>
    <li><strong>Liabilities:</strong> amounts the business owes to outsiders, such as creditors or loans.</li>
  </ul>

  <h3>Transaction-effect shortcut</h3>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #cad7e3">Transaction</th><th style="text-align:left;padding:10px;border-bottom:1px solid #cad7e3">Effect on equation</th></tr></thead><tbody>
    <tr><td style="padding:10px">Owner starts business with ₹50,000 cash</td><td style="padding:10px">Assets +₹50,000; Capital +₹50,000</td></tr>
    <tr><td style="padding:10px">Furniture bought for cash ₹10,000</td><td style="padding:10px">Furniture +₹10,000; Cash −₹10,000; total assets unchanged</td></tr>
    <tr><td style="padding:10px">Goods bought on credit ₹15,000</td><td style="padding:10px">Assets +₹15,000; Liabilities +₹15,000</td></tr>
    <tr><td style="padding:10px">Creditor paid ₹5,000</td><td style="padding:10px">Assets −₹5,000; Liabilities −₹5,000</td></tr>
    <tr><td style="padding:10px">Expense paid in cash</td><td style="padding:10px">Assets decrease; Capital decreases</td></tr>
    <tr><td style="padding:10px">Income earned in cash</td><td style="padding:10px">Assets increase; Capital increases</td></tr>
  </tbody></table></div>

  <h3>Fast way to solve any question</h3>
  <ol>
    <li>Identify which accounts are affected.</li>
    <li>Decide whether each item is an asset, capital or liability.</li>
    <li>Mark whether it increases or decreases.</li>
    <li>Check that both sides of the equation remain equal.</li>
  </ol>

  <h3>Mini example</h3>
  <p>If the owner brings ₹1,00,000 cash and the business then buys furniture worth ₹20,000 in cash, total assets remain ₹1,00,000: Cash ₹80,000 + Furniture ₹20,000. Capital remains ₹1,00,000, so the equation still balances.</p>

  <h3>Quick self-test</h3>
  <ul>
    <li>What happens to the equation when goods are purchased on credit?</li>
    <li>Why does buying furniture for cash not change total assets?</li>
    <li>How does an expense affect capital?</li>
    <li>How does income affect capital?</li>
  </ul>

  <p><a href="/study-material?board=GSEB&class=11&subject=Accountancy"><strong>Continue with GSEB Class 11 Accountancy resources →</strong></a></p>
</section>`;

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

    if (!html.includes('data-accounting-equation-growth="true"')) {
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

console.log(`Upgraded GSEB Accounting Equation notes page: ${patched} files patched.`);
