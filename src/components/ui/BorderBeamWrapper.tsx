import React from 'react';
import { BorderBeam } from '../magicui';
import { cn } from '../../lib/utils';
import '../magicui/border-beam.css';

interface BorderBeamWrapperProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  size?: number;
  delay?: number;
  beamColor?: 'blue' | 'purple' | 'green' | 'yellow' | 'pink' | 'indigo';
  reverse?: boolean;
}

export const BorderBeamWrapper: React.FC<BorderBeamWrapperProps> = ({
  children,
  className,
  duration = 8,
  size = 1200,
  delay = 0,
  beamColor = 'blue',
  reverse = false
}) => {
  // Map color names to actual color values with increased opacity
  const colorMap = {
    blue: 'rgba(59, 130, 246, 0.9)', // Increased opacity from 0.8 to 0.9
    purple: 'rgba(168, 85, 247, 0.9)', // Increased opacity from 0.8 to 0.9
    green: 'rgba(34, 197, 94, 0.9)', // Increased opacity from 0.8 to 0.9
    yellow: 'rgba(234, 179, 8, 0.9)', // Increased opacity from 0.8 to 0.9
    pink: 'rgba(236, 72, 153, 0.9)', // Increased opacity from 0.8 to 0.9
    indigo: 'rgba(99, 102, 241, 0.9)' // Increased opacity from 0.8 to 0.9
  };

  return (
    <div 
      className={cn(
        "border-beam-container relative overflow-hidden rounded-xl", 
        className
      )}
    >
      <div className="border-beam-content">
        {children}
      </div>
      <BorderBeam 
        duration={duration} 
        size={size}
        colorFrom="transparent"
        colorTo={colorMap[beamColor]}
        delay={delay}
        reverse={reverse}
        className="absolute inset-0 z-0"
      />
    </div>
  );
};

export default BorderBeamWrapper; 