import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 1 – Hook (0–4s = 120 frames)
// Dark universe, Thanos emerges from void, first line delivered
export const Scene1Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Slow vignette reveal – universe fading from pure black
  const bgOpacity = interpolate(frame, [0, fps * 1.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Star field parallax scale (subtle zoom-in creates depth)
  const starScale = interpolate(frame, [0, fps * 4], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  // Thanos silhouette fade-in (starts at 0.5s)
  const siloOpacity = interpolate(
    frame,
    [fps * 0.5, fps * 1.8],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.circle) }
  );

  // Thanos scale spring – materialises from darkness with weight
  const siloScale = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 15, stiffness: 80, mass: 2 }, // heavy entrance
    durationInFrames: fps * 2,
  });
  const siloScaleValue = interpolate(siloScale, [0, 1], [1.15, 1]);

  // Dialogue text reveal at 2.5s
  const textOpacity = interpolate(
    frame,
    [fps * 2.5, fps * 3.2],
    [0, 1],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.sin) }
  );
  const textY = interpolate(
    frame,
    [fps * 2.5, fps * 3.2],
    [24, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // Subtle purple nebula pulse
  const nebulaPulse = interpolate(
    frame,
    [0, fps * 2, fps * 4],
    [0.0, 0.18, 0.1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #000000 70%)",
        overflow: "hidden",
      }}
    >
      {/* ── Star field layer ── */}
      <AbsoluteFill
        style={{
          opacity: bgOpacity,
          transform: `scale(${starScale})`,
        }}
      >
        <StarField seed={42} count={200} />
      </AbsoluteFill>

      {/* ── Purple nebula glow behind Thanos ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 50% at 50% 55%, rgba(128,0,255,${nebulaPulse}) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Thanos Silhouette ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          paddingBottom: "6%",
          opacity: siloOpacity,
          transform: `scale(${siloScaleValue})`,
        }}
      >
        <ThanosSilhouette />
      </AbsoluteFill>

      {/* ── Gauntlet rim-light edge ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 30% 20% at 62% 68%, rgba(255,180,0,0.22) 0%, transparent 70%)",
          opacity: siloOpacity,
          pointerEvents: "none",
        }}
      />

      {/* ── Dialogue ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingTop: "8%",
          opacity: textOpacity,
          transform: `translateY(${textY}px)`,
        }}
      >
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(28px, 4vw, 58px)",
            color: "#e8d5ff",
            letterSpacing: "0.06em",
            textShadow: "0 0 40px rgba(180,80,255,0.8), 0 4px 20px rgba(0,0,0,0.9)",
            textAlign: "center",
            maxWidth: "80%",
            fontStyle: "italic",
            fontWeight: 700,
            margin: 0,
          }}
        >
          "The universe is not infinite…"
        </p>
      </AbsoluteFill>

      {/* ── Bottom vignette ── */}
      <AbsoluteFill
        style={{
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ── Inline SVG Thanos Silhouette ──────────────────────────────────────────
const ThanosSilhouette: React.FC = () => (
  <svg
    width="340"
    height="520"
    viewBox="0 0 340 520"
    style={{ filter: "drop-shadow(0 0 30px rgba(128,0,255,0.5))" }}
  >
    {/* Body silhouette – simplified but recognisable */}
    <defs>
      <radialGradient id="bodyGlow" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#3a1a6e" />
        <stop offset="100%" stopColor="#0d0010" />
      </radialGradient>
      <radialGradient id="gauntletGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffd700" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#b8860b" stopOpacity="0.3" />
      </radialGradient>
    </defs>
    {/* Cape */}
    <ellipse cx="170" cy="480" rx="160" ry="60" fill="#1a0033" opacity="0.9" />
    {/* Torso */}
    <rect x="100" y="220" width="140" height="200" rx="20" fill="url(#bodyGlow)" />
    {/* Shoulders – massive */}
    <ellipse cx="80" cy="230" rx="55" ry="40" fill="#2a0a4e" />
    <ellipse cx="260" cy="230" rx="55" ry="40" fill="#2a0a4e" />
    {/* Neck */}
    <rect x="145" y="170" width="50" height="60" rx="10" fill="#1e0840" />
    {/* Head */}
    <ellipse cx="170" cy="140" rx="68" ry="78" fill="url(#bodyGlow)" />
    {/* Chin ridges */}
    <ellipse cx="170" cy="195" rx="38" ry="18" fill="#150630" />
    {/* Brow ridge */}
    <rect x="112" y="100" width="116" height="22" rx="11" fill="#0d0020" />
    {/* Eyes – faint glow */}
    <ellipse cx="145" cy="122" rx="14" ry="9" fill="#200050" />
    <ellipse cx="195" cy="122" rx="14" ry="9" fill="#200050" />
    {/* Infinity Gauntlet arm */}
    <rect x="245" y="340" width="45" height="100" rx="12" fill="#2a1a00" />
    <rect x="238" y="420" width="60" height="40" rx="10" fill="url(#gauntletGlow)" />
    {/* Stones */}
    <ellipse cx="248" cy="430" rx="7" ry="5" fill="#4fc3f7" opacity="0.9" />
    <ellipse cx="264" cy="424" rx="7" ry="5" fill="#ef5350" opacity="0.9" />
    <ellipse cx="280" cy="430" rx="7" ry="5" fill="#ffee58" opacity="0.9" />
    <ellipse cx="288" cy="444" rx="7" ry="5" fill="#66bb6a" opacity="0.9" />
    <ellipse cx="258" cy="448" rx="7" ry="5" fill="#ab47bc" opacity="0.9" />
    <ellipse cx="274" cy="440" rx="7" ry="5" fill="#ff7043" opacity="0.9" />
  </svg>
);

// ── Procedural Star Field ─────────────────────────────────────────────────
const StarField: React.FC<{ seed: number; count: number }> = ({ seed, count }) => {
  const stars = Array.from({ length: count }, (_, i) => {
    // Deterministic pseudo-random based on index + seed
    const x = ((seed * 13 + i * 97 + i * i * 3) % 1000) / 10;
    const y = ((seed * 7 + i * 61 + i * i * 11) % 1000) / 10;
    const size = (((seed + i * 17) % 30) / 10 + 0.5);
    const opacity = (((seed + i * 23) % 70) + 30) / 100;
    return { x, y, size, opacity };
  });

  return (
    <AbsoluteFill>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: "50%",
            background: "white",
            opacity: s.opacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
