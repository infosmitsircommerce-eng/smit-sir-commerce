import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/practice/cbse/class-12/business-studies/nature-and-significance-of-management-case-study-questions';

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

const title = 'Class 12 Business Studies Chapter 1 Case Study Questions with Answers | CBSE';
const description = 'Practice original Class 12 Business Studies Chapter 1 case study questions with answers on management objectives, effectiveness, efficiency, coordination, levels and nature of management.';

const block = `<section data-bst-ch1-growth="true" style="margin:32px 0;padding:26px;border:1px solid #ead7a7;border-radius:22px;background:#fffaf0">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#946915">CBSE CLASS 12 · BUSINESS STUDIES CHAPTER 1</p>
  <h2>Nature and Significance of Management: case study questions with answers</h2>
  <p>Chapter 1 case studies become much easier when you stop searching for the full textbook line and start identifying the clue in the situation. Use the short original cases below to practise that skill.</p>

  <h3>Case 1: Effectiveness and efficiency</h3>
  <p>A food-delivery company sets a target of completing 5,000 deliveries in a week. The team achieves the target but uses far more fuel and overtime than planned.</p>
  <p><strong>Question:</strong> Which management ideas are visible?</p>
  <p><strong>Answer:</strong> The team was <strong>effective</strong> because it achieved the target, but it was not fully <strong>efficient</strong> because it used excessive resources and cost.</p>

  <h3>Case 2: Coordination</h3>
  <p>A clothing company launches a new collection. Production finishes the garments on time, marketing starts promotions, finance releases the campaign budget and the sales team prepares stores for launch.</p>
  <p><strong>Question:</strong> Which force of management binds these activities together?</p>
  <p><strong>Answer:</strong> <strong>Coordination.</strong> It integrates the activities of different departments so they work toward the common organisational objective.</p>

  <h3>Case 3: Organisational objective</h3>
  <p>A business wants to increase sales, control operating costs and earn enough profit to continue growing.</p>
  <p><strong>Question:</strong> Which objective of management is mainly reflected?</p>
  <p><strong>Answer:</strong> <strong>Organisational objectives</strong>, because the focus is on survival, profit and growth of the organisation.</p>

  <h3>Case 4: Management of people</h3>
  <p>A manager notices that employees have different abilities and motivations. She assigns work according to strengths, listens to concerns and encourages the team to work together.</p>
  <p><strong>Question:</strong> Which dimension of management is highlighted?</p>
  <p><strong>Answer:</strong> <strong>Management of people.</strong> The manager is dealing with employees as individuals and as a group to achieve organisational goals.</p>

  <h3>Case 5: Level of management</h3>
  <p>A department head converts the company’s broad strategy into departmental targets, coordinates supervisors and reports progress to senior management.</p>
  <p><strong>Question:</strong> Which level of management is represented?</p>
  <p><strong>Answer:</strong> <strong>Middle-level management.</strong> It links top management with supervisory management and implements broad plans through departmental action.</p>

  <h3>Case 6: Management as an art</h3>
  <p>Two managers know the same management principles, but one handles a difficult employee conflict more successfully because she applies those principles with judgement, experience and creativity.</p>
  <p><strong>Question:</strong> Which nature of management is illustrated?</p>
  <p><strong>Answer:</strong> <strong>Management as an art.</strong> Art requires personal skill and practical application of knowledge to achieve desired results.</p>

  <h3>Fast clue map for Chapter 1</h3>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #e1c98f">Clue in the case</th><th style="text-align:left;padding:10px;border-bottom:1px solid #e1c98f">Think of</th></tr></thead><tbody>
    <tr><td style="padding:10px">Target achieved</td><td style="padding:10px"><strong>Effectiveness</strong></td></tr>
    <tr><td style="padding:10px">Minimum cost / least waste</td><td style="padding:10px"><strong>Efficiency</strong></td></tr>
    <tr><td style="padding:10px">Departments working together</td><td style="padding:10px"><strong>Coordination</strong></td></tr>
    <tr><td style="padding:10px">Survival, profit, growth</td><td style="padding:10px"><strong>Organisational objectives</strong></td></tr>
    <tr><td style="padding:10px">Department head / connects top and supervisors</td><td style="padding:10px"><strong>Middle-level management</strong></td></tr>
    <tr><td style="padding:10px">Skill, judgement, creativity in application</td><td style="padding:10px"><strong>Management as an art</strong></td></tr>
  </tbody></table></div>

  <h3>4-step answer method</h3>
  <ol>
    <li>Read what the question asks before reading the whole case again.</li>
    <li>Underline the clue that points to the concept.</li>
    <li>Name the exact concept using the textbook keyword.</li>
    <li>Connect one line from the case to that concept.</li>
  </ol>

  <p><em>These are original practice questions prepared for learning and are not presented as official CBSE questions.</em></p>
  <p><a href="/cbse/class-12/business-studies-case-study-questions"><strong>Open all Class 12 Business Studies case-study questions →</strong></a></p>
</section>`;

const oldBlock = /<section\s+data-search-console-upgrade=["']case-study["'][\s\S]*?<\/section>/i;

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

    if (oldBlock.test(html)) {
      html = html.replace(oldBlock, block);
    } else if (!html.includes('data-bst-ch1-growth="true"')) {
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

console.log(`Upgraded BST Chapter 1 case-study page: ${patched} files patched.`);
