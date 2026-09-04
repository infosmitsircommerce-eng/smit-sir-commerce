import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const BASE = 'https://www.smitsircommerce.in';
const BASE_HOST = new URL(BASE).host;

const critical = [];
const warnings = [];

function issue(bucket, code, message, details = {}) {
  bucket.push({ code, message, ...details });
}

async function exists(path) {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^$()|[\]\\]/g, '\\$&');
}

function compileRoutePattern(pattern) {
  if (!pattern || pattern === '*') return null;
  const parts = pattern.split('/').map((part) => {
    if (part === '*') return '.*';
    if (part.startsWith(':')) return '[^/]+';
    return escapeRegex(part);
  });
  return new RegExp('^' + parts.join('/') + '/?$');
}

function cleanPathname(value) {
  try {
    const url = new URL(value, BASE);
    if (url.host !== BASE_HOST) return null;
    let pathname = decodeURIComponent(url.pathname || '/').replace(/\/{2,}/g, '/');
    if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
    return pathname || '/';
  } catch {
    return null;
  }
}

function canonicalFor(pathname) {
  return pathname === '/' ? BASE + '/' : BASE + pathname;
}

function routeCandidates(pathname) {
  if (pathname === '/') return [join(DIST, 'index.html')];
  const relative = pathname.replace(/^\//, '');
  const candidates = [];
  if (relative.endsWith('.html')) candidates.push(join(DIST, relative));
  else candidates.push(join(DIST, relative + '.html'));
  candidates.push(join(DIST, relative, 'index.html'));
  return [...new Set(candidates)];
}

async function findDedicatedHtml(pathname) {
  for (const candidate of routeCandidates(pathname)) {
    if (await exists(candidate)) return candidate;
  }
  return null;
}

function getMetaContent(html, name) {
  const tags = html.match(/<meta\s+[^>]*>/gi) || [];
  for (const tag of tags) {
    const nameMatch = tag.match(/\bname=["']([^"']+)["']/i);
    if (!nameMatch || nameMatch[1].toLowerCase() !== String(name).toLowerCase()) continue;
    const contentMatch = tag.match(/\bcontent=["']([^"']*)["']/i);
    return contentMatch && contentMatch[1] ? contentMatch[1].trim() : '';
  }
  return '';
}

function getCanonical(html) {
  const a = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*>/i);
  if (a) return a[1].trim();
  const b = html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*>/i);
  return b && b[1] ? b[1].trim() : '';
}

function getTitle(html) {
  const match = html.match(/<title>([\s\S]*?)<\/title>/i);
  return match && match[1] ? match[1].replace(/\s+/g, ' ').trim() : '';
}

function hrefsFromHtml(html) {
  return [...html.matchAll(/\shref\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1].trim());
}

function isIgnorableHref(href) {
  return !href || href.startsWith('#') || /^(?:mailto:|tel:|javascript:|data:|blob:)/i.test(href);
}

const appSource = await readFile(join(ROOT, 'src', 'App.jsx'), 'utf8');
const routePatterns = [...appSource.matchAll(/<Route\s+path=["']([^"']+)["']/g)].map((m) => m[1]);
const staticRoutes = new Set(routePatterns.filter((path) => !path.includes(':') && !path.includes('*')));
const dynamicRoutes = routePatterns.map(compileRoutePattern).filter(Boolean);

function isKnownAppRoute(pathname) {
  return staticRoutes.has(pathname) || dynamicRoutes.some((pattern) => pattern.test(pathname));
}

const vercel = JSON.parse(await readFile(join(ROOT, 'vercel.json'), 'utf8'));
const redirectRules = (vercel.redirects || []).filter((rule) => !rule.has && rule.source && rule.destination);
const exactRedirects = new Map(
  redirectRules
    .filter((rule) => !/[():*]/.test(rule.source) && rule.destination.startsWith('/'))
    .map((rule) => [cleanPathname(rule.source), cleanPathname(rule.destination)])
    .filter(([source, destination]) => source && destination)
);

const noindexSources = (vercel.headers || [])
  .filter((rule) => (rule.headers || []).some((header) => String(header.key || '').toLowerCase() === 'x-robots-tag' && /noindex/i.test(header.value || '')))
  .map((rule) => rule.source);

function sourcePatternMatches(source, pathname) {
  if (source === pathname) return true;
  if (source.includes('*')) {
    const pattern = '^' + source.split('*').map(escapeRegex).join('.*') + '$';
    try { return new RegExp(pattern).test(pathname); } catch { return false; }
  }
  if (source.includes(':')) {
    const pattern = '^' + source.split('/').map((part) => part.startsWith(':') ? '[^/]+' : escapeRegex(part)).join('/') + '$';
    try { return new RegExp(pattern).test(pathname); } catch { return false; }
  }
  return false;
}

function hasServerNoindex(pathname) {
  return noindexSources.some((source) => sourcePatternMatches(source, pathname));
}

