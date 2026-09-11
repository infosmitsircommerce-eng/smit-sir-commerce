import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  Brain,
  ChevronDown,
  FileText,
  ListChecks,
  GraduationCap,
  LogOut,
  Search,
  User,
  Wrench,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { isLightRoute } from "../../lib/theme";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Study Material", path: "/study-material" },
  {
    label: "Notes",
    children: [
      { label: "All Study Material", path: "/study-material" },
      { label: "GSEB Class 12 Economics", path: "/study-material?board=GSEB" },
      { label: "CBSE Notes", path: "/cbse-notes" },
      { label: "CBSE PYQ & Sample Papers", path: "/cbse-pyq" },
    ],
  },
  {
    label: "Practice",
    children: [
      { label: "Daily Practice", path: "/daily-practice" },
      { label: "Chapter Practice", path: "/cbse-practice" },
      { label: "Test Series", path: "/test-series" },
      { label: "Quizzes", path: "/quizzes" },
      { label: "Flashcards", path: "/flashcards" },
    ],
  },
  { label: "Board Boosters", path: "/board-booster-packs" },
  { label: "Free Diagnostic", path: "/board-exam-diagnostic" },
  { label: "Tools", path: "/tools" },
  { label: "For Teachers", path: "/services-for-teachers" },
  { label: "Contact", path: "/contact" },
];

