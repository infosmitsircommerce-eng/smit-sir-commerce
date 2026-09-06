import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Download, FileText, Gamepad2, GraduationCap, MessageCircle, Search, Wrench } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const totalPdfs = seoMaterials.filter((item) => item.file_url).length + gsebMaterials.filter((item) => item.file_url).length;

const resourceTiles = [
  { label: 'Study Material', title: 'Find PDF notes', text: 'Board → Class → Subject → Chapter. Direct downloads, no hunting.', path: '/study-material', icon: Download, primary: true },
  { label: 'GSEB', title: 'Class 12 Economics', text: 'Gujarati board Economics chapters 2–11 in one clean folder.', path: '/study-material?board=GSEB', icon: FileText },
  { label: 'CBSE', title: 'CBSE Commerce Notes', text: 'Class 11 and 12 Commerce notes organised chapter-wise.', path: '/cbse-notes', icon: BookOpen },
  { label: 'Practice', title: 'Practice & Tests', text: 'Questions, daily practice, tests and revision tools.', path: '/daily-practice', icon: Brain },
];

const quickLinks = [
  { title: 'Games', text: 'Learn with interactive games.', path: '/games', icon: Gamepad2 },
  { title: 'Tools', text: 'Commerce calculators and helpers.', path: '/tools', icon: Wrench },
  { title: 'Ask Doubt', text: 'Ask a Commerce question.', path: '/ask', icon: MessageCircle },
  { title: 'Contact Smit Sir', text: 'Need personal help? Contact directly.', path: '/contact', icon: GraduationCap },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.smitsircommerce.in/#website',
      url: 'https://www.smitsircommerce.in/',
      name: 'Smit Sir Commerce',
      description: 'Free Commerce study material, PDF notes, practice resources and tools for CBSE, GSEB and Commerce learners.',
      inLanguage: 'en-IN',
      publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.smitsircommerce.in/#organization',
      name: 'Smit Sir Commerce',
      url: 'https://www.smitsircommerce.in/',
      areaServed: ['India', 'Mehsana, Gujarat'],
      description: 'Commerce learning resource library with chapter-wise notes, practice and teacher support when required.',
      knowsAbout: ['Commerce education', 'CBSE Commerce', 'GSEB Economics', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy'],
    },
  ],
};

function ResourceTile({ item }) {
  const Icon = item.icon;
  return (
    <Link to={item.path} className="ssc-quick-action-card ssc-hover-lift rounded-[1.6rem] p-5 sm:p-6 flex flex-col gap-5" aria-label={item.title}>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-black uppercase tracking-[0.16em] rounded-full px-3 py-1" style={{ color: item.primary ? '#fffdf6' : 'var(--gold)', background: item.primary ? 'linear-gradient(135deg, #172033, #253147)' : 'var(--brand-soft)' }}>{item.label}</span>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: item.primary ? 'linear-gradient(135deg, #D9AC5C, #B8872F)' : '#fff', color: item.primary ? '#1E1812' : 'var(--gold)', border: '1px solid rgba(184,135,47,.18)' }}>
          <Icon className="w-5 h-5" strokeWidth={2.4} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-black" style={{ color: 'var(--ink)' }}>{item.title}</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-black" style={{ color: item.primary ? 'var(--ink)' : 'var(--gold)' }}>Open now <ArrowRight className="w-4 h-4" /></span>
    </Link>
  );
}

function SmallLinkCard({ item }) {
  const Icon = item.icon;
  return (
    <Link to={item.path} className="ssc-glass-card ssc-hover-lift rounded-2xl p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}>
        <Icon className="w-5 h-5" strokeWidth={2.3} />
      </div>
      <div className="min-w-0">
        <h3 className="font-black text-sm" style={{ color: 'var(--ink)' }}>{item.title}</h3>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</p>
      </div>
    </Link>
  );
}

