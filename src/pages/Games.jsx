import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ══════════════════════════════════════════════════════════
// SCENARIO DATABASE
// ══════════════════════════════════════════════════════════

const CHAPTERS = [
  // ── CHAPTER 1: THEORY OF DEMAND ─────────────────────────
  {
    id: 'demand', emoji: '📥', title: 'Theory of Demand',
    subtitle: 'Normal, Inferior, Giffen, Substitute & Veblen goods',
    color: '#60a5fa', cbse: 'Class 11 & 12 · Microeconomics',
    levels: {
      1: {
        label: 'Easy', emoji: '🟢', desc: 'Basic demand shifts — just common sense!',
        scenarios: [
          { emoji:'☕', product:'Chai', news:"It's peak winter and everyone craves hot chai!", q:'What happens to DEMAND for chai?', type:'binary', change:'up', exp:'Cold weather → More people want chai → Demand INCREASES → Price goes UP! ☕', concept:'Seasonal Demand Shift', tip:'Season change is a NON-PRICE factor. It shifts the ENTIRE demand curve (not a movement along it).' },
          { emoji:'🥭', product:'Mangoes', news:"Everyone got huge salary hikes this year!", q:'What happens to DEMAND for mangoes (a normal good)?', type:'binary', change:'up', exp:'Income rises → Can afford more → Demand for normal goods INCREASES! 🥭', concept:'Normal Good — Income Effect', tip:'Normal goods: Income ↑ → Demand ↑. Most everyday goods are normal goods.' },
          { emoji:'🥤', product:'Pepsi', news:"Price of Coca-Cola increased sharply due to new tax!", q:'What happens to DEMAND for Pepsi?', type:'binary', change:'up', exp:"Coke got expensive → People switch to Pepsi → Pepsi demand RISES! 🥤", concept:'Substitute Goods', tip:'Substitute goods are alternatives. Price of one ↑ → Demand for substitute ↑.' },
          { emoji:'🍫', product:'Chocolate', news:"A study says eating chocolate causes a serious disease!", q:'What happens to DEMAND for chocolate?', type:'binary', change:'down', exp:'Health scare → People scared → Demand FALLS! 😱', concept:'Change in Taste/Preference', tip:'Taste change is a demand shifter. Bad news = demand falls, shifts curve LEFT.' },
          { emoji:'🏏', product:'Cricket Bats', news:"India won the T20 World Cup! Cricket fever everywhere!", q:'What happens to DEMAND for cricket bats?', type:'binary', change:'up', exp:'World Cup win → Cricket craze → Demand SURGES! 🏆', concept:'Taste & Craze', tip:'Cultural events and trends are taste factors. They shift the whole demand curve.' },
          { emoji:'❄️', product:'Air Conditioners', news:"Summer temperature hits record 50°C across North India!", q:'What happens to DEMAND for ACs?', type:'binary', change:'up', exp:'Extreme heat → Everyone NEEDS an AC → Demand EXPLODES! 🌡️', concept:'Climate — Demand Shifter', tip:'Climate is a demand shifter for seasonal goods. It shifts the curve, not a movement on it.' },
          { emoji:'🧥', product:'Woollen Clothes', news:"It is now April and summer is arriving.", q:'What happens to DEMAND for woollen clothes?', type:'binary', change:'down', exp:'Summer coming → Nobody needs warm clothes → Demand DECREASES! ☀️', concept:'Off-Season Demand Drop', tip:"Off-season ends the craze. Demand curve shifts LEFT." },
          { emoji:'🎬', product:'Movie Tickets', news:"A new city with 5 lakh new residents opened nearby!", q:'What happens to DEMAND for movie tickets in that area?', type:'binary', change:'up', exp:'More people in city → More buyers → Demand RISES! 👥', concept:'Number of Consumers', tip:'More buyers in market = demand curve shifts RIGHT. Population is a key demand shifter.' },
        ]
      },
      2: {
        label: 'Medium', emoji: '🟡', desc: 'Inferior goods, substitutes & complements — tricky!',
        scenarios: [
          { emoji:'🚌', product:'Local Bus', news:"Everyone's income doubled due to massive salary hikes!", q:'What happens to DEMAND for local bus travel?', type:'binary', change:'down', exp:"Income rises → People buy scooters/cars → Don't need buses → Demand FALLS! 🚗", concept:'Inferior Good', tip:'Inferior goods: Income ↑ → Demand ↓. People switch to BETTER alternatives when richer.' },
          { emoji:'🚗', product:'Cars', news:"Petrol prices doubled from ₹100 to ₹200 per litre!", q:'What happens to DEMAND for cars?', type:'binary', change:'down', exp:'Petrol is a complement to cars → Petrol expensive → Running a car is costly → Car demand FALLS! ⛽', concept:'Complementary Goods', tip:'Complements are used TOGETHER. Price of complement ↑ → Demand for BOTH falls.' },
          { emoji:'🌾', product:'Cheap Atta', news:"Recession hit — people earning much less than before.", q:'What happens to DEMAND for cheap atta?', type:'binary', change:'up', exp:"Income falls → Can't afford quality food → Switch to cheap items → Demand RISES! 📉", concept:'Inferior Good (Income falls)', tip:'When income falls, inferior goods become MORE attractive. Demand rises!' },
          { emoji:'☕', product:'Tea', news:"Price of coffee increased by 40% due to bad harvest!", q:'What happens to DEMAND for tea?', type:'binary', change:'up', exp:'Coffee expensive → People switch to tea (substitute) → Tea demand RISES! ☕', concept:'Substitute Goods', tip:'Tea & coffee are close substitutes. Price of one ↑ → Demand for other ↑.' },
          { emoji:'🖨️', product:'Ink Cartridges', news:"Printers became 60% cheaper due to new manufacturing tech!", q:'What happens to DEMAND for ink cartridges?', type:'binary', change:'up', exp:'Cheap printers → More people buy printers → Need more ink → Ink demand RISES! 🖨️', concept:'Complementary Goods', tip:'Printers & ink are complements. Printer price ↓ → More printers sold → More ink needed.' },
          { emoji:'🍜', product:'Instant Noodles', news:"Job losses led to people's incomes falling sharply by 50%.", q:'What happens to DEMAND for cheap instant noodles?', type:'binary', change:'up', exp:"Income falls → Can't afford restaurants → Switch to cheap noodles → Demand RISES! 💸", concept:'Inferior Good', tip:"As income falls, inferior goods become more attractive — they're the affordable fallback." },
          { emoji:'🍬', product:'Sugar', news:"Price of tea rose sharply. Many people stopped drinking tea.", q:'What happens to DEMAND for sugar (used mainly in tea)?', type:'binary', change:'down', exp:'Tea demand fell → Less tea made → Less sugar needed → Sugar demand FALLS! 📉', concept:'Complementary Goods (Chain Effect)', tip:'Sugar & tea are complements. If tea demand falls, sugar demand also falls — chain reaction!' },
          { emoji:'🏋️', product:'Gym Memberships', news:"A famous influencer: 'Gym is outdated. Do yoga at home!'", q:'What happens to DEMAND for gym memberships?', type:'binary', change:'down', exp:'Social media trend → Taste shifts away from gym → Demand FALLS! 📱', concept:'Change in Taste (Social Media)', tip:'Social media trends are a modern demand shifter. They change preferences rapidly!' },
        ]
      },
      3: {
        label: 'Hard', emoji: '🔴', desc: 'Giffen goods, Veblen goods & exceptions — experts only!',
        scenarios: [
          { emoji:'🌾', product:'Bajra (Giffen Good)', news:"Price of bajra (cheap grain) rises. Ultra-poor families can't afford any better food, so they actually buy MORE bajra.", q:'What type of good is bajra for these families?', type:'mcq', options:['Normal Good','Inferior Good','Giffen Good','Substitute Good'], correct:2, exp:"GIFFEN GOOD! Price ↑ → Real income falls → Can't afford wheat/rice → Buy even MORE bajra. Income Effect > Substitution Effect! 🤯", concept:'Giffen Good', tip:'Giffen goods: Price ↑ → Demand ↑ (EXCEPTION to law of demand). Only extreme inferior goods consumed by very poor people.' },
          { emoji:'⌚', product:'Luxury Watch', news:"A premium watch RAISED its price from ₹5L to ₹8L. Surprisingly MORE rich people bought it — became a status symbol!", q:'What type of good is this luxury watch?', type:'mcq', options:['Normal Good','Inferior Good','Giffen Good','Veblen/Prestige Good'], correct:3, exp:'VEBLEN GOOD! Higher price = more exclusive = more status = more demand! Rich buy expensive things to show off. Price ↑ → Demand ↑! 💎', concept:'Veblen/Prestige Good', tip:'Veblen goods: Price ↑ → Demand ↑ (EXCEPTION). Bought for STATUS/PRESTIGE. Examples: luxury cars, designer bags, premium watches.' },
          { emoji:'👜', product:'Designer Bag', news:"A luxury bag had a 60% SALE. Surprisingly, sales DROPPED — customers stopped seeing it as prestigious.", q:'This shows the bag is a...', type:'mcq', options:['Inferior good — income effect','Giffen good — no substitutes','Veblen good — prestige lost when cheap','Complementary good'], correct:2, exp:'Classic Veblen effect reversed! The bag was bought for STATUS. When it became cheap → Lost exclusivity → Demand FELL. 👜', concept:'Veblen Good (Reverse Effect)', tip:'TRICK: For Veblen goods, price FALL can also reduce demand (lost prestige). Both rise and fall can reduce demand depending on perception!' },
          { emoji:'🚌', product:'Bus Travel', news:"Economic crisis — thousands lost jobs, income fell 70%. Bus ridership INCREASED even as fares went up slightly.", q:'This confirms bus travel is an...', type:'mcq', options:['Normal good','Inferior good — demand rises when income falls','Complementary good','Giffen good'], correct:1, exp:"Bus travel is INFERIOR! Income fell → Can't afford cars/Ola → Back to buses → Demand RISES! Classic inferior good behavior. 🚌", concept:'Inferior Good Confirmed', tip:'Inferior goods: demand INCREASES when income DECREASES. Examples: local bus, cheap flour, second-hand goods.' },
          { emoji:'🥛', product:'Milk', news:"People EXPECT milk prices to rise next month. Today's price hasn't changed yet.", q:"What happens to TODAY's demand for milk?", type:'mcq', options:["Demand falls — people will wait","Demand rises — people stock up NOW","No change — price hasn't changed yet","Demand falls — inflation fear"], correct:1, exp:'Expectation of future price rise → People buy and stock up NOW → Today\'s demand RISES! This is "future price expectation" demand shifter! 🥛📦', concept:'Future Price Expectation', tip:'Expected price rise → Current demand rises (people stock up). Expected price fall → Current demand falls (people wait). TRICKY board question!' },
          { emoji:'🧂', product:'Salt', news:"Salt price doubled. Consumption barely changed — people still bought almost the same amount.", q:"Salt's price elasticity of demand (PED) is...", type:'mcq', options:['Perfectly elastic — PED = ∞','Elastic — PED > 1','Inelastic — PED < 1','Perfectly inelastic — PED = 0'], correct:2, exp:'Salt = necessity with no substitutes → Even when price doubles, quantity barely changes → INELASTIC demand (PED < 1)! 🧂', concept:'Price Elasticity — Inelastic', tip:'Inelastic demand: necessities, no substitutes, small % of income. PED < 1 means % change in Qty < % change in Price.' },
          { emoji:'🚘', product:'Electric Cars', news:"Price of petrol rose sharply. More people started buying electric cars instead.", q:'Petrol and electric cars are...', type:'mcq', options:['Complementary goods','Substitute goods','Independent goods','Giffen goods'], correct:1, exp:'Petrol cars & EVs are SUBSTITUTES! Petrol expensive → Switch to electric alternative → EV demand RISES! Classic substitute relationship! 🚘⚡', concept:'Substitute Goods', tip:'Substitute goods replace each other. When one gets expensive, consumers switch to the substitute. Very common board example!' },
          { emoji:'🍕', product:'Pizza', news:"Pizza and cold drinks are always consumed together. Pizza price rose by 50%.", q:'What happens to demand for cold drinks?', type:'mcq', options:['Rises — substitutes','Falls — complements so joint demand drops','Stays same — independent goods','Rises — Giffen good'], correct:1, exp:'Pizza & cold drinks are COMPLEMENTS — consumed together. Pizza price ↑ → Less pizza ordered → Less cold drink needed → Cold drink demand FALLS! 🍕🥤', concept:'Complementary Goods', tip:'Complements are jointly demanded. Price of one ↑ → Demand for BOTH falls. Board FAVOURITE — always draw the diagram!' },
        ]
      }
    }
  },

  // ── CHAPTER 2: THEORY OF SUPPLY ─────────────────────────
  {
    id: 'supply', emoji: '📤', title: 'Theory of Supply',
    subtitle: 'Input costs, technology, taxes, subsidies & elasticity',
    color: '#34d399', cbse: 'Class 12 · Microeconomics',
    levels: {
      1: {
        label: 'Easy', emoji: '🟢', desc: 'Basic supply shifts — production factors',
        scenarios: [
          { emoji:'🌾', product:'Wheat', news:"New high-yield seeds and improved irrigation doubled wheat output!", q:'What happens to SUPPLY of wheat?', type:'binary', change:'up', exp:'Better technology → Produce more from same resources → Supply INCREASES! 🌾', concept:'Technology Improvement', tip:'Technology is a supply shifter. Better tech → Lower cost → More profitable → Supply rises.' },
          { emoji:'🔩', product:'Steel', news:"Price of coal (raw material for steel) tripled!", q:'What happens to SUPPLY of steel?', type:'binary', change:'down', exp:'Raw material expensive → Costly to produce → Less profit → Supply FALLS! 🔩', concept:'Input Cost Increase', tip:'Input/raw material cost ↑ → Supply ↓. Input cost ↓ → Supply ↑. Very common board concept.' },
          { emoji:'🥦', product:'Vegetables', news:"Government announced ₹10,000/acre subsidy for farmers!", q:'What happens to SUPPLY of vegetables?', type:'binary', change:'up', exp:'Subsidy reduces cost → More profit per unit → Farmers grow more → Supply RISES! 🌱', concept:'Government Subsidy', tip:'Subsidy = financial help from govt → Reduces producer cost → Supply increases. Tax does opposite.' },
          { emoji:'🚬', product:'Cigarettes', news:"Government put ₹50 extra tax on each pack!", q:'What happens to SUPPLY of cigarettes?', type:'binary', change:'down', exp:'New tax → Production more expensive → Less profit → Supply DECREASES! 📉', concept:'Tax Imposed', tip:'Tax increases per-unit cost → Supply falls. Tax ↑ → Supply ↓. Important supply shifter!' },
          { emoji:'📱', product:'Mobile Phones', news:"5 new phone brands entered the Indian market!", q:'What happens to SUPPLY of mobile phones?', type:'binary', change:'up', exp:'More manufacturers → More phones produced → Market supply INCREASES! 📱', concept:'Number of Sellers', tip:'More sellers → Total supply rises. Fewer sellers → Supply falls.' },
          { emoji:'🥭', product:'Mangoes', news:"It's summer — mango season is at its peak!", q:'What happens to SUPPLY of mangoes?', type:'binary', change:'up', exp:'Mango season → Max produce comes to market → Supply HIGH! 🥭', concept:'Seasonal/Natural Factor', tip:'Seasonal goods have high supply in-season, low supply off-season.' },
          { emoji:'🧅', product:'Onions', news:"Severe drought destroyed 40% of onion crops in Maharashtra!", q:'What happens to SUPPLY of onions?', type:'binary', change:'down', exp:'Natural disaster destroys crops → Less harvested → Supply FALLS drastically! 🌧️', concept:'Natural Disaster (Supply Shock)', tip:'Natural shocks (drought, flood, pest) reduce agricultural supply — negative supply shock.' },
          { emoji:'💻', product:'Laptops', news:"Labour costs increased 30% due to minimum wage hike!", q:'What happens to SUPPLY of laptops?', type:'binary', change:'down', exp:'Higher wages = higher cost → Less profit margin → Supply FALLS! 💻', concept:'Labour Cost Increase', tip:'Labour is an input. Wage rise → Cost of production rises → Supply falls.' },
        ]
      },
      2: {
        label: 'Medium', emoji: '🟡', desc: 'Price expectations, regulations & tricky shifts',
        scenarios: [
          { emoji:'💊', product:'Medicines', news:"Govt regulated medicine prices — only cost + 10% profit allowed.", q:'What likely happens to SUPPLY of medicines over time?', type:'binary', change:'down', exp:'Price cap = low profit → Less incentive to produce → Pharmaceutical supply REDUCES! 💊', concept:'Government Price Regulation', tip:'Price ceiling below equilibrium → Reduces supply incentive → Long-run shortage.' },
          { emoji:'🍚', product:'Rice', news:"Farmers EXPECT rice prices to rise next month. They hold their stock.", q:'What happens to CURRENT supply of rice?', type:'binary', change:'down', exp:'Future price expectation → Farmers hoard stock → Less sent to market → Current supply FALLS! 📦', concept:'Future Price Expectation (Sellers)', tip:'Sellers: Expected future price rise → Hold back supply now → Current supply falls.' },
          { emoji:'⛽', product:'Petrol', news:"Automation (robots) replaced 60% of assembly-line workers in oil refineries!", q:'What happens to SUPPLY of petrol?', type:'binary', change:'up', exp:'Automation → Lower labour cost → Cheaper to produce → More profit → Supply RISES! 🤖', concept:'Technology (Automation)', tip:'Any cost-reducing technology increases supply. Automation = labour cost falls → Supply up.' },
          { emoji:'🥛', product:'Milk', news:"Disease killed 30% of all dairy cattle in Gujarat.", q:'What happens to SUPPLY of milk?', type:'binary', change:'down', exp:'Fewer cattle → Less milk produced → Supply FALLS sharply! 🐄', concept:'Reduction in Factors of Production', tip:'Loss of natural resources or livestock is a supply shock. Shifts supply curve leftward.' },
          { emoji:'☀️', product:'Solar Panels', news:"Government launched Production-Linked Incentive (PLI) scheme for solar panels!", q:'What happens to SUPPLY of solar panels?', type:'binary', change:'up', exp:'PLI scheme = government incentive → Encourages more production → Supply INCREASES! ☀️', concept:'Government Incentive/PLI', tip:'PLI, subsidies, grants reduce effective cost for producers → Supply rises.' },
          { emoji:'🌿', product:'Cotton Cloth', news:"Cotton and polyester use same machines. Polyester price rose sharply, so factories switched to polyester.", q:'What happens to SUPPLY of cotton cloth?', type:'binary', change:'down', exp:'Polyester more profitable → Factories shift production → Cotton supply FALLS! Competitive supply! 🌿', concept:'Competitive Supply', tip:'When two goods compete for same resources, higher price of one → Supply of other falls.' },
          { emoji:'🐄', product:'Leather', news:"Beef production increased significantly due to export demand.", q:'What happens to SUPPLY of leather (by-product of beef)?', type:'binary', change:'up', exp:'More beef → More hides → More leather → Leather supply RISES! This is JOINT SUPPLY! 🐄', concept:'Joint Supply (By-products)', tip:'Joint supply: two goods produced together. More of one = more of other. E.g. beef & leather, wool & mutton.' },
          { emoji:'🛺', product:'Old Autos', news:"Govt banned production of old-style 2-stroke auto engines for pollution!", q:'What happens to SUPPLY of old-style autos?', type:'binary', change:'down', exp:'Government ban → Cannot legally produce them → Supply FALLS to zero for banned type! 🚫', concept:'Legal/Regulatory Restriction', tip:'Government regulations can sharply reduce supply — bans, quotas, production restrictions.' },
        ]
      },
      3: {
        label: 'Hard', emoji: '🔴', desc: 'Elasticity of supply, tax incidence & advanced concepts',
        scenarios: [
          { emoji:'🌾', product:'Wheat (Tax Incidence)', news:"Wheat supply is inelastic (short run). Govt puts ₹20/kg tax. Who bears the burden?", q:'When supply is inelastic, tax burden falls mostly on...', type:'mcq', options:['Consumers — they pay more','Producers — they absorb cost','Government subsidizes it','Both always equally'], correct:1, exp:"Inelastic supply → Producers CAN'T easily reduce supply → They absorb most of the tax! Incidence on PRODUCERS! 🌾", concept:'Tax Incidence — Inelastic Supply', tip:'Inelastic supply → Producers bear more tax burden. Inelastic demand → Consumers bear more. Very important for boards!' },
          { emoji:'⛽', product:'Petrol (Tax Incidence)', news:"Petrol is a necessity with no substitutes. Govt imposes ₹15/litre tax.", q:'Who bears the petrol tax burden?', type:'mcq', options:['Producers absorb it','Consumers — inelastic demand means they pay','Split equally','Neither — market disappears'], correct:1, exp:'Inelastic demand (necessity) → Consumers MUST buy petrol → Producers pass almost ALL tax to consumers! 💸', concept:'Tax Incidence — Inelastic Demand', tip:'Petrol, salt, medicines have inelastic demand → Tax is passed to consumers. Govt taxes necessities heavily for this reason!' },
          { emoji:'🥇', product:'Gold', news:"Supply of gold is fixed (can't create more). Price doubles. What happens to quantity supplied?", q:'When supply is perfectly inelastic...', type:'mcq', options:['Quantity supplied doubles','Quantity supplied stays SAME','Quantity supplied halves','Supply curve shifts right'], correct:1, exp:"Perfectly inelastic supply → Quantity doesn't change regardless of price! Supply curve is VERTICAL. Gold reserves are fixed! 🥇", concept:'Perfectly Inelastic Supply (PES = 0)', tip:'Perfectly inelastic supply: PES = 0, vertical supply curve. Examples: Land, antiques, limited-edition items.' },
          { emoji:'🏺', product:'Handmade Pottery', news:"Price of handmade pottery doubled. But potters can't produce much more — skill takes years to learn.", q:'Supply of handmade pottery is most likely...', type:'mcq', options:['Perfectly elastic — PES = ∞','Elastic — PES > 1','Inelastic — PES < 1','Perfectly inelastic — PES = 0'], correct:2, exp:"Skill-based crafts with long training → Can't quickly increase supply even if price rises → INELASTIC supply (PES < 1)! 🏺", concept:'Inelastic Supply (Skill-Based)', tip:'Supply inelastic when: long production time, specific skills, hard to expand. PES < 1.' },
          { emoji:'⚡', product:'Electricity', news:"Coal price rises AND govt removes electricity subsidy AT THE SAME TIME.", q:'What happens to supply of electricity?', type:'mcq', options:['Supply increases — tech compensates','Supply DECREASES — both factors reduce it','No change — effects cancel','Cannot determine'], correct:1, exp:'BOTH factors push supply DOWN: (1) Coal expensive → Higher cost. (2) Subsidy removed → Less support. Combined = significant supply decrease! ⚡', concept:'Multiple Supply Shifters (Same Direction)', tip:'When multiple supply factors work in same direction → Effect is certain and cumulative.' },
          { emoji:'🏢', product:'Apartments', news:"Apartment prices doubled. But supply barely increased — construction takes 3-4 years.", q:'This shows which concept about supply elasticity?', type:'mcq', options:['Supply is elastic always','Supply is inelastic in short run but elastic in long run','Price has no effect','Apartments are Giffen goods'], correct:1, exp:'TIME PERIOD matters! Short run: inelastic (can\'t build fast). Long run: more construction → supply becomes more elastic. ⏰🏢', concept:'Time Period & Supply Elasticity', tip:'Supply is MORE elastic in LONG RUN than short run. Time allows producers to adjust capacity. Very important!' },
          { emoji:'🪑', product:'Chairs & Tables', news:"A factory makes EITHER chairs OR tables on same machines. Chair prices rose 50%.", q:'What happens to supply of tables?', type:'mcq', options:['Increases — everything goes up','DECREASES — factory shifts to chairs','Stays same','Increases due to joint supply'], correct:1, exp:'COMPETITIVE SUPPLY! Chairs more profitable → Factory makes more chairs & fewer tables → Table supply FALLS! 🪑', concept:'Competitive Supply', tip:'Competitive supply: same resources produce two goods. Higher price of A → More A made → Less B made → B supply falls.' },
          { emoji:'📊', product:'PES Calculation', news:"Price rose from ₹100 to ₹120 (20% rise). Quantity supplied rose from 500 to 600 units (20% rise).", q:'What is the Price Elasticity of Supply (PES)?', type:'mcq', options:['PES = 0.5 (inelastic)','PES = 1 (unit elastic)','PES = 2 (elastic)','PES = ∞ (perfectly elastic)'], correct:1, exp:'PES = % change in Qty Supplied ÷ % change in Price = 20% ÷ 20% = 1. Unit elastic supply! Proportional response! 📊', concept:'PES = 1 (Unit Elastic)', tip:'PES = % ΔQs ÷ % ΔP. PES = 1 (unit elastic), PES < 1 (inelastic), PES > 1 (elastic). Must memorize formula!' },
        ]
      }
    }
  },

  // ── CHAPTER 3: MARKET EQUILIBRIUM ───────────────────────
  {
    id: 'equilibrium', emoji: '⚖️', title: 'Market Equilibrium',
    subtitle: 'Price & quantity effects when demand/supply curves shift',
    color: '#D4AF37', cbse: 'Class 12 · Microeconomics Ch. 5',
    levels: {
      1: {
        label: 'Easy', emoji: '🟢', desc: 'Single curve shifts — find the new equilibrium',
        scenarios: [
          { emoji:'🧅', product:'Onions', news:"Floods destroyed onion crops (supply fell). Demand stayed same.", q:'What happens to PRICE of onions?', type:'binary', change:'up', exp:'Supply ↓ + Demand same → Less onions → Price RISES to new equilibrium! 🧅', concept:'Supply Decrease → Price Rises', tip:'Supply falls, demand constant → Price rises, quantity falls. Always draw the diagram!' },
          { emoji:'📱', product:'Smartphones', news:"5 new phone brands entered India. Supply doubled. Demand stayed same.", q:'What happens to PRICE of smartphones?', type:'binary', change:'down', exp:'Supply ↑ + Demand same → Excess phones → Price FALLS! 📱', concept:'Supply Increase → Price Falls', tip:'Supply rises, demand constant → Price falls, quantity rises. New equilibrium at lower price!' },
          { emoji:'🥭', product:'Mangoes', news:"Summer craze for mangoes! Demand surged. Supply stayed same.", q:'What happens to PRICE of mangoes?', type:'binary', change:'up', exp:'Demand ↑ + Supply same → Excess demand → Price RISES! Buyers compete for scarce mangoes! 🥭', concept:'Demand Increase → Price Rises', tip:'Demand rises, supply constant → Price rises, quantity rises. Classic equilibrium shift!' },
          { emoji:'🧥', product:'Woollen Jackets', news:"Summer arrived — demand for jackets fell. Supply stayed same.", q:'What happens to PRICE of woollen jackets?', type:'binary', change:'down', exp:'Demand ↓ + Supply same → Excess stock → Sellers cut Price to clear inventory! 🧥', concept:'Demand Decrease → Price Falls', tip:'Demand falls, supply same → Price falls, quantity falls. Sellers must discount to sell!' },
          { emoji:'🎭', product:'Theatre Tickets', news:"2000 tickets available (fixed). Celebrity endorsed it — demand doubled overnight!", q:'What happens to the PRICE of tickets?', type:'binary', change:'up', exp:'Fixed supply + Demand doubled → Severe shortage → Price SKYROCKETS! Black market emerges! 🎭', concept:'Fixed Supply + Demand Surge', tip:'When supply is fixed (perfectly inelastic) and demand rises → Price rises sharply. Quantity stays same!' },
          { emoji:'⛽', product:'Petrol', news:"New oil reserves found — more petrol available in market. Demand same.", q:'What happens to QUANTITY of petrol sold?', type:'binary', change:'up', exp:'Supply ↑ (new reserves) → Lower price → More people buy → Equilibrium QUANTITY rises! ⛽', concept:'Supply Increase → Quantity Rises', tip:'Supply rises → Price falls AND quantity RISES. Students often forget that BOTH price and quantity change!' },
          { emoji:'🍊', product:'Oranges', news:"Record orange harvest (supply up). People health-conscious so demand also rose.", q:'What happens to QUANTITY of oranges traded?', type:'binary', change:'up', exp:'Both D and S rose → DEFINITELY more oranges traded → QUANTITY rises for sure! (Price change is uncertain) 🍊', concept:'Both D & S Rise → Quantity Definitely Up', tip:'When BOTH D and S shift same direction → QUANTITY change is CERTAIN. Price change is UNCERTAIN.' },
          { emoji:'🌽', product:'Corn', news:"New farming tech (supply up) AND people started avoiding corn (demand fell).", q:'What DEFINITELY happens to the PRICE of corn?', type:'binary', change:'down', exp:'Supply ↑ (tech) AND Demand ↓ (preference) → Both forces push price DOWN → Price DEFINITELY falls! 🌽', concept:'Supply Up + Demand Down → Price Definitely Falls', tip:'Supply rises + Demand falls → Price DEFINITELY falls. Quantity change is uncertain (depends on magnitude).' },
        ]
      },
      2: {
        label: 'Medium', emoji: '🟡', desc: 'Both curves shift — determine price & quantity effects',
        scenarios: [
          { emoji:'🧅', product:'Onions', news:"Floods destroyed crops (supply FELL) AND panic buying increased demand!", q:'What DEFINITELY happens to PRICE?', type:'binary', change:'up', exp:'Supply ↓ AND Demand ↑ → BOTH push price UP → Price DEFINITELY rises! (Quantity change is ambiguous) 🧅', concept:'D rises + S falls → Price DEFINITELY UP', tip:'Supply falls + Demand rises → Price DEFINITELY rises. Quantity change is uncertain. EXAM FAVOURITE!' },
          { emoji:'🚗', product:'Electric Cars', news:"Tech improved (supply rose) AND eco-consciousness made more people want EVs (demand rose).", q:'What DEFINITELY happened to QUANTITY of EVs sold?', type:'binary', change:'up', exp:'Supply ↑ AND Demand ↑ → Both push quantity UP → QUANTITY DEFINITELY rises! Price effect is uncertain. ⚡🚗', concept:'Both Rise → Quantity DEFINITELY UP', tip:'When D and S both rise → Quantity DEFINITELY rises. Price is UNCERTAIN (ambiguous).' },
          { emoji:'🚕', product:'Taxi Rides', news:"Ola/Uber added drivers (supply rose) BUT metro rail reduced taxi need (demand fell).", q:'What DEFINITELY happened to PRICE of taxi rides?', type:'binary', change:'down', exp:'Supply ↑ (more drivers) AND Demand ↓ (metro competition) → Both push price DOWN → Price DEFINITELY fell! 🚕', concept:'D falls + S rises → Price DEFINITELY DOWN', tip:'Supply rises + Demand falls → Price DEFINITELY falls. Quantity is uncertain.' },
          { emoji:'🍞', product:'Bread', news:"Wheat price rose (bread supply fell) AND recession reduced income (bread demand fell too).", q:'What DEFINITELY happened to QUANTITY of bread sold?', type:'binary', change:'down', exp:'Supply ↓ (costly wheat) AND Demand ↓ (recession) → Both push quantity DOWN → Quantity DEFINITELY fell! 🍞', concept:'Both Fall → Quantity DEFINITELY DOWN', tip:'When D and S both fall → Quantity DEFINITELY falls. Price is UNCERTAIN.' },
          { emoji:'🥇', product:'Gold', news:"Economic crisis → people bought gold for safety (demand rose). But mining got expensive (supply fell).", q:'What is DEFINITELY true about PRICE of gold?', type:'binary', change:'up', exp:'Demand ↑ (safe haven) + Supply ↓ (costly mining) → Both forces push price UP → Price DEFINITELY rises! 🥇', concept:'D up + S down → Price DEFINITELY UP', tip:'Demand rises + Supply falls → Price DEFINITELY rises. This is exactly what happened during Covid!' },
          { emoji:'📚', product:'Textbooks', news:"More students enrolled (demand rose) AND publishers reduced editions (supply fell).", q:'What DEFINITELY happens to price of textbooks?', type:'binary', change:'up', exp:'Demand ↑ (more students) + Supply ↓ (fewer editions) → Price DEFINITELY rises! 📚', concept:'D up + S down → Price UP (Confirmed)', tip:'Same pattern as gold: D rises + S falls → Price definitely rises. Very predictable!' },
          { emoji:'💧', product:'Bottled Water', news:"Heatwave hit (demand rose massively) AND new water companies set up (supply also rose).", q:'What is AMBIGUOUS (cannot be determined without data)?', type:'binary', change:'up', exp:"D ↑ + S ↑ → QUANTITY definitely rises. But PRICE is AMBIGUOUS — can't tell without knowing which shifted more! 💧", concept:'Ambiguous Price (Both Rise)', tip:'When both D and S rise → PRICE change is AMBIGUOUS. This "what cannot be determined" is a BOARD TRICK QUESTION!' },
          { emoji:'⛏️', product:'Coal', news:"Renewable energy grew (coal demand fell) AND many coal mines shut (supply also fell).", q:'What is AMBIGUOUS here?', type:'binary', change:'down', exp:'D ↓ + S ↓ → QUANTITY definitely falls. But PRICE is AMBIGUOUS — supply fall pushes price up, demand fall pushes down! ⛏️', concept:'Ambiguous Price (Both Fall)', tip:'Both D and S fall → Quantity definitely falls, Price is ambiguous. Second common exam pattern!' },
        ]
      },
      3: {
        label: 'Hard', emoji: '🔴', desc: 'Price floors, ceilings, PED calculations & advanced analysis',
        scenarios: [
          { emoji:'🌾', product:'Wheat — MSP', news:"Govt set MSP (minimum support price) = ₹2000/quintal. Market equilibrium price was ₹1500/quintal.", q:'What does the MSP (price floor) create?', type:'mcq', options:['Shortage — demand exceeds supply','Surplus — supply exceeds demand','Perfect equilibrium','Price rises to ₹3000 automatically'], correct:1, exp:'Price floor ABOVE equilibrium → Price is artificially high → Supply > Demand → SURPLUS! Govt often buys this surplus. 🌾', concept:'Price Floor → Surplus', tip:'Price floor above equilibrium → SURPLUS. Price ceiling below equilibrium → SHORTAGE. Very common board question!' },
          { emoji:'💊', product:'Medicine — Price Cap', news:"Govt set price ceiling = ₹5/tablet. Market equilibrium was ₹12/tablet.", q:'What does this price ceiling create?', type:'mcq', options:['Surplus — too many tablets','Shortage — demand exceeds supply','Equilibrium maintained','Black market disappears'], correct:1, exp:'Price ceiling BELOW equilibrium → Artificially low price → Demand > Supply → SHORTAGE! Black markets emerge. 💊', concept:'Price Ceiling → Shortage', tip:'Price ceiling set BELOW equilibrium → Shortage. Govt does this for essential medicines.' },
          { emoji:'🌿', product:'Agricultural Land', news:"Urbanization doubled demand for land. But supply is FIXED — land can't be created.", q:'What happens to QUANTITY of land traded?', type:'mcq', options:['Quantity doubles — matches demand','Quantity stays SAME — perfectly inelastic supply','Quantity halves','Cannot determine'], correct:1, exp:'Land is PERFECTLY INELASTIC → No matter how much demand rises → Quantity CANNOT change → Only PRICE rises! 🌿', concept:'Perfectly Inelastic Supply', tip:'Perfectly inelastic supply: demand change → ONLY price changes, quantity stays constant. Classic land/antique example!' },
          { emoji:'⛽', product:'Petrol PED', news:"Petrol rose ₹100→₹110 (10% rise). Quantity demanded fell 100L→95L (5% fall).", q:'What is the Price Elasticity of Demand (PED)?', type:'mcq', options:['PED = 2 (elastic)','PED = 0.5 (inelastic)','PED = 1 (unit elastic)','PED = 0 (perfectly inelastic)'], correct:1, exp:'PED = % ΔQd ÷ % ΔP = 5% ÷ 10% = 0.5. PED = 0.5 < 1 → INELASTIC! 10% price rise only reduced quantity by 5%. Petrol is a necessity! ⛽', concept:'Calculating PED', tip:'PED = % change in Qty ÷ % change in Price. PED < 1 = inelastic, PED > 1 = elastic, PED = 1 = unit elastic.' },
          { emoji:'💎', product:'Luxury Goods PED', news:"Luxury goods price rose 20%. Quantity demanded fell by 40%.", q:'PED of luxury goods is...', type:'mcq', options:['0.5 — inelastic','2 — elastic, buyers are price sensitive','1 — unit elastic','0 — perfectly inelastic'], correct:1, exp:'PED = 40% ÷ 20% = 2. PED > 1 → ELASTIC! Luxury goods have many substitutes → Buyers very price-sensitive → Elastic demand! 💎', concept:'PED > 1 (Elastic Demand)', tip:'Luxuries tend to be elastic (PED > 1). Necessities tend to be inelastic (PED < 1). More substitutes = more elastic!' },
          { emoji:'🕵️', product:'Black Market', news:"Govt set price ceiling on onions at ₹30/kg. Market price was ₹60/kg. Sellers now illegally sell at ₹70/kg.", q:'This illegal selling represents...', type:'mcq', options:['Price floor failure','Black market due to price ceiling','Supply shock','Demand collapse'], correct:1, exp:'Price ceiling → Shortage → Unsatisfied buyers pay above ceiling → BLACK MARKET emerges! Sellers charge ₹70 despite ₹30 ceiling. 🕵️', concept:'Black Market (Price Ceiling Effect)', tip:'Price ceiling consequence: shortage + black market. Govt must enforce ceiling or ration goods to prevent this.' },
          { emoji:'🧅', product:'Onion Export Ban', news:"India BANNED export of onions. All export-bound onions now stay in domestic market.", q:'What happens to domestic SUPPLY of onions?', type:'mcq', options:['Supply falls — export ban reduces production','Supply RISES — export stock now domestic','No change','Supply falls — exports were income'], correct:1, exp:'Export ban → Onions meant for abroad now STAY in India → More in domestic market → Supply RISES → Price FALLS! 🧅', concept:'Export Ban → Domestic Supply Rises → Price Falls', tip:'India regularly bans onion exports to control domestic prices! Export ban diverts goods to domestic market.' },
          { emoji:'📈', product:'Stock Market Bull Run', news:"Bull market: Economy great → More people want stocks (demand ↑) AND shareholders hold (supply ↓).", q:'Effect on stock prices?', type:'mcq', options:['Price falls','Price DEFINITELY rises — D up, S down','Price stays same','Cannot determine'], correct:1, exp:'Demand ↑ (more buyers) + Supply ↓ (holders keep stocks) → BOTH push price UP → Price DEFINITELY rises! Classic bull market! 📈', concept:'Bull Market: D rises + S falls → Price UP', tip:'Real world application: stock market, real estate — good news raises demand AND reduces supply simultaneously.' },
        ]
      }
    }
  },

  // ── CHAPTER 4: NATIONAL INCOME ──────────────────────────
  {
    id: 'national_income', emoji: '💰', title: 'National Income',
    subtitle: 'GDP, GNP, NNP, NDP & income accounting methods',
    color: '#a78bfa', cbse: 'Class 12 · Macroeconomics Ch. 2',
    levels: {
      1: {
        label: 'Easy', emoji: '🟢', desc: 'Basic national income concepts',
        scenarios: [
          { emoji:'📊', product:'GDP Formula', news:"C = ₹8cr, I = ₹5cr, G = ₹2cr, Exports = ₹1cr, Imports = ₹2cr.", q:'Using GDP = C+I+G+(X-M), what is GDP?', type:'mcq', options:['₹18 crore','₹14 crore','₹12 crore','₹16 crore'], correct:1, exp:'GDP = 8+5+2+(1-2) = 8+5+2-1 = ₹14 crore! X-M = Net Exports = -1 (trade deficit). 📊', concept:'Expenditure Method: GDP = C+I+G+(X-M)', tip:'This formula MUST be memorized! C=Consumption, I=Investment, G=Govt, X-M=Net Exports.' },
          { emoji:'🌍', product:'GNP vs GDP', news:"Indian company earned ₹500cr in USA. US company earned ₹200cr in India.", q:'How does this affect India\'s GNP vs GDP?', type:'mcq', options:['GNP = GDP always','GNP > GDP (Indian income abroad adds to GNP)','GNP < GDP always','No relationship'], correct:1, exp:'GNP = GDP + NFIA. Indian co. earns ₹500 abroad (adds to GNP). Net = +300 → GNP > GDP! 🌍', concept:'GNP vs GDP', tip:'GNP = GDP + NFIA (Net Factor Income from Abroad). If Indians earn more abroad → GNP > GDP.' },
          { emoji:'🏭', product:'NNP Calculation', news:"India's GNP = ₹200cr. Depreciation = ₹20cr.", q:'What is NNP?', type:'mcq', options:['₹220cr','₹200cr','₹180cr','₹160cr'], correct:2, exp:'NNP = GNP - Depreciation = 200 - 20 = ₹180cr! NNP is true national income after capital wear and tear. 🏭', concept:'NNP = GNP - Depreciation', tip:'NNP = GNP - Depreciation (CCA). "Net" always means "after depreciation". NNP at factor cost = National Income.' },
          { emoji:'📈', product:'Real vs Nominal GDP', news:"Nominal GDP grew ₹100cr → ₹120cr. But prices also rose by 20%.", q:'What happened to REAL GDP?', type:'mcq', options:['Rose by 20%','Stayed the SAME — all growth was price rise','Rose by 40%','Fell'], correct:1, exp:'Real GDP = Nominal ÷ Price Index = 120 ÷ 1.2 = 100. Same as before! All growth was inflation, not real production! 😮', concept:'Real GDP vs Nominal GDP', tip:'Real GDP adjusts for inflation. Real GDP measures ACTUAL production growth — much more meaningful!' },
          { emoji:'💸', product:'Transfer Payments', news:"Govt gave ₹5000 scholarship to 10 lakh students. Is this included in GDP?", q:'Should scholarship payments be in GDP?', type:'mcq', options:['Yes — govt spending always counts','NO — transfer payments are excluded from GDP','Only half counts','Yes but reduced by tax'], correct:1, exp:'Scholarships = TRANSFER PAYMENTS — govt gives money but gets NO service/production in return → NOT in GDP! 💸', concept:'Transfer Payments NOT in GDP', tip:'Transfer payments (scholarships, pensions, subsidies) NOT in GDP — no production occurs. Common trick question!' },
          { emoji:'🏠', product:'Household Work', news:"Housewife cooks, cleans. Same work by hired cook = ₹10,000/month.", q:'How does this affect GDP?', type:'mcq', options:['Both counted','Housewife NOT counted, hired cook IS counted','Only housewife','Neither'], correct:1, exp:"Housewife's work is unpaid → Not counted. Hired cook's ₹10,000 IS counted. GDP only measures MARKET transactions! 🏠", concept:'Non-Market Activities Excluded', tip:'GDP excludes: household work, barter, black market. Only MARKET transactions count. A key GDP limitation!' },
        ]
      },
      2: {
        label: 'Medium', emoji: '🟡', desc: 'Methods of calculation & national income concepts',
        scenarios: [
          { emoji:'🔄', product:'Double Counting', news:"Farmer sells wheat ₹10. Miller makes flour ₹15. Baker makes bread ₹25.", q:'Total VALUE ADDED (to avoid double counting) =?', type:'mcq', options:['₹50 (add all)','₹25 (final product only)','₹25 = ₹10+₹5+₹10 (value added at each stage)','₹15'], correct:2, exp:'Farmer adds ₹10, Miller adds ₹5 (15-10), Baker adds ₹10 (25-15). Total = ₹25. Same as final product! No double counting! 🔄', concept:'Value Added Method', tip:'To avoid double counting → Use VALUE ADDED at each stage OR count only FINAL goods. Both give same result!' },
          { emoji:'🔩', product:'Intermediate Goods', news:"Steel company sold ₹50cr steel to car company. Cars made = ₹200cr.", q:'How should steel be treated in GDP?', type:'mcq', options:['Add both ₹250cr','Only ₹200cr (final good) — no double counting','Only ₹50cr','Neither'], correct:1, exp:'Steel is INTERMEDIATE — it\'s already in the car\'s price. Count only final goods (₹200cr) to avoid double counting! 🔩', concept:'Intermediate vs Final Goods', tip:'Intermediate goods are NOT separately added to GDP. They\'re included in the final good\'s price!' },
          { emoji:'📝', product:'Income Method', news:"Wages=₹60cr, Rent=₹20cr, Interest=₹10cr, Profit=₹10cr.", q:'Using Income Method, National Income =?', type:'mcq', options:['₹60cr (wages only)','₹100cr (W+R+I+P)','₹80cr (W+R)','₹70cr (W+R+I)'], correct:1, exp:'Income Method: NI = Wages+Rent+Interest+Profit = 60+20+10+10 = ₹100cr! All factor incomes sum to national income. 📝', concept:'Income Method: W+R+I+P', tip:'Income Method = sum of all factor incomes: Wages(labour) + Rent(land) + Interest(capital) + Profit(enterprise).' },
          { emoji:'💵', product:'Black Money', news:"Builder accepts ₹50L in unaccounted cash — never reported to govt.", q:'How does this affect official GDP?', type:'mcq', options:['GDP increases ₹50L','GDP is UNDERSTATED — unrecorded activity','GDP same','GDP decreases'], correct:1, exp:'Black money → Not recorded → Not counted → Official GDP UNDERSTATED! Real economy might be larger. 💵', concept:'Black Economy Understates GDP', tip:'GDP underestimates activity due to: black market, barter, household work, illegal activities.' },
          { emoji:'🤔', product:'GDP Per Capita', news:"Country A: GDP=₹100cr, pop=10L. Country B: GDP=₹80cr, pop=2L.", q:'Which country has higher standard of living?', type:'mcq', options:['Country A — higher GDP','Country B — higher GDP PER CAPITA','Both equal','Cannot compare'], correct:1, exp:'Per capita: A=₹1000/person, B=₹4000/person! Country B citizens are RICHER despite lower total GDP! 🤔', concept:'GDP per Capita = Welfare Measure', tip:'GDP per capita (GDP÷population) is better than total GDP for comparing living standards.' },
          { emoji:'🌳', product:'Environmental GDP', news:"Factory produces ₹100cr goods but causes ₹30cr river pollution damage.", q:'What limitation of GDP does this show?', type:'mcq', options:['GDP understates output','GDP IGNORES environmental costs — overstates welfare','Correctly measured','Pollution adds to GDP'], correct:1, exp:'GDP counts ₹100cr production but IGNORES ₹30cr damage → GDP OVERSTATES welfare! This is why Green GDP matters! 🌳', concept:'GDP Limitation: Ignores Externalities', tip:"GDP limitation: doesn't account for pollution, inequality, happiness. 'GDP measures activity, not welfare.'" },
        ]
      },
      3: {
        label: 'Hard', emoji: '🔴', desc: 'Multiplier, output gap & advanced macro concepts',
        scenarios: [
          { emoji:'🔄', product:'Keynesian Multiplier', news:"Govt spends ₹100cr on roads. MPC = 0.8 (people spend 80% of income).", q:'What is the Multiplier and final GDP increase?', type:'mcq', options:['Multiplier=2, GDP+₹200cr','Multiplier=5, GDP+₹500cr','Multiplier=0.8, GDP+₹80cr','Multiplier=10, GDP+₹1000cr'], correct:1, exp:'Multiplier = 1/(1-MPC) = 1/0.2 = 5. GDP increase = 100×5 = ₹500cr! Small spending → HUGE GDP impact! 🔄', concept:'Keynesian Multiplier = 1/(1-MPC)', tip:'Multiplier K = 1/(1-MPC) = 1/MPS. Higher MPC → Higher multiplier → Bigger impact of govt spending!' },
          { emoji:'😱', product:'Paradox of Thrift', news:"Everyone decides to SAVE more and SPEND less (worried about recession).", q:'What happens to National Income?', type:'mcq', options:['Rises — savings = investment','FALLS — less spending = less income for others','Stays same','Cannot determine'], correct:1, exp:'PARADOX OF THRIFT! Everyone saves → Less spending → Less income for sellers → Less GDP! Individual virtue = Social vice! 😱', concept:'Paradox of Thrift', tip:'Paradox: if ALL save more → national income falls. Savings = leakage from circular flow. Board loves this!' },
          { emoji:'📉', product:'Output Gap', news:"Potential GDP = ₹200cr. Actual GDP = ₹160cr.", q:'This ₹40cr gap indicates...', type:'mcq', options:['Inflationary gap','DEFLATIONARY gap — output below potential','GDP overestimated','No gap'], correct:1, exp:'Actual < Potential → DEFLATIONARY/RECESSIONARY GAP! Resources idle. Govt should INCREASE spending to fill gap! 📉', concept:'Deflationary Gap', tip:'Deflationary gap: Actual < Potential GDP → recession, unemployment. Inflationary gap: Actual > Potential → inflation.' },
          { emoji:'🔄', product:'Circular Flow Equilibrium', news:"Savings=₹80cr, Taxes=₹100cr, Imports=₹50cr.", q:'For equilibrium, Investment + Exports + Govt Spending must equal...', type:'mcq', options:['₹500cr','₹230cr (S+T+M = leakages)','₹150cr','₹80cr (savings only)'], correct:1, exp:'Leakages = S+T+M = 80+100+50 = ₹230cr. For equilibrium → Injections (I+G+X) must = ₹230cr! 🔄', concept:'Circular Flow: Injections = Leakages', tip:'Equilibrium: Injections (I+G+X) = Leakages (S+T+M). Two-sector: Investment = Savings.' },
          { emoji:'🌟', product:'HDI vs GDP', news:"Country X: high GDP but 90% income goes to 10% people. Country Y: lower GDP, equal distribution.", q:'Which has better development using HDI?', type:'mcq', options:['Country X — higher GDP','CANNOT SAY — HDI includes education & health too','Country Y always better','Same — GDP is only measure'], correct:1, exp:'HDI = Income + Education + Health. High GDP with inequality might still have poor HDI. Cannot judge by GDP alone! 🌟', concept:'HDI vs GDP', tip:'HDI = income + education + health. High GDP ≠ high HDI if inequality is extreme or health/education is poor.' },
          { emoji:'📊', product:'GDP Deflator', news:"Nominal GDP: ₹100→₹130. Real GDP: ₹100→₹110.", q:'What is the GDP Deflator (inflation level)?', type:'mcq', options:['10%','30%','118.2 → inflation = 18.2%','20%'], correct:2, exp:'GDP Deflator = (Nominal÷Real)×100 = (130÷110)×100 = 118.2. So inflation = 18.2%! 📊', concept:'GDP Deflator = (Nominal/Real)×100', tip:'GDP Deflator measures overall price level. Real GDP = Nominal ÷ Deflator × 100.' },
        ]
      }
    }
  },

  // ── CHAPTER 5: MONEY, BANKING & INFLATION ────────────────
  {
    id: 'inflation', emoji: '📈', title: 'Money, Banking & Inflation',
    subtitle: 'CPI, WPI, RBI tools, credit creation & monetary policy',
    color: '#f87171', cbse: 'Class 12 · Macroeconomics Ch. 3 & 4',
    levels: {
      1: {
        label: 'Easy', emoji: '🟢', desc: 'Basic inflation & banking concepts',
        scenarios: [
          { emoji:'💵', product:'Money Printing', news:"RBI printed ₹10,000cr new notes and injected into economy.", q:'What likely happens to PRICES?', type:'binary', change:'up', exp:'More money chasing same goods → PRICES RISE (Inflation)! Quantity Theory: Too much money causes inflation! 💵', concept:'Excess Money Supply → Inflation', tip:'QTM: MV=PT. More money (M) with same goods → prices (P) rise. Printing money = inflation!' },
          { emoji:'🏦', product:'Repo Rate', news:"RBI INCREASED repo rate from 6% to 6.5%.", q:'What happens to LOANS available to public?', type:'binary', change:'down', exp:'Higher repo rate → Banks pay more to borrow → Banks increase lending rates → Public borrows LESS → Credit FALLS! 🏦', concept:'Repo Rate Increase → Credit Falls', tip:'Repo rate ↑ → Banks\' cost ↑ → Loans expensive → Public borrows less → Money supply falls → Inflation controlled.' },
          { emoji:'🏛️', product:'CRR', news:"RBI increased Cash Reserve Ratio (CRR) from 4% to 5%.", q:'What happens to money available for bank lending?', type:'binary', change:'down', exp:'Higher CRR → Banks keep more with RBI → Less left to lend → Credit availability FALLS! 🏛️', concept:'CRR Increase → Less Credit', tip:'CRR = % of deposits kept with RBI. CRR ↑ → Less to lend → Money supply ↓.' },
          { emoji:'📄', product:'Open Market Operations', news:"RBI SOLD government securities to banks.", q:'What happens to money supply in the economy?', type:'binary', change:'down', exp:'RBI sells securities → Banks PAY money to RBI → Money flows FROM banks to RBI → Money supply FALLS! 📄', concept:'OMO Sale → Money Supply Falls', tip:'OMO: RBI sells securities → money supply ↓. RBI buys securities → money supply ↑.' },
          { emoji:'📈', product:'Inflation & Savings', news:"Inflation is 8% per year. You kept ₹1000 under mattress for a year.", q:'What is the REAL value of your ₹1000 after 1 year?', type:'binary', change:'down', exp:'Inflation 8% → Prices rose → ₹1000 buys LESS → Real value FELL! Cash under mattress is the WORST savings strategy! 📉', concept:'Inflation Erodes Real Value', tip:'Inflation erodes purchasing power. Real value = Nominal ÷ (1 + inflation rate). Always invest!' },
          { emoji:'🔄', product:'Credit Multiplier', news:"You deposit ₹1000. CRR=10%. Bank lends ₹900, which gets deposited, then lent again...", q:'Total credit created by banking system?', type:'binary', change:'up', exp:'Credit Multiplier = 1/CRR = 1/0.1 = 10. Total credit = ₹1000×10 = ₹10,000! Banks MULTIPLY deposits! 🔄', concept:'Credit/Money Multiplier = 1/CRR', tip:'Credit multiplier = 1÷CRR. ₹1000 with 10% CRR creates ₹10,000 credit. Higher CRR → Lower multiplier!' },
        ]
      },
      2: {
        label: 'Medium', emoji: '🟡', desc: 'Types of inflation & RBI monetary policy tools',
        scenarios: [
          { emoji:'💥', product:'Cost-Push vs Demand-Pull', news:"Petrol prices doubled → raised the cost of producing EVERYTHING.", q:'This type of inflation is called...', type:'mcq', options:['Demand-pull inflation','Cost-push inflation — supply side cost rise','Hyperinflation','Deflation'], correct:1, exp:'Input cost rises → All production costs rise → Prices rise → COST-PUSH INFLATION! Supply-side problem, not excess demand! 💥', concept:'Cost-Push Inflation', tip:'Two types: (1) Demand-pull: excess demand pulls prices up. (2) Cost-push: rising input costs push prices up.' },
          { emoji:'😱', product:'Stagflation', news:"Economy has HIGH inflation AND HIGH unemployment simultaneously.", q:'This rare dangerous situation is called...', type:'mcq', options:['Reflation','Stagflation','Deflation','Disinflation'], correct:1, exp:"STAGFLATION = Stagnation + Inflation together! Economic nightmare — can't fix both at once! 1970s oil crisis caused this. 😱", concept:'Stagflation', tip:'Stagflation: simultaneous inflation + recession. VERY hard to fix — controlling inflation worsens unemployment & vice versa!' },
          { emoji:'🏦', product:'Bank Rate vs Repo Rate', news:"Bank Rate = long-term RBI lending. Repo Rate = overnight lending.", q:'Which rate is GENERALLY higher?', type:'mcq', options:['Repo Rate — overnight is riskier','Bank Rate — long-term has more risk/cost','Both always equal','CRR is always highest'], correct:1, exp:'Bank Rate (long-term) > Repo Rate (overnight) — longer duration = more risk. Currently Bank Rate=6.75% > Repo=6.5%. 🏦', concept:'Bank Rate > Repo Rate', tip:'Bank Rate = RBI long-term lending rate (higher). Repo Rate = overnight rate (lower). Both are policy tools.' },
          { emoji:'🔄', product:'Reverse Repo Rate', news:"RBI wants banks to LEND MORE to public (boost economy). Banks currently park excess funds with RBI.", q:'What should RBI do to Reverse Repo Rate?', type:'mcq', options:['Increase it — higher return attracts banks','DECREASE it — banks prefer to lend instead','Keep same','Abolish it'], correct:1, exp:'Lower Reverse Repo → Parking with RBI earns less → Banks prefer to LEND to public → More credit → Boost economy! 🔄', concept:'Reverse Repo Rate & Monetary Policy', tip:'Low RRR → Banks prefer lending → Credit expands. High RRR → Banks park funds with RBI → Credit contracts.' },
          { emoji:'📋', product:'SLR Cut', news:"RBI decreased SLR (Statutory Liquidity Ratio) from 18% to 16%.", q:'What happens to banks\' ability to create credit?', type:'mcq', options:['Credit decreases','Credit INCREASES — banks have more funds to lend','No effect','Inflation immediately falls'], correct:1, exp:'SLR ↓ → Banks keep less in liquid assets → MORE money available for lending → CREDIT EXPANDS! 📋', concept:'SLR Decrease → Credit Expands', tip:'SLR = % of deposits in liquid assets. SLR ↓ → More to lend. SLR ↑ → Less to lend.' },
          { emoji:'📊', product:'CPI vs WPI', news:"CPI = 8%, WPI = 3%. Which measures COST OF LIVING for common people?", q:'Which is better for measuring cost of living?', type:'mcq', options:['WPI — all wholesale prices','CPI — retail prices consumers actually pay','Both equally','Only GDP deflator'], correct:1, exp:'CPI measures prices of goods consumers ACTUALLY BUY at retail → Better for cost of living! RBI uses CPI for 4% inflation target! 📊', concept:'CPI vs WPI', tip:'CPI = retail consumer prices → cost of living. WPI = wholesale prices → production costs. RBI targets CPI at 4%.' },
        ]
      },
      3: {
        label: 'Hard', emoji: '🔴', desc: 'Advanced monetary policy, liquidity trap & theory',
        scenarios: [
          { emoji:'🛠️', product:'Anti-Inflation Policy', news:"Inflation is 8% — double RBI's 4% target. RBI wants to REDUCE inflation urgently.", q:'Which combination should RBI choose?', type:'mcq', options:['Cut repo + Cut CRR + Buy securities','RAISE repo + RAISE CRR + SELL securities','Raise repo only','Cut SLR + Print money'], correct:1, exp:'Contractionary policy: Repo ↑ (expensive borrowing) + CRR ↑ (less to lend) + Sell securities (absorb money) → All reduce money supply → Inflation falls! 🛠️', concept:'Contractionary Monetary Policy', tip:'Anti-inflation: Repo ↑ + CRR ↑ + SLR ↑ + OMO Sales. Expansionary: Repo ↓ + CRR ↓ + SLR ↓ + OMO Purchase.' },
          { emoji:'🔄', product:'Credit Creation Calculation', news:"Initial deposit = ₹10,000. CRR = 20%.", q:'Total credit created by entire banking system?', type:'mcq', options:['₹10,000','₹50,000 (Multiplier = 1/0.2 = 5)','₹80,000','₹2,00,000'], correct:1, exp:'Multiplier = 1/CRR = 1/0.2 = 5. Total deposits = ₹10,000×5 = ₹50,000! Magic of fractional banking! 🔄', concept:'Credit Multiplier Calculation', tip:'Credit multiplier = 1/CRR. Very common 3-4 mark calculation in boards. Practice with different CRR values!' },
          { emoji:'🪤', product:'Liquidity Trap', news:"Japan 1990s: Interest rates at 0%. Still people didn't borrow or spend. Economy stagnant.", q:"This situation where monetary policy fails is called...", type:'mcq', options:['Stagflation','Liquidity trap','Hyperinflation','Cost-push inflation'], correct:1, exp:"LIQUIDITY TRAP! 0% interest but people still hoard money (fear of deflation). Monetary policy FAILS → Only FISCAL policy (govt spending) can help! Japan's 'Lost Decade'! 🪤", concept:'Liquidity Trap', tip:'Liquidity trap: interest rates at 0% but monetary policy fails. Requires fiscal stimulus instead.' },
          { emoji:'💸', product:'Inflation Tax', news:"Govt borrows ₹1000cr by printing money. Inflation rose 20%. Govt repays same ₹1000cr (now worth less).", q:'Who effectively paid the "inflation tax"?', type:'mcq', options:['Rich people only','ALL holders of rupee — inflation eroded real value','Only debtors','Only pensioners'], correct:1, exp:"Inflation tax: printing money → everyone holding rupees loses purchasing power → invisible TAX on ALL rupee holders! Poor (who hold cash) hurt most! 💸", concept:'Inflation Tax on Currency Holders', tip:'Printing money = inflation = "inflation tax" on ALL who hold currency. Hits poor hardest. Rich hold inflation-proof assets.' },
          { emoji:'📉', product:'Deflationary Spiral', news:"Economy has -3% inflation (prices FALLING). People delay purchases expecting further falls.", q:'Why is deflation actually DANGEROUS?', type:'mcq', options:["It isn't — falling prices are good","Deflation spiral: delayed buying → less production → unemployment → more deflation",'Only affects imports','Only bad for exporters'], correct:1, exp:'DEFLATION SPIRAL! Falling prices → Wait → Companies sell less → Cut production → Fire workers → Less income → Buy less → More deflation! Trap! 📉', concept:'Deflationary Spiral', tip:'Deflation is MORE dangerous than mild inflation! Self-reinforcing downward spiral. Central banks FEAR deflation more than inflation!' },
          { emoji:'📊', product:'CRR vs SLR vs Repo', news:"RBI wants maximum credit expansion in the economy.", q:'Which combination achieves MAXIMUM credit expansion?', type:'mcq', options:['CRR ↑, SLR ↑, Repo ↑','CRR ↓, SLR ↓, Repo ↓','CRR ↑, Repo ↓','Only Repo matters'], correct:1, exp:'Maximum expansion: CRR ↓ (more to lend) + SLR ↓ (less in liquid assets) + Repo ↓ (cheaper borrowing) → ALL expand credit simultaneously! 🚀', concept:'Expansionary Monetary Policy', tip:'Expansionary policy: CRR ↓ + SLR ↓ + Repo ↓ + RRR ↓ + Buy securities. ALL tools work in same direction!' },
        ]
      }
    }
  },
];

