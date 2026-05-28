import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 3 – Concept (10–18s = 240 frames local)
// Split screen: LIMITED RESOURCES  vs  UNLIMITED WANTS → "This is SCARCITY."
export const Scene3Concept: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Split screen slide-in ──
  const leftX = interpolate(frame, [0, fps * 1], [-100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const rightX = interpolate(frame, [0, fps * 1], [100, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // ── Left panel (resources) items stagger in ──
  const leftItemsOpacity = (i: number) =>
    interpolate(frame, [fps * 1 + i * 8, fps * 1 + i * 8 + fps * 0.5], [0, 1], {
      extrapolateRight: "clamp",
    });

  // ── Right panel (wants) items stagger in ──
  const rightItemsOpacity = (i: number) =>
    interpolate(frame, [fps * 1.5 + i * 8, fps * 1.5 + i * 8 + fps * 0.5], [0, 1], {
      extrapolateRight: "clamp",
    });

  // ── "SCARCITY" big reveal at ~5s ──
  const scarcityScale = spring({
    frame: frame - fps * 5,
    fps,
    config: { damping: 12, stiffness: 120, mass: 1.5 },
    durationInFrames: fps * 1.2,
  });
  const scarcityOpacity = interpolate(frame, [fps * 5, fps * 5.5], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scarcityGlow = interpolate(frame, [fps * 5, fps * 8], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.sin),
  });

  // ── VS divider pulse ──
  const dividerGlow = interpolate(
    frame,
    [fps * 0.8, fps * 2, fps * 3.5, fps * 5],
    [0, 0.8, 0.4, 1],
    { extrapolateRight: "clamp" }
  );

  const leftItems = ["🌍 Land", "⚡ Energy", "💧 Water", "🌾 Food", "🛢️ Oil"];
  const rightItems = ["🏠 Housing", "📱 Gadgets", "🚗 Cars", "✈️ Travel", "💊 Medicine", "🎓 Education"];

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d001a 0%, #050010 100%)",
        overflow: "hidden",
      }}
    >
      {/* ── Left: LIMITED RESOURCES panel ── */}
      <AbsoluteFill
        style={{
          width: "49%",
          left: 0,
          background: "linear-gradient(135deg, #1a0033 0%, #0d0020 100%)",
          borderRight: "none",
          transform: `translateX(${leftX}%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4%",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(13px, 1.6vw, 24px)",
            fontWeight: 900,
            color: "#9966ff",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(153,102,255,0.6)",
            marginBottom: "8%",
            textAlign: "center",
          }}
        >
          Limited Resources
        </div>

        {/* Finite bar */}
        <FiniteBar frame={frame} fps={fps} />

        {/* Resource list */}
        <div style={{ marginTop: "8%", width: "100%" }}>
          {leftItems.map((item, i) => (
            <div
              key={item}
              style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: "clamp(12px, 1.5vw, 22px)",
                color: "#ccaaff",
                padding: "3% 0",
                borderBottom: "1px solid rgba(153,102,255,0.15)",
                opacity: leftItemsOpacity(i),
                transform: `translateX(${interpolate(
                  frame,
                  [fps * 1 + i * 8, fps * 1 + i * 8 + fps * 0.5],
                  [-20, 0],
                  { extrapolateRight: "clamp" }
                )}px)`,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* "FINITE" stamp */}
        <div
          style={{
            marginTop: "8%",
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(20px, 2.5vw, 40px)",
            fontWeight: 900,
            color: "#ff4444",
            border: "3px solid #ff4444",
            padding: "2% 8%",
            letterSpacing: "0.2em",
            opacity: interpolate(frame, [fps * 3.5, fps * 4.5], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `rotate(-8deg) scale(${interpolate(
              frame,
              [fps * 3.5, fps * 4.5],
              [1.3, 1],
              { extrapolateRight: "clamp" }
            )})`,
            textShadow: "0 0 20px rgba(255,68,68,0.5)",
          }}
        >
          FINITE
        </div>
      </AbsoluteFill>

      {/* ── VS Divider ── */}
      <AbsoluteFill
        style={{
          width: "2%",
          left: "49%",
          background: `linear-gradient(to bottom, transparent 0%, rgba(255,215,0,${dividerGlow}) 40%, rgba(255,215,0,${dividerGlow}) 60%, transparent 100%)`,
          boxShadow: `0 0 ${20 * dividerGlow}px rgba(255,215,0,0.5)`,
        }}
      />

      {/* ── Right: UNLIMITED WANTS panel ── */}
      <AbsoluteFill
        style={{
          width: "49%",
          right: 0,
          left: "51%",
          background: "linear-gradient(135deg, #1a0a00 0%, #0d0500 100%)",
          transform: `translateX(${rightX}%)`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "4%",
        }}
      >
        {/* Panel header */}
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(13px, 1.6vw, 24px)",
            fontWeight: 900,
            color: "#ffd700",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            textShadow: "0 0 20px rgba(255,215,0,0.6)",
            marginBottom: "8%",
            textAlign: "center",
          }}
        >
          Unlimited Wants
        </div>

        {/* Infinite bar */}
        <InfiniteBar frame={frame} fps={fps} />

        {/* Want list */}
        <div style={{ marginTop: "8%", width: "100%" }}>
          {rightItems.map((item, i) => (
            <div
              key={item}
              style={{
                fontFamily: "'Arial', sans-serif",
                fontSize: "clamp(11px, 1.4vw, 20px)",
                color: "#ffe0aa",
                padding: "2.5% 0",
                borderBottom: "1px solid rgba(255,215,0,0.15)",
                opacity: rightItemsOpacity(i),
                transform: `translateX(${interpolate(
                  frame,
                  [fps * 1.5 + i * 8, fps * 1.5 + i * 8 + fps * 0.5],
                  [20, 0],
                  { extrapolateRight: "clamp" }
                )}px)`,
                textAlign: "center",
              }}
            >
              {item}
            </div>
          ))}
        </div>

        {/* "INFINITE ∞" stamp */}
        <div
          style={{
            marginTop: "8%",
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(20px, 2.5vw, 40px)",
            fontWeight: 900,
            color: "#ffd700",
            border: "3px solid #ffd700",
            padding: "2% 8%",
            letterSpacing: "0.15em",
            opacity: interpolate(frame, [fps * 4, fps * 5], [0, 1], {
              extrapolateRight: "clamp",
            }),
            transform: `rotate(6deg) scale(${interpolate(
              frame,
              [fps * 4, fps * 5],
              [1.3, 1],
              { extrapolateRight: "clamp" }
            )})`,
            textShadow: "0 0 20px rgba(255,215,0,0.5)",
          }}
        >
          INFINITE ∞
        </div>
      </AbsoluteFill>

      {/* ── SCARCITY reveal – full-width overlay at the end ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          opacity: scarcityOpacity,
          pointerEvents: "none",
        }}
      >
        {/* Dark backdrop */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
          }}
        />

        <div style={{ position: "relative", textAlign: "center" }}>
          <div
            style={{
              fontFamily: "'Arial Black', 'Impact', sans-serif",
              fontSize: "clamp(52px, 8vw, 140px)",
              fontWeight: 900,
              color: "#ffd700",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transform: `scale(${scarcityScale})`,
              textShadow: `0 0 ${60 * scarcityGlow}px rgba(255,215,0,0.9), 0 0 ${30 * scarcityGlow}px rgba(255,215,0,0.5), 0 8px 30px rgba(0,0,0,0.9)`,
              WebkitTextStroke: "2px rgba(255,180,0,0.8)",
            }}
          >
            SCARCITY
          </div>
          <div
            style={{
              fontFamily: "'Georgia', serif",
              fontSize: "clamp(16px, 2.2vw, 34px)",
              color: "#e8d5ff",
              letterSpacing: "0.12em",
              marginTop: "10px",
              fontStyle: "italic",
              opacity: interpolate(frame, [fps * 6, fps * 7], [0, 1], {
                extrapolateRight: "clamp",
              }),
              textShadow: "0 0 20px rgba(180,80,255,0.6)",
            }}
          >
            This is what controls every civilization.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// ── Finite bar – fills to a point then stops ─────────────────────────────
const FiniteBar: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fill = interpolate(frame, [fps * 0.5, fps * 2], [0, 65], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  return (
    <div style={{ width: "100%", padding: "0 4%" }}>
      <div
        style={{
          height: 14,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill}%`,
            background: "linear-gradient(to right, #9966ff, #6633cc)",
            borderRadius: 7,
            boxShadow: "0 0 12px rgba(153,102,255,0.6)",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'Arial', sans-serif",
          fontSize: "clamp(10px, 1.2vw, 16px)",
          color: "#9966ff",
          marginTop: 6,
          textAlign: "right",
        }}
      >
        65% used — supply dwindling
      </div>
    </div>
  );
};

// ── Infinite bar – keeps filling beyond 100% (overflow clipped) ──────────
const InfiniteBar: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const fill = interpolate(frame, [fps * 0.5, fps * 3], [0, 130], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  return (
    <div style={{ width: "100%", padding: "0 4%" }}>
      <div
        style={{
          height: 14,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 7,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${fill}%`,
            background: "linear-gradient(to right, #ffd700, #ff8c00)",
            borderRadius: 7,
            boxShadow: "0 0 12px rgba(255,215,0,0.6)",
          }}
        />
      </div>
      <div
        style={{
          fontFamily: "'Arial', sans-serif",
          fontSize: "clamp(10px, 1.2vw, 16px)",
          color: "#ffd700",
          marginTop: 6,
          textAlign: "right",
        }}
      >
        ∞ growing — no ceiling
      </div>
    </div>
  );
};
