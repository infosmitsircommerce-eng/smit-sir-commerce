import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, CheckCircle2, Download, FileText, Gamepad2, GraduationCap, MessageCircle, Search, Wrench } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { seoHubs, seoMaterials } from '../data/seoMaterials';
import { gsebMaterials } from '../data/gsebMaterials';

const totalPdfs = seoMaterials.filter((item) => item.file_url).length + gsebMaterials.filter((item) => item.file_url).length;

const gatewayTiles = [
  { label: 'Main Library', title: 'Study Material Finder', text: 'Board → class → subject → chapter. Notes and PDFs ek jagah.', path: '/study-material', icon: Download, primary: true },
  { label: 'CBSE', title: 'Class 11 & 12 Commerce', text: 'Economics, Business Studies and chapter-wise Commerce notes.', path: '/cbse-notes', icon: BookOpen },
  { label: 'GSEB', title: 'Class 12 Economics', text: 'Gujarat Board Economics chapters 2–11 with PDF notes.', path: '/study-material?board=GSEB', icon: FileText },
  { label: 'Revision', title: 'Practice, Games & Tools', text: 'Notes ke baad practice, games and calculators for revision.', path: '/daily-practice', icon: Brain },
];

const quickLinks = [
  { title: 'Learning Games', text: 'Revision ko thoda interesting banao.', path: '/games', icon: Gamepad2 },
  { title: 'Commerce Tools', text: 'Economics and Accountancy calculators.', path: '/tools', icon: Wrench },
  { title: 'Ask Doubt', text: 'Confusing concept? Ask here.', path: '/ask', icon: MessageCircle },
  { title: 'Contact Smit Sir', text: 'Help chahiye to contact karo.', path: '/contact', icon: GraduationCap },
];

const popularStudyPages = [
  { title: 'Free Commerce Notes PDF', text: 'Commerce students ke liye notes and PDFs ka clean collection.', href: '/free-commerce-notes.html' },
  { title: 'CBSE Commerce Notes', text: 'Class 11 and 12 CBSE Commerce material chapter-wise.', href: '/cbse-commerce-notes.html' },
  { title: 'GSEB Class 12 Economics', text: 'Gujarati Board Economics notes, PDFs and revision gateway.', href: '/gseb-class-12-economics-notes-pdf.html' },
  { title: 'Free Commerce Tools', text: 'Formula calculators and helpers for numericals.', href: '/free-commerce-tools.html' },
];

const promisePoints = [
  'Free notes and PDFs first',
  'No forced demo flow',
  'Board-wise and chapter-wise access',
  'Help only when student needs it',
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://www.smitsircommerce.in/#website',
      url: 'https://www.smitsircommerce.in/',
      name: 'Smit Sir Commerce',
      description: 'A free Commerce material gateway with notes, PDF resources, practice, games and tools for CBSE, GSEB and Commerce students.',
      inLanguage: 'en-IN',
      publisher: { '@id': 'https://www.smitsircommerce.in/#organization' },
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://www.smitsircommerce.in/#organization',
      name: 'Smit Sir Commerce',
      url: 'https://www.smitsircommerce.in/',
      areaServed: ['India', 'Mehsana, Gujarat'],
      description: 'Commerce learning resource library with chapter-wise notes, PDF material, practice and teacher support when required.',
      knowsAbout: ['Commerce education', 'CBSE Commerce', 'GSEB Economics', 'Class 11 Commerce', 'Class 12 Commerce', 'Economics', 'Business Studies', 'Accountancy'],
    },
  ],
};

