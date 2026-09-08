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

const trafficHomeLinks = [...silentSearchPages, ...genuineTrafficPages, ...localSeoPages, ...localActionPages.filter((page) => page.indexable !== false)]
  .map((page) => `<li><a href="${page.path}">${page.h1}</a></li>`)
  .join('');

const homeBody = `<main class="page-container section-padding" data-prerendered="trust-home"><article><section style="display:grid;grid-template-columns:1.12fr .88fr;gap:36px;align-items:center"><div><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Smit Sir Commerce</p><h1>In a world chasing marks, choose understanding.</h1><p>Free Commerce notes, PDFs, practice, tools and real-life learning games for Class 11 and 12 students who want clarity first — then marks as the natural result.</p><h2>Learning with Fun. Marks as a Result.</h2><p><a href="/study-material">Open Study Material</a> · <a href="/games">Play Commerce Games</a> · <a href="/cbse-notes">CBSE Notes</a> · <a href="/free-class-12-commerce-study-pack.html">Free Class 12 Study Pack</a> · <a href="/book-demo">Demo later</a></p></div><figure><img src="/teacher.jpg" alt="Smit Thaker — Commerce Teacher" style="max-width:360px;width:100%;border-radius:24px"><figcaption>Smit Thaker — Commerce teacher focused on clarity, notes and practice.</figcaption></figure></section><section><h2>Start here</h2><ol><li>Choose your board: CBSE or GSEB.</li><li>Pick your class and subject.</li><li>Open chapter notes or download the PDF.</li><li>Practise with questions, tools and realistic Commerce games.</li></ol></section><section><h2>Google search traffic resources</h2><p>These pages help genuine students who search exact phrases like Commerce tuition in Mehsana, GSEB Economics notes PDF, Class 12 Commerce formula sheet, Macroeconomics numericals and Business Studies case-study questions.</p><ul>${trafficHomeLinks}</ul></section><section><h2>Real Commerce Games</h2><ul><li>Market Shock Simulator — predict demand, supply and price after news.</li><li>Family Budget Challenge — manage income, needs, wants and savings.</li><li>Shopkeeper Price War — decide pricing, discount and stock strategy.</li><li>Inflation Time Machine — understand how money value changes over time.</li><li>Business Decision Game — compare cost, revenue, profit and break-even.</li></ul></section><section><h2>Trust and focus</h2><ul><li>Made by Smit Thaker</li><li>Commerce teacher</li><li>Free material for students</li><li>CBSE and GSEB focused</li><li>Notes first, practice next, demo only when needed</li></ul><p><a href="/ai-discovery.html">AI discovery summary</a> · <a href="/llms.txt">LLMS summary</a></p></section></article></main>`;

const pages = [
  {
    path: '/',
    title: 'Free Commerce Notes, PDFs, Practice & Games',
    description: 'Free Commerce study material for Class 11 and 12 students: CBSE and GSEB notes, Economics PDFs, Business Studies resources, Accountancy support, practice tools and realistic Commerce games.',
    body: homeBody,
  },
  {
    path: '/about',
    title: 'About Smit Sir Commerce — Teacher & Commerce Learning Platform',
    description: 'Smit Sir specialises in Class 11 & 12 Commerce teaching while Smit Sir Commerce is growing into a wider learning platform for school, B.Com, M.Com, UGC NET and GSET students.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a growing Commerce learning platform created by Smit Thaker in Mehsana, Gujarat. The brand is broader than a Class 11 and 12 website, while Smit Sir's personal teaching specialisation remains clearly focused on Class 11 and 12 Commerce.</p><h2>Platform scope</h2><ul><li><a href="/cbse-notes">School Commerce — Class 11 & 12</a></li><li><a href="/college-commerce">College Commerce — B.Com & M.Com</a></li><li><a href="/commerce-exams">Competitive Commerce — UGC NET & GSET</a></li></ul><h2>Subjects personally taught by Smit Sir</h2><ul><li>Economics</li><li>Business Studies</li><li>Entrepreneurship</li><li>Physical Education</li></ul><h2>Learning philosophy</h2><p>Students should be able to ask why, connect textbook concepts to real life and understand the crux of a chapter before being pushed toward memorisation.</p><p><a href="/commerce-learning">Explore the Commerce Learning Hub</a> · <a href="/study-material">Study material</a> · <a href="/free-class-12-commerce-study-pack.html">Free study pack</a> · <a href="/ai-discovery.html">AI discovery summary</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
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
    body: `<main class="page-container section-padding" data-prerendered="trust-privacy"><article><h1>Privacy Policy</h1><p>Last updated: 7 September 2026.</p><h2>Learning and enquiry data</h2><p>The website may process account information, learning progress and information voluntarily submitted through contact or enquiry forms.</p><h2>Analytics and advertising</h2><p>Limited product-usage events may be recorded to understand which learning flows are useful. Selected public pages may use advertising services in the future, subject to applicable choices and policies.</p><h2>Young users</h2><p>Students under 18 should share contact information only with the awareness of a parent or guardian.</p><p><a href="/contact">Contact us about privacy</a> · <a href="/terms">Terms of Use</a></p></article></main>`,
  },
  {
    path: '/terms',
    title: 'Terms of Use — Smit Sir Commerce',
    description: 'Terms for using Smit Sir Commerce learning resources, calculators, tests, diagnostics and future advertising.',
    body: `<main class="page-container section-padding" data-prerendered="trust-terms"><article><h1>Terms of Use</h1><p>Last updated: 7 September 2026.</p><h2>Educational purpose</h2><p>Smit Sir Commerce provides study material, practice questions, tests, calculators and learning tools for educational support. Content is not an official CBSE or GSEB publication unless a source is explicitly identified as such.</p><h2>Learning scores</h2><p>Practice scores, mastery percentages and weak-topic estimates are learning aids and are not official school or board grades.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact</a></p></article></main>`,
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
