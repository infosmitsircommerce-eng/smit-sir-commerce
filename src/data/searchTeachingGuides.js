// Original practice explanations; shared by the visible page and static HTML.
const guides = {
  '/cbse/class-12/business-studies/controlling-notes': {
    title: 'Controlling explained with a solved numerical case',
    answer: 'Controlling means checking actual results against planned standards, investigating important differences and acting to improve performance. It connects a plan to what actually happens; it is not merely finding fault after work is finished.',
    points: [
      ['The five steps', 'Set measurable standards, measure actual performance, compare the two, analyse significant deviations and take corrective action. A standard should specify both the desired result and the period for achieving it.'],
      ['Planning and controlling', 'Planning supplies the targets that controlling needs. Controlling supplies feedback for the next plan. Without standards a manager cannot judge performance; without feedback a plan may remain an intention.'],
      ['Critical points versus exceptions', 'Critical-point control focuses on activities essential to success, such as product quality. Management by exception directs attention to deviations outside an acceptable limit. One asks where to focus; the other asks which differences need attention.'],
      ['A difference is not automatically a failure', 'A deviation may be favourable, unfavourable or caused by an unrealistic standard. Investigate the cause before deciding whether to improve training, repair equipment, change a process or revise the standard.'],
    ],
    cases: [
      ['Packaging output', 'A unit plans to pack 1,000 boxes a day. Actual output is 920. The manager investigates differences above 5% and finds repeated machine stoppages. Calculate the shortfall and identify the next action.', 'Shortfall = 1,000 − 920 = 80 boxes. Percentage shortfall = 80 ÷ 1,000 × 100 = 8%. This exceeds the 5% limit, so the deviation needs investigation. Repair and preventive maintenance address the identified cause; merely asking workers to work faster does not.'],
      ['Quality before volume', 'A factory checks seal strength carefully because a faulty seal can spoil a shipment, but investigates printing delays only when they exceed its agreed tolerance. Identify both control ideas.', 'Seal strength is a critical point because it is essential to usable output. Investigating only delays beyond a tolerance illustrates management by exception. Explain the different evidence for each rather than treating them as identical terms.'],
    ],
    source: 'https://ncert.nic.in/textbook/pdf/lebs108.pdf',
  },
  '/cbse/class-12/business-studies/business-environment-notes': {
    title: 'Business Environment: recognise the dimension in a case',
    answer: 'Business environment consists of outside forces that influence a business. Managers usually cannot control these forces, but can observe changes and adapt. A useful answer identifies the force, connects it to the case and explains its effect on the business.',
    points: [
      ['Economic', 'Interest rates, inflation and household income affect borrowing costs and purchasing power. A rise in lending rates can make expansion more expensive.'],
      ['Social and technological', 'Changes in customs, attitudes and preferences are social forces. New production methods, software and inventions are technological forces. A preference for convenient shopping is social; the software enabling online orders is technological.'],
      ['Political and legal', 'Political stability and the government’s broader policy outlook belong to the political environment. A binding law or regulation creates a legal requirement. Identify the precise clue instead of labelling every government-related event political.'],
      ['Importance and features', 'Monitoring outside changes can reveal an opportunity or an early warning. Dynamic means the environment changes; uncertainty means future changes are difficult to predict. These are related but different ideas.'],
    ],
    cases: [
      ['A stationery shop adapts', 'Customers increasingly prefer placing orders from home. A shop introduces an ordering website using newly affordable software. Identify two dimensions and explain each clue.', 'The preference for ordering from home is a social change in customer behaviour. The affordable ordering software is a technological development. The website is the shop’s response, not itself a complete definition of the environment.'],
      ['A new packaging rule', 'A hypothetical regulation requires a manufacturer to print a safety warning on every pack. Its manager redesigns the label. Which dimension is shown, and why?', 'The legal environment is shown because a regulation imposes a binding requirement. Redesigning the label demonstrates adaptation. This is an invented learning example, not a claim about a currently applicable law.'],
    ],
    source: 'https://ncert.nic.in/textbook/pdf/lebs103.pdf',
  },
  '/cbse/class-12/business-studies-case-study-questions': {
    title: 'Solved case-study answers: distinguish similar concepts',
    answer: 'For a Business Studies case-study question, first identify what the question asks. Name the relevant concept, use the specific fact that supports it and explain that connection. A long definition without case evidence may not answer an application question.',
    points: [
      ['Answer structure', 'Use three parts: concept → evidence → explanation. If the question asks for two principles, make two clearly separated answers. Do not invent facts that the case does not provide.'],
      ['Read the command word', 'Identify calls for naming; explain calls for a reasoned account; distinguish calls for a clear basis of difference. Use the question’s scope, not a fixed memorised answer length.'],
      ['Avoid keyword-only answers', 'One word can suggest several chapters. A target can appear in planning or controlling. Look at whether the manager is setting the target, comparing actual results or correcting a deviation.'],
    ],
    cases: [
      ['Unity of command or unity of direction?', 'A sales executive receives conflicting instructions from two supervisors. In a separate decision, all regional sales teams follow one common campaign plan. Identify the principle relevant to each situation.', 'The conflicting instructions concern unity of command: the executive should receive instructions from one superior. The common campaign concerns unity of direction: activities with the same objective should follow one head and one plan. Number of reporting bosses and coordination of a shared objective are different clues.'],
      ['Delegation or decentralisation?', 'A manager assigns one employee a stock-check task, gives authority to obtain inventory records and requires a report. Later, the company gives branch managers routine purchasing decisions across all branches. Distinguish the arrangements.', 'The stock-check arrangement is delegation: a superior assigns responsibility and grants authority for a task while retaining ultimate accountability. The company-wide distribution of purchasing decisions illustrates decentralisation, a systematic spread of decision-making authority to lower levels. A single assigned task does not establish organisation-wide decentralisation.'],
      ['Planning or controlling?', 'Before the month starts, a manager sets a target of 300 orders. At month-end she compares actual orders with that target and investigates the gap. Identify the function at each stage.', 'Setting the future target is planning. Comparing actual orders with the target and investigating the difference is controlling. The same target connects the two functions; the manager’s action at each stage determines the answer.'],
    ],
    source: 'https://ncert.nic.in/textbook.php',
  },
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');

export function renderSearchTeachingGuide(path) {
  const guide = guides[path.replace(/\/$/, '')];
  if (!guide) return '';
  return `<section class="surface-paper p-5 sm:p-8 space-y-5" data-teaching-guide="original-practice"><h2>${esc(guide.title)}</h2><p>${esc(guide.answer)}</p><dl>${guide.points.map(([term, meaning]) => `<dt class="font-semibold mt-4">${esc(term)}</dt><dd class="mt-2">${esc(meaning)}</dd>`).join('')}</dl><h3 class="font-semibold">Original solved practice — not official board questions</h3>${guide.cases.map(([title, question, answer]) => `<article class="tile-paper p-4 space-y-3"><h4 class="font-semibold">${esc(title)}</h4><p><strong>Question:</strong> ${esc(question)}</p><p><strong>Answer and reasoning:</strong> ${esc(answer)}</p></article>`).join('')}<p class="text-sm">Teaching examples added 12 September 2026. These original explanations supplement, not replace, prescribed material. Reference: <a class="underline" href="${esc(guide.source)}">NCERT Business Studies</a>. Check your current board syllabus and school instructions for exam scope.</p></section>`;
}
