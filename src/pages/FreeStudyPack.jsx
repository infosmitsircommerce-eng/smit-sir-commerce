import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  Check,
  FileSearch,
  GraduationCap,
  Share2,
  Sparkles,
  Target,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import { trackEvent } from '../lib/analytics';

const BASE = 'https://www.smitsircommerce.in';
const PATH = '/free-commerce-study-pack';
const CAMPAIGN = 'free_study_pack';

const resources = [
  {
    title: 'Class 11 Microeconomics Notes',
    text: '13 chapter-wise CBSE Microeconomics resources with free PDFs and revision support.',
    to: '/cbse/class-11/microeconomics-notes',
    tag: 'CBSE · Class 11',
    icon: BookOpenCheck,
  },
  {
    title: 'Class 12 Business Studies Notes',
    text: 'Complete published Class 12 Business Studies chapter collection with practice links.',
    to: '/cbse/class-12/business-studies-notes',
    tag: 'CBSE · Class 12',
    icon: BookOpenCheck,
  },
  {
    title: 'Class 12 Macroeconomics Notes',
    text: 'Published Class 12 Macroeconomics notes with connected revision and numerical tools.',
    to: '/cbse/class-12/macroeconomics-notes',
    tag: 'CBSE · Class 12',
    icon: GraduationCap,
  },
  {
    title: 'GSEB Class 12 Economics',
    text: 'Published Gujarat Board Economics notes for Chapters 2–11 with practice support.',
    to: '/gseb-class-12-economics.html',
    tag: 'GSEB · Class 12',
    icon: GraduationCap,
  },
  {
    title: 'Chapter-wise Commerce Practice',
    text: 'MCQs, important questions, case studies, numericals and revision pages.',
    to: '/cbse-practice',
    tag: 'Free Practice',
    icon: Target,
  },
  {
    title: '41 Commerce Calculators',
    text: 'Economics and Accountancy learning calculators with formulas and step-by-step working.',
    to: '/tools',
    tag: 'Free Tools',
    icon: Calculator,
  },
];

function sendGoogleEvent(name, metadata = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', name, metadata);
  }
}

