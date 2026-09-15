import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/cbse/class-12/business-studies/controlling-notes';
const PDF = '/materials/cbse/class-12/business-studies/chapter-08-controlling.pdf';

function routeFiles(path) {
  const relative = path.replace(/^\//, '');
  return [join(dist.pathname, `${relative}.html`), join(dist.pathname, relative, 'index.html')];
}

function setTitle(html, value) {
  return html.replace(/<title>[^<]*<\/title>/i, `<title>${value}</title>`);
}

function setMeta(html, selector, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = selector.startsWith('og:')
    ? new RegExp(`<meta\\s+property=["']${selector}["'][^>]*>`, 'i')
    : new RegExp(`<meta\\s+name=["']${selector}["'][^>]*>`, 'i');
  const replacement = selector.startsWith('og:')
    ? `<meta property="${selector}" content="${escaped}">`
    : `<meta name="${selector}" content="${escaped}">`;
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : html.replace('</head>', `${replacement}\n</head>`);
}

const title = 'Controlling Class 12 Notes PDF | Business Studies Chapter 8';
const description = 'Free Class 12 Business Studies Controlling notes PDF with meaning, importance, planning relationship, 5-step controlling process, deviations, case-study clues and revision.';

const block = `<section data-controlling-growth="true" style="margin:32px 0;padding:26px;border:1px solid #dfe6d5;border-radius:22px;background:#fbfff7">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#50702f">CBSE CLASS 12 · BUSINESS STUDIES CHAPTER 8</p>
  <h2>Controlling Class 12: understand the process, then practise the clues</h2>
  <p>Controlling is not simply checking mistakes at the end. It is the process of setting standards, measuring actual performance, comparing the two, analysing important deviations and taking corrective action.</p>

  <p style="margin:18px 0"><a href="${PDF}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#172033;color:#fff;font-weight:900;text-decoration:none"><strong>Open Free Controlling Notes PDF →</strong></a></p>

  <h3>Meaning in one line</h3>
  <p><strong>Controlling</strong> ensures that actual activities are performed according to plans by comparing results with standards and correcting important deviations.</p>

  <h3>Why controlling is important</h3>
  <ul>
    <li><strong>Accomplishing organisational goals:</strong> it keeps performance directed toward planned targets.</li>
    <li><strong>Judging accuracy of standards:</strong> actual results show whether standards are realistic and useful.</li>
    <li><strong>Making efficient use of resources:</strong> deviations can reveal waste or inefficient use.</li>
    <li><strong>Improving employee motivation:</strong> clear standards tell people what performance is expected.</li>
    <li><strong>Ensuring order and discipline:</strong> regular comparison and correction support consistent work.</li>
    <li><strong>Facilitating coordination:</strong> common standards help departments work toward the same goals.</li>
  </ul>

  <h3>Planning and controlling: remember the relationship</h3>
  <p><strong>Planning sets the standards; controlling checks the results against those standards.</strong> Planning without controlling cannot tell managers whether plans are working. Controlling without planning has no standard against which performance can be compared.</p>

  <h3>The 5-step controlling process</h3>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #cfd9c4">Step</th><th style="text-align:left;padding:10px;border-bottom:1px solid #cfd9c4">What it means</th><th style="text-align:left;padding:10px;border-bottom:1px solid #cfd9c4">Case-study clue</th></tr></thead><tbody>
    <tr><td style="padding:10px"><strong>1. Set standards</strong></td><td style="padding:10px">Fix measurable targets or expected performance.</td><td style="padding:10px">target, benchmark, standard, budget</td></tr>
    <tr><td style="padding:10px"><strong>2. Measure actual performance</strong></td><td style="padding:10px">Find out what was actually achieved.</td><td style="padding:10px">actual sales, output, defect rate, results</td></tr>
    <tr><td style="padding:10px"><strong>3. Compare</strong></td><td style="padding:10px">Compare actual performance with the standard.</td><td style="padding:10px">actual vs target, gap, difference</td></tr>
    <tr><td style="padding:10px"><strong>4. Analyse deviations</strong></td><td style="padding:10px">Identify significant deviations and their causes.</td><td style="padding:10px">investigates reason, major deviation, exception</td></tr>
    <tr><td style="padding:10px"><strong>5. Corrective action</strong></td><td style="padding:10px">Take action to remove the cause and improve performance.</td><td style="padding:10px">repair, training, revision of process, corrective step</td></tr>
  </tbody></table></div>

  <h3>Two exam terms students often mix up</h3>
  <ul>
    <li><strong>Critical Point Control:</strong> managers focus on key result areas where problems can seriously affect performance.</li>
    <li><strong>Management by Exception:</strong> managers concentrate on significant deviations that require attention instead of spending equal time on every small variation.</li>
  </ul>

  <h3>Mini solved case</h3>
  <p>A company sets a monthly sales target of 1,000 units. Actual sales are 820 units. The manager compares the result with the target, investigates the 180-unit shortfall and finds that delivery delays caused lost orders. The firm changes its dispatch schedule.</p>
  <p><strong>Answer logic:</strong> 1,000 units = standard; 820 units = actual performance; 180 units = deviation; investigating delivery delays = analysing deviation; changing the dispatch schedule = corrective action.</p>

  <h3>Common mistakes to avoid</h3>
  <ul>
    <li>Writing only “comparison” when the case also shows investigation and corrective action.</li>
    <li>Calling every deviation management by exception. It applies when attention is focused on significant exceptions.</li>
    <li>Writing that planning and controlling are unrelated; they are closely connected.</li>
    <li>Giving the five steps out of sequence in a process question.</li>
  </ul>

  <h3>Quick self-test</h3>
  <ul>
    <li>What is the first step in the controlling process?</li>
    <li>What is a deviation?</li>
    <li>Why is planning called a prerequisite for controlling?</li>
    <li>Differentiate Critical Point Control and Management by Exception.</li>
    <li>What should a manager do after analysing the cause of a major deviation?</li>
  </ul>

  <h3>Continue practising Business Studies</h3>
  <p><a href="/practice/cbse/class-12/business-studies/controlling-case-study-questions">Controlling case-study questions</a> · <a href="/cbse/class-12/business-studies-case-study-questions">All Class 12 Business Studies case studies</a> · <a href="/cbse/class-12/business-studies-important-questions">Important questions</a> · <a href="/cbse/class-12/business-studies-mcq">MCQ practice</a></p>
</section>`;

const oldTrafficBlock = /<section\s+data-traffic-winner=["']controlling-notes["'][\s\S]*?<\/section>/i;

let patched = 0;
for (const file of routeFiles(PATH)) {
  try {
    let html = await readFile(file, 'utf8');
    const before = html;

    html = setTitle(html, title);
    html = setMeta(html, 'description', description);
    html = setMeta(html, 'og:title', title);
    html = setMeta(html, 'og:description', description);
    html = setMeta(html, 'twitter:title', title);
    html = setMeta(html, 'twitter:description', description);

    if (oldTrafficBlock.test(html)) {
      html = html.replace(oldTrafficBlock, block);
    } else if (!html.includes('data-controlling-growth="true"')) {
      const anchors = ['<h2>Continue learning</h2>', '<h2>Related resources</h2>', '</article>', '</main>'];
      let inserted = false;
      for (const anchor of anchors) {
        if (html.includes(anchor)) {
          html = html.replace(anchor, `${block}${anchor}`);
          inserted = true;
          break;
        }
      }
      if (!inserted) html = html.replace('</body>', `${block}</body>`);
    }

    if (html !== before) {
      await writeFile(file, html, 'utf8');
      patched += 1;
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log(`Upgraded Controlling notes page: ${patched} files patched.`);
