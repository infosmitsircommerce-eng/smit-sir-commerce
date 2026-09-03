import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { authorityGuides } from '../src/data/authorityGuides.js';
import { authorityEnhancements } from '../src/data/highIntentEnhancements.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function schema(guide) {
  return {
    '@context':'https://schema.org',
    '@graph':[
      { '@type':'LearningResource', name:guide.title, description:guide.description, url:`${BASE}${guide.path}`, isAccessibleForFree:true, inLanguage:'en-IN', datePublished:guide.updated, dateModified:guide.updated, learningResourceType:'Revision guide', author:{'@id':`${BASE}/#teacher`}, provider:{'@id':`${BASE}/#organization`} },
      { '@type':'FAQPage', mainEntity:guide.faqs.map(([question,answer])=>({ '@type':'Question', name:question, acceptedAnswer:{'@type':'Answer',text:answer} })) },
      { '@type':'BreadcrumbList', itemListElement:[{ '@type':'ListItem',position:1,name:'Home',item:`${BASE}/`},{ '@type':'ListItem',position:2,name:'CBSE Practice',item:`${BASE}/cbse-practice`},{ '@type':'ListItem',position:3,name:guide.shortTitle,item:`${BASE}${guide.path}`}] },
    ],
  };
}

function enhancementBody(guide) {
  const enhancement = authorityEnhancements[guide.path] || {};
  const answerFramework = enhancement.answerFramework?.length ? `<section><h2>Board-ready answer framework</h2><p>Match the depth of the answer to what the question asks. These are practice presentation guidelines, not a marks guarantee.</p><ul>${enhancement.answerFramework.map(([label,text])=>`<li><strong>${esc(label)}:</strong> ${esc(text)}</li>`).join('')}</ul></section>` : '';
  const chapterStrategy = enhancement.chapterStrategy?.length ? `<section><h2>Chapter-by-chapter question focus</h2><ul>${enhancement.chapterStrategy.map(([chapter,focus])=>`<li><strong>${esc(chapter)}:</strong> ${esc(focus)}</li>`).join('')}</ul></section>` : '';
  const caseMethod = enhancement.caseMethod?.length ? `<section><h2>5-step case-study method</h2><ol>${enhancement.caseMethod.map(step=>`<li>${esc(step)}</li>`).join('')}</ol></section>` : '';
  const caselets = enhancement.caselets?.length ? `<section><h2>${enhancement.caselets.length} original caselets with answer guidance</h2><p>These caselets are original concept-application practice and are not presented as official CBSE questions.</p>${enhancement.caselets.map((item,index)=>`<article><h3>Case ${index+1}: ${esc(item.chapter)}</h3><p>${esc(item.prompt)}</p><p><strong>${esc(item.question)}</strong></p><p><strong>Answer guidance:</strong> ${esc(item.answer)}</p></article>`).join('')}</section>` : '';
  const related = enhancement.relatedLearning?.length ? `<section><h2>Continue your Business Studies revision</h2><ul>${enhancement.relatedLearning.map(([path,label])=>`<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul></section>` : '';
  return `${answerFramework}${caseMethod}${chapterStrategy}${caselets}${related}`;
}

function body(guide) {
  const enhancement = authorityEnhancements[guide.path] || {};
  return `<main class="page-container section-padding" data-prerendered="authority-guide"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/cbse-practice">CBSE Practice</a> / ${esc(guide.shortTitle)}</nav><article><h1>${esc(guide.title)}</h1><p>${esc(guide.intro)}</p><p><strong>Prepared by Smit Sir</strong> · Updated ${esc(guide.updated)} · Free revision resource${enhancement.yearLabel ? ` · ${esc(enhancement.yearLabel)}` : ''}</p>${enhancementBody(guide)}${guide.sections.map(section=>`<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p><ul>${section.links.map(([path,label])=>`<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul></section>`).join('')}<h2>Frequently asked questions</h2>${guide.faqs.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}<h2>Editorial transparency</h2><p>This guide links to material actually published on Smit Sir Commerce. Original practice is not presented as an official CBSE paper. Students should check the latest official CBSE curriculum and sample papers for current requirements.</p><p><a href="/about">About Smit Sir</a> · <a href="/cbse-practice">CBSE Practice Library</a> · <a href="/cbse-notes">Free CBSE Notes</a> · <a href="/book-demo">Free Paper Analysis</a></p></article></main>`;
}

function html(guide) {
  const fullTitle = `${guide.title} | ${SITE}`;
  const url = `${BASE}${guide.path}`;
  const robots='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const tags=`\n<meta name="description" content="${esc(guide.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${esc(url)}"><meta property="og:type" content="article"><meta property="og:site_name" content="${SITE}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(guide.description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta property="article:published_time" content="${guide.updated}"><meta property="article:modified_time" content="${guide.updated}"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(guide.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(schema(guide)).replaceAll('<','\\u003c')}</script>`;
  return source.replace(/<title>.*?<\/title>/s,`<title>${esc(fullTitle)}</title>`).replace('</head>',`${tags}\n</head>`).replace('<div id="root"></div>',`<div id="root">${body(guide)}</div>`);
}

async function writeRoute(path, content) {
  const relative=path.replace(/^\//,'');
  const clean=join(distRoot.pathname,`${relative}.html`);
  const directory=join(distRoot.pathname,relative,'index.html');
  await mkdir(dirname(clean),{recursive:true});
  await mkdir(dirname(directory),{recursive:true});
  await writeFile(clean,content,'utf8');
  await writeFile(directory,content,'utf8');
}

for (const guide of authorityGuides) await writeRoute(guide.path,html(guide));
console.log(`Pre-rendered ${authorityGuides.length} evergreen authority guides.`);
