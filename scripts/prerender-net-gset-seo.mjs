import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { netGsetSeoUnits, netGsetUnitPath } from '../src/data/netGsetSeoUnits.js';
import { netGsetFreePdfCount, netGsetStudyPageCount, netGsetLiveUnitCount } from '../src/data/netGsetStats.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const GA_ID = 'G-6ZVG9CJEG8';
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function schemaJson(value) {
  return JSON.stringify(value).replaceAll('<', '\\u003c');
}

const css = `
:root{--ink:#132238;--navy:#0b233d;--navy2:#153f5f;--gold:#b57b16;--teal:#0f7f82;--bg:#f6f4ef;--line:#e5e1d8;--muted:#647383;--green:#246b46}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--ink);font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.65}.wrap{width:min(1120px,calc(100% - 28px));margin:auto}.top{background:var(--navy);color:white}.top .wrap{min-height:66px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{color:white;text-decoration:none;font-weight:950;letter-spacing:.02em}.top nav{display:flex;gap:6px;flex-wrap:wrap}.top nav a{color:#dce7ef;text-decoration:none;font-size:12px;font-weight:800;padding:8px 9px;border-radius:9px}.hero{padding:54px 0 34px;background:radial-gradient(circle at 86% 12%,rgba(15,127,130,.13),transparent 31%),linear-gradient(180deg,#fffefa,var(--bg))}.crumbs{font-size:12px;color:var(--muted);margin-bottom:16px}.crumbs a{color:var(--teal);font-weight:800;text-decoration:none}.eyebrow{display:inline-flex;padding:7px 11px;border-radius:999px;background:#fff4d8;border:1px solid #e2c783;color:#80580f;font-size:10px;font-weight:950;letter-spacing:.1em;text-transform:uppercase}.hero h1{font-family:Georgia,"Times New Roman",serif;font-size:clamp(37px,6vw,65px);line-height:1.04;letter-spacing:-.035em;margin:17px 0 14px;max-width:980px}.hero p{font-size:18px;color:var(--muted);max-width:880px}.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:24px}.btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;min-height:44px;padding:10px 15px;border-radius:12px;font-size:13px;font-weight:900}.primary{background:var(--navy);color:white}.secondary{background:white;color:var(--ink);border:1px solid var(--line)}.stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:25px}.stat{background:white;border:1px solid var(--line);border-radius:15px;padding:14px}.stat b{display:block;font-size:24px}.stat small{color:var(--muted)}main{padding:30px 0 76px}.section{margin-top:34px}.section h2{font-family:Georgia,"Times New Roman",serif;font-size:clamp(28px,4vw,40px);line-height:1.15;margin:0 0 10px}.section>p{color:var(--muted);max-width:880px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px;margin-top:17px}.card{background:white;border:1px solid var(--line);border-radius:17px;padding:18px}.card small{font-size:10px;font-weight:950;color:var(--gold);letter-spacing:.08em;text-transform:uppercase}.card h3{font-size:18px;line-height:1.4;margin:7px 0}.card p{font-size:13px;color:var(--muted);margin:0 0 12px}.card a{font-size:12px;font-weight:900;color:var(--teal);text-decoration:none}.unit-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:18px}.unit-link{display:block;background:white;border:1px solid var(--line);border-radius:16px;padding:17px;text-decoration:none;color:inherit}.unit-link b{display:block;font-size:17px}.unit-link span{display:block;color:var(--muted);font-size:12px;margin-top:5px}.unit-link em{display:inline-flex;margin-top:8px;color:var(--teal);font-style:normal;font-size:12px;font-weight:900}.faq{background:white;border:1px solid var(--line);border-radius:20px;padding:22px;margin-top:18px}.faq h3{font-size:17px;margin:18px 0 5px}.faq h3:first-child{margin-top:0}.faq p{color:var(--muted);margin:0}.note{background:#edf8f7;border:1px solid #b9dcda;border-radius:16px;padding:16px;color:#335f61;margin-top:18px}.pager{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-top:30px}.pager a{background:white;border:1px solid var(--line);border-radius:12px;padding:11px 14px;text-decoration:none;color:var(--ink);font-size:12px;font-weight:900}footer{background:white;border-top:1px solid var(--line);padding:28px 0;color:var(--muted);font-size:12px}@media(max-width:760px){.top nav{display:none}.stats,.grid,.unit-grid{grid-template-columns:1fr}.hero{padding-top:38px}.hero p{font-size:16px}}
`;

