import { seoMaterials, seoHubs, getChapterMcqs, getImportantQuestions } from './seoMaterials';

const SITE_URL = 'https://www.smitsircommerce.in';

export const growthTypeMeta = {
  mcqs: { label: 'MCQs with Answers', suffix: 'mcqs', intent: 'chapter-wise MCQ practice with answers and explanations' },
  'important-questions': { label: 'Important Questions', suffix: 'important-questions', intent: 'important board-style questions with answer guidance' },
  revision: { label: 'One-shot Revision', suffix: 'revision', intent: 'quick revision notes, checklist and recall prompts' },
  'assertion-reason': { label: 'Assertion–Reason', suffix: 'assertion-reason', intent: 'original assertion–reason practice with answers' },
  'case-study': { label: 'Case Study Questions', suffix: 'case-study-questions', intent: 'original case-study practice with answer guidance' },
  numericals: { label: 'Numericals', suffix: 'numericals', intent: 'worked numerical practice with step-by-step solutions' },
};

const materialSlug = (material) => material.seo_path.split('/').pop().replace(/-notes$/, '');
const subjectSlug = (material) => seoHubs.find((hub) => hub.id === material.hubId)?.subjectSlug || 'commerce';

const assertionReasonSets = {
  'class-12-business-studies-chapter-02': [
    ['Management principles are flexible guidelines rather than rigid rules.', 'Business situations differ, so managers adapt principles to circumstances.', 'A'],
    ['Unity of command and unity of direction mean exactly the same thing.', 'Unity of command concerns one boss for one employee, while unity of direction concerns one head and one plan for similar activities.', 'D'],
    ['Taylor emphasised scientific study of work.', 'Scientific management seeks a best-known method through systematic analysis rather than rule of thumb.', 'A'],
    ['Esprit de corps discourages teamwork.', 'Fayol used esprit de corps to emphasise team spirit and unity.', 'D'],
  ],
  'class-12-business-studies-chapter-03': [
    ['Business environment is dynamic.', 'Technology, policy, social preferences and economic conditions can change over time.', 'A'],
    ['A change in tax law is mainly a technological environment change.', 'Tax law is part of the legal and policy environment.', 'D'],
    ['Understanding the environment can help a firm identify opportunities and threats.', 'External changes may create favourable or unfavourable conditions for a business.', 'A'],
  ],
  'class-12-business-studies-chapter-04': [
    ['Planning is a primary function of management.', 'Other managerial functions are guided by previously decided objectives and plans.', 'A'],
    ['A rule allows broad managerial discretion.', 'A rule normally states what must or must not be done in a specific situation.', 'D'],
    ['Planning can reduce uncertainty but cannot eliminate it completely.', 'Future conditions can change after a plan is prepared.', 'A'],
  ],
  'class-12-business-studies-chapter-05': [
    ['Delegation does not mean a superior gives away ultimate accountability.', 'A superior remains answerable for the work assigned to subordinates.', 'A'],
    ['Functional structure groups activities by major functions.', 'Similar specialised work such as marketing or finance is placed together.', 'A'],
    ['Delegation and decentralisation are identical concepts.', 'Decentralisation is a wider systematic dispersal of decision-making authority.', 'D'],
  ],
  'class-12-business-studies-chapter-06': [
    ['Recruitment is broader than selection.', 'Recruitment creates a pool of applicants while selection chooses suitable candidates from that pool.', 'A'],
    ['Training can benefit both employees and the organisation.', 'Improved skills may raise efficiency and help employees perform jobs more confidently.', 'A'],
    ['Promotion is always an external source of recruitment.', 'Promotion fills a vacancy from within the organisation.', 'D'],
  ],
  'class-12-business-studies-chapter-07': [
    ['Communication is complete only when the receiver understands the message.', 'Merely sending information does not guarantee common understanding.', 'A'],
    ['Job enrichment is a financial incentive.', 'Job enrichment improves challenge and responsibility rather than directly paying more money.', 'D'],
    ['Directing includes supervision, motivation, leadership and communication.', 'These elements guide and activate employees toward organisational goals.', 'A'],
  ],
  'class-12-business-studies-chapter-08': [
    ['Planning and controlling are closely related.', 'Control compares actual performance with standards that are normally set during planning.', 'A'],
    ['Management by exception means managers should investigate every tiny deviation equally.', 'The idea is to focus managerial attention on significant deviations.', 'D'],
    ['Corrective action is part of the controlling process.', 'Control is incomplete if important deviations are found but never corrected.', 'A'],
  ],
  'class-12-business-studies-chapter-11': [
    ['Packaging is a product decision in the marketing mix.', 'Packaging affects presentation, protection and product identification.', 'A'],
    ['Personal selling is an impersonal mass communication tool.', 'Personal selling involves direct interaction between a salesperson and prospective buyer.', 'D'],
    ['Marketing is broader than selling.', 'Marketing begins with customer needs and includes product, price, distribution and promotion decisions.', 'A'],
  ],
  'class-12-business-studies-chapter-12': [
    ['Consumers should preserve proof of purchase when possible.', 'A bill or receipt can support a complaint or redressal claim.', 'A'],
    ['The right to be informed means a consumer should receive relevant product information.', 'Informed choice depends on facts such as price, quantity, quality and important conditions.', 'A'],
    ['Consumer protection is only the responsibility of consumers themselves.', 'Business, government and consumer organisations also have roles in consumer protection.', 'D'],
  ],
  'class-11-microeconomics-chapter-02': [
    ['Scarcity creates the problem of choice.', 'Resources have alternative uses while wants exceed available resources.', 'A'],
    ['A point inside a production possibility curve normally represents full and efficient use of resources.', 'A point inside the PPC represents underutilisation or inefficiency.', 'D'],
    ['Opportunity cost is the value of the next best alternative forgone.', 'Choosing one use of scarce resources means sacrificing another feasible use.', 'A'],
  ],
  'class-11-microeconomics-chapter-05': [
    ['A fall in a good’s own price normally causes an extension of demand, other things unchanged.', 'The consumer moves along the same demand curve when only own price changes.', 'A'],
    ['An increase in income always increases demand for every good.', 'Demand for an inferior good may fall when income rises.', 'D'],
    ['Substitute goods can have a positive cross relationship in demand.', 'A rise in the price of one substitute can increase demand for the other.', 'A'],
  ],
  'class-11-microeconomics-chapter-06': [
    ['When demand is elastic, quantity demanded changes proportionately more than price.', 'The absolute value of price elasticity exceeds one.', 'A'],
    ['Perfectly inelastic demand has a horizontal demand curve.', 'Perfectly inelastic demand has a vertical demand curve.', 'D'],
    ['Availability of close substitutes generally makes demand more elastic.', 'Consumers can switch more easily when price changes.', 'A'],
  ],
  'class-11-microeconomics-chapter-07': [
    ['Marginal product is the addition to total product from one more unit of a variable factor.', 'It measures the change in output associated with an incremental variable input.', 'A'],
    ['When marginal product is above average product, average product tends to rise.', 'A marginal value above the current average pulls the average upward.', 'A'],
    ['Short run means every factor of production is variable.', 'In the short run at least one factor remains fixed.', 'D'],
  ],
  'class-11-microeconomics-chapter-08': [
    ['Average fixed cost falls as output increases.', 'The same fixed cost is spread over a larger number of units.', 'A'],
    ['Marginal cost is calculated from the change in total fixed cost.', 'Marginal cost arises from the change in total variable and total cost when output changes.', 'D'],
    ['When marginal cost is below average cost, average cost tends to fall.', 'A marginal value below the current average pulls the average downward.', 'A'],
  ],
  'class-11-microeconomics-chapter-09': [
    ['Average revenue equals price when all units are sold at the same price.', 'Average revenue is total revenue divided by quantity sold.', 'A'],
    ['Under perfect competition, average revenue and marginal revenue can coincide.', 'A competitive firm can sell additional units at the given market price.', 'A'],
    ['Marginal revenue is always greater than average revenue under a downward-sloping demand curve.', 'Marginal revenue normally lies below average revenue when price must fall to sell more output.', 'D'],
  ],
  'class-11-microeconomics-chapter-13': [
    ['A price above equilibrium normally creates excess supply.', 'At that price quantity supplied tends to exceed quantity demanded.', 'A'],
    ['A binding price ceiling set below equilibrium can create a surplus.', 'A low legal maximum price tends to create excess demand, not excess supply.', 'D'],
    ['An increase in demand with supply unchanged generally raises equilibrium price.', 'The demand curve shifts rightward while the supply curve remains fixed.', 'A'],
  ],
};

