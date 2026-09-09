import assert from 'node:assert/strict';
import handler from '../api/premium-quiz.js';
import { verifiedQuizPacks as publicPacks } from '../src/data/quizPublic.js';
import { premiumUpgrades } from '../src/data/quizPremiumUpgrades.js';
const packId='cbse-12-macro-national-income';
async function request(profile,authenticated=true){
 let call=0;
 globalThis.fetch=async()=>({ok:true,json:async()=>++call===1?{id:'test-user'}:[profile]});
 const res={statusCode:200,setHeader(){},status(code){this.statusCode=code;return this;},json(body){this.body=body;return this;}};
 await handler({method:'POST',body:{packId,level:'Hard'},headers:authenticated?{authorization:'Bearer test'}:{}},res);
 return res;
}
const originalFetch=globalThis.fetch;
try{
 assert.equal((await request(null,false)).statusCode,401);
 assert.equal((await request({is_premium:false})).statusCode,403);
 assert.equal((await request({is_premium:true,premium_until:'2000-01-01'})).statusCode,403);
 assert.equal((await request({is_premium:true,premium_until:'invalid'})).statusCode,403);
 const premium=await request({is_premium:true,premium_until:null});assert.equal(premium.statusCode,200);assert.equal(premium.body.questions.length,10);assert.deepEqual(premium.body.questions[0],premiumUpgrades[packId][0]);
 assert.equal((await request({is_admin:true})).statusCode,200);
 for(const pack of publicPacks){assert.ok(!pack.levels.Hard&&!pack.levels.Extreme);}
 assert.equal(Object.keys(premiumUpgrades).length,31);
 for(const pair of Object.values(premiumUpgrades))for(const q of pair){assert.equal(q.options.length,4);assert.equal(new Set(q.options).size,4);assert.ok(q.options[q.answer]);assert.ok(q.explanation.length>40);}
 console.log('PASS: access states, 31 applied-question pairs, and public catalog isolation. Authentication responses were mocked.');
}finally{globalThis.fetch=originalFetch;}