function analytics() {
  return `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;
}

function shell({ path, title, description, h1, eyebrow, intro, body, structuredData }) {
  const canonical = `${BASE}${path}`;
  const fullTitle = `${title} | ${SITE}`;
  return `<!doctype html><html lang="en-IN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(fullTitle)}</title><meta name="description" content="${esc(description)}"><meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"><meta name="bingbot" content="index, follow"><link rel="canonical" href="${esc(canonical)}"><meta property="og:type" content="website"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="en_IN"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${esc(canonical)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><meta name="theme-color" content="#0b233d"><style>${css}</style><script type="application/ld+json">${schemaJson(structuredData)}</script>${analytics()}</head><body><header class="top"><div class="wrap"><a class="brand" href="/">SMIT SIR COMMERCE</a><nav><a href="/study-material">Study Material</a><a href="/net-gset-commerce">43-PDF Library</a><a href="/ugc-net-commerce-notes">UGC NET</a><a href="/gset-commerce-code-17-notes">GSET</a></nav></div></header><section class="hero"><div class="wrap"><div class="crumbs"><a href="/">Home</a> / <a href="/net-gset-commerce">NET/GSET Commerce</a></div><span class="eyebrow">${esc(eyebrow)}</span><h1>${esc(h1)}</h1><p>${esc(intro)}</p><div class="actions"><a class="btn primary" href="/net-gset-commerce">Open all ${netGsetFreePdfCount} free PDFs</a><a class="btn secondary" href="/study-material">Browse all study material</a></div></div></section><main class="wrap">${body}</main><footer><div class="wrap">Smit Sir Commerce · Free Commerce learning resources · <a href="/contact" style="color:inherit;font-weight:800">Contact</a></div></footer></body></html>`;
}

async function writeRoute(path, html) {
  const relative = path.replace(/^\//, '');
  const clean = join(distRoot.pathname, `${relative}.html`);
  const directory = join(distRoot.pathname, relative, 'index.html');
  await mkdir(dirname(clean), { recursive: true });
  await mkdir(dirname(directory), { recursive: true });
  await writeFile(clean, html, 'utf8');
  await writeFile(directory, html, 'utf8');
}

function unitCards() {
  return `<div class="unit-grid">${netGsetSeoUnits.map((unit) => `<a class="unit-link" href="${esc(netGsetUnitPath(unit))}"><b>Unit ${unit.unit} · ${esc(unit.shortTitle)}</b><span>${unit.chapters.length} study PDF${unit.chapters.length === 1 ? '' : 's'} · ${unit.pages} pages</span><em>Open unit guide →</em></a>`).join('')}</div>`;
}

function hubSchema(path, name, description) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${BASE}${path}#page`, url: `${BASE}${path}`, name, description, inLanguage: 'en-IN', isPartOf: { '@id': `${BASE}/#website` }, publisher: { '@id': `${BASE}/#organization` } },
      { '@type': 'ItemList', itemListElement: netGsetSeoUnits.map((unit, index) => ({ '@type': 'ListItem', position: index + 1, name: `Unit ${unit.unit}: ${unit.title}`, url: `${BASE}${netGsetUnitPath(unit)}` })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name, item: `${BASE}${path}` }] },
    ],
  };
}

const ugcPath = '/ugc-net-commerce-notes';
const ugcDescription = `Free UGC NET Commerce notes arranged across ${netGsetLiveUnitCount} Commerce units with ${netGsetFreePdfCount} chapter-wise PDFs and ${netGsetStudyPageCount} study pages. Open unit guides and detailed PDFs.`;
await writeRoute(ugcPath, shell({
  path: ugcPath,
  title: `UGC NET Commerce Notes — ${netGsetFreePdfCount} Free PDFs, All ${netGsetLiveUnitCount} Units`,
  description: ugcDescription,
  eyebrow: 'UGC NET Commerce · Free Paper 2 library',
  h1: 'UGC NET Commerce notes, organised across all 10 units.',
  intro: `Use one structured library instead of searching for scattered chapter files. The Commerce subject library currently contains ${netGsetFreePdfCount} detailed PDFs and ${netGsetStudyPageCount} study pages. Paper 1 is separate; these pages focus on Commerce subject preparation.`,
  structuredData: hubSchema(ugcPath, 'UGC NET Commerce Notes', ugcDescription),
  body: `<section class="section"><h2>Choose your Commerce unit</h2><p>Each unit guide shows exactly what is available, the number of study PDFs and the topics covered before you open the main PDF library.</p>${unitCards()}</section><section class="section"><h2>What is inside this free UGC NET Commerce library?</h2><p>The material covers Business Environment, Accounting and Auditing, Business Economics, Business Finance, Statistics and Research Methods, Management and HRM, Banking, Marketing, Business Law and Income-tax / Corporate Tax Planning.</p><div class="note">This is a study-resource library. Always match preparation with the current official NTA notification and syllabus for your exam cycle.</div></section><section class="section"><h2>Frequently asked questions</h2><div class="faq"><h3>Are the UGC NET Commerce notes free?</h3><p>Yes. The chapter-wise PDFs linked through this library are available as free study resources.</p><h3>Does this page include UGC NET Paper 1?</h3><p>No. This ${netGsetFreePdfCount}-PDF collection is focused on the Commerce subject material. Paper 1 should be prepared separately.</p><h3>Can I download the PDFs?</h3><p>Yes. The main NET/GSET Commerce library provides Open PDF and Download PDF actions for the available chapters.</p></div></section>`,
}));

