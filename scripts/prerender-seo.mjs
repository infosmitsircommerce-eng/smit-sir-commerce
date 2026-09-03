import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { seoHubs, seoMaterials, getChapterMcqs, getHubMaterials, getImportantQuestions, getMaterialFaqs, getHubStructuredData, getMaterialStructuredData } from '../src/data/seoMaterials.js';
import { examTests } from '../src/data/examBank.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);
const cbseNotesPath = '/cbse-notes';
const cbseNotesTitle = 'Free CBSE Commerce Notes Class 11 & 12 PDF';
const cbseNotesDescription = 'Free CBSE Commerce notes for Class 11 and 12 with chapter-wise PDF notes for Economics, Business Studies, Microeconomics and Macroeconomics. View online or download free.';
const cbseNotesFaqs = [
  {
    question: 'Are these CBSE Commerce notes free?',
    answer: 'Yes. The notes available through this library can be viewed online or downloaded free. No registration is required to open the public study material.',
  },
  {
    question: 'Which Class 11 Commerce notes are available?',
    answer: 'The Class 11 collection currently includes chapter-wise Microeconomics notes. Each available chapter has its own page with a PDF, key topics and exam-focused revision guidance.',
  },
  {
    question: 'Which Class 12 Commerce notes are available?',
    answer: 'The Class 12 collection includes Business Studies notes and Macroeconomics notes. The library is organised by subject and chapter so students can open the exact topic they need.',
  },
  {
    question: 'Can I download the CBSE notes PDF?',
    answer: 'Yes. Where a chapter PDF is available, students can view it online and use the download option from the chapter page.',
  },
  {
    question: 'How should I use these notes for exam preparation?',
    answer: 'Read one chapter, revise its key concepts and definitions, then practise questions from the same chapter. After that, use sample-paper and exam-preparation resources to test recall and application.',
  },
];

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}

function renderHub(hub) {
  const materials = getHubMaterials(hub.id);
  const relatedHubs = seoHubs.filter((item) => item.id !== hub.id);
  return `<main class="page-container section-padding" data-prerendered="seo-hub"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / ${escapeHtml(hub.label)}</nav><article><h1>${escapeHtml(hub.seoTitle)}</h1><p>${escapeHtml(hub.intro)}</p><h2>Free chapter-wise PDF notes</h2><ol>${materials.map((item) => `<li><a href="${escapeHtml(item.seo_path)}">Chapter ${item.chapterNumber}: ${escapeHtml(item.chapter)} notes PDF</a> — ${item.pages} pages</li>`).join('')}</ol><p>All published resources are free to view online and download. Prepared by Smit Sir for clear CBSE Commerce revision.</p><h2>Explore other CBSE Commerce subjects</h2><ul>${relatedHubs.map((item) => `<li><a href="${escapeHtml(item.path)}">Free ${escapeHtml(item.label)} notes PDF</a></li>`).join('')}</ul><p><a href="/cbse-notes">Browse all free CBSE Commerce notes</a>.</p></article></main>`;
}

