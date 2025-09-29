"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

interface AuroraTextProps {
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  animationDuration?: number;
  animationDelay?: number;
}

export function AuroraText({
  children,
  className,
  gradientColors = [
    "#ff3d00",
    "#ff9e00",
    "#ffea00",
    "#00e1ff",
    "#7b00ff",
    "#ff0099",
  ],
  animationDuration = 8,
  animationDelay = 0,
}: AuroraTextProps) {
  const textRef = useRef<HTMLSpanElement>(null);
  const gradientId = useRef(`aurora-gradient-${Math.random().toString(36).substring(2, 9)}`);

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    // Add a small delay before starting the animation
    const timeoutId = setTimeout(() => {
      textElement.style.opacity = "1";
    }, animationDelay);

    return () => clearTimeout(timeoutId);
  }, [animationDelay]);

  const colorStops = gradientColors.map((color, index) => {
    const percentage = (index / (gradientColors.length - 1)) * 100;
    return `${color} ${percentage}%`;
  }).join(", ");

  return (
    <>
      <style>
        {`
          @keyframes aurora-text-animation {
            0% {
              background-position: 0% 50%;
            }
            100% {
              background-position: 100% 50%;
            }
          }
        `}
      </style>
      <span
        ref={textRef}
        className={cn(
          "relative inline-block bg-clip-text text-transparent transition-opacity",
          className
        )}
        style={{
          backgroundImage: `linear-gradient(to right, ${colorStops})`,
          backgroundSize: `${gradientColors.length * 200}% 100%`,
          animation: `aurora-text-animation ${animationDuration}s linear infinite`,
        }}
      >
        {children}
      </span>
    </>
  );
}
