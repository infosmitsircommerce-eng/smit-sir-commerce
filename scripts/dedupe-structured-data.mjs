import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;
const schemaPattern = /<script([^>]*type=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi;

async function htmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function dedupe(html) {
  const matches = [...html.matchAll(schemaPattern)];
  if (matches.length < 2) return { html, removed: 0 };

  const seenIds = new Set();
  const replacements = [];
  let removed = 0;

  for (const match of matches.toReversed()) {
    let data;
    try {
      data = JSON.parse(match[2]);
    } catch {
      continue;
    }

    const graph = Array.isArray(data?.['@graph']) ? data['@graph'] : null;
    if (graph) {
      const unique = graph.filter((node) => {
        const id = node?.['@id'];
        if (!id) return true;
        if (seenIds.has(id)) {
          removed += 1;
          return false;
        }
        seenIds.add(id);
        return true;
      });
      const replacement = unique.length
        ? `<script${match[1]}>${JSON.stringify({ ...data, '@graph': unique }).replaceAll('<', '\\u003c')}</script>`
        : '';
      replacements.push({ index: match.index, length: match[0].length, value: replacement });
      continue;
    }

    const id = data?.['@id'];
    if (id && seenIds.has(id)) {
      removed += 1;
      replacements.push({ index: match.index, length: match[0].length, value: '' });
    } else if (id) {
      seenIds.add(id);
    }
  }

  let result = html;
  for (const replacement of replacements.sort((a, b) => b.index - a.index)) {
    result = result.slice(0, replacement.index) + replacement.value + result.slice(replacement.index + replacement.length);
  }
  return { html: result, removed };
}

let filesChanged = 0;
let entitiesRemoved = 0;
for (const file of await htmlFiles(root)) {
  const original = await readFile(file, 'utf8');
  const result = dedupe(original);
  if (result.html !== original) {
    await writeFile(file, result.html, 'utf8');
    filesChanged += 1;
    entitiesRemoved += result.removed;
  }
}

console.log(`[schema] Removed ${entitiesRemoved} duplicate top-level entities across ${filesChanged} HTML files.`);
