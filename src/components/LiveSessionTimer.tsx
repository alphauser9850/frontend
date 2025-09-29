import React, { useEffect, useState, useCallback } from 'react';
import { Clock, Pause, Play, StopCircle, AlertCircle } from 'lucide-react';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import toast from 'react-hot-toast';
import { cn } from '../lib/utils';

interface LiveSessionTimerProps {
  serverId?: string;
  compact?: boolean;
}

const LiveSessionTimer: React.FC<LiveSessionTimerProps> = ({ serverId, compact = false }) => {
  const { 
    userTimeBalance, 
    remainingTimeSeconds, 
    isTimerActive,
    activeSessionId,
    startSession,
    pauseSession,
    resumeSession,
    endSession,
    fetchUserTimeBalance 
  } = useTimeStore();
  
  const { isDarkMode } = useThemeStore();
  const [hours, setHours] = useState<string>('00');
  const [minutes, setMinutes] = useState<string>('00');
  const [seconds, setSeconds] = useState<string>('00');
  const [isPaused, setIsPaused] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Format time for display
  const formatTime = useCallback((timeInSeconds: number) => {
    if (timeInSeconds < 0) timeInSeconds = 0;
    
    const h = Math.floor(timeInSeconds / 3600);
    const m = Math.floor((timeInSeconds % 3600) / 60);
    const s = timeInSeconds % 60;
    
    return {
      hours: h.toString().padStart(2, '0'),
      minutes: m.toString().padStart(2, '0'),
      seconds: s.toString().padStart(2, '0')
    };
  }, []);

  useEffect(() => {
    fetchUserTimeBalance();
    
    // Refresh time balance every minute
    const intervalId = setInterval(() => {
      fetchUserTimeBalance();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchUserTimeBalance]);

  useEffect(() => {
    if (remainingTimeSeconds >= 0) {
      const { hours: h, minutes: m, seconds: s } = formatTime(remainingTimeSeconds);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }
  }, [remainingTimeSeconds, formatTime]);

  const handleStartSession = async () => {
    if (!serverId) return;
    
    if (!userTimeBalance || userTimeBalance.balance_hours <= 0) {
      toast.error('You have no time balance remaining');
      return;
    }
    
    setIsProcessing(true);
    try {
      await startSession(serverId);
      setIsPaused(false);
      toast.success('Session started successfully');
    } catch (error) {
      console.error('Error starting session:', error);
      toast.error('Failed to start session');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePauseResumeSession = async () => {
    if (!activeSessionId) return;
    
    setIsProcessing(true);
    try {
      if (isPaused) {
        await resumeSession(activeSessionId);
        setIsPaused(false);
        toast.success('Session resumed');
      } else {
        await pauseSession(activeSessionId);
        setIsPaused(true);
        toast.success('Session paused');
      }
    } catch (error) {
      console.error('Error toggling session state:', error);
      toast.error(isPaused ? 'Failed to resume session' : 'Failed to pause session');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEndSession = async () => {
    if (!activeSessionId) return;
    
    if (!confirm('Are you sure you want to end this session? This will stop the timer and save your remaining time.')) {
      return;
    }
    
    setIsProcessing(true);
    try {
      await endSession(activeSessionId);
      setIsPaused(false);
      
      // Explicitly fetch the updated time balance after ending the session
      await fetchUserTimeBalance();
      
      toast.success('Session ended successfully');
    } catch (error) {
      console.error('Error ending session:', error);
      toast.error('Failed to end session');
    } finally {
      setIsProcessing(false);
    }
  };

  // Determine color based on time remaining and dark mode
  const getColorClasses = () => {
    if (isTimerActive) {
      if (remainingTimeSeconds < 300) { // Less than 5 minutes
        return isDarkMode
          ? 'bg-red-500/20 text-red-100 border border-red-500/50'
          : 'bg-red-100 text-red-800 border border-red-500/50';
      } else if (remainingTimeSeconds < 1800) { // Less than 30 minutes
        return isDarkMode
          ? 'bg-amber-500/20 text-amber-100 border border-amber-500/50'
          : 'bg-amber-100 text-amber-800 border border-amber-500/50';
      } else {
        return isDarkMode
          ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/50'
          : 'bg-emerald-100 text-emerald-800 border border-emerald-500/50';
      }
    } else {
      return isDarkMode 
        ? 'bg-primary-500/20 text-primary-100 border border-primary-500/50' 
        : 'bg-primary-100 text-primary-800 border border-primary-200';
    }
  };

  // Compact version for navbar or small displays
  if (compact) {
    return (
      <div className={cn(
        "flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-300",
        getColorClasses(),
        isDarkMode ? "" : "border-[1.5px]",
        isTimerActive && remainingTimeSeconds < 300 && "animate-pulse"
      )}>
        <div className={cn(
          "h-2 w-2 rounded-full mr-2",
          isTimerActive 
            ? remainingTimeSeconds < 300 
              ? "bg-red-500" 
              : remainingTimeSeconds < 1800 
                ? "bg-amber-500" 
                : "bg-green-500"
            : "bg-primary-500"
        )} />
        <span className={cn(
          isDarkMode ? "" : "font-semibold"
        )}>
          {isTimerActive 
            ? `${hours}:${minutes}:${seconds}` 
            : `${userTimeBalance?.balance_hours.toFixed(1) || '0'} hours`
          }
        </span>
      </div>
    );
  }

  // Full version for dedicated timer panel
  return (
    <div className={cn(
      "rounded-lg overflow-hidden shadow-md transition-all duration-300",
      isDarkMode ? "bg-gray-800" : "bg-white"
    )}>
      <div className={cn(
        "p-4 border-b flex items-center justify-between",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <h3 className={cn(
          "text-lg font-semibold flex items-center",
          isDarkMode ? "text-white" : "text-gray-900"
        )}>
          <Clock className={cn(
            "h-5 w-5 mr-2",
            isDarkMode ? "text-primary-400" : "text-primary-500"
          )} />
          Session Timer
        </h3>
        
        {isTimerActive && (
          <div className={cn(
            "flex items-center text-xs px-2 py-1 rounded-full",
            isPaused 
              ? isDarkMode ? "bg-amber-500/20 text-amber-100" : "bg-amber-100 text-amber-800 border border-amber-300"
              : isDarkMode ? "bg-green-500/20 text-green-100" : "bg-green-100 text-green-800 border border-green-300"
          )}>
            <div className={cn(
              "h-2 w-2 rounded-full mr-1",
              isPaused 
                ? "bg-amber-500" 
                : "bg-green-500 animate-pulse"
            )} />
            <span>{isPaused ? "Paused" : "Active"}</span>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className={cn(
          "text-center py-8 rounded-lg mb-6 transition-all duration-300",
          getColorClasses(),
          isTimerActive && remainingTimeSeconds < 300 && "animate-pulse"
        )}>
          <div className="text-4xl font-mono font-bold tracking-wider">
            {hours}:{minutes}:{seconds}
          </div>
          <div className="mt-3 text-sm font-medium">
            {isTimerActive 
              ? isPaused 
                ? "Session Paused" 
                : "Time Remaining" 
              : `Available Balance: ${userTimeBalance?.balance_hours.toFixed(1) || '0'} hours`
            }
          </div>
        </div>
        
        {remainingTimeSeconds < 300 && isTimerActive && !isPaused && (
          <div className={cn(
            "mb-4 p-3 rounded-lg flex items-center text-sm font-medium",
            isDarkMode ? "bg-red-900/30 text-red-200" : "bg-red-50 text-red-800 border border-red-200"
          )}>
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Your session will end soon. Consider saving your work.</span>
          </div>
        )}
        
        <div className="flex justify-center space-x-3">
          {!isTimerActive ? (
            <button
              onClick={handleStartSession}
              disabled={!serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0 || isProcessing}
              className={cn(
                "px-4 py-2 rounded-md flex items-center justify-center transition-colors duration-200 font-medium",
                !serverId || !userTimeBalance || userTimeBalance.balance_hours <= 0 || isProcessing
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : isDarkMode 
                    ? "bg-primary-600 hover:bg-primary-700 text-white" 
                    : "bg-primary-500 hover:bg-primary-600 text-white",
                isProcessing && "opacity-70"
              )}
            >
              {isProcessing ? (
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              Start Session
            </button>
          ) : (
            <>
              <button
                onClick={handlePauseResumeSession}
                disabled={isProcessing}
                className={cn(
                  "px-4 py-2 rounded-md flex items-center justify-center transition-colors duration-200 font-medium",
                  isProcessing ? "opacity-70" : "",
                  isPaused
                    ? isDarkMode 
                      ? "bg-green-700 hover:bg-green-800 text-white" 
                      : "bg-green-600 hover:bg-green-700 text-white"
                    : isDarkMode 
                      ? "bg-amber-700 hover:bg-amber-800 text-white" 
                      : "bg-amber-600 hover:bg-amber-700 text-white"
                )}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : isPaused ? (
                  <Play className="h-4 w-4 mr-2" />
                ) : (
                  <Pause className="h-4 w-4 mr-2" />
                )}
                {isPaused ? "Resume" : "Pause"}
              </button>
              
              <button
                onClick={handleEndSession}
                disabled={isProcessing}
                className={cn(
                  "px-4 py-2 rounded-md flex items-center justify-center transition-colors duration-200 font-medium",
                  isProcessing ? "opacity-70" : "",
                  isDarkMode 
                    ? "bg-red-700 hover:bg-red-800 text-white" 
                    : "bg-red-600 hover:bg-red-700 text-white"
                )}
              >
                {isProcessing ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <StopCircle className="h-4 w-4 mr-2" />
                )}
                End Session
              </button>
            </>
          )}
        </div>
        
        <div className={cn(
          "mt-4 text-xs text-center",
          isDarkMode ? "text-gray-400" : "text-gray-500"
        )}>
          {isTimerActive 
            ? "Your time balance will be updated when the session ends" 
            : "Start a session to begin using the lab"
          }
        </div>
      </div>
    </div>
  );
};

export default LiveSessionTimer;