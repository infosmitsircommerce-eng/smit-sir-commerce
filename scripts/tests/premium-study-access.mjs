import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import handler from '../../api/premium-study.js';
import { verifiedQuizPacks } from '../../src/data/quizzes.js';
const originalFetch = globalThis.fetch;
const bytes = Buffer.from('%PDF-1.4\naccess-test\n%%EOF');
const payload = { file_base64: bytes.toString('base64'), sha256: createHash('sha256').update(bytes).digest('hex') };
let checked = 0;
async function test({profile,body={gsebChapter:2},status=200,method='POST',token=true,authStatus=200,notes=[payload],notesStatus=200}) {
  const urls=[];
  globalThis.fetch=async(url,options)=>{
    assert.equal(options.headers.Authorization,'Bearer test-token'); urls.push(url);
    if(url.includes('/auth/v1/user'))return new Response(JSON.stringify({id:'test-user'}),{status:authStatus});
    if(url.includes('/profiles?'))return new Response(JSON.stringify([profile]));
    if(url.includes('/premium_gseb_economics_notes?'))return new Response(JSON.stringify(notes),{status:notesStatus});
    throw new Error('Unexpected URL '+url);
  };
  const result={headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.code=s;return this;},json(b){this.body=b;return this;},send(b){this.body=b;return this;}};
  await handler({method,headers:token?{authorization:'Bearer test-token'}:{},body},result);
  assert.equal(result.code,status);
  assert.equal(result.headers['Cache-Control'],'private, no-store');
  if(status===403)assert.equal(urls.length,2,'Unauthorized accounts must never fetch PDF payloads');
  if(status===200 && body.gsebChapter) {assert.equal(result.headers['Content-Type'],'application/pdf');assert.deepEqual(result.body,bytes);}
  if(status===200 && body.packId){assert.equal(result.body.concepts.length,20);assert.equal(result.body.worked.length,20);}
  checked++;
}
try {
  await test({token:false,status:401});
  await test({method:'GET',status:405});
  await test({authStatus:401,status:401});
  await test({profile:{is_premium:false},status:403});
  await test({profile:{is_premium:true,premium_until:'2000-01-01'},status:403});
  await test({profile:{is_premium:true,premium_until:'invalid'},status:403});
  const lifetime={is_premium:true,premium_until:null};
  await test({profile:lifetime});
  await test({profile:{is_premium:true,premium_until:new Date(Date.now()+86400000).toISOString()}});
  await test({profile:{is_admin:true}});
  await test({profile:{role:'admin'}});
  for(const chapter of [1,12,2.5,'2','2&select=*']) await test({profile:lifetime,body:{gsebChapter:chapter},status:404});
  await test({profile:lifetime,notes:[],status:404});
  await test({profile:lifetime,notes:[{...payload,sha256:'0'.repeat(64)}],status:503});
  await test({profile:lifetime,notesStatus:503,status:503});
  await test({profile:lifetime,body:{packId:verifiedQuizPacks.find(p=>p.board==='CBSE'&&p.subject==='Economics').id}});
  console.log('Premium study access checks passed ('+checked+' cases).');
} finally {globalThis.fetch=originalFetch;}
