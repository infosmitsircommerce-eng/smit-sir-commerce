import FAQSection from '../components/home/FAQSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FAQ() {
  return (
    <div className="min-h-screen bg-navy-950">
      <div className="hero-bg py-16 border-b border-navy-800/50">
        <div className="page-container text-center">
          <div className="section-subheading">Got Questions?</div>
          <h1 className="section-heading text-4xl md:text-5xl">
            Frequently Asked <span className="gradient-text">Questions</span>
          </h1>
          <p className="text-navy-400 max-w-xl mx-auto">
            Everything you need to know about Smit Sir Commerce courses and batches.
          </p>
        </div>
      </div>

      <FAQSection />

      <div className="page-container pb-16 text-center">
        <div className="glass-card p-8 max-w-2xl mx-auto">
          <h3 className="font-display font-bold text-xl text-white mb-2">Still Have a Question?</h3>
          <p className="text-navy-400 mb-6">Contact us directly — we'll get back to you within a few hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary flex items-center gap-2">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20have%20a%20question%20about%20the%20courses." className="btn-navy flex items-center gap-2">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
