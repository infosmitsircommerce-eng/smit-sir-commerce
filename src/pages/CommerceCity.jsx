import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  BookOpenCheck,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Factory,
  Home,
  Landmark,
  Lightbulb,
  Package,
  RotateCcw,
  Sparkles,
  Store,
  Target,
  UsersRound,
  WalletCards,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { trackEvent } from "../lib/analytics";
import "../styles/commerceCity.css";

const SAVE_KEY = "ssc-commerce-city-simple-v1";

const PLACES = [
  { id: "home", name: "Your Home", simple: "You buy things here as a customer.", icon: Home, learn: "Consumer" },
  { id: "shop", name: "Your Shop", simple: "You sell products and try to earn profit.", icon: Store, learn: "Business" },
  { id: "bank", name: "Bank", simple: "You save money or borrow money here.", icon: Landmark, learn: "Banking" },
  { id: "factory", name: "Factory / Supplier", simple: "This is where your shop gets products from.", icon: Factory, learn: "Producer" },
  { id: "government", name: "Government", simple: "It makes rules and collects taxes.", icon: Building2, learn: "Business environment" },
];

const INITIAL_STATS = { cash: 10000, customers: 10, stock: 20, profit: 0 };

const MISSIONS = [
  {
    id: "price",
    place: "shop",
    title: "Set the price of your first product",
    situation: "You bought 20 notebooks for ₹50 each. Now you have to decide the selling price.",
    question: "What price will you keep?",
    whyItMatters: "A higher price gives more profit on each notebook, but fewer people may want to buy it.",
    choices: [
      {
        label: "₹60 — Keep it cheap",
        note: "More people may buy, but profit per notebook is small.",
        changes: { cash: 600, customers: 6, stock: -10, profit: 100 },
        result: "Customers liked the low price. You sold more notebooks, but your profit on each one stayed small.",
        everyday: "You changed the selling price and watched customers react.",
        textbook: [["Economics", "Price & demand"], ["Business Studies", "Pricing decision"], ["Accountancy", "Cost price, selling price & profit"]],
        formula: "Profit on one notebook = Selling Price − Cost Price = ₹60 − ₹50 = ₹10",
      },
      {
        label: "₹70 — Balanced price",
        note: "A middle price: reasonable margin and reasonable demand.",
        changes: { cash: 700, customers: 4, stock: -10, profit: 200 },
        result: "You found a balance: fewer buyers than the cheapest option, but more profit on every notebook.",
        everyday: "You balanced customer demand with your own profit.",
        textbook: [["Economics", "Price & demand"], ["Business Studies", "Pricing decision"], ["Accountancy", "Profit margin"]],
        formula: "Profit on one notebook = ₹70 − ₹50 = ₹20",
      },
      {
        label: "₹90 — Premium price",
        note: "High profit per notebook, but some customers may walk away.",
        changes: { cash: 450, customers: -1, stock: -5, profit: 200 },
        result: "You earned more on each sale, but fewer customers bought the notebook.",
        everyday: "You saw the trade-off between price and number of buyers.",
        textbook: [["Economics", "Law of demand — basic intuition"], ["Business Studies", "Pricing strategy"], ["Accountancy", "Margin per unit"]],
        formula: "Profit on one notebook = ₹90 − ₹50 = ₹40",
      },
    ],
  },
  {
    id: "credit",
    place: "home",
    title: "A customer asks: “Can I pay next week?”",
    situation: "A regular customer wants ₹500 of goods today but says they will pay you after 7 days.",
    question: "What will you do?",
    whyItMatters: "A sale can happen today even when cash comes later. That difference is a huge part of Commerce.",
    choices: [
      {
        label: "Allow credit to a trusted customer",
        note: "You make the sale now, but cash comes later.",
        changes: { cash: 0, customers: 3, stock: -5, profit: 120 },
        result: "You made a sale, but no cash entered your shop today. The customer now owes you money.",
        everyday: "Customer took goods now and promised to pay later.",
        textbook: [["Accountancy", "Credit sale & Trade Receivable (Debtor)"], ["Business Studies", "Credit policy"], ["Economics", "Purchasing through credit"]],
        formula: "Sale today ≠ Cash today. Money receivable from customer becomes an asset.",
      },
      {
        label: "Cash only",
        note: "Safer for cash, but you may lose the customer today.",
        changes: { cash: 0, customers: -1, stock: 0, profit: 0 },
        result: "Your cash stayed safe, but you lost this sale for now.",
        everyday: "You protected cash but gave up a possible sale.",
        textbook: [["Business Studies", "Credit policy decision"], ["Accountancy", "Cash sale vs credit sale"], ["Economics", "Buying power and payment timing"]],
        formula: "Cash sale = goods and cash move at the same time.",
      },
    ],
  },
  {
    id: "loan",
    place: "bank",
    title: "You need stock, but you are short of cash",
    situation: "A festival is coming. Customers may buy more, but you need ₹3,000 to buy extra stock.",
    question: "How will you arrange the money?",
    whyItMatters: "Businesses often need money before they earn money. That is where finance and working capital enter.",
    choices: [
      {
        label: "Take a small bank loan",
        note: "You get stock now, but you must return the loan with interest.",
        changes: { cash: 3000, customers: 4, stock: 20, profit: -150 },
        result: "The bank gave you money, so you can buy stock. But the loan is not free — interest is a cost.",
        everyday: "You borrowed money so the business could keep running and prepare for sales.",
        textbook: [["Business Studies", "Working capital & financing decision"], ["Economics", "Bank credit"], ["Accountancy", "Loan = Liability; Interest = Expense"]],
        formula: "Borrowed money increases cash, but it also creates a liability to repay.",
      },
      {
        label: "Do not borrow; buy less stock",
        note: "No interest cost, but you may miss festival sales.",
        changes: { cash: -1200, customers: -2, stock: 8, profit: 0 },
        result: "You avoided debt, but your shop has less stock for the busy period.",
        everyday: "You chose lower risk, but you may also lose an opportunity.",
        textbook: [["Business Studies", "Working capital decision"], ["Economics", "Opportunity cost"], ["Accountancy", "Cash management"]],
        formula: "Every decision has a trade-off: lower borrowing risk can mean lower sales opportunity.",
      },
    ],
  },
  {
    id: "supplier",
    place: "factory",
    title: "Your supplier increases the cost",
    situation: "The notebook that used to cost you ₹50 now costs ₹60 because paper became expensive.",
    question: "What will you do?",
    whyItMatters: "When the cost of making or buying a product rises, the business has to decide who absorbs that extra cost.",
    choices: [
      {
        label: "Raise your selling price a little",
        note: "Protect profit, but some customers may buy less.",
        changes: { cash: 500, customers: -1, stock: -7, profit: 80 },
        result: "You protected some of your margin, but the higher price reduced customer interest a little.",
        everyday: "Higher cost pushed you to reconsider price.",
        textbook: [["Economics", "Cost pressure, price & demand"], ["Business Studies", "Pricing decision"], ["Accountancy", "Cost of goods & gross profit"]],
        formula: "If cost rises and selling price does not rise, profit per unit falls.",
      },
      {
        label: "Keep the same selling price",
        note: "Customers stay happier, but your profit per notebook falls.",
        changes: { cash: 560, customers: 2, stock: -8, profit: 40 },
        result: "Customers liked the unchanged price, but you earned less profit on every sale.",
        everyday: "You absorbed the higher cost yourself.",
        textbook: [["Accountancy", "Lower gross margin"], ["Business Studies", "Pricing decision"], ["Economics", "Cost conditions"]],
        formula: "Same selling price + higher cost = lower margin.",
      },
    ],
  },
  {
    id: "tax",
    place: "government",
    title: "Government changes the tax",
    situation: "A new indirect tax increases the final price of one product category sold in your shop.",
    question: "How will you respond?",
    whyItMatters: "Government decisions can change business costs and customer prices even when the business itself did nothing wrong.",
    choices: [
      {
        label: "Pass most of the extra tax into price",
        note: "Protect margin, but the customer pays more.",
        changes: { cash: 420, customers: -2, stock: -6, profit: 70 },
        result: "Your profit stayed safer, but the higher final price made some customers step back.",
        everyday: "A government rule changed the price customers faced.",
        textbook: [["Economics", "Indirect tax & price"], ["Business Studies", "Economic / legal environment"], ["Accountancy", "Tax collected separately from sales revenue"]],
        formula: "Tax collected for government is not the same thing as your own profit.",
      },
      {
        label: "Absorb part of the tax yourself",
        note: "Customer price rises less, but your margin becomes smaller.",
        changes: { cash: 480, customers: 1, stock: -7, profit: 25 },
        result: "Customers felt less of the tax increase, but your profit margin became thinner.",
        everyday: "You shared the burden of the tax with customers.",
        textbook: [["Economics", "Tax burden"], ["Business Studies", "Pricing under external change"], ["Accountancy", "Margin & tax treatment"]],
        formula: "Business decisions can decide how much of a cost increase reaches the customer.",
      },
    ],
  },
  {
    id: "marketing",
    place: "shop",
    title: "Sales are slow. How will you attract people?",
    situation: "Your shop has stock, but not enough people are coming in. You have ₹500 available for action.",
    question: "What will you try?",
    whyItMatters: "Marketing is not just making ads. It is spending money to influence awareness, demand and sales.",
    choices: [
      {
        label: "Spend ₹500 on local advertising",
        note: "More people may discover the shop, but advertising is an expense.",
        changes: { cash: -100, customers: 6, stock: -6, profit: 90 },
        result: "More people heard about the shop. Some became customers, but the campaign also cost money.",
        everyday: "You spent money to create awareness and bring people to the shop.",
        textbook: [["Business Studies", "Promotion / Advertising"], ["Economics", "Change in demand due to awareness"], ["Accountancy", "Advertising expense"]],
        formula: "More sales do not automatically mean more profit — extra sales must cover the advertising cost.",
      },
      {
        label: "Give a discount",
        note: "People react to the lower price, but margin per item falls.",
        changes: { cash: 350, customers: 4, stock: -7, profit: 35 },
        result: "The discount attracted buyers quickly, but you earned less on each product.",
        everyday: "You used price itself as the tool to attract buyers.",
        textbook: [["Economics", "Price & quantity demanded"], ["Business Studies", "Sales promotion / pricing"], ["Accountancy", "Lower margin per unit"]],
        formula: "Discount can increase sales volume while reducing profit per unit.",
      },
    ],
  },
];

