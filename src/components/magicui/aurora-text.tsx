"use client";

import React, { useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

type AuroraTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p" | "div";

interface AuroraTextProps extends React.HTMLAttributes<HTMLElement> {
  as?: AuroraTag;
  children: React.ReactNode;
  className?: string;
  gradientColors?: string[];
  animationDuration?: number;
  animationDelay?: number;
  fontClass?:string
}

export function AuroraText({
  as = "span",
  fontClass,
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
  ...rest
}: AuroraTextProps) {
  const textRef = useRef<HTMLElement>(null);
  const gradientId = useRef(
    `aurora-gradient-${Math.random().toString(36).substring(2, 9)}`
  );

  useEffect(() => {
    const textElement = textRef.current;
    if (!textElement) return;

    const timeoutId = setTimeout(() => {
      textElement.style.opacity = "1";
    }, animationDelay);

    return () => clearTimeout(timeoutId);
  }, [animationDelay]);

  const colorStops = gradientColors
    .map((color, index) => {
      const percentage = (index / (gradientColors.length - 1)) * 100;
      return `${color} ${percentage}%`;
    })
    .join(", ");

  const Tag = as as keyof JSX.IntrinsicElements;

  return (
    <Tag
      ref={textRef}
      className={cn(
        "relative inline-block bg-clip-text text-transparent transition-opacity",
        className , fontClass
      )}
      style={{
        backgroundImage: `linear-gradient(to right, ${colorStops})`,
        backgroundSize: `${gradientColors.length * 200}% 100%`,
        animation: `aurora-text-animation ${animationDuration}s linear infinite`,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