function renderCbseNotes() {
  const totalChapters = seoMaterials.length;
  const popularNotes = seoHubs.flatMap((hub) => getHubMaterials(hub.id).slice(0, 3));
  const class11Hub = seoHubs.find((hub) => hub.classLevel === 11);
  const class12Hubs = seoHubs.filter((hub) => hub.classLevel === 12);

  return `<main class="page-container section-padding" data-prerendered="cbse-notes"><nav aria-label="Breadcrumb"><a href="/">Home</a> / Free CBSE Commerce Notes</nav><article><h1>${escapeHtml(cbseNotesTitle)}</h1><p>Find free CBSE Commerce notes for Class 11 and Class 12 in one organised library. Open chapter-wise PDF notes for Economics and Business Studies, revise the important concepts, and move directly into practice for the same topic.</p><p>Instead of searching for scattered PDFs, students can choose a class, subject and chapter, study the notes online or download the PDF, then continue with practice and exam-preparation resources on the same website.</p><p><strong>${totalChapters} chapter-wise PDFs are currently available.</strong> Public notes can be opened without registration.</p><h2>CBSE Commerce notes by class and subject</h2><ul>${seoHubs.map((hub) => `<li><a href="${escapeHtml(hub.path)}">Free ${escapeHtml(hub.label)} notes PDF</a> — ${getHubMaterials(hub.id).length} ${getHubMaterials(hub.id).length === 1 ? 'chapter' : 'chapters'} currently available</li>`).join('')}</ul><h2>Free Class 11 Commerce notes</h2>${class11Hub ? `<p>Class 11 students can use the Microeconomics collection to build their foundation chapter by chapter. The available material covers core concepts such as scarcity and choice, demand, production, cost, revenue and market-related topics as the collection develops.</p><p><a href="${escapeHtml(class11Hub.path)}">Open Class 11 Microeconomics notes PDF</a>.</p>` : ''}<h2>Free Class 12 Commerce notes</h2><p>Class 12 students can revise Business Studies chapter by chapter and use the available Macroeconomics notes for concept clarity. Each subject hub keeps the PDFs connected to the exact chapter they belong to.</p><ul>${class12Hubs.map((hub) => `<li><a href="${escapeHtml(hub.path)}">${escapeHtml(hub.label)} notes PDF</a></li>`).join('')}</ul><h2>Popular free CBSE Commerce notes PDFs</h2><ul>${popularNotes.map((item) => `<li><a href="${escapeHtml(item.seo_path)}">CBSE Class ${item.class_level} Chapter ${item.chapterNumber}: ${escapeHtml(item.chapter)} notes PDF</a></li>`).join('')}</ul><h2>How to use these Commerce notes effectively</h2><ol><li>Read the chapter PDF and understand each concept before trying to memorise it.</li><li>Mark definitions, formulas, diagrams, differences and important headings for revision.</li><li>Practise questions from the same chapter while the concepts are fresh.</li><li>Use sample-paper and exam-preparation resources to test recall and application.</li></ol><p><a href="/cbse-practice">Open the CBSE Commerce practice library</a> after revision, or continue to the <a href="/cbse-pyq">exam-preparation hub</a>.</p><h2>CBSE Commerce notes FAQ</h2>${cbseNotesFaqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('')}</article></main>`;
}

function getCbseNotesStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        '@id': `${BASE}${cbseNotesPath}#collection`,
        name: cbseNotesTitle,
        description: cbseNotesDescription,
        url: `${BASE}${cbseNotesPath}`,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        about: [
          'CBSE Class 11 Commerce notes',
          'CBSE Class 12 Commerce notes',
          'Economics notes',
          'Business Studies notes',
          'Microeconomics notes',
          'Macroeconomics notes',
        ],
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: seoHubs.length,
          itemListElement: seoHubs.map((hub, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: hub.label,
            url: `${BASE}${hub.path}`,
          })),
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: cbseNotesFaqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };
}

