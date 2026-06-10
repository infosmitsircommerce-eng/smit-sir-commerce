import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2, TrendingUp, Coins, ArrowRight } from 'lucide-react';

const GAMES = [
  {
    icon: TrendingUp,
    title: 'Predict the Price!',
    desc: '5 Chapters · 3 Levels · 120+ Questions',
    tag: 'Quiz Game',
    detail: 'Demand, Supply, GDP, Inflation & more',
  },
  {
    icon: Coins,
    title: 'Money Time Machine',
    desc: 'India CPI data 2000–2024',
    tag: 'Visual Tool',
    detail: 'See how inflation ate your money!',
  },
];

export default function GamesPromo() {
  return (
    <section className="section-padding py-16" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          className="text-center mb-10"
        >
          <span className="eyebrow">New — Just Added</span>
          <h2 className="headline mt-6 mb-3">
            Learn Economics by <em>playing.</em>
          </h2>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>
            Interactive games that make Micro &amp; Macro concepts click — no boring textbooks!
          </p>
        </motion.div>

        {/* Ink feature card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "50px" }}
          transition={{ delay: 0.1 }}
          className="relative rounded-3xl overflow-hidden mb-6 p-6 sm:p-10"
          style={{
            background: 'linear-gradient(135deg, var(--ink-bg-2) 0%, var(--ink-bg) 60%)',
            border: '1px solid rgba(201,160,80,0.3)',
            boxShadow: '0 24px 64px rgba(30,24,18,0.18)',
          }}
        >
          {/* Gold glow corners */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,160,80,0.14), transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-52 h-52 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(201,160,80,0.1), transparent 70%)', transform: 'translate(-30%, 30%)' }} />
          {/* Gold hairline top */}
          <div className="absolute top-0 inset-x-0 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(217,172,92,0.6), transparent)' }} />

          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5"
                style={{ background: 'rgba(217,172,92,0.1)', border: '1px solid rgba(217,172,92,0.3)' }}>
                <Gamepad2 style={{ width: '26px', height: '26px', color: 'var(--gold-bright)' }} strokeWidth={1.6} />
              </div>
              <h3 style={{
                fontFamily: 'var(--font-serif)', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 2.6vw, 2rem)',
                color: 'var(--ivory-on-ink)', marginBottom: '12px', letterSpacing: '-0.02em',
              }}>
                Economics Games
              </h3>
              <p className="text-sm mb-6 leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: 'var(--muted-on-ink)' }}>
                Predict if prices go <span style={{ color: '#8FBF6B', fontWeight: 700 }}>up</span> or <span style={{ color: '#D98C7A', fontWeight: 700 }}>down</span> based on real-life news.
                Learn Giffen goods, Veblen goods, tax incidence, multiplier effect &amp; more — by playing.
              </p>

              {/* Chapter pills */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-7">
                {['Demand', 'Supply', 'Equilibrium', 'National Income', 'Inflation'].map(t => (
                  <span key={t} className="text-xs px-3 py-1 rounded-full font-medium"
                    style={{ background: 'rgba(243,236,221,0.06)', color: 'var(--muted-on-ink)', border: '1px solid rgba(243,236,221,0.12)' }}>
                    {t}
                  </span>
                ))}
              </div>

              <Link to="/games" className="btn-gold text-base px-8 py-4">
                Play Now — It's Free
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: game cards */}
            <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3 lg:min-w-[260px]">
              {GAMES.map((g, i) => {
                const Icon = g.icon;
                return (
                  <motion.div
                    key={g.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "50px" }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="flex-1 lg:flex-none rounded-2xl p-4"
                    style={{
                      background: 'rgba(243,236,221,0.05)',
                      border: '1px solid rgba(217,172,92,0.25)',
                    }}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(217,172,92,0.1)', border: '1px solid rgba(217,172,92,0.25)' }}>
                        <Icon style={{ width: '16px', height: '16px', color: 'var(--gold-bright)' }} strokeWidth={1.8} />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold-bright)' }}>{g.tag}</div>
                        <div className="text-sm leading-tight" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ivory-on-ink)' }}>{g.title}</div>
                      </div>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--muted-on-ink)' }}>{g.desc}</p>
                    <p className="text-xs mt-1 font-medium" style={{ color: 'var(--gold-soft)' }}>{g.detail}</p>
                  </motion.div>
                );
              })}
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
            { value: '5',    label: 'Chapters',          sub: 'Micro & Macro'    },
            { value: '120+', label: 'Questions',         sub: 'With board tips'  },
            { value: '3',    label: 'Difficulty Levels', sub: 'Easy → Hard'      },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ delay: 0.35 + i * 0.07 }}
              className="rounded-2xl p-4 text-center"
              style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="text-xl sm:text-2xl" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--gold)' }}>{s.value}</div>
              <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--ink)' }}>{s.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--subtle)' }}>{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
