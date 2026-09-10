import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, Megaphone, ShieldCheck, Users } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://www.smitsircommerce.in';
const STUDY_PACK = `${BASE}/free-commerce-study-pack`;

const channels = [
  {
    id: 'google-business-weekly-post',
    title: 'Google Business Profile — weekly local post',
    audience: 'Publish from the verified business profile once each week with a real classroom/resource image. Use the Mehsana coaching page as the button destination.',
    url: `${BASE}/commerce-coaching-mehsana?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=paper_analysis`,
    message: `Free 20-minute Commerce paper analysis in Mehsana for Class 11 & 12 students. Bring a recent test paper and get a focused weak-topic and answer-writing improvement plan before deciding about tuition. Economics, Business Studies, Entrepreneurship and Physical Education support.\n\nBook here: ${BASE}/commerce-coaching-mehsana?utm_source=google_business_profile&utm_medium=organic_local&utm_campaign=paper_analysis`,
  },
  {
    id: 'genuine-review-request',
    title: 'WhatsApp — genuine student/parent review request',
    audience: 'Send only to real students or parents who have directly used your teaching or resources. Never offer a reward and never write the review for them.',
    url: `${BASE}/commerce-coaching-mehsana`,
    message: `Hello! Thank you for learning with Smit Sir Commerce. If the classes or free study resources genuinely helped you, could you share an honest Google review in your own words? You can mention what you used, your class/subject and what improved. Honest feedback—positive or critical—helps other Mehsana students make a better decision.`,
  },
  {
    id: 'short-commerce-near-me',
    title: 'Short/Reel — Commerce classes near me',
    audience: 'Record a 20–30 second vertical video. Show your face/classroom or one real paper-analysis example and add Mehsana in on-screen text.',
    url: `${BASE}/commerce-coaching-mehsana?utm_source=instagram&utm_medium=reel&utm_campaign=mehsana_paper_analysis`,
    message: `HOOK: Searching for Commerce classes near you in Mehsana?\nBODY: Do not choose only by promises. Bring one recent test paper. I will show you exactly whether marks are being lost in concepts, practice or answer writing.\nCTA: Book a free 20-minute paper analysis at Smit Sir Commerce. Link: ${BASE}/commerce-coaching-mehsana?utm_source=instagram&utm_medium=reel&utm_campaign=mehsana_paper_analysis`,
  },
  {
    id: 'short-controlling-notes',
    title: 'Short/Reel — Controlling Class 12 notes',
    audience: 'Use screen recording of the real notes page and teach one useful point before showing the link.',
    url: `${BASE}/cbse/class-12/business-studies/controlling-notes?utm_source=youtube&utm_medium=short&utm_campaign=controlling_notes`,
    message: `HOOK: Planning and controlling are called inseparable twins—but why?\nBODY: Planning sets the standards; controlling compares actual performance with those standards and corrects deviations. Without planning there is nothing to control, and without control plans may not be achieved.\nCTA: Free Class 12 Controlling notes and MCQs are on Smit Sir Commerce.`,
  },
  {
    id: 'short-bst-case-study',
    title: 'Short/Reel — BST case-study trick',
    audience: 'Teach the clue → concept → evidence method with one original example, then link to the free practice hub.',
    url: `${BASE}/cbse/class-12/business-studies-case-study-questions?utm_source=youtube&utm_medium=short&utm_campaign=bst_case_studies`,
    message: `HOOK: Stop guessing Business Studies case-study answers.\nBODY: First identify the chapter family. Second find the exact clue. Third name the concept. Fourth support it with one fact from the case.\nCTA: Practise free chapter-wise Class 12 BST case studies on Smit Sir Commerce.`,
  },
  {
    id: 'whatsapp-students-quizzes',
    title: 'WhatsApp students — free Economics quiz',
    audience: 'Send only to students or class groups where educational resources are welcome. Easy and Moderate levels are free.',
    url: `${BASE}/quizzes?utm_source=whatsapp&utm_medium=student_share&utm_campaign=economics_quiz_launch`,
    message: `Free Class 11 & 12 Economics chapter quizzes are live on Smit Sir Commerce. Practise Microeconomics, Macroeconomics and Indian Economic Development chapter by chapter. Easy and Moderate levels are free, with answers and explanations.\n\nStart here: ${BASE}/quizzes?utm_source=whatsapp&utm_medium=student_share&utm_campaign=economics_quiz_launch`,
  },
  {
    id: 'whatsapp-teachers-quizzes',
    title: 'WhatsApp teachers — classroom quiz resource',
    audience: 'Share personally with teachers who may find the free chapter practice useful for their students.',
    url: `${BASE}/quizzes?utm_source=whatsapp&utm_medium=teacher_share&utm_campaign=economics_quiz_launch`,
    message: `Hello, I have organised free chapter-wise Economics quizzes for Class 11 and 12 students covering Microeconomics, Macroeconomics and Indian Economic Development. Easy and Moderate levels are free and can be used for quick revision or classroom practice. I would value any feedback on accuracy and usefulness.\n\nResource: ${BASE}/quizzes?utm_source=whatsapp&utm_medium=teacher_share&utm_campaign=economics_quiz_launch`,
  },
  {
    id: 'instagram-quizzes',
    title: 'Instagram story / bio — Economics quiz launch',
    audience: 'Use as a story caption, post caption or bio-link campaign. Keep the quiz screen visible in the creative.',
    url: `${BASE}/quizzes?utm_source=instagram&utm_medium=social&utm_campaign=economics_quiz_launch`,
    message: `FREE ECONOMICS CHAPTER QUIZZES 📚\n\nMicroeconomics • Macroeconomics • Indian Economic Development\nEasy + Moderate levels free\nInstant answers and explanations\nClass 11 & 12 Commerce\n\nPractise now: ${BASE}/quizzes?utm_source=instagram&utm_medium=social&utm_campaign=economics_quiz_launch`,
  },
  {
    id: 'reddit',
    title: 'Reddit - permission-first resource post',
    audience: 'Use only in communities that allow self-promotion or after moderators give permission. Be transparent that it is your own site.',
    url: `${STUDY_PACK}?utm_source=reddit&utm_medium=community&utm_campaign=free_study_pack`,
    message: `I made this little website because Class 11 & 12 Commerce resources are scattered everywhere and finding the right notes or practice can get annoying. I am slowly putting free notes, Economics numericals, Business Studies practice and useful calculators in one place. It is still a work in progress, so feedback on what Commerce students actually need next would genuinely help.\n\n${STUDY_PACK}?utm_source=reddit&utm_medium=community&utm_campaign=free_study_pack`,
  },
  {
    id: 'quora',
    title: 'Quora - useful answer first',
    audience: 'Answer the actual question in detail first. Mention your resource only when it directly helps the student.',
    url: `${STUDY_PACK}?utm_source=quora&utm_medium=answer&utm_campaign=free_study_pack`,
    message: `For Class 11/12 Commerce, I would keep the study loop simple: understand one concept, practise without looking, then review only the exact mistake. For Economics numericals, write the formula or relationship before substituting values; for Business Studies case studies, identify the concept from the situation before writing the theory. I have also organised free notes, practice and calculators here if useful: ${STUDY_PACK}?utm_source=quora&utm_medium=answer&utm_campaign=free_study_pack`,
  },
  {
    id: 'medium',
    title: 'Medium / Blogger - search-friendly article',
    audience: 'Publish a genuinely useful article, not a thin page made only to drop a link.',
    url: `${STUDY_PACK}?utm_source=medium&utm_medium=article&utm_campaign=free_study_pack`,
    message: `Article title: 10 Class 12 Economics Mistakes That Cost Easy Marks\n\nStructure: 1) National Income conversion signs, 2) mixing gross and net, 3) NFIA direction, 4) MPC/MPS confusion, 5) wrong multiplier formula, 6) budget receipt classification, 7) fiscal vs primary deficit, 8) BOP current vs capital/financial flows, 9) skipping units in numericals, 10) rereading instead of testing.\n\nClosing line: I have organised free Commerce notes, chapter practice and learning calculators here for students who want more practice: ${STUDY_PACK}?utm_source=medium&utm_medium=article&utm_campaign=free_study_pack`,
  },
  {
    id: 'pinterest',
    title: 'Pinterest - static study pins',
    audience: 'Use simple non-video study graphics. Each pin should solve one tiny problem and link to the matching page.',
    url: `${STUDY_PACK}?utm_source=pinterest&utm_medium=pin&utm_campaign=free_study_pack`,
    message: `5 pin ideas:\n1. National Income Formula Map - GDP, NDP, GNP, NNP\n2. MPC + MPS = 1 / Multiplier Formula Cheat Sheet\n3. Business Studies Case Study: 5-Step Identification Method\n4. Demand vs Quantity Demanded - One Diagram Idea\n5. Class 12 Economics Final Revision Checklist\n\nDefault destination: ${STUDY_PACK}?utm_source=pinterest&utm_medium=pin&utm_campaign=free_study_pack`,
  },
  {
    id: 'student-question',
    title: 'Student Q&A threads - answer before linking',
    audience: 'Use where a student is already asking a question and community rules permit your own resource link.',
    url: `${STUDY_PACK}?utm_source=community&utm_medium=qa_reply&utm_campaign=free_study_pack`,
    message: `Give the full answer directly in the comment first. If your own page genuinely adds worked examples or practice, finish with: “I made a free practice page for this topic too, if it helps: ${STUDY_PACK}?utm_source=community&utm_medium=qa_reply&utm_campaign=free_study_pack”`,
  },
];

