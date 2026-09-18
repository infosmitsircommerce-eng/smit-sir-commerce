import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  Copy,
  Dna,
  RotateCcw,
  ScanSearch,
  Sparkles,
  Target,
  TriangleAlert,
  WandSparkles,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { trackEvent } from "../lib/analytics";

const LEAK_KEY = "ssc-marks-xray-v1";

const SUBJECT_RULES = {
  Economics: [
    ["National Income", ["gdp", "gnp", "ndp", "nnp", "national income", "factor cost", "market price", "nfia", "net indirect tax"]],
    ["Money & Banking", ["money", "bank", "banking", "credit creation", "repo", "reverse repo", "crr", "slr", "central bank", "rbi"]],
    ["Income Determination", ["mpc", "mps", "multiplier", "equilibrium income", "aggregate demand", "aggregate supply", "consumption function", "saving function"]],
    ["Government Budget", ["government budget", "revenue receipt", "capital receipt", "fiscal deficit", "revenue deficit", "primary deficit"]],
    ["Balance of Payments", ["balance of payments", "bop", "current account", "capital account", "foreign exchange", "depreciation", "appreciation"]],
    ["Demand & Elasticity", ["demand", "quantity demanded", "elasticity", "price elasticity", "consumer equilibrium", "indifference curve"]],
    ["Producer Behaviour", ["cost", "revenue", "producer equilibrium", "supply", "production function", "returns to factor"]],
    ["Market Forms", ["perfect competition", "monopoly", "oligopoly", "monopolistic competition", "price taker", "market equilibrium"]],
    ["Indian Economy", ["poverty", "unemployment", "human capital", "rural development", "infrastructure", "liberalisation", "privatisation", "globalisation", "agriculture", "foreign trade"]],
    ["Growth & Development", ["growth", "development", "hdi", "pqli", "per capita income", "indicators of growth"]],
  ],
  "Business Studies": [
    ["Nature of Management", ["management", "coordination", "levels of management", "objectives of management"]],
    ["Principles of Management", ["fayol", "taylor", "principle", "scientific management", "unity of command", "esprit de corps"]],
    ["Business Environment", ["business environment", "liberalisation", "privatisation", "globalisation", "economic environment", "social environment", "technological environment"]],
    ["Planning", ["planning", "objective", "strategy", "policy", "procedure", "rule", "budget", "programme"]],
    ["Organising", ["organising", "delegation", "decentralisation", "authority", "responsibility", "departmentation", "functional structure", "divisional structure"]],
    ["Staffing", ["staffing", "recruitment", "selection", "training", "development", "placement", "performance appraisal"]],
    ["Directing", ["directing", "motivation", "leadership", "communication", "supervision", "incentive"]],
    ["Controlling", ["controlling", "standards", "deviation", "corrective action", "performance comparison"]],
    ["Financial Management", ["financial management", "capital structure", "working capital", "fixed capital", "dividend decision", "investment decision", "financing decision"]],
    ["Marketing", ["marketing", "marketing mix", "product", "price", "promotion", "place", "branding", "packaging", "labelling"]],
    ["Consumer Protection", ["consumer", "consumer protection", "consumer right", "consumer responsibility", "redressal", "unfair trade practice"]],
  ],
  Accountancy: [
    ["Accounting Equation", ["accounting equation", "assets", "liabilities", "capital", "business transaction"]],
    ["Journal & Ledger", ["journal", "ledger", "posting", "debit", "credit", "narration"]],
    ["Trial Balance", ["trial balance", "error", "suspense account"]],
    ["Depreciation", ["depreciation", "straight line", "written down value", "wdv"]],
    ["Financial Statements", ["trading account", "profit and loss", "balance sheet", "adjustment", "closing stock"]],
    ["Accounting Ratios", ["ratio", "current ratio", "quick ratio", "debt equity", "gross profit ratio", "net profit ratio", "turnover ratio"]],
    ["Cash Flow", ["cash flow", "operating activity", "investing activity", "financing activity"]],
    ["Partnership", ["partnership", "admission", "retirement", "goodwill", "sacrifice ratio", "gaining ratio"]],
    ["Company Accounts", ["shares", "debentures", "issue of shares", "forfeiture", "reissue"]],
  ],
};

