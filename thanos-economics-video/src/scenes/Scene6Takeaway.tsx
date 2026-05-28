import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 6 – Takeaway (35–45s = 300 frames local)
// Students studying, motivational close, call to action
export const Scene6Takeaway: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Overall scene fade-in (bright contrast from snap darkness) ──
  const sceneOpacity = interpolate(frame, [0, fps * 0.8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Warm light sweeps in from left ──
  const lightX = interpolate(frame, [0, fps * 2], [-100, 50], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // ── Student cards stagger in ──
  const cardOpacity = (i: number) =>
    interpolate(
      frame,
      [fps * 1 + i * fps * 0.35, fps * 1 + i * fps * 0.35 + fps * 0.6],
      [0, 1],
      { extrapolateRight: "clamp" }
    );
  const cardY = (i: number) =>
    interpolate(
      frame,
      [fps * 1 + i * fps * 0.35, fps * 1 + i * fps * 0.35 + fps * 0.6],
      [40, 0],
      { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) }
    );

  // ── Main takeaway line ──
  const mainLineScale = spring({
    frame: frame - fps * 3,
    fps,
    config: { damping: 200 }, // smooth, no bounce — dignity
    durationInFrames: fps * 1.5,
  });
  const mainLineOpacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── "or be controlled by it" – delayed, italic, chilling ──
  const subLineOpacity = interpolate(frame, [fps * 5, fps * 6], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Final CBSE callout ──
  const cbseOpacity = interpolate(frame, [fps * 7, fps * 8], [0, 1], {
    extrapolateRight: "clamp",
  });
  const cbseScale = spring({
    frame: frame - fps * 7,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: fps * 1,
  });

  // ── Thanos quote fades in at very end ──
  const finalQuoteOpacity = interpolate(frame, [fps * 8.5, fps * 9.5], [0, 1], {
    extrapolateRight: "clamp",
  });

  const students = [
    { icon: "📚", label: "Resources", sub: "Land • Labour • Capital • Enterprise" },
    { icon: "⚖️", label: "Scarcity", sub: "Limited supply vs unlimited demand" },
    { icon: "💡", label: "Choice", sub: "Every decision has a trade-off" },
    { icon: "💰", label: "Opp. Cost", sub: "Value of the next best alternative" },
  ];

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 30%, #0d0020 0%, #000000 70%)",
        opacity: sceneOpacity,
        overflow: "hidden",
      }}
    >
      {/* ── Warm light sweep ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 80% at ${lightX}% 50%, rgba(255,215,0,0.08) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* ── Purple ambient ── */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse 100% 60% at 50% 0%, rgba(80,0,160,0.15) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Student concept cards ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          padding: "3%",
          gap: "2%",
          paddingTop: "6%",
          paddingBottom: "52%",
        }}
      >
        {students.map((s, i) => (
          <div
            key={s.label}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid rgba(${i % 2 === 0 ? "153,102,255" : "255,215,0"},0.3)`,
              borderRadius: 16,
              padding: "3% 4%",
              width: "44%",
              opacity: cardOpacity(i),
              transform: `translateY(${cardY(i)}px)`,
              boxShadow: `0 4px 30px rgba(${i % 2 === 0 ? "153,102,255" : "255,215,0"},0.1)`,
            }}
          >
            <div style={{ fontSize: "clamp(22px, 3vw, 40px)", marginBottom: 6 }}>
              {s.icon}
            </div>
            <div
              style={{
                fontFamily: "'Arial Black', sans-serif",
                fontSize: "clamp(13px, 1.6vw, 24px)",
                fontWeight: 900,
                color: i % 2 === 0 ? "#ccaaff" : "#ffd700",
                letterSpacing: "0.08em",
                marginBottom: 4,
              }}
            >
              {s.label}
            </div>
            <div
              style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: "clamp(10px, 1.2vw, 17px)",
                color: "#888899",
                lineHeight: 1.4,
              }}
            >
              {s.sub}
            </div>
          </div>
        ))}
      </AbsoluteFill>

      {/* ── Main takeaway block ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "6%",
          gap: "14px",
        }}
      >
        {/* Line 1 */}
        <p
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(24px, 3.5vw, 58px)",
            fontWeight: 900,
            color: "#ffd700",
            letterSpacing: "0.05em",
            textShadow: "0 0 40px rgba(255,215,0,0.7), 0 6px 20px rgba(0,0,0,0.9)",
            textAlign: "center",
            maxWidth: "80%",
            margin: 0,
            opacity: mainLineOpacity,
            transform: `scale(${mainLineScale})`,
          }}
        >
          Understand economics…
        </p>

        {/* Line 2 */}
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(20px, 2.8vw, 44px)",
            color: "#ff6666",
            letterSpacing: "0.04em",
            textShadow: "0 0 30px rgba(255,80,80,0.6), 0 4px 16px rgba(0,0,0,0.9)",
            fontStyle: "italic",
            fontWeight: 700,
            textAlign: "center",
            maxWidth: "80%",
            margin: 0,
            opacity: subLineOpacity,
          }}
        >
          …or be controlled by it.
        </p>

        {/* CBSE Economics stamp */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            opacity: cbseOpacity,
            transform: `scale(${cbseScale})`,
            marginTop: "6px",
          }}
        >
          <div
            style={{
              width: 3,
              height: 32,
              background: "#9966ff",
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(153,102,255,0.8)",
            }}
          />
          <span
            style={{
              fontFamily: "'Arial', sans-serif",
              fontSize: "clamp(11px, 1.4vw, 20px)",
              color: "#9966ff",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            CBSE Economics — Chapter 1: Introduction
          </span>
          <div
            style={{
              width: 3,
              height: 32,
              background: "#9966ff",
              borderRadius: 2,
              boxShadow: "0 0 10px rgba(153,102,255,0.8)",
            }}
          />
        </div>

        {/* Thanos final quote */}
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(12px, 1.4vw, 20px)",
            color: "rgba(180,140,255,0.6)",
            fontStyle: "italic",
            textAlign: "center",
            maxWidth: "70%",
            margin: 0,
            opacity: finalQuoteOpacity,
            letterSpacing: "0.06em",
          }}
        >
          "I am inevitable." — Thanos
          <span style={{ color: "rgba(255,215,0,0.5)", marginLeft: 8 }}>
            | "Scarcity is inevitable." — Economics
          </span>
        </p>
      </AbsoluteFill>

      {/* ── Top-right corner brand ── */}
      <div
        style={{
          position: "absolute",
          top: "3%",
          right: "3%",
          opacity: interpolate(frame, [fps * 1, fps * 2], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <InfinityStonesBadge />
      </div>
    </AbsoluteFill>
  );
};

// ── Six stones badge (brand element) ─────────────────────────────────────
const InfinityStonesBadge: React.FC = () => {
  const colors = ["#4fc3f7", "#ef5350", "#ffee58", "#66bb6a", "#ab47bc", "#ff7043"];
  return (
    <div style={{ display: "flex", gap: 5 }}>
      {colors.map((c, i) => (
        <div
          key={i}
          style={{
            width: 14,
            height: 10,
            borderRadius: 5,
            background: c,
            boxShadow: `0 0 8px ${c}`,
          }}
        />
      ))}
    </div>
  );
};
