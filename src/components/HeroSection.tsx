import React from 'react';
import { AuroraText, Particles, ShineBorder } from './magicui';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';

const HeroSection: React.FC = () => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-0">
      {/* Background */}
      <div className={cn(
        "absolute inset-0 z-0",
        isDarkMode ? "bg-black" : "bg-gradient-to-b from-primary-50 to-gray-50"
      )}></div>
      
      {/* Particles background - visible in both modes */}
      <Particles
        className="absolute inset-0 z-10"
        quantity={100}
        staticity={30}
        color={isDarkMode ? "#6366f1" : "#4f46e5"}
        size={isDarkMode ? 0.6 : 0.5}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 relative z-20">
        <div className="max-w-4xl mx-auto">
           {/* Logo and Heading Container */}
          <div className="flex items-center gap-8 mb-6">
            {/* Logo */}
                      
            <div className="flex-1">
          <h1 className={cn(
            "text-3xl font-bold tracking-tighter md:text-4xl lg:text-5xl mb-6 text-center",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            100% Practical  <AuroraText>CCIE</AuroraText> Training & Certification <br />
            <AuroraText>Unlimited</AuroraText> Real Time Lab Practices
             
          </h1>
           </div>
         </div>
          
          <p className={cn(
            "text-xl md:text-2xl mb-10 text-center",
            isDarkMode ? "text-white/90" : "text-gray-700"
          )}>
            Creating transformative online ccie training experiences that empower network engineers to excel.
          </p>
          
          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className={cn(
              "relative rounded-xl p-6",
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm border border-white/10" 
                : "bg-white shadow-lg border border-gray-100"
            )}>
              <ShineBorder borderWidth={1.5} shineColor={["#6366f1", "#8b5cf6"]} duration={10} />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>3-Months Live Training</h3>
              <p className={isDarkMode ? "text-white/70" : "text-gray-600"}>
                Instructor-led sessions by CCIE certified experts with hands-on lab access.
              </p>
            </div>
            
            <div className={cn(
              "relative rounded-xl p-6",
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm border border-white/10" 
                : "bg-white shadow-lg border border-gray-100"
            )}>
              <ShineBorder borderWidth={1.5} shineColor={["#8b5cf6", "#6366f1"]} duration={12} />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>Exclusive Lab Environment</h3>
              <p className={isDarkMode ? "text-white/70" : "text-gray-600"}>
                Practice in a dedicated lab environment with comprehensive technical support.
              </p>
            </div>
            
            <div className={cn(
              "relative rounded-xl p-6",
              isDarkMode 
                ? "bg-white/5 backdrop-blur-sm border border-white/10" 
                : "bg-white shadow-lg border border-gray-100"
            )}>
              <ShineBorder borderWidth={1.5} shineColor={["#6366f1", "#8b5cf6"]} duration={14} />
              <h3 className={cn(
                "text-xl font-semibold mb-2",
                isDarkMode ? "text-white" : "text-gray-900"
              )}>CCIE Bootcamp</h3>
              <p className={isDarkMode ? "text-white/70" : "text-gray-600"}>
                Intensive 2 Week bootcamp designed for aspiring CCIE candidates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { HeroSection }; 
