import FAQSection from '../components/home/FAQSection';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function FAQ() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Got Questions?</span>
          <h1 className="mt-5">Frequently asked <em>questions.</em></h1>
          <p className="mx-auto">
            Everything you need to know about Smit Sir Commerce courses and batches.
          </p>
        </div>
      </div>

      <FAQSection showAll />

      <div className="page-container pb-16 text-center">
        <div className="card-paper p-8 max-w-2xl mx-auto">
          <h3 className="text-xl mb-2" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Still have a question?</h3>
          <p className="mb-6" style={{ color: 'var(--muted)' }}>Contact us directly — we'll get back to you within a few hours.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary flex items-center gap-2">
              Contact Us <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20have%20a%20question%20about%20the%20courses." className="btn-outline-ink flex items-center gap-2">
              WhatsApp Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
