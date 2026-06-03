import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── UTILS ────────────────────────────────────────────────────────────────────
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const STORAGE_KEY = 'ssc-flashcards-v1';
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
  catch { return {}; }
}
function saveProgress(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CHAPTERS = [
  {
    id: 'demand', emoji: '📥', title: 'Demand',
    subtitle: 'Laws, elasticity & special goods',
    color: '#60a5fa', bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.35)',
    cards: [
      { term: 'Law of Demand', def: 'As price increases, quantity demanded decreases — and vice versa. Inverse relationship between price and demand (ceteris paribus).', example: '🛒 When onion price rises from ₹40 to ₹80/kg, households buy less onions and substitute with other vegetables.', formula: 'Qd ∝ 1/P (ceteris paribus)', cbse: 'Most asked 1-mark MCQ — always appears' },
      { term: 'Giffen Good', def: 'An inferior good whose demand INCREASES when price rises. Violates the law of demand. The strong negative income effect dominates the substitution effect.', example: '🍞 Bread for poor families: as bread gets costlier, they cannot afford meat anymore, so they buy MORE bread to fill their stomachs.', formula: null, cbse: '⚠️ Exception to law of demand — appears every year' },
      { term: 'Veblen Good', def: 'A luxury / prestige good whose demand INCREASES as price rises. Higher price = higher status signal. People buy MORE when it is expensive.', example: '💎 Rolls Royce, Louis Vuitton bags, premium whiskey. If the price drops, rich people may actually stop buying!', formula: null, cbse: '⚠️ Exception to law of demand — 2 mark identification' },
      { term: 'Substitute Goods', def: 'Goods that can replace each other in use. Rise in price of one → rise in demand for the other. They compete with each other.', example: '☕ Tea & Coffee. If tea price rises sharply, people shift to coffee → coffee demand curve shifts right.', formula: 'Cross PED > 0 for substitutes', cbse: 'Factor affecting demand — 3 mark question' },
      { term: 'Complementary Goods', def: 'Goods used together to satisfy a want. Rise in price of one → fall in demand for the other. They are joint-demand goods.', example: '🚗 Car & Petrol. If petrol price triples, demand for new cars falls as driving becomes expensive.', formula: 'Cross PED < 0 for complements', cbse: 'Factor affecting demand — compare with substitutes' },
      { term: 'Inferior Good', def: 'A good whose demand FALLS when income rises. As people get richer, they shift to superior alternatives and buy less of this good.', example: '🚌 Bus travel. As income rises, people buy bikes/cars. Coarse grain: replaced by finer food when incomes grow.', formula: 'Income Elasticity of Demand < 0', cbse: 'Contrast with normal good — diagram question' },
      { term: 'Normal Good', def: 'A good whose demand RISES when income rises. Most everyday goods are normal goods. Positive relationship between income and demand.', example: '📱 Smartphones, restaurant meals, branded clothes — higher income → demand curve shifts rightward.', formula: 'Income Elasticity of Demand > 0', cbse: 'Basic — part of larger 4-mark questions' },
      { term: 'Price Elasticity of Demand', def: 'Measures the responsiveness of quantity demanded to a change in price. How sensitive are buyers to price changes?', example: '💊 Medicines: inelastic (PED < 1) — must buy. Luxury bags: elastic (PED > 1) — can skip.', formula: 'PED = % Change in Qd ÷ % Change in Price', cbse: '🔥 5-mark numerical — must know formula & diagram' },
      { term: 'Perfectly Inelastic Demand', def: 'Quantity demanded does NOT change regardless of price change. Demand curve is a VERTICAL straight line.', example: '💉 Life-saving insulin for diabetics — they must buy it regardless of whether it costs ₹50 or ₹500.', formula: 'PED = 0 | Vertical demand curve', cbse: 'Draw the diagram for 3 marks' },
      { term: 'Perfectly Elastic Demand', def: 'A tiny price rise causes demand to fall to ZERO. Demand curve is a HORIZONTAL straight line. Buyers accept only one price.', example: '🌾 A single small farmer in perfect competition — sells unlimited at market price, zero if price rises at all.', formula: 'PED = ∞ | Horizontal demand curve', cbse: 'Draw the diagram for 3 marks' },
      { term: 'Shift vs Movement in Demand', def: 'MOVEMENT: along the same demand curve, caused only by a price change. SHIFT: entire demand curve moves left/right due to non-price factors.', example: '📈 Price of mango rises → move UP the demand curve. Summer arrives (tastes change) → entire demand curve shifts RIGHT.', formula: null, cbse: '⚠️ Very commonly confused in 3-4 mark questions' },
      { term: 'Consumer Surplus', def: 'The extra benefit (satisfaction) a consumer gets by paying LESS than what they were actually willing to pay.', example: '🎫 Willing to pay ₹500 for a concert ticket but got it for ₹200. Your consumer surplus = ₹300.', formula: 'CS = Willingness to Pay − Actual Price Paid', cbse: 'Triangle area under demand curve — diagram based' },
    ],
  },
  {
    id: 'supply', emoji: '📤', title: 'Supply',
    subtitle: 'Production, costs & elasticity',
    color: '#34d399', bg: 'rgba(52,211,153,0.12)', border: 'rgba(52,211,153,0.35)',
    cards: [
      { term: 'Law of Supply', def: 'As price increases, quantity supplied increases — and vice versa. Direct/positive relationship between price and supply (ceteris paribus).', example: '🌾 When wheat price rises from ₹20 to ₹30/kg, farmers are motivated to sell more wheat to earn higher profit.', formula: 'Qs ∝ P (ceteris paribus)', cbse: 'Contrast with law of demand — diagram must' },
      { term: 'Price Elasticity of Supply', def: 'Measures how much quantity supplied changes in response to a price change. How quickly can producers respond?', example: '🏠 Housing supply is inelastic (takes years to build new homes). Fashion items: elastic (quick to produce more).', formula: 'PES = % Change in Qs ÷ % Change in Price', cbse: '🔥 Numerical — same structure as PED formula' },
      { term: 'Joint Supply', def: 'When producing one good automatically produces another good as a by-product. Increasing one increases the other simultaneously.', example: '🐄 Beef & Leather come from the same cow. More beef production → automatically more leather supply.', formula: null, cbse: 'Type of supply — 1-2 mark identification question' },
      { term: 'Composite Supply', def: 'When the same good or need can be supplied from multiple different independent sources.', example: '⚡ Electricity can come from coal, solar, wind, hydro, nuclear — multiple independent supply sources.', formula: null, cbse: 'Type of supply — identification in MCQ' },
      { term: 'Subsidy Effect on Supply', def: 'Government subsidy reduces production cost → producers can supply MORE at every price → supply curve shifts RIGHTWARD.', example: '🌾 Govt gives ₹2000/quintal subsidy to wheat farmers → their costs fall → they supply more → curve shifts right.', formula: 'Subsidy → ↓ cost → ↑ supply → Rightward shift', cbse: 'Factor affecting supply — very common 3-marker' },
      { term: 'Tax Effect on Supply', def: 'Tax on producers raises production cost → producers supply LESS at every price → supply curve shifts LEFTWARD.', example: '🏭 Increase in GST for manufacturers raises their production costs → they supply less at every price level.', formula: 'Tax → ↑ cost → ↓ supply → Leftward shift', cbse: 'Opposite of subsidy — asked together in questions' },
      { term: 'Technology & Supply', def: 'Better technology reduces production cost and increases efficiency → producers supply MORE → supply curve shifts RIGHTWARD.', example: '🤖 Robots in car factories → cars produced faster and cheaper per unit → supply increases significantly.', formula: 'Better technology → ↓ cost → ↑ supply', cbse: 'Factor affecting supply — 2-mark explanation' },
      { term: 'Producer Surplus', def: 'Extra revenue a producer gets by selling at a price HIGHER than the minimum price they would have accepted.', example: '🏪 Shopkeeper willing to sell at ₹40 but market price is ₹60. Producer surplus = ₹20 per unit.', formula: 'PS = Actual Price − Minimum Acceptable Price', cbse: 'Triangle above supply curve — diagram based question' },
      { term: 'Change in Supply vs Quantity Supplied', def: 'CHANGE IN QS: movement along existing supply curve — only due to price change. CHANGE IN SUPPLY: entire curve shifts — due to non-price factors.', example: '📊 Price rises → movement along curve (more supplied). Input cost falls → entire supply curve shifts right.', formula: null, cbse: '⚠️ Parallel confusion to demand — exam trap' },
    ],
  },
  {
    id: 'equilibrium', emoji: '⚖️', title: 'Market Equilibrium',
    subtitle: 'Price mechanisms & market forces',
    color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.35)',
    cards: [
      { term: 'Market Equilibrium', def: 'The price at which quantity demanded EXACTLY EQUALS quantity supplied. No surplus, no shortage, no pressure for price to change.', example: '🎯 At ₹50/kg for tomatoes, the exact amount farmers want to sell equals what consumers want to buy.', formula: 'Equilibrium: Qd = Qs at price Pe', cbse: '🔥 Diagram must — appears in every board paper' },
      { term: 'Excess Demand (Shortage)', def: 'When quantity demanded EXCEEDS quantity supplied at the current market price. Puts upward pressure on price until equilibrium is restored.', example: '🎫 IPL Final tickets at ₹500 official price — millions want them but few available. Black market emerges at ₹5000.', formula: 'Qd > Qs → price rises → new equilibrium', cbse: 'With diagram showing price adjustment mechanism' },
      { term: 'Excess Supply (Surplus)', def: 'When quantity supplied EXCEEDS quantity demanded at current price. Unsold stock puts downward pressure on price.', example: '🍅 Bumper tomato harvest floods market → too many tomatoes → price crashes → farmers dump on roads.', formula: 'Qs > Qd → price falls → new equilibrium', cbse: 'Opposite of excess demand — diagram must' },
      { term: 'Price Floor', def: 'Minimum price set by government ABOVE the equilibrium price. Protects producers. Creates permanent excess supply (surplus) in the market.', example: '🌾 MSP (Minimum Support Price) for wheat farmers set at ₹2015/quintal above market price → govt must buy surplus.', formula: 'Price Floor > Pe → Qs > Qd → Surplus', cbse: '⚠️ Very commonly asked with diagram — 4-5 marks' },
      { term: 'Price Ceiling', def: 'Maximum price set by government BELOW the equilibrium price. Protects consumers. Creates permanent excess demand (shortage) in the market.', example: '🏠 Rent control laws cap rents at ₹5000/month below market ₹12,000 → shortage of rental housing in cities.', formula: 'Price Ceiling < Pe → Qd > Qs → Shortage', cbse: '⚠️ Very commonly asked with diagram — 4-5 marks' },
      { term: 'Black Market', def: 'Illegal parallel market that emerges when price ceilings create shortages. Goods are sold at prices above the legal maximum through unofficial channels.', example: '💊 During COVID, oxygen cylinders were sold at 10× the legal price through black market channels.', formula: null, cbse: 'Consequence of price ceiling — 2 mark explanation' },
      { term: 'Effects of Shift in Demand', def: 'Rightward shift in demand (increase) → equilibrium price RISES, equilibrium quantity RISES. Leftward shift → price falls, quantity falls.', example: '📱 Festive season → demand for electronics rises → new equilibrium at higher price and higher quantity sold.', formula: 'D↑ → Pe↑ Qe↑ | D↓ → Pe↓ Qe↓', cbse: 'Diagram analysis — 3-4 mark question' },
      { term: 'Effects of Shift in Supply', def: 'Rightward shift in supply (increase) → equilibrium price FALLS, equilibrium quantity RISES. Leftward shift → price rises, quantity falls.', example: '🚜 Better monsoon → wheat supply increases → wheat price falls, more wheat sold in market.', formula: 'S↑ → Pe↓ Qe↑ | S↓ → Pe↑ Qe↓', cbse: 'Diagram analysis — 3-4 mark question' },
    ],
  },
  {
    id: 'national-income', emoji: '💰', title: 'National Income',
    subtitle: 'GDP, GNP, multiplier & paradoxes',
    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.35)',
    cards: [
      { term: 'GDP (Gross Domestic Product)', def: 'Total market value of all FINAL goods and services produced WITHIN a country\'s geographic boundary in a year, regardless of who produces them.', example: '🇮🇳 A Japanese car factory in India → production counts in India\'s GDP. An Indian IT worker in USA → NOT in India\'s GDP.', formula: 'GDP = C + I + G + (X − M)', cbse: '🔥 Formula must — 5-marker every year' },
      { term: 'GNP (Gross National Product)', def: 'Total market value of all final goods and services produced BY a country\'s nationals (residents) — anywhere in the world.', example: '👨‍💼 Indian worker in USA earning $100K → adds to India\'s GNP. Foreign factory in India → NOT in India\'s GNP.', formula: 'GNP = GDP + NFIA', cbse: 'GDP vs GNP difference — 3 mark question' },
      { term: 'Net Factor Income from Abroad (NFIA)', def: 'Income EARNED by residents from abroad MINUS income PAID to non-residents within the country. The bridge between GDP and GNP.', example: '💸 Indian IT workers in USA send $10B home. Foreign companies earn ₹5B from India. NFIA = +$10B − ₹5B equivalent.', formula: 'NFIA = Factor income received from abroad − Factor income paid to abroad', cbse: 'Bridge concept — asked in 3-mark definitional questions' },
      { term: 'Transfer Payments', def: 'One-way payments made WITHOUT any productive activity in return. NOT included in national income as they don\'t create new goods/services.', example: '💰 Old age pension, student scholarships, unemployment allowance, gifts — no output is produced in exchange.', formula: 'Transfer payments → EXCLUDED from National Income', cbse: '⚠️ Trick question every year — "should it be included?"' },
      { term: 'Investment Multiplier', def: 'Shows how an initial injection of investment increases national income by a MULTIPLE amount through successive rounds of spending in the circular flow.', example: '🏗️ Govt spends ₹100Cr on roads → workers earn & spend → shopkeepers earn & spend → total impact = ₹500Cr (K=5).', formula: 'K = 1 ÷ (1 − MPC) = 1 ÷ MPS', cbse: '🔥 Numerical — if MPC = 0.8, K = 5. Appears every year.' },
      { term: 'MPC (Marginal Propensity to Consume)', def: 'The fraction of additional income that a household spends on consumption. Always between 0 and 1.', example: '💳 Income rises by ₹1000. You spend ₹800 extra on consumption. MPC = 800/1000 = 0.8', formula: 'MPC = ΔC ÷ ΔY (always 0 < MPC < 1)', cbse: '🔥 Used in multiplier formula — must memorize' },
      { term: 'MPS (Marginal Propensity to Save)', def: 'The fraction of additional income that a household SAVES. Always between 0 and 1. Directly related to multiplier.', example: '🏦 Income rises by ₹1000. You save ₹200 extra. MPS = 200/1000 = 0.2. Higher MPS = smaller multiplier.', formula: 'MPS = ΔS ÷ ΔY = 1 − MPC', cbse: 'MPC + MPS = 1 always. Check: K = 1/MPS' },
      { term: 'Paradox of Thrift', def: 'If ALL households try to save more simultaneously, total savings in the economy actually FALL. Individual rational behaviour becomes collectively irrational.', example: '😱 Recession: everyone saves more → less consumption → businesses earn less → workers earn less → everyone has less to save!', formula: 'More saving by all → ↓ income → ↓ total savings', cbse: '⚠️ Higher-order thinking question — 4-5 marks explanation' },
      { term: 'Value Added Method', def: 'GDP calculated as sum of value added at each stage of production. Prevents double counting of intermediate goods.', example: '🌾 Farmer: ₹10 (wheat) → Miller adds ₹15 (flour) → Bakery adds ₹25 (bread) → GDP contribution = ₹50 total.', formula: 'Value Added = Output − Intermediate Consumption', cbse: 'Method of calculating GDP — 5 mark detailed question' },
      { term: 'Double Counting Problem', def: 'Counting the same value more than once when calculating national income by including both intermediate and final goods.', example: '❌ Wrong: Count steel ₹100 + count car ₹800 = ₹900. ✅ Right: Only count final goods (car ₹800) OR value added at each stage.', formula: 'Solution: Use Final Goods Method OR Value Added Method', cbse: 'Why we exclude intermediate goods — conceptual 3-marker' },
    ],
  },
  {
    id: 'money-banking', emoji: '🏦', title: 'Money & Banking',
    subtitle: 'RBI tools, credit creation & inflation',
    color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.35)',
    cards: [
      { term: 'Repo Rate', def: 'Rate at which RBI lends money to commercial banks for short term. Primary tool to control inflation and credit availability in the economy.', example: '📉 RBI raises repo rate → banks pay more to borrow from RBI → banks raise loan rates → people & businesses borrow less → inflation cools.', formula: 'Higher Repo → costlier credit → less money supply → controls inflation', cbse: '🔥 Most asked monetary policy tool — appears every year' },
      { term: 'Reverse Repo Rate', def: 'Rate at which RBI BORROWS money from commercial banks. When banks park excess funds with RBI, they earn this rate. Always lower than repo rate.', example: '🏦 High reverse repo → banks prefer parking money with RBI → less lending in economy → money supply shrinks.', formula: 'Reverse Repo Rate < Repo Rate (always)', cbse: 'Opposite of repo — often asked as a pair' },
      { term: 'CRR (Cash Reserve Ratio)', def: 'Minimum percentage of a bank\'s total deposits that must be kept as cash reserve WITH the RBI. This amount cannot be lent out or invested.', example: '💵 CRR = 4%, Bank deposits = ₹100Cr → must keep ₹4Cr with RBI → only ₹96Cr available to lend.', formula: 'High CRR → less funds to lend → lower money supply', cbse: 'Quantitative credit control tool — compare with SLR' },
      { term: 'SLR (Statutory Liquidity Ratio)', def: 'Percentage of deposits banks must maintain in LIQUID ASSETS (cash, gold, government securities). In addition to CRR. Held by bank itself, not with RBI.', example: '📜 SLR = 18%: Bank keeps ₹18Cr in govt bonds per ₹100Cr deposits → only ₹78Cr (minus CRR) to lend.', formula: 'CRR: held with RBI | SLR: held by bank in liquid assets', cbse: 'CRR vs SLR difference — common 3-mark question' },
      { term: 'Credit Multiplier', def: 'Shows how an initial bank deposit creates MULTIPLE times more money through successive rounds of lending and re-depositing in the banking system.', example: '💰 ₹1000 deposited, CRR=10% → bank lends ₹900 → deposited elsewhere → bank lends ₹810 → ... total money created = ₹10,000', formula: 'Credit Multiplier = 1 ÷ CRR', cbse: '🔥 Numerical — if CRR = 20%, multiplier = 5. Appears yearly.' },
      { term: 'Open Market Operations (OMO)', def: 'RBI buys or sells government securities in the open market to directly control the money supply in the banking system.', example: '📈 RBI BUYS govt bonds → pays money to banks → banks have more funds to lend → money supply INCREASES → stimulates economy.', formula: 'Buy bonds → ↑ money supply | Sell bonds → ↓ money supply', cbse: 'Qualitative vs quantitative credit control — explain each' },
      { term: 'Demand Deposits', def: 'Bank deposits that can be withdrawn ON DEMAND without any prior notice. They are treated as money because they function just like currency.', example: '🏧 Savings account balance, current account balance — you can withdraw via ATM, write cheques, make UPI payments anytime.', formula: 'M1 = Currency in Circulation + Demand Deposits with Banks', cbse: 'Types of deposits and money supply — 2 mark definition' },
      { term: 'Demand-Pull Inflation', def: 'Inflation caused by EXCESS DEMAND in the economy. Too much money chasing too few goods. Economy operating beyond full employment.', example: '🔥 Post-COVID reopening: everyone wants to travel, eat out, buy goods at once → massive demand surge → prices shoot up.', formula: 'Too much money → Too few goods → Prices rise', cbse: 'Type of inflation — contrast with cost-push' },
      { term: 'Cost-Push Inflation', def: 'Inflation caused by RISING PRODUCTION COSTS pushing up prices from the supply side. Supply contracts, prices rise, output falls.', example: '⛽ Russia-Ukraine war → crude oil price spikes → petrol costs rise → transport costs rise → ALL prices rise.', formula: 'Input costs ↑ → Supply ↓ → Prices ↑ (stagflation risk)', cbse: 'Type of inflation — diagram: supply curve shifts left' },
      { term: 'Fiscal Policy', def: 'Government\'s use of taxation and public expenditure to influence economic activity, growth, employment and price levels.', example: '🏗️ Recession: govt builds highways & schools (↑G) and cuts taxes (↓T) → more spending → jobs created → economy revives.', formula: 'Expansionary: ↑G or ↓T | Contractionary: ↓G or ↑T', cbse: 'Compare with monetary policy — 5 mark essay question' },
    ],
  },
];

