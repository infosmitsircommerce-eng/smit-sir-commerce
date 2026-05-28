import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 5 – Punch (26–35s = 270 frames local)
// THE SNAP — dust particles, screen flash, "Balance is economic reality."
export const Scene5Punch: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Build-up: Thanos raises gauntlet ──
  const buildProgress = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // ── SNAP flash at 2.5s ──
  const snapFrame = fps * 2.5;
  const flashIntensity = interpolate(
    frame,
    [snapFrame - 2, snapFrame, snapFrame + 4, snapFrame + 12],
    [0, 1, 0.8, 0],
    { extrapolateRight: "clamp" }
  );

  // ── Screen shake ──
  const shakeX = frame >= snapFrame && frame <= snapFrame + 8
    ? Math.sin(frame * 2.8) * interpolate(frame, [snapFrame, snapFrame + 8], [14, 0], {
        extrapolateRight: "clamp",
      })
    : 0;
  const shakeY = frame >= snapFrame && frame <= snapFrame + 8
    ? Math.cos(frame * 3.2) * interpolate(frame, [snapFrame, snapFrame + 8], [8, 0], {
        extrapolateRight: "clamp",
      })
    : 0;

  // ── Dust/particle expansion ──
  const dustOpacity = interpolate(
    frame,
    [snapFrame, snapFrame + 5, snapFrame + fps * 1.5, snapFrame + fps * 3],
    [0, 0.9, 0.6, 0],
    { extrapolateRight: "clamp" }
  );
  const dustScale = interpolate(
    frame,
    [snapFrame, snapFrame + fps * 3],
    [0.5, 3],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // ── Text reveal after snap ──
  const line1Scale = spring({
    frame: frame - (snapFrame + fps * 0.3),
    fps,
    config: { damping: 12, stiffness: 200, mass: 1 },
    durationInFrames: fps * 1,
  });
  const line1Opacity = interpolate(
    frame,
    [snapFrame + fps * 0.3, snapFrame + fps * 0.8],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  const line2Opacity = interpolate(
    frame,
    [snapFrame + fps * 1.5, snapFrame + fps * 2.2],
    [0, 1],
    { extrapolateRight: "clamp" }
  );
  const line2Y = interpolate(
    frame,
    [snapFrame + fps * 1.5, snapFrame + fps * 2.2],
    [30, 0],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
  );

  // ── Background deepens to gold-black after snap ──
  const postSnapBg = interpolate(
    frame,
    [snapFrame, snapFrame + fps * 1],
    [0, 1],
    { extrapolateRight: "clamp" }
  );

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        transform: `translate(${shakeX}px, ${shakeY}px)`,
      }}
    >
      {/* ── Background ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%,
            rgba(${Math.round(30 + postSnapBg * 50)},${Math.round(10 + postSnapBg * 20)},0,1) 0%,
            #000000 75%)`,
        }}
      />

      {/* ── Pre-snap: gauntlet glow build-up ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 40% 40% at 50% 65%, rgba(255,215,0,${buildProgress * 0.4}) 0%, transparent 70%)`,
          opacity: 1 - postSnapBg * 0.5,
          pointerEvents: "none",
        }}
      />

      {/* ── Gauntlet visual ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: interpolate(frame, [0, fps * 0.5, snapFrame + fps * 0.5, snapFrame + fps * 1], [0, 1, 1, 0], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <GauntletLarge buildProgress={buildProgress} frame={frame} fps={fps} snapFrame={snapFrame} />
      </AbsoluteFill>

      {/* ── Snap FLASH ── */}
      <AbsoluteFill
        style={{
          background: `rgba(255,230,150,${flashIntensity})`,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Dust ring explosion ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: dustOpacity,
          transform: `scale(${dustScale})`,
          pointerEvents: "none",
        }}
      >
        <DustRing />
      </AbsoluteFill>

      {/* ── Disintegration particles ── */}
      <AbsoluteFill style={{ pointerEvents: "none", opacity: dustOpacity * 0.7 }}>
        <DustParticles frame={frame} fps={fps} snapFrame={snapFrame} />
      </AbsoluteFill>

      {/* ── Post-snap text ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        {/* "SNAP." impact word */}
        <div
          style={{
            fontFamily: "'Arial Black', 'Impact', sans-serif",
            fontSize: "clamp(70px, 10vw, 160px)",
            fontWeight: 900,
            color: "#ffd700",
            letterSpacing: "0.1em",
            textShadow: "0 0 80px rgba(255,215,0,0.9), 0 0 40px rgba(255,140,0,0.6)",
            transform: `scale(${line1Scale})`,
            opacity: line1Opacity,
          }}
        >
          SNAP.
        </div>

        {/* Main quote */}
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(20px, 2.8vw, 46px)",
            color: "#ffe8cc",
            letterSpacing: "0.06em",
            textShadow: "0 0 30px rgba(255,150,0,0.6), 0 4px 20px rgba(0,0,0,0.9)",
            textAlign: "center",
            maxWidth: "80%",
            fontStyle: "italic",
            fontWeight: 700,
            margin: 0,
            opacity: line2Opacity,
            transform: `translateY(${line2Y}px)`,
          }}
        >
          "Balance is not cruelty. Balance is economic reality."
        </p>

        {/* Sub-text */}
        <p
          style={{
            fontFamily: "'Arial', sans-serif",
            fontSize: "clamp(13px, 1.6vw, 24px)",
            color: "#ccaa88",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            margin: 0,
            opacity: interpolate(frame, [snapFrame + fps * 2.5, snapFrame + fps * 3], [0, 1], {
              extrapolateRight: "clamp",
            }),
          }}
        >
          When resources run out, choices run out.
        </p>
      </AbsoluteFill>

      {/* ── Vignette ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          pointerEvents: "none",
        }}
      />
    </AbsoluteFill>
  );
};

// ── Large gauntlet with stone glow animation ──────────────────────────────
const GauntletLarge: React.FC<{
  buildProgress: number;
  frame: number;
  fps: number;
  snapFrame: number;
}> = ({ buildProgress, frame, fps, snapFrame }) => {
  const stoneColors = ["#4fc3f7", "#ef5350", "#ffee58", "#66bb6a", "#ab47bc", "#ff7043"];
  const stoneGlow = interpolate(frame, [0, snapFrame], [0, 1], { extrapolateRight: "clamp" });

  return (
    <svg
      width="280"
      height="360"
      viewBox="0 0 280 360"
      style={{
        transform: `translateY(${interpolate(buildProgress, [0, 1], [20, -10])}px)`,
        filter: `drop-shadow(0 0 ${40 * stoneGlow}px rgba(255,215,0,0.8))`,
      }}
    >
      <defs>
        <radialGradient id="bigGloveGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#d4a017" />
          <stop offset="70%" stopColor="#8b6914" />
          <stop offset="100%" stopColor="#5a4400" />
        </radialGradient>
      </defs>
      {/* Arm */}
      <rect x="95" y="220" width="90" height="130" rx="18" fill="#7a5c00" />
      {/* Palm */}
      <rect x="55" y="140" width="170" height="110" rx="28" fill="url(#bigGloveGrad)" />
      {/* Fingers */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={65 + i * 40} y={85} width={28} height={70} rx={14} fill="#c49a14" />
      ))}
      {/* Thumb */}
      <rect x={20} y={158} width={42} height={58} rx={18} fill="#c49a14" />
      {/* Stones */}
      {stoneColors.map((color, i) => (
        <ellipse
          key={i}
          cx={75 + (i % 3) * 45}
          cy={152 + Math.floor(i / 3) * 36}
          rx={16}
          ry={11}
          fill={color}
          style={{
            filter: `drop-shadow(0 0 ${12 * stoneGlow}px ${color})`,
          }}
        />
      ))}
    </svg>
  );
};

