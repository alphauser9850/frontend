import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { Layers } from 'lucide-react';
import { AuroraText } from '../components/magicui';
import { Ripple } from '../components/magicui/ripple';

const SDWANPage: React.FC = () => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className={cn(
        "absolute inset-0 z-0",
        isDarkMode ? "bg-black" : "bg-gradient-to-b from-primary-50 to-gray-50"
      )}></div>

      {/* Ripple Effects */}
      <div className="absolute inset-0 z-10">
        <Ripple 
          mainCircleSize={300}
          mainCircleOpacity={0.1}
          numCircles={5}
          color={isDarkMode ? "#6366f1" : "#4f46e5"}
          className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2"
        />
        <Ripple 
          mainCircleSize={200}
          mainCircleOpacity={0.08}
          numCircles={4}
          color={isDarkMode ? "#8b5cf6" : "#6366f1"}
          className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2"
        />
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-primary/10">
            <Layers className="h-8 w-8 text-primary" />
          </div>
          <h1 className={cn(
            "text-4xl md:text-5xl lg:text-6xl font-bold",
            isDarkMode ? "text-white" : "text-gray-900"
          )}>
            <AuroraText>SD-WAN</AuroraText>
          </h1>
        </div>
        
        <div className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8">
          <AuroraText>Coming Soon</AuroraText>
        </div>
        
        <p className={cn(
          "max-w-2xl mx-auto text-lg",
          isDarkMode ? "text-white/70" : "text-gray-600"
        )}>
          Our comprehensive SD-WAN certification program is under development. 
          Stay tuned for an immersive learning experience that will help you master 
          software-defined wide area networking technologies.
        </p>
      </div>
    </div>
  );
};

export default SDWANPage; 