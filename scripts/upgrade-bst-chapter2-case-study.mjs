import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const dist = new URL('../dist/', import.meta.url);
const PATH = '/practice/cbse/class-12/business-studies/principles-of-management-case-study-questions';
const NOTES = '/cbse/class-12/business-studies/principles-of-management-notes';

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

const title = 'Class 12 Business Studies Chapter 2 Case Study Questions with Answers | CBSE';
const description = 'Practice original Class 12 Business Studies Chapter 2 case study questions with answers on Fayol principles, Taylor scientific management, techniques, unity of command, scalar chain and more.';

const block = `<section data-bst-ch2-growth="true" style="margin:32px 0;padding:26px;border:1px solid #d9dfef;border-radius:22px;background:#fafbff">
  <p style="margin:0 0 10px;font-size:12px;font-weight:900;letter-spacing:.10em;color:#415a9b">CBSE CLASS 12 · BUSINESS STUDIES CHAPTER 2</p>
  <h2>Principles of Management: case study questions with answers</h2>
  <p>Chapter 2 questions often describe a workplace situation and ask you to identify the principle or scientific-management technique. The fastest method is to spot the clue first, name the exact concept, and then connect the case to it.</p>

  <h3>Case 1: Unity of Command</h3>
  <p>Riya works in a retail company. Her sales manager asks her to focus on customer follow-ups, while another department head directly orders her to spend the same afternoon preparing inventory reports. She becomes confused about whose instruction should receive priority.</p>
  <p><strong>Question:</strong> Which Fayol principle is being violated?</p>
  <p><strong>Answer:</strong> <strong>Unity of Command.</strong> An employee should receive orders from only one superior. Receiving conflicting instructions from two bosses creates confusion and weakens accountability.</p>

  <h3>Case 2: Unity of Direction</h3>
  <p>A company runs two separate teams for the same new-product launch. Both teams have the same objective but follow different plans under different heads, causing duplicated work and inconsistent advertising.</p>
  <p><strong>Question:</strong> Which principle should management apply?</p>
  <p><strong>Answer:</strong> <strong>Unity of Direction.</strong> Activities having the same objective should be directed by one head and one plan.</p>

  <h3>Case 3: Scalar Chain and Gang Plank</h3>
  <p>During an urgent production breakdown, two managers working at the same organisational level need to exchange technical information immediately. Following the entire formal chain would cause a serious delay, so they communicate directly with permission and keep their superiors informed.</p>
  <p><strong>Question:</strong> Which concept is illustrated?</p>
  <p><strong>Answer:</strong> <strong>Gang Plank under Scalar Chain.</strong> Scalar chain is the formal line of authority, while a gang plank allows direct communication at the same level in urgent situations to save time.</p>

  <h3>Case 4: Initiative</h3>
  <p>A warehouse employee suggests a new shelf-coding system that could reduce picking time. The manager listens to the idea, allows the employee to test it and publicly appreciates the suggestion when it works.</p>
  <p><strong>Question:</strong> Which Fayol principle is reflected?</p>
  <p><strong>Answer:</strong> <strong>Initiative.</strong> Employees should be encouraged to think, suggest and execute useful plans within the limits of authority.</p>

  <h3>Case 5: Esprit de Corps</h3>
  <p>A manager avoids language that divides employees into rival groups. She celebrates team achievements and repeatedly reminds the staff that cooperation is more important than internal competition.</p>
  <p><strong>Question:</strong> Which Fayol principle is being followed?</p>
  <p><strong>Answer:</strong> <strong>Esprit de Corps.</strong> Management should promote team spirit, unity and harmony among employees.</p>

  <h3>Case 6: Science, Not Rule of Thumb</h3>
  <p>A factory stops relying on each worker's personal guess about the best way to assemble a product. Managers systematically study the work, compare alternatives and establish the most suitable method.</p>
  <p><strong>Question:</strong> Which Taylor principle is illustrated?</p>
  <p><strong>Answer:</strong> <strong>Science, Not Rule of Thumb.</strong> Taylor advocated developing scientific methods of work rather than relying only on traditional practices or personal judgement.</p>

  <h3>Case 7: Method Study</h3>
  <p>A production team compares four different ways of moving material from storage to the assembly line and selects the route that completes the task with the least unnecessary handling.</p>
  <p><strong>Question:</strong> Which technique of scientific management is used?</p>
  <p><strong>Answer:</strong> <strong>Method Study.</strong> It aims to identify the best method of performing a job.</p>

  <h3>Case 8: Differential Piece Wage System</h3>
  <p>A factory fixes a standard output of 50 units per day. Workers meeting or exceeding the standard receive a higher rate per unit, while workers producing below the standard receive a lower rate.</p>
  <p><strong>Question:</strong> Identify the technique.</p>
  <p><strong>Answer:</strong> <strong>Differential Piece Wage System.</strong> Efficient and inefficient workers are paid at different piece rates to encourage higher productivity.</p>

  <h3>Fast clue map: what the examiner is hinting at</h3>
  <div style="overflow-x:auto"><table style="width:100%;border-collapse:collapse"><thead><tr><th style="text-align:left;padding:10px;border-bottom:1px solid #ccd4e8">Clue in the case</th><th style="text-align:left;padding:10px;border-bottom:1px solid #ccd4e8">Think of</th></tr></thead><tbody>
    <tr><td style="padding:10px">One employee receiving orders from two bosses</td><td style="padding:10px"><strong>Unity of Command</strong></td></tr>
    <tr><td style="padding:10px">Same objective but different heads/plans</td><td style="padding:10px"><strong>Unity of Direction</strong></td></tr>
    <tr><td style="padding:10px">Specialisation of tasks</td><td style="padding:10px"><strong>Division of Work</strong></td></tr>
    <tr><td style="padding:10px">Urgent shortcut in the formal communication chain</td><td style="padding:10px"><strong>Gang Plank / Scalar Chain</strong></td></tr>
    <tr><td style="padding:10px">Encouraging employee suggestions</td><td style="padding:10px"><strong>Initiative</strong></td></tr>
    <tr><td style="padding:10px">Team spirit and unity</td><td style="padding:10px"><strong>Esprit de Corps</strong></td></tr>
    <tr><td style="padding:10px">Finding the best way to do a job</td><td style="padding:10px"><strong>Method Study</strong></td></tr>
    <tr><td style="padding:10px">Higher and lower piece rates based on efficiency</td><td style="padding:10px"><strong>Differential Piece Wage System</strong></td></tr>
    <tr><td style="padding:10px">Determining standard time for a task</td><td style="padding:10px"><strong>Time Study</strong></td></tr>
    <tr><td style="padding:10px">Removing unnecessary body movements</td><td style="padding:10px"><strong>Motion Study</strong></td></tr>
    <tr><td style="padding:10px">Rest intervals to reduce exhaustion</td><td style="padding:10px"><strong>Fatigue Study</strong></td></tr>
  </tbody></table></div>

  <h3>Do not confuse these two</h3>
  <p><strong>Unity of Command</strong> = one employee should receive orders from one boss. <strong>Unity of Direction</strong> = activities with the same objective should have one head and one plan.</p>

  <h3>4-step case-study answer method</h3>
  <ol>
    <li>Read exactly what the question asks: principle, technique, or significance.</li>
    <li>Underline the clue in the situation.</li>
    <li>Name the exact Fayol/Taylor concept.</li>
    <li>Explain in one or two lines how the clue proves your answer.</li>
  </ol>

  <p><em>These are original practice questions prepared for learning and are not presented as official CBSE questions.</em></p>

  <h3>Continue Chapter 2</h3>
  <p><a href="${NOTES}"><strong>Read Principles of Management notes →</strong></a> · <a href="/cbse/class-12/business-studies-case-study-questions">All Class 12 Business Studies case studies</a> · <a href="/practice/cbse/class-12/business-studies/principles-of-management-mcqs">Chapter 2 MCQs</a></p>
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
    } else if (!html.includes('data-bst-ch2-growth="true"')) {
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

console.log(`Upgraded BST Chapter 2 case-study page: ${patched} files patched.`);
