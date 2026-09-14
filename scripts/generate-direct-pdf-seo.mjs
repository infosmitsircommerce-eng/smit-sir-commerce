import { readdir, stat, writeFile, readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const SITE = 'https://www.smitsircommerce.in';
const publicDir = new URL('../public/', import.meta.url);

// IMPORTANT: Only directories containing Smit Sir Commerce original material
// (or material for which redistribution rights are held) belong here.
// Do not add official NCERT/GSEB/third-party textbooks without permission.
const ORIGINAL_FREE_PDF_ROOTS = [
  'materials/cbse/class-11/microeconomics',
  'materials/cbse/class-12/business-studies',
  'materials/class-12/economics',
  'materials/gseb/class-11/accountancy/free',
  'materials/gseb/class-11/business-administration',
  'materials/gseb/class-12/business-administration',
  'materials/gseb/class-12/economics/free',
  'downloads',
];

const LABELS = {
  'materials/cbse/class-11/microeconomics': 'CBSE Class 11 Microeconomics',
  'materials/cbse/class-12/business-studies': 'CBSE Class 12 Business Studies',
  'materials/class-12/economics': 'CBSE Class 12 Economics',
  'materials/gseb/class-11/accountancy/free': 'GSEB Class 11 Accountancy',
  'materials/gseb/class-11/business-administration': 'GSEB Class 11 Business Administration',
  'materials/gseb/class-12/business-administration': 'GSEB Class 12 Business Administration',
  'materials/gseb/class-12/economics/free': 'GSEB Class 12 Economics',
  downloads: 'Free Commerce Revision Downloads',
};

function escapeXml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function titleFromFile(filename) {
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/chapter[-_ ]?(\d+)/i, 'Chapter $1')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (m) => m.toUpperCase())
    .replace(/\bAnd\b/g, 'and')
    .replace(/\bOf\b/g, 'of')
    .replace(/\bTo\b/g, 'to');
}

async function collectPdfs(root) {
  const absoluteRoot = join(publicDir.pathname, root);
  const items = [];

  async function walk(dir) {
    let entries = [];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (error?.code === 'ENOENT') return;
      throw error;
    }

    for (const entry of entries) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
        const info = await stat(full);
        const rel = relative(publicDir.pathname, full).split(sep).join('/');
        items.push({
          root,
          path: `/${rel}`,
          title: titleFromFile(entry.name),
          lastmod: info.mtime.toISOString().slice(0, 10),
          size: info.size,
        });
      }
    }
  }

  await walk(absoluteRoot);
  return items;
}

const groups = [];
for (const root of ORIGINAL_FREE_PDF_ROOTS) {
  const files = await collectPdfs(root);
  if (files.length) groups.push({ root, label: LABELS[root] || root, files });
}

const all = groups.flatMap((group) => group.files);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${SITE}/free-pdf-library.html</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.92</priority>\n  </url>\n${all.map((item) => `  <url>\n    <loc>${escapeXml(`${SITE}${item.path}`)}</loc>\n    <lastmod>${item.lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.78</priority>\n  </url>`).join('\n')}\n</urlset>\n`;

await writeFile(join(publicDir.pathname, 'pdf-sitemap.xml'), sitemap, 'utf8');

const itemList = all.map((item, index) => ({
  '@type': 'ListItem',
  position: index + 1,
  name: item.title,
  url: `${SITE}${item.path}`,
}));

const groupHtml = groups.map((group) => `
<section class="group">
  <h2>${escapeHtml(group.label)}</h2>
  <p>${group.files.length} free PDF${group.files.length === 1 ? '' : 's'} available for direct reading.</p>
  <div class="grid">
    ${group.files.map((item) => `<a class="pdf" href="${escapeHtml(item.path)}">
      <span class="tag">PDF</span>
      <strong>${escapeHtml(item.title)}</strong>
      <small>Open free PDF · Smit Sir Commerce study material</small>
    </a>`).join('\n')}
  </div>
