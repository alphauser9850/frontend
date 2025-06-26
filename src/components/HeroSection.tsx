import React from 'react';
import { AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { COURSE_PATHS } from '../lib/constants';

// Use local image from public directory
const HERO_IMAGE_URL = '/ccie-ei.jpg';

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center bg-design-primary-background section-bg overflow-hidden pt-32 md:pt-36 pb-16 min-h-[calc(100vh-4rem)]">
      {/* Animated gradient blob background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-design-primary-accent/40 via-design-text-accent/30 to-design-primary-background/80 rounded-full blur-3xl opacity-80 animate-gradient-spin z-0" />
      {/* Depth of field foreground blur */}
      <div className="absolute bottom-[-4rem] left-1/4 w-[400px] h-[180px] bg-white/20 rounded-full blur-3xl opacity-60 z-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-20 flex flex-col md:flex-row items-center gap-16 md:gap-0 justify-center min-h-[500px] h-full">
        {/* Left: Text Content (no card) */}
        <div className="flex-1 flex flex-col items-start justify-center md:pr-12 max-w-5xl z-30">
          <h1 className="text-hero font-extrabold text-text-primary leading-tight mb-8">
            <AuroraText>Advanced CCIE Training & Certification</AuroraText>
          </h1>
          <p className="text-body text-text-secondary font-medium mb-10 max-w-2xl">
            Master Network Engineering Excellence
          </p>
          <a
            href={COURSE_PATHS.CCIE}
            className="btn-primary text-lg font-bold shadow-large hover:shadow-medium transition-all duration-200 animate-fade-in-up"
          >
            Explore CCIE Enterprise
          </a>
        </div>
        {/* Right: Full-height, left-fading Hero Image with soft right corners */}
        <div className="flex-1 h-full w-full flex items-stretch justify-end relative z-10">
          <div className="relative h-full w-full flex items-stretch justify-end">
            <img
              src={HERO_IMAGE_URL}
              alt="Professional woman working with networking equipment"
              className="h-full w-full object-cover object-right select-none pointer-events-none rounded-r-3xl"
              style={{
                maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
              }}
              draggable={false}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        </div>
      </div>
      {/* Optional: Add a soft vignette overlay for extra depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-30" />
    </section>
  );
};

export default HeroSection; 
