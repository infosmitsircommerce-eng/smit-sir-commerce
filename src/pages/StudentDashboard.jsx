import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BookOpen, PlayCircle, FileText, BarChart2, ArrowRight,
  Lock, GraduationCap, MessageCircle, LogIn, Zap,
  Trophy, Clock, Target, Bell, ChevronRight, Star,
  TrendingUp, Calendar, Brain
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/ui/SEO';

// ── Days until board exam (March 15) ──────────────────────────────
function getDaysToExam() {
  const now = new Date();
  const year = now.getMonth() >= 2 ? now.getFullYear() + 1 : now.getFullYear();
  const exam = new Date(year, 2, 15); // March 15
  return Math.max(0, Math.ceil((exam - now) / (1000 * 60 * 60 * 24)));
}

// ── Daily tip ─────────────────────────────────────────────────────
const TIPS = [
  '📊 In Economics, always draw a diagram — it gets you extra marks!',
  '📒 Revise Journal entries daily — 30 mins a day beats 5 hours before the exam.',
  '💼 Learn Fayol\'s 14 principles with mnemonics — much easier to remember!',
  '📈 Supply & Demand graphs? Practice drawing them without looking — 5 mins daily.',
  '🏆 Board tip: Write definitions in the first line. Examiners scan fast!',
  '💡 For Accountancy: Balance Sheet always tallies — if it doesn\'t, recheck your entries.',
  '📝 Business Studies: Give real examples like Tata, Reliance, Zomato in answers.',
  '⚡ Solve 1 previous year paper every week — patterns repeat in CBSE!',
];

function getDailyTip() {
  const day = new Date().getDay();
  return TIPS[day % TIPS.length];
}

// ── Class Schedule ────────────────────────────────────────────────
const SCHEDULE = {
  '11': [
    { day: 'Mon / Wed / Fri', time: '4:00 PM – 6:00 PM', subject: 'Economics + Accountancy' },
    { day: 'Saturday', time: '10:00 AM – 12:00 PM', subject: 'Business Studies' },
  ],
  '12': [
    { day: 'Tue / Thu', time: '4:00 PM – 6:00 PM', subject: 'Economics + Accountancy' },
    { day: 'Saturday', time: '2:00 PM – 4:00 PM', subject: 'Business Studies' },
    { day: 'Sunday', time: '10:00 AM – 1:00 PM', subject: 'Full Revision / Test' },
  ],
};

// ── Announcements (can be moved to Supabase later) ────────────────
const ANNOUNCEMENTS = [
  { id: 1, type: 'exam',    emoji: '📝', title: 'Unit Test – Economics Ch. 4 & 5', date: 'This Saturday', urgent: true },
  { id: 2, type: 'holiday', emoji: '🎉', title: 'No class on Sunday (holiday)', date: 'This Sunday', urgent: false },
  { id: 3, type: 'tip',     emoji: '📢', title: 'New notes uploaded for Ch. 6 Accountancy', date: 'Yesterday', urgent: false },
];

// ─────────────────────────────────────────────────────────────────

function NotLoggedIn() {
  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))', border: '1px solid rgba(212,175,55,0.25)' }}>
          <GraduationCap className="w-12 h-12 text-gold-400" />
        </div>
        <h2 className="text-white font-bold text-2xl mb-3">Your Dashboard Awaits!</h2>
        <p className="text-navy-400 text-sm mb-8 leading-relaxed">
          Login to track your progress, access study materials, attempt quizzes and see class announcements.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/login" className="btn-primary flex items-center justify-center gap-2 py-3.5">
            <LogIn className="w-4 h-4" /> Login to Dashboard
          </Link>
          <a href="https://wa.me/916353709585?text=Hi%20Smit%20Sir%2C%20I%20want%20to%20enroll."
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all"
            style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}>
            <MessageCircle className="w-4 h-4" /> Enquire on WhatsApp
          </a>
        </div>
      </motion.div>
    </div>
  );
}

