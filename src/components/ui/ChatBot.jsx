import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_ACTIONS = [
  { label: '📚 Class Schedule', msg: 'What is the class schedule?' },
  { label: '🤔 Ask a Doubt', msg: null, isDoubt: true },
  { label: '📞 Contact & Fees', msg: 'What are the fees and contact details?' },
  { label: '⭐ Results', msg: 'What are your results and achievements?' },
  { label: '📖 Courses', msg: 'What courses do you offer?' },
];

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2 mb-3">
      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xs font-bold text-navy-950 shrink-0">S</div>
      <div className="bg-navy-800/80 border border-navy-700/50 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-4">
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-yellow-400"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Message({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex items-end gap-2 mb-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      {isBot && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-xs font-bold text-navy-950 shrink-0">S</div>
      )}
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isBot
          ? 'bg-navy-800/80 border border-navy-700/50 text-navy-100 rounded-bl-sm'
          : 'bg-gradient-to-br from-yellow-400 to-amber-500 text-navy-950 font-medium rounded-br-sm'
      }`}>
        {msg.content}
      </div>
    </motion.div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '🎓 Hey! I\'m *Smit Sir AI*\n\nAsk me anything about Commerce — Accountancy, Economics, Business Studies, or about our institute! 👇'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [hasNotification, setHasNotification] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasNotification(false);
    }
  }, [isOpen, messages]);

  // Show notification bubble after 3 seconds if not opened
  useEffect(() => {
    const timer = setTimeout(() => setHasNotification(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  async function sendMessage(text) {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setShowQuickActions(false);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: newMessages.slice(-8)
        })
      });

      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Connection error. Please try again!'
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleQuickAction(action) {
    if (action.isDoubt) {
      setShowQuickActions(false);
      inputRef.current?.focus();
      setInput('');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '📝 Sure! Type your doubt below — Accountancy, Economics or Business Studies, I\'ll solve it! 🤖'
      }]);
    } else {
      sendMessage(action.msg);
    }
  }

  return (
    <>
      {/* ── CHAT WINDOW ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[340px] sm:w-[380px] flex flex-col"
            style={{ height: '520px' }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-yellow-400/10 blur-xl -z-10" />

            <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-navy-700/60 shadow-2xl shadow-black/50"
              style={{ background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 100%)' }}>

              {/* Header */}
              <div className="relative px-4 py-3 flex items-center gap-3"
                style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                <div className="w-9 h-9 rounded-full bg-navy-950/30 backdrop-blur flex items-center justify-center text-lg font-bold text-white">🎓</div>
                <div className="flex-1">
                  <div className="font-bold text-navy-950 text-sm">Smit Sir AI</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-navy-900/70 text-xs">Online • Commerce Expert</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-full bg-navy-950/20 hover:bg-navy-950/40 flex items-center justify-center text-navy-900 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
                {messages.map((msg, i) => (
                  <Message key={i} msg={msg} />
                ))}

                {/* Quick actions */}
                {showQuickActions && !loading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap gap-2 mt-2 ml-9"
                  >
                    {QUICK_ACTIONS.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action)}
                        className="text-xs px-3 py-1.5 rounded-full border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                      >
                        {action.label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {loading && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-navy-700/50">
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask your doubt..."
                    disabled={loading}
                    className="flex-1 bg-navy-800/60 border border-navy-700/50 rounded-xl px-3 py-2 text-sm text-white placeholder-navy-500 focus:outline-none focus:border-yellow-400/50 transition-colors disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || loading}
                    className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center text-navy-950 disabled:opacity-40 transition-opacity shrink-0 hover:shadow-lg hover:shadow-yellow-400/20"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
                <p className="text-center text-navy-600 text-[10px] mt-1.5">Powered by Smit Sir Commerce AI 🤖</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FLOATING BUTTON ── */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50">
        {/* Notification bubble */}
        <AnimatePresence>
          {hasNotification && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute -top-12 right-0 bg-navy-800 border border-navy-700 text-white text-xs px-3 py-2 rounded-xl rounded-br-none whitespace-nowrap shadow-lg"
            >
              💬 Ask your doubt!
              <div className="absolute -bottom-1.5 right-3 w-3 h-3 bg-navy-800 border-r border-b border-navy-700 rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Button */}
        <motion.button
          onClick={() => setIsOpen(prev => !prev)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-14 h-14 rounded-full shadow-xl shadow-yellow-400/30 flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}
        >
          {/* Pulse ring */}
          <div className="absolute inset-0 rounded-full animate-ping bg-yellow-400 opacity-20" />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                <svg className="w-6 h-6 text-navy-950" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.div>
            ) : (
              <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="text-2xl">
                🎓
              </motion.div>
            )}
          </AnimatePresence>

          {/* Unread dot */}
          {hasNotification && !isOpen && (
            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 border-2 border-navy-950 flex items-center justify-center">
              <span className="text-[8px] text-white font-bold">1</span>
            </div>
          )}
        </motion.button>
      </div>
    </>
  );
}
