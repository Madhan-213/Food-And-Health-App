import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Utensils, Compass, BarChart2, User as UserIcon } from 'lucide-react';

export const navItems = [
  { path: '/dashboard', label: 'Home', icon: Home },
  { path: '/log', label: 'Log', icon: Utensils },
  { path: '/discover', label: 'Discover', icon: Compass },
  { path: '/progress', label: 'Progress', icon: BarChart2 },
  { path: '/profile', label: 'Profile', icon: UserIcon },
];

export default function BottomNav() {
  const tabs = useMemo(() => navItems, []);

  return (
    <nav className="flex items-center justify-around w-full h-full text-xs font-medium">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) => 
              `flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all group focus-visible:ring-2 outline-none focus-visible:ring-light-accent dark:focus-visible:ring-dark-accent ${
                isActive ? 'text-light-accent dark:text-dark-accent' : 'text-light-secondary dark:text-dark-secondary hover:text-light-text dark:hover:text-dark-text'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-6 h-6 transition-transform ${isActive ? 'scale-110' : ''}`} />
                <span className="relative">
                  {tab.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-light-accent dark:bg-dark-accent rounded-full animate-in fade-in" />
                  )}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
