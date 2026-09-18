import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowRight, BookOpen, Brain, CheckCircle2, ChevronLeft, ChevronRight, Clock3,
  FileQuestion, Flame, RotateCcw, Sparkles, Target, Trophy, Zap
} from "lucide-react";
import SEO from "../components/ui/SEO";
import { examTomorrowBySlug, examTomorrowChapters } from "../data/examTomorrow";
import { trackEvent } from "../lib/analytics";

const PROGRESS_KEY = "ssc-exam-tomorrow-progress-v1";

function todayKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function readProgress() {
  try {
    const value = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "{}");
    return { streak: 0, xp: 0, lastActiveDate: null, completed: {}, ...value };
  } catch {
    return { streak: 0, xp: 0, lastActiveDate: null, completed: {} };
  }
}
function isYesterday(dateString) {
  if (!dateString) return false;
  const previous = new Date(`${dateString}T12:00:00`);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, 12);
  return previous.toDateString() === yesterday.toDateString();
}

function QuestionCard({ item, index, selected, onSelect }) {
  const answered = selected !== null && selected !== undefined;
  return (
    <article className="card-paper p-5">
      <div className="text-xs font-bold" style={{ color: "var(--gold)" }}>QUICK CHECK {index + 1}</div>
      <h3 className="font-bold mt-2" style={{ color: "var(--ink)" }}>{item.q}</h3>
      <div className="grid gap-2 mt-4">
        {item.options.map((option, optionIndex) => {
          const correct = answered && optionIndex === item.answer;
          const wrong = answered && optionIndex === selected && optionIndex !== item.answer;
          return (
            <button
              type="button"
              key={option}
              disabled={answered}
              onClick={() => onSelect(optionIndex)}
              className="text-left rounded-xl border px-4 py-3 text-sm transition"
              style={{
                borderColor: correct ? "var(--green)" : wrong ? "#b45309" : "var(--line)",
                background: correct ? "rgba(22,101,52,.08)" : wrong ? "rgba(180,83,9,.08)" : "var(--paper)",
                color: "var(--ink)",
                opacity: answered && !correct && !wrong ? .65 : 1,
              }}
            >
              <strong className="mr-2">{String.fromCharCode(65 + optionIndex)}.</strong>{option}
            </button>
          );
        })}
      </div>
      {answered && (
        <div className="mt-4 rounded-xl p-4 text-sm" style={{ background: "var(--bg-ivory)", color: "var(--muted)" }}>
          <strong style={{ color: selected === item.answer ? "var(--green)" : "var(--ink)" }}>
            {selected === item.answer ? "Correct." : "Not quite."}
          </strong>{" "}{item.why}
        </div>
      )}
    </article>
  );
}

