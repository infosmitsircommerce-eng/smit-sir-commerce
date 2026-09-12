import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { studyAccessItems, filterStudyAccess } from '../src/data/studyAccess.js';
import { gsebEconomicsQuizPacks } from '../src/data/quizGsebEconomics.js';
import { verifiedQuizPacks as publicPacks } from '../src/data/quizPublic.js';
import handler from '../api/premium-quiz.js';
const gseb = filterStudyAccess(studyAccessItems, {kind:'Tests',board:'GSEB',classLevel:12,subject:'Economics'});
assert.equal(gseb.length,11);
assert.equal(new Set(studyAccessItems.map(item=>item.id)).size,studyAccessItems.length);
for (const item of gseb) {
 const params = new URL(item.path,'https://www.smitsircommerce.in').searchParams;
 assert.equal(params.get('pack'),item.pack.id);
 assert.equal(params.get('board'),'GSEB');
 assert.equal(params.get('class'),'12');
}
assert.equal(filterStudyAccess(studyAccessItems, {kind:'Tests',board:'GSEB',classLevel:11,subject:'Economics'}).length,0);
assert.equal(filterStudyAccess(studyAccessItems, {kind:'Tests',board:'GSEB',classLevel:12,subject:'Economics',search:'MONEY inflation'}).length,1);
assert.equal(filterStudyAccess(studyAccessItems, {kind:'Tests',board:'GSEB',classLevel:12,subject:'Economics',search:'no matching topic'}).length,0);
for (const pack of gsebEconomicsQuizPacks) {
 const seen = new Set();
 for(const questions of Object.values(pack.levels)) {
  assert.equal(questions.length,10);
  for (const question of questions) { assert.ok(!seen.has(question.q),`Duplicate across levels: ${pack.id}`);seen.add(question.q);assert.ok(question.options[question.answer]); }
 }
 const published = publicPacks.find(item=>item.id===pack.id);
 assert.equal(published.levelCounts.Hard,10);assert.equal(published.levelCounts.Extreme,10);
 assert.ok(!published.levels.Hard&&!published.levels.Extreme);
}
const originalFetch=globalThis.fetch;
async function request(packId,level,profile,auth=true) {
 let call=0;
 globalThis.fetch=async()=>({ok:true,json:async()=>++call===1?{id:'test-user'}:[profile]});
 const res={statusCode:200,setHeader(){},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}};
 await handler({method:'POST',body:{packId,level},headers:auth?{authorization:'Bearer test'}:{}},res);
 return res;
}
try {
 for (const pack of gsebEconomicsQuizPacks) for(const level of ['Hard','Extreme']) {
  assert.equal((await request(pack.id,level,null,false)).statusCode,401);
  assert.equal((await request(pack.id,level,{is_premium:false})).statusCode,403);
  assert.equal((await request(pack.id,level,{is_premium:true,premium_until:'2000-01-01'})).statusCode,403);
  const response=await request(pack.id,level,{is_premium:true,premium_until:null});
  assert.equal(response.statusCode,200);assert.deepEqual(response.body.questions,pack.levels[level]);
 }
} finally { globalThis.fetch=originalFetch; }
const assets=(await readdir('dist/assets')).filter(name=>name.endsWith('.js'));
const bundle=(await Promise.all(assets.map(name=>readFile('dist/assets/'+name,'utf8')))).join('\n');
for (const pack of gsebEconomicsQuizPacks) for(const level of ['Hard','Extreme']) {
 const marker=pack.levels[level][0].q;
 assert.ok(!bundle.includes(marker),`Premium question leaked into browser JS: ${pack.id}/${level}`);
}
console.log('PASS: finder matching, all 11 chapters, public bundle isolation and 22 Premium test endpoints. Auth/profile responses mocked.');
