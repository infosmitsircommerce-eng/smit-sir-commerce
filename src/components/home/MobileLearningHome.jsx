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
import MobileStudySetup from "./MobileStudySetup";
import { readStudentPreferences, studyPath } from "../../lib/studentPreferences";
import { trackEvent } from "../../lib/analytics";

const QUICK_ACTIONS = [
  { label: "Study Notes", icon: FileText, to: "/study-material", tone: "gold" },
  { label: "Quizzes", icon: FileQuestion, to: "/quizzes", tone: "violet" },
  { label: "Video Lectures", icon: PlayCircle, to: "/lectures", tone: "teal", status: "Coming soon" },
  { label: "Test Series", icon: BarChart3, to: "/test-series", tone: "blue" },
  { label: "Downloads", icon: Download, to: "/study-material?view=downloads", tone: "coral" },
  { label: "Study Plan", icon: CalendarDays, to: "/study-coach", tone: "green" },
];

function readArray(key) {
  try {
    const items = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(items) ? items : [];
  } catch { return []; }
}

function readContinueLearning() {
  const candidates = [
    ...readArray("ssc-resource-recents-v1"),
    ...readArray("ssc-recent-learning-v1"),
    ...readArray("ssc-chapter-progress-v1"),
  ].filter(item => typeof item?.title === "string" && typeof item?.path === "string" && /^\/(?!\/)/.test(item.path));
  return candidates.toSorted((a, b) => new Date(b.viewedAt || b.updatedAt || 0) - new Date(a.viewedAt || a.updatedAt || 0))[0] || null;
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
  const { user, profile, displayName, initials } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [recent, setRecent] = useState(readContinueLearning);
  const [preferences, setPreferences] = useState(() => readStudentPreferences(profile));
  useEffect(() => {
    const refresh = () => setRecent(readContinueLearning());
    window.addEventListener("storage", refresh);
    window.addEventListener("ssc-study-state-changed", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("ssc-study-state-changed", refresh);
    };
  }, []);
  useEffect(() => {
    const refresh = (event) => setPreferences(event?.detail || readStudentPreferences(profile));
    refresh();
    window.addEventListener("ssc-student-preferences-changed", refresh);
    return () => window.removeEventListener("ssc-student-preferences-changed", refresh);
  }, [profile]);
  const firstName = user ? displayName.trim().split(/\s+/)[0] : "Learner";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    if (query) {
      window.dispatchEvent(new CustomEvent("ssc-open-search", { detail: { query } }));
      void trackEvent('global_search_submit', { placement: 'mobile_home', queryLength: query.length });
      return;
    }
    navigate(studyPath('/study-material', preferences));
  };

  const personalizedTo = (to) => {
    if (to.startsWith('/study-material?view=downloads') && preferences) {
      const params = new URLSearchParams({ view: 'downloads', board: preferences.board, class: preferences.classLevel, subject: preferences.subject });
      return `/study-material?${params}`;
    }
    return studyPath(to, preferences);
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

        <MobileStudySetup profile={profile} onSaved={setPreferences} />

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
            <AppLink to={studyPath('/study-material', preferences)}>
              Start learning <ArrowRight aria-hidden="true" />
            </AppLink>
          </div>
          <div className="mobile-teacher-visual">
            <img src={teacherPhoto} alt="Smit Thaker, Commerce teacher" width="594" height="700" loading="eager" fetchPriority="high" decoding="async" />
            <span>Learn • Practice • Grow</span>
          </div>
        </article>

        <div className="mobile-section-heading mobile-shortcuts-heading"><h2>What will you learn today?</h2><button type="button" className="mobile-chapter-finder-trigger" onClick={() => window.dispatchEvent(new CustomEvent("ssc-open-resource-finder"))}>Find a chapter <ChevronRight aria-hidden="true" /></button></div>
        <div className="mobile-action-grid" aria-label="Quick actions">
          {QUICK_ACTIONS.map(({ label, icon: Icon, to, tone, status }) => (
            <AppLink key={label} to={personalizedTo(to)} data-tone={tone} className={`mobile-action-card mobile-action-${tone}`} onClick={() => void trackEvent('mobile_quick_action_click', { action: label, board: preferences?.board, classLevel: Number(preferences?.classLevel), subject: preferences?.subject })}>
              <span><Icon aria-hidden="true" /></span>
              <strong>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</strong>
              {status && <small className="mobile-action-status">{status}</small>}
            </AppLink>
          ))}
        </div>

        <div className="mobile-section-heading">
          <h2>{recent ? "Continue Learning" : "A good place to start"}</h2>
          <AppLink to={studyPath('/study-material', preferences)}>View all <ChevronRight aria-hidden="true" /></AppLink>
        </div>
        <AppLink to={recent?.path || "/board-exam-diagnostic"} className="mobile-resume-card">
          <span className="mobile-resume-icon"><BookOpen aria-hidden="true" /></span>
          <span className="mobile-resume-copy">
            <small>{recent ? `${recent.board || "Commerce"} · ${recent.classLevel ? `Class ${recent.classLevel}` : "Study resource"}` : "FREE · KNOW YOUR STARTING POINT"}</small>
            <strong>{recent?.title || "Find your strengths in 5 minutes"}</strong>
            <span>{recent ? recent.completed ? "Completed · review anytime" : "Pick up where you left off" : "Try the board exam diagnostic"}</span>
          </span>
          <span className="mobile-resume-arrow"><ArrowRight aria-hidden="true" /></span>
        </AppLink>

        <div className="mobile-section-heading">
          <h2>Browse by Class</h2>
          <AppLink to={studyPath('/study-material', preferences)}>View all <ArrowRight aria-hidden="true" /></AppLink>
        </div>

        <div className="mobile-class-grid">
          {CLASSES.map(({ label, detail, icon: Icon, to }) => (
            <AppLink key={label} to={`${to}&board=${preferences?.board || 'CBSE'}`} className="mobile-class-card">
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
