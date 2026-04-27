import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Bell } from 'lucide-react';

interface PageHeaderProps {
  title: string | React.ReactNode;
  showStreak?: boolean;
  streakCount?: number;
}

export const PageHeader = React.memo(({ title, showStreak, streakCount }: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6 sticky top-0 md:relative z-30 bg-light-background/90 dark:bg-dark-background/90 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none py-2 -mx-4 px-4 md:mx-0 md:px-0 transition-colors duration-150">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-2 md:gap-4">
        {showStreak && streakCount !== undefined && (
          <div className="flex items-center gap-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 px-2 py-1 rounded-full text-sm font-bold">
            🔥 {streakCount}
          </div>
        )}
        <button className="p-2 text-light-secondary dark:text-dark-secondary hover:text-light-text dark:hover:text-dark-text transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="hidden lg:block">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
});
