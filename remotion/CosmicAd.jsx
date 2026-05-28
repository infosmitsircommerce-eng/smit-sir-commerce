import React, { useRef, useEffect } from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { loadFont as loadBebas } from '@remotion/google-fonts/BebasNeue';
import { loadFont as loadSpace } from '@remotion/google-fonts/SpaceGrotesk';

const { fontFamily: bebas } = loadBebas();
const { fontFamily: space } = loadSpace();

// ── Scene boundaries (frames at 30fps) ──────────────────
const S = [0, 156, 312, 507, 672, 822, 960];
// S1=5.2s  S2=5.2s  S3=6.5s  S4=5.5s  S5=5s  S6=4.6s

// ── Seeded deterministic random ──────────────────────────
const sr = (seed) => {
  const x = Math.sin(seed + 1) * 99999;
  return x - Math.floor(x);
};

// ── Clamp helper ─────────────────────────────────────────
const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));

// ── Interpolate with clamp ────────────────────────────────
const lerp = (frame, [f0, f1], [v0, v1]) =>
  interpolate(frame, [f0, f1], [v0, v1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

// ══════════════════════════════════════════════════════════
// PARTICLE CANVAS
// ══════════════════════════════════════════════════════════
function Particles({ frame }) {
  const ref = useRef(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    const W = 1080, H = 1920;
    ctx.clearRect(0, 0, W, H);

    // Stars
    for (let i = 0; i < 900; i++) {
      const seed = i * 7919;
      const sx = sr(seed) * W;
      const sy = sr(seed + 1) * H;
      const ang = sr(seed + 2) * Math.PI * 2;
      const spd = sr(seed + 3) * 0.35 + 0.04;
      const size = Math.pow(sr(seed + 4), 3) * 3.5 + 0.2;
      const baseA = sr(seed + 5) * 0.55 + 0.08;
      const ph = sr(seed + 6) * Math.PI * 2;
      const phSpd = sr(seed + 7) * 0.04 + 0.008;

      const x = ((sx + Math.cos(ang) * spd * frame) % W + W) % W;
      const y = ((sy + Math.sin(ang) * spd * frame) % H + H) % H;
      const a = clamp(baseA + 0.22 * Math.sin(frame * phSpd + ph));

      const t = sr(seed + 8);
      const col = t > 0.9 ? [255, 215, 0] : t > 0.78 ? [110, 190, 255] : t > 0.68 ? [255, 160, 200] : [255, 255, 255];

      ctx.save();
      if (size > 1.5) { ctx.shadowColor = `rgba(${col},0.8)`; ctx.shadowBlur = size * 5; }
      ctx.globalAlpha = a;
      ctx.fillStyle = `rgb(${col})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Shooting stars
    for (let i = 0; i < 4; i++) {
      const period = 200 + i * 70;
      const f = frame % period;
      if (f < 55) {
        const seed = Math.floor(frame / period) * 17 + i * 7;
        const startX = sr(seed) * W;
        const startY = sr(seed + 1) * H * 0.4;
        const progress = f / 55;
        const x = startX + progress * W * 0.35;
        const y = startY + progress * H * 0.12;
        const a = Math.sin(progress * Math.PI) * 0.85;
        const grad = ctx.createLinearGradient(x - 80, y - 25, x, y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, `rgba(255,248,210,${a})`);
        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(x - 80, y - 25);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }, [frame]);

  return <canvas ref={ref} width={1080} height={1920} style={{ position: 'absolute', inset: 0 }} />;
}

// ══════════════════════════════════════════════════════════
// NEBULA BLOBS
// ══════════════════════════════════════════════════════════
function Nebulae({ frame }) {
  const t = frame / 960;
  const s1x = 15 + Math.sin(t * Math.PI * 2.1) * 6;
  const s1y = 25 + Math.cos(t * Math.PI * 1.8) * 5;
  const s2x = 82 + Math.sin(t * Math.PI * 1.6 + 1) * 5;
  const s2y = 72 + Math.cos(t * Math.PI * 2.4 + 2) * 6;

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 65% 45% at ${s1x}% ${s1y}%, rgba(100,0,180,0.16) 0%, transparent 65%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 55% 55% at ${s2x}% ${s2y}%, rgba(0,80,180,0.13) 0%, transparent 65%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse 45% 60% at 50% 8%, rgba(150,90,0,0.11) 0%, transparent 58%)',
      }} />
      {/* Aurora at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30%',
        background: 'linear-gradient(0deg, rgba(0,150,70,0.07) 0%, rgba(0,90,180,0.04) 40%, transparent 100%)',
        filter: 'blur(30px)',
      }} />
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE WRAPPER
// ══════════════════════════════════════════════════════════
function Scene({ frame, si, children }) {
  const start = S[si], end = S[si + 1];
  const fadeDur = 12;
  const opacity = interpolate(frame,
    [start, start + fadeDur, end - fadeDur, end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
  if (frame < start || frame >= end) return null;
  return (
    <AbsoluteFill style={{ opacity, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 1 — STORY
// ══════════════════════════════════════════════════════════
function S1({ frame }) {
  const f = frame - S[0];
  const lines = [
    { text: 'Textbook khola...', delay: 8 },
    { text: 'Page 1 se hi ghuma. 😔', delay: 35, bold: true },
    { text: 'Tab tak Smit Sir nahi mile.', delay: 80, gold: true },
  ];

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 32, padding: '0 80px' }}>
      {lines.map(({ text, delay, bold, gold }, i) => {
        const op = lerp(f, [delay, delay + 18], [0, 1]);
        const y = lerp(f, [delay, delay + 18], [28, 0]);
        const blur = lerp(f, [delay, delay + 18], [10, 0]);
        return (
          <div key={i} style={{
            opacity: op,
            transform: `translateY(${y}px)`,
            filter: `blur(${blur}px)`,
            fontFamily: space,
            fontSize: bold ? 72 : gold ? 68 : 58,
            fontWeight: bold || gold ? 800 : 700,
            color: gold ? '#FFD700' : '#fff',
            textAlign: 'center',
            lineHeight: 1.25,
            textShadow: gold ? '0 0 40px rgba(255,215,0,0.5)' : undefined,
          }}>
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 2 — BRAND SUPERNOVA
// ══════════════════════════════════════════════════════════
function S2({ frame }) {
  const f = frame - S[1];
  const fps = 30;

  const ringScale = spring({ frame: f, fps, config: { damping: 15, stiffness: 80 } });
  const titleScale = spring({ frame: f - 8, fps, config: { damping: 14, stiffness: 100 } });
  const chipY = lerp(f, [35, 55], [30, 0]);
  const chipOp = lerp(f, [35, 55], [0, 1]);

  const rings = [
    { size: 820, color: 'rgba(255,215,0,0.18)', delay: 0 },
    { size: 620, color: 'rgba(0,212,255,0.14)', delay: 4 },
    { size: 400, color: 'rgba(255,0,110,0.1)', delay: 8 },
  ];

  // Shimmer offset based on frame
  const shimmerX = ((f * 2) % 250);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>

      {/* Rings */}
      {rings.map(({ size, color, delay }, i) => {
        const s = spring({ frame: f - delay, fps, config: { damping: 18, stiffness: 70 } });
        return (
          <div key={i} style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid ${color}`,
            transform: `scale(${s})`,
            opacity: clamp(s * 1.2),
          }} />
        );
      })}

      {/* Introducing */}
      <div style={{
        fontFamily: space, fontSize: 28, letterSpacing: '0.5em', textTransform: 'uppercase',
        color: 'rgba(255,215,0,0.5)', marginBottom: 24,
        opacity: lerp(f, [4, 18], [0, 1]),
        transform: `translateY(${lerp(f, [4, 18], [20, 0])}px)`,
      }}>
        ✦ Introducing ✦
      </div>

      {/* Title */}
      <div style={{
        fontFamily: bebas, fontSize: 180, lineHeight: 0.88, textAlign: 'center',
        transform: `scale(${clamp(titleScale, 0, 1.05)})`,
        opacity: clamp(titleScale),
      }}>
        <div style={{ color: '#fff', textShadow: '0 0 60px rgba(255,255,255,0.15)' }}>SMIT SIR</div>
        <div style={{
          backgroundImage: `linear-gradient(135deg, #FFD700 0%, #FFFACD ${shimmerX}%, #FFD700 ${shimmerX + 60}%, #FF8C00 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 0 28px rgba(255,180,0,0.75))',
        }}>COMMERCE</div>
      </div>

      {/* Chips */}
      <div style={{
        display: 'flex', gap: 24, marginTop: 44,
        opacity: chipOp, transform: `translateY(${chipY}px)`,
      }}>
        {[
          { text: '200+ Students', bg: 'rgba(255,215,0,0.1)', border: 'rgba(255,215,0,0.35)', color: '#FFD700' },
          { text: '91% Avg Score', bg: 'rgba(0,212,255,0.1)', border: 'rgba(0,212,255,0.35)', color: '#00D4FF' },
        ].map(({ text, bg, border, color }) => (
          <div key={text} style={{
            fontFamily: space, fontWeight: 700, fontSize: 30,
            padding: '14px 36px', borderRadius: 100,
            background: bg, border: `1px solid ${border}`, color,
            textShadow: `0 0 12px ${color}50`,
          }}>{text}</div>
        ))}
      </div>

      {/* Tagline */}
      <div style={{
        fontFamily: space, fontSize: 28, color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.15em', textTransform: 'uppercase', marginTop: 20,
        opacity: lerp(f, [50, 65], [0, 1]),
      }}>
        Mehsana's Most Advanced Commerce Platform
      </div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 3 — FEATURES
// ══════════════════════════════════════════════════════════
const features = [
  { icon: '🤖', name: 'AI Doubt Solver', desc: '24/7 instant answers, any subject', col: '#FFD700' },
  { icon: '🃏', name: 'Flashcard Flipper', desc: '50+ smart revision cards', col: '#00D4FF' },
  { icon: '📝', name: 'Practice Quizzes', desc: '120+ MCQs with explanations', col: '#34D399' },
  { icon: '🎮', name: 'Commerce Games', desc: 'Learn while you play', col: '#A855F7' },
  { icon: '🎬', name: 'Video Lectures', desc: 'Chapter-by-chapter by Smit Sir', col: '#FF006E' },
];

function S3({ frame }) {
  const f = frame - S[2];

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 18, padding: '0 60px' }}>
      {/* Header */}
      <div style={{
        fontFamily: space, fontSize: 26, letterSpacing: '0.4em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.22)', marginBottom: 10,
        opacity: lerp(f, [4, 18], [0, 1]),
      }}>Everything you need — all free</div>

      {features.map(({ icon, name, desc, col }, i) => {
        const delay = 14 + i * 10;
        const op = lerp(f, [delay, delay + 16], [0, 1]);
        const x = lerp(f, [delay, delay + 16], [-40, 0]);

        return (
          <div key={i} style={{
            width: 900,
            display: 'flex', alignItems: 'center', gap: 28,
            padding: '22px 32px',
            borderRadius: 20,
            background: `rgba(${col === '#FFD700' ? '255,215,0' : col === '#00D4FF' ? '0,212,255' : col === '#34D399' ? '52,211,153' : col === '#A855F7' ? '168,85,247' : '255,0,110'}, 0.06)`,
            border: `1px solid ${col}22`,
            boxShadow: `inset 3px 0 0 ${col}, 0 0 0 1px rgba(255,255,255,0.03)`,
            opacity: op,
            transform: `translateX(${x}px)`,
          }}>
            <div style={{ fontSize: 52 }}>{icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: space, fontSize: 36, fontWeight: 800, color: '#fff' }}>{name}</div>
              <div style={{ fontFamily: space, fontSize: 22, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{desc}</div>
            </div>
            <div style={{
              fontFamily: space, fontSize: 20, fontWeight: 700,
              padding: '6px 20px', borderRadius: 8,
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
            }}>FREE</div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 4 — STATS
// ══════════════════════════════════════════════════════════
const stats = [
  { target: 200, suffix: '+', desc: 'Students Enrolled', delay: 8 },
  { target: 91, suffix: '%', desc: 'Average Board Score', delay: 22 },
  { target: 9, suffix: '', desc: 'CBSE Toppers 🏆', delay: 36 },
];

function S4({ frame }) {
  const f = frame - S[3];
  const shimX = ((f * 2.5) % 250);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {/* Grid BG */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(255,215,0,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,215,0,0.025) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      <div style={{
        fontFamily: space, fontSize: 26, letterSpacing: '0.5em', textTransform: 'uppercase',
        color: 'rgba(255,215,0,0.35)', marginBottom: 60,
        opacity: lerp(f, [4, 16], [0, 1]),
      }}>Real Results • CBSE 2024</div>

      {stats.map(({ target, suffix, desc, delay }, i) => {
        const op = lerp(f, [delay, delay + 18], [0, 1]);
        const scale = lerp(f, [delay, delay + 18], [0.8, 1]);
        const blur = lerp(f, [delay, delay + 18], [6, 0]);
        // Counting animation
        const countProgress = clamp(lerp(f, [delay + 6, delay + 36], [0, 1]));
        const count = Math.round(countProgress * target);

        return (
          <React.Fragment key={i}>
            <div style={{ opacity: op, transform: `scale(${scale})`, filter: `blur(${blur}px)`, textAlign: 'center' }}>
              <div style={{
                fontFamily: bebas,
                fontSize: 190,
                lineHeight: 0.82,
                backgroundImage: `linear-gradient(135deg, #FFD700 0%, #FFFACD ${shimX}%, #FFD700 ${shimX + 60}%, #FFA500 100%)`,
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 40px rgba(255,180,0,0.5))',
              }}>{count}{suffix}</div>
              <div style={{
                fontFamily: space, fontSize: 30, color: 'rgba(255,255,255,0.42)', fontWeight: 600,
                letterSpacing: '0.04em', marginTop: 6,
              }}>{desc}</div>
            </div>
            {i < stats.length - 1 && (
              <div style={{
                width: 200, height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(255,215,0,0.2), transparent)',
                margin: '28px 0',
                opacity: op,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 5 — HALL OF FAME
// ══════════════════════════════════════════════════════════
const toppers = ['🥇 95.4%','🥇 94.2%','🥈 93.8%','🥈 93.1%','🥈 92.6%','🥉 91.9%','🥉 91.4%','🥉 90.8%','⭐ 90.2%'];

function S5({ frame }) {
  const f = frame - S[4];
  const titleS = spring({ frame: f, fps: 30, config: { damping: 14, stiffness: 100 } });

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 36, padding: '0 80px' }}>
      <div style={{
        fontFamily: bebas, fontSize: 110, lineHeight: 0.9, textAlign: 'center',
        opacity: clamp(titleS), transform: `scale(${clamp(titleS, 0, 1.05)})`,
        filter: `blur(${lerp(f, [0, 14], [6, 0])}px)`,
      }}>
        <div style={{ color: '#fff' }}>Hall of</div>
        <div style={{
          color: '#FFD700',
          filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.55))',
        }}>Fame</div>
        <div style={{ fontSize: 44, color: 'rgba(255,255,255,0.25)' }}>CBSE 2024</div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 18, justifyContent: 'center', maxWidth: 860 }}>
        {toppers.map((t, i) => {
          const delay = 16 + i * 8;
          const s = spring({ frame: f - delay, fps: 30, config: { damping: 12, stiffness: 180 } });
          return (
            <div key={i} style={{
              fontFamily: space, fontWeight: 700, fontSize: 28,
              padding: '12px 28px', borderRadius: 100,
              background: 'rgba(255,215,0,0.08)',
              border: '1px solid rgba(255,215,0,0.25)',
              color: '#FFD700',
              textShadow: '0 0 12px rgba(255,215,0,0.38)',
              opacity: clamp(s), transform: `scale(${clamp(s, 0, 1.08)})`,
            }}>{t}</div>
          );
        })}
      </div>

      <div style={{
        fontFamily: space, fontSize: 26, color: 'rgba(255,255,255,0.25)',
        letterSpacing: '0.1em', textTransform: 'uppercase',
        opacity: lerp(f, [80, 95], [0, 1]),
      }}>91.2% Class Average • 100% Pass Rate</div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// SCENE 6 — CTA
