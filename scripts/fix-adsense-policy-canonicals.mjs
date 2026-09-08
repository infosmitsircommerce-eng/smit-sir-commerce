import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const BASE = 'https://www.smitsircommerce.in';
const distRoot = new URL('../dist/', import.meta.url).pathname;

const pages = [
  { route: '/contact', files: ['contact.html', 'contact/index.html'], description: 'Contact Smit Sir Commerce for Commerce study-material help, Class 11 and 12 learning support, free notes, PDF resources and student enquiries in Mehsana.' },
  { route: '/privacy', files: ['privacy.html', 'privacy/index.html'], description: 'Privacy Policy explaining how Smit Sir Commerce handles student enquiries, learning progress, analytics, cookies, advertising and website usage data.' },
  { route: '/terms', files: ['terms.html', 'terms/index.html'], description: 'Terms of Use for Smit Sir Commerce educational resources, free Commerce notes, PDF material, tools, games, practice pages and student support.' },
  { route: '/access-policy', files: ['access-policy.html', 'access-policy/index.html'], description: 'Access and Learning Policy explaining free resources, Pro-labelled features, student accounts, progress tracking and support on Smit Sir Commerce.' },
];

const robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

function esc(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function removeExistingHeadTags(html) {
  return html
    .replace(/<meta[^>]+name=["']description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']robots["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']googlebot["'][^>]*>/gi, '')
    .replace(/<link[^>]+rel=["']canonical["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:url["'][^>]*>/gi, '')
    .replace(/<meta[^>]+property=["']og:description["'][^>]*>/gi, '')
    .replace(/<meta[^>]+name=["']twitter:description["'][^>]*>/gi, '');
}

for (const page of pages) {
  const canonical = `${BASE}${page.route}`;
  const replacement = `<meta name="description" content="${esc(page.description)}"><meta name="robots" content="${robots}"><meta name="googlebot" content="${robots}"><link rel="canonical" href="${canonical}"><meta property="og:url" content="${canonical}"><meta property="og:description" content="${esc(page.description)}"><meta name="twitter:description" content="${esc(page.description)}">`;

  for (const relativeFile of page.files) {
    const filePath = join(distRoot, relativeFile);
    const original = await readFile(filePath, 'utf8');
    const cleaned = removeExistingHeadTags(original).replace('</head>', `${replacement}\n</head>`);
    await writeFile(filePath, cleaned, 'utf8');
  }
}

console.log(`Fixed canonical and meta tags for ${pages.length} AdSense policy/contact pages before SEO audit.`);