// ─── FLIP CARD COMPONENT ──────────────────────────────────────────────────────
function FlipCard({ card, color, bg, border, onKnow, onAgain }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div style={{ perspective: '1400px' }} className="w-full">
      <motion.div
        style={{ transformStyle: 'preserve-3d', position: 'relative', minHeight: '420px' }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 130, damping: 20 }}
        className="w-full"
      >
        {/* ── FRONT ── */}
        <div
          style={{
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            background: bg,
            border: `1px solid ${border}`,
            boxShadow: `0 0 60px ${color}18, 0 20px 40px rgba(0,0,0,0.4)`,
            minHeight: '420px',
          }}
          className="rounded-3xl p-8 flex flex-col cursor-pointer select-none"
          onClick={() => setFlipped(true)}
        >
          {/* top badge */}
          <div className="flex justify-between items-start mb-6">
            <span className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}>
              🃏 Flashcard
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Tap to reveal →</span>
          </div>

          {/* center content */}
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-6"
            >
              🃏
            </motion.div>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
              {card.term}
            </h2>
            <p className="text-sm" style={{ color: '#64748b' }}>
              Do you know this concept?
            </p>
          </div>

          {/* bottom hint */}
          <div className="flex justify-center mt-6">
            <motion.div
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full"
              style={{ background: '#f8fafc', color: '#94a3b8', border: '1px solid #e2e8f0' }}
            >
              👇 Tap card to flip
            </motion.div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div
          style={{
            backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute', inset: 0,
            background: 'linear-gradient(160deg, rgba(10,15,44,0.98) 0%, rgba(15,20,55,0.98) 100%)',
            border: `1px solid ${border}`,
            boxShadow: `0 0 60px ${color}25, 0 20px 40px rgba(0,0,0,0.5)`,
            minHeight: '420px',
            overflowY: 'auto',
          }}
          className="rounded-3xl p-7 flex flex-col"
        >
          {/* term heading */}
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 rounded-full" style={{ background: color }} />
            <h3 className="text-lg font-black text-white">{card.term}</h3>
          </div>

          {/* definition */}
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {card.def}
          </p>

          {/* example */}
          {card.example && (
            <div className="rounded-xl p-3 mb-3"
              style={{ background: `${color}10`, border: `1px solid ${color}25` }}>
              <div className="text-xs font-bold mb-1.5" style={{ color }}>💡 Real-World Example</div>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                {card.example}
              </p>
            </div>
          )}

          {/* formula */}
          {card.formula && (
            <div className="rounded-xl p-3 mb-3"
              style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
              <div className="text-xs font-bold mb-1" style={{ color: '#fbbf24' }}>📐 Key Formula / Rule</div>
              <p className="text-xs font-mono leading-relaxed" style={{ color: '#fde68a' }}>{card.formula}</p>
            </div>
          )}

          {/* cbse tip */}
          {card.cbse && (
            <div className="rounded-xl p-2.5 mb-4"
              style={{ background: 'rgba(212,175,55,0.06)', border: '1px solid rgba(212,175,55,0.18)' }}>
              <p className="text-xs font-medium" style={{ color: '#D4AF37' }}>
                📋 Board Tip: {card.cbse}
              </p>
            </div>
          )}

          {/* action buttons — only shown after flip */}
          {flipped && (
            <div className="flex gap-3 mt-auto pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onAgain(); }}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all"
                style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,133,0.3)' }}
              >
                🔄 Show Again
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={(e) => { e.stopPropagation(); onKnow(); }}
                className="flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all"
                style={{ background: 'rgba(52,211,153,0.15)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', boxShadow: '0 0 20px rgba(52,211,153,0.15)' }}
              >
                ✓ I Know This!
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── CHAPTER SELECTION CARD ───────────────────────────────────────────────────
function ChapterCard({ chapter, masteredTerms, onStart, index }) {
  const total = chapter.cards.length;
  const mastered = masteredTerms ? masteredTerms.length : 0;
  const pct = total > 0 ? Math.round((mastered / total) * 100) : 0;

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.97 }}
      onClick={onStart}
      className="text-left w-full rounded-3xl p-5 sm:p-6 transition-all"
      style={{
        background: chapter.bg,
        border: `1px solid ${chapter.border}`,
        boxShadow: `0 8px 30px ${chapter.color}12`,
      }}
    >
      {/* top row */}
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">{chapter.emoji}</div>
        <div className="text-right">
          <div className="text-xs font-bold" style={{ color: chapter.color }}>{mastered}/{total}</div>
          <div className="text-[10px]" style={{ color: '#64748b' }}>mastered</div>
        </div>
      </div>

      <h3 className="text-lg font-black text-white mb-0.5">{chapter.title}</h3>
      <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.45)' }}>{chapter.subtitle}</p>

      {/* progress bar */}
      <div className="h-1.5 rounded-full mb-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ delay: index * 0.07 + 0.3, duration: 0.8, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}aa)` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold" style={{ color: '#94a3b8' }}>
          {total} cards
        </span>
        <span className="text-xs font-black" style={{ color: chapter.color }}>
          {pct === 0 ? 'Start →' : pct === 100 ? '✓ Complete' : `${pct}% done →`}
        </span>
      </div>
    </motion.button>
  );
}

