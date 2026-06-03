import SEO from '../components/ui/SEO';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SUGGESTED = [
  { icon: '📊', text: 'What is the difference between GDP and GNP?' },
  { icon: '📒', text: 'Explain Sacrificing Ratio with example' },
  { icon: '📈', text: 'What is Repo Rate and how does it control inflation?' },
  { icon: '💼', text: "Explain Fayol's 14 principles of management" },
  { icon: '📒', text: 'Difference between SLM and WDV depreciation method' },
  { icon: '📈', text: 'What is Price Elasticity of Demand?' },
];

const SUBJECTS = [
  { label: 'All', icon: '🎓' },
  { label: 'Accountancy', icon: '📒' },
  { label: 'Economics', icon: '📈' },
  { label: 'Business Studies', icon: '💼' },
];

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-end gap-2.5"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
        style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)', color: '#0a0f2c' }}>
        S
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-sm"
        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{ background: '#D4AF37' }}
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ChatMessage({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      className={`flex items-end gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {/* Avatar */}
      {isBot ? (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 mb-0.5"
          style={{ background: 'linear-gradient(135deg, #D4AF37, #F0C040)', color: '#0a0f2c' }}>
          S
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 mb-0.5"
          style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
          🙋
        </div>
      )}

      {/* Bubble */}
      <div className={`max-w-[78%] px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
        isBot ? 'rounded-2xl rounded-bl-sm' : 'rounded-2xl rounded-br-sm'
      }`}
        style={isBot ? {
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          color: 'rgba(255,255,255,0.9)',
        } : {
          background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
          color: '#0a0f2c',
          fontWeight: 500,
        }}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function AskDoubt() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "🎓 Hey! I'm Smit Sir AI!\n\nAsk me anything about Accountancy, Economics, or Business Studies. I'll give you clear explanations with board exam tips! 💪\n\nType your doubt below or pick a topic 👇"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('All');
  const [showSuggested, setShowSuggested] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function sendMessage(text) {
    const trimmed = text?.trim() || input.trim();
    if (!trimmed || loading) return;

    const questionWithSubject = subject !== 'All' ? `[${subject}] ${trimmed}` : trimmed;
    const userMsg = { role: 'user', content: trimmed };
    const newMessages = [...messages, userMsg];

    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setShowSuggested(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: questionWithSubject,
          history: newMessages.slice(-8)
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || 'Sorry, please try again!'
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error. Please check your internet and try again!'
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function clearChat() {
    setMessages([{
      role: 'assistant',
      content: "🎓 Chat cleared! Ask me a new doubt anytime 😊"
    }]);
    setShowSuggested(true);
    inputRef.current?.focus();
  }

  return (
    <div className="min-h-screen flex flex-col py-6 px-4"
      style={{ background: 'radial-gradient(ellipse at 30% 10%, rgba(212,175,55,0.12) 0%, transparent 60%), linear-gradient(160deg, #0a0f1e 0%, #0f1628 100%)' }}>
      <SEO
        title="AI Doubt Solver — Ask Commerce Questions Free"
        description="Get instant AI answers for CBSE Class 11 & 12 Commerce doubts. Economics, Accountancy, Business Studies — free AI doubt solver by Smit Sir Commerce."
        path="/ask"
      />
      <div className="max-w-2xl mx-auto w-full flex flex-col flex-1">

        {/* ── HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <motion.div
            animate={{ boxShadow: ['0 0 15px rgba(212,175,55,0.2)', '0 0 30px rgba(212,175,55,0.4)', '0 0 15px rgba(212,175,55,0.2)'] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
          >
            🤖 AI Doubt Solver · Powered by Groq
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2">
            Ask Your <span style={{ color: '#D4AF37' }}>Commerce Doubt</span>
          </h1>
          <p className="text-sm" style={{ color: '#94a3b8' }}>
            Instant AI answers · Board exam focused · 100% free
          </p>
        </motion.div>

        {/* ── SUBJECT SELECTOR ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4 flex-wrap justify-center"
        >
          {SUBJECTS.map(s => (
            <button
              key={s.label}
              onClick={() => setSubject(s.label)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold transition-all"
              style={subject === s.label ? {
                background: 'linear-gradient(135deg, #D4AF37, #F0C040)',
                color: '#0a0f2c',
              } : {
                background: 'rgba(255,255,255,0.07)',
                color: 'rgba(255,255,255,0.6)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </motion.div>

        {/* ── CHAT AREA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex-1 rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.1)',
            minHeight: '420px',
            maxHeight: '520px',
          }}
        >
          {/* Messages */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(212,175,55,0.2) transparent' }}
          >
            <AnimatePresence>
              {messages.map((msg, i) => (
                <ChatMessage key={i} msg={msg} />
              ))}
            </AnimatePresence>

            {/* Suggested questions */}
            <AnimatePresence>
              {showSuggested && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="ml-10"
                >
                  <p className="text-xs mb-2" style={{ color: '#94a3b8' }}>
                    Try these popular questions:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((s, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => sendMessage(s.text)}
                        className="text-xs px-3 py-2 rounded-xl text-left transition-all flex items-center gap-1.5"
                        style={{
                          background: 'rgba(212,175,55,0.08)',
                          border: '1px solid rgba(212,175,55,0.25)',
                          color: 'rgba(255,255,255,0.8)',
                        }}
                      >
                        <span>{s.icon}</span> {s.text}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {loading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* ── INPUT BAR ── */}
          <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className="flex gap-2 items-end">
              <textarea
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask your ${subject !== 'All' ? subject : 'Commerce'} doubt... (Enter to send)`}
                rows={1}
                maxLength={500}
                disabled={loading}
                className="flex-1 resize-none outline-none text-sm leading-relaxed rounded-2xl px-4 py-2.5 transition-all"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(255,255,255,0.9)',
                  caretColor: '#D4AF37',
                  maxHeight: '100px',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(212,175,55,0.4)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                onInput={e => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
                }}
              />
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 transition-all disabled:opacity-30"
                style={{
                  background: input.trim() && !loading
                    ? 'linear-gradient(135deg, #D4AF37, #F0C040)'
                    : 'rgba(255,255,255,0.06)',
                  boxShadow: input.trim() && !loading ? '0 4px 20px rgba(212,175,55,0.3)' : 'none',
                }}
              >
                <svg className="w-4 h-4" style={{ color: input.trim() && !loading ? '#0a0f2c' : 'rgba(255,255,255,0.3)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex items-center justify-between mt-3 px-1">
          <p className="text-xs" style={{ color: '#94a3b8' }}>
            ⚡ Powered by Groq AI · Always verify with textbook
          </p>
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              className="text-xs px-3 py-1 rounded-full transition-all"
              style={{ color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              🗑 Clear chat
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