function renderMaterial(material) {
  const hub = seoHubs.find((item) => item.id === material.hubId);
  const siblings = getHubMaterials(material.hubId);
  const currentIndex = siblings.findIndex((item) => item.id === material.id);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : null;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : null;
  const relatedHubs = seoHubs.filter((item) => item.id !== material.hubId);
  const importantQuestions = getImportantQuestions(material);
  const chapterMcqs = getChapterMcqs(material);
  const faqs = getMaterialFaqs(material);
  return `<main class="page-container section-padding" data-prerendered="seo-chapter"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/study-material">Study Material</a> / <a href="${escapeHtml(hub.path)}">${escapeHtml(hub.label)}</a> / Chapter ${material.chapterNumber}</nav><article><h1>${escapeHtml(material.chapter)} Notes PDF — CBSE Class ${material.class_level}</h1><p>${escapeHtml(material.summary)}</p><p><strong>Board:</strong> CBSE · <strong>Class:</strong> ${material.class_level} · <strong>Updated:</strong> ${escapeHtml(material.updated)} · <strong>Access:</strong> Free, no registration</p><h2>Important topics covered</h2><ul>${material.keyTopics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul><h2>Exam-focused revision checklist</h2><ol>${material.examFocus.map((point) => `<li>${escapeHtml(point)}</li>`).join('')}</ol><h2>Important questions with answer guidance</h2>${importantQuestions.map((item) => `<h3>${escapeHtml(item.question)}</h3><p>${escapeHtml(item.answer)}</p>`).join('')}<h2>Chapter MCQs with answers</h2>${chapterMcqs.map((mcq, index) => `<section><h3>MCQ ${index + 1}: ${escapeHtml(mcq.question)}</h3><ol type="A">${mcq.options.map((option) => `<li>${escapeHtml(option)}</li>`).join('')}</ol><p><strong>Answer: ${String.fromCharCode(65 + mcq.answer)}.</strong> ${escapeHtml(mcq.explanation)}</p></section>`).join('')}<p><a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} PDF</a>.</p><h2>Why you can trust this study resource</h2><p>This chapter-specific resource is organised by Smit Sir for Class ${material.class_level} Commerce students. It is free to view and download and should be used alongside NCERT questions and the latest official CBSE sample papers.</p><h2>Frequently asked questions</h2>${faqs.map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('')}<h2>Continue learning</h2><ul>${previous ? `<li><a href="${escapeHtml(previous.seo_path)}">Previous: Chapter ${previous.chapterNumber} ${escapeHtml(previous.chapter)} notes</a></li>` : ''}${next ? `<li><a href="${escapeHtml(next.seo_path)}">Next: Chapter ${next.chapterNumber} ${escapeHtml(next.chapter)} notes</a></li>` : ''}<li><a href="${escapeHtml(hub.path)}">All ${escapeHtml(hub.label)} notes</a></li><li><a href="/cbse-notes">All free CBSE Commerce notes</a></li></ul><h2>Other free CBSE Commerce subjects</h2><ul>${relatedHubs.map((item) => `<li><a href="${escapeHtml(item.path)}">Free ${escapeHtml(item.label)} notes PDF</a></li>`).join('')}</ul></article></main>`;
}

function examFaq(test) {
  return [
    { question: `Is the ${test.name} timed?`, answer: `Yes. Exam Mode gives this test a ${test.minutes}-minute countdown with automatic submission when time ends.` },
    { question: 'Can I mark questions for review?', answer: 'Yes. You can mark questions, move through a question palette and review unanswered questions before submitting.' },
    { question: 'What happens after submission?', answer: 'You receive your score, topic-wise accuracy, answer explanations, time-per-question information and weak-topic guidance.' },
  ];
}

function renderExam(test) {
  const topics = [...new Set(test.questions.map((question) => question.topic))];
  return `<main class="page-container section-padding" data-prerendered="seo-exam"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/test-series">Test Series</a> / ${escapeHtml(test.name)}</nav><article><h1>${escapeHtml(test.name)} — CBSE Class ${test.classLevel} ${escapeHtml(test.subject)}</h1><p>Take a ${test.minutes}-minute ${escapeHtml(test.difficulty.toLowerCase())} practice exam covering ${escapeHtml(test.chapter)}. Advanced Exam Mode includes a real countdown, question palette, mark-for-review, automatic submission, refresh recovery and topic-wise performance analysis.</p><p><strong>Questions:</strong> ${test.questions.length} · <strong>Time:</strong> ${test.minutes} minutes · <strong>Access:</strong> ${test.isFree ? 'Free' : 'Pro-labelled'}</p><h2>Topics represented</h2><ul>${topics.map((topic) => `<li>${escapeHtml(topic)}</li>`).join('')}</ul><h2>What students can practise</h2><ul><li>Timed question solving</li><li>Question navigation and mark-for-review</li><li>Weak-topic analysis after submission</li><li>Answer explanations and retry of wrong questions</li><li>Automatic Mistake Book capture for incorrect answers</li></ul><p><a href="/exam-mode?test=${escapeHtml(test.slug)}">Start ${escapeHtml(test.name)} in Advanced Exam Mode</a>.</p><h2>Frequently asked questions</h2>${examFaq(test).map((faq) => `<h3>${escapeHtml(faq.question)}</h3><p>${escapeHtml(faq.answer)}</p>`).join('')}<p>This is a learning practice test and is not an official CBSE examination.</p></article></main>`;
}

