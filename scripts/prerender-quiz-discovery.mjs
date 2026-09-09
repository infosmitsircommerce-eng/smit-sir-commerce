import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { quizDiscovery } from '../src/data/quizDiscovery.js';
import { seoMaterials } from '../src/data/seoMaterials.js';
const base='https://www.smitsircommerce.in';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const source=await readFile('dist/index.html','utf8');
const shell=source.replace(/<title>[\s\S]*?<\/title>/gi,'').replace(/<meta\b[^>]*(?:name|property)=["'](?:description|robots|googlebot|bingbot|og:[^"']+|twitter:[^"']+)["'][^>]*>/gi,'').replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'').replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>[\s\S]*?<\/script>/gi,'');
for(const page of quizDiscovery){
 const {pack}=page;
 const related=quizDiscovery.filter(p=>p.id!==page.id&&p.pack.classLevel===pack.classLevel&&p.pack.stream===pack.stream).slice(0,4);
 const body=`<main class="page-container py-10"><nav><a href="/">Home</a> / <a href="/quizzes">Economics quizzes</a></nav><h1>${esc(page.title)}</h1><p>Test your understanding of ${esc(pack.title)} with 20 free questions across Easy and Moderate. Hard and Extreme require Premium. Choose a level in the interactive quiz to answer questions and review explanations.</p><a href="/quizzes?subject=${pack.classLevel===11?'micro':pack.stream==='Macroeconomics'?'macro':'ied'}">Open interactive chapter quizzes</a><h2>Key concepts to revise</h2>${pack.levels.Easy.map((q,i)=>`<article><h3>${esc(q.q.match(/"(.*?)"/)?.[1]||`Concept ${i+1}`)}</h3><p>${esc(q.explanation)}</p></article>`).join('')}<h2>Try these sample MCQs</h2>${pack.levels.Moderate.slice(0,3).map((q,i)=>`<article><h3>${i+1}. ${esc(q.q)}</h3><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><details><summary>Check answer and explanation</summary><p>${esc(q.options[q.answer])}. ${esc(q.explanation)}</p></details></article>`).join('')}<h2>After the quiz</h2><p>Write down the concepts you missed. Explain each one in your own words, give an example, and attempt the level again without notes. A high score on a short quiz does not replace revision of the whole chapter.</p><a href="${pack.classLevel===11?'/cbse/class-11/microeconomics-notes':'/cbse/class-12/economics-revision-guide'}">Continue Economics revision</a><h2>Related chapter quizzes</h2><ul>${related.map(p=>`<li><a href="${p.path}">${esc(p.title)}</a></li>`).join('')}</ul></main>`;
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
// Connect existing Microeconomics PDF note pages to their matching quiz.
for(const material of seoMaterials.filter(m=>m.class_level===11 && m.hubId?.includes('micro'))){
 const quiz=quizDiscovery.find(p=>p.id===`cbse-11-micro-ch${material.chapterNumber}`);if(!quiz)continue;
 for(const path of [`dist${material.seo_path}.html`,`dist${material.seo_path}/index.html`]){
  try{let html=await readFile(path,'utf8');html=html.replace('</main>',`<p><a href="${quiz.path}">Practise ${esc(quiz.pack.title)} MCQs with answers</a></p></main>`);await writeFile(path,html);}catch(e){if(e.code!=='ENOENT')throw e;}
 }
}
console.log(`Created ${quizDiscovery.length} quiz discovery pages with canonical URLs, samples and internal links.`);
