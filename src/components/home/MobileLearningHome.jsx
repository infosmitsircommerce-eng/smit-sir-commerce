import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

function AppLink({ to, children, ...props }) {
  const navigate = useNavigate();

  const open = (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const changePage = () => navigate(to);
    if (document.startViewTransition) document.startViewTransition(changePage);
    else changePage();
  };

  return <Link to={to} onClick={open} {...props}>{children}</Link>;
}

export default function MobileLearningHome() {
  const { user, displayName } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const firstName = user ? displayName.trim().split(/\s+/)[0] : "Learner";

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    const destination = query
      ? `/study-material?search=${encodeURIComponent(query)}`
      : "/study-material";
    const changePage = () => navigate(destination);
    if (document.startViewTransition) document.startViewTransition(changePage);
    else changePage();
  };

  return (
    <section className="mobile-learning-home lg:hidden" aria-label="Student learning dashboard">
      <div className="mobile-learning-shell">
        <div className="mobile-welcome-row">
          <div>
            <p className="mobile-welcome-kicker">Hi {firstName} 👋</p>
            <h1>Let&apos;s make Commerce simple today.</h1>
          </div>
          <AppLink
            to={user ? "/learning-insights" : "/login"}
            className="mobile-icon-button"
            aria-label={user ? "Open learning insights" : "Log in"}
          >
            <Bell aria-hidden="true" />
          </AppLink>
        </div>

        <form className="mobile-study-search" onSubmit={submitSearch} role="search">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="mobile-home-search">Search notes, topics and quizzes</label>
          <input
            id="mobile-home-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search notes, topics, quizzes..."
            enterKeyHint="search"
          />
          <button type="submit" aria-label="Search">Go</button>
        </form>

        <article className="mobile-focus-banner">
          <div className="mobile-focus-copy">
            <span>Class 11–12 · CBSE &amp; GSEB</span>
            <h2>Study smarter.<br />Score higher.</h2>
            <p>Clear notes, focused practice and honest progress.</p>
            <AppLink to="/study-material">
              Explore now <ArrowRight aria-hidden="true" />
            </AppLink>
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
            <AppLink key={label} to={to} className={`mobile-action-card mobile-action-${tone}`}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</strong>
            </AppLink>
          ))}
        </div>

        <div className="mobile-section-heading">
          <h2>Continue learning</h2>
          <AppLink to="/study-material">See all</AppLink>
        </div>

        <AppLink to="/study-material?board=GSEB" className="mobile-continue-card">
          <span className="mobile-continue-icon"><BookOpen aria-hidden="true" /></span>
          <span className="mobile-continue-copy">
            <small>GSEB · Class 12</small>
            <strong>Business Administration &amp; Economics</strong>
            <em>Continue your chapter-wise notes</em>
          </span>
          <span className="mobile-progress-ring" aria-label="Study library available">21</span>
        </AppLink>

        <div className="mobile-section-heading">
          <h2>Browse subjects</h2>
          <AppLink to="/study-material">All notes</AppLink>
        </div>

        <div className="mobile-subject-list">
          {SUBJECTS.map(({ label, detail, icon: Icon, to }) => (
            <AppLink key={label} to={to} className="mobile-subject-card">
              <span><Icon aria-hidden="true" /></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <ArrowRight aria-hidden="true" />
            </AppLink>
          ))}
        </div>

        <AppLink to="/board-booster-packs" className="mobile-booster-strip">
          <span><strong>₹199 Board Boosters</strong><small>7-day plans, tests and complete answers</small></span>
          <ArrowRight aria-hidden="true" />
        </AppLink>
      </div>
    </section>
  );
}
