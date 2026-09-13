import * as React from "react";
import { cn } from "@/lib/utils";

type InfiniteSliderProps = React.HTMLAttributes<HTMLDivElement> & {
  duration?: number;
  gap?: number;
  reverse?: boolean;
  pauseOnHover?: boolean;
};

export function InfiniteSlider({
  children,
  className,
  duration = 30,
  gap = 48,
  reverse = false,
  pauseOnHover = true,
  ...props
}: InfiniteSliderProps) {
  const style = {
    "--ssc-slider-duration": `${duration}s`,
    "--ssc-slider-gap": `${gap}px`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("ssc-infinite-slider overflow-hidden", pauseOnHover && "ssc-infinite-slider-pausable", className)}
      style={style}
      {...props}
    >
      <div className={cn("ssc-infinite-slider-track", reverse && "ssc-infinite-slider-reverse")}>
        <div className="ssc-infinite-slider-group">{children}</div>
        <div className="ssc-infinite-slider-group" aria-hidden="true">{children}</div>
      </div>
    </div>
  );
}