const numericalSets = {
  'class-11-microeconomics-chapter-02': [
    { question: 'An economy can produce 0, 10, 18, 24 and 28 units of Good Y when it produces 5, 4, 3, 2 and 1 units of Good X respectively. Find the marginal opportunity cost of the 4th unit of X when moving from 2 units of X to 3 units of X.', steps: ['At 2 units of X, Y = 24.', 'At 3 units of X, Y = 18.', 'Extra X = 1 and sacrificed Y = 6.', 'MOC = 6 units of Y for one extra unit of X.'], answer: '6 units of Good Y' },
    { question: 'A producer can make either 40 notebooks or 20 files with the same resources. What is the opportunity cost of one file in terms of notebooks?', steps: ['20 files are equivalent to 40 notebooks.', 'Opportunity cost per file = 40 ÷ 20.'], answer: '2 notebooks' },
  ],
  'class-11-microeconomics-chapter-03': [
    { question: 'A consumer gets marginal utility of 60 utils from a product priced at ₹20. If marginal utility of money is 2 utils per rupee, should the consumer buy more?', steps: ['Consumer equilibrium for one commodity requires MUx / Px = MUm.', 'MUx / Px = 60 / 20 = 3 utils per rupee.', '3 is greater than MUm = 2, so the product gives more utility per rupee than the equilibrium requirement.'], answer: 'Yes. The consumer should buy more until MUx/Px falls to 2.' },
    { question: 'For two goods, MUx = 30, Px = ₹10, MUy = 24 and Py = ₹8. Is the consumer in equilibrium?', steps: ['MUx/Px = 30/10 = 3.', 'MUy/Py = 24/8 = 3.', 'The marginal utility per rupee is equal for both goods.'], answer: 'Yes, if the other equilibrium conditions are satisfied.' },
  ],
  'class-11-microeconomics-chapter-06': [
    { question: 'Price falls from ₹20 to ₹16 and quantity demanded rises from 100 units to 140 units. Using the percentage method with original values, calculate price elasticity of demand.', steps: ['Percentage change in quantity = 40/100 × 100 = 40%.', 'Percentage change in price = -4/20 × 100 = -20%.', 'Ed = 40% / -20% = -2.', 'Report the degree using the absolute value unless the sign is specifically required.'], answer: 'Ed = 2; demand is elastic.' },
    { question: 'Price rises by 10% and quantity demanded falls by 5%. Calculate price elasticity of demand.', steps: ['Ed = percentage change in quantity demanded ÷ percentage change in price.', 'Ed = -5% ÷ 10% = -0.5.'], answer: 'Absolute Ed = 0.5; demand is inelastic.' },
  ],
  'class-11-microeconomics-chapter-07': [
    { question: 'Total product rises from 48 units to 60 units when the 5th worker is employed. Find marginal product of the 5th worker.', steps: ['MP = change in total product ÷ change in variable input.', 'Change in TP = 60 − 48 = 12.', 'Change in labour = 1 worker.'], answer: 'MP = 12 units' },
    { question: 'With 4 workers, total product is 80 units. Find average product.', steps: ['AP = TP ÷ units of variable input.', 'AP = 80 ÷ 4.'], answer: 'AP = 20 units per worker' },
  ],
  'class-11-microeconomics-chapter-08': [
    { question: 'At an output of 10 units, total fixed cost is ₹200 and total variable cost is ₹300. Find TC, AFC, AVC and AC.', steps: ['TC = TFC + TVC = 200 + 300 = ₹500.', 'AFC = 200/10 = ₹20.', 'AVC = 300/10 = ₹30.', 'AC = 500/10 = ₹50.'], answer: 'TC ₹500; AFC ₹20; AVC ₹30; AC ₹50.' },
    { question: 'Total cost rises from ₹900 to ₹980 when output rises from 20 units to 21 units. Find marginal cost.', steps: ['MC = change in TC ÷ change in output.', 'Change in TC = ₹80 and change in output = 1.'], answer: 'MC = ₹80' },
  ],
  'class-11-microeconomics-chapter-09': [
    { question: 'A firm sells 50 units at ₹12 each. Find total revenue and average revenue.', steps: ['TR = Price × Quantity = 12 × 50 = ₹600.', 'AR = TR ÷ Quantity = 600 ÷ 50 = ₹12.'], answer: 'TR ₹600; AR ₹12.' },
    { question: 'Total revenue rises from ₹720 to ₹750 when sales rise from 60 to 61 units. Find marginal revenue.', steps: ['MR = change in TR ÷ change in quantity.', 'Change in TR = ₹30 for one extra unit.'], answer: 'MR = ₹30' },
  ],
  'class-11-microeconomics-chapter-10': [
    { question: 'At 5 units of output MR is ₹40 and MC is ₹32. At 6 units MR is ₹36 and MC is ₹36. At 7 units MR is ₹34 and MC is ₹42. Which output is the best candidate for producer equilibrium?', steps: ['Producer equilibrium under MR–MC requires MR = MC.', 'MC should be rising through MR at the equilibrium output.', 'At 6 units MR = MC = ₹36, while at 7 units MC exceeds MR.'], answer: '6 units of output' },
  ],
  'class-11-microeconomics-chapter-11': [
    { question: 'Price rises by 20% and quantity supplied rises by 30%. Calculate price elasticity of supply.', steps: ['Es = percentage change in quantity supplied ÷ percentage change in price.', 'Es = 30% ÷ 20% = 1.5.'], answer: 'Es = 1.5; supply is elastic.' },
  ],
  'class-11-microeconomics-chapter-13': [
    { question: 'At ₹10, quantity demanded is 100 units and quantity supplied is 60 units. At ₹12, demand is 80 and supply is 80. At ₹14, demand is 60 and supply is 100. Find equilibrium price and quantity.', steps: ['Equilibrium occurs where Qd = Qs.', 'At ₹12 both demand and supply equal 80 units.'], answer: 'Equilibrium price ₹12; equilibrium quantity 80 units.' },
  ],
};

