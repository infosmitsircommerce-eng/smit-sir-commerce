import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

const pages = [
  {
    path: '/',
    title: 'Free CBSE Commerce Notes, Calculators & Practice Class 11 & 12',
    description: 'Free CBSE Commerce notes, Economics and Accountancy calculators, chapter-wise PDFs, practice resources, tests, marks-recovery tools and Commerce coaching by Smit Sir Commerce.',
    body: `<main class="page-container section-padding" data-prerendered="trust-home"><article><h1>Free CBSE Commerce Notes, Calculators & Practice for Class 11 & 12</h1><p>Smit Sir Commerce is a Commerce learning platform for Class 11 and 12 students with free notes, interactive Economics and Accountancy calculators, chapter practice, exam-preparation resources and the Commerce Marks Leak & Recovery Engine.</p><h2>Free learning tools</h2><ul><li><a href="/tools">41 free Commerce calculators</a></li><li><a href="/cbse-notes">Free CBSE Commerce notes</a></li><li><a href="/cbse-practice">Chapter-wise Commerce practice</a></li><li><a href="/marks-recovery">Commerce Marks Leak & Recovery Engine</a></li></ul><p>The goal is not to publish isolated pages. Notes, calculators, practice and diagnostics are connected so a student can understand a concept, verify a numerical, identify a weak area and then practise that same topic again.</p><h2>Teaching and support</h2><p>Smit Sir teaches Economics, Business Studies, Entrepreneurship and Physical Education, with online learning support and local Commerce coaching enquiries in Mehsana, Gujarat. Students who are already taking tuition elsewhere can still use the free learning resources and request a paper analysis without being required to leave their existing classes.</p><h2>Who runs this website?</h2><p>Smit Sir Commerce is operated as an educational platform by Smit Thaker. Public contact, privacy and policy pages are available so students and parents can understand who provides the resources, how enquiries are handled and how learning data is used.</p><p><a href="/about">About Smit Sir</a> · <a href="/contact">Contact</a> · <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a></p></article></main>`,
  },
  {
    path: '/about',
    title: 'About Smit Sir — Commerce Teacher Mehsana',
    description: 'Meet Smit Sir, a CBSE Commerce educator in Mehsana, Gujarat, focused on Economics, Business Studies, Entrepreneurship and Physical Education for Class 11 and 12 students.',
    body: `<main class="page-container section-padding" data-prerendered="trust-about"><article><h1>About Smit Sir Commerce</h1><p>Smit Sir Commerce is a Class 11 and 12 Commerce learning platform created by Smit Thaker in Mehsana, Gujarat. The teaching approach focuses on concept clarity, structured revision, exam application, regular practice and personal guidance.</p><h2>Subjects taught by Smit Sir</h2><ul><li>Economics</li><li>Business Studies</li><li>Entrepreneurship</li><li>Physical Education</li></ul><p>The website also publishes free Accountancy learning tools and calculators as student resources; those resources are separate from the personal teaching-subject list above.</p><h2>Learning approach</h2><p>The platform is designed around a simple cycle: understand the concept, solve or practise it, identify the mistake, revise the weak point and test it again. This is why the website combines chapter notes with calculators, practice pages, tests and the Marks Recovery diagnostic instead of offering only downloadable PDFs.</p><h2>Learning resources</h2><p>Students can use free CBSE notes, Commerce calculators, practice resources, tests and the Marks Recovery diagnostic without relying only on coaching pages. Local students can also ask about a free paper analysis or demo in Mehsana, while online learners can continue using the free public resources from elsewhere.</p><p><a href="/tools">Free Commerce calculators</a> · <a href="/marks-recovery">Marks Recovery</a> · <a href="/contact">Contact Smit Sir Commerce</a></p></article></main>`,
  },
  {
    path: '/contact',
    title: 'Contact — Free Commerce Paper Analysis & Demo',
    description: 'Contact Smit Sir Commerce in Mehsana, Gujarat for Class 11 and 12 Commerce learning support, a free test-paper analysis, demo class or admission enquiry.',
    body: `<main class="page-container section-padding" data-prerendered="trust-contact"><article><h1>Contact Smit Sir Commerce</h1><p>For a free Commerce paper analysis, demo, subject enquiry or batch enquiry, contact Smit Sir Commerce directly. The website is designed so students can use the free resources without submitting contact details; contact information is only needed when a student or parent chooses to ask for personal guidance, a demo or admission information.</p><h2>Contact details</h2><ul><li>Phone: <a href="tel:+916353709585">+91 63537 09585</a></li><li>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a></li><li>Service area: Mehsana, Gujarat, India</li></ul><h2>What you can ask about</h2><p>You can ask about Economics, Business Studies, Entrepreneurship or Physical Education teaching support, a free test-paper analysis, online or offline learning mode, batch availability, or how to use the free Commerce tools and study resources. If you are already studying with another teacher or tuition class, you can still request a paper analysis without making an admission commitment.</p><h2>For parents and young students</h2><p>Students under 18 should share a phone number with the awareness of a parent or guardian. The enquiry process is intended to collect only the information needed to respond to the request, not unnecessary identity documents.</p><p><a href="/book-demo">Free paper analysis / demo</a> · <a href="/commerce-coaching-mehsana">Commerce tuition in Mehsana</a> · <a href="/privacy">Privacy Policy</a></p></article></main>`,
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
