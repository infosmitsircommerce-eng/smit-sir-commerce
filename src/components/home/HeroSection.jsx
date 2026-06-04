import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Star, Award, ArrowRight, CheckCircle } from 'lucide-react';
import teacherPhoto from '../../assets/teacher-photo-opt.jpg';

// ── Interactive Particle Canvas ────────────────────────────────────────────────
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf;
    const mouse = { x: -9999, y: -9999 };

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const N = 70;
    const particles = Array.from({ length: N }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.8 + 0.4,
      gold: Math.random() > 0.6,
    }));

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    window.addEventListener('mousemove', onMove);

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width, H = canvas.height;

      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          p.vx += (dx / dist) * 0.06;
          p.vy += (dy / dist) * 0.06;
        }
        // Speed cap + friction
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (spd > 2.5) { p.vx *= 0.93; p.vy *= 0.93; }
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.gold ? 'rgba(212,175,55,0.75)' : 'rgba(96,165,250,0.55)';
        ctx.fill();
      });

      // Connections
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 110) {
            const a = (1 - d / 110) * 0.18;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(212,175,55,${a})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.55 }} />;
}

const subjects = ['Economics', 'Business Studies', 'Accountancy', 'Entrepreneurship'];

const trustPoints = [
  'CBSE Board Focused',
  'Concept Clarity',
  'Regular Tests',
  'Doubt Support',
  'Online + Offline',
];

const stats = [
  { value: '200+', label: 'Students' },
  { value: '91%',  label: 'Avg. Score' },
  { value: '9',    label: 'Toppers 2024' },
  { value: '5★',   label: 'Rating' },
];

