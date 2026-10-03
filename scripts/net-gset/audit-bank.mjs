import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../../public/net-gset-tests/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
const sourceIds=new Set(manifest.sources.map(s=>s.id));
const uniqueStems=new Set(),ids=new Set(),counts={},all=new Map(),mixedIds=new Set();
let numericalCount=0;
for(const t of manifest.tests){
 const data=JSON.parse(await readFile(new URL(t.file,root),'utf8'));
 assert.equal(data.questions.length,t.questionCount,t.id);
 assert.equal(data.version,manifest.version);
 const local=new Set();
 for(const q of data.questions){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options).size,4,`Duplicate options: ${q.id}`);
  assert.ok(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<4,q.id);
  assert.ok(q.explanation.length>=40,q.id);
  assert.ok(q.unit>=1&&q.unit<=10,q.id);
  assert.equal(q.syllabusUnit,q.unit);
  assert.ok(q.sourceIds.every(id=>sourceIds.has(id)),`Unknown source: ${q.id}`);
  assert.ok(!local.has(q.id),`Repeated item in ${t.id}`);local.add(q.id);
  if(t.kind==='unit'){
   assert.equal(q.unit,t.unit);assert.equal(q.difficulty,t.difficulty);
   assert.ok(!uniqueStems.has(q.question),`Duplicate stem: ${q.id}`);uniqueStems.add(q.question);
   assert.ok(!ids.has(q.id),`Duplicate ID: ${q.id}`);ids.add(q.id);all.set(q.id,q);
   counts[`${q.unit}-${q.difficulty}`]=(counts[`${q.unit}-${q.difficulty}`]||0)+1;
   if(q.format==='numerical'){assert.equal(q.options[q.answer],q.calculation.expected);numericalCount++;}
  }else{
   assert.ok(['Moderate','Hard'].includes(q.difficulty),`Wrong mock difficulty: ${q.id}`);
   assert.deepEqual(q,all.get(q.id),`Mock differs from source: ${q.id}`);
   if(t.kind==='combined'){assert.ok(!mixedIds.has(q.id),`Repeated mixed item: ${q.id}`);mixedIds.add(q.id);}
  }
  if(q.unit===10)assert.ok(q.scopeNote,`Missing tax scope: ${q.id}`);
 }
 if(t.kind!=='unit'){
  for(let unit=1;unit<=10;unit++)assert.equal(data.questions.filter(q=>q.unit===unit).length,t.kind==='full'?10:5,t.id);
  assert.equal(data.questions.filter(q=>q.difficulty==='Moderate').length,data.questions.length/2,t.id);
 }
}
assert.equal(ids.size,2000);
assert.equal(Object.keys(counts).length,40);
for(const n of Object.values(counts))assert.equal(n,50);
const report={version:manifest.version,unitTests:40,uniqueUnitQuestionIds:ids.size,uniqueUnitStems:uniqueStems.size,numericalQuestions:numericalCount,combinedTests:10,fullSubjectMocks:2,counts,
 scope:'Structural and answer-index checks. The separate verify-numericals script recalculates all 210 numerical keys from published inputs across 42 problem families. These checks do not constitute independent subject-expert review or empirical difficulty calibration.',
 limitations:['Shared case records recur across levels; unique composite stems are not 2,000 independent source cases.','Mixed mocks deliberately reuse unit questions.','The complete 2016–2025 NET/GSET paper set has not been item-by-item verified.']};
await writeFile(new URL('../../content/net-gset/validation.json',import.meta.url),JSON.stringify(report,null,2)+'\n');
console.log(`PASS: ${ids.size} unique unit MCQ stems; 40 × 50; ${numericalCount} numericals; all mock counts and keys valid.`);
