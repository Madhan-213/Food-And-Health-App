import React, { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

interface MacroBarProps {
  label: string;
  value: number;
  goal: number;
  colorClass: string;
}

export const MacroBar = React.memo(({ label, value, goal, colorClass }: MacroBarProps) => {
  const [width, setWidth] = useState(0);
  const percent = goal > 0 ? Math.min((value / goal) * 100, 100) : 0;

  useEffect(() => {
    const timeout = setTimeout(() => setWidth(percent), 100);
    return () => clearTimeout(timeout);
  }, [percent]);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between text-sm font-medium">
        <span>{label}</span>
        <span className="text-light-secondary dark:text-dark-secondary">{Math.round(value)}g / {goal}g</span>
      </div>
      <div className="h-2 w-full bg-light-alt dark:bg-dark-alt rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-1000 ease-out", colorClass)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
});
