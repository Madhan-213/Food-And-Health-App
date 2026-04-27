import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { navItems } from './BottomNav';
import { ThemeToggle } from '../shared/ThemeToggle';

export default function TopNav() {
  return (
    <div className="flex items-center justify-between w-full px-6 h-full font-medium">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-light-accent dark:text-dark-accent" />
        <span className="text-lg font-bold">NutriWise</span>
      </div>

      <nav className="flex items-center gap-6">
        {navItems.map((tab) => {
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `relative py-4 transition-colors focus-visible:ring-2 outline-none focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent ${
                  isActive 
                    ? 'text-light-accent dark:text-dark-accent' 
                    : 'text-light-secondary dark:text-dark-secondary hover:text-light-text dark:hover:text-dark-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {tab.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-light-accent dark:bg-dark-accent rounded-t-full" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
