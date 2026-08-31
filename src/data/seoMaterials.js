const SITE_URL = 'https://www.smitsircommerce.in';

export const seoHubs = [
  {
    id: 'class-12-business-studies',
    path: '/cbse/class-12/business-studies-notes',
    classLevel: 12,
    subject: 'Business Studies',
    subjectSlug: 'business-studies',
    label: 'Class 12 Business Studies',
    seoTitle: 'Free CBSE Class 12 Business Studies Notes PDF',
    description: 'View and download free chapter-wise CBSE Class 12 Business Studies notes PDFs covering all 12 NCERT chapters, prepared by Smit Sir.',
    intro: 'Revise the complete CBSE Class 12 Business Studies syllabus with organised, chapter-wise notes. Every chapter page includes a focused overview, important topics, exam priorities and a free PDF that can be viewed online or downloaded.',
  },
  {
    id: 'class-11-microeconomics',
    path: '/cbse/class-11/microeconomics-notes',
    classLevel: 11,
    subject: 'Economics',
    subjectSlug: 'microeconomics',
    label: 'Class 11 Microeconomics',
    seoTitle: 'Free CBSE Class 11 Microeconomics Notes PDF',
    description: 'View and download free chapter-wise CBSE Class 11 Microeconomics notes PDFs with concepts, diagrams, numericals and exam-focused revision.',
    intro: 'Build a clear foundation in CBSE Class 11 Microeconomics with 13 chapter-wise resources. The collection moves from basic economic problems to demand, production, cost, revenue, markets and equilibrium.',
  },
  {
    id: 'class-12-macroeconomics',
    path: '/cbse/class-12/macroeconomics-notes',
    classLevel: 12,
    subject: 'Economics',
    subjectSlug: 'macroeconomics',
    label: 'Class 12 Macroeconomics',
    seoTitle: 'Free CBSE Class 12 Macroeconomics Notes PDF',
    description: 'View and download free CBSE Class 12 Macroeconomics chapter-wise notes PDFs prepared for concept clarity and board exam revision.',
    intro: 'Start CBSE Class 12 Macroeconomics with clear, exam-focused notes. This collection will expand chapter by chapter as new material is published, while every available PDF remains free to view and download.',
  },
];

const hubById = Object.fromEntries(seoHubs.map((hub) => [hub.id, hub]));

function makeMaterial({
  hubId,
  chapterNumber,
  slug,
  chapter,
  pages,
  fileUrl,
  seoTitle,
  summary,
  keyTopics,
  examFocus,
}) {
  const hub = hubById[hubId];
  const seoPath = `/cbse/class-${hub.classLevel}/${hub.subjectSlug}/${slug}-notes`;
  return {
    id: `${hubId}-chapter-${String(chapterNumber).padStart(2, '0')}`,
    title: `Chapter ${chapterNumber} - ${chapter}`,
    chapter,
    chapterNumber,
    subject: hub.subject,
    subjectLabel: hub.label,
    board: 'CBSE',
    class_level: hub.classLevel,
    type: 'PDF Notes',
    pages,
    is_free: true,
    file_url: fileUrl,
    seo_path: seoPath,
    hub_path: hub.path,
    hubId,
    seoTitle: seoTitle || `${chapter} Notes PDF — CBSE Class ${hub.classLevel}`,
    description: `Free CBSE Class ${hub.classLevel} ${hub.subjectSlug === 'business-studies' ? 'Business Studies' : hub.subjectSlug === 'microeconomics' ? 'Microeconomics' : 'Macroeconomics'} Chapter ${chapterNumber} ${chapter} notes PDF with key concepts and exam-focused revision.`,
    summary,
    keyTopics,
    examFocus,
    updated: '2026-08-31',
  };
}

