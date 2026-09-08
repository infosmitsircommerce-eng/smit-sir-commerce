export const quizLevels = ['Easy', 'Moderate', 'Hard', 'Extreme'];

export const quizBoards = [
  {
    id: 'CBSE',
    name: 'CBSE Board',
    description: 'Class 11 and Class 12 Commerce quizzes built only from verified Smit Sir / textbook-based source material.',
    classes: [
      {
        classLevel: 11,
        subjects: [
          { id: 'cbse-11-accountancy', name: 'Accountancy', status: 'source-needed' },
          { id: 'cbse-11-business-studies', name: 'Business Studies', status: 'source-needed' },
          { id: 'cbse-11-economics', name: 'Economics', status: 'verified' },
          { id: 'cbse-11-entrepreneurship', name: 'Entrepreneurship', status: 'source-needed' },
          { id: 'cbse-11-physical-education', name: 'Physical Education', status: 'source-needed' },
        ],
      },
      {
        classLevel: 12,
        subjects: [
          { id: 'cbse-12-accountancy', name: 'Accountancy', status: 'source-needed' },
          { id: 'cbse-12-business-studies', name: 'Business Studies', status: 'verified' },
          { id: 'cbse-12-economics', name: 'Economics', status: 'source-needed' },
        ],
      },
    ],
  },
  {
    id: 'GSEB',
    name: 'GSEB Board',
    description: 'Gujarat Board quizzes are published only when a reliable textbook / textbook-based source is available.',
    classes: [
      {
        classLevel: 11,
        subjects: [],
        sourceNote: 'Verified GSEB Class 11 subject textbooks are required before publishing subject quiz banks.',
      },
      {
        classLevel: 12,
        subjects: [
          { id: 'gseb-12-economics', name: 'Economics', status: 'verified' },
          { id: 'gseb-12-business-administration', name: 'Business Administration', status: 'source-needed' },
          { id: 'gseb-12-spcc', name: 'SPCC', status: 'source-needed' },
        ],
        sourceNote: 'Economics is source-backed. BA and SPCC have prior-paper material, but full textbook sources are still needed for a complete chapter-wise quiz bank.',
      },
    ],
  },
];

const makeQuestion = (q, options, answer, explanation) => ({ q, options, answer, explanation });

