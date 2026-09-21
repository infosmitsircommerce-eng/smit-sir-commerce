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

const singletonHeadPatterns = [
  /<meta\b(?=[^>]*\bname=["']description["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']googlebot["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']bingbot["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']twitter:card["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']twitter:title["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']twitter:description["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bname=["']twitter:image["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:type["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:site_name["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:locale["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:title["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:description["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:image["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:image:width["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:image:height["'])[^>]*>/gi,
  /<meta\b(?=[^>]*\bproperty=["']og:image:alt["'])[^>]*>/gi,
  /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>/gi,
];

function keepLastMatch(html, pattern) {
  const matches = [...html.matchAll(pattern)];
  if (matches.length < 2) return { html, removed: 0 };

  let result = html;
  for (const match of matches.slice(0, -1).toReversed()) {
    result = result.slice(0, match.index) + result.slice(match.index + match[0].length);
  }
  return { html: result, removed: matches.length - 1 };
}

function dedupeSingletonHeadTags(html) {
  const match = html.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);
  if (!match) return { html, removed: 0 };

  let head = match[0];
  let removed = 0;
  for (const pattern of singletonHeadPatterns) {
    const result = keepLastMatch(head, pattern);
    head = result.html;
    removed += result.removed;
  }

  if (!removed) return { html, removed: 0 };
  return {
    html: html.slice(0, match.index) + head + html.slice(match.index + match[0].length),
    removed,
  };
}

function dedupe(html) {
  const matches = [...html.matchAll(schemaPattern)];
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
  for (const item of replacements.sort((a, b) => b.index - a.index)) {
    result = result.slice(0, item.index) + item.value + result.slice(item.index + item.length);
  }

  const headResult = dedupeSingletonHeadTags(result);
  return { html: headResult.html, removed: removed + headResult.removed };
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

console.log(`[schema] Removed ${entitiesRemoved} duplicate schema entities/head tags across ${filesChanged} HTML files.`);
