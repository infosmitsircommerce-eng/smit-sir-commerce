import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming, springTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { Scene1Hook } from "./scenes/Scene1Hook";
import { Scene2Problem } from "./scenes/Scene2Problem";
import { Scene3Concept } from "./scenes/Scene3Concept";
import { Scene4Teaching } from "./scenes/Scene4Teaching";
import { Scene5Punch } from "./scenes/Scene5Punch";
import { Scene6Takeaway } from "./scenes/Scene6Takeaway";

// ─────────────────────────────────────────────────────────────────────────────
//  THANOS TEACHES SCARCITY
//  Total: ~45s @ 30fps = 1350 frames
//
//  Scene timing (before transition overlap):
//  Scene 1 – Hook        0–4s    = 120 frames
//  Scene 2 – Problem     4–10s   = 180 frames
//  Scene 3 – Concept     10–18s  = 240 frames
//  Scene 4 – Teaching    18–26s  = 240 frames
//  Scene 5 – Punch       26–35s  = 270 frames
//  Scene 6 – Takeaway    35–45s  = 300 frames
//  Total raw: 1350 frames
//  5 transitions × 15 frames overlap = −75 frames
//  Final duration: 1275 frames ≈ 42.5s
//
//  Horizontal (1920×1080) composition — see Root.tsx for vertical variant
// ─────────────────────────────────────────────────────────────────────────────

export const TRANSITION_FRAMES = 15;

const fade15 = () => linearTiming({ durationInFrames: TRANSITION_FRAMES });
const snapTransition = () => springTiming({ config: { damping: 200 }, durationInFrames: 20 });

export const ThanosEconomicsHorizontal: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        {/* ── Scene 1: Hook ── */}
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene1Hook />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fade15()}
        />

        {/* ── Scene 2: Problem ── */}
        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene2Problem />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={fade15()}
        />

        {/* ── Scene 3: Concept ── */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene3Concept />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fade15()}
        />

        {/* ── Scene 4: Teaching ── */}
        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene4Teaching />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={fade15()}
        />

        {/* ── Scene 5: Punch / Snap ── */}
        <TransitionSeries.Sequence durationInFrames={270}>
          <Scene5Punch />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={fade()}
          timing={snapTransition()}
        />

        {/* ── Scene 6: Takeaway ── */}
        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene6Takeaway />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};

// ── Vertical composition (1080×1920) — same scenes, just reframed ────────
export const ThanosEconomicsVertical: React.FC = () => {
  // Reuses the same scene components; the scenes use clamp() for font sizes
  // and percentage-based layouts so they adapt to 9:16 without code changes.
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={120}>
          <Scene1Hook />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fade15()} />

        <TransitionSeries.Sequence durationInFrames={180}>
          <Scene2Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-left" })} timing={fade15()} />

        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene3Concept />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fade15()} />

        <TransitionSeries.Sequence durationInFrames={240}>
          <Scene4Teaching />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={fade15()} />

        <TransitionSeries.Sequence durationInFrames={270}>
          <Scene5Punch />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={snapTransition()} />

        <TransitionSeries.Sequence durationInFrames={300}>
          <Scene6Takeaway />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
