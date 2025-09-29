"use client";

import React, { useId } from "react";
import { cn } from "../../lib/utils";

interface DotPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the dots.
   * @default 1
   */
  size?: number;
  /**
   * The spacing between dots.
   * @default 16
   */
  spacing?: number;
  /**
   * The color of the dots.
   * @default "currentColor"
   */
  color?: string;
  /**
   * The opacity of the dots.
   * @default 0.2
   */
  opacity?: number;
  /**
   * Whether to add a glow effect to the dots.
   * @default false
   */
  glow?: boolean;
  /**
   * The color of the glow effect.
   * @default "currentColor"
   */
  glowColor?: string;
  /**
   * The size of the glow effect.
   * @default 15
   */
  glowSize?: number;
}

export function DotPattern({
  className,
  size = 1,
  spacing = 16,
  color = "currentColor",
  opacity = 0.2,
  glow = false,
  glowColor,
  glowSize = 15,
  ...props
}: DotPatternProps) {
  // Generate a unique ID for each instance of the component
  const patternId = useId();
  const glowFilterId = useId();
  
  return (
    <div
      className={cn("absolute inset-0 -z-10 h-full w-full", className)}
      {...props}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100%"
        height="100%"
        className="absolute inset-0"
      >
        <defs>
          {glow && (
            <filter id={glowFilterId}>
              <feGaussianBlur stdDeviation={glowSize / 6} />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 0 0
                        0 0 0 1 0"
              />
              <feBlend in="SourceGraphic" />
            </filter>
          )}
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={spacing}
            height={spacing}
            patternUnits="userSpaceOnUse"
          >
            <circle
              cx={spacing / 2}
              cy={spacing / 2}
              r={size}
              fill={color}
              opacity={opacity}
              filter={glow ? `url(#${glowFilterId})` : undefined}
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
