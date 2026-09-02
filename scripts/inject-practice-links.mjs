import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { seoMaterials } from '../src/data/seoMaterials.js';
import { growthManifest } from './growth-manifest.mjs';

const distRoot = new URL('../dist/', import.meta.url).pathname;
const esc = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

for (const material of seoMaterials) {
  const pages = growthManifest.filter((item) => item.materialId === material.id);
  if (!pages.length) continue;
  const block = `<section data-prerendered="chapter-practice-links"><h2>Practise ${esc(material.chapter)}</h2><p>After reading the notes, use these chapter-specific practice pages to retrieve and apply the concepts.</p><ul>${pages.map((item) => `<li><a href="${esc(item.path)}">${esc(item.label)} - ${esc(material.chapter)}</a></li>`).join('')}</ul></section>`;
  const relative = material.seo_path.replace(/^\//,'');
  for (const file of [join(distRoot,`${relative}.html`),join(distRoot,relative,'index.html')]) {
    let html = await readFile(file,'utf8');
    if (!html.includes('data-prerendered="chapter-practice-links"')) html = html.replace('</article>',`${block}</article>`);
    await writeFile(file,html,'utf8');
  }
}
console.log(`Injected chapter-practice internal links into ${seoMaterials.length} prerendered note pages.`);
