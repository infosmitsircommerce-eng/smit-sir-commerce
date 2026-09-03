import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Copy, ExternalLink, Megaphone, ShieldCheck, Users } from 'lucide-react';
import SEO from '../components/ui/SEO';
import { useAuth } from '../context/AuthContext';

const BASE = 'https://www.smitsircommerce.in';
const STUDY_PACK = `${BASE}/free-commerce-study-pack`;

const channels = [
  {
    id: 'student',
    title: 'Student / past-student referral',
    audience: 'Send personally to students who already know you. Ask them to forward it only if they find it useful.',
    url: `${STUDY_PACK}?utm_source=referral&utm_medium=student_share&utm_campaign=free_study_pack`,
    message: `Hey! I’ve put my free Commerce notes, chapter practice and calculators into one simple page for Class 11 & 12 students. No sign-up needed. If it helps you, feel free to send it to one Commerce classmate too:\n\n${STUDY_PACK}?utm_source=referral&utm_medium=student_share&utm_campaign=free_study_pack`,
  },
  {
    id: 'parent',
    title: 'Parent / family referral',
    audience: 'Use with parents or family contacts who genuinely know Commerce students.',
    url: `${STUDY_PACK}?utm_source=referral&utm_medium=parent_share&utm_campaign=free_study_pack`,
    message: `I’ve created a free Commerce study page for Class 11 & 12 students with notes, practice and useful calculators. If you know a student who may benefit, you can share this with them. There is no sign-up required:\n\n${STUDY_PACK}?utm_source=referral&utm_medium=parent_share&utm_campaign=free_study_pack`,
  },
  {
    id: 'teacher',
    title: 'Teacher / educator contact',
    audience: 'Send to teachers you already know; do not mass-message strangers.',
    url: `${STUDY_PACK}?utm_source=referral&utm_medium=teacher_share&utm_campaign=free_study_pack`,
    message: `Hi, I’ve organised my free Class 11 & 12 Commerce resources into one page — CBSE/GSEB notes, chapter practice and calculators. If any of your Commerce students would find it useful, you’re welcome to share it with them:\n\n${STUDY_PACK}?utm_source=referral&utm_medium=teacher_share&utm_campaign=free_study_pack`,
  },
  {
    id: 'google-business',
    title: 'Google Business Profile post',
    audience: 'Use this as a GBP update with the tracked website button.',
    url: `${STUDY_PACK}?utm_source=google&utm_medium=business_profile&utm_campaign=free_study_pack`,
    message: `Free Commerce Study Pack for Class 11 & 12 students 📚\n\nAccess free CBSE/GSEB Commerce notes, chapter-wise practice and useful Economics/Accountancy calculators in one place. Students in Mehsana can also request a free paper analysis if they want help understanding where marks are being lost.\n\n${STUDY_PACK}?utm_source=google&utm_medium=business_profile&utm_campaign=free_study_pack`,
  },
  {
    id: 'local-group',
    title: 'Local study/community group',
    audience: 'Post only where sharing educational resources is allowed by the group rules.',
    url: `${STUDY_PACK}?utm_source=referral&utm_medium=community_group&utm_campaign=free_study_pack`,
    message: `Free resource for Class 11 & 12 Commerce students: CBSE/GSEB notes, chapter practice and Commerce calculators collected on one page. No registration needed:\n\n${STUDY_PACK}?utm_source=referral&utm_medium=community_group&utm_campaign=free_study_pack`,
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
            Every channel below points to the same useful free study pack but carries different campaign information. That lets your existing lead and acquisition tracking distinguish Google traffic from referrals instead of treating every visitor as the same.
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
