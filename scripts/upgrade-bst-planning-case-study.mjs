import { readFile, writeFile } from 'node:fs/promises';

const files = [
  new URL('../dist/practice/cbse/class-12/business-studies/planning-case-study-questions.html', import.meta.url),
  new URL('../dist/practice/cbse/class-12/business-studies/planning-case-study-questions/index.html', import.meta.url),
];

const description = 'Free CBSE Class 12 Business Studies Planning case study questions with answers: planning process, limitations, objectives, strategy, policy, procedure, method, rule, programme and budget.';

function setMeta(html, attribute, key, value) {
  const escaped = value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${key}["'][^>]*>`, 'i');
  const replacement = `<meta ${attribute}="${key}" content="${escaped}">`;
  return pattern.test(html) ? html.replace(pattern, replacement) : html.replace('</head>', `${replacement}\n</head>`);
}

const block = `<section data-planning-case-upgrade="true" style="margin:28px 0;padding:24px;border:1px solid #eadfca;border-radius:20px;background:#fffaf2">
  <p style="margin:0 0 8px;font-size:12px;font-weight:900;letter-spacing:.1em;text-transform:uppercase;color:#9a681b">Planning case-study clue map</p>
  <h2>Spot the clue before writing the concept</h2>
  <ul>
    <li><strong>Target or desired result</strong> → Objective.</li>
    <li><strong>Broad long-term direction</strong> → Strategy.</li>
    <li><strong>General guideline for decisions</strong> → Policy.</li>
    <li><strong>Sequence of steps</strong> → Procedure.</li>
    <li><strong>One prescribed way of doing a task</strong> → Method.</li>
    <li><strong>No discretion / must or must not</strong> → Rule.</li>
    <li><strong>One-time coordinated set of activities</strong> → Programme.</li>
    <li><strong>Plan expressed in numbers</strong> → Budget.</li>
  </ul>

  <h2>More solved Planning case studies</h2>

  <h3>Case 1 — Planning process</h3>
  <p>A school-supplies company wants to increase institutional sales by 15%. Managers collect information about schools, develop three sales approaches, compare their likely cost and reach, select one approach and create supporting schedules.</p>
  <p><strong>Answer:</strong> The case shows setting objectives, developing/evaluating alternatives, selecting an alternative and implementing the plan. In an exam answer, identify the exact step from the sentence given in the question.</p>

  <h3>Case 2 — Planning may create rigidity</h3>
  <p>A retailer follows a fixed annual promotion plan even after customer demand suddenly shifts toward a different product category. Managers refuse to change the plan because the activities were approved months earlier.</p>
  <p><strong>Answer:</strong> This illustrates the limitation that planning may create rigidity. A plan should guide action, but excessive attachment to it can reduce flexibility when conditions change.</p>

  <h3>Case 3 — Policy, procedure and rule</h3>
  <p>A firm says customer complaints should be handled fairly. It also gives employees a sequence for recording, checking and resolving each complaint, and states that no customer data may be shared outside the firm.</p>
  <p><strong>Answer:</strong> “Handled fairly” is a <strong>policy</strong>; the sequence for resolving complaints is a <strong>procedure</strong>; “no customer data may be shared” is a <strong>rule</strong>.</p>

  <h3>Case 4 — Strategy and objective</h3>
  <p>A food company sets a target to raise its market share to 12% within two years. To reach it, management decides to enter smaller cities through local distributors and launch lower-priced pack sizes.</p>
  <p><strong>Answer:</strong> The measurable 12% target is the <strong>objective</strong>. Entering smaller cities through distributors and changing pack sizes forms part of the <strong>strategy</strong> for achieving that objective.</p>

  <h3>Case 5 — Programme and budget</h3>
  <p>For a one-time product launch, a company combines advertising, dealer meetings, staff training and launch events into one coordinated plan. Management also fixes ₹4 lakh as the maximum promotional spending.</p>
  <p><strong>Answer:</strong> The coordinated one-time set of activities is a <strong>programme</strong>. The ₹4 lakh numerical spending plan is a <strong>budget</strong>.</p>

  <h3>Case 6 — Planning does not guarantee success</h3>
  <p>A company prepares a detailed expansion plan based on current demand. Soon after implementation, a major technological change makes the original assumptions less useful and sales remain below expectations.</p>
  <p><strong>Answer:</strong> This shows that planning does not guarantee success. Plans are based on assumptions about the future, and unexpected external changes can affect results.</p>

  <p><em>All cases above are original practice material prepared for learning; they are not presented as official CBSE questions.</em></p>
</section>`;

for (const file of files) {
  try {
    let html = await readFile(file, 'utf8');
    html = setMeta(html, 'name', 'description', description);
    html = setMeta(html, 'property', 'og:description', description);
    html = setMeta(html, 'name', 'twitter:description', description);
    html = html.replaceAll(
      'Practice CBSE Class 12 Planning with original chapter-wise case-study practice with answers and concept-identification guidance. Original study material by Smit Sir Commerce; not an official CBSE paper.',
      description,
    );

    if (!html.includes('data-planning-case-upgrade="true"')) {
      const oldSolved = /(<section data-search-console-upgrade="case-study"[\s\S]*?<\/section>)/i;
      if (oldSolved.test(html)) html = html.replace(oldSolved, `$1${block}`);
      else html = html.replace(/(<h2>Continue learning<\/h2>)/i, `${block}$1`);
    }

    await writeFile(file, html, 'utf8');
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

console.log('Upgraded Planning case-study page with clue map and six solved applications.');