const featureLinks = [
  { label: "Notes", path: "/study-material", icon: BookOpen },
  { label: "GSEB", path: "/study-material?board=GSEB", icon: FileText },
  { label: "Practice", path: "/daily-practice", icon: Brain },
  { label: "Quizzes", path: "/quizzes", icon: ListChecks },
  { label: "Free Diagnostic", path: "/board-exam-diagnostic", icon: Brain },
  { label: "₹199 Boosters", path: "/board-booster-packs", icon: FileText },
  { label: "Tools", path: "/tools", icon: Wrench },
  { label: "Teachers", path: "/services-for-teachers", icon: FileText },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, displayName, initials, isPremium, isAdmin, signOut } =
    useAuth();

  const light = isLightRoute(location.pathname);

  async function handleLogout() {
    await signOut();
    setUserMenuOpen(false);
    navigate("/");
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setOpenDropdown(null);
    setUserMenuOpen(false);
  }, [location]);

  const T = light
    ? {
        bg: {
          background: scrolled
            ? "rgba(247,248,252,0.94)"
            : "rgba(247,248,252,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(225,230,239,0.95)",
          boxShadow: scrolled ? "0 8px 28px rgba(16,24,40,0.07)" : "none",
        },
        linkColor: "var(--charcoal)",
        linkActive: "var(--gold)",
        linkHoverBg: "rgba(184,135,47,0.07)",
        brandTop: "var(--ink)",
        dropdownBg: {
          background: "#FFFFFF",
          border: "1px solid var(--border)",
          boxShadow: "var(--shadow-md)",
        },
        dropdownItem: "var(--charcoal)",
        dropdownItemHoverBg: "var(--bg-ivory)",
      }
    : {
        bg: {
          background: scrolled ? "rgba(10,15,44,0.86)" : "rgba(10,15,44,0.55)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(212,175,55,0.1)",
          boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none",
        },
        linkColor: "#c7d7fe",
        linkActive: "#D9AC5C",
        linkHoverBg: "rgba(184,135,47,0.14)",
        brandTop: "#fff",
        dropdownBg: {
          background: "#121B32",
          border: "1px solid rgba(212,175,55,0.22)",
          boxShadow: "0 16px 36px rgba(0,0,0,0.35)",
        },
        dropdownItem: "#c7d7fe",
        dropdownItemHoverBg: "rgba(184,135,47,0.12)",
      };

  const isActive = (path) =>
    path === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(path.split("?")[0]);
  const linkStyle = (active) => ({
    color: active ? T.linkActive : T.linkColor,
    fontFamily: "var(--font-sans)",
  });

  return (
    <nav
      style={T.bg}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden lg:block"
    >
      <div className="page-container">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{
                background: "linear-gradient(135deg, #C9A050, #B8872F)",
                boxShadow: "0 4px 16px rgba(184,135,47,0.3)",
              }}
            >
              <GraduationCap className="w-5 h-5" style={{ color: "#1E1812" }} />
            </div>
            <div>
              <div
                className="text-sm leading-tight"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontWeight: 800,
                  color: T.brandTop,
                }}
              >
                Smit Sir
              </div>
              <div
                className="text-xs leading-tight"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "var(--gold)",
                }}
              >
                COMMERCE
              </div>
            </div>
          </Link>

          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) =>
              link.children ? (
                <div key={link.label} className="relative">
                  <button
                    className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                    style={linkStyle(false)}
                    onMouseEnter={(e) => {
                      setOpenDropdown(link.label);
                      e.currentTarget.style.background = T.linkHoverBg;
                      e.currentTarget.style.color = T.linkActive;
                    }}
                    onMouseLeave={(e) => {
                      setOpenDropdown(null);
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = T.linkColor;
                    }}
                  >
                    {link.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                  {openDropdown === link.label && (
                    <div
                      className="absolute top-full left-0 mt-1 rounded-xl py-2 min-w-[240px] max-h-[70vh] overflow-y-auto"
                      style={T.dropdownBg}
                      onMouseEnter={() => setOpenDropdown(link.label)}
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className="block px-4 py-2 text-sm font-semibold transition-colors"
                          style={{ color: T.dropdownItem }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              T.dropdownItemHoverBg;
                            e.currentTarget.style.color = T.linkActive;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = T.dropdownItem;
                          }}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-3 py-2 rounded-lg text-sm font-semibold transition-colors"
                  style={linkStyle(isActive(link.path))}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                      style={{ background: "var(--gold)" }}
                    />
                  )}
                </Link>
              ),
            )}
          </div>

          <div className="hidden lg:flex xl:hidden items-center gap-2">
            {featureLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className="ssc-dock-link"
                  data-primary={
                    item.path === "/study-material" ? "true" : undefined
                  }
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={() =>
                window.dispatchEvent(new CustomEvent("ssc-open-search"))
              }
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              title="Search (Ctrl/⌘ K)"
              style={
                light
                  ? {
                      background: "var(--bg-white)",
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                    }
                  : {
                      background: "#3730a3",
                      border: "1px solid #4338c2",
                      color: "#fff",
                    }
              }
            >
              <Search className="w-4 h-4" />
            </button>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((o) => !o)}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 transition-colors"
                  style={
                    light
                      ? {
                          background: "var(--bg-white)",
                          border: "1px solid var(--border)",
                        }
                      : { background: "#3730a3", border: "1px solid #4338c2" }
                  }
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "linear-gradient(135deg, #C9A050, #B8872F)",
                      color: "#1E1812",
                    }}
                  >
                    {initials}
                  </div>
                  <span
                    className="text-sm font-medium max-w-[100px] truncate"
                    style={{ color: light ? "var(--ink)" : "#fff" }}
                  >
                    {displayName}
                  </span>
                  {isPremium && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: "rgba(184,135,47,0.12)",
                        color: "var(--gold)",
                        border: "1px solid rgba(184,135,47,0.3)",
                      }}
                    >
                      PRO
                    </span>
                  )}
                  <ChevronDown
                    className="w-3.5 h-3.5"
                    style={{ color: light ? "var(--subtle)" : "#8193f1" }}
                  />
                </button>
                {userMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 rounded-xl py-2 min-w-[200px] z-50"
                    style={T.dropdownBg}
                  >
                    <Link
                      to="/dashboard"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm"
                      style={{ color: T.dropdownItem }}
                    >
                      <User className="w-4 h-4" /> My Dashboard
                    </Link>
                    <Link
                      to="/learning-insights"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm"
                      style={{ color: T.dropdownItem }}
                    >
                      Learning Insights
                    </Link>
                    <Link
                      to="/my-data"
                      onClick={() => setUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm"
                      style={{ color: T.dropdownItem }}
                    >
                      My Study Data
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm font-bold"
                        style={{ color: "var(--gold)" }}
                      >
                        Owner Panel
                      </Link>
                    )}
                    {isAdmin && (
                      <Link
                        to="/admin-studio"
                        onClick={() => setUserMenuOpen(false)}
                        className="block px-4 py-2 text-sm"
                        style={{ color: "var(--gold)" }}
                      >
                        Admin Studio
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm py-2 px-4 rounded-xl font-semibold"
                style={
                  light
                    ? {
                        color: "var(--ink)",
                        border: "1px solid var(--border)",
                        background: "var(--bg-white)",
                      }
                    : {
                        color: "#fff",
                        border: "1px solid #4338c2",
                        background: "#3730a3",
                      }
                }
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