for (const source of exactRedirects.keys()) {
  const seen = new Set([source]);
  const chain = [source];
  let current = source;
  let looped = false;
  while (exactRedirects.has(current)) {
    const next = exactRedirects.get(current);
    chain.push(next);
    if (seen.has(next)) {
      issue(critical, 'REDIRECT_LOOP', 'Redirect loop detected: ' + chain.join(' -> '), { path: source });
      looped = true;
      break;
    }
    seen.add(next);
    current = next;
    if (chain.length > 20) {
      issue(critical, 'REDIRECT_LOOP', 'Redirect chain exceeded 20 hops from ' + source, { path: source });
      looped = true;
      break;
    }
  }
  if (!looped && chain.length > 2) {
    issue(warnings, 'REDIRECT_CHAIN', 'Redirect chain has ' + (chain.length - 1) + ' hops: ' + chain.join(' -> '), { path: source });
  }
}

const sitemapPath = (await exists(join(DIST, 'sitemap.xml'))) ? join(DIST, 'sitemap.xml') : join(ROOT, 'public', 'sitemap.xml');
const sitemapXml = await readFile(sitemapPath, 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => cleanPathname(m[1])).filter(Boolean);
const sitemapCounts = new Map();

for (const path of sitemapUrls) sitemapCounts.set(path, (sitemapCounts.get(path) || 0) + 1);
for (const [path, count] of sitemapCounts) {
  if (count > 1) issue(critical, 'DUPLICATE_SITEMAP_URL', path + ' appears ' + count + ' times in sitemap.xml', { path });
}

const sitemapSet = new Set(sitemapUrls);
const pageRecords = [];
const canonicalOwners = new Map();
const titleOwners = new Map();
const descriptionOwners = new Map();
const clientRenderedOnly = [];

for (const pathname of sitemapSet) {
  if (exactRedirects.has(pathname)) {
    issue(critical, 'SITEMAP_REDIRECT', 'Sitemap URL redirects: ' + pathname + ' -> ' + exactRedirects.get(pathname), { path: pathname });
  }
  if (hasServerNoindex(pathname)) {
    issue(critical, 'SITEMAP_NOINDEX', 'Sitemap URL is blocked by X-Robots-Tag noindex: ' + pathname, { path: pathname });
  }

  const htmlPath = await findDedicatedHtml(pathname);
  if (!htmlPath) {
    if (isKnownAppRoute(pathname)) {
      clientRenderedOnly.push(pathname);
      continue;
    }
    issue(critical, 'MISSING_ROUTE_TARGET', 'Sitemap URL has no dedicated HTML output and does not match an application route: ' + pathname, { path: pathname });
    continue;
  }

  const html = await readFile(htmlPath, 'utf8');
  const title = getTitle(html);
  const description = getMetaContent(html, 'description');
  const robots = getMetaContent(html, 'robots');
  const canonical = getCanonical(html);

  if (!title) issue(critical, 'MISSING_TITLE', 'Missing title on indexable page ' + pathname, { path: pathname });
  if (!description) issue(critical, 'MISSING_DESCRIPTION', 'Missing meta description on indexable page ' + pathname, { path: pathname });
  if (!canonical) issue(critical, 'MISSING_CANONICAL', 'Missing canonical on indexable page ' + pathname, { path: pathname });
  if (robots && /noindex/i.test(robots)) issue(critical, 'HTML_NOINDEX', 'Sitemap URL contains a noindex meta tag: ' + pathname, { path: pathname });

  if (canonical) {
    const expected = canonicalFor(pathname);
    const canonicalPath = cleanPathname(canonical);
    const normalizedCanonical = canonicalPath ? canonicalFor(canonicalPath) : canonical;
    if (normalizedCanonical !== expected) {
      issue(critical, 'CANONICAL_MISMATCH', 'Canonical mismatch on ' + pathname + ': expected ' + expected + ', found ' + canonical, { path: pathname, canonical });
    }
    const owner = canonicalOwners.get(normalizedCanonical);
    if (owner && owner !== pathname) {
      issue(critical, 'DUPLICATE_CANONICAL', owner + ' and ' + pathname + ' share canonical ' + normalizedCanonical, { path: pathname, otherPath: owner });
    } else {
      canonicalOwners.set(normalizedCanonical, pathname);
    }
  }

  if (title) {
    if (!titleOwners.has(title)) titleOwners.set(title, []);
    titleOwners.get(title).push(pathname);
  }
  if (description) {
    if (!descriptionOwners.has(description)) descriptionOwners.set(description, []);
    descriptionOwners.get(description).push(pathname);
  }

  pageRecords.push({ pathname, htmlPath, html });
}

if (clientRenderedOnly.length) {
  issue(
    warnings,
    'CLIENT_RENDERED_INDEXABLE_PAGES',
    clientRenderedOnly.length + ' sitemap URLs rely on the SPA shell instead of dedicated prerendered HTML.',
    { paths: clientRenderedOnly.slice(0, 30) }
  );
}

