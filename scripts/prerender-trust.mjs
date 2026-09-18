import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { silentSearchPages } from '../src/data/silentSearchPages.js';
import { genuineTrafficPages } from '../src/data/genuineTrafficPages.js';
import { localActionPages } from '../src/data/localActionPages.js';
import { localSeoPages } from '../src/data/localSeoPages.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const trafficHomeLinks = [
  '<li><a href="/teacher-guides">Smit Sir Teacher Guides</a></li>',
  ...[...silentSearchPages, ...genuineTrafficPages, ...localSeoPages, ...localActionPages.filter((page) => page.indexable !== false)]
    .map((page) => `<li><a href="${page.path}">${page.h1}</a></li>`),
].join('');

const homeBody = `<main class="page-container section-padding" data-prerendered="trust-home"><article><section style="display:grid;grid-template-columns:1.12fr .88fr;gap:36px;align-items:center"><div><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Smit Sir Commerce</p><h1>Free Class 11 and 12 Commerce notes, quizzes and board preparation</h1><p>Study CBSE and GSEB Commerce with chapter-wise notes, downloadable PDFs, practice questions and instant diagnostic tests created by Smit Sir.</p><h2>Find weak topics before your board exam</h2><p><a href="/board-exam-diagnostic">Start the Free Board Diagnostic</a> · <a href="/quizzes">Open Chapter Quizzes</a> · <a href="/study-material">Open Study Material</a> · <a href="/cbse-notes">CBSE Notes</a></p></div><figure><img src="/teacher.jpg" alt="Smit Thaker — Commerce Teacher" style="max-width:360px;width:100%;border-radius:24px"><figcaption>Smit Thaker — Commerce teacher focused on clear notes, practice and exam preparation.</figcaption></figure></section><section><h2>Start your board preparation</h2><ol><li>Take the free 15-question diagnostic.</li><li>See your score and three weakest topics.</li><li>Follow the personalised seven-day revision plan.</li><li>Use chapter notes and quizzes to improve your next score.</li></ol></section><section><h2>Google search traffic resources</h2><p>These pages help genuine students who search exact phrases like Commerce tuition in Mehsana, GSEB Economics notes PDF, Class 12 Commerce formula sheet, Macroeconomics numericals and Business Studies case-study questions.</p><ul>${trafficHomeLinks}</ul></section><section><h2>Free Commerce practice</h2><ul><li><a href="/board-exam-diagnostic">CBSE and GSEB Class 12 diagnostic tests</a></li><li><a href="/quizzes">Chapter-wise Economics quizzes</a></li><li><a href="/cbse/class-12/business-studies-case-study-questions">Business Studies case-study questions</a></li><li><a href="/study-material">CBSE and GSEB chapter notes</a></li></ul></section><section><h2>Trust and focus</h2><ul><li>Made by Smit Thaker</li><li>Commerce teacher in Mehsana</li><li>Free material for students</li><li>CBSE and GSEB focused</li><li>Notes first, practice next, paid help only when useful</li></ul><p><a href="/ai-discovery.html">AI discovery summary</a> · <a href="/llms.txt">LLMS summary</a></p></section></article></main>`;