// ══════════════════════════════════════════════════════════
// MONEY TIME MACHINE GAME
// ══════════════════════════════════════════════════════════
const INDIA_CPI = { 2000:38,2001:40,2002:42,2003:44,2004:47,2005:50,2006:54,2007:58,2008:65,2009:72,2010:82,2011:92,2012:100,2013:110,2014:120,2015:128,2016:135,2017:142,2018:149,2019:156,2020:163,2021:172,2022:185,2023:195,2024:204 };
const FAMOUS_ITEMS = [
  { emoji:'☕',name:'Chai',unit:'per cup',p2000:3,p2024:20 },
  { emoji:'⛽',name:'Petrol',unit:'per litre',p2000:26,p2024:103 },
  { emoji:'🎬',name:'Movie Ticket',unit:'one ticket',p2000:30,p2024:250 },
  { emoji:'📚',name:'School Fees',unit:'per month',p2000:300,p2024:3000 },
  { emoji:'🍞',name:'Bread',unit:'one loaf',p2000:10,p2024:50 },
  { emoji:'✂️',name:'Haircut',unit:'one visit',p2000:20,p2024:150 },
  { emoji:'🥛',name:'Milk',unit:'per litre',p2000:12,p2024:60 },
  { emoji:'🍕',name:'Pizza',unit:'medium',p2000:60,p2024:350 },
];