for (const [title, paths] of titleOwners) {
  if (paths.length > 1) issue(warnings, 'DUPLICATE_TITLE', 'Duplicate title used by ' + paths.length + ' sitemap pages: "' + title + '"', { paths });
}
for (const [description, paths] of descriptionOwners) {
  if (paths.length > 1) issue(warnings, 'DUPLICATE_DESCRIPTION', 'Duplicate meta description used by ' + paths.length + ' sitemap pages.', { paths, description });
}

const inbound = new Map([...sitemapSet].map((path) => [path, new Set()]));
const redirectLinkWarnings = new Set();
const brokenLinkKeys = new Set();
const staticAssetExtensions = new Set([
  '.pdf', '.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.ico',
  '.css', '.js', '.mjs', '.map', '.woff', '.woff2', '.ttf', '.mp4',
  '.webm', '.xml', '.txt', '.json', '.webmanifest'
]);

async function assetExists(pathname) {
  return exists(join(DIST, pathname.replace(/^\//, '')));
}

async function isValidInternalTarget(pathname) {
  if (pathname === '/' || sitemapSet.has(pathname) || exactRedirects.has(pathname) || isKnownAppRoute(pathname)) return true;
  if (await findDedicatedHtml(pathname)) return true;
  if (staticAssetExtensions.has(extname(pathname).toLowerCase())) return assetExists(pathname);
  return false;
}

for (const page of pageRecords) {
  for (const rawHref of hrefsFromHtml(page.html)) {
    if (isIgnorableHref(rawHref)) continue;
    let parsed;
    try {
      parsed = new URL(rawHref, canonicalFor(page.pathname));
    } catch {
      continue;
    }
    if (parsed.host !== BASE_HOST) continue;
    const target = cleanPathname(parsed.href);
    if (!target) continue;

    if (sitemapSet.has(target) && target !== page.pathname) inbound.get(target).add(page.pathname);

    if (exactRedirects.has(target)) {
      const key = page.pathname + ' -> ' + target;
      if (!redirectLinkWarnings.has(key)) {
        redirectLinkWarnings.add(key);
        issue(warnings, 'INTERNAL_LINK_TO_REDIRECT', 'Internal link on ' + page.pathname + ' points to redirected URL ' + target + ' -> ' + exactRedirects.get(target), { path: page.pathname, target });
      }
      continue;
    }

    if (!(await isValidInternalTarget(target))) {
      const key = page.pathname + ' -> ' + target;
      if (!brokenLinkKeys.has(key)) {
        brokenLinkKeys.add(key);
        issue(critical, 'BROKEN_INTERNAL_LINK', 'Broken internal link on ' + page.pathname + ': ' + target, { path: page.pathname, target });
      }
    }
  }
}

const prerenderedPaths = new Set(pageRecords.map((page) => page.pathname));
const potentialOrphans = [...inbound.entries()]
  .filter(([path, sources]) => path !== '/' && sources.size === 0 && prerenderedPaths.has(path))
  .map(([path]) => path);

if (potentialOrphans.length) {
  issue(
    warnings,
    'POTENTIAL_ORPHAN_PAGES',
    potentialOrphans.length + ' prerendered sitemap pages received no internal link from another prerendered sitemap page during this build scan.',
    { paths: potentialOrphans.slice(0, 50) }
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  base: BASE,
  sitemapUrlCount: sitemapSet.size,
  prerenderedPagesChecked: pageRecords.length,
  clientRenderedOnlyCount: clientRenderedOnly.length,
  criticalCount: critical.length,
  warningCount: warnings.length,
  critical,
  warnings
};

await writeFile(join(DIST, 'seo-audit-report.json'), JSON.stringify(report, null, 2) + '\n', 'utf8');

console.log('[seo-audit] Checked ' + sitemapSet.size + ' sitemap URLs, ' + pageRecords.length + ' dedicated HTML pages and their internal links.');
console.log('[seo-audit] Critical: ' + critical.length + ' | Warnings: ' + warnings.length);
for (const item of warnings.slice(0, 25)) console.warn('[seo-audit][warn][' + item.code + '] ' + item.message);
if (warnings.length > 25) console.warn('[seo-audit] ' + (warnings.length - 25) + ' additional warnings are in dist/seo-audit-report.json');

if (critical.length) {
  for (const item of critical.slice(0, 40)) console.error('[seo-audit][critical][' + item.code + '] ' + item.message);
  if (critical.length > 40) console.error('[seo-audit] ' + (critical.length - 40) + ' additional critical issues are in dist/seo-audit-report.json');
  console.error('[seo-audit] Build failed because critical SEO integrity issues were detected.');
  process.exitCode = 1;
} else {
  console.log('[seo-audit] PASS - no critical SEO integrity issues detected.');
}