const COMMANDS = [
  { key: "Compare", regex: /distinguish|differentiate|difference between|compare/i, verb: "compare the two ideas on the same bases" },
  { key: "Numerical", regex: /calculate|compute|find|determine|work out/i, verb: "show the correct formula, substitution, working and final interpretation" },
  { key: "Reasoning", regex: /justify|give reason|why|reason for/i, verb: "make a claim and support it with the exact economic or business logic" },
  { key: "Analysis", regex: /analyse|analyze|examine|evaluate|comment|assess/i, verb: "break the issue into parts and connect each point to the situation" },
  { key: "Explain", regex: /explain|discuss|describe|elaborate/i, verb: "state the idea and then show how or why it works" },
  { key: "Application", regex: /identify|case study|case-study|which principle|which function|which dimension/i, verb: "spot the hidden concept from the clue and connect the clue back to it" },
  { key: "Recall", regex: /define|state|name|mention|list|what is|what do you mean/i, verb: "give the exact textbook idea directly, without unnecessary story" },
];

const EXAMPLES = [
  {
    label: "BST case",
    subject: "Business Studies",
    marks: 3,
    text: "A manager compares actual sales with the standard sales target and takes corrective action. Identify and explain the function of management involved.",
  },
  {
    label: "Economics",
    subject: "Economics",
    marks: 4,
    text: "Explain any four precautions that should be taken while estimating national income by the value added method.",
  },
  {
    label: "Accountancy",
    subject: "Accountancy",
    marks: 4,
    text: "Calculate the current ratio if current assets are ₹3,60,000 and current liabilities are ₹1,80,000. Interpret the result.",
  },
];

function detectSubject(text, selected) {
  if (selected !== "Auto") return selected;
  const lower = text.toLowerCase();
  const score = Object.fromEntries(Object.keys(SUBJECT_RULES).map((subject) => [subject, 0]));
  for (const [subject, topics] of Object.entries(SUBJECT_RULES)) {
    for (const [, words] of topics) {
      for (const word of words) if (lower.includes(word)) score[subject] += Math.max(1, word.split(" ").length);
    }
  }
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[1] > 0 ? ranked[0][0] : "Economics";
}

function detectTopic(text, subject) {
  const lower = text.toLowerCase();
  const topics = SUBJECT_RULES[subject] || [];
  let best = { topic: "General " + subject, score: 0, clue: "No strong chapter keyword detected" };
  for (const [topic, words] of topics) {
    let score = 0;
    let clue = "";
    for (const word of words) {
      if (lower.includes(word)) {
        score += Math.max(1, word.split(" ").length);
        if (!clue) clue = word;
      }
    }
    if (score > best.score) best = { topic, score, clue };
  }
  return best;
}

function detectCommand(text) {
  return COMMANDS.find((item) => item.regex.test(text)) || {
    key: "Explain",
    verb: "state the core idea, then explain it in clear exam points",
  };
}

function answerShape(command, marks, subject) {
  const n = Number(marks);
  if (command === "Numerical") {
    return [
      "Write what is given and what has to be found.",
      "Write the formula before substituting values.",
      "Show clean working; do not jump straight to the final number.",
      "Finish with the unit, ratio or economic/accounting interpretation.",
    ];
  }
  if (command === "Compare") {
    return [
      "Start with a one-line meaning only if needed.",
      `Use the same basis on both sides; aim for about ${Math.max(2, Math.min(n, 6))} matched differences.`,
      "Do not write two unrelated mini-essays.",
      "Use a table when it improves clarity.",
    ];
  }
  if (command === "Application") {
    return [
      "Write the exact concept or function name first.",
      "Quote or paraphrase the clue from the case.",
      "Explain why that clue proves the concept.",
      n >= 4 ? "Add the relevant feature/process point if the question asks for explanation." : "Stop once the identification and link are complete.",
    ];
  }
  if (command === "Analysis" || command === "Reasoning") {
    return [
      "Open with the direct claim or concept.",
      `Build ${Math.max(2, Math.min(n, 6))} linked reasoning points rather than isolated facts.`,
      "Use cause → effect → implication language.",
      "Finish by tying the reasoning back to the exact question.",
    ];
  }
  return [
    n <= 2 ? "Give the exact meaning or core point immediately." : "Start with the exact concept in one clean line.",
    `Use roughly ${Math.max(1, Math.min(n, 6))} relevant point(s), depending on your school marking scheme.`,
    subject === "Business Studies" ? "Use textbook keywords and short headings." : "Explain each point in one or two precise lines.",
    "Do not add unrelated theory just to make the answer longer.",
  ];
}

