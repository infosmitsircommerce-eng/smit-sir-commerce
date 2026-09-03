import SEO from '../components/ui/SEO';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, CheckCircle2, BookOpenCheck } from 'lucide-react';
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
      description: 'Contact Smit Sir Commerce in Mehsana, Gujarat for Class 11 and 12 Commerce support, a free paper analysis, demo class or admission enquiry.',
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
      knowsAbout: ['Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Entrepreneurship', 'Physical Education', 'Accountancy learning resources'],
    },
  ],
};

const expectations = [
  'Ask about subjects, demo, paper analysis, batches or learning mode.',
  'A free paper analysis does not require admission or leaving your current tuition.',
  'No fake marks guarantee, forced enrolment or invented urgency.',
];

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Contact Smit Sir — Free Commerce Paper Analysis & Demo"
        description="Contact Smit Sir Commerce in Mehsana for Class 11 and 12 support, a free test-paper analysis, demo class or admission enquiry with clear, no-pressure guidance."
        path="/contact"
        structuredData={structuredData}
      />

      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Talk directly</span>
          <h1 className="mt-5">Start with your <em>actual learning problem.</em></h1>
          <p className="mx-auto max-w-3xl">
            You do not need a sales pitch first. Tell us the subject, chapter, test result or confusion you are facing. Start with a question, a free paper analysis or a demo.
          </p>
        </div>
      </div>

      <div className="page-container section-padding space-y-10">
        <section className="grid lg:grid-cols-[.82fr_1.18fr] gap-10 items-start">
          <div className="space-y-4 lg:sticky lg:top-28">
            <div className="card-paper p-5">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                <h2 className="text-lg" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Before you contact us</h2>
              </div>
              <div className="space-y-3">
                {expectations.map(item => (
                  <div key={item} className="flex items-start gap-2 text-sm leading-6" style={{ color: 'var(--muted)' }}>
                    <CheckCircle2 className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: 'var(--green)' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <a href="tel:+916353709585" className="card-paper flex items-start gap-4 p-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}><Phone className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div>
              <div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Call Smit Sir Commerce</div><div style={{ color: 'var(--gold)' }}>+91 63537 09585</div><div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>Demo, subject, batch and paper-analysis enquiries</div></div>
            </a>

            <a href="mailto:infosmitsircommerce@gmail.com" className="card-paper flex items-start gap-4 p-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}><Mail className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div>
              <div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Email</div><div className="text-sm break-all" style={{ color: 'var(--gold)' }}>infosmitsircommerce@gmail.com</div><div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>For written questions and support</div></div>
            </a>

            <Link to="/commerce-coaching-mehsana" className="card-paper flex items-start gap-4 p-4 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}><MapPin className="w-5 h-5" style={{ color: 'var(--muted)' }} /></div>
              <div className="flex-1"><div className="font-semibold" style={{ color: 'var(--ink)' }}>Service area</div><div className="text-sm" style={{ color: 'var(--muted)' }}>Mehsana, Gujarat, India</div><div className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>Commerce support in Mehsana <ArrowRight className="w-3 h-3" /></div></div>
            </Link>

            <Link to="/book-demo" className="btn-primary w-full justify-center inline-flex items-center gap-2 text-sm">Free paper analysis / demo <ArrowRight className="w-4 h-4" /></Link>
          </div>

          <section className="card-paper p-6 sm:p-8">
            <div className="mb-6 pb-5" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--gold)' }}><BookOpenCheck className="w-4 h-4" /> Learning-first enquiry</div>
              <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>
                Share enough context for us to understand the problem properly. You can mention class, subject, latest marks, weak chapter or the kind of support you need.
              </p>
            </div>
            <LeadCaptureForm intent="General Enquiry" heading="Send your enquiry" />
            <p className="text-xs leading-5 mt-5" style={{ color: 'var(--subtle)' }}>
              By submitting this form, you are only requesting contact/support. It does not create an admission or payment obligation. See our <Link to="/privacy" style={{ color: 'var(--gold)' }}>Privacy Policy</Link> and <Link to="/terms" style={{ color: 'var(--gold)' }}>Terms of Use</Link>.
            </p>
          </section>
        </section>

        <section className="rounded-2xl p-6 sm:p-8 text-center" style={{ background: '#fff', border: '1px solid var(--border)' }}>
          <span className="eyebrow">What Smit Sir personally teaches</span>
          <h2 className="text-2xl mt-5" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Economics · Business Studies · Entrepreneurship · Physical Education</h2>
          <p className="text-sm leading-6 max-w-2xl mx-auto mt-3" style={{ color: 'var(--muted)' }}>
            The website also contains Accountancy calculators and learning resources. Those are website resources and are kept separate from the personal teaching-subject list.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link to="/about" className="btn-outline-ink inline-flex items-center gap-2">Read the teaching philosophy</Link>
            <Link to="/faq" className="btn-outline-ink inline-flex items-center gap-2">Read FAQ</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
