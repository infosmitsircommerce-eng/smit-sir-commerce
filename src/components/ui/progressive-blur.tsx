import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressiveBlurProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "left" | "right" | "top" | "bottom";
  blurIntensity?: number;
};

const masks = {
  left: "linear-gradient(to right, black 0%, transparent 100%)",
  right: "linear-gradient(to left, black 0%, transparent 100%)",
  top: "linear-gradient(to bottom, black 0%, transparent 100%)",
  bottom: "linear-gradient(to top, black 0%, transparent 100%)",
};

export function ProgressiveBlur({
  direction = "left",
  blurIntensity = 1,
  className,
  style,
  ...props
}: ProgressiveBlurProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none", className)}
      style={{
        backdropFilter: `blur(${Math.max(0, blurIntensity) * 10}px)`,
        WebkitBackdropFilter: `blur(${Math.max(0, blurIntensity) * 10}px)`,
        maskImage: masks[direction],
        WebkitMaskImage: masks[direction],
        ...style,
      }}
      {...props}
    />
  );
}
