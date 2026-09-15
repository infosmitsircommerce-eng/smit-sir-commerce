import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/mehsana-commerce-student-resources.html', import.meta.url);
const canonical = 'https://www.smitsircommerce.in/mehsana-commerce-student-resources.html';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const title = 'Free Commerce Notes & PDFs in Mehsana | CBSE & GSEB';
const description = 'Free Class 11 & 12 Commerce resources for Mehsana students: CBSE notes, GSEB Economics PDFs, Business Studies case studies, formulas and calculators. No login required.';

const block = `<section data-mehsana-resource-upgrade="true" style="margin:24px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Free · No login · Mehsana students</p>
  <h2>Start with the resource you need right now</h2>
  <p>You do not need to join a class or create an account to use the public study resources below. Pick your board or topic and open the useful page directly.</p>
  <ul>
    <li><a href="/cbse-notes"><strong>CBSE Commerce Notes</strong></a> — Class 11 and 12 chapter support.</li>
    <li><a href="/gseb-class-12-economics.html"><strong>GSEB Class 12 Economics PDFs</strong></a> — free chapter-wise concept notes.</li>
    <li><a href="/cbse/class-12/business-studies-case-study-questions"><strong>Class 12 Business Studies Case Studies</strong></a> — chapter-wise practice with answers.</li>
    <li><a href="/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-5-accounting-equation-notes"><strong>Class 11 Accounting Equation Notes</strong></a> — free notes + PDF.</li>
    <li><a href="/tools"><strong>Free Commerce Calculators & Tools</strong></a> — use formulas after understanding the concept.</li>
  </ul>
  <p><strong>Quick rule:</strong> notes → recall → practice → check mistakes. Don’t collect ten PDFs for the same chapter.</p>
</section>`;

try {
  let html = await readFile(file, 'utf8');
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);

  if (!html.includes('data-mehsana-resource-upgrade="true"')) {
    const introEnd = /(<h1>Mehsana Commerce Student Resources<\/h1>[\s\S]*?<p>[^<]*<\/p>)/i;
    if (introEnd.test(html)) html = html.replace(introEnd, `$1${block}`);
    else html = html.replace('</article>', `${block}</article>`);
  }

  await writeFile(file, html, 'utf8');
  console.log('Upgraded Mehsana Commerce student resources page.');
} catch (error) {
  if (error?.code === 'ENOENT') console.log('Mehsana student resources page not generated; skipped.');
  else throw error;
}
