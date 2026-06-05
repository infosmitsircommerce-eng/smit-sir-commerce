import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Img, staticFile } from 'remotion';

const FPS = 30;
const f = (ms) => Math.round((ms / 1000) * FPS);

// ── Spring helper ────────────────────────────────────────────────────────────
function sp(frame, from, cfg = {}) {
  return spring({ frame: frame - from, fps: FPS, config: { damping: 16, stiffness: 150, mass: 0.9, ...cfg } });
}

// ── Clamp interpolate ────────────────────────────────────────────────────────
function lerp(frame, from, to, inV = 0, outV = 1) {
  return interpolate(frame, [from, to], [inV, outV], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
}

// ── Floating particles ───────────────────────────────────────────────────────
function Particles({ frame, count = 40, color = '#FFD700', opacity = 0.18 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
      {Array.from({ length: count }, (_, i) => {
        const x = (i * 137.508) % 100;
        const baseY = (i * 61.8) % 100;
        const speed = 0.03 + (i % 5) * 0.008;
        const y = (baseY + frame * speed * (i % 2 === 0 ? 1 : -0.6)) % 100;
        const size = 1.5 + (i % 4) * 1.2;
        const op = opacity * (0.4 + (i % 3) * 0.2) * lerp(frame, 0, 30, 0, 1);
        return (
          <div key={i} style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: size, height: size,
            borderRadius: '50%',
            background: color,
            opacity: op,
            filter: `blur(${i % 3 === 0 ? 1 : 0}px)`,
          }} />
        );
      })}
    </div>
  );
}

// ── Vignette ─────────────────────────────────────────────────────────────────
function Vignette({ strength = 0.7 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: `radial-gradient(ellipse at 50% 50%, transparent 30%, rgba(0,0,0,${strength}) 100%)`,
    }} />
  );
}

// ── Cinematic bars ────────────────────────────────────────────────────────────
function CinematicBars({ height = 72 }) {
  return (
    <>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height, background: '#000', zIndex: 90 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height, background: '#000', zIndex: 90 }} />
    </>
  );
}

// ── Scan line texture ─────────────────────────────────────────────────────────
function ScanLines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1,
      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)',
    }} />
  );
}

// ── Light ray ─────────────────────────────────────────────────────────────────
function LightRay({ cx = 540, cy = 960, count = 16, color = 'rgba(255,215,0,0.03)', frame }) {
  return (
    <svg style={{ position: 'absolute', inset: 0 }} width="1080" height="1920">
      {Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2 + frame * 0.002;
        const len = 1400;
        return (
          <line key={i}
            x1={cx + Math.cos(angle) * 80}
            y1={cy + Math.sin(angle) * 80}
            x2={cx + Math.cos(angle) * len}
            y2={cy + Math.sin(angle) * len}
            stroke={color}
            strokeWidth={i % 2 === 0 ? 60 : 30}
          />
        );
      })}
    </svg>
  );
}

// ── Gold divider line ─────────────────────────────────────────────────────────
function GoldLine({ width = 120, opacity = 1 }) {
  return (
    <div style={{
      height: 2, width,
      background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
      opacity, margin: '10px auto',
    }} />
  );
}

// ── Animated stat card ────────────────────────────────────────────────────────
function StatCard({ frame, from, value, label, color = '#FFD700', delay = 0 }) {
  const s = sp(frame, from + delay, { stiffness: 200, damping: 18 });
  const fadeIn = lerp(frame, from + delay, from + delay + 12, 0, 1);
  return (
    <div style={{
      opacity: fadeIn,
      transform: `scale(${interpolate(s, [0, 1], [0.6, 1])}) translateY(${interpolate(s, [0, 1], [40, 0])}px)`,
      textAlign: 'center',
      padding: '20px 28px',
      borderRadius: 20,
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,215,0,0.15)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)',
      minWidth: 180,
    }}>
      <div style={{
        fontSize: 64, fontWeight: 900, color,
        textShadow: `0 0 30px ${color}60, 0 0 60px ${color}30`,
        fontFamily: 'Impact, Arial Black, sans-serif',
        lineHeight: 1,
      }}>{value}</div>
      <div style={{
        color: 'rgba(255,255,255,0.6)', fontSize: 22,
        fontFamily: 'Segoe UI, Arial, sans-serif',
        fontWeight: 400, letterSpacing: '0.06em',
        textTransform: 'uppercase', marginTop: 8,
      }}>{label}</div>
    </div>
  );
}

