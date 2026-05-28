import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate, spring, Audio, staticFile, Sequence } from 'remotion';

const fps = 30;
const t = (ms) => Math.round((ms / 1000) * fps); // ms → frame

// ── Spring helper ────────────────────────────────────────────────
function sp(frame, from, config = {}) {
  return spring({ frame: frame - from, fps, config: { damping: 14, stiffness: 180, mass: 0.8, ...config } });
}

// ── Fade helper ──────────────────────────────────────────────────
function fade(frame, from, dur = 8) {
  return interpolate(frame, [from, from + dur], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
}

// ── ScaleY panel open ────────────────────────────────────────────
function scaleY(frame, from) {
  const s = sp(frame, from, { damping: 18, stiffness: 200 });
  return interpolate(s, [0, 1], [0, 1]);
}

// ── SMIT SIR SVG ─────────────────────────────────────────────────
function SmitSir({ style, grin = false }) {
  return (
    <svg viewBox="0 0 140 260" style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M45,110 L18,260 L65,260 L70,158 L75,260 L122,260 L95,110 Z" fill="#1a1a1a"/>
      <path d="M55,108 L45,130 L70,145 L95,130 L85,108 Z" fill="#2a2a2a" stroke="#111" strokeWidth="1.5"/>
      <rect x="62" y="108" width="16" height="52" fill="#f5f5f5" stroke="#111" strokeWidth="1.2"/>
      <path d="M67,112 L73,112 L71,152 L70,157 L69,152 Z" fill="#333"/>
      <rect x="62" y="92" width="16" height="20" rx="4" fill="#e8d5c0" stroke="#111" strokeWidth="1.5"/>
      <ellipse cx="70" cy="68" rx="32" ry="36" fill="#f0dfc8" stroke="#111" strokeWidth="2.5"/>
      <path d="M38,60 Q42,30 70,28 Q98,30 102,60 L100,52 Q95,22 70,20 Q45,22 40,52 Z" fill="#1a1a1a"/>
      <path d="M48,88 Q58,100 70,102 Q82,100 92,88 Q85,95 70,97 Q55,95 48,88 Z" fill="#1a1a1a"/>
      <rect x="44" y="62" width="24" height="14" rx="3" fill="#111" stroke="#333" strokeWidth="1.5"/>
      <rect x="72" y="62" width="24" height="14" rx="3" fill="#111" stroke="#333" strokeWidth="1.5"/>
      <line x1="68" y1="69" x2="72" y2="69" stroke="#333" strokeWidth="2"/>
      <line x1="48" y1="65" x2="54" y2="65" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      <line x1="76" y1="65" x2="82" y2="65" stroke="white" strokeWidth="1.5" opacity="0.7"/>
      {grin ? (
        <>
          <path d="M56,83 Q70,95 84,83" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
          <path d="M58,83 Q70,91 82,83" fill="white" stroke="none"/>
          <path d="M56,83 Q70,95 84,83 Q70,91 56,83 Z" fill="white"/>
          <path d="M56,83 L84,83" stroke="#1a1a1a" strokeWidth="1.5"/>
        </>
      ) : (
        <path d="M58,82 Q70,90 82,82" stroke="#7a5a40" strokeWidth="2.2" fill="none"/>
      )}
      <path d="M55,108 L62,108 L58,135 Z" fill="#f5f5f5" stroke="#111" strokeWidth="1.2"/>
      <path d="M85,108 L78,108 L82,135 Z" fill="#f5f5f5" stroke="#111" strokeWidth="1.2"/>
    </svg>
  );
}

// ── STUDENT SVG (shocked) ─────────────────────────────────────────
function StudentShocked({ style }) {
  return (
    <svg viewBox="0 0 110 200" style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M30,85 L15,200 L45,200 L50,130 L55,200 L85,200 L70,85 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <path d="M30,90 L5,130 L15,140 L35,108 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <path d="M70,90 L100,120 L92,132 L65,105 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <rect x="44" y="70" width="14" height="18" rx="3" fill="#e8d0b0" stroke="#111" strokeWidth="1.5"/>
      <ellipse cx="51" cy="48" rx="26" ry="30" fill="#f0dfc8" stroke="#111" strokeWidth="2.5"/>
      <path d="M25,42 Q28,18 51,15 Q74,18 77,42 L74,35 Q70,12 51,10 Q32,12 28,35 Z" fill="#1a1a1a"/>
      <path d="M25,38 L20,30 L26,42" fill="#1a1a1a"/>
      <path d="M77,38 L82,32 L76,44" fill="#1a1a1a"/>
      <path d="M30,28 L24,18" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M51,12 L51,4" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <path d="M72,28 L78,18" stroke="#1a1a1a" strokeWidth="3" strokeLinecap="round"/>
      <ellipse cx="40" cy="46" rx="9" ry="11" fill="white" stroke="#111" strokeWidth="2"/>
      <ellipse cx="62" cy="46" rx="9" ry="11" fill="white" stroke="#111" strokeWidth="2"/>
      <circle cx="40" cy="48" r="6" fill="#1a1a1a"/>
      <circle cx="62" cy="48" r="6" fill="#1a1a1a"/>
      <circle cx="38" cy="45" r="2" fill="white"/>
      <circle cx="60" cy="45" r="2" fill="white"/>
      <path d="M31,34 Q40,28 49,32" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      <path d="M53,32 Q62,28 71,34" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      <ellipse cx="51" cy="66" rx="8" ry="6" fill="#1a1a1a"/>
      <ellipse cx="51" cy="66" rx="6" ry="4" fill="#cc4444"/>
    </svg>
  );
}

// ── STUDENT SVG (happy) ───────────────────────────────────────────
function StudentHappy({ style }) {
  return (
    <svg viewBox="0 0 110 200" style={style} xmlns="http://www.w3.org/2000/svg">
      <path d="M30,85 L15,200 L45,200 L50,130 L55,200 L85,200 L70,85 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <path d="M30,90 L8,118 L18,128 L38,102 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <path d="M70,90 L98,115 L90,127 L63,104 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
      <rect x="44" y="70" width="14" height="18" rx="3" fill="#e8d0b0" stroke="#111" strokeWidth="1.5"/>
      <ellipse cx="51" cy="48" rx="26" ry="30" fill="#f0dfc8" stroke="#111" strokeWidth="2.5"/>
      <path d="M25,42 Q28,18 51,15 Q74,18 77,42 L74,35 Q70,12 51,10 Q32,12 28,35 Z" fill="#1a1a1a"/>
      <path d="M31,44 Q40,36 49,44" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <path d="M53,44 Q62,36 71,44" stroke="#1a1a1a" strokeWidth="3" fill="none" strokeLinecap="round"/>
      <ellipse cx="37" cy="54" rx="7" ry="4" fill="rgba(255,150,150,0.3)"/>
      <ellipse cx="65" cy="54" rx="7" ry="4" fill="rgba(255,150,150,0.3)"/>
      <path d="M38,62 Q51,76 64,62" stroke="#1a1a1a" strokeWidth="2.5" fill="none"/>
      <path d="M32,36 Q40,32 48,35" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
      <path d="M54,35 Q62,32 70,36" stroke="#1a1a1a" strokeWidth="2" fill="none"/>
    </svg>
  );
}

// ── HALFTONE bg ───────────────────────────────────────────────────
function Halftone({ opacity = 0.18 }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      backgroundImage: `radial-gradient(circle, rgba(0,0,0,${opacity}) 1.2px, transparent 1.2px)`,
      backgroundSize: '10px 10px',
    }} />
  );
}

