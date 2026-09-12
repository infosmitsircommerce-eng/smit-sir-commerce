import assert from 'node:assert/strict';
import { purchasingPower, cleanLabState, inflationCases } from '../../src/data/conceptLab.js';
import { resolveQuizSelection } from '../../src/data/quizNavigation.js';
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-9, `${actual} != ${expected}`);
close(purchasingPower(25, 0).baskets, 8);
close(purchasingPower(25, 0).realChange, -20);
close(purchasingPower(25, 10).realChange, -12);
close(purchasingPower(20, 20).realChange, 0);
close(purchasingPower(5, 20).realChange, 100 * (1.2 / 1.05 - 1));
for (let prices = 0; prices <= 40; prices += 5) {
  close(purchasingPower(prices, prices).realChange, 0);
  for (let income = 0; income < 40; income += 5) {
    assert.ok(purchasingPower(prices, income + 5).baskets > purchasingPower(prices, income).baskets);
  }
}
for (let prices = 0; prices < 40; prices += 5) assert.ok(purchasingPower(prices + 5, 10).baskets < purchasingPower(prices, 10).baskets);
close(purchasingPower(-10, Infinity).baskets, 14);
close(purchasingPower(100, 100).baskets, 10);
assert.equal(new Set(inflationCases.map(c => c.id)).size, 5);
for (const c of inflationCases) {
  assert.ok(c.options[c.answer]?.reason);
  assert.ok(c.follow.options[c.follow.answer]);
  assert.ok(c.exam && c.hindi && c.follow.hindi);
}
const clean = cleanLabState({ prices: 99, income: -30, caseId: 'unknown', answers: { demand: { main: 1, follow: 1 }, cost: { main: 1, follow: 0 }, 'single-price': { main: 500, follow: -1 } }, email: 'private' });
assert.deepEqual(clean.answers.demand, { main: 1, follow: null });
assert.deepEqual(clean.answers.cost, { main: 1, follow: 0 });
assert.deepEqual(clean.answers['single-price'], { main: null, follow: null });
assert.equal(clean.prices, 40);
assert.equal(clean.income, 0);
assert.equal(clean.caseId, 'demand');
assert.equal('email' in clean, false);
assert.equal(cleanLabState(null).caseId, 'demand');
assert.equal(resolveQuizSelection(new URLSearchParams('board=GSEB&class=12&subject=Economics&pack=gseb-12-economics-ch3')).selected.id, 'gseb-12-economics-ch3');
console.log('PASS: purchasing-power arithmetic, monotonicity, five case/follow-up pairs, safe progress restoration and exact Chapter 3 quiz launch.');