function distractorTopics(material) {
  const others = seoMaterials.filter((item) => item.id !== material.id && item.subject === material.subject);
  return others.flatMap((item) => item.keyTopics).filter(Boolean);
}

function buildExtraMcqs(material) {
  const distractors = distractorTopics(material);
  return material.keyTopics.slice(0, 6).map((topic, index) => {
    const wrong = [0, 1, 2].map((offset) => distractors[(index * 3 + offset) % Math.max(distractors.length, 1)] || 'A topic from another chapter');
    const answer = index % 4;
    const options = [...wrong];
    options.splice(answer, 0, topic);
    return {
      question: `Which of the following is most directly studied in ${material.chapter}?`,
      options,
      answer,
      explanation: `${topic} is one of the core topics listed for ${material.chapter}.`,
    };
  });
}

function makeCaseStudy(material) {
  const [first, second, third] = material.keyTopics;
  return {
    scenario: `A growing business is reviewing its decisions after a period of rapid change. The manager asks the team to examine ${first}, connect it with ${second || first}, and decide how ${third || second || first} should influence the next action. The situation requires the team to apply the chapter rather than simply repeat definitions.`,
    questions: [
      { question: `Identify the chapter concept most closely connected with “${first}”.`, answer: `The relevant concept is ${first}. A complete answer should state its meaning and connect it to the facts of the case.` },
      { question: `Explain how “${second || first}” could affect the manager’s decision.`, answer: `Use the chapter explanation of ${second || first} and apply it directly to the business facts instead of writing a generic definition.` },
      { question: 'What should the manager check before taking the next step?', answer: material.examFocus[0] || `The manager should apply the relevant principle from ${material.chapter} to the facts given.` },
    ],
  };
}

