import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/cbse/class-12/business-studies-mcq.html', import.meta.url),
  new URL('../dist/cbse/class-12/business-studies-mcq/index.html', import.meta.url),
];

const oldTitle = 'CBSE Class 12 Business Studies MCQs with Answers Chapter Wise';
const title = 'Class 12 Business Studies MCQs with Answers | 12 Chapters';
const oldDescription = 'Practice chapter-wise CBSE Class 12 Business Studies MCQs with answers and explanations across all published chapters from management to consumer protection.';
const description = 'Practice free CBSE Class 12 Business Studies MCQs chapter-wise across all 12 chapters, with answers and explanations. Open public practice directly with no login.';

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const quickStart = `<section data-bst-mcq-upgrade="true" style="margin:22px 0;padding:22px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">12 chapters · Answers & explanations · Public practice</p>
  <h2>Choose one chapter and start practising</h2>
  <p>This hub links all 12 Class 12 Business Studies chapters. Start with a chapter you have already revised, answer without checking notes, then use every mistake to decide what to revise next.</p>
  <ul>
    <li><a href="/practice/cbse/class-12/business-studies/principles-of-management-mcqs"><strong>Principles of Management MCQs</strong></a></li>
    <li><a href="/practice/cbse/class-12/business-studies/business-environment-mcqs"><strong>Business Environment MCQs</strong></a></li>
    <li><a href="/practice/cbse/class-12/business-studies/planning-mcqs"><strong>Planning MCQs</strong></a></li>
    <li><a href="/practice/cbse/class-12/business-studies/controlling-mcqs"><strong>Controlling MCQs</strong></a></li>
  </ul>
  <p><strong>Need the concept first?</strong> <a href="/cbse/class-12/business-studies-notes">Open the free Class 12 Business Studies notes hub</a>.</p>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');

    // Keep title, social tags and structured data aligned around the same student promise.
    html = html.replaceAll(oldTitle, title);
    html = html.replaceAll(oldDescription, description);
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:title', `${title} | Smit Sir Commerce`);
    html = setMeta(html, 'name', 'twitter:description', description);
    html = html.replace('"learningResourceType":"Revision guide"', '"learningResourceType":"Practice quiz collection"');

    if (!html.includes('data-bst-mcq-upgrade="true"')) {
      const intro = /(<h1>[^<]*<\/h1>\s*<p>[^<]*<\/p>)/i;
      if (intro.test(html)) html = html.replace(intro, `$1${quickStart}`);
      else html = html.replace('</article>', `${quickStart}</article>`);
    } else {
      html = html.replace(/<section data-bst-mcq-upgrade="true"[\s\S]*?<\/section>/i, quickStart);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded Class 12 Business Studies MCQ hub for CTR and faster chapter entry.');