function GatewayTile({ item }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.path}
      className="ssc-quick-action-card ssc-hover-lift rounded-[1.7rem] p-5 sm:p-6 flex flex-col gap-5 min-h-[210px]"
      aria-label={item.title}
    >
      <div className="flex items-center justify-between gap-3">
        <span
          className="text-[11px] font-black uppercase tracking-[0.16em] rounded-full px-3 py-1"
          style={{ color: item.primary ? '#fffdf6' : 'var(--gold)', background: item.primary ? 'linear-gradient(135deg, #17130f, #2a2118)' : 'var(--brand-soft)' }}
        >
          {item.label}
        </span>
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: item.primary ? 'linear-gradient(135deg, #F2CD84, #B8872F)' : '#fff', color: item.primary ? '#17130f' : 'var(--gold)', border: '1px solid rgba(184,135,47,.18)' }}
        >
          <Icon className="w-5 h-5" strokeWidth={2.4} />
        </div>
      </div>
      <div>
        <h2 className="text-xl font-black" style={{ color: 'var(--ink)' }}>{item.title}</h2>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</p>
      </div>
      <span className="mt-auto inline-flex items-center gap-2 text-sm font-black" style={{ color: item.primary ? 'var(--ink)' : 'var(--gold)' }}>
        Open <ArrowRight className="w-4 h-4" />
      </span>
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

function StudyPageCard({ item }) {
  return (
    <a href={item.href} className="ssc-material-card ssc-hover-lift rounded-2xl p-5 block">
      <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>Student shortcut</div>
      <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>{item.title}</h3>
      <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>{item.text}</p>
      <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>
        Open page <ArrowRight className="w-4 h-4" />
      </span>
    </a>
  );
}

