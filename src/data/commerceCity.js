export const CITY_ENTITIES = [
  { id: "bank", name: "City Bank", type: "Bank", icon: "bank", detail: "Credit, deposits & monetary transmission" },
  { id: "factory", name: "NovaWorks", type: "Manufacturer", icon: "factory", detail: "Production, costs & investment" },
  { id: "store", name: "SmitMart", type: "Retailer", icon: "store", detail: "Pricing, promotion & working capital" },
  { id: "households", name: "Households", type: "Consumers", icon: "users", detail: "Income, demand & saving" },
  { id: "government", name: "Civic House", type: "Government", icon: "government", detail: "Tax, spending & regulation" },
  { id: "supplier", name: "FlowSupply", type: "Supplier", icon: "truck", detail: "Inputs, credit & logistics" },
];

export const COMMERCE_CITY_SCENARIOS = [
  {
    id: "repo-hike",
    kicker: "Monetary shock",
    title: "RBI raises the repo rate",
    headline: "Borrowing just became more expensive across Commerce City.",
    story: "City Bank now faces a higher policy borrowing cost. NovaWorks was planning a new plant, SmitMart relies on working-capital finance, and households use loans for large purchases.",
    control: { label: "Repo rate", min: 5, max: 9, step: 0.25, base: 6.5, unit: "%" },
    entities: ["bank", "factory", "store", "households"],
    metrics: [
      { label: "Loan demand", base: 100, coeff: -8, suffix: "" },
      { label: "Investment appetite", base: 100, coeff: -10, suffix: "" },
      { label: "Interest burden", base: 100, coeff: 12, suffix: "" },
      { label: "Demand pressure", base: 100, coeff: -6, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Monetary policy transmission",
        prediction: {
          prompt: "If banks pass higher borrowing costs to customers, what is the most likely immediate direction for new loan demand?",
          options: ["Loan demand rises", "Loan demand falls", "Loan demand must stay unchanged"],
          answer: 1,
          why: "Other things equal, a higher cost of borrowing tends to discourage some borrowing for consumption and investment.",
        },
        chain: [
          ["Repo rate ↑", "RBI lending to banks becomes costlier."],
          ["Bank lending rates may ↑", "Transmission is not mechanical, but banks may reprice loans."],
          ["Borrowing tends to ↓", "Some households and firms postpone debt-financed spending."],
          ["Consumption & investment pressure ↓", "Interest-sensitive components of aggregate demand can weaken."],
          ["Inflationary pressure may cool", "If aggregate demand slows, demand-side price pressure may ease."],
        ],
        exam: [
          ["1 mark", "Name the monetary-policy instrument changed in this event."],
          ["3 marks", "Explain how a repo-rate increase can influence commercial-bank lending."],
          ["4 marks", "Trace the likely effect of a repo-rate increase on aggregate demand."],
        ],
      },
      "Business Studies": {
        concept: "Financing, planning & control",
        prediction: {
          prompt: "NovaWorks planned an expansion funded mainly with debt. Which management decision becomes immediately more important?",
          options: ["Financing decision", "Staffing decision only", "Packaging decision"],
          answer: 0,
          why: "A change in borrowing cost directly affects the choice and cost of financing the expansion.",
        },
        chain: [
          ["Cost of debt changes", "The external financing environment has changed."],
          ["Financing decision revisited", "Managers compare debt, equity, risk and cost again."],
          ["Expansion plan may change", "The original plan may no longer be financially attractive."],
          ["Budgets & targets revised", "Planning must respond to the changed assumption."],
          ["Control compares new outcomes", "Managers track actual cost, cash flow and project performance."],
        ],
        exam: [
          ["1 mark", "Identify the financial decision affected by the higher cost of borrowing."],
          ["3 marks", "Explain why planning is described as a dynamic managerial activity in this case."],
          ["4 marks", "Show how planning and controlling would work together after the rate change."],
        ],
      },
      Accountancy: {
        concept: "Finance cost, cash flow & leverage",
        prediction: {
          prompt: "If a company has floating-rate debt and its interest rate rises, what happens first to finance cost?",
          options: ["It tends to increase", "It must fall", "It becomes an asset"],
          answer: 0,
          why: "For the same outstanding principal, a higher applicable interest rate increases interest expense.",
        },
        chain: [
          ["Interest rate ↑", "Floating-rate borrowing becomes costlier."],
          ["Finance cost ↑", "More profit is absorbed by interest, all else equal."],
          ["Profit after finance cost ↓", "Operating performance may be unchanged while financing cost rises."],
          ["Cash outflow for interest ↑", "Debt servicing uses more cash."],
          ["Coverage & leverage matter more", "Users pay closer attention to interest coverage and debt-equity risk."],
        ],
        exam: [
          ["1 mark", "State one profitability effect of higher interest expense."],
          ["4 marks", "Calculate annual interest cost before and after a stated rate change."],
          ["6 marks", "Interpret how rising debt cost can affect cash flow and leverage risk."],
        ],
      },
    },
  },
  {
    id: "price-cut",
    kicker: "Retail decision",
    title: "SmitMart cuts its selling price",
    headline: "The store wants more buyers — but will lower prices actually help profit?",
    story: "SmitMart reduces the price of a popular product. Quantity demanded may respond, but revenue and profit depend on how strongly buyers react and what happens to contribution per unit.",
    control: { label: "Selling price index", min: 75, max: 125, step: 5, base: 100, unit: "" },
    entities: ["store", "households", "supplier"],
    metrics: [
      { label: "Quantity demand", base: 100, coeff: -0.7, suffix: "" },
      { label: "Margin/unit", base: 100, coeff: 0.9, suffix: "" },
      { label: "Sales traffic", base: 100, coeff: -0.6, suffix: "" },
      { label: "Inventory speed", base: 100, coeff: -0.35, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Demand, elasticity & total expenditure",
        prediction: {
          prompt: "If price falls, what usually happens to quantity demanded along the same demand curve, other things equal?",
          options: ["Quantity demanded rises", "Quantity demanded falls", "Demand curve must shift right"],
          answer: 0,
          why: "A price fall causes an expansion in quantity demanded; it does not by itself mean the entire demand curve shifts.",
        },
        chain: [
          ["Price ↓", "The product becomes cheaper relative to before."],
          ["Quantity demanded tends to ↑", "This is movement along the demand curve, other things equal."],
          ["Revenue effect depends on elasticity", "The percentage response in quantity matters."],
          ["Consumer expenditure may ↑ / ↓ / stay similar", "Elasticity determines the direction of total expenditure."],
          ["Pricing decision gets evidence", "The firm can compare observed response with its expectation."],
        ],
        exam: [
          ["1 mark", "Differentiate demand from quantity demanded in this situation."],
          ["3 marks", "Explain expansion in quantity demanded."],
          ["4 marks", "Use elasticity to explain why a price cut may increase or decrease total expenditure."],
        ],
      },
      "Business Studies": {
        concept: "Pricing decision in the marketing mix",
        prediction: {
          prompt: "Which element of the marketing mix is SmitMart changing directly?",
          options: ["Price", "Place", "Staffing"],
          answer: 0,
          why: "The firm is directly changing the amount charged for the product.",
        },
        chain: [
          ["Price strategy changes", "One element of the marketing mix is deliberately altered."],
          ["Customer response observed", "Managers watch traffic, conversion and volume."],
          ["Competitor reaction matters", "Rivals may respond with offers or matching prices."],
          ["Profit objective checked", "Higher volume does not automatically mean higher profit."],
          ["Control feeds next pricing decision", "Actual outcomes become input for future pricing."],
        ],
        exam: [
          ["1 mark", "Identify the marketing-mix element involved."],
          ["3 marks", "State factors a manager should consider before changing price."],
          ["4 marks", "Explain why controlling is important after introducing the price cut."],
        ],
      },
      Accountancy: {
        concept: "Sales, margin & inventory effects",
        prediction: {
          prompt: "If selling price per unit falls but quantity sold rises, can total sales revenue be known without the quantities?",
          options: ["Yes, it must rise", "No, both price and quantity effects matter", "Yes, it must fall"],
          answer: 1,
          why: "Revenue equals selling price × quantity. A lower price and higher quantity create opposing effects.",
        },
        chain: [
          ["Selling price/unit ↓", "Revenue earned on each unit is lower."],
          ["Units sold may ↑", "The volume response can partly or fully offset the price cut."],
          ["Sales revenue changes", "Direction depends on the combined price and quantity effect."],
          ["Gross margin may tighten", "If cost per unit is unchanged, margin per unit falls."],
          ["Inventory turnover may improve", "Faster sales can reduce average inventory holding."],
        ],
        exam: [
          ["2 marks", "State the formula for sales revenue and gross profit."],
          ["4 marks", "Calculate revenue before and after a price-and-quantity change."],
          ["6 marks", "Interpret the possible effect on gross margin and inventory turnover."],
        ],
      },
    },
  },
  {
    id: "credit-sales",
    kicker: "Working-capital tension",
    title: "SmitMart pushes more credit sales",
    headline: "Sales look stronger — cash does not.",
    story: "To win customers, SmitMart allows more buyers to pay later. Reported sales may rise, but receivables, liquidity and collection risk now become central.",
    control: { label: "Credit sales share", min: 10, max: 80, step: 5, base: 35, unit: "%" },
    entities: ["store", "households", "bank"],
    metrics: [
      { label: "Receivables", base: 100, coeff: 1.4, suffix: "" },
      { label: "Immediate cash", base: 100, coeff: -0.8, suffix: "" },
      { label: "Collection risk", base: 100, coeff: 0.9, suffix: "" },
      { label: "Sales reach", base: 100, coeff: 0.45, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Credit conditions and effective demand",
        prediction: {
          prompt: "When buyers are allowed to pay later, what happens to the immediate cash barrier to purchase?",
          options: ["It can fall", "It must rise", "It has no possible effect"],
          answer: 0,
          why: "Credit can relax the need for immediate payment, though it creates future repayment obligations.",
        },
        chain: [
          ["Payment is postponed", "Consumers need less cash at the moment of purchase."],
          ["Some purchases become easier", "Credit can support current demand for eligible buyers."],
          ["Future repayment obligation rises", "Today’s spending creates tomorrow’s payment."],
          ["Household liquidity shifts over time", "Cash-flow timing changes even if total resources do not."],
          ["Credit quality becomes important", "Easy credit and sustainable credit are not the same thing."],
        ],
        exam: [
          ["1 mark", "State one way credit can affect current purchasing ability."],
          ["3 marks", "Explain why credit can shift spending across time."],
          ["4 marks", "Discuss one benefit and one risk of easier consumer credit."],
        ],
      },
      "Business Studies": {
        concept: "Working capital & credit policy",
        prediction: {
          prompt: "Which finance requirement is most directly pressured when more sales are made on credit?",
          options: ["Working capital", "Fixed capital only", "Share capital must disappear"],
          answer: 0,
          why: "Cash is tied up in receivables, so day-to-day liquidity and working-capital management become more important.",
        },
        chain: [
          ["Credit policy becomes looser", "Customers receive more time to pay."],
          ["Sales reach may expand", "More buyers may accept the offer."],
          ["Receivables build up", "Money is tied up until customers pay."],
          ["Working-capital need rises", "The business still has wages, suppliers and other current obligations."],
          ["Control focuses on collections", "Managers track ageing, defaults and cash conversion."],
        ],
        exam: [
          ["1 mark", "Identify the type of capital requirement affected."],
          ["3 marks", "Explain how credit policy can influence working-capital requirement."],
          ["4 marks", "Show why sales growth and cash health can move in different directions."],
        ],
      },
      Accountancy: {
        concept: "Receivables, cash flow & liquidity",
        prediction: {
          prompt: "A credit sale is recorded today but collected later. Which current asset usually rises first?",
          options: ["Trade receivables", "Cash immediately", "Plant and machinery"],
          answer: 0,
          why: "The sale creates an amount due from the customer until collection occurs.",
        },
        chain: [
          ["Credit sale recorded", "Revenue is recognised according to the transaction."],
          ["Trade receivables ↑", "The customer owes the business."],
          ["Cash collection is delayed", "Revenue and cash timing are different."],
          ["Liquidity quality becomes important", "Current assets can rise without the same rise in cash."],
          ["Receivable turnover matters", "Collection efficiency helps interpret the quality of sales."],
        ],
        exam: [
          ["2 marks", "Show the basic accounting effect of a credit sale."],
          ["4 marks", "Explain why profit and cash flow can differ after credit sales."],
          ["6 marks", "Interpret receivables turnover or collection-period information."],
        ],
      },
    },
  },
  {
    id: "input-cost",
    kicker: "Supply shock",
    title: "Raw-material cost jumps 25%",
    headline: "NovaWorks can absorb the shock, raise prices, cut output — or redesign the plan.",
    story: "FlowSupply raises input prices sharply. NovaWorks now faces a higher cost per unit and must decide how much of that pressure can be absorbed or passed to customers.",
    control: { label: "Input cost index", min: 90, max: 140, step: 5, base: 100, unit: "" },
    entities: ["supplier", "factory", "store", "households"],
    metrics: [
      { label: "Unit cost", base: 100, coeff: 0.85, suffix: "" },
      { label: "Gross margin", base: 100, coeff: -0.55, suffix: "" },
      { label: "Supply pressure", base: 100, coeff: -0.45, suffix: "" },
      { label: "Price pressure", base: 100, coeff: 0.5, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Cost conditions, supply & inflation",
        prediction: {
          prompt: "If production becomes more expensive for many firms, which direction can supply pressure move, other things equal?",
          options: ["Supply conditions can tighten", "Supply must expand", "Price can never change"],
          answer: 0,
          why: "Higher input costs can make some output less profitable at existing prices, creating upward price pressure and weaker supply conditions.",
        },
        chain: [
          ["Input cost ↑", "Producing each unit becomes more expensive."],
          ["Profitability at old price ↓", "The old price leaves less margin."],
          ["Supply conditions may tighten", "Some firms reduce planned output or require a higher price."],
          ["Market prices may face upward pressure", "Cost pressure can be passed through partly or fully."],
          ["Real purchasing power may be affected", "Higher prices can reduce what a given income buys."],
        ],
        exam: [
          ["1 mark", "Identify the type of shock described."],
          ["3 marks", "Explain how higher input cost can influence supply."],
          ["4 marks", "Trace a possible path from input-cost shock to consumer prices."],
        ],
      },
      "Business Studies": {
        concept: "Planning, procurement & pricing",
        prediction: {
          prompt: "Which managerial activity should compare the new input-cost reality with the assumptions used in the original plan?",
          options: ["Controlling", "Recruitment only", "Brand naming only"],
          answer: 0,
          why: "Control compares actual conditions/results with standards or plans and prompts corrective action.",
        },
        chain: [
          ["Procurement assumption breaks", "The plan was based on a lower input cost."],
          ["Cost budget is revised", "Managers update expected expenditure."],
          ["Alternatives are evaluated", "New supplier, redesign, price change or efficiency action may be considered."],
          ["Decision is implemented", "The firm chooses its response."],
          ["Controlling tracks the outcome", "Actual margin, quality and customer response are monitored."],
        ],
        exam: [
          ["1 mark", "Name the management function that detects the cost deviation."],
          ["3 marks", "Explain two corrective alternatives available to management."],
          ["4 marks", "Show the relationship between planning and controlling in this event."],
        ],
      },
      Accountancy: {
        concept: "Cost of goods sold & gross profit",
        prediction: {
          prompt: "If selling price stays unchanged while cost per unit rises, what happens to gross profit per unit?",
          options: ["It tends to fall", "It must rise", "It becomes a liability"],
          answer: 0,
          why: "With unchanged selling price, a higher cost of goods sold leaves a smaller gross profit per unit.",
        },
        chain: [
          ["Purchase/input cost ↑", "Inventory or production cost rises."],
          ["Cost of goods sold pressure ↑", "Higher cost flows into the cost of sales when goods are sold."],
          ["Gross profit/unit ↓ if price unchanged", "The margin is squeezed."],
          ["Profitability ratios may weaken", "Gross profit ratio can fall."],
          ["Pricing & cost control become visible in accounts", "Operational decisions show up in reported performance."],
        ],
        exam: [
          ["2 marks", "State the gross-profit formula."],
          ["4 marks", "Calculate gross profit before and after an input-cost increase."],
          ["6 marks", "Interpret the likely effect on gross-profit ratio if sales price is unchanged."],
        ],
      },
    },
  },
  {
    id: "ad-campaign",
    kicker: "Marketing experiment",
    title: "SmitMart doubles advertising spend",
    headline: "Attention rises. But does attention become profitable demand?",
    story: "SmitMart launches a major campaign. Management expects stronger traffic and sales, but the campaign has a cost and its impact must be separated from other changes.",
    control: { label: "Ad spend index", min: 50, max: 180, step: 10, base: 100, unit: "" },
    entities: ["store", "households"],
    metrics: [
      { label: "Awareness", base: 100, coeff: 0.55, suffix: "" },
      { label: "Traffic", base: 100, coeff: 0.35, suffix: "" },
      { label: "Promotion cost", base: 100, coeff: 0.8, suffix: "" },
      { label: "Conversion pressure", base: 100, coeff: 0.2, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Non-price determinants of demand",
        prediction: {
          prompt: "If advertising changes consumer preference for a product, is this a movement along the same demand curve?",
          options: ["No, it can shift demand", "Yes, always", "Demand theory cannot discuss advertising"],
          answer: 0,
          why: "Advertising can influence tastes/preferences, a non-price determinant of demand, so the demand curve may shift.",
        },
        chain: [
          ["Advertising ↑", "More consumers become aware of the product."],
          ["Preference/awareness may strengthen", "Some buyers value or notice the product more."],
          ["Demand may shift right", "At the same price, more may be demanded if preference changes."],
          ["Sales opportunity ↑", "Actual sales still depend on price, availability and conversion."],
          ["Firm tests whether demand gain persists", "Temporary attention and durable demand are different."],
        ],
        exam: [
          ["1 mark", "Name the non-price determinant involved."],
          ["3 marks", "Differentiate an increase in demand from an increase in quantity demanded."],
          ["4 marks", "Explain how advertising can affect the demand curve."],
        ],
      },
      "Business Studies": {
        concept: "Promotion mix & controlling",
        prediction: {
          prompt: "Advertising belongs to which element of the marketing mix?",
          options: ["Promotion", "Place", "Staffing"],
          answer: 0,
          why: "Advertising is a promotion tool used to communicate with target customers.",
        },
        chain: [
          ["Promotion spend ↑", "The firm commits more resources to communication."],
          ["Reach & awareness ↑", "More target customers may encounter the message."],
          ["Customer response is measured", "Traffic, enquiries and sales are tracked."],
          ["Campaign effectiveness is evaluated", "Management compares outcome with objective and cost."],
          ["Promotion plan is refined", "Future spend shifts toward what actually works."],
        ],
        exam: [
          ["1 mark", "Identify the marketing-mix element."],
          ["3 marks", "Explain three functions of advertising."],
          ["4 marks", "Show how controlling can evaluate an advertising campaign."],
        ],
      },
      Accountancy: {
        concept: "Promotion expense & profit impact",
        prediction: {
          prompt: "An advertising campaign costs more this month. What must happen for profit to improve despite the extra expense?",
          options: ["The campaign must create enough additional contribution/benefit", "Profit must rise automatically", "Sales can fall to zero"],
          answer: 0,
          why: "Higher promotional expense reduces profit unless the campaign produces sufficient additional gross contribution or other benefit.",
        },
        chain: [
          ["Advertising expense ↑", "Operating expenditure increases."],
          ["Sales may respond", "The campaign may create additional revenue."],
          ["Incremental contribution is compared with cost", "Extra sales are not equal to extra profit."],
          ["Operating profit changes", "Net effect depends on campaign benefit versus expense."],
          ["Performance data supports future budgeting", "Accounting numbers help evaluate marketing decisions."],
        ],
        exam: [
          ["2 marks", "Explain why higher sales do not automatically mean higher profit."],
          ["4 marks", "Calculate the minimum additional contribution needed to cover a campaign cost."],
          ["6 marks", "Interpret campaign success using revenue, contribution and expense information."],
        ],
      },
    },
  },
  {
    id: "income-fall",
    kicker: "Household shock",
    title: "Household income falls",
    headline: "Consumers start choosing differently — and every business feels the signal.",
    story: "A slowdown reduces household disposable income. Families reassess discretionary spending, while retailers and manufacturers watch demand patterns change.",
    control: { label: "Income index", min: 70, max: 130, step: 5, base: 100, unit: "" },
    entities: ["households", "store", "factory", "bank"],
    metrics: [
      { label: "Discretionary demand", base: 100, coeff: 0.65, suffix: "" },
      { label: "Retail traffic", base: 100, coeff: 0.35, suffix: "" },
      { label: "Saving capacity", base: 100, coeff: 0.45, suffix: "" },
      { label: "Inventory pressure", base: 100, coeff: -0.3, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Income effect on demand",
        prediction: {
          prompt: "For a normal good, what can happen to demand when consumer income falls, other things equal?",
          options: ["Demand tends to fall", "Demand must rise", "Only quantity demanded changes because price changed"],
          answer: 0,
          why: "Income is a non-price determinant. For a normal good, lower income tends to reduce demand.",
        },
        chain: [
          ["Income ↓", "Households have less purchasing power."],
          ["Discretionary spending is reviewed", "Consumers prioritise essential or higher-value purchases."],
          ["Demand for some normal goods ↓", "The entire demand curve may shift left."],
          ["Business sales signals weaken", "Retailers see lower volume in affected categories."],
          ["Production & investment plans may adjust", "Firms react to changed demand expectations."],
        ],
        exam: [
          ["1 mark", "Identify income as a determinant of demand."],
          ["3 marks", "Explain the likely effect on demand for a normal good."],
          ["4 marks", "Differentiate the effect on a normal good and an inferior good."],
        ],
      },
      "Business Studies": {
        concept: "Business environment & adaptive planning",
        prediction: {
          prompt: "A broad fall in consumer purchasing power is most directly part of which business-environment dimension?",
          options: ["Economic environment", "Technological environment only", "Staffing process"],
          answer: 0,
          why: "Income and demand conditions are part of the economic environment affecting business decisions.",
        },
        chain: [
          ["Economic environment weakens", "Customer purchasing power changes."],
          ["Sales forecasts are revised", "Old demand assumptions may no longer hold."],
          ["Product, price & inventory plans adapt", "Managers respond to the changed market."],
          ["Budgets & targets are reset", "Resources are aligned with the new expectation."],
          ["Control watches recovery or further decline", "New data guides the next decision."],
        ],
        exam: [
          ["1 mark", "Identify the dimension of business environment."],
          ["3 marks", "Explain why understanding business environment helps managers."],
          ["4 marks", "Show how planning would change after a fall in market demand."],
        ],
      },
      Accountancy: {
        concept: "Revenue, inventory & receivable quality",
        prediction: {
          prompt: "If sales slow while purchases remain high, what can happen to inventory holding?",
          options: ["Inventory may accumulate", "Inventory must disappear", "Cash must always rise"],
          answer: 0,
          why: "When goods move more slowly, inventory can remain unsold for longer unless purchases/production adjust.",
        },
        chain: [
          ["Sales volume ↓", "Revenue growth weakens."],
          ["Inventory movement slows", "Unsold stock may remain longer."],
          ["Inventory turnover can weaken", "Average inventory may rise relative to cost of sales."],
          ["Cash conversion slows", "Cash can remain tied up in stock."],
          ["Liquidity & working capital are watched", "The business adjusts purchasing and collection decisions."],
        ],
        exam: [
          ["2 marks", "State what inventory turnover indicates."],
          ["4 marks", "Explain why slower sales can increase working-capital pressure."],
          ["6 marks", "Interpret falling inventory turnover with other liquidity information."],
        ],
      },
    },
  },
  {
    id: "tax-rise",
    kicker: "Policy change",
    title: "An indirect tax rate rises",
    headline: "Government policy changes the price-cost equation overnight.",
    story: "A higher indirect tax applies to a category sold in Commerce City. Businesses must update invoices, pricing and demand expectations while consumers face a changed final price.",
    control: { label: "Indirect tax rate", min: 0, max: 28, step: 1, base: 12, unit: "%" },
    entities: ["government", "store", "factory", "households"],
    metrics: [
      { label: "Tax burden", base: 100, coeff: 2.1, suffix: "" },
      { label: "Consumer price pressure", base: 100, coeff: 1.1, suffix: "" },
      { label: "Demand pressure", base: 100, coeff: -0.65, suffix: "" },
      { label: "Compliance work", base: 100, coeff: 0.7, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Indirect taxes, prices & demand",
        prediction: {
          prompt: "If an indirect tax raises the final price paid by buyers, what direction can quantity demanded move, other things equal?",
          options: ["It can fall", "It must rise", "It cannot react to price"],
          answer: 0,
          why: "A higher final price can reduce quantity demanded, depending on elasticity and other conditions.",
        },
        chain: [
          ["Indirect tax ↑", "Tax attached to the transaction becomes larger."],
          ["Final price may ↑", "Businesses may pass some or all of the burden forward."],
          ["Quantity demanded may ↓", "Consumers react to the higher effective price."],
          ["Tax revenue effect is ambiguous", "Higher rate and lower taxable quantity work in opposite directions."],
          ["Market behaviour depends on elasticity", "Who bears more burden depends partly on responsiveness."],
        ],
        exam: [
          ["1 mark", "Classify the tax as direct or indirect."],
          ["3 marks", "Explain one way an indirect-tax increase can affect demand."],
          ["4 marks", "Discuss why the tax-revenue effect cannot be inferred from the rate alone."],
        ],
      },
      "Business Studies": {
        concept: "Legal/economic environment & pricing",
        prediction: {
          prompt: "Which external force requires the firm to change invoice treatment and compliance?",
          options: ["Legal/regulatory environment", "Informal organisation only", "Staff selection"],
          answer: 0,
          why: "A binding tax rule is an external regulatory/legal requirement that business must follow.",
        },
        chain: [
          ["Regulation changes", "The firm must comply with the new tax rule."],
          ["Pricing data is recalculated", "Management checks tax-inclusive customer price and margin."],
          ["Communication is updated", "Customers and staff need accurate price information."],
          ["Demand response is monitored", "Higher final price may change sales."],
          ["Plan is corrected", "Pricing, inventory and targets are revised using actual data."],
        ],
        exam: [
          ["1 mark", "Identify the business-environment force involved."],
          ["3 marks", "Explain why business environment is dynamic."],
          ["4 marks", "Show how the policy change can affect marketing and planning decisions."],
        ],
      },
      Accountancy: {
        concept: "Invoice value, tax liability & records",
        prediction: {
          prompt: "When a tax charged on a sale rises, does the entire amount collected automatically become sales revenue?",
          options: ["No, tax collected can create a separate liability/settlement amount", "Yes, always", "It becomes fixed assets"],
          answer: 0,
          why: "Amounts collected on behalf of government are accounted for separately from the business's own revenue, subject to applicable rules.",
        },
        chain: [
          ["Tax rate changes", "Invoice calculation changes."],
          ["Tax component collected changes", "The amount attached to taxable sales differs."],
          ["Sales and tax are tracked separately", "Revenue and statutory amounts are not the same economic claim."],
          ["Settlement/compliance entries change", "Records support the amount payable or creditable under applicable rules."],
          ["Cash timing is monitored", "Collection from customers and remittance timing affect cash planning."],
        ],
        exam: [
          ["2 marks", "Explain why tax collected is not the same as sales revenue."],
          ["4 marks", "Prepare a simple invoice split between taxable value and tax."],
          ["6 marks", "Explain the cash-flow importance of separating business revenue from statutory collections."],
        ],
      },
    },
  },
  {
    id: "expansion-loan",
    kicker: "Big decision",
    title: "NovaWorks wants a new factory",
    headline: "Growth sounds exciting. The financing choice changes risk, cash flow and control.",
    story: "NovaWorks can fund expansion using more debt, new equity, retained earnings, or a mix. The decision affects cost, ownership, leverage and future flexibility.",
    control: { label: "Debt share of new funding", min: 0, max: 100, step: 10, base: 50, unit: "%" },
    entities: ["factory", "bank", "supplier", "households"],
    metrics: [
      { label: "Leverage", base: 100, coeff: 0.8, suffix: "" },
      { label: "Interest commitment", base: 100, coeff: 0.7, suffix: "" },
      { label: "Ownership dilution", base: 100, coeff: -0.65, suffix: "" },
      { label: "Financial risk", base: 100, coeff: 0.55, suffix: "" },
    ],
    lenses: {
      Economics: {
        concept: "Investment & cost of finance",
        prediction: {
          prompt: "If the expected return on a project falls below its financing cost and risk-adjusted requirement, what may management do?",
          options: ["Delay or reject the investment", "Invest more automatically", "Ignore financing cost"],
          answer: 0,
          why: "Investment decisions compare expected benefits with cost and risk; unattractive projects may be postponed or rejected.",
        },
        chain: [
          ["Expansion opportunity appears", "The firm expects future demand."],
          ["Expected return is estimated", "Future revenue and cost are assessed."],
          ["Financing cost is compared", "Interest rates and required returns matter."],
          ["Investment decision is made", "The firm commits only if the opportunity is acceptable."],
          ["Capacity & future supply may change", "Successful investment can raise productive capacity over time."],
        ],
        exam: [
          ["1 mark", "State one factor influencing investment demand."],
          ["3 marks", "Explain why interest rates can affect private investment."],
          ["4 marks", "Trace how business investment can influence aggregate demand and future capacity."],
        ],
      },
      "Business Studies": {
        concept: "Financing decision & capital structure",
        prediction: {
          prompt: "Choosing the mix of debt and equity is part of which financial decision?",
          options: ["Financing decision", "Dividend decision only", "Marketing decision"],
          answer: 0,
          why: "The financing decision determines the sources and mix of funds used by the business.",
        },
        chain: [
          ["Funding need is estimated", "The expansion requires long-term finance."],
          ["Debt-equity options are compared", "Cost, risk, control and cash-flow capacity matter."],
          ["Capital structure is chosen", "Management selects the funding mix."],
          ["Funds are committed to assets", "The investment decision turns finance into productive capacity."],
          ["Performance is monitored", "Returns and financing commitments are compared with the plan."],
        ],
        exam: [
          ["1 mark", "Identify the financial decision."],
          ["3 marks", "Explain three factors affecting capital-structure choice."],
          ["4 marks", "Distinguish financing decision from investment decision using this case."],
        ],
      },
      Accountancy: {
        concept: "Debt-equity, interest & cash-flow commitments",
        prediction: {
          prompt: "As debt financing rises relative to equity, what generally happens to the debt-equity ratio?",
          options: ["It rises", "It falls to zero", "It becomes unrelated to debt"],
          answer: 0,
          why: "More debt relative to shareholders' funds increases leverage, other things equal.",
        },
        chain: [
          ["Debt share ↑", "Borrowed funds form a larger part of finance."],
          ["Debt-equity ratio ↑", "Financial leverage becomes higher."],
          ["Interest commitment ↑", "Debt creates contractual finance cost."],
          ["Cash-flow pressure can ↑", "Interest and repayment must be serviced."],
          ["Return and risk need joint interpretation", "Leverage can amplify outcomes but also financial risk."],
        ],
        exam: [
          ["2 marks", "State the debt-equity ratio formula."],
          ["4 marks", "Calculate the ratio before and after new borrowing."],
          ["6 marks", "Interpret whether higher leverage is automatically good or bad."],
        ],
      },
    },
  },
];

export const COMMERCE_CITY_LENSES = ["Economics", "Business Studies", "Accountancy"];

export function dailyScenarioIndex(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date - start) / 86400000);
  return Math.abs(day) % COMMERCE_CITY_SCENARIOS.length;
}
