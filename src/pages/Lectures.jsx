import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, CheckCircle2, Video } from 'lucide-react';

const plannedFeatures = [
  'Chapter-wise CBSE Commerce explanations',
  'Clear topic labels and real lecture durations',
  'Watch buttons only when a video is actually available',
];

export default function LecturesPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-ivory)' }}>
      <div className="page-hero">
        <div className="page-container text-center">
          <span className="eyebrow">Video Library Update</span>
          <h1 className="mt-5">Lectures are <em>being prepared.</em></h1>
          <p className="mx-auto">The video library is not published yet. We removed the sample lesson cards so students never mistake placeholders for available classes.</p>
        </div>
      </div>
      <div className="page-container section-padding">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="card-paper max-w-3xl mx-auto p-7 sm:p-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: 'var(--gold-bg)', border: '1px solid rgba(184,135,47,0.25)' }}>
            <Video className="w-7 h-7" style={{ color: 'var(--gold)' }} strokeWidth={1.7} />
          </div>
          <h2 className="text-2xl sm:text-3xl mb-3" style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--ink)' }}>Only real lecture links</h2>
          <p className="leading-relaxed mb-7" style={{ color: 'var(--muted)' }}>Until the first real videos are uploaded and tested, this page will clearly say they are coming soon. Published PDF notes remain available now.</p>
          <div className="grid sm:grid-cols-3 gap-3 mb-8">
            {plannedFeatures.map((item) => <div key={item} className="tile-paper p-4"><CheckCircle2 className="w-5 h-5 mb-2" style={{ color: 'var(--green)' }} /><p className="text-sm leading-relaxed" style={{ color: 'var(--charcoal)' }}>{item}</p></div>)}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/study-material" className="btn-primary inline-flex items-center justify-center gap-2"><BookOpen className="w-4 h-4" /> Use Published PDF Notes</Link>
            <Link to="/contact" className="btn-outline-ink inline-flex items-center justify-center gap-2">Ask About Classes <ArrowRight className="w-4 h-4" /></Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
