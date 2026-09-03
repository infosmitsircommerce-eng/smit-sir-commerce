import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { localizedPilotPages, localizedAlternatesByPath, languageLinksForPage } from '../src/data/localizedPilot.js';

const BASE = 'https://www.smitsircommerce.in';
const SITE = 'Smit Sir Commerce';
const source = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const distRoot = new URL('../dist/', import.meta.url);

function esc(value) {
  return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
}

function schema(page) {
  return {
    '@context':'https://schema.org',
    '@graph':[
      {
        '@type':'LearningResource',
        name:page.title,
        description:page.description,
        url:page.url,
        inLanguage:page.languageTag,
        isAccessibleForFree:true,
        dateModified:page.updated,
        learningResourceType:'Study guide',
        provider:{'@id':`${BASE}/#organization`},
      },
      {
        '@type':'FAQPage',
        mainEntity:page.faqs.map(([question,answer])=>({ '@type':'Question', name:question, acceptedAnswer:{ '@type':'Answer', text:answer } })),
      },
    ],
  };
}

function body(page) {
  const links = languageLinksForPage(page);
  const isHindi = page.lang === 'hi';
  const sectionLabel = isHindi ? 'Concept explanation' : 'Concept સમજ';
  const resourceLabel = isHindi ? 'Practice और calculators' : 'Practice અને calculators';
  const faqLabel = isHindi ? 'अक्सर पूछे जाने वाले सवाल' : 'વારંવાર પૂછાતા પ્રશ્નો';
  const note = isHindi
    ? 'कुछ linked calculators/resources अभी English interface में खुलते हैं। यह controlled multilingual pilot है।'
    : 'કેટલાક linked calculators/resources હાલમાં English interfaceમાં ખુલશે. આ controlled multilingual pilot છે.';

  return `<main class="page-container section-padding" data-prerendered="localized-pilot" lang="${page.lang}">
    <nav aria-label="Language">🌐 <a href="${esc(links.en)}">English</a> · <a href="${esc(links.hi)}" lang="hi">हिन्दी</a> · <a href="${esc(links.gu)}" lang="gu">ગુજરાતી</a></nav>
    <article>
      <p><strong>${esc(page.eyebrow)}</strong></p>
      <h1>${esc(page.heading)}</h1>
      <p>${esc(page.intro)}</p>
      <section><h2>${isHindi ? 'याद रखने वाली बातें' : 'યાદ રાખવાના મુદ્દા'}</h2><ul>${page.points.map((point)=>`<li>${esc(point)}</li>`).join('')}</ul></section>
      <section><h2>${esc(sectionLabel)}</h2>${page.sections.map(([title,text])=>`<h3>${esc(title)}</h3><p>${esc(text)}</p>`).join('')}</section>
      <section><h2>${esc(resourceLabel)}</h2><ul>${page.resources.map(([path,label])=>`<li><a href="${esc(path)}">${esc(label)}</a></li>`).join('')}</ul><p>${esc(note)}</p></section>
      <section><h2>${esc(faqLabel)}</h2>${page.faqs.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</section>
      <p><a href="/marks-recovery">Marks Recovery</a> · <a href="/free-commerce-study-pack">Free Commerce Study Pack</a></p>
    </article>
  </main>`;
}

function html(page) {
  const fullTitle = `${page.title} | ${SITE}`;
  const url = `${BASE}${page.path}`;
  const alternates = localizedAlternatesByPath[page.path] || [];
  const robots='index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const hreflang = alternates.map((item)=>`<link rel="alternate" hreflang="${item.hreflang}" href="${esc(item.href)}">`).join('');
  const tags=`\n<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${esc(url)}">${hreflang}<meta property="og:type" content="article"><meta property="og:site_name" content="${SITE}"><meta property="og:locale" content="${page.lang === 'hi' ? 'hi_IN' : 'gu_IN'}"><meta property="og:title" content="${esc(fullTitle)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${esc(url)}"><meta property="og:image" content="${BASE}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(fullTitle)}"><meta name="twitter:description" content="${esc(page.description)}"><meta name="twitter:image" content="${BASE}/og-image.jpg"><script type="application/ld+json">${JSON.stringify(schema(page)).replaceAll('<','\\u003c')}</script>`;
  return source
    .replace(/<html([^>]*)lang="[^"]*"([^>]*)>/i, `<html$1lang="${page.lang}"$2>`)
    .replace(/<title>.*?<\/title>/s,`<title>${esc(fullTitle)}</title>`)
    .replace('</head>',`${tags}\n</head>`)
    .replace('<div id="root"></div>',`<div id="root">${body(page)}</div>`);
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

for (const page of localizedPilotPages) await writeRoute(page.path,html(page));
console.log(`Pre-rendered ${localizedPilotPages.length} Hindi/Gujarati multilingual SEO pilot pages.`);
