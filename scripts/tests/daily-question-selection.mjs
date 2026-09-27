import assert from 'node:assert/strict';
import { selectDailyQuestions } from '../../src/lib/dailyQuestionSelection.js';
const bank = ['Economics', 'Business Studies', 'Accountancy'].flatMap(subject => Array.from({ length: 12 }, (_, i) => ({ id: `${subject}-${i}`, subject })));
const before = JSON.stringify(bank);
const day = selectDailyQuestions(bank, '2026-09-27');
assert.equal(day.length, 10);
assert.equal(new Set(day.map(q => q.id)).size, 10);
assert.deepEqual(day, selectDailyQuestions(bank, '2026-09-27'));
assert.equal(day.filter(q => q.subject === 'Economics').length, 4);
assert.equal(day.filter(q => q.subject === 'Business Studies').length, 3);
assert.equal(day.filter(q => q.subject === 'Accountancy').length, 3);
assert.notDeepEqual(selectDailyQuestions(bank, '2026-09-12'), selectDailyQuestions(bank, '2026-09-21')); // Same character sum under the old method.
assert.equal(JSON.stringify(bank), before);
assert.equal(new Set(Array.from({ length: 30 }, (_, i) => selectDailyQuestions(bank, `2026-09-${String(i+1).padStart(2,'0')}`)).map(qs => qs.map(q => q.id).sort().join(','))).size, 30);
assert.equal(selectDailyQuestions(bank.slice(0, 3), '2026-09-27').length, 3);
console.log('Daily selection: deterministic, unique, balanced, date-distinct and non-mutating.');
