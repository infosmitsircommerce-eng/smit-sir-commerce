import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/book-demo.html', import.meta.url),
  new URL('../dist/book-demo/index.html', import.meta.url),
];

const block = `<section data-book-demo-trust="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">No-pressure starting point</p>
  <h2>What to bring and what happens next</h2>
  <ul>
    <li><strong>Bring your latest test paper</strong> or tell us the chapter where you are losing marks.</li>
    <li><strong>Identify the mistake pattern</strong> — concept gap, answer-writing issue, missed keywords, calculation error or weak revision.</li>
    <li><strong>Get a simple next-step plan</strong> for the weak topics before deciding whether guided tuition is useful.</li>
  </ul>
  <p>Using the free paper analysis or demo does not require you to join a batch. You can also test the public learning resources first.</p>
  <p><a href="/cbse-notes"><strong>Try free CBSE notes</strong></a> · <a href="/gseb-class-12-economics.html"><strong>Try free GSEB Economics notes</strong></a> · <a href="/cbse/class-12/business-studies-case-study-questions"><strong>Try Business Studies case studies</strong></a></p>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    if (!html.includes('data-book-demo-trust="true"')) {
      const intro = /(<p>Already enrolled in another tuition\?[\s\S]*?<\/p>)/i;
      if (intro.test(html)) html = html.replace(intro, `$1${block}`);
      else html = html.replace(/(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i, `$1${block}`);
    }
    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Added no-pressure proof and free learning links to book-demo.');
