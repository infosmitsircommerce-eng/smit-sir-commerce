import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = new URL('../dist/', import.meta.url).pathname;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

function match(html, pattern) {
  return html.match(pattern)?.[1]?.trim() || '';
}

function textFromHtml(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z0-9#]+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const files = await walk(root);
const rows = [];
const titleMap = new Map();
const canonicalMap = new Map();

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const robots = match(html, /<meta[^>]+name=["']robots["'][^>]+content=["']([^"']+)["']/i);
  const indexable = !/noindex/i.test(robots);
  if (!indexable) continue;

  const title = match(html, /<title>([\s\S]*?)<\/title>/i);
  const h1 = match(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const canonical = match(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i);
  const description = match(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);
  const words = textFromHtml(match(html, /<body[^>]*>([\s\S]*?)<\/body>/i) || html).split(/\s+/).filter(Boolean).length;
  const path = relative(root, file).replaceAll('\\', '/');

  const issues = [];
  if (!title) issues.push('missing-title');
  if (!h1) issues.push('missing-h1');
  if (!canonical) issues.push('missing-canonical');
  if (!description) issues.push('missing-description');
  if (words < 120) issues.push('thin-under-120-words');

  if (title) titleMap.set(title, [...(titleMap.get(title) || []), path]);
  if (canonical) canonicalMap.set(canonical, [...(canonicalMap.get(canonical) || []), path]);

  rows.push({ path, words, title, h1, canonical, issues });
}

const duplicateTitles = [...titleMap.entries()].filter(([, paths]) => paths.length > 2).map(([title, paths]) => ({ title, count: paths.length, paths: paths.slice(0, 8) }));
const duplicateCanonicals = [...canonicalMap.entries()].filter(([, paths]) => paths.length > 2).map(([canonical, paths]) => ({ canonical, count: paths.length, paths: paths.slice(0, 8) }));
const risky = rows.filter((row) => row.issues.length);

const report = {
  generatedAt: new Date().toISOString(),
  indexableHtmlFiles: rows.length,
  riskyPages: risky.length,
  duplicateTitleGroups: duplicateTitles.length,
  duplicateCanonicalGroups: duplicateCanonicals.length,
  riskBreakdown: risky.reduce((acc, row) => {
    for (const issue of row.issues) acc[issue] = (acc[issue] || 0) + 1;
    return acc;
  }, {}),
  sampleRiskyPages: risky.slice(0, 40),
  duplicateTitles: duplicateTitles.slice(0, 20),
  duplicateCanonicals: duplicateCanonicals.slice(0, 20),
};

await writeFile(join(root, 'adsense-readiness-report.json'), JSON.stringify(report, null, 2), 'utf8');
console.log(`AdSense content audit: ${rows.length} indexable HTML files checked; ${risky.length} pages flagged for review.`);
if (Object.keys(report.riskBreakdown).length) console.log(`AdSense audit flags: ${JSON.stringify(report.riskBreakdown)}`);
if (duplicateTitles.length) console.log(`AdSense audit: ${duplicateTitles.length} repeated-title groups need monitoring.`);
if (duplicateCanonicals.length) console.log(`AdSense audit: ${duplicateCanonicals.length} repeated-canonical groups need monitoring.`);
