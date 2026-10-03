import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { netGsetSeoUnits } from '../../src/data/netGsetSeoUnits.js';
import { numericals } from './numericals.mjs';
import { matching, assertionReason } from './exam-formats.mjs';

// These original records are authored, not imported questions or claimed PYQs.
// A learning target is revisited across levels; compound items combine several
// application cases. Answer keys come from explicit truth values, not a guess.
const out = new URL('../../public/net-gset-tests/', import.meta.url);
await mkdir(out, { recursive: true });
const levels = ['easy', 'moderate', 'hard', 'extreme'];
const labels = { easy: 'Easy', moderate: 'Moderate', hard: 'Hard', extreme: 'Extreme' };
const pages = [[240,528],[529,795],[796,968],[969,1222],[1223,1453],[1454,1763],[1764,1972],[1973,2165],[2166,2415],[2416,2579]];
const taxNote = 'Tax scope: statements using the 1961 Act are historical practice for AY 2025–26, with the old regime where a regime matters. Statements explicitly referring to FY 2025–26, the 2025 Act or 1 April 2026 use their stated transition context. Any supplied tax rate is a stated computational assumption, not a current statutory rate.';
const syllabusUrl = 'https://www.gujaratset.ac.in/assets/syllabus/17.pdf';
const sources = [
  { id:'source-book', title:'KVS Madaan — UGC NET Commerce Paper 2 (book supplied by Smit Sir; unit page ranges accompany explanations)' },
  { id:'gset-syllabus', title:'Official GSET Commerce Code 17 syllabus', url:syllabusUrl },
  { id:'ugc-syllabus', title:'Official UGC NET syllabus index — Commerce 08', url:'https://www.ugcnetonline.in/syllabus-new.php' },
  { id:'gset-papers', title:'Official GSET previous-paper archive', url:'https://www.gujaratset.ac.in/en/oldpap' },
  { id:'ugc-papers', title:'Official UGC previous-paper archive', url:'https://www.ugcnetonline.in/previous_question_papers.php' },
  { id:'tax-transition', title:'Income Tax Department — new Act and transition', url:'https://www.incometax.gov.in/iec/foportal/help/all-topics/e-filing-services/objective-and-scope-new-act-faq' },
  { id:'contract-act', title:'India Code — Indian Contract Act, 1872', url:'https://www.indiacode.nic.in/handle/123456789/12845' },
  { id:'companies-act', title:'India Code — Companies Act, 2013', url:'https://www.indiacode.nic.in/indiacode/handle/123456789/2114?view_type=browse' },
  { id:'gst', title:'CBIC — GST framework and sector FAQs', url:'https://cbic-gst.gov.in/sectoral-faq.html' },
  { id:'basel', title:'RBI — Basel III capital regulations (2024 reference)', url:'https://www.rbi.org.in/Scripts/NotificationUser.aspx?Id=12652' },
];
function keyRotate(options, correct, n) {
  const offset = ((n * 3) + Math.floor(n / 4)) % 4;
  return { options: [...options.slice(offset), ...options.slice(0,offset)], answer: (correct - offset + 4) % 4 };
}
function selected(mask, n) {
  const letters = Array.from({length:n}, (_,i)=>String.fromCharCode(65+i)).filter((_,i)=>mask & (1<<i));
  return letters.length ? `${letters.join(', ')} only` : 'None of the statements';
}
function popcount(n) { return n.toString(2).replaceAll('0','').length; }
function compound(cards, indices, unit, level, index) {
  const count = indices.length;
  // Enumerate valid masks rather than making all higher-level questions true.
  const masks = Array.from({length:(1<<count)},(_,i)=>i).filter(m=>level!=='extreme' || (popcount(m)>=2 && popcount(m)<=3));
  const truthMask = masks[(index*7 + unit*3) % masks.length];
  const statements = indices.map((ci,j)=>({letter:String.fromCharCode(65+j), card:cards[ci], correct:!!(truthMask&(1<<j))}));
  let options, correct;
  if(count===2){
    options=['Both A and B are correct','Neither A nor B is correct','A is correct; B is incorrect','A is incorrect; B is correct'];
    correct=({3:0,0:1,1:2,2:3})[truthMask];
  }else{
    const alternatives=count===5?[truthMask^3,truthMask^12,truthMask^16]:[];
    for(let distance=1;distance<=count;distance++){
      for(let m=0;m<(1<<count);m++){
        if(m!==truthMask && popcount(m^truthMask)===distance && !alternatives.includes(m))alternatives.push(m);
      }
    }
    // Five-statement distractors span all five positions, rather than leaving
    // the same two statements identical in every option.
    options=[selected(truthMask,count),...alternatives.slice(0,3).map(m=>selected(m,count))]; correct=0;
  }
  const {options:rotated,answer}=keyRotate(options,correct,index+unit);
  const topics=statements.map(s=>s.card.topic);
  const lead={moderate:'Evaluate the following two application statements.',hard:'Evaluate these three independent business cases. Select the complete set of correct statements.',extreme:'Evaluate all five independent cases, including the stated assumptions. Select the complete set of correct conclusions.'}[level];
  return {
    id:`u${unit}-${level}-${String(index+1).padStart(2,'0')}`, unit, difficulty:labels[level], format:count===2?'two-statements':'multiple-statements',
    topic:topics.join(' / '), topics,
    question:`${lead}\n\n${statements.map(s=>`${s.letter}. ${s.correct?s.card.valid:s.card.invalid}`).join('\n\n')}`,
    options:rotated, answer,
    explanation:statements.map(s=>`${s.letter}: ${s.correct?'Correct':'Incorrect'}. ${s.card.valid}`).join('\n\n'),
    learningTargets:statements.map(s=>s.card.id), sourceIds:unit===10?['gset-syllabus','source-book','tax-transition']:['gset-syllabus','source-book'],
    syllabusUnit:unit, bookPages:pages[unit-1], ...(unit===10?{scopeNote:taxNote}:{})
  };
}
const manifest={version:'2026-10-03.2',title:'NET / GSET Commerce Test Series',questionCount:2000,unitTestCount:40,combinedTestCount:10,fullMockCount:2,levels:labels,sources,
  editorialNote:'Original practice, not official past papers. Difficulty labels describe the task demand and are editorial estimates, not statistically calibrated grades. Learning targets and application cases recur across levels and in mixed mocks.',
  researchNote:'The uploaded Commerce source book, including its 2021–2023 NET papers and historical unit questions, informs the concepts and formats. Official syllabus and paper archive indexes were consulted. A complete item-by-item review of every NET/GSET paper from 2016–2025 has not been verified; no ten-year frequency or exact past-paper claim is made.',
  scoring:{correct:2,incorrect:0,unanswered:0},taxNote,units:[],tests:[]};
