import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gsebMaterials } from '../src/data/gsebMaterials.js';

const distRoot = new URL('../dist/', import.meta.url).pathname;

// Internal creative previews are useful for production work but should never
// compete with real learning pages in search or be considered publisher pages.
for (const filename of ['ad.html', 'ad2.html', 'ad3.html', 'manga.html']) {
  const path = join(distRoot, filename);
  try {
    let html = await readFile(path, 'utf8');
    if (!/name=["']robots["']/i.test(html)) {
      html = html.replace('</head>', '<meta name="robots" content="noindex, nofollow, noarchive">\n</head>');
    } else {
      html = html.replace(/<meta[^>]+name=["']robots["'][^>]*>/i, '<meta name="robots" content="noindex, nofollow, noarchive">');
    }
    await writeFile(path, html, 'utf8');
  } catch {
    // Missing creative preview should never block a production deploy.
  }
}

const chapterGuidance = {
  2: 'Pay special attention to the distinction between economic growth and economic development, the meaning of development indicators and how different indicators are interpreted. After reading the notes, practise short explanations and comparison-based questions instead of only memorising definitions.',
  3: 'Revise the functions and types of money first, then connect inflation with its major causes. When practising, separate demand-pull from cost-push inflation and write the cause-and-effect chain clearly rather than using the two terms interchangeably.',
  4: 'Focus on the role of commercial banks, central-bank functions and the purpose of monetary-policy tools. While revising, connect each policy instrument with the direction in which it can influence credit, money supply or economic activity.',
  5: 'Study the meaning and measurement of poverty together with the major causes and policy responses discussed in the chapter. Strong answers should distinguish the concept from its symptoms and use the chapter terminology consistently.',
  6: 'Revise the meaning and major forms of unemployment, then practise identifying the correct type from a situation. Keep causes, effects and remedial measures in separate points so long answers remain structured and easy to evaluate.',
  7: 'Focus on population size, growth, composition and the economic implications discussed in the chapter. During revision, connect demographic indicators with development instead of treating every statistic as an isolated fact.',
  8: 'Revise the role and characteristics of agriculture, major challenges faced by the sector and the improvement measures covered in the notes. Use headings and cause-effect links when answering descriptive questions.',
  9: 'Start with the meaning and importance of foreign trade, then revise the major concepts, benefits and concerns covered in the chapter. Practise distinguishing related terms and use an example wherever it improves clarity.',
  10: 'Revise the role of industry in development, the structure and challenges of the industrial sector and the measures discussed in the chapter. For long answers, organise points under contribution, problem and improvement headings.',
  11: 'Identify each emerging issue separately and understand why it matters for the Indian economy. Instead of memorising a list, connect each issue with its economic impact and the broad response or policy direction discussed in the notes.',
};

for (const material of gsebMaterials) {
  const relative = material.seo_path.replace(/^\//, '');
  const path = join(distRoot, relative);
  try {
    let html = await readFile(path, 'utf8');
    if (html.includes('data-adsense-enrichment="gseb"')) continue;

    const guidance = chapterGuidance[material.chapterNumber] || `Revise the key definitions, relationships and examples from ${material.chapter}, then practise explaining each point in your own words before checking the chapter practice questions.`;
    const enrichment = `<section class="card" data-adsense-enrichment="gseb"><h2>How to revise ${material.chapter}</h2><p>${guidance}</p><p>Use this page as a chapter map, then open the complete ${material.pages}-page notes PDF for the full explanation. After reading, attempt the linked practice section without looking at the notes. Mark any concept you cannot explain in two or three clear sentences, return to that section in the PDF, and then retry the question. This active-recall cycle is more useful than repeatedly reading the same page.</p><h2>Free chapter resources</h2><div class="btns"><a class="btn" href="${material.file_url}">Open complete Chapter ${material.chapterNumber} PDF</a><a class="btn gold" href="${material.practice_path}">Practice Chapter ${material.chapterNumber}</a><a class="btn" href="/marks-recovery">Find where you are losing marks</a></div><p>This resource is organised for GSEB Class 12 Economics revision. Use your current school textbook, teacher guidance and official board material alongside these notes whenever the wording or syllabus emphasis differs.</p></section>`;

    html = html.replace('</main>', `${enrichment}</main>`);
    await writeFile(path, html, 'utf8');
  } catch {
    // The GSEB PDF archive can be incomplete; missing pages should not block build.
  }
}

// The Class 12 Macroeconomics hub currently has fewer published chapters than
// the older subject hubs. Give the hub enough useful context to stand on its
// own while it continues to expand instead of leaving it as a thin link page.
for (const relative of ['cbse/class-12/macroeconomics-notes.html', 'cbse/class-12/macroeconomics-notes/index.html']) {
  const path = join(distRoot, relative);
  try {
    let html = await readFile(path, 'utf8');
    if (html.includes('data-adsense-enrichment="macro-hub"')) continue;
    const enrichment = `<section data-adsense-enrichment="macro-hub"><h2>How to use the Class 12 Macroeconomics notes</h2><p>Macroeconomics becomes easier when students connect the chapters instead of memorising formulas separately. Begin with the meaning of economy-wide variables, then move into national-income aggregates, money and banking, income determination, government budget and external-sector concepts as the relevant chapter resources are published. For numerical chapters, first write the formula and identify what the question gives you before entering values into a calculator.</p><p>After reading a chapter, use the linked practice resources to test whether you can explain the concept without looking at the PDF. For National Income and Income Determination topics, the free calculator toolkits can help verify your working step by step. If a school test shows repeated errors, use the Marks Recovery diagnostic to classify whether the problem is concept understanding, formula selection, interpretation, answer structure or revision.</p><p><a href="/tools/topics/national-income-gdp">National Income &amp; GDP toolkit</a> · <a href="/tools/topics/income-determination">Income Determination toolkit</a> · <a href="/marks-recovery">Marks Recovery diagnostic</a></p></section>`;
    html = html.replace('</article>', `${enrichment}</article>`);
    await writeFile(path, html, 'utf8');
  } catch {
    // A missing alias should not block build.
  }
}

console.log('Prepared internal creative previews for noindex and strengthened thin public learning pages for content quality.');