// ── SPEED LINES ───────────────────────────────────────────────────
function SpeedLines({ cx, cy, count = 80, opacity = 0.12, color = '#111' }) {
  const lines = Array.from({ length: count }, (_, i) => {
    const a = (i / count) * Math.PI * 2;
    return { x2: cx + Math.cos(a) * 1200, y2: cy + Math.sin(a) * 1200 };
  });
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {lines.map((l, i) => (
        <line key={i} x1={cx} y1={cy} x2={l.x2} y2={l.y2}
          stroke={color} strokeWidth="0.8" opacity={opacity} />
      ))}
    </svg>
  );
}

// ── SPEECH BUBBLE ─────────────────────────────────────────────────
function Bubble({ children, style, tailPos = 'bottom-right', scale = 1 }) {
  const tailStyles = {
    'bottom-right': { bottom: -16, right: 20, borderWidth: '16px 0 0 10px', borderColor: '#111 transparent transparent transparent' },
    'bottom-left':  { bottom: -16, left: 20,  borderWidth: '16px 10px 0 0', borderColor: '#111 transparent transparent transparent' },
    'top-left':     { top: -16,    left: 20,  borderWidth: '0 10px 16px 0', borderColor: 'transparent #111 transparent transparent' },
  };
  return (
    <div style={{
      position: 'absolute',
      background: '#fff',
      border: '3px solid #111',
      borderRadius: 20,
      padding: '10px 18px',
      fontFamily: 'Bangers, Impact, cursive',
      fontSize: 28,
      letterSpacing: '0.04em',
      lineHeight: 1.2,
      textTransform: 'uppercase',
      whiteSpace: 'pre-line',
      boxShadow: '2px 2px 0 #111',
      transform: `scale(${scale})`,
      transformOrigin: 'bottom center',
      zIndex: 20,
      ...style,
    }}>
      {children}
      <div style={{
        position: 'absolute',
        width: 0, height: 0,
        borderStyle: 'solid',
        ...tailStyles[tailPos],
      }} />
    </div>
  );
}

