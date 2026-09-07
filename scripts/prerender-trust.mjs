import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const pages = [
  {
    path: '/',
    title: 'Free Commerce Notes, PDFs, Practice & Tools',
    description: 'A student-first free Commerce resource library for CBSE and GSEB students with PDF notes, chapter practice, games and Commerce tools by Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-home"><article><h1>Free Commerce notes, PDFs, practice and tools</h1><p>Smit Sir Commerce is organised first as a free study-resource library. A student can open the website, choose board, class, subject and chapter, then move directly to notes, PDFs, practice, games and tools without being pushed into a demo or advertisement flow.</p><h2>Start with study material</h2><ul><li><a href="/study-material">Open the study material finder</a></li><li><a href="/free-commerce-notes.html">Free Commerce notes PDF collection</a></li><li><a href="/cbse-commerce-notes.html">CBSE Commerce notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics notes</a></li><li><a href="/free-commerce-tools.html">Free Commerce calculators and tools</a></li></ul><h2>What students can find here</h2><p>The website currently focuses on Class 11 and Class 12 Commerce resources, especially Economics, Business Studies, Accountancy support tools and GSEB Class 12 Economics notes. Students can read chapter pages, open PDF notes, practise questions and use calculators for formulas and numericals.</p><h2>Help stays optional</h2><p>If a concept is still confusing after reading and practice, students can contact Smit Sir from the contact page. The main purpose of the website is simple: open resources quickly, study clearly and revise without unnecessary pressure.</p><p><a href="/study-material">Start studying</a> · <a href="/games">Learning games</a> · <a href="/tools">Commerce tools</a> · <a href="/contact">Contact Smit Sir</a></p></article></main>`,
  },
  {
    path: '/about',
    title: 'About Smit Sir Commerce — Free Commerce Resource Library',
    description: 'Smit Sir Commerce is a student-first Commerce learning website from Mehsana with free notes, PDFs, practice, tools and optional contact support from Smit Sir.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a Commerce learning website created by Smit Thaker in Mehsana, Gujarat. The website is built to help students find study material quickly and revise with less confusion.</p><h2>What the website is for</h2><ul><li><a href="/study-material">Free study material finder</a></li><li><a href="/cbse-notes">CBSE Commerce notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics notes</a></li><li><a href="/daily-practice">Practice and revision</a></li><li><a href="/tools">Commerce tools and calculators</a></li></ul><h2>Subjects personally taught by Smit Sir</h2><p>Smit Sir personally focuses on Class 11 and 12 Commerce teaching, including Economics, Business Studies, Entrepreneurship and Physical Education. The website may also organise extra Commerce resources and calculators for student support.</p><h2>Learning philosophy</h2><p>Students should first understand the crux of a chapter, then practise, test themselves and improve mistakes. The website is arranged around learning resources first, not pressure or unnecessary promotion.</p><p><a href="/study-material">Open study material</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
  },
  {
    path: '/contact',
    title: 'Contact Smit Sir Commerce — Student Help & Enquiries',
    description: 'Contact Smit Sir Commerce for help with Class 11 and 12 Commerce chapters, notes, PDFs, practice, website resources or study-material questions.',
    body: `<main class="page-container section-padding" data-prerendered="trust-contact"><article><h1>Contact Smit Sir Commerce</h1><p>Use the contact page only when you need help after using the study resources. Start with the exact chapter, subject, board or question where you are stuck so the response can be clear and useful.</p><h2>Contact details</h2><ul><li>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a></li><li>Service area: Mehsana, Gujarat, India</li></ul><h2>What to ask</h2><ul><li>Help finding the correct notes or PDF</li><li>Confusion in Economics, Business Studies or Entrepreneurship</li><li>Questions about practice, games or Commerce tools</li><li>Website feedback or resource requests</li></ul><h2>Student-first contact policy</h2><p>Public notes, calculators and learning resources can be used without submitting contact details. Contact support is optional and should not feel like a forced sales step.</p><p><a href="/study-material">Study material</a> · <a href="/about">About Smit Sir</a> · <a href="/faq">FAQ</a> · <a href="/privacy">Privacy Policy</a></p></article></main>`,
  },
  {
    path: '/privacy',
    title: 'Privacy Policy — Smit Sir Commerce',
    description: 'How Smit Sir Commerce handles learning progress, analytics, advertising, account and contact-enquiry data.',
    body: `<main class="page-container section-padding" data-prerendered="trust-privacy"><article><h1>Privacy Policy</h1><p>Last updated: 7 September 2026.</p><h2>Learning and enquiry data</h2><p>The website may process account information, learning progress and information voluntarily submitted through contact or enquiry forms. Contact details and private learning history are not displayed publicly.</p><h2>Analytics</h2><p>Limited product-usage events may be recorded to understand which learning flows are useful. Analytics metadata is designed not to include passwords, phone numbers, email addresses or free-text student answers.</p><h2>Advertising and Google AdSense</h2><p>Smit Sir Commerce may use Google AdSense or other advertising services on selected public learning pages. Advertising is not intended to be shown on private dashboards, admin areas, login flows, diagnostics, contact forms or active test experiences.</p><h2>Young users</h2><p>Students under 18 should share contact information only with the awareness of a parent or guardian. Public notes, calculators and learning resources can be used without submitting contact details.</p><h2>Your controls</h2><p>Supported device-saved study progress can be cleared from the website’s data controls. Browser settings can also be used to manage cookies or site storage.</p><p><a href="/contact">Contact us about privacy</a> · <a href="/terms">Terms of Use</a></p></article></main>`,
  },
  {
    path: '/terms',
    title: 'Terms of Use — Smit Sir Commerce',
    description: 'Terms for using Smit Sir Commerce learning resources, calculators, tests, diagnostics and public study material.',
    body: `<main class="page-container section-padding" data-prerendered="trust-terms"><article><h1>Terms of Use</h1><p>Last updated: 7 September 2026.</p><h2>Educational purpose</h2><p>Smit Sir Commerce provides study material, practice questions, tests, calculators and learning tools for educational support. Content is not an official CBSE, GSEB or school publication unless a source is explicitly identified as such.</p><h2>Learning scores</h2><p>Practice scores, mastery percentages, weak-topic estimates and readiness-style diagnostics are learning aids and are not official school or board grades.</p><h2>Advertising</h2><p>Selected public learning pages may display third-party advertising. Ads do not represent an endorsement by Smit Sir Commerce, and users must not intentionally generate invalid ad impressions or clicks.</p><h2>Content use and fair use</h2><p>Students may use public resources for personal study. Do not scrape, republish or sell original platform content at scale, bypass access controls, abuse tests or enquiry forms, or intentionally overload the service.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/contact">Contact</a></p></article></main>`,
  },
  {
    path: '/access-policy',
    title: 'Access & Learning Policy — Smit Sir Commerce',
    description: 'How free resources, optional features and learning progress work on Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-access"><article><h1>Access & Learning Policy</h1><p>Resources labelled Free can be used without purchasing access, subject to normal website availability. Free public resources include published notes, calculators, practice pages and other learning pages that are specifically marked as free.</p><h2>Optional support</h2><p>Contact support or any future paid feature should stay separate from the free resource library. A student should be able to open notes and tools without feeling forced into an enquiry flow.</p><h2>Progress storage</h2><p>Some learning progress may be saved on the current device. Logged-in students may also use supported cloud sync when available.</p><h2>Free resources and advertising</h2><p>Future advertising may help support selected free public learning pages, but private dashboards, forms, diagnostics and active test experiences should stay separate from advertising. Free access does not require students to click or interact with advertisements.</p><p><a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a> · <a href="/contact">Contact</a></p></article></main>`,
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

console.log(`Pre-rendered ${pages.length} trust and policy pages with student-first crawler content.`);
