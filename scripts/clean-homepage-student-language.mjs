import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/index.html', import.meta.url);
const brandFirstTitle = 'Smit Sir Commerce | Free Commerce Notes, PDFs, Practice & Quizzes';

const studentResources = `<section data-home-student-resources="true"><h2>Free Commerce resources — start here</h2><p>Choose the exact resource you need instead of jumping between random PDFs. Start with your board, subject or practice goal.</p><ul><li><a href="/cbse-notes">CBSE Class 11 & 12 Commerce notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics notes & PDFs</a></li><li><a href="/cbse/class-12/business-studies-case-study-questions">Class 12 Business Studies case-study practice</a></li><li><a href="/cbse/class-12/business-studies-mcq">Class 12 Business Studies MCQs</a></li><li><a href="/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-5-accounting-equation-notes">Class 11 Accounting Equation notes</a></li><li><a href="/class-12-commerce-formula-sheet.html">Class 12 Commerce formula sheet</a></li><li><a href="/tools">Free Commerce calculators & tools</a></li><li><a href="/mehsana-commerce-student-resources.html">Free Commerce resources for Mehsana students</a></li></ul></section>`;

let html = await readFile(file, 'utf8');

html = html.replace(
  /<section><h2>Google search traffic resources<\/h2>[\s\S]*?<\/section>(?=<section><h2>Free Commerce practice<\/h2>)/i,
  studentResources,
);

html = html.replace(
  /<p><a href="\/ai-discovery\.html">AI discovery summary<\/a> · <a href="\/llms\.txt">LLMS summary<\/a><\/p>/i,
  '<p><a href="/about">How Smit Sir Commerce teaches</a> · <a href="/faq">Student FAQ</a></p>',
);

// Keep the official brand first in the final crawlable homepage title, even
// after the trust-page prerender step rewrites dist/index.html.
html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${brandFirstTitle}</title>`);
html = html.replace(
  /(<meta\s+property="og:title"\s+content=")[^"]*(">)/gi,
  `$1${brandFirstTitle}$2`,
);
html = html.replace(
  /(<meta\s+name="twitter:title"\s+content=")[^"]*(">)/gi,
  `$1${brandFirstTitle}$2`,
);

await writeFile(file, html, 'utf8');
console.log('Cleaned homepage search-engine wording, preserved brand-first title, and replaced it with student-first resource paths.');

// Final contextual internal-link pass. This runs here because this script is the last
// HTML-mutating step before the SEO audits in package.json.
await import('./link-final-orphan-pages.mjs');
