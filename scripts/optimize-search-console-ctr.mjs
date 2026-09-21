import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);

const targets = [
  {
    path: '/cbse/class-12/business-studies-case-study-questions',
    title: 'Class 12 Business Studies Case Study Questions with Answers | CBSE 2026-27',
    description: 'Free chapter-wise CBSE Class 12 Business Studies case study questions with answers for Chapters 1–12, solved examples, clue words and a 4-step answer method.',
    marker: 'bst-case-study-search-intent',
    snippet: '<p data-gsc-intent="bst-case-study-search-intent"><strong>Class 12 BST case studies:</strong> choose a chapter below, attempt the original case without looking at the answer, then check the clue, concept and board-ready application.</p>',
  },
  {
    path: '/cbse/class-12/business-studies/controlling-notes',
    title: 'Controlling Class 12 Notes PDF (Free) | Business Studies Ch 8',
    description: 'Free Controlling Class 12 notes PDF for CBSE Business Studies Chapter 8: meaning, importance, planning relationship, 5-step process, deviations, case-study clues and revision.',
    marker: 'controlling-search-intent',
    insertBefore: '<h2>Controlling Class 12: understand the process, then practise the clues</h2>',
    snippet: '<p data-gsc-intent="controlling-search-intent"><strong>Looking for Controlling Class 12 notes PDF?</strong> Open the free Chapter 8 notes below, then use the process table and case-study clues for quick revision.</p>',
  },
  {
    path: '/tools/net-indirect-tax-calculator',
    title: 'How to Calculate NIT | Net Indirect Tax Formula + Free Calculator',
    description: 'How to calculate NIT: Net Indirect Tax = Indirect Taxes − Subsidies. Use the free calculator and learn the NIT formula for factor cost and market price numericals.',
    marker: 'nit-search-intent',
    insertBefore: '<h2>How to calculate Net Indirect Tax (NIT)</h2>',
    snippet: '<p data-gsc-intent="nit-search-intent"><strong>Formula of NIT:</strong> Net Indirect Tax = Indirect Taxes − Subsidies. Use the free calculator on this page, then check the examples below.</p>',
  },
  {
    path: '/tools/topics/national-income-gdp',
    title: 'National Income Calculator (Free) | GDP, NDP, GNP/GNI & NNP Formulas',
    description: 'Free National Income calculator and Class 12 formula guide for GDP, NDP, GNP/GNI, NNP, depreciation, NFIA and Net Indirect Tax with easy conversion rules.',
    marker: 'national-income-search-intent',
    insertBefore: '<h2>National Income calculator: the conversion ladder</h2>',
    snippet: '<p data-gsc-intent="national-income-search-intent"><strong>National Income calculator:</strong> use the free tools on this page for GDP, NDP, GNP/GNI and NNP, then use the conversion ladder below to understand every adjustment.</p>',
  },
  {
    path: '/tools/nfia-calculator',
    title: 'NFIA Formula Class 12 + Free Calculator & Solved Examples',
    description: 'NFIA formula for Class 12 Economics: factor income from abroad minus factor income paid abroad. Calculate NFIA free and learn the sign with solved examples.',
    marker: 'nfia-search-intent',
    snippet: '<p data-gsc-intent="nfia-search-intent"><strong>NFIA formula:</strong> Factor income received from abroad − factor income paid abroad. Enter both values in the calculator, then use the examples below to check the sign.</p>',
  },
  {
    path: '/business-studies-tuition-mehsana',
    title: 'Business Studies Tuition in Mehsana | Class 11 & 12',
    description: 'Business Studies tuition in Mehsana for Class 11 and 12 Commerce: concept clarity, case-study practice, answer writing, notes and exam revision with Smit Sir.',
    marker: 'bst-tuition-mehsana-search-intent',
    snippet: '<p data-gsc-intent="bst-tuition-mehsana-search-intent"><strong>Business Studies tuition in Mehsana:</strong> students can first try the free chapter notes and case-study practice on this website, then book a demo for focused help.</p>',
  },
  {
    path: '/economics-tuition-mehsana',
    title: 'Economics Tuition in Mehsana | Class 11 & 12 Commerce',
    description: 'Economics tuition in Mehsana for Class 11 and 12 Commerce students: simple concepts, diagrams, numericals, CBSE/GSEB notes, tests and exam revision.',
    marker: 'economics-tuition-mehsana-search-intent',
    snippet: '<p data-gsc-intent="economics-tuition-mehsana-search-intent"><strong>Economics tuition in Mehsana:</strong> learn concepts first, then practise diagrams, numericals and exam questions for CBSE or GSEB Class 11–12 Commerce.</p>',
  },
  {
    path: '/school-resource/gseb/class-11/accountancy/gseb-class-11-accountancy-chapter-4-journal-notes',
    title: 'Journal Class 11 Notes PDF (Free) | GSEB Accountancy Ch 4',
    description: 'Free GSEB Class 11 Accountancy Chapter 4 Journal notes PDF: rules of debit and credit, journal format, entries, narration and concept-first revision.',
    marker: 'gseb-journal-notes-search-intent',
    snippet: '<p data-gsc-intent="gseb-journal-notes-search-intent"><strong>Journal Class 11 notes:</strong> revise the journal format and debit-credit rules below, then open the free GSEB Chapter 4 PDF for complete practice.</p>',
  },
  {
    path: '/school-resource/gseb/class-12/business-administration/gseb-class-12-ocm-chapter-3-planning-notes',
    title: 'Planning Class 12 Notes PDF (Free) | GSEB OCM Chapter 3',
    description: 'Free GSEB Class 12 OCM Chapter 3 Planning notes PDF with meaning, importance, limitations, planning process, types of plans and exam revision.',
    marker: 'gseb-ocm-planning-search-intent',
    snippet: '<p data-gsc-intent="gseb-ocm-planning-search-intent"><strong>Planning Class 12 OCM notes:</strong> revise the meaning, importance, limitations, process and types of plans, then open the free chapter PDF.</p>',
  },
  {
    path: '/gseb/class-12/banking-monetary-policy-explained',
    title: 'Banking & Monetary Policy Class 12 Notes | GSEB Economics',
    description: 'GSEB Class 12 Economics Banking and Monetary Policy notes: RBI functions, credit control, repo and reverse repo rate, CRR, SLR and exam-focused explanations.',
    marker: 'gseb-banking-search-intent',
    snippet: '<p data-gsc-intent="gseb-banking-search-intent"><strong>Banking and Monetary Policy Class 12:</strong> revise RBI functions and quantitative credit-control tools with simple meanings before attempting MCQs.</p>',
  },
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function esc(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
}

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, selector, value) {
  const pattern = selector.startsWith('og:')
    ? new RegExp(`<meta\\s+property=["']${selector}["'][^>]*>`, 'i')
    : new RegExp(`<meta\\s+name=["']${selector}["'][^>]*>`, 'i');
  const replacement = selector.startsWith('og:')
    ? `<meta property="${selector}" content="${esc(value)}">`
    : `<meta name="${selector}" content="${esc(value)}">`;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `${replacement}\n</head>`);
}

