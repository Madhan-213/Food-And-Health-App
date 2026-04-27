import React from 'react';
import { NavLink } from 'react-router-dom';
import { Leaf } from 'lucide-react';
import { navItems } from './BottomNav';
import { ThemeToggle } from '../shared/ThemeToggle';

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full py-6">
      <div className="flex items-center gap-3 px-6 mb-10">
        <div className="w-8 h-8 rounded-lg bg-light-accent dark:bg-dark-accent text-white flex items-center justify-center font-bold">
          <Leaf className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold tracking-tight">NutriWise</span>
      </div>

      <nav className="flex flex-col gap-2 px-3 flex-1 font-medium">
        {navItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition-all border-l-4 focus-visible:ring-2 outline-none focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent ${
                  isActive 
                    ? 'border-light-accent dark:border-dark-accent bg-light-accent/10 dark:bg-dark-accent/10 text-light-accent dark:text-dark-accent' 
                    : 'border-transparent text-light-secondary dark:text-dark-secondary hover:bg-light-alt dark:hover:bg-dark-alt hover:text-light-text dark:hover:text-dark-text'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-auto px-6 pt-6 border-t border-light-border dark:border-dark-border flex items-center justify-between">
        <span className="text-sm font-medium text-light-secondary dark:text-dark-secondary">Theme</span>
        <ThemeToggle />
      </div>
    </div>
  );
}
