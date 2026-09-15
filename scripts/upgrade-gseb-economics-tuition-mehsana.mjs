import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/gseb-economics-tuition-mehsana.html', import.meta.url),
  new URL('../dist/gseb-economics-tuition-mehsana/index.html', import.meta.url),
];

const description = 'GSEB Economics tuition in Mehsana for Class 11 & 12 with concept explanation, answer writing, free Gujarat Board Economics notes, chapter practice and a free paper analysis/demo before joining.';

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const proof = `<section data-gseb-tuition-proof="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Try the learning support before deciding</p>
  <h2>Start with free GSEB Economics proof</h2>
  <p>Before enquiring about tuition, students can use the published GSEB Economics material and see whether the explanation and practice style helps them.</p>
  <ul>
    <li><a href="/gseb-class-12-economics.html"><strong>Open GSEB Class 12 Economics notes & PDFs</strong></a></li>
    <li><a href="/gseb-class-12-economics-practice.html"><strong>Try chapter-wise GSEB Economics practice</strong></a></li>
    <li><a href="/book-demo?from=gseb-economics-tuition-mehsana&mode=Offline"><strong>Request a free paper analysis + demo</strong></a></li>
  </ul>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');

    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:description', description);

    // Keep the page's structured-data description aligned with the public snippet.
    html = html.replaceAll(
      'GSEB Economics tuition in Mehsana for Class 11 and 12 with simple concept explanation, chapter-wise revision, diagrams, answer writing and free Gujarat Board Economics resources.',
      description,
    );

    // The old top proof link incorrectly sent GSEB visitors to CBSE notes.
    html = html.replace(
      /<p><a href="\/book-demo">Get a free paper analysis \+ demo<\/a> · <a href="\/cbse-notes">Free CBSE Commerce notes<\/a><\/p>/i,
      '<p><a href="/book-demo?from=gseb-economics-tuition-mehsana&mode=Offline">Get a free paper analysis + demo</a> · <a href="/gseb-class-12-economics.html">Free GSEB Economics notes & PDFs</a></p>',
    );

    if (!html.includes('data-gseb-tuition-proof="true"')) {
      const introCta = /(<p><a href="\/book-demo\?from=gseb-economics-tuition-mehsana&mode=Offline">[\s\S]*?<\/p>)/i;
      if (introCta.test(html)) html = html.replace(introCta, `$1${proof}`);
      else html = html.replace(/(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i, `$1${proof}`);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded GSEB Economics tuition Mehsana proof and local conversion path.');
