const BASE = 'https://www.smitsircommerce.in';

const pilotTopics = [
  {
    key: 'national-income-gdp',
    englishPath: '/tools/topics/national-income-gdp',
    localizedPath: '/tools/topics/national-income-gdp',
    resources: [
      ['/tools/gdp-deflator-calculator', 'GDP Deflator Calculator'],
      ['/tools/real-gdp-calculator', 'Real GDP Calculator'],
      ['/tools/gdp-to-ndp-calculator', 'GDP → NDP Calculator'],
      ['/tools/gdp-gnp-ndp-nnp-calculator', 'GDP → GNP → NDP → NNP Calculator'],
      ['/tools/nfia-calculator', 'NFIA Calculator'],
      ['/tools/net-indirect-taxes-calculator', 'Net Indirect Taxes Calculator'],
    ],
  },
  {
    key: 'price-elasticity-demand',
    englishPath: '/tools/topics/price-elasticity-demand',
    localizedPath: '/tools/topics/price-elasticity-demand',
    resources: [
      ['/tools/price-elasticity-demand-calculator', 'Price Elasticity of Demand Calculator'],
      ['/cbse/class-11/economics-numericals', 'Class 11 Economics Numericals'],
      ['/cbse/class-11/microeconomics-notes', 'Class 11 Microeconomics Notes'],
    ],
  },
  {
    key: 'income-determination',
    englishPath: '/tools/topics/income-determination',
    localizedPath: '/tools/topics/income-determination',
    resources: [
      ['/tools/mpc-mps-calculator', 'MPC & MPS Calculator'],
      ['/tools/investment-multiplier-calculator', 'Investment Multiplier Calculator'],
      ['/tools/equilibrium-income-calculator', 'Equilibrium Income Calculator'],
      ['/tools/change-in-income-calculator', 'Change in Income Calculator'],
    ],
  },
  {
    key: 'business-studies-case-study-questions',
    englishPath: '/cbse/class-12/business-studies-case-study-questions',
    localizedPath: '/cbse/class-12/business-studies-case-study-questions',
    resources: [
      ['/cbse/class-12/business-studies-case-study-questions', 'Class 12 BST Case Studies'],
      ['/cbse/class-12/business-studies-important-questions', 'BST Important Questions'],
      ['/cbse/class-12/business-studies-mcq', 'BST MCQs'],
      ['/cbse/class-12/business-studies-notes', 'Business Studies Notes'],
    ],
  },
  {
    key: 'gseb-class-12-economics',
    englishPath: '/gseb-class-12-economics.html',
    localizedPath: '/gseb-class-12-economics',
    resources: [
      ['/gseb-class-12-economics.html', 'GSEB Class 12 Economics Resources'],
      ['/gseb-class-12-economics-practice.html', 'GSEB Economics Practice'],
      ['/tools', 'Commerce Calculators'],
      ['/marks-recovery', 'Marks Recovery'],
    ],
  },
];

