import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle = React.memo(() => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme} 
      className="p-2 rounded-full hover:bg-light-border dark:hover:bg-dark-border transition-colors focus-visible:ring-2 focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent outline-none"
      aria-label="Toggle Theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 text-light-text" /> : <Sun className="w-5 h-5 text-dark-text" />}
    </button>
  );
});
