import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card = React.memo(({ children, className, onClick, ...props }: CardProps) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white dark:bg-dark-surface rounded-xl border border-light-border dark:border-dark-border p-4 transition-all duration-150", 
        !className?.includes('shadow-none') && "shadow-sm",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.01]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
