// Deterministic, original application numericals. Formula and all necessary
// assumptions are retained in each explanation for content review.
import { extraNumerical } from './numerical-variety.mjs';
function q(unit,level,i,topic,question,value,distractors,explanation){
  const values=[value,...distractors];
  if(new Set(values.map(String)).size!==4)throw new Error(`Numerical distractor collision: ${topic}`);
  const rotation=(i+unit)%4;
  return {id:`u${unit}-${level}-n${i+1}`,unit,difficulty:level==='hard'?'Hard':'Extreme',format:'numerical',topic,topics:[topic],question,
    options:[...values.slice(rotation),...values.slice(0,rotation)].map(String),answer:(4-rotation)%4,
    explanation,learningTargets:[`u${unit}-${topic}`],syllabusUnit:unit,sourceIds:['gset-syllabus','source-book'],calculation:{expected:String(value)},};
}
const money=n=>`Rs ${Math.round(n).toLocaleString('en-IN')}`;
const pct=n=>`${Number(n.toFixed(4))}%`;
export function numericals(unit,level){
 if(!['hard','extreme'].includes(level))return [];
 const count=level==='hard'?10:20;
 if(![1,2,3,4,5,8,10].includes(unit))return [];
 return Array.from({length:count},(_,i)=>{
  const k=Math.floor(i/5)+1, v=i%5+1;
  const varied=extraNumerical(unit,level,i,q);
  if(varied)return varied;
  if(unit===1){
   const aW=2*(i+1),aC=6*(i+1),bW=3*(i+1),bC=6*(i+1);
   if(level==='hard')return q(unit,level,i,'Comparative advantage',`In a labour-only two-country model, A requires ${aW} hours per unit of wheat and ${aC} hours per unit of cloth. B requires ${bW} and ${bC} hours respectively. Which specialisation follows comparative advantage?`,'A: wheat; B: cloth',['A: cloth; B: wheat','A: both; B: neither','Neither country can gain from trade'],`A's opportunity cost of wheat is 1/3 cloth; B's is 1/2 cloth. A has comparative advantage in wheat, B in cloth. Equal absolute cloth productivity does not eliminate comparative advantage.`);
   const world=100+v*10,domestic=world+60+k*10,partner=world+20,tariff=50+k*10;
   const old=Math.min(domestic,world+tariff),now=partner, delta=old-now;
   return q(unit,level,i,'Trade diversion and tariff preference',`A small country can buy one unit from a non-member at ${money(world)}, a union partner at ${money(partner)}, or produce it domestically at ${money(domestic)}. Before a customs union, a specific tariff of ${money(tariff)} applies to both imports. After joining, only partner imports are duty-free; the external tariff is unchanged. Ignore transport and other costs. Which conclusion is correct?`,`Trade diversion; buyer price falls by ${money(delta)}`,[`Trade creation; buyer price falls by ${money(delta)}`,`Trade diversion; buyer price rises by ${money(delta)}`,'No trade change; buyer price stays unchanged'],`Before the union, non-member landed price is ${money(world+tariff)}, partner landed price ${money(partner+tariff)}, domestic cost ${money(domestic)}. The non-member is selected. Afterward the partner price ${money(partner)} is lowest. Switching from lower resource-cost outsider to higher resource-cost partner is diversion, even though the buyer price falls by ${money(delta)}.`);
  }
  if(unit===2){
   const sp=100+v*20,vc=sp*0.6,fc=40000+k*10000,target=20000+v*4000,con=sp-vc;
   if(level==='hard'){
    const units=Math.ceil((fc+target)/con);
    return q(unit,level,i,'CVP target-profit quantity',`Selling price is ${money(sp)} per unit, variable cost ${money(vc)}, and fixed cost ${money(fc)}. What minimum whole-unit sales achieve operating profit of at least ${money(target)}? Assume one product and linear costs.`,`${units} units`,[`${Math.ceil(fc/con)} units`,`${units+100} units`,`${Math.ceil((fc+target)/sp)} units`],`Contribution per unit = ${money(con)}. Required quantity = (fixed cost + target profit)/contribution = (${fc}+${target})/${con}. Round up to ${units} units.`);
   }
   const sales=600000+v*60000, variable=sales*0.6, fixed=100000+k*20000, taxes=0.25,desired=90000+v*6000;
   const req=(fixed+desired/(1-taxes))/0.4;
   return q(unit,level,i,'After-tax CVP and margin of safety',`A single-product firm has sales ${money(sales)} and variable cost ${money(variable)} at its current mix. Fixed cost is ${money(fixed)}. The supplied profit-tax rate is 25%, with full tax adjustment available. Price and unit variable cost remain constant. What sales are required for after-tax profit of ${money(desired)}?`,money(req),[money((fixed+desired)/0.4),money(req+100000),money(req*0.4)],`P/V ratio = (sales-variable cost)/sales = 40%. Required pretax profit = ${desired}/0.75 = ${money(desired/0.75)}. Required sales = [${fixed}+${desired/0.75}]/0.4 = ${money(req)}. Current sales establish the contribution ratio; they are not the target-sales answer.`);
  }
  if(unit===3){
   if(level==='hard'){
    const a=120+v*20,b=2+k,p=20+v,qv=a-b*p,elastic=b*p/qv;
    return q(unit,level,i,'Point elasticity and marginal revenue',`For demand Q=${a}-${b}P, evaluate at P=${p}. What are absolute point elasticity and marginal revenue? Use exact fractions where shown.`,`Elasticity ${b*p}/${qv}; MR ${p-qv/b}`,[`Elasticity ${qv}/${b*p}; MR ${p-qv/b}`,`Elasticity ${b*p}/${qv}; MR ${p+qv/b}`,`Elasticity ${qv}/${b*p}; MR ${p+qv/b}`],`Q=${qv}. Absolute elasticity=bP/Q=${b*p}/${qv}. Inverse demand gives MR=P-Q/b=${p}-${qv}/${b}=${p-qv/b}. Equivalently MR=P(1-1/|e|).`);
   }
   const a=140+v*20,b=2+k,c=20+v*2,quantity=(a-c)/(2*b),price=a-b*quantity,fixed=100+k*20,profit=(price-c)*quantity-fixed;
   return q(unit,level,i,'Monopoly output price and profit',`A monopolist faces inverse demand P=${a}-${b}Q and total cost TC=${fixed}+${c}Q. Output is continuous and there are no other constraints. Which output and price maximise profit, and what is profit?`,`Q=${quantity}; P=${price}; profit=${profit}`,[`Q=${(a-c)/b}; P=${c}; profit=${-fixed}`,`Q=${quantity}; P=${price}; profit=${profit+fixed}`,`Q=${quantity}; P=${c}; profit=${-fixed}`],`TR=${a}Q-${b}Q², so MR=${a}-${2*b}Q. MC=${c}. MR=MC gives Q=${quantity}, and P=${price}. Profit=(P-${c})Q-${fixed}=${profit}. The second derivative of profit is -${2*b}<0.`);
  }
  if(unit===4){
   if(level==='hard'){
    const rf=4+v,mkt=rf+6,beta=0.8+k*0.2, equity=rf+beta*6,debt=8+k,tax=0.25,ew=0.6,wacc=ew*equity+0.4*debt*(1-tax);
    return q(unit,level,i,'CAPM plus after-tax WACC',`Risk-free return is ${rf}%, market expected return ${mkt}%, and equity beta ${beta.toFixed(1)}. Debt costs ${debt}% before tax. Market-value weights are 60% equity and 40% debt. The supplied tax rate is 25%, with a fully usable interest shield. What is WACC?`,pct(wacc),[pct(ew*equity+0.4*debt),pct(equity),pct(wacc+2)],`CAPM equity cost=${rf}+${beta.toFixed(1)}(${mkt}-${rf})=${equity}%. After-tax debt=${debt}(0.75)=${debt*0.75}%. WACC=0.6(${equity})+0.4(${debt*0.75})=${pct(wacc)}.`);
   }
   const outlay=100000+v*10000,annual=60000+k*5000,salvage=10000+v*1000,wc=10000+k*1000,r=0.1;
   const npv=-(outlay+wc)+annual/(1+r)+(annual+salvage+wc)/(1+r)**2;
   return q(unit,level,i,'NPV with working-capital recovery',`A project costs ${money(outlay)} now and also requires ${money(wc)} working capital now. It generates net operating cash flows ${money(annual)} at each of years 1 and 2. At year 2 it also realises ${money(salvage)} salvage and recovers all working capital. Discount rate is 10%. No additional tax or other cash flows apply. What is NPV, rounded to the nearest rupee?`,money(npv),[money(npv-wc/(1+r)**2),money(npv+wc),money(npv+salvage-salvage/(1+r)**2)],`Initial flow=-${outlay+wc}. Year 1=${annual}. Year 2=${annual+salvage+wc}. NPV=-${outlay+wc}+${annual}/1.1+${annual+salvage+wc}/1.21=${money(npv)}. Working capital is paid initially and recovered at closure.`);
  }
  if(unit===5){
   if(level==='hard'){
    const prior=0.2+v*0.1+(k-1)*0.025,da=0.02,db=0.08,post=prior*db/((1-prior)*da+prior*db);
    return q(unit,level,i,'Bayesian source identification',`Source B supplies ${(prior*100).toFixed(1)}% of items and source A the remainder. Defect probability is 8% for B and 2% for A. A randomly selected item is defective. What is the probability it came from B, rounded to two decimal places as a percentage?`,`${(post*100).toFixed(2)}%`,[`${(prior*100).toFixed(2)}%`,'8.00%',`${((1-post)*100).toFixed(2)}%`],`P(B|D)=P(B)P(D|B)/[P(A)P(D|A)+P(B)P(D|B)]=${prior}×0.08/[${1-prior}×0.02+${prior}×0.08]=${(post*100).toFixed(2)}%.`);
   }
   const sx=4+v,sy=8+k*2,r=0.5, mx=10+v,my=30+k, x=mx+4,b=r*sy/sx,pred=my+b*(x-mx), inv=r*sx/sy;
   return q(unit,level,i,'Regression prediction and reverse slope',`For paired data, mean X=${mx}, mean Y=${my}, SD(X)=${sx}, SD(Y)=${sy}, and correlation r=0.5. Which gives the least-squares predicted Y at X=${x} and the reverse regression slope b(X on Y)? Round both to four decimals.`,`Predicted Y=${pred.toFixed(4)}; reverse slope=${inv.toFixed(4)}`,[`Predicted Y=${(my+inv*4).toFixed(4)}; reverse slope=${b.toFixed(4)}`,`Predicted Y=${pred.toFixed(4)}; reverse slope=${(1/b).toFixed(4)}`,`Predicted Y=${(my+b*x).toFixed(4)}; reverse slope=${inv.toFixed(4)}`],`b(Y on X)=r SD(Y)/SD(X)=${b.toFixed(4)}. Predicted Y=mean Y+b(Y on X)(X-mean X)=${pred.toFixed(4)}. Reverse slope=r SD(X)/SD(Y)=${inv.toFixed(4)}, which is not generally the reciprocal of the forward slope; their product is r²=0.25.`);
  }
  if(unit===8){
   const cost=80+v*20+k*10,discount=0.1,margin=0.25,net=cost/(1-margin),list=net/(1-discount);
   if(level==='extreme'){
    const produced=100+k*10,sold=produced-10,commission=0.2,profit=produced*cost*0.25,listPrice=(produced*cost+profit)/(sold*0.9*(1-commission));
    return q(unit,level,i,'Pricing with unsold output and channel costs',`A firm produces ${produced} units at cost ${money(cost)} each and expects to sell ${sold}; the remainder has no salvage value. Customers receive a 10% discount on list price. A dealer commission equals 20% of actual sales revenue after the discount. The required profit is 25% of total production cost. No other costs or taxes apply. What list price per sold unit achieves that profit, rounded to the nearest rupee?`,money(listPrice),[money((cost*1.25)/(0.9*0.8)),money(listPrice*0.8),money(listPrice*0.9)],`Total production cost=${money(produced*cost)}. Required net receipts after commission=${money(produced*cost+profit)}. Each list-price rupee yields 0.9×0.8=0.72 net rupees. Required list price=(${produced}×${cost}×1.25)/(${sold}×0.72)=${listPrice.toFixed(4)}, rounded ${money(listPrice)}. Unsold units still incurred production cost.`);
   }
   return q(unit,level,i,'Markup margin and discount pricing',`A product costs ${money(cost)} per unit. The firm grants a 10% discount on list price and requires a 25% gross margin on the actual selling price. Ignore other costs and taxes. What list price is needed, rounded to the nearest rupee?`,money(list),[money(cost*1.25/0.9),money(net),money(cost*1.35)],`Required actual price=cost/(1-margin)=${cost}/0.75=${net.toFixed(4)}. List price=actual price/0.90=${list.toFixed(4)}, rounded ${money(list)}. A margin on selling price differs from a markup on cost.`);
  }
  const gav=300000+v*60000,municipal=20000+k*10000,interest=80000+k*10000,nav=gav-municipal,income=nav*0.7-interest;
  if(level==='extreme'){
   const salary=500000+k*40000,stcg=100000+v*10000,ltcl=30000+k*5000,deduction=80000+k*5000,total=salary+income+stcg-deduction;
   return q(unit,level,i,'Historical heads deductions and restricted loss',`Historical practice: Income-tax Act, 1961, AY 2025–26, old regime. Computed taxable salary is ${money(salary)}. A let-out property's GAV is ${money(gav)}, owner-paid qualifying municipal taxes ${money(municipal)}, and deductible interest ${money(interest)}; apply the 30% NAV deduction. Ordinary short-term capital gain is ${money(stcg)} and long-term capital loss is ${money(ltcl)}; there is no long-term capital gain. Eligible GTI deductions are ${money(deduction)} and fully deductible on these facts. No other income or adjustments apply. What is total income?`,money(total),[money(total-ltcl),money(total+deduction),money(total+nav*0.3)],`Property income=(${gav}-${municipal})×0.7-${interest}=${money(income)}. Long-term capital loss cannot offset the short-term gain or salary on these facts. GTI=salary+property income+STCG=${money(salary+income+stcg)}. Subtract eligible deductions ${money(deduction)} to obtain ${money(total)}. Carry-forward is a separate question and not assumed here.`);
  }
  return q(unit,level,i,'Historical let-out property computation',`Historical practice: Income-tax Act, 1961, AY 2025–26, old regime. For an eligible let-out property, gross annual value is ${money(gav)}, qualifying municipal taxes actually paid by the owner are ${money(municipal)}, and deductible loan interest is ${money(interest)}. Apply the 30% deduction from NAV. No other adjustments apply. What is income under house property?`,money(income),[money(gav*0.7-interest),money(nav-interest),money(nav*0.3-interest)],`NAV=${gav}-${municipal}=${nav}. Standard deduction=30% of NAV=${nav*0.3}. Income=NAV-standard deduction-interest=${money(income)}. This is explicitly a historical 1961-Act case, not a claim about section numbering in the 2025 Act.`);
 });
}
