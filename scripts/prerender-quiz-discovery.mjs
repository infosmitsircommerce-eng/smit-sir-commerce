import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { quizDiscovery, getRelatedQuizPages } from '../src/data/quizDiscovery.js';
import { gsebEconomicsHub } from '../src/data/gsebMaterials.js';
const base='https://www.smitsircommerce.in';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const source=await readFile('dist/index.html','utf8');
const shell=source.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|googlebot|bingbot|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'').replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'');
for(const page of quizDiscovery){
 const {pack}=page;
 const related=getRelatedQuizPages(page);
 const body=`<main class="page-container py-10"><nav><a href="/">Home</a> / <a href="/quizzes">Economics quizzes</a></nav><h1>${esc(page.title)}</h1><p>Test your understanding of ${esc(pack.title)} with 20 free questions across Easy and ${page.freeLevelLabel}. Hard and Extreme require Premium. Choose a level in the interactive quiz to answer questions and review explanations.</p><a href="${esc(page.testPath)}">Open this chapter test</a>${page.notesPath?`<p><a href="${page.notesPath}">Read ${esc(pack.title)} notes</a></p>`:''}<p>${esc(pack.sourceLabel)}</p><h2>Key concepts to revise</h2>${pack.levels.Easy.map((q,i)=>`<article><h3>${esc(q.q.match(/"(.*?)"/)?.[1]||q.q)}</h3><p>${esc(q.explanation)}</p></article>`).join('')}<h2>Try these sample MCQs</h2>${pack.levels.Moderate.slice(0,3).map((q,i)=>`<article><h3>${i+1}. ${esc(q.q)}</h3><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><details><summary>Check answer and explanation</summary><p>${esc(q.options[q.answer])}. ${esc(q.explanation)}</p></details></article>`).join('')}<h2>After the quiz</h2><p>Write down the concepts you missed. Explain each one in your own words, give an example, and attempt the level again without notes. A high score on a short quiz does not replace revision of the whole chapter.</p><a href="${page.revisionPath}">Continue ${esc(pack.board)} Economics revision</a><h2>Related chapter quizzes</h2><ul>${related.map(p=>`<li><a href="${p.path}">${esc(p.title)}</a></li>`).join('')}</ul></main>`;
 const url=base+page.path;
 const schema={'@context':'https://schema.org','@graph':[{'@type':'LearningResource',name:page.title,url,learningResourceType:'Practice quiz',educationalLevel:`Class ${pack.classLevel}`,inLanguage:'en',isAccessibleForFree:true},{'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'Home',item:base+'/'},{'@type':'ListItem',position:2,name:'Economics quizzes',item:base+'/quizzes'},{'@type':'ListItem',position:3,name:pack.title,item:url}]}]};
 const meta=`<title>${esc(page.title)} | Smit Sir Commerce</title><meta name="description" content="${esc(page.description)}"><meta name="robots" content="index, follow"><link rel="canonical" href="${url}"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta property="og:image" content="${base}/og-image.jpg"><meta name="twitter:card" content="summary_large_image"><script type="application/ld+json">${JSON.stringify(schema).replaceAll('<','\\u003c')}</script>`;
 const html=shell.slice(0,shell.indexOf('</head>'))+meta+'</head><body><div id="root">'+body+'</div></body></html>';
 for(const path of [`dist${page.path}.html`,`dist${page.path}/index.html`]){await mkdir(dirname(path),{recursive:true});await writeFile(path,html);}
}
// Add crawlable chapter links to the server-rendered quiz hub.
for(const path of ['dist/quizzes.html','dist/quizzes/index.html']){
 let html=await readFile(path,'utf8');
 html=html.replace('</article></main>',`<section><h2>Economics chapter MCQs with answers</h2><ul>${quizDiscovery.map(p=>`<li><a href="${p.path}">${esc(p.title)}</a></li>`).join('')}</ul></section></article></main>`);
 await writeFile(path,html);
}
// Reciprocal chapter links from existing notes; never invent missing PDFs.
for(const quiz of quizDiscovery.filter(p => p.notesPath)){
 const paths=quiz.notesPath.endsWith('.html') ? [`dist${quiz.notesPath}`] : [`dist${quiz.notesPath}.html`, `dist${quiz.notesPath}/index.html`];
 for(const path of paths){
  let html=await readFile(path,'utf8');
  html=html.replace('</main>', `<p><a href="${quiz.path}">Practise ${esc(quiz.pack.title)} MCQs with answers</a></p></main>`);
  await writeFile(path,html);
 }
}
// The established GSEB notes hub also introduces all eleven chapter tests.
const hubPath=`dist${gsebEconomicsHub.path}`;
let hub=await readFile(hubPath,'utf8');
hub=hub.replace('</main>', `<section class="card"><h2>GSEB Class 12 Economics chapter MCQ tests</h2><p>Choose a chapter, revise its concepts and practise 10 questions per level. Easy and Medium are free; Hard and Extreme require Premium.</p><ul>${quizDiscovery.filter(p=>p.pack.board==='GSEB').map(p=>`<li><a href="${p.path}">Chapter ${p.pack.chapterNumber}: ${esc(p.pack.title)} MCQs with answers</a></li>`).join('')}</ul></section></main>`);
await writeFile(hubPath,hub);
console.log(`Created ${quizDiscovery.length} quiz discovery pages with canonical URLs, samples and reciprocal internal links.`);
