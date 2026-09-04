import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { examTests } from '../src/data/examBank.js';
import { authorityGuides } from '../src/data/authorityGuides.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function coreNav() {
  return '<nav aria-label="Explore Smit Sir Commerce"><h2>Explore more learning resources</h2><ul>' +
    '<li><a href="/courses">Commerce courses</a></li>' +
    '<li><a href="/study-material">Free study material</a></li>' +
    '<li><a href="/quizzes">Commerce quizzes</a></li>' +
    '<li><a href="/test-series">Commerce test series</a></li>' +
    '<li><a href="/study-tools">Study tools</a></li>' +
    '<li><a href="/faq">Frequently asked questions</a></li>' +
    '</ul></nav>';
}

function schemaFor(page) {
  const graph = [
    {
      '@type': page.collection ? 'CollectionPage' : 'WebPage',
      '@id': BASE + page.path + '#webpage',
      url: BASE + page.path,
      name: page.title,
      description: page.description,
      inLanguage: 'en-IN',
      isPartOf: { '@id': BASE + '/#website' },
      publisher: { '@id': BASE + '/#organization' }
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
        { '@type': 'ListItem', position: 2, name: page.title, item: BASE + page.path }
      ]
    }
  ];
  if (page.faqs?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map(([q, a]) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: a }
      }))
    });
  }
  return { '@context': 'https://schema.org', '@graph': graph };
}

function buildHtml(page) {
  const fullTitle = page.title + ' | ' + SITE;
  const canonical = BASE + page.path;
  const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const structuredData = schemaFor(page);
  const tags = [
    '<meta name="description" content="' + esc(page.description) + '">',
    '<meta name="robots" content="' + robots + '">',
    '<meta name="googlebot" content="' + robots + '">',
    '<meta name="bingbot" content="' + robots + '">',
    '<link rel="canonical" href="' + esc(canonical) + '">',
    '<meta property="og:type" content="website">',
    '<meta property="og:site_name" content="' + SITE + '">',
    '<meta property="og:locale" content="en_IN">',
    '<meta property="og:title" content="' + esc(fullTitle) + '">',
    '<meta property="og:description" content="' + esc(page.description) + '">',
    '<meta property="og:url" content="' + esc(canonical) + '">',
    '<meta property="og:image" content="' + BASE + '/og-image.jpg">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(fullTitle) + '">',
    '<meta name="twitter:description" content="' + esc(page.description) + '">',
    '<meta name="twitter:image" content="' + BASE + '/og-image.jpg">',
    '<script type="application/ld+json">' + JSON.stringify(structuredData).replaceAll('<', '\\u003c') + '</script>'
  ].join('\n');

  return source
    .replace(/<title>.*?<\/title>/s, '<title>' + esc(fullTitle) + '</title>')
    .replace('</head>', tags + '\n</head>')
    .replace('<div id="root"></div>', '<div id="root">' + page.body + '</div>');
}

async function writeRoute(path, html) {
  const relative = path.replace(/^\//, '');
  const clean = join(distRoot.pathname, relative + '.html');
  const directory = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, html, 'utf8');
  await writeFile(directory, html, 'utf8');
}

const examList = examTests.map((test) =>
  '<li><a href="/tests/' + esc(test.slug) + '">' + esc(test.name) + '</a> — CBSE Class ' + test.classLevel + ' ' + esc(test.subject) + '</li>'
).join('');

const guideList = authorityGuides.map((guide) =>
  '<li><a href="' + esc(guide.path) + '">' + esc(guide.title) + '</a></li>'
).join('');

const faqs = [
  ['Are the published study resources free?', 'Yes. Published public notes and learning resources marked free can be opened without payment. Some advanced or future features may be labelled separately.'],
  ['Which boards are supported?', 'The website currently separates CBSE and GSEB resources so students can choose the correct board and chapter collection.'],
  ['Can I use the website without joining tuition?', 'Yes. Public notes, practice pages and calculators can be used independently of tuition.'],
  ['Where can I read the access rules?', 'The Access & Learning Policy explains how public learning resources and restricted areas are handled.']
];