export const verifiedQuizPacks = [
  {
    id: 'cbse-11-economics-ch1',
    board: 'CBSE',
    classLevel: 11,
    subject: 'Economics',
    title: 'Economics and Economy',
    chapter: 'Chapter 1',
    sourceLabel: 'Smit Sir — Class XI Introductory Microeconomics, Chapter 1: Economics and Economy',
    sourceStatus: 'Verified source used',
    levels: {
      Easy: [
        makeQuestion('The word “Economics” comes from which Greek word?', ['Oikonomia', 'Mikros', 'Makros', 'Nomisma'], 0, 'The source notes state that Economics comes from the Greek word “Oikonomia”, meaning household management.'),
        makeQuestion('According to the chapter, the basic economic problem arises because:', ['Wants are limited and resources are unlimited', 'Wants are unlimited and resources are scarce', 'Only money is scarce', 'Production is always low'], 1, 'Unlimited wants and scarce resources create the need to choose.'),
        makeQuestion('Microeconomics mainly studies:', ['The whole economy', 'Individual consumers, firms and markets', 'Only government budgets', 'Only national income'], 1, 'Microeconomics focuses on individual economic units such as consumers, producers and markets.'),
        makeQuestion('A statement describing what “should be” belongs to:', ['Positive economics', 'Normative economics', 'Microeconomics only', 'Macroeconomics only'], 1, 'Normative economics deals with opinions and value judgments about what ought to be.'),
        makeQuestion('India is described in the notes as a:', ['Pure capitalist economy', 'Pure socialist economy', 'Mixed economy', 'Barter economy'], 2, 'The notes use India as an example of a mixed economy with both public and private sectors.'),
      ],
      Moderate: [
        makeQuestion('Which is a microeconomic example?', ['India’s GDP', 'General inflation rate', 'Demand for a single commodity', 'National unemployment rate'], 2, 'Demand for one commodity concerns an individual market, so it is microeconomic.'),
        makeQuestion('Which word best represents Lionel Robbins’ definition?', ['Scarcity and choice', 'Only material welfare', 'Only national income', 'Only government policy'], 0, 'Robbins focuses on ends, scarce means and alternative uses — therefore scarcity and choice.'),
        makeQuestion('Which of these is a positive economic statement?', ['Taxes should be lower', 'The government ought to provide free education', 'The price of a product is ₹100', 'Income inequality must be reduced'], 2, 'A measurable factual statement is positive; “should/ought/must” statements are normative.'),
        makeQuestion('Macroeconomics studies which of the following?', ['Price of one product', 'Choice of one consumer', 'National income and total employment', 'Output of one firm'], 2, 'Macroeconomics deals with aggregate variables such as national income and total employment.'),
        makeQuestion('In a socialist / centrally planned economy, major economic decisions are mainly made by:', ['Individual consumers only', 'Private firms only', 'The government or central authority', 'Foreign companies'], 2, 'The source table identifies government / central authority as the main decision maker.'),
      ],
      Hard: [
        makeQuestion('A student has ₹100 but wants food, stationery and a movie ticket. Which concept is demonstrated most directly?', ['Unlimited resources', 'Scarcity forcing choice', 'Macroeconomic equilibrium', 'Full employment'], 1, 'The chapter uses the same type of example to explain scarce means, multiple wants and choice.'),
        makeQuestion('Which pair is correctly matched?', ['Microeconomics — whole economy', 'Macroeconomics — single market', 'Microeconomics — price theory', 'Macroeconomics — individual consumer theory'], 2, 'The notes describe Microeconomics as closely associated with price theory and individual markets.'),
        makeQuestion('Which feature makes a statement normative rather than positive?', ['It is about economics', 'It contains a measurable number', 'It expresses a value judgment', 'It refers to a market'], 2, 'Normative statements are based on opinions or value judgments and cannot be verified like facts.'),
        makeQuestion('If a government must choose between spending limited funds on hospitals or roads, the root economic issue is:', ['No demand', 'Scarcity and alternative uses', 'No production', 'Only inflation'], 1, 'Limited resources with alternative uses force a choice between competing wants.'),
        makeQuestion('Which comparison best reflects the notes?', ['Marshall emphasises scarcity; Robbins emphasises welfare', 'Marshall emphasises material welfare; Robbins emphasises scarcity and choice', 'Both definitions are identical', 'Robbins excludes choice'], 1, 'The notes contrast Marshall’s welfare focus with Robbins’ scarcity-and-choice focus.'),
      ],
      Extreme: [
        makeQuestion('A statement says, “India’s unemployment rate is X%, therefore the government should guarantee jobs to everyone.” Which classification is most accurate?', ['Entire statement is positive', 'Entire statement is normative', 'First part is positive; second part is normative', 'First part is normative; second part is positive'], 2, 'A measurable fact is positive, while a “should” prescription is normative.'),
        makeQuestion('A country allows private firms to operate but the government also runs major public services. Which type of economy best fits the chapter framework?', ['Capitalist only', 'Socialist only', 'Mixed', 'Barter'], 2, 'A mixed economy combines public and private decision-making.'),
        makeQuestion('Why does scarcity remain an economic problem even in a wealthy country?', ['Because wealthy countries have no resources', 'Because resources are still limited relative to competing wants and alternative uses', 'Because prices never change', 'Because only poor countries make choices'], 1, 'The chapter’s logic is relative scarcity: limited resources compared with unlimited or competing wants.'),
        makeQuestion('Which sequence best explains the economic problem?', ['Scarce wants → unlimited resources → no choice', 'Unlimited wants → scarce resources → need to choose', 'High income → no wants → scarcity', 'Production → no consumption → choice'], 1, 'The source explicitly links unlimited wants and scarce resources to the need for choice.'),
        makeQuestion('A researcher studies the price of tea and then India’s general price level. The first topic is ___ and the second is ___.', ['Macro; micro', 'Micro; macro', 'Normative; positive', 'Positive; normative'], 1, 'A single-good price is microeconomic; the general price level is macroeconomic.'),
      ],
    },
  },
  {
    id: 'cbse-12-business-studies-ch1',
    board: 'CBSE',
    classLevel: 12,
    subject: 'Business Studies',
    title: 'Nature and Significance of Management',
    chapter: 'Chapter 1',
    sourceLabel: 'Smit Sir — CBSE Class 12 Business Studies, Chapter 1: Nature and Significance of Management',
    sourceStatus: 'Verified source used',
    levels: {
      Easy: [
        makeQuestion('Management is concerned with getting work done:', ['Only quickly', 'Effectively and efficiently', 'Only cheaply', 'Without goals'], 1, 'The source repeatedly connects management with achieving goals effectively and using resources efficiently.'),
        makeQuestion('“Achieving the target” mainly refers to:', ['Efficiency', 'Effectiveness', 'Delegation', 'Coordination only'], 1, 'Effectiveness means doing the right work and achieving the intended result.'),
        makeQuestion('Management is needed in all organisations, levels and departments. This means management is:', ['Intangible', 'Pervasive', 'Temporary', 'Restricted'], 1, 'Pervasive means management is required across organisations, levels and departments.'),
        makeQuestion('Which is an organisational objective of management?', ['Survival', 'Employee recognition only', 'Personal promotion only', 'Charity only'], 0, 'The notes list survival, profit and growth as organisational objectives.'),
        makeQuestion('Management is not a full profession mainly because:', ['It has no knowledge base', 'Entry is not restricted by a compulsory qualification or licence', 'Managers never serve society', 'There are no management associations'], 1, 'The source explains that restricted entry is absent, so management is not yet a full profession.'),
      ],
      Moderate: [
        makeQuestion('Management deals with work, people and operations. This characteristic is:', ['Multidimensional', 'Intangible', 'Static', 'Individual'], 0, 'The source defines management as multidimensional: work, people and operations.'),
        makeQuestion('Planning, organising, staffing, directing and controlling continue as long as the organisation exists. This shows management is:', ['A one-time activity', 'A continuous process', 'Only a science', 'Only a profession'], 1, 'Management is described as an ongoing chain of interrelated functions.'),
        makeQuestion('Which is a social objective of management?', ['Survival only', 'Fair-quality products and social welfare', 'Employee promotion only', 'Maximum personal salary of managers'], 1, 'Social objectives include quality products, employment, environment-friendly methods and community welfare.'),
        makeQuestion('Which statement best supports management as an art?', ['It has no theory', 'It requires personal application, practice and creativity', 'It has compulsory licensing', 'Its principles never change'], 1, 'The notes say art involves theoretical knowledge plus personalised application, practice and creativity.'),
        makeQuestion('Which characteristic means management cannot be seen directly but is felt through results?', ['Pervasive', 'Intangible force', 'Goal-oriented', 'Multidimensional'], 1, 'The source describes management as an intangible force visible through orderly results.'),
      ],
      Hard: [
        makeQuestion('A school changes its teaching process when new technology and regulations arrive. Which characteristic is most directly shown?', ['Dynamic function', 'Intangible force', 'Personal objective', 'Restricted entry'], 0, 'Adapting to changes in the external environment demonstrates management as a dynamic function.'),
        makeQuestion('A manager reaches the sales target but wastes excessive money and material. The manager is:', ['Effective but inefficient', 'Efficient but ineffective', 'Neither effective nor inefficient', 'Both effective and efficient'], 0, 'The target is achieved (effective) but resources are wasted (inefficient).'),
        makeQuestion('Which combination belongs to organisational objectives?', ['Survival, profit, growth', 'Salary, recognition, promotion', 'Environment, taxes, community welfare', 'Training, leadership, communication'], 0, 'The notes group survival, profit and growth under organisational objectives.'),
        makeQuestion('Why is management described as an inexact / soft science in the source?', ['Because it has no principles', 'Because human behaviour and situations make universal application less exact', 'Because managers do not experiment', 'Because it has no terminology'], 1, 'Management has principles and knowledge, but their application varies with people and situations.'),
        makeQuestion('Which feature of a profession is only partly satisfied by management?', ['Well-defined knowledge', 'Restricted entry', 'Professional association and ethical code', 'No service motive'], 2, 'The notes say associations and codes exist but are not compulsory or universally binding.'),
      ],
      Extreme: [
        makeQuestion('A hospital coordinates doctors, nurses, labs and reception around patient care. Which idea is most strongly illustrated?', ['Management harmonises group efforts toward a common goal', 'Management eliminates all personal objectives', 'Management is restricted to top management', 'Management is only financial'], 0, 'The source uses similar examples to explain achieving group goals through coordinated effort.'),
        makeQuestion('Two managers use the same management principles differently because of experience and personality. This most strongly supports management as:', ['A pure natural science', 'An art', 'A fully regulated profession', 'A static process'], 1, 'Personalised application of theoretical knowledge is a key feature of art.'),
        makeQuestion('A business introduces automation, retrains employees and changes processes after new competition enters. Which pair is best supported?', ['Dynamic management + development of efficiency', 'Intangible management + restricted entry', 'Personal objective + no planning', 'Static management + social objective'], 0, 'The response to environmental change is dynamic management, while improved processes can raise efficiency.'),
        makeQuestion('Which statement is the most accurate conclusion about the nature of management from the source?', ['Management is only a science', 'Management is only an art', 'Management is an art, has features of science, and is moving toward profession status', 'Management is already a fully regulated profession'], 2, 'The source concludes that management is an art, an inexact science and an emerging profession.'),
        makeQuestion('A firm achieves profit but ignores employee safety and fair customer treatment. Which objective balance is weakest?', ['Only organisational objectives', 'Social and personal objectives', 'Only survival', 'Only growth'], 1, 'Employee safety relates to personal objectives, while fair customer treatment relates to social objectives.'),
      ],
    },
  },
  {
    id: 'gseb-12-economics-ch3',
    board: 'GSEB',
    classLevel: 12,
    subject: 'Economics',
    title: 'Money and Inflation',
    chapter: 'Chapter 3',
    sourceLabel: 'GSEB Class 12 Economics — Chapter 3 Money and Inflation textbook-based notes',
    sourceStatus: 'Verified textbook-based source used',
    levels: {
      Easy: [
        makeQuestion('Barter means:', ['Exchange using only bank deposits', 'Direct exchange of goods/services without money', 'Only foreign trade', 'Borrowing from banks'], 1, 'The source defines barter as direct exchange without a medium such as money.'),
        makeQuestion('Which is a main limitation of barter?', ['Too much paper money', 'Double coincidence of wants', 'Excess bank credit', 'High interest only'], 1, 'Barter requires both parties to want exactly what the other offers.'),
        makeQuestion('Which function of money solves the double coincidence of wants problem?', ['Store of value', 'Medium of exchange', 'Measure of value', 'Tax payment only'], 1, 'Money acts as an intermediary, separating selling from buying.'),
        makeQuestion('Inflation means a continuous rise in:', ['One product price only', 'General price level', 'Only wages', 'Only import prices'], 1, 'The source defines inflation as a sustained general price-level rise, not a temporary single-price increase.'),
        makeQuestion('During inflation, purchasing power of money generally:', ['Rises', 'Falls', 'Never changes', 'Becomes zero'], 1, 'As the general price level rises, the same money buys fewer goods and services.'),
      ],
      Moderate: [
        makeQuestion('Which function of money solves the barter problem of storing exchange value?', ['Medium of exchange', 'Store of value', 'Measure of value', 'Unit of production'], 1, 'Money can be saved for future use, overcoming the storage limitation of barter.'),
        makeQuestion('Which function provides a common yardstick for comparing prices?', ['Store of value', 'Measure of value', 'Medium of exchange only', 'Credit creation'], 1, 'Measure of value allows different goods and services to be valued in common money terms.'),
        makeQuestion('According to the source, true inflation after full employment is associated with:', ['Marshall', 'Robertson', 'Keynes', 'Robbins'], 2, 'The notes identify Keynes with the view that true inflation occurs beyond full employment.'),
        makeQuestion('When government controls visible price rise through rules or subsidies, the source calls it:', ['Demand-pull inflation', 'Suppressed inflation', 'Deflation', 'Barter inflation'], 1, 'Underlying inflation may exist even when visible price increases are suppressed by controls.'),
        makeQuestion('A rise in production costs causing firms to increase prices is:', ['Demand-pull inflation', 'Cost-push inflation', 'Only monetary inflation', 'No inflation'], 1, 'Cost-push inflation comes from the supply/cost side.'),
      ],
      Hard: [
        makeQuestion('A farmer cannot find someone who both wants wheat and offers exactly the cloth he needs. Which barter limitation is this?', ['Storage problem', 'Measurement problem', 'Double coincidence of wants', 'Inflation'], 2, 'The exchange fails because mutual wants do not coincide.'),
        makeQuestion('Crude oil import prices rise sharply, raising transport and many domestic prices. This best fits:', ['Imported / cost-related inflation pressure', 'Barter limitation', 'Deflation', 'Only demand from population'], 0, 'The source explicitly explains higher import prices as a channel through which inflation can enter the economy.'),
        makeQuestion('Government expenditure raises incomes while output does not keep pace. Which mechanism is most relevant?', ['Demand-pull inflation', 'Store of value', 'Barter exchange', 'Price measurement'], 0, 'Higher public expenditure can raise aggregate demand faster than supply.'),
        makeQuestion('Which is NOT enough by itself to establish inflation according to the source?', ['A sustained general price rise', 'A widespread price rise', 'A temporary rise in the price of a few goods', 'A fall in purchasing power accompanying general price rise'], 2, 'A short-period increase in a limited set of prices is not inflation in the chapter’s definition.'),
        makeQuestion('Which sequence best describes cost-push inflation?', ['Higher production cost → producers raise prices → general price pressure', 'Higher prices → barter begins → costs disappear', 'Lower cost → lower supply → inflation', 'More storage → less money → inflation'], 0, 'Cost-push inflation starts with rising input or production costs that push prices upward.'),
      ],
      Extreme: [
        makeQuestion('Suppose demand rises because money supply expands, while production is already constrained. Which inflation explanation fits best?', ['Demand-pull', 'Barter storage problem', 'Measure-of-value problem', 'No inflation mechanism'], 0, 'More spending power against limited output is the classic demand-pull mechanism in the source.'),
        makeQuestion('A price rise occurs only in onions for one week after bad weather. Based on the chapter definition, the safest conclusion is:', ['This alone proves general inflation', 'This alone does not establish inflation', 'It is automatically suppressed inflation', 'It is always cost-push inflation in all sectors'], 1, 'Inflation requires a sustained and general rise, not merely a temporary increase in a limited good.'),
        makeQuestion('Which pairing is fully correct?', ['Medium of exchange — solves measurement problem', 'Store of value — solves double coincidence', 'Measure of value — solves lack of common valuation', 'Paper money — causes barter'], 2, 'Measure of value gives a common unit for comparing different goods and services.'),
        makeQuestion('If wages, electricity and transport costs all rise, while consumer demand is unchanged, which explanation is strongest?', ['Demand-pull only', 'Cost-push / supply-shock inflation', 'Barter inflation', 'Suppressed inflation only'], 1, 'The source lists wages, electricity and transport among production costs that can generate cost-push inflation.'),
        makeQuestion('Which statement best combines the chapter’s inflation logic?', ['Any price rise is inflation', 'Inflation requires only high money income', 'Inflation is a sustained general price rise and is associated with falling purchasing power', 'Inflation means only imported oil becomes expensive'], 2, 'The chapter emphasises continuous, economy-wide price increase and the resulting fall in money’s purchasing power.'),
      ],
    },
  },
];

export function getQuizPacks(board, classLevel, subject) {
  return verifiedQuizPacks.filter((pack) => pack.board === board && pack.classLevel === classLevel && pack.subject === subject);
}
