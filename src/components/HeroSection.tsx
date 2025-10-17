import React from 'react';
import { AuroraText } from './magicui';
import { cn } from '../lib/utils';
import { COURSE_PATHS } from '../lib/constants';

const HeroSection: React.FC = () => {
  return (
    <section className="relative flex items-center justify-center bg-design-primary-background section-bg overflow-hidden pt-32 md:pt-36 pb-16 min-h-[calc(100vh-4rem)]">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
         <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 30%, black 100%)',
          }}
        >
          <source src="/heroVideo.mp4" type="video/mp4" />
        </video> 
        {/* Video overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Animated gradient blob background */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-design-primary-accent/40 via-design-text-accent/30 to-design-primary-background/80 rounded-full blur-3xl opacity-80 animate-gradient-spin z-0" />
      {/* Depth of field foreground blur */}
      <div className="absolute bottom-[-4rem] left-1/4 w-[400px] h-[180px] bg-white/20 rounded-full blur-3xl opacity-60 z-10 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-20 flex flex-col items-center justify-center min-h-[500px] h-full">
        {/* Centered: Text Content */}
        <div className="flex flex-col items-center justify-center text-center max-w-5xl z-30">
            <div className='auroratext'>
              <AuroraText as='h1'>Advanced CCIE Training & Lab</AuroraText> 
              </div>
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
        {/* Right: Video takes up the full space */}
        <div className="flex-1 h-full w-full flex items-stretch justify-end relative z-10">
          {/* Video is already covering the full background, so this div is for layout balance */}
        </div>
      </div>
      {/* Optional: Add a soft vignette overlay for extra depth */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20 z-30" />
    </section>
  );
};

export default HeroSection; 