const bank=new Map();
for(const u of netGsetSeoUnits){
  const text=await readFile(new URL(`../../content/net-gset/unit-${u.unit}.tsv`,import.meta.url),'utf8');
  const cards=text.trim().split('\n').map((line,i)=>{
    const fields=line.split('\t'); if(fields.length!==4)throw new Error(`Bad Unit ${u.unit} record ${i+1}`);
    const [topic,definition,valid,invalid]=fields;
    return {id:`u${u.unit}-target-${i+1}`,topic,definition,valid,invalid};
  });
  if(cards.length<50)throw new Error(`Unit ${u.unit} has fewer than 50 learning targets`);
  const advancedText=await readFile(new URL(`../../content/net-gset/advanced-${u.unit}.tsv`,import.meta.url),'utf8');
  const advanced=advancedText.trim().split('\n').map((line,i)=>{
    const fields=line.split('\t'); if(fields.length!==3)throw new Error(`Bad Unit ${u.unit} advanced case ${i+1}`);
    const [topic,valid,invalid]=fields;
    return {id:`u${u.unit}-advanced-${i+1}`,topic,valid,invalid};
  });
  if(advanced.length<30)throw new Error(`Unit ${u.unit} has fewer than 30 advanced cases`);
  manifest.units.push({unit:u.unit,title:u.title,slug:u.slug,topicCount:cards.length,bookPages:pages[u.unit-1],notesUrl:`/net-gset-commerce#unit-${u.unit}`});
  for(const [li,level] of levels.entries()){
    const questions=Array.from({length:50},(_,i)=>{
      const base=(i + li*13)%cards.length;
      if(level==='easy'){
        const c=cards[base]; const candidates=[c.topic,cards[(base+1)%cards.length].topic,cards[(base+3)%cards.length].topic,cards[(base+5)%cards.length].topic];
        const {options,answer}=keyRotate(candidates,0,i+u.unit);
        return {id:`u${u.unit}-easy-${String(i+1).padStart(2,'0')}`,unit:u.unit,difficulty:'Easy',format:'concept',topic:c.topic,topics:[c.topic],question:`Which concept is described here?\n\n${c.definition}.`,options,answer,explanation:`${c.topic}: ${c.definition}. ${c.valid}`,learningTargets:[c.id],sourceIds:['gset-syllabus','source-book'],syllabusUnit:u.unit,bookPages:pages[u.unit-1],...(u.unit===10?{scopeNote:taxNote}:{})};
      }
      const pool=level==='moderate'&&i>=25?cards:advanced;
      const offsets=level==='moderate'?[0,1]:level==='hard'?[0,1,3]:[0,1,2,4,7];
      return compound(pool,offsets.map(o=>(i+li*13+o)%pool.length),u.unit,level,i);
    });
    const id=`unit-${u.unit}-${level}`;
    if(level==='moderate'){
      const withReference=q=>({...q,bookPages:pages[u.unit-1],...(u.unit===10?{scopeNote:taxNote}:{})});
      questions.splice(0,10,...Array.from({length:10},(_,i)=>withReference(matching(cards,u.unit,i))));
      questions.splice(10,5,...Array.from({length:5},(_,i)=>withReference(assertionReason(u.unit,i))));
    }
    const additions=numericals(u.unit,level);
    questions.splice(50-additions.length,additions.length,...additions.map(q=>({...q,bookPages:pages[u.unit-1],...(u.unit===10?{scopeNote:taxNote}:{})})));
    const meta={id,kind:'unit',unit:u.unit,name:`Unit ${u.unit} · ${labels[level]}`,description:u.title,difficulty:labels[level],questionCount:50,minutes:level==='easy'?40:level==='moderate'?60:level==='hard'?75:90,file:`${id}.json`};
    manifest.tests.push(meta); bank.set(id,questions);
    await writeFile(new URL(meta.file,out),JSON.stringify({...meta,version:manifest.version,questions},null,2)+'\n');
  }
}
// 10 mixed tests: five questions per unit, 25 Moderate + 25 Hard. The
// selection draws 50 of each unit's 100 Moderate/Hard items without repeating
// an item across these ten mocks. These reuse unit-bank questions for revision.
for(let m=0;m<10;m++){
  const questions=[];
  for(let unit=1;unit<=10;unit++)for(let j=0;j<5;j++){
    const level=(unit+j+m)%2===0?'moderate':'hard';
    const idx=((m*5+j)*7)%50;
    questions.push(bank.get(`unit-${unit}-${level}`)[idx]);
  }
  // Interleave units so a mock feels like a combined paper.
  questions.sort((a,b)=>a.id.split('-').at(-1).localeCompare(b.id.split('-').at(-1))||a.unit-b.unit);
  const id=`combined-${m+1}`;
  const meta={id,kind:'combined',name:`Combined practice ${m+1}`,description:'All 10 units · 25 Moderate + 25 Hard',difficulty:'Moderate / Hard',questionCount:50,minutes:60,file:`${id}.json`};
  manifest.tests.push(meta);await writeFile(new URL(meta.file,out),JSON.stringify({...meta,version:manifest.version,questions},null,2)+'\n');
}
for(let m=0;m<2;m++){
  const questions=[];
  for(let unit=1;unit<=10;unit++)for(let j=0;j<10;j++){
    const level=j%2?'hard':'moderate'; questions.push(bank.get(`unit-${unit}-${level}`)[((m*20+j+10)*7)%50]);
  }
  const id=`full-mock-${m+1}`;
  const meta={id,kind:'full',name:`Full subject mock ${m+1}`,description:'100 questions · 10 per unit · Moderate / Hard',difficulty:'Moderate / Hard',questionCount:100,minutes:120,file:`${id}.json`};
  manifest.tests.push(meta);await writeFile(new URL(meta.file,out),JSON.stringify({...meta,version:manifest.version,questions},null,2)+'\n');
}
await writeFile(new URL('manifest.json',out),JSON.stringify(manifest,null,2)+'\n');
console.log(`Built ${manifest.unitTestCount} unit tests, 10 mixed tests and 2 full subject mocks.`);
