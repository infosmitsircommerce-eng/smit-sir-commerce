import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowRightLeft,
  CalendarDays,
  Factory,
  IndianRupee,
  Package,
  Play,
  RotateCcw,
  ShoppingBag,
  Sparkles,
  Store,
  UserRound,
  UsersRound,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import "../styles/commerceCity.css";

const scenes = [
  { id: "money", label: "Money Flow", helper: "How a normal sale creates profit" },
  { id: "credit", label: "Credit Sale", helper: "Goods now, money later" },
  { id: "price", label: "Price & Demand", helper: "Change price, watch buyers react" },
];

const priceOptions = {
  60: { buyers: 10, sold: 10, profit: 100, note: "Low price → more buyers, small profit on each item." },
  80: { buyers: 6, sold: 6, profit: 180, note: "Middle price → fewer buyers, better profit on each item." },
  100: { buyers: 3, sold: 3, profit: 150, note: "High price → very few buyers, high profit per item." },
};

export default function CommerceCity() {
  const [scene, setScene] = useState("money");
  const [flowStep, setFlowStep] = useState(0);
  const [creditStep, setCreditStep] = useState(0);
  const [price, setPrice] = useState(80);
  const timers = useRef([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const playMoney = () => {
    clearTimers();
    setFlowStep(0);
    timers.current.push(setTimeout(() => setFlowStep(1), 250));
    timers.current.push(setTimeout(() => setFlowStep(2), 1500));
    timers.current.push(setTimeout(() => setFlowStep(3), 2800));
    timers.current.push(setTimeout(() => setFlowStep(4), 4100));
  };

  const playCredit = () => {
    clearTimers();
    setCreditStep(0);
    timers.current.push(setTimeout(() => setCreditStep(1), 250));
    timers.current.push(setTimeout(() => setCreditStep(2), 1700));
    timers.current.push(setTimeout(() => setCreditStep(3), 3100));
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Commerce Hub — Animated Commerce Concepts",
    url: "https://www.smitsircommerce.in/commerce-city",
    description:
      "Animated, beginner-friendly Commerce concept demos for money flow, credit sales and price-demand behaviour.",
    educationalLevel: ["Class 11", "Class 12"],
    learningResourceType: ["Interactive learning", "Animation"],
    isAccessibleForFree: true,
    inLanguage: "en-IN",
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce" },
  };

  return (
    <div className="ch-page">
      <SEO
        title="Commerce Hub — See Commerce Concepts Move"
        description="Learn Commerce visually through simple animated stories: money flow, credit sales and price-demand. No jargon first. Just watch, tap and understand."
        path="/commerce-city"
        structuredData={schema}
      />

      <main className="ch-shell">
        <section className="ch-hero">
          <span className="ch-badge"><Sparkles /> No jargon first</span>
          <h1>Commerce Hub</h1>
          <p>See it. Tap it. Understand it.</p>
          <small>Book ka word baad mein. Pehle concept ko hota hua dekho.</small>
        </section>

        <nav className="ch-scene-tabs" aria-label="Choose a Commerce concept">
          {scenes.map((item) => (
            <button
              key={item.id}
              type="button"
              className={scene === item.id ? "active" : ""}
              onClick={() => {
                clearTimers();
                setScene(item.id);
                setFlowStep(0);
                setCreditStep(0);
              }}
            >
              <strong>{item.label}</strong>
              <span>{item.helper}</span>
            </button>
          ))}
        </nav>

        {scene === "money" && (
          <section className="ch-stage-card">
            <header className="ch-stage-head">
              <div>
                <span>WATCH THIS</span>
                <h2>How does a normal sale create profit?</h2>
              </div>
              <button type="button" className="ch-play" onClick={playMoney}>
                {flowStep ? <RotateCcw /> : <Play />}
                {flowStep ? "Play again" : "Play animation"}
              </button>
            </header>

            <div className={"ch-flow-stage step-" + flowStep}>
              <div className="ch-node supplier">
                <span><Factory /></span>
                <strong>Supplier</strong>
                <small>Sells goods to shop</small>
              </div>

              <div className="ch-lane lane-one">
                <span className="ch-moving package-one"><Package /></span>
                <i>goods worth ₹500</i>
              </div>

              <div className="ch-node shop">
                <span><Store /></span>
                <strong>Shop</strong>
                <small>Buys for ₹500</small>
              </div>

              <div className="ch-lane lane-two">
                <span className="ch-moving package-two"><ShoppingBag /></span>
                <i>goods sold for ₹700</i>
              </div>

              <div className="ch-node customer">
                <span><UserRound /></span>
                <strong>Customer</strong>
                <small>Buys the product</small>
              </div>

              <span className="ch-coin coin-one"><IndianRupee /></span>
              <span className="ch-coin coin-two"><IndianRupee /></span>
            </div>

            <div className="ch-story-line">
              <div className={flowStep >= 1 ? "on" : ""}><b>1</b><span>Shop buys goods for ₹500.</span></div>
              <div className={flowStep >= 2 ? "on" : ""}><b>2</b><span>Customer buys them for ₹700.</span></div>
              <div className={flowStep >= 3 ? "on" : ""}><b>3</b><span>₹700 comes into the shop.</span></div>
              <div className={flowStep >= 4 ? "on" : ""}><b>4</b><span>₹200 is left after ₹500 cost.</span></div>
            </div>

            <div className={"ch-reveal " + (flowStep >= 4 ? "show" : "")}>
              <span>YOU JUST LEARNED</span>
              <strong>Purchase → Sale → Revenue → Profit</strong>
              <p>Profit = Selling Price − Cost Price = ₹700 − ₹500 = ₹200</p>
            </div>
          </section>
        )}

        {scene === "credit" && (
          <section className="ch-stage-card">
            <header className="ch-stage-head">
              <div>
                <span>WATCH THIS</span>
                <h2>What actually happens in a credit sale?</h2>
              </div>
              <button type="button" className="ch-play" onClick={playCredit}>
                {creditStep ? <RotateCcw /> : <Play />}
                {creditStep ? "Play again" : "Play animation"}
              </button>
            </header>

            <div className={"ch-credit-stage step-" + creditStep}>
              <div className="ch-credit-box">
                <span><Store /></span>
                <strong>Shop</strong>
              </div>
              <div className="ch-credit-track">
                <span className="ch-credit-package"><Package /></span>
                <span className="ch-credit-money"><IndianRupee /></span>
                <div className="ch-calendar"><CalendarDays /><b>7 days</b></div>
              </div>
              <div className="ch-credit-box">
                <span><UserRound /></span>
                <strong>Customer</strong>
              </div>
            </div>

            <div className="ch-story-line three">
              <div className={creditStep >= 1 ? "on" : ""}><b>1</b><span>Goods go to customer today.</span></div>
              <div className={creditStep >= 2 ? "on" : ""}><b>2</b><span>Money does NOT come today.</span></div>
              <div className={creditStep >= 3 ? "on" : ""}><b>3</b><span>Customer pays after 7 days.</span></div>
            </div>

            <div className={"ch-reveal " + (creditStep >= 3 ? "show" : "")}>
              <span>YOU JUST LEARNED</span>
              <strong>Credit Sale → Debtor / Trade Receivable</strong>
              <p>Simple meaning: sale ho gayi, cash abhi nahi aaya.</p>
            </div>
          </section>
        )}

        {scene === "price" && (
          <section className="ch-stage-card">
            <header className="ch-stage-head">
              <div>
                <span>TRY IT YOURSELF</span>
                <h2>Change the price. Watch buyers react.</h2>
              </div>
            </header>

            <div className="ch-price-layout">
              <div className="ch-price-control">
                <small>Selling price</small>
                <strong>₹{price}</strong>
                <div className="ch-price-buttons">
                  {[60, 80, 100].map((value) => (
                    <button
                      key={value}
                      type="button"
                      className={price === value ? "active" : ""}
                      onClick={() => setPrice(value)}
                    >
                      ₹{value}
                    </button>
                  ))}
                </div>
              </div>

              <div className="ch-buyers">
                <div className="ch-buyer-title"><UsersRound /><span>People willing to buy</span></div>
                <div className="ch-people" aria-label={priceOptions[price].buyers + " buyers"}>
                  {Array.from({ length: 10 }).map((_, index) => (
                    <span key={index} className={index < priceOptions[price].buyers ? "active" : ""}><UserRound /></span>
                  ))}
                </div>
                <div className="ch-price-result">
                  <div><small>Buyers</small><strong>{priceOptions[price].buyers}</strong></div>
                  <div><small>Units sold</small><strong>{priceOptions[price].sold}</strong></div>
                  <div><small>Profit</small><strong>₹{priceOptions[price].profit}</strong></div>
                </div>
              </div>
            </div>

            <div className="ch-note">
              <ArrowRightLeft />
              <p>{priceOptions[price].note}</p>
            </div>

            <div className="ch-reveal show">
              <span>YOU JUST SAW</span>
              <strong>Price changes → buyers can react → demand changes</strong>
              <p>This is the basic intuition behind price and demand. Real markets can have many other factors too.</p>
            </div>
          </section>
        )}

        <section className="ch-bottom">
          <div>
            <span>THE RULE OF THIS HUB</span>
            <h2>Animation first. Textbook word second.</h2>
          </div>
          <a href="/study-material">Open study material <ArrowRight /></a>
        </section>
      </main>
    </div>
  );
}
