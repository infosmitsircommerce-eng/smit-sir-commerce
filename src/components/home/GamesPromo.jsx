import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GAMES = [
  {
    emoji: '🎯',
    title: 'Predict the Price!',
    desc: '5 Chapters · 3 Levels · 120+ Questions',
    tag: 'Quiz Game',
    color: '#60a5fa',
    detail: 'Demand, Supply, GDP, Inflation & more',
  },
  {
    emoji: '💸',
    title: 'Money Time Machine',
    desc: 'India CPI data 2000–2024',
    tag: 'Visual Tool',
    color: '#34d399',
    detail: 'See how inflation ate your money!',
  },
];

export default function GamesPromo() {
  return (
    <section className="section-padding py-16">
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          className="text-center mb-10"
        >
          {/* NEW badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))',
              border: '1px solid rgba(212,175,55,0.4)',
              color: '#D4AF37',
            }}>
            ✨ NEW — Just Added!
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Learn Economics by{' '}
            <span style={{ color: '#D4AF37' }}>Playing! 🎮</span>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Interactive games that make Micro & Macro concepts click — no boring textbooks!
          </p>
        </motion.div>

        {/* Big glowing card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-6 sm:p-8"
          style={{
            background: 'linear-gradient(135deg, rgba(96,165,250,0.12) 0%, rgba(212,175,55,0.08) 50%, rgba(52,211,153,0.1) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
            boxShadow: '0 0 60px rgba(212,175,55,0.08)',
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #60a5fa, transparent)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-10 pointer-events-none"
            style={{ background: 'radial-gradient(circle, #34d399, transparent)', transform: 'translate(-30%, 30%)' }} />

          <div className="relative flex flex-col lg:flex-row items-center gap-8">
            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="text-5xl mb-4">🕹️</div>
              <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
                Economics Games
              </h3>
              <p className="text-sm mb-5 leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Predict if prices go <span style={{ color: '#34d399', fontWeight: 'bold' }}>UP 📈</span> or <span style={{ color: '#f87171', fontWeight: 'bold' }}>DOWN 📉</span> based on real-life news.
                Learn Giffen goods, Veblen goods, tax incidence, multiplier effect & more — by playing!
              </p>

              {/* Chapter pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-6">
                {['📥 Demand','📤 Supply','⚖️ Equilibrium','💰 Nat. Income','📈 Inflation'].map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <Link to="/games"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black text-navy-950 text-base transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)', boxShadow: '0 8px 30px rgba(212,175,55,0.35)' }}>
                🎮 Play Now — It's Free!
              </Link>
            </div>

            {/* Right: game cards */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[240px]">
              {GAMES.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "50px" }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex-1 lg:flex-none rounded-2xl p-4"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${g.color}30`,
                  }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{g.emoji}</span>
                    <div>
                      <div className="text-xs font-bold" style={{ color: g.color }}>{g.tag}</div>
                      <div className="text-sm font-black text-white leading-tight">{g.title}</div>
                    </div>
                  </div>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>{g.desc}</p>
                  <p className="text-xs mt-1 font-medium" style={{ color: g.color }}>{g.detail}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Bottom stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: '5', label: 'Chapters', sub: 'Micro & Macro', emoji: '📚' },
            { value: '120+', label: 'Questions', sub: 'With board tips', emoji: '❓' },
            { value: '3', label: 'Difficulty Levels', sub: 'Easy → Hard', emoji: '🎯' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="text-xl mb-1">{s.emoji}</div>
              <div className="text-xl sm:text-2xl font-black" style={{ color: '#D4AF37' }}>{s.value}</div>
              <div className="text-xs font-semibold text-white">{s.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