const WA_LINK = 'https://wa.me/916353709585?text=Hello%20Smit%20Sir%2C%20I%20want%20to%20book%20a%20free%20demo%20class%20for%20Class%2011%2F12%20Commerce.';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden" style={{
      background: 'radial-gradient(ellipse at 20% 60%, #1a2560 0%, #070b1e 55%, #030112 100%)',
    }}>
      {/* Interactive particle field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <ParticleField />
      </div>

      {/* Aurora mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Primary aurora blobs */}
        <div className="absolute top-[-15%] left-[-5%] w-[800px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div className="absolute bottom-[-15%] right-[-5%] w-[800px] h-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.15) 0%, transparent 65%)', filter: 'blur(40px)' }} />
        <div className="absolute top-[30%] right-[20%] w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 65%)', filter: 'blur(60px)' }} />
        {/* Animated floating orbs */}
        <div className="orb-1 absolute top-[20%] right-[15%] w-80 h-80 rounded-full opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.09) 0%, transparent 70%)' }} />
        <div className="orb-2 absolute bottom-[30%] left-[10%] w-64 h-64 rounded-full opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 bg-grid opacity-[0.15]" />
        {/* Floating glowing dots */}
        <div className="hero-dot" style={{ top: '15%', left: '12%', animationDelay: '0s' }} />
        <div className="hero-dot" style={{ top: '38%', left: '6%', animationDelay: '1.5s' }} />
        <div className="hero-dot" style={{ top: '72%', left: '18%', animationDelay: '3s' }} />
        <div className="hero-dot" style={{ top: '20%', right: '8%', animationDelay: '0.8s' }} />
        <div className="hero-dot" style={{ top: '58%', right: '5%', animationDelay: '2.2s' }} />
        <div className="hero-dot" style={{ top: '82%', right: '22%', animationDelay: '1s' }} />
        {/* Top edge glow */}
        <div className="absolute top-0 left-0 right-0 h-[2px]"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.6) 50%, transparent 100%)' }} />
      </div>

      {/* Admission banner */}
      <div className="relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 text-navy-950 text-center py-2.5 text-sm font-bold">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />
          🎓 Admissions Open — Limited Seats · Class 11 &amp; 12 Commerce · Mehsana, Gujarat
        </div>
      </div>

      <div className="page-container relative z-10 pt-8 pb-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center" style={{ minHeight: 'calc(100vh - 120px)' }}>

          {/* ── LEFT ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 lg:order-1"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-gold-400 text-sm font-semibold mb-6"
              style={{
                background: 'rgba(245,158,11,0.08)',
                border: '1px solid rgba(245,158,11,0.25)',
              }}
            >
              <Star className="w-3.5 h-3.5 fill-gold-400" />
              CBSE Class 11 &amp; 12 · Commerce Specialist
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="font-display font-black leading-[1.08] mb-5"
              style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)' }}
            >
              <span className="text-white">Master Class 11 &amp; 12</span>
              <br />
              <span className="gradient-text">Commerce</span>
              <span className="text-white"> with</span>
              <br />
              <span className="relative inline-block text-white">
                Smit Sir
                <motion.span
                  className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full"
                  style={{ background: 'linear-gradient(90deg, #f59e0b, #fcd34d, #f59e0b)' }}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </motion.h1>

            {/* Subject pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2 mb-5"
            >
              {subjects.map((s) => (
                <span key={s} className="text-xs font-medium text-navy-300 bg-navy-800/60 border border-navy-700/60 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-navy-300 text-base leading-relaxed mb-7 max-w-lg"
            >
              CBSE-focused coaching with concept-clear lectures, chapter-wise notes, quizzes, test series and personal doubt support — both online &amp; offline in Mehsana.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-3 mb-7"
            >
              <Link to="/contact" className="btn-primary flex items-center gap-2 text-base px-6 py-3.5">
                <Award className="w-4 h-4" />
                Book Free Demo Class
              </Link>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(37,211,102,0.12)',
                  border: '1px solid rgba(37,211,102,0.3)',
                  color: '#25D366',
                }}
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5" fill="currentColor">
                  <path d="M16.002 2.667C8.637 2.667 2.667 8.637 2.667 16c0 2.363.629 4.609 1.73 6.557L2.667 29.333l6.979-1.698A13.264 13.264 0 0 0 16.002 29.333C23.363 29.333 29.333 23.363 29.333 16S23.363 2.667 16.002 2.667zm0 2.4c5.93 0 10.934 4.937 10.934 10.933 0 5.998-5.004 10.934-10.934 10.934a10.9 10.9 0 0 1-5.55-1.516l-.398-.24-4.14 1.006 1.04-3.994-.265-.414A10.897 10.897 0 0 1 5.069 16c0-5.996 5.004-10.933 10.933-10.933zm-3.02 5.6c-.202 0-.53.075-.809.376-.278.3-1.062 1.038-1.062 2.531 0 1.493 1.087 2.937 1.239 3.139.152.201 2.119 3.39 5.22 4.618 2.578.99 3.1.793 3.66.743.56-.049 1.808-.739 2.063-1.454.254-.715.254-1.328.178-1.454-.076-.126-.278-.202-.58-.352-.303-.151-1.793-.884-2.07-.984-.278-.1-.48-.15-.682.151-.202.3-.78.984-.957 1.186-.176.202-.352.227-.654.076-.302-.152-1.275-.47-2.43-1.499-.898-.8-1.504-1.788-1.68-2.09-.177-.3-.019-.463.133-.612.136-.134.303-.352.454-.528.15-.176.2-.3.301-.503.1-.2.05-.376-.025-.527-.076-.15-.672-1.649-.93-2.254-.238-.567-.486-.493-.673-.502a12.1 12.1 0 0 0-.575-.013z"/>
                </svg>
                WhatsApp Smit Sir
              </a>
            </motion.div>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 mb-7"
            >
              {trustPoints.map((point, i) => (
                <motion.span
                  key={point}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.05 }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-navy-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <CheckCircle className="w-3 h-3 text-gold-400 flex-shrink-0" />
                  {point}
                </motion.span>
              ))}
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6"
              style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            >
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.85 + i * 0.08 }}
                  className="text-center"
                >
                  <div className="font-display font-black text-2xl gradient-text">{s.value}</div>
                  <div className="text-navy-500 text-xs mt-0.5">{s.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── RIGHT — Photo ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-sm lg:max-w-md">
              {/* Soft glow behind photo */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-40 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse, rgba(212,175,55,0.45) 0%, rgba(96,165,250,0.25) 60%, transparent 100%)' }} />

              {/* Spinning gradient border wrapper */}
              <div className="relative rounded-2xl p-[2px] overflow-hidden"
                style={{ boxShadow: '0 0 80px rgba(212,175,55,0.18), 0 20px 60px rgba(0,0,0,0.5)' }}>
                {/* The rotating gradient ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
                  className="absolute rounded-2xl"
                  style={{
                    inset: '-120%',
                    background: 'conic-gradient(from 0deg at 50% 50%, #D4AF37 0deg, #60a5fa 90deg, #34d399 180deg, #f97316 270deg, #D4AF37 360deg)',
                    opacity: 0.85,
                  }}
                />

              {/* Clean photo — no border frame */}
              <div className="relative rounded-2xl overflow-hidden"
                style={{ borderRadius: '14px' }}>

                <img
                  src={teacherPhoto}
                  alt="Smit Sir — Commerce Teacher Mehsana"
                  className="w-full object-cover object-top"
                  fetchPriority="high"
                  style={{ minHeight: '420px', maxHeight: '540px' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="hidden w-full h-96 items-center justify-center flex-col gap-4"
                  style={{ background: 'linear-gradient(135deg, #1a1650, #0f0d2e)' }}>
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-gold-500/15 text-5xl">👨‍🏫</div>
                  <div className="text-white font-bold">Smit Sir</div>
                </div>

                {/* Gradient fade at bottom for badge */}
                <div className="absolute bottom-0 left-0 right-0 h-36 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(8,6,32,0.95) 0%, transparent 100%)' }} />

                {/* Bottom name badge */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-display font-bold text-white text-base">Smit Sir</div>
                      <div className="text-gold-400 text-xs mt-0.5">Commerce Expert · Class 11 &amp; 12 CBSE</div>
                      <div className="text-navy-400 text-xs mt-0.5">📍 Mehsana, Gujarat</div>
                    </div>
                    <div className="flex items-center gap-1.5 rounded-full px-3 py-1.5"
                      style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      <span className="text-emerald-400 text-xs font-semibold">Live</span>
                    </div>
                  </div>
                </div>
              </div>
              </div>{/* end spinning border wrapper */}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