// ══════════════════════════════════════════════════════════
function S6({ frame }) {
  const f = frame - S[5];
  const fps = 30;
  const shimX = ((f * 3) % 250);
  const titleS = spring({ frame: f - 6, fps, config: { damping: 13, stiffness: 90 } });
  const btnS = spring({ frame: f - 22, fps, config: { damping: 12, stiffness: 160 } });
  const pulse = 0.5 + 0.5 * Math.sin((f / 30) * Math.PI * 2);

  return (
    <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {/* Background pulse glow */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `radial-gradient(ellipse 70% 60% at 50% 50%, rgba(255,${Math.round(150 + pulse * 30)},0,${0.1 + pulse * 0.04}) 0%, transparent 60%)`,
      }} />

      {/* Eyebrow */}
      <div style={{
        fontFamily: space, fontSize: 30, color: 'rgba(255,255,255,0.35)',
        letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 24,
        opacity: lerp(f, [4, 16], [0, 1]),
      }}>Your Turn Is Next 🔥</div>

      {/* Main headline */}
      <div style={{
        fontFamily: bebas, textAlign: 'center', lineHeight: 0.88,
        opacity: clamp(titleS), transform: `scale(${clamp(titleS, 0, 1.06)})`,
        filter: `blur(${lerp(f, [6, 22], [8, 0])}px)`,
      }}>
        <div style={{ fontSize: 150, color: 'rgba(255,255,255,0.9)' }}>Ab teri</div>
        <div style={{
          fontSize: 200,
          backgroundImage: `linear-gradient(135deg, #FFD700 0%, #FFA500 ${shimX}%, #FF006E ${shimX + 80}%, #FFD700 100%)`,
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          filter: 'drop-shadow(0 0 50px rgba(255,120,0,0.65))',
        }}>BAARI</div>
        <div style={{ fontSize: 130, color: 'rgba(255,255,255,0.75)' }}>hai! 🔥</div>
      </div>

      {/* URL Button */}
      <div style={{
        marginTop: 60, position: 'relative',
        opacity: clamp(btnS), transform: `scale(${clamp(btnS, 0, 1.08)})`,
      }}>
        {/* Halo glow */}
        <div style={{
          position: 'absolute',
          inset: -20, borderRadius: 100,
          background: `rgba(255,215,0,${0.2 + pulse * 0.12})`,
          filter: 'blur(16px)',
        }} />
        <div style={{
          position: 'relative', zIndex: 1,
          fontFamily: space, fontWeight: 800, fontSize: 38,
          padding: '24px 80px', borderRadius: 100,
          color: '#000',
          backgroundImage: `linear-gradient(135deg, #FFD700 0%, #FFF0A0 ${shimX}%, #FFD700 ${shimX + 80}%, #FFD700 100%)`,
          boxShadow: `0 0 0 2px rgba(255,215,0,0.45), 5px 5px 0 rgba(0,0,0,0.5), 0 25px 60px rgba(255,180,0,0.4)`,
          letterSpacing: '0.02em',
        }}>
          smitsircommerce.vercel.app
        </div>
      </div>

      <div style={{
        fontFamily: space, fontSize: 24, color: 'rgba(255,255,255,0.22)',
        letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 28,
        opacity: lerp(f, [35, 48], [0, 1]),
      }}>Free Account • Link in Bio • 30 Seconds</div>
    </AbsoluteFill>
  );
}

// ══════════════════════════════════════════════════════════
// ROOT COMPOSITION
// ══════════════════════════════════════════════════════════
export const CosmicAd = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ background: '#00000d' }}>
      {/* Layer 1 – Stars */}
      <Particles frame={frame} />

      {/* Layer 2 – Nebulae */}
      <Nebulae frame={frame} />

      {/* Layer 3 – Scenes */}
      <Scene frame={frame} si={0}><S1 frame={frame} /></Scene>
      <Scene frame={frame} si={1}><S2 frame={frame} /></Scene>
      <Scene frame={frame} si={2}><S3 frame={frame} /></Scene>
      <Scene frame={frame} si={3}><S4 frame={frame} /></Scene>
      <Scene frame={frame} si={4}><S5 frame={frame} /></Scene>
      <Scene frame={frame} si={5}><S6 frame={frame} /></Scene>

      {/* Progress bar at bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0,
        height: 4, width: `${(frame / 959) * 100}%`,
        background: 'linear-gradient(90deg, #FFD700, #FF006E, #00D4FF)',
        boxShadow: '0 0 12px #FFD700',
      }} />
    </AbsoluteFill>
  );
};
