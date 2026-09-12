import { access, readFile, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gsebMaterials } from '../src/data/gsebMaterials.js';
import { renderSearchTeachingGuide } from '../src/data/searchTeachingGuides.js';
import { localTuitionService } from '../src/data/localTuitionService.js';
import { BOARD_BOOSTER_PRODUCTS } from '../src/data/boardBoosterProducts.js';
import { renderBoardBoosterPreviews } from '../src/data/boardBoosterPreviews.js';
import { getStudyOffer } from '../src/data/studyOffers.js';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
const DIST = join(ROOT, 'dist');
const BASE = 'https://www.smitsircommerce.in';
const sitemap = await readFile(join(ROOT, 'public', 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(https:\/\/www\.smitsircommerce\.in[^<]*)<\/loc>/g)].map((match) => match[1]);

const indexedPaths = new Set(urls.map((url) => new URL(url).pathname));
const baChapters = gsebMaterials
  .filter((material) => material.subject === 'Business Administration' && material.class_level === 12 && indexedPaths.has(material.seo_path))
  .sort((a, b) => a.chapterNumber - b.chapterNumber);
const class11Ba = gsebMaterials
  .filter((material) => material.subject === 'Business Administration' && material.class_level === 11 && indexedPaths.has(material.seo_path))
  .sort((a, b) => a.chapterNumber - b.chapterNumber);
// Preserve the earlier uploaded PDF as a separate, accurately labelled resource.
const uploadedClass11Chapter1 = '/school-resource/gseb/class-11/business-administration/ch-1-nature-purpose-and-scope-of-business-gseb-class-11';
if (indexedPaths.has(uploadedClass11Chapter1)) {
  class11Ba.push({ seo_path: uploadedClass11Chapter1, chapterNumber: 1, chapter: 'Nature, Purpose and Scope of Business — earlier uploaded notes' });
}

function escapeHtml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function discoveryBlock(pathname) {
  const baLibrary = pathname === '/study-material' || pathname === '/gseb-class-12-economics.html'
    || pathname.includes('/school-resource/gseb/') && pathname.includes('/business-administration/');
  if (baLibrary) {
    return `<section data-search-revenue="gseb-ba"><h2>GSEB Business Administration (BA / OCM) notes</h2><p>Business Administration is a separate subject from Economics. Choose your class and chapter below; the published notes are free to read and download.</p><h3>Class 12 BA (OCM): chapter-wise notes</h3><ul>${baChapters.map((chapter) => `<li><a href="${escapeHtml(chapter.seo_path)}">${escapeHtml(chapter.title)}</a></li>`).join('')}</ul>${class11Ba.length ? `<h3>Class 11 Business Administration</h3><ul>${class11Ba.map((chapter) => `<li><a href="${escapeHtml(chapter.seo_path)}">Chapter ${chapter.chapterNumber} — ${escapeHtml(chapter.chapter)}</a></li>`).join('')}</ul>` : ''}</section>`;
  }
  const businessStudies = pathname.startsWith('/cbse/class-12/business-studies')
    || pathname.startsWith('/practice/cbse/class-12/business-studies/')
    || pathname === '/cbse-class-12-business-studies-case-study-questions.html';
  const economics = pathname.startsWith('/cbse/class-12/economics')
    || pathname.startsWith('/cbse/class-12/macroeconomics')
    || pathname.startsWith('/practice/cbse/class-12/macroeconomics/')
    || pathname === '/cbse-class-12-economics-important-questions.html';
  if (!businessStudies && !economics) return '';
  const subject = businessStudies ? 'Business Studies' : 'Economics';
  const offer = getStudyOffer(pathname, { subject });
  if (!offer) return '';
  const pack = offer.product.id;
  const diagnostic = businessStudies ? '/cbse/class-12/business-studies-diagnostic-test' : '/cbse/class-12/economics-diagnostic-test';
  return `<section data-search-revenue="board-booster"><h2>Practise Class 12 ${subject} after revising</h2><p>Keep using the free notes and questions. For a structured revision plan, the optional ₹199 ${subject} Board Booster includes a 14-page revision PDF, three original 20-mark tests with answers, a seven-day timetable and a weak-topic worksheet. These are original practice tests, not official board papers.</p><p><a href="/board-booster-packs?pack=${pack}&amp;from=${encodeURIComponent(pathname)}#free-preview">See a free worked preview and the ₹199 ${subject} pack contents</a> · <a href="${diagnostic}">Try the free ${subject} diagnostic first</a></p><p>The pack request form does not take payment. Pay only after the recipient and delivery terms are confirmed.</p></section>`;
}

