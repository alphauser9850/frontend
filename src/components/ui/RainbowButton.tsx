import React from 'react';
import { cn } from '../../lib/utils';

interface RainbowButtonProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
  [key: string]: any; // Allow any other props
}

const RainbowButton = React.forwardRef<HTMLButtonElement, RainbowButtonProps>(
  ({ children, className, asChild = false, ...props }, ref) => {
    return (
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition duration-1000 group-hover:duration-200 animate-gradient"></div>
        {asChild ? (
          <div 
            className={cn(
              "relative flex items-center justify-center px-6 py-2 rounded-full font-medium text-sm",
              "bg-background text-foreground hover:text-primary-foreground hover:bg-primary",
              "transition-all duration-200",
              "border border-transparent",
              className
            )}
          >
            {children}
          </div>
        ) : (
          <button
            className={cn(
              "relative flex items-center justify-center px-6 py-2 rounded-full font-medium text-sm",
              "bg-background text-foreground hover:text-primary-foreground hover:bg-primary",
              "transition-all duration-200",
              "border border-transparent",
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </button>
        )}
      </div>
    );
  }
);

RainbowButton.displayName = 'RainbowButton';

export { RainbowButton }; 