// ── Subject tag ───────────────────────────────────────────────────────────────
function SubjectTag({ frame, from, children, delay = 0 }) {
  const s = lerp(frame, from + delay, from + delay + 10, 0, 1);
  return (
    <div style={{
      opacity: s,
      transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
      display: 'inline-flex', alignItems: 'center', gap: 10,
      marginBottom: 16,
    }}>
      <div style={{ width: 3, height: 28, background: '#FFD700', borderRadius: 2, flexShrink: 0 }} />
      <span style={{
        color: 'rgba(255,255,255,0.85)', fontSize: 34,
        fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 300,
        letterSpacing: '0.04em',
      }}>{children}</span>
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────────────────
export function PremiumAd() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ── Scene boundaries ───────────────────────────────────────────────────────
  const S1 = 0;          // Hook
  const S2 = f(2500);    // Problem
  const S3 = f(5500);    // Mentor reveal
  const S4 = f(9000);    // Proof / stats
  const S5 = f(12500);   // Finale CTA

  // ── Global fade in ─────────────────────────────────────────────────────────
  const globalOpacity = lerp(frame, 0, 18, 0, 1);

  // ── Scene transitions ──────────────────────────────────────────────────────
  const s1Out = lerp(frame, S2 - 12, S2, 1, 0);
  const s2In  = lerp(frame, S2, S2 + 15, 0, 1);
  const s2Out = lerp(frame, S3 - 12, S3, 1, 0);
  const s3In  = lerp(frame, S3, S3 + 20, 0, 1);
  const s3Out = lerp(frame, S4 - 12, S4, 1, 0);
  const s4In  = lerp(frame, S4, S4 + 15, 0, 1);
  const s4Out = lerp(frame, S5 - 12, S5, 1, 0);
  const s5In  = lerp(frame, S5, S5 + 25, 0, 1);

  // ── Flash transition ──────────────────────────────────────────────────────
  const flash1 = lerp(frame, S2 - 3, S2 + 3, 0, 1) * lerp(frame, S2, S2 + 8, 1, 0);
  const flash2 = lerp(frame, S3 - 3, S3 + 3, 0, 1) * lerp(frame, S3, S3 + 8, 1, 0);
  const flash3 = lerp(frame, S4 - 3, S4 + 3, 0, 1) * lerp(frame, S4, S4 + 8, 1, 0);
  const flash4 = lerp(frame, S5 - 3, S5 + 3, 0, 1) * lerp(frame, S5, S5 + 8, 1, 0);

  return (
    <div style={{
      width, height, background: '#080a0f',
      position: 'relative', overflow: 'hidden',
      opacity: globalOpacity,
    }}>

      {/* ── PERSISTENT BACKGROUND ───────────────────────────────────────── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 35%, rgba(255,215,0,0.05) 0%, transparent 60%)',
      }} />
      <Particles frame={frame} />
      <ScanLines />
      <Vignette strength={0.65} />

      {/* ── SCENE 1: HOOK ────────────────────────────────────────────────── */}
      {frame < S3 && frame >= S1 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: frame < S2 ? s1Out : s2In * s2Out,
          padding: '0 60px',
        }}>
          {frame < S2 ? (
            // HOOK SCENE
            <>
              <LightRay frame={frame} cx={540} cy={960} color="rgba(255,215,0,0.025)" />

              {/* Eyebrow */}
              <div style={{
                color: '#FFD700', fontSize: 22, letterSpacing: '0.5em',
                textTransform: 'uppercase', marginBottom: 24,
                fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 700,
                opacity: lerp(frame, S1 + 10, S1 + 22, 0, 1),
                transform: `translateY(${lerp(frame, S1 + 10, S1 + 22, 20, 0)}px)`,
                textShadow: '0 0 20px rgba(255,215,0,0.4)',
              }}>
                CBSE Class 11 &amp; 12 · Commerce
              </div>

              {/* Hero text */}
              <div style={{
                fontSize: 110, fontWeight: 900, lineHeight: 0.95,
                textAlign: 'center', letterSpacing: '-0.01em',
                fontFamily: 'Impact, Arial Black, sans-serif',
                opacity: lerp(frame, S1 + 18, S1 + 32, 0, 1),
                transform: `scale(${interpolate(sp(frame, S1 + 18, { stiffness: 130, damping: 14 }), [0, 1], [0.7, 1])})`,
              }}>
                <span style={{
                  color: '#fff',
                  textShadow: '0 4px 40px rgba(0,0,0,0.8)',
                }}>BOARDS</span>
                <br />
                <span style={{
                  background: 'linear-gradient(135deg, #FFD700, #FFF4A0, #FFD700)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.5))',
                }}>ARE NEAR.</span>
              </div>

              {/* Sub text */}
              <div style={{
                color: 'rgba(255,255,255,0.45)', fontSize: 30,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 300,
                marginTop: 32,
                opacity: lerp(frame, S1 + 35, S1 + 48, 0, 1),
                transform: `translateY(${lerp(frame, S1 + 35, S1 + 48, 20, 0)}px)`,
              }}>
                Are you prepared?
              </div>

              <GoldLine width={140} opacity={lerp(frame, S1 + 45, S1 + 58, 0, 1)} />
            </>
          ) : (
            // PROBLEM SCENE
            <>
              <div style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 24, letterSpacing: '0.4em',
                textTransform: 'uppercase', marginBottom: 28,
                fontFamily: 'Segoe UI, Arial, sans-serif',
                opacity: lerp(frame, S2 + 5, S2 + 18, 0, 1),
              }}>
                STRUGGLING WITH...
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
                <SubjectTag frame={frame} from={S2} delay={8}>Accountancy</SubjectTag>
                <SubjectTag frame={frame} from={S2} delay={20}>Economics</SubjectTag>
                <SubjectTag frame={frame} from={S2} delay={32}>Business Studies</SubjectTag>
                <SubjectTag frame={frame} from={S2} delay={44}>Entrepreneurship</SubjectTag>
              </div>

              {frame >= S2 + 55 && (
                <div style={{
                  marginTop: 36,
                  color: '#FFD700', fontSize: 38,
                  fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 700,
                  textShadow: '0 0 30px rgba(255,215,0,0.4)',
                  opacity: lerp(frame, S2 + 55, S2 + 68, 0, 1),
                  transform: `translateY(${lerp(frame, S2 + 55, S2 + 68, 20, 0)}px)`,
                }}>
                  You're not alone.
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ── SCENE 3: MENTOR REVEAL ────────────────────────────────────────── */}
      {frame >= S3 && frame < S4 && (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: s3In * s3Out,
        }}>
          {/* Photo — right side */}
          <div style={{
            position: 'absolute',
            right: 0, top: 0, bottom: 0, width: '65%',
            transform: `translateX(${lerp(frame, S3, S3 + 25, 80, 0)}px)`,
          }}>
            <Img
              src={staticFile('teacher.jpg')}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', objectPosition: 'top center',
                filter: 'contrast(1.08) brightness(0.92) saturate(0.85)',
              }}
            />
            {/* Gradient left blend */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(90deg, #080a0f 0%, rgba(8,10,15,0.6) 30%, transparent 65%)',
            }} />
            {/* Bottom fade */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 50%, rgba(8,10,15,0.9) 100%)',
            }} />
            {/* Warm color grade overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(255,180,30,0.04)',
            }} />
          </div>

          {/* Gold radial glow behind photo */}
          <div style={{
            position: 'absolute', right: 0, top: '20%',
            width: 400, height: 700,
            background: 'radial-gradient(ellipse, rgba(255,215,0,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />

          {/* Text — left side */}
          <div style={{
            position: 'absolute',
            left: 50, top: 0, bottom: 0, width: '58%',
            display: 'flex', flexDirection: 'column',
            justifyContent: 'center', paddingBottom: 100,
          }}>
            {/* MEET YOUR */}
            <div style={{
              color: 'rgba(255,255,255,0.45)', fontSize: 22,
              letterSpacing: '0.5em', textTransform: 'uppercase',
              fontFamily: 'Segoe UI, Arial, sans-serif',
              marginBottom: 12,
              opacity: lerp(frame, S3 + 10, S3 + 22, 0, 1),
            }}>
              MEET YOUR MENTOR
            </div>

            {/* SMIT SIR */}
            <div style={{
              fontSize: 108, fontWeight: 900, lineHeight: 0.9,
              fontFamily: 'Impact, Arial Black, sans-serif',
              opacity: sp(frame, S3 + 15, { stiffness: 180, damping: 16 }),
              transform: `translateY(${interpolate(sp(frame, S3 + 15, { stiffness: 180, damping: 16 }), [0, 1], [50, 0])}px)`,
            }}>
              <div style={{ color: '#fff', textShadow: '0 4px 40px rgba(0,0,0,0.6)' }}>SMIT</div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFF4A0 50%, #FFD700 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.6))',
              }}>SIR</div>
            </div>

            {/* Gold divider */}
            <div style={{
              width: lerp(frame, S3 + 25, S3 + 45, 0, 160),
              height: 2,
              background: 'linear-gradient(90deg, #FFD700, transparent)',
              margin: '18px 0',
            }} />

            {/* Credentials */}
            {frame >= S3 + 30 && (
              <div style={{
                opacity: lerp(frame, S3 + 30, S3 + 45, 0, 1),
                transform: `translateX(${lerp(frame, S3 + 30, S3 + 45, -20, 0)}px)`,
              }}>
                <div style={{
                  color: 'rgba(255,255,255,0.7)', fontSize: 24,
                  fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 300,
                  lineHeight: 1.8, letterSpacing: '0.02em',
                }}>
                  Commerce Expert<br />
                  Class 11 &amp; 12 · CBSE<br />
                  <span style={{ color: '#FFD700' }}>Mehsana, Gujarat</span>
                </div>
              </div>
            )}

            {/* ONLINE + OFFLINE badge */}
            {frame >= S3 + 55 && (
              <div style={{
                marginTop: 24,
                display: 'flex', gap: 12,
                opacity: lerp(frame, S3 + 55, S3 + 68, 0, 1),
              }}>
                {['Online · Pan India', 'Offline · Mehsana'].map((tag) => (
                  <div key={tag} style={{
                    padding: '8px 18px',
                    borderRadius: 100,
                    border: '1px solid rgba(255,215,0,0.3)',
                    background: 'rgba(255,215,0,0.06)',
                    color: '#FFD700', fontSize: 18,
                    fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 600,
                    letterSpacing: '0.03em',
                  }}>{tag}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SCENE 4: STATS / PROOF ────────────────────────────────────────── */}
      {frame >= S4 && frame < S5 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: s4In * s4Out,
          gap: 20,
        }}>
          <LightRay frame={frame} cx={540} cy={700} color="rgba(255,215,0,0.02)" count={24} />

          <div style={{
            color: 'rgba(255,255,255,0.45)', fontSize: 22, letterSpacing: '0.5em',
            textTransform: 'uppercase', fontFamily: 'Segoe UI, Arial, sans-serif',
            marginBottom: 8,
            opacity: lerp(frame, S4 + 5, S4 + 18, 0, 1),
          }}>
            PROVEN RESULTS
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <StatCard frame={frame} from={S4} value="200+" label="Students" delay={0} />
            <StatCard frame={frame} from={S4} value="5★" label="Avg Rating" color="#FFD700" delay={12} />
            <StatCard frame={frame} from={S4} value="91%" label="Score 80+" color="#4ade80" delay={24} />
          </div>

          {frame >= S4 + 50 && (
            <div style={{
              marginTop: 24,
              opacity: lerp(frame, S4 + 50, S4 + 65, 0, 1),
              transform: `translateY(${lerp(frame, S4 + 50, S4 + 65, 20, 0)}px)`,
              textAlign: 'center',
            }}>
              <div style={{
                color: 'rgba(255,255,255,0.5)', fontSize: 28,
                fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 300,
                letterSpacing: '0.04em',
              }}>
                Top Result · 95% by Heer Patel
              </div>
              <div style={{
                color: '#FFD700', fontSize: 22, marginTop: 8,
                fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 600,
                textShadow: '0 0 20px rgba(255,215,0,0.4)',
              }}>
                Economics · Class 12 CBSE
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── SCENE 5: FINALE CTA ──────────────────────────────────────────── */}
      {frame >= S5 && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: s5In,
        }}>
          {/* Speed lines radial */}
          <LightRay frame={frame} cx={540} cy={960} color="rgba(255,215,0,0.035)" count={32} />

          {/* Soft gold glow behind text */}
          <div style={{
            position: 'absolute',
            width: 600, height: 600, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,215,0,0.12) 0%, transparent 65%)',
            filter: 'blur(60px)',
          }} />

          {/* Eyebrow */}
          <div style={{
            color: 'rgba(255,255,255,0.4)', fontSize: 20,
            letterSpacing: '0.55em', textTransform: 'uppercase',
            fontFamily: 'Segoe UI, Arial, sans-serif',
            marginBottom: 20,
            opacity: lerp(frame, S5 + 8, S5 + 22, 0, 1),
          }}>
            YOUR COMMERCE MENTOR
          </div>

          {/* Main brand */}
          <div style={{
            textAlign: 'center', lineHeight: 0.88,
            opacity: sp(frame, S5 + 12, { stiffness: 140, damping: 14 }),
            transform: `scale(${interpolate(sp(frame, S5 + 12, { stiffness: 140, damping: 14 }), [0, 1], [0.65, 1])})`,
          }}>
            <div style={{
              fontSize: 118, fontWeight: 900,
              fontFamily: 'Impact, Arial Black, sans-serif',
              color: '#fff',
              textShadow: '0 6px 60px rgba(0,0,0,0.7)',
              letterSpacing: '0.02em',
            }}>SMIT SIR</div>
            <div style={{
              fontSize: 118, fontWeight: 900,
              fontFamily: 'Impact, Arial Black, sans-serif',
              background: 'linear-gradient(135deg, #FFD700 0%, #FFFACD 40%, #FFD700 70%, #FFA500 100%)',
              backgroundSize: '300%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 40px rgba(255,180,0,0.7))',
              letterSpacing: '0.01em',
            }}>COMMERCE</div>
          </div>

          {/* Gold line */}
          <div style={{
            height: 2,
            width: lerp(frame, S5 + 28, S5 + 50, 0, 280),
            background: 'linear-gradient(90deg, transparent, #FFD700, transparent)',
            margin: '24px 0',
          }} />

          {/* Tagline */}
          {frame >= S5 + 35 && (
            <div style={{
              color: 'rgba(255,255,255,0.55)', fontSize: 26,
              fontFamily: 'Segoe UI, Arial, sans-serif', fontWeight: 300,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              opacity: lerp(frame, S5 + 35, S5 + 50, 0, 1),
              transform: `translateY(${lerp(frame, S5 + 35, S5 + 50, 16, 0)}px)`,
              marginBottom: 36,
            }}>
              Class 11 &amp; 12 · CBSE Commerce
            </div>
          )}

          {/* URL button */}
          {frame >= S5 + 50 && (
            <div style={{
              position: 'relative',
              opacity: sp(frame, S5 + 50, { stiffness: 220, damping: 18 }),
              transform: `scale(${interpolate(sp(frame, S5 + 50, { stiffness: 220, damping: 18 }), [0, 1], [0.7, 1])})`,
            }}>
              {/* Glow behind button */}
              <div style={{
                position: 'absolute', inset: -20, borderRadius: 60,
                background: 'radial-gradient(ellipse, rgba(255,215,0,0.25) 0%, transparent 65%)',
                filter: 'blur(15px)',
              }} />
              <div style={{
                position: 'relative',
                padding: '18px 64px', borderRadius: 60,
                background: 'linear-gradient(135deg, #FFD700, #FFF0A0, #FFD700)',
                color: '#000', fontSize: 28, fontWeight: 900,
                fontFamily: 'Impact, Arial Black, sans-serif',
                letterSpacing: '0.06em',
                boxShadow: '0 0 0 1px rgba(255,215,0,0.4), 0 8px 40px rgba(255,180,0,0.35), 4px 4px 0 rgba(0,0,0,0.4)',
              }}>
                🌐 smitsircommerce.vercel.app
              </div>
            </div>
          )}

          {/* Free demo hint */}
          {frame >= S5 + 65 && (
            <div style={{
              marginTop: 20,
              color: 'rgba(255,255,255,0.3)', fontSize: 18,
              fontFamily: 'Segoe UI, Arial, sans-serif',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              opacity: lerp(frame, S5 + 65, S5 + 80, 0, 1),
            }}>
              Free Demo Class Available
            </div>
          )}
        </div>
      )}

      {/* ── FLASH TRANSITIONS ─────────────────────────────────────────────── */}
      {(flash1 > 0 || flash2 > 0 || flash3 > 0 || flash4 > 0) && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#fff',
          opacity: Math.max(flash1, flash2, flash3, flash4) * 0.6,
          zIndex: 50,
          pointerEvents: 'none',
        }} />
      )}

      {/* ── PROGRESS BAR ─────────────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 3,
        width: `${(frame / 480) * 100}%`,
        background: 'linear-gradient(90deg, #FFD700, #FFF4A0, #FFD700)',
        boxShadow: '0 0 12px #FFD700',
        zIndex: 999,
      }} />

      <CinematicBars height={68} />
    </div>
  );
}
