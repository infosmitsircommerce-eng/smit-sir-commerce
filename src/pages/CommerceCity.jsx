import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeIndianRupee,
  Banknote,
  BookOpenCheck,
  BrainCircuit,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Factory,
  Gauge,
  Landmark,
  Lightbulb,
  Network,
  RefreshCw,
  School,
  Sparkles,
  Store,
  Target,
  TrendingDown,
  TrendingUp,
  Truck,
  UsersRound,
  XCircle,
  Zap,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { trackEvent } from "../lib/analytics";
import {
  CITY_ENTITIES,
  COMMERCE_CITY_LENSES,
  COMMERCE_CITY_SCENARIOS,
  dailyScenarioIndex,
} from "../data/commerceCity";
import "../styles/commerceCity.css";

const BRAIN_KEY = "ssc-commerce-city-brain-v1";

const ICONS = {
  bank: Landmark,
  factory: Factory,
  store: Store,
  users: UsersRound,
  government: Building2,
  truck: Truck,
};

function todayKey() {
  const now = new Date();
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, "0"), String(now.getDate()).padStart(2, "0")].join("-");
}

function readBrain() {
  try {
    const parsed = JSON.parse(localStorage.getItem(BRAIN_KEY) || "{}");
    return {
      xp: Number(parsed.xp) || 0,
      streak: Number(parsed.streak) || 0,
      lastDay: parsed.lastDay || null,
      mastery: {
        Economics: Number(parsed.mastery?.Economics) || 0,
        "Business Studies": Number(parsed.mastery?.["Business Studies"]) || 0,
        Accountancy: Number(parsed.mastery?.Accountancy) || 0,
      },
      completed: parsed.completed || {},
    };
  } catch {
    return {
      xp: 0,
      streak: 0,
      lastDay: null,
      mastery: { Economics: 0, "Business Studies": 0, Accountancy: 0 },
      completed: {},
    };
  }
}

function wasYesterday(value) {
  if (!value) return false;
  const previous = new Date(value + "T12:00:00");
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  return previous.toDateString() === yesterday.toDateString();
}

function toneForMetric(value) {
  if (value >= 112) return "up";
  if (value <= 88) return "down";
  return "steady";
}

function formatControl(value, unit) {
  if (unit === "%") return value + "%";
  return String(value);
}

function EntityNode({ entity, active }) {
  const Icon = ICONS[entity.icon] || Building2;
  return (
    <motion.div
      layout
      className={"commerce-city-entity " + (active ? "is-active" : "")}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 24 }}
    >
      <span className="commerce-city-entity-icon"><Icon aria-hidden="true" /></span>
      <span>
        <strong>{entity.name}</strong>
        <small>{entity.type}</small>
      </span>
      {active && <i aria-hidden="true" />}
    </motion.div>
  );
}

function LensIcon({ lens }) {
  if (lens === "Economics") return <TrendingUp aria-hidden="true" />;
  if (lens === "Business Studies") return <Target aria-hidden="true" />;
  return <BadgeIndianRupee aria-hidden="true" />;
}

