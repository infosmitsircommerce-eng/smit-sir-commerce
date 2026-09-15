import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/commerce-coaching-mehsana.html', import.meta.url),
  new URL('../dist/commerce-coaching-mehsana/index.html', import.meta.url),
];

const block = `<section data-mehsana-pathways="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Choose what you need</p>
  <h2>Go directly to your subject or free study support</h2>
  <p>If you reached this page from Google, you do not need to read everything first. Open the path that matches your class, board or subject.</p>
  <ul>
    <li><a href="/economics-tuition-mehsana"><strong>Economics tuition in Mehsana</strong></a></li>
    <li><a href="/business-studies-tuition-mehsana"><strong>Business Studies tuition in Mehsana</strong></a></li>
    <li><a href="/gseb-economics-tuition-mehsana"><strong>GSEB Economics tuition + free GSEB proof</strong></a></li>
    <li><a href="/cbse-commerce-classes-mehsana"><strong>CBSE Commerce classes in Mehsana</strong></a></li>
    <li><a href="/mehsana-commerce-student-resources"><strong>Free Commerce resources for Mehsana students</strong></a></li>
    <li><a href="/book-demo?from=commerce-coaching-pathways&mode=Offline"><strong>Free paper analysis + demo</strong></a></li>
  </ul>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    if (!html.includes('data-mehsana-pathways="true"')) {
      const intro = /(<p>Free notes are available without joining tuition\.[\s\S]*?<\/p>)/i;
      if (intro.test(html)) html = html.replace(intro, `$1${block}`);
      else html = html.replace(/(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i, `$1${block}`);
    } else {
      html = html.replace(/<section data-mehsana-pathways="true"[\s\S]*?<\/section>/i, block);
    }
    // Remove the old .html internal-link variant anywhere it survived older prerenders.
    html = html.replaceAll('/mehsana-commerce-student-resources.html', '/mehsana-commerce-student-resources');
    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Added student pathways to the high-traffic Mehsana Commerce coaching hub with clean resource URL.');
