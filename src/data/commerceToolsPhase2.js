const num = (value) => Number(value);
const finite = (...values) => values.every((value) => Number.isFinite(num(value)));
const fmt = (value, digits = 4) => Number(value).toLocaleString('en-IN', { maximumFractionDigits: digits });
const ratioFmt = (value) => `${fmt(value, 3)} : 1`;
const pctFmt = (value) => `${fmt(value, 2)}%`;
const field = (key, label, placeholder, helper = '') => ({ key, label, placeholder, helper, type: 'number' });

export const commerceToolsPhase2 = [
  {
    slug: 'consumption-function-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Consumption Function Calculator', h1: 'Consumption Function Calculator for Class 12 Economics',
    description: 'Calculate consumption and saving from autonomous consumption, MPC and income using the Class 12 consumption function.',
    keywords: ['consumption function calculator', 'C = a + bY calculator', 'Class 12 consumption function'],
    formula: 'C = C̄ + MPC × Y; S = Y − C',
    fields: [field('autonomous', 'Autonomous Consumption (C̄)', '100'), field('mpc', 'MPC', '0.8', 'Enter MPC as a decimal, e.g. 0.8.'), field('income', 'Income (Y)', '1000')],
    example: 'If autonomous consumption is 100, MPC is 0.8 and income is 1,000, consumption is 900 and saving is 100.',
    calculate(v) { if (!finite(v.autonomous, v.mpc, v.income)) return { error: 'Enter valid numbers.' }; const a=num(v.autonomous), b=num(v.mpc), y=num(v.income); if (b < 0 || b > 1) return { error: 'Enter MPC between 0 and 1.' }; const c=a+b*y, s=y-c; return { primary:`Consumption (C) = ${fmt(c)}`, secondary:`Saving (S) = ${fmt(s)}`, steps:[`C = C̄ + MPC × Y`,`= ${fmt(a)} + ${fmt(b)} × ${fmt(y)} = ${fmt(c)}`,`S = Y − C = ${fmt(y)} − ${fmt(c)} = ${fmt(s)}`], note:'This uses the standard linear consumption function taught in Class 12 macroeconomics.' }; }
  },
  {
    slug: 'saving-function-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Saving Function Calculator', h1: 'Saving Function Calculator for Class 12 Economics',
    description: 'Calculate saving from autonomous consumption, MPS and income and see the saving-function working step by step.',
    keywords: ['saving function calculator', 'Class 12 saving function', 'S = -a + sY calculator'],
    formula: 'S = −C̄ + MPS × Y; C = Y − S',
    fields: [field('autonomous', 'Autonomous Consumption (C̄)', '100'), field('mps', 'MPS', '0.2', 'Enter MPS as a decimal, e.g. 0.2.'), field('income', 'Income (Y)', '1000')],
    example: 'If autonomous consumption is 100, MPS is 0.2 and income is 1,000, saving is 100 and consumption is 900.',
    calculate(v) { if (!finite(v.autonomous, v.mps, v.income)) return { error: 'Enter valid numbers.' }; const a=num(v.autonomous), sProp=num(v.mps), y=num(v.income); if (sProp < 0 || sProp > 1) return { error: 'Enter MPS between 0 and 1.' }; const s=-a+sProp*y, c=y-s; return { primary:`Saving (S) = ${fmt(s)}`, secondary:`Consumption (C) = ${fmt(c)}`, steps:[`S = −C̄ + MPS × Y`,`= −${fmt(a)} + ${fmt(sProp)} × ${fmt(y)} = ${fmt(s)}`,`C = Y − S = ${fmt(y)} − (${fmt(s)}) = ${fmt(c)}`], note:'Autonomous saving is the negative of autonomous consumption in this simple model.' }; }
  },
  {
    slug: 'equilibrium-income-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Equilibrium Income Calculator', h1: 'Equilibrium Income Calculator — Two-Sector Economy',
    description: 'Calculate equilibrium income from autonomous consumption, autonomous investment and MPC in the simple two-sector Keynesian model.',
    keywords: ['equilibrium income calculator', 'two sector equilibrium income', 'Class 12 aggregate demand equilibrium'],
    formula: 'Y = (C̄ + I) ÷ (1 − MPC)',
    fields: [field('autonomous', 'Autonomous Consumption (C̄)', '100'), field('investment', 'Autonomous Investment (I)', '200'), field('mpc', 'MPC', '0.8')],
    example: 'With C̄ = 100, I = 200 and MPC = 0.8, equilibrium income is 1,500.',
    calculate(v) { if (!finite(v.autonomous, v.investment, v.mpc)) return { error: 'Enter valid numbers.' }; const a=num(v.autonomous), i=num(v.investment), mpc=num(v.mpc); if (mpc < 0 || mpc >= 1) return { error: 'Enter MPC from 0 up to, but not including, 1.' }; const denom=1-mpc, y=(a+i)/denom; return { primary:`Equilibrium Income (Y) = ${fmt(y)}`, secondary:`Multiplier = ${fmt(1/denom)}`, steps:[`Y = (C̄ + I) ÷ (1 − MPC)`,`= (${fmt(a)} + ${fmt(i)}) ÷ (1 − ${fmt(mpc)})`,`= ${fmt(a+i)} ÷ ${fmt(denom)} = ${fmt(y)}`], note:'This assumes a simple two-sector economy with autonomous investment.' }; }
  },
  {
    slug: 'multiplier-income-change-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Multiplier Change in Income Calculator', h1: 'Change in Income from Investment Multiplier Calculator',
    description: 'Calculate the multiplier and resulting change in income from a change in investment and MPC.',
    keywords: ['change in income multiplier calculator', 'delta Y delta I calculator', 'investment multiplier numerical'],
    formula: 'k = 1 ÷ (1 − MPC); ΔY = k × ΔI',
    fields: [field('mpc', 'MPC', '0.75'), field('deltaI', 'Change in Investment (ΔI)', '100')],
    example: 'If MPC is 0.75 and investment rises by 100, the multiplier is 4 and income rises by 400.',
    calculate(v) { if (!finite(v.mpc, v.deltaI)) return { error: 'Enter valid numbers.' }; const mpc=num(v.mpc), di=num(v.deltaI); if (mpc < 0 || mpc >= 1) return { error: 'Enter MPC from 0 up to, but not including, 1.' }; const k=1/(1-mpc), dy=k*di; return { primary:`Change in Income (ΔY) = ${fmt(dy)}`, secondary:`Multiplier (k) = ${fmt(k)}`, steps:[`k = 1 ÷ (1 − MPC) = 1 ÷ (1 − ${fmt(mpc)}) = ${fmt(k)}`,`ΔY = k × ΔI = ${fmt(k)} × ${fmt(di)} = ${fmt(dy)}`], note:'A negative change in investment will produce a negative change in income using the same multiplier relation.' }; }
  },
  {
    slug: 'gdp-to-ndp-calculator', category: 'Economics', classLevel: 'Class 12', title: 'GDP to NDP Calculator', h1: 'GDP to NDP Calculator for Class 12 Economics',
    description: 'Convert GDP at market price to NDP at market price by subtracting depreciation with clear working.',
    keywords: ['GDP to NDP calculator', 'NDP calculator Class 12', 'depreciation GDP NDP'],
    formula: 'NDPmp = GDPmp − Depreciation',
    fields: [field('gdp', 'GDP at Market Price (GDPmp)', '1200'), field('depreciation', 'Depreciation / Consumption of Fixed Capital', '100')],
    example: 'GDPmp of 1,200 and depreciation of 100 gives NDPmp of 1,100.',
    calculate(v) { if (!finite(v.gdp, v.depreciation)) return { error: 'Enter valid numbers.' }; const g=num(v.gdp), d=num(v.depreciation), ndp=g-d; return { primary:`NDP at MP = ${fmt(ndp)}`, steps:[`NDPmp = GDPmp − Depreciation`,`= ${fmt(g)} − ${fmt(d)} = ${fmt(ndp)}`], note:'Gross aggregates include depreciation; net aggregates exclude it.' }; }
  },
  {
    slug: 'domestic-national-aggregate-converter', category: 'Economics', classLevel: 'Class 12', title: 'Domestic to National Aggregate Converter', h1: 'GDP to GNP, NDP, NNP and National Income Converter',
    description: 'Convert GDP at market price into GNPmp, NDPmp, NNPmp and NNPfc using depreciation, NFIA and net indirect taxes.',
    keywords: ['GDP GNP NDP NNP calculator', 'national income aggregate converter', 'NNPfc calculator'],
    formula: 'GNPmp = GDPmp + NFIA; NNPfc = GDPmp + NFIA − Depreciation − NIT',
    fields: [field('gdp', 'GDP at Market Price (GDPmp)', '1500'), field('depreciation', 'Depreciation', '100'), field('nfia', 'Net Factor Income from Abroad (NFIA)', '20'), field('nit', 'Net Indirect Taxes (NIT)', '80')],
    example: 'With GDPmp 1,500, depreciation 100, NFIA 20 and NIT 80, national income (NNPfc) is 1,340.',
    calculate(v) { if (!finite(v.gdp, v.depreciation, v.nfia, v.nit)) return { error: 'Enter valid numbers.' }; const g=num(v.gdp), dep=num(v.depreciation), nfia=num(v.nfia), nit=num(v.nit); const gnp=g+nfia, ndp=g-dep, nnpmp=gnp-dep, nnpfc=nnpmp-nit; return { primary:`National Income (NNPfc) = ${fmt(nnpfc)}`, secondary:`GNPmp = ${fmt(gnp)} • NDPmp = ${fmt(ndp)} • NNPmp = ${fmt(nnpmp)}`, steps:[`GNPmp = GDPmp + NFIA = ${fmt(g)} + ${fmt(nfia)} = ${fmt(gnp)}`,`NDPmp = GDPmp − Depreciation = ${fmt(g)} − ${fmt(dep)} = ${fmt(ndp)}`,`NNPmp = GNPmp − Depreciation = ${fmt(gnp)} − ${fmt(dep)} = ${fmt(nnpmp)}`,`NNPfc = NNPmp − NIT = ${fmt(nnpmp)} − ${fmt(nit)} = ${fmt(nnpfc)}`], note:'NNP at factor cost is commonly called National Income.' }; }
  },
  {
    slug: 'factor-cost-from-market-price-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Market Price to Factor Cost Calculator', h1: 'Convert Market Price to Factor Cost — Economics Calculator',
    description: 'Convert an aggregate measured at market price to factor cost using net indirect taxes.',
    keywords: ['market price to factor cost calculator', 'MP to FC calculator', 'net indirect taxes factor cost'],
    formula: 'Factor Cost = Market Price − Net Indirect Taxes',
    fields: [field('mp', 'Aggregate at Market Price', '1000'), field('nit', 'Net Indirect Taxes (NIT)', '80')],
    example: 'An aggregate of 1,000 at market price with NIT of 80 equals 920 at factor cost.',
    calculate(v) { if (!finite(v.mp, v.nit)) return { error: 'Enter valid numbers.' }; const mp=num(v.mp), nit=num(v.nit), fc=mp-nit; return { primary:`Factor Cost = ${fmt(fc)}`, steps:[`Factor Cost = Market Price − NIT`,`= ${fmt(mp)} − ${fmt(nit)} = ${fmt(fc)}`], note:'Net indirect taxes = indirect taxes − subsidies.' }; }
  },
  {
    slug: 'market-price-from-factor-cost-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Factor Cost to Market Price Calculator', h1: 'Convert Factor Cost to Market Price — Economics Calculator',
    description: 'Convert an aggregate measured at factor cost to market price by adding net indirect taxes.',
    keywords: ['factor cost to market price calculator', 'FC to MP calculator'],
    formula: 'Market Price = Factor Cost + Net Indirect Taxes',
    fields: [field('fc', 'Aggregate at Factor Cost', '920'), field('nit', 'Net Indirect Taxes (NIT)', '80')],
    example: 'An aggregate of 920 at factor cost plus NIT of 80 equals 1,000 at market price.',
    calculate(v) { if (!finite(v.fc, v.nit)) return { error: 'Enter valid numbers.' }; const fc=num(v.fc), nit=num(v.nit), mp=fc+nit; return { primary:`Market Price = ${fmt(mp)}`, steps:[`Market Price = Factor Cost + NIT`,`= ${fmt(fc)} + ${fmt(nit)} = ${fmt(mp)}`], note:'If subsidies exceed indirect taxes, NIT can be negative.' }; }
  },
  {
    slug: 'nfia-calculator', category: 'Economics', classLevel: 'Class 12', title: 'NFIA Calculator', h1: 'Net Factor Income from Abroad (NFIA) Calculator',
    description: 'Calculate NFIA from factor income received from abroad and factor income paid abroad.',
    keywords: ['NFIA calculator', 'net factor income from abroad calculator', 'Class 12 national income NFIA'],
    formula: 'NFIA = Factor Income from Abroad − Factor Income to Abroad',
    fields: [field('fromAbroad', 'Factor Income from Abroad', '120'), field('toAbroad', 'Factor Income to Abroad', '90')],
    example: 'Factor income from abroad of 120 and factor income paid abroad of 90 gives NFIA of 30.',
    calculate(v) { if (!finite(v.fromAbroad, v.toAbroad)) return { error: 'Enter valid numbers.' }; const a=num(v.fromAbroad), b=num(v.toAbroad), nfia=a-b; return { primary:`NFIA = ${fmt(nfia)}`, steps:[`NFIA = Factor Income from Abroad − Factor Income to Abroad`,`= ${fmt(a)} − ${fmt(b)} = ${fmt(nfia)}`], note:'Add NFIA when converting a domestic aggregate into the corresponding national aggregate.' }; }
  },
  {
    slug: 'net-indirect-tax-calculator', category: 'Economics', classLevel: 'Class 12', title: 'Net Indirect Taxes Calculator', h1: 'Net Indirect Taxes (NIT) Calculator',
    description: 'Calculate net indirect taxes from indirect taxes and subsidies for national income conversions.',
    keywords: ['net indirect tax calculator', 'NIT calculator economics', 'indirect tax subsidy calculator'],
    formula: 'NIT = Indirect Taxes − Subsidies',
    fields: [field('taxes', 'Indirect Taxes', '100'), field('subsidies', 'Subsidies', '20')],
    example: 'Indirect taxes of 100 and subsidies of 20 gives NIT of 80.',
    calculate(v) { if (!finite(v.taxes, v.subsidies)) return { error: 'Enter valid numbers.' }; const t=num(v.taxes), s=num(v.subsidies), nit=t-s; return { primary:`Net Indirect Taxes = ${fmt(nit)}`, steps:[`NIT = Indirect Taxes − Subsidies`,`= ${fmt(t)} − ${fmt(s)} = ${fmt(nit)}`], note:'Subtract NIT to move from market price to factor cost; add NIT for the reverse conversion.' }; }
  },
  {
    slug: 'tr-ar-mr-calculator', category: 'Economics', classLevel: 'Class 11', title: 'TR, AR & MR Calculator', h1: 'Total Revenue, Average Revenue and Marginal Revenue Calculator',
    description: 'Calculate TR, AR and MR from price, quantity and previous total revenue with step-by-step Microeconomics working.',
    keywords: ['TR AR MR calculator', 'total average marginal revenue calculator', 'Class 11 revenue calculator'],
    formula: 'TR = P × Q; AR = TR ÷ Q; MR = ΔTR ÷ ΔQ',
    fields: [field('q', 'Current Quantity (Q)', '10'), field('price', 'Current Price / AR', '50'), field('previousQ', 'Previous Quantity', '9'), field('previousTR', 'Previous Total Revenue', '468')],
    example: 'At Q = 10 and price = 50, TR is 500 and AR is 50. If previous TR at Q = 9 was 468, MR is 32.',
    calculate(v) { if (!finite(v.q, v.price, v.previousQ, v.previousTR)) return { error: 'Enter valid numbers.' }; const q=num(v.q), p=num(v.price), pq=num(v.previousQ), ptr=num(v.previousTR); if (q === 0 || q === pq) return { error: 'Current quantity cannot be zero and must differ from previous quantity.' }; const tr=p*q, ar=tr/q, mr=(tr-ptr)/(q-pq); return { primary:`TR = ${fmt(tr)} • AR = ${fmt(ar)}`, secondary:`MR = ${fmt(mr)}`, steps:[`TR = P × Q = ${fmt(p)} × ${fmt(q)} = ${fmt(tr)}`,`AR = TR ÷ Q = ${fmt(tr)} ÷ ${fmt(q)} = ${fmt(ar)}`,`MR = ΔTR ÷ ΔQ = (${fmt(tr)} − ${fmt(ptr)}) ÷ (${fmt(q)} − ${fmt(pq)}) = ${fmt(mr)}`], note:'When quantity changes by exactly one unit, MR equals the change in total revenue.' }; }
  },
  {
    slug: 'cost-curves-calculator', category: 'Economics', classLevel: 'Class 11', title: 'Cost Curves Calculator', h1: 'TC, AFC, AVC, AC and MC Calculator for Class 11 Economics',
    description: 'Calculate total cost, average fixed cost, average variable cost, average cost and marginal cost from cost data.',
    keywords: ['TC AFC AVC AC MC calculator', 'cost curves calculator economics', 'Class 11 cost calculator'],
    formula: 'TC = TFC + TVC; AFC = TFC/Q; AVC = TVC/Q; AC = TC/Q; MC = ΔTC/ΔQ',
    fields: [field('q', 'Current Output (Q)', '10'), field('tfc', 'Total Fixed Cost (TFC)', '100'), field('tvc', 'Total Variable Cost (TVC)', '400'), field('previousQ', 'Previous Output', '9'), field('previousTC', 'Previous Total Cost', '455')],
    example: 'At output 10 with TFC 100 and TVC 400, TC is 500, AFC 10, AVC 40 and AC 50. If previous TC was 455 at output 9, MC is 45.',
    calculate(v) { if (!finite(v.q, v.tfc, v.tvc, v.previousQ, v.previousTC)) return { error: 'Enter valid numbers.' }; const q=num(v.q), tfc=num(v.tfc), tvc=num(v.tvc), pq=num(v.previousQ), ptc=num(v.previousTC); if (q === 0 || q === pq) return { error: 'Current output cannot be zero and must differ from previous output.' }; const tc=tfc+tvc, afc=tfc/q, avc=tvc/q, ac=tc/q, mc=(tc-ptc)/(q-pq); return { primary:`TC = ${fmt(tc)} • AC = ${fmt(ac)}`, secondary:`AFC = ${fmt(afc)} • AVC = ${fmt(avc)} • MC = ${fmt(mc)}`, steps:[`TC = TFC + TVC = ${fmt(tfc)} + ${fmt(tvc)} = ${fmt(tc)}`,`AFC = TFC ÷ Q = ${fmt(afc)}`,`AVC = TVC ÷ Q = ${fmt(avc)}`,`AC = TC ÷ Q = ${fmt(ac)}`,`MC = ΔTC ÷ ΔQ = (${fmt(tc)} − ${fmt(ptc)}) ÷ (${fmt(q)} − ${fmt(pq)}) = ${fmt(mc)}`], note:'MC depends on the change in total cost as output changes; fixed cost does not change MC.' }; }
  },
  {
    slug: 'trade-payables-turnover-ratio-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Trade Payables Turnover Ratio Calculator', h1: 'Trade Payables Turnover Ratio Calculator for Class 12 Accountancy',
    description: 'Calculate average trade payables and trade payables turnover ratio from net credit purchases and opening and closing trade payables.',
    keywords: ['trade payables turnover ratio calculator', 'creditors turnover ratio calculator', 'Class 12 accounting ratios'],
    formula: 'Trade Payables Turnover = Net Credit Purchases ÷ Average Trade Payables',
    fields: [field('creditPurchases', 'Net Credit Purchases', '600000'), field('opening', 'Opening Trade Payables', '90000'), field('closing', 'Closing Trade Payables', '110000')],
    example: 'Net credit purchases of 6,00,000 and average trade payables of 1,00,000 gives a turnover ratio of 6 times.',
    calculate(v) { if (!finite(v.creditPurchases, v.opening, v.closing)) return { error: 'Enter valid numbers.' }; const p=num(v.creditPurchases), o=num(v.opening), c=num(v.closing), avg=(o+c)/2; if (avg===0) return { error:'Average trade payables cannot be zero.' }; const r=p/avg; return { primary:`Trade Payables Turnover = ${fmt(r,3)} times`, secondary:`Average Trade Payables = ${fmt(avg)}`, steps:[`Average Trade Payables = (${fmt(o)} + ${fmt(c)}) ÷ 2 = ${fmt(avg)}`,`Turnover = Net Credit Purchases ÷ Average Trade Payables`,`= ${fmt(p)} ÷ ${fmt(avg)} = ${fmt(r,3)} times`], note:'Use net credit purchases when the question provides the required information.' }; }
  },
  {
    slug: 'average-collection-period-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Average Collection Period Calculator', h1: 'Average Collection Period from Receivables Turnover Ratio',
    description: 'Calculate the average collection period in days and months from the trade receivables turnover ratio.',
    keywords: ['average collection period calculator', 'receivables turnover days calculator'],
    formula: 'Average Collection Period = 365 ÷ Trade Receivables Turnover Ratio',
    fields: [field('ratio', 'Trade Receivables Turnover Ratio (times)', '8')],
    example: 'A trade receivables turnover ratio of 8 times gives an average collection period of about 45.63 days.',
    calculate(v) { if (!finite(v.ratio) || num(v.ratio)===0) return { error:'Enter a valid turnover ratio greater than zero.' }; const r=num(v.ratio); if(r<0) return {error:'Turnover ratio must be positive.'}; const days=365/r, months=12/r; return { primary:`Average Collection Period = ${fmt(days,2)} days`, secondary:`≈ ${fmt(months,2)} months`, steps:[`Average Collection Period = 365 ÷ Receivables Turnover Ratio`,`= 365 ÷ ${fmt(r)} = ${fmt(days,2)} days`,`Using months: 12 ÷ ${fmt(r)} = ${fmt(months,2)} months`], note:'Some questions use 360 days; follow the convention given by your textbook or question.' }; }
  },
  {
    slug: 'average-payment-period-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Average Payment Period Calculator', h1: 'Average Payment Period from Trade Payables Turnover Ratio',
    description: 'Calculate the average payment period in days and months from the trade payables turnover ratio.',
    keywords: ['average payment period calculator', 'payables turnover days calculator'],
    formula: 'Average Payment Period = 365 ÷ Trade Payables Turnover Ratio',
    fields: [field('ratio', 'Trade Payables Turnover Ratio (times)', '6')],
    example: 'A trade payables turnover ratio of 6 times gives an average payment period of about 60.83 days.',
    calculate(v) { if (!finite(v.ratio) || num(v.ratio)===0) return { error:'Enter a valid turnover ratio greater than zero.' }; const r=num(v.ratio); if(r<0) return {error:'Turnover ratio must be positive.'}; const days=365/r, months=12/r; return { primary:`Average Payment Period = ${fmt(days,2)} days`, secondary:`≈ ${fmt(months,2)} months`, steps:[`Average Payment Period = 365 ÷ Payables Turnover Ratio`,`= 365 ÷ ${fmt(r)} = ${fmt(days,2)} days`,`Using months: 12 ÷ ${fmt(r)} = ${fmt(months,2)} months`], note:'Use the time convention specified in the question when it differs from 365 days.' }; }
  },
  {
    slug: 'gross-profit-ratio-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Gross Profit Ratio Calculator', h1: 'Gross Profit Ratio Calculator for Class 12 Accountancy',
    description: 'Calculate gross profit ratio from gross profit and revenue from operations with percentage working.',
    keywords: ['gross profit ratio calculator', 'gross margin ratio Class 12'],
    formula: 'Gross Profit Ratio = (Gross Profit ÷ Revenue from Operations) × 100',
    fields: [field('gp', 'Gross Profit', '250000'), field('revenue', 'Revenue from Operations', '1000000')],
    example: 'Gross profit of 2,50,000 on revenue of 10,00,000 gives a gross profit ratio of 25%.',
    calculate(v) { if (!finite(v.gp,v.revenue) || num(v.revenue)===0) return { error:'Enter valid values. Revenue cannot be zero.' }; const gp=num(v.gp), rev=num(v.revenue), r=gp/rev*100; return { primary:`Gross Profit Ratio = ${pctFmt(r)}`, steps:[`Gross Profit Ratio = (Gross Profit ÷ Revenue) × 100`,`= (${fmt(gp)} ÷ ${fmt(rev)}) × 100 = ${pctFmt(r)}`], note:'A higher ratio generally indicates a larger gross margin, but interpretation should consider the business and prior periods.' }; }
  },
  {
    slug: 'operating-profit-ratio-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Operating Profit Ratio Calculator', h1: 'Operating Profit Ratio Calculator for Class 12 Accountancy',
    description: 'Calculate operating profit ratio from operating profit and revenue from operations.',
    keywords: ['operating profit ratio calculator', 'Class 12 ratio analysis operating profit'],
    formula: 'Operating Profit Ratio = (Operating Profit ÷ Revenue from Operations) × 100',
    fields: [field('op', 'Operating Profit', '180000'), field('revenue', 'Revenue from Operations', '1000000')],
    example: 'Operating profit of 1,80,000 on revenue of 10,00,000 gives an operating profit ratio of 18%.',
    calculate(v) { if (!finite(v.op,v.revenue) || num(v.revenue)===0) return { error:'Enter valid values. Revenue cannot be zero.' }; const op=num(v.op), rev=num(v.revenue), r=op/rev*100; return { primary:`Operating Profit Ratio = ${pctFmt(r)}`, steps:[`Operating Profit Ratio = (Operating Profit ÷ Revenue) × 100`,`= (${fmt(op)} ÷ ${fmt(rev)}) × 100 = ${pctFmt(r)}`], note:'Operating profit excludes non-operating incomes and expenses.' }; }
  },
  {
    slug: 'total-assets-to-debt-ratio-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Total Assets to Debt Ratio Calculator', h1: 'Total Assets to Debt Ratio Calculator for Class 12 Accountancy',
    description: 'Calculate total assets to debt ratio from total assets and long-term debt.',
    keywords: ['total assets to debt ratio calculator', 'Class 12 solvency ratio calculator'],
    formula: 'Total Assets to Debt Ratio = Total Assets ÷ Long-term Debt',
    fields: [field('assets', 'Total Assets', '1500000'), field('debt', 'Long-term Debt', '500000')],
    example: 'Total assets of 15,00,000 and long-term debt of 5,00,000 gives a ratio of 3:1.',
    calculate(v) { if (!finite(v.assets,v.debt) || num(v.debt)===0) return { error:'Enter valid values. Long-term debt cannot be zero.' }; const a=num(v.assets), d=num(v.debt), r=a/d; return { primary:`Total Assets to Debt Ratio = ${ratioFmt(r)}`, steps:[`Ratio = Total Assets ÷ Long-term Debt`,`= ${fmt(a)} ÷ ${fmt(d)} = ${ratioFmt(r)}`], note:'This ratio compares the asset base with long-term debt obligations.' }; }
  },
  {
    slug: 'interest-coverage-ratio-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Interest Coverage Ratio Calculator', h1: 'Interest Coverage Ratio Calculator for Class 12 Accountancy',
    description: 'Calculate interest coverage ratio from profit before interest and tax and interest expense.',
    keywords: ['interest coverage ratio calculator', 'ICR calculator accountancy'],
    formula: 'Interest Coverage Ratio = Profit before Interest and Tax ÷ Interest',
    fields: [field('pbit', 'Profit before Interest and Tax (PBIT/EBIT)', '300000'), field('interest', 'Interest Expense', '60000')],
    example: 'PBIT of 3,00,000 and interest of 60,000 gives an interest coverage ratio of 5 times.',
    calculate(v) { if (!finite(v.pbit,v.interest) || num(v.interest)===0) return { error:'Enter valid values. Interest cannot be zero.' }; const p=num(v.pbit), i=num(v.interest), r=p/i; return { primary:`Interest Coverage Ratio = ${fmt(r,3)} times`, steps:[`Interest Coverage = PBIT ÷ Interest`,`= ${fmt(p)} ÷ ${fmt(i)} = ${fmt(r,3)} times`], note:'The ratio indicates how many times operating profit before interest and tax covers interest expense.' }; }
  },
  {
    slug: 'common-size-statement-calculator', category: 'Accountancy', classLevel: 'Class 12', title: 'Common Size Statement Calculator', h1: 'Common Size Statement Percentage Calculator',
    description: 'Convert any statement item into a common-size percentage using the relevant base amount.',
    keywords: ['common size statement calculator', 'common size balance sheet percentage calculator', 'common size income statement'],
    formula: 'Common Size Percentage = (Item Amount ÷ Base Amount) × 100',
    fields: [field('item', 'Item Amount', '250000'), field('base', 'Base Amount', '1000000', 'For an income statement this is commonly revenue from operations; for a balance sheet use the prescribed total/base.')],
    example: 'An item of 2,50,000 against a base of 10,00,000 represents 25%.',
    calculate(v) { if (!finite(v.item,v.base) || num(v.base)===0) return { error:'Enter valid values. Base amount cannot be zero.' }; const item=num(v.item), base=num(v.base), p=item/base*100; return { primary:`Common Size Percentage = ${pctFmt(p)}`, steps:[`Percentage = (Item Amount ÷ Base Amount) × 100`,`= (${fmt(item)} ÷ ${fmt(base)}) × 100 = ${pctFmt(p)}`], note:'Use the correct base figure required by the statement format in your syllabus or question.' }; }
  }
];
