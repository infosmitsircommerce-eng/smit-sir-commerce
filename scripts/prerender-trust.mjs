import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const pages = [
  {
    path: '/',
    title: 'Commerce Material Gateway — Free Notes, PDFs, Practice & Tools',
    description: 'Smit Sir Commerce is a free Commerce material gateway where students can find CBSE and GSEB notes, PDF material, practice, games and tools in one clean place.',
    body: `<main class="page-container section-padding" data-prerendered="trust-home"><article><h1>Yahan Commerce ka sara material milega</h1><p>Smit Sir Commerce is a free Commerce material gateway for students. The homepage works as an entrance to notes, PDFs, practice, games and Commerce tools, so students can understand where to go before opening the full material library.</p><h2>Start with material</h2><ul><li><a href="/study-material">Open the full study material finder</a></li><li><a href="/cbse-notes">CBSE Class 11 and 12 Commerce notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics notes</a></li><li><a href="/games">Learning games</a></li><li><a href="/tools">Commerce calculators and tools</a></li></ul><h2>What students can find here</h2><p>The website focuses on Commerce material first: chapter-wise notes, PDF downloads, revision support, practice questions and calculators. Contact help is available only when a student needs extra support after using the free resources.</p><h2>Simple promise</h2><p>Commerce material pehle. Help baad me. No forced demo flow, no confusing advertising-first structure, and no pressure before the student reaches the actual study resources.</p><p><a href="/study-material">Explore material</a> · <a href="/free-commerce-notes.html">Free Commerce notes</a> · <a href="/free-commerce-tools.html">Free Commerce tools</a> · <a href="/contact">Contact Smit Sir</a></p></article></main>`,
  },
  {
    path: '/about',
    title: 'About Smit Sir Commerce — Teacher & Commerce Learning Platform',
    description: 'Smit Sir specialises in Class 11 & 12 Commerce teaching while Smit Sir Commerce is growing into a wider learning platform for school, B.Com, M.Com, UGC NET and GSET students.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a growing Commerce learning platform created by Smit Thaker in Mehsana, Gujarat. The brand is broader than a Class 11 and 12 website, while Smit Sir's personal teaching specialisation remains clearly focused on Class 11 and 12 Commerce.</p><h2>Platform scope</h2><ul><li><a href="/cbse-notes">School Commerce — Class 11 & 12</a></li><li><a href="/college-commerce">College Commerce — B.Com & M.Com</a></li><li><a href="/commerce-exams">Competitive Commerce — UGC NET & GSET</a></li></ul><p>College and competitive-exam sections are resource libraries that will expand as verified notes, PDFs, MCQs, PYQs and revision material are uploaded.</p><h2>Subjects personally taught by Smit Sir</h2><ul><li>Economics</li><li>Business Studies</li><li>Entrepreneurship</li><li>Physical Education</li></ul><p>The website may organise additional Commerce resources separately from the personal teaching-subject list above.</p><h2>Learning philosophy</h2><p>Students should be able to ask why, connect textbook concepts to real life and understand the crux of a chapter before being pushed toward memorisation. Exam application still matters, so concept clarity is followed by answer-writing, testing, revision and mistake analysis.</p><p><a href="/commerce-learning">Explore the Commerce Learning Hub</a> · <a href="/study-material">Study material</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
  },
  {
    path: '/contact',
    title: 'Contact Smit Sir Commerce — Student Help & Commerce Support',
    description: 'Contact Smit Sir Commerce in Mehsana for Class 11 and 12 support, Commerce doubts, study-material help or learning guidance with clear, no-pressure support.',
    body: `<main class="page-container section-padding" data-prerendered="trust-contact"><article><h1>Contact Smit Sir Commerce</h1><p>Start with the actual learning problem: the subject, chapter, test result or confusion you are facing. Students and parents can ask about learning support, study material, board-specific resources or how to use the free resources.</p><h2>Contact details</h2><ul><li>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a></li><li>Service area: Mehsana, Gujarat, India</li></ul><h2>What Smit Sir personally teaches</h2><p>Personal teaching support covers Economics, Business Studies, Entrepreneurship and Physical Education. The website also provides Accountancy calculators and learning resources separately.</p><h2>No-pressure enquiry</h2><p>Public notes, calculators and learning resources can be used without submitting contact details. Asking a question or submitting an enquiry does not create a payment or admission obligation.</p><h2>Privacy and young students</h2><p>Students under 18 should share personal contact information with the awareness of a parent or guardian. The enquiry process is intended to collect only the information needed to respond to the request.</p><p><a href="/study-material">Study material</a> · <a href="/about">Teaching philosophy</a> · <a href="/faq">FAQ</a> · <a href="/privacy">Privacy Policy</a></p></article></main>`,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Smit Sir Commerce',
    description: 'How Smit Sir Commerce handles learning progress, analytics, advertising, account and admission-enquiry data.',
    body: `<main class="page-container section-padding" data-prerendered="trust-privacy"><article><h1>Privacy Policy</h1><p>Last updated: 7 September 2026.</p><h2>Learning and enquiry data</h2><p>The website may process account information, learning progress and information voluntarily submitted through contact or enquiry forms. Admission contact details and private learning history are not displayed publicly.</p><h2>Analytics</h2><p>Limited product-usage events may be recorded to understand which learning and enquiry flows are useful. Analytics metadata is designed not to include passwords, phone numbers, email addresses or free-text student answers.</p><h2>Advertising and Google AdSense</h2><p>Smit Sir Commerce may use Google AdSense or other advertising services in the future on selected public learning pages. If advertising is enabled, Google and its advertising partners may use cookies, local storage, device identifiers or similar technologies to serve and measure ads, subject to applicable consent choices and Google policies.</p><h2>Young users</h2><p>Students under 18 should share contact information only with the awareness of a parent or guardian. The site avoids requesting unnecessary identity documents and does not require a phone number to use the public notes, calculators or Marks Recovery diagnostic.</p><h2>Your controls</h2><p>Supported device-saved study progress can be cleared from the website’s data controls. Browser settings can also be used to manage cookies or site storage. Questions about account, enquiry or advertising-related data can be sent through the contact page.</p><p><a href="/contact">Contact us about privacy</a> · <a href="/terms">Terms of Use</a></p></article></main>`,
  },
  {
    path: '/terms',
    title: 'Terms of Use — Smit Sir Commerce',
    description: 'Terms for using Smit Sir Commerce learning resources, calculators, tests, diagnostics and future advertising.',
    body: `<main class="page-container section-padding" data-prerendered="trust-terms"><article><h1>Terms of Use</h1><p>Last updated: 7 September 2026.</p><h2>Educational purpose</h2><p>Smit Sir Commerce provides study material, practice questions, tests, calculators and learning tools for educational support. Content is not an official CBSE or GSEB publication unless a source is explicitly identified as such.</p><h2>Learning scores</h2><p>Practice scores, mastery percentages and weak-topic estimates are learning aids and are not official school or board grades. Calculator results should be used to understand or check working rather than replace the explanation required in an examination.</p><h2>Content use and fair use</h2><p>Students may use public resources for personal study. Do not scrape, republish or sell original platform content at scale, bypass access controls, abuse tests or enquiry forms, or intentionally overload the service.</p><h2>Questions</h2><p>If a learning feature, access condition or admission arrangement is unclear, use the official contact page before relying on assumptions about paid access, refunds or availability.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
  {
    path: '/access-policy',
    title: 'Access & Learning Policy — Smit Sir Commerce',
    description: 'How free resources, Pro-labelled features and learning progress work on Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-access"><article><h1>Access & Learning Policy</h1><p>Resources labelled Free can be used without purchasing Pro access, subject to normal website availability. Free public resources include published notes, calculators and other learning pages that are specifically marked as free.</p><h2>Pro-labelled features</h2><p>A feature marked Pro requires an account that has been granted Premium access. The website does not claim automatic payment activation unless a verified payment system is introduced.</p><h2>Progress storage</h2><p>Some learning progress is saved on the current device. Logged-in students may also use supported cloud sync when available. A device-saved label should not be interpreted as a guarantee that the same data is already available on every other device.</p><h2>Free resources and advertising</h2><p>Future advertising may help support selected free public learning pages, but private dashboards, admission forms, diagnostics and active test experiences are intended to remain separate from advertising. Free access does not require students to click or interact with advertisements.</p><h2>Support</h2><p>If access does not match what was agreed, use the official contact page so the issue can be checked.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
];

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

for (const page of pages) {
  const url = `${BASE}${page.path}`;
  const fullTitle = `${page.title} | ${SITE}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const tags = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${url}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${url}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg">`;
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

console.log(`Pre-rendered ${pages.length} trust and policy pages with Commerce material gateway homepage.`);
