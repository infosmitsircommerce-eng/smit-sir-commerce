import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqs } from '../../data/faqs';

// Show only the 2 most conversion-relevant FAQs on the home page
const HOME_FAQ_IDS = [9, 3]; // "Is there a free demo class?" + "Can I join online batches?"
const homeFaqs = HOME_FAQ_IDS.map(id => faqs.find(f => f.id === id));

export default function FAQSection({ showAll = false }) {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });
  const items = showAll ? faqs : homeFaqs;

  return (
    <section ref={ref} className="section-padding" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-container max-w-3xl">
        {!showAll && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-10"
          >
            <span className="eyebrow">Got Questions?</span>
            <h2 className="headline mt-6">Frequently asked <em>questions.</em></h2>
          </motion.div>
        )}

        <div className="space-y-3">
          {items.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--bg-white)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 transition-colors"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-ivory)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
              >
                <span className="text-sm" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>{faq.question}</span>
                <motion.div
                  animate={{ rotate: open === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-4 text-sm leading-relaxed pt-3"
                      style={{ color: 'var(--muted)', borderTop: '1px solid var(--border-soft)' }}>
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* See all FAQs link — only on the homepage teaser */}
        {!showAll && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 font-medium text-sm transition-colors group"
              style={{ color: 'var(--gold)' }}
            >
              See all {faqs.length} frequently asked questions
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}

      </div>
    </section>
  );
}
