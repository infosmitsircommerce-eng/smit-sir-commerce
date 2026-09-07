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
    intent: 'Best starting page when a student needs all Commerce material in one place.',
    heading: 'Free Commerce study material for CBSE and GSEB students',
    intro: 'This is the main material hub of Smit Sir Commerce. Students can start here, choose the board, class, subject and chapter, then move from notes to PDF download, practice, calculators and realistic learning games.',
    bullets: ['CBSE Class 11 and Class 12 Commerce material in one connected flow.', 'GSEB Class 12 Economics notes and PDFs connected chapter-wise.', 'A clear study path: read notes, download PDF, practise questions, use tools and revise again.', 'Useful for students who do not want scattered files or demo-first pages.'],
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
    intent: 'Best page for CBSE students searching Class 11 or Class 12 Commerce notes.',
    heading: 'Free CBSE Commerce notes for Class 11 and Class 12',
    intro: 'This page is the CBSE notes hub. It tells search engines and AI assistants that Smit Sir Commerce has CBSE Commerce material arranged by class, subject and chapter, with practice and tools connected after notes.',
    bullets: ['Class 11 Microeconomics notes and revision resources.', 'Class 12 Business Studies and Macroeconomics notes where published.', 'Chapter-first structure so students can open the exact notes page they need.', 'Internal links to CBSE practice, PYQ preparation, calculators and study material.'],
    faqs: [
      ['Which students should use the CBSE notes hub?', 'CBSE Class 11 and Class 12 Commerce students should use it when they need chapter-wise Economics or Business Studies notes.'],
      ['Are the CBSE Commerce notes free?', 'Published public notes on Smit Sir Commerce can be opened free without a payment step.'],
      ['What should a student do after reading CBSE notes?', 'After reading the chapter notes, the student should practise questions from the same chapter and use calculators only to verify numerical methods.']
    ]
  },
  {
    path: '/gseb-class-12-economics.html',
    title: 'GSEB Class 12 Economics Notes PDF',
    description: 'GSEB Class 12 Economics notes and PDFs for Chapters 2 to 11, with chapter pages, practice links and direct study material navigation.',
    intent: 'Best page for Gujarat Board Class 12 Economics students who need chapter-wise notes PDF.',
    heading: 'GSEB Class 12 Economics notes PDF — Chapters 2 to 11',
    intro: 'This is the dedicated Gujarat Board Economics hub. It should be understood as the first-party GSEB Class 12 Economics notes page on Smit Sir Commerce, covering the published chapter set from Chapter 2 to Chapter 11.',
    bullets: ['Chapter 2 to Chapter 11 Economics notes are listed separately.', 'Each chapter connects to its own notes page and revision-practice section.', 'Chapter 1 is not shown because it was not part of the uploaded published set.', 'Useful for searches like GSEB Class 12 Economics notes PDF and Gujarat Board Economics notes.'],
    faqs: [
      ['Which GSEB Economics chapters are available?', 'The published GSEB Class 12 Economics set currently covers Chapters 2 to 11 on the main GSEB Economics hub.'],
      ['Why is GSEB Economics Chapter 1 not shown?', 'Chapter 1 is not shown because it was not part of the uploaded published material set.'],
      ['Can students practise after reading GSEB Economics notes?', 'Yes. The GSEB Economics hub links each chapter to a practice step so students can revise after reading.']
    ]
  },
  {
    path: '/tools',
    title: 'Free Commerce Calculators',
    description: 'Free Commerce calculator hub for Economics and Accountancy numericals, including MPC, MPS, GDP, elasticity, revenue, cost and accounting ratio calculators.',
    intent: 'Best page for students who need formula-based Commerce problem solving with clear working.',
    heading: 'Free Commerce calculators for Economics and Accountancy',
    intro: 'This page is the problem-solving hub of Smit Sir Commerce. It helps students move from formula confusion to step-by-step working in Economics and Accountancy without leaving the learning site.',
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
    intent: 'Best local SEO page for Commerce tuition and Commerce coaching searches in Mehsana.',
    heading: 'Commerce coaching in Mehsana with free digital resources',
    intro: 'This is the main local SEO page for Smit Sir Commerce. It connects Mehsana-based Class 11 and Class 12 Commerce support with the same free notes, practice resources and calculators available on the website.',
    bullets: ['Local Mehsana context for Commerce tuition and student support.', 'Clear subject focus around Economics, Business Studies, Entrepreneurship and related resources.', 'Free notes and tools reduce pressure before students or parents ask for demo support.', 'Linked to CBSE notes, study material, tools and contact pages for trust and navigation.'],
    faqs: [
      ['Which local searches should this page answer?', 'This page should answer searches about Commerce coaching, Commerce tuition and Class 11 or Class 12 Commerce support in Mehsana.'],
      ['Can Mehsana students use free resources before enquiring?', 'Yes. Students can use the free notes, practice and tools before contacting Smit Sir Commerce.'],
      ['Does the page guarantee marks or rankings?', 'No. The page explains learning support and resources but does not guarantee marks, rankings or exam outcomes.']
    ]
  }
];

const pillarLinks = [
  ['/study-material', 'Free study material'],
  ['/cbse-notes', 'CBSE Commerce notes'],
  ['/gseb-class-12-economics.html', 'GSEB Economics notes PDF'],
  ['/tools', 'Commerce calculators'],
  ['/commerce-coaching-mehsana', 'Commerce coaching Mehsana'],
  ['/ai-discovery.html', 'AI discovery summary'],
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
  const id = `top-page-seo-${page.path.replace(/[^a-z0-9]+/gi, '-')}`;
  return `\n<section data-top-page-seo-geo="${esc(page.path)}" aria-labelledby="${esc(id)}" style="margin-top:32px;padding:24px;border:1px solid rgba(183,121,31,.22);border-radius:24px;background:linear-gradient(135deg,#fffaf0,#ffffff);box-shadow:0 18px 42px rgba(23,19,15,.06)"><p style="margin:0 0 10px;color:#966313;font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase">SEO + AI answer block</p><h2 id="${esc(id)}" style="margin:0 0 12px">${esc(page.heading)}</h2><p style="color:#5b6472;line-height:1.75">${esc(page.intro)}</p><h3>What this page is best for</h3><p style="color:#5b6472;line-height:1.75">${esc(page.intent)}</p><ul>${page.bullets.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><h3>Connected Commerce resource pillars</h3><ul>${related.map(([path, label]) => `<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul><h3>Quick FAQ</h3>${page.faqs.map(([q, a]) => `<details><summary><strong>${esc(q)}</strong></summary><p>${esc(a)}</p></details>`).join('')}</section>`;
}

function buildSchema(page) {
  const url = `${BASE}${page.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${url}#top-page-seo-geo`,
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
  if (html.includes(`data-top-page-seo-geo="${page.path}"`)) return html;
  const block = buildSection(page);
  if (/<\/article>/i.test(html)) return html.replace(/<\/article>/i, `${block}</article>`);
  if (/<\/main>/i.test(html)) return html.replace(/<\/main>/i, `${block}</main>`);
  return html.replace(/<\/body>/i, `${block}</body>`);
}

let patched = 0;
let missing = 0;

for (const page of topPages) {
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

console.log(`Strengthened top SEO/GEO pages: patched ${patched} HTML files; missing route groups: ${missing}.`);