function trapsFor(command, subject, topic) {
  const traps = [];
  if (command === "Numerical") traps.push("Using the right numbers with the wrong formula", "Skipping working and losing step marks", "Giving a number without interpretation");
  else if (command === "Application") traps.push("Naming a chapter instead of the exact concept", "Repeating the case without linking the clue", "Writing every possible concept because you are unsure");
  else if (command === "Compare") traps.push("Comparing on different bases", "Writing definitions only", "Missing clear paired differences");
  else traps.push("Answering the topic instead of the command word", "Writing long paragraphs without visible points", "Using generic language instead of chapter keywords");
  if (subject === "Economics") traps.push("Missing the direction of cause-and-effect or the required formula/diagram logic");
  if (subject === "Business Studies") traps.push("Ignoring the exact clue words that identify the principle, function or dimension");
  if (subject === "Accountancy") traps.push("Mixing classification, treatment or formula rules from a nearby chapter");
  if (topic.includes("National Income")) traps.push("Mixing factor cost/market price or domestic/national concepts");
  return [...new Set(traps)].slice(0, 4);
}

function examinerIntent(command, topic, marks) {
  const commandRule = COMMANDS.find((item) => item.key === command);
  return `The examiner is testing whether you can ${commandRule?.verb || "answer directly"} using ${topic} — not whether you can reproduce the whole chapter. For a ${marks}-mark question, relevance and structure matter more than length.`;
}

function mutationSet(topic, subject) {
  const base = topic.replace(/^General /, "");
  if (subject === "Accountancy") {
    return [
      `1 mark → State the core rule used in ${base}.`,
      `3 marks → Explain three steps or treatments used in ${base}.`,
      `4 marks → Solve a short ${base} application and show working.`,
      `Twist → Find the error in a student's ${base} solution and correct it.`,
    ];
  }
  if (subject === "Business Studies") {
    return [
      `1 mark → Identify the concept from one clue related to ${base}.`,
      `3 marks → Explain three features or steps of ${base}.`,
      `4 marks → Read a case and prove why ${base} applies.`,
      `Twist → Distinguish ${base} from the closest confusing concept.`,
    ];
  }
  return [
    `1 mark → Define or identify the core idea in ${base}.`,
    `3 marks → Explain a cause, effect or feature of ${base}.`,
    `4 marks → Apply ${base} to a diagram, numerical or real situation.`,
    `Twist → Give a reason why a change in one variable affects ${base}.`,
  ];
}

function readLeakState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(LEAK_KEY) || "{}");
    return {
      scans: Number(parsed.scans) || 0,
      leaks: parsed.leaks && typeof parsed.leaks === "object" ? parsed.leaks : {},
    };
  } catch {
    return { scans: 0, leaks: {} };
  }
}

