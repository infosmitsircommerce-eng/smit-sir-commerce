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

export default function FAQSection() {
  const [open, setOpen] = useState(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding section-soft">
      <div className="page-container max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-10"
        >
          <div className="section-subheading">Got Questions?</div>
          <h2 className="section-heading">Frequently Asked <span className="gradient-text">Questions</span></h2>
        </motion.div>

        <div className="space-y-3">
          {homeFaqs.map((faq, i) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.06 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm"
            >
              <button
                className="w-full text-left px-5 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpen(open === faq.id ? null : faq.id)}
              >
                <span className="font-medium text-gray-900 text-sm">{faq.question}</span>
                <motion.div
                  animate={{ rotate: open === faq.id ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-gold-400" />
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
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* See all FAQs link */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium text-sm transition-colors group"
          >
            See all {faqs.length} frequently asked questions
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}
