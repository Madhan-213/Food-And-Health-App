import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';

export interface DailyHabits {
  breakfast: boolean;
  water: boolean;
  loggedMeals: boolean;
  protein: boolean;
  noJunk: boolean;
  veggies: boolean;
  [key: string]: boolean;
}

const defaultHabits: DailyHabits = {
  breakfast: false,
  water: false,
  loggedMeals: false,
  protein: false,
  noJunk: false,
  veggies: false,
};

interface HabitContextType {
  todayHabits: DailyHabits;
  allHabits: Record<string, DailyHabits>;
  toggleHabit: (habitKey: keyof DailyHabits, dateStr: string) => void;
  getHabitsForDate: (dateStr: string) => DailyHabits;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allHabits, setAllHabits] = useState<Record<string, DailyHabits>>({});

  useEffect(() => {
    const pattern = /^nutriwise_habits_(.*)$/;
    const loaded: Record<string, DailyHabits> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const match = key.match(pattern);
      if (match) {
        loaded[match[1]] = JSON.parse(localStorage.getItem(key) || '{}');
      }
    }
    setAllHabits(loaded);
  }, []);

  const toggleHabit = useCallback((habitKey: keyof DailyHabits, dateStr: string) => {
    setAllHabits(prev => {
      const current = prev[dateStr] || { ...defaultHabits };
      const updated = { ...current, [habitKey]: !current[habitKey] };
      localStorage.setItem(`nutriwise_habits_${dateStr}`, JSON.stringify(updated));
      return { ...prev, [dateStr]: updated };
    });
  }, []);

  const getHabitsForDate = useCallback((dateStr: string) => {
    return allHabits[dateStr] || { ...defaultHabits };
  }, [allHabits]);

  const todayStr = getTodayStr();
  const todayHabits = allHabits[todayStr] || { ...defaultHabits };

  const value = useMemo(() => ({
    todayHabits,
    allHabits,
    toggleHabit,
    getHabitsForDate
  }), [todayHabits, allHabits, toggleHabit, getHabitsForDate]);

  return <HabitContext.Provider value={value}>{children}</HabitContext.Provider>;
};

export const useHabit = () => {
  const context = useContext(HabitContext);
  if (!context) throw new Error('useHabit must be used within HabitProvider');
  return context;
};