// ── Dust ring SVG ─────────────────────────────────────────────────────────
const DustRing: React.FC = () => (
  <svg width="600" height="600" viewBox="0 0 600 600">
    {Array.from({ length: 36 }).map((_, i) => {
      const angle = (i / 36) * Math.PI * 2;
      const r = 200;
      const x = 300 + Math.cos(angle) * r;
      const y = 300 + Math.sin(angle) * r;
      const size = 3 + (i % 4) * 2;
      return (
        <circle key={i} cx={x} cy={y} r={size} fill="#ffd700" opacity={0.6 + (i % 3) * 0.1} />
      );
    })}
  </svg>
);

// ── Floating dust particles ───────────────────────────────────────────────
const DustParticles: React.FC<{
  frame: number;
  fps: number;
  snapFrame: number;
}> = ({ frame, fps, snapFrame }) => {
  const elapsed = frame - snapFrame;
  if (elapsed < 0) return null;

  return (
    <AbsoluteFill>
      {Array.from({ length: 60 }).map((_, i) => {
        const startX = 30 + (i * 73 % 640);
        const startY = 20 + (i * 47 % 320);
        const vx = ((i * 13 % 100) - 50) * 0.6;
        const vy = -((i * 17 % 80) + 20) * 0.4;
        const size = 2 + (i % 5);
        const delay = (i % 8) * 3;
        const t = Math.max(0, elapsed - delay) / fps;
        const x = startX + vx * t;
        const y = startY + vy * t + 0.5 * 200 * t * t; // gravity
        const particleOpacity = Math.max(0, 1 - t * 0.6);
        const color = i % 3 === 0 ? "#ffd700" : i % 3 === 1 ? "#ff8c00" : "#cc6600";

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: `${(x / 1920) * 100}%`,
              top: `${(y / 1080) * 100}%`,
              width: size,
              height: size,
              borderRadius: "50%",
              background: color,
              opacity: particleOpacity,
              boxShadow: `0 0 ${size * 2}px ${color}`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};
