import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/gseb/class-12/economics/emerging-issues-in-indian-economy-notes.html', import.meta.url),
  new URL('../dist/gseb/class-12/economics/emerging-issues-in-indian-economy-notes/index.html', import.meta.url),
];

const title = 'GSEB Class 12 Economics Chapter 11 Notes PDF | Emerging Issues';
const description = 'Free GSEB Class 12 Economics Chapter 11 Emerging Issues in Indian Economy notes PDF: post-1991 reforms, migration, urbanisation and infrastructure. 97-page free concept notes + practice.';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const quick = `<section class="card" data-emerging-issues-upgrade="true">
  <p style="font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#b7791f">Free · 97-page PDF · Chapter 11</p>
  <h2>Quick revision before you open the PDF</h2>
  <ul>
    <li><strong>Post-1991 economic-reform context:</strong> revise why the reform period matters to the changing Indian economy.</li>
    <li><strong>Migration:</strong> learn the meaning and classify the different types given in the chapter.</li>
    <li><strong>Urbanisation:</strong> connect population movement with the growth and challenges of urban areas.</li>
    <li><strong>Infrastructural services:</strong> revise the role of supporting services in economic activity and development.</li>
  </ul>
  <p><strong>Best study order:</strong> read one topic → close the PDF → write the meaning and key points from memory → check gaps → attempt Chapter 11 practice.</p>
  <div class="btns"><a class="btn gold" href="/materials/gseb/class-12/economics/free/chapter-11-notes.pdf">Open free 97-page PDF</a><a class="btn" href="/gseb-class-12-economics-practice.html#chapter-11">Practice Chapter 11</a></div>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    html = setTitle(html, title);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'name', 'twitter:description', description);

    html = html.replace(
      '<p>Revision page based on the uploaded GSEB Class 12 Economics Chapter 11 notes.</p>',
      '<p>Revise GSEB Class 12 Economics Chapter 11 with free 97-page concept notes, a focused topic map and linked chapter practice. Start with the four core areas below, then use the PDF for detailed study.</p>',
    );

    if (!html.includes('data-emerging-issues-upgrade="true"')) {
      const coverage = /(<section class="card"><h2>What this chapter covers<\/h2>[\s\S]*?<\/section>)/i;
      if (coverage.test(html)) html = html.replace(coverage, `$1${quick}`);
      else html = html.replace(/(<!-- economics-access-start -->)/i, `${quick}$1`);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded GSEB Chapter 11 Emerging Issues notes for CTR and free-PDF entry.');
