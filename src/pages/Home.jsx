import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Download, FileText, Gamepad2, GraduationCap, MessageCircle, Search, Wrench } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const totalPdfs = seoMaterials.filter((item) => item.file_url).length + gsebMaterials.filter((item) => item.file_url).length;

const gatewayTiles = [
  { label: 'All Material', title: 'Study Material Finder', text: 'Board → class → subject → chapter. सबसे सीधा रास्ता.', path: '/study-material', icon: Download, primary: true },
  { label: 'CBSE', title: 'Class 11 & 12 Commerce', text: 'Economics, Business Studies and chapter-wise Commerce notes.', path: '/cbse-notes', icon: BookOpen },
  { label: 'GSEB', title: 'Class 12 Economics', text: 'Gujarat Board Economics chapters 2–11 with PDF notes.', path: '/study-material?board=GSEB', icon: FileText },
  { label: 'Practice', title: 'Questions, Games & Tools', text: 'Read notes, then practise with tests, games and calculators.', path: '/daily-practice', icon: Brain },
];

const quickLinks = [
  { title: 'Learning Games', text: 'Revision ko thoda interesting banao.', path: '/games', icon: Gamepad2 },
  { title: 'Commerce Tools', text: 'Economics and Accountancy calculators.', path: '/tools', icon: Wrench },
  { title: 'Ask Doubt', text: 'Confusing concept? Ask here.', path: '/ask', icon: MessageCircle },
  { title: 'Contact Smit Sir', text: 'Help chahiye to contact karo.', path: '/contact', icon: GraduationCap },
];

const searchPages = [
  { title: 'Free Commerce Notes PDF', text: 'Commerce notes aur PDFs ke liye main search page.', href: '/free-commerce-notes.html' },
  { title: 'CBSE Commerce Notes PDF', text: 'CBSE Class 11 and 12 Commerce notes landing page.', href: '/cbse-commerce-notes.html' },
  { title: 'GSEB Class 12 Economics Notes PDF', text: 'GSEB Economics chapter-wise notes and PDF gateway.', href: '/gseb-class-12-economics-notes-pdf.html' },
  { title: 'Free Commerce Tools', text: 'Formula, ratio and Economics numerical calculators.', href: '/free-commerce-tools.html' },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.smitsircommerce.in/#website',
      url: 'https://www.smitsircommerce.in/',
      name: 'Smit Sir Commerce',
      description: 'A free Commerce material gateway with notes, PDFs, practice, games and tools for CBSE, GSEB and Commerce learners.',
      inLanguage: 'en-IN',
      publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.smitsircommerce.in/#organization',
      name: 'Smit Sir Commerce',
      url: 'https://www.smitsircommerce.in/',
      areaServed: ['India', 'Mehsana, Gujarat'],
      description: 'Commerce study material library with chapter-wise notes, PDF resources, practice, games and teacher support when needed.',
      knowsAbout: ['Commerce education', 'CBSE Commerce', 'GSEB Economics', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy'],
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://www.smitsircommerce.in/#commerce-material-gateway',
      name: 'Commerce Material Gateway',
      url: 'https://www.smitsircommerce.in/',
      isAccessibleForFree: true,
      about: ['Commerce notes', 'Commerce PDFs', 'CBSE Commerce', 'GSEB Economics', 'Commerce practice', 'Commerce tools'],
    },
  ],
};