const pages = [
  {
    path: '/',
    title: 'Free Commerce Notes, PDFs, Practice & Quizzes',
    description: 'Free Commerce study material for Class 11 and 12 students: CBSE and GSEB notes, Economics PDFs, Business Studies resources, Accountancy support, practice tools and chapter-wise quizzes.',
    body: homeBody,
  },
  {
    path: '/about',
    title: 'About Smit Sir Commerce — Teacher & Commerce Learning Platform',
    description: 'Learn about Smit Sir and the student-first Class 11 & 12 CBSE and GSEB Commerce learning platform behind Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a student-first Class 11 and 12 Commerce learning platform created by Smit Thaker in Mehsana, Gujarat. The current public library focuses on useful, already-published CBSE and GSEB resources rather than advertising unfinished sections.</p><h2>Current platform scope</h2><ul><li><a href="/cbse-notes">CBSE Class 11 & 12 Commerce notes</a></li><li><a href="/study-material">CBSE and GSEB study material</a></li><li><a href="/quizzes">Chapter-wise quizzes and practice</a></li><li><a href="/tools">Commerce calculators and learning tools</a></li></ul><h2>Subjects personally taught by Smit Sir</h2><ul><li>Economics</li><li>Business Studies</li><li>Entrepreneurship</li><li>Physical Education</li></ul><h2>Learning philosophy</h2><p>Students should be able to ask why, connect textbook concepts to real life and understand the crux of a chapter before being pushed toward memorisation. The website is designed to support that process with clear chapter explanations, revision material, practice questions, calculators and quizzes that students can use before deciding whether they need additional teaching support.</p><h2>How the website is maintained</h2><p>Published resources are reviewed, corrected and improved over time. Broken links, content errors and rights concerns can be reported through the official contact page so the public learning library stays useful and trustworthy.</p><p><a href="/study-material">Study material</a> · <a href="/free-class-12-commerce-study-pack.html">Free study pack</a> · <a href="/disclaimer">Disclaimer &amp; Content Originality</a> · <a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
  },
  {
    path: '/contact',
    title: 'Contact Smit Sir Commerce — Student Help & Commerce Support',
    description: 'Contact Smit Sir Commerce in Mehsana for Class 11 and 12 support, Commerce doubts, study-material help or learning guidance with clear, no-pressure support.',
    body: `<main class="page-container section-padding" data-prerendered="trust-contact"><article><h1>Contact Smit Sir Commerce</h1><p>Start with the actual learning problem: the subject, chapter, test result or confusion you are facing. Students and parents can ask about learning support, study material, board-specific resources or how to use the free resources.</p><h2>Contact details</h2><ul><li>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a></li><li>Service area: Mehsana, Gujarat, India</li></ul><h2>No-pressure enquiry</h2><p>Public notes, calculators and learning resources can be used without submitting contact details. Asking a question or submitting an enquiry does not create a payment or admission obligation.</p><h2>Privacy and young students</h2><p>Students under 18 should share personal contact information with the awareness of a parent or guardian.</p><p><a href="/study-material">Study material</a> · <a href="/about">Teaching philosophy</a> · <a href="/faq">FAQ</a> · <a href="/privacy">Privacy Policy</a></p></article></main>`,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Smit Sir Commerce',
    description: 'How Smit Sir Commerce handles learning progress, analytics, advertising, account and admission-enquiry data.',
    body: `<main class="page-container section-padding" data-prerendered="trust-privacy"><article><h1>Privacy Policy</h1><p>Last updated: 7 September 2026.</p><h2>Learning and enquiry data</h2><p>The website may process account information, learning progress and information voluntarily submitted through contact or enquiry forms.</p><h2>Analytics and advertising</h2><p>Limited product-usage events may be recorded to understand which learning flows are useful. Selected public pages may use advertising services in the future, subject to applicable choices and policies.</p><h2>Young users</h2><p>Students under 18 should share contact information only with the awareness of a parent or guardian.</p><p><a href="/contact">Contact us about privacy</a> · <a href="/terms">Terms of Use</a> · <a href="/disclaimer">Disclaimer &amp; Content Originality</a></p></article></main>`,
  },
  {
    path: '/terms',
    title: 'Terms of Use — Smit Sir Commerce',
    description: 'Terms for using Smit Sir Commerce learning resources, calculators, tests, diagnostics and future advertising.',
    body: `<main class="page-container section-padding" data-prerendered="trust-terms"><article><h1>Terms of Use</h1><p>Last updated: 7 September 2026.</p><h2>Educational purpose</h2><p>Smit Sir Commerce provides study material, practice questions, tests, calculators and learning tools for educational support. Content is not an official CBSE or GSEB publication unless a source is explicitly identified as such.</p><h2>Learning scores</h2><p>Practice scores, mastery percentages and weak-topic estimates are learning aids and are not official school or board grades.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
  {
    path: '/disclaimer',
    title: 'Disclaimer & Content Originality — Smit Sir Commerce',
    description: 'Educational-use, accuracy, copyright, advertising and external-link disclosures for Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-disclaimer"><article><h1>Disclaimer & Content Originality</h1><p>Smit Sir Commerce provides learning resources for study and revision support. Website notes, quizzes, calculators, guides and explanations are not official CBSE, GSEB, university or government publications unless a source is explicitly identified as such.</p><h2>Originality and copyright</h2><p>The platform is intended to publish original explanations, practice resources, worksheets, tools and teaching material created for Smit Sir Commerce, together with properly identified official or third-party references where their use is permitted. The website does not claim ownership of board names, textbook titles, trademarks or third-party publications.</p><h2>Accuracy and exam use</h2><p>Reasonable care is taken to keep educational content accurate and useful, but mistakes can occur and syllabi, marking patterns or official instructions can change. Students should verify high-stakes exam requirements against the latest official board or institution notice.</p><h2>No result guarantee</h2><p>Study material, diagnostics, tools, tests and teaching support do not guarantee a particular score, rank, admission outcome or examination result.</p><h2>Advertising and external links</h2><p>Public learning pages may use Google AdSense or another advertising provider after approval. Advertising is separate from educational content and does not represent an endorsement. External sites are governed by their own policies.</p><h2>Corrections and rights concerns</h2><p>If you believe a page contains an error or material that should not be published, use the <a href="/contact">Contact page</a> and identify the exact page or resource so it can be reviewed promptly.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/access-policy">Access Policy</a></p></article></main>`,
  },
  {
    path: '/access-policy',
    title: 'Access & Learning Policy — Smit Sir Commerce',
    description: 'How free resources, Pro-labelled features and learning progress work on Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-access"><article><h1>Access & Learning Policy</h1><p>Resources labelled Free can be used without purchasing Pro access, subject to normal website availability.</p><h2>Pro-labelled features</h2><p>A feature marked Pro requires an account that has been granted Premium access. The website does not claim automatic payment activation unless a verified payment system is introduced.</p><h2>Support</h2><p>If access does not match what was agreed, use the official contact page so the issue can be checked.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
];

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

for (const page of pages) {
  const url = `${BASE}${page.path}`;
  const fullTitle = `${page.title} | ${SITE}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const tags = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${url}"><link rel="alternate" type="text/plain" href="${BASE}/llms.txt" title="LLMS text summary for Smit Sir Commerce"><link rel="alternate" type="application/json" href="${BASE}/ai-summary.json" title="AI summary JSON for Smit Sir Commerce"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg">`;
  const html = source
    .replace(/<title>.*?<\/title>/s, `<title>${esc(fullTitle)}</title>`)
    .replace('</head>', `${tags}\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${page.body}</div>`);

  if (page.path === '/') {
    await writeFile(join(distRoot.pathname, 'index.html'), html, 'utf8');
    continue;
  }
  const relative = page.path.replace(/^\//, '');
  const clean = join(distRoot.pathname, `${relative}.html`);
  const directory = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, html, 'utf8');
  await writeFile(directory, html, 'utf8');
}

console.log(`Pre-rendered ${pages.length} trust and policy pages with local action search links.`);
