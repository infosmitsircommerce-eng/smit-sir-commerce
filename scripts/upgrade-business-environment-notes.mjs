import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/cbse/class-12/business-studies/business-environment-notes';

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

const title = 'Business Environment Class 12 Notes 2026-27 | CBSE Chapter 3';
const description = 'Free CBSE Class 12 Business Studies Chapter 3 Business Environment notes with features, importance, dimensions, LPG reforms, case-study clues, quick questions and a print/save-as-PDF option.';

const block = `<section data-business-environment-growth="true" style="margin:32px 0;padding:26px;border:1px solid #dbe7f4;border-radius:22px;background:#f8fbff">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#315f8b">CBSE CLASS 12 · CHAPTER 3 QUICK REVISION</p>
  <h2>Business Environment Class 12: revise the chapter in the right order</h2>
  <p>If you are revising this chapter before a test, do not reread everything randomly. First understand the meaning and features, then learn why business environment matters, then practise the five dimensions and finally revise LPG reforms and application-based questions.</p>
  <p data-business-environment-pdf-intent="true" style="padding:14px 16px;border-radius:14px;background:#eef6ff;border:1px solid #cfe0f3"><strong>Looking for Business Environment Class 12 notes PDF?</strong> This page is print-friendly. On supported browsers, use <a href="#" onclick="window.print();return false;"><strong>Print / Save these notes as PDF</strong></a> so you can revise them offline.</p>

  <h3>Business Studies Class 12 Chapter 3 notes at a glance</h3>
  <p>The chapter can be organised into five exam blocks: meaning and features, importance, dimensions, LPG reforms, and application-based case-study clues. Revise in that order so definitions and examples stay connected.</p>

  <h3>1. Meaning in one line</h3>
  <p><strong>Business environment</strong> means the total external forces, institutions and conditions that can affect the working and decisions of a business enterprise.</p>

  <h3>2. Features you should be able to explain</h3>
  <ul>
    <li><strong>Totality of external forces:</strong> many outside factors together affect business.</li>
    <li><strong>Specific and general forces:</strong> some factors affect one firm directly while others affect many businesses.</li>
    <li><strong>Inter-relatedness:</strong> one environmental change can influence several other factors.</li>
    <li><strong>Dynamic nature:</strong> technology, laws, customer preferences and economic conditions keep changing.</li>
    <li><strong>Uncertainty:</strong> future environmental changes cannot always be predicted accurately.</li>
    <li><strong>Complexity:</strong> many factors operate together, so their combined effect can be difficult to understand.</li>
    <li><strong>Relativity:</strong> the same environmental change may affect different businesses differently.</li>
  </ul>

  <h3>3. Why business environment matters</h3>
  <ul>
    <li>Helps identify opportunities and get first-mover advantage.</li>
    <li>Helps identify threats and early warning signals.</li>
    <li>Helps businesses obtain useful resources.</li>
    <li>Helps firms cope with rapid changes.</li>
    <li>Supports planning and policy formulation.</li>
    <li>Can improve business performance when changes are understood and acted on properly.</li>
  </ul>

  <h3>4. Dimensions: the fastest case-study clue map</h3>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #cbd9e8">Dimension</th><th style="text-align:left;padding:10px;border-bottom:1px solid #cbd9e8">Typical clues in a case</th></tr></thead><tbody>
    <tr><td style="padding:10px"><strong>Economic</strong></td><td style="padding:10px">interest rates, inflation, income, economic growth, taxation, stock market conditions</td></tr>
    <tr><td style="padding:10px"><strong>Social</strong></td><td style="padding:10px">lifestyle, education, traditions, health awareness, population trends, changing preferences</td></tr>
    <tr><td style="padding:10px"><strong>Technological</strong></td><td style="padding:10px">apps, automation, artificial intelligence, new production methods, digital payments, innovation</td></tr>
    <tr><td style="padding:10px"><strong>Political</strong></td><td style="padding:10px">government stability, political ideology, policy direction, relations between government and business</td></tr>
    <tr><td style="padding:10px"><strong>Legal</strong></td><td style="padding:10px">laws, regulations, court decisions, compliance rules, consumer or labour legislation</td></tr>
  </tbody></table></div>

  <h3>5. LPG reforms: remember the difference</h3>
  <ul>
    <li><strong>Liberalisation:</strong> reducing unnecessary government controls and restrictions on business.</li>
    <li><strong>Privatisation:</strong> increasing the role of the private sector and reducing exclusive government ownership or control.</li>
    <li><strong>Globalisation:</strong> integrating the domestic economy with the world economy through trade, investment, technology and competition.</li>
  </ul>

  <h3>6. Demonetisation: what students should remember</h3>
  <p>For exam revision, focus on its meaning, the withdrawal of specified currency notes as legal tender, and its intended effects such as encouraging formal transactions and reducing the use of unaccounted cash. Write only what the question asks instead of turning the answer into a general essay.</p>

  <h3>7. Case-study solving method</h3>
  <ol>
    <li>Read the requirement first.</li>
    <li>Underline the clue in the case.</li>
    <li>Name the exact dimension, feature or importance point.</li>
    <li>Explain it briefly.</li>
    <li>Connect one line from the case to your answer.</li>
  </ol>
  <p><a href="/practice/cbse/class-12/business-studies/business-environment-case-study-questions"><strong>Practise Business Environment case-study questions with answers →</strong></a></p>

  <h3>8. Quick questions to test yourself</h3>
  <ul>
    <li>What is meant by business environment?</li>
    <li>Explain any four features of business environment.</li>
    <li>Why is understanding business environment important for managers?</li>
    <li>Distinguish economic, social, technological, political and legal environment using examples.</li>
    <li>Explain liberalisation, privatisation and globalisation.</li>
    <li>How can a change in technology create both an opportunity and a threat for a business?</li>
  </ul>

  <h3>Continue revision</h3>
  <p><a href="/cbse/class-12/business-studies-case-study-questions">Class 12 Business Studies case studies</a> · <a href="/cbse/class-12/business-studies-important-questions">Important questions</a> · <a href="/cbse/class-12/business-studies-mcq">MCQ practice</a> · <a href="/cbse-notes">All CBSE Commerce notes</a></p>
</section>`;

const oldBlock = /<section\s+data-traffic-winner=["']business-environment["'][\s\S]*?<\/section>/i;
const currentBlock = /<section\s+data-business-environment-growth=["']true["'][\s\S]*?<\/section>/i;

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

    if (currentBlock.test(html)) {
      html = html.replace(currentBlock, block);
    } else if (oldBlock.test(html)) {
      html = html.replace(oldBlock, block);
    } else {
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

console.log(`Upgraded Business Environment notes page: ${patched} files patched.`);