function getExamStructuredData(test) {
  return [
    { '@context': 'https://schema.org', '@type': 'LearningResource', name: test.name, description: `CBSE Class ${test.classLevel} ${test.subject} timed practice test covering ${test.chapter}.`, educationalLevel: `Class ${test.classLevel}`, learningResourceType: 'Practice test', teaches: test.chapter, isAccessibleForFree: test.isFree, provider: { '@type': 'Organization', name: SITE, url: BASE } },
    { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: examFaq(test).map((item) => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) },
  ];
}

function buildHtml({ path, title, description, body, schema, type = 'website', modifiedTime = null }) {
  const fullTitle = `${title} | ${SITE}`;
  const url = `${BASE}${path}`;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const image = `${BASE}/og-image.jpg`;
  const tags = `\n    <meta name="description" content="${escapeHtml(description)}" />\n    <meta name="robots" content="${robots}" />\n    <meta name="googlebot" content="${robots}" />\n    <meta name="bingbot" content="${robots}" />\n    <link rel="canonical" href="${escapeHtml(url)}" />\n    <meta property="og:type" content="${type}" />\n    <meta property="og:site_name" content="${SITE}" />\n    <meta property="og:locale" content="en_IN" />\n    <meta property="og:title" content="${escapeHtml(fullTitle)}" />\n    <meta property="og:description" content="${escapeHtml(description)}" />\n    <meta property="og:url" content="${escapeHtml(url)}" />\n    <meta property="og:image" content="${image}" />\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />\n    <meta property="og:image:alt" content="${escapeHtml(fullTitle)}" />\n    ${type === 'article' && modifiedTime ? `<meta property="article:published_time" content="${escapeHtml(modifiedTime)}" /><meta property="article:modified_time" content="${escapeHtml(modifiedTime)}" />` : ''}\n    <meta name="twitter:card" content="summary_large_image" />\n    <meta name="twitter:title" content="${escapeHtml(fullTitle)}" />\n    <meta name="twitter:description" content="${escapeHtml(description)}" />\n    <meta name="twitter:image" content="${image}" />\n    <meta name="twitter:image:alt" content="${escapeHtml(fullTitle)}" />\n    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>`;
  return source.replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(fullTitle)}</title>`).replace('</head>', `${tags}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

async function writeRoute(path, html) {
  const relative = path.replace(/^\//, '');
  const cleanFile = join(distRoot.pathname, `${relative}.html`);
  const directoryFile = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(cleanFile), { recursive: true });
  await mkdir(dirname(directoryFile), { recursive: true });
  await writeFile(cleanFile, html, 'utf8');
  await writeFile(directoryFile, html, 'utf8');
}

await writeRoute(cbseNotesPath, buildHtml({ path: cbseNotesPath, title: cbseNotesTitle, description: cbseNotesDescription, body: renderCbseNotes(), schema: getCbseNotesStructuredData() }));
for (const hub of seoHubs) await writeRoute(hub.path, buildHtml({ path: hub.path, title: hub.seoTitle, description: hub.description, body: renderHub(hub), schema: getHubStructuredData(hub) }));
for (const material of seoMaterials) await writeRoute(material.seo_path, buildHtml({ path: material.seo_path, title: material.seoTitle, description: material.description, body: renderMaterial(material), schema: getMaterialStructuredData(material), type: 'article', modifiedTime: material.updated }));
for (const test of examTests) {
  const path = `/tests/${test.slug}`;
  await writeRoute(path, buildHtml({ path, title: `${test.name} — CBSE Class ${test.classLevel} ${test.subject}`, description: `Take a ${test.minutes}-minute CBSE Class ${test.classLevel} ${test.subject} practice exam on ${test.chapter} with answers, explanations and weak-topic analysis.`, body: renderExam(test), schema: getExamStructuredData(test) }));
}

console.log(`Pre-rendered ${1 + seoHubs.length + seoMaterials.length + examTests.length} SEO landing pages.`);
