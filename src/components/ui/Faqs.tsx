import React from 'react';
import { cn } from '../../lib/utils';
import { useThemeStore } from '../../store/themeStore';

interface FAqsItemProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const FAqsItem: React.FC<FAqsItemProps> = ({
  title,
  children,
  className,
}) => {
  const { isDarkMode } = useThemeStore();

  return (
    <div className={cn(
      "border-b rounded-lg mb-3 overflow-hidden",
      isDarkMode ? "border-white/10 bg-black/40 backdrop-blur-sm" : "border-gray-200 bg-white shadow-sm",
      className
    )}>
      <div className={cn(
        "p-4 font-medium ",
        isDarkMode 
          ? "text-white border-white/10" 
          : "text-gray-900 border-gray-100"
      )}>
        <h3>{title}</h3>
      </div>
      <div className={cn(
        "px-4 pb-4",
        isDarkMode 
          ? "text-white !text-white [&>*]:text-white" 
          : "text-gray-900"
      )}>
        {children}
      </div>
    </div>
  );
};

interface FAqsProps {
  children: React.ReactNode;
  className?: string;
}

export const FAqs: React.FC<FAqsProps> & { Item: typeof FAqsItem } = ({ children, className }) => {
  return (
    <div className={cn("space-y-2", className)}>
      {children}
    </div>
  );
};

FAqs.Item = FAqsItem;

export default FAqs;