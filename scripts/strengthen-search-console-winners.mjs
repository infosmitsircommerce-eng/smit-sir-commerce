import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const SITE = 'https://www.smitsircommerce.in';

const winners = [
  {
    path: '/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions',
    heading: 'Solved case study: Nature and Significance of Management',
    scenario: 'A growing food company sets a target to reduce delivery delays without increasing avoidable cost. The operations manager coordinates production, sales and finance, assigns responsibilities and reviews whether the target is being achieved on time.',
    qa: [
      ['Which two management objectives are visible?', 'Effectiveness and efficiency. Effectiveness means achieving the stated target; efficiency means doing so with minimum avoidable cost and waste.'],
      ['Why is coordination important in this situation?', 'The departments are interdependent. Coordination aligns their activities so production, sales and finance work toward the same organisational goal.'],
      ['Which management idea is shown when responsibilities are assigned and progress is reviewed?', 'Management is a continuous process involving functions such as organising and controlling rather than a one-time activity.'],
    ],
  },
  {
    path: '/practice/cbse/class-12/business-studies/business-environment-case-study-questions',
    heading: 'Solved case study: Business Environment',
    scenario: 'A packaged-food business notices new labelling rules, rising demand for healthier products and rapid growth in app-based ordering. Management changes its packaging, product mix and digital distribution plan instead of continuing with the old strategy.',
    qa: [
      ['Which dimensions of business environment are visible?', 'Legal environment is reflected in labelling rules, social environment in preference for healthier products, and technological environment in app-based ordering.'],
      ['What significance of business environment is shown?', 'Understanding the environment helps a business identify opportunities and threats and adapt its strategy before changes become serious problems.'],
      ['Why can the firm not control these changes directly?', 'Business environment consists largely of external forces. A firm can respond to them, but it normally cannot control them by itself.'],
    ],
  },
  {
    path: '/practice/cbse/class-12/business-studies/planning-case-study-questions',
    heading: 'Solved case study: Planning',
    scenario: 'A retail company wants to increase online sales by 20% during the next quarter. Managers first define the target, study different promotional alternatives, compare their likely cost and reach, choose a plan and set a budget for implementation.',
    qa: [
      ['Which planning step is shown first?', 'Setting objectives. The company first states a measurable target: increasing online sales by 20% during the next quarter.'],
      ['What happens when managers compare promotional alternatives?', 'They are evaluating alternative courses of action before selecting the most suitable plan.'],
      ['Why does the budget matter?', 'A budget is a numerical plan. It expresses expected expenditure or results in quantitative terms and supports implementation and control.'],
    ],
  },
  {
    path: '/practice/cbse/class-12/business-studies/controlling-case-study-questions',
    heading: 'Solved case study: Controlling',
    scenario: 'A manufacturer fixes a monthly defect standard of 2%. At month-end the actual defect rate is 5%. The production manager investigates the significant deviation, finds a machine-calibration problem and schedules corrective maintenance.',
    qa: [
      ['Which controlling steps are visible?', 'Setting standards, measuring actual performance, comparing actual performance with standards, analysing deviations and taking corrective action.'],
      ['What does the 3 percentage-point gap represent?', 'It is a deviation between the standard performance of 2% defects and actual performance of 5% defects.'],
      ['Which idea supports focusing attention on this significant gap?', 'Management by exception: managers concentrate attention on important deviations rather than treating every small variation equally.'],
    ],
  },
];

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function answerBlock(item) {
  return `<section data-search-console-upgrade="case-study" style="margin:32px 0;padding:24px;border:1px solid #ead7a7;border-radius:20px;background:#fffaf0"><p style="font-weight:800;letter-spacing:.08em;font-size:12px;color:#946915">ANSWER-FIRST PRACTICE</p><h2>${item.heading}</h2><p>${item.scenario}</p>${item.qa.map(([q,a],i)=>`<section><h3>Q${i+1}. ${q}</h3><p><strong>Answer:</strong> ${a}</p></section>`).join('')}<p><em>These are original learning questions prepared by Smit Sir Commerce, not claimed official CBSE questions.</em></p></section>`;
}

