import { Link } from 'react-router-dom';
import { ArrowRight, FileSearch, Mail, ShieldCheck, Target, Users } from 'lucide-react';

const steps = [
  {
    icon: FileSearch,
    title: 'Free paper analysis',
    text: 'Bring your latest Economics, Business Studies, Entrepreneurship or Physical Education test paper. We identify where marks were lost and what needs to change.',
  },
  {
    icon: Target,
    title: 'Weak-topic action plan',
    text: 'Get a focused plan around the chapters, question types and answer-writing habits that are holding your score back.',
  },
  {
    icon: Users,
    title: 'Judge the teaching first',
    text: 'Already studying somewhere else? That is completely fine. Take the analysis and a free demo first. There is no pressure to leave your current tuition.',
  },
];

export default function MehsanaGrowthCampaign() {
  return (
    <section className="section-padding" style={{ background: 'linear-gradient(180deg, #fffaf0 0%, #ffffff 100%)' }}>
      <div className="page-container">
        <div className="card-paper overflow-hidden" style={{ border: '1px solid rgba(184,135,47,.26)' }}>
          <div className="grid lg:grid-cols-[1.08fr_.92fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <span className="eyebrow">Mehsana · Class 11 &amp; 12 · Free</span>
              <h2 className="text-3xl sm:text-4xl mt-4 leading-tight" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                Already taking tuition but <em>still losing marks?</em>
              </h2>
              <p className="mt-5 max-w-2xl leading-8" style={{ color: 'var(--muted)' }}>
                You do not need to leave your current class. Bring your latest test paper and I will help you understand where the marks are going, which topics need work and what your next study steps should be.
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mt-7">
                {steps.map(({ icon: Icon, title, text }) => (
                  <article key={title} className="tile-paper p-4">
                    <Icon className="w-5 h-5" style={{ color: 'var(--gold)' }} />
                    <h3 className="font-semibold mt-3" style={{ color: 'var(--ink)' }}>{title}</h3>
                    <p className="text-xs leading-6 mt-2" style={{ color: 'var(--muted)' }}>{text}</p>
                  </article>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link to="/book-demo" className="btn-primary inline-flex items-center gap-2">
                  Get Free Paper Analysis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/contact" className="btn-outline-ink inline-flex items-center gap-2">
                  <Mail className="w-4 h-4" /> Send an enquiry
                </Link>
              </div>
              <p className="text-xs mt-3" style={{ color: 'var(--subtle)' }}>No admission required for the first analysis or demo.</p>
            </div>

            <aside className="p-6 sm:p-8 lg:p-10" style={{ background: 'linear-gradient(145deg, rgba(184,135,47,.10), rgba(255,255,255,.72))' }}>
              <ShieldCheck className="w-8 h-8" style={{ color: 'var(--gold)' }} />
              <span className="eyebrow mt-5 inline-block">My teaching commitment</span>
              <h3 className="text-2xl sm:text-3xl mt-3" style={{ fontFamily: 'var(--font-serif)', color: 'var(--ink)' }}>
                I make this promise because I trust my teaching.
              </h3>
              <p className="mt-4 leading-7" style={{ color: 'var(--muted)' }}>
                If an enrolled student regularly attends, completes the required work and tests, follows the agreed study plan, and still fails the subject taught by me, the tuition fee for that subject is refunded according to the written eligibility terms shared before enrolment.
              </p>
              <div className="mt-5 rounded-xl p-4 text-sm leading-6" style={{ background: 'rgba(255,255,255,.72)', border: '1px solid rgba(184,135,47,.22)', color: 'var(--charcoal)' }}>
                This is not a marks guarantee and it is not meant as a gimmick. It is a commitment to students who sincerely follow the academic system.
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
