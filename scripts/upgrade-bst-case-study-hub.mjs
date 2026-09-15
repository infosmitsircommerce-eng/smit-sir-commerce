import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const HUB = '/cbse/class-12/business-studies-case-study-questions';

const chapterPages = [
  {
    path: '/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions',
    label: 'Chapter 1: Nature and Significance of Management',
  },
  {
    path: '/practice/cbse/class-12/business-studies/business-environment-case-study-questions',
    label: 'Chapter 3: Business Environment',
  },
  {
    path: '/practice/cbse/class-12/business-studies/planning-case-study-questions',
    label: 'Chapter 4: Planning',
  },
  {
    path: '/practice/cbse/class-12/business-studies/controlling-case-study-questions',
    label: 'Chapter 8: Controlling',
  },
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [
    join(dist.pathname, `${relative}.html`),
    join(dist.pathname, relative, 'index.html'),
  ];
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
}

function setMeta(html, selector, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const patterns = selector === 'description'
    ? [/<meta\s+name=["']description["'][^>]*>/i]
    : selector === 'og:title'
      ? [/<meta\s+property=["']og:title["'][^>]*>/i]
      : selector === 'og:description'
        ? [/<meta\s+property=["']og:description["'][^>]*>/i]
        : selector === 'twitter:title'
          ? [/<meta\s+name=["']twitter:title["'][^>]*>/i]
          : [/<meta\s+name=["']twitter:description["'][^>]*>/i];

  const replacement = selector === 'description'
    ? `<meta name="description" content="${escaped}">`
    : selector.startsWith('og:')
      ? `<meta property="${selector}" content="${escaped}">`
      : `<meta name="${selector}" content="${escaped}">`;

  for (const pattern of patterns) {
    if (pattern.test(html)) return html.replace(pattern, replacement);
  }
  return html.replace('</head>', `${replacement}\n</head>`);
}

function insertBeforeLearning(html, marker, block) {
  if (html.includes(marker)) return html;
  const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
  for (const anchor of anchors) {
    if (html.includes(anchor)) return html.replace(anchor, `${block}${anchor}`);
  }
  return html.replace('</body>', `${block}</body>`);
}

const title = 'Class 12 Business Studies Case Study Questions with Answers | CBSE 2026-27';
const description = 'Practice CBSE Class 12 Business Studies case study questions with answers, chapter-wise clues and a simple solving method for Management, Business Environment, Planning, Controlling and more.';

const hubBlock = `
<section data-bst-national-upgrade="true" style="margin:32px 0;padding:26px;border:1px solid #ead7a7;border-radius:22px;background:#fffdf7">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#8b641c">CBSE CLASS 12 · CHAPTER-WISE PRACTICE</p>
  <h2>Class 12 Business Studies case study questions with answers</h2>
  <p>Case-study questions become much easier when you stop reading them like stories. First find the clue, then identify the chapter concept, write the correct Business Studies term, and connect that term back to the situation.</p>

  <h3>Use this 4-step method in every case study</h3>
  <ol>
    <li><strong>Read the requirement first:</strong> know whether the question asks you to identify, explain, state, distinguish or justify.</li>
    <li><strong>Underline the clue:</strong> look for words showing a principle, function, process, objective, environment factor or management action.</li>
    <li><strong>Name the exact concept:</strong> write the textbook term before giving the explanation.</li>
    <li><strong>Apply it to the case:</strong> use one clear line from the situation to prove why your concept fits.</li>
  </ol>

  <h3>Chapter-wise case-study practice</h3>
  <ul>
    ${chapterPages.map((item) => `<li><a href="${item.path}">${item.label} case study questions with answers</a></li>`).join('')}
  </ul>

  <h3>Fast clue map for Class 12 Business Studies</h3>
  <ul>
    <li><strong>Chapter 1 — Management:</strong> achieving the target → effectiveness; minimum cost or waste → efficiency; different departments working together → coordination.</li>
    <li><strong>Chapter 2 — Principles of Management:</strong> one employee receiving orders from one boss → unity of command; one plan for one objective → unity of direction; worker specialisation → division of work.</li>
    <li><strong>Chapter 3 — Business Environment:</strong> law or regulation → legal environment; lifestyle change → social environment; new technology → technological environment; interest rates or income → economic environment.</li>
    <li><strong>Chapter 4 — Planning:</strong> deciding objectives and future action → planning; comparing alternatives → evaluation of alternatives; a numerical plan → budget.</li>
    <li><strong>Chapter 5 — Organising:</strong> departments, authority, responsibility and reporting relationships → organising.</li>
    <li><strong>Chapter 6 — Staffing:</strong> recruitment, selection, placement, training and development → staffing.</li>
    <li><strong>Chapter 7 — Directing:</strong> supervision, motivation, leadership and communication → directing.</li>
    <li><strong>Chapter 8 — Controlling:</strong> standard versus actual performance, deviation and corrective action → controlling.</li>
    <li><strong>Chapter 9 — Financial Management:</strong> investment, financing, dividend decisions and capital structure → financial management.</li>
    <li><strong>Chapter 10 — Financial Markets:</strong> new securities → primary market; existing securities → secondary market; investor protection and regulation → SEBI.</li>
    <li><strong>Chapter 11 — Marketing:</strong> product, price, place and promotion decisions → marketing mix.</li>
    <li><strong>Chapter 12 — Consumer Protection:</strong> safety, information, choice, redressal and unfair trade practices → consumer rights and protection.</li>
  </ul>

  <h3>Original mini case 1 — Chapter 1</h3>
  <p>A company completed its monthly production target on time, but used much more raw material than necessary. The target was achieved, yet the cost of producing each unit increased.</p>
  <p><strong>Question:</strong> Which management ideas are shown?</p>
  <p><strong>Answer:</strong> The company was <strong>effective</strong> because it achieved the target, but it was not <strong>efficient</strong> because resources were not used economically.</p>

  <h3>Original mini case 2 — Chapter 2</h3>
  <p>An employee receives one instruction from the production manager and a conflicting instruction from another departmental manager for the same task.</p>
  <p><strong>Question:</strong> Which Fayol principle is being violated?</p>
  <p><strong>Answer:</strong> <strong>Unity of Command</strong>, because one employee should receive orders from only one superior for a particular task.</p>

  <h3>What should a 3-mark case-study answer look like?</h3>
  <p><strong>1.</strong> Name the concept. <strong>2.</strong> Explain it in one precise line. <strong>3.</strong> Connect the relevant clue from the case. Avoid rewriting the entire case.</p>

  <h3>Frequently asked questions</h3>
  <details><summary><strong>Are these official CBSE case-study questions?</strong></summary><p>No. The practice questions and explanations on Smit Sir Commerce are original learning material designed to help students practise CBSE-style application skills.</p></details>
  <details><summary><strong>How do I identify the correct chapter in a Business Studies case?</strong></summary><p>Look for the action being described. Targets and alternatives usually point to Planning; recruitment and training to Staffing; motivation and leadership to Directing; standards and deviations to Controlling.</p></details>
  <details><summary><strong>Should I write long answers for case-study questions?</strong></summary><p>Write according to the marks. Usually the strongest response is the correct concept, a precise explanation and a direct application to the case rather than an unrelated long paragraph.</p></details>

  <p><a href="/cbse/class-12/business-studies-important-questions"><strong>Practice more Class 12 Business Studies important questions →</strong></a> · <a href="/cbse/class-12/business-studies-mcq">MCQ practice →</a> · <a href="/cbse-notes">Free CBSE Commerce notes →</a></p>
</section>`;

async function patchHub() {
  let patched = 0;
  for (const file of routeFiles(HUB)) {
    try {
      let html = await readFile(file, 'utf8');
      html = setTitle(html, title);
      html = setMeta(html, 'description', description);
      html = setMeta(html, 'og:title', title);
      html = setMeta(html, 'og:description', description);
      html = setMeta(html, 'twitter:title', title);
      html = setMeta(html, 'twitter:description', description);
      html = insertBeforeLearning(html, 'data-bst-national-upgrade="true"', hubBlock);
      await writeFile(file, html, 'utf8');
      patched += 1;
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return patched;
}

async function strengthenChapterLinks() {
  let patched = 0;
  const backlink = `<p data-bst-hub-backlink="true" style="margin:24px 0"><a href="${HUB}"><strong>← All Class 12 Business Studies case study questions with answers</strong></a></p>`;
  for (const chapter of chapterPages) {
    for (const file of routeFiles(chapter.path)) {
      try {
        let html = await readFile(file, 'utf8');
        html = insertBeforeLearning(html, 'data-bst-hub-backlink="true"', backlink);
        await writeFile(file, html, 'utf8');
        patched += 1;
      } catch (error) {
        if (error?.code !== 'ENOENT') throw error;
      }
    }
  }
  return patched;
}

const hubPatched = await patchHub();
const chapterPatched = await strengthenChapterLinks();
console.log(`Upgraded Business Studies case-study hub: ${hubPatched} hub files and ${chapterPatched} chapter files patched.`);
