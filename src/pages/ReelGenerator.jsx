import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TOPICS = [
  'Law of Demand & Giffen Goods',
  'Demand vs Supply — Price Changes',
  'GDP vs GNP — National Income',
  'Repo Rate & Inflation',
  'Multiplier Effect',
  'Perfect Competition vs Monopoly',
  'Journal Entries — Accountancy',
  'Partnership Accounts',
  'Cash Flow Statement',
  'Business Studies — Marketing Mix',
];

const COUNTS = [1, 3, 7, 14, 30];
const AUDIENCES = ['Class 11', 'Class 12', 'Parents', 'General'];
const STYLES = ['Educational', 'Shocking Fact', 'Myth vs Truth', 'Story Format', 'Quick Tips'];

const COLORS = ['#60a5fa', '#34d399', '#f97316', '#a78bfa', '#f87171', '#fbbf24', '#ec4899'];

function CopyBtn({ text, label = 'Copy' }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy}
      className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
      style={copied
        ? { background: 'rgba(52,211,153,0.2)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)' }
        : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
      {copied ? '✓ Copied!' : `📋 ${label}`}
    </button>
  );
}

function ReelCard({ reel, index }) {
  const color = COLORS[index % COLORS.length];
  const [open, setOpen] = useState(index === 0);

  const fullText = `🎬 REEL ${reel.id}: ${reel.title}

⚡ HOOK (0-3s):
${reel.hook}

📝 SCRIPT:
${reel.script?.join('\n')}

📱 TEXT OVERLAYS:
${reel.overlays?.join('\n')}

${reel.hashtags}

📣 CTA: ${reel.cta}

⏱ Duration: ~${reel.duration}s`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{ border: `1px solid ${color}30` }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left transition-all"
        style={{ background: `${color}10` }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0"
          style={{ background: `${color}25`, color }}>
          {reel.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-white text-sm truncate">{reel.title || `Reel ${reel.id}`}</div>
          <div className="text-xs mt-0.5 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>
            ⏱ ~{reel.duration}s · {open ? 'click to collapse' : 'click to expand'}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <CopyBtn text={fullText} label="Copy All" />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {/* Body */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 py-4 space-y-4" style={{ background: 'rgba(10,15,44,0.7)' }}>

              {/* Hook */}
              <div className="rounded-xl p-4"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black" style={{ color: '#f87171' }}>⚡ HOOK — First 3 Seconds</span>
                  <CopyBtn text={reel.hook} />
                </div>
                <p className="text-sm font-semibold text-white leading-relaxed">{reel.hook}</p>
              </div>

              {/* Script */}
              <div className="rounded-xl p-4"
                style={{ background: `${color}08`, border: `1px solid ${color}20` }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black" style={{ color }}>📝 SCRIPT — What You Say</span>
                  <CopyBtn text={reel.script?.join('\n')} />
                </div>
                <ol className="space-y-2">
                  {reel.script?.map((line, i) => (
                    <li key={i} className="flex gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.8)' }}>
                      <span className="font-black flex-shrink-0" style={{ color }}>{i + 1}.</span>
                      {line}
                    </li>
                  ))}
                </ol>
              </div>

              {/* Text Overlays */}
              {reel.overlays?.length > 0 && (
                <div className="rounded-xl p-4"
                  style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black" style={{ color: '#a78bfa' }}>📱 TEXT OVERLAYS — On Screen</span>
                    <CopyBtn text={reel.overlays?.join('\n')} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {reel.overlays?.map((o, i) => (
                      <span key={i} className="text-xs px-3 py-1.5 rounded-lg font-semibold"
                        style={{ background: 'rgba(167,139,250,0.12)', color: '#c4b5fd', border: '1px solid rgba(167,139,250,0.2)' }}>
                        {o}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hashtags */}
              <div className="rounded-xl p-4"
                style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black" style={{ color: '#34d399' }}># HASHTAGS</span>
                  <CopyBtn text={reel.hashtags} />
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>{reel.hashtags}</p>
              </div>

              {/* CTA */}
              <div className="rounded-xl p-4"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                <span className="text-xs font-black" style={{ color: '#D4AF37' }}>📣 CTA — Last 3 Seconds</span>
                <p className="text-sm mt-1.5 font-semibold text-white">{reel.cta}</p>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ReelGenerator() {
  const [topic, setTopic] = useState('');
  const [count, setCount] = useState(7);
  const [audience, setAudience] = useState('Class 12');
  const [style, setStyle] = useState('Educational');
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [generated, setGenerated] = useState(false);

  async function generate() {
    if (!topic.trim() || loading) return;
    setLoading(true);
    setError('');
    setReels([]);
    setGenerated(false);

    try {
      const res = await fetch('/api/reel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, count, audience, style }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || 'Something went wrong.');
      } else {
        setReels(data.reels || []);
        setGenerated(true);
      }
    } catch {
      setError('Network error. Check your connection.');
    } finally {
      setLoading(false);
    }
  }

  function downloadAll() {
    const text = reels.map(r =>
      `🎬 REEL ${r.id}: ${r.title}\n\n⚡ HOOK:\n${r.hook}\n\n📝 SCRIPT:\n${r.script?.join('\n')}\n\n📱 OVERLAYS:\n${r.overlays?.join('\n')}\n\n${r.hashtags}\n\n📣 CTA: ${r.cta}\n\n${'─'.repeat(50)}\n`
    ).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smit-sir-reels-${topic.replace(/\s+/g, '-').toLowerCase()}.txt`;
    a.click();
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black mb-4"
            style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)', color: '#ec4899' }}>
            🎬 AI Content Creator
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-3">
            Instagram Reel<br />
            <span style={{ color: '#ec4899' }}>Script Generator</span>
          </h1>
          <p className="text-sm max-w-md mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Type any Commerce topic → get ready-to-record Reel scripts with hooks, overlays & hashtags. 30 days of content in 5 minutes.
          </p>
        </motion.div>

        {/* Input Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-3xl p-5 mb-6"
          style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.08) 0%, rgba(10,15,44,0.9) 100%)',
            border: '1px solid rgba(236,72,153,0.2)',
          }}
        >
          {/* Topic input */}
          <label className="text-xs font-bold mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>
            TOPIC / CHAPTER
          </label>
          <input
            value={topic}
            onChange={e => setTopic(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="e.g. Demand and Supply, GDP, Repo Rate..."
            className="w-full outline-none text-sm rounded-2xl px-4 py-3 mb-4"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              caretColor: '#ec4899',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(236,72,153,0.4)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          {/* Quick topic chips */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {TOPICS.slice(0, 5).map(t => (
              <button key={t} onClick={() => setTopic(t)}
                className="text-xs px-3 py-1 rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t}
              </button>
            ))}
          </div>

          {/* Options row */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div>
              <label className="text-[10px] font-bold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                NO. OF REELS
              </label>
              <div className="flex gap-1 flex-wrap">
                {COUNTS.map(c => (
                  <button key={c} onClick={() => setCount(c)}
                    className="text-xs px-2.5 py-1 rounded-lg font-bold transition-all"
                    style={count === c
                      ? { background: '#ec4899', color: 'white' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                AUDIENCE
              </label>
              <select value={audience} onChange={e => setAudience(e.target.value)}
                className="w-full text-xs rounded-lg px-2 py-1.5 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold mb-1.5 block" style={{ color: 'rgba(255,255,255,0.4)' }}>
                STYLE
              </label>
              <select value={style} onChange={e => setStyle(e.target.value)}
                className="w-full text-xs rounded-lg px-2 py-1.5 outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {STYLES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Generate button */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={generate}
            disabled={!topic.trim() || loading}
            className="w-full py-4 rounded-2xl font-black text-base transition-all disabled:opacity-40"
            style={{
              background: topic.trim() && !loading ? 'linear-gradient(135deg, #ec4899, #f97316)' : 'rgba(255,255,255,0.06)',
              color: topic.trim() && !loading ? 'white' : 'rgba(255,255,255,0.3)',
              boxShadow: topic.trim() && !loading ? '0 8px 25px rgba(236,72,153,0.3)' : 'none',
            }}
          >
            {loading ? `⏳ Generating ${count} scripts...` : `🎬 Generate ${count} Reel Scripts`}
          </motion.button>

          {error && (
            <div className="mt-3 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
              ⚠️ {error}
            </div>
          )}
        </motion.div>

        {/* Loading */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-12">
              <motion.div className="text-5xl mb-4"
                animate={{ rotate: [0, 10, -10, 10, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}>
                🎬
              </motion.div>
              <p className="text-sm font-semibold" style={{ color: '#ec4899' }}>
                AI is writing your {count} Reel scripts...
              </p>
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>
                This takes 10-20 seconds
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        {generated && reels.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Results header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-black text-white">✅ {reels.length} Scripts Ready</h2>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Click any script to expand · Copy individually or download all
                </p>
              </div>
              <button onClick={downloadAll}
                className="text-xs px-4 py-2 rounded-xl font-bold transition-all"
                style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', border: '1px solid rgba(212,175,55,0.25)' }}>
                ⬇️ Download All
              </button>
            </div>

            {/* Reel cards */}
            <div className="space-y-3">
              {reels.map((reel, i) => (
                <ReelCard key={reel.id} reel={reel} index={i} />
              ))}
            </div>

            <div className="mt-6 text-center">
              <button onClick={() => { setReels([]); setGenerated(false); setTopic(''); }}
                className="text-xs py-2 px-4 rounded-full"
                style={{ color: 'rgba(255,255,255,0.25)', border: '1px solid rgba(255,255,255,0.07)' }}>
                Generate new scripts
              </button>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