async function copyText(text) {
  await navigator.clipboard.writeText(text);
}

export default function GrowthLaunchKit() {
  const { user, isAdmin, loading } = useAuth();
  const [copied, setCopied] = useState('');
  const items = useMemo(() => channels, []);

  const copy = async (key, text) => {
    try {
      await copyText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(''), 1800);
    } catch {
      setCopied('');
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }}><span style={{ color: 'var(--muted)' }}>Loading…</span></div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg-ivory)' }}>
        <SEO title="Growth Launch Kit" description="Restricted owner area." path="/admin/growth" noindex />
        <div className="card-paper p-8 max-w-lg text-center">
          <ShieldCheck className="w-11 h-11 mx-auto" style={{ color: 'var(--gold)' }} />
          <h1 className="text-3xl mt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Owner access required</h1>
          <Link to={user ? '/dashboard' : '/login'} className="btn-primary inline-flex mt-6">{user ? 'Back to dashboard' : 'Login'}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <SEO title="Growth Launch Kit" description="Private tracked acquisition links and copy for Smit Sir Commerce." path="/admin/growth" noindex />

      <section className="page-hero">
        <div className="page-container max-w-6xl">
          <Link to="/admin" className="inline-flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--gold)' }}>
            <ArrowLeft className="w-4 h-4" /> Owner Hub
          </Link>
          <span className="eyebrow mt-5 inline-block">Real-student acquisition</span>
          <h1 className="mt-4">Launch the first traffic with <em>tracked links.</em></h1>
          <p className="mt-4 max-w-3xl leading-7" style={{ color: 'var(--muted)' }}>
            Use the ready-made quiz campaigns first, then the wider study-pack campaigns. Every link includes campaign tracking so the owner dashboard can show which channel brings genuine students.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href={STUDY_PACK} target="_blank" rel="noreferrer" className="btn-primary inline-flex items-center gap-2">
              Open public study pack <ExternalLink className="w-4 h-4" />
            </a>
            <Link to="/admin/leads" className="btn-outline-ink inline-flex items-center gap-2">Open Admissions CRM</Link>
          </div>
        </div>
      </section>

      <main className="page-container pb-16">
        <section className="card-paper p-6 sm:p-8 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--gold-bg)' }}>
              <Megaphone className="w-5 h-5" style={{ color: 'var(--gold)' }} />
            </div>
            <div>
              <span className="eyebrow">Launch rule</span>
              <h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>Useful first. Promotional second.</h2>
              <p className="text-sm sm:text-base leading-7 mt-2 max-w-3xl" style={{ color: 'var(--muted)' }}>
                Share the free resource with people or communities where it is genuinely relevant. Avoid mass unsolicited messaging. The conversion happens after a student gets value from the notes, practice or calculators — not by pressuring them to join tuition.
              </p>
            </div>
          </div>
        </section>

        <div className="grid xl:grid-cols-2 gap-5">
          {items.map((channel) => (
            <section key={channel.id} className="card-paper p-6 sm:p-7">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="eyebrow">{channel.title}</span>
                  <p className="text-sm leading-6 mt-2" style={{ color: 'var(--muted)' }}>{channel.audience}</p>
                </div>
                <Users className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--gold)' }} />
              </div>

              <div className="tile-paper p-4 mt-5 text-xs leading-6 break-all" style={{ color: 'var(--muted)' }}>{channel.url}</div>

              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <button type="button" onClick={() => copy(`${channel.id}-link`, channel.url)} className="btn-outline-ink inline-flex items-center justify-center gap-2 min-h-11">
                  {copied === `${channel.id}-link` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === `${channel.id}-link` ? 'Link copied' : 'Copy tracked link'}
                </button>
                <button type="button" onClick={() => copy(`${channel.id}-message`, channel.message)} className="btn-primary inline-flex items-center justify-center gap-2 min-h-11">
                  {copied === `${channel.id}-message` ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied === `${channel.id}-message` ? 'Message copied' : 'Copy ready message'}
                </button>
              </div>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-bold" style={{ color: 'var(--gold)' }}>Preview message</summary>
                <pre className="whitespace-pre-wrap text-sm leading-7 mt-3 font-sans" style={{ color: 'var(--muted)' }}>{channel.message}</pre>
              </details>
            </section>
          ))}
        </div>

        <section className="card-paper p-6 sm:p-8 mt-6">
          <span className="eyebrow">What to watch</span>
          <h2 className="text-2xl sm:text-3xl mt-2" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>The first numbers that matter are small.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              ['1', 'Study-pack visitors', 'Did real students open the resource?'],
              ['2', 'Resource clicks', 'Which notes/practice/tools do they actually use?'],
              ['3', 'Shares', 'Are students passing the pack to classmates?'],
              ['4', 'Paper-analysis leads', 'Which source eventually creates an enquiry?'],
            ].map(([n, title, text]) => (
              <div key={n} className="tile-paper p-4">
                <div className="text-xs font-black" style={{ color: 'var(--gold)' }}>{n}</div>
                <div className="font-bold mt-2" style={{ color: 'var(--ink)' }}>{title}</div>
                <div className="text-xs mt-1 leading-6" style={{ color: 'var(--muted)' }}>{text}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
