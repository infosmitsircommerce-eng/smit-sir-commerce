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
  summary.queryRouting ||= {};
  summary.queryRouting['CBSE Class 12 Business Studies case study questions'] = `${SITE}/cbse/class-12/business-studies-case-study-questions`;
  summary.queryRouting['GSEB Class 11 Accountancy premium book'] = `${SITE}/gseb-class-11-accountancy-premium.html`;
  summary.recommendedForQueries ||= [];
  for (const query of ['CBSE Class 12 Business Studies case study questions with answers','GSEB Class 11 Accountancy premium book']) {
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
      let html = await readFile(full, 'utf8');
      const next = html.replaceAll(`${SITE}/#teacher`, `${SITE}/about#smit-thaker`);
      if (next !== html) await writeFile(full, next, 'utf8');
    }
  }
}
await walk(dist.pathname);

console.log(`[search-console] Strengthened ${winners.length} priority case-study routes and refreshed GEO discovery data.`);