export default function Home() {
  const cbseFolders = seoHubs.map((hub) => ({ ...hub, count: seoMaterials.filter((m) => m.hubId === hub.id).length }));

  return (
    <main className="ssc-premium-canvas min-h-screen">
      <SEO
        title="Commerce Material Gateway | Free Notes, PDFs, Practice & Tools"
        description="Smit Sir Commerce is a free Commerce material gateway where students can find CBSE and GSEB notes, PDF material, practice, games and tools in one clean place."
        path="/"
        structuredData={structuredData}
      />

      <section className="pt-8 sm:pt-12 pb-8 sm:pb-12">
        <div className="page-container">
          <div className="ssc-hero-panel overflow-hidden p-5 sm:p-8 lg:p-10">
            <div className="ssc-hero-content grid lg:grid-cols-[1.02fr_.98fr] gap-8 lg:gap-10 items-center">
              <div>
                <span className="eyebrow">SMIT SIR COMMERCE</span>
                <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl leading-tight" style={{ color: 'var(--ink)' }}>
                  Yahan Commerce ka <span className="ssc-gold-text">sara material</span> milega.
                </h1>
                <p className="mt-4 text-base sm:text-lg max-w-2xl" style={{ color: 'var(--muted)' }}>
                  Notes, PDFs, practice, games and Commerce tools — sab kuch clean way me organised, so student ko bas material open karna hai aur study start karni hai.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/study-material" className="btn-primary min-h-12 px-5">
                    <Download className="w-4 h-4" /> Explore material
                  </Link>
                  <Link to="/cbse-notes" className="btn-outline-ink min-h-12 px-5">CBSE notes</Link>
                  <Link to="/study-material?board=GSEB" className="btn-outline-ink min-h-12 px-5">GSEB PDFs</Link>
                </div>

                <div className="mt-7 grid sm:grid-cols-2 gap-3 max-w-2xl">
                  {promisePoints.map((point) => (
                    <div key={point} className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--muted)' }}>
                      <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} />
                      {point}
                    </div>
                  ))}
                </div>
              </div>

              <div className="ssc-glass-card rounded-[1.8rem] p-5 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #F2CD84, #B8872F)', color: '#17130f' }}>
                    <Search className="w-5 h-5" strokeWidth={2.4} />
                  </div>
                  <div>
                    <h2 className="text-lg font-black" style={{ color: 'var(--ink)' }}>Material gateway</h2>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Choose your study route</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  {gatewayTiles.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.title} to={item.path} className="group flex items-center gap-3 rounded-2xl p-3 transition-transform hover:-translate-y-0.5" style={{ background: '#fff', border: '1px solid var(--border-soft)' }}>
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'var(--brand-soft)', color: 'var(--gold)' }}>
                          <Icon className="w-5 h-5" strokeWidth={2.3} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black uppercase tracking-[0.14em]" style={{ color: 'var(--gold)' }}>{item.label}</p>
                          <h3 className="text-sm font-black" style={{ color: 'var(--ink)' }}>{item.title}</h3>
                        </div>
                        <ArrowRight className="w-4 h-4 ml-auto shrink-0 opacity-60 group-hover:opacity-100" style={{ color: 'var(--gold)' }} />
                      </Link>
                    );
                  })}
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
        <div className="mb-5">
          <span className="eyebrow">CHOOSE MATERIAL</span>
          <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Start from the right section</h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Homepage is only the entrance. Actual notes, PDFs, practice and tools are arranged inside these sections.</p>
        </div>
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
          {gatewayTiles.map((item) => <GatewayTile key={item.title} item={item} />)}
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="mb-5">
          <span className="eyebrow">DIRECT FOLDERS</span>
          <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Organised notes collection</h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {cbseFolders.map((hub) => (
            <Link key={hub.id} to={hub.path} className="ssc-material-card ssc-hover-lift rounded-2xl p-5">
              <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>CBSE • Class {hub.classLevel}</div>
              <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>{hub.label}</h3>
              <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>{hub.count} chapter PDFs</p>
              <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span>
            </Link>
          ))}
          <Link to="/study-material?board=GSEB" className="ssc-material-card ssc-hover-lift rounded-2xl p-5">
            <div className="text-[11px] font-black uppercase tracking-[0.16em]" style={{ color: 'var(--gold)' }}>GSEB • Class 12</div>
            <h3 className="text-lg font-black mt-2" style={{ color: 'var(--ink)' }}>Economics</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>Chapters 2–11 with direct PDFs</p>
            <span className="inline-flex items-center gap-2 mt-4 text-sm font-black" style={{ color: 'var(--gold)' }}>Open folder <ArrowRight className="w-4 h-4" /></span>
          </Link>
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-14">
        <div className="grid lg:grid-cols-[.95fr_1.05fr] gap-4 items-stretch">
          <div className="ssc-hero-panel p-5 sm:p-7">
            <div className="ssc-hero-content">
              <span className="eyebrow">AFTER NOTES</span>
              <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Read, practise, revise.</h2>
              <p className="mt-3 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>Study material main hai. Games, tools and doubt help are support sections — not forced, not pushy.</p>
              <div className="mt-5 grid sm:grid-cols-2 gap-3">
                {quickLinks.map((item) => <SmallLinkCard key={item.title} item={item} />)}
              </div>
            </div>
          </div>

          <div className="ssc-glass-card rounded-[1.7rem] p-5 sm:p-7">
            <span className="eyebrow">POPULAR STUDY PAGES</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ color: 'var(--ink)' }}>Common student searches</h2>
            <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--muted)' }}>These pages help students directly reach the material they normally search for.</p>
            <div className="mt-5 grid sm:grid-cols-2 gap-4">
              {popularStudyPages.map((item) => <StudyPageCard key={item.title} item={item} />)}
            </div>
          </div>
        </div>
      </section>

      <section className="page-container pb-10 sm:pb-16">
        <div className="ssc-glass-card rounded-[1.7rem] p-5 sm:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <span className="eyebrow">SIMPLE PROMISE</span>
            <h2 className="text-2xl sm:text-3xl mt-2" style={{ color: 'var(--ink)' }}>Commerce material pehle. Help baad me.</h2>
            <p className="mt-2 text-sm sm:text-base max-w-3xl" style={{ color: 'var(--muted)' }}>Student ko pehle free notes, PDFs, practice and tools milne chahiye. Agar concept still unclear ho, then they can contact Smit Sir.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/study-material" className="btn-primary min-h-12 px-5">Open material</Link>
            <Link to="/contact" className="btn-outline-ink min-h-12 px-5">Need help?</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
