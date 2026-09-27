import { readFile, writeFile } from 'node:fs/promises';
import { searchPractice } from '../src/data/searchPractice.js';
import { searchPracticeHtml } from '../src/lib/searchPracticeHtml.js';
for (const path of Object.keys(searchPractice)) {
  for (const suffix of ['.html', '/index.html']) {
    const file = new URL(`../dist${path}${suffix}`, import.meta.url);
    let html = await readFile(file, 'utf8');
    if (html.includes('data-search-practice="2026-09-27"')) continue;
    const main = html.indexOf('<main');
    const introEnd = html.indexOf('</p>', html.indexOf('</h1>', main));
    if (main < 0 || introEnd < 0) throw new Error(`Missing insertion point: ${path}`);
    html = html.slice(0, introEnd + 4) + searchPracticeHtml(path) + html.slice(introEnd + 4);
    await writeFile(file, html);
  }
}
console.log('Added matching original practice to three search landing pages (six HTML variants).');
