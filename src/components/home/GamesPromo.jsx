import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Calculator, Coins, Gamepad2, Store, TrendingUp, Wallet } from 'lucide-react';

const GAMES = [
  {
    icon: TrendingUp,
    title: 'Market Shock Simulator',
    desc: 'Predict demand, supply and price after real-life news.',
    tag: 'Economics Game',
  },
  {
    icon: Wallet,
    title: 'Family Budget Challenge',
    desc: 'Handle income, wants, needs, savings and inflation pressure.',
    tag: 'Money Game',
  },
  {
    icon: Store,
    title: 'Shopkeeper Price War',
    desc: 'Choose pricing, discount and stock decisions like a real business.',
    tag: 'Business Game',
  },
  {
    icon: Coins,
    title: 'Inflation Time Machine',
    desc: 'See how money value changes and why prices rise over time.',
    tag: 'Visual Tool',
  },
  {
    icon: Calculator,
    title: 'Business Decision Game',
    desc: 'Compare cost, revenue, profit and break-even decisions.',
    tag: 'Accountancy + BST',
  },
];

const topics = ['Demand', 'Supply', 'Inflation', 'Budgeting', 'Profit', 'Break-even'];

export default function GamesPromo() {
  return (
    <section className="section-padding py-16" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '50px' }}
          className="text-center mb-10"
        >
          <span className="eyebrow">Real-life Commerce Games</span>
          <h2 className="headline mt-6 mb-3">
            Learn Commerce by making <em>decisions.</em>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            Not random childish games — practical mini-simulations that connect Economics, Business Studies and Accountancy with real situations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '50px' }}
          transition={{ delay: 0.08 }}
          className="relative rounded-[2rem] overflow-hidden p-5 sm:p-8 lg:p-10"
          style={{
            background: 'linear-gradient(135deg, #172033 0%, #253147 66%, #332611 100%)',
            border: '1px solid rgba(217,172,92,0.32)',
            boxShadow: '0 28px 76px rgba(30,24,18,0.18)',
          }}
        >
          <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(243,202,105,0.75), transparent)' }} />
          <div aria-hidden="true" className="absolute -top-32 -right-24 w-80 h-80 rounded-full" style={{ background: 'rgba(217,172,92,0.16)', filter: 'blur(48px)' }} />

          <div className="relative grid lg:grid-cols-[0.88fr_1.12fr] gap-8 items-center">
            <div>
              <div className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5" style={{ background: 'rgba(217,172,92,0.12)', border: '1px solid rgba(217,172,92,0.30)' }}>
                <Gamepad2 style={{ width: '26px', height: '26px', color: 'var(--gold-bright)' }} strokeWidth={1.7} />
              </div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontWeight: 780, fontSize: 'clamp(1.7rem, 3vw, 2.4rem)', color: 'var(--ivory-on-ink)', lineHeight: 1.12, letterSpacing: '-0.03em', marginBottom: '14px' }}>
                Realistic games that feel connected to life.
              </h3>
              <p className="text-sm leading-relaxed max-w-md" style={{ color: 'var(--muted-on-ink)' }}>
                Students understand faster when they decide what happens to price, profit, budget or demand. These games make concepts feel practical, not just theoretical.
              </p>
              <div className="flex flex-wrap gap-2 mt-6 mb-7">
                {topics.map((topic) => (
                  <span key={topic} className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: 'rgba(243,236,221,0.07)', color: 'var(--muted-on-ink)', border: '1px solid rgba(243,236,221,0.12)' }}>
                    {topic}
                  </span>
                ))}
              </div>
              <Link to="/games" className="btn-gold text-base px-8 py-4">
                Open Commerce Games
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              {GAMES.map((game, index) => {
                const Icon = game.icon;
                return (
                  <motion.div
                    key={game.title}
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '50px' }}
                    transition={{ delay: 0.14 + index * 0.06 }}
                    className="rounded-2xl p-4"
                    style={{ background: 'rgba(243,236,221,0.06)', border: '1px solid rgba(217,172,92,0.24)', minHeight: '142px' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(217,172,92,0.12)', color: 'var(--gold-bright)' }}>
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: 'var(--gold-bright)' }}>{game.tag}</div>
                    </div>
                    <h4 style={{ fontFamily: 'var(--font-serif)', color: 'var(--ivory-on-ink)', fontWeight: 780, fontSize: '1.06rem', lineHeight: 1.18 }}>{game.title}</h4>
                    <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted-on-ink)' }}>{game.desc}</p>
                  </motion.div>
                );
              })}
              <div className="rounded-2xl p-4 sm:col-span-2 flex items-center gap-4" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(217,172,92,0.24)' }}>
                <BarChart3 className="w-7 h-7 shrink-0" style={{ color: 'var(--gold-bright)' }} />
                <div>
                  <div className="text-sm font-black" style={{ color: '#fff' }}>Best part: games support concept clarity.</div>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-on-ink)' }}>The goal is not entertainment only — it is revision that feels practical.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
