import React from 'react';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import { Particles } from './magicui';

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children, className }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 relative",
      isDarkMode ? "bg-black text-white" : "bg-gray-50 text-gray-900",
      className
    )}>
      {/* Add particles background for dark mode to match course pages */}
      {isDarkMode && (
        <>
          <div className="absolute inset-0 bg-black z-0"></div>
          <Particles
            className="absolute inset-0 z-10"
            quantity={100}
            staticity={30}
            color="#6366f1"
            size={0.6}
          />
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 relative z-20">
        {children}
      </div>
    </div>
  );
};

export default PageWrapper; 