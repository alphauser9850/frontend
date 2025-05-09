import React from "react";
import { cn } from "../../lib/utils";

interface CssDotPatternProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the dots in pixels.
   * @default 4
   */
  size?: number;
  /**
   * The spacing between dots in pixels.
   * @default 24
   */
  spacing?: number;
  /**
   * The color of the dots.
   * @default "#ffffff"
   */
  color?: string;
  /**
   * The opacity of the dots.
   * @default 0.8
   */
  opacity?: number;
}

export function CssDotPattern({
  className,
  size = 4,
  spacing = 24,
  color = "#ffffff",
  opacity = 0.8,
  ...props
}: CssDotPatternProps) {
  // Create the CSS for the dot pattern
  const dotSize = `${size}px`;
  const dotSpacing = `${spacing}px`;
  
  const style = {
    backgroundImage: `radial-gradient(${color} ${size / 2}px, transparent ${size / 2}px)`,
    backgroundSize: `${dotSpacing} ${dotSpacing}`,
    opacity: opacity,
  };

  return (
    <div
      className={cn("absolute inset-0 -z-10", className)}
      style={style}
      {...props}
    />
  );
} 