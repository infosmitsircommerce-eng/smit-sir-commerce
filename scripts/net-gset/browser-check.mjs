import {createServer} from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
const {chromium}=await import(process.env.SSC_PLAYWRIGHT_MODULE||'playwright');
const packed=process.env.SSC_CHROMIUM_PACKAGE?(await import(process.env.SSC_CHROMIUM_PACKAGE)).default:null;
const root=path.resolve('dist');
const server=createServer(async(req,res)=>{
 let file=path.join(root,new URL(req.url,'http://local').pathname);
 if(!file.startsWith(root)){res.statusCode=403;res.end();return;}
 if(!path.extname(file)&&file!==root){try{await stat(file+'.html');file+='.html';}catch{}}
 try{if((await stat(file)).isDirectory())file=path.join(file,'index.html');}catch{}
 try{const body=await readFile(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.json':'application/json','.css':'text/css','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(body);}catch{res.statusCode=404;res.end('Not found');}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const base=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,...(process.env.SSC_BROWSER_EXECUTABLE?{executablePath:process.env.SSC_BROWSER_EXECUTABLE}:{}),args:packed?packed.args.filter(a=>!a.includes('disable-web-security')&&!a.includes('allow-running-insecure')):['--no-sandbox']});
const errors=[];
try{
 const page=await browser.newPage({viewport:{width:1365,height:1000}});page.on('pageerror',e=>errors.push(e.message));
 const open=async()=>{await page.goto(base+'/net-gset-commerce-tests');await page.locator('[data-test="unit-1-easy"]').waitFor();};
 const start=async id=>{await page.locator(`[data-test="${id}"]`).first().click();await page.locator('#exam:not([hidden]) .question').waitFor();};
 const back=async()=>{await page.locator('#pause').click();await page.locator('#catalog:not([hidden])').waitFor();};
 const finish=async()=>{await page.locator('#submit').click();await page.locator('#confirm-submit').click();await page.locator('#results:not([hidden]) .score').waitFor();};
 await open();assert.equal(await page.locator('#cards article').count(),10);assert.equal(await page.locator('#cards [data-test]').count(),40);console.log('PASS: ten units and forty level choices');
 const data=JSON.parse(await readFile(path.join(root,'net-gset-tests/unit-1-easy.json'),'utf8'));
 await start('unit-1-easy');assert.equal(await page.locator('[data-go]').count(),50);assert.equal(await page.locator('#results').isVisible(),false);
 await page.locator(`input[value="${data.questions[0].answer}"]`).check();assert.equal(await page.locator('input:checked').evaluate(e=>e===document.activeElement),true);
 await page.locator('#mark').click();await page.locator('#next').click();const wrong=(data.questions[1].answer+1)%4;
 await page.locator(`input[value="${wrong}"]`).check();await page.locator('#clear-answer').click();assert.equal(await page.locator('input:checked').count(),0);await page.locator(`input[value="${wrong}"]`).check();
 const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('ssc-net-gset-attempt-v1')));assert.equal(before.answers.filter(a=>a!==null).length,2);assert.equal(before.marked[0],true);
 await page.reload();await page.getByRole('button',{name:'Resume test',exact:true}).click();await page.locator('#exam:not([hidden])').waitFor();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('ssc-net-gset-attempt-v1')));assert.equal(after.deadline,before.deadline);assert.deepEqual(after.answers,before.answers);console.log('PASS: selection, clearing, review marks and reload recovery');
 await page.locator('#submit').click();assert.match(await page.locator('#submit-summary').innerText(),/2 answered, 48 unanswered/);await page.locator('#continue-test').click();await finish();assert.equal(await page.locator('.score').innerText(),'2 / 100');assert.match(await page.locator('#results').innerText(),/1 correct · 1 incorrect · 48 unanswered/);assert.equal(await page.locator('details.review').count(),50);await page.locator('details.review').first().locator('summary').click();assert.match(await page.locator('details.review').first().innerText(),/Correct:/);console.log('PASS: exact scoring and fifty answer explanations');
 await page.reload();await page.getByRole('button',{name:'View saved result',exact:true}).click();await page.locator('.score').waitFor();assert.equal(await page.locator('.score').innerText(),'2 / 100');await page.locator('#retake').click();await page.locator('#exam:not([hidden])').waitFor();assert.equal(await page.locator('.palette .answered').count(),0);
 await page.evaluate(()=>{const k='ssc-net-gset-attempt-v1',s=JSON.parse(localStorage.getItem(k));s.deadline=Date.now()-1000;localStorage.setItem(k,JSON.stringify(s));});await page.reload();await page.getByRole('button',{name:'Resume test',exact:true}).click();await page.locator('.score').waitFor();assert.equal(await page.locator('.score').innerText(),'0 / 100');console.log('PASS: saved results, clean retake and automatic expiry submission');
 await page.locator('#back-results').click();await page.locator('[data-kind="combined"]').click();assert.equal(await page.locator('#cards article').count(),10);await start('combined-1');await finish();assert.equal(await page.locator('tbody tr').count(),10);assert.equal(await page.locator('.score').innerText(),'0 / 100');
 await page.locator('#back-results').click();await page.locator('[data-kind="full"]').click();assert.equal(await page.locator('#cards article').count(),2);await start('full-mock-1');assert.equal(await page.locator('[data-go]').count(),100);assert.match(await page.locator('#clock').innerText(),/^120:|^119:/);await finish();assert.equal(await page.locator('.score').innerText(),'0 / 200');console.log('PASS: combined and full subject mocks');
 await page.locator('#back-results').click();await page.locator('[data-kind="unit"]').click();for(const id of ['unit-1-moderate','unit-2-hard','unit-9-extreme']){await start(id);assert.equal(await page.locator('[data-go]').count(),50);await back();}
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/net-gset-mobile-catalog.png',fullPage:true});await start('unit-10-extreme');await page.locator('summary',{hasText:'Tax law and year'}).click();assert.match(await page.locator('#exam').innerText(),/AY 2025–26/);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.screenshot({path:'/tmp/net-gset-mobile-question.png',fullPage:true});await page.locator('[data-go="49"]').click();assert.match(await page.locator('.pill').innerText(),/Question 50/);console.log('PASS: all difficulty levels and mobile tax/palette navigation');
 await page.goto(base+'/net-gset-commerce');await page.locator('a[href="/net-gset-commerce-tests"]').first().click();await page.locator('[data-test="unit-1-easy"]').waitFor();await page.goto(base+'/quizzes');await page.getByRole('link',{name:/Open NET \/ GSET test series/}).waitFor();await page.goto(base+'/');assert.ok((await page.locator('body').innerText()).length>100);assert.equal(await page.locator('vite-error-overlay').count(),0);console.log('PASS: notes, quiz hub and homepage');
 await open();await page.evaluate(()=>localStorage.clear());await page.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('Storage blocked');};Storage.prototype.setItem=()=>{throw new Error('Storage blocked');};});await page.reload();await start('unit-1-easy');await page.locator('input[value="0"]').check();assert.equal(await page.locator('input:checked').count(),1);await back();await page.route('**/net-gset-tests/unit-2-easy.json',r=>r.fulfill({status:503,body:'Unavailable'}));await page.locator('[data-test="unit-2-easy"]').click();await page.getByText('Unable to load this test.',{exact:true}).waitFor();assert.equal(await page.locator('#catalog').isVisible(),true);console.log('PASS: storage unavailable and fetch failure states');
 assert.deepEqual(errors,[]);console.log('PASS: no uncaught page errors');
}finally{await browser.close();server.close();}