function setTitle(html, title) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${title}</title>`);
}

function setDescription(html, description) {
  if (/<meta\s+name=["']description["'][^>]*>/i.test(html)) {
    return html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${description}">`);
  }
  return html.replace('</head>', `<meta name="description" content="${description}">\n</head>`);
}

function addBeforeLearning(html, marker, block) {
  if (html.includes(marker)) return html;
  const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</main>', '</article>'];
  for (const anchor of anchors) {
    if (html.includes(anchor)) return html.replace(anchor, `${block}${anchor}`);
  }
  return html.replace('</body>', `${block}</body>`);
}

async function patchRoute(path, patcher) {
  let patched = 0;
  for (const file of routeFiles(path)) {
    try {
      const html = await readFile(file, 'utf8');
      const next = patcher(html);
      if (next !== html) {
        await writeFile(file, next, 'utf8');
        patched += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
  return patched;
}

for (const item of winners) {
  for (const file of routeFiles(item.path)) {
    try {
      let html = await readFile(file, 'utf8');
      html = html
        .replaceAll('noindex, follow, noarchive', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
        .replaceAll('Case Study Questions | Smit Sir Commerce', 'Case Study Questions with Answers | Smit Sir Commerce');
      if (!html.includes('data-search-console-upgrade="case-study"')) {
        const anchor = '<h2>Continue learning</h2>';
        if (html.includes(anchor)) html = html.replace(anchor, `${answerBlock(item)}${anchor}`);
      }
      html = html.replace('</head>', `<meta name="author" content="Smit Thaker" /><meta name="article:author" content="${SITE}/about#smit-thaker" />\n</head>`);
      await writeFile(file, html, 'utf8');
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

// Search Console traffic sprint: strengthen pages Google is already testing.
const trafficTargets = [
  {
    path: '/cbse/class-12/business-studies-case-study-questions',
    title: 'Class 12 Business Studies Case Study Questions with Answers 2026-27 | CBSE',
    description: 'Practice chapter-wise CBSE Class 12 Business Studies case study questions with answers for 2026-27. Includes Management, Business Environment, Planning, Controlling and exam-solving guidance.',
    marker: 'data-traffic-winner="bst-case-study-hub"',
    block: `<section data-traffic-winner="bst-case-study-hub" style="margin:32px 0;padding:24px;border:1px solid #e7d5aa;border-radius:20px;background:#fffdf7"><p style="font-weight:800;letter-spacing:.08em;font-size:12px;color:#8b641c">2026-27 BOARD PRACTICE</p><h2>Class 12 Business Studies case study questions with answers</h2><p>Use these chapter-focused sets to practise the exact skill CBSE case studies demand: identify the concept from the situation, quote the clue, name the principle or function, and explain it in exam language.</p><ul><li><a href="/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions">Chapter 1: Nature and Significance of Management case study questions</a></li><li><a href="/practice/cbse/class-12/business-studies/business-environment-case-study-questions">Chapter 3: Business Environment case study questions with answers</a></li><li><a href="/practice/cbse/class-12/business-studies/planning-case-study-questions">Planning case study questions with solutions</a></li><li><a href="/practice/cbse/class-12/business-studies/controlling-case-study-questions">Controlling case study questions with answers</a></li></ul><p><strong>Fast exam method:</strong> read the requirement first, underline the clue in the case, identify the chapter concept, then write the answer using the textbook keyword plus one line linking it back to the case.</p></section>`,
  },
  {
    path: '/cbse/class-12/business-studies/business-environment-notes',
    title: 'Business Environment Class 12 Notes 2026-27 | CBSE Chapter 3',
    description: 'Free Business Environment Class 12 notes for CBSE 2026-27: meaning, features, importance, dimensions, LPG reforms, demonetisation, GST, case-study clues and quick revision.',
    marker: 'data-traffic-winner="business-environment"',
    block: `<section data-traffic-winner="business-environment" style="margin:32px 0;padding:24px;border:1px solid #dbe7f4;border-radius:20px;background:#f8fbff"><p style="font-weight:800;letter-spacing:.08em;font-size:12px;color:#315f8b">CHAPTER 3 QUICK REVISION</p><h2>Business Environment Class 12 notes: what to revise first</h2><p>For board revision, focus first on the meaning and features of business environment, its importance, the economic, social, technological, political and legal dimensions, New Economic Policy/LPG reforms, demonetisation and the impact of government policy changes on business.</p><h3>High-value case-study clues</h3><p><strong>Interest rates, inflation, income:</strong> Economic environment. <strong>Changing lifestyles or working population:</strong> Social environment. <strong>Apps, automation, patents:</strong> Technological environment. <strong>Laws, court orders, regulations:</strong> Legal environment.</p><p><a href="/practice/cbse/class-12/business-studies/business-environment-case-study-questions">Practise Business Environment case study questions with answers →</a></p></section>`,
  },
  {
    path: '/cbse/class-12/business-studies/controlling-notes',
    title: 'Controlling Class 12 Notes 2026-27 | CBSE Business Studies Chapter 8',
    description: 'Free Controlling Class 12 Business Studies notes for CBSE 2026-27: meaning, importance, planning-controlling relationship, steps, deviations, management by exception and revision questions.',
    marker: 'data-traffic-winner="controlling-notes"',
    block: `<section data-traffic-winner="controlling-notes" style="margin:32px 0;padding:24px;border:1px solid #dfe6d5;border-radius:20px;background:#fbfff7"><p style="font-weight:800;letter-spacing:.08em;font-size:12px;color:#50702f">CHAPTER 8 QUICK REVISION</p><h2>Controlling Class 12 notes: the five-step answer</h2><ol><li>Setting performance standards</li><li>Measurement of actual performance</li><li>Comparison of actual performance with standards</li><li>Analysing deviations</li><li>Taking corrective action</li></ol><p><strong>Exam trigger:</strong> when a case says managers focus only on major deviations, think <em>management by exception</em>. When a standard is compared with actual performance, the difference is a <em>deviation</em>.</p><p><a href="/practice/cbse/class-12/business-studies/controlling-case-study-questions">Practise Controlling case study questions with answers →</a></p></section>`,
  },
  {
    path: '/tools/net-indirect-tax-calculator',
    title: 'Net Indirect Tax Formula & Calculator | Class 12 Economics',
    description: 'Calculate Net Indirect Tax for Class 12 Economics. Formula: NIT = Indirect Taxes - Subsidies, with quick examples and national income conversion guidance.',
    marker: 'data-traffic-winner="nit-calculator"',
    block: `<section data-traffic-winner="nit-calculator" style="margin:28px 0;padding:22px;border:1px solid #d9e5f5;border-radius:18px;background:#f8fbff"><h2>Net Indirect Tax formula</h2><p><strong>Net Indirect Tax (NIT) = Indirect Taxes − Subsidies.</strong></p><p>In Class 12 national income numericals, NIT is used when converting values measured at factor cost and market price. If indirect taxes are greater than subsidies, NIT is positive.</p><h3>Quick example</h3><p>If indirect taxes are ₹80 crore and subsidies are ₹20 crore, Net Indirect Tax = ₹80 crore − ₹20 crore = <strong>₹60 crore</strong>.</p></section>`,
  },
  {
    path: '/tools/topics/national-income-gdp',
    title: 'National Income Calculator & GDP/NDP/NNP Formulas | Class 12 Economics',
    description: 'Class 12 National Income calculator and formula guide for GDP, NDP, GNP/GNI, NNP, depreciation, NFIA and net indirect taxes with quick conversion rules.',
    marker: 'data-traffic-winner="national-income"',
    block: `<section data-traffic-winner="national-income" style="margin:28px 0;padding:22px;border:1px solid #e4ddf2;border-radius:18px;background:#fcfaff"><h2>National Income formulas for Class 12</h2><ul><li><strong>NDP = GDP − Depreciation</strong></li><li><strong>GNP/GNI = GDP + Net Factor Income from Abroad (NFIA)</strong></li><li><strong>NNP = GNP − Depreciation</strong></li><li><strong>Net Indirect Tax = Indirect Taxes − Subsidies</strong></li></ul><p>Use the calculator tools on this page to move between domestic/national, gross/net and market-price/factor-cost measures without mixing up the adjustment signs.</p><p><a href="/tools/net-indirect-tax-calculator">Open the Net Indirect Tax calculator →</a></p></section>`,
  },
  {
    path: '/economics-tuition-mehsana',
    title: 'Economics Tuition in Mehsana for Class 11 & 12 | Smit Sir Commerce',
    description: 'Economics tuition in Mehsana for Class 11 and 12 Commerce students with concept-first teaching, CBSE/GSEB notes, numericals, revision and exam practice by Smit Sir Commerce.',
    marker: 'data-traffic-winner="economics-mehsana"',
    block: `<section data-traffic-winner="economics-mehsana" style="margin:28px 0;padding:22px;border:1px solid #eadfca;border-radius:18px;background:#fffdf8"><h2>Class 11 & 12 Economics support in Mehsana</h2><p>Smit Sir Commerce focuses on concept clarity first, followed by board-oriented notes, diagrams, numericals, revision questions and regular practice for Commerce students studying Economics.</p><p>Students can also use the free Economics resources on this website before deciding whether they need additional teaching support.</p><p><a href="/study-material">Open free Economics study material →</a></p></section>`,
  },
];

let trafficPatched = 0;
for (const target of trafficTargets) {
  trafficPatched += await patchRoute(target.path, (input) => {
    let html = input;
    html = setTitle(html, target.title);
    html = setDescription(html, target.description);
    html = addBeforeLearning(html, target.marker, target.block);
    return html;
  });
}

// Keep first-party GEO/AI discovery files aligned with current canonical routes.
try {
  const llmsPath = join(dist.pathname, 'llms.txt');
  let llms = await readFile(llmsPath, 'utf8');
  llms = llms.replaceAll(
    'https://www.smitsircommerce.in/cbse-class-12-business-studies-case-study-questions.html',
    'https://www.smitsircommerce.in/cbse/class-12/business-studies-case-study-questions',
  );
  if (!llms.includes('GSEB Class 11 Accountancy Premium Part 1')) {
    llms += `\n\n## Current Premium Accountancy resource\n- GSEB Class 11 Accountancy Premium Part 1: ${SITE}/gseb-class-11-accountancy-premium.html\n- Covers all 10 Part 1 chapters in a protected 720-page complete-book system with detailed explanations, accounting formats, worked numericals and revision practice.\n- The free Accountancy hub remains available separately at ${SITE}/gseb-class-11-accountancy-notes.\n`;
  }
  if (!llms.includes('## Search Console priority learning pages')) {
    llms += `\n## Search Console priority learning pages\n- CBSE Class 12 Business Studies Case Study Questions: ${SITE}/cbse/class-12/business-studies-case-study-questions\n- Nature and Significance of Management case studies: ${SITE}${winners[0].path}\n- Business Environment case studies: ${SITE}${winners[1].path}\n- Planning case studies: ${SITE}${winners[2].path}\n- Controlling case studies: ${SITE}${winners[3].path}\n`;
  }
  if (!llms.includes('## Current organic traffic priorities')) {
    llms += `\n## Current organic traffic priorities\n- Class 12 Business Studies case-study questions with answers: ${SITE}/cbse/class-12/business-studies-case-study-questions\n- Business Environment Class 12 notes: ${SITE}/cbse/class-12/business-studies/business-environment-notes\n- Controlling Class 12 notes: ${SITE}/cbse/class-12/business-studies/controlling-notes\n- Net Indirect Tax formula and calculator: ${SITE}/tools/net-indirect-tax-calculator\n- National Income formulas and calculator: ${SITE}/tools/topics/national-income-gdp\n`;
  }
  await writeFile(llmsPath, llms, 'utf8');
} catch (error) {
  console.warn('[search-console] llms.txt patch skipped:', error.message);
}

try {
  const summaryPath = join(dist.pathname, 'ai-summary.json');
  const summary = JSON.parse(await readFile(summaryPath, 'utf8'));
  summary.importantPages ||= {};
  summary.importantPages.cbseBusinessStudiesCaseStudyQuestions = `${SITE}/cbse/class-12/business-studies-case-study-questions`;
  summary.importantPages.gsebClass11AccountancyPremium = `${SITE}/gseb-class-11-accountancy-premium.html`;
  summary.importantPages.businessEnvironmentClass12Notes = `${SITE}/cbse/class-12/business-studies/business-environment-notes`;
  summary.importantPages.controllingClass12Notes = `${SITE}/cbse/class-12/business-studies/controlling-notes`;
  summary.importantPages.netIndirectTaxCalculator = `${SITE}/tools/net-indirect-tax-calculator`;
  summary.importantPages.nationalIncomeCalculator = `${SITE}/tools/topics/national-income-gdp`;
  summary.queryRouting ||= {};
  summary.queryRouting['CBSE Class 12 Business Studies case study questions'] = `${SITE}/cbse/class-12/business-studies-case-study-questions`;
  summary.queryRouting['Business Environment Class 12 notes'] = `${SITE}/cbse/class-12/business-studies/business-environment-notes`;
  summary.queryRouting['Controlling Class 12 notes'] = `${SITE}/cbse/class-12/business-studies/controlling-notes`;
  summary.queryRouting['Net Indirect Tax formula'] = `${SITE}/tools/net-indirect-tax-calculator`;
  summary.queryRouting['National Income calculator'] = `${SITE}/tools/topics/national-income-gdp`;
  summary.queryRouting['GSEB Class 11 Accountancy premium book'] = `${SITE}/gseb-class-11-accountancy-premium.html`;
  summary.recommendedForQueries ||= [];
  for (const query of [
    'CBSE Class 12 Business Studies case study questions with answers',
    'Business Environment Class 12 notes',
    'Controlling Class 12 notes PDF',
    'Net Indirect Tax formula Class 12',
    'National Income calculator Class 12',
    'GSEB Class 11 Accountancy premium book',
  ]) {
    if (!summary.recommendedForQueries.includes(query)) summary.recommendedForQueries.push(query);
  }
  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, 'utf8');
} catch (error) {
  console.warn('[search-console] ai-summary patch skipped:', error.message);
}

try {
  const discoveryPath = join(dist.pathname, 'ai-discovery.html');
  let discovery = await readFile(discoveryPath, 'utf8');
  discovery = discovery.replaceAll('with Chapter 8 clearly marked as coming soon.', 'with free concept notes, plus a separate protected Premium Part 1 complete-book edition.');
  if (!discovery.includes('/gseb-class-11-accountancy-premium.html')) {
    discovery = discovery.replace(
      '<div class="card"><strong>GSEB Economics</strong>',
      `<div class="card"><strong>GSEB Class 11 Accountancy Premium</strong><br><a href="/gseb-class-11-accountancy-premium.html">/gseb-class-11-accountancy-premium.html</a><p>All 10 Part 1 chapters in the protected 720-page Premium complete-book system.</p></div>\n        <div class="card"><strong>CBSE Business Studies case studies</strong><br><a href="/cbse/class-12/business-studies-case-study-questions">/cbse/class-12/business-studies-case-study-questions</a><p>Chapter-wise original case-study practice with answer guidance.</p></div>\n        <div class="card"><strong>GSEB Economics</strong>`,
    );
  }
  await writeFile(discoveryPath, discovery, 'utf8');
} catch (error) {
  console.warn('[search-console] ai-discovery patch skipped:', error.message);
}

// Consolidate educator identity for GEO across prerendered structured data.
async function walk(dir) {
  const { readdir } = await import('node:fs/promises');
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walk(full);
    else if (entry.name.endsWith('.html')) {
      const html = await readFile(full, 'utf8');
      const next = html.replaceAll(`${SITE}/#teacher`, `${SITE}/about#smit-thaker`);
      if (next !== html) await writeFile(full, next, 'utf8');
    }
  }
}
await walk(dist.pathname);

console.log(`[search-console] Strengthened ${winners.length} priority case-study routes, ${trafficTargets.length} traffic winners (${trafficPatched} generated files patched), and refreshed GEO discovery data.`);
