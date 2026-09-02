import SEO from '../components/ui/SEO';
import { Phone, Mail, MapPin, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
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
      description: 'Contact Smit Sir Commerce in Mehsana, Gujarat for Class 11 and 12 Commerce coaching, demo classes and admission enquiries.',
      inLanguage: 'en-IN',
      about: { '@id': `${BASE}/#organization` },
      isPartOf: { '@id': `${BASE}/#website` },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': `${BASE}/#organization`,
      name: 'Smit Sir Commerce',
      url: `${BASE}/`,
      telephone: '+916353709585',
      email: 'infosmitsircommerce@gmail.com',
      sameAs: ['https://www.instagram.com/smitthker/'],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+916353709585',
        contactType: 'admissions',
        areaServed: 'IN',
        availableLanguage: ['English', 'Hindi', 'Gujarati'],
      },
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Mehsana',
        addressRegion: 'Gujarat',
        addressCountry: 'IN',
      },
      areaServed: [
        { '@type': 'City', name: 'Mehsana' },
        { '@type': 'Country', name: 'India' },
      ],
    },
  ],
};

export default function Contact() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Contact — Book Free Demo Class"
        description="Contact Smit Sir Commerce in Mehsana, Gujarat and send a Class 11 or 12 Commerce admission enquiry."
        path="/contact"
        structuredData={structuredData}
      />
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Get in touch</span>
          <h1 className="mt-5">Talk about what you <em>actually need help with.</em></h1>
          <p className="mx-auto">Ask about a demo, batch admission, subjects or learning mode. Your enquiry goes directly into the admissions system.</p>
        </div>
      </div>

      <div className="page-container section-padding">
        <div className="grid lg:grid-cols-[.78fr_1.22fr] gap-10 items-start">
          <div className="space-y-4 lg:sticky lg:top-28">
            <a href="tel:+916353709585" className="card-paper flex items-start gap-4 p-4 group"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.18)' }}><Phone className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Call</div><div style={{ color: 'var(--gold)' }}>+91 63537 09585</div><div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>Mon–Sat, 9am–8pm</div></div></a>
            <a href="https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20know%20about%20Class%2011%2F12%20Commerce%20admission." target="_blank" rel="noopener noreferrer" className="card-paper flex items-start gap-4 p-4 group"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(77,124,15,0.07)', border: '1px solid rgba(77,124,15,0.2)' }}><MessageCircle className="w-5 h-5" style={{ color: 'var(--green)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>WhatsApp</div><div style={{ color: 'var(--green)' }}>Message Smit Sir Commerce</div><div className="text-xs mt-0.5" style={{ color: 'var(--subtle)' }}>Useful when you want to continue the conversation directly.</div></div></a>
            <a href="mailto:infosmitsircommerce@gmail.com" className="card-paper flex items-start gap-4 p-4"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}><Mail className="w-5 h-5" style={{ color: 'var(--gold)' }} /></div><div><div className="font-semibold" style={{ color: 'var(--ink)' }}>Email</div><div className="text-sm" style={{ color: 'var(--gold)' }}>infosmitsircommerce@gmail.com</div></div></a>
            <Link to="/commerce-coaching-mehsana" className="card-paper flex items-start gap-4 p-4 group"><div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--bg-ivory)', border: '1px solid var(--border)' }}><MapPin className="w-5 h-5" style={{ color: 'var(--muted)' }} /></div><div className="flex-1"><div className="font-semibold" style={{ color: 'var(--ink)' }}>Location</div><div className="text-sm" style={{ color: 'var(--muted)' }}>Mehsana, Gujarat, India</div><div className="text-xs mt-1 inline-flex items-center gap-1" style={{ color: 'var(--gold)' }}>Commerce coaching in Mehsana <ArrowRight className="w-3 h-3" /></div></div></Link>
            <a href="https://instagram.com/smitthker" target="_blank" rel="noopener noreferrer" className="btn-outline-ink inline-flex items-center gap-2 text-sm"><Instagram className="w-4 h-4" /> Instagram</a>
          </div>

          <section className="card-paper p-6 sm:p-8"><LeadCaptureForm intent="General Enquiry" heading="Send an admission enquiry" /></section>
        </div>
      </div>
    </div>
  );
}