const pages = [
  {
    path: '/courses',
    title: 'Commerce Courses — Class 11 & 12',
    description: 'Explore Class 11 and 12 Commerce learning resources for Economics, Business Studies and related school Commerce preparation.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Commerce courses for Class 11 & 12</h1><p>This course hub is built around the school Commerce topics that are actually published on Smit Sir Commerce. Students can begin with chapter notes, then move into quizzes, daily practice, calculators and timed tests instead of treating every resource as a separate download.</p><p>For Class 11, the strongest current learning path is Microeconomics, where chapter resources can be used together with concept practice and numerical tools. For Class 12, students can revise Economics and Business Studies through chapter-wise material, exam practice and topic-specific support. The site also includes Entrepreneurship and Physical Education learning support where published.</p><h2>How to use the course hub</h2><p>Choose your class and subject first. Read one chapter resource, close the notes and try to explain the idea in your own words. Then attempt a quiz or practice set. If the mistake is numerical, use the relevant calculator only to verify your method after you have attempted the working yourself. For test preparation, move to the test series only after the chapter-level gaps are clear.</p><h2>Start learning now</h2><ul><li><a href="/study-material">Free chapter-wise study material</a></li><li><a href="/cbse-notes">CBSE Commerce notes</a></li><li><a href="/quizzes">Commerce quizzes</a></li><li><a href="/test-series">Commerce test series</a></li><li><a href="/live-classes">Live-class information</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/study-material',
    title: 'Free CBSE & GSEB Commerce Study Material',
    description: 'Browse free CBSE and GSEB Commerce study material with chapter-wise notes, practice resources and connected calculators for Class 11 and 12.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Free Commerce study material</h1><p>Choose the correct board, class, subject and chapter instead of searching through disconnected files. Published public resources are organised into searchable CBSE and GSEB collections.</p><h2>Study by board</h2><ul><li><a href="/cbse-notes">CBSE Class 11 & 12 Commerce notes</a></li><li><a href="/gseb-class-12-economics.html">GSEB Class 12 Economics notes</a></li><li><a href="/cbse-practice">CBSE chapter practice</a></li><li><a href="/tools">Free Commerce calculators</a></li></ul><h2>Exam-focused guides</h2><ul>' + guideList + '</ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/quizzes',
    title: 'CBSE Commerce Quizzes and Practice',
    description: 'Practice Class 11 and 12 Commerce concepts with quizzes, daily questions and connected chapter revision resources.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>CBSE Commerce quizzes and practice</h1><p>Use quick questions after learning a topic so you can test recall instead of only rereading notes. A quiz is most useful when it tells you exactly what to revise next, not when it is treated as a score to collect.</p><p>Start with a small set immediately after finishing a chapter. Answer without looking at the notes, mark every uncertain question and then return only to the concept behind that mistake. On the second attempt, try to explain why the correct option is right and why the other options are wrong. This method is especially useful in Economics and Business Studies, where similar terms can look correct until the exact condition in the question is noticed.</p><h2>Move from recall to exam practice</h2><p>Use daily practice for consistency, chapter practice for topic depth and the test series for mixed revision under time pressure. If you repeatedly miss the same area, do not keep taking random tests; go back to the chapter explanation or the relevant calculator, rebuild the concept and then retry a fresh set.</p><ul><li><a href="/daily-practice">Daily Commerce practice</a></li><li><a href="/cbse-practice">Chapter-wise practice library</a></li><li><a href="/test-series">Full Commerce test series</a></li><li><a href="/exam-mode">Advanced exam mode</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/test-series',
    title: 'CBSE Commerce Test Series',
    description: 'Practice CBSE Class 11 and 12 Commerce with subject and chapter tests, timed exam practice and linked revision resources.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>CBSE Commerce test series</h1><p>Move beyond passive revision with subject and chapter tests for Economics, Business Studies and Accountancy topics currently available in the exam bank.</p><h2>Available practice exams</h2><ul>' + examList + '</ul><p><a href="/exam-mode">Open Advanced Exam Mode</a> for timed solving and review features.</p>' + coreNav() + '</article></main>'
  },
  {
    path: '/exam-mode',
    title: 'Advanced CBSE Commerce Exam Mode',
    description: 'Take timed CBSE Commerce practice tests with question navigation, review and post-test weak-topic analysis.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Advanced Commerce exam mode</h1><p>Use timed practice when you want to test recall and decision-making under exam conditions. Select a published exam below, then review your weak topics after submission.</p><h2>Choose an exam</h2><ul>' + examList + '</ul><p><a href="/test-series">Return to the Commerce test-series overview</a>.</p>' + coreNav() + '</article></main>'
  },
  {
    path: '/daily-practice',
    title: 'Daily 10 Commerce Practice',
    description: 'Build a consistent Commerce revision habit with short daily CBSE questions, then continue to chapter practice and full tests.',
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Daily Commerce practice</h1><p>Short daily practice helps reveal weak concepts before they accumulate. The goal is not to spend hours on random questions; it is to keep important definitions, relationships and numerical steps active in memory between larger revision sessions.</p><p>A simple routine is to attempt the daily questions without notes, check the explanation, and write down only the concepts you could not justify confidently. If a mistake comes from forgetting a definition, revise that definition with an example. If it comes from a numerical step, redo the calculation from the beginning rather than memorising the final answer. If the same topic appears weak for several days, move from daily practice to the full chapter resource.</p><h2>Use the right level of practice</h2><p>Daily questions are best for consistency. Chapter practice is better when one topic needs focused work, while a timed test is useful only after several chapters have been revised. This progression keeps practice connected to learning instead of turning it into repeated guessing.</p><ul><li><a href="/quizzes">Quick Commerce quizzes</a></li><li><a href="/cbse-practice">Chapter practice</a></li><li><a href="/study-coach">Study coach and chapter mastery</a></li><li><a href="/test-series">Full test series</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/study-coach',
    title: 'Commerce Study Coach & Chapter Mastery',
    description: 'Use chapter mastery and study missions to organise Commerce revision around weak topics and consistent practice.',
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Commerce study coach</h1><p>Turn scattered revision into a simple cycle: learn a chapter, practise it, identify weak areas and return to the exact topic that needs work. The study coach is designed to organise that cycle; it is not a replacement for your textbook, class teaching or your own written practice.</p><p>Begin by selecting the chapter you are currently studying. After reading, try a short practice activity without notes. A low score is useful only if you can classify the reason: concept not understood, formula forgotten, question misread, weak answer structure or lack of revision. Once the reason is clear, choose the smallest next action that fixes it. For example, a formula mistake needs a fresh numerical attempt, while a Business Studies keyword mistake may need a short recall card and one written answer.</p><h2>Build mastery gradually</h2><p>Do not try to make every chapter perfect in one sitting. Revisit weak areas after a gap, use mixed tests when several chapters are ready, and compare your newer attempts with the earlier ones. The aim is to make your next revision session more specific and useful.</p><ul><li><a href="/study-material">Choose study material</a></li><li><a href="/daily-practice">Build a daily practice habit</a></li><li><a href="/study-tools">Use revision and calculator tools</a></li><li><a href="/marks-recovery">Find where marks are being lost</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/study-tools',
    title: 'Commerce Study Toolkit',
    description: 'Use free Commerce study tools, revision planning and topic resources for Class 11 and 12 Economics, Business Studies and Accountancy learning.',
    collection: true,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Commerce study toolkit</h1><p>Combine notes with calculators, chapter practice, revision guides and exam preparation instead of using each resource in isolation.</p><h2>Free calculators and diagnostics</h2><ul><li><a href="/tools">Commerce calculator hub</a></li><li><a href="/marks-recovery">Marks Recovery diagnostic</a></li><li><a href="/cbse-practice">CBSE chapter practice</a></li></ul><h2>Exam-focused learning guides</h2><ul>' + guideList + '</ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/live-classes',
    title: 'CBSE Commerce Live Classes',
    description: 'Learn about live CBSE Commerce class options and continue with free notes, tests and online or offline batch information.',
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>CBSE Commerce live classes</h1><p>Live classes are intended for students who want real-time explanation, question discussion and a regular study routine in addition to the public resources on the website. Joining a batch is not required to use the free notes, calculators, quizzes and practice pages.</p><p>Before choosing a live class, compare what you actually need. A student who understands concepts but lacks revision may benefit more from structured tests and practice. A student who repeatedly gets stuck while learning a chapter may benefit from live explanation and the chance to ask questions immediately. Bringing a recent school test or a list of weak chapters to a demo makes the discussion more useful than choosing a batch only from a timetable.</p><h2>What to do before a demo</h2><p>Review one difficult topic, note the exact point where you get confused and keep your latest test paper nearby if available. During the demo or paper analysis, focus on whether the explanation helps you solve the problem independently. Current batch timing, mode and availability should be confirmed before making any admission decision.</p><ul><li><a href="/online-batch">Online Commerce batch</a></li><li><a href="/offline-batch">Offline Commerce batch in Mehsana</a></li><li><a href="/book-demo">Request a free demo or paper analysis</a></li><li><a href="/study-material">Use free study material</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/online-batch',
    title: 'Online CBSE Commerce Coaching',
    description: 'Online CBSE Commerce learning support for Class 11 and 12 with connected notes, practice, tests and demo information.',
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Online CBSE Commerce coaching</h1><p>Online learning support is designed to combine live concept teaching with the same free notes, practice pages, calculators and tests available on the website. It can suit students who need a fixed learning routine but cannot attend regularly in Mehsana.</p><p>The useful part of online coaching is not simply watching a class on a screen. A student should still solve questions independently, write answers and return with specific doubts. For Economics, that may mean attempting the numerical before class and checking the step where the calculation went wrong. For Business Studies, it may mean writing a short answer and checking whether the correct concept and keywords were used.</p><h2>Check fit before joining</h2><p>Use the free resources first and request a demo if you want to understand the teaching approach. Confirm the current schedule, subjects covered, learning mode and batch availability before making an admission decision. If your main need is only extra practice, the public quizzes and test series may already be useful without joining a batch.</p><ul><li><a href="/live-classes">Live-class information</a></li><li><a href="/offline-batch">Compare offline learning in Mehsana</a></li><li><a href="/book-demo">Request a free demo</a></li><li><a href="/cbse-notes">Use free CBSE notes first</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/offline-batch',
    title: 'Offline Commerce Coaching in Mehsana',
    description: 'Offline CBSE Commerce coaching information for Class 11 and 12 students in Mehsana with free learning resources and demo support.',
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Offline Commerce coaching in Mehsana</h1><p>Offline Commerce support in Mehsana is for students who prefer face-to-face explanation, a fixed study routine and the ability to discuss doubts directly during class. The website remains useful before and after class because the public notes, calculators, quizzes and tests can be used independently.</p><p>Before deciding whether offline coaching is suitable, identify the problem you actually want to solve. Some students need concept explanation, some need answer-writing discipline and others mainly need consistent testing. A recent school paper is especially useful because it shows whether marks are being lost through understanding, calculation, interpretation, presentation or incomplete revision.</p><h2>Try the learning approach first</h2><p>Students can use the free public resources and request a paper analysis or demo before making an admission decision. Bring one difficult chapter or recent test to the discussion and judge the class by whether the explanation helps you solve a similar question yourself. Current batch timing, seat availability and subject coverage should always be confirmed directly because these can change during the academic year.</p><ul><li><a href="/commerce-coaching-mehsana">Commerce tuition in Mehsana</a></li><li><a href="/live-classes">Live-class information</a></li><li><a href="/online-batch">Compare online learning</a></li><li><a href="/book-demo">Request a free demo or paper analysis</a></li></ul>' + coreNav() + '</article></main>'
  },
  {
    path: '/faq',
    title: 'CBSE Commerce Coaching FAQ',
    description: 'Answers about Smit Sir Commerce subjects, free study resources, batches, demo classes and access policies.',
    faqs,
    body: '<main class="page-container section-padding" data-prerendered="core-page"><article><h1>Smit Sir Commerce frequently asked questions</h1>' +
      faqs.map(([q, a]) => '<h2>' + esc(q) + '</h2><p>' + esc(a) + '</p>').join('') +
      '<p><a href="/access-policy">Read the Access & Learning Policy</a> · <a href="/privacy">Privacy Policy</a> · <a href="/terms">Terms of Use</a></p>' +
      coreNav() + '</article></main>'
  }
];

for (const page of pages) {
  await writeRoute(page.path, buildHtml(page));
}

console.log('Pre-rendered ' + pages.length + ' core indexable SPA pages with crawlable HTML and connected internal links.');
