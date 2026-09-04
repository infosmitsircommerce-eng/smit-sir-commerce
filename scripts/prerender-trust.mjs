import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const pages = [
  {
    path: '/',
    title: 'Commerce Notes, Tools & Exam Resources — School to NET',
    description: 'A growing Commerce learning platform for Class 11 & 12, B.Com, M.Com, UGC NET and GSET with notes, PDFs, practice and tools, plus specialist Class 11 & 12 teaching by Smit Sir.',
    body: `<main class="page-container section-padding" data-prerendered="trust-home"><article><h1>Commerce learning from school to college and competitive exams</h1><p>Smit Sir Commerce is a growing Commerce learning platform built for students across the Commerce journey. The strongest published library today is Class 11 and 12 Commerce, while dedicated B.Com, M.Com, UGC NET Commerce and GSET Commerce sections are being expanded progressively.</p><h2>One Commerce platform, three stages</h2><ul><li><a href="/cbse-notes">School Commerce — Class 11 & 12 notes and practice</a></li><li><a href="/college-commerce">College Commerce — B.Com & M.Com semester roadmaps</a></li><li><a href="/commerce-exams">Competitive Commerce — UGC NET & GSET hubs</a></li></ul><p>The wider platform can organise notes, PDFs, MCQs, PYQs, revision and tools without pretending that every subject on the website is personally taught by Smit Sir.</p><h2>Clear teaching specialisation</h2><p>Smit Sir personally specialises in Class 11 and 12 Commerce teaching, including Economics, Business Studies, Entrepreneurship and Physical Education. College and competitive-exam sections are resource libraries that will grow as verified material is uploaded.</p><h2>Learning before memorising</h2><p>The platform connects concept explanations, chapter notes, calculators, practice, tests and diagnostics so students can understand why a concept works, apply it, identify mistakes and then improve exam performance.</p><h2>Explore the full Commerce journey</h2><p><a href="/commerce-learning">Open the complete Commerce Learning Hub</a> · <a href="/tools">Free Commerce tools</a> · <a href="/about">About Smit Sir</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
  {
    path: '/about',
    title: 'About Smit Sir Commerce — Teacher & Commerce Learning Platform',
    description: 'Smit Sir specialises in Class 11 & 12 Commerce teaching while Smit Sir Commerce is growing into a wider learning platform for school, B.Com, M.Com, UGC NET and GSET students.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a growing Commerce learning platform created by Smit Thaker in Mehsana, Gujarat. The brand is broader than a Class 11 and 12 website, while Smit Sir's personal teaching specialisation remains clearly focused on Class 11 and 12 Commerce.</p><h2>Platform scope</h2><ul><li><a href="/cbse-notes">School Commerce — Class 11 & 12</a></li><li><a href="/college-commerce">College Commerce — B.Com & M.Com</a></li><li><a href="/commerce-exams">Competitive Commerce — UGC NET & GSET</a></li></ul><p>College and competitive-exam sections are resource libraries that will expand as verified notes, PDFs, MCQs, PYQs and revision material are uploaded.</p><h2>Subjects personally taught by Smit Sir</h2><ul><li>Economics</li><li>Business Studies</li><li>Entrepreneurship</li><li>Physical Education</li></ul><p>The website may organise additional Commerce resources separately from the personal teaching-subject list above.</p><h2>Learning philosophy</h2><p>Students should be able to ask why, connect textbook concepts to real life and understand the crux of a chapter before being pushed toward memorisation. Exam application still matters, so concept clarity is followed by answer-writing, testing, revision and mistake analysis.</p><h2>What the platform stands for</h2><p>Smit Sir Commerce promotes learning with curiosity and less unnecessary fear. Public learning resources, contact information, privacy information and policy pages are available so students and parents can understand what is actually offered.</p><p><a href="/commerce-learning">Explore the Commerce Learning Hub</a> · <a href="/book-demo">Free paper analysis / demo</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
  },
  {
    path: '/contact',
    title: 'Contact Smit Sir — Free Commerce Paper Analysis & Demo',
    description: 'Contact Smit Sir Commerce in Mehsana for Class 11 and 12 support, a free test-paper analysis, demo class or admission enquiry with clear, no-pressure guidance.',
    body: `<main class="page-container section-padding" data-prerendered="trust-contact"><article><h1>Contact Smit Sir Commerce</h1><p>Start with the actual learning problem: the subject, chapter, test result or confusion you are facing. Students and parents can ask about a free paper analysis, demo, batch information, learning mode or how to use the free resources.</p><h2>Contact details</h2><ul><li>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a></li><li>Service area: Mehsana, Gujarat, India</li></ul><h2>What Smit Sir personally teaches</h2><p>Personal teaching support covers Economics, Business Studies, Entrepreneurship and Physical Education. The website also provides Accountancy calculators and learning resources separately.</p><h2>No-pressure enquiry</h2><p>A free paper analysis does not require admission or leaving an existing tuition class. Asking a question or submitting an enquiry does not create a payment or admission obligation, and the platform does not use fake marks guarantees or invented urgency.</p><h2>Privacy and young students</h2><p>Public notes, calculators and learning resources can be used without submitting contact details. Students under 18 should share personal contact information with the awareness of a parent or guardian. The enquiry process is intended to collect only the information needed to respond to the request.</p><p><a href="/book-demo">Free paper analysis / demo</a> · <a href="/about">Teaching philosophy</a> · <a href="/faq">FAQ</a> · <a href="/privacy">Privacy Policy</a></p></article></main>`,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Smit Sir Commerce',
    description: 'How Smit Sir Commerce handles learning progress, analytics, advertising, account and admission-enquiry data.',
    body: `<main class="page-container section-padding" data-prerendered="trust-privacy"><article><h1>Privacy Policy</h1><p>Last updated: 3 September 2026.</p><h2>Learning and enquiry data</h2><p>The website may process account information, learning progress and information voluntarily submitted through contact, demo or admission forms. Admission contact details and private learning history are not displayed publicly.</p><h2>Analytics</h2><p>Limited product-usage events may be recorded to understand which learning and enquiry flows are useful. Analytics metadata is designed not to include passwords, phone numbers, email addresses or free-text student answers.</p><h2>Advertising and Google AdSense</h2><p>Smit Sir Commerce may use Google AdSense or other advertising services in the future on selected public learning pages. If advertising is enabled, Google and its advertising partners may use cookies, local storage, device identifiers or similar technologies to serve and measure ads, subject to applicable consent choices and Google policies.</p><p>Advertising is not intended to be shown on private dashboards, admin areas, login flows, Marks Recovery diagnostics, demo or admission forms, or other sensitive conversion pages. The website keeps advertising eligibility separate from private learning and lead-generation areas so ads can be introduced conservatively if the site is approved later.</p><h2>Young users</h2><p>Students under 18 should share contact information only with the awareness of a parent or guardian. The site avoids requesting unnecessary identity documents and does not require a phone number to use the public notes, calculators or Marks Recovery diagnostic.</p><h2>Your controls</h2><p>Supported device-saved study progress can be cleared from the website’s data controls. Browser settings can also be used to manage cookies or site storage. Questions about account, enquiry or advertising-related data can be sent through the contact page.</p><p><a href="/contact">Contact us about privacy</a> · <a href="/terms">Terms of Use</a></p></article></main>`,
  },
  {
    path: '/terms',
    title: 'Terms of Use — Smit Sir Commerce',
    description: 'Terms for using Smit Sir Commerce learning resources, calculators, tests, diagnostics and future advertising.',
    body: `<main class="page-container section-padding" data-prerendered="trust-terms"><article><h1>Terms of Use</h1><p>Last updated: 3 September 2026.</p><h2>Educational purpose</h2><p>Smit Sir Commerce provides study material, practice questions, tests, calculators and learning tools for educational support. Content is not an official CBSE publication unless a source is explicitly identified as such.</p><h2>Learning scores</h2><p>Practice scores, mastery percentages, weak-topic estimates and Commerce Readiness Scores are learning aids and are not official school or board grades. Calculator results should be used to understand or check working rather than replace the explanation required in an examination.</p><h2>Advertising</h2><p>Selected public learning pages may display third-party advertising in the future. Ads do not represent an endorsement by Smit Sir Commerce, and users must not intentionally generate invalid ad impressions or clicks. Private dashboards, diagnostics, admission forms and active test experiences are intended to remain ad-free under the current placement policy.</p><h2>Content use and fair use</h2><p>Students may use public resources for personal study. Do not scrape, republish or sell original platform content at scale, bypass access controls, abuse tests or enquiry forms, or intentionally overload the service. Features and availability may change as the platform develops.</p><h2>Questions</h2><p>If a learning feature, access condition or admission arrangement is unclear, use the official contact page before relying on assumptions about paid access, refunds or availability.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
  {
    path: '/access-policy',
    title: 'Access & Learning Policy — Smit Sir Commerce',
    description: 'How free resources, Pro-labelled features and learning progress work on Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-access"><article><h1>Access & Learning Policy</h1><p>Resources labelled Free can be used without purchasing Pro access, subject to normal website availability. Free public resources include published notes, calculators and other learning pages that are specifically marked as free.</p><h2>Pro-labelled features</h2><p>A feature marked Pro requires an account that has been granted Premium access. The website does not claim automatic payment activation unless a verified payment system is introduced. If paid access is offered, the duration and included features should be confirmed before payment.</p><h2>Progress storage</h2><p>Some learning progress is saved on the current device. Logged-in students may also use supported cloud sync when available. A device-saved label should not be interpreted as a guarantee that the same data is already available on every other device.</p><h2>Free resources and advertising</h2><p>Future advertising may help support selected free public learning pages, but the current placement policy keeps private dashboards, admission forms, Marks Recovery diagnostics and active test experiences separate from advertising. Free access does not require students to click or interact with advertisements.</p><h2>Support</h2><p>If access does not match what was agreed, use the official contact page so the issue can be checked. Any refund, cancellation or transfer condition for a paid arrangement should be confirmed in writing before payment.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/contact">Contact</a></p></article></main>`,
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

console.log(`Pre-rendered ${pages.length} trust and policy pages for crawler review.`);
