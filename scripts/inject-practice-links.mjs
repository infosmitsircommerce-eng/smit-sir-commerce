import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { seoMaterials } from '../src/data/seoMaterials.js';
import { commerceToolBySlug } from '../src/data/allCommerceTools.js';
import { getContextualToolSlugs } from '../src/data/toolClusters.js';
import { growthManifest } from './growth-manifest.mjs';

const distRoot = new URL('../dist/', import.meta.url).pathname;
const esc = (value) => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let toolLinkedPages = 0;

for (const material of seoMaterials) {
  const pages = growthManifest.filter((item) => item.materialId === material.id);
  const toolSlugs = getContextualToolSlugs(material.seo_path);
  const tools = toolSlugs.map((slug) => commerceToolBySlug[slug]).filter(Boolean);

  const practiceBlock = pages.length
    ? `<section data-prerendered="chapter-practice-links"><h2>Practise ${esc(material.chapter)}</h2><p>After reading the notes, use these chapter-specific practice pages to retrieve and apply the concepts.</p><ul>${pages.map((item) => `<li><a href="${esc(item.path)}">${esc(item.label)} - ${esc(material.chapter)}</a></li>`).join('')}</ul></section>`
    : '';
  const toolsBlock = tools.length
    ? `<section data-prerendered="chapter-calculator-links"><h2>Free calculators for ${esc(material.chapter)}</h2><p>Use these calculators to check the formula and step-by-step working after solving the numerical yourself.</p><ul>${tools.map((tool) => `<li><a href="/tools/${esc(tool.slug)}">${esc(tool.h1)}</a> — ${esc(tool.formula)}</li>`).join('')}</ul></section>`
    : '';

  if (!practiceBlock && !toolsBlock) continue;
  if (toolsBlock) toolLinkedPages += 1;

  const relative = material.seo_path.replace(/^\//,'');
  for (const file of [join(distRoot,`${relative}.html`),join(distRoot,relative,'index.html')]) {
    let html = await readFile(file,'utf8');
    const blocks = `${practiceBlock}${toolsBlock}`;
    if (practiceBlock && html.includes('data-prerendered="chapter-practice-links"')) continue;
    if (!html.includes('data-prerendered="chapter-calculator-links"')) html = html.replace('</article>',`${blocks}</article>`);
    await writeFile(file,html,'utf8');
  }
}
console.log(`Injected chapter-practice links into ${seoMaterials.length} note pages and calculator links into ${toolLinkedPages} matching note pages.`);
