// Recompute from the published stems rather than trusting generator metadata.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../../public/net-gset-tests/',import.meta.url);
const manifest=JSON.parse(await readFile(new URL('manifest.json',root),'utf8'));
const money=n=>`Rs ${Math.round(n).toLocaleString('en-IN')}`;
const n4=n=>Number(n.toFixed(4));
let checked=0;const families=new Set();
for(const t of manifest.tests.filter(t=>t.kind==='unit')){
 const {questions}=JSON.parse(await readFile(new URL(t.file,root),'utf8'));
 for(const q of questions.filter(q=>q.format==='numerical')){
  const s=q.question;
  const x=[...s.replaceAll(',','').matchAll(/-?\d+(?:\.\d+)?/g)].map(m=>Number(m[0]));
  const m=[...s.matchAll(/Rs\s+(-?[\d,]+)/g)].map(a=>Number(a[1].replaceAll(',','')));
  let expected;
  switch(q.topic){
   case 'Comparative advantage':{
    const [ax,ay,bx,by]=x;assert.ok(ax/ay<bx/by);assert.ok(by/bx<ay/ax);expected='A: wheat; B: cloth';break;
   }
   case 'Trade diversion and tariff preference':{
    const [world,partner,domestic,tariff]=m;assert.ok(world+tariff<domestic&&world<partner&&partner<world+tariff);expected=`Trade diversion; buyer price falls by ${money(world+tariff-partner)}`;break;
   }
   case 'BOP current-account aggregation': expected=String(x[0]-x[1]+x[2]+x[3]+x[4]);break;
   case 'Small-country tariff welfare':{
    const [tariff,d0,d1,s0,s1]=x;expected=`Revenue ${money(tariff*(d1-s1))}; loss ${money(tariff*((d0-d1)+(s1-s0))/2)}`;break;
   }
   case 'Comparative cost exchange gains and fee':{
    const [ax,ay,bx,by,qty,fee]=x,costA=ay/ax,costB=by/bx;assert.ok(costB<costA);const difference=costA-costB;expected=`A gains ${(difference/2*qty).toFixed(4)} X; B gains ${((difference/2-fee)*qty).toFixed(4)} X`;break;
   }
   case 'Current-account financing reconciliation':{const ca=x.slice(0,4).reduce((a,b)=>a+b,0);expected=`Current account ${ca}; reserve sale ${-ca-x[4]}`;break;}
   case 'CVP target-profit quantity': expected=`${Math.ceil((m[2]+m[3])/(m[0]-m[1]))} units`;break;
   case 'After-tax CVP and margin of safety': expected=money((m[2]+m[3]/.75)*m[0]/(m[0]-m[1]));break;
   case 'Material variances reconciliation':{const [sq,sp,aq,ap]=x,p=aq*(sp-ap),u=sp*(sq-aq);expected=`Price ${p}; usage ${u}; total ${sq*sp-aq*ap}`;break;}
   case 'Weighted-average process inventory':{const [start,mb,cb,ma,ca,done,close]=x;const value=close*(mb+ma)/(done+close)+.4*close*(cb+ca)/(done+.4*close);expected=money(value);break;}
   case 'Limiting-factor allocation with demand ceiling':{const [ac,ah,bc,bh,available,bd]=x;assert.ok(bc/bh>ac/ah);const aq=(available-bd*bh)/ah;expected=`B=${bd}; A=${aq}; contribution ${money(bd*bc+aq*ac)}`;break;}
   case 'Adjusted super-profit goodwill': expected=money(3*(m[0]-m[1]-.1*m[2]));break;
   case 'Point elasticity and marginal revenue':{const [a,negativeB,p]=x,b=-negativeB,quantity=a-b*p;expected=`Elasticity ${b*p}/${quantity}; MR ${p-quantity/b}`;break;}
   case 'Monopoly output price and profit':{const [a,negativeB,fc,c]=x,b=-negativeB,quantity=(a-c)/(2*b),price=(a+c)/2;expected=`Q=${quantity}; P=${price}; profit=${((a-c)**2)/(4*b)-fc}`;break;}
   case 'Competitive operation versus shutdown':{const [units,p,avc,fc]=x;assert.ok(p>avc);expected=`Operate; loss ${money(fc-units*(p-avc))}`;break;}
   case 'Third-degree discrimination optimum':{const a1=Number(s.match(/P1=(\d+)/)[1]),a2=Number(s.match(/P2=(\d+)/)[1]);expected=`Q1=${(a1-20)/2}; P1=${(a1+20)/2}; Q2=${(a2-20)/4}; P2=${(a2+20)/2}`;break;}
   case 'Complementary-goods compensation and new optimum':{const income=m[0],initialY=income/14,newY=(income+40)/22;expected=`Required compensation ${n4(initialY*8)}; new X=${n4(newY*2)}, Y=${n4(newY)}`;break;}
   case 'Revenue-maximising versus profit-maximising firm':{const [a,negativeB,c]=x,b=-negativeB;expected=`Revenue Q=${a/(2*b)}; profit Q=${(a-c)/(2*b)}; extra profit=${c*c/(4*b)}`;break;}
   case 'CAPM plus after-tax WACC':{const [rf,market,beta,debt,ew,dw,tax]=x;expected=`${n4(ew/100*(rf+beta*(market-rf))+dw/100*debt*(1-tax/100))}%`;break;}
   case 'NPV with working-capital recovery':{const [outlay,wc,annual,salvage]=m;expected=money(annual*(1/1.1+1/1.1**2)+(salvage+wc)/1.1**2-outlay-wc);break;}
   case 'Combined leverage sensitivity':{const [sales,vc,fc,interest]=m;expected=`${n4((sales-vc)/(sales-vc-fc-interest))}%`;break;}
   case 'Currency option versus forward cost':{const [usd,strike,premium,forward,spot]=x;expected=`Option ${money((Math.min(spot,strike)+premium)*usd)}; forward ${money(forward*usd)}`;break;}
   case 'NPV and profitability-index reconciliation':{const [outlay,flow]=m;let pv=0;for(let year=1;year<=3;year++)pv+=flow/1.1**year;expected=`NPV ${money(pv-outlay)}; PI ${(pv/outlay).toFixed(4)}`;break;}
   case 'Cash-conversion cycle and working-capital release':{const [sales,days,inventory,receivable,payable,costPercent,newInventory]=x;expected=`Cycle ${newInventory+receivable-payable} days; released ${money(sales*costPercent/100/days*(inventory-newInventory))}`;break;}
   case 'Bayesian source identification':{const [priorB,defectB,defectA]=x;expected=`${(100*priorB*defectB/(priorB*defectB+(100-priorB)*defectA)).toFixed(2)}%`;break;}
   case 'Regression prediction and reverse slope':{const [mx,my,sx,sy,r,xValue]=x;expected=`Predicted Y=${(my+r*sy/sx*(xValue-mx)).toFixed(4)}; reverse slope=${(r*sx/sy).toFixed(4)}`;break;}
   case 'Regression coefficients and determination':{const [sx,sy,r]=x;expected=`Forward ${(r*sy/sx).toFixed(4)}; reverse ${(r*sx/sy).toFixed(4)}; R² ${(r*r).toFixed(4)}`;break;}
   case 'Mean inference from raw summary totals':{const [n,sum,sumSq,nullMean,critical]=x,mean=sum/n,variance=(sumSq-sum*sum/n)/(n-1),se=Math.sqrt(variance/n);expected=`t=${((mean-nullMean)/se).toFixed(4)}; interval [${(mean-critical*se).toFixed(4)},${(mean+critical*se).toFixed(4)}]`;break;}
   case 'ANOVA mean squares and F':{const [groups,total,between,within]=x;expected=`F=${((between/(groups-1))/(within/(total-groups))).toFixed(4)}; df=${groups-1},${total-groups}`;break;}
   case 'Two-by-two chi-square association':{const rows=[...s.matchAll(/row \[(\d+),(\d+)\]/g)].map(a=>[Number(a[1]),Number(a[2])]);const [[a,b],[c,d]]=rows,N=a+b+c+d,R=[a+b,c+d],C=[a+c,b+d],obs=[[a,b],[c,d]];let chi=0;for(let r=0;r<2;r++)for(let c=0;c<2;c++){const e=R[r]*C[c]/N;chi+=(obs[r][c]-e)**2/e;}expected=`Chi-square=${chi.toFixed(4)}; df=1`;break;}
   case 'Markup margin and discount pricing': expected=money(m[0]/(.75*.9));break;
   case 'Pricing with unsold output and channel costs':{const [made,cost,sold,discount,commission,profit]=x;expected=money((made*cost*(1+profit/100))/(sold*(1-discount/100)*(1-commission/100)));break;}
   case 'Campaign incremental break-even': expected=`${x[3]+Math.ceil(x[0]/(x[1]-x[2]))} sales`;break;
   case 'New-product contribution with cannibalisation': expected=money(x[0]*x[1]-x[2]*x[3]-x[4]);break;
   case 'Sequential discounts commission and margin': expected=money(x[0]/x.slice(1).map(p=>1-p/100).reduce((a,b)=>a*b,1));break;
   case 'Finite-horizon customer value':{const [acq,contribution,retention,discount]=x,r=retention/100,d=discount/100;expected=money(-acq+contribution*r/(1+d)+contribution*r*r/(1+d)**2);break;}
   case 'Historical let-out property computation': expected=money(.7*(m[0]-m[1])-m[2]);break;
   case 'Historical heads deductions and restricted loss': expected=money(m[0]+.7*(m[1]-m[2])-m[3]+m[4]-m[6]);break;
   case 'Historical brought-forward loss and GTI': expected=money(m[0]+m[2]-m[3]);break;
   case 'Historical total income and prepaid credits': expected=`Income ${money(m[0]-m[1])}; tax ${money(m[2]-m[3]-m[4]-Math.min(m[5],m[6]))}`;break;
   case 'Corporate make-buy after-tax opportunity cost': expected=money(.7*(m[0]+m[1]+m[4]-m[3]));break;
   case 'Transfer pricing resale-price computation': expected=money(.8*m[0]-m[1]);break;
   default:throw new Error(`No independent verifier for ${q.topic}`);
  }
  const actual=q.options[q.answer];
  // Preserve punctuation separating coordinates while ignoring money commas.
  const clean=v=>v.replace(/(?<=\d),(?=\d{3}(?:\D|$))/g,'').replace(/(?<=\d),(?=\d{2},)/g,'');
  const numeric=/[-+]?\d+(?:\.\d+)?/g;
  const a=clean(actual),e=clean(expected),an=[...a.matchAll(numeric)].map(v=>Number(v[0])),en=[...e.matchAll(numeric)].map(v=>Number(v[0]));
  assert.equal(a.replace(numeric,'#'),e.replace(numeric,'#'),`${q.id}: ${actual} vs ${expected}`);
  assert.equal(an.length,en.length,q.id);
  an.forEach((v,i)=>assert.ok(Math.abs(v-en[i])<.0051,`${q.id}: ${actual} vs recomputed ${expected}`));
  checked++;families.add(q.topic);
 }
}
assert.equal(checked,210);assert.equal(families.size,42);
console.log(`PASS: ${checked} numerical keys independently recomputed from their published inputs across ${families.size} problem families.`);
