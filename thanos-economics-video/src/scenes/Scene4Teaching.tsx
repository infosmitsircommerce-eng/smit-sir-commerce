import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 4 – Teaching (18–26s = 240 frames local)
// Thanos explains: choice → opportunity cost → decision tree
export const Scene4Teaching: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Thanos enters from left (match cut from Scene 3) ──
  const thanosX = interpolate(frame, [0, fps * 1], [-15, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const thanosOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Dialogue line 1: "Every choice has a cost…" ──
  const line1Progress = interpolate(frame, [fps * 1, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.sin),
  });

  // ── Opportunity Cost diagram slides up ──
  const diagramY = interpolate(frame, [fps * 2.5, fps * 3.8], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const diagramOpacity = interpolate(frame, [fps * 2.5, fps * 3.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── "OPPORTUNITY COST" label slam ──
  const ocScale = spring({
    frame: frame - fps * 4,
    fps,
    config: { damping: 10, stiffness: 150 },
    durationInFrames: fps * 1,
  });
  const ocOpacity = interpolate(frame, [fps * 4, fps * 4.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Line 2: "…decides everything." ──
  const line2Opacity = interpolate(frame, [fps * 5.5, fps * 6.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const line2Y = interpolate(frame, [fps * 5.5, fps * 6.5], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Gauntlet glow pulses as he talks ──
  const gauntletGlow = interpolate(
    frame,
    [fps * 1.5, fps * 2.5, fps * 3.5, fps * 4.5, fps * 5.5],
    [0.2, 0.8, 0.3, 0.9, 0.4],
    { extrapolateRight: "clamp" }
  );

  const choices = [
    { label: "Buy food", cost: "Give up phone" },
    { label: "Study now", cost: "Give up Netflix" },
    { label: "Build factory", cost: "Give up forest" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 30% 60%, #1a0a2e 0%, #050008 70%)",
        overflow: "hidden",
      }}
    >
      {/* ── Subtle grid / depth lines ── */}
      <GridOverlay />

      {/* ── Purple-gold ambient glow ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 50% 70% at 28% 65%, rgba(120,0,200,${gauntletGlow * 0.3}) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Content layout ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          padding: "4%",
          gap: "3%",
        }}
      >
        {/* Left: Thanos presence strip */}
        <div
          style={{
            width: "28%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            opacity: thanosOpacity,
            transform: `translateX(${thanosX}%)`,
          }}
        >
          {/* Gauntlet glow */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(255,215,0,${gauntletGlow * 0.8}) 0%, transparent 70%)`,
              marginBottom: 16,
            }}
          />
          <ThanosGauntletIcon glow={gauntletGlow} />
        </div>

        {/* Right: Teaching content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "6%",
          }}
        >
          {/* Line 1 */}
          <p
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(20px, 2.8vw, 44px)",
              color: "#e8d5ff",
              letterSpacing: "0.04em",
              textShadow: "0 0 30px rgba(180,80,255,0.6), 0 4px 16px rgba(0,0,0,0.9)",
              fontStyle: "italic",
              fontWeight: 700,
              margin: 0,
              opacity: line1Progress,
              transform: `translateY(${interpolate(
                line1Progress,
                [0, 1],
                [20, 0]
              )}px)`,
            }}
          >
            "Every choice has a cost…"
          </p>

          {/* Opportunity cost diagram */}
          <div
            style={{
              opacity: diagramOpacity,
              transform: `translateY(${diagramY}px)`,
            }}
          >
            {/* "OPPORTUNITY COST" label */}
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: "clamp(14px, 1.8vw, 28px)",
                fontWeight: 900,
                color: "#ffd700",
                letterSpacing: "0.12em",
                textShadow: "0 0 20px rgba(255,215,0,0.7)",
                marginBottom: "4%",
                transform: `scale(${ocScale})`,
                opacity: ocOpacity,
              }}
            >
              OPPORTUNITY COST
            </div>

            {/* Choice → cost cards */}
            {choices.map((c, i) => (
              <ChoiceCard
                key={c.label}
                choice={c.label}
                cost={c.cost}
                opacity={interpolate(
                  frame,
                  [fps * 3 + i * fps * 0.5, fps * 3 + i * fps * 0.5 + fps * 0.6],
                  [0, 1],
                  { extrapolateRight: "clamp" }
                )}
                slideX={interpolate(
                  frame,
                  [fps * 3 + i * fps * 0.5, fps * 3 + i * fps * 0.5 + fps * 0.6],
                  [30, 0],
                  { extrapolateRight: "clamp" }
                )}
              />
            ))}
          </div>

          {/* Line 2 */}
          <p
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(20px, 2.8vw, 44px)",
              color: "#ffe8aa",
              letterSpacing: "0.04em",
              textShadow: "0 0 30px rgba(255,215,0,0.6), 0 4px 16px rgba(0,0,0,0.9)",
              fontStyle: "italic",
              fontWeight: 700,
              margin: 0,
              opacity: line2Opacity,
              transform: `translateY(${line2Y}px)`,
            }}
          >
            "…opportunity cost decides everything."
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Choice Card ───────────────────────────────────────────────────────────
const ChoiceCard: React.FC<{
  choice: string;
  cost: string;
  opacity: number;
  slideX: number;
}> = ({ choice, cost, opacity, slideX }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "2.5%",
      opacity,
      transform: `translateX(${slideX}px)`,
    }}
  >
    <div
      style={{
        background: "rgba(153,102,255,0.2)",
        border: "1px solid rgba(153,102,255,0.4)",
        borderRadius: 8,
        padding: "6px 14px",
        fontFamily: "'Arial', sans-serif",
        fontSize: "clamp(11px, 1.4vw, 20px)",
        color: "#ccaaff",
        whiteSpace: "nowrap",
      }}
    >
      ✅ {choice}
    </div>
    <div style={{ color: "#ffd700", fontSize: "clamp(14px, 1.8vw, 26px)", fontWeight: 900 }}>
      →
    </div>
    <div
      style={{
        background: "rgba(255,100,0,0.15)",
        border: "1px solid rgba(255,100,0,0.35)",
        borderRadius: 8,
        padding: "6px 14px",
        fontFamily: "'Arial', sans-serif",
        fontSize: "clamp(11px, 1.4vw, 20px)",
        color: "#ffaa66",
        whiteSpace: "nowrap",
      }}
    >
      ❌ {cost}
    </div>
  </div>
);

// ── Thanos Gauntlet Icon ──────────────────────────────────────────────────
const ThanosGauntletIcon: React.FC<{ glow: number }> = ({ glow }) => (
  <svg
    width="120"
    height="180"
    viewBox="0 0 120 180"
    style={{ filter: `drop-shadow(0 0 ${20 * glow}px rgba(255,215,0,0.8))` }}
  >
    <defs>
      <radialGradient id="gloveGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#d4a017" />
        <stop offset="100%" stopColor="#7a5c00" />
      </radialGradient>
    </defs>
    {/* Arm */}
    <rect x="40" y="100" width="40" height="60" rx="8" fill="#8b6914" />
    {/* Palm */}
    <rect x="28" y="70" width="64" height="50" rx="12" fill="url(#gloveGrad)" />
    {/* Fingers */}
    {[0, 1, 2, 3].map((i) => (
      <rect key={i} x={30 + i * 16} y="45" width="12" height="32" rx="6" fill="#c49a14" />
    ))}
    {/* Thumb */}
    <rect x="10" y="75" width="20" height="28" rx="8" fill="#c49a14" />
    {/* Stones row 1 */}
    <ellipse cx="38" cy="82" rx="8" ry="6" fill="#4fc3f7" />
    <ellipse cx="55" cy="78" rx="8" ry="6" fill="#ef5350" />
    <ellipse cx="72" cy="82" rx="8" ry="6" fill="#ffee58" />
    {/* Stones row 2 */}
    <ellipse cx="47" cy="94" rx="8" ry="6" fill="#66bb6a" />
    <ellipse cx="64" cy="94" rx="8" ry="6" fill="#ab47bc" />
    {/* Center orange */}
    <ellipse cx="55" cy="105" rx="8" ry="6" fill="#ff7043" />
  </svg>
);

// ── Subtle depth grid ─────────────────────────────────────────────────────
const GridOverlay: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `
        linear-gradient(rgba(153,102,255,0.04) 1px, transparent 1px),
        linear-gradient(90deg, rgba(153,102,255,0.04) 1px, transparent 1px)
      `,
      backgroundSize: "80px 80px",
      pointerEvents: "none",
    }}
  />
);
