import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const BASE = "https://www.smitsircommerce.in";
const SITE = "Smit Sir Commerce";
const distRoot = new URL("../dist/", import.meta.url).pathname;
const robots =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const pages = [
  {
    route: "/contact",
    files: ["contact.html", "contact/index.html"],
    title: "Contact Smit Sir Commerce — Student Help & Commerce Support",
    description:
      "Contact Smit Sir Commerce for Commerce study-material help, Class 11 and 12 learning support, free notes, PDF resources and student enquiries in Mehsana.",
    body: `<main class="page-container section-padding" data-prerendered="adsense-contact"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Student support</p><h1>Contact Smit Sir Commerce</h1><p>Smit Sir Commerce is a student-first Commerce learning website for Class 11 and Class 12 students. The public website provides free notes, PDF resources, practice routes, Commerce tools and learning games. Students and parents can use the free material first and contact only when they need guidance, doubt support or learning direction.</p><section><h2>Official contact</h2><p>Email: <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a>. While sending a message, include your board, class, subject, chapter and exact difficulty. A clear message helps faster support than a general message like “I have doubt”.</p></section><section><h2>What students can ask</h2><ul><li>How to use free Commerce notes and PDF material.</li><li>Which chapter to revise first before a test or exam.</li><li>How to practise Economics numericals, Business Studies case studies or Accountancy formulas.</li><li>Whether a resource is suitable for CBSE, GSEB or general Commerce revision.</li><li>How to report a broken link, PDF problem, spelling mistake or website issue.</li></ul></section><section><h2>No-pressure enquiry policy</h2><p>Contacting Smit Sir Commerce does not create any payment, admission or tuition obligation. Public study material can be used freely wherever it is labelled free. Demo or tuition communication is optional and should happen only when a student or parent wants guidance beyond free resources.</p></section><section><h2>Student privacy and safety</h2><p>Students should not send unnecessary personal information. Under-18 students should share phone numbers, addresses or school details only with the awareness of a parent or guardian. For most doubts, class, board, subject and chapter name are enough.</p></section><section><h2>Useful pages before contacting</h2><ul><li><a href="/study-material">Free Commerce Study Material</a></li><li><a href="/cbse-notes">CBSE Commerce Notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics PDFs</a></li><li><a href="/tools">Commerce Tools</a></li><li><a href="/games">Commerce Games</a></li><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Use</a></li></ul></section></article></main>`,
  },
  {
    route: "/privacy",
    files: ["privacy.html", "privacy/index.html"],
    title: "Privacy Policy — Smit Sir Commerce",
    description:
      "Privacy Policy explaining how Smit Sir Commerce handles student enquiries, learning progress, analytics, cookies, advertising and website usage data.",
    body: `<main class="page-container section-padding" data-prerendered="adsense-privacy"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Policy page</p><h1>Privacy Policy</h1><p>Last updated: 8 September 2026.</p><p>Smit Sir Commerce respects student privacy and is designed mainly as a free Commerce learning website. This Privacy Policy explains what information may be collected when students, parents or visitors use the website, open study material, contact the website, use tools, practise questions or browse public learning pages.</p><section><h2>Information students may provide</h2><p>Students or parents may voluntarily provide information through contact forms, email, demo enquiries or support messages. This can include name, email address, class, board, subject, chapter name, learning doubt, test concern or a message about website support. Visitors should not send unnecessary sensitive information.</p></section><section><h2>Learning and website usage information</h2><p>The website may use basic learning activity information to understand which resources are helpful. This may include pages opened, tools used, practice activity, clicks on notes or PDFs and general device or browser information. The purpose is to improve study material, fix broken pages and make the website easier for Commerce students.</p></section><section><h2>Analytics, cookies and advertising</h2><p>Smit Sir Commerce may use analytics tools to understand traffic, popular pages and website performance. Some public pages may also use advertising services such as Google AdSense in the future. These services may use cookies or similar technologies according to their own policies and visitor settings. Ads are not meant to block learning or appear on private, login, dashboard, contact or policy pages.</p></section><section><h2>How information is used</h2><ul><li>To reply to student or parent enquiries.</li><li>To improve notes, PDFs, revision pages, tools and games.</li><li>To understand which subjects and chapters need better resources.</li><li>To protect the website from abuse, spam or technical problems.</li><li>To meet legal, platform, analytics or advertising requirements where applicable.</li></ul></section><section><h2>Young students</h2><p>Many visitors may be school students. Students under 18 should use contact or enquiry options with the awareness of a parent or guardian. The website is educational and should not be used to share unnecessary private information.</p></section><section><h2>Data control and contact</h2><p>To ask about privacy, corrections or removal of information shared through an enquiry, contact <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a>. The request should clearly mention the email or message used so it can be checked properly.</p></section><section><h2>Related pages</h2><p><a href="/terms">Terms of Use</a> · <a href="/access-policy">Access and Learning Policy</a> · <a href="/contact">Contact Smit Sir Commerce</a> · <a href="/study-material">Study Material</a></p></section></article></main>`,
  },
  {
    route: "/terms",
    files: ["terms.html", "terms/index.html"],
    title: "Terms of Use — Smit Sir Commerce",
    description:
      "Terms of Use for Smit Sir Commerce educational resources, free Commerce notes, PDF material, tools, games, practice pages and student support.",
    body: `<main class="page-container section-padding" data-prerendered="adsense-terms"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Policy page</p><h1>Terms of Use</h1><p>Last updated: 8 September 2026.</p><p>These Terms of Use apply to Smit Sir Commerce, an educational website created to support Commerce students with free notes, PDF resources, tools, practice material, revision routes and learning games. By using the website, visitors agree to use it for genuine educational purposes.</p><section><h2>Educational purpose</h2><p>The website provides study support for subjects such as Economics, Business Studies, Accountancy, Entrepreneurship and related Commerce topics. Content is prepared for learning and revision. Unless clearly stated otherwise, the website is not an official publication of CBSE, GSEB, any school, college, university or examination authority.</p></section><section><h2>No guarantee of marks or ranking</h2><p>Study material, tests, tools and practice questions are meant to improve understanding and preparation. They do not guarantee a specific mark, result, rank, admission, job, scholarship or examination outcome. Students should also follow their school instructions, official textbooks, board circulars and teacher guidance.</p></section><section><h2>Use of free resources</h2><p>Resources marked free can be opened for personal learning, revision and classroom-support purposes. Visitors should not copy the website content and republish it as their own brand, paid product or misleading official material. Sharing a page link for learning purposes is acceptable.</p></section><section><h2>Tools, games and practice scores</h2><p>Calculators, games, quizzes, diagnostic flows and practice scores are learning aids. They may simplify a concept, show an estimated result or help students practise. They should not be treated as official marks, financial advice, legal advice or final board answers.</p></section><section><h2>User conduct</h2><ul><li>Do not misuse forms, tools or contact options for spam.</li><li>Do not upload or send harmful, abusive or illegal content.</li><li>Do not attempt to break, scrape or overload the website.</li><li>Do not impersonate Smit Sir Commerce, a board, school or another student.</li></ul></section><section><h2>Updates and contact</h2><p>Study material and website features may change as new resources are added or improved. To report errors, broken links or policy questions, contact <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a>.</p></section><section><h2>Related pages</h2><p><a href="/privacy">Privacy Policy</a> · <a href="/access-policy">Access and Learning Policy</a> · <a href="/contact">Contact</a> · <a href="/study-material">Study Material</a></p></section></article></main>`,
  },
  {
    route: "/access-policy",
    files: ["access-policy.html", "access-policy/index.html"],
    title: "Access & Learning Policy — Smit Sir Commerce",
    description:
      "Access and Learning Policy explaining free resources, Pro-labelled features, student accounts, progress tracking and support on Smit Sir Commerce.",
    body: `<main class="page-container section-padding" data-prerendered="adsense-access"><article><p style="font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#966313">Learning access</p><h1>Access & Learning Policy</h1><p>Smit Sir Commerce is built with a free-first learning approach. The main purpose of the website is to help Commerce students start learning without confusion. Public notes, PDF links, revision pages, tools and learning games should be easy to access wherever they are marked free.</p><section><h2>Free resources</h2><p>Pages labelled free can be used without purchasing premium access, subject to normal website availability. Free resources may include CBSE Commerce notes, GSEB Class 12 Economics PDF pages, formula sheets, important questions, revision plans, calculators, games and study-material navigation pages.</p></section><section><h2>Pro-labelled or restricted features</h2><p>Some features may be marked Pro, Premium, dashboard, test-series or account-only. Economics Quiz Premium costs ₹999 once, with no recurring subscription. Easy and Moderate levels remain free; Hard and Extreme unlock after payment verification for your signed-in account. Lifetime access lasts while Smit Sir Commerce operates this service. Published Premium quizzes include answer explanations. Additional detailed notes and expanded test series are still being developed. Live tuition and separate batches are not included. Send your payment reference and registered account email using the Premium popup support link; activation is manual after receipt is verified. A screenshot alone does not establish payment receipt. The website does not promise automatic paid activation unless a verified payment and access system is clearly introduced.</p></section><section><h2>Learning progress and scores</h2><p>Progress bars, mastery percentages, quiz scores, diagnostic results and weak-topic indicators are for learning direction only. They help students decide what to revise next. They are not official school marks, board marks or a promise of examination performance.</p></section><section><h2>Fair use of material</h2><p>Students may use free material for personal study and revision. Teachers or parents may share page links with students. The material should not be copied into another paid website, misleading document or fake official publication. Respecting the original website helps keep the resource available for students.</p></section><section><h2>Support for access issues</h2><p>If a free page is not opening, a PDF link is broken or a Pro-labelled feature is showing the wrong access state, contact <a href="mailto:infosmitsircommerce@gmail.com">infosmitsircommerce@gmail.com</a>. Mention the exact page URL, device and issue so it can be checked.</p></section><section><h2>Helpful starting points</h2><ul><li><a href="/study-material">Open all Study Material</a></li><li><a href="/cbse-notes">Open CBSE Commerce Notes</a></li><li><a href="/gseb-class-12-economics.html">Open GSEB Economics PDFs</a></li><li><a href="/tools">Open Commerce Tools</a></li><li><a href="/games">Open Commerce Games</a></li><li><a href="/privacy">Privacy Policy</a></li><li><a href="/terms">Terms of Use</a></li></ul></section></article></main>`,
  },
];

