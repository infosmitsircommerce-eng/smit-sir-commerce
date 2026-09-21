import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  Calculator,
  CheckCircle2,
  Eye,
  FileText,
  Lightbulb,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import SEO from '../components/ui/SEO';
import {
  ACCOUNTANCY_PREMIUM_SAMPLE_COVER,
  ACCOUNTANCY_PREMIUM_SAMPLE_PDF,
} from '../components/premium/AccountancyPremiumPreview';
import { trackEvent } from '../lib/analytics';

const PATH = '/cbse-class-12-accountancy-financial-ratios-notes';
const BASE = 'https://www.smitsircommerce.in';

const ratioFamilies = [
  {
    name: 'Liquidity',
    question: 'Can the business meet short-term obligations?',
    examples: 'Current Ratio, Quick Ratio',
  },
  {
    name: 'Solvency',
    question: 'How safely is long-term debt financed?',
    examples: 'Debt-Equity, Proprietary, Interest Coverage',
  },
  {
    name: 'Activity',
    question: 'How efficiently are assets and working capital used?',
    examples: 'Inventory, Receivables, Payables and Turnover Ratios',
  },
  {
    name: 'Profitability',
    question: 'How effectively does the business generate profit?',
    examples: 'Gross Profit, Operating, Net Profit and ROI',
  },
];

const formulas = [
  ['Current Ratio', 'Current Assets ÷ Current Liabilities'],
  ['Quick Ratio', 'Quick Assets ÷ Current Liabilities'],
  ['Working Capital', 'Current Assets − Current Liabilities'],
  ['Average Inventory', '(Opening Inventory + Closing Inventory) ÷ 2'],
  ['Capital Employed', 'Shareholders’ Funds + Long-term Debt'],
  ['EBIT / PBIT', 'Profit before Interest and Tax'],
];

const faqs = [
  [
    'Is this Financial Ratios PDF free?',
    'Yes. The complete Financial Ratios Premium Master sample can be opened free. It is published as the quality benchmark for the newer Premium Master format.',
  ],
  [
    'Does the chapter include numericals?',
    'Yes. The sample contains worked numerical examples, reverse problems, formula logic, interpretation, exam tips and practice-focused explanation.',
  ],
  [
    'What is the difference between Current Ratio and Quick Ratio?',
    'Current Ratio compares total current assets with current liabilities. Quick Ratio uses only immediately liquid current assets, so inventory and other non-quick items are excluded.',
  ],
  [
    'Why are ratio questions difficult even when the calculation is simple?',
    'A common source of mistakes is classification: choosing the correct numerator and denominator, identifying the correct accounting figures and interpreting the result in context.',
  ],
  [
    'Are all Premium Accountancy chapters already in this new visual style?',
    'No. This Financial Ratios chapter is the new Master standard. Other Accountancy chapters are being upgraded before they are presented as matching this quality level.',
  ],
];

