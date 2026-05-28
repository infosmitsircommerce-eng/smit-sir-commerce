import React from "react";
import { Composition } from "remotion";
import { ThanosEconomicsHorizontal, ThanosEconomicsVertical } from "./ThanosEconomics";

// Total frames:
//   Raw: 120 + 180 + 240 + 240 + 270 + 300 = 1350 frames
//   Transitions: 5 × 15 = 75 (first 4) + 1 × 20 = 20 (snap) → −95 total
//   Spring snap transition getDurationInFrames at 30fps ≈ 20 frames
//   Final: 1350 − 75 − 20 = 1255 frames ≈ 41.8s
const TOTAL_FRAMES = 1255;
const FPS = 30;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* Horizontal (YouTube / Landscape) */}
      <Composition
        id="ThanosEconomics-Horizontal"
        component={ThanosEconomicsHorizontal}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1920}
        height={1080}
        defaultProps={{}}
      />

      {/* Vertical (Reels / Shorts / TikTok) */}
      <Composition
        id="ThanosEconomics-Vertical"
        component={ThanosEconomicsVertical}
        durationInFrames={TOTAL_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
        defaultProps={{}}
      />
    </>
  );
};
