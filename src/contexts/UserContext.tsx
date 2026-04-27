import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface UserProfile {
  name: string;
  age: number;
  height: number;
  weight: number;
  heightUnit: 'cm' | 'ft';
  weightUnit: 'kg' | 'lbs';
  goal: string;
  preferences: string[];
  activityLevel: string;
  dailyCalorieGoal: number;
  dailyProteinGoal?: number;
  dailyCarbGoal?: number;
  dailyFatGoal?: number;
  waterGoal: number;
  setupDate: string;
}

interface UserContextType {
  user: UserProfile | null;
  isSetupDone: boolean;
  saveUser: (user: UserProfile) => void;
  resetUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('nutriwise_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [isSetupDone, setIsSetupDone] = useState<boolean>(() => {
    return localStorage.getItem('nutriwise_setup_done') === 'true';
  });

  const saveUser = useCallback((newUser: UserProfile) => {
    setUser(newUser);
    setIsSetupDone(true);
    localStorage.setItem('nutriwise_user', JSON.stringify(newUser));
    localStorage.setItem('nutriwise_setup_done', 'true');
  }, []);

  const resetUser = useCallback(() => {
    setUser(null);
    setIsSetupDone(false);
    // User requested clearing all keys starting with nutriwise_
    const keys = Object.keys(localStorage).filter(k => k.startsWith('nutriwise_'));
    keys.forEach(k => localStorage.removeItem(k));
  }, []);

  const value = useMemo(() => ({ user, isSetupDone, saveUser, resetUser }), [user, isSetupDone, saveUser, resetUser]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
