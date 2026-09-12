export const conceptLabMeta = {
  path: '/concept-lab',
  title: 'Commerce Concept Lab — Explore Inflation & Purchasing Power',
  description: 'Explore inflation with interactive sliders, five everyday cases, English and Hindi explanations, follow-up questions and exam-answer practice. Free, no login.',
};
export const moneyPresets = [
  { id: 'prices-rise', label: 'Same income, higher prices', prices: 25, income: 0 },
  { id: 'catch-up', label: 'Income catches up', prices: 20, income: 20 },
  { id: 'income-leads', label: 'Income grows faster', prices: 5, income: 20 },
];

// One-period illustrative price-level model, not current CPI data or a forecast.
export function purchasingPower(prices, income) {
  const priceChange = Math.min(40, Math.max(0, Number(prices) || 0));
  const incomeChange = Math.min(40, Math.max(0, Number(income) || 0));
  const basketPrice = 1000 * (1 + priceChange / 100);
  const budget = 10000 * (1 + incomeChange / 100);
  const baskets = budget / basketPrice;
  return { basketPrice, budget, baskets, realChange: (baskets / 10 - 1) * 100 };
}

export const inflationCases = [
  {
    id: 'demand', title: 'The spending surge', tag: 'Demand & production',
    story: 'Households across the economy start spending more. Production cannot expand as quickly, and prices rise across many goods and services. Which cause fits best?',
    options: [
      { label: 'Demand-pull inflation', reason: 'Yes. Spending has grown faster than the available output.' },
      { label: 'Cost-push inflation', reason: 'Look for a rise in production costs. This story instead highlights stronger spending and limited output.' },
      { label: 'Deflation', reason: 'Deflation means a sustained fall in the general price level. Here prices are rising.' },
    ], answer: 0, clue: 'Higher total spending + output that cannot keep up.',
    hindi: 'जब कुल खर्च बढ़ता है, लेकिन उत्पादन उतनी जल्दी नहीं बढ़ पाता, तो कई वस्तुओं की कीमतों पर ऊपर जाने का दबाव आता है। यह demand-pull inflation है।',
    exam: 'Demand-pull inflation occurs when aggregate demand increases faster than the economy can supply goods and services. Excess demand puts upward pressure on the general price level.',
    follow: { question: 'Raw-material and transport costs rise across industries while total demand is unchanged. Which explanation fits?', options: ['Demand-pull inflation', 'Cost-push inflation'], answer: 1, explanation: 'The new clue is rising production costs, so cost-push fits. A rise in spending was the clue in the first case.', hindi: 'इस बार खर्च करने की माँग नहीं, बल्कि उत्पादन और transport का खर्च बढ़ा है। इसलिए cost-push सही है।' },
  },
  {
    id: 'cost', title: 'The fuel shock', tag: 'Costs & supply',
    story: 'Fuel and raw materials become more expensive across industries. Transport and production costs rise, and businesses increase their prices. Demand has not increased. Which cause fits best?',
    options: [
      { label: 'Demand-pull inflation', reason: 'Demand-pull needs stronger aggregate demand relative to output. Demand has not increased in this story.' },
      { label: 'Cost-push inflation', reason: 'Yes. Rising input costs are pushing prices upward across industries.' },
      { label: 'Disinflation', reason: 'Disinflation describes a slowing inflation rate. This story explains the source of upward price pressure.' },
    ], answer: 1, clue: 'Higher input costs across industries.',
    hindi: 'Fuel और raw material महँगे होने से कई industries का production cost बढ़ता है। इससे कीमतें बढ़ने का दबाव आता है। यह cost-push inflation है।',
    exam: 'Cost-push inflation arises when production costs increase and create upward pressure on the general price level. Examples include widespread increases in fuel, raw-material or transport costs.',
    follow: { question: 'Spending rises economy-wide while production capacity is already fully used. What is the clearer cause?', options: ['Demand-pull inflation', 'Cost-push inflation'], answer: 0, explanation: 'Higher demand with limited available output points to demand-pull, even though both causes can coexist in real economies.', hindi: 'कुल माँग बढ़ी है, लेकिन उत्पादन बढ़ाने की क्षमता सीमित है। यहाँ demand-pull का संकेत है।' },
  },
  {
    id: 'single-price', title: 'One expensive mango', tag: 'A common misconception',
    story: 'A poor local harvest makes mangoes more expensive. You have no information about other goods or services. Can this alone establish economy-wide inflation?',
    options: [
      { label: 'Yes, any price rise proves inflation', reason: 'One product can become expensive for its own reasons. Inflation concerns the general price level, not every isolated price change.' },
      { label: 'No, we need broader price evidence', reason: 'Yes. A representative basket or broader price-level measure is needed.' },
    ], answer: 1, clue: 'One product is not the whole price level.',
    hindi: 'सिर्फ आम महँगे होने से पूरे देश में inflation साबित नहीं होता। कई goods और services के general price level का evidence चाहिए।',
    exam: 'Inflation is a sustained rise in the general price level. A price increase in one commodity does not by itself establish inflation; broader price evidence is required.',
    follow: { question: 'A phone shop reduces one model’s price during a sale. Does this alone establish economy-wide deflation?', options: ['Yes', 'No'], answer: 1, explanation: 'A discount on one product does not establish a sustained fall in the general price level.', hindi: 'एक phone पर discount से पूरे economy में लगातार कीमतें गिरना साबित नहीं होता।' },
  },
  {
    id: 'slowing', title: 'Slower does not mean cheaper', tag: 'Inflation vs disinflation',
    story: 'A price index rises by 10% in one year and by 4% in the following year. What happened in the second year?',
    options: [
      { label: 'Prices fell: deflation', reason: 'The second rate is still positive. Prices increased another 4%; they did not fall.' },
      { label: 'Prices rose more slowly: disinflation', reason: 'Yes. The rate of inflation fell, while the price level continued to rise.' },
      { label: 'Prices returned to their starting level', reason: 'A lower positive inflation rate does not undo the earlier increase.' },
    ], answer: 1, clue: 'Lower positive rate → slower price growth.',
    hindi: 'Inflation 10% से 4% होने पर कीमतें अभी भी बढ़ रही हैं, बस पहले से धीमी गति से। इसे disinflation कहते हैं; कीमतों का गिरना deflation है।',
    exam: 'Disinflation is a decline in the rate of inflation. When inflation remains positive, the general price level continues to rise, but more slowly. Deflation is a sustained fall in the general price level.',
    follow: { question: 'A basket costs ₹1,000, then rises by 10%, then by another 4%. What is its final cost?', options: ['₹1,040', '₹1,144', '₹960'], answer: 1, explanation: '₹1,000 × 1.10 = ₹1,100; ₹1,100 × 1.04 = ₹1,144. Each rate applies to that period’s starting price.', hindi: 'पहले ₹1,000 का 10% बढ़कर ₹1,100 हुआ। फिर ₹1,100 का 4% बढ़कर ₹1,144 हुआ।' },
  },
  {
    id: 'real-income', title: 'A raise with a hidden catch', tag: 'Real vs nominal income',
    story: 'In this one-period example, income rises by 10% but the representative basket becomes 25% more expensive. What happens to purchasing power?',
    options: [
      { label: 'It increases because income increased', reason: 'More rupees do not always buy more goods. Here basket prices grew faster than income.' },
      { label: 'It stays unchanged', reason: 'Purchasing power stays unchanged when income and the price level rise by the same percentage.' },
      { label: 'It falls', reason: 'Yes. 1.10 ÷ 1.25 = 0.88, so this example’s purchasing power falls by 12%.' },
    ], answer: 2, clue: 'Compare income growth with price-level growth.',
    hindi: 'Income 10% बढ़ी, लेकिन basket 25% महँगी हुई। 1.10 ÷ 1.25 = 0.88, यानी खरीदने की क्षमता इस example में 12% कम हुई।',
    exam: 'Nominal income is income measured in money. Real income reflects the purchasing power of that income. If the price level rises faster than nominal income, real income falls.',
    follow: { question: 'Income and the price level both rise by 20%. What happens to purchasing power in this model?', options: ['It rises by 20%', 'It stays unchanged', 'It falls by 20%'], answer: 1, explanation: '1.20 ÷ 1.20 = 1. Income buys the same quantity as before.', hindi: '1.20 ÷ 1.20 = 1। Income और कीमतें बराबर प्रतिशत बढ़ीं, इसलिए खरीदने की क्षमता वही रही।' },
  },
];

export const LAB_STORAGE_KEY = 'ssc-concept-lab-v1';
export function cleanLabState(value) {
  const state = value && typeof value === 'object' ? value : {};
  const clamp = n => Number.isFinite(n) ? Math.round(Math.min(40, Math.max(0, n)) / 5) * 5 : 0;
  const answers = {};
  for (const item of inflationCases) {
    const saved = state.answers?.[item.id];
    if (saved && typeof saved === 'object') {
      answers[item.id] = {
        main: Number.isInteger(saved.main) && saved.main >= 0 && saved.main < item.options.length ? saved.main : null,
        follow: Number.isInteger(saved.follow) && saved.follow >= 0 && saved.follow < item.follow.options.length && saved.main === item.answer ? saved.follow : null,
      };
    }
  }
  return { prices: clamp(state.prices), income: clamp(state.income), caseId: inflationCases.some(c => c.id === state.caseId) ? state.caseId : 'demand', answers };
}
