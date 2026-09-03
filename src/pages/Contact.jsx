import SEO from '../components/ui/SEO';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import LeadCaptureForm from '../components/leads/LeadCaptureForm';

const BASE = 'https://www.smitsircommerce.in';

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': `${BASE}/contact#webpage`,
      url: `${BASE}/contact`,
      name: 'Contact Smit Sir Commerce',
      description: 'Contact Smit Sir Commerce in Mehsana, Gujarat for Class 11 and 12 Commerce coaching, free paper analysis, demo classes and admission enquiries.',
      inLanguage: 'en-IN',
      about: { '@id': `${BASE}/#organization` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${BASE}/#organization`,
      name: 'Smit Sir Commerce',
      alternateName: 'Smit Sir Commerce Classes',
      url: `${BASE}/`,
      telephone: '+916353709585',
      email: 'infosmitsircommerce@gmail.com',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+916353709585',
        contactType: 'admissions and student enquiries',
        areaServed: 'IN-GJ',
      },
      areaServed: {
        '@type': 'City',
        name: 'Mehsana',
        containedInPlace: { '@type': 'State', name: 'Gujarat' },
      },
      knowsAbout: ['Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy', 'Entrepreneurship', 'Physical Education'],
    },
  ],
};

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Contact — Free Commerce Paper Analysis & Demo"
        description="Contact Smit Sir Commerce in Mehsana, Gujarat for Class 11 and 12 Commerce tuition, a free test-paper analysis, demo class or admission enquiry."
        path="/contact"
        structuredData={structuredData}
      />
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-5">Talk about what you <em>actually need help with.</em></h1>
          <p className="mx-auto">Ask about a free paper analysis, demo, batch admission, subjects or learning mode. Your enquiry goes directly into the admissions system.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-10 items-start">
          <div className="space-y-4 lg:sticky lg:top-28">
            <a href="tel:+916353709585" className="card-paper flex items-start gap-4 p-4 group"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}><Phone className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Call</div><div style={{ color: 'var(--gold)' }}>+91 63537 09585</div><div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>For demo, subject and batch enquiries</div></div></a>
            <a href="mailto:infosmitsircommerce@gmail.com" className="card-paper flex items-start gap-4 p-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}><Mail className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Email</div><div className="text-sm" style={{ color: 'var(--gold)' }}>infosmitsircommerce@gmail.com</div></div></a>
            <Link to="/commerce-coaching-mehsana" className="card-paper flex items-start gap-4 p-4 group"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}><MapPin className="w-5 h-5" style={{ color: 'var(--muted)' }} /></div><div className="flex-1"><div className="font-semibold" style={{ color: 'var(--ink)' }}>Service area</div><div className="text-sm" style={{ color: 'var(--muted)' }}>Mehsana, Gujarat, India</div><div className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>Commerce tuition in Mehsana <ArrowRight className="w-3 h-3" /></div></div></Link>
            <Link to="/book-demo" className="btn-outline-ink inline-flex items-center gap-2 text-sm">Free paper analysis / demo <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <section className="card-paper p-6 sm:p-8"><LeadCaptureForm intent="General Enquiry" heading="Send an admission enquiry" /></section>
        </div>
      </div>
    </div>
  );
}
