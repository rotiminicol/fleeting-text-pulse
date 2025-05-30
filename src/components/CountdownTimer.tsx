
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
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getProgressColor = () => {
    if (progress > 50) return 'bg-green-500';
    if (progress > 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getTimerColor = () => {
    if (progress > 50) return 'text-green-700';
    if (progress > 25) return 'text-yellow-700';
    return 'text-red-700';
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border-2 border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-lg font-semibold text-gray-700">
          <Clock className="h-6 w-6" />
          Time Remaining
        </div>
        <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
          {formatTime(timeLeft)}
        </div>
      </div>
      
      <div className="relative">
        <Progress value={progress} className="h-4" />
        <div 
          className={`absolute top-0 left-0 h-4 rounded-full transition-all duration-1000 ${getProgressColor()}`}
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-sm text-gray-600 text-center bg-white p-3 rounded-lg border border-gray-200">
        <strong>⏰ Expires at:</strong> {expiresAt.toLocaleTimeString()} on {expiresAt.toLocaleDateString()}
      </div>
    </div>
  );
};

export default CountdownTimer;
