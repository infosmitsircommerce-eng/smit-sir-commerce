import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  Brain,
  FileQuestion,
  FileText,
  GraduationCap,
  ListChecks,
  Search,
  Sparkles,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const QUICK_ACTIONS = [
  {
    label: "Notes\n(PDFs)",
    icon: FileText,
    to: "/study-material",
    tone: "rose",
  },
  {
    label: "Practice\nQuizzes",
    icon: FileQuestion,
    to: "/quizzes",
    tone: "blue",
  },
  {
    label: "Chapter\nDiagnostic",
    icon: Brain,
    to: "/board-exam-diagnostic",
    tone: "mint",
  },
  {
    label: "Important\nQuestions",
    icon: ListChecks,
    to: "/daily-practice",
    tone: "violet",
  },
];

const SUBJECTS = [
  {
    label: "Accounts",
    detail: "Notes & practice",
    icon: BarChart3,
    to: "/study-material",
  },
  {
    label: "Business Studies",
    detail: "CBSE resources",
    icon: BookOpen,
    to: "/cbse-notes",
  },
  {
    label: "Economics",
    detail: "CBSE + GSEB",
    icon: GraduationCap,
    to: "/study-material?board=GSEB",
  },
];

export default function MobileLearningHome() {
  const { user, displayName } = useAuth();
  const firstName = user ? displayName.trim().split(/\s+/)[0] : "Learner";

  const openSearch = () =>
    window.dispatchEvent(new CustomEvent("ssc-open-search"));

  return (
    <section className="mobile-learning-home lg:hidden" aria-label="Student learning dashboard">
      <div className="mobile-learning-shell">
        <div className="mobile-welcome-row">
          <div>
            <p className="mobile-welcome-kicker">Hi {firstName} 👋</p>
            <h1>Let&apos;s make Commerce simple today.</h1>
          </div>
          <Link
            to={user ? "/learning-insights" : "/login"}
            className="mobile-icon-button"
            aria-label={user ? "Open learning insights" : "Log in"}
          >
            <Bell aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="mobile-study-search"
          onClick={openSearch}
          aria-label="Search notes, topics and quizzes"
        >
          <Search aria-hidden="true" />
          <span>Search notes, topics, quizzes...</span>
        </button>

        <article className="mobile-focus-banner">
          <div className="mobile-focus-copy">
            <span>Class 11–12 · CBSE &amp; GSEB</span>
            <h2>Study smarter.<br />Score higher.</h2>
            <p>Clear notes, focused practice and honest progress.</p>
            <Link to="/study-material">
              Explore now <ArrowRight aria-hidden="true" />
            </Link>
          </div>
          <div className="mobile-progress-art" aria-hidden="true">
            <Sparkles />
            <strong>Progress<br />over<br />perfection</strong>
            <div className="mobile-progress-bars">
              <i /><i /><i /><i />
            </div>
          </div>
        </article>

        <div className="mobile-action-grid" aria-label="Quick actions">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, tone }) => (
            <Link key={label} to={to} className={`mobile-action-card mobile-action-${tone}`}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</strong>
            </Link>
          ))}
        </div>

        <div className="mobile-section-heading">
          <h2>Continue learning</h2>
          <Link to="/study-material">See all</Link>
        </div>

        <Link to="/study-material?board=GSEB" className="mobile-continue-card">
          <span className="mobile-continue-icon"><BookOpen aria-hidden="true" /></span>
          <span className="mobile-continue-copy">
            <small>GSEB · Class 12</small>
            <strong>Business Administration &amp; Economics</strong>
            <em>Continue your chapter-wise notes</em>
          </span>
          <span className="mobile-progress-ring" aria-label="Study library available">21</span>
        </Link>

        <div className="mobile-section-heading">
          <h2>Browse subjects</h2>
          <Link to="/study-material">All notes</Link>
        </div>

        <div className="mobile-subject-list">
          {SUBJECTS.map(({ label, detail, icon: Icon, to }) => (
            <Link key={label} to={to} className="mobile-subject-card">
              <span><Icon aria-hidden="true" /></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>

        <Link to="/board-booster-packs" className="mobile-booster-strip">
          <span><strong>₹199 Board Boosters</strong><small>7-day plans, tests and complete answers</small></span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