export default function MarksXRay() {
  const [board, setBoard] = useState("CBSE");
  const [classLevel, setClassLevel] = useState("12");
  const [subject, setSubject] = useState("Auto");
  const [marks, setMarks] = useState("4");
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [leakState, setLeakState] = useState(readLeakState);
  const [copied, setCopied] = useState(false);

  const topLeak = useMemo(() => {
    const entries = Object.entries(leakState.leaks || {}).sort((a, b) => b[1] - a[1]);
    return entries[0]?.[0] || null;
  }, [leakState]);

  const analyse = () => {
    const text = question.trim();
    if (!text) return;
    const detectedSubject = detectSubject(text, subject);
    const topic = detectTopic(text, detectedSubject);
    const command = detectCommand(text);
    const payload = {
      subject: detectedSubject,
      topic: topic.topic,
      clue: topic.clue,
      command: command.key,
      marks: Number(marks),
      intent: examinerIntent(command.key, topic.topic, marks),
      blueprint: answerShape(command.key, marks, detectedSubject),
      traps: trapsFor(command.key, detectedSubject, topic.topic),
      mutations: mutationSet(topic.topic, detectedSubject),
      time: Math.max(1, Math.round(Number(marks) * 1.6)),
    };
    setResult(payload);
    setLeakState((current) => {
      const next = { ...current, scans: current.scans + 1 };
      localStorage.setItem(LEAK_KEY, JSON.stringify(next));
      return next;
    });
    void trackEvent("marks_xray_scan", {
      board,
      classLevel: Number(classLevel),
      subject: detectedSubject,
      marks: Number(marks),
      command: command.key,
      topic: topic.topic,
    });
  };

  const recordLeak = (type) => {
    setLeakState((current) => {
      const next = {
        scans: current.scans,
        leaks: { ...current.leaks, [type]: (current.leaks?.[type] || 0) + 1 },
      };
      localStorage.setItem(LEAK_KEY, JSON.stringify(next));
      return next;
    });
    void trackEvent("marks_xray_leak_recorded", { type, topic: result?.topic, subject: result?.subject });
  };

  const useExample = (example) => {
    setSubject(example.subject);
    setMarks(String(example.marks));
    setQuestion(example.text);
    setResult(null);
  };

  const reset = () => {
    setQuestion("");
    setResult(null);
  };

  const copyBlueprint = async () => {
    if (!result) return;
    const text = [
      "MARKS X-RAY",
      `Question: ${question}`,
      `Subject: ${result.subject}`,
      `Topic: ${result.topic}`,
      `Command: ${result.command}`,
      `Examiner intent: ${result.intent}`,
      "Answer blueprint:",
      ...result.blueprint.map((item, index) => `${index + 1}. ${item}`),
      "Trap radar:",
      ...result.traps.map((item) => `- ${item}`),
    ].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Marks X-Ray — Commerce Question Decoder",
    url: "https://www.smitsircommerce.in/marks-xray",
    applicationCategory: "EducationalApplication",
    operatingSystem: "Web",
    isAccessibleForFree: true,
    description:
      "A free Class 11 and 12 Commerce question-analysis tool that reveals command words, likely topic, answer structure, mark-loss traps and question mutations.",
    educationalUse: "Exam preparation",
    audience: { "@type": "EducationalAudience", educationalRole: "student" },
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce" },
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-ivory)" }}>
      <SEO
        title="Marks X-Ray — Decode Any Commerce Exam Question"
        description="Paste a Class 11 or 12 Commerce question and instantly reveal the command word, examiner intent, answer blueprint, mark-loss traps and question mutations. Free, no login."
        path="/marks-xray"
        structuredData={schema}
      />

      <section className="page-hero">
        <div className="page-container">
          <div className="max-w-4xl">
            <span className="eyebrow inline-flex items-center gap-2">
              <ScanSearch className="w-4 h-4" /> NEW · Smit Sir Commerce Lab
            </span>
            <h1 className="mt-5">Marks X-Ray</h1>
            <p className="mt-5 text-lg leading-8 max-w-3xl" style={{ color: "var(--muted)" }}>
              Don’t ask only <strong>“What is the answer?”</strong> See what the question is secretly testing:
              the command word, hidden topic, answer shape, mark-loss traps and how the same concept can mutate in the next paper.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 text-sm">
              {["No login", "Runs instantly", "CBSE + GSEB", "Economics + BST + Accountancy"].map((item) => (
                <span key={item} className="tile-paper px-3 py-2 font-semibold">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <main className="page-container section-padding space-y-7">
        <section className="grid xl:grid-cols-[1.05fr_.95fr] gap-6 items-start">
          <div className="card-paper p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="eyebrow">1 · Feed the scanner</span>
                <h2 className="text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                  Paste one exam question
                </h2>
              </div>
              <Dna className="w-8 h-8" style={{ color: "var(--gold)" }} />
            </div>

            <div className="grid sm:grid-cols-4 gap-3 mt-6">
              <label className="text-sm font-semibold">
                <span className="block mb-2">Board</span>
                <select value={board} onChange={(e) => setBoard(e.target.value)} className="w-full rounded-xl border px-3 py-3 bg-white">
                  <option>CBSE</option><option>GSEB</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                <span className="block mb-2">Class</span>
                <select value={classLevel} onChange={(e) => setClassLevel(e.target.value)} className="w-full rounded-xl border px-3 py-3 bg-white">
                  <option>11</option><option>12</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                <span className="block mb-2">Subject</span>
                <select value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full rounded-xl border px-3 py-3 bg-white">
                  <option>Auto</option><option>Economics</option><option>Business Studies</option><option>Accountancy</option>
                </select>
              </label>
              <label className="text-sm font-semibold">
                <span className="block mb-2">Marks</span>
                <select value={marks} onChange={(e) => setMarks(e.target.value)} className="w-full rounded-xl border px-3 py-3 bg-white">
                  {[1,2,3,4,5,6,8].map((n) => <option key={n}>{n}</option>)}
                </select>
              </label>
            </div>

            <label className="block mt-5">
              <span className="sr-only">Paste exam question</span>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                rows={7}
                placeholder="Example: A manager compares actual performance with standards and takes corrective action. Identify and explain the function involved."
                className="w-full rounded-2xl border bg-white p-4 text-base leading-7 resize-y"
                style={{ borderColor: "var(--border-soft)", color: "var(--ink)" }}
              />
            </label>

            <div className="flex flex-wrap gap-2 mt-3">
              {EXAMPLES.map((example) => (
                <button key={example.label} type="button" onClick={() => useExample(example)} className="tile-paper px-3 py-2 text-xs font-bold">
                  Try {example.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mt-6">
              <button type="button" onClick={analyse} disabled={!question.trim()} className="btn-primary inline-flex items-center gap-2 disabled:opacity-50">
                X-Ray this question <ScanSearch className="w-4 h-4" />
              </button>
              <button type="button" onClick={reset} className="btn-outline-ink inline-flex items-center gap-2">
                Reset <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          <aside className="card-paper p-5 sm:p-7">
            <span className="eyebrow">Your personal mark-loss pattern</span>
            <div className="flex items-center gap-3 mt-4">
              <BrainCircuit className="w-8 h-8" style={{ color: "var(--gold)" }} />
              <div>
                <strong className="text-2xl block" style={{ color: "var(--ink)" }}>{leakState.scans} scans</strong>
                <span className="text-sm" style={{ color: "var(--muted)" }}>
                  {topLeak ? `Most recorded leak: ${topLeak}` : "Your mistake fingerprint will build as you use X-Ray."}
                </span>
              </div>
            </div>
            <p className="text-sm leading-7 mt-5" style={{ color: "var(--muted)" }}>
              After every scan, tap the place where you usually lose marks. The tool remembers the pattern on this device,
              so revision starts shifting from <em>“Which chapter is weak?”</em> to <em>“How exactly am I losing marks?”</em>
            </p>
            <div className="grid grid-cols-2 gap-2 mt-5">
              {["Concept", "Keywords", "Structure", "Calculation", "Case clue", "Time"].map((item) => (
                <button
                  key={item}
                  type="button"
                  disabled={!result}
                  onClick={() => recordLeak(item)}
                  className="tile-paper p-3 text-sm font-semibold disabled:opacity-40"
                >
                  {item} {leakState.leaks?.[item] ? <span>· {leakState.leaks[item]}</span> : null}
                </button>
              ))}
            </div>
          </aside>
        </section>

        {!result ? (
          <section className="card-paper p-6 sm:p-8 text-center">
            <WandSparkles className="w-9 h-9 mx-auto" style={{ color: "var(--gold)" }} />
            <h2 className="text-3xl mt-4" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>This is not an answer generator.</h2>
            <p className="max-w-2xl mx-auto mt-3 leading-7" style={{ color: "var(--muted)" }}>
              It trains the skill students usually never practise: reading the question like an examiner before writing.
              Paste a real question above and the page changes into its X-Ray.
            </p>
          </section>
        ) : (
          <>
            <section className="card-paper p-5 sm:p-7 md:p-9">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">2 · Question fingerprint</span>
                  <h2 className="text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                    What this question is really testing
                  </h2>
                </div>
                <button type="button" onClick={copyBlueprint} className="btn-outline-ink inline-flex items-center gap-2">
                  {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy X-Ray"}
                </button>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-7">
                {[
                  ["Subject", result.subject],
                  ["Hidden topic", result.topic],
                  ["Command", result.command],
                  ["Marks", String(result.marks)],
                  ["Time target", `~${result.time} min`],
                ].map(([label, value]) => (
                  <div key={label} className="tile-paper p-4">
                    <small className="block font-bold uppercase tracking-wider" style={{ color: "var(--subtle)" }}>{label}</small>
                    <strong className="block mt-2" style={{ color: "var(--ink)" }}>{value}</strong>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 rounded-2xl" style={{ background: "var(--gold-bg)" }}>
                <div className="flex gap-3 items-start">
                  <Target className="w-6 h-6 shrink-0 mt-1" style={{ color: "var(--gold)" }} />
                  <div>
                    <strong style={{ color: "var(--ink)" }}>Examiner intent</strong>
                    <p className="mt-2 leading-7" style={{ color: "var(--muted)" }}>{result.intent}</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div className="card-paper p-5 sm:p-7">
                <span className="eyebrow">3 · Marks blueprint</span>
                <h2 className="text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                  Build the answer before writing it
                </h2>
                <div className="space-y-3 mt-6">
                  {result.blueprint.map((item, index) => (
                    <div key={item} className="tile-paper p-4 flex gap-4">
                      <span className="w-9 h-9 rounded-full inline-flex items-center justify-center font-bold shrink-0" style={{ background: "var(--gold-bg)", color: "var(--gold)" }}>
                        {index + 1}
                      </span>
                      <p className="leading-7" style={{ color: "var(--muted)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-paper p-5 sm:p-7">
                <span className="eyebrow">4 · Trap radar</span>
                <h2 className="text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                  Where marks usually disappear
                </h2>
                <div className="space-y-3 mt-6">
                  {result.traps.map((item) => (
                    <div key={item} className="tile-paper p-4 flex gap-3 items-start">
                      <TriangleAlert className="w-5 h-5 shrink-0 mt-1" style={{ color: "#c75b39" }} />
                      <p className="leading-7" style={{ color: "var(--muted)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card-paper p-5 sm:p-7 md:p-9">
              <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-7 items-start">
                <div>
                  <span className="eyebrow">5 · Question mutation lab</span>
                  <h2 className="text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                    Same concept. Four disguises.
                  </h2>
                  <p className="mt-4 leading-7" style={{ color: "var(--muted)" }}>
                    Memorising one answer is fragile. The mutation lab shows how the <strong>same concept can return in a different form</strong>,
                    so you practise transfer instead of prediction.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {result.mutations.map((item, index) => (
                    <div key={item} className="tile-paper p-5">
                      <small className="font-black" style={{ color: "var(--gold)" }}>MUTATION {String(index + 1).padStart(2, "0")}</small>
                      <p className="mt-2 leading-7 font-semibold" style={{ color: "var(--ink)" }}>{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="card-paper p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <Sparkles className="w-7 h-7 shrink-0 mt-1" style={{ color: "var(--gold)" }} />
                <div>
                  <span className="eyebrow">30-second recall drill</span>
                  <h2 className="text-2xl mt-2" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
                    Close the notes. Say this out loud:
                  </h2>
                  <p className="mt-3 text-lg leading-8" style={{ color: "var(--muted)" }}>
                    “What is the core rule behind <strong>{result.topic}</strong>, and what clue in this question tells me that it is being tested?”
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        <section className="grid md:grid-cols-3 gap-4">
          <Link to="/exam-tomorrow" className="card-paper p-5 group">
            <small className="eyebrow">Need speed?</small>
            <strong className="block text-xl mt-3" style={{ color: "var(--ink)" }}>Exam Tomorrow</strong>
            <span className="inline-flex items-center gap-2 mt-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>Open rescue mode <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/board-exam-diagnostic" className="card-paper p-5 group">
            <small className="eyebrow">Need diagnosis?</small>
            <strong className="block text-xl mt-3" style={{ color: "var(--ink)" }}>Find your weak topics</strong>
            <span className="inline-flex items-center gap-2 mt-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>Take free diagnostic <ArrowRight className="w-4 h-4" /></span>
          </Link>
          <Link to="/study-material" className="card-paper p-5 group">
            <small className="eyebrow">Need the chapter?</small>
            <strong className="block text-xl mt-3" style={{ color: "var(--ink)" }}>Open free notes</strong>
            <span className="inline-flex items-center gap-2 mt-3 text-sm font-semibold" style={{ color: "var(--gold)" }}>Browse study material <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </section>

        <p className="text-xs leading-6 text-center max-w-3xl mx-auto" style={{ color: "var(--subtle)" }}>
          Marks X-Ray is an independent educational study tool. Its answer-shape guidance is not an official CBSE or GSEB marking scheme and should be used alongside your latest syllabus, school instructions and teacher guidance.
        </p>
      </main>
    </div>
  );
}
