import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';
import { useThemeStore } from '../../store/themeStore';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
  title,
  children,
  defaultOpen = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isDarkMode } = useThemeStore();

  return (
    <div className={cn(
      "border rounded-lg mb-3 overflow-hidden",
      isDarkMode ? "border-white/10 bg-black/40 backdrop-blur-sm" : "border-border bg-card",
      className
    )}>
      <button
        className={cn(
          "w-full p-4 flex items-center justify-between text-left font-medium",
          isDarkMode ? "text-white" : "text-foreground"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isOpen ? "transform rotate-180" : ""
          )}
        />
      </button>
      <div
        className={cn(
          "transition-all duration-200 overflow-hidden",
          isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="p-4 pt-0">{children}</div>
      </div>
    </div>
  );
};

interface AccordionProps {
  children: React.ReactNode;
  className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({ children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

export default Object.assign(Accordion, {
  Item: AccordionItem,
}); 