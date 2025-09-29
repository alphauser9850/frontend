import React, { useEffect, useRef } from 'react';

interface BorderBeamProps {
  duration?: number;
  size?: number;
  delay?: number;
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}

export const BorderBeam: React.FC<BorderBeamProps> = ({
  duration = 8,
  size = 100,
  delay = 0,
  className = '',
  colorFrom = 'rgba(120, 119, 198, 0.8)',
  colorTo = 'rgba(255, 120, 198, 0.8)',
}) => {
  const beamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const beamElement = beamRef.current;
    if (!beamElement) return;

    // Add a small delay before starting the animation
    const timeoutId = setTimeout(() => {
      beamElement.style.opacity = '1';
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [delay]);

  return (
    <div
      ref={beamRef}
      className={`pointer-events-none absolute inset-px z-0 transition-opacity opacity-0 ${className}`}
      style={{
        borderRadius: 'inherit',
      }}
    >
      <div
        className="absolute inset-px rounded-[inherit]"
        style={{
          background: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
          backgroundSize: `${size}% 100%`,
          backgroundPosition: 'left -25%',
          backgroundRepeat: 'no-repeat',
          animation: `border-beam ${duration}s infinite linear`,
        }}
      />
      <style>
        {`
          @keyframes border-beam {
            0% {
              background-position: left -25%;
            }
            100% {
              background-position: right -25%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default BorderBeam; 