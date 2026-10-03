const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const LETTERS=['A','B','C','D'];
let manifest,test,state,ticker,kind='unit',loading=false;
const storageKey='ssc-net-gset-attempt-v1';
let saved;
try{saved=JSON.parse(localStorage.getItem(storageKey)||'null');}catch{saved=null;}
const safeSave=()=>{try{localStorage.setItem(storageKey,JSON.stringify({...state,testId:test.id,version:manifest.version}));}catch{/* Tests remain usable without storage. */}};
function renderCatalog(){
 $('#catalog-status').hidden=true;
 const cards=$('#cards');
 if(kind==='unit')cards.innerHTML=manifest.units.map(u=>`<article class="card" id="unit-test-${u.unit}"><span class="unit-no">UNIT ${u.unit}</span><h2>${esc(u.title)}</h2><div class="levels">${manifest.tests.filter(t=>t.kind==='unit'&&t.unit===u.unit).map(t=>`<button class="btn" data-test="${t.id}">${t.difficulty}<small>50 MCQs · ${t.minutes} min</small></button>`).join('')}</div><a class="notes" href="${u.notesUrl}">Read Unit ${u.unit} notes</a></article>`).join('');
 else cards.innerHTML=manifest.tests.filter(t=>t.kind===kind).map(t=>`<article class="card"><span class="unit-no">${kind==='full'?'SUBJECT MOCK':'ALL 10 UNITS'}</span><h2>${esc(t.name)}</h2><p class="muted">${esc(t.description)}</p><button class="btn primary" data-test="${t.id}">Start · ${t.questionCount} questions · ${t.minutes} min</button></article>`).join('');
 if(saved&&manifest.tests.some(t=>t.id===saved.testId)&&saved.version===manifest.version){
  const resume=document.createElement('div');resume.className='notice';resume.innerHTML=`${saved.finished?'Saved result available.':'An unfinished attempt is saved on this device.'} <button class="btn" data-test="${esc(saved.testId)}">${saved.finished?'View saved result':'Resume test'}</button>`;cards.prepend(resume);
 }
}
function validateState(s,questions){
 return s&&s.version===manifest.version&&Array.isArray(s.answers)&&s.answers.length===questions.length&&s.answers.every(a=>a===null||(Number.isInteger(a)&&a>=0&&a<4))&&Array.isArray(s.marked)&&s.marked.length===questions.length&&s.marked.every(v=>typeof v==='boolean')&&Number.isInteger(s.current)&&s.current>=0&&s.current<questions.length&&Number.isFinite(s.deadline)&&Number.isFinite(s.startedAt)&&typeof s.finished==='boolean';
}
async function start(id,fresh=false){
 if(loading)return;
 const meta=manifest.tests.find(t=>t.id===id);if(!meta)return;
 loading=true;$('#catalog-status').hidden=false;$('#catalog-status').textContent='Opening test…';
 try{
  const response=await fetch(`/net-gset-tests/${meta.file}`,{cache:'no-cache'});if(!response.ok)throw new Error('Unable to load this test.');
  const candidate=await response.json();
  if(candidate.version!==manifest.version||candidate.questions.length!==meta.questionCount)throw new Error('The test has been updated. Reload this page and try again.');
  test=candidate;
  state=!fresh&&saved?.testId===id&&validateState(saved,test.questions)?saved:{current:0,answers:Array(test.questions.length).fill(null),marked:Array(test.questions.length).fill(false),startedAt:Date.now(),deadline:Date.now()+test.minutes*60000,finished:false};
  $('#catalog').hidden=true;$('#results').hidden=true;$('#exam').hidden=false;safeSave();
  if(state.finished)renderResults();else if(state.deadline<=Date.now())finish();else{renderQuestion();clearInterval(ticker);ticker=setInterval(updateClock,1000);updateClock();}
  window.scrollTo({top:0,behavior:'instant'});
 }catch(error){$('#catalog-status').textContent=error.message;$('#catalog-status').hidden=false;}finally{loading=false;}
}
function updateClock(){
 if(!state||state.finished)return;
 const seconds=Math.max(0,Math.ceil((state.deadline-Date.now())/1000));
 const clock=$('#clock');if(clock)clock.textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;
 if(seconds===0)finish();
}
function renderQuestion(){
 const q=test.questions[state.current];const count=state.answers.filter(a=>a!==null).length;
 $('#exam').innerHTML=`<div class="exam-head"><div><span class="eyebrow">${esc(test.description)}</span><h1>${esc(test.name)}</h1><span class="muted">${test.questions.length} MCQs · +2 correct · 0 wrong</span></div><div><span class="sr-only">Time remaining</span><span class="clock" id="clock"></span></div></div>${q.scopeNote?`<details class="notice"><summary>Tax law and year used in this test</summary><p>${esc(q.scopeNote)}</p></details>`:''}<div class="exam-grid"><div class="panel"><div class="pill">Question ${state.current+1} of ${test.questions.length} · ${esc(q.difficulty)}</div><p class="topic">${esc(q.topic)}</p><h2 class="sr-only" id="question-label">Question ${state.current+1}</h2><div class="question" id="question-text">${esc(q.question)}</div><fieldset style="border:0;padding:0;margin:0" aria-labelledby="question-label question-text"><legend class="sr-only">Choose one answer</legend><div class="options">${q.options.map((o,i)=>`<label class="option"><input type="radio" name="answer" value="${i}" ${state.answers[state.current]===i?'checked':''}><span><span class="letter">${LETTERS[i]}.</span> ${esc(o)}</span></label>`).join('')}</div></fieldset><div class="controls"><button class="btn" id="previous" ${state.current===0?'disabled':''}>Previous</button><button class="btn" id="clear-answer">Clear answer</button><button class="btn" id="mark" aria-pressed="${state.marked[state.current]}">${state.marked[state.current]?'Remove review mark':'Mark for review'}</button><button class="btn primary" id="next">${state.current===test.questions.length-1?'Review and submit':'Next'}</button></div></div><aside class="panel sidebar"><h2>Question palette</h2><div aria-live="polite">${count} answered · ${test.questions.length-count} unanswered</div><div class="palette">${test.questions.map((_,i)=>`<button data-go="${i}" class="${state.answers[i]!==null?'answered ':''}${state.marked[i]?'marked ':''}${state.current===i?'current':''}" aria-label="Question ${i+1}, ${state.answers[i]!==null?'answered':'unanswered'}${state.marked[i]?', marked for review':''}" ${state.current===i?'aria-current="true"':''}>${i+1}</button>`).join('')}</div><p class="muted" style="font-size:.875rem">Green: answered. Gold border: review. Outline: current.</p><button class="btn primary" id="submit">Review and submit</button><button class="btn" id="pause" style="margin-top:10px">Back to choices</button><p class="muted" style="font-size:.875rem">The clock keeps running if you leave. Progress is saved on this device when browser storage is available.</p></aside></div>`;
 updateClock();
}
function showSubmit(){
 const answered=state.answers.filter(a=>a!==null).length;
 $('#submit-summary').textContent=`${answered} answered, ${test.questions.length-answered} unanswered and ${state.marked.filter(Boolean).length} marked for review. Unanswered questions receive 0 marks.`;
 $('#submit-dialog').showModal();
}
function finish(){
 if(state.finished)return;
 clearInterval(ticker);state.finished=true;state.finishedAt=Date.now();safeSave();saved={...state,testId:test.id,version:manifest.version};
 if($('#submit-dialog').open)$('#submit-dialog').close();renderResults();window.scrollTo({top:0,behavior:'instant'});
}
function renderResults(){
 clearInterval(ticker);$('#exam').hidden=true;$('#results').hidden=false;
 const correct=test.questions.filter((q,i)=>state.answers[i]===q.answer).length,unanswered=state.answers.filter(a=>a===null).length;
 const perUnit=new Map();test.questions.forEach((q,i)=>{const row=perUnit.get(q.unit)||{n:0,c:0};row.n++;if(state.answers[i]===q.answer)row.c++;perUnit.set(q.unit,row);});
 const percent=Math.round(correct/test.questions.length*100);
 $('#results').innerHTML=`<div class="exam-head"><div><span class="eyebrow">Test complete</span><h1>${esc(test.name)}</h1></div><div class="controls"><button class="btn" id="retake">Retake test</button><button class="btn primary" id="back-results">Test choices</button></div></div><div class="results-top"><div class="panel"><div class="score">${correct*2} / ${test.questions.length*2}</div><p>${percent}% accuracy · ${correct} correct · ${test.questions.length-correct-unanswered} incorrect · ${unanswered} unanswered</p><p class="muted">Review the explanations before moving to another level.</p></div><div class="panel"><h2>Unit performance</h2><div class="table-wrap"><table><thead><tr><th>Unit</th><th>Correct</th><th>Notes</th></tr></thead><tbody>${[...perUnit].sort((a,b)=>a[0]-b[0]).map(([u,r])=>`<tr><td>Unit ${u}</td><td>${r.c} / ${r.n}</td><td><a href="/net-gset-commerce#unit-${u}">Revise</a></td></tr>`).join('')}</tbody></table></div></div></div><h2>Answers and explanations</h2>${test.questions.map((q,i)=>{const a=state.answers[i];return `<details class="panel review"><summary><span class="${a===q.answer?'good':'bad'}">${a===q.answer?'Correct':a===null?'Unanswered':'Incorrect'}</span> · Q${i+1} · ${esc(q.topic)}</summary><p class="question">${esc(q.question)}</p><ol type="A">${q.options.map(o=>`<li>${esc(o)}</li>`).join('')}</ol><p><b>Your answer:</b> ${a===null?'Unanswered':LETTERS[a]}. <b>Correct:</b> ${LETTERS[q.answer]} — ${esc(q.options[q.answer])}</p><div class="explanation">${esc(q.explanation)}</div>${q.scopeNote?`<p class="topic">${esc(q.scopeNote)}</p>`:''}<p class="topic">Syllabus: Unit ${q.syllabusUnit}. Source-book reference: PDF pages ${q.bookPages[0]}–${q.bookPages[1]} (unit reference, not an exact quoted question).</p></details>`;}).join('')}`;
}
function back(){clearInterval(ticker);saved={...state,testId:test.id,version:manifest.version};$('#exam').hidden=true;$('#results').hidden=true;$('#catalog').hidden=false;renderCatalog();window.scrollTo({top:0,behavior:'instant'});}
document.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.kind){kind=b.dataset.kind;document.querySelectorAll('[data-kind]').forEach(t=>t.setAttribute('aria-selected',String(t===b)));renderCatalog();return;}
 if(b.dataset.test){start(b.dataset.test);return;}
 if(b.dataset.go!==undefined){state.current=Number(b.dataset.go);safeSave();renderQuestion();return;}
 if(b.id==='previous'){state.current--;safeSave();renderQuestion();}
 if(b.id==='next'){if(state.current===test.questions.length-1)showSubmit();else{state.current++;safeSave();renderQuestion();}}
 if(b.id==='clear-answer'){state.answers[state.current]=null;safeSave();renderQuestion();}
 if(b.id==='mark'){state.marked[state.current]=!state.marked[state.current];safeSave();renderQuestion();}
 if(b.id==='submit')showSubmit();
 if(b.id==='continue-test')$('#submit-dialog').close();
 if(b.id==='confirm-submit')finish();
 if(['pause','back-results'].includes(b.id))back();
 if(b.id==='retake')start(test.id,true);
});
document.addEventListener('change',e=>{if(e.target.matches('input[name="answer"]')){const value=Number(e.target.value);state.answers[state.current]=value;safeSave();renderQuestion();$(`input[name="answer"][value="${value}"]`)?.focus({preventScroll:true});}});
document.addEventListener('visibilitychange',()=>{if(!document.hidden)updateClock();});
try{
 const response=await fetch('/net-gset-tests/manifest.json',{cache:'no-cache'});if(!response.ok)throw new Error('Test choices could not be loaded. Please reload.');manifest=await response.json();
 $('#sources').innerHTML=manifest.sources.map(s=>`<li>${s.url?`<a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.title)}</a>`:esc(s.title)}</li>`).join('');renderCatalog();
 if(location.hash.startsWith('#unit-test-'))document.getElementById(location.hash.slice(1))?.scrollIntoView();
}catch(error){$('#catalog-status').textContent=error.message;}