const privacyPage = pages.find((page) => page.route === "/privacy");
privacyPage.body = privacyPage.body
  .replace(
    "Last updated: 8 September 2026.",
    "Last updated: 11 September 2026.",
  )
  .replace(
    "<section><h2>Learning and website usage information</h2>",
    "<section><h2>Teacher Studio service requests</h2><p>Teachers, schools or coaching representatives may provide a contact name, mobile number, optional email and organisation name, curriculum, student level, subject, deadline, selected service and project brief. This information is used to prepare the quote, communicate about the project, deliver agreed work and manage follow-up. Teacher Studio contact details are not displayed publicly.</p></section><section><h2>Board diagnostic and pack reservations</h2><p>The free Board Exam Diagnostic stores answers and the latest result on the current device and may record limited non-identifying funnel events such as test start, completion, score band and selected subject. If a student voluntarily reserves a subject pack, the submitted name, mobile number, board, subject and score summary are stored privately to respond to that request. Students under 18 should submit a contact number only with a parent or guardian’s awareness.</p></section><section><h2>Learning and website usage information</h2>",
  );

const termsPage = pages.find((page) => page.route === "/terms");
termsPage.body = termsPage.body
  .replace(
    "Last updated: 8 September 2026.",
    "Last updated: 11 September 2026.",
  )
  .replace(
    "<section><h2>Updates and contact</h2>",
    "<section><h2>Teacher Studio quotes and payment</h2><p>Teacher Studio prices shown on the website are starting prices. Final deliverables, price, delivery date, file formats and revision allowance must be confirmed in writing before payment. Submitting a request does not create a purchase obligation. Payment should be made only to the confirmed official recipient. Keep the successful UTR or transaction reference; a screenshot alone does not establish receipt.</p></section><section><h2>Original work and client materials</h2><p>Teacher Studio work is created from the agreed syllabus and instructions. Clients must have permission to share any logo, reference file or source material they provide. Smit Sir Commerce does not agree to copy or rebrand third-party copyrighted publications.</p></section><section><h2>Board Booster reservation</h2><p>The ₹199 Board Booster amount is a launch-price reservation for the subject selected on the diagnostic result page. The form does not charge the student. Exact inclusions, delivery method, final amount and official payment recipient must be confirmed before payment. The free diagnostic and public revision resources remain free whether or not a pack is purchased.</p></section><section><h2>Updates and contact</h2>",
  );

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function removeRouteMeta(html) {
  return html
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/gi, "")
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, "")
    .replace(/<meta[^>]+property=["']og:description["'][^>]*>/gi, "")
    .replace(/<meta[^>]+name=["']twitter:description["'][^>]*>/gi, "");
}

function replaceRoot(html, body) {
  const nextRoot = `<div id="root">${body}</div>`;
  if (/<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>)/.test(html)) {
    return html.replace(
      /<div id="root">[\s\S]*?<\/div>\s*(?=<\/body>)/,
      nextRoot,
    );
  }
  return html.replace('<div id="root"></div>', nextRoot);
}

function buildSchema(page) {
  const url = `${BASE}${page.route}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: page.title,
        description: page.description,
        inLanguage: "en-IN",
        isPartOf: { "@id": `${BASE}/#website` },
        publisher: { "@id": `${BASE}/#organization` },
      },
      {
        "@type": "EducationalOrganization",
        "@id": `${BASE}/#organization`,
        name: SITE,
        url: BASE,
        email: "infosmitsircommerce@gmail.com",
        areaServed: ["India", "Mehsana, Gujarat"],
        knowsAbout: [
          "Commerce education",
          "CBSE Commerce",
          "GSEB Economics",
          "Class 11 Commerce",
          "Class 12 Commerce",
        ],
      },
    ],
  };
}

for (const page of pages) {
  const canonical = `${BASE}${page.route}`;
  const fullTitle = `${page.title} | ${SITE}`;
  const meta = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:description" content="${esc(page.description)}"><meta name="twitter:description" content="${esc(page.description)}"><script type="application/ld+json">${JSON.stringify(buildSchema(page))}</script>`;

  for (const file of page.files) {
    const filePath = join(distRoot, file);
    const original = await readFile(filePath, "utf8");
    const cleaned = removeRouteMeta(original)
      .replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(fullTitle)}</title>`)
      .replace("</head>", `${meta}\n</head>`);
    const finished = replaceRoot(cleaned, page.body);
    await writeFile(filePath, finished, "utf8");
  }
}

console.log(
  `Finalized ${pages.length} AdSense policy pages with correct visible bodies and canonicals.`,
);
