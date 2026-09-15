import { readFile, writeFile } from 'node:fs/promises';

const file = new URL('../dist/gseb/class-12/economics/indicators-of-growth-and-development-notes.html', import.meta.url);
const canonical = 'https://www.smitsircommerce.in/gseb/class-12/economics/indicators-of-growth-and-development-notes.html';
const pdf = '/materials/gseb/class-12/economics/free/chapter-02-notes.pdf';
const practice = '/gseb-class-12-economics-practice.html#chapter-2';

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

function setCanonical(html, value) {
  const tag = `<link rel="canonical" href="${value}">`;
  return /<link\s+rel=["']canonical["'][^>]*>/i.test(html)
    ? html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, tag)
    : html.replace('</head>', `${tag}\n</head>`);
}

const title = 'Indicators of Growth and Development Class 12 Notes PDF | GSEB';
const description = 'Free GSEB Class 12 Economics Indicators of Growth and Development notes PDF: growth vs development, national income, per capita income, PQLI, HDI and quick revision.';

const revision = `<section class="card" data-growth-indicators-upgrade="true">
  <h2>Indicators of Growth and Development: quick revision</h2>
  <p>This chapter becomes easier when you separate <strong>economic growth</strong> from the broader idea of <strong>economic development</strong>, then understand why income alone cannot describe every improvement in people’s quality of life.</p>

  <div class="btns" style="margin:16px 0 20px">
    <a class="btn gold" href="${pdf}">Read free 64-page PDF</a>
    <a class="btn" href="${pdf}" download>Download free PDF</a>
    <a class="btn" href="${practice}">Practice Chapter 2</a>
  </div>

  <h3>1. Economic growth vs economic development</h3>
  <div style="overflow-x:auto">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #e8e2d8">Economic Growth</th><th style="text-align:left;padding:10px;border-bottom:1px solid #e8e2d8">Economic Development</th></tr></thead>
      <tbody>
        <tr><td style="padding:10px">Mainly focuses on quantitative increase in output or income.</td><td style="padding:10px">Broader process that also considers qualitative improvement in people’s lives.</td></tr>
        <tr><td style="padding:10px">Can be studied through changes in measures such as national income and per-capita income.</td><td style="padding:10px">Looks beyond income to wider human and social progress.</td></tr>
        <tr><td style="padding:10px">Answers: “Is the economy producing or earning more?”</td><td style="padding:10px">Answers: “Are people’s overall conditions improving as the economy changes?”</td></tr>
      </tbody>
    </table>
  </div>

  <h3>2. National Income and Per Capita Income</h3>
  <p><strong>National Income</strong> helps show the total income generated in an economy. <strong>Per Capita Income</strong> relates income to population and is commonly expressed as:</p>
  <p style="font-size:1.05rem"><strong>Per Capita Income = National Income ÷ Population</strong></p>
  <p>For exam answers, do not treat a rise in per-capita income as the only proof of development. This chapter also introduces broader quality-of-life and human-development indicators.</p>

  <h3>3. PQLI and HDI: why broader indicators matter</h3>
  <ul>
    <li><strong>PQLI:</strong> a quality-of-life approach that shifts attention from income alone toward people’s physical well-being.</li>
    <li><strong>HDI:</strong> a broader human-development measure that considers health, education and standard of living together.</li>
  </ul>
  <p>The exam idea to remember is simple: <strong>income measures economic performance, while development indicators help us judge wider human progress.</strong></p>

  <h3>4. Fast answer method</h3>
  <ol>
    <li>Start with the exact definition asked in the question.</li>
    <li>If it is a difference question, compare both concepts on the same basis.</li>
    <li>Use the correct indicator name instead of writing a vague “quality of life” answer.</li>
    <li>For longer answers, explain why one income measure alone may not capture the full idea of development.</li>
  </ol>

  <h3>5. Test yourself before opening the PDF</h3>
  <ul>
    <li>How is economic development broader than economic growth?</li>
    <li>How is per-capita income calculated?</li>
    <li>Why can income alone be an incomplete indicator of development?</li>
    <li>What is the basic purpose of PQLI?</li>
    <li>What broad dimensions are considered by HDI?</li>
  </ul>

  <p><a href="/gseb-class-12-economics.html"><strong>All GSEB Class 12 Economics chapters →</strong></a> · <a href="/gseb-economics-tuition-mehsana">GSEB Economics support in Mehsana</a></p>
</section>`;

try {
  let html = await readFile(file, 'utf8');
  html = setTitle(html, title);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', canonical);
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setCanonical(html, canonical);

  html = html.replace(
    /<section class="hero">([\s\S]*?)<p>Chapter-wise revision page based on the uploaded GSEB Class 12 Economics notes\.<\/p><\/section>/i,
    '<section class="hero">$1<p>Revise growth vs development, National Income, Per Capita Income, PQLI and HDI with a free 64-page concept-notes PDF plus chapter practice.</p></section>'
  );

  const generic = /<section class="card"><h2>What this chapter covers<\/h2>[\s\S]*?<\/section>/i;
  if (generic.test(html)) {
    html = html.replace(generic, revision);
  } else if (!html.includes('data-growth-indicators-upgrade="true"')) {
    html = html.replace('<!-- economics-access-start -->', `${revision}<!-- economics-access-start -->`);
  }

  await writeFile(file, html, 'utf8');
  console.log('Upgraded GSEB Indicators of Growth and Development page.');
} catch (error) {
  if (error?.code === 'ENOENT') {
    console.log('GSEB Indicators page not generated; skipped.');
  } else {
    throw error;
  }
}
