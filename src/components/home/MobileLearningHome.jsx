import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  FileQuestion,
  FileText,
  FlaskConical,
  GraduationCap,
  Search,
  SlidersHorizontal,
  CalendarDays,
  Download,
  PlayCircle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import teacherPhoto from "../../assets/teacher-photo-opt.jpg";

const QUICK_ACTIONS = [
  { label: "Study Notes", icon: FileText, to: "/study-material", tone: "gold" },
  { label: "Quizzes", icon: FileQuestion, to: "/quizzes", tone: "gold" },
  { label: "Video Lectures", icon: PlayCircle, to: "/lectures", tone: "forest" },
  { label: "Test Series", icon: BarChart3, to: "/test-series", tone: "forest" },
  { label: "Downloads", icon: Download, to: "/study-material#all-notes", tone: "gold" },
  { label: "Study Plan", icon: CalendarDays, to: "/study-coach", tone: "gold" },
];

function readRecentChapter() {
  try {
    const items = JSON.parse(localStorage.getItem("ssc-resource-recents-v1") || "[]");
    if (!Array.isArray(items)) return null;
    return items.find(item => typeof item?.title === "string" && typeof item?.path === "string" && /^\/(?!\/)/.test(item.path)) || null;
  } catch { return null; }
}

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
    navigate(to);
  };

  return <Link to={to} onClick={open} {...props}>{children}</Link>;
}

export default function MobileLearningHome() {
  const { user, displayName, initials } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState(readRecentChapter);
  useEffect(() => {
    const refresh = () => setRecent(readRecentChapter());
    window.addEventListener("storage", refresh);
    window.addEventListener("ssc-study-state-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ssc-study-state-changed", refresh);
    };
  }, []);
  const firstName = user ? displayName.trim().split(/\s+/)[0] : "Learner";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    const destination = query
      ? `/study-material?search=${encodeURIComponent(query)}#all-notes`
      : "/study-material";
    navigate(destination);
  };

  return (
    <section className="mobile-learning-home lg:hidden" aria-label="Student learning dashboard">
      <div className="mobile-learning-shell">
        <div className="mobile-welcome-row">
          <div>
            <small>{greeting} 👋</small>
            <h1 className="mobile-welcome-kicker">{user ? `${firstName}, let’s learn.` : "Commerce Learner!"}</h1>
            <p className="mobile-welcome-subtitle">Small steps make big careers.</p>
          </div>
          <div className="mobile-welcome-actions">
            <AppLink to={user ? "/learning-insights" : "/login"} className="mobile-profile-button" aria-label={user ? "Open profile" : "Log in"}>
              {user ? initials : "SS"}
            </AppLink>
          </div>
        </div>

        <form className="mobile-study-search" onSubmit={submitSearch} role="search">
          <Search aria-hidden="true" />
          <label className="sr-only" htmlFor="mobile-home-search">Search study notes and chapters</label>
          <input
            id="mobile-home-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search a chapter or topic…"
            enterKeyHint="search"
          />
          <button type="submit" aria-label="Search chapters"><SlidersHorizontal aria-hidden="true" /></button>
        </form>

        <article className="mobile-focus-banner">
          <div className="mobile-focus-copy">
            <span>Your personal study desk</span>
            <h2>Master Commerce<br /><em>Your Way.</em></h2>
            <p>Notes · Quizzes · Test Series<br />All in one place</p>
            <AppLink to="/study-material">
              Start learning <ArrowRight aria-hidden="true" />
            </AppLink>
          </div>
          <div className="mobile-teacher-visual">
            <img src={teacherPhoto} alt="Smit Thaker, Commerce teacher" width="594" height="700" loading="eager" fetchPriority="high" decoding="async" />
            <span>Learn • Practice • Grow</span>
          </div>
        </article>

        <div className="mobile-section-heading mobile-shortcuts-heading"><h2>What will you learn today?</h2><span>QUICK ACCESS</span></div>
        <div className="mobile-action-grid" aria-label="Quick actions">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, tone }) => (
            <AppLink key={label} to={to} className={`mobile-action-card mobile-action-${tone}`}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</strong>
            </AppLink>
          ))}
        </div>

        <div className="mobile-section-heading">
          <h2>{recent ? "Continue Learning" : "A good place to start"}</h2>
          <AppLink to="/study-material">View all <ChevronRight aria-hidden="true" /></AppLink>
        </div>
        <AppLink to={recent?.path || "/board-exam-diagnostic"} className="mobile-resume-card">
          <span className="mobile-resume-icon"><BookOpen aria-hidden="true" /></span>
          <span className="mobile-resume-copy">
            <small>{recent ? `${recent.board || "Commerce"} · ${recent.classLevel ? `Class ${recent.classLevel}` : "Study resource"}` : "FREE · KNOW YOUR STARTING POINT"}</small>
            <strong>{recent?.title || "Find your strengths in 5 minutes"}</strong>
            <span>{recent ? "Pick up where you left off" : "Try the board exam diagnostic"}</span>
          </span>
          <span className="mobile-resume-arrow"><ArrowRight aria-hidden="true" /></span>
        </AppLink>

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

        <AppLink to="/concept-lab" className="mobile-lab-link"><span><FlaskConical aria-hidden="true" /><strong>Make concepts click</strong></span><span>Explore Concept Lab <ChevronRight aria-hidden="true" /></span></AppLink>
        <blockquote className="mobile-quote-card">
          <strong>“Consistent practice<br />today, a confident tomorrow.”</strong>
          <span>— Smit Sir</span>
          <BarChart3 aria-hidden="true" />
        </blockquote>
      </div>
    </section>
  );
}