export default function FinancialRatiosNotes() {
  useEffect(() => {
    void trackEvent('financial_ratios_landing_view', {
      resource: 'financial_ratios_premium_master',
      classLevel: 12,
      board: 'CBSE',
    });
  }, []);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${BASE}${PATH}#learning-resource`,
        name: 'CBSE Class 12 Accountancy Financial Ratios Notes',
        description:
          'Free Financial Ratios Premium Master notes for CBSE Class 12 Accountancy with formula logic, worked numericals, reverse problems, interpretation and visual explanations.',
        url: BASE + PATH,
        contentUrl: ACCOUNTANCY_PREMIUM_SAMPLE_PDF,
        educationalLevel: 'CBSE Class 12',
        learningResourceType: 'Study notes PDF',
        isAccessibleForFree: true,
        inLanguage: 'en-IN',
        provider: { '@type': 'Organization', name: 'Smit Sir Commerce', url: BASE },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: BASE + '/' },
          { '@type': 'ListItem', position: 2, name: 'Premium', item: BASE + '/premium' },
          { '@type': 'ListItem', position: 3, name: 'Financial Ratios Notes', item: BASE + PATH },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: faqs.map(([question, answer]) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      },
    ],
  };

  const openPdf = (placement) => {
    void trackEvent('financial_ratios_pdf_open', {
      placement,
      resource: 'financial_ratios_premium_master',
    });
  };

  return (
    <main style={{ background: 'linear-gradient(180deg,#fbfaf5 0%,#f5faf7 46%,#fff 100%)' }}>
      <SEO
        title="CBSE Class 12 Financial Ratios Notes PDF — Free Premium Master"
        description="Free CBSE Class 12 Accountancy Financial Ratios notes PDF with Current Ratio, Quick Ratio, solvency, turnover and profitability formulas, worked numericals, reverse problems and interpretation."
        path={PATH}
        keywords="CBSE Class 12 financial ratios notes, financial ratios Accountancy PDF, current ratio formula class 12, quick ratio formula class 12, inventory turnover ratio class 12, proprietary ratio formula, working capital turnover ratio"
        structuredData={structuredData}
      />

      <section className="page-container max-w-6xl pt-8 sm:pt-14 pb-10">
        <nav className="text-xs sm:text-sm" style={{ color: 'var(--muted)' }}>
          <Link to="/">Home</Link> / <Link to="/premium">Premium</Link> / Financial Ratios
        </nav>

        <div className="grid lg:grid-cols-[1.12fr_.88fr] gap-8 lg:gap-12 items-center mt-7">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-black tracking-[.12em]"
              style={{ background: '#e8f6f1', color: '#0f766e', border: '1px solid #c8e7dc' }}
            >
              <Sparkles className="w-4 h-4" /> FREE PREMIUM MASTER SAMPLE
            </span>

            <h1
              className="text-4xl sm:text-6xl mt-5 leading-[1.03]"
              style={{ fontFamily: 'var(--font-serif)', letterSpacing: '-.045em', color: '#172033' }}
            >
              Financial Ratios <span style={{ color: '#0f766e' }}>explained visually.</span>
            </h1>

            <p className="text-base sm:text-lg leading-8 mt-5 max-w-3xl" style={{ color: 'var(--muted)' }}>
              CBSE Class 12 Accountancy notes built around the logic behind the formula — not just a formula list.
              Learn the four ratio families, classify the correct figures, solve direct and reverse numericals and interpret the answer properly.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-7">
              <a
                href={ACCOUNTANCY_PREMIUM_SAMPLE_PDF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => openPdf('hero')}
                className="btn-primary inline-flex min-h-12 items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" /> Open Full Free PDF
              </a>
              <Link to="/premium/cbse-12-accountancy" className="btn-secondary inline-flex min-h-12 items-center justify-center gap-2">
                <BookOpenCheck className="w-4 h-4" /> Accountancy Premium Library
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-7">
              {[
                ['105', 'pages'],
                ['4', 'ratio families'],
                ['Visual', 'formula logic'],
                ['Free', 'full sample'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl p-4" style={{ background: '#fff', border: '1px solid #e4e6df' }}>
                  <div className="text-xl sm:text-2xl font-black" style={{ color: '#172033' }}>{value}</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-10 rounded-full blur-3xl" style={{ background: 'rgba(15,118,110,.10)' }} />
            <a
              href={ACCOUNTANCY_PREMIUM_SAMPLE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openPdf('cover')}
              className="relative group"
            >
              <img
                src={ACCOUNTANCY_PREMIUM_SAMPLE_COVER}
                alt="Financial Ratios Analysis Premium Master Notes cover"
                width="951"
                height="1345"
                loading="eager"
                decoding="async"
                className="w-[240px] sm:w-[290px] lg:w-[320px] rounded-xl border bg-white shadow-[0_26px_65px_rgba(23,75,66,.20)] transition-transform duration-300 group-hover:-translate-y-1"
                style={{ borderColor: '#d8ded8' }}
              />
            </a>
          </div>
        </div>
      </section>

      <section className="page-container max-w-6xl py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ratioFamilies.map((family) => (
            <article key={family.name} className="card-paper p-5 sm:p-6">
              <BarChart3 className="w-6 h-6" style={{ color: '#0f766e' }} />
              <h2 className="text-xl font-black mt-4">{family.name}</h2>
              <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{family.question}</p>
              <p className="text-xs font-bold leading-5 mt-4" style={{ color: '#8a6012' }}>{family.examples}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="page-container max-w-6xl py-10">
        <div className="grid lg:grid-cols-[.92fr_1.08fr] gap-6">
          <article className="rounded-3xl p-6 sm:p-8" style={{ background: '#13213d', color: '#fff' }}>
            <span className="text-xs font-black tracking-[.13em]" style={{ color: '#f1d28a' }}>THE BIG IDEA</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>
              Ratio analysis is mostly a classification problem.
            </h2>
            <p className="mt-4 leading-7" style={{ color: '#d7deea' }}>
              The arithmetic is usually short. The real marks are won by selecting the correct accounting figures,
              placing them in the right numerator and denominator, and explaining what the result means.
            </p>
            <div className="mt-6 space-y-3">
              {[
                'What business question is this ratio answering?',
                'Which figures actually belong in the formula?',
                'Should the answer be written as :1, percentage or times?',
                'What does the result indicate in this situation?',
              ].map((item) => (
                <div key={item} className="flex gap-3 text-sm leading-6">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#f1d28a' }} />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="card-paper p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <Calculator className="w-6 h-6" style={{ color: '#b8872f' }} />
              <h2 className="text-2xl sm:text-3xl font-black">Core formula ingredients</h2>
            </div>
            <div className="mt-6 divide-y" style={{ borderColor: '#ece7de' }}>
              {formulas.map(([name, formula]) => (
                <div key={name} className="grid sm:grid-cols-[.8fr_1.2fr] gap-2 sm:gap-5 py-4">
                  <strong className="text-sm">{name}</strong>
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>{formula}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl p-4 mt-5" style={{ background: '#fff7df', border: '1px solid #ead39a' }}>
              <div className="flex gap-3">
                <Lightbulb className="w-5 h-5 shrink-0 mt-0.5" style={{ color: '#8a6012' }} />
                <p className="text-sm leading-6">
                  <strong>Common trap:</strong> many ratio mistakes are classification errors rather than arithmetic errors.
                </p>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="page-container max-w-6xl py-10">
        <div className="card-paper p-6 sm:p-8">
          <span className="eyebrow">WORKED EXAMPLE STYLE</span>
          <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>
            Current Ratio — direct and reverse thinking
          </h2>
          <div className="grid lg:grid-cols-2 gap-5 mt-7">
            <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#eef8f4', border: '1px solid #cfe5dc' }}>
              <div className="text-xs font-black tracking-wider" style={{ color: '#0f766e' }}>DIRECT</div>
              <h3 className="text-xl font-black mt-2">CA ₹7,20,000 · CL ₹3,00,000</h3>
              <p className="text-sm mt-4 leading-6">Current Ratio = Current Assets ÷ Current Liabilities</p>
              <div className="text-3xl font-black mt-4" style={{ color: '#0f766e' }}>2.40 : 1</div>
            </div>
            <div className="rounded-2xl p-5 sm:p-6" style={{ background: '#fff7e3', border: '1px solid #ead8ab' }}>
              <div className="text-xs font-black tracking-wider" style={{ color: '#8a6012' }}>REVERSE</div>
              <h3 className="text-xl font-black mt-2">WC ₹4,50,000 · CL ₹3,00,000</h3>
              <p className="text-sm mt-4 leading-6">Current Assets = Working Capital + Current Liabilities = ₹7,50,000</p>
              <div className="text-3xl font-black mt-4" style={{ color: '#8a6012' }}>2.50 : 1</div>
            </div>
          </div>
          <p className="text-sm leading-6 mt-5" style={{ color: 'var(--muted)' }}>
            The full PDF shows the working step by step and uses the same visual treatment for formula logic, interpretation, exam tips and higher-level problems.
          </p>
        </div>
      </section>

      <section className="page-container max-w-6xl py-10">
        <div className="grid lg:grid-cols-[1fr_.9fr] gap-6">
          <div>
            <span className="eyebrow">FREE TOOLS THAT CONNECT TO THIS CHAPTER</span>
            <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Practise the ratio, then verify your method.</h2>
            <p className="mt-3 leading-7" style={{ color: 'var(--muted)' }}>
              Use the calculators after attempting the working yourself. They are useful for checking the formula and arithmetic, not replacing written practice.
            </p>
            <div className="grid sm:grid-cols-2 gap-3 mt-6">
              <Link to="/tools/current-ratio-calculator" className="tile-paper p-4 flex items-center justify-between gap-3">
                <span className="font-black">Current Ratio Calculator</span><ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/tools/debt-equity-ratio-calculator" className="tile-paper p-4 flex items-center justify-between gap-3">
                <span className="font-black">Debt-Equity Calculator</span><ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <aside className="rounded-3xl p-6 sm:p-7" style={{ background: '#eef8f4', border: '1px solid #cfe5dc' }}>
            <ShieldCheck className="w-7 h-7" style={{ color: '#0f766e' }} />
            <h2 className="text-2xl font-black mt-4">Premium Master Standard</h2>
            <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>
              This sample sets the design benchmark for future Accountancy Premium chapters: large readable type,
              visual concept maps, worked numericals, teacher logic, exam traps and mobile-friendly layouts.
            </p>
            <Link to="/premium/cbse-12-accountancy" className="btn-primary w-full mt-5 text-center">
              See Accountancy Premium
            </Link>
          </aside>
        </div>
      </section>

      <section className="page-container max-w-4xl py-10">
        <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
        <h2 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: 'var(--font-serif)' }}>Financial Ratios FAQ</h2>
        <div className="space-y-3 mt-6">
          {faqs.map(([question, answer]) => (
            <details key={question} className="card-paper p-5">
              <summary className="cursor-pointer font-black">{question}</summary>
              <p className="text-sm leading-6 mt-3" style={{ color: 'var(--muted)' }}>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="page-container max-w-6xl pb-20 pt-6">
        <div className="rounded-3xl p-7 sm:p-9 text-center" style={{ background: '#13213d', color: '#fff' }}>
          <FileText className="w-8 h-8 mx-auto" style={{ color: '#f1d28a' }} />
          <h2 className="text-3xl sm:text-4xl mt-4" style={{ fontFamily: 'var(--font-serif)' }}>
            Read the entire chapter before deciding whether Premium is useful.
          </h2>
          <p className="mt-3 max-w-2xl mx-auto leading-7" style={{ color: '#d7deea' }}>
            No teaser pages. The Financial Ratios Premium Master sample is available in full so you can judge the explanation and design yourself.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
            <a
              href={ACCOUNTANCY_PREMIUM_SAMPLE_PDF}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => openPdf('bottom_cta')}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              Open Full Free PDF <ArrowRight className="w-4 h-4" />
            </a>
            <Link to="/premium" className="btn-secondary">Compare Premium access</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
