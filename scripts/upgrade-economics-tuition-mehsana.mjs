import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const ECONOMICS_PATH = '/economics-tuition-mehsana';
const BUSINESS_STUDIES_PATH = '/business-studies-tuition-mehsana';

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

function patchSearchMeta(html, title, description) {
  html = setTitle(html, title);
  html = setMeta(html, 'description', description);
  html = setMeta(html, 'og:title', title);
  html = setMeta(html, 'og:description', description);
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  return html;
}

const economicsTitle = 'Economics Tuition in Mehsana | CBSE Class 11 & 12 + Free Demo';
const economicsDescription = 'CBSE Economics tuition in Mehsana for Class 11 & 12 with Micro & Macro concepts, diagrams, numericals, exam practice, free notes and a free demo before joining.';

const economicsBlock = `<section data-traffic-winner="economics-mehsana" style="margin:28px 0;padding:24px;border:1px solid #eadfca;border-radius:20px;background:#fffdf8">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#8b641c">CBSE CLASS 11 &amp; 12 ECONOMICS · MEHSANA</p>
  <h2>Economics tuition in Mehsana for CBSE Class 11 &amp; 12</h2>
  <p>Economics support focuses on understanding the reason behind a graph, formula or relationship first, then applying it through numericals, diagrams and exam-style questions.</p>
  <ul>
    <li><strong>Microeconomics:</strong> demand, supply, elasticity, producer behaviour and market concepts.</li>
    <li><strong>Macroeconomics:</strong> national income, money and banking, income determination, government budget and balance of payments.</li>
    <li><strong>Practice:</strong> step-by-step numericals, diagrams, MCQs and descriptive answers.</li>
    <li><strong>Free support:</strong> use the published notes and calculators on this website even before joining tuition.</li>
  </ul>
  <p><a href="/book-demo?from=economics-tuition-mehsana&amp;mode=Offline"><strong>Request a free Economics demo in Mehsana →</strong></a> · <a href="/tools/topics/national-income-gdp">Try a free Economics calculator</a> · <a href="/study-material">Open free study material</a></p>
  <p style="font-size:13px;color:#667085">No marks guarantee or pressure to enrol — use the free resources and demo to decide whether the teaching approach suits you.</p>
</section>`;

const economicsExisting = /<section\s+data-traffic-winner=["']economics-mehsana["'][\s\S]*?<\/section>/i;

async function patchEconomics() {
  let patched = 0;
  for (const file of routeFiles(ECONOMICS_PATH)) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;
      html = patchSearchMeta(html, economicsTitle, economicsDescription);

      if (economicsExisting.test(html)) {
        html = html.replace(economicsExisting, economicsBlock);
      } else {
        const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
        let inserted = false;
        for (const anchor of anchors) {
          if (html.includes(anchor)) {
            html = html.replace(anchor, `${economicsBlock}${anchor}`);
            inserted = true;
            break;
          }
        }
        if (!inserted) html = html.replace('</body>', `${economicsBlock}</body>`);
      }

      if (html !== before) {
        await writeFile(file, html, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return patched;
}

const businessStudiesTitle = 'Business Studies Tuition in Mehsana | Class 11 & 12 + Free Demo';
const businessStudiesDescription = 'Business Studies tuition in Mehsana for Class 11 & 12 with case-study practice, answer writing, chapter revision, free CBSE resources and a free demo before joining.';

async function patchBusinessStudies() {
  let patched = 0;
  for (const file of routeFiles(BUSINESS_STUDIES_PATH)) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;
      html = patchSearchMeta(html, businessStudiesTitle, businessStudiesDescription);
      if (html !== before) {
        await writeFile(file, html, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return patched;
}

const economicsPatched = await patchEconomics();
const businessStudiesPatched = await patchBusinessStudies();
console.log(`Upgraded Mehsana subject pages: Economics ${economicsPatched} files, Business Studies ${businessStudiesPatched} files patched.`);