// ── MAIN COMPONENT ────────────────────────────────────────────────
export function MangaAd() {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  // ── Panel timings ──────────────────────────────────────────────
  const P1_OPEN    = t(200);
  const P1_NARR    = t(600);
  const P1_C1      = t(1100);
  const P1_C2      = t(1500);
  const P1_BUB     = t(2000);
  const P1_SFX     = t(2400);
  const P1_LINES   = t(2700);

  const P2_OPEN    = t(4200);
  const P2_LINES   = t(4600);
  const P2_C1      = t(4800);
  const P2_C2      = t(5100);
  const P2_PAPERS  = t(5300);
  const P2_B1      = t(5600);
  const P2_B2      = t(6100);
  const P2_SPARK   = t(6500);

  const P3_OPEN    = t(8500);
  const P3_LINES   = t(8700);
  const P3_C1      = t(8900);
  const P3_C2      = t(9200);
  const P3_B1      = t(9600);
  const P3_B2      = t(10200);
  const P3_PAPER   = t(10700);

  const FIN        = t(13000);
  const FIN_PRE    = t(13600);
  const FIN_TITLE  = t(14000);
  const FIN_SUB    = t(14600);
  const FIN_URL    = t(15100);
  const FIN_HINT   = t(15700);

  const PANEL_W = width * 0.92;
  const PANEL_H = height * 0.27;
  const panelLeft = (width - PANEL_W) / 2;

  // Panel Y positions
  const GAP = 10;
  const P1_Y = 40;
  const P2_Y = P1_Y + PANEL_H + GAP;
  const P3_Y = P2_Y + PANEL_H + GAP;

  // Finale opacity
  const finOpacity = interpolate(frame, [FIN, FIN + 18], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <div style={{ width, height, background: '#111', fontFamily: 'Bangers, Impact, cursive', overflow: 'hidden', position: 'relative' }}>

      {/* ── MANGA PANELS ─────────────────────────────── */}
      <div style={{ position: 'absolute', inset: 0, opacity: finOpacity < 0.5 ? 1 : interpolate(frame, [FIN, FIN + 18], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }) }}>

        {/* ── PANEL 1 ── */}
        {(() => {
          const sy = scaleY(frame, P1_OPEN);
          return (
            <div style={{
              position: 'absolute', left: panelLeft, top: P1_Y,
              width: PANEL_W, height: PANEL_H,
              background: '#fafaf8', border: '4px solid #111',
              overflow: 'hidden', transformOrigin: 'top center',
              transform: `scaleY(${sy})`,
              opacity: fade(frame, P1_OPEN),
            }}>
              <Halftone />

              {/* Speed lines */}
              {frame >= P1_LINES && (
                <div style={{ opacity: fade(frame, P1_LINES), position: 'absolute', inset: 0 }}>
                  <SpeedLines cx={PANEL_W * 0.8} cy={PANEL_H * 0.5} count={60} />
                </div>
              )}

              {/* Characters */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', padding: '0 40px' }}>
                {/* Smit Sir */}
                <div style={{
                  transform: `translateY(${interpolate(sp(frame, P1_C1) , [0,1],[30,0])}px)`,
                  opacity: frame >= P1_C1 ? sp(frame, P1_C1) : 0,
                }}>
                  <SmitSir style={{ width: PANEL_W * 0.18, height: 'auto' }} />
                </div>
                <div style={{ flex: 1 }} />
                {/* Student */}
                <div style={{
                  transform: `translateY(${interpolate(sp(frame, P1_C2), [0,1],[30,0])}px)`,
                  opacity: frame >= P1_C2 ? sp(frame, P1_C2) : 0,
                }}>
                  <StudentShocked style={{ width: PANEL_W * 0.14, height: 'auto' }} />
                </div>
              </div>

              {/* Narration box */}
              {frame >= P1_NARR && (
                <div style={{
                  position: 'absolute', top: 12, left: 12,
                  background: '#fafaf8', border: '3px solid #111',
                  padding: '8px 14px',
                  fontFamily: 'Bangers, cursive',
                  fontSize: 22, letterSpacing: '0.05em', lineHeight: 1.25,
                  textTransform: 'uppercase',
                  transform: `scale(${interpolate(sp(frame, P1_NARR), [0,1],[0.8,1])})`,
                  opacity: sp(frame, P1_NARR),
                  transformOrigin: 'top left',
                  zIndex: 20,
                }}>
                  SOME DAYS,<br />A SMALL ACT<br />CAN CHANGE<br />EVERYTHING.
                </div>
              )}

              {/* Speech bubble */}
              {frame >= P1_BUB && (
                <Bubble
                  tailPos="bottom-right"
                  scale={sp(frame, P1_BUB)}
                  style={{ top: 10, right: 16, fontSize: 22, opacity: sp(frame, P1_BUB) }}
                >
                  {"OH NO!\nI DON'T\nUNDERSTAND!"}
                </Bubble>
              )}

              {/* SFX */}
              {frame >= P1_SFX && (
                <div style={{
                  position: 'absolute', bottom: 10, left: '40%',
                  fontFamily: 'Bangers, cursive',
                  fontSize: 32, color: '#555',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  transform: `scale(${sp(frame, P1_SFX)}) rotate(-8deg)`,
                  opacity: sp(frame, P1_SFX),
                  WebkitTextStroke: '1.5px #111',
                  zIndex: 25,
                }}>
                  AAAH!!
                </div>
              )}
            </div>
          );
        })()}

        {/* ── PANEL 2 ── */}
        {frame >= P2_OPEN && (() => {
          const sy = scaleY(frame, P2_OPEN);
          return (
            <div style={{
              position: 'absolute', left: panelLeft, top: P2_Y,
              width: PANEL_W, height: PANEL_H,
              background: '#fafaf8', border: '4px solid #111',
              overflow: 'hidden', transformOrigin: 'top center',
              transform: `scaleY(${sy})`,
              opacity: fade(frame, P2_OPEN),
            }}>
              <Halftone opacity={0.09} />

              {/* Gold speed lines */}
              {frame >= P2_LINES && (
                <div style={{ opacity: fade(frame, P2_LINES), position: 'absolute', inset: 0 }}>
                  <SpeedLines cx={PANEL_W * 0.5} cy={PANEL_H * 0.5} count={50} opacity={0.07} color="#FFD700" />
                  {/* Glow center */}
                  <div style={{
                    position: 'absolute',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%,-50%)',
                    width: 300, height: 200,
                    background: 'radial-gradient(ellipse, rgba(255,251,220,0.45) 0%, transparent 70%)',
                  }} />
                </div>
              )}

              {/* Characters */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 30, padding: '0 30px' }}>
                <div style={{
                  transform: `translateY(${interpolate(sp(frame, P2_C1), [0,1],[30,0])}px)`,
                  opacity: frame >= P2_C1 ? sp(frame, P2_C1) : 0,
                }}>
                  <SmitSir style={{ width: PANEL_W * 0.17, height: 'auto' }} />
                </div>

                {/* Papers */}
                <div style={{
                  alignSelf: 'center',
                  opacity: frame >= P2_PAPERS ? interpolate(frame, [P2_PAPERS, P2_PAPERS + 10], [0, 1], { extrapolateRight: 'clamp' }) : 0,
                  transition: 'opacity 0.3s',
                }}>
                  <svg viewBox="0 0 80 60" style={{ width: PANEL_W * 0.09, height: 'auto' }}>
                    <rect x="5" y="5" width="70" height="50" rx="3" fill="#fff" stroke="#111" strokeWidth="2.5"/>
                    <rect x="2" y="2" width="70" height="50" rx="3" fill="#fafafa" stroke="#111" strokeWidth="2"/>
                    <line x1="14" y1="16" x2="66" y2="16" stroke="#bbb" strokeWidth="1.5"/>
                    <line x1="14" y1="24" x2="66" y2="24" stroke="#bbb" strokeWidth="1.5"/>
                    <line x1="14" y1="32" x2="50" y2="32" stroke="#bbb" strokeWidth="1.5"/>
                    <rect x="58" y="6" width="5" height="30" rx="2" fill="#FFD700" stroke="#111" strokeWidth="1.5" transform="rotate(20,60,20)"/>
                    <polygon points="58,33 63,33 60.5,40" fill="#111" transform="rotate(20,60,20)"/>
                  </svg>
                </div>

                <div style={{
                  transform: `translateY(${interpolate(sp(frame, P2_C2), [0,1],[30,0])}px)`,
                  opacity: frame >= P2_C2 ? sp(frame, P2_C2) : 0,
                }}>
                  <StudentHappy style={{ width: PANEL_W * 0.13, height: 'auto' }} />
                </div>
              </div>

              {/* Bubbles */}
              {frame >= P2_B1 && (
                <Bubble tailPos="bottom-right" scale={sp(frame, P2_B1)}
                  style={{ top: 10, left: 16, fontSize: 24, opacity: sp(frame, P2_B1) }}>
                  {"LET ME\nHELP."}
                </Bubble>
              )}
              {frame >= P2_B2 && (
                <Bubble tailPos="bottom-left" scale={sp(frame, P2_B2)}
                  style={{ top: 10, right: 16, fontSize: 24, opacity: sp(frame, P2_B2) }}>
                  {"THANK\nYOU!"}
                </Bubble>
              )}

              {/* Sparkles */}
              {frame >= P2_SPARK && (
                <div style={{
                  position: 'absolute', bottom: 12, left: '50%',
                  transform: 'translateX(-50%)',
                  fontFamily: 'Bangers, cursive',
                  fontSize: 26, color: '#FFD700',
                  WebkitTextStroke: '1px #111',
                  opacity: interpolate(frame, [P2_SPARK, P2_SPARK + 8], [0, 1], { extrapolateRight: 'clamp' }),
                  letterSpacing: 8,
                }}>
                  ✦ ✦ ✦ ✦ ✦
                </div>
              )}
            </div>
          );
        })()}

        {/* ── PANEL 3 ── */}
        {frame >= P3_OPEN && (() => {
          const sy = scaleY(frame, P3_OPEN);
          return (
            <div style={{
              position: 'absolute', left: panelLeft, top: P3_Y,
              width: PANEL_W, height: PANEL_H,
              background: '#fafaf8', border: '4px solid #111',
              overflow: 'hidden', transformOrigin: 'top center',
              transform: `scaleY(${sy})`,
              opacity: fade(frame, P3_OPEN),
            }}>
              <Halftone />

              {frame >= P3_LINES && (
                <div style={{ opacity: fade(frame, P3_LINES), position: 'absolute', inset: 0 }}>
                  <SpeedLines cx={PANEL_W * 0.5} cy={PANEL_H * 0.5} count={70} opacity={0.15} />
                </div>
              )}

              {/* Characters */}
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 30px' }}>
                {/* Student from behind */}
                <div style={{
                  opacity: frame >= P3_C1 ? sp(frame, P3_C1) : 0,
                  transform: `translateY(${interpolate(frame >= P3_C1 ? sp(frame, P3_C1) : 0, [0,1],[30,0])}px)`,
                }}>
                  <svg viewBox="0 0 90 220" style={{ width: PANEL_W * 0.12, height: 'auto' }} xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="45" cy="55" rx="30" ry="34" fill="#f0dfc8" stroke="#111" strokeWidth="2.5"/>
                    <path d="M15,50 Q18,20 45,16 Q72,20 75,50 L72,42 Q68,14 45,12 Q22,14 18,42 Z" fill="#1a1a1a"/>
                    <line x1="8" y1="30" x2="2" y2="22" stroke="#111" strokeWidth="2"/>
                    <line x1="5" y1="50" x2="-2" y2="48" stroke="#111" strokeWidth="2"/>
                    <line x1="10" y1="70" x2="3" y2="76" stroke="#111" strokeWidth="2"/>
                    <path d="M25,88 L8,220 L40,220 L45,138 L50,220 L82,220 L65,88 Z" fill="#e8e8e8" stroke="#111" strokeWidth="2"/>
                    <rect x="38" y="68" width="14" height="22" rx="3" fill="#e8d0b0" stroke="#111" strokeWidth="1.5"/>
                  </svg>
                </div>

                {/* Smit Sir grinning */}
                <div style={{
                  opacity: frame >= P3_C2 ? sp(frame, P3_C2) : 0,
                  transform: `translateY(${interpolate(frame >= P3_C2 ? sp(frame, P3_C2) : 0, [0,1],[30,0])}px)`,
                }}>
                  <SmitSir style={{ width: PANEL_W * 0.17, height: 'auto' }} grin />
                </div>
              </div>

              {/* Paper / Certificate */}
              {frame >= P3_PAPER && (
                <div style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: `translate(-50%, -50%) rotate(5deg) scale(${interpolate(sp(frame, P3_PAPER), [0,1],[0.6,1])})`,
                  opacity: sp(frame, P3_PAPER),
                  background: '#fff',
                  border: '3px solid #111',
                  padding: '14px 22px',
                  textAlign: 'center',
                  fontFamily: 'Bangers, cursive',
                  fontSize: 22, lineHeight: 1.35,
                  letterSpacing: '0.04em',
                  boxShadow: '4px 4px 0 #111',
                  zIndex: 20,
                }}>
                  WELCOME<br />TO<br />
                  <span style={{ fontSize: '1.2em' }}>SMIT SIR</span><br />
                  <span style={{ color: '#c8a000' }}>COMMERCE!</span>
                  <div style={{ color: '#FFD700', fontSize: '1.3em', marginTop: 4, WebkitTextStroke: '1px #111' }}>★</div>
                </div>
              )}

              {/* Bubbles */}
              {frame >= P3_B1 && (
                <Bubble tailPos="bottom-right" scale={sp(frame, P3_B1)}
                  style={{ top: 10, left: 12, fontSize: 20, opacity: sp(frame, P3_B1) }}>
                  {"YOU'RE...\nMY NEW\nTEACHER?!"}
                </Bubble>
              )}
              {frame >= P3_B2 && (
                <Bubble tailPos="bottom-left" scale={sp(frame, P3_B2)}
                  style={{ top: 10, right: 12, fontSize: 20, opacity: sp(frame, P3_B2) }}>
                  {"YEP.\nLET'S DO\nGREAT THINGS."}
                </Bubble>
              )}

              {/* Stars near paper */}
              {frame >= P3_PAPER && (
                <div style={{
                  position: 'absolute', top: '30%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  color: '#FFD700', fontSize: 24,
                  WebkitTextStroke: '1px #111',
                  opacity: interpolate(frame, [P3_PAPER, P3_PAPER + 8], [0, 1], { extrapolateRight: 'clamp' }),
                  letterSpacing: 6,
                  zIndex: 25,
                }}>✦✦✦</div>
              )}
            </div>
          );
        })()}
      </div>

      {/* ── FINALE ──────────────────────────────────── */}
      {frame >= FIN && (
        <div style={{
          position: 'absolute', inset: 0,
          background: '#0d0d0d',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          opacity: finOpacity,
          zIndex: 80,
        }}>
          {/* Halftone dots */}
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '14px 14px',
          }} />

          {/* Speed lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            {Array.from({ length: 120 }, (_, i) => {
              const a = (i / 120) * Math.PI * 2;
              return (
                <line key={i}
                  x1={width / 2 + Math.cos(a) * 100}
                  y1={height / 2 + Math.sin(a) * 100}
                  x2={width / 2 + Math.cos(a) * 1400}
                  y2={height / 2 + Math.sin(a) * 1400}
                  stroke={`rgba(255,215,0,${0.01 + (i % 3) * 0.01})`}
                  strokeWidth={0.5 + (i % 2)}
                />
              );
            })}
          </svg>

          {/* "Meet Your Sensei" */}
          {frame >= FIN_PRE && (
            <div style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 26,
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              color: 'rgba(255,215,0,0.55)',
              marginBottom: 16,
              opacity: sp(frame, FIN_PRE),
              transform: `translateY(${interpolate(sp(frame, FIN_PRE), [0,1],[16,0])}px)`,
              position: 'relative', zIndex: 1,
            }}>
              ✦ Meet Your Sensei ✦
            </div>
          )}

          {/* Main title */}
          {frame >= FIN_TITLE && (
            <div style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 120,
              letterSpacing: '0.06em',
              textAlign: 'center',
              lineHeight: 0.9,
              opacity: sp(frame, FIN_TITLE),
              transform: `scale(${interpolate(sp(frame, FIN_TITLE), [0,1],[0.7,1])})`,
              position: 'relative', zIndex: 1,
            }}>
              <div style={{ color: '#fff', WebkitTextStroke: '2px rgba(255,255,255,0.2)' }}>SMIT SIR</div>
              <div style={{
                background: 'linear-gradient(135deg, #FFD700, #FFF0A0, #FFD700)',
                backgroundSize: '200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255,180,0,0.7))',
              }}>COMMERCE</div>
            </div>
          )}

          {/* Subtitle */}
          {frame >= FIN_SUB && (
            <div style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 28,
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.35)',
              textTransform: 'uppercase',
              marginTop: 16,
              opacity: sp(frame, FIN_SUB),
              transform: `translateY(${interpolate(sp(frame, FIN_SUB), [0,1],[16,0])}px)`,
              position: 'relative', zIndex: 1,
            }}>
              Mehsana's #1 Commerce Coaching
            </div>
          )}

          {/* URL button */}
          {frame >= FIN_URL && (
            <div style={{
              marginTop: 40,
              position: 'relative', zIndex: 1,
              opacity: sp(frame, FIN_URL),
              transform: `scale(${interpolate(sp(frame, FIN_URL, { stiffness: 260, damping: 18 }), [0,1],[0.7,1])})`,
            }}>
              <div style={{
                position: 'absolute', inset: -14,
                borderRadius: 100,
                background: 'radial-gradient(ellipse, rgba(255,215,0,0.3) 0%, transparent 65%)',
                filter: 'blur(10px)',
              }} />
              <div style={{
                position: 'relative', zIndex: 1,
                fontFamily: 'Bangers, cursive',
                fontSize: 28,
                letterSpacing: '0.06em',
                padding: '16px 60px',
                borderRadius: 100,
                color: '#000',
                background: 'linear-gradient(135deg, #FFD700, #FFF0A0, #FFD700)',
                boxShadow: '0 0 0 2px rgba(255,215,0,0.4), 4px 4px 0 rgba(0,0,0,0.5), 0 20px 50px rgba(255,180,0,0.3)',
              }}>
                smitsircommerce.vercel.app
              </div>
            </div>
          )}

          {/* Hint */}
          {frame >= FIN_HINT && (
            <div style={{
              fontFamily: 'Bangers, cursive',
              fontSize: 16, color: 'rgba(255,255,255,0.2)',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              marginTop: 18,
              opacity: sp(frame, FIN_HINT),
              transform: `translateY(${interpolate(sp(frame, FIN_HINT), [0,1],[12,0])}px)`,
              position: 'relative', zIndex: 1,
            }}>
              Free Account • Link in Bio • 30 Seconds
            </div>
          )}

          {/* Decorative stars */}
          {frame >= FIN_TITLE && [
            { top: '8%',  left: '8%',  size: 36, delay: 0   },
            { top: '12%', right: '10%',size: 48, delay: 4   },
            { bottom: '15%', left: '12%', size: 40, delay: 8  },
            { bottom: '10%', right: '8%', size: 36, delay: 6  },
          ].map((s, i) => (
            <div key={i} style={{
              position: 'absolute', ...s, size: undefined,
              fontFamily: 'Bangers, cursive',
              fontSize: s.size,
              color: '#FFD700',
              WebkitTextStroke: '1px #000',
              opacity: interpolate(frame, [FIN_TITLE + s.delay, FIN_TITLE + s.delay + 6], [0, 1], { extrapolateRight: 'clamp' }),
              transform: `scale(${interpolate(frame, [FIN_TITLE + s.delay, FIN_TITLE + s.delay + 6], [0, 1], { extrapolateRight: 'clamp' })})`,
              zIndex: 1,
            }}>
              {i % 2 === 0 ? '★' : '✦'}
            </div>
          ))}
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, height: 4,
        width: `${(frame / 480) * 100}%`,
        background: 'linear-gradient(90deg, #FFD700, #FF006E, #00D4FF)',
        boxShadow: '0 0 10px #FFD700',
        zIndex: 9999,
      }} />

      {/* ── NARRATION AUDIO ─────────────────────────────── */}
      {/* Panel 1: "Boards are tomorrow... and you haven't even started?" */}
      <Sequence from={P1_NARR} durationInFrames={137}>
        <Audio src={staticFile('audio/narr1.mp3')} volume={1} durationInSeconds={4.56} />
      </Sequence>

      {/* Panel 2: "Don't worry. Let Smit Sir explain it all... clearly." */}
      <Sequence from={P2_OPEN} durationInFrames={183}>
        <Audio src={staticFile('audio/narr2.mp3')} volume={1} durationInSeconds={6.09} />
      </Sequence>

      {/* Panel 3: "Welcome to Smit Sir Commerce!" */}
      <Sequence from={P3_OPEN} durationInFrames={95}>
        <Audio src={staticFile('audio/narr3.mp3')} volume={1} durationInSeconds={3.14} />
      </Sequence>

      {/* Finale: "Meet your sensei... Smit Sir." */}
      <Sequence from={FIN} durationInFrames={311}>
        <Audio src={staticFile('audio/narr4.mp3')} volume={1} durationInSeconds={10.35} />
      </Sequence>
    </div>
  );
}