function makeRevision(material) {
  return {
    quickRecall: material.keyTopics.map((topic) => `Can you explain ${topic} in 2–3 lines without opening the notes?`),
    traps: material.examFocus,
    finalCheck: [
      `I can explain the chapter idea: ${material.chapter}.`,
      `I can distinguish closely related terms from this chapter.`,
      'I can apply the concept to a short case or numerical where relevant.',
      'I can attempt the chapter MCQs without looking at the answer key.',
    ],
  };
}

function makeImportant(material) {
  const base = getImportantQuestions(material);
  const extra = material.keyTopics.slice(0, 5).map((topic, index) => ({
    question: `${index % 2 === 0 ? 'Explain' : 'Distinguish or apply'} ${topic} with a suitable example or application.`,
    answer: `Start with the meaning of ${topic}. Then write the main points in a logical order and connect the answer to ${material.chapter}. ${material.examFocus[index % material.examFocus.length] || ''}`.trim(),
  }));
  return [...base, ...extra];
}

function buildGrowthPage(material, type) {
  const meta = growthTypeMeta[type];
  const path = `/practice/cbse/class-${material.class_level}/${subjectSlug(material)}/${materialSlug(material)}-${meta.suffix}`;
  const common = {
    id: `${material.id}-${type}`,
    materialId: material.id,
    type,
    path,
    board: 'CBSE',
    classLevel: material.class_level,
    subject: material.subject,
    chapter: material.chapter,
    chapterNumber: material.chapterNumber,
    hubPath: material.hub_path,
    notesPath: material.seo_path,
    label: meta.label,
    title: `CBSE Class ${material.class_level} ${material.chapter} ${meta.label}`,
    description: `Practice CBSE Class ${material.class_level} ${material.chapter} with ${meta.intent}. Original study material by Smit Sir Commerce; not an official CBSE paper.`,
    updated: '2026-09-01',
  };
  if (type === 'mcqs') common.mcqs = [...getChapterMcqs(material), ...buildExtraMcqs(material)].slice(0, 10);
  if (type === 'important-questions') common.questions = makeImportant(material);
  if (type === 'revision') common.revision = makeRevision(material);
  if (type === 'assertion-reason') common.assertionReason = (assertionReasonSets[material.id] || []).map(([assertion, reason, answer]) => ({ assertion, reason, answer }));
  if (type === 'case-study') common.caseStudy = makeCaseStudy(material);
  if (type === 'numericals') common.numericals = numericalSets[material.id] || [];
  return common;
}

