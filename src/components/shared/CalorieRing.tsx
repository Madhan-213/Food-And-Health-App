import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export const CalorieRing = React.memo(({ calories, goal, className }: { calories: number, goal: number, className?: string }) => {
  const [offset, setOffset] = useState(0);
  
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  
  const isOver = calories > goal * 1.1;
  const isClose = calories >= goal * 0.9;
  
  const colorClass = isOver ? 'text-red-500' : (isClose ? 'text-amber-500' : 'text-light-accent dark:text-dark-accent');

  useEffect(() => {
    // animate fill after mount
    const p = Math.min((calories / goal) * 100, 100);
    const strokeOffset = circumference - (p / 100) * circumference;
    const timeout = setTimeout(() => setOffset(strokeOffset), 100);
    return () => clearTimeout(timeout);
  }, [calories, goal, circumference]);

  return (
    <div className={cn("relative flex items-center justify-center w-full aspect-square max-w-[200px] mx-auto", className)}>
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140" aria-label={`Calorie ring showing ${calories} out of ${goal} calories`}>
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          className="text-light-alt dark:text-dark-surface"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          stroke="currentColor"
          strokeWidth="12"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", colorClass)}
          style={{ strokeDashoffset: offset === 0 && calories === 0 ? circumference : offset }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-bold">{calories}</span>
        <span className="text-sm text-light-secondary dark:text-dark-secondary">/ {goal} kcal</span>
      </div>
    </div>
  );
});