function TimeMachineGame() {
  const [amount, setAmount] = useState(1000);
  const [year, setYear] = useState(2000);
  const cpiThen = INDIA_CPI[year], cpiNow = INDIA_CPI[2024];
  const todayValue = Math.round((amount * cpiNow) / cpiThen);
  const inflation = (((cpiNow - cpiThen) / cpiThen) * 100).toFixed(0);
  const powerPct = Math.round((amount / todayValue) * 100);
  const shock = +inflation > 300 ? {label:'😱 SHOCKING!',c:'#f87171'} : +inflation > 150 ? {label:'😮 Wow!',c:'#f97316'} : {label:'😬 Significant',c:'#D4AF37'};

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-lg font-black text-white">Money Time Machine 💸</h2>
        <p className="text-xs" style={{color: '#64748b'}}>See how much ₹ from the past is worth today!</p>
      </div>
      <div className="rounded-2xl p-4 mb-4" style={{background: 'rgba(255,255,255,0.05)',border: '1px solid rgba(255,255,255,0.1)'}}>
        <p className="text-xs font-semibold mb-2" style={{color: 'rgba(255,255,255,0.65)'}}>💰 Pick an amount:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {[100,500,1000,5000,10000].map(a=>(
            <button key={a} onClick={()=>setAmount(a)} className="px-3 py-2 rounded-xl text-sm font-bold transition-all"
              style={{background:amount===a?'rgba(212,175,55,0.2)':'rgba(255,255,255,0.06)',color:amount===a?'#D4AF37':'rgba(255,255,255,0.7)',border:amount===a?'2px solid rgba(212,175,55,0.5)':'1px solid rgba(255,255,255,0.12)'}}>
              ₹{a.toLocaleString('en-IN')}
            </button>
          ))}
        </div>
        <p className="text-xs font-semibold mb-2" style={{color: 'rgba(255,255,255,0.65)'}}>📅 Pick a year:</p>
        <div className="flex flex-wrap gap-2">
          {[2000,2005,2010,2015,2020].map(y=>(
            <button key={y} onClick={()=>setYear(y)} className="px-3 py-2 rounded-xl text-sm font-bold transition-all"
              style={{background:year===y?'rgba(96,165,250,0.25)':'rgba(255,255,255,0.06)',color:year===y?'#60a5fa':'rgba(255,255,255,0.6)',border:year===y?'2px solid rgba(96,165,250,0.5)':'1px solid rgba(255,255,255,0.1)'}}>
              {y}
            </button>
          ))}
        </div>
      </div>
      <motion.div key={`${amount}-${year}`} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
        className="rounded-2xl p-5 mb-4 text-center"
        style={{background:'linear-gradient(135deg,rgba(212,175,55,0.15),rgba(212,175,55,0.05))',border:'2px solid rgba(212,175,55,0.3)'}}>
        <p className="text-sm mb-1" style={{color: 'rgba(255,255,255,0.85)'}}>₹{amount.toLocaleString('en-IN')} from <span style={{color:'#D4AF37',fontWeight:'bold'}}>{year}</span> =</p>
        <p className="text-5xl font-black mb-1" style={{color:'#D4AF37'}}>₹{todayValue.toLocaleString('en-IN')}</p>
        <p className="text-sm mb-3" style={{color: '#64748b'}}>in 2024</p>
        <div className="inline-block px-4 py-2 rounded-full font-black mb-4" style={{background: 'rgba(0,0,0,0.04)',color:shock.c}}>
          {shock.label} +{inflation}% inflation
        </div>
        <div>
          <div className="flex justify-between text-xs mb-1" style={{color: '#64748b'}}>
            <span>Buying power today</span><span style={{color:'#f87171',fontWeight:'bold'}}>{powerPct}%</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.06)'}}>
            <motion.div initial={{width:0}} animate={{width:`${powerPct}%`}} transition={{duration:1,ease:'easeOut'}}
              className="h-full rounded-full" style={{background:'linear-gradient(90deg,#ef4444,#f97316,#D4AF37)'}}/>
          </div>
          <p className="text-xs mt-1 text-left" style={{color: '#94a3b8'}}>
            Your ₹{amount.toLocaleString('en-IN')} can only buy what ₹{Math.round(amount*powerPct/100).toLocaleString('en-IN')} buys today 😬
          </p>
        </div>
      </motion.div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {FAMOUS_ITEMS.map(item=>{
          const then=Math.round(item.p2000*INDIA_CPI[year]/INDIA_CPI[2000]);
          const rise=Math.round(((item.p2024-then)/then)*100);
          return(
            <div key={item.name} className="rounded-xl p-3" style={{background: 'rgba(255,255,255,0.05)',border: '1px solid rgba(255,255,255,0.1)'}}>
              <div className="text-2xl mb-1">{item.emoji}</div>
              <div className="text-xs font-semibold mb-1" style={{color: 'rgba(255,255,255,0.85)'}}>{item.name}</div>
              <div className="text-xs" style={{color: '#94a3b8'}}>{year}: <span style={{color:'#60a5fa',fontWeight:'bold'}}>₹{then}</span></div>
              <div className="text-xs" style={{color: '#94a3b8'}}>2024: <span style={{color:'#34d399',fontWeight:'bold'}}>₹{item.p2024}</span></div>
              <div className="text-xs font-bold mt-1" style={{color:'#f87171'}}>+{rise}% 📈</div>
            </div>
          );
        })}
      </div>
      <div className="rounded-xl p-3" style={{background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.15)'}}>
        <p className="text-xs font-semibold mb-1" style={{color:'#D4AF37'}}>📋 Board Formula</p>
        <p className="text-xs font-mono mb-1 px-2 py-1 rounded" style={{background: 'rgba(0,0,0,0.04)',color:'#60a5fa'}}>
          Value today = (Old Amount × CPI Now) ÷ CPI Then
        </p>
        <p className="text-xs" style={{color: '#475569'}}>Example: ₹{amount.toLocaleString('en-IN')} × {cpiNow} ÷ {cpiThen} = ₹{todayValue.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// GAME ENGINE — with timer, lives, combos, floating pts
// ══════════════════════════════════════════════════════════
const CORRECT_MSG = ['CORRECT! 🎉','NAILED IT! 🔥','SMART! 💯','EXCELLENT! ⚡','GENIUS! 🏆'];
const WRONG_MSG   = ['WRONG! ❌','OOPS! 😬','NOT QUITE! 🤔','ALMOST! 😅'];
const rand = arr => arr[Math.floor(Math.random()*arr.length)];
const MAX_TIME = 20;

function FloatingText({ text, color }) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0, scale: 1 }}
      animate={{ opacity: 0, y: -80, scale: 1.4 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 font-black text-2xl pointer-events-none z-50"
      style={{ color, textShadow: `0 0 20px ${color}` }}
    >
      {text}
    </motion.div>
  );
}