function BrainBar({ label, value }) {
  return (
    <div className="commerce-brain-row">
      <div>
        <strong>{label}</strong>
        <span>{value}%</span>
      </div>
      <div className="commerce-brain-track">
        <motion.i
          initial={{ width: 0 }}
          animate={{ width: value + "%" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default function CommerceCity() {
  const dailyIndex = dailyScenarioIndex();
  const [scenarioIndex, setScenarioIndex] = useState(dailyIndex);
  const [lens, setLens] = useState("Economics");
  const [controlValue, setControlValue] = useState(COMMERCE_CITY_SCENARIOS[dailyIndex].control.base);
  const [prediction, setPrediction] = useState(null);
  const [brain, setBrain] = useState(readBrain);

  const scenario = COMMERCE_CITY_SCENARIOS[scenarioIndex];
  const lensData = scenario.lenses[lens];
  const activeEntities = new Set(scenario.entities);

  useEffect(() => {
    setControlValue(scenario.control.base);
    setPrediction(null);
    void trackEvent("commerce_city_scenario_view", { scenario: scenario.id, lens });
  }, [scenario.id]);

  useEffect(() => {
    setPrediction(null);
    void trackEvent("commerce_city_lens_change", { scenario: scenario.id, lens });
  }, [lens]);

  useEffect(() => {
    const day = todayKey();
    setBrain((current) => {
      if (current.lastDay === day) return current;
      const next = {
        ...current,
        streak: wasYesterday(current.lastDay) ? current.streak + 1 : 1,
        lastDay: day,
      };
      localStorage.setItem(BRAIN_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const metrics = useMemo(() => {
    const delta = controlValue - scenario.control.base;
    return scenario.metrics.map((metric) => ({
      ...metric,
      value: Math.max(10, Math.min(190, Math.round((metric.base + delta * metric.coeff) * 10) / 10)),
    }));
  }, [controlValue, scenario]);

  const cityPulse = Math.round(metrics.reduce((sum, item) => sum + item.value, 0) / metrics.length);
  const controlMoved = controlValue !== scenario.control.base;
  const correct = prediction === lensData.prediction.answer;

  const choosePrediction = (index) => {
    if (prediction !== null) return;
    setPrediction(index);
    const isCorrect = index === lensData.prediction.answer;
    const completionKey = scenario.id + "::" + lens;
    setBrain((current) => {
      const alreadyCompleted = Boolean(current.completed?.[completionKey]);
      const next = {
        ...current,
        xp: current.xp + (alreadyCompleted ? 0 : isCorrect ? 40 : 15),
        mastery: {
          ...current.mastery,
          [lens]: alreadyCompleted
            ? current.mastery[lens]
            : Math.min(100, current.mastery[lens] + (isCorrect ? 7 : 3)),
        },
        completed: {
          ...current.completed,
          [completionKey]: true,
        },
      };
      localStorage.setItem(BRAIN_KEY, JSON.stringify(next));
      return next;
    });
    void trackEvent("commerce_city_prediction", {
      scenario: scenario.id,
      lens,
      correct: isCorrect,
    });
  };

  const selectScenario = (index) => {
    setScenarioIndex(index);
    setLens("Economics");
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "Commerce City — Living Commerce World",
    url: "https://www.smitsircommerce.in/commerce-city",
    description:
      "An interactive Class 11 and 12 Commerce world where one real-world change connects Economics, Business Studies and Accountancy through prediction, causal chains and exam practice.",
    educationalLevel: ["Class 11", "Class 12"],
    learningResourceType: ["Interactive simulation", "Practice activity", "Concept map"],
    isAccessibleForFree: true,
    inLanguage: "en-IN",
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce" },
  };

  return (
    <div className="commerce-city-page">
      <SEO
        title="Commerce City — A Living Economics, BST & Accounts World"
        description="Change one thing and watch Economics, Business Studies and Accountancy react together. Predict outcomes, reveal causal chains, change reality and turn the same event into exam questions."
        path="/commerce-city"
        structuredData={schema}
      />

      <section className="commerce-city-hero">
        <div className="page-container">
          <div className="commerce-city-hero-grid">
            <div className="commerce-city-hero-copy">
              <span className="commerce-city-kicker"><Sparkles /> Smit Sir Commerce Original Lab</span>
              <h1>Welcome to <em>Commerce City.</em></h1>
              <p>
                Textbooks separate Economics, Business Studies and Accountancy.
                <strong> Reality does not.</strong> Change one thing, predict what happens next,
                then watch the whole Commerce world react.
              </p>
              <div className="commerce-city-hero-actions">
                <button
                  type="button"
                  className="commerce-city-primary-button"
                  onClick={() => document.getElementById("city-event")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                >
                  Enter today's event <ArrowRight />
                </button>
                <span><Zap /> No login · progress saved on this device</span>
              </div>
            </div>

            <div className="commerce-city-skyline" aria-label="Commerce City overview">
              <div className="commerce-city-orbit orbit-one" />
              <div className="commerce-city-orbit orbit-two" />
              <div className="commerce-city-sun"><CircleDollarSign /></div>
              <div className="commerce-city-building building-a"><Landmark /><span>City Bank</span></div>
              <div className="commerce-city-building building-b"><Factory /><span>NovaWorks</span></div>
              <div className="commerce-city-building building-c"><Store /><span>SmitMart</span></div>
              <div className="commerce-city-building building-d"><UsersRound /><span>Households</span></div>
              <svg className="commerce-city-lines" viewBox="0 0 600 330" aria-hidden="true">
                <path d="M95 190 C190 70 320 80 455 145" />
                <path d="M95 190 C220 245 340 260 505 225" />
                <path d="M275 160 C330 170 390 190 505 225" />
                <path d="M275 160 C230 210 190 240 125 260" />
              </svg>
              <div className="commerce-city-pulse-card">
                <small>CITY PULSE</small>
                <strong>{cityPulse}</strong>
                <span>Live scenario index</span>
              </div>
            </div>
          </div>

          <div className="commerce-city-stat-strip">
            <div><Network /><span><strong>{COMMERCE_CITY_SCENARIOS.length}</strong><small>connected realities</small></span></div>
            <div><BrainCircuit /><span><strong>3 lenses</strong><small>Economics · BST · Accounts</small></span></div>
            <div><Target /><span><strong>{brain.xp} XP</strong><small>your Commerce Brain</small></span></div>
            <div><Zap /><span><strong>{brain.streak} day</strong><small>world streak</small></span></div>
          </div>
        </div>
      </section>

      <main className="page-container commerce-city-main">
        <section className="commerce-city-daily-card" id="city-event">
          <div className="commerce-city-daily-top">
            <div>
              <span className="commerce-city-kicker"><Gauge /> Today's city event</span>
              <h2>Something happened in Commerce City.</h2>
            </div>
            <span className="commerce-city-live-dot">LIVE CASE</span>
          </div>
          <div className="commerce-city-scenario-tabs" role="tablist" aria-label="Commerce City scenarios">
            {COMMERCE_CITY_SCENARIOS.map((item, index) => (
              <button
                type="button"
                key={item.id}
                className={index === scenarioIndex ? "is-active" : ""}
                onClick={() => selectScenario(index)}
              >
                <small>{index === dailyIndex ? "TODAY" : String(index + 1).padStart(2, "0")}</small>
                <span>{item.title}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24 }}
              className="commerce-city-event-grid"
            >
              <div className="commerce-city-event-copy">
                <span className="commerce-city-event-tag">{scenario.kicker}</span>
                <h3>{scenario.headline}</h3>
                <p>{scenario.story}</p>
                <div className="commerce-city-affected">
                  <small>AFFECTED NOW</small>
                  <div>
                    {CITY_ENTITIES.filter((entity) => activeEntities.has(entity.id)).map((entity) => {
                      const Icon = ICONS[entity.icon] || Building2;
                      return <span key={entity.id}><Icon /> {entity.name}</span>;
                    })}
                  </div>
                </div>
              </div>

              <div className="commerce-city-reality-control">
                <div className="commerce-city-control-head">
                  <span><RefreshCw /> Change reality</span>
                  <strong>{formatControl(controlValue, scenario.control.unit)}</strong>
                </div>
                <input
                  type="range"
                  min={scenario.control.min}
                  max={scenario.control.max}
                  step={scenario.control.step}
                  value={controlValue}
                  onChange={(event) => setControlValue(Number(event.target.value))}
                  aria-label={scenario.control.label}
                />
                <div className="commerce-city-range-labels">
                  <span>{formatControl(scenario.control.min, scenario.control.unit)}</span>
                  <b>{scenario.control.label}</b>
                  <span>{formatControl(scenario.control.max, scenario.control.unit)}</span>
                </div>
                <p>
                  {controlMoved
                    ? "You changed the world. Watch the city indicators and causal chain through each subject lens."
                    : "Drag the control. The city indicators react immediately — then explain why."}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="commerce-city-world-section">
          <div className="commerce-city-section-head">
            <div>
              <span className="commerce-city-kicker"><Network /> The living world</span>
              <h2>One event. Many balance sheets, decisions and lives.</h2>
            </div>
            <p>Active entities glow. Switch scenarios and the network changes.</p>
          </div>

          <div className="commerce-city-world-grid">
            <div className="commerce-city-map">
              <div className="commerce-city-map-grid" aria-hidden="true" />
              {CITY_ENTITIES.map((entity) => (
                <EntityNode key={entity.id} entity={entity} active={activeEntities.has(entity.id)} />
              ))}
            </div>
            <div className="commerce-city-metrics">
              {metrics.map((metric) => {
                const tone = toneForMetric(metric.value);
                return (
                  <motion.div
                    key={metric.label}
                    layout
                    className={"commerce-city-metric tone-" + tone}
                  >
                    <div>
                      <small>{metric.label}</small>
                      <strong>{metric.value}</strong>
                    </div>
                    {tone === "up" ? <TrendingUp /> : tone === "down" ? <TrendingDown /> : <Gauge />}
                    <span>baseline = 100</span>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="commerce-city-lab">
          <div className="commerce-city-section-head">
            <div>
              <span className="commerce-city-kicker"><Lightbulb /> Subject lenses</span>
              <h2>The same reality looks different through every Commerce subject.</h2>
            </div>
          </div>

          <div className="commerce-city-lens-tabs" role="tablist">
            {COMMERCE_CITY_LENSES.map((item) => (
              <button
                type="button"
                key={item}
                className={lens === item ? "is-active" : ""}
                onClick={() => setLens(item)}
              >
                <LensIcon lens={item} />
                <span>{item}</span>
                <small>{brain.mastery[item]}% brain map</small>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={scenario.id + lens}
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="commerce-city-lens-panel"
            >
              <div className="commerce-city-predict-card">
                <div className="commerce-city-predict-copy">
                  <span className="commerce-city-kicker"><BrainCircuit /> Predict before reveal</span>
                  <h3>{lensData.prediction.prompt}</h3>
                  <p>
                    Concept being trained: <strong>{lensData.concept}</strong>
                  </p>
                </div>
                <div className="commerce-city-options">
                  {lensData.prediction.options.map((option, index) => {
                    const answered = prediction !== null;
                    const isAnswer = index === lensData.prediction.answer;
                    const isChosen = index === prediction;
                    return (
                      <button
                        key={option}
                        type="button"
                        disabled={answered}
                        onClick={() => choosePrediction(index)}
                        className={
                          answered
                            ? isAnswer
                              ? "is-correct"
                              : isChosen
                                ? "is-wrong"
                                : "is-muted"
                            : ""
                        }
                      >
                        <span>{String.fromCharCode(65 + index)}</span>
                        {option}
                        {answered && isAnswer && <CheckCircle2 />}
                        {answered && isChosen && !isAnswer && <XCircle />}
                      </button>
                    );
                  })}
                </div>
                {prediction !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={"commerce-city-feedback " + (correct ? "correct" : "wrong")}
                  >
                    <strong>{correct ? "Chain intact." : "Chain broke here — good. Now repair it."}</strong>
                    <p>{lensData.prediction.why}</p>
                  </motion.div>
                )}
              </div>

              <div className={"commerce-city-chain " + (prediction === null ? "is-locked" : "")}>
                <div className="commerce-city-chain-title">
                  <span><Network /> Causal chain</span>
                  {prediction === null && <small>Predict first to unlock</small>}
                </div>
                {lensData.chain.map(([title, explanation], index) => (
                  <div className="commerce-city-chain-step" key={title}>
                    <span className="commerce-city-step-number">{index + 1}</span>
                    <div>
                      <strong>{title}</strong>
                      <p>{explanation}</p>
                    </div>
                    {index < lensData.chain.length - 1 && <ChevronRight className="commerce-city-step-arrow" />}
                  </div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <section className="commerce-city-exam-section">
          <div className="commerce-city-section-head">
            <div>
              <span className="commerce-city-kicker"><BookOpenCheck /> Turn reality into an exam</span>
              <h2>Same event. Different marks. No memorised script.</h2>
            </div>
            <Link to="/exam-mode">Open full Exam Mode <ArrowRight /></Link>
          </div>
          <div className="commerce-city-exam-grid">
            {lensData.exam.map(([marks, question], index) => (
              <motion.article
                key={marks + question}
                whileHover={{ y: -5 }}
                className="commerce-city-exam-card"
              >
                <span>{marks}</span>
                <small>{lens}</small>
                <h3>{question}</h3>
                <div>
                  <Target />
                  <p>
                    Think from the city chain, not from a memorised paragraph.
                  </p>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="commerce-city-brain-section">
          <div className="commerce-city-brain-card">
            <div className="commerce-city-brain-intro">
              <span className="commerce-city-kicker"><BrainCircuit /> Your Commerce Brain</span>
              <h2>We track connections — not just scores.</h2>
              <p>
                Every prediction strengthens a subject lens. Over time, this becomes a simple map of how confidently
                you connect real events to Commerce concepts.
              </p>
              <div className="commerce-city-brain-badges">
                <span><Zap /> {brain.xp} XP</span>
                <span><Target /> {Object.keys(brain.completed || {}).length} chains explored</span>
                <span><Sparkles /> {brain.streak}-day world streak</span>
              </div>
            </div>
            <div className="commerce-city-brain-bars">
              {COMMERCE_CITY_LENSES.map((item) => (
                <BrainBar key={item} label={item} value={brain.mastery[item]} />
              ))}
            </div>
          </div>
        </section>

        <section className="commerce-city-return-card">
          <div>
            <span className="commerce-city-kicker"><School /> Commerce becomes a world, not a chapter list</span>
            <h2>Come back tomorrow. A different event becomes the lesson.</h2>
            <p>
              Repo rates, prices, credit, taxes, advertising, costs and financing decisions rotate through the city.
              Each one connects the three subjects differently.
            </p>
          </div>
          <div className="commerce-city-return-actions">
            <button
              type="button"
              onClick={() => {
                const next = (scenarioIndex + 1) % COMMERCE_CITY_SCENARIOS.length;
                selectScenario(next);
                document.getElementById("city-event")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              className="commerce-city-primary-button"
            >
              Trigger another event <RefreshCw />
            </button>
            <Link to="/study-material">Open the textbook side <ArrowRight /></Link>
          </div>
        </section>

        <p className="commerce-city-disclaimer">
          Commerce City is an original educational simulation. Causal chains simplify real-world relationships for learning;
          actual outcomes can depend on many additional conditions. It is not an official CBSE/GSEB product or a prediction of real markets.
        </p>
      </main>
    </div>
  );
}
