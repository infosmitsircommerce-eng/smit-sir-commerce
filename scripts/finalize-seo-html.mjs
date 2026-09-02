import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { seoHubs, seoMaterials } from '../src/data/seoMaterials.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const distRoot = join(root, 'dist');
const SITE = 'Smit Sir Commerce';
const hubById = Object.fromEntries(seoHubs.map((hub) => [hub.id, hub]));

async function listHtml(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await listHtml(full));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function keepLast(html, regex) {
  const matches = [...html.matchAll(regex)];
  if (matches.length <= 1) return html;
  let seen = 0;
  return html.replace(regex, (match) => {
    seen += 1;
    return seen === matches.length ? match : '';
  });
}

function dedupeSeoTags(html) {
  const patterns = [
    /<meta\s+name=["']description["'][^>]*>\s*/gi,
    /<meta\s+name=["']robots["'][^>]*>\s*/gi,
    /<meta\s+name=["']googlebot["'][^>]*>\s*/gi,
    /<meta\s+name=["']bingbot["'][^>]*>\s*/gi,
    /<link\s+rel=["']canonical["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:type["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:site_name["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:locale["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:title["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:description["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:url["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:width["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:height["'][^>]*>\s*/gi,
    /<meta\s+property=["']og:image:alt["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:card["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:title["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:description["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:image["'][^>]*>\s*/gi,
    /<meta\s+name=["']twitter:image:alt["'][^>]*>\s*/gi,
  ];
  return patterns.reduce((result, pattern) => keepLast(result, pattern), html);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function chapterMeta(material) {
  const hub = hubById[material.hubId];
  const subject = hub?.label?.replace(`Class ${material.class_level} `, '') || material.subject;
  const title = `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} Notes PDF`;
  const description = `Free CBSE Class ${material.class_level} ${subject} Chapter ${material.chapterNumber} ${material.chapter} notes PDF. View online or download chapter-wise notes with key topics, important questions, MCQs and exam-focused revision.`;
  return { title, description, subject };
}

function replaceMetaContent(html, selector, value) {
  const escaped = escapeHtml(value);
  return html.replace(selector, (match) => match.replace(/content=["'][^"']*["']/i, `content="${escaped}"`));
}

const materialByFile = new Map();
for (const material of seoMaterials) {
  const route = material.seo_path.replace(/^\//, '');
  materialByFile.set(`${route}.html`, material);
  materialByFile.set(`${route}/index.html`, material);
}

const htmlFiles = await listHtml(distRoot);
let deduped = 0;
let strengthened = 0;

for (const file of htmlFiles) {
  const rel = relative(distRoot, file).replaceAll('\\', '/');
  let html = await readFile(file, 'utf8');
  const before = html;

  if (rel !== 'index.html') html = dedupeSeoTags(html);

  const material = materialByFile.get(rel);
  if (material) {
    const { title, description, subject } = chapterMeta(material);
    const fullTitle = `${title} | ${SITE}`;

    html = html.replaceAll(material.seoTitle, title);
    html = html.replace(/<title>.*?<\/title>/is, `<title>${escapeHtml(fullTitle)}</title>`);
    html = replaceMetaContent(html, /<meta\s+name=["']description["'][^>]*>/i, description);
    html = replaceMetaContent(html, /<meta\s+property=["']og:title["'][^>]*>/i, fullTitle);
    html = replaceMetaContent(html, /<meta\s+property=["']og:description["'][^>]*>/i, description);
    html = replaceMetaContent(html, /<meta\s+name=["']twitter:title["'][^>]*>/i, fullTitle);
    html = replaceMetaContent(html, /<meta\s+name=["']twitter:description["'][^>]*>/i, description);

    const exactHeading = `${title}`;
    html = html.replace(
      /<h1>.*?Notes PDF\s*[—-]\s*CBSE Class\s*\d+<\/h1>/is,
      `<h1>${escapeHtml(exactHeading)}</h1>`
    );
    html = html.replace(
      '<h2>Chapter overview</h2>',
      `<h2>${escapeHtml(material.chapter)} chapter overview and revision notes</h2>`
    );
    html = html.replace(
      `<p><a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} PDF</a>.</p>`,
      `<h2>Download ${escapeHtml(material.chapter)} notes PDF for CBSE Class ${material.class_level} ${escapeHtml(subject)}</h2><p>Use the complete chapter PDF for school tests, board-exam revision and concept review. <a href="${escapeHtml(material.file_url)}">View or download the free ${escapeHtml(material.chapter)} notes PDF</a>.</p>`
    );
    strengthened += 1;
  }

  if (html !== before) {
    await writeFile(file, html, 'utf8');
    if (!material) deduped += 1;
  }
}

console.log(`Finalized SEO HTML: strengthened ${strengthened} chapter files and normalized ${deduped} other prerendered files.`);