const gsetPath = '/gset-commerce-code-17-notes';
const gsetDescription = `Free GSET Commerce Code 17 notes with ${netGsetFreePdfCount} chapter-wise PDFs, ${netGsetStudyPageCount} study pages and all ${netGsetLiveUnitCount} Commerce units organised for revision.`;
await writeRoute(gsetPath, shell({
  path: gsetPath,
  title: `GSET Commerce Code 17 Notes — ${netGsetFreePdfCount} Free PDFs`,
  description: gsetDescription,
  eyebrow: 'GSET Commerce · Code 17',
  h1: 'GSET Commerce Code 17 notes, unit by unit.',
  intro: `The free Commerce library is organised into ${netGsetLiveUnitCount} units, ${netGsetFreePdfCount} detailed chapter PDFs and ${netGsetStudyPageCount} study pages so Gujarat SET aspirants can move from syllabus area to chapter notes without hunting through separate files.`,
  structuredData: hubSchema(gsetPath, 'GSET Commerce Code 17 Notes', gsetDescription),
  body: `<section class="section"><h2>Choose your GSET Commerce unit</h2><p>Open a unit guide first, see the exact chapter coverage, then jump into the shared PDF library.</p>${unitCards()}</section><section class="section"><h2>Built for structured revision</h2><p>The unit map covers Business Environment and International Business through Income-tax and Corporate Tax Planning. The shared chapter PDFs can also support overlapping UGC NET Commerce preparation, while exam-specific notifications and rules should always be checked from the relevant official authority.</p><div class="note">GSET schedules, eligibility rules and notifications can change. Use this site for learning material and confirm current exam administration details from the official GSET source.</div></section><section class="section"><h2>Frequently asked questions</h2><div class="faq"><h3>How many GSET Commerce PDFs are available?</h3><p>The current library contains ${netGsetFreePdfCount} chapter-wise PDFs across all ${netGsetLiveUnitCount} unit areas.</p><h3>Are these only for GSET?</h3><p>No. Much of the Commerce subject content overlaps with UGC NET Commerce, so the shared unit library can support preparation for both while keeping exam-specific rules separate.</p><h3>Where can I see all PDFs together?</h3><p>Use the main NET/GSET Commerce PDF library to search chapters, open files and download available notes.</p></div></section>`,
}));