export const localizedPilotPages = [
  {
    lang: 'hi', languageTag: 'hi-IN', key: 'national-income-gdp',
    title: 'Class 12 National Income Numericals Hindi — GDP, GNP, NDP, NNP',
    description: 'Class 12 Economics National Income numericals को आसान Hindi में समझें: GDP, GNP, NDP, NNP, NFIA, depreciation और factor cost/market price conversion के साथ free calculators.',
    eyebrow: 'कक्षा 12 अर्थशास्त्र • हिंदी सहायता',
    heading: 'National Income Numericals — आसान Hindi में',
    intro: 'GDP, GNP, NDP और NNP में confusion हो रहा है? इस page का उद्देश्य formula रटवाना नहीं, बल्कि हर adjustment का logic समझाना है ताकि numerical में कौन-सी value जोड़नी या घटानी है, यह साफ रहे।',
    points: ['GDP से NDP: depreciation घटाएँ', 'GDP से GNP: NFIA जोड़ें', 'Market Price से Factor Cost: Net Indirect Taxes घटाएँ', 'Nominal से Real GDP: price change का effect हटाएँ'],
    sections: [
      ['सबसे पहले चार core ideas', 'Gross का मतलब depreciation शामिल है, Net का मतलब depreciation हट चुका है। Domestic देश की सीमा के अंदर production है, National residents के production income को दिखाता है। Market Price में indirect taxes और subsidies का effect होता है, जबकि Factor Cost factors of production को मिली income पर focus करता है।'],
      ['Numerical solve करने का तरीका', 'Question में दी गई starting aggregate को circle करें। फिर केवल वही adjustments लिखें जो destination aggregate तक पहुँचने के लिए चाहिए। एक ही adjustment दो बार न करें। Units और signs (+/−) final answer से पहले दोबारा check करें।'],
      ['Calculator का सही उपयोग', 'Calculator answer copy करने के लिए नहीं, अपने working को verify करने के लिए use करें। पहले numerical खुद solve करें, फिर calculator से result check करें और mismatch होने पर adjustment identify करें।'],
    ],
    faqs: [['GDP और NDP में basic difference क्या है?', 'NDP = GDP − depreciation.'], ['GNP में NFIA क्यों जोड़ते हैं?', 'National concept residents की foreign factor income को include करता है और non-residents की domestic factor income को adjust करता है; इसका net effect NFIA है.']],
  },
  {
    lang: 'gu', languageTag: 'gu-IN', key: 'national-income-gdp',
    title: 'Class 12 National Income Numericals Gujarati — GDP, GNP, NDP, NNP',
    description: 'Class 12 Economics National Income numericals ગુજરાતી સમજ સાથે: GDP, GNP, NDP, NNP, NFIA, depreciation અને factor cost/market price conversion માટે free calculators.',
    eyebrow: 'ધોરણ 12 અર્થશાસ્ત્ર • ગુજરાતી સમજ',
    heading: 'National Income Numericals — સરળ ગુજરાતી સમજ',
    intro: 'GDP, GNP, NDP અને NNP વચ્ચે ગૂંચવણ થાય છે? અહીં formula માત્ર યાદ કરવાને બદલે દરેક adjustment શા માટે થાય છે તે સમજાવ્યું છે, જેથી numericalમાં શું ઉમેરવું અને શું ઘટાડવું તે સ્પષ્ટ રહે.',
    points: ['GDP થી NDP: depreciation ઘટાડો', 'GDP થી GNP: NFIA ઉમેરો', 'Market Price થી Factor Cost: Net Indirect Taxes ઘટાડો', 'Nominal થી Real GDP: price change નો effect દૂર કરો'],
    sections: [
      ['ચાર core ideas પહેલા clear કરો', 'Grossમાં depreciation સામેલ હોય છે, Netમાં depreciation દૂર થયેલું હોય છે. Domestic દેશની સીમામાં થયેલું production બતાવે છે, જ્યારે National residents સાથે જોડાયેલી factor income તરફ જાય છે. Market Priceમાં indirect taxes અને subsidiesનો effect હોય છે.'],
      ['Numerical solve કરવાની રીત', 'Questionમાં આપેલ starting aggregate ઓળખો. પછી destination aggregate સુધી પહોંચવા માટે જરૂરી adjustments જ લખો. એક adjustment બે વખત ન કરો. Final answer પહેલાં sign અને units check કરો.'],
      ['Calculator કેવી રીતે ઉપયોગ કરવો', 'Calculatorને answer-copy tool તરીકે નહીં પરંતુ verification tool તરીકે વાપરો. પહેલા numerical જાતે solve કરો, પછી calculatorથી check કરો અને difference હોય તો કયો adjustment ખોટો ગયો તે શોધો.'],
    ],
    faqs: [['GDP અને NDPમાં મુખ્ય ફરક શું?', 'NDP = GDP − depreciation.'], ['GNPમાં NFIA શા માટે ઉમેરાય છે?', 'National concept residentsની foreign factor income અને non-residentsની domestic factor incomeનો net adjustment લે છે; તે NFIA છે.']],
  },
  {
    lang: 'hi', languageTag: 'hi-IN', key: 'price-elasticity-demand',
    title: 'Price Elasticity of Demand Numericals Class 11 Hindi',
    description: 'Class 11 Microeconomics में Price Elasticity of Demand numericals को Hindi में समझें: percentage method, total expenditure method, interpretation और free PED calculator.',
    eyebrow: 'कक्षा 11 Microeconomics • हिंदी सहायता',
    heading: 'Price Elasticity of Demand Numericals — Hindi में',
    intro: 'Elasticity का numerical केवल formula लगाने का सवाल नहीं है। पहले यह समझें कि price बदलने पर quantity demanded कितनी strongly respond करती है, फिर percentage changes और sign convention को सही तरीके से handle करें।',
    points: ['PED = % change in quantity demanded ÷ % change in price', 'Absolute value से elasticity की magnitude समझें', 'Ed > 1 elastic, Ed < 1 inelastic, Ed = 1 unitary', 'Total expenditure method direction-based interpretation देता है'],
    sections: [
      ['सबसे common mistake', 'Students अक्सर percentage change का base गलत लेते हैं या negative sign देखकर conclusion उल्टा कर देते हैं। Demand में price और quantity opposite direction में चलते हैं, इसलिए interpretation में magnitude पर focus करना useful रहता है।'],
      ['Total Expenditure Method', 'Price घटे और total expenditure बढ़े तो demand elastic होती है। Price घटे और total expenditure घटे तो demand inelastic होती है। Total expenditure same रहे तो unitary elasticity का संकेत मिलता है।'],
      ['Practice strategy', 'एक numerical percentage method से solve करें, फिर उसी data को total expenditure perspective से समझने की कोशिश करें। इससे concept और calculation दोनों मजबूत होते हैं।'],
    ],
    faqs: [['PED negative क्यों आता है?', 'Demand law के कारण price और quantity demanded सामान्यतः opposite direction में बदलते हैं.'], ['Exam में minus sign लिखना जरूरी है?', 'अपने board/teacher की presentation convention follow करें; elasticity की degree समझाते समय magnitude स्पष्ट रखें.']],
  },
  {
    lang: 'gu', languageTag: 'gu-IN', key: 'price-elasticity-demand',
    title: 'Price Elasticity of Demand Numericals Class 11 Gujarati',
    description: 'Class 11 Microeconomics Price Elasticity of Demand numericals ગુજરાતી સમજ સાથે: percentage method, total expenditure method, interpretation અને free PED calculator.',
    eyebrow: 'ધોરણ 11 Microeconomics • ગુજરાતી સમજ',
    heading: 'Price Elasticity of Demand Numericals — ગુજરાતી સમજ',
    intro: 'Elasticityનું numerical માત્ર formula મૂકવાનો પ્રશ્ન નથી. Price બદલાય ત્યારે quantity demanded કેટલો response આપે છે તે પહેલા સમજો, પછી percentage change અને sign convention ધ્યાનથી handle કરો.',
    points: ['PED = % change in quantity demanded ÷ % change in price', 'Elasticityની magnitude માટે absolute value ઉપયોગી છે', 'Ed > 1 elastic, Ed < 1 inelastic, Ed = 1 unitary', 'Total expenditure method direction પરથી interpretation કરે છે'],
    sections: [
      ['સૌથી common mistake', 'Percentage change માટે wrong base લેવો અને negative signને degree સાથે mix કરવો સામાન્ય ભૂલ છે. Demandમાં price અને quantity સામાન્ય રીતે opposite directionમાં બદલાય છે, તેથી magnitude સમજવી જરૂરી છે.'],
      ['Total Expenditure Method', 'Price ઘટે અને total expenditure વધે તો demand elastic. Price ઘટે અને total expenditure પણ ઘટે તો demand inelastic. Total expenditure same રહે તો unitary elasticityનો સંકેત મળે છે.'],
      ['Practice strategy', 'એક જ example percentage methodથી solve કરો અને પછી total expenditure methodથી interpret કરો. આ રીતે calculation અને concept બંને સાથે revise થાય છે.'],
    ],
    faqs: [['PED negative કેમ આવે છે?', 'Law of demand મુજબ price અને quantity demanded સામાન્ય રીતે opposite directionમાં બદલાય છે.'], ['Examમાં minus sign જરૂરી છે?', 'તમારા board/teacherની presentation convention follow કરો અને elasticityની degree સ્પષ્ટ લખો.']],
  },
  {
    lang: 'hi', languageTag: 'hi-IN', key: 'income-determination',
    title: 'MPC MPS Multiplier Numericals Class 12 Hindi',
    description: 'Class 12 Macroeconomics में MPC, MPS, investment multiplier और equilibrium income numericals को Hindi में formulas, logic और free calculators के साथ समझें.',
    eyebrow: 'कक्षा 12 Macroeconomics • हिंदी सहायता',
    heading: 'MPC, MPS & Multiplier — Hindi में Numericals',
    intro: 'यह पूरा topic एक simple relationship पर चलता है: income का एक हिस्सा consumption में जाता है और बाकी saving में। इसी से MPC, MPS और multiplier आपस में connect होते हैं।',
    points: ['MPC + MPS = 1', 'Multiplier (k) = 1 / (1 − MPC)', 'Multiplier (k) = 1 / MPS', 'ΔY = k × ΔI'],
    sections: [
      ['MPC और MPS का logic', 'MPC बताता है additional income में से consumption कितना बढ़ा, जबकि MPS बताता है additional income में से saving कितना बढ़ा। इसलिए दोनों का sum 1 होता है।'],
      ['Multiplier intuition', 'Initial investment increase कई rounds में income और consumption पैदा कर सकता है। MPC जितना अधिक होगा, leakages कम होंगे और multiplier सामान्यतः बड़ा होगा।'],
      ['Numerical order', 'पहले MPC/MPS relation identify करें, फिर multiplier निकालें, और अंत में investment change दिया हो तो ΔY calculate करें। बीच के steps लिखने से sign और denominator की mistakes कम होती हैं।'],
    ],
    faqs: [['MPC 0.8 हो तो MPS कितना?', 'MPS = 1 − 0.8 = 0.2.'], ['MPS 0.25 हो तो multiplier?', 'k = 1 / 0.25 = 4.']],
  },
  {
    lang: 'gu', languageTag: 'gu-IN', key: 'income-determination',
    title: 'MPC MPS Multiplier Numericals Class 12 Gujarati',
    description: 'Class 12 Macroeconomics MPC, MPS, investment multiplier અને equilibrium income numericals ગુજરાતી સમજ, formulas અને free calculators સાથે.',
    eyebrow: 'ધોરણ 12 Macroeconomics • ગુજરાતી સમજ',
    heading: 'MPC, MPS & Multiplier — ગુજરાતી Numericals',
    intro: 'આ topicનો મુખ્ય સંબંધ સરળ છે: વધેલી incomeનો એક ભાગ consumptionમાં અને બાકી savingમાં જાય છે. અહીંથી MPC, MPS અને multiplier એકબીજા સાથે જોડાય છે.',
    points: ['MPC + MPS = 1', 'Multiplier (k) = 1 / (1 − MPC)', 'Multiplier (k) = 1 / MPS', 'ΔY = k × ΔI'],
    sections: [
      ['MPC અને MPSનો logic', 'MPC વધેલી incomeમાંથી consumptionમાં થયેલો વધારો બતાવે છે, જ્યારે MPS savingમાં થયેલો વધારો બતાવે છે. તેથી બંનેનો total 1 થાય છે.'],
      ['Multiplier intuition', 'Initial investment increase income અને consumptionના અનેક rounds generate કરી શકે છે. MPC વધારે હોય ત્યારે સામાન્ય રીતે multiplier મોટો રહે છે.'],
      ['Numerical solve order', 'પહેલા MPC/MPS relation identify કરો, પછી multiplier કાઢો અને investment change આપેલ હોય તો અંતે ΔY calculate કરો. Working steps લખવાથી denominatorની ભૂલો ઓછી થાય છે.'],
    ],
    faqs: [['MPC 0.8 હોય તો MPS કેટલું?', 'MPS = 1 − 0.8 = 0.2.'], ['MPS 0.25 હોય તો multiplier કેટલો?', 'k = 1 / 0.25 = 4.']],
  },
  {
    lang: 'hi', languageTag: 'hi-IN', key: 'business-studies-case-study-questions',
    title: 'Class 12 Business Studies Case Study Questions Hindi Explanation',
    description: 'Class 12 Business Studies case study questions को Hindi explanation के साथ solve करना सीखें: concept पहचानना, evidence line चुनना और board-ready answer structure.',
    eyebrow: 'कक्षा 12 Business Studies • हिंदी सहायता',
    heading: 'BST Case Study Questions — Hindi Explanation',
    intro: 'Case study में सबसे बड़ी challenge theory याद होना नहीं, बल्कि paragraph के अंदर सही concept पहचानना है। इस page पर focus है: clue → concept → evidence → answer.',
    points: ['पहले command word पढ़ें: identify/explain/state', 'Paragraph में concept का clue underline करें', 'Exact Business Studies term लिखें', 'Answer में case evidence जोड़ें, सिर्फ definition नहीं'],
    sections: [
      ['5-step solving method', 'Question पहले पढ़ें, फिर case. Relevant clue mark करें. Chapter concept identify करें. Concept का नाम exact लिखें. अंत में case की line को अपने explanation से connect करें।'],
      ['6-mark answer approach', 'यदि question multiple points माँगता है तो हर point को heading + explanation + case linkage के रूप में लिखें। Unrelated theory भरने से answer लंबा दिख सकता है लेकिन precision कम हो सकती है।'],
      ['Practice कैसे करें', 'हर case study के बाद सिर्फ answer check न करें। यह भी लिखें कि कौन-सा शब्द या sentence आपको concept तक ले गया। इससे नए unseen cases solve करना आसान होता है।'],
    ],
    faqs: [['Case study में definition जरूरी है?', 'Question की demand पर depend करता है; concept identify करके case evidence से explain करना अक्सर अधिक useful होता है.'], ['क्या ये official CBSE questions हैं?', 'Site पर original practice caselets को official CBSE paper के रूप में present नहीं किया जाता.']],
  },
  {
    lang: 'gu', languageTag: 'gu-IN', key: 'business-studies-case-study-questions',
    title: 'Class 12 Business Studies Case Study Questions Gujarati Explanation',
    description: 'Class 12 Business Studies case study questions ગુજરાતી સમજ સાથે solve કરો: concept ઓળખવું, evidence line શોધવી અને board-ready answer structure.',
    eyebrow: 'ધોરણ 12 Business Studies • ગુજરાતી સમજ',
    heading: 'BST Case Study Questions — ગુજરાતી સમજ',
    intro: 'Case studyમાં theory યાદ હોવી પૂરતી નથી; paragraphમાંથી સાચો concept ઓળખવો સૌથી મહત્વનો ભાગ છે. અહીં clue → concept → evidence → answer approach પર focus છે.',
    points: ['પહેલા command word વાંચો: identify/explain/state', 'Paragraphમાં conceptનો clue underline કરો', 'Exact Business Studies term લખો', 'Answerમાં case evidence જોડો, માત્ર definition નહીં'],
    sections: [
      ['5-step solving method', 'પહેલા question વાંચો, પછી case. Relevant clue mark કરો. Chapter concept identify કરો. Conceptનું exact નામ લખો અને caseની lineને explanation સાથે connect કરો.'],
      ['6-mark answer approach', 'Multiple points માંગ્યા હોય તો દરેક pointને heading + explanation + case linkage સાથે લખો. Unrelated theory ઉમેરવાથી answer લાંબો થાય છે પરંતુ precision ઘટી શકે છે.'],
      ['Practice કરવાની રીત', 'Answer check કર્યા પછી કયો શબ્દ અથવા sentence concept ઓળખવામાં મદદરૂપ થયો તે પણ note કરો. આ habit unseen case studies માટે useful છે.'],
    ],
    faqs: [['Case studyમાં definition જરૂરી છે?', 'Question શું માંગે છે તેના પર depend કરે છે; concept અને case evidenceને connect કરવું મહત્વનું છે.'], ['શું આ official CBSE questions છે?', 'Original practice caseletsને official CBSE paper તરીકે present કરવામાં આવતા નથી.']],
  },
  {
    lang: 'hi', languageTag: 'hi-IN', key: 'gseb-class-12-economics',
    title: 'GSEB Class 12 Economics Notes & Practice Hindi Support',
    description: 'GSEB Class 12 Economics resources के लिए Hindi support page: chapter resources, practice, Economics tools और marks-recovery pathway एक जगह.',
    eyebrow: 'GSEB कक्षा 12 Economics • हिंदी सहायता',
    heading: 'GSEB Class 12 Economics — Hindi Support Hub',
    intro: 'यह page उन students के लिए है जो GSEB Economics पढ़ते हैं लेकिन concept को Hindi में जल्दी समझना चाहते हैं। Published GSEB resources, practice और useful calculators को एक simple path में जोड़ा गया है।',
    points: ['GSEB chapter resources', 'Practice questions', 'Economics calculators', 'Weak-topic और marks-recovery tools'],
    sections: [
      ['पहले chapter समझें', 'Chapter resource से definitions, relationships और diagrams revise करें। किसी concept में language barrier हो तो key economic terms को English नाम के साथ याद रखें क्योंकि exam material में वही terminology दिख सकती है।'],
      ['फिर practice करें', 'Reading के तुरंत बाद छोटे questions और numericals solve करें। सिर्फ notes दोबारा पढ़ने के बजाय recall और application से पता चलता है कि concept वास्तव में clear है या नहीं।'],
      ['गलतियों को track करें', 'अगर marks बार-बार एक ही type की mistake से कट रहे हों तो Marks Recovery tool में weak chapter और mistake pattern identify करें।'],
    ],
    faqs: [['क्या पूरी GSEB site Hindi में है?', 'अभी यह controlled pilot है; selected high-value support pages localized हैं, जबकि linked source resources में English/Gujarati content हो सकता है.'], ['क्या यह paid है?', 'Listed study resources और tools में कई free resources उपलब्ध हैं; किसी paid feature को paid होने पर clearly label किया जाता है.']],
  },
  {
    lang: 'gu', languageTag: 'gu-IN', key: 'gseb-class-12-economics',
    title: 'GSEB Class 12 Economics Notes & Practice Gujarati',
    description: 'GSEB ધોરણ 12 Economics માટે ગુજરાતી support hub: chapter resources, practice, Economics tools અને marks-recovery pathway એક જગ્યાએ.',
    eyebrow: 'GSEB ધોરણ 12 Economics • ગુજરાતી',
    heading: 'GSEB ધોરણ 12 Economics — ગુજરાતી Study Hub',
    intro: 'GSEBના વિદ્યાર્થીઓ માટે Economics concept, chapter resources, practice અને useful calculators એક જ study pathમાં જોડવામાં આવ્યા છે. હેતુ માત્ર PDF આપવાનો નહીં પરંતુ read → practice → check → improve cycle બનાવવાનો છે.',
    points: ['GSEB chapter resources', 'Practice questions', 'Economics calculators', 'Weak-topic અને marks-recovery tools'],
    sections: [
      ['Chapter પહેલા સમજો', 'Definitions, relationships અને diagrams chapter resourceથી revise કરો. Economic termsના English નામ પણ ઓળખતા રહો જેથી textbook, calculator અને exam terminology વચ્ચે confusion ન થાય.'],
      ['તુરંત practice કરો', 'Reading પછી short questions અને numericals solve કરો. Active recallથી કયો concept clear છે અને ક્યાં revision જોઈએ તે ઝડપથી સમજાય છે.'],
      ['Mistake pattern શોધો', 'એકસરખી ભૂલથી marks કપાતા હોય તો weak chapter અને mistake type note કરો. Marks Recovery pathway revisionને random રાખવાને બદલે targeted બનાવવામાં મદદ કરે છે.'],
    ],
    faqs: [['શું આખી website ગુજરાતી છે?', 'હાલ selected high-value pages માટે controlled multilingual pilot છે; linked source resourcesમાં English content પણ હોઈ શકે છે.'], ['આ resources free છે?', 'ઘણા published notes, practice resources અને calculators free છે; paid feature હોય તો site પર clearly label થાય છે.']],
  },
].map((page) => {
  const topic = pilotTopics.find((item) => item.key === page.key);
  const path = `/${page.lang}${topic.localizedPath}`;
  return { ...topic, ...page, path, url: `${BASE}${path}`, updated: '2026-09-03' };
});

export const localizedPageByPath = Object.fromEntries(localizedPilotPages.map((page) => [page.path, page]));

export const pilotTopicByEnglishPath = Object.fromEntries(pilotTopics.map((topic) => [topic.englishPath, topic]));

export function alternatesForTopic(topic) {
  if (!topic) return [];
  return [
    { hreflang: 'en-IN', href: `${BASE}${topic.englishPath}` },
    { hreflang: 'hi-IN', href: `${BASE}/hi${topic.localizedPath}` },
    { hreflang: 'gu-IN', href: `${BASE}/gu${topic.localizedPath}` },
    { hreflang: 'x-default', href: `${BASE}${topic.englishPath}` },
  ];
}

export const localizedAlternatesByPath = Object.fromEntries([
  ...pilotTopics.map((topic) => [topic.englishPath, alternatesForTopic(topic)]),
  ...localizedPilotPages.map((page) => [page.path, alternatesForTopic(page)]),
]);

export const localizedLanguageByPath = Object.fromEntries(localizedPilotPages.map((page) => [page.path, page.languageTag]));

export function languageLinksForPage(page) {
  return {
    en: page.englishPath,
    hi: `/hi${page.localizedPath}`,
    gu: `/gu${page.localizedPath}`,
  };
}
