import React, { useEffect } from 'react';
import { useTimeStore } from '../store/timeStore';
import { useThemeStore } from '../store/themeStore';
import { Clock } from 'lucide-react';
import { Card } from './ui/card';
import { cn } from '../lib/utils';

const TimeBalanceCard: React.FC = () => {
  const { userTimeBalance, fetchUserTimeBalance } = useTimeStore();
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    fetchUserTimeBalance();
  }, [fetchUserTimeBalance]);

  return (
    <Card 
      className={cn(
        "overflow-hidden border",
        isDarkMode 
          ? "border-primary-800 bg-primary-900/20" 
          : "border-primary-100 bg-primary-50"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center">
          <div className={cn(
            "p-2 rounded-full mr-3",
            isDarkMode ? "bg-primary-800" : "bg-primary-50"
          )}>
            <Clock className="h-5 w-5 text-primary-500" />
          </div>
          <div>
            <h3 className={cn(
              "font-medium",
              isDarkMode ? "text-white" : "text-gray-900"
            )}>
              Your Time Balance
            </h3>
            <p className={cn(
              "text-sm",
              isDarkMode ? "text-white/70" : "text-gray-600"
            )}>
              Available time for lab sessions
            </p>
          </div>
        </div>
        <div className={cn(
          "text-2xl font-bold",
          isDarkMode ? "text-primary-400" : "text-primary-600"
        )}>
          {userTimeBalance 
            ? `${userTimeBalance.balance_hours.toFixed(1)} hours` 
            : "Loading..."}
        </div>
      </div>
    </Card>
  );
};

export default TimeBalanceCard; 