// ─── CELEBRATION PARTICLE ─────────────────────────────────────────────────────
function Particle({ color }) {
  const x = (Math.random() - 0.5) * 300;
  const y = -(Math.random() * 200 + 100);
  const size = Math.random() * 8 + 4;
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, background: color, top: '50%', left: '50%' }}
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: Math.random() * 1 + 0.8, ease: 'easeOut' }}
    />
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Flashcards() {
  const [screen, setScreen] = useState('home'); // 'home' | 'study' | 'review' | 'done'
  const [chapter, setChapter] = useState(null);
  const [queue, setQueue] = useState([]);
  const [againList, setAgainList] = useState([]);
  const [known, setKnown] = useState([]);
  const [cardDir, setCardDir] = useState(1);
  const [showParticles, setShowParticles] = useState(false);
  const [progress, setProgress] = useState(loadProgress);

  // current card
  const currentCard = queue[0] || null;

  // total across all chapters
  const totalCards = CHAPTERS.reduce((s, c) => s + c.cards.length, 0);
  const totalMastered = CHAPTERS.reduce((s, c) => s + (progress[c.id]?.length || 0), 0);

  function startChapter(ch, reviewOnly = false) {
    const masteredTerms = progress[ch.id] || [];
    const cards = reviewOnly
      ? ch.cards.filter(c => !masteredTerms.includes(c.term))
      : ch.cards;
    setChapter(ch);
    setQueue(shuffle(cards));
    setAgainList([]);
    setKnown([]);
    setScreen('study');
  }

  function handleKnow() {
    setCardDir(-1);
    const card = queue[0];
    const newKnown = [...known, card.term];
    setKnown(newKnown);

    // persist progress for this chapter
    const chMastered = [...new Set([...(progress[chapter.id] || []), card.term])];
    const newProgress = { ...progress, [chapter.id]: chMastered };
    setProgress(newProgress);
    saveProgress(newProgress);

    const remaining = queue.slice(1);
    if (remaining.length === 0 && againList.length === 0) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 1500);
      setScreen('done');
    } else {
      setQueue(remaining);
    }
  }

  function handleAgain() {
    setCardDir(1);
    const card = queue[0];
    const remaining = queue.slice(1);
    setAgainList(prev => [...prev, card]);
    if (remaining.length === 0) {
      if (againList.length + 1 > 0) {
        setScreen('review');
      }
    } else {
      setQueue(remaining);
    }
  }

  function startReview() {
    setQueue(shuffle([...againList, queue[0]].filter(Boolean)));
    setAgainList([]);
    setScreen('study');
  }

  function resetChapter() {
    const newProgress = { ...progress, [chapter.id]: [] };
    setProgress(newProgress);
    saveProgress(newProgress);
    startChapter(chapter, false);
  }

  // ── HOME SCREEN ──────────────────────────────────────────────────────────────
  if (screen === 'home') {
    return (
      <div className="min-h-screen py-20 px-4" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
        <div className="max-w-2xl mx-auto">
          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}>
              🃏 Spaced Repetition
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
              Flashcard <span style={{ color: '#D4AF37' }}>Flipper</span>
            </h1>
            <p className="text-base max-w-md mx-auto mb-2" style={{ color: '#475569' }}>
              Tap a card to reveal the definition. Mark what you know — review what you don't.
            </p>
            {totalMastered > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mt-2"
                style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}
              >
                ⭐ {totalMastered}/{totalCards} cards mastered overall
              </motion.div>
            )}
          </motion.div>

          {/* chapter grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {CHAPTERS.map((ch, i) => (
              <ChapterCard
                key={ch.id}
                chapter={ch}
                masteredTerms={progress[ch.id]}
                onStart={() => startChapter(ch)}
                index={i}
              />
            ))}
          </div>

          {/* overall progress bar */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl p-5"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>Overall Mastery</span>
              <span className="text-sm font-black" style={{ color: '#D4AF37' }}>
                {totalMastered}/{totalCards}
              </span>
            </div>
            <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.round((totalMastered / totalCards) * 100)}%` }}
                transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #D4AF37, #F0C040)' }}
              />
            </div>
            <p className="text-xs mt-2" style={{ color: '#64748b' }}>
              {totalCards - totalMastered} cards left to master • Progress saved automatically
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── STUDY SCREEN ─────────────────────────────────────────────────────────────
  if (screen === 'study' && chapter) {
    const totalInSession = known.length + againList.length + queue.length;
    const doneInSession = known.length + againList.length;
    const pct = totalInSession > 0 ? Math.round((doneInSession / totalInSession) * 100) : 0;
    const masteredCount = (progress[chapter.id] || []).length;

    return (
      <div className="min-h-screen py-20 px-4" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
        <div className="max-w-xl mx-auto">
          {/* top bar */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setScreen('home')}
              className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              ← Back
            </button>
            <div className="text-center">
              <div className="text-sm font-black text-white">{chapter.emoji} {chapter.title}</div>
              <div className="text-xs" style={{ color: '#94a3b8' }}>
                Card {doneInSession + 1} of {totalInSession}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold" style={{ color: '#34d399' }}>✓ {known.length} known</div>
              <div className="text-xs" style={{ color: '#f87171' }}>🔄 {againList.length} again</div>
            </div>
          </div>

          {/* progress bar */}
          <div className="h-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
              className="h-full rounded-full"
              style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}cc)` }}
            />
          </div>

          {/* mastered badge */}
          {masteredCount > 0 && (
            <div className="flex justify-center mb-4">
              <div className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(212,175,55,0.1)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.2)' }}>
                ⭐ {masteredCount}/{chapter.cards.length} mastered in this chapter
              </div>
            </div>
          )}

          {/* card */}
          <AnimatePresence mode="wait">
            {currentCard && (
              <motion.div
                key={currentCard.term}
                initial={{ opacity: 0, x: cardDir * 60, scale: 0.93 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: cardDir * -60, scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              >
                <FlipCard
                  card={currentCard}
                  color={chapter.color}
                  bg={chapter.bg}
                  border={chapter.border}
                  onKnow={handleKnow}
                  onAgain={handleAgain}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* keyboard hint */}
          <p className="text-center text-xs mt-5" style={{ color: '#94a3b8' }}>
            Be honest with yourself — spaced repetition works best when you're truthful!
          </p>
        </div>
      </div>
    );
  }

  // ── REVIEW PROMPT SCREEN ─────────────────────────────────────────────────────
  if (screen === 'review' && chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center rounded-3xl p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(10,15,44,0.9))',
            border: '1px solid rgba(167,139,250,0.3)',
          }}
        >
          <div className="text-6xl mb-4">🔄</div>
          <h2 className="text-2xl font-black text-white mb-2">Almost there!</h2>
          <p className="text-sm mb-6" style={{ color: '#374151' }}>
            You marked <span className="font-bold text-white">{againList.length}</span> card{againList.length !== 1 ? 's' : ''} for review.
            Want to go through them again?
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={startReview}
              className="w-full py-4 rounded-2xl font-black text-base"
              style={{ background: 'linear-gradient(135deg, #a78bfa, #7c3aed)', color: 'white', boxShadow: '0 8px 25px rgba(124,58,237,0.3)' }}
            >
              🔄 Review {againList.length} card{againList.length !== 1 ? 's' : ''}
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => { setShowParticles(true); setTimeout(() => setShowParticles(false), 1500); setScreen('done'); }}
              className="w-full py-3 rounded-2xl font-bold text-sm"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
            >
              Skip — I'm done for now
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── DONE SCREEN ──────────────────────────────────────────────────────────────
  if (screen === 'done' && chapter) {
    const chMastered = (progress[chapter.id] || []).length;
    const total = chapter.cards.length;
    const pct = Math.round((chMastered / total) * 100);
    const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : 1;

    return (
      <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
        {/* particles */}
        {showParticles && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Particle key={i} color={[chapter.color, '#D4AF37', '#34d399', '#f87171'][i % 4]} />
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="max-w-md w-full text-center rounded-3xl p-8"
          style={{
            background: `linear-gradient(135deg, ${chapter.bg}, rgba(10,15,44,0.97))`,
            border: `1px solid ${chapter.border}`,
            boxShadow: `0 0 80px ${chapter.color}20`,
          }}
        >
          {/* stars */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="text-5xl mb-2"
          >
            {['⭐', '⭐⭐', '⭐⭐⭐'][stars - 1]}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-black text-white mb-1"
          >
            {pct === 100 ? 'Perfect! 🎉' : pct >= 75 ? 'Great Job! 🔥' : 'Keep Going! 💪'}
          </motion.h2>

          <p className="text-sm mb-6" style={{ color: '#475569' }}>
            {chapter.emoji} {chapter.title} · Session complete
          </p>

          {/* stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'This Session', value: `${known.length} known`, color: '#34d399', emoji: '✓' },
              { label: 'Total Mastered', value: `${chMastered}/${total}`, color: '#D4AF37', emoji: '⭐' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl p-4"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="text-lg font-black" style={{ color: s.color }}>{s.value}</div>
                <div className="text-xs" style={{ color: '#94a3b8' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* progress bar */}
          <div className="mb-6">
            <div className="flex justify-between text-xs mb-1.5">
              <span style={{ color: '#94a3b8' }}>Chapter Mastery</span>
              <span className="font-bold" style={{ color: chapter.color }}>{pct}%</span>
            </div>
            <div className="h-2.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}cc)` }}
              />
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => startChapter(chapter, pct === 100 ? false : true)}
              className="w-full py-4 rounded-2xl font-black text-sm text-navy-950"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)', boxShadow: '0 8px 25px rgba(212,175,55,0.3)' }}
            >
              {pct < 100 ? `🔄 Review ${total - chMastered} remaining` : '🔀 Shuffle All Again'}
            </motion.button>
            <button
              onClick={() => setScreen('home')}
              className="w-full py-3 rounded-2xl font-bold text-sm"
              style={{ background: '#f8fafc', color: '#64748b', border: '1px solid #e2e8f0' }}
            >
              ← Choose Another Chapter
            </button>
            <button
              onClick={resetChapter}
              className="text-xs py-2"
              style={{ color: '#94a3b8' }}
            >
              Reset progress for this chapter
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
