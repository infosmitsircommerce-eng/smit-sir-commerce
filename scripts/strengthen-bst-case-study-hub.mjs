import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const hubPath = '/cbse/class-12/business-studies-case-study-questions';

const chapterPages = [
  {
    path: '/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions',
    label: 'Chapter 1: Nature and Significance of Management case study questions with answers',
  },
  {
    path: '/practice/cbse/class-12/business-studies/business-environment-case-study-questions',
    label: 'Chapter 3: Business Environment case study questions with answers',
  },
  {
    path: '/practice/cbse/class-12/business-studies/planning-case-study-questions',
    label: 'Planning case study questions with solutions',
  },
  {
    path: '/practice/cbse/class-12/business-studies/controlling-case-study-questions',
    label: 'Controlling case study questions with answers',
  },
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function replaceMeta(html, property, value) {
  const nameRegex = new RegExp(`<meta\\s+name=["']${property}["'][^>]*>`, 'i');
  const propertyRegex = new RegExp(`<meta\\s+property=["']${property}["'][^>]*>`, 'i');
  if (nameRegex.test(html)) return html.replace(nameRegex, `<meta name="${property}" content="${value}">`);
  if (propertyRegex.test(html)) return html.replace(propertyRegex, `<meta property="${property}" content="${value}">`);
  return html.replace('</head>', `<meta name="${property}" content="${value}">\n</head>`);
}

const title = 'Class 12 Business Studies Case Study Questions with Answers | CBSE 2026-27';
const description = 'Practice CBSE Class 12 Business Studies case study questions with answers for 2026-27. Use solved chapter practice, keyword clues and a simple answer method for board preparation.';

const hubBlock = `<section data-bst-case-study-growth="true" style="margin:32px 0;padding:24px;border:1px solid #e7d5aa;border-radius:22px;background:#fffdf7"><p style="margin:0 0 10px;font-weight:800;letter-spacing:.08em;font-size:12px;color:#8b641c">CLASS 12 BUSINESS STUDIES PRACTICE</p><h2>Case study questions with answers: start here</h2><p>Case-study questions become much easier when you stop trying to memorise the whole chapter at once. First identify the clue in the situation, then name the exact Business Studies concept and connect that concept back to the case in one clear line.</p><h3>A simple 4-step method</h3><ol><li><strong>Read what the question asks.</strong> Know whether you need a concept, principle, function, step or importance point.</li><li><strong>Underline the clue.</strong> Words such as target, authority, recruitment, motivation, standards or correction often reveal the chapter concept.</li><li><strong>Name the exact concept.</strong> Use the textbook term before writing the explanation.</li><li><strong>Apply it to the case.</strong> Link one fact from the situation to the concept instead of writing a generic paragraph.</li></ol><h3>Published chapter practice</h3><ul>${chapterPages.map((item) => `<li><a href="${item.path}">${item.label}</a></li>`).join('')}</ul><p><strong>Tip for board preparation:</strong> after solving a case, close the answer and explain why the clue points to that concept. That extra recall step is what makes similar questions easier later.</p><p><a href="/cbse/class-12/business-studies-important-questions">Open Class 12 Business Studies important questions</a> · <a href="/cbse-notes">Open free CBSE Commerce notes</a></p></section>`;

const oldBlockRegex = /<section\s+data-traffic-winner=["']bst-case-study-hub["'][\s\S]*?<\/section>/i;

let hubPatched = 0;
for (const file of routeFiles(hubPath)) {
  try {
    let html = await readFile(file, 'utf8');
    const before = html;
    html = html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
    html = replaceMeta(html, 'description', description);
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title}">`);
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description}">`);

    if (oldBlockRegex.test(html)) {
      html = html.replace(oldBlockRegex, hubBlock);
    } else if (!html.includes('data-bst-case-study-growth="true"')) {
      const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
      let inserted = false;
      for (const anchor of anchors) {
        if (html.includes(anchor)) {
          html = html.replace(anchor, `${hubBlock}${anchor}`);
          inserted = true;
          break;
        }
      }
      if (!inserted) html = html.replace('</body>', `${hubBlock}</body>`);
    }

    if (html !== before) {
      await writeFile(file, html, 'utf8');
      hubPatched += 1;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

const backLinkBlock = `<section data-bst-hub-backlink="true" style="margin:28px 0;padding:20px;border:1px solid #eadfca;border-radius:18px;background:#fffdf8"><h2>More Class 12 Business Studies case study practice</h2><p>Return to the main chapter-wise case-study hub to practise other concepts and use the same four-step answer method.</p><p><a href="${hubPath}"><strong>Open all Class 12 Business Studies case study questions with answers →</strong></a></p></section>`;

let chapterPatched = 0;
for (const item of chapterPages) {
  for (const file of routeFiles(item.path)) {
    try {
      let html = await readFile(file, 'utf8');
      if (html.includes('data-bst-hub-backlink="true"')) continue;
      const before = html;
      const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
      for (const anchor of anchors) {
        if (html.includes(anchor)) {
          html = html.replace(anchor, `${backLinkBlock}${anchor}`);
          break;
        }
      }
      if (html !== before) {
        await writeFile(file, html, 'utf8');
        chapterPatched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log(`Strengthened BST case-study hub: ${hubPatched} hub files and ${chapterPatched} chapter files patched.`);