export default function FreeStudyPack() {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(
    () => `${BASE}${PATH}?utm_source=student_referral&utm_medium=share&utm_campaign=${CAMPAIGN}`,
    []
  );

  useEffect(() => {
    const metadata = { campaign: CAMPAIGN };
    trackEvent('study_pack_view', metadata, null);
    sendGoogleEvent('study_pack_view', metadata);
  }, []);

  const emit = (name, metadata = {}) => {
    const data = { campaign: CAMPAIGN, ...metadata };
    trackEvent(name, data, null);
    sendGoogleEvent(name, data);
  };

  const share = async () => {
    const shareData = {
      title: 'Free Commerce Study Pack | Smit Sir Commerce',
      text: 'Free Commerce notes, chapter practice and calculators for Class 11 & 12 students.',
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        emit('study_pack_shared', { method: 'native_share' });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      emit('study_pack_shared', { method: 'copy_link' });
      window.setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      if (error?.name === 'AbortError') return;
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        emit('study_pack_shared', { method: 'copy_link_fallback' });
        window.setTimeout(() => setCopied(false), 2200);
      } catch {
        emit('study_pack_share_failed');
      }
    }
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${BASE}${PATH}#webpage`,
        url: `${BASE}${PATH}`,
        name: 'Free Commerce Study Pack for Class 11 & 12',
        description: 'One free study page for CBSE and GSEB Commerce students with notes, chapter practice, calculators and a free paper-analysis option.',
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        isPartOf: { '@id': `${BASE}/#website` },
      },
      {
        '@type': 'ItemList',
        name: 'Free Commerce learning resources',
        itemListElement: resources.map((resource, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: resource.title,
          url: `${BASE}${resource.to}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO
        title="Free Commerce Study Pack — Class 11 & 12 CBSE + GSEB"
        description="Free Commerce study pack for Class 11 and 12 students: CBSE and GSEB notes, chapter-wise practice, Economics and Accountancy calculators, and free paper analysis from Smit Sir Commerce."
        path={PATH}
        structuredData={structuredData}
      />

      <section className="page-hero">
        <div className="page-container max-w-5xl text-center">
          <span className="eyebrow">Free · No sign-up required · Built for Commerce students</span>
          <h1 className="mt-5">One link for your <em>Commerce study essentials.</em></h1>
          <p className="mt-5 max-w-3xl mx-auto text-lg leading-relaxed" style={{ color: 'var(--muted)' }}>
            Notes, chapter practice and numerical tools in one place for Class 11 and 12 students. Open what you need now, save the page, and share it with a classmate who may need the same resource.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-6 text-sm" style={{ color: 'var(--muted)' }}>
            {['CBSE', 'GSEB', 'Economics', 'Business Studies', 'Practice', 'Calculators'].map((item) => (
              <span key={item} className="tile-paper px-3 py-2">{item}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
            <a href="#study-pack" className="btn-primary inline-flex items-center justify-center gap-2 min-h-12">
              Open the free pack <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/downloads/class-12-economics-quick-revision-pack.pdf" download className="btn-outline-ink inline-flex items-center justify-center gap-2 min-h-12">
              Download Economics Revision PDF
            </a>
            <button type="button" onClick={share} className="btn-outline-ink inline-flex items-center justify-center gap-2 min-h-12">
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Link copied' : 'Share this pack'}
            </button>
          </div>
        </div>
      </section>

      <main className="page-container section-padding" id="study-pack">
        <section aria-labelledby="study-pack-heading">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <span className="eyebrow">Start studying</span>
              <h2 id="study-pack-heading" className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Pick the resource you need right now.
              </h2>
            </div>
            <p className="text-sm max-w-xl leading-7" style={{ color: 'var(--muted)' }}>
              The pack only links to material currently published on Smit Sir Commerce. Use your prescribed textbook and latest board/school instructions alongside these resources.
            </p>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
            {resources.map(({ title, text, to, tag, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => emit('study_pack_resource_click', { destination: to, resource: title })}
                className="card-paper p-6 group flex flex-col"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-bg)' }}>
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider font-black px-2.5 py-1.5 rounded-full" style={{ color: 'var(--gold)', background: 'var(--gold-bg)' }}>
                    {tag}
                  </span>
                </div>
                <h3 className="text-xl mt-5 font-bold leading-snug" style={{ color: 'var(--ink)' }}>{title}</h3>
                <p className="text-sm mt-2 leading-7 flex-1" style={{ color: 'var(--muted)' }}>{text}</p>
                <div className="mt-5 inline-flex items-center gap-1 text-sm font-bold" style={{ color: 'var(--gold)' }}>
                  Open free resource <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="grid lg:grid-cols-2 gap-5 mt-8">
          <div className="card-paper p-6 sm:p-8">
            <Sparkles className="w-7 h-7" style={{ color: 'var(--gold)' }} />
            <span className="eyebrow mt-4 inline-block">Simple study loop</span>
            <h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Read → practise → check the mistake.
            </h2>
            <div className="space-y-4 mt-5">
              {[
                ['1', 'Read one concept', 'Use the chapter note or your prescribed textbook to understand the idea first.'],
                ['2', 'Practise without looking', 'Attempt MCQs, important questions, case studies or numericals from the same topic.'],
                ['3', 'Repair the exact weak point', 'Use the Marks Recovery tool when the same mistake keeps costing marks.'],
              ].map(([number, title, text]) => (
                <div key={number} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'var(--gold-bg)', color: 'var(--gold)' }}>{number}</div>
                  <div>
                    <div className="font-semibold" style={{ color: 'var(--ink)' }}>{title}</div>
                    <div className="text-sm mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/marks-recovery"
              onClick={() => emit('study_pack_marks_recovery_click')}
              className="btn-outline-ink mt-6 inline-flex items-center gap-2"
            >
              Find my marks leak <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="card-paper p-6 sm:p-8" style={{ border: '1px solid rgba(184,135,47,.28)' }}>
            <FileSearch className="w-7 h-7" style={{ color: 'var(--gold)' }} />
            <span className="eyebrow mt-4 inline-block">Mehsana students</span>
            <h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
              Marks still not improving? Bring the latest paper.
            </h2>
            <p className="text-sm sm:text-base leading-7 mt-3" style={{ color: 'var(--muted)' }}>
              You can request a free paper analysis and demo with Smit Sir. You do not need to leave your existing tuition to ask for help. The first goal is to identify where marks are being lost and what should be fixed next.
            </p>
            <div className="tile-paper p-4 mt-5 text-sm leading-7" style={{ color: 'var(--muted)' }}>
              Teaching subjects: Economics, Business Studies, Entrepreneurship and Physical Education. Accountancy tools on this website are learning resources, not a claim that Smit Sir personally teaches Accountancy.
            </div>
            <Link
              to="/book-demo"
              onClick={() => emit('study_pack_paper_analysis_click')}
              className="btn-primary mt-6 inline-flex items-center gap-2"
            >
              Free Paper Analysis <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="card-paper p-6 sm:p-8 mt-8 text-center">
          <Share2 className="w-7 h-7 mx-auto" style={{ color: 'var(--gold)' }} />
          <h2 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
            If this saved you time, send it to one Commerce classmate.
          </h2>
          <p className="mt-3 max-w-2xl mx-auto leading-7" style={{ color: 'var(--muted)' }}>
            The shared link includes referral tracking so Smit Sir Commerce can learn which free resources students actually pass to each other. It does not require the student to sign up.
          </p>
          <button type="button" onClick={share} className="btn-primary mt-6 inline-flex items-center justify-center gap-2 min-h-12">
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
            {copied ? 'Link copied' : 'Share free study pack'}
          </button>
        </section>
      </main>
    </div>
  );
}
