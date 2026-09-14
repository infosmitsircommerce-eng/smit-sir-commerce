import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  BookOpenCheck,
  CheckCircle2,
  Crown,
  FileQuestion,
  FileText,
  FlaskConical,
  GraduationCap,
  Moon,
  Search,
  SlidersHorizontal,
  CalendarDays,
  ChevronRight,
  Sun,
  Wrench,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import MobileStudySetup from "./MobileStudySetup";
import { readStudentPreferences, studyPath } from "../../lib/studentPreferences";
import { trackEvent } from "../../lib/analytics";
import "../../styles/homeHero.css";

const QUICK_ACTIONS = [
  { label: "Study Notes", icon: FileText, to: "/study-material", tone: "gold" },
  { label: "Quizzes", icon: FileQuestion, to: "/quizzes", tone: "violet" },
  { label: "Test Series", icon: BarChart3, to: "/test-series", tone: "blue" },
  { label: "Daily Mission", icon: CalendarDays, to: "/study-coach", tone: "green" },
  { label: "Study Tools", icon: Wrench, to: "/tools", tone: "teal" },
  { label: "Board Boosters", icon: Rocket, to: "/board-booster-packs", tone: "coral" },
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

function initialHomeTheme() {
  try {
    const saved = localStorage.getItem("ssc-home-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch { /* ignore */ }
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
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
  const staticPath = to.split(/[?#]/)[0];

  if (staticPath.endsWith('.html') || staticPath.endsWith('.pdf')) {
    return <a href={to} {...props}>{children}</a>;
  }

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
  const [homeTheme, setHomeTheme] = useState(initialHomeTheme);

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

  useEffect(() => {
    try { localStorage.setItem("ssc-home-theme", homeTheme); } catch { /* ignore */ }
    document.documentElement.dataset.sscHomeTheme = homeTheme;
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    themeMeta?.setAttribute("content", homeTheme === "dark" ? "#0d1421" : "#FAF6EE");
    return () => {
      delete document.documentElement.dataset.sscHomeTheme;
      themeMeta?.setAttribute("content", "#FAF6EE");
    };
  }, [homeTheme]);

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

  const toggleTheme = () => setHomeTheme((current) => current === "dark" ? "light" : "dark");

  return (
    <section className="mobile-learning-home" data-home-theme={homeTheme} aria-label="Student learning dashboard">
      <div className="mobile-learning-shell">
        <article className="ssc-home-hero" aria-labelledby="ssc-home-hero-title">
          <div className="ssc-home-hero-copy">
            <p className="ssc-home-eyebrow">Class 11 & 12 · CBSE + GSEB</p>
            <h1 id="ssc-home-hero-title">Master Commerce <span>with clarity.</span></h1>
            <p>Free notes, quizzes and exam-focused practice — organised so you always know what to study next.</p>

            <div className="ssc-home-hero-actions">
              <AppLink to={studyPath('/study-material', preferences)} className="ssc-home-primary">
                Start Free <ArrowRight aria-hidden="true" />
              </AppLink>
              <AppLink to="/cbse-notes" className="ssc-home-secondary">
                Explore Notes <BookOpen aria-hidden="true" />
              </AppLink>
            </div>

            <div className="ssc-home-proof" aria-label="Study platform highlights">
              <span><CheckCircle2 aria-hidden="true" /> Free study material</span>
              <span><CheckCircle2 aria-hidden="true" /> Chapter practice</span>
              <span><CheckCircle2 aria-hidden="true" /> Board preparation</span>
            </div>
          </div>

          <div className="ssc-home-visual" aria-label="Smit Sir Commerce study dashboard preview">
            <div className="ssc-home-visual-head">
              <div className="ssc-home-visual-brand">
                <span><GraduationCap aria-hidden="true" /></span>
                <div><strong>Your Commerce Desk</strong><small>Learn · Practice · Improve</small></div>
              </div>
              <button type="button" className="ssc-home-theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${homeTheme === "dark" ? "light" : "dark"} mode`}>
                {homeTheme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                <span>{homeTheme === "dark" ? "Light" : "Dark"}</span>
              </button>
            </div>

            <div className="ssc-home-visual-grid">
              <div className="ssc-home-study-card" data-kind="notes">
                <span><BookOpenCheck aria-hidden="true" /></span>
                <small>Study</small>
                <strong>Chapter-wise Notes</strong>
                <p>Open the exact topic you need.</p>
              </div>
              <div className="ssc-home-study-card" data-kind="quiz">
                <span><FileQuestion aria-hidden="true" /></span>
                <small>Practice</small>
                <strong>Quizzes & Tests</strong>
                <p>Check understanding immediately.</p>
              </div>
              <div className="ssc-home-study-card" data-kind="premium">
                <span><Crown aria-hidden="true" /></span>
                <small>Exam Prep</small>
                <strong>Board Boosters</strong>
                <p>Focused revision when it matters.</p>
              </div>
              <div className="ssc-home-study-card" data-kind="plan">
                <span><TrendingUp aria-hidden="true" /></span>
                <small>Improve</small>
                <strong>Study Smarter</strong>
                <p>Move from weak topic to confidence.</p>
              </div>
              <div className="ssc-home-progress-card">
                <div className="ssc-home-progress-top"><strong>Your study path</strong><span>Learn → Practice → Improve</span></div>
                <div className="ssc-home-progress-track" aria-hidden="true"><i /></div>
                <p>Everything connected in one place — without hunting through scattered files.</p>
              </div>
            </div>
          </div>
        </article>

        <div className="ssc-home-after-hero">
          <div className="learning-home-topline">
            <div className="mobile-welcome-row">
              <div>
                <small>{greeting} 👋</small>
                <h2 className="mobile-welcome-kicker">{user ? `${firstName}, continue learning.` : "Ready to study?"}</h2>
                <p className="mobile-welcome-subtitle">Choose your path or search the exact chapter you need.</p>
              </div>
              <div className="mobile-welcome-actions">
                <AppLink to={user ? "/learning-insights" : "/login"} className="mobile-profile-button" aria-label={user ? "Open profile" : "Log in"}>
                  {user ? initials : "SS"}
                </AppLink>
              </div>
            </div>
            <MobileStudySetup profile={profile} onSaved={setPreferences} />
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
        </div>

        <section className="learning-home-actions-panel" aria-labelledby="learning-actions-title">
          <div className="mobile-section-heading mobile-shortcuts-heading"><h2 id="learning-actions-title">What will you learn today?</h2><button type="button" className="mobile-chapter-finder-trigger" onClick={() => window.dispatchEvent(new CustomEvent("ssc-open-resource-finder"))}>Find a chapter <ChevronRight aria-hidden="true" /></button></div>
          <div className="mobile-action-grid" aria-label="Quick actions">
            {QUICK_ACTIONS.map(({ label, icon: Icon, to, tone, status }) => (
              <AppLink key={label} to={personalizedTo(to)} data-tone={tone} className={`mobile-action-card mobile-action-${tone}`} onClick={() => void trackEvent('mobile_quick_action_click', { action: label, board: preferences?.board, classLevel: Number(preferences?.classLevel), subject: preferences?.subject })}>
                <span><Icon aria-hidden="true" /></span>
                <strong>{label.split("\n").map((line) => <span key={line}>{line}</span>)}</strong>
                {status && <small className="mobile-action-status">{status}</small>}
              </AppLink>
            ))}
          </div>
        </section>

        <div className="learning-home-progress-grid">
          <section className="learning-home-continue-panel" aria-labelledby="continue-learning-title">
            <div className="mobile-section-heading">
              <h2 id="continue-learning-title">{recent ? "Continue Learning" : "A good place to start"}</h2>
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
          </section>

          <section className="learning-home-class-panel" aria-labelledby="browse-class-title">
            <div className="mobile-section-heading">
              <h2 id="browse-class-title">Browse by Class</h2>
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
          </section>

          <aside className="learning-home-insight-panel">
            <AppLink to="/concept-lab" className="mobile-lab-link"><span><FlaskConical aria-hidden="true" /><strong>Make concepts click</strong></span><span>Explore Concept Lab <ChevronRight aria-hidden="true" /></span></AppLink>
            <blockquote className="mobile-quote-card">
              <strong>“Consistent practice<br />today, a confident tomorrow.”</strong>
              <span>— Smit Sir</span>
              <BarChart3 aria-hidden="true" />
            </blockquote>
          </aside>
        </div>
      </div>
    </section>
  );
}
