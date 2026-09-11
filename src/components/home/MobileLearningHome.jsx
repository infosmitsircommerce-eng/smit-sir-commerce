import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  Bell,
  BookOpen,
  FileQuestion,
  FileText,
  GraduationCap,
  Search,
  SlidersHorizontal,
  Video,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import teacherPhoto from "../../assets/teacher-photo-opt.jpg";

const QUICK_ACTIONS = [
  {
    label: "Notes\n(PDFs)",
    icon: FileText,
    to: "/study-material",
    tone: "rose",
  },
  {
    label: "Video\nLectures",
    icon: Video,
    to: "/lectures",
    tone: "mint",
  },
  {
    label: "Practice\nQuizzes",
    icon: FileQuestion,
    to: "/quizzes",
    tone: "blue",
  },
  {
    label: "Test\nSeries",
    icon: BarChart3,
    to: "/test-series",
    tone: "violet",
  },
];

const CLASSES = [
  {
    label: "Class 11",
    detail: "Commerce",
    icon: BookOpen,
    to: "/study-material?class=11",
  },
  {
    label: "Class 12",
    detail: "Commerce",
    icon: GraduationCap,
    to: "/study-material?class=12",
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
  const { user, displayName, initials } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const firstName = user ? displayName.trim().split(/\s+/)[0] : "Learner";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

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
            <small>{greeting},</small>
            <p className="mobile-welcome-kicker">{firstName} 👋</p>
            <h1>Small steps. Big results.</h1>
          </div>
          <div className="mobile-welcome-actions">
            <AppLink to={user ? "/learning-insights" : "/login"} className="mobile-icon-button" aria-label={user ? "Open learning insights" : "Log in to view learning insights"}>
              <Bell aria-hidden="true" />
            </AppLink>
            <AppLink to={user ? "/learning-insights" : "/login"} className="mobile-profile-button" aria-label={user ? "Open profile" : "Log in"}>
              {user ? initials : "S"}
            </AppLink>
          </div>
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
          <button type="submit" aria-label="Search and filter"><SlidersHorizontal aria-hidden="true" /></button>
        </form>

        <article className="mobile-focus-banner">
          <div className="mobile-focus-copy">
            <h2>Master<br />Commerce<br />Your Way</h2>
            <p>Notes · Quizzes · Test Series<br />All in one place</p>
            <AppLink to="/study-material">
              Start learning <ArrowRight aria-hidden="true" />
            </AppLink>
          </div>
          <div className="mobile-teacher-visual">
            <img src={teacherPhoto} alt="Smit Thaker, Commerce teacher" width="594" height="700" loading="eager" decoding="async" />
            <span>Learn • Practice • Grow</span>
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
          <h2>Browse by Class</h2>
          <AppLink to="/study-material">View all <ArrowRight aria-hidden="true" /></AppLink>
        </div>

        <div className="mobile-class-grid">
          {CLASSES.map(({ label, detail, icon: Icon, to }) => (
            <AppLink key={label} to={to} className="mobile-class-card">
              <span><Icon aria-hidden="true" /></span>
              <span><strong>{label}</strong><small>{detail}</small></span>
              <i><ArrowRight aria-hidden="true" /></i>
            </AppLink>
          ))}
        </div>

        <blockquote className="mobile-quote-card">
          <strong>“Consistent practice<br />today, a confident tomorrow.”</strong>
          <span>— Smit Sir</span>
          <BarChart3 aria-hidden="true" />
        </blockquote>
      </div>
    </section>
  );
}
