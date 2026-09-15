import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/cbse-commerce-classes-mehsana.html', import.meta.url),
  new URL('../dist/cbse-commerce-classes-mehsana/index.html', import.meta.url),
];

const block = `<section data-cbse-local-proof="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Try the learning support free first</p>
  <h2>See the CBSE Commerce study style before joining</h2>
  <p>Students can open the public resources below without joining tuition. Use them to judge the explanation and practice style first.</p>
  <ul>
    <li><a href="/cbse/class-12/business-studies-notes"><strong>Class 12 Business Studies notes</strong></a></li>
    <li><a href="/cbse/class-12/business-studies-case-study-questions"><strong>Class 12 Business Studies case studies with answers</strong></a></li>
    <li><a href="/cbse/class-12/business-studies-mcq"><strong>Class 12 Business Studies MCQs — all 12 chapters</strong></a></li>
    <li><a href="/cbse/class-11/microeconomics-notes"><strong>Class 11 Microeconomics notes</strong></a></li>
    <li><a href="/book-demo?from=cbse-commerce-classes-mehsana&mode=Offline"><strong>Free paper analysis + demo</strong></a></li>
  </ul>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    html = html.replace(
      /<p><a href="\/book-demo">Get a free paper analysis \+ demo<\/a> · <a href="\/cbse-notes">Free CBSE Commerce notes<\/a><\/p>/i,
      '<p><a href="/book-demo?from=cbse-commerce-classes-mehsana&mode=Offline">Get a free paper analysis + demo</a> · <a href="/cbse-notes">Free CBSE Commerce notes</a></p>',
    );
    if (!html.includes('data-cbse-local-proof="true"')) {
      const topCta = /(<p><a href="\/book-demo\?from=cbse-commerce-classes-mehsana&mode=Offline">[\s\S]*?<\/p>)/i;
      if (topCta.test(html)) html = html.replace(topCta, `$1${block}`);
      else html = html.replace(/(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i, `$1${block}`);
    }
    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Added free CBSE proof to the Mehsana CBSE classes page.');