for (const unit of netGsetSeoUnits) {
  const path = netGsetUnitPath(unit);
  const description = `UGC NET and GSET Commerce Unit ${unit.unit} ${unit.shortTitle} notes: ${unit.chapters.length} free chapter PDFs, ${unit.pages} study pages and topic-wise revision coverage.`;
  const previous = netGsetSeoUnits[unit.unit - 2];
  const next = netGsetSeoUnits[unit.unit];
  const chapterList = unit.chapters.map(([title, pages, topics], index) => `<article class="card"><small>Unit ${unit.unit} · Study chapter ${index + 1}</small><h3>${esc(title)}</h3><p>${esc(topics)}</p><a href="/net-gset-commerce#unit-${unit.unit}">Open this unit in the PDF library →</a><div style="margin-top:8px;font-size:11px;color:var(--muted)">${pages} study pages</div></article>`).join('');
  const faq = [
    [`How many PDFs are in Unit ${unit.unit}?`, `Unit ${unit.unit} currently contains ${unit.chapters.length} chapter-wise study PDFs with ${unit.pages} pages in total.`],
    [`What does Unit ${unit.unit} cover?`, unit.summary],
    ['Can these notes be used for both UGC NET Commerce and GSET Commerce?', 'They are organised as shared Commerce subject study material for areas that overlap across the two exams. Always compare your preparation with the current official syllabus and notification for the exam you are taking.'],
  ];
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'CollectionPage', '@id': `${BASE}${path}#page`, url: `${BASE}${path}`, name: `Commerce Unit ${unit.unit}: ${unit.title} Notes`, description, inLanguage: 'en-IN', isPartOf: { '@id': `${BASE}/#website` }, publisher: { '@id': `${BASE}/#organization` } },
      { '@type': 'ItemList', numberOfItems: unit.chapters.length, itemListElement: unit.chapters.map(([title], index) => ({ '@type': 'ListItem', position: index + 1, name: title, url: `${BASE}/net-gset-commerce#unit-${unit.unit}` })) },
      { '@type': 'FAQPage', mainEntity: faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
      { '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE}/` }, { '@type': 'ListItem', position: 2, name: 'NET/GSET Commerce PDF Library', item: `${BASE}/net-gset-commerce` }, { '@type': 'ListItem', position: 3, name: `Unit ${unit.unit}: ${unit.title}`, item: `${BASE}${path}` }] },
    ],
  };
  const pager = `<div class="pager">${previous ? `<a href="${esc(netGsetUnitPath(previous))}">← Unit ${previous.unit}: ${esc(previous.shortTitle)}</a>` : '<span></span>'}${next ? `<a href="${esc(netGsetUnitPath(next))}">Unit ${next.unit}: ${esc(next.shortTitle)} →</a>` : `<a href="${ugcPath}">UGC NET Commerce hub →</a>`}</div>`;
  await writeRoute(path, shell({
    path,
    title: `Unit ${unit.unit} ${unit.shortTitle} Notes — UGC NET & GSET Commerce`,
    description,
    eyebrow: `Commerce Unit ${unit.unit} · UGC NET + GSET`,
    h1: `Unit ${unit.unit}: ${unit.title} notes`,
    intro: `${unit.summary} This unit currently has ${unit.chapters.length} detailed study PDFs containing ${unit.pages} pages.`,
    structuredData,
    body: `<section class="section"><h2>Chapter-wise Unit ${unit.unit} coverage</h2><p>Use these chapter divisions as a revision path. Open the shared PDF library when you are ready to read or download the detailed notes.</p><div class="grid">${chapterList}</div></section><section class="section"><h2>How to study this unit efficiently</h2><p>Start with the chapter that contains your weakest concepts, note definitions and relationships, then test recall before moving to the next chapter. After one complete pass, revise the unit as a connected topic instead of memorising isolated lines.</p><div class="actions"><a class="btn primary" href="/net-gset-commerce#unit-${unit.unit}">Open Unit ${unit.unit} PDFs</a><a class="btn secondary" href="${ugcPath}">UGC NET Commerce notes</a><a class="btn secondary" href="${gsetPath}">GSET Code 17 notes</a></div></section><section class="section"><h2>Unit ${unit.unit} questions students ask</h2><div class="faq">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>${pager}`,
  }));
}

// Strengthen the existing master library after Vite has copied public/ into dist/.
const libraryPaths = [new URL('../dist/net-gset-commerce.html', import.meta.url), new URL('../dist/net-gset-commerce/index.html', import.meta.url)];
for (const libraryPath of libraryPaths) {
  try {
    let html = await readFile(libraryPath, 'utf8');
    const title = `UGC NET & GSET Commerce Notes — ${netGsetFreePdfCount} Free PDFs, ${netGsetLiveUnitCount} Units | ${SITE}`;
    const description = `Free UGC NET Commerce and GSET Code 17 notes: ${netGsetFreePdfCount} detailed chapter PDFs, ${netGsetStudyPageCount} study pages and all ${netGsetLiveUnitCount} Commerce units.`;
    html = html
      .replace(/<title>.*?<\/title>/s, `<title>${esc(title)}</title>`)
      .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${esc(description)}" />`)
      .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${esc(description)}" />`);

    if (!html.includes('data-unit-seo-guides="true"')) {
      const guideSection = `<section class="syllabus" data-unit-seo-guides="true"><h2>Unit-by-unit NET / GSET study guides</h2><p>Prefer a focused unit page before opening the full library? These guides show chapter coverage, page counts and the topics inside each unit.</p><div class="units">${netGsetSeoUnits.map((unit) => `<a class="unit-map live" href="${esc(netGsetUnitPath(unit))}" style="text-decoration:none;color:inherit"><b>Unit ${unit.unit} · ${esc(unit.shortTitle)}</b><span>${unit.chapters.length} study PDFs · ${unit.pages} pages</span><div class="live-pill">Open guide</div></a>`).join('')}</div><div class="note"><a href="${ugcPath}" style="font-weight:900;color:inherit">UGC NET Commerce notes hub</a> · <a href="${gsetPath}" style="font-weight:900;color:inherit">GSET Commerce Code 17 notes hub</a></div></section>`;
      html = html.replace('</main>', `${guideSection}</main>`);
    }
    await writeFile(libraryPath, html, 'utf8');
  } catch {
    // The clean-URL directory copy may not exist before this script; the .html file is the required source.
  }
}

console.log(`Prerendered ${netGsetSeoUnits.length} NET/GSET unit SEO pages plus UGC NET and GSET search hubs.`);
