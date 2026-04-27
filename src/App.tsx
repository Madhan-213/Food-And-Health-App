import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { UserProvider, useUser } from './contexts/UserContext';
import { MealLogProvider } from './contexts/MealLogContext';
import { HabitProvider } from './contexts/HabitContext';
import AppLayout from './components/layout/AppLayout';

// Lazy load pages
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MealLogger = React.lazy(() => import('./pages/MealLogger'));
const Discover = React.lazy(() => import('./pages/Discover'));
const Progress = React.lazy(() => import('./pages/Progress'));
const Profile = React.lazy(() => import('./pages/Profile'));

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSetupDone } = useUser();
  if (!isSetupDone) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
};

const SetupGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isSetupDone } = useUser();
  if (isSetupDone) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  const { isSetupDone } = useUser();
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text font-medium text-lg">Loading NutriWise...</div>}>
        <Routes>
          <Route path="/" element={<Navigate to={isSetupDone ? "/dashboard" : "/onboarding"} replace />} />
          
          <Route path="/onboarding" element={
            <SetupGuard><Onboarding /></SetupGuard>
          } />

          <Route element={<AuthGuard><AppLayout /></AuthGuard>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/log" element={<MealLogger />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <MealLogProvider>
          <HabitProvider>
            <AppRoutes />
          </HabitProvider>
        </MealLogProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
