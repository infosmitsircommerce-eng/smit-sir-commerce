import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Check,
  CheckCircle2,
  Download,
  LockKeyhole,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";
import { trackEvent } from "../lib/analytics";
import {
  buildSevenDayPlan,
  DIAGNOSTIC_LIST,
  DIAGNOSTIC_ROUTE_BY_TEST,
  DIAGNOSTIC_ROUTES,
  DIAGNOSTIC_TESTS,
  scoreDiagnostic,
} from "../data/boardDiagnostic";

const BASE = "https://www.smitsircommerce.in";
const ROOT_PATH = "/board-exam-diagnostic";
const STORAGE_KEY = "ssc-board-diagnostic-v1";

function sourceFromSearch(searchParams) {
  return (
    searchParams.get("from") ||
    searchParams.get("utm_source") ||
    "direct"
  ).slice(0, 80);
}

function ResultBand({ percent }) {
  const color =
    percent >= 80 ? "#21663a" : percent >= 60 ? "#8a631c" : "#a43f35";
  return (
    <div
      className="rounded-full h-3 overflow-hidden"
      style={{ background: "#e9edf3" }}
    >
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${percent}%`, background: color }}
      />
    </div>
  );
}

function SubjectPackForm({ test, result, user, landingPath }) {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    consent: false,
    website: "",
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const started = useRef(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (!started.current) {
      started.current = true;
      trackEvent(
        "booster_pack_form_start",
        { testId: test.id, offer: "subject-199" },
        user?.id || null,
      );
    }
  }

  async function submit(event) {
    event.preventDefault();
    const mobile = form.mobile.replace(/\D/g, "");
    if (form.website) return;
    if (form.name.trim().length < 2 || !/^[6-9]\d{9}$/.test(mobile)) {
      setMessage("Enter your name and a valid 10-digit Indian mobile number.");
      return;
    }
    if (!form.consent) {
      setMessage(
        "Please confirm that we may contact you about this requested pack.",
      );
      return;
    }
    setBusy(true);
    setMessage("");
    trackEvent(
      "booster_pack_submit_attempt",
      { testId: test.id, offer: "subject-199" },
      user?.id || null,
    );
    const params = new URLSearchParams(window.location.search);
    const payload = {
      full_name: form.name.trim(),
      mobile: `+91${mobile}`,
      class_level: test.classLevel,
      board: test.board,
      subjects: [test.subject],
      study_mode: "Online",
      preferred_contact_time: "Any time",
      source: params.get("utm_source")
        ? "Other"
        : document.referrer.includes("google.")
          ? "Google"
          : "Direct",
      intent: "General Enquiry",
      message: `BOARD BOOSTER ₹199 RESERVATION | ${test.label} | Diagnostic score ${result.correct}/${result.total} (${result.percent}%) | Weak topics: ${result.weakTopics.map((item) => item.topic).join(", ")} | Payment status: not requested; confirm inclusions and recipient before payment.`,
      consent: true,
      first_path: landingPath,
      utm_source: params.get("utm_source") || sourceFromSearch(params),
      utm_medium: params.get("utm_medium") || "diagnostic",
      utm_campaign: params.get("utm_campaign") || "board_exam_booster",
      landing_context: `board-booster:${test.id}`,
    };
    const { error } = await supabase.from("lead_submissions").insert(payload);
    if (error) {
      setMessage(
        "We could not save the request. Please try again in a moment.",
      );
      trackEvent(
        "booster_pack_submit_error",
        { testId: test.id, code: error.code || "unknown" },
        user?.id || null,
      );
    } else {
      setMessage(
        "Your ₹199 launch-price reservation is saved. Pay only after you receive the exact inclusions and official payment confirmation.",
      );
      setForm((current) => ({
        ...current,
        name: "",
        mobile: "",
        consent: false,
      }));
      trackEvent(
        "booster_pack_submit_success",
        { testId: test.id, offer: "subject-199", score: result.percent },
        user?.id || null,
      );
      if (typeof window.gtag === "function") {
        window.gtag("event", "generate_lead", {
          currency: "INR",
          value: 199,
          offer: "subject-board-booster",
          subject: test.subject,
        });
      }
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="mt-5 space-y-4">
      <div className="sr-only" aria-hidden="true">
        <label htmlFor="booster-website">Website</label>
        <input
          id="booster-website"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update("website", event.target.value)}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="text-sm font-bold">
          Student name
          <input
            required
            minLength={2}
            maxLength={80}
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            className="w-full mt-2 rounded-xl border p-3.5 bg-white font-normal"
            placeholder="Your name"
          />
        </label>
        <label className="text-sm font-bold">
          Mobile number
          <input
            required
            inputMode="numeric"
            maxLength={10}
            value={form.mobile}
            onChange={(event) =>
              update(
                "mobile",
                event.target.value.replace(/\D/g, "").slice(0, 10),
              )
            }
            className="w-full mt-2 rounded-xl border p-3.5 bg-white font-normal"
            placeholder="10-digit mobile"
          />
        </label>
      </div>
      <label className="flex items-start gap-3 text-sm leading-6">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update("consent", event.target.checked)}
          className="mt-1 w-4 h-4"
        />
        <span>
          I request details for this subject pack and agree to be contacted
          about this request. This is not an admission or payment obligation.
        </span>
      </label>
      <button disabled={busy} className="btn-primary w-full">
        {busy ? "Saving reservation…" : "Reserve ₹199 launch price"}
      </button>
      {message && (
        <p role="status" className="text-sm leading-6 font-semibold">
          {message}
        </p>
      )}
    </form>
  );
}

export default function BoardExamDiagnostic() {
  const { user } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const routeConfig = DIAGNOSTIC_ROUTES[pathname] || null;
  const requested = searchParams.get("test");
  const [testId, setTestId] = useState(
    routeConfig?.testId ||
      (DIAGNOSTIC_TESTS[requested] ? requested : DIAGNOSTIC_LIST[0].id),
  );
  const [screen, setScreen] = useState("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [shareMessage, setShareMessage] = useState("");
  const test = DIAGNOSTIC_TESTS[testId];
  const question = test.questions[questionIndex];
  const plan = useMemo(
    () => (result ? buildSevenDayPlan(result) : []),
    [result],
  );

  useEffect(() => {
    if (!routeConfig?.testId) return;
    setTestId(routeConfig.testId);
    setScreen("landing");
    setQuestionIndex(0);
    setAnswers({});
    setResult(null);
  }, [routeConfig?.testId]);

  useEffect(() => {
    trackEvent(
      "booster_page_view",
      {
        source: sourceFromSearch(searchParams),
        testId: routeConfig?.testId || testId,
        landingPath: pathname,
      },
      user?.id || null,
    );
  }, [pathname]);

  function begin() {
    setAnswers({});
    setQuestionIndex(0);
    setResult(null);
    setScreen("test");
    trackEvent("booster_test_start", { testId }, user?.id || null);
  }

  function choose(optionIndex) {
    setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }));
  }

  function next() {
    if (answers[questionIndex] == null) return;
    if (questionIndex < test.questions.length - 1) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    const nextResult = scoreDiagnostic(test, answers);
    setResult(nextResult);
    setScreen("result");
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          testId,
          result: nextResult,
          completedAt: new Date().toISOString(),
        }),
      );
    } catch {
      // Results remain available for the current session.
    }
    trackEvent(
      "booster_test_complete",
      { testId, score: nextResult.percent, level: nextResult.level },
      user?.id || null,
    );
    if (typeof window.gtag === "function")
      window.gtag("event", "quiz_complete", {
        quiz_name: testId,
        score: nextResult.percent,
      });
  }

  function drawCard() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
    gradient.addColorStop(0, "#101828");
    gradient.addColorStop(1, "#29345a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.fillStyle = "#d9ac5c";
    ctx.fillRect(80, 82, 920, 10);
    ctx.font = "700 42px Arial";
    ctx.fillText("SMIT SIR COMMERCE", 80, 165);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 68px Arial";
    ctx.fillText("Board Exam Diagnostic", 80, 285);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "38px Arial";
    ctx.fillText(test.label, 80, 350);
    ctx.fillStyle = "#d9ac5c";
    ctx.font = "800 210px Arial";
    ctx.fillText(`${result.percent}%`, 80, 600);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 52px Arial";
    ctx.fillText(result.level, 80, 680);
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "34px Arial";
    ctx.fillText(`${result.correct} of ${result.total} correct`, 80, 740);
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 34px Arial";
    ctx.fillText("Can you beat my score?", 80, 875);
    ctx.fillStyle = "#d9ac5c";
    ctx.font = "34px Arial";
    ctx.fillText("smitsircommerce.in/board-exam-diagnostic", 80, 940);
    return canvas;
  }

  function downloadCard() {
    const anchor = document.createElement("a");
    anchor.download = `Smit-Sir-${test.shortLabel.replace(/\s+/g, "-")}-Diagnostic.png`;
    anchor.href = drawCard().toDataURL("image/png");
    anchor.click();
    setShareMessage(
      "Scorecard downloaded. Share it with classmates and challenge them.",
    );
    trackEvent(
      "booster_scorecard_download",
      { testId, score: result.percent },
      user?.id || null,
    );
  }

  async function shareCard() {
    const sharePath = DIAGNOSTIC_ROUTE_BY_TEST[testId] || ROOT_PATH;
    const text = `I scored ${result.percent}% (${result.level}) in the free ${test.label} Board Exam Diagnostic. Can you beat my score? ${BASE}${sharePath}?utm_source=scorecard&utm_medium=student_share&utm_campaign=board_exam_booster`;
    try {
      const blob = await new Promise((resolve) =>
        drawCard().toBlob(resolve, "image/png"),
      );
      const file = new File([blob], "Smit-Sir-Board-Diagnostic.png", {
        type: "image/png",
      });
      if (navigator.canShare?.({ files: [file] }))
        await navigator.share({
          title: "My Board Exam Diagnostic Score",
          text,
          files: [file],
        });
      else if (navigator.share)
        await navigator.share({
          title: "My Board Exam Diagnostic Score",
          text,
        });
      else {
        await navigator.clipboard.writeText(text);
        setShareMessage("Challenge link copied.");
      }
      trackEvent(
        "booster_scorecard_share",
        { testId, score: result.percent },
        user?.id || null,
      );
    } catch (error) {
      if (error?.name !== "AbortError")
        setShareMessage(
          "Sharing was not available. Download the scorecard instead.",
        );
    }
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LearningResource",
        name:
          routeConfig?.title ||
          "Free Class 12 Commerce Board Exam Diagnostic Test",
        description:
          "A free 15-question CBSE and GSEB Commerce diagnostic with instant weak-topic analysis and a seven-day revision plan.",
        url: `${BASE}${pathname}`,
        isAccessibleForFree: true,
        learningResourceType: "Diagnostic assessment",
        educationalLevel: "Class 12",
        provider: { "@id": `${BASE}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is the Board Exam Diagnostic free?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. The 15-question diagnostic, score, weak-topic analysis and seven-day plan are free and do not require login.",
            },
          },
          {
            "@type": "Question",
            name: "Which subjects are available?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The initial diagnostic supports CBSE Class 12 Business Studies, CBSE Class 12 Economics and GSEB Class 12 Economics.",
            },
          },
        ],
      },
    ],
  };

  return (
    <main
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg,#fffaf0 0%,#f7f8fc 46%,#fff 100%)",
      }}
    >
      <SEO
        title={
          routeConfig?.title ||
          "Free Class 12 Commerce Board Exam Diagnostic Test"
        }
        description={
          routeConfig?.description ||
          "Take a free 15-question CBSE or GSEB Class 12 Commerce diagnostic. Get your score, weak chapters and personalised seven-day revision plan instantly."
        }
        path={pathname}
        structuredData={structuredData}
      />

      {screen === "landing" && (
        <section className="page-container py-10 sm:py-16">
          <nav
            aria-label="Breadcrumb"
            className="text-sm mb-7"
            style={{ color: "var(--muted)" }}
          >
            <Link to="/">Home</Link> /{" "}
            {routeConfig?.heading || "Board Exam Diagnostic"}
          </nav>
          <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
            <div>
              <span className="eyebrow inline-flex items-center gap-2">
                <Target className="w-4 h-4" />{" "}
                {routeConfig?.eyebrow || "Free five-minute assessment"}
              </span>
              <h1
                className="text-4xl sm:text-6xl mt-5 leading-tight"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--ink)",
                  letterSpacing: "-.045em",
                }}
              >
                {routeConfig
                  ? routeConfig.heading
                  : "Stop guessing. Find the chapters"}{" "}
                <span style={{ color: "var(--gold)" }}>
                  {routeConfig ? "and fix weak topics." : "costing you marks."}
                </span>
              </h1>
              <p
                className="text-lg mt-5 leading-8 max-w-2xl"
                style={{ color: "var(--muted)" }}
              >
                {routeConfig?.intro ||
                  "Answer 15 mixed questions. Get an instant readiness score, your three weakest areas and a practical seven-day recovery plan—without creating an account."}
              </p>
              <div className="grid sm:grid-cols-3 gap-3 mt-7">
                {[
                  "15 focused questions",
                  "Instant weak-topic report",
                  "Shareable scorecard",
                ].map((item) => (
                  <div
                    key={item}
                    className="tile-paper p-4 text-sm font-bold flex gap-2"
                  >
                    <CheckCircle2
                      className="w-5 h-5 shrink-0"
                      style={{ color: "var(--green)" }}
                    />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="card-paper p-5 sm:p-7">
              <h2
                className="text-2xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Choose your diagnostic
              </h2>
              <div className="space-y-3 mt-5">
                {DIAGNOSTIC_LIST.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      const subjectPath = DIAGNOSTIC_ROUTE_BY_TEST[item.id];
                      if (routeConfig && subjectPath) navigate(subjectPath);
                      else setTestId(item.id);
                    }}
                    className="w-full text-left rounded-2xl p-4 flex items-center justify-between gap-3"
                    style={{
                      border: `2px solid ${testId === item.id ? "var(--gold)" : "var(--border)"}`,
                      background:
                        testId === item.id ? "var(--gold-bg)" : "#fff",
                    }}
                  >
                    <span>
                      <strong className="block">{item.label}</strong>
                      <span
                        className="text-xs mt-1 block"
                        style={{ color: "var(--muted)" }}
                      >
                        15 questions · instant diagnosis
                      </span>
                    </span>
                    {testId === item.id ? (
                      <Check
                        className="w-5 h-5"
                        style={{ color: "var(--gold)" }}
                      />
                    ) : null}
                  </button>
                ))}
              </div>
              <button
                onClick={begin}
                className="btn-primary w-full mt-6 inline-flex justify-center items-center gap-2"
              >
                Start free diagnostic <ArrowRight className="w-4 h-4" />
              </button>
              <p
                className="text-xs text-center mt-3"
                style={{ color: "var(--muted)" }}
              >
                No login · No payment · Result appears immediately
              </p>
            </div>
          </div>
          {routeConfig && (
            <section className="card-paper p-5 sm:p-8 mt-8">
              <h2
                className="text-3xl"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                Topics checked in this free diagnostic
              </h2>
              <ul className="grid sm:grid-cols-2 gap-3 mt-5">
                {routeConfig.topics.map((topic) => (
                  <li
                    key={topic}
                    className="tile-paper p-4 flex gap-3 text-sm font-semibold"
                  >
                    <CheckCircle2
                      className="w-5 h-5 shrink-0"
                      style={{ color: "var(--green)" }}
                    />
                    {topic}
                  </li>
                ))}
              </ul>
              <p
                className="mt-5 text-sm leading-7"
                style={{ color: "var(--muted)" }}
              >
                This is an original revision self-check prepared for learning.
                It is not an official board paper or a guaranteed marks
                prediction.
              </p>
            </section>
          )}
        </section>
      )}

      {screen === "test" && (
        <section className="page-container py-8 sm:py-12 max-w-4xl">
          <div className="flex items-center justify-between gap-4 mb-5">
            <button
              onClick={() => setScreen("landing")}
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" /> Exit
            </button>
            <span
              className="text-sm font-bold"
              style={{ color: "var(--muted)" }}
            >
              Question {questionIndex + 1} of {test.questions.length}
            </span>
          </div>
          <ResultBand
            percent={Math.round(
              ((questionIndex + 1) / test.questions.length) * 100,
            )}
          />
          <article className="card-paper p-5 sm:p-8 mt-6">
            <span className="eyebrow">{question[0]}</span>
            <h1
              className="text-2xl sm:text-4xl mt-4 leading-snug"
              style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}
            >
              {question[1]}
            </h1>
            <div className="grid gap-3 mt-7">
              {question[2].map((option, optionIndex) => {
                const selected = answers[questionIndex] === optionIndex;
                return (
                  <button
                    key={option}
                    onClick={() => choose(optionIndex)}
                    className="w-full rounded-2xl p-4 sm:p-5 text-left flex items-center gap-4 font-semibold"
                    style={{
                      border: `2px solid ${selected ? "var(--gold)" : "var(--border)"}`,
                      background: selected ? "var(--gold-bg)" : "#fff",
                      color: "var(--ink)",
                    }}
                  >
                    <span
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                      style={{
                        background: selected
                          ? "var(--gold)"
                          : "var(--bg-ivory)",
                        color: selected ? "#fff" : "var(--muted)",
                      }}
                    >
                      {String.fromCharCode(65 + optionIndex)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between mt-7 gap-3">
              <button
                disabled={questionIndex === 0}
                onClick={() =>
                  setQuestionIndex((current) => Math.max(0, current - 1))
                }
                className="btn-secondary"
              >
                Previous
              </button>
              <button
                disabled={answers[questionIndex] == null}
                onClick={next}
                className="btn-primary inline-flex items-center gap-2"
              >
                {questionIndex === test.questions.length - 1
                  ? "See my diagnosis"
                  : "Next"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </section>
      )}

      {screen === "result" && result && (
        <section className="page-container py-8 sm:py-14 max-w-6xl">
          <div className="grid lg:grid-cols-[.82fr_1.18fr] gap-7 items-start">
            <aside className="card-paper p-6 sm:p-8 lg:sticky lg:top-24 text-center">
              <BadgeCheck
                className="w-12 h-12 mx-auto"
                style={{ color: "var(--gold)" }}
              />
              <span className="eyebrow inline-block mt-4">
                Your readiness score
              </span>
              <div
                className="text-7xl sm:text-8xl font-black mt-4"
                style={{ color: "var(--ink)", letterSpacing: "-.06em" }}
              >
                {result.percent}%
              </div>
              <h1
                className="text-2xl mt-2"
                style={{
                  fontFamily: "var(--font-serif)",
                  color: "var(--gold)",
                }}
              >
                {result.level}
              </h1>
              <p className="mt-3" style={{ color: "var(--muted)" }}>
                {result.correct} of {result.total} correct · {test.label}
              </p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={shareCard}
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button
                  onClick={downloadCard}
                  className="btn-secondary inline-flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" /> Card
                </button>
              </div>
              {shareMessage && (
                <p
                  role="status"
                  className="text-xs mt-3"
                  style={{ color: "var(--muted)" }}
                >
                  {shareMessage}
                </p>
              )}
              <button
                onClick={begin}
                className="mt-5 text-sm font-bold inline-flex items-center gap-2"
                style={{ color: "var(--gold)" }}
              >
                <RotateCcw className="w-4 h-4" /> Retake this test
              </button>
            </aside>

            <div className="space-y-6">
              <section className="card-paper p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <BarChart3
                    className="w-6 h-6"
                    style={{ color: "var(--gold)" }}
                  />
                  <h2
                    className="text-3xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Topic diagnosis
                  </h2>
                </div>
                <div className="space-y-4 mt-6">
                  {result.topics.map((item) => {
                    const percent = Math.round(
                      (item.correct / item.total) * 100,
                    );
                    return (
                      <div key={item.topic}>
                        <div className="flex justify-between gap-3 text-sm mb-2">
                          <strong>{item.topic}</strong>
                          <span>
                            {item.correct}/{item.total}
                          </span>
                        </div>
                        <ResultBand percent={percent} />
                      </div>
                    );
                  })}
                </div>
              </section>

              <section className="card-paper p-5 sm:p-7">
                <div className="flex items-center gap-3">
                  <BookOpenCheck
                    className="w-6 h-6"
                    style={{ color: "var(--gold)" }}
                  />
                  <h2
                    className="text-3xl"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Your seven-day recovery plan
                  </h2>
                </div>
                <ol className="space-y-3 mt-6">
                  {plan.map((item, index) => (
                    <li key={item} className="tile-paper p-4 flex gap-3">
                      <span
                        className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center font-black"
                        style={{
                          background: "var(--gold-bg)",
                          color: "var(--gold)",
                        }}
                      >
                        {index + 1}
                      </span>
                      <span className="text-sm leading-6 pt-1">{item}</span>
                    </li>
                  ))}
                </ol>
                <Link
                  to={test.revisionPath}
                  className="btn-secondary inline-flex mt-5"
                >
                  Open free revision resources
                </Link>
              </section>

              <section
                id="subject-pack"
                className="card-paper p-5 sm:p-7"
                style={{ border: "2px solid rgba(184,135,47,.35)" }}
              >
                <span className="eyebrow inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Optional launch offer
                </span>
                <h2
                  className="text-3xl mt-3"
                  style={{ fontFamily: "var(--font-serif)" }}
                >
                  {test.shortLabel} Board Booster — ₹199
                </h2>
                <p className="mt-3 leading-7" style={{ color: "var(--muted)" }}>
                  Reserve the launch price for a subject-focused exam pack.
                  Exact included files, delivery method and payment recipient
                  are confirmed before payment—there is no automatic charge from
                  this form.
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mt-5">
                  {[
                    "Weak-topic priority sheet",
                    "Seven-day printable revision plan",
                    "Exam-style practice set",
                    "Answer key and checking guidance",
                  ].map((item) => (
                    <div
                      key={item}
                      className="tile-paper p-3 flex gap-2 text-sm font-semibold"
                    >
                      <Check
                        className="w-4 h-4 shrink-0"
                        style={{ color: "var(--green)" }}
                      />
                      {item}
                    </div>
                  ))}
                </div>
                <SubjectPackForm
                  test={test}
                  result={result}
                  user={user}
                  landingPath={pathname}
                />
              </section>

              <section
                className="rounded-3xl p-6 sm:p-8"
                style={{ background: "var(--ink-bg)", color: "#fff" }}
              >
                <div className="flex items-start gap-4">
                  <LockKeyhole
                    className="w-8 h-8 shrink-0"
                    style={{ color: "var(--gold-bright)" }}
                  />
                  <div>
                    <span
                      className="text-xs font-black tracking-widest"
                      style={{ color: "var(--gold-bright)" }}
                    >
                      COMPLETE ACCESS
                    </span>
                    <h2 className="text-3xl mt-2 text-white">
                      ₹999 Lifetime Premium
                    </h2>
                    <p
                      className="mt-3 leading-7"
                      style={{ color: "var(--muted-on-ink)" }}
                    >
                      Unlock Hard and Extreme Economics quizzes, 31 chapter
                      deep-dives and protected advanced practice with one
                      verified payment.
                    </p>
                    <Link
                      to="/premium?from=board-diagnostic"
                      onClick={() =>
                        trackEvent(
                          "booster_premium_click",
                          { testId, score: result.percent },
                          user?.id || null,
                        )
                      }
                      className="btn-primary inline-flex mt-5"
                    >
                      Compare Premium access
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </section>
      )}

      <section className="page-container pb-14">
        <div
          className="flex items-start gap-3 rounded-2xl p-4 text-xs leading-6"
          style={{
            background: "#eef5ff",
            color: "#34445f",
            border: "1px solid #d8e5f5",
          }}
        >
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <p>
            The diagnostic is an educational self-check, not an official
            predicted board score. Free public resources remain free. Never pay
            unless the exact offer, recipient and access method are clearly
            confirmed.
          </p>
        </div>
      </section>
    </main>
  );
}
