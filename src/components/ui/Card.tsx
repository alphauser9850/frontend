import React from 'react';
import { cn } from '../../lib/utils';
import { BorderBeam } from '../magicui';
import { useThemeStore } from '../../store/themeStore';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  withBeam?: boolean;
  beamDuration?: number;
  beamSize?: number;
  beamDelay?: number;
  beamClassName?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className, 
  withBeam = false,
  beamDuration = 6,
  beamSize = 300,
  beamDelay = 0,
  beamClassName,
  gradientFrom,
  gradientTo
}) => {
  const hasGradient = gradientFrom && gradientTo;
  const { isDarkMode } = useThemeStore();
  
  return (
    <div 
      className={cn(
        "shadow-md rounded-lg p-6 transition-colors duration-300 relative overflow-hidden",
        isDarkMode 
          ? "bg-black/40 backdrop-blur-sm border border-white/10 text-white" 
          : "bg-card text-card-foreground",
        hasGradient && "bg-gradient-to-br",
        className
      )}
      style={
        hasGradient 
          ? { backgroundImage: `linear-gradient(to bottom right, ${gradientFrom}, ${gradientTo})` } 
          : undefined
      }
    >
      {children}
      {withBeam && (
        <>
          <BorderBeam
            duration={beamDuration}
            size={beamSize}
            delay={beamDelay}
            className={cn("from-transparent via-primary/50 to-transparent", beamClassName)}
          />
          <BorderBeam
            duration={beamDuration}
            delay={beamDelay + beamDuration / 2}
            size={beamSize}
            className={cn("from-transparent via-secondary/50 to-transparent", beamClassName)}
          />
        </>
      )}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={cn(
      "mb-4", 
      isDarkMode ? "border-white/10" : "border-border",
      className
    )}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle: React.FC<CardTitleProps> = ({ children, className }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <h3 className={cn(
      "text-xl font-semibold flex items-center",
      isDarkMode ? "text-white" : "text-card-foreground",
      className
    )}>
      {children}
    </h3>
  );
};

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export const CardContent: React.FC<CardContentProps> = ({ children, className }) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className }) => {
  return (
    <div className={cn("", className)}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className }) => {
  const { isDarkMode } = useThemeStore();
  
  return (
    <div className={cn(
      "mt-4 pt-4 border-t", 
      isDarkMode ? "border-white/10" : "border-border", 
      className
    )}>
      {children}
    </div>
  );
};

export default Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Content: CardContent,
  Body: CardBody,
  Footer: CardFooter
});