function GatewayTile({ item }) {
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
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-black" style={{ color: item.primary ? 'var(--ink)' : 'var(--gold)' }}>Open <ArrowRight className="w-4 h-4" /></span>
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

function SearchPageCard({ item }) {
  return (
    <a href={item.href} className="ssc-material-card ssc-hover-lift rounded-2xl p-5 block">
      <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>SEARCH PAGE</div>
      <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>{item.title}</h3>
      <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</p>
      <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open page <ArrowRight className="w-4 h-4" /></span>
    </a>
  );
}

export default function Home() {
  const cbseFolders = seoHubs.map((hub) => ({ ...hub, count: seoMaterials.filter((m) => m.hubId === hub.id).length }));

  return (
    <main className="ssc-premium-canvas min-h-screen">
      <SEO
        title="Commerce Material Gateway | Free Notes, PDFs, Practice & Tools"
        description="Smit Sir Commerce is a free Commerce material gateway where students can find CBSE and GSEB notes, PDFs, practice, games and Commerce tools in one place."
        path="/"
        structuredData={structuredData}
      />

      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="page-container">
          <div className="ssc-hero-panel p-5 sm:p-8 lg:p-10">
            <div className="ssc-hero-content grid lg:grid-cols-[1.05fr_.95fr] gap-8 items-center">
              <div>
                <span className="eyebrow">COMMERCE MATERIAL GATEWAY</span>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ color: 'var(--ink)' }}>
                  Yahan Commerce ka <span className="ssc-gold-text">sara material</span> milega.
                </h1>
                <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Notes, PDFs, practice questions, games and Commerce tools — sab ek clean place par. Pehle choose karo kya chahiye, phir directly study start karo.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href="#choose-material" className="btn-primary min-h-12 px-5"><Search className="w-4 h-4" /> Choose material</a>
                  <Link to="/study-material" className="btn-outline-ink min-h-12 px-5">Open full library</Link>
                  <Link to="/free-commerce-notes.html" className="btn-outline-ink min-h-12 px-5">Free notes PDF</Link>
                </div>
              </div>

              <div className="ssc-glass-card rounded-[1.6rem] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #D9AC5C, #B8872F)', color: '#1E1812' }}><BookOpen className="w-5 h-5" strokeWidth={2.4} /></div>
                  <div>
                    <h2 className="text-lg font-black" style={{ color: 'var(--ink)' }}>What is inside?</h2>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Simple entry, no forced demo</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {['CBSE Class 11 & 12 Commerce notes', 'GSEB Class 12 Economics PDFs', 'Chapter-wise practice and revision', 'Games, tools and doubt support'].map((step) => (
                    <div key={step} className="flex items-center gap-3 rounded-2xl p-3" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}>
                      <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: 'var(--gold)' }} strokeWidth={2.4} />
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

      <section id="choose-material" className="page-container pb-10 sm:pb-14 scroll-mt-24">
        <div className="mb-5">
          <span className="eyebrow">CHOOSE YOUR MATERIAL</span>
          <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Aapko kya chahiye?</h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Homepage ab ek gateway hai: pehle student apna resource choose karega, phir andar notes/PDF/practice open hoga.</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{gatewayTiles.map((item) => <GatewayTile key={item.title} item={item} />)}</div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="ssc-hero-panel p-5 sm:p-7">
          <div className="ssc-hero-content grid lg:grid-cols-[.9fr_1.1fr] gap-6 items-center">
            <div>
              <span className="eyebrow">FAST PATH</span>
              <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Open, choose, study.</h2>
              <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Student ko homepage par answer milna chahiye: yahan Commerce material milega, aur use dhundhna easy hai.</p>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              {['1. Board choose karo', '2. Subject open karo', '3. PDF/practice start karo'].map((item) => (
                <div key={item} className="ssc-glass-card rounded-2xl p-4">
                  <div className="text-sm font-black" style={{ color: 'var(--ink)' }}>{item}</div>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>No confusion, no extra selling, direct study flow.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="mb-5"><span className="eyebrow">DIRECT FOLDERS</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Organised Commerce collection</h2></div>
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

      <section className="page-container pb-10 sm:pb-14">
        <div className="mb-5"><span className="eyebrow">OTHER HELP</span><h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Resources beyond notes</h2></div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">{quickLinks.map((item) => <SmallLinkCard key={item.title} item={item} />)}</div>
      </section>

      <section className="page-container pb-10 sm:pb-16">
        <div className="grid lg:grid-cols-[.95fr_1.05fr] gap-4 items-stretch">
          <div className="ssc-hero-panel p-5 sm:p-7"><div className="ssc-hero-content">
            <span className="eyebrow">SEARCH PAGES</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Google-friendly study pages</h2>
            <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>These pages help students and Google understand the main purpose of the website: free Commerce notes, PDFs, tools and practice.</p>
          </div></div>
          <div className="grid sm:grid-cols-2 gap-4">{searchPages.map((item) => <SearchPageCard key={item.title} item={item} />)}</div>
        </div>
      </section>
    </main>
  );
}
