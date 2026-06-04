import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowRight, BookOpen, PlayCircle, FileText, HelpCircle } from 'lucide-react';
import { class11Subjects, class12Subjects } from '../../data/courses';

function SubjectCard({ subject, index, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.05, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="card-light group relative rounded-2xl p-5 cursor-pointer overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-500/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />

      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
        {subject.icon}
      </div>

      <h3 className="font-display font-bold text-gray-900 text-sm mb-1 group-hover:text-gold-600 transition-colors">{subject.name}</h3>
      <p className="text-xs mb-4" style={{ color: '#374151' }}>
        {subject.totalLectures} lectures · {subject.chapters.length} chapters
      </p>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-1.5">
        {[
          { to: '/lectures', Icon: PlayCircle, label: 'Lectures' },
          { to: '/study-material', Icon: FileText, label: 'Notes' },
          { to: '/quizzes', Icon: HelpCircle, label: 'Quiz' },
          { to: '/test-series', Icon: BookOpen, label: 'Tests' },
        ].map(({ to, Icon, label }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-1 bg-gray-50 hover:bg-gold-500/10 border border-gray-200 hover:border-gold-400/40 rounded-lg px-2 py-1.5 text-xs text-gray-500 hover:text-gold-600 transition-all duration-200"
          >
            <Icon className="w-3 h-3 flex-shrink-0" />
            <span className="hidden sm:inline">{label}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

function ClassHeader({ title, subtitle, delay, inView }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay }}
      className="flex items-center justify-between mb-6"
    >
      <div className="flex items-center gap-3">
        <div className="w-1 h-10 bg-gradient-to-b from-gold-400 to-gold-600 rounded-full" />
        <div>
          <h3 className="font-display font-bold text-xl text-gray-900">{title}</h3>
          <p className="text-sm" style={{ color: '#374151' }}>{subtitle}</p>
        </div>
      </div>
      <Link to="/courses" className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-semibold transition-colors group">
        View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}

export default function CoursesPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '100px' });

  return (
    <section ref={ref} className="section-padding section-soft relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-0 bottom-1/4 w-96 h-96 bg-gold-500/4 rounded-full blur-[100px]" />
      </div>

      <div className="page-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-14"
        >
          <div className="section-subheading">Complete Commerce Curriculum</div>
          <h2 className="section-heading">Courses for <span className="gradient-text">Class 11 &amp; 12</span></h2>
          <p className="max-w-xl mx-auto" style={{ color: '#374151' }}>All Commerce subjects with chapter-wise lectures, notes, quizzes, and tests — both online and offline.</p>
        </motion.div>

        {/* Class 12 */}
        <div className="mb-14">
          <ClassHeader title="Class 12 Commerce" subtitle="Board exam focused preparation" delay={0.1} inView={inView} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {class12Subjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} index={i} inView={inView} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={inView ? { opacity: 1, scaleX: 1 } : {}}
          transition={{ delay: 0.4 }}
          className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-14"
        />

        {/* Class 11 */}
        <div>
          <ClassHeader title="Class 11 Commerce" subtitle="Strong foundation from the start" delay={0.3} inView={inView} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {class11Subjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} index={i + 5} inView={inView} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 text-center"
        >
          <Link to="/courses" className="btn-secondary inline-flex items-center gap-2">
            Explore All Courses <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
