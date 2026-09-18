import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const BASE = 'https://www.smitsircommerce.in';
const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));

const redirects = new Map(
  (vercel.redirects || [])
    .filter((rule) =>
      !rule.has &&
      rule.source &&
      rule.destination &&
      rule.destination.startsWith('/') &&
      !/[():*]/.test(rule.source)
    )
    .map((rule) => [rule.source, rule.destination]),
);

function resolveRedirect(path) {
  const seen = new Set();
  let current = path;
  while (redirects.has(current) && !seen.has(current)) {
    seen.add(current);
    current = redirects.get(current);
  }
  return current;
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const mappings = [...redirects.entries()]
  .map(([source]) => [source, resolveRedirect(source)])
  .filter(([source, destination]) => source !== destination)
  .sort((a, b) => b[0].length - a[0].length);

let changedFiles = 0;
let changedLinks = 0;

for (const file of await walk(DIST)) {
  let html = await readFile(file, 'utf8');
  let next = html;

  for (const [source, destination] of mappings) {
    const before = next;
    next = next
      .replaceAll('href="' + source + '"', 'href="' + destination + '"')
      .replaceAll("href='" + source + "'", "href='" + destination + "'")
      .replaceAll('href="' + BASE + source + '"', 'href="' + BASE + destination + '"')
      .replaceAll("href='" + BASE + source + "'", "href='" + BASE + destination + "'");

    if (next !== before) changedLinks += 1;
  }

  if (next !== html) {
    await writeFile(file, next, 'utf8');
    changedFiles += 1;
  }
}

console.log('[internal-links] Normalized redirected internal links in ' + changedFiles + ' HTML files across ' + changedLinks + ' redirect replacements.');
