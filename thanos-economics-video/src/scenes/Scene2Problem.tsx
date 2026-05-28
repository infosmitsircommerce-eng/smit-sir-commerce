import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from "remotion";

// Scene 2 – Problem (4–10s = 180 frames local)
// Chaos, overpopulation visuals, Thanos narrates the problem
export const Scene2Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Pulsing red-orange chaos overlay
  const chaosIntensity = interpolate(
    frame,
    [0, fps * 1, fps * 2, fps * 3, fps * 4, fps * 5, fps * 6],
    [0, 0.3, 0.15, 0.35, 0.2, 0.4, 0.25],
    { extrapolateRight: "clamp" }
  );

  // Background shifts from dark-purple to deep crimson
  const redMix = interpolate(frame, [0, fps * 3], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Counter-crowd numbers slam in
  const countScale = spring({
    frame: frame - fps * 1,
    fps,
    config: { damping: 8 }, // bouncy slam
    durationInFrames: fps * 0.8,
  });

  // Line 1 text: "Resources are limited…"
  const line1Opacity = interpolate(frame, [fps * 1.5, fps * 2.5], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.sin),
  });
  const line1X = interpolate(frame, [fps * 1.5, fps * 2.5], [-60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Line 2 text: "…desires are not."
  const line2Opacity = interpolate(frame, [fps * 3, fps * 4], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.sin),
  });
  const line2X = interpolate(frame, [fps * 3, fps * 4], [60, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Crowd icons pulsing scale
  const crowdPulse = interpolate(
    frame,
    [0, fps * 0.5, fps * 1, fps * 1.5, fps * 2],
    [1, 1.04, 1, 1.06, 1],
    { extrapolateRight: "clamp" }
  );

  const bgR = Math.round(interpolate(redMix, [0, 1], [26, 80]));
  const bgG = Math.round(interpolate(redMix, [0, 1], [10, 10]));
  const bgB = Math.round(interpolate(redMix, [0, 1], [46, 20]));

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 50% 50%, rgb(${bgR},${bgG},${bgB}) 0%, #000000 80%)`,
        overflow: "hidden",
      }}
    >
      {/* ── Chaos flash overlay ── */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 50% 50%, rgba(255,60,0,${chaosIntensity}) 0%, transparent 70%)`,
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      {/* ── Crowd of human icons (population overload visual) ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          opacity: 0.18,
          transform: `scale(${crowdPulse})`,
          padding: "5%",
        }}
      >
        {Array.from({ length: 120 }).map((_, i) => (
          <span
            key={i}
            style={{
              fontSize: "clamp(14px, 2vw, 22px)",
              color: i % 7 === 0 ? "#ff4444" : "#9966cc",
              margin: "2px",
              lineHeight: 1,
            }}
          >
            👤
          </span>
        ))}
      </AbsoluteFill>

      {/* ── Population counter slam ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          transform: `scale(${countScale})`,
          opacity: interpolate(frame, [fps * 1, fps * 1.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      >
        <div
          style={{
            fontFamily: "'Arial Black', sans-serif",
            fontSize: "clamp(52px, 7vw, 110px)",
            fontWeight: 900,
            color: "#ff4444",
            textShadow: "0 0 60px rgba(255,0,0,0.8), 0 0 20px rgba(255,0,0,0.5)",
            letterSpacing: "-0.02em",
          }}
        >
          8,000,000,000+
        </div>
      </AbsoluteFill>

      {/* ── Dialogue lines ── */}
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: "8%",
          gap: "16px",
        }}
      >
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(22px, 3vw, 46px)",
            color: "#ffcccc",
            letterSpacing: "0.05em",
            textShadow: "0 0 30px rgba(255,80,80,0.7), 0 4px 16px rgba(0,0,0,0.9)",
            textAlign: "center",
            maxWidth: "75%",
            fontStyle: "italic",
            fontWeight: 700,
            margin: 0,
            opacity: line1Opacity,
            transform: `translateX(${line1X}px)`,
          }}
        >
          "Resources are limited…"
        </p>
        <p
          style={{
            fontFamily: "'Georgia', serif",
            fontSize: "clamp(22px, 3vw, 46px)",
            color: "#ffe0e0",
            letterSpacing: "0.05em",
            textShadow: "0 0 30px rgba(255,80,80,0.7), 0 4px 16px rgba(0,0,0,0.9)",
            textAlign: "center",
            maxWidth: "75%",
            fontStyle: "italic",
            fontWeight: 700,
            margin: 0,
            opacity: line2Opacity,
            transform: `translateX(${line2X}px)`,
          }}
        >
          "…desires are not."
        </p>
      </AbsoluteFill>

      {/* ── Horizontal scan-line (cinematic tension) ── */}
      <ScanLine frame={frame} fps={fps} />
    </AbsoluteFill>
  );
};

const ScanLine: React.FC<{ frame: number; fps: number }> = ({ frame, fps }) => {
  const y = interpolate(frame, [0, fps * 6], [-2, 102], {
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `${y}%`,
        height: 2,
        background:
          "linear-gradient(to right, transparent, rgba(255,80,80,0.6), transparent)",
        pointerEvents: "none",
      }}
    />
  );
};