function addBeforeLearning(html, marker, snippet) {
  if (!snippet || html.includes(`data-gsc-intent="${marker}"`)) return html;
  const anchors = [
    '<h2>Continue learning</h2>',
    '<h2>Related resources</h2>',
    '<section data-study-pathway="true"',
    '</article>',
    '</main>',
  ];
  for (const anchor of anchors) {
    if (html.includes(anchor)) return html.replace(anchor, `${snippet}\n${anchor}`);
  }
  return html.replace('</body>', `${snippet}\n</body>`);
}

let patched = 0;
for (const target of targets) {
  for (const file of routeFiles(target.path)) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;

      html = setTitle(html, target.title);
      html = setMeta(html, 'description', target.description);
      html = setMeta(html, 'og:title', target.title);
      html = setMeta(html, 'og:description', target.description);
      html = setMeta(html, 'twitter:title', target.title);
      html = setMeta(html, 'twitter:description', target.description);

      if (target.insertBefore && !html.includes(`data-gsc-intent="${target.marker}"`) && html.includes(target.insertBefore)) {
        html = html.replace(target.insertBefore, `${target.snippet}\n${target.insertBefore}`);
      } else {
        html = addBeforeLearning(html, target.marker, target.snippet);
      }

      if (html !== before) {
        await writeFile(file, html, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log(`Search Console CTR pass: ${patched} generated HTML files patched for exact live query intent.`);
