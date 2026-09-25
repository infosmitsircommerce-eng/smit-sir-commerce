import { readFile, writeFile } from 'node:fs/promises';
import { localSeoPages } from '../src/data/localSeoPages.js';

const distRoot = new URL('../dist/', import.meta.url);
const routes = ['/commerce-coaching-mehsana', ...localSeoPages.map((page) => page.path)];

const replacements = [
  [
    'For classes at Smit Sir’s location or home tuition in Mehsana, send an enquiry or request a free demo.',
    'For home tuition in Mehsana or online learning support, send an enquiry or request a free demo.',
  ],
  [
    'at Smit Sir’s tuition location or home tuition at the student’s location',
    'as home tuition at the student’s location, subject to travel availability',
  ],
  [
    'lessons at their home in Mehsana as well as classes at Smit Sir’s tuition location',
    'lessons at their home in Mehsana, subject to travel availability',
  ],
  [
    'Home tuition and classes at the tuition location may have different fees.',
    'Home tuition and online support can have different arrangements.',
  ],
];

let changed = 0;

for (const route of routes) {
  const relative = route.replace(/^\//, '');
  const candidates = [
    new URL(`${relative}.html`, distRoot),
    new URL(`${relative}/index.html`, distRoot),
  ];

  for (const file of candidates) {
    try {
      let html = await readFile(file, 'utf8');
      const before = html;
      for (const [from, to] of replacements) html = html.replaceAll(from, to);
      if (html !== before) {
        await writeFile(file, html, 'utf8');
        changed += 1;
      }
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error;
    }
  }
}

console.log(`Local tuition truth guard checked ${routes.length} routes; updated ${changed} generated files.`);
