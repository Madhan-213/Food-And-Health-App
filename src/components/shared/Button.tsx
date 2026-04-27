import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.memo(({ children, variant = 'primary', size = 'md', className, ...props }: ButtonProps) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-light-accent dark:bg-dark-accent text-white hover:bg-light-accent/90 dark:hover:bg-dark-accent/90 focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent",
    ghost: "hover:bg-light-alt dark:hover:bg-dark-alt text-light-text dark:text-dark-text focus-visible:ring-light-border dark:focus-visible:ring-dark-border",
    outline: "border border-light-border dark:border-dark-border hover:bg-light-alt dark:hover:bg-dark-alt focus-visible:ring-light-border text-light-text dark:text-dark-text",
    danger: "border border-red-500 text-red-500 hover:bg-red-500 hover:text-white focus-visible:ring-red-500"
  };

  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-11 px-4 py-2",
    lg: "h-14 px-8 text-lg"
  };

  return (
    <button className={cn(baseClasses, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
});
