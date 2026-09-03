export const leakTypes = [
  { id: 'concept', label: 'Concept gap', short: 'Concept', description: 'I did not fully understand the concept or relationship.' },
  { id: 'formula', label: 'Formula / calculation mistake', short: 'Formula', description: 'I knew the chapter but used the wrong formula, sign, step or calculation.' },
  { id: 'interpretation', label: 'Question interpretation', short: 'Interpretation', description: 'I misunderstood what the question was asking.' },
  { id: 'structure', label: 'Answer structure / keywords', short: 'Structure', description: 'My answer missed keywords, headings, explanation or proper working.' },
  { id: 'time', label: 'Time / incomplete answer', short: 'Time', description: 'I knew the answer but could not complete it properly in time.' },
  { id: 'careless', label: 'Careless / revision mistake', short: 'Careless', description: 'I lost marks through avoidable slips, weak revision or not checking.' },
];

export const recoverySubjects = {
  'class-12-economics': {
    label: 'Class 12 Economics',
    classLevel: 'Class 12',
    subject: 'Economics',
    topics: [
      { id: 'national-income', label: 'National Income & GDP', resource: '/tools/topics/national-income-gdp', action: 'Use the GDP/National Income toolkit and solve 5 mixed conversion questions.' },
      { id: 'income-determination', label: 'Income Determination, MPC & Multiplier', resource: '/tools/topics/income-determination', action: 'Revise MPC/MPS, consumption-saving and multiplier, then solve a short mixed drill.' },
      { id: 'money-banking', label: 'Money & Banking', resource: '/cbse/class-12/macroeconomics-notes', action: 'Revise definitions, money creation logic and banking relationships, then attempt a timed short-answer set.' },
      { id: 'government-budget', label: 'Government Budget', resource: '/cbse/class-12/economics-revision-guide', action: 'Revise budget receipts, expenditure and deficits, then practise classification questions.' },
      { id: 'balance-payments', label: 'Balance of Payments', resource: '/cbse/class-12/economics-revision-guide', action: 'Revise current/capital account classification and autonomous/accommodating transactions.' },
      { id: 'macro-basics', label: 'Macroeconomics basics', resource: '/cbse/class-12/macroeconomics/introduction-to-macroeconomics-notes', action: 'Rebuild aggregate-variable basics before returning to numericals.' },
    ],
  },
  'class-11-economics': {
    label: 'Class 11 Economics',
    classLevel: 'Class 11',
    subject: 'Economics',
    topics: [
      { id: 'demand', label: 'Demand', resource: '/cbse/class-11/microeconomics/theory-of-demand-notes', action: 'Revise movement versus shift and determinants, then practise diagram-based questions.' },
      { id: 'elasticity', label: 'Price Elasticity of Demand', resource: '/tools/price-elasticity-demand-calculator', action: 'Solve elasticity numericals yourself, then verify the working with the calculator.' },
      { id: 'production', label: 'Production Function', resource: '/cbse/class-11/microeconomics/production-function-and-returns-to-a-factor-notes', action: 'Revise TP/AP/MP relationships and derive values from a production schedule.' },
      { id: 'cost', label: 'Cost', resource: '/tools/cost-curves-calculator', action: 'Practise TFC/TVC/TC/AFC/AVC/AC/MC schedules and verify with the cost calculator.' },
      { id: 'revenue', label: 'Revenue', resource: '/tools/tr-ar-mr-calculator', action: 'Practise TR/AR/MR schedules and check the relationship under different market conditions.' },
      { id: 'market', label: 'Market & Equilibrium', resource: '/cbse/class-11/microeconomics/market-equilibrium-notes', action: 'Revise demand-supply shifts and redraw equilibrium diagrams from memory.' },
    ],
  },
  'class-12-business-studies': {
    label: 'Class 12 Business Studies',
    classLevel: 'Class 12',
    subject: 'Business Studies',
    topics: [
      { id: 'management', label: 'Nature & Principles of Management', resource: '/cbse/class-12/business-studies/nature-and-significance-of-management-notes', action: 'Revise definitions and principle-identification cues, then answer 5 case-based questions.' },
      { id: 'planning-organising', label: 'Planning & Organising', resource: '/cbse/class-12/business-studies/planning-notes', action: 'Write planning/organising steps from memory and practise case-study identification.' },
      { id: 'staffing-directing', label: 'Staffing & Directing', resource: '/cbse/class-12/business-studies/staffing-notes', action: 'Revise process sequences, motivation, leadership and communication with keyword recall.' },
      { id: 'controlling', label: 'Controlling', resource: '/cbse/class-12/business-studies/controlling-notes', action: 'Practise the controlling process and planning-controlling relationship in structured answers.' },
      { id: 'finance', label: 'Financial Management & Markets', resource: '/cbse/class-12/business-studies/financial-management-notes', action: 'Revise decision types, capital factors and financial-market distinctions using case cues.' },
      { id: 'marketing-consumer', label: 'Marketing & Consumer Protection', resource: '/cbse/class-12/business-studies/marketing-management-notes', action: 'Practise marketing-mix identification and consumer-right/remedy case studies.' },
    ],
  },
  'class-12-accountancy': {
    label: 'Class 12 Accountancy',
    classLevel: 'Class 12',
    subject: 'Accountancy',
    topics: [
      { id: 'ratios', label: 'Accounting Ratios', resource: '/tools/topics/accounting-ratios', action: 'Use the ratio toolkit to practise formula selection, averages and interpretation.' },
      { id: 'cash-flow', label: 'Cash Flow Statement', resource: '/test-series', action: 'Practise activity classification first, then prepare a complete cash-flow question under time.' },
      { id: 'partnership', label: 'Partnership Accounts', resource: '/test-series', action: 'Identify the adjustment type before calculating; keep working notes separate and labelled.' },
      { id: 'shares', label: 'Share Capital', resource: '/test-series', action: 'Practise journal-entry sequence and treatment of calls, forfeiture and reissue.' },
      { id: 'debentures', label: 'Debentures', resource: '/test-series', action: 'Revise issue/redemption treatment and solve one complete journal-entry set.' },
      { id: 'statements', label: 'Financial Statement Analysis', resource: '/tools/common-size-statement-calculator', action: 'Practise comparative/common-size percentages and verify calculations with the tool.' },
    ],
  },
};

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function buildRecoveryReport({ subjectKey, score, maxScore, leakMarks = {}, weakTopicIds = [] }) {
  const subject = recoverySubjects[subjectKey];
  const safeMax = Math.max(1, Number(maxScore) || 1);
  const safeScore = clamp(Number(score) || 0, 0, safeMax);
  const currentPct = (safeScore / safeMax) * 100;
  const availableLoss = Math.max(0, safeMax - safeScore);
  const leakRows = leakTypes.map((item) => ({ ...item, marks: Math.max(0, Number(leakMarks[item.id]) || 0) }));
  const statedLoss = leakRows.reduce((sum, item) => sum + item.marks, 0);
  const recoverable = Math.min(availableLoss, statedLoss);
  const leakageRate = (recoverable / safeMax) * 100;
  const weakTopics = (subject?.topics || []).filter((topic) => weakTopicIds.includes(topic.id));
  const topicPenalty = Math.min(25, weakTopics.length * 4);
  const readiness = Math.round(clamp(currentPct * 0.72 + (100 - leakageRate) * 0.18 + (100 - topicPenalty) * 0.10, 0, 100));
  const sortedLeaks = [...leakRows].sort((a, b) => b.marks - a.marks);
  const activeLeaks = sortedLeaks.filter((item) => item.marks > 0);
  const topLeak = activeLeaks[0] || leakTypes[0];
  const topTopics = weakTopics.slice(0, 3);

  const band = readiness >= 85 ? 'Strong' : readiness >= 70 ? 'Improving' : readiness >= 55 ? 'Rebuild' : 'Priority recovery';
  const plan = [
    {
      day: 'Day 1',
      title: topTopics[0] ? `Fix ${topTopics[0].label}` : `Fix the biggest ${topLeak.short.toLowerCase()} leak`,
      task: topTopics[0]?.action || `Review the questions where ${topLeak.label.toLowerCase()} caused marks loss. Write the correct approach beside each mistake.`,
      resource: topTopics[0]?.resource || '/cbse-notes',
    },
    {
      day: 'Day 2',
      title: `${topLeak.label} drill`,
      task: topLeak.id === 'structure'
        ? 'Rewrite 3 answers using headings, keywords and complete working. Compare the new version with your original response.'
        : topLeak.id === 'formula'
          ? 'Solve 5 numericals without looking at the formula first. Check only after completing each question.'
          : topLeak.id === 'time'
            ? 'Attempt a short timed set and stop exactly when time ends. Review what remained incomplete.'
            : 'Attempt 5 questions focused on this mistake type and write one sentence explaining why each earlier error happened.',
      resource: subject?.subject === 'Economics' ? '/tools' : '/cbse-practice',
    },
    {
      day: 'Day 3',
      title: topTopics[1] ? `Repair ${topTopics[1].label}` : 'Mixed retrieval practice',
      task: topTopics[1]?.action || 'Attempt mixed questions without notes, then revise only the concepts you could not retrieve.',
      resource: topTopics[1]?.resource || '/daily-practice',
    },
    {
      day: 'Day 4',
      title: 'Exam-condition practice',
      task: 'Attempt a timed practice set. Mark every error using the same leak categories: concept, formula, interpretation, structure, time or careless.',
      resource: '/test-series',
    },
    {
      day: 'Day 5',
      title: 'Recovery retest',
      task: 'Retest the same weak areas. Record the new score here and compare recovered marks instead of only checking completion.',
      resource: '/marks-recovery',
    },
  ];

  return {
    subject,
    currentScore: safeScore,
    maxScore: safeMax,
    currentPct: Math.round(currentPct),
    recoverable: Math.round(recoverable * 10) / 10,
    readiness,
    band,
    leakRows,
    activeLeaks,
    topLeak,
    weakTopics,
    plan,
  };
}

export function readinessBand(score) {
  if (score >= 85) return '85-100';
  if (score >= 70) return '70-84';
  if (score >= 55) return '55-69';
  return '0-54';
}