function Heart({ alive }) {
  return (
    <motion.span
      animate={alive ? {} : { scale: [1, 1.4, 0.8], opacity: [1, 1, 0.3] }}
      transition={{ duration: 0.4 }}
      className="text-xl"
    >
      {alive ? '❤️' : '🖤'}
    </motion.span>
  );
}

function QuizEngine({ chapter, levelKey, onBack }) {
  const level = chapter.levels[levelKey];
  const scenarios = level.scenarios;

  const [idx, setIdx]             = useState(0);
  const [score, setScore]         = useState(0);
  const [streak, setStreak]       = useState(0);
  const [bestStreak, setBest]     = useState(0);
  const [lives, setLives]         = useState(3);
  const [timer, setTimer]         = useState(MAX_TIME);
  const [phase, setPhase]         = useState('question'); // 'question' | 'feedback' | 'gameover' | 'done'
  const [guess, setGuess]         = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [floatKey, setFloatKey]   = useState(0);
  const [floatText, setFloatText] = useState(null);
  const [comboShow, setComboShow] = useState(false);
  const [flashColor, setFlash]    = useState(null);
  const [history, setHistory]     = useState([]);
  const timerRef = useRef(null);

  const sc = scenarios[idx];

  // ── timer countdown ──────────────────────────────────────
  useEffect(() => {
    if (phase !== 'question') return;
    if (timer <= 0) { handleGuess('__timeout__'); return; }
    timerRef.current = setTimeout(() => setTimer(t => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timer, phase]);

  // reset timer on new question
  useEffect(() => { if (phase === 'question') setTimer(MAX_TIME); }, [idx]);

  // ── answer handler ───────────────────────────────────────
  function handleGuess(val) {
    if (phase !== 'question') return;
    clearTimeout(timerRef.current);

    const correct =
      val === '__timeout__' ? false
      : sc.type === 'binary' ? val === sc.change
      : val === sc.correct;

    const newStreak = correct ? streak + 1 : 0;
    const mult      = Math.min(streak + 1, 5);
    const pts       = correct ? 100 * mult : 0;

    setGuess(val);
    setIsCorrect(correct);
    setStreak(newStreak);
    if (newStreak > bestStreak) setBest(newStreak);
    if (correct) {
      setScore(s => s + pts);
      setFlash('#22c55e');
      setFloatText(`+${pts}${mult >= 2 ? ` ×${mult}` : ''}`);
      setFloatKey(k => k + 1);
      if (newStreak >= 3) setComboShow(true);
      setTimeout(() => setComboShow(false), 1200);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setFlash('#ef4444');
      if (newLives <= 0) {
        setTimeout(() => { setFlash(null); setPhase('gameover'); }, 700);
        return;
      }
    }
    setHistory(h => [...h, { sc, correct }]);
    setTimeout(() => setFlash(null), 300);
    setPhase('feedback');
  }

  function next() {
    if (idx + 1 >= scenarios.length) { setPhase('done'); return; }
    setIdx(i => i + 1);
    setGuess(null);
    setPhase('question');
  }

  function restart() {
    setIdx(0); setScore(0); setStreak(0); setBest(0); setLives(3);
    setTimer(MAX_TIME); setPhase('question'); setGuess(null); setHistory([]);
  }

  const timerPct  = (timer / MAX_TIME) * 100;
  const timerColor = timer > 10 ? '#34d399' : timer > 5 ? '#f97316' : '#ef4444';

  // ── GAME OVER ────────────────────────────────────────────
  if (phase === 'gameover') {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-6 text-center" style={{ background: 'rgba(239,68,68,0.08)', border: '2px solid rgba(239,68,68,0.3)' }}>
        <div className="text-6xl mb-3">💀</div>
        <h2 className="text-3xl font-black text-white mb-1">GAME OVER!</h2>
        <p className="text-sm mb-4" style={{ color: '#64748b' }}>You ran out of lives</p>
        <div className="text-5xl font-black mb-1" style={{ color: '#D4AF37' }}>{score}</div>
        <p className="text-sm mb-6" style={{ color: '#64748b' }}>points · {idx}/{scenarios.length} questions</p>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}>
            ← Levels
          </button>
          <button onClick={restart} className="flex-1 py-4 rounded-xl font-black text-navy-950 text-base"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C040)' }}>
            🔄 Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  // ── LEVEL DONE ───────────────────────────────────────────
  if (phase === 'done') {
    const correct = history.filter(h => h.correct).length;
    const pct     = Math.round((correct / scenarios.length) * 100);
    const stars   = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 50 ? 1 : 0;
    const grade   = pct >= 90 ? { l: 'Economics Genius!', c: '#D4AF37', e: '🏆' }
                  : pct >= 70 ? { l: 'Market Expert!',    c: '#34d399', e: '🎯' }
                  : pct >= 50 ? { l: 'Getting There!',    c: '#60a5fa', e: '📚' }
                  :             { l: 'Keep Practising!',  c: '#f87171', e: '💪' };
    return (
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl p-6 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,175,55,0.3)' }}>
        <div className="text-6xl mb-2">{grade.e}</div>
        <div className="text-3xl mb-2">{stars > 0 ? '⭐'.repeat(stars) : '🔄'}</div>
        <h2 className="text-2xl font-black text-white mb-1">Level {levelKey} Complete!</h2>
        <div className="text-5xl font-black mb-1" style={{ color: '#D4AF37' }}>{score}</div>
        <p className="text-sm mb-1" style={{ color: '#94a3b8' }}>points scored</p>
        <p className="font-bold mb-5 text-lg" style={{ color: grade.c }}>{grade.l}</p>
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[{ l: 'Correct', v: correct, c: '#34d399' }, { l: 'Wrong', v: scenarios.length - correct, c: '#f87171' }, { l: 'Best Streak', v: bestStreak, c: '#D4AF37' }].map(s => (
            <div key={s.l} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div className="text-2xl font-black" style={{ color: s.c }}>{s.v}</div>
              <div className="text-xs mt-0.5" style={{ color: '#64748b' }}>{s.l}</div>
            </div>
          ))}
        </div>
        <div className="space-y-1.5 mb-5 text-left max-h-40 overflow-y-auto">
          {history.map((h, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2"
              style={{ background: h.correct ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)' }}>
              <span className="text-base">{h.sc.emoji}</span>
              <span className="flex-1 text-xs truncate" style={{ color: '#1e293b' }}>{h.sc.product}</span>
              <span>{h.correct ? '✅' : '❌'}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 rounded-xl font-bold text-sm"
            style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.12)' }}>
            ← Back
          </button>
          <button onClick={restart} className="flex-1 py-4 rounded-xl font-black text-navy-950"
            style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C040)' }}>
            🔄 Retry
          </button>
        </div>
      </motion.div>
    );
  }

  // ── GAME SCREEN ──────────────────────────────────────────
  return (
    <div className="relative select-none">

      {/* Flash overlay */}
      <AnimatePresence>
        {flashColor && (
          <motion.div
            key="flash"
            initial={{ opacity: 0.6 }} animate={{ opacity: 0 }} transition={{ duration: 0.35 }}
            className="absolute inset-0 rounded-2xl pointer-events-none z-40"
            style={{ background: flashColor }}
          />
        )}
      </AnimatePresence>

      {/* Floating points */}
      <AnimatePresence>
        {floatText && phase === 'feedback' && isCorrect && (
          <FloatingText key={floatKey} text={floatText} color="#D4AF37" />
        )}
      </AnimatePresence>

      {/* Combo popup */}
      <AnimatePresence>
        {comboShow && (
          <motion.div
            key="combo"
            initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.3, y: -20 }}
            className="absolute left-1/2 -translate-x-1/2 top-16 z-50 font-black text-xl px-6 py-2 rounded-full pointer-events-none"
            style={{ background: 'linear-gradient(135deg,#f97316,#D4AF37)', color: '#000', boxShadow: '0 0 30px rgba(249,115,22,0.6)' }}
          >
            🔥 COMBO ×{Math.min(streak, 5)}!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HUD ── */}
      <div className="flex items-center justify-between mb-3 px-1">
        {/* Lives */}
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <Heart key={i} alive={i <= lives} />)}
        </div>
        {/* Chapter + level */}
        <span className="text-xs font-bold px-2 py-1 rounded-full"
          style={{ background: `${chapter.color}20`, color: chapter.color, border: `1px solid ${chapter.color}40` }}>
          {chapter.emoji} Lv.{levelKey} · {idx + 1}/{scenarios.length}
        </span>
        {/* Score */}
        <div className="text-right">
          <div className="text-xl font-black tabular-nums" style={{ color: '#D4AF37' }}>{score.toLocaleString()}</div>
          {streak >= 2 && (
            <div className="text-xs font-bold" style={{ color: '#f97316' }}>🔥 ×{Math.min(streak, 5)}</div>
          )}
        </div>
      </div>

      {/* ── Timer bar ── */}
      <div className="h-2.5 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          className="h-full rounded-full transition-colors"
          style={{ background: timerColor, width: `${timerPct}%` }}
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.9, ease: 'linear' }}
        />
      </div>
      <div className="flex justify-between text-xs mb-4 px-1" style={{ color: '#64748b' }}>
        <span style={{ color: timerColor, fontWeight: 'bold' }}>⏱ {timer}s</span>
        <span>100 × {Math.min(streak + 1, 5)}x = <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>+{100 * Math.min(streak + 1, 5)} pts</span></span>
      </div>

      {/* ── Question card (slides in) ── */}
      <AnimatePresence mode="wait">
        <motion.div key={idx}
          initial={{ opacity: 0, x: 60, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -60, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        >
          {/* Product banner */}
          <div className="rounded-2xl p-4 mb-3 text-center"
            style={{ background: `linear-gradient(135deg, ${chapter.color}18, rgba(255,255,255,0.03))`, border: `1px solid ${chapter.color}30` }}>
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-6xl mb-2"
            >
              {sc.emoji}
            </motion.div>
            <div className="font-black text-white text-lg">{sc.product}</div>
          </div>

          {/* News headline */}
          <div className="rounded-2xl p-4 mb-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(255,255,255,0.1)`, borderLeft: `4px solid ${chapter.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(239,68,68,0.2)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>
                📰 BREAKING
              </span>
            </div>
            <p className="text-sm font-semibold leading-relaxed" style={{ color: 'rgba(255,255,255,0.9)' }}>{sc.news}</p>
          </div>

          {/* Question */}
          <p className="text-base font-black text-center mb-4 leading-tight" style={{ color: 'rgba(255,255,255,0.95)' }}>
            {sc.q}
          </p>

          {/* ── ANSWER BUTTONS ── */}
          {phase === 'question' && (
            sc.type === 'binary' ? (
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.94 }}
                  onClick={() => handleGuess('up')}
                  className="py-6 rounded-2xl font-black text-2xl flex flex-col items-center gap-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(52,211,153,0.25), rgba(52,211,153,0.1))',
                    border: '2px solid rgba(52,211,153,0.5)',
                    color: '#34d399',
                    boxShadow: '0 4px 20px rgba(52,211,153,0.2)',
                  }}>
                  📈
                  <span className="text-sm font-black">PRICE UP</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.94 }}
                  onClick={() => handleGuess('down')}
                  className="py-6 rounded-2xl font-black text-2xl flex flex-col items-center gap-1"
                  style={{
                    background: 'linear-gradient(135deg, rgba(248,113,113,0.25), rgba(248,113,113,0.1))',
                    border: '2px solid rgba(248,113,113,0.5)',
                    color: '#f87171',
                    boxShadow: '0 4px 20px rgba(248,113,113,0.2)',
                  }}>
                  📉
                  <span className="text-sm font-black">PRICE DOWN</span>
                </motion.button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2">
                {sc.options.map((opt, i) => {
                  const optColors = ['#60a5fa','#34d399','#f97316','#a78bfa'];
                  return (
                    <motion.button key={i}
                      whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleGuess(i)}
                      className="w-full text-left px-4 py-4 rounded-2xl flex items-center gap-3"
                      style={{
                        background: `${optColors[i]}10`,
                        border: `2px solid ${optColors[i]}40`,
                        color: 'rgba(255,255,255,0.9)',
                      }}>
                      <span className="text-base font-black w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: `${optColors[i]}30`, color: optColors[i] }}>
                        {['A','B','C','D'][i]}
                      </span>
                      <span className="text-sm font-semibold">{opt}</span>
                    </motion.button>
                  );
                })}
              </div>
            )
          )}

          {/* ── FEEDBACK (after answer) ── */}
          {phase === 'feedback' && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>

              {/* Result header */}
              <motion.div
                initial={{ scale: 0.8 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}
                className="rounded-2xl p-4 mb-3 text-center"
                style={{
                  background: isCorrect ? 'rgba(52,211,153,0.12)' : 'rgba(248,113,113,0.12)',
                  border: `2px solid ${isCorrect ? 'rgba(52,211,153,0.5)' : 'rgba(248,113,113,0.5)'}`,
                }}>
                <div className="text-3xl font-black mb-1" style={{ color: isCorrect ? '#34d399' : '#f87171' }}>
                  {rand(isCorrect ? CORRECT_MSG : WRONG_MSG)}
                </div>
                {/* Correct answer shown */}
                <div className="text-sm font-bold mb-2 text-white">
                  {sc.type === 'binary'
                    ? (sc.change === 'up' ? '📈 Answer: PRICE UP' : '📉 Answer: PRICE DOWN')
                    : `✅ ${sc.options[sc.correct]}`
                  }
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>{sc.exp}</p>
              </motion.div>

              {/* Board tip */}
              {sc.tip && (
                <div className="rounded-xl px-4 py-3 mb-3 flex gap-3 items-start"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)' }}>
                  <span className="text-base flex-shrink-0">📋</span>
                  <p className="text-xs leading-relaxed" style={{ color: '#374151' }}>
                    <span style={{ color: '#D4AF37', fontWeight: 'bold' }}>Board Tip: </span>{sc.tip}
                  </p>
                </div>
              )}

              {/* Concept + next */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs px-3 py-1 rounded-full font-semibold"
                  style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
                  📚 {sc.concept}
                </span>
                {streak >= 2 && (
                  <span className="text-xs font-black" style={{ color: '#f97316' }}>🔥 ×{Math.min(streak, 5)} multiplier!</span>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={next}
                className="w-full py-4 rounded-2xl font-black text-navy-950 text-base"
                style={{ background: 'linear-gradient(135deg,#D4AF37,#F0C040)', boxShadow: '0 4px 20px rgba(212,175,55,0.35)' }}>
                {idx + 1 >= scenarios.length ? '🏆 See Results' : 'Next Question →'}
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// LEVEL SELECT
// ══════════════════════════════════════════════════════════
function LevelSelect({ chapter, onSelect, onBack }) {
  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm mb-5 px-3 py-1.5 rounded-lg"
        style={{background: 'rgba(255,255,255,0.07)',color: 'rgba(255,255,255,0.8)',border: '1px solid rgba(255,255,255,0.12)'}}>
        ← Back
      </button>
      <div className="flex items-center gap-3 mb-6">
        <span className="text-4xl">{chapter.emoji}</span>
        <div>
          <h2 className="text-xl font-black text-white">{chapter.title}</h2>
          <p className="text-xs" style={{color: '#64748b'}}>{chapter.cbse}</p>
        </div>
      </div>
      <div className="space-y-3">
        {[1,2,3].map(lv=>{
          const l = chapter.levels[lv];
          const colors = {1:'#34d399',2:'#D4AF37',3:'#f87171'};
          return (
            <motion.button key={lv} whileHover={{x:4}} whileTap={{scale:0.98}}
              onClick={()=>onSelect(lv)}
              className="w-full text-left rounded-2xl p-5 transition-all"
              style={{background: 'rgba(255,255,255,0.04)',border:`1px solid ${colors[lv]}50`}}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{l.emoji}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-black text-white text-base">Level {lv}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                        style={{background:`${colors[lv]}18`,color:colors[lv],border:`1px solid ${colors[lv]}40`}}>
                        {l.label}
                      </span>
                    </div>
                    <p className="text-xs" style={{color: '#64748b'}}>{l.desc}</p>
                    <p className="text-xs mt-0.5" style={{color:'rgba(255,255,255,0.3)'}}>{l.scenarios.length} questions</p>
                  </div>
                </div>
                <span className="text-xl" style={{color:colors[lv]}}>→</span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// MAIN GAMES PAGE
// ══════════════════════════════════════════════════════════
export default function Games() {
  const [screen, setScreen] = useState('home');          // 'home' | 'chapters' | 'levels' | 'quiz' | 'timemachine'
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
      {/* Hero */}
      {screen==='home' && (
        <>
          <section className="section-padding pt-28 pb-8">
            <div className="page-container text-center">
              <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-5"
                style={{background:'rgba(212,175,55,0.12)',border:'1px solid rgba(212,175,55,0.3)',color:'#D4AF37'}}>
                🎮 Learn Economics by Playing
              </motion.div>
              <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
                className="text-3xl sm:text-5xl font-black text-white mb-3">
                Economics is<span style={{color:'#D4AF37'}}> Fun!</span>
              </motion.h1>
              <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
                className="text-base max-w-lg mx-auto" style={{color: 'rgba(255,255,255,0.65)'}}>
                No boring textbooks. Real stories, real prices, real fun. 🇮🇳
              </motion.p>
            </div>
          </section>

          <section className="section-padding py-4 pb-16">
            <div className="page-container max-w-2xl mx-auto">
              <div className="grid sm:grid-cols-2 gap-5">
                {/* Chapter Quiz Card */}
                <motion.button initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.2}}
                  whileHover={{y:-6,scale:1.02}} whileTap={{scale:0.98}}
                  onClick={()=>setScreen('chapters')}
                  className="text-left rounded-2xl p-6"
                  style={{background: 'rgba(255,255,255,0.04)',border:'1px solid rgba(96,165,250,0.3)'}}>
                  <div className="text-5xl mb-4">🎯</div>
                  <div className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                    style={{background:'rgba(96,165,250,0.15)',color:'#60a5fa',border:'1px solid rgba(96,165,250,0.3)'}}>
                    Chapter Quiz
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">Predict the Price!</h3>
                  <p className="text-sm font-semibold mb-2" style={{color:'#60a5fa'}}>5 Chapters · 3 Levels each</p>
                  <p className="text-xs mb-3" style={{color: '#64748b'}}>
                    Demand, Supply, Equilibrium, National Income, Inflation — with Giffen goods, Veblen goods, PED, tax incidence & more!
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {CHAPTERS.map(c=><span key={c.id} className="text-xs px-2 py-0.5 rounded-full" style={{background:`${c.color}18`,color:c.color}}>{c.emoji} {c.title.split(' ')[0]}</span>)}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-black" style={{color:'#60a5fa'}}>Start Playing →</div>
                </motion.button>

                {/* Time Machine Card */}
                <motion.button initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} transition={{delay:0.3}}
                  whileHover={{y:-6,scale:1.02}} whileTap={{scale:0.98}}
                  onClick={()=>setScreen('timemachine')}
                  className="text-left rounded-2xl p-6"
                  style={{background: 'rgba(255,255,255,0.04)',border:'1px solid rgba(52,211,153,0.3)'}}>
                  <div className="text-5xl mb-4">💸</div>
                  <div className="inline-block text-xs font-bold px-2.5 py-1 rounded-full mb-3"
                    style={{background:'rgba(52,211,153,0.15)',color:'#34d399',border:'1px solid rgba(52,211,153,0.3)'}}>
                    Visual Game
                  </div>
                  <h3 className="text-xl font-black text-white mb-1">Money Time Machine</h3>
                  <p className="text-sm font-semibold mb-2" style={{color:'#34d399'}}>India CPI 2000–2024</p>
                  <p className="text-xs mb-4" style={{color: '#64748b'}}>
                    See how inflation ate your money! Pick any amount and year — the result is shocking! 😱
                  </p>
                  <div className="flex items-center gap-2 text-sm font-black" style={{color:'#34d399'}}>Play Now →</div>
                </motion.button>
              </div>

              <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
                className="mt-5 rounded-2xl p-4 text-center"
                style={{background:'rgba(255,255,255,0.02)',border:'1px dashed rgba(255,255,255,0.1)'}}>
                <p className="text-sm" style={{color: '#64748b'}}>
                  🚧 More coming soon — Budget Simulator, GDP Quiz, Market Failure Explorer
                </p>
              </motion.div>
            </div>
          </section>
        </>
      )}

      {/* Chapter Select */}
      {screen==='chapters' && (
        <section className="section-padding pt-28 pb-16">
          <div className="page-container max-w-2xl mx-auto">
            <button onClick={()=>setScreen('home')} className="flex items-center gap-2 text-sm mb-6 px-3 py-1.5 rounded-lg"
              style={{background: 'rgba(255,255,255,0.07)',color: 'rgba(255,255,255,0.8)',border: '1px solid rgba(255,255,255,0.12)'}}>
              ← Back to Games
            </button>
            <h2 className="text-2xl font-black text-white mb-1">Choose a Chapter</h2>
            <p className="text-sm mb-6" style={{color: '#64748b'}}>Each chapter has 3 levels — Easy, Medium, Hard</p>
            <div className="space-y-3">
              {CHAPTERS.map((ch,i)=>(
                <motion.button key={ch.id}
                  initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
                  whileHover={{x:4}} whileTap={{scale:0.98}}
                  onClick={()=>{setSelectedChapter(ch);setScreen('levels');}}
                  className="w-full text-left rounded-2xl p-5 transition-all"
                  style={{background: 'rgba(255,255,255,0.04)',border:`1px solid ${ch.color}40`}}>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl flex-shrink-0">{ch.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className="font-black text-white text-base">{ch.title}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full"
                          style={{background:`${ch.color}18`,color:ch.color,border:`1px solid ${ch.color}30`}}>
                          {ch.cbse}
                        </span>
                      </div>
                      <p className="text-xs truncate" style={{color:'rgba(255,255,255,0.45)'}}>{ch.subtitle}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs mb-1" style={{color: '#64748b'}}>
                        {Object.values(ch.levels).reduce((a,l)=>a+l.scenarios.length,0)} Qs
                      </div>
                      <span className="text-lg" style={{color:ch.color}}>→</span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Level Select */}
      {screen==='levels' && selectedChapter && (
        <section className="section-padding pt-28 pb-16">
          <div className="page-container max-w-lg mx-auto">
            <LevelSelect
              chapter={selectedChapter}
              onSelect={lv=>{setSelectedLevel(lv);setScreen('quiz');}}
              onBack={()=>setScreen('chapters')}
            />
          </div>
        </section>
      )}

      {/* Quiz */}
      {screen==='quiz' && selectedChapter && selectedLevel && (
        <section className="section-padding pt-28 pb-16">
          <div className="page-container max-w-2xl mx-auto">
            <button onClick={()=>setScreen('levels')} className="flex items-center gap-2 text-sm mb-5 px-3 py-1.5 rounded-lg"
              style={{background: 'rgba(255,255,255,0.07)',color: 'rgba(255,255,255,0.8)',border: '1px solid rgba(255,255,255,0.12)'}}>
              ← Change Level
            </button>
            <div className="rounded-2xl p-5" style={{background: 'rgba(255,255,255,0.05)',border: '1px solid rgba(255,255,255,0.1)'}}>
              <QuizEngine key={`${selectedChapter.id}-${selectedLevel}`}
                chapter={selectedChapter} levelKey={selectedLevel}
                onBack={()=>setScreen('levels')}/>
            </div>
          </div>
        </section>
      )}

      {/* Time Machine */}
      {screen==='timemachine' && (
        <section className="section-padding pt-28 pb-16">
          <div className="page-container max-w-2xl mx-auto">
            <button onClick={()=>setScreen('home')} className="flex items-center gap-2 text-sm mb-5 px-3 py-1.5 rounded-lg"
              style={{background: 'rgba(255,255,255,0.07)',color: 'rgba(255,255,255,0.8)',border: '1px solid rgba(255,255,255,0.12)'}}>
              ← Back to Games
            </button>
            <div className="rounded-2xl p-5" style={{background: 'rgba(255,255,255,0.05)',border: '1px solid rgba(255,255,255,0.1)'}}>
              <TimeMachineGame/>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
