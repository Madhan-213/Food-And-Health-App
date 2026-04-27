import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopNav from './TopNav';
import { ToastContainer } from '../shared/Toast';

export default function AppLayout() {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text transition-colors duration-150 flex relative">
      <div className="hidden lg:block w-[240px] flex-shrink-0 border-r border-light-border dark:border-dark-border h-screen sticky top-0 bg-light-surface dark:bg-dark-surface z-50 transition-colors duration-150">
        <Sidebar />
      </div>

      <main className="flex-1 flex flex-col w-full min-h-screen pb-[64px] md:pb-0 overflow-x-hidden">
        <div className="hidden md:flex lg:hidden sticky top-0 z-40 bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-md border-b border-light-border dark:border-dark-border h-16 w-full items-center transition-colors duration-150">
          <TopNav />
        </div>

        <div className="flex-1 w-full max-w-[1200px] mx-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[64px] bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-md border-t border-light-border dark:border-dark-border z-50 pb-[env(safe-area-inset-bottom)] transition-colors duration-150">
        <BottomNav />
      </div>

      <ToastContainer />
    </div>
  );
}
