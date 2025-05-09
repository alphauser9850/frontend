import React from 'react';
import { cn } from '../../lib/utils';

interface RippleProps {
  className?: string;
  mainCircleSize?: number;
  mainCircleOpacity?: number;
  numCircles?: number;
  color?: string;
}

const Ripple: React.FC<RippleProps> = ({
  className,
  mainCircleSize = 210,
  mainCircleOpacity = 0.24,
  numCircles = 8,
  color = "currentColor"
}) => {
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center", className)}>
      <div
        className="absolute animate-ripple rounded-full"
        style={{
          width: mainCircleSize,
          height: mainCircleSize,
          backgroundColor: color,
          opacity: mainCircleOpacity,
        }}
      />
      {Array.from({ length: numCircles }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-ripple"
          style={{
            width: mainCircleSize,
            height: mainCircleSize,
            backgroundColor: color,
            opacity: mainCircleOpacity * (1 - i / numCircles),
            animationDelay: `${i * 0.5}s`,
          }}
        />
      ))}
    </div>
  );
};

export { Ripple, type RippleProps }; 