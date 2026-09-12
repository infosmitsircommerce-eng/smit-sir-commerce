import { gsebEconomicsQuizPacks } from './quizGsebEconomics.js';
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
  ...gsebEconomicsQuizPacks,
];

export function getQuizPacks(board, classLevel, subject) {
  return verifiedQuizPacks.filter((pack) => pack.board === board && pack.classLevel === classLevel && pack.subject === subject);
}
