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
    id: 'cbse-11-economics-introduction-unit',
    board: 'CBSE',
    classLevel: 11,
    subject: 'Economics',
    title: 'Introduction to Microeconomics — Board Mastery',
    chapter: 'CBSE Introduction Unit · Reference Chapters 1–2',
    sourceLabel: 'T.R. Jain & V.K. Ohri — Introductory Microeconomics, Class XI, Chapters 1–2; aligned to CBSE 2026–27 Introduction syllabus',
    sourceStatus: 'Reference-book + syllabus verified',
    levels: {
      Easy: [
        makeQuestion('Microeconomics mainly studies economic problems at the level of:', ['Individual economic units', 'The economy as a whole', 'All countries together', 'Only the government'], 0, 'Microeconomics focuses on individual units such as a household, consumer, firm, industry or market.'),
        makeQuestion('Macroeconomics mainly studies economic problems at the level of:', ['One consumer', 'One firm', 'The economy as a whole', 'One commodity only'], 2, 'Macroeconomics studies economy-wide aggregates such as total output, employment and the general price level.'),
        makeQuestion('A positive economic statement is one that is:', ['Necessarily desirable', 'Verifiable as true or false', 'Always correct', 'Based only on opinion'], 1, 'The defining feature of a positive statement is verifiability; it may ultimately prove true or false.'),
        makeQuestion('A normative economic statement mainly contains:', ['A value judgement or opinion', 'Only measured data', 'Only past facts', 'A national income identity'], 0, 'Normative economics deals with what ought to be and therefore involves value judgements or opinions.'),
        makeQuestion('An economy is best defined as:', ['A list of government policies', 'A system by which people of an area earn their living', 'A stock exchange', 'A record of national income'], 1, 'The reference book defines an economy as the system by which people of an area earn their living.'),
        makeQuestion('Which is one of the three central problems of an economy?', ['What to produce', 'How to eliminate every want', 'How to make resources unlimited', 'How to avoid all choices'], 0, 'The three central problems are what to produce, how to produce and for whom to produce.'),
        makeQuestion('The problem “what to produce” is mainly about deciding:', ['Which goods and services, and how much of them, to produce', 'Which accounting method to use', 'How income should be taxed', 'Which bank should issue currency'], 0, 'What to produce includes both the type of goods and services and the quantities to be produced.'),
        makeQuestion('The problem “how to produce” is mainly about choosing:', ['A technique of production', 'The consumers who will receive output', 'The quantity of money in circulation', 'The country’s exchange rate'], 0, 'How to produce concerns the choice of production technique, such as labour-intensive or capital-intensive methods.'),
        makeQuestion('The problem “for whom to produce” is mainly related to:', ['Distribution of goods and income', 'Choice of production technique', 'Selection of raw materials only', 'Measurement of GDP'], 0, 'For whom to produce concerns how output and purchasing power are distributed among people.'),
        makeQuestion('Opportunity cost is the value of:', ['Every alternative available', 'The next best alternative forgone', 'The chosen option itself', 'Only the money price paid'], 1, 'Opportunity cost is the value of the next best alternative that is sacrificed when a choice is made.'),
      ],
      Moderate: [
        makeQuestion('The market demand for one commodity, obtained by adding the demands of all buyers, is still primarily a topic of:', ['Microeconomics', 'Macroeconomics', 'Normative economics', 'Public finance'], 0, 'Even though market demand is an aggregate of individual demands, it concerns one commodity market and remains microeconomic.'),
        makeQuestion('Which topic is primarily macroeconomic?', ['Price of one firm’s product', 'Demand of one household', 'Total employment in the economy', 'Cost of one producer'], 2, 'Total employment is an economy-wide aggregate and is therefore macroeconomic.'),
        makeQuestion('Which statement about positive economics is correct?', ['Every positive statement must be true', 'A positive statement may be wrong but must be verifiable', 'Positive statements always use percentages', 'Positive statements express what ought to be'], 1, 'A positive statement is classified by whether it can be checked, not by whether it turns out to be correct.'),
        makeQuestion('“The government should increase spending on education” is mainly a:', ['Positive statement', 'Normative statement', 'Microeconomic identity', 'Definition of scarcity'], 1, 'The word “should” expresses a recommendation or value judgement, making the statement normative.'),
        makeQuestion('The economic problem arises because human wants are unlimited, resources are scarce, and resources:', ['Have alternative uses', 'Have only one use', 'Are always free', 'Are owned only by firms'], 0, 'The reference book identifies unlimited wants, scarce means and alternative uses as the causes of the economic problem.'),
        makeQuestion('Choosing between labour-intensive and capital-intensive production is part of:', ['What to produce', 'How to produce', 'For whom to produce', 'Positive economics'], 1, 'This is a choice of technique, which belongs to the “how to produce” problem.'),
        makeQuestion('Choosing between more consumer goods and more capital goods, with fixed resources, is mainly a problem of:', ['What to produce', 'How to produce', 'For whom to produce', 'Normative economics'], 0, 'The economy must choose which goods and how much of each to produce.'),
        makeQuestion('A Production Possibility Frontier shows:', ['Maximum possible combinations of two goods with given resources and technology', 'Only the market prices of two goods', 'All combinations regardless of resources', 'The distribution of income among households'], 0, 'A PPF shows alternative maximum output combinations under given resources, full and efficient use, and given technology.'),
        makeQuestion('A point on the Production Possibility Frontier indicates:', ['Full and efficient utilisation of given resources', 'Unattainable production', 'Underutilisation of resources', 'A fall in technology'], 0, 'Points on the frontier represent attainable combinations using the given resources fully and efficiently.'),
        makeQuestion('If four alternatives yield ₹12,000, ₹10,000, ₹8,000 and ₹7,000, and the ₹12,000 option is chosen, the opportunity cost is:', ['₹12,000', '₹10,000', '₹8,000', '₹7,000'], 1, 'The next best alternative after ₹12,000 is ₹10,000, so ₹10,000 is the opportunity cost.'),
      ],
      Hard: [
        makeQuestion('An economy decides whether to allocate more resources to hospitals or to highways. This most directly illustrates:', ['The problem of choice caused by scarce resources', 'Absence of opportunity cost', 'Only a macroeconomic definition', 'Unlimited resources'], 0, 'Scarce resources with alternative uses force the economy to choose between competing uses.'),
        makeQuestion('A factory can produce the same output either with many workers or with more machines. Choosing between the two methods is the problem of:', ['What to produce', 'How to produce', 'For whom to produce', 'What is an economy'], 1, 'The issue is the technique of production, so it is the “how to produce” problem.'),
        makeQuestion('An economy debates whether more output should go toward basic necessities for lower-income households or luxury goods for richer households. This is mainly:', ['What to produce only', 'How to produce only', 'For whom to produce', 'A definition of macroeconomics'], 2, 'The question concerns distribution of output across sections of society, which is “for whom to produce.”'),
        makeQuestion('If the quantity or quality of productive resources increases, the Production Possibility Frontier will generally:', ['Shift outward', 'Shift inward', 'Stay fixed by definition', 'Disappear'], 0, 'More or better resources increase the economy’s productive capacity, allowing a larger set of attainable combinations.'),
        makeQuestion('If technology improves so that the economy can produce more output from the same resources, the Production Possibility Frontier will generally:', ['Shift outward', 'Shift inward', 'Move to the origin', 'Become a demand curve'], 0, 'Improved technology raises productive capacity and therefore expands the attainable production set.'),
        makeQuestion('Moving from one point to another on the same Production Possibility Frontier mainly shows:', ['Reallocation of given resources between the two goods', 'An increase in total resources', 'A fall in all productivity', 'A change from micro to macro analysis'], 0, 'A movement along the same frontier reflects a different allocation of the same resources and technology.'),
        makeQuestion('A point inside the Production Possibility Frontier represents:', ['Underutilisation or inefficient utilisation of resources', 'Maximum attainable output', 'An unattainable combination', 'A guaranteed future output'], 0, 'An interior point is attainable but below the maximum possible output because resources are not fully or efficiently used.'),
        makeQuestion('A point outside the current Production Possibility Frontier is:', ['Attainable with current resources and technology', 'Unattainable with current resources and technology', 'Always inefficient', 'Always a normative judgement'], 1, 'A point outside the frontier exceeds the maximum currently possible production.'),
        makeQuestion('An economy increases cricket-bat output from 3 thousand to 4 thousand while saree output falls from 50 lakh to 30 lakh. The opportunity cost of the additional 1 thousand bats is:', ['10 lakh sarees', '20 lakh sarees', '30 lakh sarees', '50 lakh sarees'], 1, 'Saree output falls by 50 − 30 = 20 lakh, so 20 lakh sarees are sacrificed for the additional bats.'),
        makeQuestion('Why does a Production Possibility Frontier normally slope downward?', ['Because producing more of one good requires sacrificing some of the other', 'Because both goods can always increase together without limit', 'Because resources have no alternative uses', 'Because prices must fall'], 0, 'With fixed resources and technology, shifting resources toward one good generally reduces the amount available for the other.'),
      ],
      Extreme: [
        makeQuestion('Consider the statement: “Unemployment is 7%, so the government should guarantee a job to every worker.” The two parts are best classified as:', ['Positive; normative', 'Normative; positive', 'Both positive', 'Both normative'], 0, 'A measurable unemployment claim is positive, while a recommendation about what the government should do is normative.'),
        makeQuestion('Why can market demand still belong to microeconomics even though it adds the demand of many buyers?', ['Because it concerns one specific commodity market rather than the economy as a whole', 'Because aggregates are never used in macroeconomics', 'Because market demand is always normative', 'Because only firms matter in microeconomics'], 0, 'The level of analysis is decisive: an aggregate within one market can still be microeconomic.'),
        makeQuestion('If a scarce resource had only one possible use, which part of the economic problem would be weakened most directly?', ['The allocation choice among alternative uses', 'The existence of human wants', 'The definition of macroeconomics', 'The possibility of production'], 0, 'Alternative uses create the need to allocate a resource among competing options; with only one use, that allocation choice largely disappears.'),
        makeQuestion('A medicine is supplied free to patients, but producing it uses scarce labour, equipment and materials. The safest conclusion is:', ['It cannot be scarce because its price is zero', 'It can still be scarce because it uses scarce resources and has opportunity cost', 'It is automatically a normative good', 'It lies outside every PPF'], 1, 'Zero price does not eliminate scarcity when production still requires scarce resources that could have alternative uses.'),
        makeQuestion('An economy moves from a point inside its PPF to a point on the same PPF without any new resources or technology. What has most likely happened?', ['Resources are being utilised more fully or efficiently', 'The economy has reduced productive capacity', 'The PPF has shifted outward', 'Opportunity cost has disappeared'], 0, 'Moving from inside to the frontier can occur through fuller or more efficient use of existing resources.'),
        makeQuestion('A production combination currently outside the PPF may become attainable later if:', ['Resources increase or technology improves', 'The economy simply renames the goods', 'All resources become idle', 'The current PPF shifts inward'], 0, 'Greater resources or better technology can expand productive capacity and move the frontier outward.'),
        makeQuestion('A student chooses a course yielding an expected benefit of ₹50,000 over alternatives yielding ₹42,000, ₹35,000 and ₹20,000. The opportunity cost is:', ['₹50,000', '₹42,000', '₹35,000', '₹20,000'], 1, 'The next best alternative to the chosen ₹50,000 option is ₹42,000, so that is the opportunity cost.'),
        makeQuestion('With fixed resources, an economy chooses to produce more defence goods and therefore fewer civilian goods. This simultaneously demonstrates:', ['The “what to produce” problem and opportunity cost', 'Only the “how to produce” problem', 'Only positive economics', 'Absence of scarcity'], 0, 'The economy is choosing the composition of output, and the civilian goods forgone represent the opportunity cost.'),
        makeQuestion('Which statement best distinguishes actual output from potential output on a PPF diagram?', ['An interior point has actual output below potential output', 'Every interior point is unattainable', 'Every point outside the PPF is potential output', 'Potential output is always below actual output'], 0, 'An interior point indicates that the economy is producing less than the maximum possible with its current resources and technology.'),
        makeQuestion('Which sequence best represents the logic behind the central economic problem?', ['Unlimited wants → scarce resources with alternative uses → choice → allocation decision', 'Scarce wants → unlimited resources → no choice → allocation', 'Unlimited resources → alternative uses → no scarcity → central problem', 'High income → no wants → opportunity cost'], 0, 'The economic problem starts with unlimited wants and scarce resources that have alternative uses, forcing choice and allocation.'),
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
