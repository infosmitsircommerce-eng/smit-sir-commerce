import { access, readFile, writeFile } from 'node:fs/promises';
import { getStudyPathway } from '../src/data/studyPathways.js';

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const sitemap = await readFile('dist/sitemap.xml', 'utf8');
const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
let connected = 0;
for (const path of paths) {
  const pathway = getStudyPathway(path);
  if (!pathway) continue;
  const candidates = path.endsWith('.html') ? [`dist${path}`] : [`dist${path}.html`, `dist${path}/index.html`];
  for (const file of candidates) {
    try { await access(file); } catch { continue; }
    const source = await readFile(file, 'utf8');
    const clean = source.replace(/<section\b[^>]*data-study-pathway="true"[^>]*>[\s\S]*?<\/section>/g, '');
    if (!clean.includes('</main>')) throw new Error(`Missing content container on ${path}`);
    // Use the same visible links as React; keep this step after all page generators.
    const block = `<section class="card-paper p-5 sm:p-7 mt-8" data-study-pathway="true" aria-label="Related study resources"><h2>${esc(pathway.title)}</h2><p>${esc(pathway.description)}</p><ul>${pathway.links.map(([to, label]) => `<li><a href="${esc(to)}">${esc(label)}</a></li>`).join('')}</ul></section>`;
    await writeFile(file, clean.replace('</main>', `${block}</main>`));
    connected++;
  }
}
console.log(`Connected board- and subject-specific study pathways in ${connected} HTML files.`);
