import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { authorityGuides } from '../src/data/authorityGuides.js';

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

function body(guide) {
  return `<main class="page-container section-padding" data-prerendered="authority-guide"><nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/cbse-practice">CBSE Practice</a> / ${esc(guide.shortTitle)}</nav><article><h1>${esc(guide.title)}</h1><p>${esc(guide.intro)}</p><p><strong>Prepared by Smit Sir</strong> · Updated ${esc(guide.updated)} · Free revision resource</p>${guide.sections.map(section=>`<section><h2>${esc(section.title)}</h2><p>${esc(section.text)}</p><ul>${section.links.map(([path,label])=>`<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul></section>`).join('')}<h2>Frequently asked questions</h2>${guide.faqs.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}<h2>Editorial transparency</h2><p>This guide links to material actually published on Smit Sir Commerce. Original practice is not presented as an official CBSE paper. Students should check the latest official CBSE curriculum and sample papers for current requirements.</p><p><a href="/about">About Smit Sir</a> · <a href="/cbse-practice">CBSE Practice Library</a> · <a href="/cbse-notes">Free CBSE Notes</a></p></article></main>`;
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