function addDiscovery(html, pathname) {
  const clean = html.replace(/<section\b[^>]*data-search-revenue=["'][^"']+["'][^>]*>[\s\S]*?<\/section>/gi, '');
  const block = discoveryBlock(pathname);
  if (!block) return clean;
  if (/<\/article>/i.test(clean)) return clean.replace(/<\/article>/i, `${block}</article>`);
  if (/<\/main>/i.test(clean)) return clean.replace(/<\/main>/i, `${block}</main>`);
  throw new Error(`No content container for search discovery links: ${pathname}`);
}

async function exists(file) {
  try {
    await access(file, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

function connectMapsIdentity(html) {
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi, (match, open, content, close) => {
    const data = JSON.parse(content);
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      if (node['@id'] === `${BASE}/#organization` && node['@type']) {
        const sameAs = Array.isArray(node.sameAs) ? node.sameAs : node.sameAs ? [node.sameAs] : [];
        node.sameAs = [...new Set([...sameAs, localTuitionService.mapsUrl])];
        node.telephone = localTuitionService.phone;
      }
      Object.values(node).forEach(value => Array.isArray(value) ? value.forEach(visit) : visit(value));
    }
    visit(data);
    return `${open}${JSON.stringify(data).replaceAll('<', '\\u003c')}${close}`;
  });
}

function candidates(pathname) {
  if (pathname === '/') return [join(DIST, 'index.html')];
  const clean = pathname.replace(/^\//, '');
  if (clean.endsWith('.html')) return [join(DIST, clean)];
  return [join(DIST, `${clean}.html`), join(DIST, clean, 'index.html')];
}

let fixed = 0;
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const files = candidates(pathname);
  for (const file of files) {
    if (!(await exists(file))) continue;
    const before = await readFile(file, 'utf8');
    const cleanTeaching = before.replace(/<section\b[^>]*data-teaching-guide="original-practice"[^>]*>[\s\S]*?<\/section>/gi, '');
    const teaching = renderSearchTeachingGuide(pathname);
    const withTeaching = teaching ? cleanTeaching.replace(/<\/main>/i, `${teaching}</main>`) : cleanTeaching;
    const withoutCanonicals = addDiscovery(withTeaching, pathname).replace(/<link\s+[^>]*rel=["']canonical["'][^>]*>\s*/gi, '');
    // Let React Helmet reuse and replace this tag after the app loads or navigates.
    let after = connectMapsIdentity(withoutCanonicals).replace('</head>', `<link rel="canonical" href="${url}" data-rh="true">\n</head>`);
    if (pathname === '/board-booster-packs') {
      after = after.replace(/<section\b[^>]*data-booster-preview="true"[^>]*>[\s\S]*?<\/section>/gi, '');
      after = after.replace(/<\/main>/i, `${renderBoardBoosterPreviews(BOARD_BOOSTER_PRODUCTS)}</main>`);
    }
    if ((pathname === '/contact' || pathname === '/commerce-coaching-mehsana' || pathname.endsWith('-tuition-mehsana') || pathname === '/cbse-commerce-classes-mehsana') && !after.includes('data-google-maps-listing')) {
      const mapsLink = `<p data-google-maps-listing="true"><a href="${escapeHtml(localTuitionService.mapsUrl)}" target="_blank" rel="noopener noreferrer">View Smit Sir Commerce Classes on Google Maps</a></p>`;
      after = after.replace(/<\/main>/i, `${mapsLink}</main>`);
    }
    if (after !== before) {
      await writeFile(file, after, 'utf8');
      fixed += 1;
    }
  }
}

console.log(`Normalized final canonical tags in ${fixed} sitemap HTML files.`);