function readSave() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) || "{}");
    return {
      stats: { ...INITIAL_STATS, ...(parsed.stats || {}) },
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      choices: parsed.choices || {},
    };
  } catch {
    return { stats: INITIAL_STATS, completed: [], choices: {} };
  }
}

function statRows(stats) {
  return [
    { key: "cash", label: "Cash in shop", value: "₹" + Math.max(0, stats.cash).toLocaleString("en-IN"), icon: WalletCards, help: "Money available with your shop right now." },
    { key: "customers", label: "Customers", value: Math.max(0, stats.customers), icon: UsersRound, help: "People currently interested in buying from you." },
    { key: "stock", label: "Stock left", value: Math.max(0, stats.stock), icon: Package, help: "Products still available to sell." },
    { key: "profit", label: "Profit earned", value: "₹" + stats.profit.toLocaleString("en-IN"), icon: BadgeIndianRupee, help: "What the business has earned after the costs used in this game." },
  ];
}

export default function CommerceCity() {
  const [started, setStarted] = useState(false);
  const [missionIndex, setMissionIndex] = useState(0);
  const [save, setSave] = useState(readSave);
  const [selected, setSelected] = useState(null);
  const [simpleLanguage, setSimpleLanguage] = useState("english");
  const mission = MISSIONS[missionIndex];
  const activePlace = mission.place;
  const progress = Math.round(((missionIndex + (selected !== null ? 1 : 0)) / MISSIONS.length) * 100);
  const rows = useMemo(() => statRows(save.stats), [save.stats]);

  const choose = (choiceIndex) => {
    if (selected !== null) return;
    const choice = mission.choices[choiceIndex];
    const nextStats = { ...save.stats };
    for (const [key, value] of Object.entries(choice.changes)) nextStats[key] = (nextStats[key] || 0) + value;
    const next = {
      stats: nextStats,
      completed: [...new Set([...save.completed, mission.id])],
      choices: { ...save.choices, [mission.id]: choiceIndex },
    };
    setSelected(choiceIndex);
    setSave(next);
    localStorage.setItem(SAVE_KEY, JSON.stringify(next));
    void trackEvent("commerce_city_choice", { mission: mission.id, choice: choiceIndex });
  };

  const nextMission = () => {
    if (missionIndex < MISSIONS.length - 1) {
      setMissionIndex((value) => value + 1);
      setSelected(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const resetGame = () => {
    const fresh = { stats: INITIAL_STATS, completed: [], choices: {} };
    localStorage.setItem(SAVE_KEY, JSON.stringify(fresh));
    setSave(fresh);
    setMissionIndex(0);
    setSelected(null);
    setStarted(false);
  };

  const result = selected !== null ? mission.choices[selected] : null;
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Commerce City — Learn Commerce by Playing",
    url: "https://www.smitsircommerce.in/commerce-city",
    description: "A beginner-friendly Commerce learning game where students run a small shop and understand Economics, Business Studies and Accountancy through simple real-life decisions.",
    educationalLevel: ["Class 11", "Class 12"],
    learningResourceType: ["Educational game", "Interactive simulation"],
    isAccessibleForFree: true,
    inLanguage: "en-IN",
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce" },
  };

  if (!started) {
    return (
      <div className="cc-page">
        <SEO title="Commerce City — Learn Commerce by Playing" description="Run a simple shop, make everyday decisions and understand Economics, Business Studies and Accountancy without confusing jargon. Free Commerce learning game." path="/commerce-city" structuredData={schema} />
        <main className="cc-intro">
          <div className="cc-intro-card">
            <span className="cc-pill"><Sparkles /> No Commerce knowledge needed</span>
            <h1>Commerce City</h1>
            <p className="cc-intro-lead">Imagine you own a small shop. You buy goods, set prices, deal with customers, take a loan, face taxes and try to earn profit.</p>
            <div className="cc-big-idea"><strong>That is Commerce.</strong><span>Money + goods + people + decisions.</span></div>
            <div className="cc-how-grid">
              <div><span>1</span><strong>See a real-life situation</strong><p>No textbook words first.</p></div>
              <div><span>2</span><strong>Make one decision</strong><p>Like a shop owner would.</p></div>
              <div><span>3</span><strong>See what changed</strong><p>Cash, customers, stock and profit.</p></div>
              <div><span>4</span><strong>Learn the textbook name</strong><p>Practical first. Theory second.</p></div>
            </div>
            <section className="cc-city-explain">
              <div className="cc-section-copy"><span className="cc-eyebrow">What is inside this city?</span><h2>Only 5 simple places.</h2><p>If you understand these five, you already understand the basic world of Commerce.</p></div>
              <div className="cc-place-grid">
                {PLACES.map(({ id, name, simple, icon: Icon, learn }) => (
                  <article key={id} className="cc-place-card"><span><Icon /></span><div><strong>{name}</strong><p>{simple}</p><small>Later you learn: {learn}</small></div></article>
                ))}
              </div>
            </section>
            <div className="cc-start-row">
              <button type="button" className="cc-main-button" onClick={() => { setStarted(true); void trackEvent("commerce_city_start", {}); }}>Start with ₹10,000 <ArrowRight /></button>
              <small>6 short levels · progress saved on this device</small>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="cc-page">
      <SEO title="Commerce City — Learn Commerce by Playing" description="Run a simple shop, make everyday decisions and understand Economics, Business Studies and Accountancy without confusing jargon. Free Commerce learning game." path="/commerce-city" structuredData={schema} />
      <header className="cc-topbar"><div><Link to="/" className="cc-back">Smit Sir Commerce</Link><span>Commerce City</span></div><button type="button" onClick={resetGame}><RotateCcw /> Start again</button></header>
      <main className="cc-game">
        <section className="cc-guide-strip"><div><small>LEVEL {missionIndex + 1} OF {MISSIONS.length}</small><strong>{mission.title}</strong></div><div className="cc-progress"><i style={{ width: progress + "%" }} /></div></section>
        <section className="cc-board">
          <div className="cc-map-panel">
            <div className="cc-map-head"><span className="cc-eyebrow">Your Commerce world</span><h2>See where today's problem is happening.</h2></div>
            <div className="cc-simple-map">
              {PLACES.map(({ id, name, simple, icon: Icon }) => (
                <div key={id} className={"cc-map-place " + (id === activePlace ? "active" : "")}><span><Icon /></span><div><strong>{name}</strong><small>{simple}</small></div>{id === activePlace && <b>Today's place</b>}</div>
              ))}
            </div>
          </div>
          <aside className="cc-status-panel">
            <span className="cc-eyebrow">Your shop right now</span><h2>Nothing fancy. Just four numbers.</h2>
            <div className="cc-stats">{rows.map(({ key, label, value, icon: Icon, help }) => <article key={key}><span><Icon /></span><div><small>{label}</small><strong>{value}</strong><p>{help}</p></div></article>)}</div>
          </aside>
        </section>
        <section className="cc-mission-card">
          <div className="cc-mission-head"><span className="cc-pill"><Target /> Real-life situation</span><h2>{mission.situation}</h2><div className="cc-why-box"><CircleHelp /><p><strong>Why should you care?</strong> {mission.whyItMatters}</p></div></div>
          <div className="cc-question"><span>You are the owner.</span><h3>{mission.question}</h3></div>
          <div className="cc-choice-grid">
            {mission.choices.map((choice, index) => <button key={choice.label} type="button" disabled={selected !== null} className={selected === index ? "selected" : selected !== null ? "muted" : ""} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span><div><strong>{choice.label}</strong><p>{choice.note}</p></div><ChevronRight /></button>)}
          </div>
        </section>
        {result && (
          <section className="cc-learning">
            <div className="cc-result-card"><span className="cc-pill success"><CheckCircle2 /> What happened?</span><h2>{result.result}</h2><div className="cc-everyday"><small>IN NORMAL LANGUAGE</small><strong>{result.everyday}</strong></div></div>
            <div className="cc-translation">
              <div className="cc-section-copy"><span className="cc-eyebrow">Now translate it into Commerce</span><h2>You already understood the idea. Now learn its textbook name.</h2></div>
              <div className="cc-subject-grid">{result.textbook.map(([subject, concept]) => <article key={subject}><small>{subject}</small><strong>{concept}</strong></article>)}</div>
              <div className="cc-formula-box"><Lightbulb /><div><small>REMEMBER THIS</small><strong>{result.formula}</strong></div></div>
            </div>
            <div className="cc-language-row"><button type="button" className={simpleLanguage === "english" ? "active" : ""} onClick={() => setSimpleLanguage("english")}>Simple English</button><button type="button" className={simpleLanguage === "hinglish" ? "active" : ""} onClick={() => setSimpleLanguage("hinglish")}>Hinglish</button></div>
            <div className="cc-teacher-note"><BookOpenCheck />{simpleLanguage === "english" ? <p><strong>Teacher version:</strong> First understand what physically happened in the shop. Only after that remember the chapter word. The chapter word is just a name for something you already saw.</p> : <p><strong>Seedhi baat:</strong> Pehle shop mein kya hua woh samjho. Uske baad chapter ka naam ya definition yaad karo. Commerce ka word bas us real-life situation ka textbook naam hai.</p>}</div>
            {missionIndex < MISSIONS.length - 1 ? <button type="button" className="cc-main-button cc-next" onClick={nextMission}>Next real-life problem <ArrowRight /></button> : <div className="cc-finish"><Sparkles /><h2>You just lived through your first Commerce month.</h2><p>Without starting from definitions, you touched pricing, demand, profit, credit sales, debtors, banking, working capital, cost, tax, business environment, advertising and expenses.</p><div><button type="button" className="cc-main-button" onClick={resetGame}>Play again</button><Link to="/study-material">Now open the textbook side <ArrowRight /></Link></div></div>}
          </section>
        )}
        <p className="cc-disclaimer">Commerce City is an educational game. Numbers are simplified for learning and are not intended to model a real business exactly.</p>
      </main>
    </div>
  );
}