</section>`).join('\n');

const libraryHtml = `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Free Commerce PDF Notes | CBSE & GSEB Class 11–12 | Smit Sir Commerce</title>
  <meta name="description" content="Open free original Commerce PDF notes from Smit Sir Commerce for CBSE and GSEB Class 11 and 12: Economics, Business Studies, Accountancy and Business Administration." />
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
  <link rel="canonical" href="${SITE}/free-pdf-library.html" />
  <script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Commerce PDF Notes',
    url: `${SITE}/free-pdf-library.html`,
    description: 'Original free Commerce study PDFs from Smit Sir Commerce for CBSE and GSEB students.',
    mainEntity: { '@type': 'ItemList', itemListElement: itemList },
    author: { '@type': 'Person', name: 'Smit Thaker', url: `${SITE}/about#smit-thaker` },
    publisher: { '@type': 'EducationalOrganization', name: 'Smit Sir Commerce', url: SITE },
  })}</script>
  <style>
    :root{font-family:Inter,system-ui,sans-serif;color:#121826;background:#f6f8fb}*{box-sizing:border-box}body{margin:0}.wrap{max-width:1100px;margin:auto;padding:40px 20px 70px}.hero{background:#0f1c3f;color:white;border-radius:28px;padding:34px;box-shadow:0 18px 45px #0f1c3f20}.eyebrow{color:#f5c95c;font-weight:800;letter-spacing:.12em;font-size:12px}.hero h1{font-size:clamp(32px,6vw,58px);line-height:1.02;margin:12px 0}.hero p{max-width:760px;line-height:1.65;color:#dbe5ff}.notice{margin:18px 0 0;padding:14px 16px;border-radius:14px;background:#ffffff12;border:1px solid #ffffff25}.group{margin-top:42px}.group h2{font-size:28px;margin-bottom:7px}.group>p{color:#5a6475}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-top:18px}.pdf{text-decoration:none;color:#172033;background:white;border:1px solid #e1e6ef;border-radius:18px;padding:18px;display:flex;flex-direction:column;gap:9px;box-shadow:0 7px 22px #1720330a}.pdf:hover{transform:translateY(-2px);border-color:#d3a62f}.tag{align-self:flex-start;background:#fff3cc;color:#7a5700;border-radius:999px;padding:5px 9px;font-size:11px;font-weight:800}.pdf small{color:#697386;line-height:1.4}.back{display:inline-block;margin-top:36px;color:#173d91;font-weight:700}footer{margin-top:40px;color:#687386;font-size:13px;line-height:1.6}
  </style>
</head>
<body>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">FREE · ORIGINAL STUDY MATERIAL</div>
    <h1>Commerce PDFs you can open directly.</h1>
    <p>Chapter-wise free notes for CBSE and GSEB Class 11–12. These are Smit Sir Commerce study resources, created for learning and revision.</p>
    <div class="notice"><strong>Important:</strong> This library contains original study material, not re-hosted official NCERT/GSEB textbooks. For official textbooks, use the board/publisher's official source.</div>
  </section>
  ${groupHtml}
  <a class="back" href="/study-material">← Browse the full Study Material hub</a>
  <footer>© Smit Sir Commerce · Free learning resources. Board and publisher names are used only to identify the relevant syllabus.</footer>
</main>
</body>
</html>\n`;

await writeFile(join(publicDir.pathname, 'free-pdf-library.html'), libraryHtml, 'utf8');

// Add a single stable discovery link to the existing static free-notes page when present.
try {
  const notesPath = join(publicDir.pathname, 'free-commerce-notes.html');
  let notes = await readFile(notesPath, 'utf8');
  if (!notes.includes('/free-pdf-library.html')) {
    notes = notes.replace('</body>', '<p style="text-align:center;margin:24px"><a href="/free-pdf-library.html">Open the direct Free Commerce PDF Library</a></p>\n</body>');
    await writeFile(notesPath, notes, 'utf8');
  }
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

console.log(`[pdf-seo] Published direct-PDF discovery for ${all.length} original/free PDFs across ${groups.length} collections.`);