export default function ExamTomorrow() {
  const { chapterSlug } = useParams();
  const navigate = useNavigate();
  const active = examTomorrowBySlug[chapterSlug] || examTomorrowChapters[0];
  const activeIndex = examTomorrowChapters.findIndex((item) => item.slug === active.slug);
  const [answers, setAnswers] = useState([null, null, null]);
  const [finished, setFinished] = useState(false);
  const [progress, setProgress] = useState(readProgress);

  useEffect(() => {
    setAnswers([null, null, null]);
    setFinished(false);
    void trackEvent("exam_tomorrow_chapter_view", { chapter: active.slug, chapterNumber: active.chapter });
  }, [active.slug]);

  const answeredCount = answers.filter((value) => value !== null).length;
  const score = useMemo(
    () => active.quiz.reduce((total, item, index) => total + (answers[index] === item.answer ? 1 : 0), 0),
    [active, answers]
  );
  const chapterProgress = progress.completed?.[active.slug];
  const completionPercent = Math.round((Object.keys(progress.completed || {}).length / examTomorrowChapters.length) * 100);

  const chooseChapter = (slug) => {
    void trackEvent("exam_tomorrow_chapter_select", { chapter: slug });
    navigate(`/exam-tomorrow/${slug}`);
  };

  const chooseAnswer = (questionIndex, optionIndex) => {
    setAnswers((previous) => previous.map((value, index) => index === questionIndex ? optionIndex : value));
    void trackEvent("exam_tomorrow_answer", {
      chapter: active.slug,
      question: questionIndex + 1,
      correct: active.quiz[questionIndex].answer === optionIndex,
    });
  };

  const finish = () => {
    if (answeredCount !== active.quiz.length || finished) return;
    const current = readProgress();
    const date = todayKey();
    const oldChapter = current.completed?.[active.slug] || {};
    const alreadyRewardedToday = oldChapter.lastDate === date;
    const xpGain = alreadyRewardedToday ? 0 : 20 + score * 20;
    let streak = current.streak || 0;
    if (current.lastActiveDate !== date) streak = isYesterday(current.lastActiveDate) ? streak + 1 : 1;

    const next = {
      ...current,
      xp: (current.xp || 0) + xpGain,
      streak,
      lastActiveDate: date,
      completed: {
        ...(current.completed || {}),
        [active.slug]: {
          attempts: (oldChapter.attempts || 0) + 1,
          best: Math.max(oldChapter.best || 0, score),
          lastScore: score,
          lastDate: date,
        },
      },
    };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
    setProgress(next);
    setFinished(true);
    void trackEvent("exam_tomorrow_complete", { chapter: active.slug, score, total: active.quiz.length, xpGain });
  };

  const resetQuiz = () => {
    setAnswers([null, null, null]);
    setFinished(false);
  };

  const nextChapter = examTomorrowChapters[(activeIndex + 1) % examTomorrowChapters.length];
  const path = chapterSlug ? `/exam-tomorrow/${active.slug}` : "/exam-tomorrow";
  const title = chapterSlug
    ? `${active.title} Quick Revision | Class 12 BST`
    : "Class 12 Business Studies Exam Tomorrow Revision";
  const description = chapterSlug
    ? `Revise ${active.title} fast for CBSE Class 12 Business Studies with a 60-second summary, important questions, keywords, mistakes and instant MCQ explanations.`
    : "Exam tomorrow? Revise CBSE Class 12 Business Studies fast with chapter-wise summaries, important questions, MCQs, keywords, common mistakes and instant explanations.";

  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: chapterSlug ? `${active.title} Exam Tomorrow Revision` : "Class 12 Business Studies Exam Tomorrow Revision",
    description,
    url: `https://www.smitsircommerce.in${path}`,
    educationalLevel: "Class 12",
    learningResourceType: ["Revision guide", "Quiz", "Practice questions"],
    teaches: chapterSlug ? active.title : "CBSE Class 12 Business Studies",
    provider: { "@type": "EducationalOrganization", name: "Smit Sir Commerce", url: "https://www.smitsircommerce.in/" },
  };

  return (
    <>
      <SEO title={title} description={description} path={path} structuredData={schema} />
      <main className="page-container section-padding">
        <section className="card-paper p-6 sm:p-10 max-w-6xl mx-auto overflow-hidden">
          <div className="grid lg:grid-cols-[1fr_auto] gap-6 items-start">
            <div>
              <span className="eyebrow"><Flame className="w-4 h-4 inline mr-1" /> Exam Tomorrow · Class 12 BST</span>
              <h1 className="mt-5">{active.title}</h1>
              <p className="mt-4 text-lg max-w-3xl" style={{ color: "var(--muted)" }}>{active.hook}</p>
              <div className="flex flex-wrap gap-2 mt-5">
                <span className="tile-paper px-3 py-2 text-xs font-bold">⚡ 60-sec recall</span>
                <span className="tile-paper px-3 py-2 text-xs font-bold">🧠 instant explanations</span>
                <span className="tile-paper px-3 py-2 text-xs font-bold">✓ no login</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 min-w-[220px]">
              <div className="tile-paper p-4 text-center"><strong className="text-2xl block" style={{ color: "var(--ink)" }}>{progress.streak || 0}</strong><small style={{ color: "var(--muted)" }}>day streak</small></div>
              <div className="tile-paper p-4 text-center"><strong className="text-2xl block" style={{ color: "var(--ink)" }}>{progress.xp || 0}</strong><small style={{ color: "var(--muted)" }}>XP</small></div>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex justify-between text-xs font-semibold mb-2" style={{ color: "var(--muted)" }}>
              <span>{Object.keys(progress.completed || {}).length}/12 chapters attempted</span><span>{completionPercent}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--bg-ivory)" }}>
              <div className="h-full rounded-full" style={{ width: `${completionPercent}%`, background: "var(--gold)" }} />
            </div>
          </div>

          <div className="mt-7">
            <label htmlFor="rescue-chapter" className="text-sm font-bold" style={{ color: "var(--ink)" }}>Pick the chapter you need right now</label>
            <select id="rescue-chapter" value={active.slug} onChange={(event) => chooseChapter(event.target.value)} className="input-field mt-2 w-full">
              {examTomorrowChapters.map((item) => <option key={item.slug} value={item.slug}>Chapter {item.chapter} · {item.title}</option>)}
            </select>
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-7 grid lg:grid-cols-[1.15fr_.85fr] gap-5">
          <article className="card-paper p-6 sm:p-8">
            <span className="eyebrow"><Zap className="w-4 h-4 inline mr-1" /> 60-second revision</span>
            <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>Recall this before reading anything else.</h2>
            <div className="grid gap-3 mt-5">
              {active.summary.map((point) => (
                <div key={point} className="flex gap-3 items-start rounded-xl p-4" style={{ background: "var(--bg-ivory)" }}>
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--green)" }} />
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ink)" }}>{point}</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="grid gap-5">
            <article className="card-paper p-6">
              <span className="eyebrow"><Sparkles className="w-4 h-4 inline mr-1" /> Keywords</span>
              <div className="flex flex-wrap gap-2 mt-4">{active.keywords.map((word) => <span key={word} className="tile-paper px-3 py-2 text-xs font-bold">{word}</span>)}</div>
              <p className="text-xs mt-4" style={{ color: "var(--muted)" }}>Use the correct keyword, then explain it in the context of the question.</p>
            </article>
            <article className="card-paper p-6">
              <span className="eyebrow">Avoid these mistakes</span>
              <div className="grid gap-3 mt-4">{active.mistakes.map((mistake, index) => <p key={mistake} className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}><strong style={{ color: "var(--ink)" }}>{index + 1}.</strong> {mistake}</p>)}</div>
            </article>
          </aside>
        </section>

        <section className="max-w-6xl mx-auto mt-7 card-paper p-6 sm:p-8">
          <div className="flex flex-wrap justify-between gap-4 items-end">
            <div><span className="eyebrow"><Target className="w-4 h-4 inline mr-1" /> High-value practice</span><h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>Can you answer these without notes?</h2></div>
            <Link to="/cbse/class-12/business-studies-case-study-questions" className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "var(--gold)" }}>More case studies <ArrowRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {active.important.map((question, index) => <article key={question} className="tile-paper p-5"><small style={{ color: "var(--muted)" }}>QUESTION {index + 1}</small><h3 className="font-bold mt-2" style={{ color: "var(--ink)" }}>{question}</h3></article>)}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-7">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
            <div><span className="eyebrow"><Brain className="w-4 h-4 inline mr-1" /> 3-question challenge</span><h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>No guessing later. Get feedback now.</h2></div>
            {chapterProgress && <span className="text-xs font-bold tile-paper px-3 py-2">Best: {chapterProgress.best}/3 · {chapterProgress.attempts} attempt{chapterProgress.attempts === 1 ? "" : "s"}</span>}
          </div>
          <div className="grid lg:grid-cols-3 gap-4">
            {active.quiz.map((item, index) => <QuestionCard key={item.q} item={item} index={index} selected={answers[index]} onSelect={(value) => chooseAnswer(index, value)} />)}
          </div>

          <div className="card-paper p-5 sm:p-6 mt-4">
            {!finished ? (
              <div className="flex flex-wrap gap-4 items-center justify-between">
                <div><strong style={{ color: "var(--ink)" }}>{answeredCount}/3 answered</strong><p className="text-sm mt-1" style={{ color: "var(--muted)" }}>Finish all three to save your score, streak and XP.</p></div>
                <button type="button" disabled={answeredCount !== 3} onClick={finish} className="btn-primary inline-flex items-center gap-2 disabled:opacity-40"><Trophy className="w-4 h-4" /> Finish challenge</button>
              </div>
            ) : (
              <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
                <div>
                  <span className="eyebrow">Rescue complete</span>
                  <h3 className="text-2xl mt-2" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>You scored {score}/3.</h3>
                  <p className="text-sm mt-2" style={{ color: "var(--muted)" }}>{score === 3 ? "Strong recall. Move to a timed exam while it is fresh." : score === 2 ? "Good start. Review the one missed concept, then test again later." : "Use the 60-second revision once more, then retry without rushing."}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={resetQuiz} className="btn-secondary inline-flex items-center gap-2"><RotateCcw className="w-4 h-4" /> Retry</button>
                  <Link to="/exam-mode" className="btn-primary inline-flex items-center gap-2"><Clock3 className="w-4 h-4" /> Timed exam</Link>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="max-w-6xl mx-auto mt-7 grid md:grid-cols-3 gap-4">
          <Link to="/cbse/class-12/business-studies-important-questions" className="card-paper p-5 block"><FileQuestion className="w-5 h-5" style={{ color: "var(--gold)" }} /><strong className="block mt-3" style={{ color: "var(--ink)" }}>Important Questions</strong><span className="text-sm mt-1 block" style={{ color: "var(--muted)" }}>Move from recall to written practice.</span></Link>
          <Link to="/cbse/class-12/business-studies-case-study-keywords" className="card-paper p-5 block"><CheckCircle2 className="w-5 h-5" style={{ color: "var(--gold)" }} /><strong className="block mt-3" style={{ color: "var(--ink)" }}>Case-study Keywords</strong><span className="text-sm mt-1 block" style={{ color: "var(--muted)" }}>Spot the clue and name the concept faster.</span></Link>
          <Link to="/class-12-commerce-7-day-revision-plan" className="card-paper p-5 block"><BookOpen className="w-5 h-5" style={{ color: "var(--gold)" }} /><strong className="block mt-3" style={{ color: "var(--ink)" }}>7-Day Revision Plan</strong><span className="text-sm mt-1 block" style={{ color: "var(--muted)" }}>Use this when you still have a week.</span></Link>
        </section>

        <section className="max-w-6xl mx-auto mt-7 card-paper p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link to={activeIndex > 0 ? `/exam-tomorrow/${examTomorrowChapters[activeIndex - 1].slug}` : "/exam-tomorrow"} className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "var(--muted)" }}><ChevronLeft className="w-4 h-4" /> Previous</Link>
            <div className="text-center"><small style={{ color: "var(--muted)" }}>NEXT CHAPTER</small><strong className="block" style={{ color: "var(--ink)" }}>{nextChapter.title}</strong></div>
            <Link to={`/exam-tomorrow/${nextChapter.slug}`} className="text-sm font-bold inline-flex items-center gap-1" style={{ color: "var(--gold)" }}>Continue <ChevronRight className="w-4 h-4" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}
