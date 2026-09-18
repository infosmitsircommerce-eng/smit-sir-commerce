import { readFile, stat, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const distRoot = join(root, 'dist');
const BASE = 'https://www.smitsircommerce.in';

const topPages = [
  {
    path: '/study-material',
    title: 'Free Commerce Study Material',
    description: 'Main hub for CBSE and GSEB Commerce study material, chapter-wise notes, PDFs, practice resources, calculators and games for Class 11 and Class 12 students.',
    intent: 'A strong starting point when you need all your Commerce material in one place.',
    heading: 'Free Commerce study material for CBSE and GSEB students',
    intro: 'Start here, choose your board, class, subject and chapter, then move naturally from notes to PDF download, practice, calculators and revision tools.',
    bullets: ['CBSE Class 11 and Class 12 Commerce material in one connected flow.', 'GSEB Class 12 Economics notes and PDFs connected chapter-wise.', 'A clear study path: read notes, download PDF, practise questions, use tools and revise again.', 'Useful for students who do not want scattered files or confusing navigation.'],
    faqs: [
      ['What is the best page to start on Smit Sir Commerce?', 'The best starting page is the free study material hub because it connects CBSE notes, GSEB Economics PDFs, practice, tools and games from one place.'],
      ['Can students download Commerce notes from the study material page?', 'Yes. Available chapter resources link to online notes pages and direct PDF downloads where the PDF has been published.'],
      ['Does the page separate CBSE and GSEB material?', 'Yes. The page is designed to help students choose the correct board before selecting class, subject and chapter.']
    ]
  },
  {
    path: '/cbse-notes',
    title: 'Free CBSE Commerce Notes',
    description: 'CBSE Commerce notes hub for Class 11 and Class 12 students, including Economics, Business Studies, chapter notes, PDFs, practice and revision support.',
    intent: 'For CBSE Class 11 and Class 12 Commerce students who want chapter-wise notes and a clear next step after reading.',
    heading: 'Free CBSE Commerce notes for Class 11 and Class 12',
    intro: 'Choose your class and subject, open the exact chapter you need, revise the notes and then continue into practice or numerical tools from the same learning path.',
    bullets: ['Class 11 Microeconomics notes and revision resources.', 'Class 12 Business Studies and Macroeconomics notes where published.', 'Chapter-first structure so students can open the exact notes page they need.', 'Direct paths from notes into CBSE practice, PYQ preparation, calculators and study material.'],
    faqs: [
      ['Which students should use the CBSE notes hub?', 'CBSE Class 11 and Class 12 Commerce students should use it when they need chapter-wise Economics or Business Studies notes.'],
      ['Are the CBSE Commerce notes free?', 'Published public notes on Smit Sir Commerce can be opened free without a payment step.'],
      ['What should a student do after reading CBSE notes?', 'After reading the chapter notes, the student should practise questions from the same chapter and use calculators only to verify numerical methods.']
    ]
  },
  {
    path: '/gseb-class-12-economics',
    title: 'GSEB Class 12 Economics Notes PDF',
    description: 'Free GSEB Class 12 Economics complete notes for eight chapters, Premium revision PDFs for Chapters 2–11 and linked free practice.',
    intent: 'For Gujarat Board Class 12 Economics students who need chapter-wise notes, PDFs and connected revision practice.',
    heading: 'GSEB Class 12 Economics free and Premium notes PDF',
    intro: 'Use this Gujarat Board Economics hub to open the available chapter notes, download free complete PDFs and move into revision practice without hunting through unrelated pages.',
    bullets: ['Eight free complete notes PDFs are listed chapter by chapter.', 'Each chapter connects to its own notes page and revision-practice section.', 'New free PDFs for Chapters 1, 7 and 8 will be added later.', 'Useful when you want Gujarat Board Economics notes arranged in chapter order.'],
    faqs: [
      ['Which GSEB Economics chapters are available?', 'Free complete notes cover Chapters 2, 3, 4, 5, 6, 9, 10 and 11. Premium contains the earlier revision PDFs for Chapters 2–11.'],
      ['Why is GSEB Economics Chapter 1 not shown?', 'Chapter 1 is not shown because it was not part of the uploaded published material set.'],
      ['Can students practise after reading GSEB Economics notes?', 'Yes. The GSEB Economics hub links each chapter to a practice step so students can revise after reading.']
    ]
  },
  {
    path: '/tools',
    title: 'Free Commerce Calculators',
    description: 'Free Commerce calculator hub for Economics and Accountancy numericals, including MPC, MPS, GDP, elasticity, revenue, cost and accounting ratio calculators.',
    intent: 'For students who need formula-based Commerce problem solving with clear working and a way to check their method.',
    heading: 'Free Commerce calculators for Economics and Accountancy',
    intro: 'Use these tools after attempting a numerical yourself to check formulas, working and answers in Economics and Accountancy without leaving the learning site.',
    bullets: ['Economics calculators for national income, income determination, elasticity, revenue and cost topics.', 'Accountancy calculators for ratios, common-size statements and related numerical support.', 'Formula-first structure suitable for Class 11 and Class 12 Commerce revision.', 'Internal links connect tools back to notes, practice and chapter learning.'],
    faqs: [
      ['What is the tools page used for?', 'The tools page helps Commerce students solve Economics and Accountancy numericals with formulas and step-by-step working.'],
      ['Are the Commerce calculators free?', 'The public calculators listed on the tools hub are available as free learning tools.'],
      ['Should students use calculators before learning formulas?', 'Students should first try the numerical themselves, then use the calculator to check the formula, working and answer.']
    ]
  },
  {
    path: '/commerce-coaching-mehsana',
    title: 'Commerce Coaching in Mehsana',
    description: 'Local Commerce coaching and learning support page for Mehsana students, connecting Class 11 and 12 teaching with free notes, practice, tools and student support.',
    intent: 'For students and parents in Mehsana looking for Class 11 or Class 12 Commerce learning support.',
    heading: 'Commerce coaching in Mehsana with free digital resources',
    intro: 'Mehsana students can explore the free notes, practice resources and calculators first, then use the coaching page to understand available Commerce learning support and how to enquire.',
    bullets: ['Local Mehsana context for Commerce tuition and student support.', 'Clear subject focus around Economics, Business Studies, Entrepreneurship and related resources.', 'Free notes and tools let students explore the teaching resources before enquiring.', 'Connected to CBSE notes, study material, tools and contact pages for simple navigation.'],
    faqs: [
      ['Who is this page for?', 'This page is for Mehsana students and parents looking for Commerce coaching, Commerce tuition or Class 11 and Class 12 Commerce support.'],
      ['Can Mehsana students use free resources before enquiring?', 'Yes. Students can use the free notes, practice and tools before contacting Smit Sir Commerce.'],
      ['Does the page guarantee marks or rankings?', 'No. The page explains learning support and resources but does not guarantee marks, rankings or exam outcomes.']
    ]
  }
];

const pillarLinks = [
  ['/study-material', 'Free study material'],
  ['/cbse-notes', 'CBSE Commerce notes'],
  ['/gseb-class-12-economics', 'GSEB Economics notes PDF'],
  ['/tools', 'Commerce calculators'],
  ['/commerce-coaching-mehsana', 'Commerce coaching Mehsana'],
  ['/ai-discovery.html', 'Website resource summary'],
];

function esc(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

function candidateFiles(path) {
  const clean = path.replace(/^\//, '');
  const cleanWithoutHtml = clean.replace(/\.html$/i, '');
  return [...new Set([
    join(distRoot, clean.endsWith('.html') ? clean : `${clean}.html`),
    join(distRoot, cleanWithoutHtml, 'index.html'),
  ])];
}

function buildSection(page) {
  const related = pillarLinks.filter(([path]) => path !== page.path);
  const id = `student-guide-${page.path.replace(/[^a-z0-9]+/gi, '-')}`;
  return `\n<section data-student-guide="${esc(page.path)}" aria-labelledby="${esc(id)}" style="margin-top:32px;padding:24px;border:1px solid rgba(183,121,31,.22);border-radius:24px;background:linear-gradient(135deg,#fffaf0,#ffffff);box-shadow:0 18px 42px rgba(23,19,15,.06)"><p style="margin:0 0 10px;color:#966313;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase">Student study guide</p><h2 id="${esc(id)}" style="margin:0 0 12px">${esc(page.heading)}</h2><p style="color:#5b6472;line-height:1.75">${esc(page.intro)}</p><h3>Who this page helps</h3><p style="color:#5b6472;line-height:1.75">${esc(page.intent)}</p><ul>${page.bullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h3>Continue learning</h3><ul>${related.map(([path, label]) => `<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul><h3>Quick questions</h3>${page.faqs.map(([q, a]) => `<details><summary><strong>${esc(q)}</strong></summary><p>${esc(a)}</p></details>`).join('')}</section>`;
}

function buildSchema(page) {
  const url = `${BASE}${page.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#study-guide`,
        url,
        name: page.title,
        description: page.description,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
        publisher: { '@id': `${BASE}/#organization` },
        mainEntity: {
          '@type': 'LearningResource',
          name: page.heading,
          description: page.intro,
          provider: { '@id': `${BASE}/#organization` },
          educationalLevel: ['Class 11', 'Class 12'],
          learningResourceType: ['Notes', 'PDF', 'Practice material', 'Calculator', 'Study guide'],
          isAccessibleForFree: true,
        },
        mentions: pillarLinks.map(([path, label]) => ({ '@type': 'WebPage', name: label, url: `${BASE}${path}` })),
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: page.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };
}

function patchHead(html, page) {
  let output = html;
  const aiLinks = '<link rel="alternate" type="text/plain" href="https://www.smitsircommerce.in/llms.txt" title="LLMS text summary for Smit Sir Commerce"><link rel="alternate" type="application/json" href="https://www.smitsircommerce.in/ai-summary.json" title="AI summary JSON for Smit Sir Commerce">';
  if (!output.includes('href="https://www.smitsircommerce.in/llms.txt"') && !output.includes('href="/llms.txt"')) output = output.replace(/<\/head>/i, `${aiLinks}\n</head>`);
  const marker = `data-top-page-schema="${page.path}"`;
  if (!output.includes(marker)) output = output.replace(/<\/head>/i, `<script type="application/ld+json" ${marker}>${JSON.stringify(buildSchema(page)).replaceAll('<', '\\u003c')}</script>\n</head>`);
  return output;
}

function patchBody(html, page) {
  if (html.includes(`data-student-guide="${page.path}"`)) return html;
  const block = buildSection(page);
  if (/<\/article>/i.test(html)) return html.replace(/<\/article>/i, `${block}</article>`);
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, `${block}</main>`);
  return html.replace(/<\/body>/i, `${block}</body>`);
}

let patched = 0;
let missing = 0;

for (const page of topPages) {
  // Local service details already come from prerender-local-seo; avoid a second content block and FAQ graph.
  if (page.path === '/commerce-coaching-mehsana') continue;
  let found = false;
  for (const file of candidateFiles(page.path)) {
    if (!(await isFile(file))) continue;
    found = true;
    const before = await readFile(file, 'utf8');
    const after = patchBody(patchHead(before, page), page);
    if (after !== before) {
      await writeFile(file, after, 'utf8');
      patched += 1;
    }
  }
  if (!found) missing += 1;
}

console.log(`Strengthened student-facing resource pages: patched ${patched} HTML files; missing route groups: ${missing}.`);