export const growthPages = seoMaterials.flatMap((material) => {
  const types = ['mcqs', 'important-questions', 'revision'];
  if (assertionReasonSets[material.id]?.length) types.push('assertion-reason');
  if (material.subject === 'Business Studies') types.push('case-study');
  if (numericalSets[material.id]?.length) types.push('numericals');
  return types.map((type) => buildGrowthPage(material, type));
});

export const growthPageByPath = Object.fromEntries(growthPages.map((page) => [page.path, page]));
export const growthPagesByMaterial = Object.groupBy
  ? Object.groupBy(growthPages, (page) => page.materialId)
  : growthPages.reduce((acc, page) => { (acc[page.materialId] ||= []).push(page); return acc; }, {});

export function getGrowthPagesForMaterial(materialId) {
  return growthPagesByMaterial[materialId] || [];
}

export function getGrowthStructuredData(page) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        name: page.title,
        description: page.description,
        url: `${SITE_URL}${page.path}`,
        educationalLevel: `CBSE Class ${page.classLevel}`,
        learningResourceType: page.label,
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        dateModified: page.updated,
        about: [page.chapter, page.subject],
        provider: { '@type': 'EducationalOrganization', name: 'Smit Sir Commerce', url: SITE_URL },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'CBSE Commerce Practice', item: `${SITE_URL}/cbse-practice` },
          { '@type': 'ListItem', position: 3, name: page.chapter, item: `${SITE_URL}${page.notesPath}` },
          { '@type': 'ListItem', position: 4, name: page.label, item: `${SITE_URL}${page.path}` },
        ],
      },
    ],
  };
}

export const growthStats = {
  pages: growthPages.length,
  chapters: new Set(growthPages.map((page) => page.materialId)).size,
  mcqPages: growthPages.filter((page) => page.type === 'mcqs').length,
  caseStudyPages: growthPages.filter((page) => page.type === 'case-study').length,
  numericalPages: growthPages.filter((page) => page.type === 'numericals').length,
  assertionReasonPages: growthPages.filter((page) => page.type === 'assertion-reason').length,
};