export const seoMaterials = [
  makeMaterial({
    hubId: 'class-12-macroeconomics', chapterNumber: 1,
    slug: 'introduction-to-macroeconomics', chapter: 'Introduction to Macroeconomics', pages: 20,
    seoTitle: 'Introduction to Macroeconomics Notes — Class 12',
    fileUrl: '/materials/class-12/economics/chapter-1-introduction-to-macroeconomics.pdf',
    summary: 'Introduction to Macroeconomics explains how an economy is studied as a whole rather than through individual consumers or firms. These notes introduce aggregate variables and prepare students for national income, money, banking, employment and related macroeconomic analysis.',
    keyTopics: ['Meaning and scope of macroeconomics', 'Difference between microeconomics and macroeconomics', 'Major sectors of an economy', 'Basic macroeconomic variables and aggregates'],
    examFocus: ['Use economy-wide examples when defining macroeconomics.', 'Learn the micro versus macro distinction with suitable examples.', 'Connect households, firms, government and the external sector through a circular-flow view.'],
  }),

  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 1,
    slug: 'nature-and-significance-of-management', chapter: 'Nature and Significance of Management', pages: 46,
    seoTitle: 'Nature of Management Notes — Class 12 BST',
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-01-nature-and-significance-of-management.pdf',
    summary: 'This chapter establishes management as a goal-oriented process that coordinates people and resources. The notes explain effectiveness, efficiency, management objectives, levels and functions, along with the important debate on management as an art, science and profession.',
    keyTopics: ['Meaning, objectives and importance of management', 'Effectiveness and efficiency', 'Levels and functions of management', 'Management as art, science and profession', 'Coordination as the essence of management'],
    examFocus: ['Differentiate effectiveness from efficiency with an example.', 'Prepare the art-science-profession comparison in a structured format.', 'Explain why coordination is continuous and all-pervasive.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 2,
    slug: 'principles-of-management', chapter: 'Principles of Management', pages: 50,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-02-principles-of-management.pdf',
    summary: 'Principles of Management introduces broad managerial guidelines and their practical importance. It covers Fayol’s administrative principles and Taylor’s scientific management, helping students recognise each principle in application-based and case-study questions.',
    keyTopics: ['Nature and significance of management principles', 'Fayol’s 14 principles of management', 'Taylor’s scientific management principles', 'Techniques of scientific management', 'Fayol and Taylor comparison'],
    examFocus: ['Identify the principle hidden in a business situation.', 'Do not confuse unity of command with unity of direction.', 'Revise functional foremanship and differential piece wage system carefully.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 3,
    slug: 'business-environment', chapter: 'Business Environment', pages: 44,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-03-business-environment.pdf',
    summary: 'Business Environment examines the external forces that influence business decisions. These notes organise the economic, social, technological, political and legal dimensions and connect them with liberalisation, privatisation and globalisation in India.',
    keyTopics: ['Meaning and features of business environment', 'Importance of environmental understanding', 'Economic, social, technological, political and legal dimensions', 'Demonetisation and changing business conditions', 'Liberalisation, privatisation and globalisation'],
    examFocus: ['Classify examples under the correct environmental dimension.', 'Link environmental change with business opportunity or threat.', 'Prepare the impact of government policy changes on business and industry.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 4,
    slug: 'planning', chapter: 'Planning', pages: 44,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-04-planning.pdf',
    summary: 'Planning explains how managers decide objectives and courses of action before work begins. The chapter covers its importance, limitations, process and the different standing and single-use plans that guide organisational decisions.',
    keyTopics: ['Meaning, features and importance of planning', 'Limitations of planning', 'Steps in the planning process', 'Objectives, strategy, policy and procedure', 'Method, rule, programme and budget'],
    examFocus: ['Write planning steps in the correct sequence.', 'Distinguish policy, procedure, method and rule.', 'Support limitations such as rigidity and uncertain environments with examples.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 5,
    slug: 'organising', chapter: 'Organising', pages: 48,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-05-organising.pdf',
    summary: 'Organising converts plans into a workable structure by identifying tasks, grouping activities and establishing authority relationships. These notes cover organisation structures, delegation and decentralisation with clear comparisons.',
    keyTopics: ['Meaning, importance and process of organising', 'Functional and divisional structures', 'Formal and informal organisation', 'Delegation: authority, responsibility and accountability', 'Decentralisation and its importance'],
    examFocus: ['Compare functional and divisional structures using suitable bases.', 'Remember the relationship among authority, responsibility and accountability.', 'Differentiate delegation from decentralisation.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 6,
    slug: 'staffing', chapter: 'Staffing', pages: 51,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-06-staffing.pdf',
    summary: 'Staffing focuses on obtaining, developing and retaining the right people for organisational positions. The notes explain manpower planning, recruitment, selection, training and development from both managerial and employee perspectives.',
    keyTopics: ['Meaning and importance of staffing', 'Staffing process and human resource management', 'Internal and external recruitment sources', 'Selection process', 'Training, development and training methods'],
    examFocus: ['Distinguish recruitment from selection.', 'Learn the selection steps in sequence.', 'Compare on-the-job and off-the-job training methods with examples.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 7,
    slug: 'directing', chapter: 'Directing', pages: 43,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-07-directing.pdf',
    summary: 'Directing activates employees and guides their efforts towards organisational goals. This chapter brings together supervision, motivation, leadership and communication, including Maslow’s hierarchy and barriers to effective communication.',
    keyTopics: ['Meaning, features and importance of directing', 'Supervision and the role of a supervisor', 'Motivation and Maslow’s need hierarchy', 'Leadership styles and qualities', 'Communication process and barriers'],
    examFocus: ['Identify financial and non-financial incentives in case studies.', 'Learn each element of the communication process.', 'Suggest appropriate remedies for semantic, psychological, organisational and personal barriers.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 8,
    slug: 'controlling', chapter: 'Controlling', pages: 46,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-08-controlling.pdf',
    summary: 'Controlling measures actual performance against planned standards and initiates corrective action. The notes explain the control process, its importance, limitations and its close relationship with planning.',
    keyTopics: ['Meaning, nature and importance of controlling', 'Relationship between planning and controlling', 'Steps in the controlling process', 'Critical point control and management by exception', 'Corrective action'],
    examFocus: ['Present the controlling steps in the correct order.', 'Explain planning and controlling as inseparable twins.', 'Apply management by exception to performance deviations.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 9,
    slug: 'financial-management', chapter: 'Financial Management', pages: 48,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-09-financial-management.pdf',
    summary: 'Financial Management deals with obtaining and using funds to maximise shareholder wealth. These notes explain investment, financing and dividend decisions along with capital structure, fixed capital and working capital requirements.',
    keyTopics: ['Objectives and role of financial management', 'Investment, financing and dividend decisions', 'Financial planning', 'Capital structure and its factors', 'Fixed and working capital requirements'],
    examFocus: ['Classify decisions as investment, financing or dividend decisions.', 'Connect risk, cost and control with capital structure choices.', 'Differentiate factors affecting fixed capital and working capital.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 10,
    slug: 'financial-markets', chapter: 'Financial Markets', pages: 49,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-10-financial-markets.pdf',
    summary: 'Financial Markets explain how savings are channelled to productive investment. The chapter covers money and capital markets, primary and secondary markets, stock exchange functions, trading procedures and SEBI’s regulatory role.',
    keyTopics: ['Functions and types of financial markets', 'Money market instruments', 'Primary and secondary capital markets', 'Stock exchange and trading procedure', 'Objectives and functions of SEBI'],
    examFocus: ['Differentiate money market and capital market.', 'Match treasury bills, commercial paper and certificates of deposit with their features.', 'Learn the demat-based stock exchange trading steps.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 11,
    slug: 'marketing-management', chapter: 'Marketing Management', pages: 51,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-11-marketing-management.pdf',
    summary: 'Marketing Management connects customer needs with product, price, place and promotion decisions. These notes cover marketing philosophies, branding, packaging, labelling, physical distribution, promotion tools and factors affecting price.',
    keyTopics: ['Meaning, functions and philosophies of marketing', 'Marketing mix: product, price, place and promotion', 'Branding, packaging and labelling', 'Advertising, personal selling, sales promotion and public relations', 'Channels of distribution and physical distribution'],
    examFocus: ['Identify the marketing philosophy used in a situation.', 'Differentiate selling from marketing.', 'Recognise branding, packaging, labelling and promotion decisions in case studies.'],
  }),
  makeMaterial({
    hubId: 'class-12-business-studies', chapterNumber: 12,
    slug: 'consumer-protection', chapter: 'Consumer Protection', pages: 50,
    fileUrl: '/materials/cbse/class-12/business-studies/chapter-12-consumer-protection.pdf',
    summary: 'Consumer Protection explains why buyers require legal and organisational safeguards in the marketplace. The notes cover consumer rights, responsibilities, reliefs, redressal mechanisms and the role of consumer organisations.',
    keyTopics: ['Importance of consumer protection', 'Consumer rights and responsibilities', 'Who can file a consumer complaint', 'Redressal agencies and remedies', 'Role of consumer organisations and NGOs'],
    examFocus: ['Identify the violated consumer right from the facts of a case.', 'Know the appropriate relief that may be granted.', 'Revise responsibilities alongside rights for balanced answers.'],
  }),

  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 1,
    slug: 'economics-and-economy', chapter: 'Economics and Economy', pages: 15,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-01-economics-and-economy.pdf',
    summary: 'Economics and Economy introduces scarcity, choice and the allocation of limited resources. These notes establish the basic language of microeconomics and explain how economic activities and different types of economies are organised.',
    keyTopics: ['Meaning and scope of economics', 'Scarcity, choice and opportunity cost', 'Economic and non-economic activities', 'Microeconomics and macroeconomics', 'Market, planned and mixed economies'],
    examFocus: ['Use scarcity and alternative uses when explaining an economic problem.', 'Differentiate positive and normative ideas where applicable.', 'Support types of economies with simple examples.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 2,
    slug: 'central-problems-of-economy', chapter: 'Central Problems of an Economy', pages: 13,
    seoTitle: 'Central Problems Notes — Class 11 Economics',
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-02-central-problems-of-economy.pdf',
    summary: 'The Central Problems of an Economy arise because resources are scarce while wants are unlimited. This chapter explains what, how and for whom to produce and uses the production possibility curve to show choice, efficiency and opportunity cost.',
    keyTopics: ['What, how and for whom to produce', 'Production possibility curve and schedule', 'Opportunity cost and marginal opportunity cost', 'Efficient, inefficient and unattainable combinations', 'Shifts and rotations of the PPC'],
    examFocus: ['Draw and label the PPC accurately.', 'Explain movement versus shift using the correct cause.', 'Practise marginal opportunity cost calculations from a schedule.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 3,
    slug: 'consumers-equilibrium-utility-analysis', chapter: "Consumer's Equilibrium — Utility Analysis", pages: 11,
    seoTitle: 'Consumer Equilibrium Utility Notes — Class 11',
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-03-consumers-equilibrium-utility.pdf',
    summary: 'Utility Analysis explains how a consumer allocates limited income to obtain maximum satisfaction. The notes cover total and marginal utility, the law of diminishing marginal utility and equilibrium conditions for one and two commodities.',
    keyTopics: ['Meaning and measurement of utility', 'Total utility and marginal utility relationship', 'Law of diminishing marginal utility', 'Consumer equilibrium for one commodity', 'Equilibrium for two commodities and equi-marginal utility'],
    examFocus: ['Interpret TU and MU schedules correctly.', 'State both equilibrium conditions, including the falling-MU condition.', 'Practise numerical questions using MUx/Px and MUy/Py.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 4,
    slug: 'indifference-curve-analysis', chapter: "Consumer's Equilibrium — Indifference Curve Analysis", pages: 10,
    seoTitle: 'Indifference Curve Notes — Class 11 Economics',
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-04-indifference-curve-analysis.pdf',
    summary: 'Indifference Curve Analysis studies consumer choice without measuring satisfaction in numerical units. These notes explain preferences, indifference curves, marginal rate of substitution, the budget line and equilibrium through tangency.',
    keyTopics: ['Preferences and indifference sets', 'Indifference curve and indifference map', 'Properties of indifference curves', 'Budget set and budget line', 'Consumer equilibrium using MRS and price ratio'],
    examFocus: ['Draw convex indifference curves and explain their slope.', 'Show changes in the budget line caused by income or price.', 'State the tangency and convexity conditions together.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 5,
    slug: 'theory-of-demand', chapter: 'Theory of Demand', pages: 10,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-05-theory-of-demand.pdf',
    summary: 'Theory of Demand explains how quantity demanded responds to price and other determinants. The notes distinguish individual and market demand, movement and shift, normal and inferior goods, substitutes and complements.',
    keyTopics: ['Meaning and determinants of demand', 'Individual and market demand schedules', 'Law of demand and its assumptions', 'Movement along and shift of the demand curve', 'Normal, inferior, substitute and complementary goods'],
    examFocus: ['Separate change in quantity demanded from change in demand.', 'Use correct diagrams for extension, contraction, increase and decrease.', 'Explain exceptions only where the syllabus requires them.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 6,
    slug: 'price-elasticity-of-demand', chapter: 'Price Elasticity of Demand', pages: 7,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-06-price-elasticity-of-demand.pdf',
    summary: 'Price Elasticity of Demand measures the responsiveness of quantity demanded to a price change. These notes cover degrees of elasticity, percentage and expenditure methods, geometric measurement and major determinants.',
    keyTopics: ['Meaning and degrees of price elasticity', 'Percentage method', 'Total expenditure method', 'Geometric or point method', 'Factors affecting elasticity of demand'],
    examFocus: ['Ignore the negative sign when reporting the degree unless specifically discussed.', 'Practise percentage and geometric numerical problems.', 'Connect the total expenditure direction with elastic, inelastic and unitary demand.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 7,
    slug: 'production-function-and-returns-to-a-factor', chapter: 'Production Function and Returns to a Factor', pages: 8,
    seoTitle: 'Production Function Notes — Class 11 Economics',
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-07-production-function.pdf',
    summary: 'Production Function explains the technical relationship between inputs and output. The chapter studies short-run production through total, average and marginal product and the three stages of the law of variable proportions.',
    keyTopics: ['Production function and factors of production', 'Short run and long run', 'Total, average and marginal product', 'Relationship among TP, AP and MP', 'Law of variable proportions and its stages'],
    examFocus: ['Calculate AP and MP from a production schedule.', 'Explain the TP-MP and AP-MP relationships.', 'Identify the rational stage of production with reasons.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 8,
    slug: 'concepts-of-cost', chapter: 'Concepts of Cost', pages: 14,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-08-concepts-of-cost.pdf',
    summary: 'Concepts of Cost examines the expenses a producer incurs at different output levels. These notes connect fixed, variable, total, average and marginal costs and explain the shapes and relationships of short-run cost curves.',
    keyTopics: ['Fixed, variable and total cost', 'Average fixed, average variable and average total cost', 'Marginal cost', 'Cost schedules and curves', 'Relationship between marginal and average cost'],
    examFocus: ['Practise deriving every cost from a given table.', 'Remember that TFC remains constant while AFC continuously falls.', 'Use MC to explain changes in AVC and AC.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 9,
    slug: 'concept-of-revenue', chapter: 'Concept of Revenue', pages: 11,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-09-concept-of-revenue.pdf',
    summary: 'Concept of Revenue explains a firm’s receipts from selling output. The chapter develops total, average and marginal revenue schedules and compares their behaviour under perfect competition and imperfect competition.',
    keyTopics: ['Total, average and marginal revenue', 'Revenue schedules and calculations', 'AR as the firm’s demand curve', 'Revenue under perfect competition', 'Revenue under imperfect competition'],
    examFocus: ['Calculate TR, AR and MR from incomplete schedules.', 'Explain why AR equals MR under a constant price.', 'Connect the slope of AR with the position of MR.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 10,
    slug: 'producers-equilibrium', chapter: "Producer's Equilibrium", pages: 11,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-10-producers-equilibrium.pdf',
    summary: 'Producer’s Equilibrium identifies the output level that maximises profit. These notes present the total revenue-total cost approach and the marginal revenue-marginal cost approach with schedules, diagrams and equilibrium conditions.',
    keyTopics: ['Meaning of profit and producer equilibrium', 'TR-TC approach', 'MR-MC approach', 'Equilibrium conditions', 'Numerical schedules and diagrams'],
    examFocus: ['State both MR-MC conditions, not only MR equals MC.', 'Use the rising-MC condition when selecting between equal points.', 'Practise profit calculations using TR minus TC.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 11,
    slug: 'supply', chapter: 'Supply', pages: 12,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-11-supply.pdf',
    summary: 'Supply explains the quantity a producer is willing to sell at different prices during a period. The notes cover the law of supply, determinants, movement and shift, market supply and price elasticity of supply.',
    keyTopics: ['Meaning and determinants of supply', 'Individual and market supply schedules', 'Law of supply', 'Movement along and shift of the supply curve', 'Price elasticity of supply'],
    examFocus: ['Distinguish change in quantity supplied from change in supply.', 'Draw extension, contraction, increase and decrease correctly.', 'Practise percentage and geometric elasticity questions.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 12,
    slug: 'forms-of-market', chapter: 'Forms of Market', pages: 11,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-12-forms-of-market.pdf',
    summary: 'Forms of Market compares market structures according to number of firms, product nature, entry conditions and price control. These notes focus on perfect competition and the distinguishing features of monopoly, monopolistic competition and oligopoly.',
    keyTopics: ['Meaning and classification of markets', 'Features of perfect competition', 'Monopoly', 'Monopolistic competition', 'Oligopoly and market comparison'],
    examFocus: ['Compare structures using common bases.', 'Explain why a perfectly competitive firm is a price taker.', 'Use product differentiation and entry barriers correctly.'],
  }),
  makeMaterial({
    hubId: 'class-11-microeconomics', chapterNumber: 13,
    slug: 'market-equilibrium', chapter: 'Market Equilibrium', pages: 11,
    fileUrl: '/materials/cbse/class-11/microeconomics/chapter-13-market-equilibrium.pdf',
    summary: 'Market Equilibrium brings demand and supply together to determine equilibrium price and quantity. The chapter analyses excess demand, excess supply and the effects of shifts in demand and supply, including price ceilings and price floors.',
    keyTopics: ['Equilibrium price and quantity', 'Excess demand and excess supply', 'Effects of changes in demand', 'Effects of changes in supply', 'Price ceiling and price floor'],
    examFocus: ['Show adjustment from disequilibrium to equilibrium.', 'Use diagrams to analyse shifts one at a time.', 'Explain binding price controls and their likely market effects.'],
  }),
];

export const materialByPath = Object.fromEntries(seoMaterials.map((material) => [material.seo_path, material]));
export const hubByPath = Object.fromEntries(seoHubs.map((hub) => [hub.path, hub]));

export function getHubMaterials(hubId) {
  return seoMaterials
    .filter((material) => material.hubId === hubId)
    .sort((a, b) => a.chapterNumber - b.chapterNumber);
}

export function getMaterialStructuredData(material) {
  const hub = hubById[material.hubId];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_URL}${material.seo_path}#resource`,
        name: material.seoTitle,
        description: material.description,
        url: `${SITE_URL}${material.seo_path}`,
        educationalLevel: `CBSE Class ${material.class_level}`,
        learningResourceType: 'Revision notes',
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        author: { '@id': `${SITE_URL}/#teacher` },
        provider: { '@id': `${SITE_URL}/#organization` },
        associatedMedia: {
          '@type': 'MediaObject',
          contentUrl: `${SITE_URL}${material.file_url}`,
          encodingFormat: 'application/pdf',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
          { '@type': 'ListItem', position: 2, name: 'Study Material', item: `${SITE_URL}/study-material` },
          { '@type': 'ListItem', position: 3, name: hub.label, item: `${SITE_URL}${hub.path}` },
          { '@type': 'ListItem', position: 4, name: material.chapter, item: `${SITE_URL}${material.seo_path}` },
        ],
      },
    ],
  };
}

export function getHubStructuredData(hub) {
  const items = getHubMaterials(hub.id);
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: hub.seoTitle,
    description: hub.description,
    url: `${SITE_URL}${hub.path}`,
    numberOfItems: items.length,
    itemListElement: items.map((material, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: material.chapter,
      url: `${SITE_URL}${material.seo_path}`,
    })),
  };
}
