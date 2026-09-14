import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const publicDir = new URL('../public/', import.meta.url).pathname;
const pdfPath = '/materials/cbse/class-11/microeconomics/chapter-06-price-elasticity-of-demand.pdf';
const strongTitle = 'CBSE Class 11 Price Elasticity of Demand Notes PDF - Numericals & Questions';

const libraryPath = join(publicDir, 'free-pdf-library.html');
let html = await readFile(libraryPath, 'utf8');

html = html.replace(
  `<strong>Chapter 06 Price Elasticity of Demand</strong>\n      <small>Open free PDF · Smit Sir Commerce study material</small>`,
  `<strong>${strongTitle}</strong>\n      <small>Free original PDF · factors, degrees, diagrams, solved numericals, questions & answers</small>`
);

if (!html.includes('data-featured-ped-pdf')) {
  const featured = `
  <section data-featured-ped-pdf style="margin-top:24px;background:#fff7db;border:1px solid #d8a600;border-radius:20px;padding:22px">
    <div style="font-size:12px;font-weight:900;letter-spacing:.1em;color:#7a5700">POPULAR CLASS 11 MICROECONOMICS PDF</div>
    <h2 style="margin:8px 0 8px">Price Elasticity of Demand Class 11 Notes PDF</h2>
    <p style="margin:0 0 14px;color:#4d5666;line-height:1.6">Original Smit Sir Commerce notes covering factors affecting price elasticity of demand, all five degrees, diagrams, percentage-change method, total expenditure method, solved numericals, questions and answers, MCQs and practice problems.</p>
    <a href="${pdfPath}" style="display:inline-block;background:#0f1c3f;color:#fff;text-decoration:none;font-weight:800;padding:12px 16px;border-radius:12px">Open Price Elasticity of Demand Notes PDF</a>
  </section>`;
  html = html.replace('</section>\n  \n<section class="group">', `</section>${featured}\n<section class="group">`);
}

await writeFile(libraryPath, html, 'utf8');

const notesPath = join(publicDir, 'cbse-commerce-notes.html');
try {
  let notes = await readFile(notesPath, 'utf8');
  if (!notes.includes(pdfPath)) {
    notes = notes.replace(
      '</body>',
      `<section style="max-width:980px;margin:28px auto;padding:0 18px"><h2>Popular Class 11 Economics PDF</h2><p><a href="${pdfPath}">${strongTitle}</a> - free original notes with factors, solved numericals, questions and answers.</p></section>\n</body>`
    );
    await writeFile(notesPath, notes, 'utf8');
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log('[pdf-seo] Strengthened Price Elasticity PDF anchor text and internal discovery links.');