export default function Home() {
  const cbseFolders = seoHubs.map((hub) => ({ ...hub, count: seoMaterials.filter((m) => m.hubId === hub.id).length }));

  return (
    <main className="ssc-premium-canvas min-h-screen">
      <SEO
        title="Free Commerce Notes, PDFs, Practice & Tools | Smit Sir Commerce"
        description="A clean Commerce resource library for students: free CBSE and GSEB PDF notes, chapter-wise practice, games, tools and contact help when needed."
        path="/"
        structuredData={structuredData}
      />

      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="page-container">
          <div className="ssc-hero-panel p-5 sm:p-8 lg:p-10">
            <div className="ssc-hero-content grid lg:grid-cols-[1.08fr_.92fr] gap-8 items-center">
              <div>
                <span className="eyebrow">FREE COMMERCE RESOURCE LIBRARY</span>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ color: 'var(--ink)' }}>Study material first. <span className="ssc-gold-text">No confusion.</span></h1>
                <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>Find notes, PDFs, practice, games and tools quickly. Everything is organised for students who want to study, download and move on.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/study-material" className="btn-primary min-h-12 px-5"><Download className="w-4 h-4" /> Open study material</Link>
                  <Link to="/study-material?board=GSEB" className="btn-outline-ink min-h-12 px-5">GSEB PDFs</Link>
                  <Link to="/cbse-notes" className="btn-outline-ink min-h-12 px-5">CBSE notes</Link>
                </div>
              </div>

              <div className="ssc-glass-card rounded-[1.6rem] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D9AC5C, #B8872F)', color: '#1E1812' }}><Search className="w-5 h-5" strokeWidth={2.4} /></div>
                  <div><h2 className="text-lg font-black" style={{ color: 'var(--ink)' }}>Fast student path</h2><p className="text-xs" style={{ color: 'var(--muted)' }}>Open → choose → download → study</p></div>
                </div>
                <div className="space-y-3">
                  {['Choose board: CBSE or GSEB', 'Select class and subject', 'Search chapter name', 'Download PDF directly'].map((step, index) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}>
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}>{index + 1}</div>
                      <span className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="ssc-glass-card rounded-2xl p-4"><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>{totalPdfs}</div><p className="text-xs" style={{ color: 'var(--muted)' }}>PDF notes</p></div>
            <div className="ssc-glass-card rounded-2xl p-4"><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>{gsebMaterials.length}</div><p className="text-xs" style={{ color: 'var(--muted)' }}>GSEB chapters</p></div>
            <div className="ssc-glass-card rounded-2xl p-4"><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>{cbseFolders.length}</div><p className="text-xs" style={{ color: 'var(--muted)' }}>CBSE folders</p></div>
            <div className="ssc-glass-card rounded-2xl p-4"><div className="text-2xl font-black" style={{ color: 'var(--ink)' }}>Free</div><p className="text-xs" style={{ color: 'var(--muted)' }}>Student access</p></div>
          </div>
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="mb-5"><span className="eyebrow">START HERE</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>What do you need today?</h2></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{resourceTiles.map((item) => <ResourceTile key={item.title} item={item} />)}</div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="mb-5"><span className="eyebrow">DIRECT FOLDERS</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Organised notes collection</h2></div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cbseFolders.map((hub) => (
            <Link key={hub.id} to={hub.path} className="ssc-material-card rounded-2xl p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>CBSE • Class {hub.classLevel}</div>
              <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>{hub.label}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{hub.count} chapter PDFs</p>
              <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
          <Link to="/study-material?board=GSEB" className="ssc-material-card rounded-2xl p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>GSEB • Class 12</div>
            <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>Economics</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Chapters 2–11 with direct PDFs</p>
            <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-16">
        <div className="grid lg:grid-cols-[.95fr_1.05fr] gap-4 items-stretch">
          <div className="ssc-hero-panel p-5 sm:p-7"><div className="ssc-hero-content">
            <span className="eyebrow">MORE TOOLS</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Study support without pressure</h2>
            <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Use free resources first. If a chapter still feels unclear, contact Smit Sir from the contact page — no popups, no forced demo.</p>
            <div className="mt-5 flex flex-wrap gap-3"><Link to="/contact" className="btn-outline-ink min-h-12 px-5">Contact Smit Sir</Link><Link to="/ask" className="btn-outline-ink min-h-12 px-5">Ask a doubt</Link></div>
          </div></div>
          <div className="grid sm:grid-cols-2 gap-3">{quickLinks.map((item) => <SmallLinkCard key={item.title} item={item} />)}</div>
        </div>
      </section>

      <section className="page-container pb-16 sm:pb-20">
        <div className="ssc-glass-card rounded-[1.6rem] p-5 sm:p-6 flex flex-col md:flex-row md:items-center gap-4">
          <CheckCircle2 className="w-7 h-7 shrink-0" style={{ color: 'var(--gold)' }} />
          <div className="flex-1"><h2 className="text-xl font-black" style={{ color: 'var(--ink)' }}>Simple promise</h2><p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>The website is arranged around free learning resources first. Coaching or contact help stays secondary and optional.</p></div>
          <Link to="/study-material" className="btn-primary min-h-12 px-5">Start studying</Link>
        </div>
      </section>
    </main>
  );
}
