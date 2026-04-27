import React, { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { FoodItem } from '../data/foodDatabase';

export interface MealEntry {
  id: string;
  food: Partial<FoodItem>;
  quantity: number;
  mealType: string;
  timestamp: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

interface MealLogContextType {
  todayLog: MealEntry[];
  allLogs: Record<string, MealEntry[]>;
  waterLog: Record<string, number>;
  addMeal: (entry: MealEntry) => void;
  removeMeal: (id: string, dateStr: string) => void;
  getLogForDate: (dateStr: string) => MealEntry[];
  setWaterGlasses: (dateStr: string, count: number) => void;
  getWaterGlasses: (dateStr: string) => number;
  streak: number;
  todayCalories: number;
  todayProtein: number;
  todayCarbs: number;
  todayFat: number;
}

const MealLogContext = createContext<MealLogContextType | undefined>(undefined);

const getTodayStr = () => new Date().toISOString().split('T')[0];

export const MealLogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allLogs, setAllLogs] = useState<Record<string, MealEntry[]>>({});
  const [waterLog, setWaterLog] = useState<Record<string, number>>({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Load all logs from localStorage
    const logsPattern = /^nutriwise_log_(.*)$/;
    const wPattern = /^nutriwise_water_(.*)$/;
    const loadedLogs: Record<string, MealEntry[]> = {};
    const loadedWater: Record<string, number> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      const mMatch = key.match(logsPattern);
      if (mMatch) {
        loadedLogs[mMatch[1]] = JSON.parse(localStorage.getItem(key) || '[]');
      }
      const wMatch = key.match(wPattern);
      if (wMatch) {
        loadedWater[wMatch[1]] = parseInt(localStorage.getItem(key) || '0', 10);
      }
    }
    setAllLogs(loadedLogs);
    setWaterLog(loadedWater);
    setInitialized(true);
  }, []);

  const addMeal = useCallback((entry: MealEntry) => {
    const today = getTodayStr();
    setAllLogs(prev => {
      const current = prev[today] || [];
      const updated = [...current, entry];
      localStorage.setItem(`nutriwise_log_${today}`, JSON.stringify(updated));
      return { ...prev, [today]: updated };
    });
  }, []);

  const removeMeal = useCallback((id: string, dateStr: string) => {
    setAllLogs(prev => {
      const current = prev[dateStr] || [];
      const updated = current.filter(e => e.id !== id);
      localStorage.setItem(`nutriwise_log_${dateStr}`, JSON.stringify(updated));
      return { ...prev, [dateStr]: updated };
    });
  }, []);

  const getLogForDate = useCallback((dateStr: string) => {
    return allLogs[dateStr] || [];
  }, [allLogs]);

  const setWaterGlasses = useCallback((dateStr: string, count: number) => {
    setWaterLog(prev => {
      localStorage.setItem(`nutriwise_water_${dateStr}`, count.toString());
      return { ...prev, [dateStr]: count };
    });
  }, []);

  const getWaterGlasses = useCallback((dateStr: string) => {
    return waterLog[dateStr] || 0;
  }, [waterLog]);

  const streak = useMemo(() => {
    if (!initialized) return 0;
    let s = 0;
    const date = new Date();
    while (true) {
      const dStr = date.toISOString().split('T')[0];
      if (allLogs[dStr] && allLogs[dStr].length > 0) {
        s++;
        date.setDate(date.getDate() - 1);
      } else if (dStr === getTodayStr() && s === 0) {
        // if today is empty, check yesterday
        date.setDate(date.getDate() - 1);
        const yStr = date.toISOString().split('T')[0];
        if (allLogs[yStr] && allLogs[yStr].length > 0) {
           // streak continues, but don't count today
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return s;
  }, [allLogs, initialized]);

  const todayStr = getTodayStr();
  const todayLog = allLogs[todayStr] || [];

  const todayCalories = useMemo(() => todayLog.reduce((sum, item) => sum + item.totalCalories, 0), [todayLog]);
  const todayProtein = useMemo(() => todayLog.reduce((sum, item) => sum + item.totalProtein, 0), [todayLog]);
  const todayCarbs = useMemo(() => todayLog.reduce((sum, item) => sum + item.totalCarbs, 0), [todayLog]);
  const todayFat = useMemo(() => todayLog.reduce((sum, item) => sum + item.totalFat, 0), [todayLog]);

  const value = useMemo(() => ({
    todayLog,
    allLogs,
    waterLog,
    addMeal,
    removeMeal,
    getLogForDate,
    setWaterGlasses,
    getWaterGlasses,
    streak,
    todayCalories,
    todayProtein,
    todayCarbs,
    todayFat
  }), [todayLog, allLogs, waterLog, addMeal, removeMeal, getLogForDate, setWaterGlasses, getWaterGlasses, streak, todayCalories, todayProtein, todayCarbs, todayFat]);

  return <MealLogContext.Provider value={value}>{children}</MealLogContext.Provider>;
};

export const useMealLog = () => {
  const context = useContext(MealLogContext);
  if (!context) throw new Error('useMealLog must be used within MealLogProvider');
  return context;
};
