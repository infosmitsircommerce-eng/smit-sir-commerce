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
    sourceLabel: 'T.R. Jain & V.K. Ohri — Introductory Microeconomics, Class XI, Chapter 1: Economics and Economy',
    sourceStatus: 'Reference-book verified',
    levels: {
      Easy: [
        makeQuestion('Economics mainly studies how scarce means are used to satisfy:', ['Unlimited wants', 'Only basic wants', 'Government wants only', 'Producer wants only'], 0, 'The chapter explains economics through scarcity of means in relation to unlimited human wants.'),
        makeQuestion('Scarcity exists when:', ['Supply of resources is greater than demand', 'Supply of resources is less than demand', 'Resources have no alternative uses', 'All goods are free'], 1, 'The source defines scarcity as a situation in which the supply of resources is less than the demand for them.'),
        makeQuestion('Choice emerges mainly because resources are:', ['Unlimited and free', 'Scarce and capable of alternative uses', 'Owned only by government', 'Used only for consumption'], 1, 'The chapter identifies two reasons for choice: resources are scarce and they have alternative uses.'),
        makeQuestion('Microeconomics studies economic problems mainly at the level of:', ['Individual economic units', 'The entire world economy', 'Only the central government', 'All countries together'], 0, 'Microeconomics focuses on units such as an individual household, firm, consumer, industry or market.'),
        makeQuestion('Macroeconomics studies:', ['One consumer only', 'One firm only', 'The economy as a whole', 'One product market only'], 2, 'Macroeconomics deals with aggregates and economic problems at the level of the economy as a whole.'),
        makeQuestion('Positive economics deals with statements that are:', ['Always morally desirable', 'Verifiable for truth', 'Always true', 'Based only on opinions'], 1, 'Positive statements can be checked against facts; they may turn out to be true or false.'),
        makeQuestion('Normative economics mainly deals with:', ['Verifiable facts only', 'Value judgements and opinions', 'Only historical data', 'Only national income'], 1, 'Normative economics concerns what ought to be and therefore involves opinions or value judgements.'),
        makeQuestion('An economy is best described as:', ['A stock exchange', 'A system by which people of an area earn their living', 'A government budget', 'A list of scarce goods'], 1, 'The source defines an economy as the system by which people of an area earn their living.'),
        makeQuestion('In a market economy, economic activities are mainly guided by:', ['Market forces', 'A central planning authority', 'Only public-sector firms', 'A fixed rationing authority'], 0, 'A market economy relies mainly on market forces such as demand and supply.'),
        makeQuestion('India is used in the chapter as an example of a:', ['Centrally planned economy', 'Market economy with no regulation', 'Mixed economy', 'Barter economy'], 2, 'The chapter uses India as an example of a mixed economy where market forces operate with government regulation.'),
      ],
      Moderate: [
        makeQuestion('Which pair gives the two basic characteristics of resources that create the problem of choice?', ['Scarcity and alternative uses', 'Abundance and fixed uses', 'Free availability and scarcity', 'Unlimited supply and limited wants'], 0, 'Choice arises because resources are scarce relative to wants and can be allocated to alternative uses.'),
        makeQuestion('Which topic is primarily microeconomic?', ['General price level', 'Total employment in the economy', 'Price determination for an individual industry', 'National income'], 2, 'The chapter associates microeconomics with output and price determination for individual firms and industries.'),
        makeQuestion('Microeconomics is often referred to as the:', ['Theory of Income and Employment', 'Theory of Price', 'Theory of Public Finance', 'Theory of National Accounts'], 1, 'Because it studies output and price determination at the individual firm or industry level, the source calls microeconomics the Theory of Price.'),
        makeQuestion('Macroeconomics is often referred to as the:', ['Theory of Price', 'Theory of Consumer Choice', 'Theory of Income and Employment', 'Theory of Firm Behaviour'], 2, 'The source links macroeconomics with aggregate output, income and employment.'),
        makeQuestion('Which statement is positive rather than normative?', ['The government should reduce inequality', 'A tax rate can be verified from official records', 'Subsidies ought to be increased', 'Public spending must be cut'], 1, 'A claim that can be checked against records is positive; the other choices prescribe what ought to happen.'),
        makeQuestion('Which statement about positive economics is correct?', ['Every positive statement must be true', 'A positive statement may be true or false but must be verifiable', 'Positive statements always contain numbers', 'Positive statements are value judgements'], 1, 'The chapter explicitly cautions that positive statements are not necessarily true; their defining feature is verifiability.'),
        makeQuestion('Compared with a complex economy, a simple economy generally has:', ['Higher interdependence and exchange', 'A moderate degree of interdependence and exchange', 'No exchange at all', 'Only government production'], 1, 'The source defines a simple economy by a moderate degree of interdependence and exchange.'),
        makeQuestion('In a centrally planned economy, the dominant motive behind economic decisions is:', ['Profit maximisation only', 'Social welfare', 'Consumer sovereignty only', 'Private ownership'], 1, 'The chapter states that centrally planned economic decisions are primarily driven by social welfare.'),
        makeQuestion('In a market economy, most resources are mainly controlled by:', ['Private people and firms', 'Only the central authority', 'International organisations', 'Local governments only'], 0, 'The source contrasts market economies with centrally planned economies by noting private control or ownership of most resources.'),
        makeQuestion('A mixed economy combines:', ['Only private ownership and no regulation', 'Market forces with government regulation', 'Only central planning and no markets', 'Barter with monetary exchange'], 1, 'The defining feature given in the chapter is free play of market forces together with government regulation.'),
      ],
      Hard: [
        makeQuestion('A piece of land can be used either for wheat, rice or a warehouse. Which economic idea is most directly illustrated?', ['Alternative uses of resources', 'Absence of scarcity', 'Macroeconomic aggregation', 'Normative judgement'], 0, 'The source uses land as an example of a resource that can be allocated among alternative uses, creating a choice problem.'),
        makeQuestion('A good is available to a person at zero price, but producing or supplying it still uses scarce resources. According to the chapter, the good can still be:', ['Non-scarce automatically', 'Scarce because it involves opportunity cost', 'Normative', 'A macroeconomic variable'], 1, 'The reason-based section notes that zero price alone does not remove scarcity when the good still involves opportunity cost.'),
        makeQuestion('A researcher studies the demand for salt by all households in one market. The chapter treats this as:', ['Microeconomics', 'Macroeconomics', 'Normative economics', 'Public finance'], 0, 'Microeconomics can study a small group of economic units or an individual market, not only one person.'),
        makeQuestion('While analysing one firm’s output and price, microeconomics commonly assumes that:', ['All macro variables are changing', 'Relevant macro variables remain constant', 'Government policies do not exist', 'Resources have no alternative uses'], 1, 'The chapter explains that microeconomic analysis assumes macro variables remain constant for the problem being studied.'),
        makeQuestion('When studying aggregate output and income, macroeconomics commonly assumes that:', ['All micro variables must change', 'Relevant micro variables remain constant', 'No prices exist', 'Only one firm operates'], 1, 'The chapter gives distribution of income as an example of a micro variable held constant during macroeconomic analysis.'),
        makeQuestion('A statement says, “This policy will increase output by 5%,” and the claim can be tested with data. Its classification depends mainly on:', ['Whether it sounds desirable', 'Whether it is verifiable', 'Whether everyone agrees with it', 'Whether it mentions government'], 1, 'Verifiability, rather than agreement or desirability, is the defining feature of a positive statement.'),
        makeQuestion('A country lets consumers choose freely and private firms dominate, with prices mainly set by demand and supply. This most closely describes a:', ['Centrally planned economy', 'Market economy', 'Mixed economy with strong price controls', 'Subsistence economy'], 1, 'Consumer sovereignty, private-sector dominance and market-determined prices are characteristics of a market economy in the source.'),
        makeQuestion('A country allows markets to determine most prices but regulates essential goods and maintains a public distribution system. This most closely describes a:', ['Pure market economy', 'Centrally planned economy', 'Mixed economy', 'Barter economy'], 2, 'The chapter specifically describes mixed economies as market-based but regulated, including regulation of essential goods and PDS support.'),
        makeQuestion('Which situation would remove the resource-allocation problem most directly?', ['Resources remain scarce but wants increase', 'Resources have only one possible use', 'Market prices increase', 'Government spending rises'], 1, 'The source states that the allocation problem arises because scarce resources have alternative uses; without alternative uses, that particular choice problem disappears.'),
        makeQuestion('Why can scarcity exist even for a very wealthy person?', ['Because wealth is always zero', 'Because resources remain limited relative to wants', 'Because all wants become limited', 'Because money cannot be used for choice'], 1, 'The chapter stresses relative scarcity: even very large resources can be insufficient compared with all possible wants.'),
      ],
      Extreme: [
        makeQuestion('Which statement best captures the chapter’s chain of reasoning?', ['Alternative uses eliminate scarcity, so choice disappears', 'Scarcity plus alternative uses creates choice, and choice requires decision-making', 'Choice causes resources to become unlimited', 'Scarcity matters only in poor economies'], 1, 'The chapter links scarcity and alternative uses to choice, and then links choice to decision-making about resource allocation.'),
        makeQuestion('A claim is factually wrong but can be checked against reliable data. Under the chapter’s classification, it is still:', ['Normative because it is wrong', 'Positive because it is verifiable', 'Normative because it is debatable', 'Neither positive nor normative'], 1, 'The source explicitly separates truth from verifiability: a positive statement can be wrong and still remain positive if it can be verified as true or false.'),
        makeQuestion('Which combination is internally consistent with the chapter’s description of a centrally planned economy?', ['Private ownership, consumer sovereignty, profit motive', 'Government control, social-welfare motive, limited consumer sovereignty', 'Market pricing, private-sector dominance, no regulation', 'PDS plus unrestricted private pricing of every essential good'], 1, 'The centrally planned model in the chapter combines strong government control with social-welfare objectives and limited consumer sovereignty.'),
        makeQuestion('Which combination is internally consistent with the chapter’s description of a mixed economy?', ['Only public ownership and central pricing', 'Only private ownership and no regulation', 'Private and public sectors with market forces plus government regulation', 'No exchange and no interdependence'], 2, 'A mixed economy combines public and private sectors and allows market forces while retaining government regulation.'),
        makeQuestion('A policy analyst asks whether unemployment should be reduced through higher public spending. The word “should” makes the statement primarily:', ['Positive', 'Normative', 'Microeconomic only', 'A statement of scarcity'], 1, 'The question prescribes what ought to be done, which places it in normative economics.'),
        makeQuestion('Suppose there is no scarcity of a resource and it has no opportunity cost. According to the logic of the chapter, the strongest conclusion is:', ['The economic choice problem for that resource disappears', 'The resource becomes more scarce', 'Normative economics replaces positive economics', 'Macroeconomics becomes impossible'], 0, 'The chapter treats scarcity as the root of the economic problem; without scarcity and opportunity cost, there is no allocation choice for that resource.'),
        makeQuestion('A firm chooses a method that maximises profit, while a government authority chooses a method mainly to reduce unemployment. Which contrast is being illustrated?', ['Market-economy motive versus social-welfare motive', 'Microeconomics versus positive economics', 'Simple economy versus complex economy', 'Scarcity versus abundance'], 0, 'The chapter contrasts profit-oriented decisions in market economies with social-welfare-oriented decisions under central planning.'),
        makeQuestion('Which statement about consumer sovereignty is most accurate in the chapter’s three-economy comparison?', ['Consumers are sovereign only in centrally planned economies', 'Consumers are sovereign in market and mixed economies, though mixed economies may regulate essential goods', 'Consumers are never sovereign in any economy', 'Consumers are sovereign only when all resources are government-owned'], 1, 'The comparison gives consumer sovereignty to market and mixed economies, while noting government measures such as PDS in mixed economies.'),
        makeQuestion('Why is microeconomics not limited to studying a single person?', ['Because it studies only governments', 'Because it can also study small groups, individual industries and individual markets', 'Because it studies only national aggregates', 'Because it excludes firms'], 1, 'The source includes individual households, firms, industries and markets within microeconomic analysis.'),
        makeQuestion('A society has unlimited wants, but every resource has exactly one fixed use. Which part of the usual economic-choice problem is weakened most directly?', ['Scarcity of resources', 'Alternative-use allocation', 'Existence of wants', 'Need for production'], 1, 'Even with scarcity, if each resource has only one possible use, the allocation among alternative uses—the core choice described in the chapter—is reduced.'),
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