function Card({ children, className = '', style = {} }) {
  return (
    <div className={`rounded-2xl p-5 ${className}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', ...style }}>
      {children}
    </div>
  );
}

export default function StudentDashboard() {
  const { user, profile, displayName, initials, isPremium, signOut } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [materialCount, setMaterialCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [greeting, setGreeting] = useState('');

  const daysToExam = getDaysToExam();
  const dailyTip = getDailyTip();
  const classLevel = profile?.class_level ?? '12';
  const schedule = SCHEDULE[classLevel] || SCHEDULE['12'];

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? '🌅 Good Morning' : h < 17 ? '☀️ Good Afternoon' : '🌙 Good Evening');
  }, []);

  useEffect(() => {
    if (!user) return;
    supabase.from('study_materials')
      .select('id, title, type, is_free, subject, class_level', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(4)
      .then(({ data, count }) => {
        setMaterials(data ?? []);
        setMaterialCount(count ?? 0);
      });

    supabase.from('quizzes')
      .select('id', { count: 'exact' })
      .then(({ count }) => setQuizCount(count ?? 11));
  }, [user]);

  if (!user) return <NotLoggedIn />;

  const card = (delay, children, cls = '', sty = {}) => (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-2xl p-5 ${cls}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', ...sty }}
    >
      {children}
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-navy-950">
      <SEO title="My Dashboard" description="Student dashboard for Smit Sir Commerce." path="/dashboard" />

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <div className="border-b border-navy-800/50"
        style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, transparent 60%)' }}>
        <div className="page-container py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">

            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black text-navy-950 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)' }}>
              {initials}
            </motion.div>

            <div className="flex-1">
              <div className="text-navy-400 text-sm mb-0.5">{greeting}</div>
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-white font-black text-2xl">{displayName}!</h1>
                {isPremium && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-bold"
                    style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.3)' }}>
                    ✦ PREMIUM
                  </span>
                )}
              </div>
              <p className="text-navy-500 text-sm mt-0.5">Class {classLevel} Commerce · {user.email}</p>
            </div>

            <button onClick={async () => { await signOut(); navigate('/'); }}
              className="text-navy-500 hover:text-red-400 text-sm transition-colors px-3 py-1.5 rounded-lg hover:bg-red-400/10">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="page-container py-8 space-y-6">

        {/* ── ROW 1: Stats ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: FileText,   label: 'Study Materials', value: materialCount || '—', color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
            { icon: BookOpen,   label: 'Quizzes',         value: quizCount || 11,       color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
            { icon: Trophy,     label: 'Your Class',      value: `Class ${classLevel}`, color: '#D4AF37', bg: 'rgba(212,175,55,0.1)'  },
            { icon: Target,     label: 'Access Level',    value: isPremium ? 'Premium' : 'Free',
              color: isPremium ? '#D4AF37' : '#94a3b8', bg: isPremium ? 'rgba(212,175,55,0.1)' : 'rgba(148,163,184,0.08)' },
          ].map(({ icon: Icon, label, value, color, bg }, i) => (
            <motion.div key={label}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex items-center gap-3"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <div className="font-black text-xl" style={{ color }}>{value}</div>
                <div className="text-navy-500 text-xs">{label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── ROW 2: Exam Countdown + Daily Tip ─────────────────── */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Exam Countdown */}
          {card(0.1,
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))', border: '1px solid rgba(239,68,68,0.2)' }}>
                📅
              </div>
              <div>
                <div className="text-navy-400 text-xs font-semibold uppercase tracking-wide mb-1">Board Exam Countdown</div>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black" style={{ color: daysToExam < 60 ? '#f87171' : '#D4AF37' }}>{daysToExam}</span>
                  <span className="text-navy-400 text-sm mb-1">days to go</span>
                </div>
                <div className="text-navy-500 text-xs mt-1">CBSE Board Exam · March 15, 2026</div>
              </div>
              <div className="ml-auto text-right hidden sm:block">
                <div className="text-xs text-navy-500 mb-1">Stay consistent</div>
                <div className="text-xs font-bold" style={{ color: '#D4AF37' }}>1 hour/day = 🏆</div>
              </div>
            </div>
          )}

          {/* Daily Tip */}
          {card(0.15,
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(212,175,55,0.15)' }}>
                  <Zap className="w-3.5 h-3.5 text-gold-400" />
                </div>
                <span className="text-xs font-bold text-gold-400 uppercase tracking-wide">Today's Study Tip</span>
              </div>
              <p className="text-white text-sm leading-relaxed">{dailyTip}</p>
              <Link to="/ask" className="inline-flex items-center gap-1.5 mt-3 text-xs text-gold-400 hover:text-gold-300 font-semibold transition-colors">
                <Brain className="w-3.5 h-3.5" /> Ask AI for more tips <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* ── ROW 3: Announcements ──────────────────────────────── */}
        {card(0.2,
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                <Bell className="w-4 h-4 text-gold-400" /> Announcements
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/20">
                {ANNOUNCEMENTS.length} new
              </span>
            </div>
            <div className="space-y-2.5">
              {ANNOUNCEMENTS.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors"
                  style={{ background: a.urgent ? 'rgba(239,68,68,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${a.urgent ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.05)'}` }}>
                  <span className="text-xl flex-shrink-0">{a.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate">{a.title}</div>
                    <div className="text-navy-500 text-xs">{a.date}</div>
                  </div>
                  {a.urgent && <span className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full flex-shrink-0">Urgent</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── ROW 4: Class Schedule + Quick Access ──────────────── */}
        <div className="grid lg:grid-cols-2 gap-4">

          {/* Schedule */}
          {card(0.25,
            <>
              <h2 className="font-bold text-white flex items-center gap-2 text-sm mb-4">
                <Calendar className="w-4 h-4 text-gold-400" /> Class Schedule — Class {classLevel}
              </h2>
              <div className="space-y-3">
                {schedule.map((s, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: 'rgba(212,175,55,0.05)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#D4AF37' }} />
                    <div className="flex-1">
                      <div className="text-white text-sm font-semibold">{s.day}</div>
                      <div className="text-navy-400 text-xs">{s.subject}</div>
                    </div>
                    <div className="flex items-center gap-1 text-gold-400 text-xs font-medium flex-shrink-0">
                      <Clock className="w-3 h-3" /> {s.time}
                    </div>
                  </div>
                ))}
              </div>
              <a href="https://wa.me/916353709585?text=Hi%20Smit%20Sir%2C%20I%20want%20to%20confirm%20my%20class%20schedule."
                target="_blank" rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366' }}>
                <MessageCircle className="w-3.5 h-3.5" /> Confirm with Smit Sir
              </a>
            </>
          )}

          {/* Quick Access */}
          {card(0.3,
            <>
              <h2 className="font-bold text-white flex items-center gap-2 text-sm mb-4">
                <TrendingUp className="w-4 h-4 text-gold-400" /> Quick Access
              </h2>
              <div className="grid grid-cols-2 gap-2.5 mb-3">
                {[
                  { to: '/study-material', icon: FileText,   label: 'Study Material', color: '#34d399', bg: 'rgba(52,211,153,0.1)'  },
                  { to: '/quizzes',        icon: BookOpen,    label: 'Take Quiz',      color: '#a78bfa', bg: 'rgba(167,139,250,0.1)' },
                  { to: '/test-series',    icon: BarChart2,   label: 'Test Series',    color: '#D4AF37', bg: 'rgba(212,175,55,0.1)'  },
                  { to: '/ask',            icon: Brain,       label: 'AI Doubt Solver',color: '#60a5fa', bg: 'rgba(96,165,250,0.1)'  },
                ].map(({ to, icon: Icon, label, color, bg }) => (
                  <Link key={to} to={to}
                    className="flex flex-col items-center gap-2 p-3.5 rounded-xl transition-all hover:-translate-y-0.5"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = `${color}33`}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                      <Icon className="w-5 h-5" style={{ color }} />
                    </div>
                    <span className="text-navy-300 text-xs font-medium text-center leading-tight">{label}</span>
                  </Link>
                ))}
              </div>
              <Link to="/lectures"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all"
                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', color: '#60a5fa' }}>
                <PlayCircle className="w-3.5 h-3.5" /> Watch Lectures
              </Link>
            </>
          )}
        </div>

        {/* ── ROW 5: Recent Study Material ─────────────────────── */}
        {card(0.35,
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-white flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gold-400" /> Recent Study Material
              </h2>
              <Link to="/study-material" className="text-gold-400 hover:text-gold-300 text-xs flex items-center gap-1 transition-colors">
                View All <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            {materials.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-3">📚</div>
                <div className="text-navy-400 text-sm">No materials uploaded yet — check back soon!</div>
                <Link to="/study-material" className="inline-flex items-center gap-1 mt-3 text-xs text-gold-400">
                  Browse all materials <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-2.5">
                {materials.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(212,175,55,0.1)' }}>
                      <FileText className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{m.title}</div>
                      <div className="text-navy-500 text-xs">{m.subject} · Class {m.class_level}</div>
                    </div>
                    {m.is_free || isPremium
                      ? <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full flex-shrink-0">Free</span>
                      : <Lock className="w-3.5 h-3.5 text-gold-400/50 flex-shrink-0" />
                    }
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ── ROW 6: Upgrade Banner (free users only) ───────────── */}
        {!isPremium && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(240,192,64,0.05))', border: '1px solid rgba(212,175,55,0.25)' }}>
            <div className="text-5xl flex-shrink-0">🌟</div>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-white font-black text-lg mb-1">Unlock Premium Access</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                {['All PDF Notes', 'Test Series', 'Priority Doubt Support', 'Recorded Lectures'].map(f => (
                  <span key={f} className="flex items-center gap-1 text-xs text-navy-300">
                    <Star className="w-3 h-3 text-gold-400" /> {f}
                  </span>
                ))}
              </div>
            </div>
            <a href="https://wa.me/916353709585?text=Hi%20Smit%20Sir%2C%20I%20want%20to%20upgrade%20to%20premium."
              target="_blank" rel="noopener noreferrer"
              className="btn-primary flex items-center gap-2 flex-shrink-0 whitespace-nowrap">
              <MessageCircle className="w-4 h-4" /> Upgrade Now
            </a>
          </motion.div>
        )}

      </div>
    </div>
  );
}
