
import React, { useState, useEffect } from 'react';
import { Progress } from '@/components/ui/progress';
import { Clock } from 'lucide-react';

interface CountdownTimerProps {
  expiresAt: Date;
  onExpired: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ expiresAt, onExpired }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [progress, setProgress] = useState<number>(100);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = expiresAt.getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft(0);
        setProgress(0);
        onExpired();
        return;
      }

      setTimeLeft(difference);
      const totalTime = 60 * 60 * 1000; // 1 hour in milliseconds
      const progressValue = (difference / totalTime) * 100;
      setProgress(Math.max(0, progressValue));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpired]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (progress > 50) return 'bg-green-500';
    if (progress > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4" />
          Time Remaining
        </div>
        <div className="text-lg font-mono font-bold text-gray-900">
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-3" />
        <div 
          className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        Expires at {expiresAt.toLocaleTimeString()}
      </div>
    </div>
  );
};

export default CountdownTimer;
