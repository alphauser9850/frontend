import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import { cn } from '../lib/utils';
import toast from 'react-hot-toast';

const TimeRemainingDisplay: React.FC = () => {
  const { 
    userTimeBalance, 
    remainingTimeSeconds, 
    isTimerActive,
    fetchUserTimeBalance 
  } = useTimeStore();
  
  const { isDarkMode } = useThemeStore();
  const [showWarning, setShowWarning] = useState(false);

  // Fetch time balance on mount
  useEffect(() => {
    fetchUserTimeBalance();
  }, [fetchUserTimeBalance]);
  
  // Fetch time balance when timer state changes (starts or stops)
  useEffect(() => {
    fetchUserTimeBalance();
  }, [isTimerActive, fetchUserTimeBalance]);
  
  // Show warning toast when time is low
  useEffect(() => {
    if (isTimerActive && remainingTimeSeconds < 300 && !showWarning) {
      toast((t) => (
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <span>Warning: Less than 5 minutes of lab time remaining!</span>
        </div>
      ), {
        duration: 5000,
        style: {
          borderRadius: '10px',
          background: isDarkMode ? '#1e1e2d' : '#fff',
          color: isDarkMode ? '#f9fafb' : '#333',
          border: '1px solid #f87171',
        },
      });
      setShowWarning(true);
      
      // Reset warning after 5 minutes
      setTimeout(() => setShowWarning(false), 300000);
    }
  }, [isTimerActive, remainingTimeSeconds, showWarning, isDarkMode]);

  // Format seconds to HH:MM:SS
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  if (!userTimeBalance) {
    return null;
  }
  
  // Determine color classes based on time remaining
  const getColorClasses = () => {
    if (isTimerActive) {
      if (remainingTimeSeconds < 300) {
        return 'text-red-500 dark:text-red-400';
      } else if (remainingTimeSeconds < 1800) {
        return 'text-amber-500 dark:text-amber-400';
      } else {
        return 'text-green-500 dark:text-green-400';
      }
    } else {
      return '';
    }
  };

  const getAnimationClass = () => {
    if (isTimerActive && remainingTimeSeconds < 300) {
      return 'animate-pulse-slow';
    }
    return '';
  };

  const displayText = isTimerActive 
    ? formatTime(remainingTimeSeconds)
    : `${userTimeBalance.balance_hours.toFixed(1)} hours`;

  return (
    <span 
      className={cn(
        "inline-flex items-center font-medium",
        getColorClasses(),
        getAnimationClass()
      )}
    >
      <Clock className="h-4 w-4 mr-1.5" />
      <span>{displayText}</span>
    </span>
  );
};

export default TimeRemainingDisplay;