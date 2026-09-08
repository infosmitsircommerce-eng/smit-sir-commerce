import { microQuizPacks } from './quizMicro.js';
import { macroQuizPacks } from './quizMacro.js';
import { iedQuizPacks } from './quizIED.js';

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
          { id: 'cbse-12-economics', name: 'Economics', status: 'verified' },
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
  ...microQuizPacks,
  ...macroQuizPacks,
  ...iedQuizPacks,
  {
    id: 'cbse-12-business-studies-ch1',
    board: 'CBSE',
    classLevel: 12,
    subject: 'Business Studies',
    title: 'Nature and Significance of Management — Board Mastery',
    chapter: 'Chapter 1',
    sourceLabel: 'VK Global Business Studies Class XII — Chapter 1: Nature and Significance of Management; aligned to CBSE 2026–27 Unit 1',
    sourceStatus: 'Reference-book + syllabus verified',
    levels: {
      Easy: [
        makeQuestion('Management is a process of getting things done with the aim of achieving goals:', ['Effectively and efficiently', 'Only quickly', 'Only at minimum cost', 'Without planning'], 0, 'The chapter defines management as getting things done to achieve goals effectively and efficiently.'),
        makeQuestion('Completing the given task or achieving the goal on time is called:', ['Efficiency', 'Effectiveness', 'Coordination', 'Staffing'], 1, 'Effectiveness is concerned with doing the right task and achieving the intended result on time.'),
        makeQuestion('Completing a task with minimum cost and optimum use of resources is called:', ['Efficiency', 'Effectiveness', 'Planning', 'Directing'], 0, 'Efficiency focuses on doing the task in the right way with minimum cost and optimum utilisation of resources.'),
        makeQuestion('Management is required in business as well as non-business organisations. This shows that management is:', ['Pervasive', 'Intangible', 'Temporary', 'Restricted'], 0, 'Pervasive means management is required in all types of organisations, departments and levels.'),
        makeQuestion('Management of work, people and operations makes management:', ['Multidimensional', 'Static', 'Individual', 'Professionally restricted'], 0, 'The source identifies work, people and operations as the three dimensions of management.'),
        makeQuestion('Which is an organisational objective of management?', ['Survival', 'Employee recognition', 'Safe working conditions', 'Community health programme'], 0, 'Survival, profit and growth are the three organisational objectives listed in the chapter.'),
        makeQuestion('Providing quality products at reasonable prices is mainly a:', ['Social objective', 'Personal objective', 'Organisational objective', 'Staffing function'], 0, 'The source includes quality products at reasonable prices among social objectives.'),
        makeQuestion('Training and promotion of employees are mainly related to:', ['Personal objectives', 'Social objectives', 'Only survival', 'Only profit'], 0, 'Training, promotion and personal development are listed under personal or individual objectives.'),
        makeQuestion('Which designation belongs to top-level management?', ['Chief Executive Officer', 'Sales Manager', 'Foreman', 'Supervisor'], 0, 'The source places the CEO among top-level managers.'),
        makeQuestion('The process of synchronising the activities of different departments is called:', ['Coordination', 'Recruitment', 'Controlling', 'Planning'], 0, 'The chapter defines coordination as synchronising and integrating the activities of different departments.'),
      ],
      Moderate: [
        makeQuestion('Planning, organising, staffing, directing and controlling are performed repeatedly. This shows management is:', ['A continuous process', 'A one-time activity', 'A restricted profession', 'Only a science'], 0, 'Management is continuous because its functions are performed on an ongoing basis.'),
        makeQuestion('A company changes its objectives and methods when technology and competition change. This shows management is:', ['Dynamic', 'Intangible only', 'Static', 'Individual'], 0, 'Management is dynamic because it adapts organisational goals and activities to changes in the environment.'),
        makeQuestion('Management cannot be physically seen, but its presence can be felt through orderliness and coordination. This means management is:', ['Intangible', 'Pervasive', 'A profession', 'A physical resource'], 0, 'The source describes management as intangible because it is felt through results rather than seen directly.'),
        makeQuestion('Reducing cost and improving productivity with minimum wastage shows that management:', ['Increases efficiency', 'Eliminates planning', 'Removes all objectives', 'Reduces coordination'], 0, 'One importance of management is increasing efficiency through lower cost and better productivity.'),
        makeQuestion('Why is management described as an inexact or social science in the reference book?', ['Human behaviour cannot be predicted with the same exactness as natural science', 'Management has no organised knowledge', 'Management has no principles', 'Managers never use observation'], 0, 'Management has systematic knowledge and observed principles, but human behaviour makes universal exactness difficult.'),
        makeQuestion('Which feature most strongly supports management as an art?', ['Personalised application of knowledge', 'Compulsory legal licence', 'Universal validity of every principle', 'Fixed entry examination'], 0, 'Art requires personal skill, creativity and application of theoretical knowledge.'),
        makeQuestion('Which feature of a full profession is NOT compulsory for becoming a manager?', ['Restricted entry through a compulsory qualification', 'Use of knowledge', 'Working toward objectives', 'Decision-making'], 0, 'The source notes that there is no legal restriction requiring a particular degree or licence before becoming a manager.'),
        makeQuestion('Middle-level managers primarily act as a link between:', ['Top and supervisory levels', 'Customers and competitors only', 'Shareholders and government only', 'Workers and suppliers only'], 0, 'Middle management interprets top-level policies and connects them with lower-level execution.'),
        makeQuestion('Deciding in advance what to do, how to do, when to do and who will do it is:', ['Planning', 'Staffing', 'Directing', 'Controlling'], 0, 'Planning is the first function and deals with deciding future action in advance.'),
        makeQuestion('Comparing actual performance with planned performance and taking corrective action is:', ['Controlling', 'Organising', 'Staffing', 'Coordination only'], 0, 'Controlling measures actual performance against plans, identifies deviations and initiates correction.'),
      ],
      Hard: [
        makeQuestion('A manager achieves the monthly production target but uses substantially more money and material than planned. The manager is:', ['Effective but inefficient', 'Efficient but ineffective', 'Both effective and efficient', 'Neither effective nor inefficient'], 0, 'The target is achieved, so the manager is effective; excessive resource use means efficiency is lacking.'),
        makeQuestion('A worker keeps cost below the standard but produces only 90 units against a target of 100. The worker is:', ['Efficient but ineffective', 'Effective but inefficient', 'Both effective and efficient', 'Neither efficient nor effective'], 0, 'Lower cost indicates efficiency, but failure to achieve the target means the worker is not effective.'),
        makeQuestion('A company adopts eco-friendly production methods and offers employment opportunities to weaker sections of society. These actions primarily pursue:', ['Social objectives', 'Personal objectives', 'Only profit objectives', 'Only growth objectives'], 0, 'Environmental protection and employment opportunities for weaker sections are listed as social objectives.'),
        makeQuestion('A company sends employees for advanced training and creates promotion opportunities. Which objective is most directly being pursued?', ['Personal objective', 'Social objective', 'Only survival', 'Only market leadership'], 0, 'Training, development and promotion are personal or individual objectives of management.'),
        makeQuestion('A manager analyses the business environment, frames organisation-wide policies and deals with government officials. This manager is most likely at:', ['Top level', 'Middle level', 'Supervisory level', 'Worker level'], 0, 'The source assigns environmental analysis, policy framing and liaison with the outside world to top-level management.'),
        makeQuestion('A department head interprets top-management policies, arranges departmental resources and ensures implementation. This is mainly the role of:', ['Middle-level management', 'Top-level management only', 'Supervisory management only', 'Non-managerial staff'], 0, 'Middle managers translate top-level plans into departmental action and coordinate implementation.'),
        makeQuestion('Ensuring worker safety, maintaining quality standards and minimising material wastage are primarily responsibilities of:', ['Supervisory or lower-level management', 'Top-level management', 'Board of Directors only', 'External consultants'], 0, 'The source places worker conditions, safety, quality and minimising wastage at the supervisory level.'),
        makeQuestion('A manager groups activities into departments, assigns duties and establishes authority-responsibility relationships. Which function is being performed?', ['Organising', 'Planning', 'Staffing', 'Directing'], 0, 'Organising creates the structure needed to execute plans by grouping work and allocating authority and responsibility.'),
        makeQuestion('A company recruits, selects, trains and appraises employees. Which management function is mainly involved?', ['Staffing', 'Planning', 'Controlling', 'Coordination only'], 0, 'Staffing includes recruitment, selection, training, remuneration, development and performance-related employee activities.'),
        makeQuestion('A manager motivates employees, supervises their work and communicates instructions. Which function is being performed?', ['Directing', 'Organising', 'Planning', 'Controlling'], 0, 'Directing includes supervision, motivation, communication and leadership.'),
      ],
      Extreme: [
        makeQuestion('Production blames marketing, marketing blames production, and finance blames both because departments are pursuing their own priorities. Which management concept is most clearly missing?', ['Coordination', 'Staffing', 'Planning only', 'Personal objectives'], 0, 'The chapter uses this type of departmental conflict to show the absence of coordination and integration.'),
        makeQuestion('As an organisation grows from 20 employees to 2,000 employees, why does the need for coordination generally increase?', ['More people bring more individual goals and interdependent efforts that must be integrated', 'Large organisations no longer need common goals', 'Coordination is needed only at lower levels', 'Growth automatically removes conflicts'], 0, 'Growth in size increases the number of people and objectives that must be synchronised toward the common organisational goal.'),
        makeQuestion('Marketing, finance and production each pursue departmental priorities, but their activities depend on one another. Which reason for coordination is highlighted?', ['Functional differentiation', 'Restricted entry', 'Universal validity', 'Personalised application'], 0, 'Functional differentiation creates separate departments whose interdependent activities need to be coordinated.'),
        makeQuestion('Several experts work in the same organisation and each believes their own specialist approach is best. Which need for coordination is most directly highlighted?', ['Specialisation', 'Survival objective', 'Pervasiveness of management', 'Planning as first function'], 0, 'Specialisation can create narrow expert viewpoints, so coordination is needed to align specialists toward a common direction.'),
        makeQuestion('Which statement best explains why management is considered both science and art?', ['It has an organised body of knowledge and also requires personal skill, practice and creativity in application', 'It is an exact natural science with compulsory licensing', 'It is only based on intuition and has no theory', 'Its principles are universally identical in every situation'], 0, 'The source combines systematic knowledge with personalised, creative application to explain management as both science and art.'),
        makeQuestion('Which is the strongest reason management is not treated as a full-fledged profession in the reference book?', ['Entry and professional membership are not legally compulsory for all managers', 'Management has no body of knowledge', 'Managers never follow ethical behaviour', 'Management has no service element at all'], 0, 'Unlike established professions, management does not legally require a specific qualification or compulsory association membership for entry.'),
        makeQuestion('A company introduces a new technology, retrains employees to use it and reduces waste through better processes. Which combination is best represented?', ['Dynamic management, personal development and higher efficiency', 'Only organisational survival', 'Only staffing with no other concept', 'Static management and lower efficiency'], 0, 'Adapting to technology is dynamic management, training supports personal objectives, and waste reduction improves efficiency.'),
        makeQuestion('Why is coordination called the essence of management?', ['It binds and synchronises all management functions and is required at every level', 'It replaces planning and controlling', 'It is performed only after all other functions are complete', 'It is the responsibility of top management only'], 0, 'The chapter states that coordination integrates the five functions and is required at top, middle and lower levels.'),
        makeQuestion('An organisation appears orderly, departments cooperate smoothly and work proceeds without chaos, even though “management” itself cannot be physically seen. Which feature is being inferred?', ['Management is intangible', 'Management is a full profession', 'Management is restricted entry', 'Management is a one-time process'], 0, 'Management is intangible: its presence is recognised through orderliness, coordination and results rather than physical visibility.'),
        makeQuestion('A company earns adequate profit and grows rapidly but ignores employee development and social responsibilities. Which conclusion best fits the chapter?', ['Organisational objectives are being pursued, but personal and social objectives are being neglected', 'All management objectives are fully achieved', 'Only personal objectives are achieved', 'Only social objectives are achieved'], 0, 'Profit and growth are organisational objectives, while employee development and social responsibility belong to personal and social objectives respectively.'),
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
